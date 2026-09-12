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

The composition follows `MechanicsUsingCalculusIn1D.tsx` and the existing `mechanics-m42/Presentation.tsx` Lesson/Scene/Paper/Figure components. It uses the established `useCue` word-timestamp pattern. Two slow solution scenes use ElevenLabs speed 0.9, completed-result silence holds, and a three-second closing thinking hold.

## Machine A responsibilities

Machine B does not install npm dependencies or run any Remotion render. Shared integration files belong to the parent: `Root.tsx`, `content-registry.json`, `lib/syllabus.ts`, and `notes/index.json`. Register the exported composition at 1920×1080, 30 fps, and use its duration function. Render through the topic's standalone entry with a public directory containing exactly the scene audio filenames enumerated in `direct-collisions.json`.

Before rendering a preview, run scoped TypeScript checks and the topic verifier, inspect all setup/working/result stills, check exact ring extents and immediate before/after result frames, and test contact and motion throughout both trials. Machine B authoring checks cannot establish rendered layout, legibility or encoded audio/video alignment. Durai reviews the preview before any final render.

No deployment or final render is part of this delivery.
