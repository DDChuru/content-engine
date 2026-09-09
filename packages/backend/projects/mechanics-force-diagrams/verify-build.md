MechanicsForceDiagrams (`mechanics-force-diagrams`, M4.1) is registered in the real
Root.tsx at 1920×1080, 30 fps, 10,650 frames / **5:55**. The duration is the sum
of each delivered MP3 duration rounded up to its scene's frame boundary.

Stage 1 was committed and pushed as `e604091`: storyboard, eight ElevenLabs
recordings using `gYWKdgLtqjPO3D5uDrDP`, speeds 0.9 / 1.0, inserted PCM silence,
local faster-whisper-small transcription, and resolved cues. The narration proof
records 354.899593 seconds, 97 word-edge cues, 57 spoken-figure events and 25
verified silent intervals, including the full three-second check-question hold.
No scripted words are missing; Whisper repeats one “m” in its symbolic-weight
recognition, retained transparently in the transcript and proof.

The composition follows the recording's six sequences. Weights stay symbolic;
there is no numerical working or force resolution. The rough-slope contrast is
explicitly requested in the brief. Actual acceleration arrows are dashed and
separate, with positive directions stated. Braking includes tyre friction once.
The light pulley is explicitly massless. The final connector comparison is
labelled as connector forces only; it demonstrates tension, thrust and a slack
string without presenting an incomplete full-body diagram as a complete one.

Verification artifacts:

- `verify-narration.json`: voice, speeds, hashes, local word cues, speech coverage
  and actual silent PCM intervals.
- `verify-stills.json`: 282 stills, at most three regions, printed and handwritten
  label extents, sampled force-arrow geometry, clipping, visible diagram pixels,
  32 pen-finish checkpoints, 57 spoken-ring checkpoints, and 25 held image pairs.
  Held pairs require exact pixel equality; the runner recaptures occasional Chrome
  tile-edge raster artifacts, retaining the strict equality check.
- `verify-diagrams.json`: symbolic downward weights, normal slope reaction,
  downhill friction, equal connected tensions, hanging weight exceeding tension,
  pulley support direction and massless label, connector-force directions,
  braking state, smooth contrast, and a 90-frame unanswered full-diagram check.
- `verify-root.json`: bundle and select the actual Root.tsx registration.
- `verify-*.png`: completed scenes and focused evidence for two-string suspension,
  driving/braking, rough slope, isolated pulley, tension/thrust, handwriting,
  a spoken-arrow ring, and the unanswered check.

The focused TypeScript check passes using the installed React declarations:

```sh
export PATH="$(ls -d ~/.nvm/versions/node/*/bin | sort -V | tail -1):$PATH"
packages/backend/node_modules/.bin/tsc --noEmit --strict --skipLibCheck \
  --esModuleInterop --resolveJsonModule --jsx react --target ES2022 \
  --moduleResolution node \
  --typeRoots /tmp/verify-equilibrium-node/node_modules/@types \
  packages/backend/src/scripts/verify-force-diagrams-entry.tsx
node packages/backend/src/scripts/verify-force-diagrams-stills.cjs
python3 packages/backend/src/scripts/verify-force-diagrams-report.py
node packages/backend/src/scripts/verify-force-diagrams-root.cjs
```

The full backend TypeScript command already failed before implementation, including
missing React declarations and unrelated backend errors; its baseline was captured
in `/tmp/verify-force-diagrams-baseline-types.log`. The focused check and real Root
bundle avoid claiming that the entire backend is type-clean.

The existing mechanics pen component gains only eight lines for required force
label glyphs. No files were deleted. No video was rendered and no deployment,
publishing or release command was run. Follow-up: reviewer visual/content review.
