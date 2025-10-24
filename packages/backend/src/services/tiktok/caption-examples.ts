/**
 * Caption Generator Examples and Usage Guide
 * Demonstrates various caption generation scenarios
 */

import {
  CaptionGenerator,
  createCaptionGenerator,
  addCaptionsToVideo,
  TranscriptSegment,
  CAPTION_PRESETS,
  DEFAULT_TIKTOK_STYLE
} from './caption-generator';

/**
 * Example 1: Basic SRT Generation
 * Generate simple SRT subtitle file from transcript
 */
export async function example1_BasicSRT() {
  console.log('=== Example 1: Basic SRT Generation ===\n');

  const generator = await createCaptionGenerator();

  const segments: TranscriptSegment[] = [
    {
      text: 'Welcome to our TikTok tutorial!',
      start: 0,
      end: 2.5
    },
    {
      text: 'Today we\'ll learn how to add amazing captions.',
      start: 2.5,
      end: 5.8
    },
    {
      text: 'Let\'s get started! 🚀',
      start: 5.8,
      end: 7.5
    }
  ];

  const srtPath = await generator.generateCaptions(segments, 'en');
  console.log(`Generated SRT file: ${srtPath}\n`);

  // Preview the SRT content
  const preview = await generator.generatePreview(segments);
  console.log('Preview:\n', preview);

  // Validate the SRT
  const validation = await generator.validateSRT(srtPath);
  console.log('Validation:', validation.valid ? 'PASSED ✓' : 'FAILED ✗');
  if (!validation.valid) {
    console.log('Errors:', validation.errors);
  }

  return srtPath;
}

/**
 * Example 2: Burn Captions with Custom Style
 * Apply TikTok-style captions to a video
 */
export async function example2_BurnCaptions() {
  console.log('\n=== Example 2: Burn Captions with Custom Style ===\n');

  const generator = await createCaptionGenerator();

  const segments: TranscriptSegment[] = [
    { text: 'Check out this amazing content!', start: 0, end: 3 },
    { text: 'Viral TikTok captions are easy!', start: 3, end: 6 }
  ];

  // Generate SRT
  const srtPath = await generator.generateCaptions(segments, 'en');

  // Custom style - bold yellow text with thick outline
  const customStyle = {
    ...DEFAULT_TIKTOK_STYLE,
    size: 40,
    color: '&H0000FFFF',  // Yellow
    outlineWidth: 3,
    position: 'top' as const
  };

  console.log('Style Configuration:');
  console.log(JSON.stringify(customStyle, null, 2));

  const styleString = generator.getStyleString(customStyle);
  console.log('\nFFmpeg Style String:');
  console.log(styleString);

  // Note: Requires actual video file
  // const outputPath = await generator.burnCaptions(
  //   'input.mp4',
  //   srtPath,
  //   customStyle,
  //   'output_with_captions.mp4'
  // );

  console.log('\nReady to burn captions with FFmpeg command:');
  console.log(`ffmpeg -i input.mp4 -vf "subtitles='${srtPath}':force_style='${styleString}'" output.mp4`);

  await generator.cleanup(srtPath);
}

/**
 * Example 3: Multi-line Captions with Word Wrapping
 * Handle long text with automatic wrapping
 */
export async function example3_WordWrapping() {
  console.log('\n=== Example 3: Multi-line Captions with Word Wrapping ===\n');

  const generator = await createCaptionGenerator();

  const longSegments: TranscriptSegment[] = [
    {
      text: 'This is a very long caption that needs to be wrapped across multiple lines for better readability on mobile devices',
      start: 0,
      end: 5
    },
    {
      text: 'Short caption',
      start: 5,
      end: 7
    }
  ];

  const srtPath = await generator.generateCaptions(longSegments, 'en', {
    maxLineWidth: 35,
    maxLines: 2,
    wordWrap: true
  });

  const preview = await generator.generatePreview(longSegments);
  console.log('Wrapped Captions:\n', preview);

  await generator.cleanup(srtPath);
}

/**
 * Example 4: Dynamic Word-by-Word Captions
 * TikTok-style highlighted captions
 */
export async function example4_DynamicCaptions() {
  console.log('\n=== Example 4: Dynamic Word-by-Word Captions ===\n');

  const generator = await createCaptionGenerator();

  const segments: TranscriptSegment[] = [
    { text: 'Every word gets highlighted', start: 0, end: 3 },
    { text: 'Just like viral TikToks', start: 3, end: 5.5 }
  ];

  const assPath = await generator.generateDynamicCaptions(segments, undefined, {
    size: 36,
    color: '&H00FFFFFF',
    bold: true
  });

  console.log(`Generated ASS file: ${assPath}`);
  console.log('This creates word-by-word highlighting effects!');

  // Note: Requires actual video file
  // const outputPath = await generator.burnDynamicCaptions(
  //   'input.mp4',
  //   assPath,
  //   'output_dynamic.mp4'
  // );

  await generator.cleanup(assPath);
}

