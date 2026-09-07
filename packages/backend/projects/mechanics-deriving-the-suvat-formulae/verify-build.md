# MechanicsDerivingSuvat — build verification

- Registered by hand in `Root.tsx`: `MechanicsDerivingSuvat`, 1920 × 1080, 30 fps.
- Audio-derived duration: 10095 frames / 336.500 s. Narration audio: 336.327 s; each scene rounds up independently to a frame.
- 8 scenes; 52 resolved narration cues. Voice `gYWKdgLtqjPO3D5uDrDP`, 0.9 slow / 1.0 brisk; local faster-whisper-small words.
- Still-only bundle and capture: 263 frames, including 22 completed pen lines and 121 spoken-figure checks. No video was rendered.
- Maximum 3 visual regions, zero measured text/handwriting collisions, zero overflow, and non-background visual pixels in every sampled frame. Captions are at most eight words and always accompany a visual.
- All 16 inserted-silence hold pairs have byte-identical PNGs. Formula lines precede substitutions and stay on their active paper page; givens persist beside the working.
- Handwriting retains the approved DrawingTravelGraphs stroke geometry and moving pen, with the extra calculus glyphs this task needs. Graphs retain shaded area, guide grid, and tracing dot.
- Targeted TypeScript compilation and `git diff --check` passed. Local proof scripts are named `verify-*`; no existing tests or files were deleted.

## Evidence

`verify-stills.json` contains the measured bounds, pen completion data, ring targets, hold hashes, audio hashes and image hashes. The `verify-sNN-*.png` files are reviewable scene endings and mid-writing examples. Full stills remain in `packages/backend/out/verify-deriving-suvat-stills/`.

## Reproduce

Use the nvm Node binary. On this host, set `NODE_PATH=/home/durai/Documents/projects/content-engine-si-units-dev/packages/backend/node_modules` for the still audit: the checkout's pre-existing untracked dependency symlinks are broken. The audit resolves the requested si-units backend dependency tree directly and leaves those links untouched.

Run `verify-m42-stills.cjs` with the transcript prefix, composition ID and its `verify-*-entry.tsx` filename. This script only bundles, selects metadata and calls `renderStill`; it never calls `renderMedia` or any deployment command.

## Suvat-specific checks

The source route is the constant-acceleration velocity–time graph, then algebraic substitution. The graph labels u, v, t, a and s before working begins. The gradient triangle gives `a = (v − u)/t`, then `v = u + at`. The shaded trapezium identifies u and v as the parallel sides and t as the width, yielding `s = ½(u + v)t`. Substituting for v and u yields `s = ut + ½at²` and `s = vt − ½at²`.

The six-line time-elimination page retains the area formula while deriving `t = (v − u)/a`, substituting it, using the difference of squares, and obtaining `v² = u² + 2as`. The diagram states `a ≠ 0` before division. The final contrast checks `a = 0`, when v = u and the identity still holds. The below-axis area contrast changes at the locally transcribed word “if”. All diagrams, including the positive shaded trapezium in `verify-trapezium.png`, were visually inspected. The close selects equations by the omitted quantity and holds the question for three seconds before revealing the time-free equation.

`verify-suvat-cues.py` independently checks all five identities with exact arithmetic, signed inputs and zero acceleration. Stage 1 commit: `d54356b` (pushed with merge `05b9751`). No source integration illustration or new numerical worked example was added.
