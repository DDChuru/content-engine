#!/usr/bin/env python3
"""Prove the S04-only narration revision against the reviewed build."""
import hashlib,json,math,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[4]
relative='packages/backend/src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json'
baseline=json.loads(subprocess.check_output(['git','show','4bf0414:'+relative],cwd=R))
current=json.loads((R/relative).read_text());checks=[]
for old,s in zip(baseline['scenes'],current['scenes']):
 assert old['id']==s['id']
 audio='packages/backend/src/remotion/public/audio/mechanics/'+s['audio']
 before=hashlib.sha256(subprocess.check_output(['git','show','4bf0414:'+audio],cwd=R)).hexdigest()
 after=hashlib.sha256((R/audio).read_bytes()).hexdigest()
 if s['id']!='s04':assert old==s and before==after,s['id']
 checks.append(dict(scene=s['id'],beforeSha256=before,afterSha256=after,unchanged=before==after))
s=next(s for s in current['scenes'] if s['id']=='s04')
assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP' and s['voiceSpeed']==.9
assert [b['ink'] for b in s['beats'] if b.get('ink')]==['v² = u² + 2as','v² = 12² + 2(−10)(0)','v² = 144','v = ±12','coming down: v = −12 m s⁻¹']
assert s['cues']['story']<s['cues']['givens']<s['cues']['formula']<s['cues']['substitute']<s['cues']['square']<s['cues']['roots']<s['cues']['result']<s['cues']['graph']<s['cues']['caveat']
assert len(s['cues'])==len(s['beats']) and all(h['duration']==2 for h in s['holds'])
sub=next(b for b in s['beats'] if b['id']=='substitute')
for target in ['initial','displacement','acceleration']:
 assert any(e['target']==target and e['kind']=='spoken' and sub['cue']<=e['start']<sub['speechEnd'] for e in s['figureEvents'])
frames=sum(math.ceil(s['duration']*30) for s in current['scenes'])
report=dict(baselineCommit='4bf0414',sceneDuration=s['duration'],totalAudioDuration=current['totalDuration'],compositionFrames=frames,compositionSeconds=frames/30,cues=len(s['cues']),spokenRings=sum(e['kind']=='spoken' for e in s['figureEvents']),holds=len(s['holds']),audioChecks=checks)
(R/'packages/backend/projects/mechanics-acceleration-due-to-gravity/verify-return-height-narration.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
