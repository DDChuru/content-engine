# TikTok Multilingual Pipeline Services

Complete pipeline for creating multilingual TikTok videos with voice cloning, translation, captions, and CTAs.

## Overview

This package provides a complete TikTok multilingual video pipeline that orchestrates:

1. **Moment Analysis** - Extract viral-worthy clips from long videos
2. **Vertical Conversion** - Convert to 9:16 TikTok format
3. **Translation** - Translate captions to multiple languages
4. **Voice Cloning** - Generate multilingual voiceovers in your voice
5. **Transcription** - Auto-generate captions with perfect timing
6. **Caption Burning** - Overlay styled captions on video
7. **CTA Overlays** - Add call-to-action elements
8. **Batch Rendering** - Process multiple moments × languages in parallel

## Services

### 1. Batch Renderer (Main Orchestrator)

The `BatchRenderer` class coordinates the entire pipeline, rendering multiple moment × language combinations with cost tracking and error handling.

```typescript
import { BatchRenderer } from './services/tiktok/batch-renderer';

const renderer = new BatchRenderer(
  process.env.GOOGLE_CLOUD_API_KEY,
  process.env.ELEVEN_LABS_API_KEY
);

const config = {
  videoPath: '/path/to/video.mp4',
  moments: [
    {
      index: 1,
      startTime: 10.5,
      endTime: 40.5,
      duration: 30,
      caption: 'Your engaging caption here!',
      // ... other fields
    }
  ],
  languages: ['en', 'es', 'sn'], // English, Spanish, Shona
  voiceId: 'your-elevenlabs-voice-id',
  outputDir: './output/tiktok',
  captionStyle: {
    fontSize: 24,
    fontColor: 'white',
    position: 'bottom',
  },
  ctaConfig: {
    text: 'Full video on YouTube 👆',
    position: 'top',
  }
};

const result = await renderer.renderMultilingual(config);
```

### 2. Translation Service

Google Cloud Translation API integration with caching and batch processing.

```typescript
import { TranslationService } from './services/tiktok/translation';

const translator = new TranslationService(process.env.GOOGLE_CLOUD_API_KEY);

// Single translation
const result = await translator.translateText('Hello world', 'es');
console.log(result.translated); // "Hola mundo"

// Batch translation
const batch = await translator.batchTranslate(
  ['Hello', 'Goodbye'],
  ['es', 'fr', 'de']
);
```

### 3. Vertical Converter

Converts horizontal videos to vertical 9:16 format.

```typescript
import { VerticalConverter } from './services/tiktok/vertical-converter';

const converter = new VerticalConverter();

const output = await converter.convertToVertical(
  '/path/to/video.mp4',
  { style: 'blur-background' }
);
```

**Conversion Styles:**
- `crop`: Simple center crop (fastest)
- `blur-background`: Blur background fills sides (RECOMMENDED)
- `zoom`: Smart zoom into subject

### 4. CTA Overlay

Add call-to-action overlays with animations.

```typescript
import { CTAOverlay } from './services/tiktok/cta-overlay';

const ctaOverlay = new CTAOverlay();

// Simple CTA
await ctaOverlay.addCTA(videoPath, {
  text: 'Full video on YouTube 👆',
  position: 'top',
  duration: 3
});

// Animated CTA
await ctaOverlay.addAnimatedCTA(videoPath, {
  text: 'Watch now 👆',
  position: 'top',
  animation: 'fade',
  arrow: true,
  arrowAnimation: true
});
```

## Pipeline Flow

For each moment × language combination:

```
1. Extract clip from original video (FFmpeg)
   ↓
2. Convert to 9:16 vertical (VerticalConverter)
   ↓
3. Translate caption to target language (Google Cloud Translation)
   ↓
4. Generate voiceover in cloned voice (ElevenLabs multilingual model)
   ↓
5. Transcribe voiceover for caption timing (OpenAI Whisper)
   ↓
6. Generate SRT captions (CaptionGenerator)
   ↓
7. Replace audio and burn captions into video (FFmpeg)
   ↓
8. Add CTA overlay (CTAOverlay)
   ↓
9. Save final video: moment_{index}_{language}.mp4
```

## Cost Calculation

### ElevenLabs TTS Pricing
- **Rate**: ~$0.30 per 1,000 characters
- **Multilingual Model**: `eleven_multilingual_v2` (supports 29 languages)

### Example Costs

| Caption Length | Languages | Total Videos | Cost per Video | Total Cost |
|----------------|-----------|--------------|----------------|------------|
| 50 chars | 3 | 3 | $0.0015 | $0.0045 |
| 100 chars | 5 | 5 | $0.0030 | $0.0150 |
| 200 chars | 10 | 10 | $0.0060 | $0.0600 |

**Cost Optimization Tips:**
- Keep captions concise (50-100 chars optimal for TikTok)
- Use translation caching to avoid duplicate API calls
- Batch process multiple videos to amortize setup costs

## Supported Languages

The pipeline supports 29+ languages via ElevenLabs multilingual model:

**Major Languages:**
- English (en), Spanish (es), French (fr), German (de), Italian (it)
- Portuguese (pt), Polish (pl), Turkish (tr), Russian (ru), Dutch (nl)
- Chinese (zh), Japanese (ja), Korean (ko), Arabic (ar), Hindi (hi)

**African Languages:**
- Shona (sn), Zulu (zu), Swahili (sw), Afrikaans (af), Xhosa (xh), Yoruba (yo)

