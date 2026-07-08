/**
 * Canonical IGCSE Lesson Schema (frozen)
 *
 * The single, authoritative shape for a student-app lesson. Based on the rich
 * C1.2 "Introduction to Sets" lesson, with the additions the student app needs
 * for mastery tracking, spaced repetition, and per-question analytics.
 *
 * Key rules (enforced by `validateLesson` in the backend):
 *  - Every practice AND quiz question has a stable, lesson-unique `id`
 *    (convention: `<topicCode>-p<N>` for practice, `<topicCode>-q<N>` for quiz).
 *  - Every question has a `skillTag` (e.g. "sets.union") powering mastery/SR.
 *  - Multiple-choice uses ONE encoding: `options: {id,text}[]` + `correctOptionId`.
 *    The legacy `options[].isCorrect`, plain `answer`, and numeric-index formats
 *    are NOT part of the canonical schema.
 *  - Every question carries `feedbackCorrect` / `feedbackIncorrect`.
 *  - Difficulty is a single enum: 'foundation' | 'core' | 'extended'.
 *
 * A lesson does not ship unless `validateLesson` passes. See docs/LESSON-SCHEMA.md.
 */

export type Difficulty = 'foundation' | 'core' | 'extended';

export type LessonLevel = 'Core' | 'Extended';

export type ExamWeight = 'low' | 'medium' | 'high';

// ---------------------------------------------------------------------------
// Questions (shared shape for practice questions AND quiz questions)
// ---------------------------------------------------------------------------

export interface QuestionOption {
  /** Stable option id, unique within the question (e.g. "a", "b"). */
  id: string;
  /** Display text for the option. */
  text: string;
}

/** Free-response question types (everything that is not multiple-choice). */
export type FreeResponseType = 'numeric' | 'short-answer' | 'true-false';

/** Fields common to every question, regardless of encoding. */
interface QuestionBase {
  /** Stable, lesson-unique id. Convention: `<topicCode>-p<N>` / `<topicCode>-q<N>`. */
  id: string;
  /** Mastery / spaced-repetition key, e.g. "sets.union", "sets.venn-regions". */
  skillTag: string;
  difficulty: Difficulty;
  question: string;
  hint?: string;
  solutionSteps?: string[];
  /** Shown when the learner answers correctly. Required on every question. */
  feedbackCorrect: string;
  /** Shown when the learner answers incorrectly. Required on every question. */
  feedbackIncorrect: string;
  /** Optional link to a misconception this question targets (Misconception.id). */
  addressesMisconception?: string;
}

/**
 * Multiple-choice: the ONE canonical answer encoding.
 * Requires `options` + `correctOptionId`; the legacy `correctAnswer`/`answer`
 * and numeric-index formats are structurally excluded.
 */
export interface MultipleChoiceQuestion extends QuestionBase {
  questionType: 'multiple-choice';
  options: QuestionOption[];
  correctOptionId: string;
}

/** Free-response: carries its own text/numeric answer, never options. */
export interface FreeResponseQuestion extends QuestionBase {
  questionType: FreeResponseType;
  correctAnswer: string;
  acceptableAnswers?: string[];
}

/** Discriminated union on `questionType`. */
export type Question = MultipleChoiceQuestion | FreeResponseQuestion;

export type QuestionType = Question['questionType'];

// ---------------------------------------------------------------------------
// Objectives & prior knowledge
// ---------------------------------------------------------------------------

export interface LearningObjective {
  id: string;
  /** Bloom-style verb, e.g. "recall", "understand", "apply", "analyze". */
  verb: string;
  description: string;
  assessable: boolean;
  examWeight: ExamWeight;
}

export interface PriorKnowledge {
  /** Linkable topic code of the prerequisite lesson, e.g. "C1.1". */
  topicCode: string;
  topicTitle: string;
  specificConcepts: string[];
  checkQuestion?: string;
}

// ---------------------------------------------------------------------------
// Theory sections & typed content blocks
// ---------------------------------------------------------------------------

export interface KeyDefinition {
  term: string;
  definition: string;
  example?: string;
}

export interface KeyFormula {
  name: string;
  latex: string;
  explanation?: string;
  whenToUse?: string;
}

interface ContentBlockBase {
  id: string;
  title?: string;
  description?: string;
  /** Narration synced to the visual (drives the app's audio + reveal timing). */
  narrationText?: string;
}

