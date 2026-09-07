# Verification: Multiple collisions

## §14 composition-only figure accents

Fast-forwarded `dev` to `03ef408` before this correction; the §13 composition and narration remain the baseline. First implementation pushed as `a86b07a`. No audio, transcript, existing cue, handwriting window, duration or Root registration changed: all seven MP3s and the transcript retain their SHA-256 hashes. The composition remains **12,011 frames / 400.367 s** at 30 fps.

- **114 spoken figure references** use the existing Whisper word timestamps directly, with composition-local `scene:word-index` IDs. Bare sphere names point to A/B/C; mass and velocity references point to their corresponding before/after diagram values. The intentionally unchanged ASR “value B” / “VB” tokens are mapped to the existing velocity figures using their word timestamps.
- Loose accent ellipses draw over about 0.4 s, hold for 1.5 s, then fade over 0.25 s. A repeated reference retraces the same target instead of stacking duplicate rings. Rings follow measured SVG text geometry, including units; mass labels moved 12 SVG units lower to preserve annotation clearance. Rings add no regions.
- **16 source highlights** cover the four product terms in each collision. The same glyph lengths, character indices, gaps, scale and start/end frames used by the paper determine their timing. Both factors’ source figures are ringed as each product is written, including the unknown after-velocity where applicable.
- The existing three-line problem card keeps its text and spacing. **13 phrase underline sweeps** follow the corresponding spoken word spans. Ring progress, underlines and fades use the existing held time. One explicit exception honours Whisper’s “A” at 100.22 s in S06, 0.13 s before the existing question hold ends: the question now shows A/B, and only A’s requested ring begins during those last four frames. The diagram and card remain frozen; no audio or cue was shifted.

**603 fresh stills pass**: all 114 exact spoken-figure timestamps, all 16 source-highlight starts, completed-ring and hold samples, all phrase starts/midpoints/ends, and all 245 existing cue/transition/physics samples. The audit checks the target ID, numeric value, visible stroke progress and full ellipse enclosure at each word/pen cue. Full ring bounds are checked against every other visible printed text element (including units, cards and headers), and included in the frame-overflow check. The enclosed target itself is the intentional exception. Result: **zero missing figure cues, zero ring/text collisions, zero overflow, at most three regions**.

Every captured image also passes the visual pixel check; two blank Chromium captures were rejected and recaptured. The still driver now retries blank captures automatically. The original verifier then replays all **245 physics, contact, pixel-presence, handwriting and setup checks** against those fresh images through its bundle/image-hash-validated cache. **11 hold pairs are byte-identical**. The remaining question hold has identical sphere/label geometry and identical pixels outside the explicitly cued A-ring bounds; the original hold test now checks that narrow annotation-only exception instead of ignoring the hold. Three contact checks still pass. The targeted strict TypeScript check, script syntax and `git diff --check` pass. No video render, deployment or file deletion was performed.

Reviewed stills: [setup speed](verify-figure-setup.png), [collision 1 source factors](verify-figure-substitution-1.png), [collision 2 source factors](verify-figure-substitution-2.png), [the exact question A cue](verify-figure-question-cue.png). Full annotation measurements and unchanged asset hashes: [verify-figure-accents.json](verify-figure-accents.json). The existing report retains its historical §10–13 evidence and the fresh 245-frame baseline audit.

From `packages/backend`, with nvm Node on PATH:

```sh
node src/scripts/verify-collisions-accents.cjs
```

This bundles only the composition (without copying public media), uses `renderStill` with audio disabled, audits every new figure/phrase cue, and runs the existing verifier against the captures. Local images and both measurement reports are in `out/verify-collisions-accent-stills`. The sections below describe the retained §13 baseline.


