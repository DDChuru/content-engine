"""Timeline from MEASURED audio. Integer frames (1600 samples/frame at 48 kHz, 30 fps).
Cue phrases are exact narration substrings, unique in their beat and in order. '^' inside a phrase marks
the trigger word; a trailing '$' triggers at the END of the phrase's last word (exit cues)."""
from pathlib import Path
import json,re,difflib,math,wave,sys
sys.path.insert(0,str(Path(__file__).resolve().parent))
from cue_plan import PLANS
P=Path(__file__).resolve().parent
norm=lambda s:re.findall(r"[a-z0-9^]+",s.lower().replace('’',"'").replace("'",''))
script=json.loads((P/'script.json').read_text());scenes=[];allc=[];audit=[];sample_cursor=0
for b in script:
    stem=P/'audio'/f"beat-{b['id']:02d}";mp=stem.with_suffix('.timed.measure.json');wp=stem.with_suffix('.timed.words.json')
    m=json.loads(mp.read_text());words=json.loads(wp.read_text())['words']
    src=[t for t in norm(b['text']) if t!='^'];obs=[];obsw=[]
    for w in words:
        for tok in norm(w['word']):obs.append(tok);obsw.append(w)
    sm=difflib.SequenceMatcher(None,src,obs,autojunk=False);mapping={}
    for block in sm.get_matching_blocks():
        for k in range(block.size):mapping[block.a+k]=block.b+k
    diffs=[{'op':op,'script':' '.join(src[i:j]),'heard':' '.join(obs[k:l])} for op,i,j,k,l in sm.get_opcodes() if op!='equal']
    cues=[];lastindex=0;caption=''
    for n,(phrase,key,cap) in enumerate(PLANS[b['id']]):
        atend=phrase.endswith('$');phrase=phrase.rstrip('$')
        raw=norm(phrase.replace('^',' ^'));trig=0;k=0
        for t in raw:
            if t=='^' or t.startswith('^'): trig=k
            if t!='^': k+=1
        ts=[t.lstrip('^') for t in raw if t!='^']
        allm=[i for i in range(len(src)-len(ts)+1) if src[i:i+len(ts)]==ts]
        if len(allm)!=1: raise ValueError(f"Beat {b['id']}: phrase must occur exactly once ({len(allm)}): {phrase}")
        ix=allm[0]
        if ix<lastindex: raise ValueError(f"Beat {b['id']}: phrase out of order: {phrase}")
        lastindex=ix+1
        if atend:
            candidate=next((j for j in range(ix+len(ts)-1,ix-1,-1) if j in mapping),None)
        else:
            candidate=next((j for j in range(ix+trig,ix+len(ts)) if j in mapping),None)
        if candidate is None: raise ValueError(f"Beat {b['id']}: no recognized trigger token for {phrase}")
        w=obsw[mapping[candidate]];ct=max(0,w['end'] if atend else w['start'])
        if cap: caption=cap
        cue={'id':f"B{b['id']:02d}C{n+1:02d}",'beat':b['id'],'phrase':phrase.replace('^',''),'key':key,'trigger':w['word'],'wordStart':w['start'],'atEnd':atend,'localTime':round(ct,6),'time':round(sample_cursor/48000+ct,6),'caption':caption,'match':'exact-spoken-token','sourceIndex':candidate,'triggerOffset':candidate-ix}
        cues.append(cue);allc.append(cue)
    if cues[0]['localTime']>1.5: raise ValueError(f"Beat {b['id']}: first cue late {cues[0]}")
    beatframes=math.ceil((m['samples']+24000)/1600);window_samples=beatframes*1600
    scene={'id':b['id'],'heading':b['heading'],'text':b['text'],'words':b['words'],'start':sample_cursor/48000,'duration':window_samples/48000,'audioDuration':m['seconds'],'speechDuration':m['originalSeconds'],'holds':m['holds'],'startFrame':sample_cursor//1600,'frames':beatframes,'cues':cues,'audio':f"beat-{b['id']:02d}.timed.wav"}
    scenes.append(scene);sample_cursor+=window_samples
    audit.append({'beat':b['id'],'sourceWords':len(src),'recognizerTokens':len(obs),'matchedSourceTokens':len(mapping),'differences':diffs})
if '--cues-only' not in sys.argv:
    (P/'public').mkdir(exist_ok=True)
    with wave.open(str(P/'public/narration.wav'),'wb') as out:
        out.setnchannels(1);out.setsampwidth(2);out.setframerate(48000)
        for sc in scenes:
            with wave.open(str(P/'audio'/sc['audio'])) as w:
                assert w.getframerate()==48000 and w.getnchannels()==1 and w.getsampwidth()==2
                pcm=w.readframes(w.getnframes());out.writeframes(pcm)
                gap=sc['frames']*1600-len(pcm)//2;out.writeframes(b'\0\0'*gap)
frames=sample_cursor//1600+30;duration=frames/30
T={'fps':30,'width':1920,'height':1080,'durationFrames':frames,'duration':duration,'audioDuration':sample_cursor/48000,'narrationSeconds':sum(s['speechDuration'] for s in scenes),'words':sum(b['words'] for b in script),'scenes':scenes,'cues':allc}
T['wpm']=T['words']*60/T['narrationSeconds']
gaps=[]
for sc in scenes:
    points=[0]+[c['localTime'] for c in sc['cues']]+[sc['duration']]
    for a,b2 in zip(points,points[1:]):gaps.append({'beat':sc['id'],'start':a,'end':b2,'seconds':round(b2-a,3)})
D={'stateChanges':len(allc),'statesPerMinute':len(allc)*60/duration,'maxCueGap':max(g['seconds'] for g in gaps),'gapsOver15':[g for g in gaps if g['seconds']>15],'gapsOver12':[g for g in gaps if g['seconds']>12]}
(P/'qa/visual-density.json').write_text(json.dumps(D,indent=2)+'\n');(P/'qa/transcript-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
assert not D['gapsOver15'],D['gapsOver15']
(P/'timeline.json').write_text(json.dumps(T,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:T[k] for k in ['duration','narrationSeconds','words','wpm','durationFrames']}));print('cues',len(allc),'maxgap',D['maxCueGap'],'over12',[(g['beat'],g['start'],g['seconds']) for g in D['gapsOver12']])
