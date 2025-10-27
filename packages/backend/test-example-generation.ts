#!/usr/bin/env tsx
/**
 * Test Layer 2: Example Generation with Visual Assets
 *
 * Tests:
 * - Gemini image generation (problem background)
 * - Manim animation generation (solution)
 * - Video rendering with Remotion
 * - Scene type correctness
 */

import { ClaudeService } from './src/services/claude.js';
import { ExamplesGenerator } from './src/services/examples-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testExampleGeneration() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   Layer 2: Example Generation with Visuals       ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  // Check environment
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ ANTHROPIC_API_KEY not found');
    process.exit(1);
  }
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found');
    process.exit(1);
  }

  console.log('✅ Environment variables loaded');
  console.log(`✅ Anthropic API Key: ${process.env.ANTHROPIC_API_KEY.substring(0, 10)}...`);
  console.log(`✅ Gemini API Key: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  console.log('');

  const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY);
  const generator = new ExamplesGenerator(claudeService);

  console.log('[Test Configuration]');
  console.log('  Topic: Sets');
  console.log('  Level: Core');
  console.log('  Target Count: 1 example (for testing)');
  console.log('  Theme: education-dark\n');

  console.log('[Starting Generation...]\n');

  const startTime = Date.now();

  try {
    const result = await generator.generateExamples({
      topicTitle: 'Sets',
      topicCode: 'C1.2',
      level: 'Core',
      concepts: ['Set notation', 'Union', 'Intersection'],
      targetCount: 1,  // Just 1 example for testing
      theme: 'education-dark',
      outputDir: 'output/test-examples'
    });

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║   Test Results                                    ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    console.log(`Success: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Examples Generated: ${result.examples.length}`);
    console.log(`Total Duration: ${result.totalDuration} seconds`);
    console.log(`Total Cost: $${result.totalCost.toFixed(2)}`);
    console.log(`Execution Time: ${executionTime}s\n`);

    if (result.success && result.examples.length > 0) {
      result.examples.forEach((ex, i) => {
        console.log(`\nExample ${i + 1}:`);
        console.log(`  ID: ${ex.id}`);
        console.log(`  Problem: ${ex.problem}`);
        console.log(`  Video: ${ex.videoPath}`);
        console.log(`  Duration: ${ex.duration} seconds`);
        console.log(`  Cost: $${ex.cost.toFixed(2)}`);
      });

      console.log('\n[Validation Checklist]');
      console.log('  [ ] Gemini image exists (output/test-examples/visuals/*.png)');
      console.log('  [ ] NO TEXT in Gemini image (visual inspection required)');
      console.log('  [ ] Manim animation exists (media/videos/*/Solution_*.mp4)');
      console.log('  [ ] Final video exists (output/test-examples/examples/example-1.mp4)');
      console.log('  [ ] Video plays correctly');
      console.log('  [ ] Cost < $1.00\n');

      console.log('[Next Steps]');
      console.log('  1. Check files:');
      console.log('     ls -lh output/test-examples/examples/');
      console.log('     ls -lh output/test-examples/visuals/\n');
      console.log('  2. Inspect Gemini image for text:');
      console.log('     open output/test-examples/visuals/*.png\n');
      console.log('  3. Play video:');
      console.log('     vlc output/test-examples/examples/example-1.mp4\n');

      process.exit(0);
    } else {
      console.error('\n❌ Test failed:', result.error || 'No examples generated');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Test crashed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test
testExampleGeneration();
