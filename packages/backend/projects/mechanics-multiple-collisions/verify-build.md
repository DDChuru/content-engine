# Verification: Multiple collisions

Built 2026-09-06; composition-only revision verified 2026-09-07. **PASS — stopped before video render.** Composition `MechanicsMultipleCollisions`, 1920×1080, 30 fps, **8,906 frames (4:56.867)**. Six narration files total **296.803 seconds (4:56.803)**; rounding each audio segment up to a frame covers every file. All **74** locally transcribed cues resolve against the final audio hashes.

## Content and teaching contract

Cambridge's official 2026–2027 numbering is **4.3 Momentum**, internal M4.3. Section 4.5 is Energy, work and power. The opening quotes the official PDF p.32 exactly, split into consecutive 8- and 11-word cards:

> use conservation of linear momentum to solve problems that may be modelled as the direct impact of two bodies.

Source: https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf (downloaded and checked with pdftotext). The exact statement was added to the local syllabus map.

Outcomes, repeated verbatim and ticked at their spoken sentence endings:

- Draw a separate diagram for each collision.
- Carry each signed velocity into the next collision.
- Decide whether the particles will collide again.

FRAME-LOG.md is the ceiling: f005–023 method, f024–067 subsequent-collision test, f068–094 sphere story, f095–105 first impact, f106–140 second impact and subsequent decision, f141–157 recap. No extra worked system, restitution or impulse. The wall is only mentioned qualitatively. The recording's direction errors are corrected: signed velocities determine whether the gap closes, and two left-moving particles can collide.

The animated story precedes equations. A–B and B–C each have a separate labelled diagram, a spoken setup ending “let's get drawing”, and a plain signpost. The final signpost introduces the subsequent-collision decision. Section 7's worked close is the complete collision sequence and catch-up decision; no unrelated journey graph is introduced. The recap precedes this final worked close.

## Timing

| Scene | Tempo (voice speed) | Audio seconds | Cues | Frames |
| --- | --- | ---: | ---: | ---: |
| S01 | brisk (1.0) | 26.044 | 7 | 782 |
| S02 | brisk (1.0) | 38.060 | 7 | 1142 |
| S03 | brisk (1.0) | 35.631 | 9 | 1069 |
| S04 | slow (0.9) | 67.056 | 18 | 2012 |
| S05 | brisk (1.0) | 42.553 | 11 | 1277 |
| S06 | slow (0.9) | 87.458 | 22 | 2624 |
| Total | Two slow scenes | 296.803 | 74 | 8906 |

S01 outcomes; S02 method; S03 animated sphere story; S04 collision 1; S05 signed-velocity test and recap; S06 collision 2 and the final decision.

ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`, provider `elevenlabs`, generated via narration_client.py. Slow scenes use environment speed 0.9; brisk scenes 1.0. Written hold directions become inserted silence, not spoken words. Audio SHA-256 hashes, speeds, final cue bounds and silence interiors were checked. No audio was accelerated to meet the target.

## Still audit

**201 stills pass**, including all original 112 samples, every scene boundary, every frame of all five transitions, and intermediate/completed velocity-arrow changes. They cover every cue, both ends of every explicit hold, completed example setups, intermediate motion, impact boundaries, final contact, and all three recap ticks. Measured maximum: **3 regions**, including the header; **8 words per caption**, **38.54% caption width**; **0 text or region collisions**; no frame overflow. The verbatim syllabus quotation is the permitted 11-word exception. All 201 stills were visually reviewed in nine contact sheets; the revised method, question, recap and signpost frames were also inspected individually.

**Text-only frames before → after: 30/112 → 0/112 on the same sampled frames; 0/201 in the expanded audit.** The original report's composition hash matches `b616530`. Its sample frame IDs and 30 failing frame IDs are preserved in `compositionOnlyBaseline` in [verify-build.json](verify-build.json). The new visual-presence assertion was applied to those original measurements and rejected all 30. These counts refer to audited stills, not a census of all 8,906 timeline frames.

The audit now rejects any still without a diagram or paper, including a header plus a lone card. A pixel check requires visible content in at least one diagram or paper region, rejecting frames whose visuals are blank or occluded; DOM presence alone is insufficient. Caption word/width limits, diagram-text collisions and region overlap are checked separately.

The method keeps the wall/sphere or three-sphere track visible throughout. The velocity arrows change length at the existing “separate” cue, and v_B / w_B label B's arrows at “unique”. The question, recap and all three signposts retain diagrams beside their captions. The opening has a small static three-sphere motif; the recap retains the track with three spheres. Cards use auto width, a 740 px maximum, muted paper `#b9bcb2`, 34 px type and 22×26 px padding. Visual cuts replace the fade through darkness within the existing 15-frame overlap; transparent transition wrappers prevent an incoming wrapper from covering the outgoing visual. Sequence lengths and audio placement are unchanged.

