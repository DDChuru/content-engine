# 2.1.1 — The four food tests: conditions, observations and supported conclusions

Cambridge International A Level Biology 9700, outcome 2.1.1: Benedict's, iodine, emulsion and biuret tests. This is the local teaching-video master, built from the storyboard after its two checks (CHECK.md, CHECK-R2.md) and the post-clearance cue additions. The narration is frozen (2,171 words) and was built by claude-opus-5-5 on machine A.

**Master:** `2.1.1-food-tests.mp4`: **16:46.200**, 1920×1080, 30 fps, 30,186 frames, H.264 + AAC. SHA-256 `a44147f2a2d7a79f392245b6eec3456d722cdfcd2ed6c75ded856b7df3debaa3`.

## Verification (PIPELINE-STANDARD §4 order; `qa/verification.json`)
1. ffprobe returns a duration: 1006.200 s.
2. Video 1006.200 s ≥ encoded audio 1005.200 s. The 1 s difference is the deliberate video tail.
3. Full decode: zero errors.
4. Cues: **250 / 250** matched. Each is an exact narration substring, unique within its beat and in narration order.
5. AAC packets and timestamps are identical to the once-encoded narration (47,120 packets).
6. The final word "sugar." ends at 1001.053 s, with 4.15 s of audio headroom.
7. Silent reads measure silent. B17's 3.5 s silent read, B20's 5 s anchored read and the 3 s closing hold are all-zero PCM, and each encoded interior measures −91 dB. All speech PCM is byte-identical to the per-beat takes.
8. Beat boundaries: 19 tested, **0** one-frame-hold candidates (`qa/boundary-audit.json`).

**Marker audit, every frame** (`qa/marker-audit.json`): the error marker is present on 1,901 frames, all in Beat 17, from its first frame to the frame on which the in-place correction completes. It is absent on the other 28,285 frames, with zero mismatches. On every marked frame the badge pixels match a reference render of **EXAM CONTRAST** (MAE ≤ 3.2) and not COMMON MISTAKE (MAE ≥ 18.0).

The longest unchanged rendered visual is 8.97 s (beat 13); none exceeds 15 s. Visual review: 148 encoded samples on 17 sheets (`qa/encoded-sheets/`). The sampling is every 8 s, plus every beat's first frame and the marker boundaries. Every sheet was inspected, and the fixes are recorded in `qa/decisions.md`.

## Audio
ElevenLabs Thandi (`BcpjRWrYhDBHmOnetmBl`), `eleven_multilingual_v2`, speed 1.0, one file per beat, not time-stretched. Transcription used faster-whisper small, CPU int8. The requests differ from the storyboard text in two words only, request-side: `copper(II)` → "copper two" (the known trap), and `biuret` → "bye-yoo-ret". The latter was found in this build: the storyboard spelling came back as "Bioré/bioretist", so beats 3, 13, 14 and 17 were regenerated once. Every diff and every transcript anomaly checked is in `qa/audio-review.md`. **Worth a listen by ear:** "biuret" in B3, B13, B14 and B17, and "worth three marks" in B20.

## Design choices, and why
- **Everything happens on one bench.** B5 builds it and fixes the geography: rack front centre, bath back right, reagents back left, tile front left, waste far right. The recap (B19) and the exam close (B20) return to the same bench in place, so the take-home image is one the student has already learned.
- **Every colour is a claim, so every colour is coded.** The name is printed in words, a hatch code unique to that colour is added, and the label says MODEL. Tube contents carry name pills, and a precipitate has its own particulate code, shown suspended and then settled. A colour-blind student, or a washed-out phone screen, still reads the answer.
- **Benedict's endpoints switch; they do not fade.** A cross-fade from blue to brick-red passes through purple (a biuret colour), and a green → yellow drift implies an obligatory sequence (CHECK M3). The tube therefore shows its endpoint in one frame, after the stated heating time.
- **The discipline is pinned.** B4 introduces a CONDITIONS → OBSERVATION → INFERENCE strip, and it stays on screen from B5, with the current phase lit. The spine of the lesson is then visible in every frame.
- **Evidence is typographic.** Exam material appears only as quoted words with a source line, never as Cambridge artwork. Short handling mistakes are framed WRONG METHOD insets rather than extra error beats (CHECK-R2 D). E01 is badged EXAM CONTRAST because nothing in the evidence diagnoses its illustrative wrong answer as a candidate error.
- **The captions are look-here anchors, not transcripts.** Each caption says what to look at in about six words, so the voice and the screen do different jobs.

