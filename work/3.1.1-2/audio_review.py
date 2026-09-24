"""Transcript vs frozen text, per beat: every difference listed for human judgement, plus a watch-list
of terms the voice is known to mangle. Writes qa/transcript-review.json."""
from pathlib import Path
import json,re,difflib
P=Path(__file__).resolve().parent
norm=lambda s:re.findall(r"[a-z0-9]+",s.lower().replace('’',"'").replace("'",''))
WATCH=['catalase','amylase','lipase','lysozyme','peptidoglycan','laccase','intracellular','extracellular','induced','activation','glycosidic','maltose','exocellular','catalyse','catalyses','monolignols','polypeptide','specificity','complementary','glycogen','synthase']
rows=[]
for b in json.loads((P/'script.json').read_text()):
    stem=P/'audio'/f"beat-{b['id']:02d}";wp=stem.with_suffix('.words.json')
    if not wp.exists(): continue
    ws=json.loads(wp.read_text())['words'];m=json.loads(stem.with_suffix('.measure.json').read_text())
    src=norm(b['text']);obs=[t for w in ws for t in norm(w['word'])]
    sm=difflib.SequenceMatcher(None,src,obs,autojunk=False)
    d=[(op,' '.join(src[i:j]),' '.join(obs[k:l])) for op,i,j,k,l in sm.get_opcodes() if op!='equal']
    low=[(w['word'],round(w['probability'],2),round(w['start'],2)) for w in ws if w['probability']<.5]
    watch={t:(src.count(t),obs.count(t)) for t in WATCH if t in src}
    rows.append(dict(beat=b['id'],seconds=m['seconds'],wpm=round(m['wpm'],1),matched=sum(x.size for x in sm.get_matching_blocks()),src=len(src),diffs=d,lowConfidence=low,watch=watch))
    print(b['id'],f"{m['seconds']:.2f}s",f"{rows[-1]['matched']}/{len(src)}",d,low,{k:v for k,v in watch.items() if v[0]!=v[1]})
(P/'qa/transcript-review.json').write_text(json.dumps(rows,indent=1,ensure_ascii=False))
