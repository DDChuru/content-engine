# 3.2.2-3 — Vmax, Km and inhibitors on the graph · BUILD PROGRESS (handover file)

Updated 2026-09-24 11:47 (UTC, cloud container). Builder: claude-opus-5-5.
**Phase: 3 BEATS (audio + timeline complete; authoring beats in order)** · **Beats complete: 0 / 17** · master: not yet built
Live render processes: none

| Beat | Heading | Frames | Cues | State |
|---|---|---|---|---|
| 1 | Hook and context · 0:00–0:40 | 1324 | 9 | not authored |
| 2 | What you will be able to do · 0:40–1:05 | 713 | 4 | not authored |
| 3 | The curve, and Vmax from the plateau · 1:05–1:50 | 1175 | 11 | not authored |
| 4 | One number for affinity: Km · 1:50–2:25 | 1239 | 9 | not authored |
| 5 | The construction: Vmax, half it, across, down · 2:25–3:15 | 1321 | 12 | not authored |
| 6 | COMMON MISTAKE E37: the right number, and a bare graph · 3 | 2709 | 18 | not authored |
| 7 | What Km tells you: the eager enzyme · 4:25–5:10 | 1398 | 10 | not authored |
| 8 | Three enzymes, each from its own half-Vmax · 5:10–6:05 | 1364 | 15 | not authored |
| 9 | COMMON MISTAKE E36: Vmax called affinity; the gradient cal | 2757 | 15 | not authored |
| 10 | Same enzyme, with and without an inhibitor · 7:15–8:05 | 1410 | 12 | not authored |
| 11 | Competitive: in the active site, overcome by substrate · 8 | 1605 | 13 | not authored |
| 12 | Non-competitive: another site, and the active site changes | 1860 | 16 | not authored |
| 13 | COMMON MISTAKE E41: the two curves swapped · 10:10–11:20 | 2667 | 16 | not authored |
| 14 | The sentences you write, clause by clause · 11:20–12:10 | 1487 | 11 | not authored |
| 15 | What I told you, read off the graph and the model · 12:10– | 1324 | 10 | not authored |
| 16 | How it is asked, and the reject card · 12:55–13:40 | 1576 | 10 | not authored |
| 17 | The real question on screen, and the tablet · 13:40–14:20 | 1160 | 10 | not authored |


## Rules (from Durai's brief, cloud run 004-3.2.2-3)
Narration FROZEN (STORYBOARD.md = cloud-inputs/003/topic-03/3.2.2-3/STORYBOARD.md, copied verbatim). Push ONLY branch
`cloud/004-3.2.2-3`. NEVER an MP4 in git (.gitignore). No secrets: ElevenLabs/Bunny credentials are injected by the proxy —
call api.elevenlabs.io / video.bunnycdn.com with NO key header. Bunny: upload ONLY the final branded video, NO collection,
delete/move nothing. Render per beat, at most 4 concurrent (4 vCPU). No logo/progress bar/timer/beat counter in the lesson.

## Environment (rebuild after a relaunch)
- `apt-get update && apt-get install -y ffmpeg`; `pip install faster-whisper fonttools brotli numpy pillow`.
- Node deps (pinned, no lockfile) in `/home/user/deps` (symlinked as `work/3.2.2-3/node_modules`, gitignored):
  `cd /home/user/deps && npm init -y && npm i --save-exact react@19.2.0 react-dom@19.2.0 esbuild@0.25.10 sharp@0.33.5 remotion@4.0.365 @remotion/bundler@4.0.365 @remotion/renderer@4.0.365`
  then `ln -sfn /home/user/deps/node_modules work/3.2.2-3/node_modules`.
- Fonts: brand Source Sans 3 only (static instances 400/600/700/800 made from
  packages/backend/src/remotion/public/stem4life/fonts/*.woff2 with fontTools instancer, family renamed "Source Sans 3")
  into `render-cache/fonts/`, `render-cache/fonts.conf` points fontconfig there. Manrope was REMOVED from the font dir: with
  both present, fontconfig resolved Source Sans ≥600 to Manrope. Recreate with the python snippet in PROGRESS "Fonts".

## Done
- Phase 1 AUDIO complete. `script.json` (17 beats, 1,929 words). 17 MP3s in `audio/` (committed). WAVs are derived:
  `ffmpeg -i beat-NN.mp3 -ar 48000 -ac 1 -c:a pcm_s16le beat-NN.wav` (generate_audio.py does this if the mp3 exists — it
  never re-requests an existing mp3). Request-only normalisation: Km→"K M" (all), Vmax→"V max" (B9 only, regenerated once).
  `qa/audio-review.md`. DO NOT regenerate audio. Characters used 6,726 (231,267 → 237,993).
- Holds (digital silence, `insert_holds.py`): 4 s silent reads B6/B9/B13 before "Look at …"; B17 5 s anchored read before
  "Then watch the three marks" + 2 s END hold.
- Phase 2 TIMELINE complete: `cue_plan.py` (201 cues) → `assemble_timeline.py` → `timeline.json` (903.967 s, 27,119 frames;
  max cue gap 12.72 s) + `public/narration.wav` (regenerable: `python3 assemble_timeline.py`).

## Components (id scheme)
- `src/shared/theme.ts` (BRAND palette = Stem4Life tokens + greys; `teal` = the lesson's correct-construction "accent", kept
  distinct from terracotta `primary` which marks error), `Type.tsx` (Txt Lines Card Tag Cite InkRing Arrow Strike Under Cross
  Tick), `ErrorMarker.tsx` (frame border + badge at 1410,22 440×56; data-error-marker / data-error-label). REBUILT here: the
  reference's Topic 2 shared/src files were not in the inputs.
- `src/RateGraph.tsx`: curves v = Vmax·tanh(atanh(½)·S/Km) — passes EXACTLY through (Km, ½Vmax). Axes, CurvePath,
  VmaxLine/HalfLine/KmDrop (data-overlay="vmax-line:<curve>" etc.), Construction, ProgressInset.
- `src/Enzyme.tsx`: EnzymeActiveSiteModel to the L1 spec: Enzyme{distort 0..1}, Mol{kind substrate|comp|noncomp, off, slide,
  rot}, Products, BoundTicks, ActivityArrow. Cleft upper right (rest-lk), second site lower left.
- `src/Lesson.tsx` router + chrome; `ERROR_BEATS` {6, 9, 13: COMMON MISTAKE}; beats get {sc, local, k, at, a(key)}.

## Per-beat procedure
1. Author `src/beats/BeatNN.tsx`, add to `src/beats/index.ts`.
2. `node build.cjs && node qa-beat.cjs N && python3 sheet-beat.py N`; LOOK at `qa/beat-NN/sheet-*.jpg`; fix; repeat.
3. `./approve.sh N && ./launch-render.sh N` (detached; refuses if 4 live or a lock exists). Log `logs/render-beat-NN.log`;
   done when `render-cache/beat-NN/complete.json` exists. `python3 update_progress.py`.

## Decisions / interpretations
- All three error beats badge **COMMON MISTAKE**: E37 (June 2023 ER p.26 "The most common error …"), E36 (June 2024 ER p.4
  "Some candidates confused Km with Vmax …"), E41 (June 2023 ER p.22; March 2023 ER p.2) — each an examiner report diagnosing
  the candidate error.
