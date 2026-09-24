"""Insert DIGITAL SILENCE only; speech samples are retained byte for byte.
Silent reads from the storyboard (B5 3 s, B11 4 s, B14 3 s, B16 4 s) go between the last word before
the read and its first word after. B18: the 5 s anchored read at "Read it," (before "then watch the
credited"), and a 2 s final hold (END) for the held closing frame."""
from pathlib import Path
import json,re,difflib,wave
P=Path(__file__).resolve().parent
S=json.loads((P/'script.json').read_text())
H={b['id']:[(h['before'],h['seconds']) for h in b['holds']] for b in S}
H[18]=[('then watch the credited',5.0),('END',2.0)]
norm=lambda s:re.findall(r'[a-z0-9]+',s.lower().replace('’',"'").replace("'",''))
reports=[]
for b in S:
    stem=P/'audio'/f"beat-{b['id']:02d}";wdata=json.loads(stem.with_suffix('.words.json').read_text());ws=wdata['words']
    src=norm(b['text']);obs=[];owners=[]
    for j,w in enumerate(ws):
        for t in norm(w['word']):obs.append(t);owners.append(j)
    mapping={}
    for a,bb,n in difflib.SequenceMatcher(None,src,obs,autojunk=False).get_matching_blocks():
        for k in range(n):mapping[a+k]=owners[bb+k]
    with wave.open(str(stem.with_suffix('.wav'))) as f:pcm=f.readframes(f.getnframes());params=f.getparams()
    holds=[]
    for phrase,seconds in H.get(b['id'],[]):
        if phrase=='END':sample=len(pcm)//2
        else:
            ts=norm(phrase);occ=[i for i in range(len(src)) if src[i:i+len(ts)]==ts];assert len(occ)==1,(b['id'],phrase,occ);j=mapping[occ[0]]
            start=ws[j]['start'];prev=ws[j-1]['end'] if j else 0
            assert start>=prev,(phrase,prev,start)
            sample=round((prev+start)/2*48000)
        holds.append(dict(atSample=sample,samples=round(seconds*48000),seconds=seconds,before=phrase))
    out=b'';cursor=0
    for h in holds:out+=pcm[cursor*2:h['atSample']*2]+b'\0\0'*h['samples'];cursor=h['atSample']
    out+=pcm[cursor*2:]
    with wave.open(str(stem.with_suffix('.timed.wav')),'wb') as f:f.setparams(params);f.writeframes(out)
    for w in ws:
        for key in ['start','end']:
            old=w[key];w[key]=round(old+sum(h['seconds'] for h in holds if h['atSample']/48000<=old),6)
    wdata['duration']=len(out)/96000
    stem.with_suffix('.timed.words.json').write_text(json.dumps(wdata,indent=2))
    m=json.loads(stem.with_suffix('.measure.json').read_text());m.update(samples=len(out)//2,seconds=len(out)/96000,originalSeconds=m['seconds'],holds=holds)
    stem.with_suffix('.timed.measure.json').write_text(json.dumps(m,indent=2))
    reports.append({'beat':b['id'],'holds':holds,'speechUnchanged':True})
(P/'qa/holds.json').write_text(json.dumps(reports,indent=2))
print('Holds inserted without modifying any original speech sample:',[(r['beat'],[(h['before'],h['seconds']) for h in r['holds']]) for r in reports if r['holds']])
