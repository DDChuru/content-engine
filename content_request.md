# Content Request: EYZ Tutorial Video Production

## Purpose

Prepare this repository so the separate video/render machine can regenerate and deliver the e-wizer tutorial videos from source assets, not only inspect the already-rendered MP4s.

This request is for the agent/person who has access to the source audio, ElevenLabs configuration, demo data, and any private assets that are intentionally not committed to git.

## Repository

Target repo:

```text
C:\Users\user\Documents\Projects\content-engine
```

## What Already Exists

The rendered review videos are already tracked under:

```text
output/
output/cln-verification-tutorial/
output/daily-hygiene-tutorial/
```

The Remotion source compositions are under:

```text
remotion-branding/src/cln/
remotion-branding/src/hygiene/
```

The public visual assets are under:

```text
remotion-branding/public/cln-tutorial/
remotion-branding/public/daily-hygiene-tutorial/
```

## What Is Missing

The render machine cannot fully regenerate the tutorial videos yet because several runtime/generated assets are not committed to git:

- `.env`
- ElevenLabs credentials
- Generated narration MP3 files
- Bookend/background music MP3 files
- Any private/demo content needed by the source app capture workflow

The repo ignores `*.mp3`, so audio files must either be copied out of band or regenerated locally.

## Required Drop Locations

### 1. Environment File

Create this file:

```text
content-engine/.env
```

Minimum required value:

```env
ELEVENLABS_API_KEY=...
```

Add any other keys required by current content-engine scripts, for example OpenAI, Gemini, Firebase, or storage keys if those workflows are used.

Do not commit `.env`.

### 2. Cleaning Verification Audio

Drop generated cleaning verification narration and music here:

```text
content-engine/remotion-branding/public/cln-tutorial/audio/
```

Required by current Remotion code:

```text
tutorial.mp3
01-intro.mp3
01a-home-hero.mp3
01b-control-scan.mp3
02a-scan-frame.mp3
03a-zone-due.mp3
03b-no-due.mp3
03c-off-schedule.mp3
04-pass.mp3
05-fail.mp3
06-photo.mp3
07-grade.mp3
08-severity-guide.mp3
08-action.mp3
09-submit.mp3
10-passrem.mp3
11-confirm.mp3
12-complete.mp3
13-banner.mp3
14-queue.mp3
15-close.mp3
16-allclear.mp3
```

If these files are regenerated instead of copied, use:

```text
content-engine/packages/backend/scripts/generate-cln-tutorial-audio.ts
```

Confirm that the resulting timing file is updated:

```text
content-engine/remotion-branding/src/cln/timing.json
```

Note: the V3 composition currently reads:

```text
content-engine/remotion-branding/src/cln/timing-v3.json
```

If narration is regenerated, confirm whether `timing-v3.json` also needs updating.

### 3. Daily Hygiene Audio

Drop generated daily hygiene narration and music here:

```text
content-engine/remotion-branding/public/daily-hygiene-tutorial/audio/
```

Required by current Remotion code:

```text
tutorial.mp3
01-intro.mp3
02-setup.mp3
03-home.mp3
04-newChecklist.mp3
05-checkpoint.mp3
06-shift.mp3
07-roster.mp3
08-offDuty.mp3
09-offDutyMarked.mp3
10-gate.mp3
11-oneClear.mp3
12-passAll.mp3
13-afterPassAll.mp3
14-issuePath.mp3
15-exceptionCapture.mp3
16-exceptionRecorded.mp3
17-complete.mp3
18-summary.mp3
```

If these files are regenerated instead of copied, use:

```text
content-engine/packages/backend/scripts/generate-daily-hygiene-tutorial-audio.ts
```

Confirm that the resulting timing file is updated:

```text
content-engine/remotion-branding/src/hygiene/timing.json
```

### 4. ElevenLabs Voice Configuration

Confirm or update the voice IDs and settings in:

```text
content-engine/remotion-branding/src/cln/narration.json
content-engine/remotion-branding/src/hygiene/narration.json
```

Please document the active voice IDs below before handing back:

```text
Cleaning verification voice ID:
Daily hygiene voice ID:
Voice/model notes:
```

### 5. Render Verification

After the assets are present, verify these commands from:

```text
content-engine/remotion-branding
```

```bash
npx remotion still src/index.ts CleaningVerificationTutorialV3Branded out/smoke-cleaning-frame.png --frame=120
npx remotion render src/index.ts CleaningVerificationTutorialV3Branded out/smoke-cleaning-3s.mp4 --frames=0-90 --concurrency=1 --overwrite
npx remotion render src/index.ts DailyHygieneTutorialBranded out/smoke-hygiene-3s.mp4 --frames=0-90 --concurrency=1 --overwrite
```

Full renders should use low concurrency on the render machine:

```bash
npx remotion render src/index.ts CleaningVerificationTutorialV3Branded ../output/cln-verification-tutorial/e-wizerinspection-v3-branded.mp4 --concurrency=1 --overwrite
npx remotion render src/index.ts DailyHygieneTutorialBranded ../output/daily-hygiene-tutorial/e-wizer-daily-hygiene-branded.mp4 --concurrency=1 --overwrite
```

## Commit Instructions

Commit any repo-safe changes such as updated narration JSON or timing JSON.

Do not commit:

- `.env`
- API keys
- service account files
- generated MP3 files unless the team intentionally changes `.gitignore`
- local `node_modules`

## Handover Checklist

Please report back:

- Whether audio was copied or regenerated
- Which voice IDs were used
- Whether `.env` was created locally
- Whether all required MP3 files exist
- Whether smoke still/render commands passed
- Any files changed and committed
- Any remaining blockers
