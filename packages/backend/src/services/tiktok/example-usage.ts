/**
 * Example Usage: Moment Analyzer
 *
 * This file demonstrates how to use the MomentAnalyzer service
 * to find viral moments in long-form videos.
 */

import { MomentAnalyzer } from './moment-analyzer.js';
import type { ExtractionConfig } from './types.js';
import * as path from 'path';

/**
 * Example 1: Basic Usage - Find 10 best moments
 */
async function example1_basicUsage() {
  console.log('=== Example 1: Basic Usage ===\n');

  // Initialize the analyzer with API keys
  const analyzer = new MomentAnalyzer(
    process.env.OPENAI_API_KEY!,
    process.env.ANTHROPIC_API_KEY!
  );

  // Configure the extraction
  const config: ExtractionConfig = {
    videoPath: '/path/to/your/long-video.mp4',
    count: 10, // Find 10 best moments
    duration: 60, // Each moment should be ~60 seconds
    frameInterval: 2 // Extract frame every 2 seconds
  };

  try {
    // Find the best moments
    const result = await analyzer.findBestMoments(config);

    console.log(`Analysis Complete!`);
    console.log(`Total Duration: ${result.totalDuration}s`);
    console.log(`Frames Analyzed: ${result.framesAnalyzed}`);
    console.log(`Processing Time: ${(result.processingTime / 1000).toFixed(2)}s`);
    console.log(`\nFound ${result.moments.length} viral moments:\n`);

    // Display each moment
    result.moments.forEach(moment => {
      console.log(`Moment #${moment.index}`);
      console.log(`  Time: ${moment.startTime}s - ${moment.endTime}s (${moment.duration}s)`);
      console.log(`  Viral Score: ${moment.viralPotential}/10`);
      console.log(`  Hook: ${moment.hook}`);
      console.log(`  Message: ${moment.keyMessage}`);
      console.log(`  Caption: ${moment.caption}`);
      console.log('');
    });

    return result;
  } catch (error) {
    console.error('Error analyzing video:', error);
    throw error;
  }
}

/**
 * Example 2: Advanced Usage - Custom criteria and clip extraction
 */
async function example2_advancedUsage() {
  console.log('=== Example 2: Advanced Usage ===\n');

  const analyzer = new MomentAnalyzer(
    process.env.OPENAI_API_KEY!,
    process.env.ANTHROPIC_API_KEY!
  );

  // Custom analysis criteria
  const config: ExtractionConfig = {
    videoPath: '/path/to/your/long-video.mp4',
    count: 5, // Find top 5 moments
    duration: 45, // Shorter TikToks (45 seconds)
    frameInterval: 3, // Sample less frequently for faster processing
    criteria: {
      hookDuration: 2, // Hook must happen in first 2 seconds
      minViralScore: 7, // Only high-potential moments (7+)
      requiresSelfContained: true,
      emotionalEngagement: true
    }
  };

  try {
    // Find moments
    const result = await analyzer.findBestMoments(config);

    console.log(`Found ${result.moments.length} high-potential moments\n`);

    // Sort by viral potential (highest first)
    const topMoments = analyzer.sortByViralPotential(result.moments);

    console.log('Top 3 moments by viral potential:');
    topMoments.slice(0, 3).forEach((moment, index) => {
      console.log(`${index + 1}. Moment #${moment.index} - Score: ${moment.viralPotential}/10`);
      console.log(`   "${moment.hook}"`);
      console.log('');
    });

    // Extract clips for the top 3 moments
    const outputDir = './tiktok-clips';
    console.log(`\nExtracting top 3 clips to ${outputDir}...`);

    const clipPaths = await analyzer.extractClips(
      config.videoPath,
      topMoments.slice(0, 3),
      outputDir,
      {
        codec: 'libx264',
        videoBitrate: '2500k',
        audioBitrate: '192k'
      }
    );

    console.log('Clips extracted:');
    clipPaths.forEach((path, index) => {
      console.log(`  ${index + 1}. ${path}`);
    });

    return { result, clipPaths };
  } catch (error) {
    console.error('Error in advanced analysis:', error);
    throw error;
  }
}

/**
 * Example 3: Extract single moment
 */
async function example3_extractSingleMoment() {
  console.log('=== Example 3: Extract Single Moment ===\n');

  const analyzer = new MomentAnalyzer(
    process.env.OPENAI_API_KEY!,
    process.env.ANTHROPIC_API_KEY!
  );

  const config: ExtractionConfig = {
    videoPath: '/path/to/your/long-video.mp4',
    count: 10,
    duration: 60
  };

  try {
    // Find all moments
    const result = await analyzer.findBestMoments(config);

    // Get the highest-scoring moment
    const topMoments = analyzer.sortByViralPotential(result.moments);
    const bestMoment = topMoments[0];

    console.log('Best Moment Found:');
    console.log(`  Viral Score: ${bestMoment.viralPotential}/10`);
    console.log(`  Hook: ${bestMoment.hook}`);
    console.log(`  Caption: ${bestMoment.caption}`);
    console.log('');

    // Extract just this one clip
    const outputPath = './best-tiktok-moment.mp4';
    console.log(`Extracting clip to ${outputPath}...`);

    await analyzer.extractClip(
      config.videoPath,
      bestMoment,
      {
        outputPath,
        format: 'mp4',
        codec: 'libx264',
        videoBitrate: '3000k', // High quality
        audioBitrate: '192k'
      }
    );

    console.log('Clip extracted successfully!');
    console.log(`\nReady to upload to TikTok with caption:`);
    console.log(`"${bestMoment.caption}"`);

    return { moment: bestMoment, path: outputPath };
  } catch (error) {
    console.error('Error extracting single moment:', error);
    throw error;
  }
}