/**
 * Example 5: Right-to-Left Language Support
 * Arabic, Hebrew captions
 */
export async function example5_RTLSupport() {
  console.log('\n=== Example 5: Right-to-Left Language Support ===\n');

  const generator = await createCaptionGenerator();

  const arabicSegments: TranscriptSegment[] = [
    {
      text: 'مرحبا بكم في الفيديو',  // Welcome to the video
      start: 0,
      end: 3
    },
    {
      text: 'هذا مثال للترجمة',  // This is an example
      start: 3,
      end: 6
    }
  ];

  const srtPath = await generator.generateCaptions(arabicSegments, 'ar', {
    rtl: true
  });

  const preview = await generator.generatePreview(arabicSegments);
  console.log('RTL Captions (Arabic):\n', preview);
  console.log('Note: RTL markers are automatically added for proper rendering');

  await generator.cleanup(srtPath);
}

/**
 * Example 6: Using Caption Presets
 * Quick styling with pre-configured presets
 */
export async function example6_CaptionPresets() {
  console.log('\n=== Example 6: Using Caption Presets ===\n');

  console.log('Available Presets:');
  console.log(Object.keys(CAPTION_PRESETS).join(', '));
  console.log('');

  for (const [name, style] of Object.entries(CAPTION_PRESETS)) {
    console.log(`${name.toUpperCase()}:`);
    console.log(`  Font: ${style.font}, Size: ${style.size}`);
    console.log(`  Position: ${style.position}, Bold: ${style.bold}`);
    console.log('');
  }

  const generator = await createCaptionGenerator();

  const segments: TranscriptSegment[] = [
    { text: 'Testing Instagram style!', start: 0, end: 2 }
  ];

  const srtPath = await generator.generateCaptions(segments, 'en');

  // Use Instagram preset
  const instagramStyle = CAPTION_PRESETS.instagram;
  const styleString = generator.getStyleString(instagramStyle);

  console.log('Instagram Style FFmpeg Command:');
  console.log(`ffmpeg -i input.mp4 -vf "subtitles='${srtPath}':force_style='${styleString}'" output.mp4`);

  await generator.cleanup(srtPath);
}

/**
 * Example 7: Special Characters and Emojis
 * Handle special characters, quotes, and emojis
 */
export async function example7_SpecialCharacters() {
  console.log('\n=== Example 7: Special Characters and Emojis ===\n');

  const generator = await createCaptionGenerator();

  const segments: TranscriptSegment[] = [
    {
      text: "Let's test \"quotes\" and 'apostrophes'!",
      start: 0,
      end: 2.5
    },
    {
      text: 'Emojis work too! 😊 🎉 🚀 ❤️',
      start: 2.5,
      end: 5
    },
    {
      text: 'Special chars: @mentions #hashtags & symbols',
      start: 5,
      end: 8
    }
  ];

  const srtPath = await generator.generateCaptions(segments, 'en');
  const preview = await generator.generatePreview(segments);

  console.log('Sanitized Captions:\n', preview);

  await generator.cleanup(srtPath);
}

/**
 * Example 8: Complete Workflow
 * End-to-end caption generation and burning
 */
export async function example8_CompleteWorkflow() {
  console.log('\n=== Example 8: Complete Workflow ===\n');

  const segments: TranscriptSegment[] = [
    { text: 'Start of our viral video!', start: 0, end: 2 },
    { text: 'This content is amazing.', start: 2, end: 4.5 },
    { text: 'Don\'t forget to like and subscribe! 👍', start: 4.5, end: 7 }
  ];

  console.log('Using helper function for one-step caption burning...\n');

  // Note: Requires actual video file
  // const outputPath = await addCaptionsToVideo('input.mp4', segments, {
  //   language: 'en',
  //   style: CAPTION_PRESETS.tiktok,
  //   outputPath: 'final_output.mp4',
  //   captionOptions: {
  //     maxLineWidth: 40,
  //     maxLines: 2,
  //     wordWrap: true
  //   }
  // });

  console.log('Configuration:');
  console.log('- Language: English');
  console.log('- Style: TikTok preset');
  console.log('- Max line width: 40 characters');
  console.log('- Max lines: 2');
  console.log('- Word wrap: enabled');
  console.log('\nThis would generate SRT, burn captions, and cleanup automatically!');
}

