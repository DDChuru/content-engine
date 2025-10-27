#!/usr/bin/env tsx
/**
 * Test Layer 1: Main Content Generation with Visual Assets
 *
 * Tests:
 * - Mixed visual types (Manim + Gemini + SVG)
 * - NO TEXT enforcement in Gemini
 * - Video composition with multiple scenes
 * - Scene transitions
 */

import { ClaudeService } from './src/services/claude.js';
import { TopicContentGenerator } from './src/services/topic-content-generator.js';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function testMainContentGeneration() {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║   Layer 1: Main Content with Visuals             ║');
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

  console.log('✅ Environment variables loaded\n');

  const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY);
  const generator = new TopicContentGenerator(claudeService);

  const topic = {
    syllabusId: 'test',
    unitId: 'test-unit',
    topicId: 'test-sets',
    topicCode: 'C1.2',
    title: 'Sets',
    level: 'Core' as const,
    subtopics: ['Set notation', 'Union', 'Intersection']
  };

  console.log('[Test Configuration]');
  console.log('  Topic:', topic.title);
  console.log('  Code:', topic.topicCode);
  console.log('  Level:', topic.level);
  console.log('  Theme: education-dark\n');

  console.log('[Starting Generation...]\n');

  const startTime = Date.now();

  try {
    const result = await generator.generateMainContent(topic, {
      voiceId: process.env.DEFAULT_VOICE_ID,
      theme: 'education-dark',
      includeLayers: {
        mainContent: true,
        examples: false,
        exercises: false
      }
    });

    const executionTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║   Test Results                                    ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    console.log(`Success: ${result.success ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Video Path: ${result.videoPath}`);
    console.log(`Concepts: ${result.concepts.length}`);
    console.log(`Duration: ${result.duration} seconds`);
    console.log(`Cost: $${result.cost.toFixed(2)}`);
    console.log(`Execution Time: ${executionTime}s\n`);

    if (result.success) {
      console.log('[Concepts Generated]');
      result.concepts.forEach((concept, i) => {
        console.log(`\n  ${i + 1}. ${concept.title}`);
        console.log(`     Visual Type: ${concept.visualType}`);
        console.log(`     Duration: ${concept.duration}s`);
      });

      console.log('\n[Validation Checklist]');
      console.log('  [ ] Mixed visual types (Manim + Gemini)');
      console.log('  [ ] NO TEXT in Gemini images');
      console.log('  [ ] Correct scene types in video');
      console.log('  [ ] Video plays smoothly');
      console.log('  [ ] Transitions work');
      console.log('  [ ] Cost ~$1.06\n');

      console.log('[Next Steps]');
      console.log('  1. Check files:');
      console.log('     ls -lh output/topics/test-sets/main-content/');
      console.log('     ls -lh output/topics/test-sets/visuals/\n');
      console.log('  2. Inspect Gemini images for NO TEXT:');
      console.log('     open output/topics/test-sets/visuals/*.png\n');
      console.log('  3. Play video:');
      console.log('     vlc output/topics/test-sets/main-content/test-sets-lesson.mp4\n');

      process.exit(0);
    } else {
      console.error('\n❌ Test failed');
      process.exit(1);
    }

  } catch (error: any) {
    console.error('\n❌ Test crashed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test
testMainContentGeneration();
