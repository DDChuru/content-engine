#!/usr/bin/env python3
"""Storyboard validator for Topic 3 (cloud run 005).

Usage: python3 validate_storyboard.py STORYBOARD.md [--gap 30]

Per beat (headings '### BEAT n ...'):
  * narration = blockquote lines between '**Narration:**' and '**Visual action:**',
    excluding silent-read lines such as '*(silent read, 4 s)*';
  * words = whitespace tokens containing a letter or digit (hyphen/en-dash compounds = 1);
  * cues = italic strings introduced by 'At *…*', 'at *…*', 'cue: *…*' or 'end of *…*'
    anywhere in the beat's Visual action block;
  * each cue must occur EXACTLY (case-sensitive) in the narration, occur ONCE
    (case-insensitive count), and cue start positions must be non-decreasing in the
    order the cues are listed;
  * gaps = words from narration start to first cue, between successive cue starts, and
    from last cue start to narration end; any gap > --gap words fails the beat.
Runtime = total words / 120 wpm.
"""
import re, sys

def words_of(text):
    return [t for t in text.split() if re.search(r"[A-Za-z0-9]", t)]

def parse(path):
    lines = open(path, encoding="utf-8").read().split("\n")
    beats, cur, mode = [], None, None
    for ln in lines:
        m = re.match(r"^###\s+BEAT\s+(\w+)", ln)
        if m:
            cur = {"id": m.group(1), "title": ln, "narr": [], "vis": []}
            beats.append(cur); mode = None; continue
        if cur is None:
            continue
        if re.match(r"^##\s", ln):          # a level-2 heading ends the beats
            cur = None; continue
        if ln.startswith("**Narration"):
            mode = "narr"; continue
        if ln.startswith("**Visual action"):
            mode = "vis"
            rest = ln.split(":**", 1)[1] if ":**" in ln else ""
            cur["vis"].append(rest); continue
        if ln.startswith("**On-screen text") or ln.startswith("---"):
            mode = None if ln.startswith("---") else mode
        if mode == "narr" and ln.startswith(">"):
            body = ln[1:].strip()
            if re.match(r"^\*\(silent", body) or not body:
                continue
            cur["narr"].append(body)
        elif mode == "vis":
            cur["vis"].append(ln)
    return beats

CUE_RE = re.compile(r"(?:\b[Aa]t|[Cc]ue:|end of)\s+\*([^*]+)\*")

def check(beat, gap_limit):
    narr = " ".join(beat["narr"])
    narr = re.sub(r"\s+", " ", narr).strip()
    words = words_of(narr)
    vis = "\n".join(beat["vis"])
    cues = [c.strip() for c in CUE_RE.findall(vis)]
    problems, starts = [], []
    low = narr.lower()
    for c in cues:
        idx = narr.find(c)
        if idx < 0:
            problems.append(f"MISSING cue '{c}'"); continue
        n = low.count(c.lower())
        if n > 1:
            problems.append(f"REPEATED cue '{c}' ({n}x, case-insensitive)")
        starts.append((len(words_of(narr[:idx])), c))
    order_ok = True
    for (a, ca), (b, cb) in zip(starts, starts[1:]):
        if b < a:
            order_ok = False
            problems.append(f"OUT OF ORDER '{cb}' before '{ca}'")
    pos = sorted(p for p, _ in starts)
    pts = [0] + pos + [len(words)]
    gaps = [b - a for a, b in zip(pts, pts[1:])]
    maxgap = max(gaps) if gaps else len(words)
    if maxgap > gap_limit:
        # locate the gap for the report
        i = gaps.index(maxgap)
        problems.append(f"GAP {maxgap} words after word {pts[i]}")
    if not words:
        problems.append("NO NARRATION")
    return len(words), len(cues), maxgap, problems

def main():
    path = sys.argv[1]
    gap = 30
    if "--gap" in sys.argv:
        gap = int(sys.argv[sys.argv.index("--gap") + 1])
    beats = parse(path)
    tw = tc = fail = 0
    print("beat  words  cues maxgap  status")
    for b in beats:
        w, c, g, p = check(b, gap)
        tw += w; tc += c
        st = "ok" if not p else "FAIL"
        if p: fail += 1
        print(f"{b['id']:>4} {w:>6} {c:>5} {g:>6}  {st}")
        for x in p:
            print(f"        - {x}")
    secs = tw / 120 * 60
    print(f"TOTAL words {tw}  cues {tc}  runtime at 120 wpm {int(secs//60)}:{secs%60:04.1f}  "
          f"beats {len(beats)}  failing beats {fail}")
    sys.exit(1 if fail else 0)

if __name__ == "__main__":
    main()
