/**
 * Cambridge IGCSE Mathematics - Comprehensive Lesson Generator
 *
 * Generates complete lessons with:
 * - Age-appropriate language (14-16)
 * - Visualization-first approach
 * - Common misconceptions
 * - Thorough worked examples
 * - Interactive elements
 * - SCORM packaging
 */

import Anthropic from '@anthropic-ai/sdk';
import {
  Lesson,
  LessonGenerationRequest,
  GenerationProgress,
  VisualStyle,
  TheorySection,
  WorkedExample,
  PracticeQuestion,
  Misconception,
  ContentBlock,
} from './lesson-schema.js';

const anthropic = new Anthropic();

// Helper to parse JSON from Claude responses (may be wrapped in markdown)
function parseJsonResponse(text: string): any {
  let jsonText = text.trim();
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.slice(7);
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.slice(3);
  }
  if (jsonText.endsWith('```')) {
    jsonText = jsonText.slice(0, -3);
  }
  return JSON.parse(jsonText.trim());
}

// Syllabus topic data
interface SyllabusTopic {
  code: string;
  title: string;
  content: string[];
  examples?: string[];
  notes?: string[];
  notation?: string[];
  required?: string[];
  properties?: string[];
  level: 'Core' | 'Extended';
}

// System prompt for lesson generation
const LESSON_GENERATOR_PROMPT = `You are an expert Cambridge IGCSE Mathematics teacher creating comprehensive lesson content.

TARGET AUDIENCE:
- Age 14-16 years old
- Mix of abilities (Core targets grades C-G, Extended targets A*-C)
- Need engaging, clear explanations
- Visual learners benefit from diagrams and animations

TONE & STYLE:
- Friendly but professional
- Use "you" and "we" to be conversational
- Break complex ideas into small steps
- Celebrate small wins ("Great! You've just...")
- Be encouraging about mistakes ("A common trap is...")

CONTENT PRINCIPLES:
1. START with learning objectives (what they'll achieve)
2. CHECK prior knowledge (what they need first)
3. HOOK them with real-world relevance
4. EXPLAIN theory with visuals
5. SHOW common mistakes and how to avoid them
6. DEMONSTRATE with worked examples (lots!)
7. PRACTICE with graduated difficulty
8. SUMMARIZE key takeaways

VISUAL CONTENT NOTES:
- Suggest where SVG animations would help (moving points, transformations)
- Suggest where Gemini diagrams would help (realistic scenarios, infographics)
- Suggest where Manim would help (graph plotting, function visualization)
- Use the style showcase: shape-morphing, blueprint, chalkboard, neon-glow, minimal-line-art

EXAM FOCUS:
- Include mark allocations for examples
- Explain how marks are awarded
- Give specific exam tips
- Use past paper style questions`;

/**
 * Generate a complete lesson from syllabus topic
 */