See `types.ts` for complete list.

## Error Handling

The batch renderer implements robust error handling:

1. **Graceful Degradation**: Failed videos don't stop the batch
2. **Error Collection**: All errors are logged with context
3. **Retry Logic**: API failures are retried automatically
4. **Cleanup**: Temporary files are cleaned up even on error

```typescript
const result = await renderer.renderMultilingual(config);

console.log(`Success: ${result.totalCount} videos`);
console.log(`Failed: ${result.errors?.length || 0}`);

if (result.errors) {
  result.errors.forEach(error => {
    console.log(`Moment ${error.momentIndex}, ${error.language}: ${error.error}`);
  });
}
```

## Performance Considerations

### Processing Time

Approximate time per video (30s clip):
- Extract clip: ~2s
- Convert to vertical: ~15s (blur-background style)
- Translation: ~0.5s (cached: <0.1s)
- Voice generation: ~3-5s
- Transcription: ~2-3s
- Caption burning: ~10s
- CTA overlay: ~5s

**Total**: ~40-50 seconds per video

### Throughput Estimates

| Batch Size | Estimated Time | Parallelization |
|------------|----------------|-----------------|
| 6 videos (2×3) | ~4-5 minutes | Sequential |
| 12 videos (4×3) | ~8-10 minutes | Sequential |
| 50 videos (5×10) | ~35-45 minutes | Sequential |

**Optimization**: Future versions could parallelize video processing across multiple workers.

## Dependencies

### Required Services
- **Google Cloud Translation API**: Translation service
- **ElevenLabs API**: Voice cloning and TTS
- **OpenAI Whisper API**: Audio transcription

### Required System Tools
- **FFmpeg**: Video processing (extract, convert, burn captions)
- **FFprobe**: Video metadata extraction

```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Environment Variables

```bash
# Required
GOOGLE_CLOUD_API_KEY=your-google-cloud-api-key
ELEVEN_LABS_API_KEY=your-elevenlabs-api-key
OPENAI_API_KEY=your-openai-api-key

# Optional
OUTPUT_DIR=./output/tiktok  # Default output directory
```

## Examples

See `batch-renderer.example.ts` for comprehensive examples:

1. **Basic Batch**: 2 moments × 3 languages = 6 videos
2. **Advanced Styling**: Custom caption and CTA styling
3. **Error Handling**: Handling invalid inputs gracefully
4. **Large Scale**: 5 moments × 10 languages = 50 videos
5. **Cost Optimization**: Comparing short vs long captions

Run examples:
```bash
tsx src/services/tiktok/batch-renderer.example.ts
```

## Testing

```bash
# Run basic batch test
npm run test:tiktok:batch

# Run with specific video
TIKTOK_VIDEO_PATH=/path/to/video.mp4 npm run test:tiktok:batch

# Cost estimation only
npm run test:tiktok:estimate
```

## Output Structure

```
output/
└── tiktok/
    ├── moment_1_en.mp4     # Moment 1, English
    ├── moment_1_es.mp4     # Moment 1, Spanish
    ├── moment_1_sn.mp4     # Moment 1, Shona
    ├── moment_2_en.mp4     # Moment 2, English
    ├── moment_2_es.mp4     # Moment 2, Spanish
    └── moment_2_sn.mp4     # Moment 2, Shona
```

## API Reference

### BatchRenderer

```typescript
class BatchRenderer {
  // Main orchestration
  renderMultilingual(config: BatchConfig): Promise<TikTokBatch>

  // Single video rendering
  renderSingle(
    videoPath: string,
    moment: Moment,
    language: string,
    voiceId: string,
    outputDir: string,
    captionStyle?: CaptionStyle,
    ctaConfig?: CTAConfig
  ): Promise<TikTokVideo>

  // Utilities
  saveAudio(buffer: Buffer, outputDir: string, momentIndex: number, language: string): Promise<string>
  transcribeAudio(audioPath: string, language: string): Promise<AudioTranscription>
  replaceAudioAndBurnCaptions(...): Promise<string>
  cleanupTempFiles(files: string[]): Promise<void>
  estimateBatchCost(config: BatchConfig): CostEstimate
}
```

### Types

See `types.ts` for complete type definitions:
- `BatchConfig`: Batch rendering configuration
- `TikTokVideo`: Individual video metadata
- `TikTokBatch`: Batch results with cost and timing
- `Moment`: Video moment to extract
- `CaptionStyle`: Caption styling options
- `CTAConfig`: CTA overlay configuration

## Troubleshooting

### Common Issues

**1. FFmpeg not found**
```
Error: Failed to spawn FFmpeg
Solution: Install FFmpeg and add to PATH
```

**2. API key errors**
```
Error: ElevenLabs API key required
Solution: Set ELEVEN_LABS_API_KEY environment variable
```

**3. Font not found (CTA overlay)**
```
Error: No suitable font file found
Solution: Install DejaVu fonts or Arial
```

**4. Transcription fails**
```
Error: Whisper API error
Solution: Check OPENAI_API_KEY and audio file format
```

**5. Out of memory (large batches)**
```
Solution: Process in smaller batches or increase Node memory:
node --max-old-space-size=4096 your-script.js
```

## Contributing

See individual service files for detailed implementation:
- `batch-renderer.ts` - Main orchestrator
- `translation.ts` - Translation service
- `vertical-converter.ts` - Video conversion
- `cta-overlay.ts` - CTA overlays
- `types.ts` - Type definitions

## License

MIT

