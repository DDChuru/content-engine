"""Insert DIGITAL SILENCE only; speech samples are retained byte for byte.
B11: the 5 s anchored read after "Read it." (before "The mark scheme credits"), and a 2 s final hold
(END) for the held closing frame. No other holds in this lesson (no error beats, no silent reads)."""
from pathlib import Path
import json,re,difflib,wave
P=Path(__file__).resolve().parent
S=json.loads((P/'script.json').read_text())
H={b['id']:[(h['before'],h['seconds']) for h in b['holds']] for b in S}
H[14]=H.get(14,[])+[('END',2.0)]   # Beat 14: final frame held 2 s; silent reads (4 s) in beats 10 and 12 come from the storyboard
norm=lambda s:re.findall(r'[a-z0-9]+',s.lower().replace('’',"'").replace("'",''))

# Recogniser spellings → storyboard spellings (numerals spelled out; US → UK). Heard tokens only; never the script.
_ONES='zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split()
_TENS='_ _ twenty thirty forty fifty sixty seventy eighty ninety'.split()
def _spell(t):
    if t.isdigit() and int(t)<100:
        n=int(t);return [_ONES[n]] if n<20 else [_TENS[n//10]]+([_ONES[n%10]] if n%10 else [])
    return {'meters':['metres'],'color':['colour'],'fibers':['fibres'],'fiber':['fibre'],'g1':['g','one'],'g2':['g','two']}.get(t,[t])
heard=lambda s:[x for t in norm(s) for x in _spell(t)]
reports=[]
for b in S:
    stem=P/'audio'/f"beat-{b['id']:02d}";wdata=json.loads(stem.with_suffix('.words.json').read_text());ws=wdata['words']
    src=norm(b['text']);obs=[];owners=[]
    for j,w in enumerate(ws):
        for t in heard(w['word']):obs.append(t);owners.append(j)
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
