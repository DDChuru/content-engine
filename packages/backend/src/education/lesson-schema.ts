/**
 * Cambridge IGCSE Mathematics 0580 - Comprehensive Lesson Schema
 *
 * Core Principles:
 * - Visualization-first (SVG animations, Gemini diagrams, video)
 * - Age-appropriate language (14-16 year olds)
 * - Address common misconceptions
 * - Build on prior knowledge progressively
 * - Interactive examples with worked solutions
 * - SCORM-compliant for LMS deployment
 */

// Visual style options from our showcase
export type VisualStyle =
  | 'shape-morphing'    // Best for: transformations, moving points
  | 'blueprint'         // Best for: technical proofs, constructions
  | 'chalkboard'        // Best for: traditional explanations
  | 'neon-glow'         // Best for: attention-grabbing, teens
  | 'minimal-line-art'  // Best for: clean professional content
  | 'glassmorphism'     // Best for: modern UI feel
  | 'particle-trail'    // Best for: showing motion/paths
  | 'gradient-wave';    // Best for: dynamic social content

// Content types for different learning modalities
export type ContentType =
  | 'video'             // Explainer video (uploaded or generated)
  | 'svg-animation'     // Animated SVG (our theorem animations)
  | 'gemini-diagram'    // AI-generated diagram
  | 'manim-animation'   // 3Blue1Brown-style math animation
  | 'interactive'       // D3/React interactive widget
  | 'latex-formula'     // Mathematical notation
  | 'worked-example'    // Step-by-step solution
  | 'practice-question' // Self-assessment
  | 'quiz';             // Graded assessment

// Difficulty levels
export type DifficultyLevel = 'foundation' | 'core' | 'extended' | 'challenge';

// Prior knowledge requirement
export interface PriorKnowledge {
  topicCode: string;           // e.g., "C1.1" for Types of Number
  topicTitle: string;
  specificConcepts: string[];  // What exactly they need to know
  checkQuestion?: string;      // Quick self-check question
}

// Learning objective with Bloom's taxonomy
export interface LearningObjective {
  id: string;
  verb: string;                // Bloom's: recall, understand, apply, analyze, evaluate, create
  description: string;
  assessable: boolean;         // Can this be tested?
  examWeight?: 'low' | 'medium' | 'high';
}

// Common misconception with correction
export interface Misconception {
  id: string;
  wrongIdea: string;           // What students typically think
  whyWrong: string;            // Brief explanation
  correctUnderstanding: string;
  exampleOfMistake?: string;   // Show the error
  correctExample?: string;     // Show the fix
  visualExplanation?: ContentBlock;
}

// Visual content block
export interface ContentBlock {
  id: string;
  type: ContentType;
  title?: string;
  description?: string;

  // For video content
  videoUrl?: string;
  videoDuration?: number;      // seconds

  // For SVG/Manim animations
  svgPath?: string;
  animationDuration?: number;
  style?: VisualStyle;

  // For Gemini diagrams
  geminiPrompt?: string;
  imagePath?: string;

  // For LaTeX formulas
  latex?: string;
  formulaName?: string;

  // For interactive content
  interactiveType?: 'slider' | 'drag' | 'input' | 'graph' | 'venn' | 'calculator';
  interactiveConfig?: Record<string, unknown>;

  // Narration
  narrationText?: string;
  narrationAudioPath?: string;

  // Timing for video composition
  startTime?: number;
  duration?: number;
}

// Worked example with detailed steps
export interface WorkedExample {
  id: string;
  difficulty: DifficultyLevel;
  questionType: 'calculation' | 'proof' | 'construction' | 'interpretation' | 'application';

  // The problem
  question: string;
  questionImage?: ContentBlock;
  marks?: number;              // Exam-style marks

  // Step-by-step solution
  steps: {
    stepNumber: number;
    instruction: string;       // What to do
    working: string;           // The actual working
    explanation: string;       // Why we do this
    visual?: ContentBlock;     // Optional diagram/animation
    commonError?: string;      // What students often get wrong here
  }[];

  // Final answer
  answer: string;
  answerVisual?: ContentBlock;

  // Exam tips
  examTip?: string;
  marksBreakdown?: string;     // How marks are allocated
}

// Practice question for self-assessment
export interface PracticeQuestion {
  id: string;
  difficulty: DifficultyLevel;
  question: string;
  questionImage?: ContentBlock;

