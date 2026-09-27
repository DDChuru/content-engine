#!/usr/bin/env python3
"""Validate a Topic 4 storyboard (cloud run 006).

Usage: python3 work/006/validate_storyboard.py storyboards/topic-04/<code>/STORYBOARD.md [...]

Per beat (### BEAT n · Title · window):
  - narration = the blockquoted lines after **Narration:**, silent-read lines excluded
  - cues      = italic strings in the visual actions introduced by "At *…*", "at *…*",
                "Entry cue: *…*" or "Exit cue: end of *…*"
  - every cue must be an exact substring of the narration, unique within it, and in
    spoken order; the longest stretch of narration without a cue (start → first cue,
    cue → cue, last cue → end) must be <= 30 words
  - error beats (title contains COMMON MISTAKE or EXAM CONTRAST) must run 65–75 s at
    120 wpm (130–150 words; the 3–4 s silent read is inside the effective rate) and must
    contain a silent-read line
Whole file:
  - forbidden narration phrases (Topic 4 traps and the 4.2.6 exclusion)
  - every beat has a **Visual action** block whose first item states which model or
    apparatus is on screen "from the first frame" (or "from the beat's first frame")
  - required sections present; citations table rows with exam references carry PDF-UNCHECKED or PDF-CHECKED (plan check)
Runtime = words / 120 min.
"""
import re
import sys

WPM = 120
MAX_GAP = 30
ERR_MIN, ERR_MAX = 130, 150

FORBIDDEN = [
    (r"concentration of water", "use water potential, not 'concentration of water'"),
    (r"water concentration", "use water potential, not 'water concentration'"),
    (r"solute potential", "4.2.6: solute potential is not expected"),
    (r"pressure potential", "4.2.6: pressure potential is not expected"),
    (r"ψ\s*[sp]\b", "4.2.6: ψs/ψp not expected"),
    (r"\bL\d+[ab]?\b", "refer to lessons by syllabus code, never 'L1'"),
]
REQUIRED_SECTIONS = [
    "## The causal spine", "## The models", "## Beat by beat", "## Scope ledger",
    "## Datasets", "## Real-world samples", "## Citations", "## Word count and runtime",
    "## Plan interpretations", "## Validator run",
]

CUE_RE = re.compile(r"(?:(?<![A-Za-z])[Aa]t |Entry cue: |Exit cue: end of )\*([^*]+)\*")


def norm(s):
    s = s.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    s = s.replace("—", "-").replace("–", "-")
    return re.sub(r"\s+", " ", s).strip()


def words(s):
    return re.findall(r"[A-Za-z0-9][A-Za-z0-9'’.\-]*", s)


def split_beats(text):
    parts = re.split(r"^### BEAT ", text, flags=re.M)
    beats = []
    for p in parts[1:]:
        head, _, body = p.partition("\n")
        m = re.match(r"(\d+)\s*·\s*(.*?)\s*(?:·\s*([\d:–-]+))?\s*$", head.strip())
        if not m:
            beats.append((head.strip(), head.strip(), body))
            continue
        # stop body at next level-2 heading
        body = re.split(r"^## ", body, flags=re.M)[0]
        beats.append((m.group(1), m.group(2), body))
    return beats


def narration_of(body):
    m = re.search(r"\*\*Narration:\*\*\s*\n(.*?)(?:\n\*\*Visual action|\Z)", body, flags=re.S)
    if not m:
        return None, False
    lines = []
    silent = False
    for ln in m.group(1).splitlines():
        ln = ln.strip()
        if not ln.startswith(">"):
            continue
        t = ln.lstrip(">").strip()
        if re.match(r"^\*?\(silent read", t, flags=re.I):
            silent = True
            continue
        if t:
            lines.append(t)
    return " ".join(lines), silent


