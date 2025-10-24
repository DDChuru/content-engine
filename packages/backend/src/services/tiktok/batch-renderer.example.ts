/**
 * Batch Renderer Example & Test
 *
 * Demonstrates rendering 2 moments × 3 languages = 6 videos
 * with cost calculation and error handling
 */

import { BatchRenderer } from './batch-renderer.js';
import type { BatchConfig, Moment } from './types.js';
import * as path from 'path';

/**
 * Example 1: Basic Batch Rendering
 * Renders 2 moments in 3 languages (English, Spanish, Shona)
 */
async function exampleBasicBatch() {
  console.log('\n' + '='.repeat(70));
  console.log('Example 1: Basic Batch Rendering (2 moments × 3 languages = 6 videos)');
  console.log('='.repeat(70) + '\n');

  // Initialize batch renderer
  const renderer = new BatchRenderer(
    process.env.GOOGLE_CLOUD_API_KEY,
    process.env.ELEVEN_LABS_API_KEY
  );

  // Define moments to extract from original video
  const moments: Moment[] = [
    {
      index: 1,
      startTime: 10.5,
      endTime: 40.5,
      duration: 30,
      hook: 'Attention-grabbing opening question',
      keyMessage: 'Main value proposition',
      viralPotential: 8,
      caption: 'Did you know that AI can now clone your voice in any language? Here\'s how it works!',
    },
    {
      index: 2,
      startTime: 120.0,
      endTime: 150.0,
      duration: 30,
      hook: 'Surprising statistics',
      keyMessage: 'Problem-solution narrative',
      viralPotential: 9,
      caption: 'Over 70% of content creators struggle with multilingual content. This tool changes everything!',
    },
  ];

  // Configure batch rendering
  const config: BatchConfig = {
    videoPath: '/path/to/original/video.mp4', // Replace with actual video path
    moments,
    languages: ['en', 'es', 'sn'], // English, Spanish, Shona
    voiceId: 'your-elevenlabs-voice-id', // Replace with your cloned voice ID
    outputDir: path.join(process.cwd(), 'output', 'tiktok-batch-1'),
    captionStyle: {
      fontSize: 24,
      fontColor: 'white',
      position: 'bottom',
      outline: true,
      outlineColor: 'black',
    },
    ctaConfig: {
      text: 'Full video on YouTube =F',
      position: 'top',
      duration: 3,
      fontSize: 40,
      fontColor: 'white',
    },
  };

  // Estimate costs before rendering
  console.log('=Ê Cost Estimation:');
  const costEstimate = renderer.estimateBatchCost(config);
  console.log(`   Total cost: $${costEstimate.totalCost.toFixed(4)}`);
  console.log(`   Cost per video: $${costEstimate.costPerVideo.toFixed(4)}`);
  console.log(`   Breakdown:`);
  costEstimate.breakdown.forEach((item) => {
    console.log(`     - Moment ${item.moment}, ${item.language}: $${item.cost.toFixed(4)}`);
  });

  console.log('\n=€ Starting batch render...\n');

  try {
    // Execute batch rendering
    const result = await renderer.renderMultilingual(config);

    // Display results
    console.log('\n=æ Batch Results:');
    console.log(`   Videos created: ${result.totalCount}`);
    console.log(`   Total cost: $${result.totalCost.toFixed(4)}`);
    console.log(`   Average cost per video: $${result.costPerVideo.toFixed(4)}`);
    console.log(`   Processing time: ${result.processingTime.toFixed(1)}s`);

    console.log('\n=ù Generated Videos:');
    result.videos.forEach((video, index) => {
      console.log(`   ${index + 1}. ${path.basename(video.path)}`);
      console.log(`      - Language: ${video.language}`);
      console.log(`      - Duration: ${video.duration}s`);
      console.log(`      - Size: ${(video.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`      - Caption: ${video.caption.substring(0, 50)}...`);
    });

    if (result.errors && result.errors.length > 0) {
      console.log('\nL Errors:');
      result.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. Moment ${error.momentIndex}, Language: ${error.language}`);
        console.log(`      Error: ${error.error}`);
        console.log(`      Time: ${error.timestamp.toISOString()}`);
      });
    }

    return result;
  } catch (error) {
    console.error('\nL Batch rendering failed:', error);
    throw error;
  }
}

