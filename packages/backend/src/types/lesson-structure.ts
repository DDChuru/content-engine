/**
 * Enhanced Lesson Structure for Educational Videos
 *
 * Based on proven pedagogy:
 * 1. Thumbnail (3-5s) - Visual hook
 * 2. Introduction - Context and importance
 * 3. Theory - Core concepts
 * 4. Worked Example - Question display + step-by-step solution
 * 5. Common Pitfalls - What to avoid
 */

export interface LessonSegment {
  type: 'thumbnail' | 'introduction' | 'theory' | 'example' | 'pitfalls';
  title: string;
  narration: string;
  duration: number;
  visualType: 'manim' | 'gemini';
  content?: LessonContent;
}

export interface LessonContent {
  // For introduction
  examRelevance?: string;  // "Popular GCSE/A-Level topic"
  difficulty?: 'foundation' | 'higher' | 'advanced';

  // For theory
  theorem?: string;
  proof?: string[];
  diagrams?: string[];

  // For worked examples
  question?: QuestionDisplay;
  solution?: SolutionSteps;

  // For pitfalls
  mistakes?: CommonMistake[];
}

export interface QuestionDisplay {
  text: string;
  diagram?: string;
  givenInfo?: string[];
  findWhat?: string;
}

export interface SolutionSteps {
  approach: string;  // "This problem is typically solved in 3 steps"
  steps: Step[];
}

export interface Step {
  number: number;
  title: string;  // "Step 1: Identify the angles"
  explanation: string;
  calculation?: string;
  visual?: string;  // Manim visual hint
}

export interface CommonMistake {
  mistake: string;
  why: string;
  correct: string;
  showCross?: boolean;  // Display ✗ for wrong approach
  showTick?: boolean;   // Display ✓ for correct approach
}

export interface EnhancedModule {
  id: string;
  title: string;
  subject: 'maths' | 'physics' | 'chemistry';
  level: 'gcse' | 'a-level' | 'university';
  segments: LessonSegment[];
}

export interface ManimSceneConfig {
  type: 'introduction' | 'theory' | 'question' | 'solution_step' | 'pitfall';
  content: any;
  style?: 'default' | 'exam_board' | 'whiteboard';
}
