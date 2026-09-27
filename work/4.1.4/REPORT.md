# 4.1.4 — Cell signalling: secretion, transport, binding · REPORT

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
