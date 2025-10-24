# Quick Start: Moment Analyzer

## 1. Install Dependencies

```bash
cd packages/backend
npm install
```

This will install the newly added `openai` package along with existing dependencies.

## 2. Set Environment Variables

Create a `.env` file in `packages/backend/`:

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## 3. Verify FFmpeg Installation

```bash
ffmpeg -version
ffprobe -version
```

If not installed:
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg
```

## 4. Run the Test

```bash
npm run dev src/services/tiktok/test-moment-analyzer.ts /path/to/your/video.mp4
```

## 5. Extract Clips (Optional)

```bash
npm run dev src/services/tiktok/test-moment-analyzer.ts /path/to/your/video.mp4 --extract
```

Clips will be saved to `./output/tiktok-moments/`

## 6. Try the Examples

```bash
# Example 1: Basic usage
npm run dev src/services/tiktok/example-usage.ts 1

# Example 2: Advanced with custom criteria
npm run dev src/services/tiktok/example-usage.ts 2

# Example 3: Extract single best moment
npm run dev src/services/tiktok/example-usage.ts 3

# Example 4: Filter high-potential moments
npm run dev src/services/tiktok/example-usage.ts 4

# Example 5: Batch processing
npm run dev src/services/tiktok/example-usage.ts 5
```

## 7. Use in Your Code

```typescript
import { MomentAnalyzer } from './services/tiktok/moment-analyzer';

const analyzer = new MomentAnalyzer(
  process.env.OPENAI_API_KEY!,
  process.env.ANTHROPIC_API_KEY!
);

const result = await analyzer.findBestMoments({
  videoPath: '/path/to/video.mp4',
  count: 10,
  duration: 60
});

console.log('Found moments:', result.moments);
```

## Cost Estimates

- **Per 30-minute video:** ~$0.56-1.06
- **Breakdown:**
  - Whisper transcription: ~$0.06
  - Claude analysis: ~$0.50-1.00

## Documentation

- **Full API Reference:** `packages/backend/src/services/tiktok/MOMENT-ANALYZER.md`
- **Implementation Report:** `MOMENT-ANALYZER-IMPLEMENTATION.md`
- **Example Code:** `packages/backend/src/services/tiktok/example-usage.ts`

## Troubleshooting

**Error: FFmpeg not found**
- Install FFmpeg (see step 3)

**Error: OPENAI_API_KEY not set**
- Set environment variable (see step 2)

**Error: File not found**
- Provide full absolute path to video file

**Error: Out of memory**
- Reduce `frameInterval` (e.g., 5 instead of 2)
- Process shorter video segments

## Next Steps

1. Integrate with Translation Service for multilingual captions
2. Use Vertical Converter to create TikTok-ready format
3. Add CTAs with CTA Overlay service
4. Batch render with BatchRenderer for multiple languages

See `MOMENT-ANALYZER-IMPLEMENTATION.md` for complete integration examples.
