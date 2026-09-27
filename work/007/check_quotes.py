#!/usr/bin/env python3
"""List every double-quoted string in a storyboard and check it verbatim against the permitted sources.

Usage: python3 check_quotes.py STORYBOARD.md [--all]
Sources (cloud run 007): the Topic 5 plan and weights, the G05 gate criteria, EXAMINER-INSIGHT, the
syllabus detail, and the current VIDEO-STRUCTURE (for quoted standard wording only).
Normalisation: whitespace collapsed; curly quotes/apostrophes and dashes unified; subscript/superscript
digits and minus signs unified; markdown emphasis and links removed. Quotes of <= 3 words are skipped (terms).
Prints NOT FOUND quotes (and with --all, found ones too). Exit status 1 if any are not found.
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = [ROOT/"plan/topic-05/TOPIC-PLAN-05-CELL-CYCLE.md",
       ROOT/"plan/topic-05/TOPIC-05-WEIGHTS.md",
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
corpus = norm("\n".join(p.read_text(encoding="utf-8") for p in SRC))
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
print(f"quotes checked {len(seen)}  not found {bad}")
sys.exit(1 if bad else 0)
