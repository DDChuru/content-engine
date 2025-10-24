/**
 * Caption Generator Integration Examples
 * Shows how to integrate caption-generator with other TikTok pipeline services
 */

import {
  CaptionGenerator,
  createCaptionGenerator,
  addCaptionsToVideo,
  CAPTION_PRESETS,
  TranscriptSegment
} from './caption-generator';
import { TranslationService } from './translation';

/**
 * Example 1: Integration with Translation Service
 * Generate captions in multiple languages
 */
export async function integrateWithTranslation() {
  const captionGen = await createCaptionGenerator();
  const translator = new TranslationService();

  // Original English segments
  const originalSegments: TranscriptSegment[] = [
    { text: 'Welcome to our product demo!', start: 0, end: 2.5 },
    { text: 'Today we\'ll show you amazing features.', start: 2.5, end: 5.5 },
    { text: 'Let\'s get started!', start: 5.5, end: 7 }
  ];

  // Generate English captions
  const englishSrt = await captionGen.generateCaptions(originalSegments, 'en');

  // Translate to multiple languages
  const targetLanguages = ['es', 'fr', 'de', 'ja', 'ar'];
  const translatedCaptions: Record<string, string> = {};

  for (const targetLang of targetLanguages) {
    // Translate segments
    const translatedSegments = await Promise.all(
      originalSegments.map(async (seg) => ({
        ...seg,
        text: await translator.translate(seg.text, 'en', targetLang)
      }))
    );

    // Generate SRT for translated text
    translatedCaptions[targetLang] = await captionGen.generateCaptions(
      translatedSegments,
      targetLang,
      {
        rtl: ['ar', 'he', 'fa'].includes(targetLang)
      }
    );
  }

  console.log('Generated captions in', Object.keys(translatedCaptions).length, 'languages');
  return { englishSrt, translatedCaptions };
}

/**
 * Example 2: Batch Video Processing with Captions
 * Process multiple videos with consistent styling
 */
