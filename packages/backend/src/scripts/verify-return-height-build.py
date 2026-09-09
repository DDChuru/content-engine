#!/usr/bin/env python3
"""Audit the revised claim ordering and verify that other scenes stay unchanged."""
import hashlib,json,math,shutil,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[4];B=R/'packages/backend';P=B/'projects/mechanics-acceleration-due-to-gravity';O=B/'out/verify-return-height-stills'
D=json.loads((B/'src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json').read_text());s=next(s for s in D['scenes'] if s['id']=='s04')
V=json.loads((O/'verify-measurements.json').read_text());assert not V['issues']
assert V['penFinishStills']==5 and len(V['holdResults'])==9
assert all(h['identical'] for h in V['holdResults'])
assert V['spokenRingChecks']==sum(e['kind']=='spoken' for e in s['figureEvents'])
result=next(b for b in s['beats'] if b['id']=='result');result_value=next(e['start'] for e in s['figureEvents'] if e['target']=='return' and e['kind']=='spoken' and result['cue']<=e['start']<result['speechEnd'])
control=json.loads((P/'verify-return-height-baseline.json').read_text());pixelChecks=[]
expected={'initial':'u = +12 m s⁻¹','displacement':'s = 0 m','acceleration':'a = −10 m s⁻²','conditions':'No air resistance'}
for row in V['measurements']:
 if row['scene']!='s04':
  baseline=subprocess.check_output(['git','show','4bf0414:packages/backend/projects/mechanics-acceleration-due-to-gravity/verify-'+row['scene']+'-complete.png'],cwd=R)
  archived=hashlib.sha256(baseline).hexdigest();current=hashlib.sha256((O/(str(row['frame'])+'.png')).read_bytes()).hexdigest()
  if row['scene']=='s07':
   assert control['timelineAligned'] and control['currentFrame']==row['frame']
   assert control['baselineRenderedSha256']==control['currentRenderedSha256']==current
  else:assert archived==current,('Other scene pixels changed',row['scene'])
  pixelChecks.append(dict(scene=row['scene'],archivedSha256=archived,currentSha256=current,archivedExact=archived==current,originalSourceControlExact=row['scene']=='s07' and control['baselineRenderedSha256']==current))
  continue
 t=(row['frame']-V['offsets']['s04'])/30
 givens={x['id']:x['text'] for x in row['givens']}
 if t<result_value:assert '−12' not in givens.get('return',''),('Premature answer',row['frame'])
 if row['ink']:
  assert row['ink'][0]['text']=='v² = u² + 2as'
  for key,value in expected.items():assert givens.get(key)==value,(row['frame'],key,givens)
 if any(v['id']=='graph' for v in row['visuals']):
  assert t>=result['end']+result['hold']-.001
  assert not row['ink']
 for label in row['labels']:
  if label.endswith(':pen-finish'):
   b=next(b for b in s['beats'] if b['id']==label.split(':')[1]);ink=next(i for i in row['ink'] if i['text']==b['ink'])
   assert ink['complete'] and max(ink['strokeEnds'])<=b['penEnd']*30
# Preserve every pre-existing stroke glyph exactly; only the requested ± is added.
ink_path='packages/backend/src/remotion/compositions/mechanics-m42/Ink.tsx'
old=subprocess.check_output(['git','show','de056a6:'+ink_path],cwd=R).decode();now=(R/ink_path).read_text()
assert '\n'.join(l for l in now.splitlines() if "'±':" not in l)+'\n'==old
artifacts=[]
for label,name in [('s04:givens:cue','problem'),('s04:formula:pen-finish','formula'),('s04:substitute:writing','writing'),('s04:substitute:pen-finish','substitution'),('s04:roots:pen-finish','roots'),('s04:result:pen-finish','result'),('s04:graph:cue','graph-start'),('s04:caveat:cue','equal-triangles'),('s04:end','caveat')]:
 row=next(r for r in V['measurements'] if label in r['labels']);name='verify-return-height-'+name+'.png';shutil.copyfile(O/(str(row['frame'])+'.png'),P/name);artifacts.append(dict(file=name,frame=row['frame']))
