# Displacement–time graphs: additive build verification

Status: PASS. 515 final stills; zero printed-text, handwriting, ring-clearance or panel-bound violations; all 47 spoken-figure references and active substitution sources verified. All 14 hold pairs have identical geometry and byte-identical PNGs after consecutive recapture. No blank captures. Independent physics, decoded-audio silence, targeted TypeScript, and `git diff --check` passed.

## Scope and preservation

All ten original scene components remain in order, with their graph/track visuals, colour-linked paths, tangent, endpoint diagram, odometer, clock and recap pictures. Added the syllabus/outcomes opening and a cyclist journey immediately before the original recap. The worked walker now opens on its labelled track and three-line givens card. Its existing calculations have formula-first pen passes in the original panels. Only lab-chrome words were removed.

The composition ID, Root registration, audio filename pattern and transcript filename are unchanged. S01–S06 and S10 MP3s match `b383a44` byte-for-byte. New/changed narration uses ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`, speed 0.9, except the 1.0 syllabus opening. Local faster-whisper-small supplies the word list and all cue times. The registered composition is 9,827 frames at 30 fps (5:27.57), including transitions. Encoded narration is 326.896327 seconds; the cyclist scene is 89.808980 seconds. Fourteen PCM-inserted holds: thirteen at 2 seconds and one prediction pause at 3 seconds. Silence is independently checked from decoded MP3 samples.

## Journey and annotation checks

Independent calculation: accelerate from rest at 1 m s⁻² for 2 s, reaching 2 m and 2 m/s; cruise for 3 s to 8 m; rest 2 s; return at −2 m/s for 4 s to the origin. Endpoints: (0,0), (2,2), (5,8), (7,8), (11,0). Chord gradients: +1, +2, 0, −2 m/s. The curved leg's tangent has changing instantaneous velocity. A dashed, shallower return illustrates the slower-return question. This scene uses displacement–time only.

Each leg's numerical handwriting has a dedicated lined strip below the graph, cleared for the next leg. Full final stroke geometry—including stroke width—is checked against the panel and every printed text range, even mid-write. Δs/Δt marks occupy the graph, with printed meaning captions beside it. The problem card and time-labelled track precede axes. The story's movement follows the actual narrated leg cues.

Forty-five worked-example figure events plus the two unchanged conceptual references to zero are checked at their Whisper word timestamps and after the ellipse completes. Source figures are also ringed throughout numerical pen substitutions. Ellipses are loose SVG paths drawn over 0.4 seconds, held and faded. Problem phrases receive underline sweeps. The zero-velocity reference during rest points to a rest readout, rather than the earlier tangent readout.

## Still audit

The verifier initializes an ordinary Remotion still and then seeks the same local browser tab for separate PNGs; it does not encode video. It keeps a local static server alive for fonts and waits for the frame's measured DOM before each capture. It audits cue frames, spoken-figure onset/completion, every handwriting stroke finish, scene openings/endings and hold endpoints. It checks all printed text, full ink extents, ring-versus-caption clearance, ring enclosure, panel bounds, visible substitution sources and region count. Pixel checks reject blank captures.

Original four-region S06 and recap montage S10 arrangements are retained under the additive exception. New/changed layouts have at most three regions. Transition layers are measured separately; collisions within each layer are still checked. Mathematical overbars belong to their own symbols and are not classified as colliding captions.

Hold endpoints must have identical measured geometry, handwriting, rings and figure positions. PNGs are also compared: the permitted raster tolerance is fewer than 20 pixels differing by more than 10 levels and total channel-maximum difference below 5,000 across the 960×540 image. This accounts for Chrome GPU dithering without allowing visible motion.

## Reproduce

From the repository root, with the nvm Node path enabled:

```sh
node packages/backend/src/scripts/verify-displacement-stills.cjs
python3 packages/backend/src/scripts/verify-displacement-build.py
```

Narration tooling: `verify-displacement-narration.py` reads the storyboard and calls `narration_client.py`; `verify-displacement-transcribe.py` resolves local Whisper words and figure targets. The local Whisper environment is `/tmp/si-units-faster-whisper/bin/python`. Narration generation reads the authorised sibling `.env` without printing credentials.

Artifacts: `packages/backend/out/verify-displacement-stills/verify-measurements.json`, per-frame JSON and PNGs, and a source/transcript SHA-256 manifest. `--reuse-measurements` rechecks completed captures only when that fingerprint matches. The final check reused these same fresh captures after tightening the distinction between an active pen substitution and its completed line; source visibility is required at both, while the source ring is required during writing. No video render, deployment, destructive git operation or file deletion was performed.
