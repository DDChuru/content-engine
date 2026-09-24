PHASE: 5 BUNNY (master verified, branded verified, uploaded guid d2571913-2ef8-4046-b7e4-4ddac6062802; polling to status 4)

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

## Resume here (phase 4)
- All 17 beats authored and visually approved. `rerender-stale.sh` (log `logs/rerender-stale.log`, ends "RERENDER DONE")
  re-renders beats 1–11 (made stale by shared-component edits); beat 17 rendered by `launch-render.sh 17`.
  Check: `node -e` fingerprint loop (see chain in PROGRESS) — every `render-cache/beat-NN/complete.json` sourceHash must
  equal `beat-fingerprint.cjs(N)`. render-cache is NOT in git: after a relaunch re-run `./rerender-stale.sh` style renders
  (approve.sh N && launch-render.sh N for every beat; ~15 min at 4 parallel).
- Then: `python3 finish.py` → `3.2.2-3-vmax-km-inhibitors.mp4` (gitignored); `python3 verify.py` → qa/verification.json,
  qa/marker-audit.json, qa/boundary-audit.json; `python3 encoded-sheets.py` → qa/encoded-sheets/ (LOOK at every sheet).
- Bookends DONE: /home/user/outro-render/bookends/{intro,outro}-3.2.2-3.mp4 (Remotion 4.0.365, zod 3.22.3, Chrome headless
  shell auto-downloaded). Recreate: /home/user/outro-render (copy of stem4life compositions + index.tsx +
  render-bookends.mjs from cloud-inputs/003/branding with sourceRoot → this checkout), `node render-bookends.mjs
  "3.2.2-3=Vmax, Km and inhibitors on the graph"`. Late frames checked: qa/bookend-*-late.jpg (title exact).
- Brand: `BAR_PNG=cloud-inputs/003/branding/bar-3.2.2-3.png MUSIC_MP3=cloud-inputs/003/branding/tutorial.mp3
  INTRO_MP4=/home/user/outro-render/bookends/intro-3.2.2-3.mp4 OUTRO_MP4=/home/user/outro-render/bookends/outro-3.2.2-3.mp4
  cloud-inputs/003/branding/apply-branding-cloud.sh <master> <branded>` (run from repo root).
- Bunny: POST https://video.bunnycdn.com/library/$BUNNY_BIO_LIBRARY_ID/videos {"title":"REVIEW 3.2.2-3 Vmax, Km and inhibitors
  on the graph"} (NO collection, NO key header), PUT with curl -T, poll every 60 s to status 4.
- Design decisions: qa/decisions.md.

## Resume here (phase 5)
Uploaded to Bunny library 758254, guid d2571913-2ef8-4046-b7e4-4ddac6062802 (no collection). Poll
`curl -sS https://video.bunnycdn.com/library/$BUNNY_BIO_LIBRARY_ID/videos/<guid>` every 60 s (log logs/bunny-poll.txt) until
status 4, then fill BUNNY_DONE / BUNNY_WAIT / BUNNY_T4 in REPORT.md, commit, push. Do NOT upload again.
