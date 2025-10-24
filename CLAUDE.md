# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Content Engine Cloud is an AI-powered content generation platform built on a monorepo architecture. It combines Claude AI, Gemini AI, Firebase, and GitHub integration to generate educational content, user manuals, SOPs, and work instructions. The platform features a Next.js frontend and Express backend with multi-Firebase project support.

## Monorepo Structure

This is a workspace-based monorepo with three packages:

- **`packages/backend/`** - Express API server (Node.js + TypeScript)
- **`packages/frontend/`** - Next.js web application (React + TypeScript + Tailwind)
- **`packages/shared/`** - Shared TypeScript types and utilities

## Development Commands

### Start Development Servers

```bash
# Run both frontend and backend concurrently
npm run dev

# Run backend only (port 3001)
npm run dev:backend

# Run frontend only (port 3000)
npm run dev:frontend
```

### Backend Development

```bash
cd packages/backend

# Development with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Deploy to Railway
npm run deploy
```

### Frontend Development

```bash
cd packages/frontend

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint

# Deploy to Vercel
npm run deploy
```

### Building the Project

```bash
# Build both packages
npm run build

# Build backend only
npm run build:backend

# Build frontend only
npm run build:frontend
```

## Architecture Patterns

### CSC Architecture (Company-Site-Collection)

The platform implements a hierarchical multi-tenant data model for Firestore. **All business data must be nested under company documents** to ensure proper data isolation:

**Path Structure:**
```
companies/{companyId}/{collection}/{documentId}
```

**Key Collections:**
- `sites` - Physical locations/facilities
- `siteAreas` - Cleaning areas within sites
- `areaItems` - Individual cleaning tasks/checklist items
- `standard_cleaning_instructions` - Work instructions (PDF extractions)
- `inspections` - Completed cleaning inspections

**Critical Rules:**
1. Never access collections without company context (no root-level queries)
2. Use `getCSCCollectionPath(companyId, collection)` helper from `firebase.ts` for all paths
3. All sites used for cleaning must have `iClean: true` flag (check both root level and `settings.iClean`)
4. Maintain traceability with `parentDocumentId` for grouped imports

**ACS Implementation:**
- Company ID: `AnmdYRpshMosqbsZ6l15`
- Work instructions stored at: `companies/AnmdYRpshMosqbsZ6l15/standard_cleaning_instructions/{docId}`
- Site selection requires filtering by `iClean: true`

See `CSC-ARCHITECTURE.md` for comprehensive documentation.

### Service Architecture

The backend follows a layered service architecture:

```
Routes (Express)
    ↓
Services Layer (Business Logic)
    ↓
Firebase/API Layer (Data Access)
    ↓
External APIs (Claude, Gemini, GitHub, Firebase)
```

**Key Services:**
- **ClaudeService** (`services/claude.ts`) - Claude AI integration for content generation
- **ContentGenerator** (`services/content-generator.ts`) - Orchestrates content creation workflows
- **DocumentExtractionService** (`services/document-extraction.ts`) - PDF parsing with Gemini Vision
- **GitHubService** (`services/github.ts`) - Repository cloning and analysis
- **FirebaseService** (`services/firebase.ts`) - Multi-project Firebase management
- **UserJourneyAgent** (`agents/user-journey/index.ts`) - Codebase analysis and documentation generation
- **VideoRenderer** (`services/video-renderer.ts`) - Remotion-based video composition and rendering

### Video Generation System

**IMPORTANT:** This worktree includes a complete educational video generation pipeline combining Manim animations with AI-powered voice narration.

**Location:** `/home/dachu/Documents/projects/worktrees/educational-content/`

#### Educational Video Infrastructure

This educational content system uses a hybrid approach for maximum quality and cost-efficiency:

**Pipeline Flow:**
```
User Voice Recording (60+ seconds)
    ↓
ElevenLabs Voice Cloning → Voice ID
    ↓
Claude AI → Lesson Structure & Scripts
    ↓
For Each Concept:
├─ Manim (Math animations - FREE, local)
│  └─ Circle theorems, differentiation, graphs
├─ Gemini 2.5 Flash Image (Backgrounds - $0.039/image)
│  └─ Introduction slides, context images
└─ ElevenLabs TTS (User's voice - $0.30/1K chars)
    └─ Scene narration
    ↓
Remotion Composition → Final MP4
    ↓
SCORM Package → LMS Ready
```

**Cost:** ~$0.94 per 10-minute educational module

#### Installed Dependencies

Educational content pipeline dependencies in `packages/backend/package.json`:
```json
{
  "remotion": "^4.0.364",
  "@remotion/bundler": "^4.0.364",
  "@remotion/renderer": "^4.0.364",
  "@remotion/lambda": "^4.0.364",
  "@elevenlabs/elevenlabs-js": "^0.x.x",  // Voice cloning & TTS
  "@google/generative-ai": "^0.24.1",     // Gemini 2.5 Flash Image
  "@anthropic-ai/sdk": "^0.30.0"          // Claude for lesson generation
}
```

