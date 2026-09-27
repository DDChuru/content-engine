# 5.1.1 Inside a chromosome · BUILD PROGRESS (handover)

Updated 2026-09-27 10:54Z. Builder: cloud run 009a (claude-opus-5-5). Branch `cloud/009-5.1.1-to-5.1.4-qls6vy`; commit ONLY work/5.1.1, work/5.1.3, work/5.1.4, work/t5-shared; push that branch only.
**Phase: beats 1–11 authored and approved; rendering (render-batch 1-4, 5-8, 9-11 chained, logs/batch-all.out)** · **Beats complete: 1 / 11** · master: not yet built
Live render processes: 4857 bash -c printf "%s\n" "$@" | xargs -P 4 -I{} sh -c "nice -n 10 \"\$NODE\" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=\$?; echo beat {} exit \$rc; exit \$rc" _ 1 2 3 4
4859 xargs -P 4 -I{} sh -c nice -n 10 "$NODE" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=$?; echo beat {} exit $rc; exit $rc
4860 sh -c nice -n 10 "$NODE" render-beat.cjs 1 > logs/render-beat-1.log 2>&1; rc=$?; echo beat 1 exit $rc; exit $rc
4862 sh -c nice -n 10 "$NODE" render-beat.cjs 3 > logs/render-beat-3.log 2>&1; rc=$?; echo beat 3 exit $rc; exit $rc
4863 node render-beat.cjs 1
4864 sh -c nice -n 10 "$NODE" render-beat.cjs 4 > logs/render-beat-4.log 2>&1; rc=$?; echo beat 4 exit $rc; exit $rc
4866 node render-beat.cjs 3
4867 node render-beat.cjs 4
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:36 | 911 | 8 | RENDERING (lock) |
| 2 | What you will be able to do · 0:36–0:59 | 698 | 9 | COMPLETE |
| 3 | DNA, wound around histone proteins · 0:59–1:33 | 1042 | 9 | RENDERING (lock) |
| 4 | One molecule, one chromosome: genes, centromere, telomeres | 943 | 10 | RENDERING (lock) |
| 5 | Replicated: two sister chromatids · 2:07–2:43 | 1003 | 10 | approved, not rendered |
| 6 | Condensed: short, thick and visible · 2:43–3:17 | 970 | 10 | approved, not rendered |
| 7 | Count the centromeres · 3:17–3:55 | 1198 | 10 | approved, not rendered |
| 8 | A whole cell, counted with its compartment · 3:55–4:30 | 1187 | 9 | approved, not rendered |
| 9 | When the count goes up: daughter chromosomes · 4:30–5:02 | 925 | 10 | approved, not rendered |
| 10 | What I told you, on the chromosome you built · 5:02–5:37 | 1095 | 11 | approved, not rendered |
| 11 | How it is asked, and the reject card · 5:37–6:13 | 1264 | 12 | approved, not rendered |


## Session (cloud run 009a) — lessons 5.1.1 → 5.1.3 → 5.1.4, branch `cloud/009-5.1.1-to-5.1.4-qls6vy`
- 5.1.1: in progress (this file). 5.1.3, 5.1.4: not started.
- Shared models: `work/t5-shared/` (see SHARED.md); copied byte for byte into `src/`.

## Decisions
- Audio: Thandi, eleven_multilingual_v2, speed 1.0; no request normalisation; beat 10 retaken once ("histones" heard without its first syllable in take 1); see qa/audio-review.md.
- Cue additions (opening cues, the five-structure ticks in Beat 2, the Beat 11 exit): qa/cue-additions.md.
- Beat 11 END hold 2 s (held final frame). No error beats, no badge (ERROR_BEATS = {}).
- Beats 3–11 were stubbed first so `src/beats/index.ts` never changes after approvals.
- Reject card struck in ink (not terracotta: reserved for the error marker).

## Resume
1. `cd work/5.1.1`; fresh container: install per the brief, `python3 make_fonts.py`, then re-render approved beats: `./render-batch.sh 1 2 3 4` (etc.). Audio MP3s are in git; regenerate WAVs with `python3 generate_audio.py` (reuses MP3s, no API call), then `python3 insert_holds.py && python3 assemble_timeline.py`.
2. `python3 finish.py && python3 verify.py && node verify-text-only.cjs --controls && node verify-text-only.cjs && python3 encoded-sheets.py`, then bookends, branding, Bunny (see the brief).