/**
 * Example 2: Advanced Batch with Custom Styling
 */
async function exampleAdvancedBatch() {
  console.log('\n' + '='.repeat(70));
  console.log('Example 2: Advanced Batch with Custom Styling');
  console.log('='.repeat(70) + '\n');

  const renderer = new BatchRenderer();

  const moments: Moment[] = [
    {
      index: 1,
      startTime: 5.0,
      endTime: 35.0,
      duration: 30,
      hook: 'Shocking fact',
      keyMessage: 'Educational insight',
      viralPotential: 10,
      caption: 'This AI tool generated 100 TikTok videos in 6 different languages in under 10 minutes!',
    },
  ];

  const config: BatchConfig = {
    videoPath: '/path/to/video.mp4',
    moments,
    languages: ['en', 'es', 'fr', 'pt', 'de', 'it'], // 6 languages
    voiceId: 'your-voice-id',
    outputDir: path.join(process.cwd(), 'output', 'tiktok-batch-2'),
    captionStyle: {
      fontSize: 28,
      fontColor: 'yellow',
      backgroundColor: 'black@0.6',
      position: 'center',
      outline: true,
      outlineColor: 'black',
      animation: 'fade',
    },
    ctaConfig: {
      text: 'Watch full tutorial =F',
      position: 'top',
      duration: 5,
      fontSize: 44,
      fontColor: 'yellow',
      backgroundColor: 'black@0.8',
    },
  };

  const costEstimate = renderer.estimateBatchCost(config);
  console.log(`=° Estimated cost: $${costEstimate.totalCost.toFixed(4)} for ${config.languages.length} videos\n`);

  const result = await renderer.renderMultilingual(config);

  console.log(`\n Created ${result.totalCount} videos in ${result.processingTime.toFixed(1)}s`);
  console.log(`=µ Actual cost: $${result.totalCost.toFixed(4)}`);

  return result;
}

/**
 * Example 3: Error Handling & Recovery
 */
async function exampleErrorHandling() {
  console.log('\n' + '='.repeat(70));
  console.log('Example 3: Error Handling & Recovery');
  console.log('='.repeat(70) + '\n');

  const renderer = new BatchRenderer();

  const moments: Moment[] = [
    {
      index: 1,
      startTime: 0,
      endTime: 30,
      duration: 30,
      hook: 'Test hook',
      keyMessage: 'Test message',
      viralPotential: 7,
      caption: 'This is a test caption.',
    },
    {
      index: 2,
      startTime: 30,
      endTime: 60,
      duration: 30,
      hook: 'Test hook 2',
      keyMessage: 'Test message 2',
      viralPotential: 8,
      caption: 'This is another test caption with special characters: éñçüñä!',
    },
  ];

  const config: BatchConfig = {
    videoPath: '/path/to/video.mp4',
    moments,
    languages: ['en', 'es', 'invalid-lang'], // One invalid language
    voiceId: 'test-voice-id',
  };

  console.log('>ê Testing with invalid language code...\n');

  const result = await renderer.renderMultilingual(config);

  console.log('\n=Ê Results:');
  console.log(`    Successful: ${result.totalCount}`);
  console.log(`   L Failed: ${result.errors?.length || 0}`);

  if (result.errors && result.errors.length > 0) {
    console.log('\n=Ý Error Details:');
    result.errors.forEach((error) => {
      console.log(`   - Moment ${error.momentIndex}, Language: ${error.language}`);
      console.log(`     Error: ${error.error}`);
    });

    console.log('\n( Batch completed despite errors - successful videos were saved!');
  }

  return result;
}

