PHASE: master verified, branded, uploaded to Bunny (guid 05dc76d4-d562-4644-b6c6-39ddc62c0e07); waiting for status 4, then REPORT.md
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
