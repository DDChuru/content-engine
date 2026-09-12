# Momentum — authored build verification and A handoff

## Delivery status

Authored lesson only, as explicitly requested for machine B. No Remotion render, preview server, dependency installation, final video, deployment or shared integration edit was performed. Preview and final rendered-media approval remain with Durai on machine A.

## Entry and assets

- Slug: `mechanics-momentum`; syllabus map: `M4.3a`.
- Composition: `MechanicsMomentum`; exported props: `MechanicsMomentumProps`.
- Duration function: `getMechanicsMomentumDuration(fps)`. At 30 fps it returns **8434 frames = 281.1333 s (4:41.13)**. Each scene duration is rounded up independently, matching shared `Lesson`.
- Standalone entry: `packages/backend/src/remotion/compositions/MechanicsMomentum.entry.tsx`; 1920×1080 at 30 fps.
- Composition source: `packages/backend/src/remotion/compositions/MechanicsMomentum.tsx`; unique helpers in `compositions/mechanics-momentum/`.
- Narration script: `packages/backend/projects/mechanics-momentum/narration-plan.json`; production generator: `generate-narration.py`.
- Audio: eight exact scene filenames listed below under `packages/backend/src/remotion/public/audio/mechanics/`.
- Transcript: `packages/backend/src/remotion/public/transcripts/mechanics/momentum.json`.
- Cue mapping: `packages/backend/src/remotion/public/transcripts/mechanics/momentum-cues.json`.
- Learner notes: `apps/student-learn/public/notes/mechanics-momentum.md`.
- Storyboard and source log: `STORYBOARD.md`, `FRAME-LOG.md` in this directory.

## Measured narration

ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`, `eleven_turbo_v2_5`, speed 1.0 brisk / 0.9 slow. Actual word-level transcription uses cached faster-whisper small, CPU int8, two threads, with no model download. On this machine the existing interpreter is `/home/durai/.cache/uv/archive-v0/SbzikYw0T7rgg8b2/bin/python`. The root `.env` is an uncommitted credential input.

Audio totals **280.946939 s** before per-scene frame rounding. There are **532 Whisper words**, **22 numeric figure events**, **4 formula-symbol events**, **12 trolley-label events** and **6 real silent holds** (five 2 s holds and one 3 s thinking hold). Every cue points to an actual word index. All numerical repeats have separate events; default A/B articles are not confused with trolley labels.

| Scene | Audio file | Seconds | Frames at 30 fps | Start frame |
| --- | --- | ---: | ---: | ---: |
| s01 · opening | `momentum-s01.mp3` | 12.956735 | 389 | 0 |
| s02 · definition | `momentum-s02.mp3` | 27.402449 | 823 | 389 |
| s03 · story | `momentum-s03.mp3` | 20.427755 | 613 | 1212 |
| s04 · setup | `momentum-s04.mp3` | 24.267755 | 729 | 1825 |
| s05 · work-a | `momentum-s05.mp3` | 57.704490 | 1732 | 2554 |
| s06 · work-b | `momentum-s06.mp3` | 60.839184 | 1826 | 4286 |
| s07 · check | `momentum-s07.mp3` | 60.107755 | 1804 | 6112 |
| s08 · recap | `momentum-s08.mp3` | 17.240816 | 518 | 7916 |

## Verification completed on B

- `node packages/backend/projects/mechanics-momentum/verify-momentum-authored.cjs`: seven checks passed. It loads the actual exported duration and shared handwriting with existing sibling-workspace dependencies; it creates no browser or render. See `verify-momentum-authored.json` for file hashes and detailed results.
- `python3 packages/backend/projects/mechanics-momentum/verify-momentum-narration.py` (the available cached interpreter was used): all scene audio hashes, ffprobe durations, word/cue bindings, planned numeric/symbol/trolley rings, pen completion, next-beat boundaries and decoded PCM silence checks passed. The verifier itself only needs Python standard library and FFmpeg.
- Complete native-rate floating-point decode of all eight MP3s passed; no samples reached ±1.0.
- All 19 handwritten lines use supported existing glyphs. Complete stroke extents fit the paper: maximum right 738.82 px of 790; maximum bottom 629.05 px of 730.
- Actual motion follows constant velocities at one spatial scale. A moves right and B left with speed ratio 1.5; both centres cross x=450 at the spoken pass cue. The explicit freeze is continuous and subsequent calculation scenes reuse its exact positions. Synthetic holds also preserve continuity.
- Wheel centres and radii put both wheels on their actual horizontal rails. Velocity arrows use a common 24 px per m/s scale (144:96), while derived momentum arrows have equal lengths.
- Arithmetic was checked independently: right-positive gives 2×(+6)=+12 and 3×(−4)=−12 kg m/s; left-positive gives −12 and +12 with unchanged physical directions.
- Read-only content review confirmed full givens/conditions before explanation, formula-first working, numeric result replacements at the spoken twelve cues, three-region layout logic and source boundaries. The missing m/v rings found in that review were added and reverified.
- `git diff --check` passed. Only Momentum paths are staged; the seeded changes in mechanics-syllabus-map remain untouched.

## Preview review on A

The dependency-free clone cannot provide full semantic TypeScript checking or rendered visual evidence. Run the normal scoped TypeScript and notes-renderer checks on A, then use the standalone entry for a preview with `src/remotion/public` as the public asset root. The parent owns Root/registry/syllabus/notes-index integration. No final video should be rendered before Durai approves a concrete preview.

Inspect actual frames for complete problem wording, labels and rings, font and stroke extents, all 19 finished ink lines, both rail contacts, motion extremes, genuinely frozen holds, equal momentum-arrow lengths, and unchanged physical directions under the new sign convention. The static verifier is not a substitute for those rendered checks.

Useful result frames (zero-based, 30 fps):

| Result | Local spoken-word cue / s | Last unknown frame | First result frame |
| --- | ---: | ---: | ---: |
| s05 / result-a | 42.77000 | 3837 | 3838 |
| s06 / result-b | 35.21000 | 5342 | 5343 |
| s07 / result-a | 31.82000 | 7066 | 7067 |
| s07 / result-b | 43.89000 | 7428 | 7429 |

## Source scope decisions

The 67.3472 s recording has no audio stream and was visually studied at every integer second 0–67. Its final promotional/browser tail adds no mechanics. This lesson keeps the definition, unit product, vector nature and the recorded signed-product comparison type. It uses original 2 kg / 6 m/s right and 3 kg / 4 m/s left trolleys on separate tracks. Changing the positive direction is a check of the same situation, not another trial.

The PDF contains additional contact-transfer/racket material; it is excluded, along with total-system momentum, collision conservation, impulse, restitution and energy. No PDF bridge was needed. The opening uses the exact labelled page-32 definition fragment, not the collision excerpt. The later Power/lifts reference files named in the brief are absent from this checkout, so the existing shared-presentation MechanicsUsingCalculusIn1D sibling supplies the component structure.

No files were deleted. No sibling lesson or Fable comparison files were changed.
