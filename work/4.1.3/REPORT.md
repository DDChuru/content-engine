# 4.1.3 — What each part of the membrane does · REPORT

## v2 (cloud run 008f, 27 Sep 2026) — fixes for review `cloud-reviews/4.1.3-REVIEW.md` (CHANGES)
Branch `cloud/008f-fix-4prnob`. 13 beats, 1 error beat (E43, Beat 7), 145 cues (+4 hook cues).
**Bunny guid `2887cc09-d18d-4bf9-96c7-ad9c649abf75`** "REVIEW 4.1.3 v2 What each part of the membrane does", no collection;
uploaded 15:56Z; **status 4 at 16:00:24Z** (≈4 min; 240p–1080p, 602 s).

| Finding | Fix |
|---|---|
| 1 HIGH recap glycolipid leader on an inner head | Beat 12: the *glycolipids: recognition, stability* leader now ends on the OUTER-leaflet glycolipid's carbohydrate chain (`compPos(…,'glycolipid')`, above the outer heads); every recap leader re-anchored to the new spec slots and looked at (08:40–08:48 equivalent). |
| 2 text < 17 px | Every text ≥ 20 px at 1:1 (≥ 17.59 px delivered), no exemptions: role grid rebuilt at 20 px (icon above name, 124 px rows), Beat 13 recap uses a full-size cholesterol row instead of the 0.55-scaled grid, memory inset 20 px, shared CholesterolQualitative relaid (labels beside curves, 20–21 px). Per-frame `label-audit.cjs` in `render-beat.cjs` (size after branding incl. transforms, text/text, leader/text, text-on-geometry, off-frame): **17,733/17,733 frames, min 17.59 px, 0 violations**, asserted per beat in `verify.py`. |
| 3 oil-and-water hook unmapped | Beat 4 re-voiced (hook only): *"Oil: the non-polar tails in the core. Water: the watery solutions on each side, holding the ions and glucose. They don't mix, so those stay out of the core. The membrane isn't a film of oil; only its core is oil-like."* Oil ↔ tail core and water ↔ both watery sides light together with link tags, then a **2 s silent hold** on the completed mapping before *"The membrane isn't a film"*. |
| 4 positions ≠ spec | Shared `FluidMosaicMembrane` now uses the literal SHARED-SPECS slots (glycolipid 2, channel 4–5, cholesterol 6/7, receptor 8–9, carrier 10–11, glycoprotein 12); all lesson anchors (lanes, labels, grid links) moved to them. `../t4-shared/CHANGELOG.md`. |
| 5 audio outlasts video | `work/brand_final.py` pads the picture after branding (last frame cloned), audio untouched: **video ends 0.204 s after audio** (602.333 vs 602.129 s). |

**Narration changes (the only ones):** Beat 4 hook sentences above (+ 2.0 s hold). First take recognised "bilayer" as "B layer"
(both recognisers) and was retaken (old take in `audio/v-008f-t1/`). **ElevenLabs** (account-wide): 340,986 before / 341,806
after (820 chars incl. the retake). Beat 7 exam-contrast card now switches to the corrected text in one frame (no overlap).
**Master** `4.1.3-membrane-roles.mp4` 591.1 s, 17,733 frames, sha256 `42098e9e536b9da6c7c49dd2465f5ff22ac6fbdde2d7e41a6c887ade413c4a05`.
**Branded** `4.1.3-branded.mp4` 602.333 s, sha256 `044a7c1de612b7a56c690b87b1c966138f2233be4915ac2345bc6cbae6534f19`, full decode
0 errors, video ≥ audio (`qa/branded-verification.json`); `qa/branded-mid.jpg` looked at (bar + frame correct).
**Verification** (`qa/verification.json`): ffprobe 591.1 · video ≥ audio (1.0 s) · decode 0 · cues 145/145/145 · AAC packets
identical (27,662) · final word "through." 3.06 s headroom · silent holds B4 hook 2 s, B7 read 4 s, B13 END 2 s all −91 dB ·
12 boundaries, 0 candidates · marker audit 17,733 frames, 0 mismatches · label audit 0 violations · longest still 5.83 s ·
text-only PASS (longest 0 s, 0 untagged). Encoded sheets (10) looked at.
**Interpretation:** the recap grid's per-cell layout was replaced by a narrower 20 px grid (fewer words per cell; meanings kept).

---

## v1 (run 008a) — superseded (details below)
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
| Bunny upload / status 4 | 12:07:59–12:08:03 / 12:11:10 (≈3 min) |

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
uploaded 12:08:03Z; status 4 at 12:11:10Z (3 min 7 s after upload; length 584 s; 240p–1080p).

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
