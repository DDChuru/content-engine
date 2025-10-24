/**
 * Example Usage of VerticalConverter
 *
 * This file demonstrates how to use the VerticalConverter service
 * to transform horizontal videos into vertical 9:16 format for TikTok.
 */

import { VerticalConverter, ConversionStyle } from './vertical-converter';

/**
 * Example 1: Basic conversion with default blur-background style
 */
async function example1_basicConversion() {
  console.log('\n=== Example 1: Basic Conversion (Blur Background) ===\n');

  const converter = new VerticalConverter();
  const inputVideo = '/path/to/horizontal-video.mp4'; // 16:9 video

  try {
    // Convert using default blur-background style (recommended)
    const outputPath = await converter.convertToVertical(inputVideo);
    console.log(`✅ Conversion complete: ${outputPath}`);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

/**
 * Example 2: Convert using all three styles
 */
async function example2_allStyles() {
  console.log('\n=== Example 2: Compare All Conversion Styles ===\n');

  const converter = new VerticalConverter();
  const inputVideo = '/path/to/horizontal-video.mp4';

  const styles: ConversionStyle[] = ['crop', 'blur-background', 'zoom'];

  for (const style of styles) {
    try {
      console.log(`\nConverting with ${style} style...`);
      const outputPath = await converter.convertToVertical(inputVideo, { style });
      console.log(`✅ ${style}: ${outputPath}`);

      // Get conversion stats
      const stats = await converter.getConversionStats(inputVideo, outputPath);
      console.log(`   Original: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Converted: ${(stats.convertedSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`   Size change: ${stats.sizeReduction > 0 ? '-' : '+'}${Math.abs(stats.sizeReduction).toFixed(1)}%`);
      console.log(`   Original aspect: ${stats.originalInfo.aspectRatio.toFixed(2)}:1 (${stats.originalInfo.width}x${stats.originalInfo.height})`);
      console.log(`   Converted aspect: ${stats.convertedInfo.aspectRatio.toFixed(2)}:1 (${stats.convertedInfo.width}x${stats.convertedInfo.height})`);
    } catch (error) {
      console.error(`❌ ${style} failed:`, error);
    }
  }
}

/**
 * Example 3: Custom configuration
 */
async function example3_customConfig() {
  console.log('\n=== Example 3: Custom Configuration ===\n');

  const converter = new VerticalConverter();
  const inputVideo = '/path/to/horizontal-video.mp4';

  // Custom blur background with higher intensity
  const config = {
    style: 'blur-background' as ConversionStyle,
    outputResolution: '1080x1920',
    blurIntensity: 30 // Higher blur for more dramatic effect
  };

  try {
    const outputPath = await converter.convertToVertical(inputVideo, config);
    console.log(`✅ Custom conversion complete: ${outputPath}`);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

/**
 * Example 4: Get video info before conversion
 */
async function example4_analyzeFirst() {
  console.log('\n=== Example 4: Analyze Before Converting ===\n');

  const converter = new VerticalConverter();
  const inputVideo = '/path/to/horizontal-video.mp4';

  try {
    // Get video information
    const videoInfo = await converter.getVideoInfo(inputVideo);
    console.log('Video Information:');
    console.log(`  Resolution: ${videoInfo.width}x${videoInfo.height}`);
    console.log(`  Aspect Ratio: ${videoInfo.aspectRatio.toFixed(2)}:1`);
    console.log(`  Duration: ${videoInfo.duration.toFixed(2)}s`);
    console.log(`  Format: ${videoInfo.format}`);
    console.log(`  Codec: ${videoInfo.codec}`);
    console.log(`  Bitrate: ${videoInfo.bitrate ? (videoInfo.bitrate / 1000000).toFixed(2) + ' Mbps' : 'unknown'}`);

    // Get recommended style
    const recommendedStyle = converter.getRecommendedStyle(videoInfo.aspectRatio);
    console.log(`  Recommended style: ${recommendedStyle}`);

    // Convert with recommended style
    const outputPath = await converter.convertToVertical(inputVideo, {
      style: recommendedStyle
    });
    console.log(`\n✅ Conversion complete: ${outputPath}`);
  } catch (error) {
    console.error('Failed:', error);
  }
}

/**
 * Example 5: Batch conversion
 */
async function example5_batchConversion() {
  console.log('\n=== Example 5: Batch Conversion ===\n');

  const converter = new VerticalConverter();
  const videos = [
    '/path/to/video1.mp4',
    '/path/to/video2.mp4',
    '/path/to/video3.mp4'
  ];

  try {
    const results = await converter.convertBatch(videos, {
      style: 'blur-background'
    });

    console.log('\nBatch Conversion Results:');
    for (const [input, output] of results.entries()) {
      if (output.startsWith('ERROR:')) {
        console.log(`❌ ${input}: ${output}`);
      } else {
        console.log(`✅ ${input} -> ${output}`);
      }
    }
  } catch (error) {
    console.error('Batch conversion failed:', error);
  }
}

/**
 * Example 6: Smart zoom for presentation videos
 */
async function example6_smartZoom() {
  console.log('\n=== Example 6: Smart Zoom for Presentations ===\n');

  const converter = new VerticalConverter();
  const presentationVideo = '/path/to/presentation.mp4';

  try {
    // Use zoom style with custom zoom factor
    const outputPath = await converter.convertToVertical(presentationVideo, {
      style: 'zoom',
      zoomFactor: 2.0 // Zoom in more for better detail
    });
    console.log(`✅ Zoomed conversion complete: ${outputPath}`);
  } catch (error) {
    console.error('Conversion failed:', error);
  }
}

/**
 * Example 7: Validate video before processing
 */
async function example7_validateFirst() {
  console.log('\n=== Example 7: Validate Video ===\n');

  const converter = new VerticalConverter();
  const inputVideo = '/path/to/video.mp4';

  try {
    // Validate before processing
    await converter.validateVideo(inputVideo);
    console.log('✅ Video is valid');

    // Proceed with conversion
    const outputPath = await converter.convertToVertical(inputVideo);
    console.log(`✅ Conversion complete: ${outputPath}`);
  } catch (error) {
    console.error('❌ Validation or conversion failed:', error);
  }
}

/**
 * Example 8: Real-world workflow
 */
async function example8_realWorldWorkflow() {
  console.log('\n=== Example 8: Real-World Workflow ===\n');

  const converter = new VerticalConverter();
  const inputVideo = '/path/to/video.mp4';

  try {
    console.log('Step 1: Validating video...');
    await converter.validateVideo(inputVideo);

    console.log('Step 2: Analyzing video...');
    const info = await converter.getVideoInfo(inputVideo);
    console.log(`   - Resolution: ${info.width}x${info.height}`);
    console.log(`   - Aspect Ratio: ${info.aspectRatio.toFixed(2)}:1`);
    console.log(`   - Duration: ${info.duration.toFixed(2)}s`);

    console.log('Step 3: Selecting best conversion style...');
    const style = converter.getRecommendedStyle(info.aspectRatio);
    console.log(`   - Selected: ${style}`);

    console.log('Step 4: Converting to vertical...');
    const outputPath = await converter.convertToVertical(inputVideo, { style });

    console.log('Step 5: Verifying output...');
    const outputInfo = await converter.getVideoInfo(outputPath);
    console.log(`   - Output Resolution: ${outputInfo.width}x${outputInfo.height}`);
    console.log(`   - Output Aspect: ${outputInfo.aspectRatio.toFixed(2)}:1 (target: 0.56)`);

    const stats = await converter.getConversionStats(inputVideo, outputPath);
    console.log(`   - File Size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB -> ${(stats.convertedSize / 1024 / 1024).toFixed(2)} MB`);

    console.log(`\n✅ Complete workflow finished: ${outputPath}`);
  } catch (error) {
    console.error('❌ Workflow failed:', error);
  }
}

/**
 * FFmpeg Commands Reference
 */
function showFFmpegCommands() {
  console.log('\n=== FFmpeg Commands Used ===\n');

  console.log('1. CENTER CROP (crop style):');
  console.log('   ffmpeg -i input.mp4 -vf "crop=ih*(9/16):ih,scale=1080:1920" -c:a copy output.mp4');
  console.log('   - Crops to 9:16 ratio from center');
  console.log('   - Fast processing');
  console.log('   - May lose content on sides\n');

  console.log('2. BLUR BACKGROUND (blur-background style) - RECOMMENDED:');
  console.log('   ffmpeg -i input.mp4 \\');
  console.log('     -filter_complex "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,boxblur=20:5[bg];');
  console.log('                      [0:v]scale=-1:1920[fg];');
  console.log('                      [bg][fg]overlay=(W-w)/2:(H-h)/2" \\');
  console.log('     -c:a copy output.mp4');
  console.log('   - Professional look');
  console.log('   - Preserves all content');
  console.log('   - Blurred background fills sides\n');

  console.log('3. SMART ZOOM (zoom style):');
  console.log('   ffmpeg -i input.mp4 -vf "scale=iw*1.5:ih*1.5,crop=1080:1920" -c:a copy output.mp4');
  console.log('   - Zooms into center');
  console.log('   - Good for presentations');
  console.log('   - May lose peripheral content\n');
}

/**
 * Quality Considerations
 */
function showQualityNotes() {
  console.log('\n=== Quality Considerations ===\n');

  console.log('1. STYLE SELECTION:');
  console.log('   - blur-background: Best for most content, professional look');
  console.log('   - crop: Best for content already centered, fastest processing');
  console.log('   - zoom: Best for presentations or talking heads\n');

  console.log('2. RESOLUTION:');
  console.log('   - Default 1080x1920 is optimal for TikTok');
  console.log('   - Maintains 9:16 aspect ratio');
  console.log('   - Good balance of quality and file size\n');

  console.log('3. AUDIO:');
  console.log('   - Audio is copied without re-encoding (-c:a copy)');
  console.log('   - Preserves original audio quality');
  console.log('   - No audio sync issues\n');

  console.log('4. PERFORMANCE:');
  console.log('   - crop: ~1x realtime (fastest)');
  console.log('   - zoom: ~1x realtime (fast)');
  console.log('   - blur-background: ~0.5x realtime (slower but worth it)');
  console.log('   - Processing time scales with video duration\n');

  console.log('5. FILE SIZE:');
  console.log('   - Varies based on content and original bitrate');
  console.log('   - blur-background may be slightly larger due to blur processing');
  console.log('   - Generally similar to original size\n');
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║  TikTok Vertical Converter - Usage Examples         ║');
  console.log('╚══════════════════════════════════════════════════════╝');

  // Show reference information
  showFFmpegCommands();
  showQualityNotes();

  console.log('\n=== To run examples, uncomment desired function calls ===\n');
  console.log('// await example1_basicConversion();');
  console.log('// await example2_allStyles();');
  console.log('// await example3_customConfig();');
  console.log('// await example4_analyzeFirst();');
  console.log('// await example5_batchConversion();');
  console.log('// await example6_smartZoom();');
  console.log('// await example7_validateFirst();');
  console.log('// await example8_realWorldWorkflow();');

  // Uncomment to run specific examples:
  // await example1_basicConversion();
  // await example2_allStyles();
  // await example8_realWorldWorkflow();
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

// Export examples for testing
export {
  example1_basicConversion,
  example2_allStyles,
  example3_customConfig,
  example4_analyzeFirst,
  example5_batchConversion,
  example6_smartZoom,
  example7_validateFirst,
  example8_realWorldWorkflow
};
