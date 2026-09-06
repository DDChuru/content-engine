#!/usr/bin/env python3
"""Audit Multiple Collisions cue, hold, contact and motion stills; no video render."""
import argparse, concurrent.futures, hashlib, json, math, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
TRANSCRIPT=ROOT/'src/remotion/public/transcripts/mechanics/multiple-collisions.json'
ARTIFACTS=ROOT/'out/MechanicsMultipleCollisions'

def audit_frames(scenes):
    frames={};holds=[];offset=0
    for s in scenes:
        def add(seconds,label):
            frame=offset+math.ceil(seconds*30)
            frames.setdefault(frame,[]).append(s['id']+':'+label)
        for key,t in s['cues'].items():add(t,key)
        for i,h in enumerate(s['holds']):
            if h['kind']!='hold':continue
            start=offset+math.ceil(h['start']*30);end=start+round(h['duration']*30)-1
            for frame in (start,end):frames.setdefault(frame,[]).append(s['id']+f':hold-{i}')
            holds.append((start,end,h['duration']))
        if s['id'] in ('s04','s06'):
            t=s['cues']['draw'];w=next(w for w in s['words'] if w['end']>=t and w['start']>=t-.08)
            frame=offset+math.floor(w['end']*30);frames.setdefault(frame,[]).append(s['id']+':setup-complete')
        if s['id']=='s03':
            for key in ('first','second'):
                add(s['cues'][key]-.06,key+'-before')
                add(s['cues'][key]+.12,key+'-flash')
                add(s['cues'][key]+.6,key+'-after')
            for a,b in [('setup','first'),('first','second'),('second','question')]:add((s['cues'][a]+s['cues'][b])/2,a+'-moving')
        if s['id']=='s05':
            add(s['cues']['rule']+4,'right-closing')
            add(s['cues']['answer']+4,'left-closing')
        if s['id']=='s06':
            add((s['cues']['closing']+s['cues']['catch'])/2,'final-approach')
            add(s['cues']['catch']+.12,'final-contact')
            add(s['duration']-.1,'end')
        offset+=math.ceil(s['duration']*30)
    return frames,holds

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle',type=Path,default=ROOT/'build')
    parser.add_argument('--output',type=Path,default=ROOT/'out/verify-collisions-stills')
    parser.add_argument('--workers',type=int,default=3)
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    scenes=json.loads(TRANSCRIPT.read_text())['scenes'];frames,holds=audit_frames(scenes)
    def verify(item):
        frame,labels=item;p=args.output/f'{frame:05d}.png';log=args.output/f'verify-{frame:05d}.log'
        for attempt in range(3):
            with log.open('w') as stream:
                result=subprocess.run(['npx','remotion','still',str(args.bundle),'MechanicsMultipleCollisions',str(p),f'--frame={frame}','--scale=0.5','--props={"audioEnabled":false,"audit":true}','--log=error'],cwd=ROOT,stdout=stream,stderr=subprocess.STDOUT)
            if result.returncode==0:break
        else:raise RuntimeError(f'Still failed: {log}')
        row=json.loads((ARTIFACTS/f'verify-collisions-{frame:05d}.json').read_text())
        assert row['frame']==frame and row['regions']<=3 and row['maxWords']<=12,row
        assert not row['overflow'] and not row['textCollisions'],row
        if any(k.endswith('setup-complete') for k in labels):assert not row['cards'] and row['regions']<=2,row
        for arrow in row['arrows']:assert abs(arrow['length']-abs(arrow['speed'])*35)<.01,row
        spheres=row['spheres']
        for a,b in zip(spheres,spheres[1:]):assert b['x']-a['x']>=a['radius']+b['radius']-.1,row
        if any(k.startswith('s03:') for k in labels):assert not row['cards'],row
        return {'image':p.name,**row,'cueLabels':labels}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:rows=list(pool.map(verify,sorted(frames.items())))
    hashes=[]
    for start,end,duration in holds:
        first=hashlib.sha256((args.output/f'{start:05d}.png').read_bytes()).hexdigest();last=hashlib.sha256((args.output/f'{end:05d}.png').read_bytes()).hexdigest()
        assert first==last,(start,end)
        row=next(row for row in rows if row['frame']==start)
        if duration==1.5:assert not row['spheres'] and row['regions']==2,row
        hashes.append({'start':start,'end':end,'frames':end-start+1,'sha256':first})
    labelled={label:row for row in rows for label in row['cueLabels']}
    for label,ids in [('s03:first',('A','B')),('s03:second',('B','C')),('s06:final-contact',('A','B'))]:
        row=labelled[label];a,b=[next(b for b in row['spheres'] if b['id']==id) for id in ids]
        assert abs(b['x']-a['x']-a['radius']-b['radius'])<2,row
        assert row['contactFlash'],row
    left=labelled['s05:left-closing']['spheres'];assert left[0]['velocity']>left[1]['velocity'] and left[0]['velocity']<0
    report={'stillCount':len(rows),'maxRegions':max(r['regions'] for r in rows),'maxWords':max(r['maxWords'] for r in rows),'textCollisionCount':sum(len(r['textCollisions']) for r in rows),'identicalHoldPairs':len(holds),'holdHashes':hashes,'contactChecks':3,'measurements':rows}
    (args.output/'verify-measurements.json').write_text(json.dumps(report,indent=2)+'\n')
    print(f"Passed {len(rows)} stills, {len(holds)} frozen holds, 3 contacts; max {report['maxRegions']} regions / {report['maxWords']} words.")
if __name__=='__main__':main()
