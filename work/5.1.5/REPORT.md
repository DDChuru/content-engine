# 5.1.5 Stem cells: replacing cells and repairing tissue by mitosis — REPORT (cloud run 009b)

**Model:** claude-opus-5-5 · branch `cloud/009-5.1.2-to-5.1.6-rmr4ks` · 27 Sep 2026 (UTC)
**Bunny (review):** guid `79ed9c00-0e3a-4959-88f2-b24ea9355163`, title "REVIEW 5.1.5 Stem cells: replacing cells and repairing tissue by mitosis", no collection; uploaded 13:28:42Z; **status 4 at 13:30:53Z (≈2 min)**; 240p–1080p, length 276 s.

## Phases (wall clock, UTC; from log/file timestamps)
| Phase | Time |
|---|---|
| TTS + Whisper (8 beats), review, second opinion, Beat 6 retake | 12:16–12:40 (beside 5.1.2's build; one Whisper process at a time) |
| cue plan (77 cues) · holds, timeline | 12:39 · 12:50 |
| StemCellLineage model, beats 1–8 authored, looked at, fixed, approved | 13:02–13:15 |
| render (8 beats, 4-way) | 13:15–13:19 |
| finish, verify, text-only, encoded sheets, count audit | 13:19–13:23 |
| bookends (rendered with 5.1.2's, 12:55–12:57) · branding | 13:23–13:27 |
| Bunny upload → status 4 | 13:28–13:31 |

## ElevenLabs characters (ACCOUNT-WIDE counter; parallel sessions move it)
before 325,601 → after 327,332; Beat 6 retake (≈450) is inside the later readings (331,412 at 12:49, 332,143 at 13:24, which also include 5.1.6's takes). Script 3,148 chars.

## Master / branded
- master `5.1.5-stem-cells.mp4`: 265.033 s, 7,951 frames, sha256 `6ffa5d9795f65fef0eac7eb5f2233f65c87e3ab422dd985c7b182fbf9226c15f`
- branded `5.1.5-branded.mp4`: 276.062 s (= master + 11.03 s), full decode 0 errors, sha256 `a6ac1ce056512eaeb1ecfe130d1d1d7bff46d9a7bb8ea7db71da89e826bd8583`; `qa/branded-mid.jpg` (Beat 4 inside the cream frame, 5.1.5 bar).

## Verification — all PASS (`qa/verification.json`)
1 ffprobe 265.033 s · 2 video 265.033 ≥ audio 264.033 · 3 full decode 0 errors · 4 cues 77 = 77 = 77 planned · 5 AAC packets identical (12,378) · 6 final word "differentiation" ends 260.62 s, headroom 3.41 s · 7 silent holds: B4 END 2 s (memory hook), B8 END 2 s — digital silence, −91 dB; speech PCM unchanged · 8 boundary one-frame holds: 0 · **every-frame marker audit: no error beat in 5.1.5; 7,951 / 7,951 frames unmarked, 0 mismatches** · longest unchanged visual 5.5 s · `verify-text-only --controls` PASS; text-only runs 0; untagged shapes 0.

## Count audit (encoded master; `qa/count-audit.png`, five frames round each event)
| Event (frame) | frame before | event frame |
|---|---|---|
| B3 excerpt entry (frame 0 of B3, 1,544) | — (time cut into anaphase, captioned) | whole cell 8 daughter chromosomes · 8 |
| B3 new envelopes closed (1681) | whole cell 8 daughter chromosomes · 8 | whole cell 8 · 8; each new nucleus 4 · 4 |
| B3 cytokinesis complete (1951) | whole cell 8 · 8; each new nucleus 4 · 4 | each daughter cell 4 · 4 |
No other count is shown (the lineage miniatures carry no count strip, per the storyboard).

## Sheets: seen and fixed
Beat 3: the strawberry overlapped its panel title; the model caption hid under the context strip. Beat 4: the first 2.2 s had no model (bone and stem cell now fade in from the first frames); labels overlapped the mitosis arrow. Beat 5: vessel label and lifespan note repositioned. Beats 6–7: skin arrows/tags overlapped labels. Encoded sheets (5): no defect found (Beat 4 opens with a 0.3 s fade-in of the lineage).

## Pronunciation
Beat 6: "extra divisions there help" heard as "…, they help" by both recognisers → request-only comma `there, help`; take 2 heard correctly. Beat 3's appended "thank you for watching" was a recogniser hallucination (second opinion clean). `qa/audio-review.md`.

## Shared models used (sha256 of `src/` copies = `work/t5-shared`)
ChromosomeModel `d727c225…3319` · MitosisCellModel `f063ac7b…5b9e` (added by 009b) · CellCycleWheel `577b4186…6d7c` · DNAContentGraph `4fcc7b5d…4591` · TelomereEndModel `8ba409de…b666` · T5Annot `ec225c18…6961` · t5-palette `1b4ce00b…34aa`. Lesson-owned: `StemCellLineage.tsx`; 5.1.2's `ContextStrip.tsx` copied in for the recall strip and the skin strip.

## Images / Video description
No image in 5.1.5; no credit paragraph needed.

## Design choices
1. One marrow lineage (bone, niche, three intermediate stages, nucleus pushed out, maturation in the vessel) is built in Beats 4–5 and reused, reduced, in Beats 6–8.
2. The two steps are colour-coded throughout: mitosis arrows teal, differentiation arrows gold; the boxed sentence's two words take the same colours.
3. Every division is a captioned excerpt with an explicit time cut into anaphase (never an unreplicated cell morphing into eight chromosomes).

## Interpretations / for the conductor
- **Memory hook said as a phrase:** Beat 4 speaks "Picture it like the stem of a plant, where the branches start" and converts it; the second link (branches → differentiated cells) is not spoken explicitly. On screen: "stem" glows with *a stem cell*, then the branches with *differentiate into specialised cells*; tagged *memory aid, not the exam answer*; 2 s hold after. Narration unchanged.
- Beat 4's second (self-renewal) excerpt leaves two cells: one labelled *stem cell (self-renewal)*, the other moved aside unlabelled.
- Beat 5 starts a new division in the marrow (not a replay), so no replay tag. Beat 8's "a new red cell moves into the vessel" is drawn as one small cell travelling.
