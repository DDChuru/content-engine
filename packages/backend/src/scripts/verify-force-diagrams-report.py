#!/usr/bin/env python3
"""Check the delivered diagram states and preserve representative still evidence."""
import json, math, shutil
from pathlib import Path
ROOT=Path(__file__).resolve().parents[4]
PROJECT=ROOT/'packages/backend/projects/mechanics-force-diagrams'
STILLS=ROOT/'packages/backend/out/verify-force-diagrams-stills'
data=json.loads((PROJECT/'verify-stills.json').read_text())
transcript=json.loads((ROOT/'packages/backend/src/remotion/public/transcripts/mechanics/force-diagrams.json').read_text())
assert not data['issues'], data['issues']
assert data['maxRegions']<=3
assert all(h['identical'] for h in data['holdResults'])
assert data['spokenRingChecks']==sum(len(s['figures']) for s in transcript['scenes'])
for arrow in data['schedule']:
    if arrow['id'].startswith('weight'):
        assert arrow['dx']==0 and arrow['dy']>0
    if arrow['scene'] in ('s05','s08'):
        uphill=(math.sqrt(3)/2,-.5)
        dot=arrow['dx']*uphill[0]+arrow['dy']*uphill[1]
        if arrow['id']=='reaction': assert abs(dot)<1
        if arrow['id']=='friction': assert dot<0
    assert arrow['end']>arrow['start']+.7
for scene in ('s02','s04'):
    arrows={a['id']:a for a in data['schedule'] if a['scene']==scene}
    assert arrows['weight']['dy']==-arrows['reaction']['dy']
connected={a['id']:a for a in data['schedule'] if a['scene']=='s06'}
assert connected['tension1']['dx']==-connected['tension2']['dy']
assert connected['weight2']['dy']>-connected['tension2']['dy']
assert connected['left']['dx']<0 and connected['down']['dy']>0
assert connected['support']['dx']>0 and connected['support']['dy']<0
pulley=next(r for r in data['measurements'] if 's06:pen-finish:support' in r['labels'])
assert 'light = massless' in pulley['givens']
connector={a['id']:a for a in data['schedule'] if a['scene']=='s07'}
assert connector['trailerT']['dx']>0 and connector['carT']['dx']<0
assert connector['trailerThrust']['dx']<0 and connector['carThrust']['dx']>0
end_rows={s:next(r for r in data['measurements'] if s+':end' in r['labels']) for s in ('s03','s04','s05','s07','s08')}
expected={'s03':{'weight','single'},'s04':{'weight','reaction','air','brake'},'s05':{'weight','reaction'},'s07':set(),'s08':{'weight','reaction','friction'}}
for scene,forces in expected.items(): assert {a['id'] for a in end_rows[scene]['arrows']}==forces
check=next(h for h in data['holdResults'] if h['scene']=='s08')
assert check['end']-check['start']+1==90
for frame in (check['start'],check['end']):
    assert not next(r for r in data['measurements'] if r['frame']==frame)['arrows']
examples={
    'verify-s02-writing.png':'s02:writing:weight',
    'verify-s03-two-strings.png':'s03:pen-finish:right',
    'verify-s04-driving.png':'s04:pen-finish:air',
    'verify-s05-rough-slope.png':'s05:pen-finish:friction',
    'verify-s06-pulley.png':'s06:pen-finish:support',
    'verify-s07-tension.png':'s07:pen-finish:carT',
    'verify-s07-thrust.png':'s07:pen-finish:carThrust',
    'verify-s08-question.png':'s08:hold-start',
    'verify-s08-weight-ring.png':'s08:ring:weight',
}
for name,label in examples.items():
    row=next(r for r in data['measurements'] if label in r['labels'])
    shutil.copyfile(STILLS/f"{row['frame']}.png",PROJECT/name)
report={'passed':True,'diagramStateChecks':list(expected),'verticalWeights':True,'normalReactionPerpendicular':True,'frictionDownSlope':True,'equalConnectedTensions':True,'hangingWeightExceedsTension':True,'brakingNotDoubleCounted':True,'masslessPulleySupportDirection':True,'checkQuestionHoldFrames':90,'checkAnswerForces':sorted(expected['s08']),'representativeStills':examples}
(PROJECT/'verify-diagrams.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