/**
 * Example 4: Large Scale Batch (5 moments × 10 languages = 50 videos)
 */
async function exampleLargeScaleBatch() {
  console.log('\n' + '='.repeat(70));
  console.log('Example 4: Large Scale Batch (5 moments × 10 languages = 50 videos)');
  console.log('='.repeat(70) + '\n');

  const renderer = new BatchRenderer();

  // Generate 5 moments
  const moments: Moment[] = Array.from({ length: 5 }, (_, i) => ({
    index: i + 1,
    startTime: i * 60,
    endTime: i * 60 + 30,
    duration: 30,
    hook: `Hook ${i + 1}`,
    keyMessage: `Key message ${i + 1}`,
    viralPotential: 7 + Math.floor(Math.random() * 3),
    caption: `This is moment ${i + 1} with an engaging caption that explains the value proposition clearly!`,
  }));

  // 10 languages
  const languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'pl', 'ru', 'zh', 'ja'];

  const config: BatchConfig = {
    videoPath: '/path/to/video.mp4',
    moments,
    languages,
    voiceId: 'your-voice-id',
    outputDir: path.join(process.cwd(), 'output', 'tiktok-large-batch'),
  };

  // Estimate costs
  const costEstimate = renderer.estimateBatchCost(config);
  console.log('=Ê Large Scale Batch Estimates:');
  console.log(`   Total videos: ${moments.length * languages.length}`);
  console.log(`   Estimated cost: $${costEstimate.totalCost.toFixed(2)}`);
  console.log(`   Cost per video: $${costEstimate.costPerVideo.toFixed(4)}`);
  console.log(`   Estimated time: ~${((moments.length * languages.length) * 2).toFixed(0)} minutes`);

  const proceed = true; // In production, ask for user confirmation

  if (!proceed) {
    console.log('\nL Batch cancelled by user');
    return;
  }

  console.log('\n=€ Starting large scale batch...\n');

  const startTime = Date.now();
  const result = await renderer.renderMultilingual(config);
  const duration = (Date.now() - startTime) / 1000 / 60;

  console.log('\n' + '='.repeat(70));
  console.log('=Ê Large Scale Batch Complete!');
  console.log('='.repeat(70));
  console.log(` Videos created: ${result.totalCount}/${moments.length * languages.length}`);
  console.log(`=° Total cost: $${result.totalCost.toFixed(2)}`);
  console.log(`ñ  Duration: ${duration.toFixed(1)} minutes`);
  console.log(`=È Throughput: ${(result.totalCount / duration).toFixed(1)} videos/minute`);

  if (result.errors && result.errors.length > 0) {
    console.log(`L Errors: ${result.errors.length}`);
  }

  return result;
}

/**
 * Example 5: Cost Optimization Comparison
 */
