# MechanicsAccelerationDueToGravity — build verification

- Registered by hand in `Root.tsx`: `MechanicsAccelerationDueToGravity`, 1920 × 1080, 30 fps. Project slug `mechanics-acceleration-due-to-gravity`, map M4.2.
- Audio: 311.432 s. Composition: 9346 frames / 311.533 s (5:11), including per-scene rounding.
- Eight scenes, three slow worked scenes (61.26 s, 58.57 s, 60.26 s). Voice `gYWKdgLtqjPO3D5uDrDP`, speed 0.9 for slow scenes and 1.0 for brisk scenes.
- All 49 beat cues resolved with local faster-whisper-small. Isolated-beat transcription protects leading signs; two short phrases use the complete-scene local pass to avoid omissions/boilerplate. Semantic figure events retain their original word timestamps.
- 274 final stills, including moving-story samples, 16 pen-finish checks and 113 spoken-figure ring checks. At most 3 regions; no measured text/handwriting collisions or overflow. Every sampled frame has visual content and non-background pixels.
- All 25 hold pairs are pixel-identical. The 46 seconds of inserted holds were separately checked for silence. Answer handwriting finishes before the result ring, which completes before its hold.
- 161 sampled working frames retain all relevant givens and the general formula. The final height addition retains the 20 m cliff height and the already-computed 3.2 m rise on the diagram.
- Targeted TypeScript compilation, Python syntax checks, independent arithmetic and `git diff --check` passed.
- No video rendered, no deployment, no deleted files. Stage 1 narration commit: `4cb6a16`, pushed through merge `cae34a6`.

## Teaching and source coverage

Read `TEACHING-STANDARD.md` §§1–14, `PACING.md`, and the approved Multiple Collisions and Drawing Travel Graphs compositions. Opening syllabus excerpt and outcome wording return in the ticked recap. Visuals reuse the existing stroke geometry/pen player; the symmetry graph has a grid, tracing dot and signed shaded areas. Captions accompany diagrams and stay within eight words. Problem phrases underline at local word cues. Stories animate before the givens or working appear.

Gravity is downward and constant, with the Paper 4 convention stated once plainly. All calculations use magnitude 10; upward stays positive. Weight is distinguished from acceleration. The source's 15 m downward example and its dropped-from-rest rule are combined for the user-requested dropped example (the recording's downward launch of 4 m s⁻¹ is not substituted). This adaptation is declared in `STORYBOARD.md`; source `FRAME-LOG.md` and `NOTES.md` remain unchanged.

The dropped stone has u = 0, s = −15 and a = −10, yielding v = −17.3 m s⁻¹. The cliff problem has u = 8, s = −20 and a = −10, yielding positive time 2.95 s and maximum height above sea 23.2 m. Signed impact velocity is labelled velocity. The symmetry statement explicitly applies only to return to launch height without air resistance; a lower-landing extension shows the exception. The check question holds for three seconds before revealing the acceleration value.

## Evidence and reproduction

`verify-stills.json` records bounds, givens, handwritten stroke completion, hold comparisons, source hashes, registration hash and image hashes. The 33 `verify-*.png` files are scene endings, handwriting/pen-finish samples, moving stories and the question hold. All final stills and resumable frame measurements remain in `packages/backend/out/verify-acceleration-due-to-gravity-stills/`.

From the repository root, select the nvm Node binary as requested. Run:

```sh
/tmp/verify-equilibrium-venv/bin/python packages/backend/src/scripts/verify-acceleration-cues.py
node packages/backend/src/scripts/verify-acceleration-stills.cjs
python3 packages/backend/src/scripts/verify-acceleration-build.py
node packages/backend/node_modules/typescript/bin/tsc --noEmit --jsx react --esModuleInterop --resolveJsonModule --moduleResolution node --target es2022 --module commonjs --skipLibCheck packages/backend/src/scripts/verify-acceleration-entry.tsx
```

For narration regeneration, `verify-gravity-narration.py mechanics-acceleration-due-to-gravity` reads the storyboard and the requested sibling `.env` (override with `CONTENT_ENGINE_ENV`). Add `--transcribe`, then run the cue verifier. Python requires requests, numpy and faster-whisper; this host's existing verification venv supplies them. Transcription caches are keyed by audio hash.

The still audit uses only bundling and `renderStill`. It captures serially, saves per-frame measurements and periodically restarts Chrome; this handles the browser closure encountered during a previous non-checkpointed audit.
