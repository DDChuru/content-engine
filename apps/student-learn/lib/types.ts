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

// ---------------------------------------------------------------------------
// Exercise questions (the marking-platform question bank)
// ---------------------------------------------------------------------------
//
// These are ORIGINAL items modelled on the style of exam questions. They are
// never described as "past papers" and never reproduce Cambridge question text
// (see briefs/PLAN-marking-platform.md §9 — the copyright question is open).
//
// Shape rule: `ExerciseQuestion extends FreeResponseQuestion`, so an item is
// already a valid `Question` and the existing `gradeAnswer()` in
// components/question-card.tsx auto-marks the typed final answer with no
// adapter. Everything the marking platform needs (marks, mark scheme,
// provenance) is additive on top.
//
// Banks live in content/questions/<cluster>.json and are generated + gated by
// scripts/build-exercise-questions.py. Do not hand-edit a bank: edit the
// authoring source and re-run the gate.

/** A mark-scheme line. Cambridge tariff letters, kept deliberately. */
export type MarkType =
  /** Method: correct approach, follow-through allowed on an earlier slip. */
  | 'M'
  /** Accuracy: depends on the M mark above it being earned. */
  | 'A'
  /** Independent: awarded on its own (a stated result, a correct diagram). */
  | 'B';

export interface MarkSchemeStep {
  /** Stable within the item, e.g. "1a" — what a teacher ticks. */
  id: string;
  type: MarkType;
  marks: number;
  /** What earns it, in the teacher's words. */
  description: string;
  /** The working that earns it, LaTeX. Rendered to the marker, not the student. */
  latex?: string;
  /** M-step this A-step is conditional on. */
  dependsOn?: string;
}

export interface ExerciseAnswer {
  /** Exact value as authored, for the machine gate: "13/5", "2", "sqrt(2)/2". */
  exact: string;
  /** Decimal to the item's stated precision — what the student types. */
  value: string;
  /** Rendered form, LaTeX, e.g. "2.4\\ \\text{m s}^{-2}". */
  latex: string;
  unit?: string;
  /** Significant figures the answer is quoted to. */
  sigFigs?: number;
}

/** How this item came to exist, and who is accountable for it being right. */
export interface ExerciseProvenance {
  /** Free text: the syllabus skill and question style it was modelled on. */
  modelledOn: string;
  /** Author of the item — model id or a person. */
  generatedBy: string;
  generatedAt: string;
  /** The §14 solve gate result. Written only by the build script. */
  solveGate: {
    /** Labels of the independent solution routes that agreed. */
    routes: string[];
    /** true once SymPy confirmed the route agreement symbolically. */
    symbolicCheck: boolean;
    /** Significant figures the routes were compared to. Always 3. */
    agreedToSigFigs: number;
    checkedAt: string;
  };
  /**
   * Human sign-off. The pipeline NEVER writes this on its own authority —
   * it is stamped only by `--approve --by "<name>"`. Absent ⇒ not approved,
   * and the item must not be served.
   */
  approvedBy?: string;
  approvedAt?: string;
}

export interface ExerciseFigure {
  /** Path under /public, or a generator id once diagrams exist. */
  src?: string;
  /** Required whenever a figure is present. */
  alt: string;
  caption?: string;
}

export interface ExerciseQuestion extends FreeResponseQuestion {
  /** Syllabus topic code from lib/syllabus.ts, e.g. "M4.4a". */
  topicCode: string;
  /** Marks available for the whole item. Must equal sum of markScheme marks. */
  marks: number;
  markScheme: MarkSchemeStep[];
  answer: ExerciseAnswer;
  /** Realistic working time, minutes. */
  estimatedMinutes: number;
  figure?: ExerciseFigure;
  /** Misconception codes this item is diagnostic for, e.g. "M4.4a-X01". */
  diagnosticFor?: string[];
  provenance: ExerciseProvenance;
}

/** content/questions/<cluster>.json */
export interface ExerciseBank {
  /** Schema version — bump on any breaking field change. */
  schemaVersion: 1;
  cluster: string;
  title: string;
  /** Topic codes covered, for the §9 coverage check. */
  topicCodes: string[];
  generatedAt: string;
  questions: ExerciseQuestion[];
}
