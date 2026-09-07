# Modelling Assumptions re-cut — verification

The current additive pass is documented in [the §§10–14 audit below](#additive-audit). The original re-cut report is retained as history.

The six-scene re-cut replaces the previous eight-scene build. Narration is **276.924 seconds (4:36.924)**; the composition is **8,311 frames / 277.033 seconds at 30 fps**. No video render was run. The composition ID, exported names and Root registration are unchanged.

## Scene timings

| Scene | Tempo | Voice speed | Audio seconds | Cues | Frames |
|---|---|---:|---:|---:|---:|
| s01 — What you will learn | brisk | 1.0 | 27.037 | 6 | 812 |
| s02 — How a model is made | brisk | 1.0 | 26.018 | 5 | 781 |
| s03 — Model a falling stone | slow | 0.9 | 76.042 | 21 | 2282 |
| s04 — What the modelling words mean | brisk | 1.0 | 55.928 | 14 | 1678 |
| s05 — Match words to the situation | slow | 0.9 | 66.978 | 20 | 2010 |
| s06 — By the end you can... | brisk | 1.0 | 24.921 | 6 | 748 |

The 15-frame graphite fade-through transitions overlap added outgoing visual tails, preserving all narration time. All six scene scripts changed, so all six MP3s were regenerated with ElevenLabs through `narration_client.py`, voice `gYWKdgLtqjPO3D5uDrDP`. Slow scenes use speed 0.9; brisk scenes use 1.0. Written holds are inserted PCM silence, not spoken directions or provider-generated pauses.

## Scope and teaching checks

- S01: syllabus 4.1, printed p.31, exact excerpt “use the model of a ‘smooth’ contact”; three outcomes shown separately. FRAME-LOG f001–f003 plus the teaching standard's required Cambridge opening.
- S02: five-stage modelling cycle, f004–f016.
- S03: cliff assumptions, given height model, readings and three refinements, f017–f049. The one-second reading is corrected to 15 m. No force calculation is introduced.
- S04: particle, smooth/rough, rod/beam, uniform, light and inextensible survey, f050–f083. Existing table/pulley and uniform-rod drawings are reused.
- S05: five matching questions, f084–f103. Particle modelling and neglecting air resistance are explicitly distinguished. A taut string over the fixed pulley links acceleration magnitudes in different directions.
- S06: identical outcome wording, individually ticked, f104–f118.
- The full acceleration/tension calculation, friction inequality extension and additional glossary scenes are removed. Headers are plain ideas; no prohibited setting names or captions appear. One accent colour, one diagram and one card/paper panel are retained.

## Completed verification

- **72/72 cues resolved** against local faster-whisper words and generated speech-beat boundaries. The isolated one-second reading was independently transcribed to prevent Whisper copying “twenty” from the preceding reading. The boundary replacement also removes overlapping duplicate words.
- Six audio SHA-256 hashes and voice/speed metadata match. All eight inserted holds are silent in decoded MP3 audio; no cue falls inside a hold. Both slow scenes and total narration fit the requested duration ranges.
- **94 stills checked:** every cue, both ends of every hold, and six completed-writing frames. Rendered DOM measurements give **maximum 3 regions**, including the header, and **9 words per card or handwritten line**, with no frame overflow.
- **Eight hold pairs are byte-identical PNGs:** two ringed 60-frame stone readings, five 60-frame matching questions, and the 90-frame stone question. The pen and diagram remain frozen throughout each hold.
- All required stills were reviewed in contact sheets; the domain, matching questions, completed handwritten answers and corrected water label were also checked directly. The missing handwritten `y` found during the audit was added; all affected stills were regenerated. Matching prompts sit prominently at the top of the same paper panel.
- Strict targeted TypeScript check passed, using temporary React declarations at `/tmp/verify-modelling-types` because this checkout lacks them. No dependency files changed.
- `npx remotion compositions` lists `MechanicsModellingAssumptions`, 1920×1080, 30 fps, **8,311 frames**, longer than the combined narration. Root registration is unchanged.

[Per-still measurements, scene/audio hashes and hold-image hashes](verify-build.json) preserve the results. The local stills are in `/tmp/verify-modelling-recut-stills`.

## Repeat the still audit

From `packages/backend`, with the requested nvm Node on `PATH`:

```bash
npx remotion bundle src/remotion/Root.tsx
python3 src/scripts/verify-mechanics-modelling-assumptions.py --workers 3
```

The verifier runs `npx remotion still` at every cue, both hold boundaries, and completed handwriting; it checks the DOM measurement artifacts and hashes each frozen hold pair. Its optional audit prop emits JSON only and adds nothing on screen. It retries transient CLI failures three times. It never invokes a video-render command.

## Explicitly requested deletions

- `packages/backend/src/remotion/public/audio/mechanics/modelling-assumptions-s07.mp3` — obsolete rough-table extension audio; the re-cut ends at s06.
- `packages/backend/src/remotion/public/audio/mechanics/modelling-assumptions-s08.mp3` — obsolete eighth-scene recap audio; the replacement recap is s06.

No other files or directories were deleted. Rendering remains for the other machine.

<a id="additive-audit"></a>

## Additive §10–14 audit — 2026-09-07

Stage 1: `b0f14d1` (committed and pushed before composition work). The six approved
scenes, all six MP3 SHA-256 hashes, narration paragraphs, 72 teaching cues, eight
inserted holds and **8,311 frames / 277.033 seconds** are unchanged from `adcb394`.
S05 already tells the box/desk/pulley/hanging-sphere story before matching, so no
narration line required re-voicing. A fresh local faster-whisper-small CPU pass
resolved all 72 cues; the reviewed word alignment was retained where re-transcription
drifted. Emphasis onsets falling a few frames inside inserted PCM silence are
clamped to the known end of that silence, with the original word onset preserved
in `wordStart`. There are **84 word-derived focus events**.

The visual changes are additive to the six-scene re-cut:

- All scenes have a diagram from the start. Opening/outcomes and recap retain a
  table/pulley motif. The modelling-cycle flowchart also has a small setup motif.
- Captions use compact muted boxes, at most eight words except the unchanged
  opening/recap outcomes and full problem wording. The same diagram remains
  visible as captions change.
- The source's 5 kg box and 2 kg hanging sphere, desk, string and pulley are
  labelled before matching. A three-line setup and all five simplifications
  remain on the paper throughout; each answer is written underneath them.
  Problem phrases underline as read. The particle/air-resistance correction is
  preserved, as are the taut-string and equal-magnitude qualifications.
- The cliff and curved-to-vertical trajectory remain. A height graph adds the
  source's 20 m and 15 m readings beside the cliff. The handwritten model stays
  above `h(0) = 20 m` and `h(1) = 15 m`; no force calculation is introduced.
- Loose, stroke-drawn rings start at the spoken word, draw over 0.4 seconds and
  fade after about 1.5 seconds. They freeze with the rest of each inserted hold.
- `9542f33` supplied the uniform-rod mass marks and zigzag stretching connector
  used within the retained vocabulary scene. That revision contains no cliff
  scene; the re-cut's cliff was preserved and given rock-face detail.
- The transition midpoint switches directly between complete diagrams. The
  pixel audit exposed an opaque nested transition wrapper that hid the outgoing
  scene; removing that wrapper's background eliminates the blank boundary frames.

Final checks passed:

- **483 PNG stills**: every teaching cue, every focus onset and completed ring,
  completed handwriting, both ends of all holds, every transition frame, and
  visual-presence samples every two seconds.
- Maximum **3 regions**, **7 words per caption**, and **9 words per problem/outcome/ink line**;
  no measured text/handwriting collisions or overflow.
- Every sampled frame has painted diagram content (minimum
  **2,272 non-background pixels** at half resolution). Every requested
  focus cue has its ring/underline; ring crops also contain painted accent pixels.
- **8 byte-identical hold pairs**: seven 60-frame holds and one 90-frame hold.
  Chrome produced sparse edge-pixel differences in some initial captures;
  sequential re-captures resolved them. The exact PNG-hash assertion was retained;
  no pixel tolerance was introduced.
- Detailed still inspection covered the full matching setup, all five completed
  handwritten answers, uniform/uneven rod, light-string and smooth-pulley rings,
  the two stone readings, outcome motifs and transition boundaries.
- Remotion bundle, strict targeted TypeScript, Python/Node syntax and the
  unchanged-audio/cue/scope verifier pass. The focused type check uses the existing
  temporary React declarations at `/tmp/verify-modelling-types`.

[Per-frame pixel/geometry checks, audio hashes and exact hold hashes](verify-additive-build.json)
record the final proof. Local PNGs are in `/tmp/verify-modelling-additive-stills`.
The optional `VERIFY_STILL_WORKERS=1` setting captures stills sequentially.

Repeat from `packages/backend`, with the requested nvm Node on `PATH`:

```bash
python3 src/scripts/verify-modelling-additive-cues.py
npx remotion bundle src/remotion/Root.tsx --out-dir=/tmp/verify-modelling-additive-bundle
python3 src/scripts/verify-mechanics-modelling-assumptions.py --prepare-only --output /tmp/verify-modelling-additive-stills
node src/scripts/verify-modelling-additive-stills.mjs /tmp/verify-modelling-additive-bundle /tmp/verify-modelling-additive-stills
python3 src/scripts/verify-mechanics-modelling-assumptions.py --reuse-stills --output /tmp/verify-modelling-additive-stills
```

The batch helper renders PNG stills only using a shared browser. The normal
verifier's CLI-per-still mode remains available. No video render, deployment or
file deletion was performed in this additive pass.