/**
 * Example 9: Split Long Transcript
 * Automatically segment long text
 */
export async function example9_AutoSegmentation() {
  console.log('\n=== Example 9: Auto Segmentation ===\n');

  const generator = await createCaptionGenerator();

  const longTranscript = `
    Welcome to our comprehensive tutorial on TikTok video creation.
    In this video, we'll explore advanced techniques for engaging content.
    First, we'll discuss caption placement and styling options.
    Then, we'll dive into dynamic animations and word-by-word effects.
    Finally, we'll review best practices for mobile optimization.
  `.trim();

  const segments = generator.splitIntoSegments(
    longTranscript,
    { start: 0, end: 30 },
    42  // Max chars per segment
  );

  console.log(`Split into ${segments.length} segments:\n`);

  segments.forEach((seg, i) => {
    console.log(`${i + 1}. [${seg.start.toFixed(1)}s - ${seg.end.toFixed(1)}s]`);
    console.log(`   ${seg.text}`);
    console.log('');
  });

  const srtPath = await generator.generateCaptions(segments, 'en');
  console.log(`Generated SRT: ${srtPath}`);

  await generator.cleanup(srtPath);
}

/**
 * Example 10: Quality Recommendations
 * Best practices for caption readability
 */
export function example10_QualityRecommendations() {
  console.log('\n=== Example 10: Quality & Readability Recommendations ===\n');

  console.log('FONT RECOMMENDATIONS:');
  console.log('✓ TikTok/Instagram: Arial, Impact, Helvetica Bold');
  console.log('✓ YouTube: Roboto, Open Sans');
  console.log('✓ Professional: Helvetica, Proxima Nova');
  console.log('✗ Avoid: Serif fonts, script fonts (hard to read on mobile)\n');

  console.log('SIZE RECOMMENDATIONS (1080x1920 vertical):');
  console.log('✓ Minimum: 28px (for readability)');
  console.log('✓ Optimal: 32-40px (TikTok standard)');
  console.log('✓ Maximum: 48px (for emphasis)');
  console.log('✗ Avoid: Below 24px (too small on mobile)\n');

  console.log('COLOR RECOMMENDATIONS:');
  console.log('✓ White with black outline (universal)');
  console.log('✓ Yellow with black outline (attention-grabbing)');
  console.log('✓ High contrast colors (accessibility)');
  console.log('✗ Avoid: Low contrast, pure black/white without outline\n');

  console.log('OUTLINE RECOMMENDATIONS:');
  console.log('✓ Minimum: 2px (readability)');
  console.log('✓ Optimal: 2-3px (most content)');
  console.log('✓ Maximum: 4px (bold style)');
  console.log('✗ Avoid: No outline (text gets lost in video)\n');

  console.log('POSITIONING RECOMMENDATIONS:');
  console.log('✓ Bottom: Most common, doesn\'t cover main content');
  console.log('✓ Top: For videos with bottom-heavy content');
  console.log('✓ Middle: For dramatic effect');
  console.log('✗ Avoid: Covering faces or important visual elements\n');

  console.log('LINE LENGTH RECOMMENDATIONS:');
  console.log('✓ Optimal: 35-42 characters per line');
  console.log('✓ Maximum: 2-3 lines per caption');
  console.log('✓ Duration: 1-4 seconds per caption');
  console.log('✗ Avoid: More than 3 lines (screen clutter)\n');

  console.log('MOBILE OPTIMIZATION:');
  console.log('✓ Test on actual mobile device');
  console.log('✓ Ensure readability in thumbnail view');
  console.log('✓ Consider safe zones (60px from edges)');
  console.log('✓ Use bold for better visibility\n');
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  try {
    await example1_BasicSRT();
    await example2_BurnCaptions();
    await example3_WordWrapping();
    await example4_DynamicCaptions();
    await example5_RTLSupport();
    await example6_CaptionPresets();
    await example7_SpecialCharacters();
    await example8_CompleteWorkflow();
    await example9_AutoSegmentation();
    example10_QualityRecommendations();

    console.log('\n✓ All examples completed successfully!');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for individual testing
export default {
  example1_BasicSRT,
  example2_BurnCaptions,
  example3_WordWrapping,
  example4_DynamicCaptions,
  example5_RTLSupport,
  example6_CaptionPresets,
  example7_SpecialCharacters,
  example8_CompleteWorkflow,
  example9_AutoSegmentation,
  example10_QualityRecommendations,
  runAllExamples
};
