# 5.1.1 Inside a chromosome — REPORT **v2** (cloud run 009f fix pass)

**Model:** claude-opus-5-5 · branch `cloud/009f-fix-4t1jp6` (from `cloud/009-5.1.1-to-5.1.4-qls6vy`) · 27 Sep 2026 (UTC) · v1 report: `REPORT-v1.md`
**Bunny v2 (review) — USE THIS ONE:** guid `57fc3274-a85a-41dc-8db5-f40abc33dfd4`, title "REVIEW 5.1.1 v2 Inside a chromosome", no collection; uploaded 2026-09-27T13:17:49Z; **status 4 at 2026-09-27T13:19:51Z** (≈2 min); 240p–1080p, length 404 s.
**Superseded (ignore):** guid `543e1b66-5bed-49e2-8c59-ba2720e7415f`, same title, uploaded 12:53:18Z (status 4 12:55Z) — encoded-sheet check then found the B6 caption "schematic drawing — not a photomicrograph" running over the chromosome end; fixed, re-rendered, re-uploaded. Nothing was deleted (brief). v1 guid `e45b3801…` untouched.

## Review findings → fixes
| Finding (Codex review, CHANGES) | Fix |
|---|---|
| P2 count-strip labels 13–14 px (B10), other small teaching labels (B5 etc.) | t5-shared `CountStrip` rebuilt: labels ≥ 20 source px and the row height, DNA column and box width GROW to fit (B10 strip grows leftwards from its fixed right edge; no text pushed into a neighbour). All house type floored at 20 px (`shared/src/Type.tsx`, `Panels.tsx`, `kit.tsx`). New `verify-label-size.cjs`, run by `verify.py`: every visible text's size × transform scale × 0.8802 branding scale must be ≥ 17 px, and no two text boxes may overlap or leave the frame. **Smallest 17.6 px, 0 failures, 0 overlaps** (1,088 frames: every 0.5 s + every cue). The shrinking hook scale bar keeps its label ≥ 20 px (`TextScale` context). |
| P2 stale CellCycleWheel copy | All six shared files re-copied; every `src/` copy is byte-identical to `work/t5-shared` (hashes below; `SHARED.md`, `CHANGELOG.md`). |
| P2 staple handle lacked the explicit paired mapping | Re-voiced (below). B7: as each link is spoken its hook word and target light together — page ↔ one sister chromatid (sheet + chromatid traced + label), photocopy ↔ the other, staple ↔ centromere (ringed + label) — rows build on a mapping card, then "two sheets, one set = one chromosome" and a **2.0 s digital-silence hold** on the completed mapping before "Written properly" (−91 dB). Handle ≈ 20.9 s (was 8 s); the exam sentence follows unchanged. |
| P3 delivered audio 49 ms past the picture | `work/apply-branding-v2.sh` (kit script + 0.2 s `tpad` on the final concat); `verify_delivered.py` checks the DELIVERED file: video end 404.5 s ≥ audio end 404.329 s (margin 0.171 s), 0 decode errors. |

## Narration changes (ONLY the hook of Beat 7; everything else frozen)
- v1: *Picture a page and its photocopy, held by a single staple: two identical sheets, still one stapled set.*
- v2: *Picture a page and its photocopy, held by a single staple. The page: one sister chromatid. The photocopy: the other sister chromatid, identical to the first. The staple: the centromere, holding the two together. Two sheets, one stapled set: two sister chromatids, one chromosome.* + 2 s held silence.
Only Beat 7 re-voiced (Thandi, eleven_multilingual_v2, speed 1.0, 659 chars, no normalisation; Whisper 101/101 words). `STORYBOARD.md` updated. ElevenLabs (account-wide): 329,672 before → 332,143 after all three lessons.

## Phases (UTC)
setup + reading reviews 12:18–12:25 · re-voice 12:27 · label audit + fixes + B7 hook 12:25–12:36 · render 12:33–12:38 · finish/verify 12:38–12:42 · bookends 12:43 · branding 12:42–12:49 · first v2 upload 12:53 (superseded) · B6 fix, re-render + verify 13:02–13:12 · re-brand 13:12–13:17 · upload 13:17 → status 4 2026-09-27T13:19:51Z.

## Master / branded (v2)
- master `5.1.1-inside-a-chromosome.mp4`: 393.3 s, 11,799 frames, sha256 `8f695ec9ee5bf05413ee48ceae04b4313a7b0459b40cf734bbd82cf6ff845d4a`
- branded: 404.5 s (= master + 11.03 s + 0.17 s end pad), 0 decode errors, sha256 `257e0cb8501ffd5167787c38b7f28d5caa3c2bd4a4520509674c50d64b3802de`; `qa/branded-mid-v2.jpg`: B6 inside the cream frame, 5.1.1 bar.

## Verification (master) — all PASS
1 ffprobe 393.3 s · 2 video ≥ encoded audio (1.0 s, master) · 3 decode 0 errors · 4 cues 111 = 111 = 111 planned · 5 AAC packets identical (18,391) · 6 final word "centromere" ends 389.41 s, headroom 2.89 s, −84 dB after · 7 silences: B7 hook hold 2 s, B11 END — −91 dB, speech PCM unchanged · 8 boundary holds 0 · marker audit every frame: 0 marked / 11,799 (no error beat) · longest unchanged visual 8.6 s · text-only controls PASS, 0 untagged, longest run 0 s · label size/overlap PASS · delivered file PASS.

## Count audit (encoded master; `qa/count-*.jpg`, frame before | event frame)
| Event | before | event |
|---|---|---|
| B5 replication complete, f3992 | 1 centromere · 1 DNA molecule | 1 centromere · 2 DNA molecules |
| B8 replication complete (whole cell), f7907 | 4 · replication in progress | 4 · 8 (model X's complete on the same frame) |
| B9 centromeres divide (whole cell), f8656 | 4 · 8 | 8 · 8 (daughter-chromosome labels same frame) |
One pole 4 · 4 appears after arrival (f9248). B8/B9 frames moved +533 from v1 because of the 2 s B7 hold and the longer B7 audio.

## Sheets
Per-beat stills and all 7 encoded sheets looked at. Fixed: B7 mapping highlights cleared as the sentence writes; B9 schematic note wrapped (was off-frame); B10 human-scale panel text re-laid; B11 "I kinetochore" note moved clear; B6 field caption above the circle (encoded-sheet finding). Final encoded sheets: no defects found.

## Shared models (sha256 in `src/`; byte-identical to `work/t5-shared`)
ChromosomeModel `124e4195…a5d` · CellCycleWheel `456fef65…cfba` · DNAContentGraph `99b69034…fe18` · T5Annot `c8081bb1…8ee4` · TelomereEndModel `0ad089f5…1dfc` · t5-palette `1b4ce00b…34aa` (full values `work/t5-shared/SHARED.md`).

## Images / Video description
None (no photomicrograph in 5.1.1).

## Interpretations
- Page ↔ one chromatid, photocopy ↔ the other: the photocopy link also carries "identical to the first" (sister chromatids are copies).
- The 2 s hold is inserted digital silence before "Written properly", so nothing is said over the completed mapping.
