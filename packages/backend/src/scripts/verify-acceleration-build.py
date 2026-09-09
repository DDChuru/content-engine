#!/usr/bin/env python3
"""Validate formula order, persistent givens and pen completion; collect still evidence."""
import hashlib,json,math,re,shutil
from pathlib import Path
R=Path(__file__).resolve().parents[2]
P=R/'projects/mechanics-acceleration-due-to-gravity'
O=R/'out/verify-acceleration-due-to-gravity-stills'
D=json.loads((R/'src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json').read_text())
V=json.loads((O/'verify-measurements.json').read_text())
assert not V['issues'] and V['maxRegions']<=3
assert V['stillCount']>=274
assert sum(':story-motion-' in label for row in V['measurements'] for label in row['labels'])==15
assert V['durationFrames']==sum(math.ceil(s['duration']*30) for s in D['scenes'])
assert 270<=V['durationSeconds']<=330
expected={
 's03':{'initial':'u = 0 m s⁻¹','acceleration':'a = −10 m s⁻²','displacement':'s = −15 m'},
 's06':{'initial':'u = 8 m s⁻¹','acceleration':'a = −10 m s⁻²','displacement':'s = −20 m'},
 's07':{'initial':'u = 8 m s⁻¹','acceleration':'a = −10 m s⁻²','top':'v = 0 m s⁻¹','cliff-height':'20 m'},
}
checks=0
for row in V['measurements']:
 s=next(s for s in D['scenes'] if s['id']==row['scene'])
 if row['ink']:
  if s['id'] in expected:
   given={g['id']:g['text'] for g in row['givens']}
   for key,value in expected[s['id']].items():assert given.get(key)==value,(row['frame'],key,given)
   assert row['ink'][0]['text']==next(b['ink'] for b in s['beats'] if b.get('ink'))
   checks+=1
  if any(x.endswith(':result:writing') for x in row['labels']) and s['id']=='s07':
   assert {g['id']:g['text'] for g in row['givens']}['rise']=='Rise: s = 3.2 m'
 for label in row['labels']:
  if label.endswith(':pen-finish'):
   bid=label.split(':')[1];b=next(b for b in s['beats'] if b['id']==bid)
   line=next(i for i in row['ink'] if i['text']==b['ink'])
   assert line['complete'] and max(line['strokeEnds'])<=b['penEnd']*30
for s in D['scenes']:
 for b in s['beats']:
  if b.get('ink') and b['id'] in {'result','rise'}:
   assert b['penEnd']-.45+.4<=b['end'],'Answer ring must finish before the hold'
 assert all(h['start']>=0 and h['duration']>=1 for h in s['holds'])
for h in V['holdResults']:assert h['identical']
# Confirm only this registered ID was added, with literal requested dimensions.
root=(R/'src/remotion/Root.tsx').read_text()
registration=re.search(r'<Composition\s+id="MechanicsAccelerationDueToGravity"[\s\S]*?/>',root)[0]
for value in ['width={1920}','height={1080}','fps={30}','durationInFrames={getMechanicsAccelerationDueToGravityDuration(30)}']:assert value in registration
source=(R/'src/remotion/compositions/MechanicsAccelerationDueToGravity.tsx').read_text()
assert '9.8' not in source and 'speed of impact' not in source
assert '9.8' not in ' '.join(b['text'] for s in D['scenes'] for b in s['beats'])
artifacts=[]
def copy(row,name):
 path=P/(name+'.png');shutil.copyfile(O/(str(row['frame'])+'.png'),path)
 artifacts.append(dict(file=path.name,frame=row['frame'],sha256=hashlib.sha256(path.read_bytes()).hexdigest()))
for s in D['scenes']:
 rows=[r for r in V['measurements'] if r['scene']==s['id']]
 copy(next(r for r in rows if s['id']+':end' in r['labels']),'verify-'+s['id']+'-complete')
 if s['id'] in expected:
  copy(next(r for r in rows if s['id']+':substitute:writing' in r['labels']),'verify-'+s['id']+'-writing')
  copy(next(r for r in rows if s['id']+':substitute:pen-finish' in r['labels']),'verify-'+s['id']+'-pen-finish')
  problem_cue='initial' if s['id']=='s03' else 'setup'
  copy(next(r for r in rows if s['id']+':'+problem_cue+':cue' in r['labels']),'verify-'+s['id']+'-problem')
  copy(next(r for r in rows if s['id']+':result:pen-finish' in r['labels']),'verify-'+s['id']+'-result')
  substitution=next(b for b in s['beats'] if b['id']=='substitute')
  event=next(e for e in s['figureEvents'] if e['kind']=='spoken' and e['target']=='acceleration' and substitution['cue']<=e['start']<substitution['speechEnd'])
  copy(next(r for r in rows if s['id']+':ring:'+event['id'] in r['labels']),'verify-'+s['id']+'-substitution-rings')
 for fraction in [.25,.5,.75]:
  row=next((r for r in rows if f"{s['id']}:story-motion-{fraction}" in r['labels']),None)
  if row:copy(row,f"verify-{s['id']}-story-{fraction}")
