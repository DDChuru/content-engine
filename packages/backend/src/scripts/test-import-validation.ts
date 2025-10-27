/**
 * Test Import Validation
 *
 * This script validates the Cambridge IGCSE import logic
 * without requiring Firebase credentials
 */

import * as fs from 'fs';
import * as path from 'path';

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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

async function validateImport(syllabusPath: string) {
  console.log('📋 Validating Cambridge IGCSE import structure...\n');

  // Load syllabus JSON
  console.log('📖 Loading syllabus from:', syllabusPath);
  const syllabusJson = fs.readFileSync(syllabusPath, 'utf-8');
  const syllabus: CambridgeSyllabus = JSON.parse(syllabusJson);

  console.log('✓ Loaded:', syllabus.metadata.title);
  console.log(`  - Topics: ${syllabus.metadata.totalTopics}`);
  console.log(`  - Core subtopics: ${syllabus.metadata.coreSubtopics}`);
  console.log(`  - Extended subtopics: ${syllabus.metadata.extendedSubtopics}\n`);

  // Validate syllabus document structure
  const syllabusId = `cambridge-igcse-maths-${syllabus.metadata.code}`;
  console.log('📝 Syllabus Document Structure:');
  console.log(`  syllabusId: ${syllabusId}`);
  console.log(`  title: ${syllabus.metadata.title}`);
  console.log(`  subject: ${syllabus.metadata.subject.toLowerCase()}`);
  console.log(`  curriculum: Cambridge IGCSE`);
  console.log(`  levels: ${syllabus.metadata.levels.join(', ')}\n`);

  let totalUnits = 0;
  let totalTopics = 0;
  const unitStructures: any[] = [];
  const topicStructures: any[] = [];

  // Validate Core topics
  console.log('📚 Core Topics:');
  for (const topic of syllabus.topics) {
    const unitId = slugify(`${topic.code}-${topic.title}`);
    totalUnits++;

    console.log(`  → Unit: ${topic.title} (${topic.code})`);
    console.log(`     unitId: ${unitId}`);
    console.log(`     estimatedDuration: ${topic.subtopics.length * 45} mins`);
    console.log(`     difficulty: beginner`);
    console.log(`     subtopics: ${topic.subtopics.length}`);

    unitStructures.push({
      unitId,
      title: topic.title,
      level: 'Core',
      originalCode: topic.code,
      subtopicCount: topic.subtopics.length
    });

    for (let i = 0; i < topic.subtopics.length; i++) {
      const subtopic = topic.subtopics[i];
      const topicId = slugify(subtopic.code);
      totalTopics++;

      console.log(`       • Topic: ${subtopic.title} (${subtopic.code})`);
      console.log(`         topicId: ${topicId}`);
      console.log(`         learningObjectives: ${subtopic.content.length}`);
      console.log(`         examples: ${subtopic.examples?.length || 0}`);
      console.log(`         notes: ${subtopic.notes?.length || 0}`);
      console.log(`         notation: ${subtopic.notation?.length || 0}`);

      topicStructures.push({
        topicId,
        title: subtopic.title,
        unitId,
        level: 'Core',
        originalCode: subtopic.code,
        sequenceOrder: i + 1,
        hasExamples: (subtopic.examples?.length || 0) > 0,
        hasNotes: (subtopic.notes?.length || 0) > 0,
        hasNotation: (subtopic.notation?.length || 0) > 0
      });
    }
    console.log('');
  }

  // Validate Extended topics
  if (syllabus.extendedTopics) {
    console.log('📚 Extended Topics:');
    for (const topic of syllabus.extendedTopics) {
      const unitId = slugify(`${topic.code}-${topic.title}`);
      totalUnits++;

      console.log(`  → Unit: ${topic.title} (${topic.code})`);
      console.log(`     unitId: ${unitId}`);
      console.log(`     estimatedDuration: ${topic.subtopics.length * 45} mins`);
      console.log(`     difficulty: intermediate`);
      console.log(`     subtopics: ${topic.subtopics.length}`);

      unitStructures.push({
        unitId,
        title: topic.title,
        level: 'Extended',
        originalCode: topic.code,
        subtopicCount: topic.subtopics.length
      });

      for (let i = 0; i < topic.subtopics.length; i++) {
        const subtopic = topic.subtopics[i];
        const topicId = slugify(subtopic.code);
        totalTopics++;

        console.log(`       • Topic: ${subtopic.title} (${subtopic.code})`);
        console.log(`         topicId: ${topicId}`);
        console.log(`         learningObjectives: ${subtopic.content.length}`);
        console.log(`         examples: ${subtopic.examples?.length || 0}`);
        console.log(`         notes: ${subtopic.notes?.length || 0}`);
        console.log(`         properties: ${subtopic.properties?.length || 0}`);

        topicStructures.push({
          topicId,
          title: subtopic.title,
          unitId,
          level: 'Extended',
          originalCode: subtopic.code,
          sequenceOrder: i + 1,
          hasExamples: (subtopic.examples?.length || 0) > 0,
          hasNotes: (subtopic.notes?.length || 0) > 0,
          hasProperties: (subtopic.properties?.length || 0) > 0
        });
      }
      console.log('');
    }
  }

  console.log('✅ Validation Summary:');
  console.log(`  - Total units: ${totalUnits}`);
  console.log(`  - Total topics: ${totalTopics}`);
  console.log(`  - Core units: ${syllabus.topics.length}`);
  console.log(`  - Extended units: ${syllabus.extendedTopics?.length || 0}`);
  console.log('');

  // Firestore Path Preview
  console.log('🔥 Firestore Path Structure Preview:');
  console.log('');
  console.log(`syllabi/${syllabusId}/`);
  console.log(`├── (syllabus document with metadata)`);
  console.log(`└── units/`);

  unitStructures.slice(0, 2).forEach((unit, idx) => {
    const isLast = idx === 1;
    const prefix = isLast ? '    └──' : '    ├──';
    console.log(`${prefix} ${unit.unitId}/`);
    console.log(`    ${isLast ? '    ' : '│   '}├── (unit document)`);
    console.log(`    ${isLast ? '    ' : '│   '}└── topics/`);

    const unitTopics = topicStructures.filter(t => t.unitId === unit.unitId).slice(0, 2);
    unitTopics.forEach((topic, tidx) => {
      const tIsLast = tidx === unitTopics.length - 1;
      const tPrefix = tIsLast ? '        └──' : '        ├──';
      console.log(`    ${isLast ? '    ' : '│   '}${tPrefix} ${topic.topicId}/`);
      console.log(`    ${isLast ? '    ' : '│   '}    ${tIsLast ? ' ' : '│'}   └── (topic document with content, exercises, quiz)`);
    });
  });
  console.log(`    └── ... (${totalUnits - 2} more units)`);
  console.log('');

  // Cost estimation
  const avgVideoMinutes = 10;
  const costPerModule = 1.06;
  const totalCost = totalTopics * costPerModule;

  console.log('💰 Cost Estimation:');
  console.log(`  - Topics to generate: ${totalTopics}`);
  console.log(`  - Estimated cost per topic: $${costPerModule.toFixed(2)}`);
  console.log(`  - Total estimated cost: $${totalCost.toFixed(2)}`);
  console.log(`  - Video content: ~${totalTopics * avgVideoMinutes} minutes`);
  console.log('');

  console.log('🎉 Validation complete! Structure is ready for import.');
  console.log('');
  console.log('📌 Next Steps:');
  console.log('  1. Set up Education Firebase project (see EDUCATION-PROJECT-SETUP.md)');
  console.log('  2. Add EDUCATION_FIREBASE_KEY to .env');
  console.log('  3. Run: npm run import-syllabus ./data/cambridge-igcse-0580-sample.json');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: tsx src/scripts/test-import-validation.ts <path-to-syllabus.json>');
    console.error('Example: tsx src/scripts/test-import-validation.ts ./data/cambridge-igcse-0580-sample.json');
    process.exit(1);
  }

  const syllabusPath = path.resolve(args[0]);

  if (!fs.existsSync(syllabusPath)) {
    console.error(`Error: File not found: ${syllabusPath}`);
    process.exit(1);
  }

  try {
    await validateImport(syllabusPath);
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run main function
main().catch(console.error);
