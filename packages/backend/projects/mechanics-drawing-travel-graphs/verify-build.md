# Drawing travel graphs — revision verification

Verified 2026-09-06. Revision of `8e19ecf`, after reading TEACHING-STANDARD.md §9 and the earlier Sol composition at `1dc49cb`. Narration/transcript stage is pushed in `d685c16`, with the braking narration refinement in `dc3b1bc`. Composition ID, export names, Root registration and transcript filename remain the same. No video render was run.

## Requested changes

1. **Story before maths.** S08 plays immediately after S01 outcomes, before any graph. A cyclist moves along a plain track from A, with rotating wheels and pedalling, cruising, visibly slowing to a stop, resting for an inserted two seconds, turning and accelerating back, then returning home. Track markers mark the legs. Only already-spoken numbers appear on the replacing card; no axes or equations appear in this scene. The braking narration dwells on “slower and slower” so the motion is visible. Animation timing follows the spoken phases.
2. **Spoken graph signposts.** Exact cards: “Now the velocity–time graph.” and “Now the displacement–time graph.” Each is spoken, followed by 1.5 seconds of inserted silence, before its graph appears. Five signpost holds cover the two concept graphs, the velocity build, the paired displacement comparison and the closing displacement build. Headers explicitly identify the graph. S03, S04 and S07 retain their spoken setup over bare axes through “let’s get drawing”.
3. **Restored graph visuals.** The earlier shaded phase polygons, matching segment accents, moving curve dots and paired graph treatment are restored for the recorded cyclist. S05 shows one journey in two graphs, with the same accent and physical instant on both. Its slowing leg makes the curved graph versus straight chord contrast visible. Single-graph regions are 1,030 pixels wide versus 850 previously (about 21% larger); paired graphs each occupy a 900-pixel region. The graphite/paper palette, handwritten working, emphasis rings and fade-through transition remain. No extra fourth panel, interface chrome, micro-labels or step chips were added.

## Journey and source scope

FRAME-LOG.md f015/f030 specifies **constant 6 m/s for the first 10 seconds**, so that phase and all existing calculations are preserved. The visible speed-up occurs on the return. The starting point is called A consistently throughout the revision. This resolves the requested story wording against the retained numerical journey without inventing a new first leg. There is no ball or additional example.

Source mapping: S01 f001–f003 plus Cambridge 4.2; S08 f015–f025 plus the requested §9 animation; S02 f004–f013; S03 f015–f039; S04 f040–f056; S05 f057–f073 plus the existing curve/chord contrast; S06 f012–f014 and f074–f080; S07 f057–f073 plus §7 annotations. The original syllabus card and the three outcomes remain. S06 ticks those same outcomes before the full annotated journey closes the video.

Opening excerpt, Cambridge 9709 (2026–2027), 4.2, printed/PDF p.32: “sketch and interpret displacement–time graphs and velocity–time graphs”. [Official syllabus PDF](https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf).

The retained phase boundaries are 0, 10, 22, 27, 31 and 53 seconds. Signed areas are +60, +36, 0, −8 and −88 m; displacement points are (0,0), (10,60), (22,96), (27,96), (31,88), (53,0). Return time remains T = 53 s. The final handwritten gradients remain +6, average +3, 0, average −2 and −4 m/s. Curved legs distinguish average chord gradients from changing tangent gradients. The Paper 4 convention remains g = 10 m s⁻²; this journey requires no gravity calculation.

## Narration and timing

Eight scenes in the playback order below. Stable IDs preserve filenames: the new S08 audio is inserted second. S01 MP3 is byte-for-byte unchanged from `8e19ecf`; only new/changed scenes were re-voiced. Changes elsewhere are graph signposts or the origin name A. Voice `gYWKdgLtqjPO3D5uDrDP`, ElevenLabs via narration_client.py, speed 0.9 slow / 1.0 brisk. The explicitly requested slow story is a third slow scene alongside the existing two.

