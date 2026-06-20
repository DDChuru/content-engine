# Handover Response — Content Engine (EYZ Tutorial Audio)

Answers to the checklist in `content_request.md`.

- **Audio: copied or regenerated?** Existing generated MP3s are present on the dev machine
  under `remotion-branding/public/cln-tutorial/audio/` and
  `remotion-branding/public/daily-hygiene-tutorial/audio/`. They are **not** committed
  (`*.mp3` is gitignored) — copy them to the render machine out of band, or regenerate with
  the `generate-*-tutorial-audio.ts` scripts + an `ELEVENLABS_API_KEY`.
- **All required MP3s exist?** Yes. Both required lists verified present:
  - CLN: all 23 files (`tutorial`, `01-intro` … `16-allclear`).
  - Daily hygiene: all 19 files (`tutorial`, `01-intro` … `18-summary`).
- **Voice IDs / model notes:**
  - Cleaning verification voice ID: `gYWKdgLtqjPO3D5uDrDP`
  - Daily hygiene voice ID: `gYWKdgLtqjPO3D5uDrDP` (same voice)
  - Settings: `stability 0.55`, `similarity_boost 0.8`, `style 0.35`
- **`.env` created locally?** Required on the render machine
  (`content-engine/.env` with `ELEVENLABS_API_KEY=...`) only if audio is regenerated rather
  than copied. Not committed.
- **Timing files:** `src/cln/timing.json`, `src/cln/timing-v3.json` (V3 composition reads
  the `-v3` variant) and `src/hygiene/timing.json` are all present and committed. If
  narration is regenerated, re-run the generate scripts and confirm `timing-v3.json` is
  refreshed alongside `timing.json`.
- **Smoke still/render passed?** Not run on this dev machine — renders are the render
  machine's job. Commands to verify there:
  ```bash
  npx remotion still src/index.ts CleaningVerificationTutorialV3Branded out/smoke-cleaning-frame.png --frame=120
  npx remotion render src/index.ts CleaningVerificationTutorialV3Branded out/smoke-cleaning-3s.mp4 --frames=0-90 --concurrency=1 --overwrite
  npx remotion render src/index.ts DailyHygieneTutorialBranded out/smoke-hygiene-3s.mp4 --frames=0-90 --concurrency=1 --overwrite
  ```
- **Files changed/committed this pass:** this response file only. Narration/timing JSON were
  already current — no edits needed.
- **Remaining blockers:** ElevenLabs key + MP3 transfer (or regeneration) on the render
  machine; otherwise assets are complete.
