# Drawing Travel Graphs — version 4 verification

Built from Sol’s original `1dc49cb`, as requested in TEACHING-STANDARD.md §12. Stage 1 narration/storyboard commit: `83c48cf`, pushed with the unrelated remote changes merged in `68fc722`. The final three-second cyclist question pause and one-second lift/ball drawing pauses were added during verification; no words or original recordings changed in that refinement.

## Composition-only correction after A-render review

Baseline `06c51f1`; clone fast-forwarded to `67ab41b` before editing. First correction pushed as `30fde6c`.

- Cyclist leg values now occupy one measured row in their own ruled paper strip. Changing legs clears the prior row. The duplicate chord/tangent caption was removed; the unchanged narration already explains it. The complete final stroke geometry, including stroke width, determines audit bounds; layout reserves space for the full text before writing begins.
- The cyclist story has a three-line problem card beside the track, with each leg’s duration and speed, and track markers at 0/14 s, 4 s, and 6/9 s. These givens remain visible during both graph builds. Lift and ball now show their three-line givens cards during the bare-diagram setup as well; their existing working chips remain.
- All nine MP3s and the transcript (including every cue and hold) are byte-for-byte identical to `06c51f1`. No narration, timing, composition ID, Root registration or duration changed.

## What changed in v4

- Restored Sol’s eight scenes, original palette, axes, shaded signed areas, colour-linked segments, tracing dots, lift/ball diagrams, and single-stroke handwritten working. Added S09 immediately before the original S08 recap.
- Lift and ball each begin over their animated bare diagram, followed by two seconds of written silence before graphs or working appear. Each working paper leads with a words statement and symbol formula, spoken as it is written.
- Each lift/ball result has a one-second graph-drawing pause followed by its unchanged two-second frozen hold. The new cyclist close tells the moving story first, then completes all displacement legs before bringing velocity alongside. Δs, Δt and the gradient sign are handwritten on each leg, with a three-second question pause on the first leg and two-second result holds. The rest lasts at least two seconds in the scenario animation.
- Ball uses g = 10 m/s², u = 15 m/s, apex t = 1.5 s and h = 11.25 m, return t = 3 s and v = −15 m/s. The physical scale and result rings agree with those values. The faster-launch contrast retains the same velocity gradient.
- Removed lab words, decorative tags and step-chip rows; retained the graph layouts. Time-axis names now sit beyond the final tick on a separate baseline within the paper background. Close y ticks have adequate space.
- The opening has the exact Cambridge §4.2 graph excerpt with graph motifs, then the same three outcomes that are ticked in recap: “Turn words into graphs”, “Use gradient and area”, “Check signs and shapes”. The original S01 recording plays after the eight-second silent prelude.

## Timing and narration

**11,530 frames at 30 fps = 384.333 s (6:24.3).** Actual audio/lead-in duration: 384.163 s. Cyclist close: 89.757 s. All 70 spoken cues resolve to local faster-whisper timestamps; no fallback cue timings. The silent opening captions are not represented as spoken cues.

Voice `gYWKdgLtqjPO3D5uDrDP` through `narration_client.py`; `ELEVENLABS_SPEED=0.9` for lift, ball and cyclist, 1.0 for brisk originals. S01/S02/S03/S05/S07/S08 audio is byte-for-byte identical to `1dc49cb`, verified by content and SHA-256. The audio filename pattern, transcript filename, composition ID, exported duration function and Root registration remain intact.

| Scene | Tempo / speed | Seconds | Cues |
| --- | --- | ---: | ---: |
| S01 | brisk / 1.0 | 22.393 | 4 |
| S02 | brisk / 1.0 | 18.233 | 4 |
| S03 | brisk / 1.0 | 17.868 | 4 |
| S04 | slow / 0.9 | 94.746 | 15 |
| S05 | brisk / 1.0 | 17.345 | 4 |
| S06 | slow / 0.9 | 90.828 | 14 |
| S07 | brisk / 1.0 | 14.602 | 4 |
| S09 | slow / 0.9 | 89.757 | 17 |
| S08 | brisk / 1.0 | 18.390 | 4 |

## Verification

- Targeted TypeScript check passed for the production composition and still entry; Python compilation and `git diff --check` passed.
- The audit evaluates the actual composition’s motion-model source: lift endpoints (2,3,3), (6,3,15), (8,0,18); ball apex/return; cyclist displacement 0,12,15,15,0; numerical displacement gradients match velocity inside every phase.
- **442 stills**, including all 70 exact cue frames and cue +15 frames, scenario motion samples, displacement completion, and both ends of all **20 two-second result holds**. All hold pairs are byte-identical. Chromium raster retries: 12; strict equality remains required. **244 frames include pen-finish checks**: every individual cyclist stroke completion and every complete handwritten line in lift/ball. Cyclist coverage: 281 stills; the remaining scenes are spot-checked at cues and line ends.
- **Zero axis-text collisions, zero handwriting-versus-print collisions, and zero handwriting panel overflow.** Full final stroke bounds (including 3.1 px stroke width) are checked against all visible printed text-node ranges and the owning paper/graph/annotation-strip bounds, including while writing. This no longer relies on the first visible strokes or the scene edge. The audit waits for layout, and assigns each pen schedule to its actual scene during transitions. An isolated regression fixture restores the overlapping caption row and moves the last value 20 px farther right to prove both caption collision and full-stroke panel overflow are rejected.
- New cyclist frames use at most **three regions**: track, displacement graph, velocity graph. Cyclist setup uses one grouped track/problem-card region; lift/ball setup uses two. The original four-region lift/ball layouts (object, two graphs, paper) are deliberately retained under Durai’s §12 exception. Recipe/recap and outgoing lift/ball transition frames also retain their original four-region arrangement; scenario captions are attached to their visual region.
- Motion samples verify steady outward travel, decreasing travel increments under braking, an unmoving rest, and steady negative return. Every sampled frame before the velocity signpost excludes the velocity graph; completed displacement remains visible beside velocity.

Representative reviewed stills:

- [lift, frame 4585](verify-v4-lift.png)
- [ball, frame 7664](verify-v4-ball.png)
- [cyclist-both, frame 10962](verify-v4-cyclist-both.png)
- [cyclist-displacement, frame 10171](verify-v4-cyclist-displacement.png)
- [cyclist braking annotation, frame 9591](verify-v4-cyclist-braking.png)
- [cyclist setup givens, frame 8305](verify-v4-cyclist-setup.png)
- [lift setup givens, frame 1777](verify-v4-lift-setup.png)
- [ball setup givens, frame 5141](verify-v4-ball-setup.png)

Machine measurements are in `verify-build.json`. Full-size source is 1920×1080; audited PNGs are at half scale. Other stills remain in `packages/backend/out/verify-travel-v4-stills` and are reproducible on another host.

Run from `packages/backend` with nvm Node on PATH:

```sh
python3 src/scripts/verify-mechanics-drawing-travel-graphs.py
node src/scripts/verify-travel-ink-regression.cjs
```

That command bundles only the composition code, renders stills through `renderStill`, and checks physics, layout, graph order, cyclist motion and holds. It never renders a video. The regression command uses an isolated fixture under `out/verify-travel-ink-regression`; it leaves production code untouched. Audio and transcription were not run for this correction.

## Handoff

No deployment or video render was run. No files, tests or directories were deleted by this correction. Work began with `git pull --ff-only origin dev`. The original untracked `packages/backend/node_modules` symlink remains untouched. A full video render and human playback review remain for the designated render machine.
