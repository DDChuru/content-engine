# 4.1.1-2 Fluid mosaic membranes: how the bilayer forms and what sits in it · BUILD PROGRESS (handover)

Updated 2026-09-27 10:45Z. Builder: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`; commit work/4.1.1-2 + work/t4-shared only; push that branch only.
**Phase: audio + timeline done; authoring beats** · **Beats complete: 5 / 13** · master: not yet built
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
| 1 | Hook and context · 0:00–0:44 | 1196 | 11 | COMPLETE |
| 2 | What you will be able to do · 0:44–1:06 | 669 | 5 | COMPLETE |
| 3 | The phospholipid, recalled · 1:06–1:45 | 1109 | 11 | COMPLETE |
| 4 | Why a bilayer forms · 1:45–2:30 | 1281 | 13 | COMPLETE |
| 5 | Heads to the water, tails to each other · 2:30–3:19 | 1413 | 11 | COMPLETE |
| 6 | Proteins, placed by the same logic · 3:19–4:06 | 1398 | 14 | RENDERING (lock) |
| 7 | Fluid, and mosaic · 4:06–4:49 | 1228 | 12 | RENDERING (lock) |
| 8 | Cholesterol, among the phospholipids · 4:49–5:34 | 1243 | 11 | RENDERING (lock) |
| 9 | Glycolipids · 5:34–6:12 | 1056 | 8 | RENDERING (lock) |
| 10 | Glycoproteins · 6:12–6:52 | 1247 | 10 | approved, not rendered |
| 11 | The whole membrane, and a description to write · 6:52–7:32 | 1154 | 10 | approved, not rendered |
| 12 | What I told you, on the membrane · 7:32–8:21 | 1556 | 11 | approved, not rendered |
| 13 | How it is asked, the reject card, and the red blood cell · | 1534 | 9 | approved, not rendered |

## Session
Cloud run 008a, lessons in order: 4.1.1-2 → 4.1.3 → 4.1.4 → 4.2.1a. Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`
(the harness-designated push branch for this run). Shared Topic 4 models: `work/t4-shared/` (see SHARED.md), copied byte
for byte to the top level of `src/`.
## Resume procedure (fresh container)
1. Setup per cloud-inputs/008/BRIEF.md (apt ffmpeg fonts-dejavu-core; pip faster-whisper fonttools pillow numpy brotli;
   `work/` npm install pinned). `python3 make_fonts.py` in this dir.
2. Audio is in git (audio/*.mp3 + JSON). `python3 generate_audio.py` re-derives the WAVs from the MP3s WITHOUT any
   request (mp3 exists → reused). Then `python3 insert_holds.py && python3 assemble_timeline.py` (timeline.json in git).
3. `node build.cjs`; for each approved beat (qa/beat-NN/approved.json) `./render-batch.sh …` (4 at a time).
## Decisions
- Request-only normalisations: see qa/audio-review.md (OH → O H; Beat 1 comma before "sits").
- Opening cues added where the storyboard's first cue is not the beat's first words (B1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12).
- Cue phrases avoid the normalised word "OH" (B8 "a small polar", "sits level with the phospholipid heads"; B11 "towards the heads").
- Objectives beat (2) is the dark surface (house style).
