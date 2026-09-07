#!/usr/bin/env python3
"""Audit Multiple Collisions cue, hold, contact and motion stills; no video render."""
import argparse, concurrent.futures, hashlib, json, math, re, subprocess
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw
ROOT=Path(__file__).resolve().parents[2]
TRANSCRIPT=ROOT/'src/remotion/public/transcripts/mechanics/multiple-collisions.json'
ARTIFACTS=ROOT/'out/MechanicsMultipleCollisions'

def assert_visual(row):
    assert any(b['region'] in ('diagram','paper') for b in row['bounds']),('Text-only still: a card needs a visual',row)

def assert_visible_pixels(row,path):
    with Image.open(path) as image:
        root=row['rootBounds'];scale=image.width/root['width']
        for b in row['bounds']:
            if b['region'] not in ('diagram','paper'):continue
            box=tuple(round(v*scale) for v in (b['left']-root['left'],b['top']-root['top'],b['right']-root['left'],b['bottom']-root['top']))
            crop=image.crop(box).convert('RGB')
            difference=ImageChops.difference(crop,Image.new('RGB',crop.size,'#171c20')).convert('L')
            if sum(difference.histogram()[16:])>100:return
    raise AssertionError(('Visual is blank or occluded',row['frame']))

def assert_problem_givens(row):
    givens={item['id']:item for item in row['givens']}
    for item in givens.values():
        assert str(item['value']) in re.findall(r'\d+',item['text']),item
        assert ('kg' if item['id'].endswith('.mass') else 'm s⁻¹') in item['text'],item
    if row['problemLines']:
        assert len(row['problemLines'])==3 and all(line['fits'] for line in row['problemLines']),row
        expected={'A.mass':1,'A.before':4,'B.mass':2,'B.before':3,'C.mass':3,'C.before':1,'A.after':2,'C.after':3}
        assert {key:item['value'] for key,item in givens.items()}==expected,row
    ink={line['id']:line for line in row['inkLines']}
    if set(ink)&{'principle','formula','equation','simplify','solve'}:
        first='A.mass' in givens
        expected=({'A.mass':1,'A.before':4,'B.mass':2,'B.before':3,'A.after':2} if first else {'B.mass':2,'B.before':4,'C.mass':3,'C.before':1,'C.after':3})
        # Every numeric operand in the substitution has its labelled source
        # on the diagram, including initial velocities after results appear.
        assert all(key in givens and givens[key]['value']==value for key,value in expected.items()),row
        if 'equation' in ink:
            value=lambda key:givens[key]['value']
            equation=(f"{value('A.mass')}×{value('A.before')} + {value('B.mass')}×{value('B.before')} = {value('A.mass')}×{value('A.after')} + {value('B.mass')}vB" if first else f"{value('B.mass')}×{value('B.before')} + {value('C.mass')}×{value('C.before')} = {value('B.mass')}wB + {value('C.mass')}×{value('C.after')}")
            assert ink['equation']['text']==equation,row
        for sphere in ('A','B') if first else ('B','C'):
            assert givens[sphere+'.before']['bounds']['bottom']<givens[sphere+'.mass']['bounds']['top'],row
            if sphere+'.after' in givens:
                assert givens[sphere+'.after']['bounds']['top']>givens[sphere+'.mass']['bounds']['bottom'],row
        unknown='vB' if first else 'wB'
        assert unknown in row['unknowns'] or givens.get('B.after',{}).get('value')==(4 if first else 1),row

