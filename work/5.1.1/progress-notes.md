PHASE: beats 1–11 authored and approved; rendering (render-batch 1-4, 5-8, 9-11 chained, logs/batch-all.out)

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