  // Answer options for multiple choice, or expected answer for free response
  questionType: 'multiple-choice' | 'numeric' | 'short-answer' | 'extended';
  options?: { label: string; value: string; isCorrect: boolean }[];
  correctAnswer: string;
  acceptableAnswers?: string[]; // Alternative correct forms

  // Feedback
  hint?: string;
  solutionSteps?: string[];
  feedbackCorrect: string;
  feedbackIncorrect: string;

  // Linked misconception
  addressesMisconception?: string;
}

// Quiz/Assessment
export interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number;        // Percentage
  timeLimit?: number;          // Minutes
  questions: PracticeQuestion[];

  // SCORM tracking
  scormObjectiveId: string;
  reportToLMS: boolean;
}

// Theory section
export interface TheorySection {
  id: string;
  title: string;
  order: number;

  // Introduction
  introduction: string;
  keyQuestion?: string;        // Engaging question to hook students

  // Main content blocks (mixed media)
  content: ContentBlock[];

  // Key formulas/definitions
  keyFormulas?: {
    name: string;
    latex: string;
    explanation: string;
    whenToUse: string;
  }[];

  keyDefinitions?: {
    term: string;
    definition: string;
    example?: string;
  }[];

  // Summary points
  keyPoints: string[];

  // Links to worked examples
  relatedExamples: string[];   // Example IDs
}

// Complete lesson structure
export interface Lesson {
  // Identification
  id: string;
  syllabusCode: string;        // e.g., "C1.2" or "E4.7"
  title: string;
  level: 'Core' | 'Extended';

  // Metadata
  estimatedDuration: number;   // Minutes
  difficulty: DifficultyLevel;
  lastUpdated: string;
  version: string;

  // Visual style preference for this topic
  preferredStyle: VisualStyle;

  // Opening section
  opening: {
    hook: string;              // Engaging opening statement/question
    realWorldConnection: string;
    videoIntro?: ContentBlock;
  };

  // Prerequisites
  priorKnowledge: PriorKnowledge[];
  priorKnowledgeCheck?: PracticeQuestion[];

  // Learning objectives
  objectives: LearningObjective[];

  // Main theory content
  theorySections: TheorySection[];

  // Common mistakes
  misconceptions: Misconception[];

  // Worked examples (lots of them!)
  workedExamples: WorkedExample[];

  // Practice questions
  practiceQuestions: PracticeQuestion[];

  // End of lesson quiz
  quiz: Quiz;

  // Summary
  summary: {
    keyTakeaways: string[];
    formulaSheet?: string[];   // Quick reference formulas
    examTips: string[];
    nextTopics: string[];      // What to study next
  };

  // SCORM packaging info
  scorm: {
    identifier: string;
    title: string;
    description: string;
    objectives: {
      id: string;
      description: string;
      successThreshold: number;
    }[];
    sequencing: {
      completionThreshold: number;
      attemptLimit?: number;
    };
  };

  // Generation metadata
  generation: {
    generatedAt: string;
    generatedBy: string;
    promptVersion: string;
    reviewStatus: 'draft' | 'review' | 'approved' | 'published';
    reviewNotes?: string;
  };
}

// Topic generation request
export interface LessonGenerationRequest {
  syllabusCode: string;
  level: 'Core' | 'Extended';
  preferredStyle?: VisualStyle;

  // Content preferences
  includeVideo: boolean;
  includeInteractive: boolean;
  exampleCount: number;        // How many worked examples
  practiceCount: number;       // How many practice questions

  // Voice narration
  generateNarration: boolean;
  voiceId?: string;            // ElevenLabs voice ID

  // Generation options
  useGeminiDiagrams: boolean;
  useManimAnimations: boolean;
  useSvgAnimations: boolean;
}

// Generation progress tracking
export interface GenerationProgress {
  lessonId: string;
  status: 'queued' | 'generating' | 'review' | 'complete' | 'error';

  steps: {
    structure: 'pending' | 'complete';
    objectives: 'pending' | 'complete';
    theory: 'pending' | 'complete';
    diagrams: 'pending' | 'complete';
    animations: 'pending' | 'complete';
    examples: 'pending' | 'complete';
    practice: 'pending' | 'complete';
    quiz: 'pending' | 'complete';
    narration: 'pending' | 'complete';
    scorm: 'pending' | 'complete';
  };

  currentStep: string;
  progress: number;            // 0-100

  estimatedCost: number;
  actualCost: number;

  errors?: string[];
  warnings?: string[];
}

export default Lesson;
