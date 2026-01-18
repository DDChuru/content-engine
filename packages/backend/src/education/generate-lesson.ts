#!/usr/bin/env node
/**
 * Generate Complete IGCSE Mathematics Lesson
 *
 * Usage:
 *   npx tsx src/education/generate-lesson.ts C1.2
 *   npx tsx src/education/generate-lesson.ts E4.7 --style=blueprint
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { generateLesson, SyllabusTopic } from './lesson-generator.js';
import { LessonGenerationRequest, VisualStyle } from './lesson-schema.js';
import visualGenerator from './visual-generator.js';

// Load syllabus
async function loadSyllabus() {
  const syllabusPath = path.join(__dirname, '../../data/maths-0580-syllabus-complete.json');
  const data = await fs.readFile(syllabusPath, 'utf-8');
  return JSON.parse(data);
}

// Find topic by code
function findTopic(syllabus: any, code: string): SyllabusTopic | null {
  // Search in core topics
  for (const topic of syllabus.topics) {
    for (const subtopic of topic.subtopics) {
      if (subtopic.code === code) {
        return {
          code: subtopic.code,
          title: subtopic.title,
          content: subtopic.content || [],
          examples: subtopic.examples,
          notes: subtopic.notes,
          notation: subtopic.notation,
          required: subtopic.required,
          properties: subtopic.properties,
          level: 'Core',
        };
      }
    }
  }

  // Search in extended topics
  for (const topic of syllabus.extendedTopics) {
    for (const subtopic of topic.subtopics) {
      if (subtopic.code === code) {
        return {
          code: subtopic.code,
          title: subtopic.title,
          content: subtopic.content || [],
          examples: subtopic.examples,
          notes: subtopic.notes,
          notation: subtopic.notation,
          required: subtopic.required,
          properties: subtopic.properties,
          level: 'Extended',
        };
      }
    }
  }

  return null;
}

// Main generation function
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           IGCSE Mathematics Lesson Generator                      ║
║                                                                   ║
║  Usage:                                                           ║
║    npx ts-node src/education/generate-lesson.ts <topic-code>      ║
║                                                                   ║
║  Options:                                                         ║
║    --style=<style>   Visual style (default: auto)                 ║
║    --examples=<n>    Number of worked examples (default: 6)       ║
║    --practice=<n>    Number of practice questions (default: 10)   ║
║    --dry-run         Show what would be generated                 ║
║                                                                   ║
║  Examples:                                                        ║
║    npx ts-node src/education/generate-lesson.ts C1.2              ║
║    npx ts-node src/education/generate-lesson.ts E4.7 --style=blueprint ║
║    npx ts-node src/education/generate-lesson.ts C1.1 --examples=8      ║
║                                                                   ║
║  Available Styles:                                                ║
║    shape-morphing, blueprint, chalkboard, neon-glow,              ║
║    minimal-line-art, glassmorphism, particle-trail, gradient-wave ║
╚══════════════════════════════════════════════════════════════════╝
    `);

    // List available topics
    const syllabus = await loadSyllabus();
    console.log('\n📚 Available Core Topics:\n');
    for (const topic of syllabus.topics) {
      console.log(`  ${topic.code} ${topic.title}`);
      for (const sub of topic.subtopics.slice(0, 3)) {
        console.log(`    └─ ${sub.code} ${sub.title}`);
      }
      if (topic.subtopics.length > 3) {
        console.log(`    └─ ... and ${topic.subtopics.length - 3} more`);
      }
    }
    return;
  }

  const topicCode = args[0];
  const styleArg = args.find((a) => a.startsWith('--style='));
  const examplesArg = args.find((a) => a.startsWith('--examples='));
  const practiceArg = args.find((a) => a.startsWith('--practice='));
  const dryRun = args.includes('--dry-run');

  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           IGCSE Mathematics Lesson Generator                      ║
╚══════════════════════════════════════════════════════════════════╝
  `);

  // Load syllabus
  console.log('📖 Loading syllabus...');
  const syllabus = await loadSyllabus();

  // Find topic
  const topic = findTopic(syllabus, topicCode);
  if (!topic) {
    console.error(`❌ Topic not found: ${topicCode}`);
    console.log('\nUse --help to see available topics');
    return;
  }

  console.log(`\n📚 Topic: ${topic.code} - ${topic.title}`);
  console.log(`   Level: ${topic.level}`);
  console.log(`   Content areas: ${topic.content.length}`);

  if (dryRun) {
    console.log('\n🔍 DRY RUN - Would generate:');
    console.log('   - Lesson structure with objectives');
    console.log('   - 3-5 theory sections with visuals');
    console.log('   - 4-6 common misconceptions');
    console.log(`   - ${examplesArg ? examplesArg.split('=')[1] : '6'} worked examples`);
    console.log(`   - ${practiceArg ? practiceArg.split('=')[1] : '10'} practice questions`);
    console.log('   - Assessment quiz');
    console.log('   - SCORM metadata');
    return;
  }

  // Build generation request
  const request: LessonGenerationRequest = {
    syllabusCode: topicCode,
    level: topic.level,
    preferredStyle: styleArg
      ? (styleArg.split('=')[1] as VisualStyle)
      : undefined,
    includeVideo: false,
    includeInteractive: true,
    exampleCount: examplesArg ? parseInt(examplesArg.split('=')[1]) : 6,
    practiceCount: practiceArg ? parseInt(practiceArg.split('=')[1]) : 10,
    generateNarration: false,
    useGeminiDiagrams: true,
    useManimAnimations: true,
    useSvgAnimations: true,
  };

  // Generate lesson
  console.log('\n🚀 Starting generation...\n');
  const startTime = Date.now();

  try {
    const lesson = await generateLesson(topic, request);

    // Save lesson
    const outputDir = path.join(__dirname, '../../output/lessons');
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `${lesson.id}.json`);
    await fs.writeFile(outputPath, JSON.stringify(lesson, null, 2));

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                     ✅ GENERATION COMPLETE                        ║
╚══════════════════════════════════════════════════════════════════╝

  📄 Lesson saved to: ${outputPath}

  📊 Statistics:
     • Duration: ${duration}s
     • Theory sections: ${lesson.theorySections.length}
     • Misconceptions: ${lesson.misconceptions.length}
     • Worked examples: ${lesson.workedExamples.length}
     • Practice questions: ${lesson.practiceQuestions.length}
     • Estimated lesson time: ${lesson.estimatedDuration} minutes

  🎨 Visual style: ${lesson.preferredStyle}

  📦 SCORM ID: ${lesson.scorm.identifier}

  Next steps:
     1. Review the generated content
     2. Generate visuals: npx ts-node src/education/generate-visuals.ts ${lesson.id}
     3. Generate narration: npx ts-node src/education/generate-narration.ts ${lesson.id}
     4. Package SCORM: npx ts-node src/education/package-scorm.ts ${lesson.id}
    `);

    // Show preview of content
    console.log('\n📋 Content Preview:\n');
    console.log('Learning Objectives:');
    lesson.objectives.slice(0, 3).forEach((obj, i) => {
      console.log(`  ${i + 1}. ${obj.description}`);
    });

    console.log('\nTheory Sections:');
    lesson.theorySections.forEach((sec) => {
      console.log(`  • ${sec.title}`);
    });

    console.log('\nMisconceptions Addressed:');
    lesson.misconceptions.slice(0, 3).forEach((m) => {
      console.log(`  ⚠️  "${m.wrongIdea}"`);
    });

  } catch (error) {
    console.error('\n❌ Generation failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
