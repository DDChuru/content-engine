# 3.1.1-2 Enzymes: where and how they act · BUILD PROGRESS (handover)

Builder: claude-opus-5-5 (cloud run 003). Branch `cloud/003-3.1.1-2` only. Work dir `work/3.1.1-2/`.
**Phase: TIMELINE COMPLETE → next: shared components + beats (author, qa-beat, look, approve, render).**

## Resume procedure (fresh container)
1. `apt-get update && apt-get install -y ffmpeg`; `pip install faster-whisper pillow numpy fonttools brotli`.
2. `cd work/3.1.1-2 && npm install` (package.json pins react/react-dom 19.2.0, sharp 0.33.5, esbuild 0.25.10,
   remotion + @remotion/bundler + @remotion/renderer 4.0.365, zod 3.22.4).
3. `python3 make_fonts.py` (instances the brand WOFF2 fonts to TTF in fonts/ and writes fonts/fonts.conf).
4. WAVs are not in git: `python3 generate_audio.py` rebuilds every `audio/beat-NN.wav` from the committed MP3s
   WITHOUT calling ElevenLabs (it only calls the API when an MP3 is missing). DO NOT regenerate audio.

## Done
- Audio: 18 beats, Thandi v2 speed 1.0, no stretch. Request-only normalisations in `request_normalise.json`
  (B4 Catalase→Catalaise, B5 catalyses→catalyzes); B11 retaken unchanged. Detail: `qa/audio-review.md`.
- ElevenLabs characters: before 222,543; after audio 231,267.

- Holds (digital silence, `insert_holds.py`): B5 3 s, B11 4 s, B14 3 s, B16 4 s silent reads; B18 5 s anchored read
  between "Read it," and "then watch…", plus a 2 s END hold. `audio/*.timed.wav` rebuilt by `python3 insert_holds.py`.
- Timeline: `cue_plan.py` (224 cues) → `assemble_timeline.py` → `timeline.json`: 900.133 s, 27,004 frames, max cue gap
  11.96 s. `public/narration.wav` (not in git) is rebuilt by `python3 assemble_timeline.py`.
  Cue syntax: '^' = trigger word; trailing '$' = trigger at the END of the last word (error-beat exit cues).

## Decisions
- House style: the reference's `topic-02/shared/src` was NOT in the inputs; rebuilt in `shared/src/` from the brand
  tokens (packages/backend/src/remotion/compositions/stem4life/palette.ts) with the reference chrome geometry
  (Lesson.tsx header y=44/111/170, caption bar at y=959–1038, error badge 1410,22 440×56).