V.update(artifacts=artifacts,unchangedScenePixels=7,otherScenePixelChecks=pixelChecks,baselineControl=control,unchangedOtherAudioFiles=7,sceneDuration=s['duration'])
(P/'verify-return-height-stills.json').write_text(json.dumps(V,indent=2,ensure_ascii=False)+'\n')
report=P/'verify-build.md';text=report.read_text();heading='## Return-height correction — 2026-09-09'
section=f'''{heading}

This section supersedes the original S04/runtime results above. Only S04 narration and visuals were revised. Conditions precede the claim: u = +12 m s⁻¹, return to launch/catch height (s = 0), a = −10 m s⁻², no air resistance. Five handwritten lines derive v² = 144, then v = ±12, then the downward choice v = −12 m s⁻¹. The formula stays above the substitutions; word-timed rings identify u, a and s. The graph appears only after the completed result and its two-second hold. Equal signed triangles illustrate the zero displacement; the spoken rule gives the same-height/no-resistance conditions and the faster cliff landing exception.

- Scene audio: **{s['duration']:.3f} s**. Total audio: **{D['totalDuration']:.3f} s**. Registered composition: **{V['durationFrames']} frames / {V['durationSeconds']:.3f} s (6:06.933)**, 1920 × 1080, 30 fps, derived automatically from the audio.
- Only `acceleration-due-to-gravity-s04.mp3` was re-voiced, voice `gYWKdgLtqjPO3D5uDrDP`, speed 0.9. All nine cues resolved with local faster-whisper-small; all nine inserted holds are two seconds.
- {V['stillCount']} audited stills: S04 setup, story, working, completed strokes, rings, graph and hold boundaries, plus seven unchanged-scene endings. Maximum {V['maxRegions']} regions; zero measured text/handwriting collisions or overflow; visual pixel presence on every sample. All {V['spokenRingChecks']} spoken-figure checks and five pen-finish checks passed. All nine hold pairs are pixel-identical.
- All other seven MP3s and transcript scene objects match reviewed build `4bf0414`. Six ending PNGs match the archived stills byte-for-byte. S07 differs from its archived still by 39 pixels (of 518,400); re-rendering the original `4bf0414` component and unchanged S07 data with the same composition ID and revised timeline matches the new still byte-for-byte. This control verifies unchanged S07 visuals without claiming exact agreement with the archived raster. Existing handwriting glyphs are unchanged; one ± glyph supports the new square-root line.
- Targeted TypeScript compilation, Python syntax, independent arithmetic, unchanged-audio checks and `git diff --check` passed. No video rendered. No files deleted. Narration-stage commit: `de056a6`.

Evidence: `verify-return-height-narration.json`, `verify-return-height-stills.json`, `verify-return-height-baseline.json`, and the nine `verify-return-height-*.png` images. Original evidence remains as historical build evidence. Run `verify-gravity-narration.py mechanics-acceleration-due-to-gravity --scene s04` and again with `--transcribe` to regenerate only S04; then `verify-acceleration-cues.py --scene s04` and `verify-return-height-narration.py`. Use nvm Node for `verify-return-height-stills.cjs`, then `verify-return-height-baseline.cjs` (original-source control) and `verify-return-height-build.py`. The scene-scoped verification supersedes the original full-build duration-cap check.
'''
if heading in text:text=text[:text.index(heading)].rstrip()+'\n'
report.write_text(text+'\n'+section)
print(f"PASS: {V['stillCount']} stills, {V['spokenRingChecks']} word rings, 9 frozen holds, five formula-first lines, seven unchanged audio/transcript scenes and six archived-exact endings and one original-source-control-exact ending.")
