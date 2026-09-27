# 4.1.4 — Cell signalling: secretion, transport, binding · REPORT

## v2 (cloud run 008f, 27 Sep 2026) — fixes for review `cloud-reviews/4.1.4-REVIEW.md` (CHANGES)
Branch `cloud/008f-fix-4prnob`. 9 beats, 1 error beat (E44, Beat 7), 104 cues (+5 hook cues).
**Bunny guid `2aca389d-5b07-4072-a48d-c504b03b8ceb`** "REVIEW 4.1.4 v2 Cell signalling: secretion, transport, binding", no
collection; uploaded 16:13Z; **status 4 at 16:16:25Z** (≈3 min; 240p–1080p, 421 s).

| Finding | Fix |
|---|---|
| 1 HIGH whole-cell secretion through an unbroken outline | Shared `SignallingScene` now draws the beta cell with `ExoOutline` (VesicleTransport): the outline itself is one line into which the vesicle fuses — approach, fuse (the neck is a real opening in the outline), release (insulin leaves through the opening), flatten back. Same topology as the close-up `ExocytosisInset`, which runs beside it. No insulin crosses an intact outline. `../t4-shared/CHANGELOG.md`. |
| 2 text < 17 px | Every text ≥ 20 px at 1:1 (≥ 17.59 px delivered), incl. the envelope's "to: 35", the door numbers and the thumbnails: the envelope inset redrawn (address on the envelope, numbered doors, 20–22 px); zoomed scenes fade their labels out BEFORE zooming (`labelO`/`labelOf`); reduced scenes are `bare` (no text) with full-size labels outside; Beat 8 recap relaid. Per-frame `label-audit.cjs` in `render-beat.cjs`: **12,312/12,312 frames, min 17.59 px, 0 violations** (asserted in `verify.py`). |
| 3 envelope hook unmapped | Beat 5 re-voiced (hook only): *"The letter: insulin, the signalling molecule. The address: its shape. The matching door: the one receptor with a complementary binding site. Unlike the letter, insulin isn't carried inside; it binds at the cell surface."* Letter ↔ insulin, address ↔ its shape, door ↔ receptor binding site light together with link tags; **2 s silent hold** on the completed mapping before *"Unlike the letter"*; the creditworthy binding sentence follows. |
| 4 positions ≠ spec | Shared `FluidMosaicMembrane` literal SHARED-SPECS slots; the close-up (Beats 5–7) re-anchored (receptor slots 8–9, carrier 10–11). |
| 5 audio outlasts video | `work/brand_final.py` pads the picture (raw branded audio ended 29 ms after picture; 0.229 s clone of the last frame), audio untouched: **video ends 0.204 s after audio** (421.633 vs 421.429 s). |

**Narration changes (the only ones):** Beat 5 hook sentences above (+ 2.0 s hold). **ElevenLabs** (account-wide):
348,032 before / 348,032 after (counter lagged; 797 chars requested, one take; `qa/elevenlabs-usage.jsonl`).
**Master** `4.1.4-cell-signalling.mp4` 410.4 s, 12,312 frames, sha256 `1261116ba18a78c3f4acbdf28b7cd560a500d6c4cbf54a8fd208c0fa0023f633`.
**Branded** `4.1.4-branded.mp4` 421.633 s, sha256 `3cdae564f7e238a95718553805b6c07531409dbbebbec6cbf517b56242c323fb`, full decode 0
errors (`qa/branded-verification.json`); `qa/branded-mid.jpg` looked at.
**Verification** (`qa/verification.json`): ffprobe 410.4 · video ≥ audio (1.0 s) · decode 0 · cues 104/104 · AAC packets identical
(19,192) · final word "respond." 3.24 s headroom · silent holds B5 hook 2 s, B7 read 4 s, B9 END 2 s all −91 dB · 8 boundaries ·
marker audit every frame (E44 marked 2,125 frames, 0 mismatches) · label audit 0 violations · longest still 7.63 s ·
text-only PASS (longest 0 s, 0 untagged). Encoded sheets (7) looked at: exocytosis opening visible in the whole cell and the
close-up together; hook mapping held.
**Render:** 15:26:46–16:00:56Z (Beat 6 re-rendered once: the per-frame audit stopped it at one frame where the syllabus
line touched the capillary; line moved into the empty lower-left panel).

---