**310.334695 seconds of audio (5:10.33)**, within 5:15. Composition: **9,315 frames / 310.50 seconds at 30 fps**, covering every narration track. **100 cues**, all locally resolved.

| Scene | Tempo / speed | Audio seconds | Cues | Frames |
| --- | --- | ---: | ---: | ---: |
| S01 — What you will learn | brisk / 1.0 | 25.051 | 6 | 752 |
| S08 — Follow the cyclist | slow / 0.9 | 38.034 | 14 | 1142 |
| S02 — Read the graph correctly | brisk / 1.0 | 24.059 | 7 | 722 |
| S03 — Velocity–time graph | brisk / 1.0 | 38.844 | 16 | 1166 |
| S04 — Find when the cyclist returns | slow / 0.9 | 52.036 | 16 | 1562 |
| S05 — One journey, both graphs | brisk / 1.0 | 25.992 | 6 | 780 |
| S06 — Check before the final journey | brisk / 1.0 | 27.768 | 8 | 834 |
| S07 — Displacement–time journey close | slow / 0.9 | 78.550 | 27 | 2357 |

The generator inserts exact silence for written holds, including decimal 1.5-second holds. Audio hashes and voice/speed metadata match the final eight MP3s. Decoded samples inside every inserted pause/hold were checked for silence; cues resolve outside those silent intervals.

## Still and motion audit

**163 stills passed**: every cue, both endpoints of every hold, completed velocity segments, the three setup endings, twelve story-motion samples plus home arrival, and paired tracing samples. The audit measured a maximum of **3 regions** including the header and **8 words per card or handwritten line**. No overflow. **Zero axis collisions**, including both graphs in the paired view.

The axis check compares visible axis text against other axis text, tick strokes, complete curve bounds and handwritten annotations with a two-pixel margin. Time labels stay below the plot, and `t / s` stays beyond the final tick. The 88/96 labels remain separate. In the paired view, both tracing dots use the same physical time; their equality is asserted in the audit.

All **19 hold pairs** have identical PNG hashes:

- Twelve ringed numerical results, 60 frames each (seven area results and five closing gradients).
- One motionless cyclist rest, 60 frames.
- One understanding question, 90 frames.
- Five plain graph signposts, 45 frames each; the audit explicitly verifies the exact card, two regions and no axes.

Story samples verify constant outward motion, decreasing movement increments while braking, increasing reverse movement increments while accelerating, constant return motion, wheel rotation while moving, and arrival at A. The rest is included in the frozen-image comparison. Story stills are asserted to have no axis text. Visual inspection covered the story/rest, signposts, larger graph builds, shaded calculations, paired curve/chord comparison and annotated close.

The first pass checked the whole composition. After refining the story timing and the paired comparison, every S08 and S05 audit frame was regenerated; the entire measurement set, motion assertions and all 19 hold pairs were then checked again. Other scene timings and visuals were unchanged between those passes.

Evidence: [verify-build.json](verify-build.json), including per-still counts and bounds, axis rectangles, hold hashes, motion samples, scene/audio metadata and final source hashes. Local PNGs are in `/tmp/verify-travel-revision-stills`; the final bundle is `/tmp/verify-travel-revision-bundle`.

## Validation and reproduction

Passed: targeted strict TypeScript for MechanicsDrawingTravelGraphs.tsx; Python compilation of narration, transcription and audit scripts; audio/cue/silence integrity; `git diff --check`; and `npx remotion compositions`, which lists MechanicsDrawingTravelGraphs at 1920×1080, 30 fps, 9,315 frames.

From `packages/backend`, with nvm Node on PATH, reproduce the full still audit:

```sh
npx remotion bundle src/remotion/Root.tsx
python3 src/scripts/verify-mechanics-drawing-travel-graphs.py --workers 3
```

No files were deleted in this revision. Video rendering remains for the other machine.