def visual_of(body):
    m = re.search(r"\*\*Visual action[^\n]*\n?(.*?)(?:\n\*\*On-screen text|\n---|\Z)", body, flags=re.S)
    if not m:
        return None
    # include the rest of the header line (some storyboards put an intro sentence there)
    head = re.search(r"\*\*Visual action[^\n]*", body)
    return (head.group(0) if head else "") + "\n" + m.group(1)


def check_beat(num, title, body):
    problems = []
    narr, silent = narration_of(body)
    if narr is None:
        return 0, 0, 0, ["no narration block"]
    vis = visual_of(body)
    if vis is None:
        return len(words(narr)), 0, 0, ["no visual action block"]
    n = norm(narr)
    nw = len(words(narr))
    cues = [norm(c) for c in CUE_RE.findall(vis)]
    positions = []
    last = -1
    for c in cues:
        cnt = n.count(c)
        if cnt == 0:
            problems.append(f"cue not in narration: '{c}'")
            continue
        if cnt > 1:
            problems.append(f"cue not unique: '{c}' ({cnt}x)")
        pos = n.find(c)
        if pos < last:
            problems.append(f"cue out of order: '{c}'")
        last = max(last, pos)
        positions.append(pos)
    # gaps in words
    idx = sorted(set(positions))
    marks = [0] + [len(words(n[:p])) for p in idx] + [nw]
    maxgap = max((b - a) for a, b in zip(marks, marks[1:])) if len(marks) > 1 else nw
    if maxgap > MAX_GAP:
        problems.append(f"{maxgap} words without a cue (max {MAX_GAP})")
    is_err = bool(re.search(r"COMMON MISTAKE|EXAM CONTRAST", title))
    if is_err:
        if not (ERR_MIN <= nw <= ERR_MAX):
            problems.append(f"error beat {nw} words = {nw * 60 / WPM:.1f} s (need 65–75 s)")
        if not silent:
            problems.append("error beat has no silent-read line")
    first_item = vis.strip().splitlines()
    first_txt = " ".join(first_item[:3]).lower()
    if not re.search(r"from the (?:beat's )?first frame", first_txt):
        problems.append("first visual item must say what model/apparatus is on screen 'from the first frame' (no text-only frames)")
    for pat, why in FORBIDDEN:
        if re.search(pat, narr, flags=re.I):
            problems.append(f"forbidden in narration: {why}")
    return nw, len(cues), maxgap, problems


def main(paths):
    grand_fail = 0
    for path in paths:
        text = open(path, encoding="utf-8").read()
        print(f"== {path}")
        for sec in REQUIRED_SECTIONS:
            if sec not in text:
                print(f"   MISSING SECTION: {sec}")
                grand_fail += 1
        cit = re.split(r"^## Citations", text, flags=re.M)
        if len(cit) > 1:
            block = re.split(r"^## ", cit[1], flags=re.M)[0]
            for row in block.splitlines():
                if row.startswith("|") and re.search(r"\b[swm]\d\d_\d\d\b|ER\b|R2[34]|MS PDF", row) and "PDF-UNCHECKED" not in row and "PDF-CHECKED" not in row:
                    print(f"   CITATION ROW WITHOUT PDF-UNCHECKED/PDF-CHECKED TAG: {row[:90]}")
                    grand_fail += 1
        print("beat  words  cues maxgap  status")
        tw = tc = fails = 0
        for num, title, body in split_beats(text):
            nw, nc, mg, probs = check_beat(num, title, body)
            tw += nw
            tc += nc
            status = "ok" if not probs else "FAIL: " + "; ".join(probs)
            if probs:
                fails += 1
            print(f"{num:>4} {nw:>6} {nc:>5} {mg:>6}  {status}")
        secs = tw * 60 / WPM
        print(f"TOTAL words {tw}  cues {tc}  runtime at {WPM} wpm {int(secs // 60)}:{secs % 60:04.1f}  "
              f"beats {len(split_beats(text))}  failing beats {fails}")
        grand_fail += fails
    return 1 if grand_fail else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
