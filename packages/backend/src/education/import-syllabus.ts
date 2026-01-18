#!/usr/bin/env node
/**
 * Import Cambridge IGCSE 0580 Syllabus to Firestore
 *
 * Imports the complete syllabus structure into the education Firestore
 * for the IGCSE Mathematics content platform.
 *
 * Usage:
 *   npx tsx src/education/import-syllabus.ts                    # Import full syllabus
 *   npx tsx src/education/import-syllabus.ts --dry-run          # Preview without importing
 *   npx tsx src/education/import-syllabus.ts --core-only        # Import Core topics only
 *   npx tsx src/education/import-syllabus.ts --extended-only    # Import Extended topics only
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root
dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

import { initializeFirebase } from '../services/firebase.js';
import { EducationFirestoreService } from '../services/education-firestore.js';
import type { TopicLevel } from '../services/education-firestore.js';

// Initialize Firebase before using any services
initializeFirebase();

interface SyllabusSubtopic {
  code: string;
  title: string;
  content?: string[];
  examples?: string[];
  notes?: string[];
  notation?: string[];
  required?: string[];
  properties?: string[];
}

interface SyllabusTopic {
  id: string;
  code: string;
  title: string;
  level: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  subtopics: SyllabusSubtopic[];
}

interface SyllabusData {
  metadata: {
    subject: string;
    code: string;
    title: string;
    examBoard: string;
    years: number[];
    version: string;
    lastUpdated: string;
    levels: string[];
    description: string;
    assessmentInfo: any;
    totalTopics: number;
    coreSubtopics: number;
    extendedSubtopics: number;
  };
  topics: SyllabusTopic[];
  extendedTopics: SyllabusTopic[];
}

interface ImportStats {
  units: number;
  coreTopics: number;
  extendedTopics: number;
  totalTopics: number;
}

async function loadSyllabus(): Promise<SyllabusData> {
  const syllabusPath = path.join(__dirname, '../../data/maths-0580-syllabus-complete.json');
  const data = await fs.readFile(syllabusPath, 'utf-8');
  return JSON.parse(data);
}

function formatTopicForImport(
  subtopic: SyllabusSubtopic,
  unit: SyllabusTopic,
  level: TopicLevel
) {
  return {
    code: subtopic.code,
    title: subtopic.title,
    unitCode: unit.code,
    unitTitle: unit.title,
    level,
    content: subtopic.content || [],
    examples: subtopic.examples || [],
    notes: subtopic.notes || [],
    notation: subtopic.notation || [],
    required: subtopic.required || [],
    properties: subtopic.properties || [],
    contentStatus: 'not_started' as const,
    estimatedDuration: 45, // minutes - default
    difficulty: level === 'Core' ? 'foundation' : 'higher',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function formatUnitForImport(topic: SyllabusTopic, level: TopicLevel) {
  return {
    code: topic.code,
    title: topic.title,
    level,
    icon: topic.icon,
    color: topic.color,
    bgColor: topic.bgColor,
    topicCount: topic.subtopics.length,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function main() {
  const args = process.argv.slice(2);

  const dryRun = args.includes('--dry-run');
  const coreOnly = args.includes('--core-only');
  const extendedOnly = args.includes('--extended-only');

  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║        Cambridge IGCSE 0580 - Syllabus Import Tool                   ║
║                                                                      ║
║  Importing complete syllabus structure to Firestore                  ║
╚══════════════════════════════════════════════════════════════════════╝
  `);

  // Load syllabus
  console.log('📖 Loading syllabus from data/maths-0580-syllabus-complete.json...');
  const syllabus = await loadSyllabus();

  console.log(`\n📊 Syllabus Overview:`);
  console.log(`   Subject: ${syllabus.metadata.title}`);
  console.log(`   Code: ${syllabus.metadata.code}`);
  console.log(`   Exam Board: ${syllabus.metadata.examBoard}`);
  console.log(`   Years: ${syllabus.metadata.years.join(', ')}`);
  console.log(`   Core subtopics: ${syllabus.metadata.coreSubtopics}`);
  console.log(`   Extended subtopics: ${syllabus.metadata.extendedSubtopics}`);

  // Prepare import data
  const stats: ImportStats = {
    units: 0,
    coreTopics: 0,
    extendedTopics: 0,
    totalTopics: 0,
  };

  const unitsToImport: any[] = [];
  const topicsToImport: any[] = [];

  // Process Core topics
  if (!extendedOnly && syllabus.topics) {
    console.log('\n📚 Processing Core topics...');
    for (const unit of syllabus.topics) {
      const unitData = formatUnitForImport(unit, 'Core');
      unitsToImport.push(unitData);
      stats.units++;

      for (const subtopic of unit.subtopics) {
        const topicData = formatTopicForImport(subtopic, unit, 'Core');
        topicsToImport.push(topicData);
        stats.coreTopics++;
      }

      console.log(`   ✓ ${unit.code}: ${unit.title} (${unit.subtopics.length} topics)`);
    }
  }

  // Process Extended topics
  if (!coreOnly && syllabus.extendedTopics) {
    console.log('\n📚 Processing Extended topics...');
    for (const unit of syllabus.extendedTopics) {
      const unitData = formatUnitForImport(unit, 'Extended');
      unitsToImport.push(unitData);
      stats.units++;

      for (const subtopic of unit.subtopics) {
        const topicData = formatTopicForImport(subtopic, unit, 'Extended');
        topicsToImport.push(topicData);
        stats.extendedTopics++;
      }

      console.log(`   ✓ ${unit.code}: ${unit.title} (${unit.subtopics.length} topics)`);
    }
  }

  stats.totalTopics = stats.coreTopics + stats.extendedTopics;

  console.log('\n' + '='.repeat(70));
  console.log(`📊 Import Summary:`);
  console.log(`   Units: ${stats.units}`);
  console.log(`   Core topics: ${stats.coreTopics}`);
  console.log(`   Extended topics: ${stats.extendedTopics}`);
  console.log(`   Total topics: ${stats.totalTopics}`);
  console.log('='.repeat(70));

  if (dryRun) {
    console.log('\n⚠️  DRY RUN - No data was imported');
    console.log('\n📋 Topics that would be imported:\n');

    // Show sample of topics
    const sampleTopics = topicsToImport.slice(0, 10);
    for (const topic of sampleTopics) {
      console.log(`   ${topic.code} (${topic.level}): ${topic.title}`);
    }
    if (topicsToImport.length > 10) {
      console.log(`   ... and ${topicsToImport.length - 10} more topics`);
    }

    console.log('\n💡 Run without --dry-run to import data to Firestore');
    return;
  }

  // Import to Firestore
  console.log('\n🔥 Importing to Firestore...');

  try {
    const educationService = new EducationFirestoreService();

    // Initialize syllabus metadata - pass raw syllabus structure
    // The service expects: { metadata: {...}, topics: [...], extendedTopics: [...] }
    console.log('   📄 Initializing syllabus metadata...');

    // Filter syllabus based on options
    const filteredSyllabus = {
      metadata: syllabus.metadata,
      topics: coreOnly || !extendedOnly ? syllabus.topics : [],
      extendedTopics: extendedOnly || !coreOnly ? syllabus.extendedTopics : [],
    };

    await educationService.initializeSyllabus(filteredSyllabus);

    console.log(`\n✅ Import complete!`);
    console.log(`\n📊 Imported:`);
    console.log(`   • ${stats.units} units`);
    console.log(`   • ${stats.coreTopics} Core topics`);
    console.log(`   • ${stats.extendedTopics} Extended topics`);
    console.log(`   • ${stats.totalTopics} total topics`);

    console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║                      IMPORT SUCCESSFUL!                              ║
╚══════════════════════════════════════════════════════════════════════╝

  Next steps:

  1. View syllabus:
     curl http://localhost:3001/api/education/syllabus

  2. View coverage:
     curl http://localhost:3001/api/education/coverage

  3. Get topics to generate:
     curl http://localhost:3001/api/education/topics/next-to-generate

  4. Generate a lesson:
     npx tsx src/education/generate-lesson.ts C1.2 --style=neon-glow

  5. Queue topics for generation:
     curl -X POST http://localhost:3001/api/education/generation/queue \\
       -H "Content-Type: application/json" \\
       -d '{"topicCodes": ["C1.1", "C1.2", "C1.3"]}'
`);

  } catch (error: any) {
    console.error(`\n❌ Import failed: ${error.message}`);

    if (error.message.includes('EDUCATION_FIREBASE_KEY')) {
      console.log(`
⚠️  Firebase configuration missing!

Please ensure EDUCATION_FIREBASE_KEY is set in your .env file:

EDUCATION_FIREBASE_KEY='{"type":"service_account","project_id":"...",...}'

See EDUCATION-PROJECT-SETUP.md for instructions.
`);
    }

    process.exit(1);
  }
}

main().catch(console.error);