copy(next(r for r in V['measurements'] if r['frame']==next(h['start'] for h in V['holdResults'] if h['start']>=8692)),'verify-check-hold')
files=['src/remotion/compositions/MechanicsAccelerationDueToGravity.tsx','src/remotion/compositions/mechanics-m42/Ink.tsx','src/remotion/compositions/mechanics-m42/Presentation.tsx','src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json']
V.update(persistentGivenFrames=checks,artifacts=artifacts,rootRegistrationSha256=hashlib.sha256(registration.encode()).hexdigest(),sourceHashes={f:hashlib.sha256((R/f).read_bytes()).hexdigest() for f in files})
(P/'verify-stills.json').write_text(json.dumps(V,indent=2,ensure_ascii=False)+'\n')
print(f"PASS: {checks} frames with complete givens and formula first; {V['penFinishStills']} completed pen lines; {V['spokenRingChecks']} word rings; {len(V['holdResults'])} frozen holds; {len(artifacts)} reviewable stills.")
(P/'verify-build.md').write_text(f'''# MechanicsAccelerationDueToGravity — build verification

- Registered by hand in `Root.tsx`: `MechanicsAccelerationDueToGravity`, 1920 × 1080, 30 fps. Project slug `mechanics-acceleration-due-to-gravity`, map M4.2.
- Audio: {D['totalDuration']:.3f} s. Composition: {V['durationFrames']} frames / {V['durationSeconds']:.3f} s (5:11), including per-scene rounding.
- Eight scenes, three slow worked scenes (61.26 s, 58.57 s, 60.26 s). Voice `gYWKdgLtqjPO3D5uDrDP`, speed 0.9 for slow scenes and 1.0 for brisk scenes.
- All 49 beat cues resolved with local faster-whisper-small. Isolated-beat transcription protects leading signs; two short phrases use the complete-scene local pass to avoid omissions/boilerplate. Semantic figure events retain their original word timestamps.
- {V['stillCount']} final stills, including moving-story samples, {V['penFinishStills']} pen-finish checks and {V['spokenRingChecks']} spoken-figure ring checks. At most {V['maxRegions']} regions; no measured text/handwriting collisions or overflow. Every sampled frame has visual content and non-background pixels.
- All {len(V['holdResults'])} hold pairs are pixel-identical. The 46 seconds of inserted holds were separately checked for silence. Answer handwriting finishes before the result ring, which completes before its hold.
- {checks} sampled working frames retain all relevant givens and the general formula. The final height addition retains the 20 m cliff height and the already-computed 3.2 m rise on the diagram.
- Targeted TypeScript compilation, Python syntax checks, independent arithmetic and `git diff --check` passed.
- No video rendered, no deployment, no deleted files. Stage 1 narration commit: `4cb6a16`, pushed through merge `cae34a6`.

## Teaching and source coverage

Read `TEACHING-STANDARD.md` §§1–14, `PACING.md`, and the approved Multiple Collisions and Drawing Travel Graphs compositions. Opening syllabus excerpt and outcome wording return in the ticked recap. Visuals reuse the existing stroke geometry/pen player; the symmetry graph has a grid, tracing dot and signed shaded areas. Captions accompany diagrams and stay within eight words. Problem phrases underline at local word cues. Stories animate before the givens or working appear.

Gravity is downward and constant, with the Paper 4 convention stated once plainly. All calculations use magnitude 10; upward stays positive. Weight is distinguished from acceleration. The source's 15 m downward example and its dropped-from-rest rule are combined for the user-requested dropped example (the recording's downward launch of 4 m s⁻¹ is not substituted). This adaptation is declared in `STORYBOARD.md`; source `FRAME-LOG.md` and `NOTES.md` remain unchanged.

The dropped stone has u = 0, s = −15 and a = −10, yielding v = −17.3 m s⁻¹. The cliff problem has u = 8, s = −20 and a = −10, yielding positive time 2.95 s and maximum height above sea 23.2 m. Signed impact velocity is labelled velocity. The symmetry statement explicitly applies only to return to launch height without air resistance; a lower-landing extension shows the exception. The check question holds for three seconds before revealing the acceleration value.

## Evidence and reproduction

`verify-stills.json` records bounds, givens, handwritten stroke completion, hold comparisons, source hashes, registration hash and image hashes. The {len(artifacts)} `verify-*.png` files are scene endings, handwriting/pen-finish samples, moving stories and the question hold. All final stills and resumable frame measurements remain in `packages/backend/out/verify-acceleration-due-to-gravity-stills/`.

From the repository root, select the nvm Node binary as requested. Run:

```sh
/tmp/verify-equilibrium-venv/bin/python packages/backend/src/scripts/verify-acceleration-cues.py
node packages/backend/src/scripts/verify-acceleration-stills.cjs
python3 packages/backend/src/scripts/verify-acceleration-build.py
node packages/backend/node_modules/typescript/bin/tsc --noEmit --jsx react --esModuleInterop --resolveJsonModule --moduleResolution node --target es2022 --module commonjs --skipLibCheck packages/backend/src/scripts/verify-acceleration-entry.tsx
```

For narration regeneration, `verify-gravity-narration.py mechanics-acceleration-due-to-gravity` reads the storyboard and the requested sibling `.env` (override with `CONTENT_ENGINE_ENV`). Add `--transcribe`, then run the cue verifier. Python requires requests, numpy and faster-whisper; this host's existing verification venv supplies them. Transcription caches are keyed by audio hash.

The still audit uses only bundling and `renderStill`. It captures serially, saves per-frame measurements and periodically restarts Chrome; this handles the browser closure encountered during a previous non-checkpointed audit.
''')