**Additional Infrastructure:**
- **Manim Community:** v0.19.0 (installed in conda environment `aitools`)
- **Python:** 3.11.14 (conda environment)
- **FFmpeg:** Video processing (conda environment)

#### Key Video Components

**Remotion Compositions:**
- `packages/backend/src/remotion/VideoComposition.tsx` - Main video composition
- `packages/backend/src/remotion/Scene.tsx` - Individual scene component
- `packages/backend/src/remotion/PresentationScene.tsx` - Presentation-style scenes
- `packages/backend/src/remotion/HybridScene.tsx` - Hybrid rendering (AI + real footage)
- `packages/backend/src/remotion/config.ts` - Video configuration (1080p, 30fps)

**Services:**
- `packages/backend/src/services/video-renderer.ts` - Programmatic Remotion rendering
- `packages/backend/src/routes/video-director.ts` - Complete video generation API

**Standalone Project:**
- `remotion-branding/` - Branded intro/outro templates with render scripts

#### Integration with Educational Content

For the educational content pipeline, reuse existing video infrastructure:

```typescript
// Example: Generate educational module video
import { renderVideo } from '../../services/video-renderer';

export class EducationalVideoGenerator {
  async generateModuleVideo(module: Module, script: VideoScript): Promise<string> {
    // 1. Generate concept images (Gemini - already configured)
    const images = await this.generateConceptImages(module.concepts);

    // 2. Generate narration audio (OpenAI TTS - already configured)
    const narration = await this.generateNarration(script);

    // 3. Prepare scenes for Remotion
    const scenes = module.concepts.map((concept, i) => ({
      id: i + 1,
      title: concept.name,
      explanation: concept.description,
      image: images[i],
      audio: narration[i],
      duration: script.segments[i].duration
    }));

    // 4. Render using existing video renderer
    const videoPath = await renderVideo({
      composition: 'EducationalModule',
      scenes,
      outputPath: `output/courses/${module.id}.mp4`,
      codec: 'h264',
      width: 1920,
      height: 1080,
      fps: 30
    });

    return videoPath;
  }

  // Embed in SCORM package
  async exportSCORMWithVideo(course: Course): Promise<Buffer> {
    const zip = new JSZip();

    for (const module of course.modules) {
      // Generate video for module
      const videoPath = await this.generateModuleVideo(module, module.script);
      const videoBuffer = await fs.readFile(videoPath);

      // Add to SCORM package
      zip.file(`videos/module-${module.id}.mp4`, videoBuffer);

      // Create SCO with video player + SCORM tracking
      const scoHtml = this.createVideoSCO(module);
      zip.file(`module_${module.id}/index.html`, scoHtml);
    }

    zip.file('imsmanifest.xml', this.generateManifest(course));
    return zip.generateAsync({ type: 'nodebuffer' });
  }
}
```

#### Video Generation Costs

**Per educational module (10 minutes, typical breakdown):**

| Component | Count | Cost Each | Total |
|-----------|-------|-----------|-------|
| Manim animations (math content) | 6 scenes | FREE | $0.00 |
| Gemini 2.5 Flash Image (backgrounds) | 4 scenes | $0.039 | $0.16 |
| ElevenLabs narration (~3K chars total) | 10 scenes | $0.30/1K | $0.90 |
| Remotion rendering | 1 video | FREE (local) | $0.00 |
| **TOTAL per module** | | | **~$1.06** |

**Complete 10-module course:**
- Total cost: ~$10.60
- Output: 100 minutes of professional video
- Professional 3Blue1Brown-quality animations (Manim)
- YOUR voice throughout (ElevenLabs)
- SCORM-compliant with LMS tracking

**Cost Comparison:**
- Our system: $10.60 for 10 modules
- Traditional video production: $5,000-$10,000
- **Savings: 99%+**

#### Documentation

Comprehensive video system documentation in main repo:
- `VIDEO-PIPELINE-COMPLETE.md` - Complete pipeline overview
- `VIDEO-DIRECTOR-AGENT.md` - API reference and usage guide
- `REMOTION-INTEGRATION.md` - Remotion setup and patterns
- `remotion-branding/README.md` - Standalone video project docs

#### API Endpoints (Main Repo)

Available video generation endpoints:
- `POST /api/video-director/generate` - Generate storyboard from voice/text
- `POST /api/video-director/generate-images` - Batch image generation (Gemini)
- `POST /api/video-director/generate-narration` - TTS narration generation
- `POST /api/video-director/render-video` - Remotion video composition

#### Example Usage

