# 4.1.3 What each part of the membrane does · BUILD PROGRESS (handover)

Updated 2026-09-27 10:45Z. Builder: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`; commit work/<code> + work/t4-shared only; push that branch only.
**Phase: audio + timeline done; authoring beats** · **Beats complete: 0 / 13** · master: not yet built
Live render processes: 5127 bash -c printf "%s\n" "$@" | xargs -P 4 -I{} sh -c "nice -n 10 \"\$NODE\" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=\$?; echo beat {} exit \$rc; exit \$rc" _ 1 2 3 4 5 6 7 8 9 10 11 12 13
5129 xargs -P 4 -I{} sh -c nice -n 10 "$NODE" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=$?; echo beat {} exit $rc; exit $rc
5588 sh -c nice -n 10 "$NODE" render-beat.cjs 6 > logs/render-beat-6.log 2>&1; rc=$?; echo beat 6 exit $rc; exit $rc
5589 node render-beat.cjs 6
5664 sh -c nice -n 10 "$NODE" render-beat.cjs 7 > logs/render-beat-7.log 2>&1; rc=$?; echo beat 7 exit $rc; exit $rc
5665 node render-beat.cjs 7
5721 sh -c nice -n 10 "$NODE" render-beat.cjs 8 > logs/render-beat-8.log 2>&1; rc=$?; echo beat 8 exit $rc; exit $rc
5722 node render-beat.cjs 8
5780 sh -c nice -n 10 "$NODE" render-beat.cjs 9 > logs/render-beat-9.log 2>&1; rc=$?; echo beat 9 exit $rc; exit $rc
5781 node render-beat.cjs 9
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:47 | 1148 | 9 | not authored |
| 2 | What you will be able to do · 0:47–1:13 | 695 | 6 | not authored |
| 3 | The membrane, and why its parts matter · 1:13–2:00 | 1331 | 12 | not authored |
| 4 | Permeability: the hydrophobic core · 2:00–2:54 | 1576 | 13 | not authored |
| 5 | Transport: channel proteins · 2:54–3:42 | 1331 | 13 | not authored |
| 6 | Transport: carrier proteins · 3:42–4:32 | 1427 | 12 | not authored |
| 7 | EXAM CONTRAST E43: the word "membrane" · 4:32–5:47 | 1905 | 15 | not authored |
| 8 | Fluidity: moving phospholipids and cholesterol · 5:47–6:36 | 1469 | 12 | not authored |
| 9 | Stability: cholesterol and the carbohydrate chains · 6:36– | 1187 | 9 | not authored |
| 10 | Cell signalling: receptors · 7:16–8:04 | 1378 | 10 | not authored |
| 11 | Cell recognition: antigens · 8:04–8:38 | 989 | 7 | not authored |
| 12 | What I told you, on the membrane · 8:38–9:13 | 1262 | 12 | not authored |
| 13 | How it is asked, the reject card, and the sodium ion · 9:1 | 1473 | 11 | not authored |

## Session
Cloud run 008a, lessons in order: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a. Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`.
Shared Topic 4 models: `work/t4-shared/` (SHARED.md), copied byte for byte to the top level of `src/`.
## Resume procedure (fresh container)
Setup per cloud-inputs/008/BRIEF.md (+ `pip install brotli` for make_fonts.py). `python3 make_fonts.py`.
Audio is in git: `python3 generate_audio.py` re-derives WAVs from the MP3s without a request; then
`python3 insert_holds.py && python3 assemble_timeline.py`. Render approved beats with `./render-batch.sh …`.
## Decisions
- E43 (Beat 7) badge EXAM CONTRAST; clears on the completed correct frame at the END of "through channel or carrier proteins" (cue key `exit`).
- Opening cues added: B2 "By the end", B3 "Here is the membrane", B7 entry "Now an exam contrast", B12 "So here it is".
- Layout: membrane at left two-thirds (cx 560, u 44), RoleGrid at right (x 1060–1850); beat 7 swaps the grid for the error card.
