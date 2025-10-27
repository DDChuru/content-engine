/**
 * Interactive Educational Content API Routes
 *
 * Provides endpoints for step-by-step interactive learning
 */

import express, { Request, Response } from 'express';
import { InteractiveContentGenerator } from '../services/interactive-content-generator.js';
import {
  GenerateInteractiveProblemRequest,
  GenerateInteractiveProblemResponse,
  GetProblemRequest,
  GetProblemResponse,
  RevealStepRequest,
  RevealStepResponse,
  ProblemProgress
} from '../types/interactive-lesson.js';
import path from 'path';

const router = express.Router();

// Lazy-load generator (only create when first used, after env vars are loaded)
let generator: InteractiveContentGenerator | null = null;
function getGenerator(): InteractiveContentGenerator {
  if (!generator) {
    generator = new InteractiveContentGenerator('output/interactive');
  }
  return generator;
}

// In-memory progress tracking (replace with database in production)
const progressStore = new Map<string, ProblemProgress>();

/**
 * POST /api/interactive/generate
 * Generate a new interactive problem
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const request: GenerateInteractiveProblemRequest = {
      topic: req.body.topic,
      difficulty: req.body.difficulty || 'intermediate',
      includeVisualizations: req.body.includeVisualizations ?? true,
      includeVideos: req.body.includeVideos ?? true,
      steps: req.body.steps
    };

    console.log('[Interactive API] Generating problem:', request);

    const problem = await getGenerator().generateInteractiveProblem(request);

    const response: GenerateInteractiveProblemResponse = {
      problem,
      generatedAssets: {
        visualizations: problem.steps
          .filter(s => s.visualization)
          .map(s => `/api/interactive/visualizations/${problem.id}/${s.id}.mp4`),
        videos: problem.steps
          .filter(s => s.manimVideo)
          .map(s => `/api/interactive/videos/${problem.id}/${s.id}.mp4`)
      },
      estimatedCost: 0.5  // Rough estimate: Claude + potential Gemini images
    };

    res.json(response);
  } catch (error) {
    console.error('[Interactive API] Error generating problem:', error);
    res.status(500).json({
      error: 'Failed to generate interactive problem',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/interactive/problems/:problemId
 * Get a problem by ID
 */
router.get('/problems/:problemId', async (req: Request, res: Response) => {
  try {
    const { problemId } = req.params;
    const userId = req.query.userId as string | undefined;

    const problem = await getGenerator().loadProblem(problemId);
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }

    // Get user progress if userId provided
    let progress: ProblemProgress | undefined;
    if (userId) {
      const progressKey = `${userId}-${problemId}`;
      progress = progressStore.get(progressKey);

      if (!progress) {
        // Initialize progress
        progress = {
          problemId,
          userId,
          revealedSteps: [],
          startedAt: new Date(),
          lastViewedAt: new Date(),
          hintsUsed: 0,
          timeSpentSeconds: 0
        };
        progressStore.set(progressKey, progress);
      } else {
        progress.lastViewedAt = new Date();
      }
    }

    const response: GetProblemResponse = {
      problem,
      progress
    };

    res.json(response);
  } catch (error) {
    console.error('[Interactive API] Error fetching problem:', error);
    res.status(500).json({
      error: 'Failed to fetch problem',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/interactive/problems/:problemId/reveal
 * Reveal a step in the problem
 */
router.post('/problems/:problemId/reveal', async (req: Request, res: Response) => {
  try {
    const { problemId } = req.params;
    const { stepId, userId } = req.body as RevealStepRequest;

    const problem = await getGenerator().loadProblem(problemId);
    if (!problem) {
      res.status(404).json({ error: 'Problem not found' });
      return;
    }

    const step = problem.steps.find(s => s.id === stepId);
    if (!step) {
      res.status(404).json({ error: 'Step not found' });
      return;
    }

    // Update progress
    if (userId) {
      const progressKey = `${userId}-${problemId}`;
      const progress = progressStore.get(progressKey);
      if (progress && !progress.revealedSteps.includes(stepId)) {
        progress.revealedSteps.push(stepId);

        // Check if problem completed
        if (progress.revealedSteps.length === problem.steps.length) {
          progress.completedAt = new Date();
        }
      }
    }

    // Render visualization if needed
    let visualization: { type: 'svg' | 'video'; url: string } | undefined;
    if (step.visualization) {
      const vizUrl = await getGenerator().renderStepVisualization(step, problemId);
      if (vizUrl) {
        visualization = { type: 'video', url: vizUrl };
      }
    }

    // Render Manim video if needed
    let manimVideo: { url: string; duration: number } | undefined;
    if (step.manimVideo) {
      const videoUrl = await getGenerator().renderStepManimVideo(step, problemId);
      if (videoUrl) {
        manimVideo = {
          url: videoUrl,
          duration: step.manimVideo.duration
        };
      }
    }

    // Find next step
    const currentIndex = problem.steps.findIndex(s => s.id === stepId);
    const nextStepId = currentIndex < problem.steps.length - 1
      ? problem.steps[currentIndex + 1].id
      : undefined;

    const response: RevealStepResponse = {
      step,
      visualization,
      manimVideo,
      nextStepId
    };

    res.json(response);
  } catch (error) {
    console.error('[Interactive API] Error revealing step:', error);
    res.status(500).json({
      error: 'Failed to reveal step',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/interactive/visualizations/:problemId/:stepId.mp4
 * Serve visualization video
 */
router.get('/visualizations/:problemId/:stepId', async (req: Request, res: Response) => {
  try {
    const { problemId, stepId } = req.params;
    const videoPath = path.join('output/interactive/visualizations', problemId, `${stepId}.mp4`);

    res.sendFile(path.resolve(videoPath));
  } catch (error) {
    res.status(404).json({ error: 'Visualization not found' });
  }
});

/**
 * GET /api/interactive/videos/:problemId/:stepId.mp4
 * Serve Manim video
 */
router.get('/videos/:problemId/:stepId', async (req: Request, res: Response) => {
  try {
    const { problemId, stepId } = req.params;
    const videoPath = path.join('output/interactive/videos', problemId, `${stepId}.mp4`);

    res.sendFile(path.resolve(videoPath));
  } catch (error) {
    res.status(404).json({ error: 'Video not found' });
  }
});

/**
 * GET /api/interactive/progress/:userId/:problemId
 * Get user progress for a problem
 */
router.get('/progress/:userId/:problemId', (req: Request, res: Response) => {
  const { userId, problemId } = req.params;
  const progressKey = `${userId}-${problemId}`;

  const progress = progressStore.get(progressKey);
  if (!progress) {
    res.status(404).json({ error: 'No progress found' });
    return;
  }

  res.json(progress);
});

/**
 * GET /api/interactive/health
 * Health check
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Interactive Educational Content API',
    features: {
      problemGeneration: true,
      d3Visualizations: true,
      manimVideos: true,
      progressTracking: true
    }
  });
});

export default router;