Built 2026-09-06; §10 captions, §11 formula-led working and §13 full-problem setup verified 2026-09-07. **PASS — stopped before video render.** Composition `MechanicsMultipleCollisions`, 1920×1080, 30 fps, **12,011 frames (6:40.367)**. Seven narration files total **400.300 seconds (6:40.300)**; rounding each audio segment up to a frame covers every file. All **92** locally transcribed cues resolve against the final audio hashes.

## Content and teaching contract

Cambridge's official 2026–2027 numbering is **4.3 Momentum**, internal M4.3. Section 4.5 is Energy, work and power. The opening quotes the official PDF p.32 exactly, split into consecutive 8- and 11-word cards:

> use conservation of linear momentum to solve problems that may be modelled as the direct impact of two bodies.

Source: https://www.cambridgeinternational.org/Images/697427-2026-2027-syllabus.pdf (downloaded and checked with pdftotext). The exact statement was added to the local syllabus map.

Outcomes, repeated verbatim and ticked at their spoken sentence endings:

- Draw a separate diagram for each collision.
- Carry each signed velocity into the next collision.
- Decide whether the particles will collide again.

FRAME-LOG.md is the ceiling: f005–023 method, f024–067 subsequent-collision test, f068–094 sphere story, f095–105 first impact, f106–140 second impact and subsequent decision, f141–157 recap. No extra worked system, restitution or impulse. The wall is only mentioned qualitatively. The recording's direction errors are corrected: signed velocities determine whether the gap closes, and two left-moving particles can collide.

The animated story is followed by S07: a slow, 45.767-second full-problem setup before any working. Its three-line question card sits beside the complete static A/B/C diagram. All masses, initial velocities and both given post-collision velocities are visible throughout the story and its final two-second pause. A–B and B–C then each have a separate labelled diagram and a plain signpost. Both before velocities stay above the spheres; masses sit beneath the spheres, with after velocities below them. The dashed unknown is present before working starts. The solved +4 or +1 replaces it below B while all initial givens remain visible; +4 is carried above B into collision 2. Both papers now begin with the handwritten words `Momentum before = momentum after`, followed by `m_A u_A + m_B u_B = m_A v_A + m_B v_B` (B/C for collision 2). Each is written during its spoken sentence and stays above the substitution and solution. In collision 2, a spoken and handwritten `v_B = w_B` mapping distinguishes the general after-velocity symbol from the example’s named unknown. The final signpost introduces the subsequent-collision decision. Section 7's worked close is the complete collision sequence and catch-up decision; no unrelated journey graph is introduced. The recap precedes this final worked close.

## Timing

| Scene | Tempo (voice speed) | Audio seconds | Cues | Frames |
| --- | --- | ---: | ---: | ---: |
| S01 | brisk (1.0) | 26.044 | 7 | 782 |
| S02 | brisk (1.0) | 38.060 | 7 | 1142 |
| S03 | brisk (1.0) | 35.631 | 9 | 1069 |
| S07 | slow (0.9) | 45.767 | 8 | 1373 |
| S04 | slow (0.9) | 94.798 | 22 | 2844 |
| S05 | brisk (1.0) | 42.553 | 11 | 1277 |
| S06 | slow (0.9) | 117.447 | 28 | 3524 |
| Total | Three slow scenes | 400.300 | 92 | 12011 |

S01 outcomes; S02 method; S03 animated sphere story; S07 full-problem setup; S04 collision 1; S05 signed-velocity test and recap; S06 collision 2 and the final decision.

ElevenLabs voice `gYWKdgLtqjPO3D5uDrDP`, provider `elevenlabs`, generated via narration_client.py. Slow scenes use environment speed 0.9; brisk scenes 1.0. Written hold directions become inserted silence, not spoken words. Audio SHA-256 hashes, speeds, final cue bounds and silence interiors were checked. For §13, only S04 and S06 were re-voiced, alongside the new S07 setup, through narration_client.py with the requested voice and speed 0.9. Substitution narration explicitly points to each ball’s given mass and speed on the diagram. S01, S02, S03 and S05 have identical audio SHA-256 hashes and identical scene transcript objects to `2a7fc4b`. Local faster-whisper transcribed only the three new/changed scenes and resolved their 58 cues, including eight setup cues. The final setup question was also re-read in isolation to exclude an ASR hallucination on its trailing breath. The complete spoken symbolic sentences are checked against the requested formulas. No audio was accelerated to meet the target.

