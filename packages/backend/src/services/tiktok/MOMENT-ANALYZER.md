# TikTok Moment Analyzer

AI-powered service that analyzes long-form videos to automatically identify and extract viral TikTok moments.

## Features

- **Frame Extraction**: Captures key frames at regular intervals for visual analysis
- **Audio Transcription**: Uses OpenAI Whisper to transcribe video audio with timestamps
- **AI Analysis**: Leverages Claude's vision and reasoning to identify viral moments
- **Clip Extraction**: Extracts identified moments as separate video files
- **Batch Processing**: Process multiple videos efficiently
- **Customizable Criteria**: Configure viral potential thresholds and requirements

## Installation

```bash
npm install openai @anthropic-ai/sdk
```

## Prerequisites

1. **FFmpeg**: Must be installed on your system
   ```bash
   # Ubuntu/Debian
   sudo apt-get install ffmpeg

   # macOS
   brew install ffmpeg
   ```

2. **API Keys**:
   - OpenAI API key (for Whisper transcription)
   - Anthropic API key (for Claude analysis)

## Quick Start

```typescript
import { MomentAnalyzer } from './services/tiktok/moment-analyzer';

const analyzer = new MomentAnalyzer(
  process.env.OPENAI_API_KEY!,
  process.env.ANTHROPIC_API_KEY!
);

const result = await analyzer.findBestMoments({
  videoPath: '/path/to/video.mp4',
  count: 10,        // Find 10 best moments
  duration: 60      // Each moment ~60 seconds
});

console.log(`Found ${result.moments.length} viral moments!`);
```

## Core Methods

### `findBestMoments(config)`

Main method to analyze a video and find viral moments.

**Parameters:**
- `config.videoPath` (string): Path to the video file
- `config.count` (number): Number of moments to find
- `config.duration` (number): Target duration for each moment (seconds)
- `config.frameInterval` (number, optional): Seconds between frame captures (default: 2)
- `config.criteria` (object, optional): Custom analysis criteria

**Returns:** `MomentAnalysisResult`
- `moments`: Array of identified moments
- `totalDuration`: Video length in seconds
- `framesAnalyzed`: Number of frames processed
- `transcriptLength`: Character count of transcript
- `processingTime`: Analysis time in milliseconds

### `extractClip(videoPath, moment, options)`

Extract a single moment as a video clip.

**Parameters:**
- `videoPath` (string): Source video path
- `moment` (Moment): The moment to extract
- `options.outputPath` (string): Where to save the clip
- `options.codec` (string, optional): Video codec (default: 'libx264')
- `options.videoBitrate` (string, optional): Video bitrate (default: '2000k')
- `options.audioBitrate` (string, optional): Audio bitrate (default: '128k')

### `extractClips(videoPath, moments, outputDir, options)`

Extract multiple clips at once.

**Parameters:**
- `videoPath` (string): Source video path
- `moments` (Moment[]): Array of moments to extract
- `outputDir` (string): Directory to save clips
- `options` (object, optional): Same as extractClip options

**Returns:** `string[]` - Array of output file paths

## Analysis Criteria

The analyzer evaluates moments based on:

1. **Hook (First 3 seconds)**
   - Immediately attention-grabbing
   - Visual or verbal hook that stops scrolling
   - Promise of value or entertainment

2. **Clear Value/Insight**
   - Educational content
   - Entertainment value
   - Inspirational message
   - Relatable moments

3. **Self-Contained**
   - Makes sense without context
   - No references to earlier/later content
   - Complete micro-story

4. **Emotional Engagement**
   - Evokes surprise, joy, curiosity, or inspiration
   - Creates "I need to share this" feeling

5. **Shareability**
   - Quotable or memorable
   - Sparks conversation
   - Worth sending to friends

### Viral Potential Scoring (1-10)

- **9-10**: Extremely viral potential, hits all criteria perfectly
- **7-8**: Strong potential, hits most criteria
- **5-6**: Good potential, meets minimum requirements
- **Below 5**: Not recommended

### Custom Criteria

```typescript
const result = await analyzer.findBestMoments({
  videoPath: '/path/to/video.mp4',
  count: 10,
  duration: 60,
  criteria: {
    hookDuration: 2,              // Hook must happen in first 2 seconds
    minViralScore: 7,             // Only moments with 7+ score
    requiresSelfContained: true,   // Must be self-contained
    emotionalEngagement: true      // Must evoke emotion
  }
});
```

## Moment Object

Each identified moment includes:

