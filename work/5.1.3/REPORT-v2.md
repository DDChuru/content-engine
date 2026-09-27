# 5.1.3 The mitotic cell cycle: copy first, then share — REPORT **v2** (cloud run 009f fix pass)

**Model:** claude-opus-5-5 · branch `cloud/009f-fix-4t1jp6` (from `cloud/009-5.1.1-to-5.1.4-qls6vy`) · 27 Sep 2026 (UTC) · v1 report: `REPORT-v1.md`
**Bunny v2 (review):** guid `da3aaf6e-e161-4c60-9dbe-0377c2aff15c`, title "REVIEW 5.1.3 v2 The mitotic cell cycle: copy first, then share", no collection; uploaded 2026-09-27T13:08:27Z; **status 4 at 2026-09-27T13:11:29Z** (≈3 min); 240p–1080p, length 543 s. v1 guid `8d2edf6f…` untouched.

## Review findings → fixes
| Finding (Codex review, CHANGES) | Fix |
|---|---|
| P2 labels < 17 px; the two "daughter chromosome" labels collide (B7), small graph/axis labels | New rule enforced mechanically: `verify-label-size.cjs` (run by `verify.py`) renders every 0.5 s + every cue (1,466 frames), takes each visible text's font size × its transform scale × the 0.8802 branding scale and FAILS below 17 px; it also fails on any two overlapping text boxes or text off the frame. Result: **smallest 17.6 px, 0 failures, 0 overlaps.** House type floored at 20 source px (`shared/src/Type.tsx` `MIN_TEXT`, `Panels.tsx`, `kit.tsx` captions); shared models floored (t5-shared, see `work/t5-shared/CHANGELOG.md`). B7: each "daughter / chromosome" label now sits OUTSIDE the wheel on its own side with a leader to its own daughter chromosome; spindle fibres/equator/pole/new nucleus 20 px; B12 enlarged-inset labels two-line 20 px. Also re-laid out: B4 magnifier moved off the G1 label, B5 "sister chromatids" off G1, B13 recap insets, B14 hook panel, B6/B8 tags. |
| P2 copy/share/split handle too fast, no paired mapping or hold | Hook re-voiced (below) and rebuilt in B9: a mapping card, one row per link, lit **together with its target** as each is spoken — copy ↔ S arc + graph rise, share ↔ M arc (two nuclei), split ↔ C arc + graph drop — then all three held lit through a **2.0 s digital-silence hold** before "Written properly" (verify step 7: −91 dB). Hook beat ≈ 13.6 s (was 2.1 s). The exam sentence follows unchanged. |
| P3 delivered audio outlasted the picture by 47 ms | Branding now pads the picture 0.2 s (`work/apply-branding-v2.sh` = the kit script + `tpad` on the final concat). New `verify_delivered.py` checks the DELIVERED file: video end 543.033333 s ≥ audio end 542.862 s (margin 0.1713 s), last packets likewise, full decode 0 errors. |

## Narration changes (ONLY the hook sentence of Beat 9; everything else frozen)
- v1: *Think of it as a copy-then-share routine.*
- v2: *Think of it as a copy, share, split routine. Copy: replication, in the S phase. Share: mitosis, sharing the copies between two new nuclei. Split: cytokinesis, splitting the cytoplasm.* + 2 s held silence.
Only Beat 9 was re-voiced (Thandi, eleven_multilingual_v2, speed 1.0, request 486 chars; no normalisation; Whisper 74/74 words, no mangled terms). `STORYBOARD.md` updated to match; all other beats reuse their v1 MP3s byte for byte.
ElevenLabs (account-wide counter): 329,672 before → 330,301 after this lesson's request (332,143 after all three lessons).

## Phases (UTC)
fixes + re-voice + timeline 12:27–12:47 · render 14 beats 12:47–12:52 · finish/verify/sheets 12:53–13:00 · bookends 12:57 · branding 13:01–13:08 · upload 13:08 → status 4 2026-09-27T13:11:29Z.

## Master / branded (v2)
- master `5.1.3-mitotic-cell-cycle.mp4`: 531.833 s, 15,955 frames, sha256 `02a4c4b03dd3f07653ff4fc97ce808e5c265d10d19a42f8c609be3eabd31f740`
- branded: 543.033333 s (= master + 11.03 s bookends + 0.17 s end pad), full decode 0 errors, sha256 `b4736fb2a02b5ba6b29f70a82c7e986147a5f1b68d95e99f28a4deb32c25aee3`; `qa/branded-mid-v2.jpg` shows B9's hook card inside the cream frame with the 5.1.3 bar.

## Verification (master, PIPELINE-STANDARD §4) — all PASS
1 ffprobe 531.833 s · 2 video ≥ encoded audio (margin 1.0 s, master) · 3 decode 0 errors · 4 cues 150 = 150 = 150 planned · 5 AAC packets identical (24,884) · 6 final word "cells" ends 527.78 s, headroom 3.05 s · 7 silences: B9 hook hold 2 s, B10 4 s, B12 4 s, B14 END — all −91 dB, speech PCM unchanged · 8 boundary one-frame holds 0 · every-frame marker audit: EXAM CONTRAST B10 f8732–10872 (clears 10873) and B12 f11683–13748 (clears 13749); 4,207 marked / 11,748 unmarked, 0 mismatches; badge MAE vs EXAM ≤ 3.93, vs COMMON ≥ 20.4 · longest unchanged visual 7.9 s · text-only controls PASS, 0 untagged, longest text-only run 0.5 s · **label size ≥ 17 px (min 17.6), 0 overlaps** · delivered file: see above.

## Count audit (encoded master; `qa/count-*.jpg`, before | event frame) — unchanged frames from v1 (beats 1–8 audio unchanged)
| Event | before | event |
|---|---|---|
| end of S, f3863 | 4 · replication in progress; inset 1 · in progress | 4 (8 sister chromatids) · 8; inset 1 · 2 |
| centromeres divide, f5708 | whole cell 4 · 8; inset 1 · 2 | 8 · 8; tracked pair 2 daughter chromosomes · 2 DNA; labels on the same frame |
| new nuclei formed, f6073 | 8 · 8 | + each new nucleus 4 · 4 |
| cytokinesis, f6905 | 8 · 8 + 4 · 4, graph at 2 | each daughter cell 4 · 4, graph 1 |

## Sheets
Per-beat stills and all 10 encoded sheets looked at. Found and fixed before render: B1 "full copy in each?" / "same genetic information" cross-fade overlap; B6/B8 tags into the wheel; B8 highlight rows re-pitched to the taller count strip; B13/B14 small insets re-laid out; B10 source line off-frame. Encoded sheets: no defects found.

## Shared models (sha256 of the copies in `src/`; byte-identical to `work/t5-shared`)
ChromosomeModel `124e4195…6aa5d` · CellCycleWheel `456fef65…7cfba` · DNAContentGraph `99b69034…fe18` · T5Annot `c8081bb1…8ee4` · TelomereEndModel `0ad089f5…1dfc` (full values: `work/t5-shared/SHARED.md`) · t5-palette `1b4ce00b…34aa`.

## Images / Video description
None (no photomicrograph in 5.1.3).

## Interpretations
- Hook wording: the storyboard's "copy-then-share" became the three-link "copy, share, split" so every Beat 1 icon maps to one stage (the review asked for exactly this mapping).
- 2 s hold implemented as inserted digital silence before "Written properly" (insert_holds), so the completed mapping is held with no speech over it.
