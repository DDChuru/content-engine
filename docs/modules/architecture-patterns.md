> Extracted verbatim from CLAUDE.md on 2026-07-08. Update THIS file (not root CLAUDE.md) when shipping changes in this area.

## Architecture Patterns

### Narration-Driven Video Rendering (CRITICAL)

**The #1 pattern in this codebase. Read this before touching any Remotion composition.**

**Core Principle:** Narration timestamps drive visual element timing. Visual elements appear when mentioned in the narration, synchronized to word-level Whisper transcription data. **NEVER** treat narration as a caption overlay — it is the timing source for all visual animations.

**Anti-Patterns (DO NOT DO):**
- Adding captions/subtitles on top of existing visuals
- Hardcoding animation keyframes without reference to audio timing
- Using fixed durations instead of transcript-derived timestamps
- Creating a composition without first reading the transcript JSON

**Canonical Pattern — `useCue()` hook:**
```typescript
// From EcowizePitchFull.tsx — the proven pattern for all compositions
function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return { opacity, isActive: frame >= cueFrame };
}
```

**How timing flows:**
```
Audio Recording → Whisper API (word timestamps) → Transcript JSON
→ Cue Resolution (keyword → timestamp) → useCue(timestamp)
→ Visual element appears when narrator says the keyword
```

**Reference files:**
- `EcowizePitchFull.tsx` — Battle-tested 2000-line composition with 15 slides, all narration-synced
- `transcripts/ecowize/slide-01.json` — Canonical transcript format with word-level timing
- `ProjectComposition.tsx` — Generic manifest-driven composition (reusable for any project)

**Content Studio Pipeline (`/storyboard → /script → /transcribe → /render`):**
- `/script` — Generates narration with `{{cue:keyword}}` markers for visual sync
- `/transcribe` — Calls Whisper API, resolves cue markers to actual word timestamps
- `/render` — Validates all phases, passes manifest to Remotion
- Project API: `POST/GET /api/studio/projects`, `POST /api/studio/projects/:slug/transcribe`
- Types: `packages/shared/src/types/studio-manifest.ts` (StudioProjectManifest, SlideManifest, TranscriptData, CuePoint)

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
├─ Gemini Image Generation (gemini-3-pro-image-preview - $0.039/image)
│  └─ Infographics, training visuals, backgrounds
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
  "@google/generative-ai": "^0.24.1",     // Gemini Image (gemini-3-pro-image-preview)
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
| Gemini Image (gemini-3-pro-image-preview) | 4 scenes | $0.039 | $0.16 |
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
