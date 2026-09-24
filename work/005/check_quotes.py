#!/usr/bin/env python3
"""List every double-quoted string in a storyboard and check it verbatim against the verified sources.

Usage: python3 check_quotes.py STORYBOARD.md [--all]
Sources: TOPIC-PLAN-03-ENZYMES.md, TOPIC-03-WEIGHTS.md, EXAMINER-INSIGHT-9700.md, SYLLABUS-9700-DETAIL.md.
Normalisation: whitespace collapsed; curly quotes/apostrophes and dashes unified; subscript/superscript
digits and minus signs unified; markdown emphasis removed. Quotes of <= 3 words are skipped (terms).
Prints NOT FOUND quotes (and with --all, found ones too).
"""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[2]
SRC = [ROOT/"cloud-inputs/003/topic-03/TOPIC-PLAN-03-ENZYMES.md",
       ROOT/"cloud-inputs/003/topic-03/TOPIC-03-WEIGHTS.md",
       ROOT/"cloud-inputs/005/evidence/EXAMINER-INSIGHT-9700.md",
       ROOT/"cloud-inputs/003/standards/SYLLABUS-9700-DETAIL.md"]
TR = str.maketrans({"‘":"'", "’":"'", "“":'"', "”":'"', "–":"-", "—":"-", "−":"-",
                    "₀":"0","₁":"1","₂":"2","₃":"3","⁰":"0","¹":"1","²":"2","³":"3","⁻":"-",
                    "½":"1/2", " ":" "})
def norm(s):
    s = s.translate(TR)
    s = re.sub(r"\*\*|__|`", "", s)
    s = re.sub(r"(?<!\w)\*(?!\s)|(?<!\s)\*(?!\w)", "", s)
    s = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", s)   # markdown links -> text
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
