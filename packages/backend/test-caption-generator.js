#!/usr/bin/env node

/**
 * Test script for Caption Generator
 * Run with: node test-caption-generator.js
 */

// Import examples (will need to be compiled first)
async function runTests() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     TikTok Caption Generator - Test Suite             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  try {
    // Dynamically import the compiled examples
    const { default: examples } = await import('./dist/services/tiktok/caption-examples.js');

    console.log('Running all examples...\n');
    console.log('═'.repeat(60));

    await examples.default.runAllExamples();

    console.log('\n' + '═'.repeat(60));
    console.log('\n✓ Test suite completed successfully!\n');

  } catch (error) {
    if (error.code === 'ERR_MODULE_NOT_FOUND' || error.code === 'MODULE_NOT_FOUND') {
      console.log('⚠️  Examples not compiled yet.');
      console.log('\nTo run tests:');
      console.log('  1. Compile TypeScript: npm run build');
      console.log('  2. Run tests: node test-caption-generator.js\n');

      console.log('Or run individual examples in TypeScript:\n');
      runManualTests();
    } else {
      console.error('Error:', error.message);
      process.exit(1);
    }
  }
}

/**
 * Manual test demonstration (without compilation)
 */
function runManualTests() {
  console.log('MANUAL TEST EXAMPLES:');
  console.log('═'.repeat(60));

  console.log('\n1. Basic SRT Generation:');
  console.log(`
const generator = await createCaptionGenerator();
const segments = [
  { text: 'Welcome to TikTok!', start: 0, end: 2.5 },
  { text: 'Let\\'s create amazing content.', start: 2.5, end: 5 }
];
const srtPath = await generator.generateCaptions(segments, 'en');
console.log('Generated:', srtPath);
`);

  console.log('\n2. Burn Captions with Custom Style:');
  console.log(`
const customStyle = {
  font: 'Impact',
  size: 40,
  color: '&H0000FFFF',  // Yellow
  outline: '&H00000000', // Black
  outlineWidth: 3,
  bold: true,
  position: 'top'
};

const output = await generator.burnCaptions(
  'input.mp4',
  srtPath,
  customStyle,
  'output.mp4'
);
`);

  console.log('\n3. One-Step Helper:');
  console.log(`
const output = await addCaptionsToVideo('input.mp4', segments, {
  language: 'en',
  style: CAPTION_PRESETS.tiktok,
  outputPath: 'final.mp4',
  captionOptions: {
    maxLineWidth: 40,
    maxLines: 2,
    wordWrap: true
  }
});
`);

  console.log('\n4. Dynamic Word-by-Word Captions:');
  console.log(`
const assPath = await generator.generateDynamicCaptions(segments, undefined, {
  size: 36,
  color: '&H00FFFFFF',
  bold: true
});
const output = await generator.burnDynamicCaptions('input.mp4', assPath);
`);

  console.log('\n5. FFmpeg Command Examples:');
  console.log('═'.repeat(60));

  console.log('\nBasic caption burning:');
  console.log(`ffmpeg -i input.mp4 -vf "subtitles='captions.srt'" output.mp4`);

  console.log('\nWith TikTok style:');
  console.log(`ffmpeg -i input.mp4 -vf "subtitles='captions.srt':force_style='FontName=Arial,FontSize=32,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,Bold=1,Alignment=2'" output.mp4`);

  console.log('\nWith yellow bold style (top position):');
  console.log(`ffmpeg -i input.mp4 -vf "subtitles='captions.srt':force_style='FontName=Impact,FontSize=40,PrimaryColour=&H0000FFFF,OutlineColour=&H00000000,Outline=3,Bold=1,Alignment=8,MarginV=20'" output.mp4`);

  console.log('\nDynamic ASS captions:');
  console.log(`ffmpeg -i input.mp4 -vf "ass='dynamic.ass'" output.mp4`);

  console.log('\n\n6. SRT Format Example:');
  console.log('═'.repeat(60));
  console.log(`
1
00:00:00,000 --> 00:00:02,500
Welcome to TikTok!

2
00:00:02,500 --> 00:00:05,000
Let's create amazing content.

3
00:00:05,000 --> 00:00:07,500
Don't forget to like! 👍
`);

  console.log('\n7. Caption Style Presets:');
  console.log('═'.repeat(60));
  console.log(`
Available presets:
- tiktok    : White bold Arial, bottom center (default)
- youtube   : White Roboto with background, bottom
- instagram : White bold Impact, center screen
- minimal   : Small Helvetica, subtle outline
- bold      : Large yellow Impact, top position
`);

  console.log('\n8. Quality Recommendations:');
  console.log('═'.repeat(60));
  console.log(`
Font Size (1080x1920):
  ✓ Optimal: 32-40px
  ✓ Minimum: 28px
  ✗ Avoid: Below 24px

Colors:
  ✓ White + black outline (universal)
  ✓ Yellow + black outline (attention)
  ✗ Low contrast combinations

Line Length:
  ✓ 35-42 characters per line
  ✓ Maximum 2-3 lines
  ✓ 1-4 seconds duration

Position:
  ✓ Bottom: Most common
  ✓ Top: For bottom-heavy content
  ✗ Don't cover faces/key content
`);

  console.log('\n9. Advanced Features:');
  console.log('═'.repeat(60));
  console.log(`
✓ Multi-line word wrapping
✓ Right-to-left language support (Arabic, Hebrew)
✓ Emoji support
✓ Special character escaping
✓ Dynamic word-by-word highlighting
✓ Auto-segmentation of long text
✓ SRT format validation
✓ Preview generation
✓ Automatic cleanup
`);

  console.log('\n10. Usage in TikTok Pipeline:');
  console.log('═'.repeat(60));
  console.log(`
// In video-processor.ts
import { addCaptionsToVideo, CAPTION_PRESETS } from './caption-generator';

async processVideo(videoPath: string, transcript: any) {
  // Add captions to video
  const captionedVideo = await addCaptionsToVideo(videoPath, transcript.segments, {
    language: transcript.language,
    style: CAPTION_PRESETS.tiktok,
    captionOptions: {
      maxLineWidth: 40,
      maxLines: 2,
      wordWrap: true
    }
  });

  return captionedVideo;
}
`);

  console.log('\n');
}

// Run the tests
runTests().catch(console.error);
