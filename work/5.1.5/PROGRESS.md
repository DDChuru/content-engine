# 5.1.5 Stem cells: replacing cells and repairing tissue by mitosis · BUILD PROGRESS (handover)

Updated 2026-09-27 13:31Z. Builder: cloud run 009b (claude-opus-5-5). Branch `cloud/009-5.1.2-to-5.1.6-rmr4ks`; commit only work/5.1.x and work/t5-shared.
**Phase: DONE — REPORT.md written after Bunny status 4 (guid 79ed9c00-0e3a-4959-88f2-b24ea9355163)** · **Beats complete: 8 / 8** · master: present
Live render processes: 11149 bash -c printf "%s\n" "$@" | xargs -P 4 -I{} sh -c "nice -n 10 \"\$NODE\" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=\$?; echo beat {} exit \$rc; exit \$rc" _ 7 5 3 4 1 8 9 6 2
11151 xargs -P 4 -I{} sh -c nice -n 10 "$NODE" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=$?; echo beat {} exit $rc; exit $rc
12185 sh -c nice -n 10 "$NODE" render-beat.cjs 6 > logs/render-beat-6.log 2>&1; rc=$?; echo beat 6 exit $rc; exit $rc
12186 node render-beat.cjs 6
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:33.5 | 885 | 7 | COMPLETE |
| 2 | What you will be able to do · 0:33.5–0:55 | 659 | 5 | COMPLETE |
| 3 | Recall: what mitosis gives · 0:55–1:24 | 867 | 9 | COMPLETE |
| 4 | What makes a cell a stem cell · 1:24–2:07 | 1269 | 11 | COMPLETE |
| 5 | Bone marrow to red blood cell · 2:07–2:41 | 970 | 11 | COMPLETE |
| 6 | Skin, a graze, and two separate steps · 2:41–3:19.5 | 1211 | 13 | COMPLETE |
| 7 | What I told you, on the lineage · 3:19.5–3:48.5 | 892 | 10 | COMPLETE |
| 8 | How it is asked, and the reject card · 3:48.5–4:24.5 (fina | 1168 | 11 | COMPLETE |

