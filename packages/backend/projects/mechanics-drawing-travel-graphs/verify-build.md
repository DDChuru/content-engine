# Drawing Travel Graphs — version 4 verification

Built from Sol’s original `1dc49cb`, as requested in TEACHING-STANDARD.md §12. Stage 1 narration/storyboard commit: `83c48cf`, pushed with the unrelated remote changes merged in `68fc722`. The final three-second cyclist question pause and one-second lift/ball drawing pauses were added during verification; no words or original recordings changed in that refinement.

## What changed

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
- **133 stills**, including cue frames, scenario motion samples, displacement completion and both ends of all **20 two-second result holds**. All hold pairs are byte-identical. Chromium raster retries: 9; strict equality remains required.
- **Zero axis-text collisions and zero text overflow.** Actual laid-out SVG text bounding boxes are checked pairwise, including time ticks versus axis names and the lift’s 15/18 labels. Completed handwriting is checked against the scene bounds. The audit waits for layout before measuring.
- New cyclist frames use at most **three regions**: track, displacement graph, velocity graph. Bare setup frames use one. The original four-region lift/ball layouts (object, two graphs, paper) are deliberately retained under Durai’s §12 exception. Recipe/recap also retain their original four-region arrangement; scenario captions are attached to their visual region.
- Motion samples verify steady outward travel, decreasing travel increments under braking, an unmoving rest, and steady negative return. Every sampled frame before the velocity signpost excludes the velocity graph; completed displacement remains visible beside velocity.

Representative reviewed stills:

- [lift, frame 4585](verify-v4-lift.png)
- [ball, frame 7664](verify-v4-ball.png)
- [cyclist-both, frame 10962](verify-v4-cyclist-both.png)
- [cyclist-displacement, frame 10171](verify-v4-cyclist-displacement.png)

Machine measurements are in `verify-build.json`. Full-size source is 1920×1080; audited PNGs are at half scale. Other stills remain in `packages/backend/out/verify-travel-v4-stills` and are reproducible on another host.

Run from `packages/backend` with nvm Node on PATH:

```sh
python3 src/scripts/verify-mechanics-drawing-travel-graphs.py
```

That command bundles only the composition code, renders stills through `renderStill`, and checks physics, layout, graph order, cyclist motion and holds. It never renders a video. For narration, load ELEVENLABS_API_KEY from the existing environment without printing it, run the generator, then run the local transcriber with `--timing /tmp/verify-travel-v4-narration/timing.json`.

## Handoff

No deployment or video render was run. No files, tests or directories were deleted by this task; the initial non-destructive fast-forward and later merge brought in other builders’ existing changes. The original untracked `packages/backend/node_modules` symlink remains untouched. A full video render and human playback review remain for the designated render machine.
