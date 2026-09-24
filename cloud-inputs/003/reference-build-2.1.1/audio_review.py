"""Transcript vs frozen text, per beat: every difference listed for human judgement."""
from pathlib import Path
import json,re,difflib
P=Path(__file__).resolve().parent
norm=lambda s:re.findall(r"[a-z0-9]+",s.lower().replace('’',"'").replace("'",''))
rows=[]
for b in json.loads((P/'script.json').read_text()):
    stem=P/'audio'/f"beat-{b['id']:02d}";ws=json.loads(stem.with_suffix('.words.json').read_text())['words']
    m=json.loads(stem.with_suffix('.measure.json').read_text())
    src=norm(b['text']);obs=[t for w in ws for t in norm(w['word'])]
    sm=difflib.SequenceMatcher(None,src,obs,autojunk=False)
    d=[(op,' '.join(src[i:j]),' '.join(obs[k:l])) for op,i,j,k,l in sm.get_opcodes() if op!='equal']
    low=[(w['word'],round(w['probability'],2)) for w in ws if w['probability']<.5]
    rows.append(dict(beat=b['id'],seconds=m['seconds'],wpm=m['wpm'],matched=sum(x.size for x in sm.get_matching_blocks()),src=len(src),diffs=d,lowConfidence=low))
    print(b['id'],f"{m['seconds']:.2f}s",f"{sum(x.size for x in sm.get_matching_blocks())}/{len(src)}",d,low)
(P/'qa/transcript-review.json').write_text(json.dumps(rows,indent=1))