/**
 * Example 4: Filter and process only high-potential moments
 */
async function example4_filterHighPotential() {
  console.log('=== Example 4: Filter High-Potential Moments ===\n');

  const analyzer = new MomentAnalyzer(
    process.env.OPENAI_API_KEY!,
    process.env.ANTHROPIC_API_KEY!
  );

  const config: ExtractionConfig = {
    videoPath: '/path/to/your/long-video.mp4',
    count: 15, // Analyze more moments
    duration: 60,
    criteria: {
      minViralScore: 5 // Lower threshold for initial analysis
    }
  };

  try {
    const result = await analyzer.findBestMoments(config);

    console.log(`Total moments found: ${result.moments.length}`);

    // Filter for only extremely high potential (8+)
    const viralMoments = analyzer.filterByViralScore(result.moments, 8);

    console.log(`High-viral moments (8+): ${viralMoments.length}\n`);

    if (viralMoments.length > 0) {
      console.log('Extremely Viral Moments:');
      viralMoments.forEach(moment => {
        console.log(`\nMoment #${moment.index} - Score: ${moment.viralPotential}/10`);
        console.log(`  Time: ${moment.startTime}s - ${moment.endTime}s`);
        console.log(`  Hook: ${moment.hook}`);
        console.log(`  Message: ${moment.keyMessage}`);
        console.log(`  Caption: ${moment.caption}`);
      });

      // Extract only the viral moments
      const outputDir = './viral-clips';
      const clipPaths = await analyzer.extractClips(
        config.videoPath,
        viralMoments,
        outputDir
      );

      console.log(`\nExtracted ${clipPaths.length} viral clips to ${outputDir}`);
    } else {
      console.log('No moments met the 8+ viral score threshold.');
    }

    return { allMoments: result.moments, viralMoments };
  } catch (error) {
    console.error('Error filtering moments:', error);
    throw error;
  }
}

/**
 * Example 5: Batch processing multiple videos
 */
async function example5_batchProcessing() {
  console.log('=== Example 5: Batch Processing ===\n');

  const analyzer = new MomentAnalyzer(
    process.env.OPENAI_API_KEY!,
    process.env.ANTHROPIC_API_KEY!
  );

  const videos = [
    '/path/to/video1.mp4',
    '/path/to/video2.mp4',
    '/path/to/video3.mp4'
  ];

  const allResults = [];

  for (let i = 0; i < videos.length; i++) {
    console.log(`\nProcessing video ${i + 1}/${videos.length}: ${path.basename(videos[i])}`);

    const config: ExtractionConfig = {
      videoPath: videos[i],
      count: 5,
      duration: 60,
      criteria: {
        minViralScore: 7
      }
    };

    try {
      const result = await analyzer.findBestMoments(config);
      console.log(`  Found ${result.moments.length} viral moments`);
      console.log(`  Processing time: ${(result.processingTime / 1000).toFixed(2)}s`);

      allResults.push({
        video: videos[i],
        result
      });
    } catch (error) {
      console.error(`  Error processing ${videos[i]}:`, error);
    }
  }

  // Summary
  console.log('\n=== Batch Processing Summary ===');
  console.log(`Videos processed: ${allResults.length}`);
  const totalMoments = allResults.reduce((sum, r) => sum + r.result.moments.length, 0);
  console.log(`Total moments found: ${totalMoments}`);

  // Find the single best moment across all videos
  const allMoments = allResults.flatMap(r =>
    r.result.moments.map(m => ({ ...m, sourceVideo: r.video }))
  );
  const sorted = allMoments.sort((a, b) => b.viralPotential - a.viralPotential);

  if (sorted.length > 0) {
    const best = sorted[0];
    console.log(`\nBest moment overall:`);
    console.log(`  Video: ${path.basename(best.sourceVideo)}`);
    console.log(`  Score: ${best.viralPotential}/10`);
    console.log(`  Hook: ${best.hook}`);
  }

  return allResults;
}

// Export all examples
export {
  example1_basicUsage,
  example2_advancedUsage,
  example3_extractSingleMoment,
  example4_filterHighPotential,
  example5_batchProcessing
};

/**
 * Run example if executed directly
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleNumber = process.argv[2] || '1';

  const examples: Record<string, () => Promise<any>> = {
    '1': example1_basicUsage,
    '2': example2_advancedUsage,
    '3': example3_extractSingleMoment,
    '4': example4_filterHighPotential,
    '5': example5_batchProcessing
  };

  const exampleFn = examples[exampleNumber];

  if (exampleFn) {
    exampleFn()
      .then(() => {
        console.log('\nExample completed successfully!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('\nExample failed:', error);
        process.exit(1);
      });
  } else {
    console.error(`Unknown example: ${exampleNumber}`);
    console.log('Available examples: 1, 2, 3, 4, 5');
    process.exit(1);
  }
}