export async function generateLesson(
  topic: SyllabusTopic,
  request: LessonGenerationRequest
): Promise<Lesson> {
  const progress: GenerationProgress = {
    lessonId: `lesson-${topic.code}`,
    status: 'generating',
    steps: {
      structure: 'pending',
      objectives: 'pending',
      theory: 'pending',
      diagrams: 'pending',
      animations: 'pending',
      examples: 'pending',
      practice: 'pending',
      quiz: 'pending',
      narration: 'pending',
      scorm: 'pending',
    },
    currentStep: 'structure',
    progress: 0,
    estimatedCost: 0,
    actualCost: 0,
  };

  console.log(`\n📚 Generating lesson for ${topic.code}: ${topic.title}`);
  console.log(`   Level: ${topic.level}`);
  console.log(`   Style: ${request.preferredStyle || 'auto'}`);

  // Step 1: Generate lesson structure and objectives
  console.log('\n1️⃣ Generating structure and objectives...');
  const structure = await generateLessonStructure(topic, request);
  progress.steps.structure = 'complete';
  progress.steps.objectives = 'complete';
  progress.progress = 20;

  // Step 2: Generate theory sections
  console.log('\n2️⃣ Generating theory sections...');
  const theorySections = await generateTheorySections(topic, structure, request);
  progress.steps.theory = 'complete';
  progress.progress = 40;

  // Step 3: Generate misconceptions
  console.log('\n3️⃣ Identifying common misconceptions...');
  const misconceptions = await generateMisconceptions(topic);
  progress.progress = 50;

  // Step 4: Generate worked examples
  console.log('\n4️⃣ Generating worked examples...');
  const workedExamples = await generateWorkedExamples(
    topic,
    request.exampleCount || 6
  );
  progress.steps.examples = 'complete';
  progress.progress = 70;

  // Step 5: Generate practice questions
  console.log('\n5️⃣ Generating practice questions...');
  const practiceQuestions = await generatePracticeQuestions(
    topic,
    misconceptions,
    request.practiceCount || 10
  );
  progress.steps.practice = 'complete';
  progress.progress = 85;

  // Step 6: Generate quiz
  console.log('\n6️⃣ Creating assessment quiz...');
  const quiz = await generateQuiz(topic, practiceQuestions);
  progress.steps.quiz = 'complete';
  progress.progress = 95;

  // Assemble final lesson
  const lesson: Lesson = {
    id: `igcse-0580-${topic.code.toLowerCase()}`,
    syllabusCode: topic.code,
    title: topic.title,
    level: topic.level,
    estimatedDuration: calculateDuration(theorySections, workedExamples),
    difficulty: topic.level === 'Core' ? 'core' : 'extended',
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    preferredStyle: selectBestStyle(topic),
    opening: structure.opening,
    priorKnowledge: structure.priorKnowledge,
    objectives: structure.objectives,
    theorySections,
    misconceptions,
    workedExamples,
    practiceQuestions,
    quiz,
    summary: structure.summary,
    scorm: generateScormMetadata(topic, structure),
    generation: {
      generatedAt: new Date().toISOString(),
      generatedBy: 'claude-opus-4-5-20251101',
      promptVersion: '1.0',
      reviewStatus: 'draft',
    },
  };

  progress.status = 'complete';
  progress.progress = 100;

  console.log('\n✅ Lesson generation complete!');
  console.log(`   Duration: ~${lesson.estimatedDuration} minutes`);
  console.log(`   Sections: ${theorySections.length}`);
  console.log(`   Examples: ${workedExamples.length}`);
  console.log(`   Practice: ${practiceQuestions.length}`);

  return lesson;
}

/**
 * Generate lesson structure (objectives, prior knowledge, summary)
 */
