# 4.1.4 Cell signalling: secretion, transport, binding · BUILD PROGRESS (handover)

Updated 2026-09-27 11:15Z. Builder: claude-opus-5-5 (cloud run 008a). Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`; commit work/<code> + work/t4-shared only.
**Phase: audio + timeline done; authoring beats** · **Beats complete: 0 / 9** · master: not yet built
Live render processes: 8798 bash -c printf "%s\n" "$@" | xargs -P 4 -I{} sh -c "nice -n 10 \"\$NODE\" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=\$?; echo beat {} exit \$rc; exit \$rc" _ 1 2 3 4 5 6 7 8 9 10 11 12 13
8800 xargs -P 4 -I{} sh -c nice -n 10 "$NODE" render-beat.cjs {} > logs/render-beat-{}.log 2>&1; rc=$?; echo beat {} exit $rc; exit $rc
9255 sh -c nice -n 10 "$NODE" render-beat.cjs 7 > logs/render-beat-7.log 2>&1; rc=$?; echo beat 7 exit $rc; exit $rc
9256 node render-beat.cjs 7
9442 sh -c nice -n 10 "$NODE" render-beat.cjs 8 > logs/render-beat-8.log 2>&1; rc=$?; echo beat 8 exit $rc; exit $rc
9443 node render-beat.cjs 8
9495 sh -c nice -n 10 "$NODE" render-beat.cjs 9 > logs/render-beat-9.log 2>&1; rc=$?; echo beat 9 exit $rc; exit $rc
9496 node render-beat.cjs 9
9643 sh -c nice -n 10 "$NODE" render-beat.cjs 10 > logs/render-beat-10.log 2>&1; rc=$?; echo beat 10 exit $rc; exit $rc
9644 node render-beat.cjs 10
NOTE: render-cache/ (chunks) and all MP4/WAV are NOT in git — a fresh container must re-render approved beats
(`./launch-render.sh N`, 4 at a time); approvals (qa/beat-NN/approved.json) ARE in git and stay valid while the
source fingerprint matches.

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:42 | 1133 | 8 | not authored |
| 2 | What you will be able to do · 0:42–1:09 | 716 | 5 | not authored |
| 3 | Stage one: secretion, by exocytosis · 1:09–1:53 | 1196 | 9 | not authored |
| 4 | Stage two: transport, by blood and tissue fluid · 1:53–2:3 | 1060 | 9 | not authored |
| 5 | Stage three: binding, and the address on the envelope · 2: | 1403 | 15 | not authored |
| 6 | A specific response, and which cells respond · 3:20–4:04 | 1261 | 12 | not authored |
| 7 | COMMON MISTAKE E44: "active site" for a receptor · 4:04–5: | 2163 | 17 | not authored |
| 8 | What I told you, on the scene · 5:19–5:56 | 1109 | 11 | not authored |
| 9 | How it is asked, the local reject, and the hook · 5:56–6:4 | 1668 | 13 | not authored |

## Session
Cloud run 008a: 4.1.1-2 (DONE) → 4.1.3 → 4.1.4 → 4.2.1a. Branch `cloud/008-4.1.1-2-to-4.2.1a-dq9f0v`.
Shared models `work/t4-shared/` (SHARED.md); new here: SignallingScene.tsx, VesicleTransport.tsx.
## Resume
Setup per BRIEF (+ pip brotli). `python3 make_fonts.py`; `python3 generate_audio.py` (reuses MP3s, no request);
`python3 insert_holds.py && python3 assemble_timeline.py`; render approved beats `./render-batch.sh …`.
## Decisions
- E44 (Beat 7) COMMON MISTAKE; clear = END of "a binding site complementary to" + 44 frames (measured "LL-37").
- Opening cues added: B2 "By the end", B8 "So here it is".
