/**
 * Import Cambridge IGCSE Mathematics 0580 Syllabus
 *
 * This script imports the Cambridge IGCSE syllabus JSON into Firestore
 * following the education schema defined in EDUCATION-FIREBASE-SCHEMA.md
 */

import admin from 'firebase-admin';
import { getFirebaseProject, initializeFirebase } from '../services/firebase.js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables from root directory
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

interface CambridgeSyllabus {
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
  topics: Topic[];
  extendedTopics?: Topic[];
}

interface Topic {
  id: string;
  code: string;
  title: string;
  level: string;
  icon: string;
  color: string;
  bgColor: string;
  subtopics: Subtopic[];
}

interface Subtopic {
  code: string;
  title: string;
  content: string[];
  examples?: string[];
  notes?: string[];
  notation?: string[];
  required?: string[];
  vocabulary?: Record<string, string[]>;
  properties?: string[];
  formulas_given?: string[];
  isNew?: boolean;
}

/**
 * Generate slug from title
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * Import syllabus into Firestore
 */
async function importSyllabus(syllabusPath: string) {
  console.log('🔥 Starting Cambridge IGCSE import...\n');

  // Initialize Firebase projects
  initializeFirebase();

  // Get education Firebase project
  const educationProject = getFirebaseProject('education');
  if (!educationProject) {
    throw new Error('Education Firebase project not initialized. Check EDUCATION_FIREBASE_KEY in .env');
  }

  const db = educationProject.db;
  const FieldValue = admin.firestore.FieldValue;

  // Load syllabus JSON
  console.log('📖 Loading syllabus from:', syllabusPath);
  const syllabusJson = fs.readFileSync(syllabusPath, 'utf-8');
  const syllabus: CambridgeSyllabus = JSON.parse(syllabusJson);

  console.log('✓ Loaded:', syllabus.metadata.title);
  console.log(`  - Topics: ${syllabus.metadata.totalTopics}`);
  console.log(`  - Core subtopics: ${syllabus.metadata.coreSubtopics}`);
  console.log(`  - Extended subtopics: ${syllabus.metadata.extendedSubtopics}\n`);

  // Create syllabus document
  const syllabusId = `cambridge-igcse-maths-${syllabus.metadata.code}`;

  console.log('📝 Creating syllabus document:', syllabusId);

  const syllabusData = {
    syllabusId,
    title: syllabus.metadata.title,
    subject: syllabus.metadata.subject.toLowerCase(),
    curriculum: 'Cambridge IGCSE',
    year: null, // Not year-specific
    country: 'International',

    metadata: {
      examBoard: syllabus.metadata.examBoard,
      code: syllabus.metadata.code,
      academicYear: syllabus.metadata.years.join('-'),
      version: syllabus.metadata.version,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      createdBy: 'system',

      // Additional metadata
      levels: syllabus.metadata.levels,
      description: syllabus.metadata.description,
      assessmentInfo: syllabus.metadata.assessmentInfo,
      totalTopics: syllabus.metadata.totalTopics,
      coreSubtopics: syllabus.metadata.coreSubtopics,
      extendedSubtopics: syllabus.metadata.extendedSubtopics,
      lastUpdated: syllabus.metadata.lastUpdated
    }
  };

  await db.collection('syllabi').doc(syllabusId).set(syllabusData);
  console.log('✓ Syllabus document created\n');

  // Import units and topics
  let totalUnits = 0;
  let totalTopics = 0;

  // Import Core topics
  console.log('📚 Importing Core topics...');
  for (const topic of syllabus.topics) {
    await importUnit(db, syllabusId, topic, 'Core', FieldValue);
    totalUnits++;
    totalTopics += topic.subtopics.length;
  }

  // Import Extended topics
  if (syllabus.extendedTopics) {
    console.log('\n📚 Importing Extended topics...');
    for (const topic of syllabus.extendedTopics) {
      await importUnit(db, syllabusId, topic, 'Extended', FieldValue);
      totalUnits++;
      totalTopics += topic.subtopics.length;
    }
  }

  console.log('\n✅ Import complete!');
  console.log(`  - Units imported: ${totalUnits}`);
  console.log(`  - Topics imported: ${totalTopics}`);
}

