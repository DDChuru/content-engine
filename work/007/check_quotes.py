#!/usr/bin/env python3
"""List every double-quoted string in a storyboard and check it verbatim against the permitted sources.

Usage: python3 check_quotes.py STORYBOARD.md [--all]
Sources (cloud run 007): the Topic 5 plan and weights, the plan check's PDF-verified evidence
(work/007/VERIFIED-EVIDENCE.md), the G05 gate criteria, EXAMINER-INSIGHT, the syllabus detail, and the
current VIDEO-STRUCTURE (for quoted standard wording only).
Normalisation: whitespace collapsed; curly quotes/apostrophes and dashes unified; subscript/superscript
digits and minus signs unified; markdown emphasis and links removed. Quotes of <= 3 words are skipped (terms).
Prints NOT FOUND quotes (and with --all, found ones too). Exit status 1 if any are not found, 2 if a
source could not be read. Sources under cloud-inputs/ are read from disk, or else from their input branch
(`git show origin/cloud/inputs-NNN:<path>`, fetched on demand), so the check reproduces in a checkout of
the run branch alone.
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = [ROOT/"plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md",
       ROOT/"plan/topic-05/TOPIC-05-WEIGHTS.md",
       ROOT/"work/007/VERIFIED-EVIDENCE.md",
       ROOT/"cloud-inputs/007/evidence/GATE-CRITERIA-9700-05-MITOTIC-CELL-CYCLE.md",
       ROOT/"cloud-inputs/007/evidence/EXAMINER-INSIGHT-9700.md",
       ROOT/"cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md",
       ROOT/"cloud-inputs/007/standards-update/VIDEO-STRUCTURE.md"]
TR = str.maketrans({"‘":"'", "’":"'", "“":'"', "”":'"', "–":"-", "—":"-", "−":"-",
                    "₀":"0","₁":"1","₂":"2","₃":"3","⁰":"0","¹":"1","²":"2","³":"3","⁻":"-",
                    "½":"1/2", " ":" "})
def norm(s):
    s = s.translate(TR)
    s = re.sub(r"\*\*|__|`", "", s)
    s = re.sub(r"(?<!\w)\*(?!\s)|(?<!\s)\*(?!\w)", "", s)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)
    s = s.replace("…", "...").replace(" ... ", " ").replace("...", " ")
    return re.sub(r"\s+", " ", s).strip().lower()
import subprocess
def read_src(p):
    """Read a source file; if it is absent (cloud-inputs/ is not committed to the run branch), read it
    from its input branch with git (origin/cloud/inputs-NNN), fetching that branch once if needed."""
    if p.exists():
        return p.read_text(encoding="utf-8")
    rel = p.relative_to(ROOT).as_posix()
    m = re.match(r"cloud-inputs/(\d{3})/", rel)
    if m:
        ref = f"origin/cloud/inputs-{m.group(1)}"
        for attempt in (0, 1):
            r = subprocess.run(["git", "-C", str(ROOT), "show", f"{ref}:{rel}"], capture_output=True, text=True)
            if r.returncode == 0:
                return r.stdout
            if attempt == 0:
                subprocess.run(["git", "-C", str(ROOT), "fetch", "-q", "origin", f"cloud/inputs-{m.group(1)}"],
                               capture_output=True)
    print(f"MISSING SOURCE: {rel} (not on disk, not readable from its input branch)")
    return None
texts = [read_src(p) for p in SRC]
missing = sum(t is None for t in texts)
corpus = norm("\n".join(t for t in texts if t))
text = pathlib.Path(sys.argv[1]).read_text(encoding="utf-8")
show_all = "--all" in sys.argv
quotes = re.findall(r"“([^”]{3,}?)”|\"([^\"\n]{3,}?)\"", text)
seen, bad = set(), 0
for a, b in quotes:
    q = (a or b).strip()
    if q in seen: continue
    seen.add(q)
    if len(q.split()) <= 3: continue
    parts = [p for p in re.split(r"\s*(?:…|\.\.\.)\s*", q) if len(p.split()) >= 2]
    ok = all(norm(p).strip(" .;,:") in corpus for p in parts) if parts else True
    if not ok:
        bad += 1
        print("NOT FOUND:", q[:220])
    elif show_all:
        print("ok:", q[:120])
print(f"quotes checked {len(seen)}  not found {bad}" + (f"  MISSING SOURCES {missing}" if missing else ""))
sys.exit(1 if bad else (2 if missing else 0))
