# Multilingual TikTok Video Generation System

Complete AI-powered pipeline for generating TikTok videos in multiple languages. Supports three distinct workflows: existing video repurposing, AI video generation, and hybrid approaches.

## System Overview

This system enables you to create professional TikTok videos across multiple languages using state-of-the-art AI services:

- **Google Gemini AI** - Translation and content analysis
- **Google Veo 3.1** - AI video generation from text prompts
- **ElevenLabs** - Multilingual text-to-speech (voice cloning)
- **Anthropic Claude** - Video moment analysis
- **FFmpeg** - Video processing and rendering

## Three Workflows

### Workflow A: Existing Video → TikTok Clips
**Best for:** Repurposing existing content, podcasts, webinars, YouTube videos

**Process:**
1. Analyze video for viral moments (AI-powered with Claude)
2. Extract best clips (30-60 seconds each)
3. Translate captions (Gemini AI)
4. Generate voices (ElevenLabs multilingual)
5. Convert to vertical format (9:16)
6. Add captions and CTA overlays
7. Export TikTok-ready videos

**Input:** Existing video file (MP4, MOV, etc.)
**Output:** Multiple TikTok videos (moments × languages)
**Status:** ✅ Fully functional and tested
**Cost:** ~$0.03 per video (translation + voice)

### Workflow B: AI Generated → TikTok
**Best for:** Creating new content from scratch, branded content, educational videos

**Process:**
1. Generate video with Veo 3.1 from text prompt
2. Translate script to target languages (Gemini AI)
3. Generate multilingual voiceovers (ElevenLabs)
4. Merge voice with AI video (FFmpeg)
5. Add captions and CTA overlays
6. Export TikTok-ready videos

**Input:** Text prompt/script
**Output:** AI-generated TikTok videos (one per language)
**Status:** ✅ Built and ready (requires Veo 3.1 API access)
**Cost:** ~$6.07 per video (Veo generation + translation + voice)

### Workflow C: Hybrid
**Best for:** Advanced use cases, mixing real footage with AI elements

**Process:** Combines both approaches
**Status:** ✅ Framework built

## Quick Start

### 1. Prerequisites

**Required API Keys:**
- Google Gemini API key (for translation)
- ElevenLabs API key (for voice generation)
- Anthropic API key (for video analysis)
- Google Cloud Project ID with Veo 3.1 access (for AI video generation - Workflow B only)

**System Requirements:**
- Node.js 18+ with TypeScript
- FFmpeg installed on system

### 2. Environment Setup

Create `.env` file in `packages/backend/`:

```bash
# Required for all workflows
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_DEFAULT_VOICE_ID=your_default_voice_id
ANTHROPIC_API_KEY=your_anthropic_api_key

# Required for Workflow B (AI video generation)
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project
```

### 3. Installation

```bash
cd packages/backend
npm install
```

### 4. Test Each Workflow

#### Test Workflow A (Existing Video)
```bash
# Test translation and voice generation
npx tsx src/services/tiktok/test-video-generation.ts

# Test full pipeline with a video
npx tsx src/services/tiktok/test-full-pipeline.ts /path/to/your/video.mp4
```

#### Test Workflow B (AI Generation)
```bash
# Test all workflows (includes Veo 3.1 setup validation)
npx tsx src/services/tiktok/test-unified-workflows.ts

# When you have Veo 3.1 access, test AI generation
npx tsx src/services/tiktok/test-ai-generation.ts
```

## API Reference

### UnifiedTikTokGenerator

Main entry point for all workflows.

```typescript
import { UnifiedTikTokGenerator } from './services/tiktok/unified-tiktok-generator.js';

const generator = new UnifiedTikTokGenerator();

// Workflow A: Process existing video
const resultA = await generator.generate({
  type: 'existing-video',
  videoPath: '/path/to/video.mp4',
  momentCount: 3,           // Number of clips to extract
  momentDuration: 30,       // Duration of each clip (seconds)
  languages: ['en', 'sn'],  // English and Shona
  voiceId: 'your_voice_id',
  outputDir: './output'
});

// Workflow B: Generate from text prompt
const resultB = await generator.generate({
  type: 'ai-generated',
  script: 'Discover Victoria Falls, one of the Seven Natural Wonders!',
  videoDuration: 30,
  videoStyle: 'cinematic',
  languages: ['en', 'sn'],
  voiceId: 'your_voice_id',
  outputDir: './output'
});

// Workflow C: Hybrid
const resultC = await generator.generate({
  type: 'hybrid',
  baseVideo: '/path/to/base.mp4',
  overlayPrompts: ['Dramatic waterfall shots'],
  languages: ['en', 'sn'],
  voiceId: 'your_voice_id'
});
```