**Generate course module video:**
```bash
# 1. Generate module content with Claude
curl -X POST http://localhost:3001/api/education/course \
  -d '{"topic": "React Hooks", "duration": 10}'

# 2. Generate video from module
curl -X POST http://localhost:3001/api/education/module-video \
  -d '{"moduleId": "react-hooks-101", "style": "professional"}'

# Response:
{
  "videoPath": "output/courses/react-hooks-101.mp4",
  "duration": 600,
  "scenes": 15,
  "cost": 0.55
}
```

#### Best Practices for Educational Videos

1. **Reuse Components:** Don't rebuild video infrastructure - extend existing Remotion components
2. **Consistent Branding:** Use `remotion-branding/` templates for intros/outros
3. **Scene Duration:** Keep educational scenes 30-45 seconds for optimal learning
4. **Visual Consistency:** Use same Gemini prompt patterns from `video-director.ts`
5. **Audio Quality:** Use "alloy" voice (professional, neutral) from OpenAI TTS
6. **SCORM Integration:** Embed videos in HTML5 `<video>` tags with SCORM progress tracking

### Multi-Firebase Projects

The platform supports multiple Firebase projects simultaneously. Projects are initialized from environment variables:

**Supported Projects:**
- `iclean` - iClean VX (HACCP/Food Safety)
- `haccp` - HACCP platform
- `math` - Educational Math Platform
- `peakflow` - PeakFlow Accounting
- `acs` - ACS (Advanced Cleaning Systems)

**Access Pattern:**
```typescript
const project = getFirebaseProject('iclean');
const db = project.db;
const storage = project.storage;
```

### API Routes

All routes are prefixed with `/api/`:

- **Health:** `/api/health`, `/api/health/firebase`, `/api/health/apis`
- **Generation:** `/api/generate/user-manual`, `/api/generate/sop`, `/api/generate/lesson`
- **Chat:** `/api/chat/message`, `/api/chat/analyze-intent`
- **Firebase:** `/api/firebase/projects/:name/firestore/:collection`, `/api/firebase/projects/:name/storage/upload`
- **Extraction:** `/api/extraction/extract-work-instructions`

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
- `{PROJECT}_FIREBASE_KEY` - JSON service account keys (e.g., `ICLEAN_FIREBASE_KEY`, `ACS_FIREBASE_KEY`)

## Type System

Shared types are defined in `packages/shared/src/types.ts`. Key interfaces:

**Work Instructions:**
- `WorkInstructionExtraction` - Full extraction with CSC fields
- `WorkInstructionSection` - PDF section with metadata
- `WorkInstructionStepGroup` - Grouped cleaning steps

**CSC Data Models:**
- `SiteModel` - Site/facility with `iClean` flag
- `SiteAreaModel` - Cleaning area within a site
- `AreaItemModel` - Individual cleaning task with MCS/SCI integration
- `ScheduleModel` - Cleaning frequency schedules

**API Responses:**
- `ApiResponse<T>` - Standard response wrapper

## Frontend Patterns

The frontend uses Next.js 14 App Router with:

- **UI Components:** Radix UI primitives with Tailwind styling
- **State Management:** React hooks (useState, useEffect)
- **Styling:** Tailwind CSS with `class-variance-authority` for variants
- **Theme:** Dark mode support via `next-themes`

**Key Components:**
- `acs-workspace.tsx` - Work instruction import UI for ACS
- `chat-interface.tsx` - Claude chat integration
- `artifact-viewer.tsx` - Generated content display
- `site-picker.tsx` - Site selection with type-ahead search

## Testing the Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Test user manual generation
curl -X POST http://localhost:3001/api/generate/user-manual \
  -H "Content-Type: application/json" \
  -d '{
    "repoUrl": "https://github.com/user/repo",
    "features": ["Auth", "Dashboard"],
    "title": "My App Manual"
  }'

# Test chat
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Generate a cleaning SOP"}
    ]
  }'
```

## Deployment

**Backend:** Railway or Render
```bash
cd packages/backend
npm run deploy
```

**Frontend:** Vercel
```bash
cd packages/frontend
npm run deploy
```

## Important Notes

1. **CORS Configuration:** The backend only allows requests from `localhost` or `FRONTEND_URL`. Update CORS settings in `packages/backend/src/index.ts` for production.

2. **Firebase Service Accounts:** Store Firebase keys as JSON strings in environment variables, not as files.

3. **CSC Paths:** Always use CSC path helpers when working with Firestore to prevent cross-company data leaks.

4. **Work Instruction Imports:** PDF extractions must include `companyId`, `siteId`, and `parentDocumentId` for proper organization.

5. **User Journey Agent:** Clones repositories to `/tmp/` for analysis. Clean up temporary directories if needed.

6. **Type Safety:** Import shared types from `@shared/types` (aliased in tsconfig) rather than duplicating.

7. **Video Generation:** This worktree shares video infrastructure with the main `content-engine` repo. Don't rebuild Remotion components - extend and reuse existing ones. See the "Video Generation System" section above for integration patterns and existing API endpoints.
