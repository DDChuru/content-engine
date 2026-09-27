# 5.1.1 Inside a chromosome · BUILD PROGRESS (handover)

**v2 (run 009f, 27 Sep, branch `cloud/009f-fix-4t1jp6`): DONE — review fixes applied, re-rendered, verified (incl. label-size/overlap audit and delivered-file check), re-branded, uploaded as "REVIEW 5.1.1 v2 …" and at Bunny status 4; see REPORT.md (v2) — the table below is the v1 build.**


Updated 2026-09-27 11:18Z. Builder: cloud run 009a (claude-opus-5-5). Branch `cloud/009-5.1.1-to-5.1.4-qls6vy`; commit ONLY work/5.1.1, work/5.1.3, work/5.1.4, work/t5-shared; push that branch only.
**Phase: DONE — REPORT.md written after Bunny status 4 (guid e45b3801-e495-49ef-b0a3-b6b36865e708)** · **Beats complete: 11 / 11** · master: present
Live render processes: 8757 bash -c printf "%s\n" "$@" | xargs -P 4 -I{} sh -c "nice -n 10 \"\$NODE\" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=\$?; echo beat {} exit \$rc; exit \$rc" _ 5 6 7 8
8759 xargs -P 4 -I{} sh -c nice -n 10 "$NODE" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=$?; echo beat {} exit $rc; exit $rc
8760 sh -c nice -n 10 "$NODE" render-beat.cjs 5 > logs/render-beat-5.log 2>&1; rc=$?; echo beat 5 exit $rc; exit $rc
8761 sh -c nice -n 10 "$NODE" render-beat.cjs 6 > logs/render-beat-6.log 2>&1; rc=$?; echo beat 6 exit $rc; exit $rc
8762 sh -c nice -n 10 "$NODE" render-beat.cjs 7 > logs/render-beat-7.log 2>&1; rc=$?; echo beat 7 exit $rc; exit $rc
8763 node render-beat.cjs 5
8764 sh -c nice -n 10 "$NODE" render-beat.cjs 8 > logs/render-beat-8.log 2>&1; rc=$?; echo beat 8 exit $rc; exit $rc
8765 node render-beat.cjs 6
8766 node render-beat.cjs 7
8767 node render-beat.cjs 8
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:36 | 911 | 8 | COMPLETE |
| 2 | What you will be able to do · 0:36–0:59 | 698 | 9 | COMPLETE |
| 3 | DNA, wound around histone proteins · 0:59–1:33 | 1042 | 9 | COMPLETE |
| 4 | One molecule, one chromosome: genes, centromere, telomeres | 943 | 10 | COMPLETE |
| 5 | Replicated: two sister chromatids · 2:07–2:43 | 1003 | 10 | COMPLETE |
| 6 | Condensed: short, thick and visible · 2:43–3:17 | 970 | 10 | COMPLETE |
| 7 | Count the centromeres · 3:17–3:55 | 1198 | 10 | COMPLETE |
| 8 | A whole cell, counted with its compartment · 3:55–4:30 | 1187 | 9 | COMPLETE |
| 9 | When the count goes up: daughter chromosomes · 4:30–5:02 | 925 | 10 | COMPLETE |
| 10 | What I told you, on the chromosome you built · 5:02–5:37 | 1095 | 11 | COMPLETE |
| 11 | How it is asked, and the reject card · 5:37–6:13 | 1264 | 12 | COMPLETE |


## Decisions
See REPORT.md; qa/audio-review.md; qa/cue-additions.md.