### Helper Methods

```typescript
// Quick helpers for common tasks
await generator.processExistingVideo(videoPath, ['en', 'sn'], voiceId);
await generator.generateFromPrompt(script, ['en', 'sn'], voiceId);

// Cost estimation
const costs = generator.estimateCosts({
  type: 'existing-video',
  videoPath: '/sample.mp4',
  momentCount: 3,
  languages: ['en', 'sn'],
  voiceId: 'voice_id'
});
console.log(`Estimated cost: $${costs.total.toFixed(4)}`);
```

## Language Support

Currently configured languages:
- **English (en)** - Primary language
- **Shona (sn)** - Zimbabwe's primary indigenous language

### Adding More Languages

Update `src/services/tiktok/types.ts`:

```typescript
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English' },
  { code: 'sn', name: 'Shona' },
  { code: 'es', name: 'Spanish' },     // Add Spanish
  { code: 'fr', name: 'French' },      // Add French
  // ... add more languages
];
```

ElevenLabs `eleven_multilingual_v2` model supports 29 languages including:
- English, Spanish, French, German, Italian, Portuguese
- Hindi, Arabic, Chinese, Japanese, Korean
- And many more

## Cost Breakdown

### Workflow A: Existing Video → TikTok
**Example:** 3 moments × 2 languages = 6 videos

- Translation (Gemini): $0.0006 (3 moments)
- Voice generation (ElevenLabs): $0.21 (6 audio files)
- **Total: $0.2106**
- **Per video: $0.0351**

### Workflow B: AI Generated → TikTok
**Example:** 30-second video × 2 languages = 2 videos

- Veo 3.1 generation: $6.00 (30 seconds @ $0.20/sec)
- Translation (Gemini): $0.0002
- Voice generation (ElevenLabs): $0.14 (2 audio files)
- **Total: $6.1402**
- **Per video: $3.0701**

### Comparison
- **Workflow A:** Most affordable for existing content (~$0.04/video)
- **Workflow B:** Premium for AI-generated content (~$3.07/video)

## Veo 3.1 Setup (Workflow B)

### Getting Access

1. **Go to Google Cloud Console:**
   https://console.cloud.google.com

2. **Enable Vertex AI API:**
   - Navigate to APIs & Services
   - Enable "Vertex AI API"

3. **Request Veo 3.1 Preview Access:**
   - Visit: https://cloud.google.com/vertex-ai/docs/generative-ai/video
   - Fill out access request form
   - Wait for approval (can take several days)

4. **Add Project ID to .env:**
   ```bash
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   ```

### Validate Access

```bash
npx tsx src/services/tiktok/test-unified-workflows.ts
```

Look for:
```
✅ Veo 3.1 API credentials detected
   You can use Workflow B for AI video generation
```

## Voice Configuration

### Getting ElevenLabs Voice ID

1. **Visit ElevenLabs:**
   https://elevenlabs.io

2. **Go to Voice Library:**
   - Choose a voice or clone your own
   - Copy the voice ID

3. **Add to .env:**
   ```bash
   ELEVENLABS_DEFAULT_VOICE_ID=your_voice_id_here
   ```

### Voice Settings

Optimized presets available:

```typescript
import { ElevenLabsService } from './services/tiktok/elevenlabs.js';

// Get recommended settings for different content types
const settings = ElevenLabsService.getRecommendedSettings('narration');
// Options: 'narration', 'conversational', 'dramatic', 'calm'
```

## Output Structure

```
output/
├── workflow-a/              # Existing video processing
│   ├── moment_1_en.mp4     # English version of moment 1
│   ├── moment_1_sn.mp4     # Shona version of moment 1
│   ├── moment_2_en.mp4
│   ├── moment_2_sn.mp4
│   └── ...
├── workflow-b/              # AI-generated videos
│   ├── tiktok_en.mp4       # English AI video
│   ├── tiktok_sn.mp4       # Shona AI video
│   ├── voice_en.mp3        # English voiceover
│   └── voice_sn.mp3        # Shona voiceover
└── workflow-c/              # Hybrid outputs
    └── ...
```

## Production Deployment

### API Server

The system includes Express API endpoints:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### API Endpoints

```bash
# Generate TikTok videos from existing video
POST /api/tiktok/generate-from-video
Content-Type: multipart/form-data
{
  video: <file>,
  languages: ["en", "sn"],
  voiceId: "your_voice_id",
  momentCount: 3
}

# Generate TikTok videos from text prompt (Veo 3.1)
POST /api/tiktok/generate-from-prompt
Content-Type: application/json
{
  script: "Your video description",
  languages: ["en", "sn"],
  voiceId: "your_voice_id",
  videoDuration: 30
}
```