async function generateLessonStructure(
  topic: SyllabusTopic,
  request: LessonGenerationRequest
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    system: LESSON_GENERATOR_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate the lesson structure for Cambridge IGCSE Mathematics topic:

TOPIC CODE: ${topic.code}
TOPIC TITLE: ${topic.title}
LEVEL: ${topic.level}

SYLLABUS CONTENT:
${topic.content.map((c) => `- ${c}`).join('\n')}

${topic.examples ? `SYLLABUS EXAMPLES:\n${topic.examples.map((e) => `- ${e}`).join('\n')}` : ''}
${topic.notes ? `NOTES:\n${topic.notes.map((n) => `- ${n}`).join('\n')}` : ''}
${topic.notation ? `NOTATION:\n${topic.notation.map((n) => `- ${n}`).join('\n')}` : ''}

Generate a JSON response with:
1. opening: { hook, realWorldConnection }
2. priorKnowledge: [{ topicCode, topicTitle, specificConcepts[], checkQuestion }]
3. objectives: [{ id, verb (Bloom's), description, assessable, examWeight }]
4. summary: { keyTakeaways[], formulaSheet[], examTips[], nextTopics[] }

Make the hook engaging for teenagers. Be specific about prior knowledge needed.
Use Bloom's taxonomy verbs: recall, understand, apply, analyze, evaluate, create.

Return ONLY valid JSON, no markdown.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    return parseJsonResponse(content.text);
  } catch {
    console.error('Failed to parse structure:', content.text.slice(0, 500));
    throw new Error('Failed to parse lesson structure');
  }
}

/**
 * Generate theory sections with visual content suggestions
 */
async function generateTheorySections(
  topic: SyllabusTopic,
  structure: { objectives: { description: string }[] },
  request: LessonGenerationRequest
): Promise<TheorySection[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 8000,
    system: LESSON_GENERATOR_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate detailed theory sections for:

TOPIC: ${topic.code} - ${topic.title}
LEVEL: ${topic.level}

CONTENT TO COVER:
${topic.content.map((c) => `- ${c}`).join('\n')}

LEARNING OBJECTIVES:
${structure.objectives.map((o, i) => `${i + 1}. ${o.description}`).join('\n')}

For each theory section, provide:
1. title - Clear section heading
2. order - Section sequence number
3. introduction - Engaging intro paragraph
4. keyQuestion - Hook question to engage students
5. content - Array of content blocks with:
   - type: "video" | "svg-animation" | "gemini-diagram" | "manim-animation" | "latex-formula" | "interactive"
   - title, description, narrationText
   - For visuals, include geminiPrompt or describe the animation needed
   - For formulas, include latex notation
6. keyFormulas - If applicable: name, latex, explanation, whenToUse
7. keyDefinitions - term, definition, example
8. keyPoints - Bullet points summarizing the section
9. relatedExamples - Leave as empty array (we'll link later)

VISUAL CONTENT GUIDELINES:
- Suggest SVG animations for: geometry proofs, moving points, transformations
- Suggest Gemini diagrams for: real-world scenarios, infographics, comparison charts
- Suggest Manim for: graphs, functions, number lines, coordinate geometry
- Suggest interactive for: sliders, calculators, drag-and-drop

Include 3-5 theory sections. Return ONLY valid JSON array.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    return parseJsonResponse(content.text);
  } catch {
    console.error('Failed to parse theory sections:', content.text);
    throw new Error('Failed to parse theory sections');
  }
}

/**
 * Generate common misconceptions with corrections
 */
async function generateMisconceptions(
  topic: SyllabusTopic
): Promise<Misconception[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 3000,
    system: LESSON_GENERATOR_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Identify 4-6 common misconceptions for Cambridge IGCSE topic:

TOPIC: ${topic.code} - ${topic.title}

CONTENT:
${topic.content.map((c) => `- ${c}`).join('\n')}

For each misconception, provide:
1. id - Unique identifier (e.g., "misc-1")
2. wrongIdea - What students typically think (be specific)
3. whyWrong - Brief explanation of the error
4. correctUnderstanding - The correct way to think about it
5. exampleOfMistake - A specific example showing the error
6. correctExample - The same example done correctly

Be specific to IGCSE level. These should be real mistakes examiners see.
Return ONLY valid JSON array.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    return parseJsonResponse(content.text);
  } catch {
    console.error('Failed to parse misconceptions:', content.text);
    throw new Error('Failed to parse misconceptions');
  }
}

/**
 * Generate worked examples with step-by-step solutions
 */
async function generateWorkedExamples(
  topic: SyllabusTopic,
  count: number
): Promise<WorkedExample[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 10000,
    system: LESSON_GENERATOR_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate ${count} worked examples for Cambridge IGCSE topic:

TOPIC: ${topic.code} - ${topic.title}
LEVEL: ${topic.level}

CONTENT:
${topic.content.map((c) => `- ${c}`).join('\n')}

${topic.examples ? `SYLLABUS EXAMPLES:\n${topic.examples.map((e) => `- ${e}`).join('\n')}` : ''}

Create ${count} worked examples with INCREASING DIFFICULTY:
- 2 foundation level (building confidence)
- ${topic.level === 'Core' ? '3 core' : '2 core'} level (standard exam questions)
- ${topic.level === 'Extended' ? '2 extended' : '1 extended'} level (challenging)

For each example:
1. id - Unique identifier (e.g., "ex-1")
2. difficulty - "foundation" | "core" | "extended" | "challenge"
3. questionType - "calculation" | "proof" | "construction" | "interpretation" | "application"
4. question - Clear question text (exam-style)
5. marks - Total marks for this question (2-6 typical)
6. steps - Array of solution steps:
   - stepNumber
   - instruction - What to do
   - working - The actual mathematics
   - explanation - Why we do this step
   - commonError - What students often get wrong (optional)
7. answer - Final answer
8. examTip - Helpful exam advice
9. marksBreakdown - How marks are allocated (e.g., "M1 for method, A1 for answer")

Make questions realistic and exam-style. Show all working clearly.
Return ONLY valid JSON array.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    return parseJsonResponse(content.text);
  } catch {
    console.error('Failed to parse examples:', content.text);
    throw new Error('Failed to parse worked examples');
  }
}

