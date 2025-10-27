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
- `education` - Educational Content Platform (Cambridge IGCSE, SCORM packages)

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
- `{PROJECT}_FIREBASE_KEY` - JSON service account keys (e.g., `ICLEAN_FIREBASE_KEY`, `ACS_FIREBASE_KEY`, `EDUCATION_FIREBASE_KEY`)

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

## Education Platform (NEW)

### Overview

The Education platform (`education` Firebase project) generates SCORM-compliant educational content from structured syllabi. It combines:
- **Syllabus import** (Cambridge IGCSE, etc.)
- **Content generation** (Claude AI)
- **Math animations** (Manim - FREE, local)
- **Interactive visualizations** (D3)
- **Voice narration** (ElevenLabs with voice cloning)
- **Video composition** (Remotion)
- **SCORM packaging** (LMS deployment)

### Key Documentation

- **`EDUCATION-FIREBASE-SCHEMA.md`** - Complete Firestore database schema
- **`EDUCATION-PROJECT-SETUP.md`** - Setup instructions and architecture
- **`SYLLABUS-IMPORT-GUIDE.md`** - How to import syllabi (Cambridge IGCSE example)

### Quick Start

1. **Create Education Firebase Project** (see `EDUCATION-PROJECT-SETUP.md`)
2. **Add service account key** to `.env`:
   ```bash
   EDUCATION_FIREBASE_KEY='{"type":"service_account",...}'
   ```
3. **Import Cambridge IGCSE syllabus**:
   ```bash
   cd packages/backend
   npm run import-syllabus ./data/cambridge-igcse-0580.json
   ```
4. **Verify in Firebase Console**: Check `syllabi/cambridge-igcse-maths-0580`

### Database Structure

```
syllabi/
  {syllabusId}/
    - Curriculum metadata (exam board, years, assessment info)

    units/
      {unitId}/
        - Learning outcomes, duration, difficulty

        topics/
          {topicId}/
            - Learning objectives, status, SCORM info

            concepts/
              {conceptId}/
                - Narration, timeline, assets (video, audio, interactive)

            exercises/
              {exerciseId}/
                - Questions, answers, feedback

            quiz/
              - Assessment questions, passing score
```

### Cost Estimation

**Per 10-minute educational module:**
- Manim animations: $0 (local, FREE)
- Gemini images: ~$0.16 (4 images × $0.039)
- ElevenLabs narration: ~$0.90 (3K chars × $0.30/1K)
- Remotion composition: $0 (local, FREE)
- **Total: ~$1.06 per module**

**Complete Cambridge IGCSE Mathematics (99 topics):**
- Total cost: ~$80-$100
- Output: 300-500 video lessons
- SCORM packages ready for any LMS

Compare to traditional production: $50,000+

### Implementation Status

✅ **Completed:**
- Firebase schema designed (`EDUCATION-FIREBASE-SCHEMA.md`)
- Syllabus import script built (`src/scripts/import-cambridge-igcse.ts`)
- Import validation script (`src/scripts/test-import-validation.ts`)
- Backend integration (Firebase project initialized in `firebase.ts`)
- Frontend integration (Education in project selector)
- Sample data created (`data/cambridge-igcse-0580-sample.json`)
- TypeScript compilation verified
- Import structure validated (6 topics, 3 units, ~$6.36 estimated cost)

⏳ **Pending:**
- Firebase project setup (user action required)
- Content generation pipeline (Claude → concepts)
- Manim integration (math animations)
- D3 visualization generator
- ElevenLabs voice cloning setup
- SCORM packager
- Student progress tracking
- API routes for education endpoints

### Testing the Education Platform

**Validate syllabus import structure (no Firebase required):**
```bash
cd packages/backend
npm run validate-syllabus ./data/cambridge-igcse-0580-sample.json
```

This will show:
- Syllabus structure (syllabi → units → topics)
- Unit and topic breakdown with metadata
- Firestore path preview
- Cost estimation (~$1.06 per module)
- Implementation checklist

**Import syllabus to Firebase (requires EDUCATION_FIREBASE_KEY):**
```bash
cd packages/backend
npm run import-syllabus ./data/cambridge-igcse-0580-sample.json
```

This will:
- Create syllabus document in Firestore
- Import all units (topics in Cambridge structure)
- Import all topics (subtopics in Cambridge structure)
- Preserve all metadata, examples, notes, notation, etc.

### Next Steps

See `SYLLABUS-IMPORT-GUIDE.md` for:
1. Setting up Education Firebase project
2. Importing Cambridge IGCSE syllabus
3. Generating content for topics
4. Exporting as SCORM packages

## Future: Agent Workspace (ROADMAP)

### Vision

Transform Content Engine Cloud into an AI-powered development platform with autonomous agents that can:
- Analyze codebases
- Implement features
- Fix bugs
- Review code
- Create pull requests
- Run tests

### Architecture Plan

**Two execution modes:**

1. **Local (Development):**
   - Use CLI tools (FREE): Claude Code, Gemini CLI, Aider, Droid
   - Direct filesystem access
   - Git operations
   - Your tools and environment
   - Cost: $0

2. **Remote (Production/API):**
   - Use AI APIs: Claude API, Gemini API, OpenAI API, DeepSeek API
   - Scalable cloud execution
   - Authenticated with API keys
   - Accessible from anywhere
   - Cost: ~$0.01-$0.50 per task

**Model routing:**
- Auto-select best model for task
- Or user specifies preferred model
- Options: Claude Opus/Sonnet, Gemini Flash/Pro, GPT-4, DeepSeek Coder

### Planned Features

**Phase 1: MVP (4 hours)**
- Add "Spawn Agent" button to existing chat interface
- Basic `/api/agents/spawn` endpoint
- Execute tasks with Claude API
- Simple status tracking

**Phase 2: Tracking (8 hours)**
- Store agent execution in Firebase
- View agent history
- Track costs and performance
- Basic analytics

**Phase 3: Dashboard (16 hours)**
- Dedicated agent workspace UI
- Kanban board for tasks
- Agent status monitoring
- Project health metrics
- Real-time updates

**Phase 4: Advanced (1 week)**
- CLI tool detection (local execution)
- Model routing (auto-select best AI)
- GitHub webhooks (PR tracking)
- API key system (remote access)
- WebSockets (real-time status)

### Implementation Effort

- **Minimal (agent spawn):** 2-4 hours
- **Production-ready (UI + tracking):** 1-2 days
- **Full-featured (everything):** 1 week

### Key Documents (To Be Created)

- `AGENT-WORKSPACE-ARCHITECTURE.md` - System design
- `AGENT-EXECUTOR-SPEC.md` - CLI vs API execution
- `MODEL-ROUTING-GUIDE.md` - Auto-selecting AI models
- `API-KEY-SYSTEM.md` - Authentication and quotas

### Status: PLANNED

The agent workspace is **not yet implemented**. Focus is currently on:
1. ✅ Completing education platform
2. ✅ Testing educational content generation
3. ⏳ Documenting workflows

Agent workspace will be built **after** education platform is validated and tested in production.

### Notes

The existing chat interface (`ChatInterface` component) can already be used for conversational agent-like interactions. The agent workspace will formalize this with:
- Persistent tracking
- Task queuing
- Status monitoring
- Cost analytics
- Team collaboration
