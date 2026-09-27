# 5.1.6 When division runs out of control: tumours — REPORT (cloud run 009b)

**Model:** claude-opus-5-5 · branch `cloud/009-5.1.2-to-5.1.6-rmr4ks` · 27 Sep 2026 (UTC)
**Bunny (review):** guid `6d679cd3-18f7-408f-9e64-d62597e0361c`, title "REVIEW 5.1.6 When division runs out of control: tumours", no collection; uploaded 13:46:36Z; **status 4 at 13:48:46Z (≈2 min)**; 240p–1080p, length 365 s.

## Phases (wall clock, UTC; from log/file timestamps)
| Phase | Time |
|---|---|
| TTS + Whisper (9 beats), review, second opinion, retakes (Beat 3 ×2, Beat 8 ×3) | 12:24–12:50 (beside 5.1.2's build; one Whisper process at a time) |
| cue plan (86 cues), holds, timeline | 12:39 · 12:50 |
| TissueGrowthModel, beats 1–9 authored, looked at, fixed, approved | 13:16–13:23 |
| render (9 beats, 4-way) | 13:23–13:32 |
| finish, verify, text-only, encoded sheets | 13:32–13:36 |
| branding; branded mid-frame showed the Beat 5 tap inset crossing the caption rule → Beat 5 fixed, re-approved, re-rendered alone; finish/verify/sheets/brand again | 13:36–13:46 |
| Bunny upload → status 4 | 13:46–13:49 |

## ElevenLabs characters (ACCOUNT-WIDE counter; parallel sessions move it)
before 327,332 → after 330,657 → after retakes 331,412 (12:49) → 332,143 at session end (13:46; includes 5.1.5's Beat 6 retake). Script 4,255 chars.

## Master / branded
- master `5.1.6-tumours.mp4`: 354.300 s, 10,629 frames, sha256 `9bd1fb777b2213f8ba7c9761871aec8bfa8e5a5e323147ab13726be966305039`
- branded `5.1.6-branded.mp4`: 365.329 s (= master + 11.03 s), full decode 0 errors, sha256 `8680e1d6db91beb93b170891c89e810d1b9b7aee3796399a3738d3626550a447`; `qa/branded-mid.jpg` (Beat 5 inside the cream frame, 5.1.6 bar). The first branded file (before the Beat 5 fix) was superseded and never uploaded.

## Verification — all PASS (`qa/verification.json`)
1 ffprobe 354.300 s · 2 video 354.300 ≥ audio 353.300 · 3 full decode 0 errors · 4 cues 86 = 86 = 86 planned · 5 AAC packets identical (16,562) · 6 final word "loss" ends 350.22 s, headroom 3.08 s · 7 silent reads: B7 4 s; B5 2 s before "Usually more than one" (memory hook); B9 END 2 s — digital silence, −91 dB; speech PCM unchanged · 8 boundary one-frame holds: 0 · **every-frame marker audit: EXAM CONTRAST on B7 frames 6331–8521 (clears on 8522, the completed correct frame); 2,191 marked / 8,438 unmarked, 0 mismatches; badge MAE vs EXAM ref ≤ 3.93, vs COMMON ≥ 20.4** · longest unchanged visual 8.0 s · `verify-text-only --controls` PASS; text-only runs 0; untagged shapes 0.

## Count audit
Not applicable: 5.1.6 shows no chromosome or DNA-molecule counter (storyboard: "no counts are made in this lesson"; no cell count is shown as a number). The replication event is shown on the inset only: the star appears on both sister chromatids on the replication-complete frame (Beat 5), and the inset returns to one daughter chromosome under the label *after division: one daughter chromosome (schematic)*.

## Sheets: seen and fixed
Vessels overflowed the small tissue panels (vessel depth now scales with the panel); balance pictograms scaled down where they crowded; Beat 3's growing inset hid behind the chromosome inset (dimmed while open); Beat 5's sentence typed ahead of its clauses (now paced to the clause cues) and its tap inset crossed the caption rule (moved; Beat 5 re-rendered). Encoded sheets (7): no defect found after the fix.

## Pronunciation
Beat 3: "goes round" heard "goes around" in two takes → request-only `<break time="0.1s" />` before "round"; take 3 heard correctly. Beat 8: "building a mass" heard "mess" (p 0.34) and "inherit it" as "inherited" in all four takes; take 1 kept (the voice's "mass" is recognised at p ≥ 0.98 in Beats 5 and 7). **Conductor: please listen to Beat 8 at 0:20.** `qa/audio-review.md`.

## Shared models used (sha256 of `src/` copies = `work/t5-shared`)
ChromosomeModel `d727c225…3319` (inset) · MitosisCellModel `f063ac7b…5b9e` (added by 009b; dividing glyphs) · CellCycleWheel `577b4186…6d7c` · DNAContentGraph `4fcc7b5d…4591` · TelomereEndModel `8ba409de…b666` · T5Annot `ec225c18…6961` · t5-palette `1b4ce00b…34aa`. Lesson-owned: `TissueGrowthModel.tsx` (uses 5.1.2's `ContextStrip` skin strip).

## Images / Video description
No image in 5.1.6; no credit paragraph needed.

## Design choices
1. One tissue (basal division, rising and shed cells, basement layer, blood and lymph vessels) carries the lesson, with a balance pictogram (cells made / cells lost) that tips only when the starred pile outgrows ordinary loss.
2. The mutation is a black star on the inset's gene band and on the basal nucleus; every descendant carries it; no terracotta outside the badge.
3. Benign and malignant are two panels of the same tissue, so the only difference the eye sees is the boundary versus invasion and spread.

## Interpretations / for the conductor
- **Memory hook said as a phrase:** Beat 5 speaks "Picture a tap stuck open while the drain stays the same" without naming what tap and drain stand for. On screen: *tap stuck open: division · drain the same: cells lost · level rises: a mass*, and the tap, flow and level glow with the matching clauses as spoken; 2 s hold after the sentence. Narration unchanged.
- The benign boundary is drawn as an arc over the mass down to the intact basement line (side view). Beat 8's recap panels are redrawn smaller copies of the same tissue states (not new diagrams).