export interface GeminiDiagramBlock extends ContentBlockBase {
  type: 'gemini-diagram';
  geminiPrompt: string;
  /** Non-empty when the image has been generated. */
  imagePath?: string;
}

export interface SvgAnimationBlock extends ContentBlockBase {
  type: 'svg-animation';
  style?: string;
  animationDuration?: number;
  videoPath?: string;
}

export interface ManimAnimationBlock extends ContentBlockBase {
  type: 'manim-animation';
  style?: string;
  animationDuration?: number;
  videoPath?: string;
}

export interface LatexFormulaBlock extends ContentBlockBase {
  type: 'latex-formula';
  latex: string;
  formulaName?: string;
}

export interface InteractiveBlock extends ContentBlockBase {
  type: 'interactive';
  interactiveType: string;
  interactiveConfig: Record<string, unknown>;
}

/** Prose block for text-first lessons — `body` is the display prose. */
export interface TextBlock extends ContentBlockBase {
  type: 'text';
  body: string;
}

export type ContentBlock =
  | GeminiDiagramBlock
  | SvgAnimationBlock
  | ManimAnimationBlock
  | LatexFormulaBlock
  | InteractiveBlock
  | TextBlock;

export interface TheorySection {
  id: string;
  title: string;
  order: number;
  introduction: string;
  keyQuestion?: string;
  content: ContentBlock[];
  keyDefinitions?: KeyDefinition[];
  keyFormulas?: KeyFormula[];
  keyPoints?: string[];
  /** Ids of related WorkedExample entries. */
  relatedExamples?: string[];
}

// ---------------------------------------------------------------------------
// Misconceptions & worked examples
// ---------------------------------------------------------------------------

export interface Misconception {
  id: string;
  wrongIdea: string;
  whyWrong: string;
  correctUnderstanding: string;
  exampleOfMistake?: string;
  correctExample?: string;
}

export interface WorkedExampleStep {
  stepNumber: number;
  instruction: string;
  working: string;
  explanation?: string;
  commonError?: string;
}

export interface WorkedExample {
  id: string;
  difficulty: Difficulty;
  questionType: string;
  question: string;
  marks?: number;
  steps: WorkedExampleStep[];
  answer: string;
  examTip?: string;
  marksBreakdown?: string;
}

// ---------------------------------------------------------------------------
// Quiz, summary, media, SCORM, generation metadata
// ---------------------------------------------------------------------------

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  passingScore: number;
  timeLimit?: number;
  scormObjectiveId?: string;
  reportToLMS?: boolean;
  questions: Question[];
}

export interface SummaryVideo {
  title: string;
  description?: string;
  videoPath: string;
  duration?: number;
}

export interface LessonSummary {
  keyTakeaways: string[];
  formulaSheet?: string[];
  examTips: string[];
  /** Free-text next topics (e.g. "C1.3 - Powers and roots"). */
  nextTopics?: string[];
}

export interface ScormObjective {
  id: string;
  description: string;
  successThreshold: number;
}

export interface ScormBlock {
  identifier: string;
  title: string;
  description?: string;
  objectives: ScormObjective[];
  sequencing?: {
    completionThreshold?: number;
    attemptLimit?: number;
  };
}

export interface GenerationMeta {
  generatedAt: string;
  generatedBy: string;
  promptVersion?: string;
  reviewStatus?: string;
  reviewNotes?: string;
}

export interface LessonOpening {
  hook: string;
  realWorldConnection: string;
}

// ---------------------------------------------------------------------------
// Canonical lesson root
// ---------------------------------------------------------------------------

export interface CanonicalLesson {
  id: string;
  /** Canonical topic identifier, e.g. "C1.2". Used as the id prefix convention. */
  topicCode: string;
  /** Optional exam-board syllabus code, e.g. "0580". */
  syllabusCode?: string;
  title: string;
  level: LessonLevel;
  difficulty: Difficulty;
  estimatedDuration?: number;
  lastUpdated?: string;
  version?: string;
  preferredStyle?: string;

  opening: LessonOpening;
  priorKnowledge?: PriorKnowledge[];
  priorKnowledgeCheck?: Question[];
  objectives: LearningObjective[];
  theorySections: TheorySection[];
  misconceptions?: Misconception[];
  workedExamples: WorkedExample[];
  practiceQuestions: Question[];
  quiz: Quiz;
  summaryVideo?: SummaryVideo;
  summary: LessonSummary;
  scorm?: ScormBlock;
  generation?: GenerationMeta;
}
