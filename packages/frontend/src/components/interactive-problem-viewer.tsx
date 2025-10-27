'use client';

/**
 * Interactive Problem Viewer
 *
 * Click-through component for step-by-step problem solving
 * with D3 visualizations and Manim video explanations
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Check, Lightbulb, Play, Eye } from 'lucide-react';

// ============================================================================
// Types (mirror backend types)
// ============================================================================

interface InteractiveProblem {
  id: string;
  title: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: {
    text: string;
    latex?: string;
    visualization?: any;
    image?: string;
  };
  steps: InteractiveStep[];
  tags: string[];
  estimatedTime: number;
  createdAt: Date;
}

interface InteractiveStep {
  id: string;
  order: number;
  title: string;
  explanation: string;
  latex?: string;
  visualization?: any;
  manimVideo?: {
    script: string;
    duration: number;
    videoUrl?: string;
  };
  staticImage?: string;
  revealType: 'click' | 'auto' | 'conditional';
  hint?: string;
  transitionEffect?: 'fade' | 'slide' | 'zoom';
}

interface ProblemProgress {
  problemId: string;
  userId: string;
  revealedSteps: string[];
  startedAt: Date;
  lastViewedAt: Date;
  completedAt?: Date;
  hintsUsed: number;
  timeSpentSeconds: number;
}

// ============================================================================
// Component
// ============================================================================

interface InteractiveProblemViewerProps {
  problemId: string;
  userId?: string;
  backendUrl?: string;
}

export function InteractiveProblemViewer({
  problemId,
  userId = 'guest',
  backendUrl = 'http://localhost:3001'
}: InteractiveProblemViewerProps) {
  const [problem, setProblem] = useState<InteractiveProblem | null>(null);
  const [progress, setProgress] = useState<ProblemProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Current step being viewed
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);

  // Revealed steps
  const [revealedSteps, setRevealedSteps] = useState<Set<string>>(new Set());

  // Hint visibility
  const [showHint, setShowHint] = useState(false);

  // Media URLs
  const [stepMedia, setStepMedia] = useState<Map<string, { visualization?: string; video?: string }>>(new Map());

  // ========================================
  // Load problem on mount
  // ========================================
  useEffect(() => {
    loadProblem();
  }, [problemId]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${backendUrl}/api/interactive/problems/${problemId}?userId=${userId}`
      );

      if (!response.ok) {
        throw new Error('Failed to load problem');
      }

      const data = await response.json();
      setProblem(data.problem);
      setProgress(data.progress);

      // Initialize revealed steps from progress
      if (data.progress) {
        setRevealedSteps(new Set(data.progress.revealedSteps));
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  };

  // ========================================
  // Reveal step
  // ========================================
  const revealStep = async (stepId: string) => {
    if (!problem) return;

    try {
      const response = await fetch(
        `${backendUrl}/api/interactive/problems/${problemId}/reveal`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepId, userId })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to reveal step');
      }

      const data = await response.json();

      // Update revealed steps
      setRevealedSteps(prev => new Set([...prev, stepId]));

      // Store media URLs
      if (data.visualization || data.manimVideo) {
        const media = stepMedia.get(stepId) || {};
        if (data.visualization) media.visualization = data.visualization.url;
        if (data.manimVideo) media.video = data.manimVideo.url;
        setStepMedia(new Map(stepMedia.set(stepId, media)));
      }

      // Move to this step
      const stepIndex = problem.steps.findIndex(s => s.id === stepId);
      setCurrentStepIndex(stepIndex);
      setShowHint(false);
    } catch (err) {
      console.error('Error revealing step:', err);
    }
  };

  // ========================================
  // Render helpers
  // ========================================
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const isStepRevealed = (stepId: string) => revealedSteps.has(stepId);

  // ========================================
  // Render states
  // ========================================
  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
          <p className="text-center mt-4 text-gray-500">Loading interactive problem...</p>
        </CardContent>
      </Card>
    );
  }

  if (error || !problem) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <p className="text-red-500">Error: {error || 'Problem not found'}</p>
          <Button onClick={loadProblem} className="mt-4">Retry</Button>
        </CardContent>
      </Card>
    );
  }

  // ========================================
  // Main render
  // ========================================
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Problem Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{problem.title}</CardTitle>
              <CardDescription className="mt-2">
                {problem.subject} • {problem.estimatedTime} minutes
              </CardDescription>
            </div>
            <Badge className={getDifficultyColor(problem.difficulty)}>
              {problem.difficulty}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {problem.tags.map(tag => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </CardHeader>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Question</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg whitespace-pre-wrap">{problem.question.text}</p>
          {problem.question.latex && (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono">
              {problem.question.latex}
            </div>
          )}
          {problem.question.image && (
            <img src={problem.question.image} alt="Question" className="mt-4 max-w-full rounded-lg" />
          )}
        </CardContent>
      </Card>

      {/* Steps */}
      <div className="space-y-4">
        {problem.steps.map((step, index) => {
          const revealed = isStepRevealed(step.id);
          const isCurrent = currentStepIndex === index;
          const media = stepMedia.get(step.id);

          return (
            <Card
              key={step.id}
              className={`transition-all duration-300 ${
                isCurrent ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {revealed ? (
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <span className="text-sm font-semibold">{index + 1}</span>
                      </div>
                    )}
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>

                  {!revealed && (
                    <Button
                      onClick={() => revealStep(step.id)}
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Reveal Step
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              {revealed && (
                <CardContent className="space-y-4">
                  {/* Explanation */}
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{step.explanation}</p>
                  </div>

                  {/* LaTeX */}
                  {step.latex && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg font-mono text-sm">
                      {step.latex}
                    </div>
                  )}

                  {/* D3 Visualization */}
                  {media?.visualization && (
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video
                        src={`${backendUrl}${media.visualization}`}
                        controls
                        autoPlay
                        loop
                        className="w-full"
                      />
                      <Badge className="absolute top-4 left-4 bg-blue-500">
                        D3 Visualization
                      </Badge>
                    </div>
                  )}

                  {/* Manim Video */}
                  {media?.video && (
                    <div className="relative rounded-lg overflow-hidden bg-black">
                      <video
                        src={`${backendUrl}${media.video}`}
                        controls
                        autoPlay
                        className="w-full"
                      />
                      <Badge className="absolute top-4 left-4 bg-purple-500">
                        <Play className="h-3 w-3 mr-1" />
                        Manim Animation
                      </Badge>
                    </div>
                  )}

                  {/* Static Image */}
                  {step.staticImage && (
                    <img
                      src={step.staticImage}
                      alt={step.title}
                      className="w-full rounded-lg"
                    />
                  )}

                  {/* Hint */}
                  {step.hint && (
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHint(!showHint)}
                        className="gap-2"
                      >
                        <Lightbulb className="h-4 w-4" />
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                      </Button>
                      {showHint && (
                        <div className="mt-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                          <p className="text-sm">{step.hint}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Progress Summary */}
      {progress && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <p className="text-2xl font-bold">
                  {revealedSteps.size} / {problem.steps.length} steps completed
                </p>
              </div>
              {progress.completedAt && (
                <Badge className="bg-green-500">
                  <Check className="h-4 w-4 mr-1" />
                  Completed
                </Badge>
              )}
            </div>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${(revealedSteps.size / problem.steps.length) * 100}%`
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
