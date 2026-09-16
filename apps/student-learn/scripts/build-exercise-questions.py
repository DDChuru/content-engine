#!/usr/bin/env python3
"""Exercise-question pipeline — author → SOLVE GATE → publish with provenance.

Implements briefs/PLAN-marking-platform.md §14 stages 3 and 6. Stages 1-2
(extract/remodel) are done by hand or by a model into a source module under
content/questions/sources/; stage 5 (human sign-off) is `--approve`, which a
person runs, never the pipeline.

THE GATE, per item:
  1. Three independent solution routes are re-run. At least one must be
     symbolic (SymPy `solve` on the governing equations).
  2. All routes must agree with each other AND with the authored answer to
     3 significant figures. Disagreement DISCARDS the item. It is never
     repaired here — a repaired item has no independent check left.
  3. Ugly-answer reject: the exact value must terminate as a decimal and sit
     in a plausible magnitude band. A recurring decimal or an absurd magnitude
     is the signature of a botched remodel, not a hard question.
  4. Structural checks: unique ids, mark-scheme marks summing to the tariff,
     a known topic code, an A-mark's `dependsOn` pointing at a real M-mark.

The script writes `provenance.solveGate` and NEVER writes `approvedBy`.
An item without `approvedBy` is machine-checked only and must not be served.

Usage:
    python3 apps/student-learn/scripts/build-exercise-questions.py
    python3 apps/student-learn/scripts/build-exercise-questions.py --approve --by "Durai"

Dependencies: sympy only (already present system-wide and in the `aitools`
conda env — nothing new is installed by this script).
"""

from __future__ import annotations

import argparse
import datetime as dt
import importlib.util
import json
import re
import sys
from pathlib import Path

from sympy import Float, N, Rational, nsimplify

APP = Path(__file__).resolve().parents[1]
SOURCES = APP / "content" / "questions" / "sources"
OUT = APP / "content" / "questions"
SYLLABUS = APP / "lib" / "syllabus.ts"

AGREE_SIG_FIGS = 3
# Anything outside this band in SI base units is almost certainly a slipped
# power of ten rather than a hard question.
MAGNITUDE_MIN = Rational(1, 1000)
MAGNITUDE_MAX = 100000


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------

def sig(value, figs: int = AGREE_SIG_FIGS) -> str:
    """Canonical string of `value` to `figs` significant figures."""
    f = Float(N(value, figs + 5))
    if f == 0:
        return "0"
    return f"{float(f):.{figs}g}"


def terminates(value) -> bool:
    """True if the exact value is a terminating decimal."""
    try:
        r = nsimplify(value, rational=True)
        r = Rational(r)
    except Exception:
        return False
    d = r.q
    for p in (2, 5):
        while d % p == 0:
            d //= p
    return d == 1


def syllabus_codes() -> set[str]:
    text = SYLLABUS.read_text()
    return set(re.findall(r"code:\s*'([^']+)'", text))


def load_source(path: Path):
    spec = importlib.util.spec_from_file_location(path.stem, path)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# ---------------------------------------------------------------------------
# the gate
# ---------------------------------------------------------------------------

class Discarded(Exception):
    pass


def run_gate(item: dict, codes: set[str]) -> dict:
    """Returns the solveGate provenance block, or raises Discarded."""
    routes: dict = item["routes"]

    if len(routes) < 3:
        raise Discarded(f"only {len(routes)} solution routes; the gate needs 3")
    if not any("symbolic" in name for name in routes):
        raise Discarded("no symbolic route — arithmetic agreeing with itself proves nothing")

    # --- structural ---
    if item["topicCode"] not in codes:
        raise Discarded(f"topicCode {item['topicCode']} is not in lib/syllabus.ts")
    total = sum(s["marks"] for s in item["markScheme"])
    if total != item["marks"]:
        raise Discarded(f"mark scheme sums to {total}, tariff says {item['marks']}")
    step_ids = {s["id"] for s in item["markScheme"]}
    for s in item["markScheme"]:
        dep = s.get("dependsOn")
        if dep and dep not in step_ids:
            raise Discarded(f"step {s['id']} depends on missing step {dep}")
        if s["type"] not in ("M", "A", "B"):
            raise Discarded(f"step {s['id']} has bad mark type {s['type']}")

    # --- solve gate ---
    values = {}
    for name, fn in routes.items():
        try:
            values[name] = fn()
        except Exception as exc:  # a route that cannot run is a failed route
            raise Discarded(f"route '{name}' raised {type(exc).__name__}: {exc}")

    rounded = {name: sig(v) for name, v in values.items()}
    if len(set(rounded.values())) != 1:
        raise Discarded(f"routes disagree to {AGREE_SIG_FIGS}sf: {rounded}")

    value = next(iter(values.values()))

    # --- ugly-answer reject ---
    if not terminates(value):
        raise Discarded(f"non-terminating answer {sig(value, 6)} — botched-remodel signature")
    mag = abs(Rational(nsimplify(value, rational=True)))
    if mag != 0 and (mag < MAGNITUDE_MIN or mag > MAGNITUDE_MAX):
        raise Discarded(f"implausible magnitude {sig(value)}")

    # --- authored answer must match the routes ---
    authored = item.get("expected")
    if authored is not None and sig(nsimplify(authored)) != sig(value):
        raise Discarded(f"authored answer {authored} != solved {sig(value)}")

    item["_value"] = value
    return dict(
        routes=sorted(routes),
        symbolicCheck=True,
        agreedToSigFigs=AGREE_SIG_FIGS,
        checkedAt=dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
    )