## Troubleshooting

### Common Issues

**1. "API key missing text_to_speech permission"**
- Solution: Visit ElevenLabs dashboard → API keys → Enable text-to-speech permission

**2. "Model 'eleven_multilingual_v2' does not support language_code"**
- Solution: This is correct behavior - the model auto-detects language from text. No action needed.

**3. "Veo 3.1 API access not configured"**
- Solution: Follow Veo 3.1 Setup section above to request access

**4. Translation quality issues**
- Solution: Gemini provides contextual translations. You can customize the prompt in `translation-gemini.ts`

**5. FFmpeg not found**
- Solution: Install FFmpeg:
  ```bash
  # Ubuntu/Debian
  sudo apt-get install ffmpeg

  # macOS
  brew install ffmpeg
  ```

## Performance Optimization

### Batch Processing

The system automatically batches operations:
- Multiple languages processed in parallel
- Voice generation optimized with concurrent requests
- Video rendering queued efficiently

### Cost Optimization Tips

1. **Use Workflow A for existing content** (~97% cheaper than Workflow B)
2. **Batch multiple videos** in single session to amortize API overhead
3. **Reuse voice generations** when scripts are similar
4. **Cache translations** for repeated phrases

## Testing

### Test Suite

```bash
# Test unified workflows (all three)
npx tsx src/services/tiktok/test-unified-workflows.ts

# Test translation and voice only
npx tsx src/services/tiktok/test-video-generation.ts

# Test with real video file
npx tsx src/services/tiktok/test-full-pipeline.ts VIDEO_PATH
```

### Sample Test Results

**Translation Test (English → Shona):**
```
✓ English: "Discover the breathtaking beauty..."
✓ Shona: "Wona kunaka kunoshamisa..."
✓ Cost: $0.0002
```

**Voice Generation Test:**
```
✓ Generated: voice_en.mp3 (187 KB)
✓ Generated: voice_sn.mp3 (195 KB)
✓ Total cost: $0.0656
✓ Processing time: 8.2s
```

## Architecture

### Component Overview

```
UnifiedTikTokGenerator (Orchestrator)
├── VeoVideoGenerator (AI video generation)
│   └── Google Vertex AI / Veo 3.1
├── GeminiTranslationService (Translation)
│   └── Google Gemini AI
├── ElevenLabsService (Voice generation)
│   └── ElevenLabs API
├── MomentAnalyzer (Video analysis)
│   └── Anthropic Claude
└── BatchRenderer (Video processing)
    └── FFmpeg
```

### Service Files

- `unified-tiktok-generator.ts` - Main orchestrator
- `veo-video-generator.ts` - Veo 3.1 integration
- `translation-gemini.ts` - Gemini translation
- `elevenlabs.ts` - ElevenLabs voice
- `moment-analyzer.ts` - Claude video analysis
- `batch-renderer.ts` - Video rendering pipeline
- `caption-generator.ts` - Caption burning
- `vertical-converter.ts` - Format conversion
- `cta-overlay.ts` - CTA overlay rendering

## Next Steps

### For Workflow A (Ready Now)
1. Add your API keys to `.env`
2. Test with sample video: `npx tsx src/services/tiktok/test-video-generation.ts`
3. Process your first video: `npx tsx src/services/tiktok/test-full-pipeline.ts VIDEO_PATH`

### For Workflow B (Requires Veo 3.1 Access)
1. Request Veo 3.1 API access from Google Cloud
2. Add `GOOGLE_CLOUD_PROJECT_ID` to `.env`
3. Test AI generation: `npx tsx src/services/tiktok/test-ai-generation.ts`

### Customization
- Adjust caption styles in `types.ts` (DEFAULT_CAPTION_STYLE)
- Customize CTA overlays in `types.ts` (DEFAULT_CTA_CONFIG)
- Add more languages to SUPPORTED_LANGUAGES
- Fine-tune voice settings per content type

## Support & Documentation

- **Quick Start:** `QUICK-START.md`
- **Testing Guide:** `TESTING-GUIDE.md`
- **API Documentation:** `TIKTOK-API-DOCUMENTATION.md`
- **Component Guides:** See individual `*-IMPLEMENTATION.md` files

## License

[Your License Here]

---

**Built with:**
- Google Gemini AI (Translation)
- Google Veo 3.1 (AI Video Generation)
- ElevenLabs (Multilingual Voice)
- Anthropic Claude (Video Analysis)
- FFmpeg (Video Processing)
