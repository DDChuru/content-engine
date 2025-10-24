/**
 * Test Veo 3.1 Video Extension
 *
 * This script demonstrates video extension capabilities:
 * - Generate initial 8-second video
 * - Extend by 7 seconds per iteration
 * - Test multiple iterations
 * - Display cost breakdown
 */

import 'dotenv/config';
import { VeoVideoGenerator } from './src/services/tiktok/veo-video-generator.js';
import { promises as fs } from 'fs';
import path from 'path';

async function test() {
  console.log('🎬 Testing Veo 3.1 Video Extension\n');

  const veo = new VeoVideoGenerator(undefined, undefined, '3.1');

  // Step 1: Generate initial 8-second video
  console.log('═══════════════════════════════════════════════════════');
  console.log('STEP 1: Generate Initial 8-Second Video');
  console.log('═══════════════════════════════════════════════════════\n');

  const initialPrompt = 'Aerial view of Victoria Falls in Zimbabwe, with mist and rainbow';
  console.log(`Prompt: "${initialPrompt}"`);
  console.log('Duration: 8 seconds (max for initial generation)\n');

  const initialResult = await veo.generateVideo({
    prompt: initialPrompt,
    duration: 8,
    aspectRatio: '9:16',
    modelVersion: '3.1',
  });

  console.log('✅ Initial video generated!');
  console.log(`📊 Size: ${(initialResult.videoBuffer!.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱️  Generation time: ${(initialResult.generationTime / 1000).toFixed(2)}s`);
  console.log(`💰 Cost: $${initialResult.cost.toFixed(4)}\n`);

  // Save initial video
  const outputDir = path.join(process.cwd(), 'output');
  await fs.mkdir(outputDir, { recursive: true });

  const initialFilename = `veo-initial-8s-${Date.now()}.mp4`;
  const initialFilepath = path.join(outputDir, initialFilename);
  await fs.writeFile(initialFilepath, initialResult.videoBuffer!);
  console.log(`💾 Saved initial video: ${initialFilepath}\n`);

  // Step 2: Extend video by 7 seconds (1 iteration)
  console.log('═══════════════════════════════════════════════════════');
  console.log('STEP 2: Extend by 7 Seconds (1 iteration)');
  console.log('═══════════════════════════════════════════════════════\n');

  const extensionPrompt = 'Continue showing Victoria Falls with closer view of the waterfall cascading down';
  console.log(`Extension prompt: "${extensionPrompt}"`);
  console.log('Iterations: 1 (adds 7 seconds)\n');

  const extension1Result = await veo.extendVideo({
    videoBuffer: initialResult.videoBuffer,
    prompt: extensionPrompt,
    extensionDuration: 7,
    iterations: 1,
  });

  console.log('✅ Video extended (1 iteration)!');
  console.log(`📏 Original: ${extension1Result.originalDuration}s → Extended: ${extension1Result.totalDuration}s`);
  console.log(`➕ Added: ${extension1Result.extensionDuration}s`);
  console.log(`📊 Size: ${(extension1Result.videoBuffer!.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱️  Generation time: ${(extension1Result.generationTime / 1000).toFixed(2)}s`);
  console.log(`💰 Cost: $${extension1Result.cost.toFixed(4)}\n`);

  // Save extended video (1 iteration)
  const extended1Filename = `veo-extended-15s-${Date.now()}.mp4`;
  const extended1Filepath = path.join(outputDir, extended1Filename);
  await fs.writeFile(extended1Filepath, extension1Result.videoBuffer!);
  console.log(`💾 Saved extended video (1 iteration): ${extended1Filepath}\n`);

  // Step 3: Extend further with multiple iterations (3 iterations)
  console.log('═══════════════════════════════════════════════════════');
  console.log('STEP 3: Extend with Multiple Iterations (3 total)');
  console.log('═══════════════════════════════════════════════════════\n');

  const multiExtensionPrompt = 'Show the surrounding landscape and wildlife near Victoria Falls';
  console.log(`Extension prompt: "${multiExtensionPrompt}"`);
  console.log('Iterations: 3 (adds 21 seconds total)\n');

  const extension3Result = await veo.extendVideo({
    videoBuffer: initialResult.videoBuffer,
    prompt: multiExtensionPrompt,
    extensionDuration: 7,
    iterations: 3,
  });

  console.log('✅ Video extended (3 iterations)!');
  console.log(`📏 Original: ${extension3Result.originalDuration}s → Extended: ${extension3Result.totalDuration}s`);
  console.log(`➕ Added: ${extension3Result.extensionDuration}s (${extension3Result.iterations} iterations × 7s)`);
  console.log(`📊 Size: ${(extension3Result.videoBuffer!.length / 1024 / 1024).toFixed(2)} MB`);
  console.log(`⏱️  Generation time: ${(extension3Result.generationTime / 1000).toFixed(2)}s`);
  console.log(`💰 Cost: $${extension3Result.cost.toFixed(4)}\n`);

  // Save extended video (3 iterations)
  const extended3Filename = `veo-extended-29s-${Date.now()}.mp4`;
  const extended3Filepath = path.join(outputDir, extended3Filename);
  await fs.writeFile(extended3Filepath, extension3Result.videoBuffer!);
  console.log(`💾 Saved extended video (3 iterations): ${extended3Filepath}\n`);

  // Summary
  console.log('═══════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════════════════════\n');

  const totalCost = initialResult.cost + extension1Result.cost + extension3Result.cost;
  const totalTime = (initialResult.generationTime + extension1Result.generationTime + extension3Result.generationTime) / 1000;

  console.log('Videos Generated:');
  console.log(`  1. Initial: 8s → ${initialFilepath}`);
  console.log(`  2. Extended (1 iter): 15s → ${extended1Filepath}`);
  console.log(`  3. Extended (3 iter): 29s → ${extended3Filepath}\n`);

  console.log('Cost Breakdown:');
  console.log(`  Initial 8s video: $${initialResult.cost.toFixed(4)}`);
  console.log(`  1 iteration (+7s): $${extension1Result.cost.toFixed(4)}`);
  console.log(`  3 iterations (+21s): $${extension3Result.cost.toFixed(4)}`);
  console.log(`  ─────────────────────────────────`);
  console.log(`  Total: $${totalCost.toFixed(4)}\n`);

  console.log(`⏱️  Total generation time: ${totalTime.toFixed(2)}s`);
  console.log(`\n✨ Extension test complete!`);
  console.log(`\n💡 Extension limits:`);
  console.log(`   - Max iterations: 20`);
  console.log(`   - Max total duration: ~148 seconds (8 + 20×7)`);
  console.log(`   - Cost per extension: ~$0.20/second`);
}

test().catch(error => {
  console.error('\n❌ Error:', error.message);
  if (error.stack) {
    console.error('\nStack trace:', error.stack);
  }
});
