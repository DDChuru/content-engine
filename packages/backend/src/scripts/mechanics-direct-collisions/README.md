# Direct Collisions — machine B authoring handoff

- Slug: `mechanics-direct-collisions`; map code: `M4.3b`.
- Composition: `MechanicsDirectCollisions`.
- Duration export: `getMechanicsDirectCollisionsDuration(fps)`; sums each audio scene's frame-rounded duration.
- Source: `directCollisions.mp4` (210.7966 s), studied at every whole second, and `MomentumandCollisions.pdf` pp.4–7. The source-study log lives in ignored `packages/backend/projects/mechanics-direct-collisions/FRAME-LOG.md`.
- `narration.json` is the authored script and semantic cue specification. Generated scene audio and the word-level transcript are separate delivery assets.

## Teaching and scope

One original question compares **two independent trials** with the same initial conditions: A (2 kg) at +4 m/s and B (3 kg) at −1 m/s. Trial 1 gives A's final velocity −2 m/s and derives B's +3 m/s. Trial 2 starts again from the original incoming state, sticks the particles together, and derives their common +1 m/s. This follows the parent handoff's approved example design. It adapts the recording's unknown-mass coalescence question to an unknown common velocity while retaining the joining concept and its combined-mass formula.

The recording's brief separation/explosion illustration does not become an extra example. Impulse, coefficient of restitution, kinetic-energy calculations and later multiple collisions are excluded. The official syllabus p.32 explicitly includes coalescence. The opening quotes its exact direct-impact excerpt, split across two cards.

Every numerical trial has all masses, signed incoming velocities, specified outgoing velocity, conditions and unknowns before working. Right is positive throughout. The initial qualitative story uses dashed trial-direction arrows for unsolved outgoing motion. Concrete after labels replace the unknowns at the actual spoken result word. The before and after layouts stay visible during words → symbolic conservation → substitution → solution. The common after mass and velocity appear only when derived.

The composition follows `MechanicsUsingCalculusIn1D.tsx` and the existing `mechanics-m42/Presentation.tsx` Lesson/Scene/Paper/Figure components. It uses the established `useCue` word-timestamp pattern. Two slow solution scenes use ElevenLabs speed 0.9, completed-result silence holds, and a three-second closing thinking hold. The brief's local Remotion skill was absent on B; the existing composition, shared components and repository architecture documentation supplied the pipeline conventions.

## Delivered files

All paths below are relative to the repository root. Only Direct Collisions authoring files are added.

- `packages/backend/src/remotion/compositions/MechanicsDirectCollisions.tsx`
- `packages/backend/src/remotion/compositions/MechanicsDirectCollisions.entry.tsx`
- `packages/backend/src/remotion/compositions/mechanics-direct-collisions/Motion.ts`
- `packages/backend/src/remotion/public/transcripts/mechanics/direct-collisions.json` — genuine word-level Whisper transcript, 49 cue mappings and 26 spoken-figure events.
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s01.mp3`
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s02.mp3`
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s03.mp3`
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s04.mp3`
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s05.mp3`
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s06.mp3`
- `packages/backend/src/remotion/public/audio/mechanics/direct-collisions-s07.mp3`
- `apps/student-learn/public/notes/mechanics-direct-collisions.md`
- This topic script directory: `README.md`, `SOURCE-STUDY.md`, `STORYBOARD.md`, `narration.json`, `narration-timing.json`, `generate-narration.py`, `verify-authoring.py`, `verify-authoring.json`, `verify-narration.py`, `verify-narration.json`, `verify-source-report.json`, `verify-tsconfig.json`, and `verify-build.md`.

## Audio and checks

The seven MP3s total **302.367347 seconds**. Rounding each scene independently at 30 fps gives **9,075 frames (302.5 seconds)**. The two slow worked scenes last 73.378 and 66.952 seconds. All seven inserted holds (15 seconds total) are real silence; they are not inferred pauses in a transcript.

Generated with ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`, model `eleven_turbo_v2_5`, speed 1.0 / 0.9. Word timings came from **faster-whisper 1.2.1, Small, CPU int8, two threads**, using an existing uv-cached Python environment and cached model. No package installation was necessary. Each speech excerpt was cut from the decoded final scene MP3; original Whisper words and exact PCM-offset timestamp provenance are retained.

Run existing-toolchain authoring checks with:

```bash
python3 packages/backend/src/scripts/mechanics-direct-collisions/verify-authoring.py
python3 packages/backend/src/scripts/mechanics-direct-collisions/verify-narration.py
```

`verify-authoring.py` accepts `--backend-node-modules` and `--react-types` to select existing dependencies. It performs no installation and no rendering. To reproduce narration, use `generate-narration.py --generate` with the root ElevenLabs credential, then run `--transcribe` using a Python executable containing the specified local Whisper dependency and cached Small model. `--remap` supports cue-only changes without altering audio or inventing word timings.

## Machine A responsibilities

Machine B does not install npm dependencies or run any Remotion render. Shared integration files belong to the parent: `Root.tsx`, `content-registry.json`, `lib/syllabus.ts`, and `notes/index.json`. Register the exported composition at 1920×1080, 30 fps, and use its duration function. Render through the topic's standalone entry with a public directory containing exactly the scene audio filenames enumerated in `direct-collisions.json`.

Before rendering a preview, run scoped TypeScript checks and the topic verifier, inspect all setup/working/result stills, check exact ring extents and immediate before/after result frames, and test contact and motion throughout both trials. Machine B authoring checks cannot establish rendered layout, legibility or encoded audio/video alignment. Durai reviews the preview before any final render.

No deployment or final render is part of this delivery.
