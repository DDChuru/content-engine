#!/usr/bin/env node
/**
 * Batch Generate All IGCSE Mathematics Lessons
 *
 * Generates complete lessons for all 99 topics in the 0580 syllabus
 *
 * Usage:
 *   npx tsx src/education/batch-generate.ts                    # Generate all
 *   npx tsx src/education/batch-generate.ts --core             # Core only (47 topics)
 *   npx tsx src/education/batch-generate.ts --extended         # Extended only (52 topics)
 *   npx tsx src/education/batch-generate.ts --unit=C1          # Specific unit
 *   npx tsx src/education/batch-generate.ts --resume           # Resume from last
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { generateLesson, SyllabusTopic } from './lesson-generator.js';
import { LessonGenerationRequest, VisualStyle } from './lesson-schema.js';

interface GenerationStatus {
  completed: string[];
  failed: string[];
  pending: string[];
  lastUpdated: string;
  totalCost: number;
  totalDuration: number;
}

const STATUS_FILE = path.join(__dirname, '../../output/lessons/generation-status.json');

async function loadSyllabus() {
  const syllabusPath = path.join(__dirname, '../../data/maths-0580-syllabus-complete.json');
  const data = await fs.readFile(syllabusPath, 'utf-8');
  return JSON.parse(data);
}

async function loadStatus(): Promise<GenerationStatus> {
  try {
    const data = await fs.readFile(STATUS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      completed: [],
      failed: [],
      pending: [],
      lastUpdated: new Date().toISOString(),
      totalCost: 0,
      totalDuration: 0,
    };
  }
}

async function saveStatus(status: GenerationStatus): Promise<void> {
  status.lastUpdated = new Date().toISOString();
  await fs.writeFile(STATUS_FILE, JSON.stringify(status, null, 2));
}

function getAllTopics(syllabus: any, filter?: 'core' | 'extended' | string): SyllabusTopic[] {
  const topics: SyllabusTopic[] = [];

  // Core topics
  if (!filter || filter === 'core' || filter.startsWith('C')) {
    for (const unit of syllabus.topics) {
      if (filter?.startsWith('C') && unit.code !== filter) continue;
      for (const subtopic of unit.subtopics) {
        topics.push({
          code: subtopic.code,
          title: subtopic.title,
          content: subtopic.content || [],
          examples: subtopic.examples,
          notes: subtopic.notes,
          notation: subtopic.notation,
          required: subtopic.required,
          properties: subtopic.properties,
          level: 'Core',
        });
      }
    }
  }

  // Extended topics
  if (!filter || filter === 'extended' || filter.startsWith('E')) {
    for (const unit of syllabus.extendedTopics) {
      if (filter?.startsWith('E') && unit.code !== filter) continue;
      for (const subtopic of unit.subtopics) {
        topics.push({
          code: subtopic.code,
          title: subtopic.title,
          content: subtopic.content || [],
          examples: subtopic.examples,
          notes: subtopic.notes,
          notation: subtopic.notation,
          required: subtopic.required,
          properties: subtopic.properties,
          level: 'Extended',
        });
      }
    }
  }

  return topics;
}

function selectStyle(topic: SyllabusTopic): VisualStyle {
  const code = topic.code.toLowerCase();
  const title = topic.title.toLowerCase();

  // Geometry → Blueprint
  if (code.includes('4') || title.includes('geometry') || title.includes('angle')) {
    return 'blueprint';
  }
  // Circle theorems → Shape morphing
  if (title.includes('circle') || title.includes('theorem')) {
    return 'shape-morphing';
  }
  // Algebra → Minimal
  if (code.includes('2') || title.includes('algebra') || title.includes('graph')) {
    return 'minimal-line-art';
  }
  // Transformations → Shape morphing
  if (title.includes('transform') || title.includes('vector')) {
    return 'shape-morphing';
  }
  // Statistics → Chalkboard
  if (code.includes('9') || title.includes('statistic')) {
    return 'chalkboard';
  }
  // Default for engagement
  return 'neon-glow';
}

async function main() {
  const args = process.argv.slice(2);

  const coreOnly = args.includes('--core');
  const extendedOnly = args.includes('--extended');
  const unitArg = args.find((a) => a.startsWith('--unit='));
  const resume = args.includes('--resume');
  const dryRun = args.includes('--dry-run');

  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║        IGCSE Mathematics - Batch Lesson Generator                     ║
║                                                                       ║
║  Generating complete lessons for Cambridge IGCSE Mathematics 0580     ║
╚══════════════════════════════════════════════════════════════════════╝
  `);

  // Load syllabus and status
  console.log('📖 Loading syllabus...');
  const syllabus = await loadSyllabus();
  const status = await loadStatus();

  // Determine filter
  let filter: 'core' | 'extended' | string | undefined;
  if (coreOnly) filter = 'core';
  if (extendedOnly) filter = 'extended';
  if (unitArg) filter = unitArg.split('=')[1];

  // Get topics to generate
  let topics = getAllTopics(syllabus, filter);

  // Filter out completed if resuming
  if (resume) {
    topics = topics.filter((t) => !status.completed.includes(t.code));
    console.log(`📋 Resuming... ${status.completed.length} already complete`);
  }

  console.log(`\n📚 Topics to generate: ${topics.length}`);
  console.log(`   Filter: ${filter || 'all'}`);
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'GENERATE'}\n`);

  if (dryRun) {
    console.log('Topics that would be generated:\n');
    for (const topic of topics) {
      const style = selectStyle(topic);
      console.log(`  ${topic.code} - ${topic.title} (${topic.level}) [${style}]`);
    }
    console.log(`\nTotal: ${topics.length} topics`);
    console.log(`Estimated time: ${(topics.length * 4.5).toFixed(0)} minutes`);
    console.log(`Estimated cost: ~$${(topics.length * 0.15).toFixed(2)} (Claude API)`);
    return;
  }

  // Ensure output directory exists
  const outputDir = path.join(__dirname, '../../output/lessons');
  await fs.mkdir(outputDir, { recursive: true });

  // Generate lessons
  let generated = 0;
  let failed = 0;

  for (const topic of topics) {
    const startTime = Date.now();

    console.log(`\n${'='.repeat(70)}`);
    console.log(`[${generated + failed + 1}/${topics.length}] Generating: ${topic.code} - ${topic.title}`);
    console.log(`${'='.repeat(70)}`);

    try {
      const request: LessonGenerationRequest = {
        syllabusCode: topic.code,
        level: topic.level,
        preferredStyle: selectStyle(topic),
        includeVideo: false,
        includeInteractive: true,
        exampleCount: 6,
        practiceCount: 10,
        generateNarration: false,
        useGeminiDiagrams: true,
        useManimAnimations: true,
        useSvgAnimations: true,
      };

      const lesson = await generateLesson(topic, request);

      // Save lesson
      const outputPath = path.join(outputDir, `${lesson.id}.json`);
      await fs.writeFile(outputPath, JSON.stringify(lesson, null, 2));

      const duration = (Date.now() - startTime) / 1000;
      status.completed.push(topic.code);
      status.totalDuration += duration;
      generated++;

      console.log(`✅ Complete in ${duration.toFixed(1)}s - Saved to ${lesson.id}.json`);

    } catch (error: any) {
      console.error(`❌ Failed: ${error.message}`);
      status.failed.push(topic.code);
      failed++;
    }

    // Save status after each lesson
    await saveStatus(status);

    // Rate limiting - wait 2 seconds between lessons
    if (generated + failed < topics.length) {
      console.log('   ⏳ Waiting 2s before next lesson...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  // Final summary
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                     BATCH GENERATION COMPLETE                         ║
╚══════════════════════════════════════════════════════════════════════╝

  📊 Results:
     ✅ Generated: ${generated}
     ❌ Failed: ${failed}
     📄 Total: ${status.completed.length} lessons

  ⏱️  Total time: ${(status.totalDuration / 60).toFixed(1)} minutes

  📁 Output: ${outputDir}

  ${failed > 0 ? `\n⚠️  Failed topics: ${status.failed.join(', ')}` : ''}

  Next steps:
     1. Review generated lessons
     2. Generate visuals: npx tsx src/education/batch-generate-visuals.ts
     3. Generate narration: npx tsx src/education/batch-generate-narration.ts
     4. Package SCORM: npx tsx src/education/batch-package-scorm.ts
  `);
}

main().catch(console.error);
