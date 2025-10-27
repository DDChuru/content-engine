/**
 * Interactive Lesson Types
 *
 * Defines the structure for step-by-step interactive educational content
 * that combines D3 visualizations with Manim video explanations
 */

import { VizData } from '../services/d3-viz-engine.js';

// ============================================================================
// Core Types
// ============================================================================

/**
 * Interactive Problem - A question with step-by-step reveals
 */
export interface InteractiveProblem {
  id: string;
  title: string;
  subject: string;  // e.g., "Calculus", "Linear Algebra", "Statistics"
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Initial question display
  question: {
    text: string;
    latex?: string;  // LaTeX representation if mathematical
    visualization?: VizData;  // Optional D3 visualization for the question
    image?: string;  // Static image URL if needed
  };

  // Step-by-step solution reveals
  steps: InteractiveStep[];

  // Metadata
  tags: string[];
  estimatedTime: number;  // minutes
  createdAt: Date;
}

/**
 * A single step in the interactive solution
 */
export interface InteractiveStep {
  id: string;
  order: number;

  // Step content
  title: string;  // e.g., "Step 1: Identify the pattern"
  explanation: string;  // Text explanation
  latex?: string;  // Mathematical notation

  // Visual aids
  visualization?: VizData;  // D3 visualization for this step
  manimVideo?: ManimVideoConfig;  // Manim animation config
  staticImage?: string;  // Fallback image URL

  // Interactivity
  revealType: 'click' | 'auto' | 'conditional';
  hint?: string;  // Optional hint before revealing

  // Transitions
  transitionEffect?: 'fade' | 'slide' | 'zoom';
  duration?: number;  // seconds (for auto-reveal)
}

/**
 * Manim video configuration for a step
 */
export interface ManimVideoConfig {
  script: string;  // Python Manim script
  duration: number;  // seconds
  dimensions: {
    width: number;
    height: number;
  };
  // Pre-rendered video path (if already generated)
  videoUrl?: string;
  // Whether to render on-demand or use cached version
  renderMode: 'cached' | 'on-demand';
}

/**
 * Interactive lesson - A collection of related problems
 */
export interface InteractiveLesson {
  id: string;
  title: string;
  description: string;
  subject: string;

  // Problems in this lesson
  problems: InteractiveProblem[];

  // Learning objectives
  objectives: string[];

  // Prerequisites
  prerequisites?: string[];

  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;  // minutes
  tags: string[];
}

/**
 * User progress through an interactive problem
 */
export interface ProblemProgress {
  problemId: string;
  userId: string;

  // Which steps have been revealed
  revealedSteps: string[];  // Step IDs

  // Timestamps
  startedAt: Date;
  lastViewedAt: Date;
  completedAt?: Date;

  // Analytics
  hintsUsed: number;
  timeSpentSeconds: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface GenerateInteractiveProblemRequest {
  topic: string;  // e.g., "derivatives", "matrix multiplication"
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  includeVisualizations: boolean;
  includeVideos: boolean;
  steps?: number;  // Number of solution steps (default: auto-determine)
}

export interface GenerateInteractiveProblemResponse {
  problem: InteractiveProblem;
  generatedAssets: {
    visualizations: string[];  // Asset URLs
    videos: string[];  // Video URLs
  };
  estimatedCost: number;  // USD
}

export interface GetProblemRequest {
  problemId: string;
  userId?: string;  // Optional for progress tracking
}

export interface GetProblemResponse {
  problem: InteractiveProblem;
  progress?: ProblemProgress;
}

export interface RevealStepRequest {
  problemId: string;
  stepId: string;
  userId?: string;
}

export interface RevealStepResponse {
  step: InteractiveStep;
  visualization?: {
    type: 'svg' | 'video';
    url: string;
  };
  manimVideo?: {
    url: string;
    duration: number;
  };
  nextStepId?: string;  // ID of the next step to reveal
}

// ============================================================================
// Content Generation Types
// ============================================================================

/**
 * Prompt for Claude to generate interactive content
 */
export interface InteractiveContentPrompt {
  topic: string;
  difficulty: string;
  style: 'formal' | 'conversational' | 'socratic';
  includeVisualizations: boolean;
  includeVideos: boolean;
  targetSteps: number;
}

/**
 * Claude's structured output for an interactive problem
 */
export interface ClaudeInteractiveOutput {
  problem: {
    text: string;
    latex?: string;
  };
  steps: Array<{
    title: string;
    explanation: string;
    latex?: string;
    visualizationNeeded: boolean;
    visualizationDescription?: string;  // What to visualize
    manimScriptNeeded: boolean;
    manimScriptDescription?: string;  // What to animate
  }>;
  learningObjectives: string[];
  tags: string[];
}