```typescript
interface Moment {
  index: number;           // Sequential number (1, 2, 3...)
  startTime: number;       // Start timestamp (seconds)
  endTime: number;         // End timestamp (seconds)
  duration: number;        // Clip duration (seconds)
  hook: string;           // Description of first 3 seconds
  keyMessage: string;     // Main value/insight
  viralPotential: number; // Score 1-10
  caption: string;        // Suggested TikTok caption with hashtags
}
```

## Utility Methods

### `sortByViralPotential(moments)`
Sort moments by viral potential (highest first)

### `filterByViralScore(moments, minScore)`
Filter moments by minimum viral score

### `getMomentByIndex(moments, index)`
Get a specific moment by its index

## Example Workflows

### 1. Find and Extract Top Moments

```typescript
const analyzer = new MomentAnalyzer(
  process.env.OPENAI_API_KEY!,
  process.env.ANTHROPIC_API_KEY!
);

// Analyze video
const result = await analyzer.findBestMoments({
  videoPath: './long-video.mp4',
  count: 10,
  duration: 60
});

// Get top 3 moments
const topMoments = analyzer.sortByViralPotential(result.moments).slice(0, 3);

// Extract clips
const clips = await analyzer.extractClips(
  './long-video.mp4',
  topMoments,
  './tiktok-clips'
);

console.log('Extracted clips:', clips);
```

### 2. High-Quality Moments Only

```typescript
const result = await analyzer.findBestMoments({
  videoPath: './video.mp4',
  count: 20,
  duration: 45,
  criteria: {
    minViralScore: 8  // Only extremely viral moments
  }
});

const viralMoments = analyzer.filterByViralScore(result.moments, 8);
console.log(`Found ${viralMoments.length} highly viral moments`);
```

### 3. Extract Best Moment

```typescript
const result = await analyzer.findBestMoments({
  videoPath: './video.mp4',
  count: 10,
  duration: 60
});

const bestMoment = analyzer.sortByViralPotential(result.moments)[0];

await analyzer.extractClip(
  './video.mp4',
  bestMoment,
  {
    outputPath: './best-moment.mp4',
    videoBitrate: '3000k'
  }
);

console.log('TikTok caption:', bestMoment.caption);
```

## Performance Considerations

- **Frame Interval**: Higher interval (e.g., 3-5 seconds) = faster processing, less detail
- **Video Length**: ~2-3 minutes processing time per 30 minutes of video
- **Frame Sampling**: Only every 5th frame sent to Claude to reduce token usage
- **Temp Files**: Automatically cleaned up after processing

## Error Handling

```typescript
try {
  const result = await analyzer.findBestMoments(config);
  // Process results
} catch (error) {
  if (error.message.includes('FFmpeg')) {
    console.error('FFmpeg error - check installation');
  } else if (error.message.includes('OpenAI')) {
    console.error('Whisper transcription failed');
  } else if (error.message.includes('Claude')) {
    console.error('Claude analysis failed');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Environment Variables

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

## Supported Video Formats

- MP4 (recommended)
- MOV
- AVI
- MKV
- Any format supported by FFmpeg

## Output Format

Extracted clips are MP4 files with:
- Video codec: H.264 (libx264)
- Audio codec: AAC
- Optimized for web playback
- TikTok-compatible format

## Testing

See `example-usage.ts` for comprehensive examples:

```bash
# Run basic example
npm run dev src/services/tiktok/example-usage.ts 1

# Run advanced example with custom criteria
npm run dev src/services/tiktok/example-usage.ts 2

# Run batch processing example
npm run dev src/services/tiktok/example-usage.ts 5
```

## Cost Estimates

Per 30-minute video:
- OpenAI Whisper: ~$0.06
- Claude API (vision + analysis): ~$0.50-1.00
- **Total: ~$0.56-1.06 per video**

## Architecture

```
MomentAnalyzer
├── extractKeyFrames()      → FFmpeg extracts frames
├── transcribeVideo()       → OpenAI Whisper transcribes
├── analyzeWithClaude()     → Claude analyzes moments
└── extractClip(s)()        → FFmpeg extracts clips

Flow:
1. Extract frames every N seconds
2. Extract and transcribe audio
3. Send frames + transcript to Claude
4. Claude returns top moments with timestamps
5. Extract identified moments as clips
```

## Limitations

- Requires FFmpeg installation
- Video must have audio for best results
- Processing time scales with video length
- Claude has token limits (handles up to ~2 hour videos)

## Future Enhancements

- Thumbnail generation for each moment
- Custom overlay text/branding
- Direct upload to TikTok API
- Multi-language support
- A/B testing captions
- Automated scheduling

## License

MIT
