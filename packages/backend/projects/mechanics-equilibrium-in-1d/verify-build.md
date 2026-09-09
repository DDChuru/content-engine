# MechanicsEquilibriumIn1D — build verification

Map M4.1; slug `mechanics-equilibrium-in-1d`. Built against TEACHING-STANDARD.md §§1–14, PACING.md, FRAME-LOG.md and NOTES.md. The approved Multiple Collisions stroke player supplies the handwriting geometry; the animated parcel, force diagrams and moving trolley follow the supplied house-style references.

## Delivered

- Seven scenes. Audio: **267.023673 s**. Composition: **8014 frames / 267.133333 s (4:27.13)**, 1920×1080 at 30 fps. Duration comes from the seven encoded MP3 durations, each rounded up to a frame.
- ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`; speeds 0.9 for the two slow scenes (52.92 s and 74.89 s), 1.0 otherwise. Actual inserted silence, including the three-second check hold.
- `equilibrium-in-1d-s01.mp3` through `s07.mp3`; transcript `equilibrium-in-1d.json`. Local faster-whisper-small transcription, isolated by measured speech beat. All 67 visual cues and 44 spoken-figure cues resolved; five additional source rings follow the pen's actual arrival during substitution.
- Exact, attributed 4.1 syllabus excerpt with motif; three outcomes repeated verbatim with ticks. Resultant/sign contrast; moving story before the complete problem; formula-first handwritten solution; values returned to the diagram; weight and `g = 10 m s⁻²`; constant-velocity check and recap.
- Recording equation preserved: `10 + (18 + x) = 5x → 28 + x = 5x → 28 = 4x → x = 7`. Upward and downward totals both 35 N; resultant 0 N. The optional PDF shop-sign calculation is omitted to keep the short-source scope and holds.

## Verification

The committed [narration proof](verify-narration.json) checks audio hashes, voice/speed, encoded duration, local word-edge cues, and PCM silence (RMS below 3 in the quiet interiors). No speech timestamps fall inside the holds.

The committed [still proof](verify-stills.json) records the final still count, every completed handwriting line, every hold pair and the source/artifact hashes. The [contact sheet](verify-contact-sheet.jpg) shows representative rendered frames; full PNGs and geometry artifacts remain in `packages/backend/out/verify-equilibrium-stills/`.

**Final result: 263 stills passed, 49 figure events verified, all 11 holds identical, and all 11 handwriting lines complete with the pen cleared.** Five hold pairs needed one repaint each; none required a tolerance or a waived check.

The still audit covers scene boundaries, visual cues, all spoken and substituted figures, problem-phrase underlines, handwriting start/midpoint/finish, and all 11 hold pairs. It checks ≤3 regions including the header, card word counts, text/arrow/handwriting collisions, pen finish and paper clearance, figure-ring presence and enclosure, all original givens throughout the calculation, formula order, and visible pixels in **every** diagram/paper region. Holds must have byte-identical PNGs at their endpoints. The verifier retries an endpoint pair up to three times for the Chromium SVG paint race already documented in the reference verifier; a mismatch after retries fails.

Focused strict TypeScript compilation passes for the composition, handwriting helper and standalone audit entry. Root.tsx contains exactly one hand-appended registration, with the required ID, component, dimensions, frame rate and audio-derived duration. `git diff --check` passes.

## Reproduce (stills only)

From the repository root, with the shared dependencies available:

```sh
export PATH="$(ls -d ~/.nvm/versions/node/*/bin | sort -V | tail -1):$PATH"
node packages/backend/src/scripts/verify-equilibrium-stills.cjs
/tmp/verify-equilibrium-venv/bin/python packages/backend/src/scripts/verify-equilibrium-narration.py
/tmp/verify-equilibrium-venv/bin/python packages/backend/src/scripts/verify-equilibrium-report.py
```

The temporary Python environment on host B contains numpy, requests, python-dotenv, faster-whisper and Pillow. The existing shared installation lacks React declarations, so the focused type check uses temporary `@types/react@19` and `@types/react-dom@19` under `/tmp/verify-equilibrium-node`, without changing package manifests:

```sh
./node_modules/.bin/tsc --noEmit --strict --skipLibCheck --jsx react \
  --esModuleInterop --resolveJsonModule --target ES2022 --module commonjs \
  --moduleResolution node --typeRoots /tmp/verify-equilibrium-node/node_modules/@types \
  packages/backend/src/scripts/verify-equilibrium-entry.tsx
```

Stage one narration commit: `4ad767c`, pushed with the concurrent upstream work preserved. Stage two contains the composition, Root registration and verification evidence. No video render or deployment was performed. No tracked files were deleted and no `review-*` files were touched.
