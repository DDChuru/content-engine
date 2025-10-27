/**
 * Education Content Generation API Routes
 *
 * Endpoints for automated 3-layer content generation:
 * - Layer 1: Main course content (video lessons)
 * - Layer 2: Worked examples (step-by-step videos)
 * - Layer 3: Exercise questions (interactive quizzes)
 *
 * Also provides SCORM packaging and batch processing
 */

import express, { Request, Response } from 'express';
import { TopicContentGenerator, GenerationOptions } from '../services/topic-content-generator.js';
import { SCORMPackager } from '../services/scorm-packager.js';
import { ClaudeService } from '../services/claude.js';
import * as path from 'path';

const router = express.Router();

/**
 * POST /api/education/topics/:topicId/generate
 *
 * Generate complete 3-layer content for a topic
 *
 * Body:
 * {
 *   "syllabusId": "cambridge-igcse-0580",
 *   "unitId": "c1-number",
 *   "voiceId": "optional-elevenlabs-voice-id",
 *   "theme": "education-dark",
 *   "includeLayers": {
 *     "mainContent": true,
 *     "examples": true,
 *     "exercises": true
 *   }
 * }
 */
router.post('/topics/:topicId/generate', async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const { syllabusId, unitId, voiceId, theme, includeLayers } = req.body;

    if (!syllabusId || !unitId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: syllabusId, unitId'
      });
    }

    console.log(`\n[API] Generate content request: ${topicId}`);
    console.log(`  Syllabus: ${syllabusId}`);
    console.log(`  Unit: ${unitId}`);

    // Get Claude service from app locals
    const claudeService = req.app.locals.claudeService as ClaudeService;

    if (!claudeService) {
      return res.status(500).json({
        success: false,
        error: 'Claude service not initialized'
      });
    }

    // Create generator
    const generator = new TopicContentGenerator(claudeService);

    // Generate complete content
    const result = await generator.generateComplete(syllabusId, unitId, topicId, {
      voiceId,
      theme: theme || 'education-dark',
      includeLayers: includeLayers || {
        mainContent: true,
        examples: true,
        exercises: true
      }
    });

    // Return result
    res.json({
      success: true,
      topic: {
        id: result.topic.topicId,
        code: result.topic.topicCode,
        title: result.topic.title,
        level: result.topic.level
      },
      layers: {
        layer1: {
          videoPath: result.layer1.videoPath,
          concepts: result.layer1.concepts.length,
          duration: result.layer1.duration,
          cost: result.layer1.cost
        },
        layer2: {
          examples: result.layer2.examples.length,
          totalDuration: result.layer2.totalDuration,
          cost: result.layer2.cost
        },
        layer3: {
          questions: result.layer3.questions.length,
          quizPath: result.layer3.quizHtmlPath,
          cost: result.layer3.cost
        }
      },
      totalCost: result.totalCost,
      generatedAt: result.generatedAt,
      outputDir: result.outputDir
    });

  } catch (error: any) {
    console.error('[API] Generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

/**
 * GET /api/education/topics/:topicId/status
 *
 * Check if content has been generated for a topic
 *
 * Query params:
 * ?syllabusId=cambridge-igcse-0580&unitId=c1-number
 */
router.get('/topics/:topicId/status', async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const { syllabusId, unitId } = req.query;

    if (!syllabusId || !unitId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query params: syllabusId, unitId'
      });
    }

    // TODO: Query Firestore to check topic generation status
    // For now, return placeholder

    res.json({
      success: true,
      topic: {
        id: topicId,
        syllabusId,
        unitId
      },
      status: {
        generated: false,
        layers: {
          mainContent: false,
          examples: false,
          exercises: false
        },
        generatedAt: null,
        cost: null
      }
    });

  } catch (error: any) {
    console.error('[API] Status check failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education/batch-generate
 *
 * Generate content for multiple topics (batch processing)
 *
 * Body:
 * {
 *   "syllabusId": "cambridge-igcse-0580",
 *   "topics": [
 *     { "unitId": "c1-number", "topicId": "sets" },
 *     { "unitId": "c1-number", "topicId": "types-of-number" }
 *   ],
 *   "voiceId": "optional-voice-id",
 *   "theme": "education-dark"
 * }
 */
router.post('/batch-generate', async (req: Request, res: Response) => {
  try {
    const { syllabusId, topics, voiceId, theme } = req.body;

    if (!syllabusId || !topics || !Array.isArray(topics)) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: syllabusId, topics (array)'
      });
    }

    console.log(`\n[API] Batch generate request: ${topics.length} topics`);

    const claudeService = req.app.locals.claudeService as ClaudeService;

    if (!claudeService) {
      return res.status(500).json({
        success: false,
        error: 'Claude service not initialized'
      });
    }

    const generator = new TopicContentGenerator(claudeService);
    const results = [];
    const errors = [];

    // Process topics sequentially (could parallelize later)
    for (const topic of topics) {
      try {
        console.log(`\n[Batch] Processing: ${topic.topicId}`);

        const result = await generator.generateComplete(
          syllabusId,
          topic.unitId,
          topic.topicId,
          { voiceId, theme: theme || 'education-dark' }
        );

        results.push({
          topicId: topic.topicId,
          success: true,
          cost: result.totalCost,
          duration: result.layer1.duration
        });

      } catch (error: any) {
        console.error(`[Batch] Failed: ${topic.topicId}`, error);
        errors.push({
          topicId: topic.topicId,
          error: error.message
        });
      }
    }

    const totalCost = results.reduce((sum, r) => sum + r.cost, 0);
    const successCount = results.length;
    const failureCount = errors.length;

    res.json({
      success: true,
      summary: {
        total: topics.length,
        succeeded: successCount,
        failed: failureCount,
        totalCost
      },
      results,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error('[API] Batch generation failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/education-content/topics/:topicId/package-scorm
 *
 * Create SCORM 1.2/2004 package for a topic
 *
 * Body:
 * {
 *   "topicTitle": "Sets",
 *   "topicCode": "C1.2",
 *   "level": "Core",
 *   "mainVideoPath": "output/topics/sets/main-content/sets-lesson.mp4",
 *   "exampleVideoPaths": ["output/topics/sets/examples/example-1.mp4"],
 *   "quizHtmlPath": "output/topics/sets/exercises/quiz.html",
 *   "scormVersion": "1.2" | "2004"
 * }
 */
router.post('/topics/:topicId/package-scorm', async (req: Request, res: Response) => {
  try {
    const { topicId } = req.params;
    const {
      topicTitle,
      topicCode,
      level,
      mainVideoPath,
      exampleVideoPaths,
      quizHtmlPath,
      scormVersion
    } = req.body;

    if (!topicTitle || !topicCode || !level) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topicTitle, topicCode, level'
      });
    }

    console.log(`\n[API] SCORM packaging request: ${topicId}`);
    console.log(`  Version: ${scormVersion || '1.2'}`);

    const packager = new SCORMPackager();

    const outputPath = path.join('output', 'scorm', `${topicId}-complete.zip`);

    const result = await packager.createPackage({
      topicId,
      topicTitle,
      topicCode,
      level,
      mainVideoPath,
      exampleVideoPaths,
      quizHtmlPath,
      outputPath,
      version: scormVersion || '1.2'
    });

    if (result.success) {
      res.json({
        success: true,
        topic: {
          id: topicId,
          title: topicTitle,
          code: topicCode
        },
        scormPackage: {
          path: result.packagePath,
          version: scormVersion || '1.2',
          size: `${(result.size! / 1024 / 1024).toFixed(2)} MB`,
          compliant: true
        }
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error: any) {
    console.error('[API] SCORM packaging failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/summary
 *
 * Get overview of all topics and their generation status
 *
 * Query params:
 * ?syllabusId=cambridge-igcse-0580
 */
router.get('/summary', async (req: Request, res: Response) => {
  try {
    const { syllabusId } = req.query;

    if (!syllabusId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query param: syllabusId'
      });
    }

    console.log(`\n[API] Summary request: ${syllabusId}`);

    // TODO: Query Firestore for all topics and their status
    // For now, return placeholder

    res.json({
      success: true,
      syllabus: {
        id: syllabusId,
        title: 'Cambridge IGCSE Mathematics 0580'
      },
      statistics: {
        totalTopics: 99,
        generated: 0,
        pending: 99,
        totalCost: 0,
        estimatedTotalCost: 99 * 2.56
      },
      topics: [
        {
          code: 'C1.2',
          title: 'Sets',
          status: 'pending',
          estimatedCost: 2.56
        }
        // ... more topics
      ]
    });

  } catch (error: any) {
    console.error('[API] Summary request failed:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/education/health
 *
 * Health check for education content generation system
 */
router.get('/health', (req: Request, res: Response) => {
  const claudeService = req.app.locals.claudeService as ClaudeService;

  res.json({
    success: true,
    service: 'education-content-generator',
    status: 'operational',
    features: {
      topicGeneration: true,
      batchProcessing: true,
      scormPackaging: false, // Not yet implemented
      layers: ['mainContent', 'examples', 'exercises']
    },
    dependencies: {
      claude: !!claudeService,
      videoRenderer: true,
      agentRegistry: true
    }
  });
});

export default router;