/**
 * Import a unit (topic in Cambridge structure)
 */
async function importUnit(
  db: admin.firestore.Firestore,
  syllabusId: string,
  topic: Topic,
  level: string,
  FieldValue: typeof admin.firestore.FieldValue
) {
  const unitId = slugify(`${topic.code}-${topic.title}`);

  console.log(`  → Unit: ${topic.title} (${topic.code})`);

  const unitData = {
    unitId,
    title: topic.title,
    description: `${level} level content for ${topic.title}`,
    sequenceOrder: parseInt(topic.code.substring(1)), // C1 → 1, E2 → 2

    estimatedDuration: topic.subtopics.length * 45, // 45 mins per subtopic estimate
    difficulty: level === 'Core' ? 'beginner' : 'intermediate',

    learningOutcomes: topic.subtopics.map(st => st.title),
    assessmentCriteria: [
      `Understand and apply ${topic.title.toLowerCase()} concepts`,
      `Solve problems related to ${topic.title.toLowerCase()}`,
      `Demonstrate mastery of ${topic.title.toLowerCase()} techniques`
    ],

    prerequisites: [], // Would need to analyze dependencies

    metadata: {
      tags: [topic.title.toLowerCase(), level.toLowerCase()],
      originalCode: topic.code,
      icon: topic.icon,
      color: topic.color,
      bgColor: topic.bgColor,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }
  };

  await db
    .collection(`syllabi/${syllabusId}/units`)
    .doc(unitId)
    .set(unitData);

  // Import topics (subtopics in Cambridge structure)
  for (let i = 0; i < topic.subtopics.length; i++) {
    await importTopic(db, syllabusId, unitId, topic.subtopics[i], i + 1, FieldValue);
  }
}

/**
 * Import a topic (subtopic in Cambridge structure)
 */
async function importTopic(
  db: admin.firestore.Firestore,
  syllabusId: string,
  unitId: string,
  subtopic: Subtopic,
  sequenceOrder: number,
  FieldValue: typeof admin.firestore.FieldValue
) {
  const topicId = slugify(subtopic.code);

  console.log(`    • Topic: ${subtopic.title} (${subtopic.code})`);

  const topicData = {
    topicId,
    title: subtopic.title,
    description: subtopic.content.join('. '),
    sequenceOrder,

    estimatedDuration: 45, // 45 minutes per topic
    difficulty: 'beginner',

    learningObjectives: subtopic.content,
    prerequisites: [], // Would need to analyze

    status: 'draft',

    content: {
      conceptsGenerated: false,
      videosGenerated: false,
      interactivesGenerated: false,
      exercisesGenerated: false,
      quizGenerated: false
    },

    scorm: {
      packageGenerated: false
    },

    metadata: {
      tags: [subtopic.title.toLowerCase()],
      originalCode: subtopic.code,
      examples: subtopic.examples || [],
      notes: subtopic.notes || [],
      notation: subtopic.notation || [],
      required: subtopic.required || [],
      vocabulary: subtopic.vocabulary || {},
      properties: subtopic.properties || [],
      formulasGiven: subtopic.formulas_given || [],
      isNew: subtopic.isNew || false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    }
  };

  await db
    .collection(`syllabi/${syllabusId}/units/${unitId}/topics`)
    .doc(topicId)
    .set(topicData);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run import-syllabus <path-to-syllabus.json>');
    console.error('Example: npm run import-syllabus ./data/cambridge-igcse-0580.json');
    process.exit(1);
  }

  const syllabusPath = path.resolve(args[0]);

  if (!fs.existsSync(syllabusPath)) {
    console.error(`Error: File not found: ${syllabusPath}`);
    process.exit(1);
  }

  try {
    await importSyllabus(syllabusPath);
    console.log('\n🎉 Import successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);

export { importSyllabus };