## Pour and handling repair (Durai, 22–23 Sep)
The first delivered master had physically impossible pours. Beat 12 tilted a tube only 62° and drew the stream leaving its side; Beat 16 tilted the bottle to 70° with no stream at all. VIDEO-STRUCTURE now has the rule "Handling must be physically possible", and it is built into `src/Apparatus.tsx`:
- Liquid surfaces stay horizontal in world space: the upright volume is kept, and the surface is found by area bisection in the tilted outline.
- The lip of any rotated vessel is computed (`tubeLip`, `bottleLip`), and vessels can be placed by their lip (`…ByLip`).
- A `Stream` runs from that lip to the receiving surface.

**B12:** L tips to **120°** with its lip inside E's mouth. The stream falls from the lip onto E's surface, and L's level falls as E's rises. **B16:** U tips to **115°** over each tube, pours for 0.5 s, tips back to 40° to travel, and returns upright. U's level falls as each tube fills.

The same audit fixed:
- droppers that touched the tube or whose drops vanished (B1, B10, B11)
- syringes that drew through closed caps or passed through glass (B6, B11, B13)
- tubes carried into the hot bath without a holder, or through the beaker wall (B7, B9)
- bungs that appeared as the shaking began (B11, B12)
- the 35° "discard" icon (B15)
- bench droppers standing upright on their tips (B2, B5, B19, B20)

Full detail is in `qa/decisions.md`; the mid-pour stills were checked before rendering (`qa/pour-b12*.jpg`, `qa/pour-b16.jpg`, `qa/handling-*.jpg`). The fix changed the shared apparatus, so all 20 beats were re-rendered. Frame ledgers show 18 changed pixels, because every liquid surface was redrawn; Beats 3 and 17 contain no vessels and are byte-identical.

**Known and accepted, carried to the next lesson (not fixed here):** in B12 the stream crosses E's label while pouring, and in B16 the tipped bottle briefly covers the "reducing sugar test" heading.

## Build and repair
Renderer: React → react-dom/server → Sharp/librsvg → beat-chunked ffmpeg H.264; no browser. Timing comes from the measured audio (`timeline.json`), with integer-frame scene lookup. Each beat writes `complete.json` last, recording its source fingerprint. `finish.py` refuses stale or incomplete chunks and joins them with `-c copy`.

Shared Topic 2 components live in `../shared/src/`: `Swatch.tsx` (the colour convention), `ErrorMarker.tsx` (the marker, which takes its label as a prop, and WrongInset), plus `Type.tsx` and `theme.ts`. The lesson's own components are `src/Apparatus.tsx`, `Bench.tsx`, `Panels.tsx`, `Molecules.tsx`, and `src/beats/BeatNN.tsx`.

To repair one beat: edit it, then run `node build.cjs && node qa-beat.cjs N && …/aitools/bin/python sheet-beat.py N`, LOOK at the result, then `./approve.sh N && ./launch-render.sh N`. Next run `python3 finish.py`, then `verify.py` and `encoded-sheets.py` (with the aitools Python). Do not regenerate the audio. Never copy or delete a live `render.lock`.

Superseded chunks are kept in `render-cache/superseded/`. Earlier masters, all renamed and kept:
- `…-SUPERSEDED-prereview.mp4`: verified clean, before the whole-lesson visual review.
- `…-SUPERSEDED-pour-handling.mp4`: before the handling repair.
- `…-TEST-AS-BUILT.mp4`: the preserved test record. Do not touch it. Nothing was deployed or published, and no git operations were performed.