## Still audit

**245 stills pass**, covering every scene boundary, every frame of all six transitions, intermediate/completed velocity-arrow changes, the new formula cues, both formulas mid-writing, and the last moments before substitution. They cover every cue, both ends of every explicit hold, completed example setups, intermediate motion, impact boundaries, final contact, and all three recap ticks. Measured maximum: **3 regions**, including the header; **8 words per caption**, **38.54% caption width**; **0 text or region collisions**; no frame overflow. The verbatim syllabus quotation is the permitted 11-word exception. The problem setup and both working diagrams were inspected at full 1920×1080 resolution; all audited stills were reviewed in contact sheets.

**Historical §10 audit: 30/112 → 0/112 text-only frames on the same samples; 0/201 in that expanded audit.** The current §13 audit has **0 text-only or blank frames among 245 stills**. The original report's composition hash matches `b616530`. Its sample frame IDs and 30 failing frame IDs are preserved in `compositionOnlyBaseline` in [verify-build.json](verify-build.json). The new visual-presence assertion was applied to those original measurements and rejected all 30. The historical comparison uses the pre-revoice 8,906-frame timeline; the current narration changes the later global frame numbers.

The audit now rejects any still without a diagram or paper, including a header plus a lone card. A pixel check requires visible content in at least one diagram or paper region, rejecting frames whose visuals are blank or occluded; DOM presence alone is insufficient. Caption word/width limits, diagram-text collisions, handwritten-line collisions and region overlap are checked separately. The audit also requires both formula lines to be complete before substitution, to persist above every calculation line, and to use the locally resolved spoken start/end times. The collision-2 notation mapping must be complete before numbers appear. The §13 assertion checks every numeric substitution operand against a visible, unit-labelled diagram DOM value and reconstructs the substitution from those values. Before velocities must remain above the mass labels; after velocities remain below. Unknowns precede the working and solved values replace them. Computed totals 10 and 11 are arithmetic results, not substituted givens. The three-line problem card has its own explicit exception to the eight-word caption rule, with line-fit and complete-given checks. All 47 working stills and 28 problem-card stills pass; 15 negative controls are rejected.

The method keeps the wall/sphere or three-sphere track visible throughout. The velocity arrows change length at the existing “separate” cue, and v_B / w_B label B's arrows at “unique”. The question, recap and all three signposts retain diagrams beside their captions. The opening has a small static three-sphere motif; the recap retains the track with three spheres. The §10 captions use auto width, a 740 px maximum, muted paper `#b9bcb2`, 34 px type and 22×26 px padding. Visual cuts replace the fade through darkness within the existing 15-frame overlap; transparent transition wrappers prevent an incoming wrapper from covering the outgoing visual. The §10 transition structure and audio placement are retained; sequence lengths now include the new setup and follow the two re-voiced files.

There are no axes in this topic. Diagram text collision checks cover sphere names, masses, signed velocities, units and direction labels. The graphite/ivory/green diagram and paper styling, lined paper, stroke-dashoffset handwriting and emphasis rings are retained. In the worked calculations, unknown arrows are dashed and unscaled; known arrows measure exactly 35 SVG units per m s⁻¹.

All **12 hold pairs** have identical first/last image hashes: seven 60-frame numerical/comparison holds, the new 60-frame problem-reading hold, three 45-frame signpost holds and one 90-frame question hold. All eleven hold interiors in the new/re-voiced files pass PCM silence checks (maximum absolute sample value 0); the S05 question audio is unchanged. The signs and arithmetic are verified: v_B = 4 m s⁻¹, w_B = 1 m s⁻¹; A is behind B and +2 > +1, so A catches B again. The leftward explanation also uses the correct signed ordering.