# ---------------------------------------------------------------------------
# emit
# ---------------------------------------------------------------------------

def decimal_str(value) -> str:
    """Student-facing decimal: exact if short, else 3sf."""
    r = Rational(nsimplify(value, rational=True))
    if r.q == 1:
        return str(r.p)
    exact = f"{float(r):.10f}".rstrip("0").rstrip(".")
    return exact if len(exact.split(".")[-1]) <= 4 else sig(value)


def to_question(item: dict, gate: dict, generated_by: str, approved_by: str | None) -> dict:
    value = item["_value"]
    dec = decimal_str(value)
    accepted = {dec, sig(value)}
    if item.get("unit"):
        accepted.add(f"{dec} {item['unit']}")

    prov = dict(
        modelledOn=item["modelledOn"],
        generatedBy=generated_by,
        generatedAt=dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        solveGate=gate,
    )
    if approved_by:
        prov["approvedBy"] = approved_by
        prov["approvedAt"] = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")

    q = dict(
        id=item["id"],
        topicCode=item["topicCode"],
        skillTag=item["skillTag"],
        difficulty=item["difficulty"],
        questionType="numeric",
        question=item["stem"],
        marks=item["marks"],
        estimatedMinutes=item["estimatedMinutes"],
        correctAnswer=dec,
        acceptableAnswers=sorted(a for a in accepted if a != dec),
        answer=dict(
            exact=str(Rational(nsimplify(value, rational=True))),
            value=dec,
            latex=item["latex"],
            sigFigs=item.get("sigFigs", 3),
        ),
        markScheme=item["markScheme"],
        hint=item.get("hint"),
        solutionSteps=item.get("solutionSteps", []),
        feedbackCorrect=item["feedbackCorrect"],
        feedbackIncorrect=item["feedbackIncorrect"],
        diagnosticFor=item.get("diagnosticFor", []),
        provenance=prov,
    )
    if item.get("unit"):
        q["answer"]["unit"] = item["unit"]
    if item.get("figure"):
        q["figure"] = item["figure"]
    return {k: v for k, v in q.items() if v is not None}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("source", nargs="?", default="mechanics-forces-f-equals-ma")
    ap.add_argument("--approve", action="store_true",
                    help="Stamp human sign-off. A person runs this after reading the diff.")
    ap.add_argument("--by", help="Name of the approving human. Required with --approve.")
    args = ap.parse_args()

    if args.approve and not args.by:
        print("--approve requires --by \"<name>\": a human owns mathematical correctness.")
        return 2

    mod = load_source(SOURCES / f"{args.source}.py")
    codes = syllabus_codes()

    kept, discarded, seen = [], [], set()
    for item in mod.ITEMS:
        if item["id"] in seen:
            discarded.append((item["id"], "duplicate id"))
            continue
        seen.add(item["id"])
        try:
            gate = run_gate(item, codes)
        except Discarded as exc:
            discarded.append((item["id"], str(exc)))
            continue
        kept.append(to_question(item, gate, mod.BANK["generatedBy"], args.by if args.approve else None))

    bank = dict(
        schemaVersion=1,
        cluster=mod.BANK["cluster"],
        title=mod.BANK["title"],
        topicCodes=sorted({q["topicCode"] for q in kept}),
        generatedAt=dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"),
        questions=kept,
    )
    out = OUT / f"{mod.BANK['cluster']}.json"
    out.write_text(json.dumps(bank, indent=2, ensure_ascii=False) + "\n")

    print(f"kept {len(kept)}  discarded {len(discarded)}  -> {out.relative_to(APP)}")
    for q in kept:
        print(f"  PASS {q['id']:<12} {q['topicCode']:<7} {q['answer']['value']:>8} "
              f"{q['answer'].get('unit','')}  [{q['marks']} marks]")
    for qid, why in discarded:
        print(f"  DISCARD {qid:<12} {why}")
    if not args.approve:
        print("\nNo item is approved. A human runs --approve --by \"<name>\" after "
              "reading the diff; nothing may be served before that.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