/**
 * Generate practice questions
 */
async function generatePracticeQuestions(
  topic: SyllabusTopic,
  misconceptions: Misconception[],
  count: number
): Promise<PracticeQuestion[]> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 6000,
    system: LESSON_GENERATOR_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Generate ${count} practice questions for Cambridge IGCSE topic:

TOPIC: ${topic.code} - ${topic.title}
LEVEL: ${topic.level}

COMMON MISCONCEPTIONS TO ADDRESS:
${misconceptions.map((m) => `- ${m.wrongIdea}`).join('\n')}

Create ${count} practice questions:
- Mix of multiple-choice (4), numeric (3), and short-answer (3)
- Graduated difficulty
- Some should specifically test common misconceptions

For each question:
1. id - Unique identifier
2. difficulty - "foundation" | "core" | "extended"
3. question - Clear question text
4. questionType - "multiple-choice" | "numeric" | "short-answer"
5. options - For multiple choice: [{ label, value, isCorrect }]
6. correctAnswer - The correct answer
7. hint - A helpful hint (not giving away the answer)
8. solutionSteps - Brief solution steps
9. feedbackCorrect - Encouraging message for correct answer
10. feedbackIncorrect - Helpful feedback explaining the error
11. addressesMisconception - ID of misconception this tests (if applicable)

Return ONLY valid JSON array.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  try {
    return parseJsonResponse(content.text);
  } catch {
    console.error('Failed to parse practice questions:', content.text);
    throw new Error('Failed to parse practice questions');
  }
}

/**
 * Generate end-of-lesson quiz
 */
async function generateQuiz(
  topic: SyllabusTopic,
  practiceQuestions: PracticeQuestion[]
) {
  // Select 5-6 questions from practice for the quiz
  const quizQuestions = practiceQuestions
    .filter((q) => q.difficulty !== 'foundation')
    .slice(0, 6);

  return {
    id: `quiz-${topic.code}`,
    title: `${topic.title} - Check Your Understanding`,
    description: `Test your knowledge of ${topic.title}. Aim for 80% or higher!`,
    passingScore: 80,
    timeLimit: 15,
    questions: quizQuestions,
    scormObjectiveId: `obj-${topic.code}-quiz`,
    reportToLMS: true,
  };
}

/**
 * Select best visual style based on topic
 */
function selectBestStyle(topic: SyllabusTopic): VisualStyle {
  const code = topic.code.toLowerCase();
  const title = topic.title.toLowerCase();

  // Geometry topics → Blueprint
  if (code.includes('4') || title.includes('geometry') || title.includes('angle')) {
    return 'blueprint';
  }

  // Circle theorems → Shape morphing
  if (title.includes('circle') || title.includes('theorem')) {
    return 'shape-morphing';
  }

  // Algebra/Graphs → Minimal
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

  // Default for engaging teens
  return 'neon-glow';
}

/**
 * Calculate estimated lesson duration
 */
function calculateDuration(
  theorySections: TheorySection[],
  workedExamples: WorkedExample[]
): number {
  // Rough estimates:
  // - Theory section: 5-8 minutes each
  // - Worked example: 3-5 minutes each
  // - Practice: 1-2 minutes per question
  const theoryTime = theorySections.length * 6;
  const exampleTime = workedExamples.length * 4;

  return theoryTime + exampleTime + 10; // +10 for intro/summary
}

/**
 * Generate SCORM metadata
 */
function generateScormMetadata(topic: SyllabusTopic, structure: any) {
  return {
    identifier: `igcse-0580-${topic.code.toLowerCase().replace('.', '-')}`,
    title: `IGCSE Maths: ${topic.title}`,
    description: `Cambridge IGCSE Mathematics (0580) - ${topic.title}. ${topic.level} level content.`,
    objectives: structure.objectives.map((obj: any, i: number) => ({
      id: `obj-${topic.code}-${i + 1}`,
      description: obj.description,
      successThreshold: 0.8,
    })),
    sequencing: {
      completionThreshold: 0.9,
      attemptLimit: 3,
    },
  };
}

export {
  SyllabusTopic,
  generateLessonStructure,
  generateTheorySections,
  generateMisconceptions,
  generateWorkedExamples,
  generatePracticeQuestions,
};