Three contact checks pass: story A–B, story B–C and the final A–B catch. Centre separation matches the sum of sphere radii within 2 SVG units, and each contact has a flash. Sampled motion preserves sphere order and avoids interpenetration; arrows scale with velocity. The story freezes before a third impact is answered. The final animation stops at contact without inventing subsequent velocities.

Measurements and hold hashes are in [verify-build.json](verify-build.json). The verifier captures fresh Remotion stills and DOM/SVG measurements; it does not render a video. For this §13 revision, all 245 stills were freshly captured from the final bundle. The optional `--reuse-stills` path was then verified: it checks bundle/image SHA-256 hashes before reusing captures and repeats every assertion, pixel check and hold comparison. Local PNGs and contact sheets are in `packages/backend/out/verify-collisions-setup-stills/`.

## Build checks and reproduction

Targeted strict TypeScript check passed for the composition. Python compilation passed for narration, transcription and audit scripts. `npx remotion compositions out/verify-collisions-setup-bundle` lists the composition at 12,011 frames, 1920×1080 and 30 fps. This revision changes no root registration. The four untouched scenes retain their original audio and transcript objects. S07/S04/S06 hashes, locally resolved cues, formula timings, negative controls and silent holds are recorded under `problemSetupRevision` in the JSON report. The earlier `formulaRevision` is preserved as historical evidence. All 11 existing explicit holds retain their prescribed lengths; the new setup adds one two-second hold. `git diff --check` passed.

The installed shared dependency tree emits an existing zod 3.25.76 versus 4.3.6 warning; the targeted check, bundle, composition discovery and all stills succeeded. Dependencies were not changed.

From `packages/backend`, with the requested nvm Node on PATH:

```sh
export PATH="$(ls -d ~/.nvm/versions/node/*/bin | sort -V | tail -1):$PATH"
npx remotion bundle --out-dir out/verify-collisions-setup-bundle
python3 src/scripts/verify-mechanics-multiple-collisions.py --bundle out/verify-collisions-setup-bundle --output out/verify-collisions-setup-stills --workers 4
npx remotion compositions out/verify-collisions-setup-bundle
```

The still verifier also uses Pillow for the pixel checks. Add `--reuse-stills` to resume interrupted captures with hash checks.

The targeted TypeScript check used the available React declarations in `/tmp/verify-modelling-types/node_modules/@types` alongside `node_modules/@types`, with strict, JSX react-jsx, esModuleInterop, resolveJsonModule, skipLibCheck, ES2022/DOM and Node module resolution.

Stage 1 was pushed as `bfc910b`; final sentence-end recap cues were pushed as `444be16`. The §11 narration, selective transcription and storyboard were committed and pushed first as `4e7f675`, followed by the formula-led composition and still audit in `2a7fc4b`. No files were deleted. No video render, deployment or publication was performed.

Historical §11 follow-up recheck on 2026-09-07: pulled `origin/dev` and confirmed the requested §11 implementation is already present in `2a7fc4b`, following narration commit `4e7f675`. Re-ran all 217 still assertions, including visual-presence and pixel checks, using bundle/image-hash-validated captures: PASS, zero text-only frames, 11 frozen holds and three contacts. At that revision, composition, transcript and all six audio hashes matched the report; S01/S02/S03/S05 audio and transcript objects matched `6a676c5`. STORYBOARD.md already specified both spoken formulae and their handwriting order. That recheck needed no additional re-voicing or composition changes.

§13 narration, selective local transcription and storyboard were committed and pushed first as `444628f`. This revision adds the full-problem beat and keeps both velocity rows and every substituted given visible throughout the existing formula-led working. No other scene audio changed. No video render, deployment or file deletion was performed.
