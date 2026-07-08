/**
 * Lesson types for the student app.
 *
 * Shapes copied from the canonical lesson schema
 * (packages/shared/src/types/lesson-schema.ts) so this app stands alone —
 * do NOT import across the monorepo.
 *
 * The API can also return legacy lessons (e.g. C1.5): no `opening`,
 * `learningObjectives` (plain strings) instead of `objectives`, and
 * misconceptions as plain strings. `Lesson` below is tolerant of both;
 * `schemaWarnings` present on the response means legacy. Render what
 * exists, omit sections cleanly when absent.
 */

export type Difficulty = 'foundation' | 'core' | 'extended';

export type LessonLevel = 'Core' | 'Extended';

export type ExamWeight = 'low' | 'medium' | 'high';

// ---------------------------------------------------------------------------
// Questions (shared shape for practice questions AND quiz questions)
// ---------------------------------------------------------------------------

export interface QuestionOption {
  id: string;
  text: string;
}

export type FreeResponseType = 'numeric' | 'short-answer' | 'true-false';

interface QuestionBase {
  id: string;
  skillTag: string;
  difficulty: Difficulty;
  question: string;
  hint?: string;
  solutionSteps?: string[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
  /** Optional link to a misconception this question targets (Misconception.id). */
  addressesMisconception?: string;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  questionType: 'multiple-choice';
  options: QuestionOption[];
  correctOptionId: string;
}

export interface FreeResponseQuestion extends QuestionBase {
  questionType: FreeResponseType;
  correctAnswer: string;
  acceptableAnswers?: string[];
}

export type Question = MultipleChoiceQuestion | FreeResponseQuestion;

// ---------------------------------------------------------------------------
// Objectives
// ---------------------------------------------------------------------------

export interface LearningObjective {
  id: string;
  verb: string;
  description: string;
  assessable: boolean;
  examWeight: ExamWeight;
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
  narrationText?: string;
}

export interface GeminiDiagramBlock extends ContentBlockBase {
  type: 'gemini-diagram';
  geminiPrompt: string;
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
// Quiz & summary
// ---------------------------------------------------------------------------

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  /** Percentage (0-100) required to pass. */
  passingScore: number;
  timeLimit?: number;
  questions: Question[];
}

export interface LessonSummary {
  keyTakeaways: string[];
  formulaSheet?: string[];
  examTips: string[];
  nextTopics?: string[];
}

export interface LessonOpening {
  hook: string;
  realWorldConnection: string;
}

// ---------------------------------------------------------------------------
// Lesson root (tolerant of canonical C1.2 and legacy C1.5 shapes)
// ---------------------------------------------------------------------------

export interface Lesson {
  id: string;
  /** Canonical topic identifier, e.g. "C1.2". */
  topicCode?: string;
  syllabusCode?: string;
  title: string;
  level?: LessonLevel;
  difficulty?: Difficulty;
  estimatedDuration?: number;

  /** Canonical only — absent on legacy lessons. */
  opening?: LessonOpening;
  /** Canonical objectives. */
  objectives?: LearningObjective[];
  /** Legacy objectives (plain strings). */
  learningObjectives?: string[];
  theorySections?: TheorySection[];
  /** Canonical: Misconception objects. Legacy: plain strings. */
  misconceptions?: Array<Misconception | string>;
  workedExamples?: WorkedExample[];
  practiceQuestions?: Question[];
  quiz?: Quiz;
  summary?: LessonSummary;
}

/** GET http://localhost:3001/api/education/topics/:code/lesson */
export interface LessonResponse {
  success: boolean;
  lesson: Lesson;
  source?: string;
  /** Present ⇒ legacy-shaped lesson. */
  schemaWarnings?: string[];
}
