# 4.1.3 — What each part of the membrane does · REPORT

Model: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`. 13 beats, 1 error beat (E43, Beat 7,
EXAM CONTRAST), 141 cues.

## Phases (UTC, 27 Sep 2026)
| Phase | Wall clock |
|---|---|
| Audio (TTS + faster-whisper) / review + 1 retake (B6) / holds + timeline | 10:39–10:43 / 10:43–10:45 / 10:46 |
| Beats authored (on the shared models + `CholesterolQualitative`), stills LOOKED at, approved | 10:46–11:05 |
| Render, 4 beats in parallel (17,201 frames) | 11:05:58–11:21:32 |
| finish / verify / text-only audits + encoded sheets | 11:22:53 / 11:28 / 11:28–11:37 |
| Bookends / branding | 11:49–11:50 / 11:52–11:59 |
| Bunny upload / status 4 | 12:07:59–12:08:03 / STATUS4 |

## ElevenLabs (counter is ACCOUNT-WIDE: parallel sessions move it)
before 305,014 / after 309,179 / after the retake 309,506 of 363,000.
Characters requested by this lesson, retake included: 7,736 (receipts).

## Master and branded
- Master `4.1.3-membrane-roles.mp4`: 573.367 s, 17,201 frames, sha256
  `abd2e10f1d0ad4ea9cdc5722b51460879d818c0b5653c650e604b19590c529f3`.
- Branded `4.1.3-branded.mp4`: 584.396 s (= master + 11.029 s), full decode 0 errors, sha256
  `ae673777ff82d2c1332be64f48d361f267610de96d63e07fb0507564928f6731`. Mid frame `qa/branded-mid.jpg` (5:00): Beat 7 inside the
  cream frame, title bar "What each part of the membrane does · Cambridge A Level Biology".
- Bookends: settled late frames read exactly the title (`qa/bookend-intro-late.png`, `qa/bookend-outro-late.png`).

## Verification (`qa/verification.json`, standard order)
1 ffprobe 573.367 s · 2 video ≥ encoded audio 572.366 s (margin 1.0 s) · 3 full decode 0 errors · 4 cues 141 = 141 = planned
141 · 5 AAC packets identical (26,831) · 6 final word "through." ends 569.31 s, 3.06 s headroom, −63.9 dB after · 7 silent
read (Beat 7, 4 s) and END hold (Beat 13, 2 s) PCM all zero, encoded −91 dB; speech PCM unchanged · 8 boundary audit 12
boundaries, 0 candidates · marker audit every frame (17,201): Beat 7 frames 7508–9380 carry EXAM CONTRAST (badge MAE ≤ 3.9 vs
the EXAM reference, ≥ 20.4 vs COMMON), clears on frame 9381 = completed correct frame; all other frames unmarked · longest
unchanged visual 5.83 s (Beat 12 recap) · text-only `--controls` all PASS, 0 untagged shapes; text-only runs: none (0 s).

## Sheets
Beat sheets LOOKED at before approval; fixed: label overlaps in several beats (labels given halos over drifting water),
Beat 11 cell clipping (clip-path moved into `<defs>`, stage lowered), Beat 6 retake re-timed its cues.
Encoded sheets (10, `qa/encoded-sheets/`) LOOKED at: every beat reads as intended; the E43 correction and the role grid
fill in order; no fix needed.

## Bunny
guid `93f5b0ad-6962-439e-bced-35ed1897fe0b`, title "REVIEW 4.1.3 What each part of the membrane does", no collection;
uploaded 12:08:03Z; status 4 at STATUS4 (STATUSDELTA after upload; length 584 s).

## Pronunciation (`qa/audio-review.md`)
No request-only normalisation. Retake: B6 "and whether energy is used" (take 1 heard "where the energy" by both recognisers);
take 2 is exact to the cue model (101/101). Old take in `audio/v1`.

## Shared-model sha256 used (byte-for-byte copies in `src/`)
FluidMosaicMembrane d45dca56…8525 · PhospholipidToken 9940f739…bf49 · ReceptorLigand 1cc07252…0d69 · T4Tokens 82c10a8a…45fe ·
TransportProteinSet 3bc4ab34…6d28 · WaterField 2e4f3530…4de1 · t4-palette 6c1088fc…5ec5a (all unchanged from 4.1.1-2) ·
new: CholesterolQualitative 4f37d363…55d3 (full values in `work/t4-shared/SHARED.md`).

## Design choices
1. One membrane section (left two-thirds) beside a 5 × 6 role grid (right) that fills cell by cell as each role is shown; recap and close brighten cells in place.
2. Roles are shown as motion on the same `full` membrane (O₂ lanes through the core, turn-back of ions/glucose, channel pass, one carrier preview, chains H-bonding with water), never as a new diagram.
3. Cholesterol's fluidity role is a qualitative 2 × 2 panel (higher/lower temperature × with/without cholesterol), labelled qualitative schematic, no data.

## Interpretation
E43 carries the EXAM CONTRAST badge per the brief (not COMMON MISTAKE); verify.py's marker audit was generalised to check the
EXAM reference for that beat. Opening cues added where the storyboard's first cue is not the beat's first words (B2, B3, B7
entry, B12). The carrier's one-run preview (Beat 6) holds its flipped outline afterwards (its return is 4.2.1a's).
