# 5.1.4 Telomeres: why copying costs telomere, not genes — REPORT **v2** (cloud run 009f fix pass)

**Model:** claude-opus-5-5 · branch `cloud/009f-fix-4t1jp6` (from `cloud/009-5.1.1-to-5.1.4-qls6vy`) · 27 Sep 2026 (UTC) · v1 report: `REPORT-v1.md`
**Bunny v2 (review):** guid `d6705b5e-1b23-44fa-a633-2f28a6e10e3c`, title "REVIEW 5.1.4 v2 Telomeres: why copying costs telomere, not genes", no collection; uploaded 2026-09-27T13:13:55Z; **status 4 at 2026-09-27T13:15:57Z** (≈2 min); 240p–1080p, length 270 s. v1 guid `13c90983…` untouched.

## Review findings → fixes
| Finding (Codex review, CHANGES) | Fix |
|---|---|
| P2 recall panel covered the end of "S (synthesis) phase of interphase"; "sister chromatids" ran into G1 (B2) | The recall panel moved right (x 1262–1762) so the full S-phase callout is clear of it; "sister / chromatids" is a two-line label inside the inset, clear of G1; "still one chromosome" sits above the wheel. Checked by the new overlap audit (0 overlaps) and on stills. |
| P2 schematic qualifications missing on later uses (block note, whole-run TTAGGG, endpoint-comparison note) | `tel.tsx` `Captions` now carries all three notes at 20 px (wrapped to the space) and `RunLabel` carries "repeat in humans: TTAGGG (the whole run)" on the run. Shown wherever the model is: B1 hook magnifier (all three), B4 (block note enlarged, 20 px), B5 (all three), B6 thought-experiment copying (comparison note; its grey run is removed) and real model (shortening + block note), B7 recap and B8 exam model (shortening + block note + TTAGGG), B8 closing hook copy (all three while copying). |
| P2 endpoint labels / model answer / B2 labels < 17 px | Label-size audit (`verify-label-size.cjs`, run by `verify.py`): every visible text's size × transform × 0.8802 branding scale must be ≥ 17 px, and no two text boxes may overlap. **Smallest 17.6 px, 0 failures, 0 overlaps** (740 frames). "end after round n", "starting end", "lost from the telomere" 20 px; B8 model answer 20 px in a taller box; the B6 set-aside model's labels leave before it shrinks. |
| P2 buffer hook only a phrase | Re-voiced (below); B6 mapping card lights each link WITH its target — buffer ↔ grey run + its bracket + the buffer stop, track ↔ gene bands + the rails, "takes the loss first" ↔ "lost from the telomere", "stays intact" ↔ genes — then a **2.0 s digital-silence hold** on the completed mapping before "Written properly" (−91 dB). Hook ≈ 14.6 s (was 2.6 s). |
| P3 delivered audio outlasted the picture by 36 ms | `apply-branding-v2.sh` pads the picture 0.2 s; `verify_delivered.py` on the DELIVERED file: video end 270.266667 s ≥ audio end 270.096 s (margin 0.1707 s), 0 decode errors. |
| Report wording "no replication-complete … event on screen" | Corrected: B2 shows a replication RECALL (the inset completes as the marker leaves S) but has no numerical counter; the only counter is the round counter. |

## Narration changes (ONLY the hook of Beat 6; everything else frozen)
- v1: *Picture it as a buffer at the end of the line.*
- v2: *Picture it as a buffer at the end of the line. The buffer: the telomere, the repeated DNA at the tip. The track behind the buffer: the nearby genes. The buffer takes the loss first; the track stays intact.* + 2 s held silence.
Only Beat 6 re-voiced (Thandi, eleven_multilingual_v2, speed 1.0, 647 chars, no normalisation; Whisper 107/107 words). `STORYBOARD.md` updated. ElevenLabs (account-wide): 329,672 before → 332,143 after all three lessons' re-voicing.

## Phases (UTC)
fixes + re-voice + timeline 12:28–13:00 · render 8 beats 13:00–13:05 · finish/verify/sheets 13:05–13:09 · bookends 13:09 · branding 13:09–13:13 · upload 13:13 → status 4 2026-09-27T13:15:57Z.

## Master / branded (v2)
- master `5.1.4-telomeres.mp4`: 259.067 s, 7,772 frames, sha256 `ddf899b92c222575256cc637f8702c7450f9fb41e4a51cea52811267246b3b8f`
- branded: 270.266667 s (= master + 11.03 s + 0.17 s end pad), 0 decode errors, sha256 `4cf51b201140306ae854ecc3fbc1de54da7c1960bb7aa79222195c2d2ddf53ab`; `qa/branded-mid-v2.jpg`: B6 completed mapping inside the cream frame, 5.1.4 bar.

## Verification (master) — all PASS
1 ffprobe 259.067 s · 2 video ≥ encoded audio (1.0 s, master) · 3 decode 0 errors · 4 cues 81 = 81 = 81 planned · 5 AAC packets identical (12,098) · 6 final word "intact" ends 254.91 s, headroom 3.16 s · 7 silences: B6 hook hold 2 s, B8 END — −91 dB, speech PCM unchanged · 8 boundary holds 0 · marker audit every frame: 0 marked / 7,772 (no error beat) · longest unchanged visual 7.0 s · text-only controls PASS, 0 untagged, longest run 0.5 s · label size/overlap PASS · delivered file PASS.

## Count audit (rendered frames, `count-audit.cjs`)
No chromosome/DNA counter (B2 = replication recall, no number). Round counter (B5): appears at f3122 showing 0; f3226 → f3227 0 → 1; f3499 → f3500 1 → 2; f3687 → f3688 2 → 3 (round starts; same frames as v1 and the review). No block ever detached; genes intact in the real state.

## Sheets
Per-beat stills and all 5 encoded sheets looked at. Fixed before render: B6 "part of a gene not copied" tag into the tick labels; "starting end" into "lost from the telomere"; "typical dividing somatic cells" tag into the counter (moved above it); B6 counter box too narrow for "thought-experiment rounds" (lesson-local `WideCounter`); B8 layout (hook panel with its notes, taller answer/reject cards). Encoded sheets: no defects found.

## Shared models (sha256 in `src/`; byte-identical to `work/t5-shared`, see `SHARED.md`)
TelomereEndModel `0ad089f5…1dfc` · ChromosomeModel `124e4195…a5d` · CellCycleWheel `456fef65…cfba` · DNAContentGraph `99b69034…fe18` · T5Annot `c8081bb1…8ee4` · t5-palette `1b4ce00b…34aa`.

## Images / Video description
None (no photomicrograph in 5.1.4).

## Interpretations
- "Track" names the line behind the buffer stop so the second link has its own hook word; the mapping stays qualified ("takes the loss first" = "initially removes telomeric DNA").
- In B6's thought experiment the grey run is gone, so the block note is not shown there (nothing grey to qualify); the comparison note is, while rounds copy.