## v1 (run 008a) — superseded (details below)
Model: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`. 9 beats, 1 error beat (E44, Beat 7,
COMMON MISTAKE), 99 cues.

## Phases (UTC, 27 Sep 2026)
| Phase | Wall clock |
|---|---|
| Audio (TTS + faster-whisper) / review (no retakes) / holds + timeline + cue plan | 11:06–11:12 / 11:12–11:14 / 11:15 |
| Shared models `SignallingScene`, `VesicleTransport`; beats authored, stills LOOKED at, approved | 11:10–12:00 |
| Render, 4 beats in parallel (11,739 frames) | 12:01–12:10:21 |
| finish / verify / text-only audits + encoded sheets | 12:11 / 12:12 / 12:12–12:13 |
| Bookends / branding | 12:11–12:12 / 12:14–12:23 |
| Bunny upload / status 4 | 12:24:33–12:24:35 / 12:26:42 (≈2 min) |

## ElevenLabs (counter is ACCOUNT-WIDE: parallel sessions move it)
before 313,171 / after 315,792 of 363,000. Characters requested by this lesson: 4,766 (receipts; no retakes).

## Master and branded
- Master `4.1.4-cell-signalling.mp4`: 391.300 s, 11,739 frames, sha256
  `0168bbcc153ab490e9faedd1378273356cd24ab1453edc2c9d1ea6e4e965aa47`.
- Branded `4.1.4-branded.mp4`: 402.329 s (= master + 11.029 s), full decode 0 errors, sha256
  `1125def124a5d8d739b2348a5971f954aa177faca06ce8b26ebec02f18de4a8d`. Mid frame `qa/branded-mid.jpg` (3:20, Beat 6) inside the
  cream frame, title bar "Cell signalling: secretion, transport, binding · Cambridge A Level Biology".
- Bookends: settled late frames read exactly the title (`qa/bookend-intro-late.png`, `qa/bookend-outro-late.png`).

## Verification (`qa/verification.json`, standard order)
1 ffprobe 391.300 s · 2 video ≥ encoded audio 390.300 s (margin 1.0 s) · 3 full decode 0 errors · 4 cues 99 = 99 = planned 99
· 5 AAC packets identical (18,297) · 6 final word "respond." ends 387.06 s, 3.24 s headroom · 7 silent read (Beat 7, 4 s) and
END hold (Beat 9, 2 s) PCM all zero, encoded −91 dB; speech PCM unchanged · 8 boundary audit 8 boundaries, 0 candidates ·
marker audit every frame (11,739): Beat 7 frames 6769–8893 carry COMMON MISTAKE (badge MAE ≤ 3.9 vs COMMON, ≥ 20.3 vs
EXAM), clears on frame 8894 = END of "complementary to" + 44 frames (end of "LL-37"); all other frames unmarked, 0
mismatches · longest unchanged visual 7.63 s (Beat 2 objectives) · text-only `--controls` all PASS, 0 untagged shapes;
text-only runs: none (0 s).

## Sheets
Beat sheets LOOKED at before approval; fixed: zoomed scene spilling over the header and caption (clip below the header),
Beat 3 label collisions (vesicle label moved, inset label panel), inset wedges drifting into the inset heading (shared
`VesicleTransport` release height), Beat 4 overlapping footnotes, Beat 5 ligands entering over the title, Beat 6 liver ring
drawn during the zoom-out, Beat 7 labels overflowing the panel, Beat 8/9 close-up inset overflowing its box. Encoded sheets
(7) LOOKED at: every beat reads as intended; no fix needed.

## Bunny
guid `a6abecc9-db0c-4e2a-8865-2daf426c3e00`, title "REVIEW 4.1.4 Cell signalling: secretion, transport, binding", no collection; uploaded 12:24:35Z;
status 4 at 12:26:42Z (2 min 7 s after upload; length 402 s; 240p–1080p).

## Pronunciation (`qa/audio-review.md`)
Request-only: `LL-37` → `L L thirty-seven` (all beats). No retakes (Beat 1 "sent" and Beat 5 "fit" adjudicated by the medium
model and accepted).

## Shared-model sha256 used (byte-for-byte copies in `src/`)
The seven 4.1.1-2 files unchanged (FluidMosaicMembrane d45dca56…8525 · PhospholipidToken 9940f739…bf49 · ReceptorLigand
1cc07252…0d69 · T4Tokens 82c10a8a…45fe · TransportProteinSet 3bc4ab34…6d28 · WaterField 2e4f3530…4de1 · t4-palette
6c1088fc…5ec5a) · CholesterolQualitative 4f37d363…55d3 · new: SignallingScene 8072191f…2357 · VesicleTransport
f85e458b…a9e5b7 (full values in `work/t4-shared/SHARED.md`).

## Design choices
1. One `SignallingScene` (beta cell, capillary, tissue fluid, muscle, liver and a non-target cell) carries all three stages; it zooms into the beta cell for exocytosis (membrane-scale inset beside the whole-cell event) and into a muscle receptor for binding (cross-fade to the membrane close-up).
2. Specificity is shape only: the wedge seats flush, the square touches the rim, rocks and drifts off; the response is more frequent carrier cycles of a separate glucose transport protein against a labelled before-binding miniature, with no pathway drawn.
3. The recap and the close reuse the built scene: points brighten in place; in the close it is reduced at right and framed "beyond the mark scheme — our insulin illustration".

## Interpretation
"LL-37" is never a cue phrase (request-normalised), so E44 clears at the END of "complementary to" plus the measured 44 frames.
The enzyme recall is a simple outline thumbnail (enzyme with active site and struck product outlines), since Topic 3's
`EnzymeActiveSiteModel` is not in this session's shared set. The muscle wedge stays seated from Beat 5 on (`bindMuscle`),
the liver wedge seats at "so they respond too". The hook returns as Beat 1's body outline at small scale.
