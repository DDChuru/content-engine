# Ink tutor: the pre-drawn library workflow

Nothing is drawn at runtime. Every worked solution is produced ahead of time in a Claude Code
session, checked, stored as static JSON, and shipped with the app. The app only plays files.

## Pipeline per question

1. **Pick the question.** A past-paper question (paper, year, question number) or a practice one.
   Note the mark scheme points; the drawing must hit every one.
2. **Write the brief.** Copy `ink-brief-q2.md`. Fix the beats (one per line of working), the
   baselines, and the exact SAY sentence per beat. This is the direction; it is where the
   thinking goes.
3. **Draw.** Hand the brief to a model. Opus 5 (thinking on) reads best; Sol and Astra on B
   also draw correct pages from the same brief. In a Claude Code session the orchestrator can
   dispatch it, or draw it itself. Output is `GROUP / SAY / PATH` lines.
4. **Check.** Rasterize (headless Chrome) and look at it. Optionally POST the SVG to
   `/api/ink/check` for a vision pass. Fix by re-briefing, not by editing coordinates.
5. **Store.** Parse to `{question, groups[{id,say}], strokes[{group,d}]}` and save as
   `apps/student-learn/public/ink/<id>.json`. Add an entry to `public/ink/index.json`.
6. **Narrate (video only).** One ElevenLabs clip per beat (voice `gYWKdgLtqjPO3D5uDrDP`),
   stitched with 0.25s gaps; clip starts are the cues. The TTS normalizer already reads
   dy/dx as letters. Render with the `InkTutorTikTok` composition (`hand` prop).

## Files

- Library manifest: `apps/student-learn/public/ink/index.json`
- Drawings: `apps/student-learn/public/ink/<id>.json` (`q2-fable.json` etc. keep alternate hands)
- Brief template: `apps/student-learn/briefs/ink-brief-q2.md`
- Player: `apps/student-learn/components/ink-paper.tsx`; page: `app/ink/page.tsx`
- Video: `packages/backend/src/remotion/compositions/InkTutorTikTok.tsx`
- Live route (`/api/ink/draw`) exists for experiments only; the app does not call it.

## Cost

A drawing is one model call per question, once. Narration is roughly 400 characters of
ElevenLabs per question. Playback is free.