def audit_frames(scenes):
    frames={};holds=[];offset=0
    for s in scenes:
        def add(seconds,label):
            frame=offset+math.ceil(seconds*30)
            frames.setdefault(frame,[]).append(s['id']+':'+label)
        add(0,'scene-start')
        frames.setdefault(offset+math.ceil(s['duration']*30)-1,[]).append(s['id']+':scene-end')
        if offset:
            for frame in range(offset,offset+16):
                frames.setdefault(frame,[]).append(s['id']+':transition')
        for key,t in s['cues'].items():add(t,key)
        for i,h in enumerate(s['holds']):
            if h['kind']!='hold':continue
            start=offset+math.ceil(h['start']*30);end=start+round(h['duration']*30)-1
            for frame in (start,end):frames.setdefault(frame,[]).append(s['id']+f':hold-{i}')
            holds.append((start,end,h['duration']))
        if s['id'] in ('s04','s06'):
            t=s['cues']['draw'];w=next(w for w in s['words'] if w['end']>=t and w['start']>=t-.08)
            frame=offset+math.floor(w['end']*30);frames.setdefault(frame,[]).append(s['id']+':setup-complete')
            add((s['cues']['principle']+s['cues']['principle-end'])/2,'principle-writing')
            add((s['cues']['formula']+s['cues']['formula-end'])/2,'formula-writing')
            add(s['cues']['equation']-.1,'before-substitution')
        if s['id']=='s07':add(s['duration']/2,'complete-problem')
        if s['id']=='s03':
            for key in ('first','second'):
                add(s['cues'][key]-.06,key+'-before')
                add(s['cues'][key]+.12,key+'-flash')
                add(s['cues'][key]+.6,key+'-after')
            for a,b in [('setup','first'),('first','second'),('second','question')]:add((s['cues'][a]+s['cues'][b])/2,a+'-moving')
        if s['id']=='s02':
            add(s['cues']['separate']+.3,'velocity-changing')
            add(s['cues']['separate']+.6,'velocity-changed')
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
    parser.add_argument('--reuse-stills',action='store_true',help='Resume interrupted captures only when bundle and image hashes match')
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    bundle_hash=hashlib.sha256()
    for p in sorted(args.bundle.glob('*.js')):
        bundle_hash.update(p.name.encode());bundle_hash.update(p.read_bytes())
    bundle_hash=bundle_hash.hexdigest()
    scenes=json.loads(TRANSCRIPT.read_text())['scenes'];frames,holds=audit_frames(scenes)
    def verify(item):
        frame,labels=item;p=args.output/f'{frame:05d}.png';log=args.output/f'verify-{frame:05d}.log'
        cache=args.output/f'verify-{frame:05d}.json'
        saved=json.loads(cache.read_text()) if args.reuse_stills and cache.exists() and p.exists() else None
        if saved and saved['bundleSha256']==bundle_hash and saved['imageSha256']==hashlib.sha256(p.read_bytes()).hexdigest():
            row=saved['measurement']
        else:
            for attempt in range(3):
                with log.open('w') as stream:
                    result=subprocess.run(['npx','remotion','still',str(args.bundle),'MechanicsMultipleCollisions',str(p),f'--frame={frame}','--scale=0.5','--props={"audioEnabled":false,"audit":true}','--log=error'],cwd=ROOT,stdout=stream,stderr=subprocess.STDOUT)
                if result.returncode==0:break
            else:raise RuntimeError(f'Still failed: {log}')
            row=json.loads((ARTIFACTS/f'verify-collisions-{frame:05d}.json').read_text())
            cache.write_text(json.dumps({'bundleSha256':bundle_hash,'imageSha256':hashlib.sha256(p.read_bytes()).hexdigest(),'measurement':row})+'\n')
        assert row['frame']==frame and row['regions']<=3 and row['maxWords']<=12,row
        assert_visual(row)
        assert_visible_pixels(row,p)
        assert row['maxCaptionWords']<=8 and row['maxCaptionWidthRatio']<=.4,row
        assert not row['overflow'] and not row['textCollisions'],row
        if any(k.endswith('setup-complete') for k in labels):assert not row['inkLines'] and row['regions']<=2 and all(b['region'] in ('header','diagram') for b in row['bounds']),row
        for arrow in row['arrows']:assert abs(arrow['length']-abs(arrow['speed'])*35)<.01,row
        spheres=row['spheres']
        for a,b in zip(spheres,spheres[1:]):assert b['x']-a['x']>=a['radius']+b['radius']-.1,row
        if any(k.startswith('s03:') and k.split(':')[1] not in ('transition','scene-start') for k in labels):assert not row['cards'],row
        assert_problem_givens(row)
        ink={line['id']:line for line in row['inkLines']}
        if any(k.endswith('principle-writing') for k in labels):
            assert set(ink)=={'principle'} and not ink['principle']['complete'],row
        if any(k.endswith('formula-writing') for k in labels):
            assert set(ink)=={'principle','formula'} and ink['principle']['complete'] and not ink['formula']['complete'],row
        if set(ink)&{'equation','simplify','solve'} or any(k.endswith('before-substitution') for k in labels):
            assert ink['principle']['complete'] and ink['formula']['complete'],row
            assert ink['principle']['text']=='Momentum before = momentum after',row
            assert ink['formula']['text'] in ('mA uA + mB uB = mA vA + mB vB','mB uB + mC uC = mB vB + mC vC'),row
        for line in ink.values():
            assert line['start']<line['end'],row
        return {'image':p.name,**row,'cueLabels':labels}
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:rows=list(pool.map(verify,sorted(frames.items())))
    hashes=[]
    for start,end,duration in holds:
        first=hashlib.sha256((args.output/f'{start:05d}.png').read_bytes()).hexdigest();last=hashlib.sha256((args.output/f'{end:05d}.png').read_bytes()).hexdigest()
        row=next(row for row in rows if row['frame']==start)
        end_row=next(row for row in rows if row['frame']==end)
        annotation_only=False
        if first!=last:
            # A requested spoken ring may begin inside an existing question hold.
            # Require every other pixel and all diagram geometry to remain frozen.
            offsets={};offset=0
            for scene in scenes:offsets[scene['id']]=offset;offset+=math.ceil(scene['duration']*30)
            events=next(r for r in rows if r['frame']==0).get('figureSchedule',[])
            targets={e['target'] for e in events if e['kind']=='spoken' and start<=offsets[e['scene']]+math.ceil(e['start']*30)<=end}
            assert targets,('Hold moved without a spoken figure cue',start,end)
            assert row['spheres']==end_row['spheres'] and row['labels']==end_row['labels'],('Underlying diagram moved',start,end)
            with Image.open(args.output/f'{start:05d}.png') as a, Image.open(args.output/f'{end:05d}.png') as b:
                images=[a.convert('RGB'),b.convert('RGB')]
                scale=a.width/row['rootBounds']['width'];root=row['rootBounds']
                for ring in row['figureRings']+end_row['figureRings']:
                    if ring['target'] not in targets:continue
                    r=ring['bounds'];box=tuple(round(v*scale) for v in (r['left']-root['left']-5,r['top']-root['top']-5,r['right']-root['left']+5,r['bottom']-root['top']+5))
                    for image in images:ImageDraw.Draw(image).rectangle(box,fill='black')
                assert ImageChops.difference(*images).getbbox() is None,('Non-annotation pixels moved',start,end)
            annotation_only=True
        if duration==1.5:assert row['spheres'] and row['regions']==3,row
        hashes.append({'start':start,'end':end,'frames':end-start+1,'sha256':first,'annotationOnly':annotation_only})
    labelled={label:row for row in rows for label in row['cueLabels']}
    for label,ids in [('s03:first',('A','B')),('s03:second',('B','C')),('s06:final-contact',('A','B'))]:
        row=labelled[label];a,b=[next(b for b in row['spheres'] if b['id']==id) for id in ids]
        assert abs(b['x']-a['x']-a['radius']-b['radius'])<2,row
        assert row['contactFlash'],row
    left=labelled['s05:left-closing']['spheres'];assert left[0]['velocity']>left[1]['velocity'] and left[0]['velocity']<0
    before=next(b for b in labelled['s02:third']['spheres'] if b['id']=='B')
    after=next(b for b in labelled['s02:velocity-changed']['spheres'] if b['id']=='B')
    assert before['velocity']!=after['velocity'],(before,after)
    assert {'vB','wB'}<={l['text'] for l in labelled['s02:unique']['labels']},labelled['s02:unique']
    for scene_id,unknown,before,result in [('s04','vB',3,4),('s06','wB',4,1)]:
        assert unknown in labelled[scene_id+':setup-complete']['unknowns'],labelled[scene_id+':setup-complete']
        result_row=labelled[scene_id+':result']
        values={item['id']:item['value'] for item in result_row['givens']}
        assert values['B.before']==before and values['B.after']==result and not result_row['unknowns'],result_row
    for s in scenes:
        if s['id'] not in ('s04','s06'):continue
        c=s['cues'];assert c['principle']<c['principle-end']<c['formula']<c['formula-end']<c['equation'],s['id']
        written={line['id']:line for line in labelled[s['id']+':before-substitution']['inkLines']}
        for key in ('principle','formula'):
            assert written[key]['start']==c[key] and written[key]['end']==c[key+'-end'],written
        first,last=('a','b') if s['id']=='s04' else ('b','c')
        expected=f'mass {first} times u {first} plus mass {last} times u {last} equals mass {first} times v {first} plus mass {last} times v {last}'
        spoken=' '.join(w['word'] for w in s['words'] if w['end']>c['formula'] and w['start']<c['formula-end'])
        normalize=lambda text:re.sub('[^a-z0-9]','',text.lower())
        assert normalize(spoken)==normalize(expected),(s['id'],spoken)
        if s['id']=='s06':assert written['notation']['text']=='vB = wB' and written['notation']['complete'],written
    report={'workingGivenChecks':sum(bool({line['id'] for line in row['inkLines']}&{'principle','formula','equation','simplify','solve'}) for row in rows),'problemCardChecks':sum(bool(row['problemLines']) for row in rows),'stillCount':len(rows),'pixelCheckedStillCount':len(rows),'textOnlyCount':sum(r['textOnly'] for r in rows),'maxCaptionWords':max(r['maxCaptionWords'] for r in rows),'maxCaptionWidthRatio':max(r['maxCaptionWidthRatio'] for r in rows),'maxRegions':max(r['regions'] for r in rows),'maxWords':max(r['maxWords'] for r in rows),'textCollisionCount':sum(len(r['textCollisions']) for r in rows),'identicalHoldPairs':sum(not h['annotationOnly'] for h in hashes),'annotationOnlyHoldPairs':sum(h['annotationOnly'] for h in hashes),'holdHashes':hashes,'contactChecks':3,'measurements':rows}
    (args.output/'verify-measurements.json').write_text(json.dumps(report,indent=2)+'\n')
    print(f"Passed {len(rows)} stills, {report['identicalHoldPairs']} identical holds + {report['annotationOnlyHoldPairs']} annotation-only holds, 3 contacts; {report['textOnlyCount']} text-only stills; max {report['maxRegions']} regions / {report['maxCaptionWords']} caption words.")
if __name__=='__main__':main()
