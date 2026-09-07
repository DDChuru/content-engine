# MechanicsUsingCalculusIn1D — build verification

- Registered by hand in `Root.tsx`: `MechanicsUsingCalculusIn1D`, 1920 × 1080, 30 fps.
- Audio-derived duration: 10483 frames / 349.433 s. Narration audio: 349.257 s; each scene rounds up independently to a frame.
- 8 scenes; 57 resolved narration cues. Voice `gYWKdgLtqjPO3D5uDrDP`, 0.9 slow / 1.0 brisk; local faster-whisper-small words.
- Still-only bundle and capture: 289 frames, including 29 completed pen lines and 129 spoken-figure checks. No video was rendered.
- Maximum 3 visual regions, zero measured text/handwriting collisions, zero overflow, and non-background visual pixels in every sampled frame. Captions are at most eight words and always accompany a visual.
- All 15 inserted-silence hold pairs have byte-identical PNGs. Formula lines precede substitutions and stay on their active paper page; givens persist beside the working.
- Handwriting retains the approved DrawingTravelGraphs stroke geometry and moving pen, with the extra calculus glyphs this task needs. Graphs retain shaded area, guide grid, and tracing dot.
- Targeted TypeScript compilation and `git diff --check` passed. Local proof scripts are named `verify-*`; no existing tests or files were deleted.

## Evidence

`verify-stills.json` contains the measured bounds, pen completion data, ring targets, hold hashes, audio hashes and image hashes. The `verify-sNN-*.png` files are reviewable scene endings and mid-writing examples. Full stills remain in `packages/backend/out/verify-using-calculus-in-1d-stills/`.

## Reproduce

Use the nvm Node binary. On this host, set `NODE_PATH=/home/durai/Documents/projects/content-engine-si-units-dev/packages/backend/node_modules` for the still audit: the checkout's pre-existing untracked dependency symlinks are broken. The audit resolves the requested si-units backend dependency tree directly and leaves those links untouched.

Run `verify-m42-stills.cjs` with the transcript prefix, composition ID and its `verify-*-entry.tsx` filename. This script only bundles, selects metadata and calls `renderStill`; it never calls `renderMedia` or any deployment command.

## Calculus-specific checks

Both recorded examples are retained within FRAME-LOG.md's ceiling. The first explicitly states `s(0) = +1 m`; its negative-side contrast states `D = −1`. The main example yields `a = 6t − 12`, `s = t³ − 6t² + 9t`, first rest at 1 s, signed legs +4 m and −4 m, distance 8 m and average speed 8/3 ≈ 2.67 m s⁻¹. The maximum-speed check compares |v| at 0, 2 and 3 s, yielding 9, 3 and 0 m s⁻¹. It therefore identifies the endpoint maximum rather than treating a = 0 as sufficient.

The displacement graph completes before the velocity graph is introduced beside it. Scene endings and mid-pen frames were visually inspected, including the initial constants, displacement curve, shaded signed areas and maximum-speed comparison. One hold pair required one repeat for Chrome anti-aliasing variance; the final pair is byte-identical. Stage 1 commit: `21e8668` (pushed with merge `efd7fd4`).
