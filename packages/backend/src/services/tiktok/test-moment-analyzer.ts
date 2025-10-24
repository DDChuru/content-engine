/**
 * Test Script for Moment Analyzer
 *
 * Run with: npm run dev src/services/tiktok/test-moment-analyzer.ts
 */

import { MomentAnalyzer } from './moment-analyzer.js';
import type { ExtractionConfig } from './types.js';
import * as path from 'path';

async function testMomentAnalyzer() {
  console.log('=== TikTok Moment Analyzer Test ===\n');

  // Check environment variables
  if (!process.env.OPENAI_API_KEY) {
    console.error('ERROR: OPENAI_API_KEY not set in environment');
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ERROR: ANTHROPIC_API_KEY not set in environment');
    process.exit(1);
  }

  // Initialize analyzer
  console.log('Initializing MomentAnalyzer...');
  const analyzer = new MomentAnalyzer(
    process.env.OPENAI_API_KEY,
    process.env.ANTHROPIC_API_KEY
  );
  console.log('✓ Analyzer initialized\n');

  // Get video path from command line or use default
  const videoPath = process.argv[2];

  if (!videoPath) {
    console.error('ERROR: Please provide a video path as argument');
    console.error('Usage: npm run dev src/services/tiktok/test-moment-analyzer.ts /path/to/video.mp4');
    process.exit(1);
  }

  console.log(`Video: ${videoPath}`);
  console.log('Starting analysis...\n');

  try {
    // Configure analysis
    const config: ExtractionConfig = {
      videoPath,
      count: 10,           // Find 10 best moments
      duration: 60,        // Each moment ~60 seconds
      frameInterval: 3,    // Sample every 3 seconds (faster for testing)
      criteria: {
        hookDuration: 3,
        minViralScore: 6,
        requiresSelfContained: true,
        emotionalEngagement: true
      }
    };

    // Run analysis
    const startTime = Date.now();
    const result = await analyzer.findBestMoments(config);
    const elapsed = (Date.now() - startTime) / 1000;

    // Display results
    console.log('=== Analysis Complete ===\n');
    console.log(`Processing Time: ${elapsed.toFixed(2)}s`);
    console.log(`Video Duration: ${result.totalDuration.toFixed(2)}s`);
    console.log(`Frames Analyzed: ${result.framesAnalyzed}`);
    console.log(`Transcript Length: ${result.transcriptLength} characters`);
    console.log(`Moments Found: ${result.moments.length}\n`);

    if (result.moments.length === 0) {
      console.log('No moments met the criteria.');
      return;
    }

    // Display each moment
    console.log('=== Viral Moments ===\n');
    result.moments.forEach((moment, index) => {
      console.log(`${index + 1}. Moment #${moment.index}`);
      console.log(`   Time: ${formatTime(moment.startTime)} - ${formatTime(moment.endTime)} (${moment.duration}s)`);
      console.log(`   Viral Score: ${moment.viralPotential}/10 ${'⭐'.repeat(moment.viralPotential)}`);
      console.log(`   Hook: ${moment.hook}`);
      console.log(`   Message: ${moment.keyMessage}`);
      console.log(`   Caption: ${moment.caption}`);
      console.log('');
    });

    // Show top 3 moments
    const topMoments = analyzer.sortByViralPotential(result.moments).slice(0, 3);
    console.log('=== Top 3 Moments by Viral Potential ===\n');
    topMoments.forEach((moment, index) => {
      console.log(`${index + 1}. Moment #${moment.index} - Score: ${moment.viralPotential}/10`);
      console.log(`   "${moment.hook}"`);
      console.log(`   Time: ${formatTime(moment.startTime)} - ${formatTime(moment.endTime)}`);
      console.log('');
    });

    // Ask if user wants to extract clips
    console.log('To extract clips, run:');
    console.log('  npm run dev src/services/tiktok/test-moment-analyzer.ts [video] --extract\n');

    // Check for --extract flag
    if (process.argv.includes('--extract')) {
      console.log('Extracting top 3 clips...\n');

      const outputDir = './output/tiktok-moments';
      const clipPaths = await analyzer.extractClips(
        videoPath,
        topMoments,
        outputDir,
        {
          codec: 'libx264',
          videoBitrate: '2500k',
          audioBitrate: '192k'
        }
      );

      console.log('Clips extracted:');
      clipPaths.forEach((clipPath, index) => {
        console.log(`  ${index + 1}. ${clipPath}`);
      });

      console.log(`\nClips saved to: ${outputDir}`);
    }

    // Summary statistics
    console.log('=== Summary Statistics ===');
    console.log(`Average Viral Score: ${(result.moments.reduce((sum, m) => sum + m.viralPotential, 0) / result.moments.length).toFixed(2)}/10`);
    console.log(`Highly Viral (8+): ${analyzer.filterByViralScore(result.moments, 8).length}`);
    console.log(`Good Potential (7+): ${analyzer.filterByViralScore(result.moments, 7).length}`);
    console.log(`Processing Speed: ${(result.totalDuration / elapsed).toFixed(2)}x realtime`);

  } catch (error: any) {
    console.error('\n=== Error ===');
    console.error(error.message);

    // Provide helpful debugging info
    if (error.message.includes('FFmpeg')) {
      console.error('\nFFmpeg Error - Make sure FFmpeg is installed:');
      console.error('  Ubuntu/Debian: sudo apt-get install ffmpeg');
      console.error('  macOS: brew install ffmpeg');
    } else if (error.message.includes('OpenAI')) {
      console.error('\nOpenAI API Error - Check your API key and quota');
    } else if (error.message.includes('Claude')) {
      console.error('\nClaude API Error - Check your API key and quota');
    }

    process.exit(1);
  }
}

/**
 * Format seconds as MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Run test
testMomentAnalyzer()
  .then(() => {
    console.log('\n✓ Test completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  });