There are no axes in this topic. Diagram text collision checks cover sphere names, masses, signed velocities, units and direction labels. The graphite/ivory/green diagram and paper styling, lined paper, stroke-dashoffset handwriting and emphasis rings are retained. In the worked calculations, unknown arrows are dashed and unscaled; known arrows measure exactly 35 SVG units per m s⁻¹.

All **11 hold pairs** have identical first/last image hashes: seven 60-frame numerical/comparison holds, three 45-frame signpost holds and one 90-frame question hold. Inserted-silence interiors pass PCM checks. The signs and arithmetic are verified: v_B = 4 m s⁻¹, w_B = 1 m s⁻¹; A is behind B and +2 > +1, so A catches B again. The leftward explanation also uses the correct signed ordering.

Three contact checks pass: story A–B, story B–C and the final A–B catch. Centre separation matches the sum of sphere radii within 2 SVG units, and each contact has a flash. Sampled motion preserves sphere order and avoids interpenetration; arrows scale with velocity. The story freezes before a third impact is answered. The final animation stops at contact without inventing subsequent velocities.

Measurements and hold hashes are in [verify-build.json](verify-build.json). The verifier captures fresh Remotion stills and DOM/SVG measurements; it does not render a video. For this composition-only revision, all 201 stills were freshly captured from the final bundle. The optional `--reuse-stills` path was then verified: it checks bundle/image SHA-256 hashes before reusing captures and repeats every assertion, pixel check and hold comparison. Local PNGs and contact sheets are in `packages/backend/out/verify-collisions-composition-stills/`.

## Build checks and reproduction

Targeted strict TypeScript check passed for the composition. Python compilation passed for narration, transcription and audit scripts. `npx remotion compositions out/verify-collisions-composition-bundle` lists the composition at 8,906 frames, 1920×1080 and 30 fps. This revision changes no root registration. All six audio SHA-256 hashes and the transcript hash still match the original report; the narration and transcription scripts match `b616530`. All 74 cue times, all holds and all sequence durations remain unchanged. `git diff --check` passed.

The installed shared dependency tree emits an existing zod 3.25.76 versus 4.3.6 warning; the targeted check, bundle, composition discovery and all stills succeeded. Dependencies were not changed.

From `packages/backend`, with the requested nvm Node on PATH:

```sh
export PATH="$(ls -d ~/.nvm/versions/node/*/bin | sort -V | tail -1):$PATH"
npx remotion bundle --out-dir out/verify-collisions-composition-bundle
python3 src/scripts/verify-mechanics-multiple-collisions.py --bundle out/verify-collisions-composition-bundle --output out/verify-collisions-composition-stills --workers 4
npx remotion compositions out/verify-collisions-composition-bundle
```

The still verifier also uses Pillow for the pixel checks. Add `--reuse-stills` to resume interrupted captures with hash checks.

The targeted TypeScript check used the available React declarations in `/tmp/verify-modelling-types/node_modules/@types` alongside `node_modules/@types`, with strict, JSX react-jsx, esModuleInterop, resolveJsonModule, skipLibCheck, ES2022/DOM and Node module resolution.

Stage 1 was pushed as `bfc910b`; final sentence-end recap cues were pushed as `444be16`. This report now includes the composition-only §10 revision. No files were deleted. No video render, deployment or publication was performed.
