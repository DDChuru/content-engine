# Drawing travel graphs — build verification

Verified 2026-09-06. Stage 1 narration/transcript commit: `da90e4b`. Composition ID, export names and Root registration are preserved. No video render was run.

## Scope and teaching standard

All eight sections of TEACHING-STANDARD.md govern this rebuild. FRAME-LOG.md confirms the cyclist journey only. The ball, lift and other journeys from the old NOTES/storyboard are excluded under the explicit recording ceiling; no ball calculation is claimed. The Paper 4 convention remains g = 10 m s⁻², but this recorded journey needs no gravity calculation.

Opening exact Cambridge 9709 (2026–2027), 4.2 excerpt, printed/PDF p.32: “sketch and interpret displacement–time graphs and velocity–time graphs”. Source: https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf, fetched with curl and extracted with pdftotext. The syllabus map records the excerpt.

The three outcomes are repeated verbatim and ticked in S06:

1. Turn journey descriptions into graph shapes.
2. Use signed area to find displacement.
3. Explain a journey using displacement-time gradients.

Source coverage: S01 f001–f003 plus the required syllabus opening; S02 f004–f013; S03 f015–f039; S04 f040–f056; S05 f008–f011 and f066–f071; S06 f012–f014 and f074–f080; S07 f057–f073, expanded only to show the requested gradient annotations. Recap precedes the final worked journey, which closes the video.

S03, S04 and S07 each deliver a situation/goal/idea setup over bare axes through the final word of “let’s get drawing”. S04 then uses an explicit two-second silent drawing pause to restore the velocity graph. S05 contrasts curved displacement with the incorrect straight-chord assumption. S06 asks whether negative velocity requires negative displacement, followed by three seconds of silence.

## Timing and narration

Seven scenes; only S04 and S07 are slow. ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`; speed 1.0 brisk and 0.9 slow. Audio duration is **272.065 seconds (4:32.065)**. Scene frame rounding yields **8,167 frames / 272.233 seconds at 30 fps**, covering every audio file. All **81 word cues** resolve against the local transcript.

| Scene | Tempo / speed | Audio seconds | Cues | Frames |
| --- | --- | ---: | ---: | ---: |
| S01 — What you will learn | brisk / 1.0 | 25.051 | 6 | 752 |
| S02 — Read the graph correctly | brisk / 1.0 | 31.138 | 6 | 935 |
| S03 — Draw the cyclist’s velocity | brisk / 1.0 | 43.938 | 15 | 1319 |
| S04 — Find when the cyclist returns | slow / 0.9 | 52.036 | 16 | 1562 |
| S05 — Choose straight lines or curves | brisk / 1.0 | 18.051 | 4 | 542 |
| S06 — Check before the final journey | brisk / 1.0 | 26.802 | 8 | 805 |
| S07 — Explain the whole journey | slow / 0.9 | 75.050 | 26 | 2252 |

Written pauses are inserted silence, not spoken stage directions. Twelve result holds last 60 frames each: seven area/calculation results in S04 and five journey gradients in S07. The question hold lasts 90 frames. Decoded audio was checked for silence inside every inserted hold/pause, and narration metadata hashes match the seven MP3s. Narration cache keys include provider, voice, speed and text.

## Mathematical and visual checks

The recorded cyclist has velocities +6, 0 and −4 m/s, with phase boundaries 0, 10, 22, 27, 31 and 53 seconds. Outward displacement is 60 + 36 = 96 m. The reverse acceleration covers 8 m; the remaining 88 m takes 22 seconds, so return time T = 53 s. Displacement points are (0,0), (10,60), (22,96), (27,96), (31,88), (53,0).

The closing graph is drawn leg by leg. Each leg receives handwritten Δs, Δt, a gradient calculation, its sign/physical meaning, and a ringed two-second hold. Curved sections explicitly label chord gradients as average velocity (+3 and −2 m/s) and explain changing tangent gradients (6 to 0 and 0 to −4 m/s). The other gradients are +6, 0 and −4 m/s. One annotation is written at a time; previous-leg annotations clear before the next leg.

The graphite/paper palette, one green accent, plain headers, pen-driven SVG strokes and graphite fade-through match Modelling Assumptions. No captions, decorative micro-labels, step chips or interface chrome were added.

## Still audit

**115 stills passed**, covering all 81 cues, both endpoints of 13 holds, five completed velocity segments and three setup endings. Measured maximum: **3 visual regions** including the header and **8 words per card or handwritten line**. No overflow. All 13 hold pairs have identical PNG hashes.

The axis check compares visible text bounding boxes against other axis text, tick strokes, complete curve bounds and handwritten annotation bounds, with a two-pixel clearance margin. It found **0 collisions**. Time values sit below the full plot; `t / s` sits beyond the final tick. The close 88/96 displacement labels also remain separate. Setup-ending stills contain only header and bare axes. All contact sheets and the completed final journey were inspected visually.

Machine-readable evidence, including per-still measurements, axis rectangles, hold hashes, scene metadata and audio hashes: [verify-build.json](verify-build.json). Local stills/contact sheets: `/tmp/verify-travel-stills`.

Validation passed:

- Targeted strict TypeScript check of MechanicsDrawingTravelGraphs.tsx.
- Python compilation of the narration, transcription and still-audit scripts.
- Audio hash, voice/speed, inserted-silence, cue-boundary and source-number checks.
- `npx remotion compositions`: MechanicsDrawingTravelGraphs, 1920×1080, 30 fps, 8,167 frames.
- `git diff --check`.

Reproduce the still audit from `packages/backend` with nvm Node on PATH:

```sh
npx remotion bundle src/remotion/Root.tsx
python3 src/scripts/verify-mechanics-drawing-travel-graphs.py --workers 3
```

This produces still images only. The first pass audited all 115 frames; after the final S07 pen-timing adjustment, every S07 audit frame was regenerated and the complete measurement set and all 13 hold pairs were checked again.

## Deleted path

- `packages/backend/src/remotion/public/audio/mechanics/drawing-travel-graphs-s08.mp3` — obsolete eighth-scene audio; the replacement has seven scenes and ends on the annotated journey.

Video rendering remains for the other machine.
