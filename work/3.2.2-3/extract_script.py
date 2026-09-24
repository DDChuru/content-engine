"""STORYBOARD.md -> script.json. Narration is frozen: text is copied verbatim; bracketed
hold directions are removed from the spoken text and recorded as holds (inserted later as
digital silence, never as speech)."""
from pathlib import Path
import json,re
P=Path(__file__).resolve().parent
md=(P/'STORYBOARD.md').read_text()
beats=[]
for m in re.finditer(r'### BEAT (\d+) · ([^\n]+)\n\*\*Narration:\*\*\n((?:>[^\n]*\n)+)',md):
    bid=int(m[1]);lines=[l[1:].strip() for l in m[3].splitlines()]
    paras=[];holds=[];pending=None
    for l in lines:
        if not l: continue
        h=re.fullmatch(r'\*\((silent read|anchored read), ([^)]*)\)\*',l)
        if h: pending=h[1];continue
        if pending: holds.append({'kind':pending,'before':' '.join(l.split()[:4])});pending=None
        paras.append(l)
    text=' '.join(paras)
    beats.append(dict(id=bid,heading=m[2].strip(),text=text,paragraphs=paras,words=len(text.split()),holds=holds))
assert [b['id'] for b in beats]==list(range(1,18)),[b['id'] for b in beats]
(P/'script.json').write_text(json.dumps(beats,ensure_ascii=False,indent=2)+'\n')
for b in beats: print(b['id'],b['words'],b['holds'])
print('total words',sum(b['words'] for b in beats),'chars',sum(len(b['text']) for b in beats))