export async function batchCaptionProcessing(videos: Array<{
  path: string;
  transcript: TranscriptSegment[];
  language: string;
}>) {
  const captionGen = await createCaptionGenerator();
  const results = [];

  // Consistent style for all videos
  const brandStyle = {
    ...CAPTION_PRESETS.tiktok,
    font: 'Impact',
    size: 36,
    color: '&H0000FFFF',  // Yellow for brand recognition
  };

  for (const video of videos) {
    try {
      const outputPath = await addCaptionsToVideo(video.path, video.transcript, {
        language: video.language,
        style: brandStyle,
        outputPath: video.path.replace('.mp4', '_captioned.mp4'),
        captionOptions: {
          maxLineWidth: 40,
          maxLines: 2,
          wordWrap: true
        }
      });

      results.push({
        original: video.path,
        captioned: outputPath,
        status: 'success'
      });
    } catch (error) {
      results.push({
        original: video.path,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  await captionGen.cleanupAll();
  return results;
}

/**
 * Example 3: Dynamic Caption Workflow
 * Complete workflow with moment analysis and dynamic captions
 */
export async function dynamicCaptionWorkflow(
  videoPath: string,
  transcript: TranscriptSegment[],
  keyMoments?: Array<{ timestamp: number; importance: number }>
) {
  const captionGen = await createCaptionGenerator();

  // Step 1: Generate base SRT
  const srtPath = await captionGen.generateCaptions(transcript, 'en', {
    maxLineWidth: 40,
    maxLines: 2,
    wordWrap: true
  });

  // Step 2: Identify segments that need emphasis
  const emphasisSegments = keyMoments
    ? transcript.filter(seg =>
        keyMoments.some(moment =>
          moment.timestamp >= seg.start &&
          moment.timestamp <= seg.end &&
          moment.importance > 0.7
        )
      )
    : [];

  // Step 3: Generate dynamic captions for emphasis moments
  if (emphasisSegments.length > 0) {
    const assPath = await captionGen.generateDynamicCaptions(
      emphasisSegments,
      undefined,
      {
        size: 40,
        color: '&H0000FFFF',  // Yellow for emphasis
        bold: true
      }
    );

    // Burn dynamic captions
    const dynamicOutput = await captionGen.burnDynamicCaptions(
      videoPath,
      assPath,
      videoPath.replace('.mp4', '_dynamic.mp4')
    );

    await captionGen.cleanup(assPath);
    return dynamicOutput;
  } else {
    // Regular caption burning
    const output = await captionGen.burnCaptions(
      videoPath,
      srtPath,
      CAPTION_PRESETS.tiktok,
      videoPath.replace('.mp4', '_captioned.mp4')
    );

    await captionGen.cleanup(srtPath);
    return output;
  }
}

/**
 * Example 4: A/B Testing Different Caption Styles
 * Generate multiple versions with different styles for testing
 */
export async function generateStyleVariants(
  videoPath: string,
  segments: TranscriptSegment[]
) {
  const captionGen = await createCaptionGenerator();
  const variants: Record<string, string> = {};

  // Generate SRT once
  const srtPath = await captionGen.generateCaptions(segments, 'en');

  // Test different presets
  const presetsToTest = ['tiktok', 'instagram', 'youtube', 'bold'] as const;

  for (const presetName of presetsToTest) {
    const preset = CAPTION_PRESETS[presetName];
    const outputPath = videoPath.replace('.mp4', `_${presetName}.mp4`);

    variants[presetName] = await captionGen.burnCaptions(
      videoPath,
      srtPath,
      preset,
      outputPath
    );
  }

  // Cleanup
  await captionGen.cleanup(srtPath);

  return variants;
}

/**
 * Example 5: Accessibility-Enhanced Captions
 * Generate captions with speaker identification and sound effects
 */
export async function accessibleCaptions(
  videoPath: string,
  segments: Array<TranscriptSegment & { soundEffects?: string[] }>
) {
  const captionGen = await createCaptionGenerator();

  // Enhance segments with accessibility info
  const enhancedSegments = segments.map(seg => ({
    ...seg,
    text: [
      seg.speaker ? `[${seg.speaker}]: ` : '',
      seg.text,
      seg.soundEffects ? ` [${seg.soundEffects.join(', ')}]` : ''
    ].join('')
  }));

  // Generate with larger font and high contrast
  const srtPath = await captionGen.generateCaptions(enhancedSegments, 'en', {
    maxLineWidth: 35,
    maxLines: 3,  // Allow more lines for accessibility info
    wordWrap: true
  });

  // Use high-contrast style
  const accessibleStyle = {
    font: 'Arial',
    size: 36,  // Larger for readability
    color: '&H00FFFFFF',  // White
    outline: '&H00000000',  // Black
    outlineWidth: 3,  // Thicker outline
    bold: true,
    position: 'bottom' as const,
    alignment: 2,
    backgroundColor: '&H00000000',  // Black background
    backgroundOpacity: 180  // Semi-transparent
  };

  const output = await captionGen.burnCaptions(
    videoPath,
    srtPath,
    accessibleStyle,
    videoPath.replace('.mp4', '_accessible.mp4')
  );

  await captionGen.cleanup(srtPath);
  return output;
}

/**
 * Example 6: Quality Control Pipeline
 * Validate and preview captions before burning
 */
export async function captionQualityControl(
  segments: TranscriptSegment[],
  language: string
) {
  const captionGen = await createCaptionGenerator();

  // Step 1: Generate SRT
  const srtPath = await captionGen.generateCaptions(segments, language);

  // Step 2: Validate format
  const validation = await captionGen.validateSRT(srtPath);
  if (!validation.valid) {
    console.error('SRT validation failed:', validation.errors);
    await captionGen.cleanup(srtPath);
    throw new Error('Invalid SRT format');
  }

  // Step 3: Generate preview
  const preview = await captionGen.generatePreview(segments, 5);
  console.log('Caption Preview:\n', preview);

  // Step 4: Check quality metrics
  const qualityIssues = [];

  for (const seg of segments) {
    const duration = seg.end - seg.start;
    const charsPerSecond = seg.text.length / duration;

    // Check reading speed (optimal: 15-20 chars/sec)
    if (charsPerSecond > 25) {
      qualityIssues.push({
        segment: seg.text.substring(0, 30) + '...',
        issue: 'Too fast to read',
        charsPerSecond: charsPerSecond.toFixed(1)
      });
    }

    // Check duration (minimum 1 second)
    if (duration < 1) {
      qualityIssues.push({
        segment: seg.text.substring(0, 30) + '...',
        issue: 'Duration too short',
        duration: duration.toFixed(2)
      });
    }

    // Check length (max 84 chars for 2 lines)
    if (seg.text.length > 84) {
      qualityIssues.push({
        segment: seg.text.substring(0, 30) + '...',
        issue: 'Text too long',
        length: seg.text.length
      });
    }
  }

  return {
    srtPath,
    valid: validation.valid,
    preview,
    qualityIssues,
    passed: qualityIssues.length === 0
  };
}

/**
 * Example 7: Platform-Specific Caption Generation
 * Generate optimized captions for different platforms
 */
export async function platformSpecificCaptions(
  videoPath: string,
  segments: TranscriptSegment[],
  targetPlatforms: Array<'tiktok' | 'instagram' | 'youtube'>
) {
  const captionGen = await createCaptionGenerator();
  const outputs: Record<string, string> = {};

  const platformConfigs = {
    tiktok: {
      style: CAPTION_PRESETS.tiktok,
      options: {
        maxLineWidth: 35,
        maxLines: 2,
        wordWrap: true
      },
      aspectRatio: '9:16'
    },
    instagram: {
      style: CAPTION_PRESETS.instagram,
      options: {
        maxLineWidth: 40,
        maxLines: 2,
        wordWrap: true
      },
      aspectRatio: '9:16'
    },
    youtube: {
      style: CAPTION_PRESETS.youtube,
      options: {
        maxLineWidth: 45,
        maxLines: 2,
        wordWrap: true
      },
      aspectRatio: '16:9'
    }
  };

  for (const platform of targetPlatforms) {
    const config = platformConfigs[platform];

    outputs[platform] = await addCaptionsToVideo(videoPath, segments, {
      language: 'en',
      style: config.style,
      outputPath: videoPath.replace('.mp4', `_${platform}.mp4`),
      captionOptions: config.options
    });

    console.log(`Generated ${platform} version with ${config.aspectRatio} captions`);
  }

  return outputs;
}

/**
 * Example 8: Real-time Caption Preview Generator
 * Generate caption data for frontend preview
 */
export function generateCaptionPreviewData(segments: TranscriptSegment[]) {
  return segments.map((seg, index) => ({
    id: index + 1,
    startTime: seg.start,
    endTime: seg.end,
    duration: seg.end - seg.start,
    text: seg.text,
    words: seg.text.split(/\s+/),
    timestamp: `${formatPreviewTime(seg.start)} --> ${formatPreviewTime(seg.end)}`,
    readingSpeed: (seg.text.length / (seg.end - seg.start)).toFixed(1),
    quality: assessCaptionQuality(seg)
  }));
}

function formatPreviewTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

function assessCaptionQuality(seg: TranscriptSegment): 'good' | 'warning' | 'error' {
  const duration = seg.end - seg.start;
  const charsPerSecond = seg.text.length / duration;

  if (duration < 1 || charsPerSecond > 25 || seg.text.length > 84) {
    return 'error';
  }
  if (charsPerSecond > 20 || seg.text.length > 70) {
    return 'warning';
  }
  return 'good';
}

/**
 * Export all integration examples
 */
export default {
  integrateWithTranslation,
  batchCaptionProcessing,
  dynamicCaptionWorkflow,
  generateStyleVariants,
  accessibleCaptions,
  captionQualityControl,
  platformSpecificCaptions,
  generateCaptionPreviewData
};
