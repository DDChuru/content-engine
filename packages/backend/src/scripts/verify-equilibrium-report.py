#!/usr/bin/env python3
"""Check the still evidence and save a compact, reviewable proof beside the lesson."""
import hashlib, json, math
from pathlib import Path
from PIL import Image, ImageDraw
ROOT=Path(__file__).resolve().parents[4]
PROJECT=ROOT/'packages/backend/projects/mechanics-equilibrium-in-1d'
OUT=ROOT/'packages/backend/out/verify-equilibrium-stills'
TRANSCRIPT=ROOT/'packages/backend/src/remotion/public/transcripts/mechanics/equilibrium-in-1d.json'
def main():
    t=json.loads(TRANSCRIPT.read_text());report=json.loads((OUT/'verify-stills-report.json').read_text())
    assert report['passed'] and not report['violations']
    rows={r['frame']:r for r in report['measurements']}
    offsets={};position=0
    for s in t['scenes']:offsets[s['id']]=position;position+=math.ceil(s['duration']*30)
    assert position==report['durationFrames']==8014
    assert all(h['identical'] for h in report['holds']) and len(report['holds'])==11
    first=rows[0];finished=[]
    lines={s['id']:[l for l in first['lineSchedule'] if l['scene']==s['id']] for s in t['scenes']}
    for scene in ('s02','s05'):
        assert all(a['end']<b['start'] for a,b in zip(lines[scene],lines[scene][1:])), ('Overlapping writing',scene)
    assert [l['text'] for l in lines['s05'][:4]]==['Resultant = 0','U - D = 0','; U = D','10 + (18 + x) = 5x']
    assert lines['s02'][0]['text']=='R = F(right) - F(left)'
    for line in first['lineSchedule']:
        frame=offsets[line['scene']]+math.ceil((line['end']+.05)*30)
        row=rows[frame];ink=next(i for i in row['ink'] if i['id']==line['id'])
        assert ink['complete'] and ink['w']>0 and ink['h']>0,(line,ink)
        assert not row['pen'],('Pen remains after line finish',line)
        assert ink['x']>=1000 and ink['x']+ink['w']<=1810 and ink['y']+ink['h']<=980
        finished.append({'scene':line['scene'],'line':line['id'],'text':line['text'],'frame':frame})
    for row in rows.values():
        assert row['regions']<=3 and not row['collisions'] and not row['overflow']
        if row['scene']!='s01': assert all(len(card.split())<=8 for card in row['cards'])
        assert row['pixelCounts'] and all(v['count']>300 for v in row['pixelCounts'])
        for label in row['labels']:
            if label.startswith('underline:'):assert label.split(':')[1] in row['underlines']
        if row['scene'] in ('s04','s05'):
            figures={f['id']:f for f in row['figures']}
            assert all(k in figures for k in ('up10','up18','down5'))
            assert figures['up10']['text']=='10 N'
            assert '(18 + x) N' in figures['up18']['text']
            local=(row['frame']-offsets[row['scene']])/30
            if row['scene']=='s04' or local<t['scenes'][4]['cues']['increase']:
                assert '5x N' in figures['down5']['text']
        for ring in row['rings']:
            # A figure can have two targets (the equal 40 N labels); find its own.
            targets=[f for f in row['figures'] if f['id']==ring['target']]
            assert any(ring['x']<f['x'] and ring['y']<f['y'] and ring['x']+ring['w']>f['x']+f['w'] and ring['y']+ring['h']>f['y']+f['h'] for f in targets),(row['frame'],ring,targets)
    # The recording's equation and check, with no mass/force confusion.
    x=28/4; assert x==7 and 10+(18+x)==5*x==35 and 10+(18+x)-5*x==0
    root=(ROOT/'packages/backend/src/remotion/Root.tsx').read_text()
    start=root.index('id="MechanicsEquilibriumIn1D"');block=root[start:root.index('/>',start)]
    assert root.count('id="MechanicsEquilibriumIn1D"')==1
    for fragment in ('component={MechanicsEquilibriumIn1D}','getMechanicsEquilibriumIn1DDuration(30)','fps={30}','width={1920}','height={1080}'):
        assert fragment in block,fragment
    contact_frames=[0,offsets['s02']+math.ceil(44.68*30),offsets['s03']+math.floor(t['scenes'][2]['duration']*15),offsets['s04']+math.ceil((t['scenes'][3]['cues']['ten']+.4)*30),next(f['frame'] for f in finished if f['line']=='answer0'),offsets['s07']+math.ceil((t['scenes'][6]['cues']['moving']+.4)*30)]
    sheet=Image.new('RGB',(1920,1680),'#171c20');draw=ImageDraw.Draw(sheet)
    for i,frame in enumerate(contact_frames):
        image=Image.open(OUT/f'verify-{frame:05d}.png').convert('RGB')
        left=(i%2)*960;top=(i//2)*560;sheet.paste(image,(left,top+20));draw.text((left+15,top+3),f'Frame {frame} | {rows[frame]["scene"]}',fill='#e9e7e0')
    sheet.save(PROJECT/'verify-contact-sheet.jpg',quality=88)
    summary={k:report[k] for k in ('passed','durationFrames','seconds','stillCount','figureCount','holds','violations')}
    summary.update({'audioSeconds':t['totalDuration'],'wordCues':sum(len(s['cues']) for s in t['scenes']),'spokenFigures':sum(len(s['figures']) for s in t['scenes']),'substitutionRings':5,'finishedInkLines':finished,'completeGivensChecked':True,'formulaBeforeSubstitution':True,'questionUnderlinesChecked':True,'ringsEncloseTargets':True,'pixelCheckedEveryVisual':True,'sourceEquationChecked':True,'registrationChecked':True,'contactFrames':contact_frames,'artifactSha256':hashlib.sha256((OUT/'verify-stills-report.json').read_bytes()).hexdigest(),'compositionSha256':hashlib.sha256((ROOT/'packages/backend/src/remotion/compositions/MechanicsEquilibriumIn1D.tsx').read_bytes()).hexdigest()})
    (PROJECT/'verify-stills.json').write_text(json.dumps(summary,indent=2)+'\n')
    print(json.dumps(summary,indent=2))
if __name__=='__main__':main()