async function exampleCostOptimization() {
  console.log('\n' + '='.repeat(70));
  console.log('Example 5: Cost Optimization Analysis');
  console.log('='.repeat(70) + '\n');

  const renderer = new BatchRenderer();

  // Short captions (optimized)
  const shortMoments: Moment[] = [
    {
      index: 1,
      startTime: 0,
      endTime: 30,
      duration: 30,
      hook: 'Quick hook',
      keyMessage: 'Short message',
      viralPotential: 8,
      caption: 'AI voice cloning in any language!', // 37 characters
    },
  ];

  // Long captions (expensive)
  const longMoments: Moment[] = [
    {
      index: 1,
      startTime: 0,
      endTime: 30,
      duration: 30,
      hook: 'Detailed hook',
      keyMessage: 'Comprehensive explanation',
      viralPotential: 8,
      caption: 'Artificial Intelligence has revolutionized the way we create content, and with advanced voice cloning technology, you can now generate natural-sounding voiceovers in over 29 different languages using your own voice, opening up incredible opportunities for global content distribution and multilingual marketing campaigns!', // 349 characters
    },
  ];

  const languages = ['en', 'es', 'fr'];

  // Calculate costs
  const shortConfig: BatchConfig = {
    videoPath: '/path/to/video.mp4',
    moments: shortMoments,
    languages,
    voiceId: 'test',
  };

  const longConfig: BatchConfig = {
    videoPath: '/path/to/video.mp4',
    moments: longMoments,
    languages,
    voiceId: 'test',
  };

  const shortCost = renderer.estimateBatchCost(shortConfig);
  const longCost = renderer.estimateBatchCost(longConfig);

  console.log('=Ê Cost Comparison:');
  console.log('\n=9 Short Captions (37 chars):');
  console.log(`   Total cost: $${shortCost.totalCost.toFixed(4)}`);
  console.log(`   Cost per video: $${shortCost.costPerVideo.toFixed(4)}`);

  console.log('\n=9 Long Captions (349 chars):');
  console.log(`   Total cost: $${longCost.totalCost.toFixed(4)}`);
  console.log(`   Cost per video: $${longCost.costPerVideo.toFixed(4)}`);

  const savings = longCost.totalCost - shortCost.totalCost;
  const percentSavings = ((savings / longCost.totalCost) * 100).toFixed(1);

  console.log('\n=¡ Optimization Insights:');
  console.log(`   Savings with short captions: $${savings.toFixed(4)} (${percentSavings}%)`);
  console.log(`   Character reduction: ${((1 - 37 / 349) * 100).toFixed(1)}%`);
  console.log('\n( Tip: Optimize captions for TikTok\'s short-form format to reduce costs!');
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('\n' + '='.repeat(70));
  console.log('<¬ TikTok Multilingual Batch Renderer - Examples');
  console.log('='.repeat(70));

  try {
    // Example 1: Basic batch
    // await exampleBasicBatch();

    // Example 2: Advanced styling
    // await exampleAdvancedBatch();

    // Example 3: Error handling
    // await exampleErrorHandling();

    // Example 4: Large scale
    // await exampleLargeScaleBatch();

    // Example 5: Cost optimization
    await exampleCostOptimization();

    console.log('\n' + '='.repeat(70));
    console.log(' All examples completed successfully!');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    console.error('\nL Example failed:', error);
    process.exit(1);
  }
}

/**
 * Usage instructions
 */
function printUsage() {
  console.log(`
TikTok Multilingual Batch Renderer - Usage Examples

Prerequisites:
  - Set GOOGLE_CLOUD_API_KEY environment variable (for translation)
  - Set ELEVEN_LABS_API_KEY environment variable (for voice cloning)
  - Set OPENAI_API_KEY environment variable (for Whisper transcription)
  - Install FFmpeg (for video processing)

Example 1: Basic Batch
  - Renders 2 moments × 3 languages = 6 videos
  - Default CTA and caption styling
  - Cost estimation before rendering

Example 2: Advanced Batch
  - Custom caption styling (colors, position, outline)
  - Custom CTA configuration
  - Multiple languages (6 languages)

Example 3: Error Handling
  - Demonstrates graceful error handling
  - Shows how batch continues despite errors
  - Collects error reports

Example 4: Large Scale Batch
  - 5 moments × 10 languages = 50 videos
  - Performance metrics and throughput analysis
  - Cost and time estimates

Example 5: Cost Optimization
  - Compares short vs long captions
  - Shows cost savings strategies
  - Optimization recommendations

To run examples:
  tsx batch-renderer.example.ts
  `);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  // Uncomment to run examples
  // runAllExamples();

  // Print usage by default
  printUsage();
}

export {
  exampleBasicBatch,
  exampleAdvancedBatch,
  exampleErrorHandling,
  exampleLargeScaleBatch,
  exampleCostOptimization,
};
