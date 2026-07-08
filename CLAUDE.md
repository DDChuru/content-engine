# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Content Engine Cloud is an AI-powered content generation platform built on a monorepo architecture. It combines Claude AI, Gemini AI, Firebase, and GitHub integration to generate educational content, user manuals, SOPs, and work instructions. The platform features a Next.js frontend and Express backend with multi-Firebase project support.

## Monorepo Structure

Workspace-based monorepo with three packages:

- **`packages/backend/`** - Express API server (Node.js + TypeScript)
- **`packages/frontend/`** - Next.js web application (React + TypeScript + Tailwind)
- **`packages/shared/`** - Shared TypeScript types and utilities

## Development Commands

```bash
# Root — run both, or one side
npm run dev              # frontend + backend concurrently
npm run dev:backend      # backend only (port 3001)
npm run dev:frontend     # frontend only (port 3000)
npm run build            # build both packages
npm run build:backend
npm run build:frontend

# packages/backend
npm run dev              # hot reload
npm run build && npm start
npm run deploy           # → Railway

# packages/frontend
npm run dev
npm run build && npm start
npm run lint
npm run deploy           # → Vercel
```

## Reserved Ports - CRITICAL

**⚠️ NEVER kill or use these ports:**

| Port | Service | Reason |
|------|---------|--------|
| **3210** | Claude Code WebSocket | Claude Code's browser extension uses this port. Killing it disconnects the active session. |

**Safe ports for this project:**
- 3000 - Frontend (Next.js)
- 3001 - Backend API (Express)
- 3002 - Backend alternate
- 3003 - Life Stories app
- 3215-3220 - Remotion preview servers

If a port conflict occurs with 3210, **change the conflicting service's port, never kill 3210**.

## Narration-Driven Video Rendering (RULE — the #1 pattern)

Narration timestamps drive visual element timing. Visual elements appear when mentioned in the narration, synced to word-level Whisper transcription. **NEVER** treat narration as a caption overlay — it is the timing source for all visual animation. Anti-patterns: adding captions/subtitles on top of existing visuals; hardcoding keyframes without reference to audio timing; fixed durations instead of transcript-derived timestamps; creating a composition without first reading the transcript JSON. Full detail (`useCue()` canonical pattern, timing flow, reference files, Content Studio `/storyboard→/script→/transcribe→/render` pipeline, CSC architecture, service layers) in `docs/modules/architecture-patterns.md`.

## Environment Configuration

The backend loads environment variables from the **root directory** (not package directory):

```typescript
// packages/backend/src/index.ts
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
```

**Required Environment Variables:**
- `ANTHROPIC_API_KEY` - Claude AI access
- `GEMINI_API_KEY` - Gemini AI for images and PDF extraction
- `GITHUB_TOKEN` - GitHub API access (optional)
- `FRONTEND_URL` - CORS configuration
- `PORT` - Backend server port (default: 3001)
- `{PROJECT}_FIREBASE_KEY` - JSON service account keys (e.g., `ICLEAN_FIREBASE_KEY`, `ACS_FIREBASE_KEY`, `EDUCATION_FIREBASE_KEY`)

## Important Notes

1. **CORS Configuration:** The backend only allows requests from `localhost` or `FRONTEND_URL`. Update CORS settings in `packages/backend/src/index.ts` for production.
2. **Firebase Service Accounts:** Store Firebase keys as JSON strings in environment variables, not as files.
3. **CSC Paths:** Always use CSC path helpers when working with Firestore to prevent cross-company data leaks.
4. **Work Instruction Imports:** PDF extractions must include `companyId`, `siteId`, and `parentDocumentId` for proper organization.
5. **User Journey Agent:** Clones repositories to `/tmp/` for analysis. Clean up temporary directories if needed.
6. **Type Safety:** Import shared types from `@shared/types` (aliased in tsconfig) rather than duplicating.
7. **Video Generation:** This worktree shares video infrastructure with the main `content-engine` repo. Don't rebuild Remotion components - extend and reuse existing ones.

## TikTok Production Pipeline

### Composition Pattern (9:16 vertical)
- Resolution: 1080×1920, 30fps
- Registration in `packages/backend/src/remotion/Root.tsx`
- Duration function exported: `get{Name}Duration(fps: number): number`
- Props interface exported with `satisfies` in Root.tsx
- Audio via `<Audio src={staticFile('audio/{category}/file.wav')} />`

### Narration: Chatterbox TTS (FREE, local)
- Server: `packages/backend/src/chatterbox/server.py` (port 8765)
- Voices: `daniel.wav`, `durai.wav` in `chatterbox/voices/`
- Exaggeration: 0.65-0.80 for chatty TikTok energy
- "Claude Code" fix: write as "ClaudeCode" (one word) to avoid pause
- Gaps between segments: 0.15s for chatty, 0.3s for educational pacing

### KaTeX Math Rendering in Remotion
- `import 'katex/dist/katex.min.css'` — REQUIRED, without it fractions render flat
- Component MUST NOT be named `Math` — shadows built-in. Use `MathTeX` or similar
- KaTeX is available via mermaid dependency (katex@0.16.25)
- `\cancel{}` works for strikethrough in derivations
- Color individual terms by wrapping `<MathTeX>` in styled divs

### Reusable Components
- `useCue(seconds, fadeDuration)` — narration-synced fade-in
- `useCueWindow(startS, endS)` — fade in then out
- `TerminalChrome` / `TerminalLine` / `OutputLine` — CLI simulation
- `SideBySide` / `TopBottom` — image comparison layouts
- `StepBadge` — step counter (1/6) in corner
- `MathStep` — animated math formula with label

### Image Generation Models
- Nano Banana 1: `gemini-3-pro-image-preview` (best quality)
- Nano Banana 2: `gemini-3.1-flash-image-preview` (faster, cheaper, search grounding)
- Skills: `~/.claude/skills/nano-banana/` and `~/.claude/skills/nano-banana-2/`

## Gotchas
- Remotion entry point is `src/remotion/Root.tsx` (NOT `src/remotion/index.ts`)
- Public dir is ~843MB — first bundle takes time, subsequent renders use cache
- Python OUTDIR env vars: must `export` or pass inline for subprocesses to see them

## Module docs

Detail moved out of this always-loaded root — open the relevant file when working in that area:

- `docs/modules/architecture-patterns.md` — narration-driven rendering (code samples), CSC architecture, service layers, video generation system, multi-Firebase, API routes
- `docs/modules/image-generation.md` — Gemini image generation (`gemini-3-pro-image-preview`)
- `docs/modules/frontend.md` — shared type system + Next.js frontend patterns
- `docs/modules/ops.md` — backend testing (curl) + deployment
- `docs/modules/education-platform.md` — Education platform (two sections, later supersedes on conflict)
- `docs/ROADMAP-agent-workspace.md` — future agent-workspace vision (NOT built)
