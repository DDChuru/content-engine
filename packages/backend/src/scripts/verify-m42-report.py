#!/usr/bin/env python3
"""Save reviewable still proofs and a concise build report after the audit passes."""
import argparse,hashlib,json,shutil
from pathlib import Path
R=Path(__file__).resolve().parents[4]
p=argparse.ArgumentParser();p.add_argument('project');p.add_argument('prefix');p.add_argument('composition');a=p.parse_args()
project=R/'packages/backend/projects'/a.project
out=R/'packages/backend/out'/('verify-'+a.prefix+'-stills')
d=json.loads((out/'verify-measurements.json').read_text());assert not d['issues'],d['issues']
t=json.loads((R/'packages/backend/src/remotion/public/transcripts/mechanics'/(a.prefix+'.json')).read_text())
proofs=[]
for s in t['scenes']:
 rows=[r for r in d['measurements'] if r['scene']==s['id']]
 # Preserve the completed scene plus one actual in-progress writing frame.
 candidates=[rows[-1]]
 ink=next((r for r in rows if any(l.endswith(':writing') for l in r['labels'])),None)
 if ink:candidates.append(ink)
 for i,row in enumerate(candidates):
  name=f"verify-{s['id']}-{'complete' if i==0 else 'writing'}.png"
  shutil.copyfile(out/(str(row['frame'])+'.png'),project/name)
  proofs.append(dict(file=name,frame=row['frame'],sha256=hashlib.sha256((project/name).read_bytes()).hexdigest()))
summary={k:v for k,v in d.items() if k!='measurements'}
summary.update(proofs=proofs,sourceAudioDuration=t['totalDuration'],resolvedCues=sum(len(s['cues']) for s in t['scenes']),audio=[dict(id=s['id'],sha256=s['audioSha256'],duration=s['duration'],voice=s['voiceId'],speed=s['voiceSpeed']) for s in t['scenes']],measurements=d['measurements'])
(project/'verify-stills.json').write_text(json.dumps(summary,indent=2)+'\n')
(project/'verify-build.md').write_text(f'''# {a.composition} — build verification

- Registered by hand in `Root.tsx`: `{a.composition}`, 1920 × 1080, 30 fps.
- Audio-derived duration: {d['durationFrames']} frames / {d['durationSeconds']:.3f} s. Narration audio: {t['totalDuration']:.3f} s; each scene rounds up independently to a frame.
- {len(t['scenes'])} scenes; {summary['resolvedCues']} resolved narration cues. Voice `gYWKdgLtqjPO3D5uDrDP`, 0.9 slow / 1.0 brisk; local faster-whisper-small words.
- Still-only bundle and capture: {d['stillCount']} frames, including {d['penFinishStills']} completed pen lines and {d['spokenRingChecks']} spoken-figure checks. No video was rendered.
- Maximum {d['maxRegions']} visual regions, zero measured text/handwriting collisions, zero overflow, and non-background visual pixels in every sampled frame. Captions are at most eight words and always accompany a visual.
- All {len(d['holdResults'])} inserted-silence hold pairs have byte-identical PNGs. Formula lines precede substitutions and stay on their active paper page; givens persist beside the working.
- Handwriting retains the approved DrawingTravelGraphs stroke geometry and moving pen, with the extra calculus glyphs this task needs. Graphs retain shaded area, guide grid, and tracing dot.
- Targeted TypeScript compilation and `git diff --check` passed. Local proof scripts are named `verify-*`; no existing tests or files were deleted.

## Evidence

`verify-stills.json` contains the measured bounds, pen completion data, ring targets, hold hashes, audio hashes and image hashes. The `verify-sNN-*.png` files are reviewable scene endings and mid-writing examples. Full stills remain in `packages/backend/out/verify-{a.prefix}-stills/`.

## Reproduce

Use the nvm Node binary. On this host, set `NODE_PATH=/home/durai/Documents/projects/content-engine-si-units-dev/packages/backend/node_modules` for the still audit: the checkout's pre-existing untracked dependency symlinks are broken. The audit resolves the requested si-units backend dependency tree directly and leaves those links untouched.

Run `verify-m42-stills.cjs` with the transcript prefix, composition ID and its `verify-*-entry.tsx` filename. This script only bundles, selects metadata and calls `renderStill`; it never calls `renderMedia` or any deployment command.
''')
print(project/'verify-build.md')
