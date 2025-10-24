/**
 * TikTok Multilingual Pipeline API Routes
 *
 * Endpoints:
 * - POST   /api/tiktok/analyze          - Analyze video and find best moments
 * - POST   /api/tiktok/batch-render     - Render multilingual TikTok videos
 * - GET    /api/tiktok/status/:id       - Poll batch rendering progress
 * - GET    /api/tiktok/download/:file   - Download rendered video
 * - GET    /api/tiktok/languages        - Get supported languages
 * - DELETE /api/tiktok/cleanup/:id      - Clean up rendered videos
 * - POST   /api/tiktok/generate-video   - Generate AI video from prompt (Veo 3.1)
 * - POST   /api/tiktok/extend-video     - Extend existing video with Veo 3.1
 */

import { Router, Request, Response } from 'express';
import path from 'path';
import { promises as fs } from 'fs';
import { MomentAnalyzer } from '../services/tiktok/moment-analyzer.js';
import { BatchRenderer } from '../services/tiktok/batch-renderer.js';
import { VeoVideoGenerator } from '../services/tiktok/veo-video-generator.js';
import { sessionManager } from '../services/tiktok/session-manager.js';
import { operationTracker } from '../services/tiktok/operation-tracker.js';
import {
  SUPPORTED_LANGUAGES,
  DEFAULT_CAPTION_STYLE,
  DEFAULT_CTA_CONFIG,
} from '../services/tiktok/types.js';
import type {
  Moment,
  BatchConfig,
  CaptionStyle,
  CTAConfig,
  LanguageConfig,
} from '../services/tiktok/types.js';

const router = Router();

// Initialize services
const momentAnalyzer = new MomentAnalyzer(
  process.env.OPENAI_API_KEY!,
  process.env.ANTHROPIC_API_KEY!
);

const batchRenderer = new BatchRenderer(
  process.env.GEMINI_API_KEY,
  process.env.ELEVENLABS_API_KEY
);

const veoGenerator = new VeoVideoGenerator(
  process.env.GOOGLE_CLOUD_API_KEY,
  process.env.GOOGLE_CLOUD_PROJECT_ID,
  (process.env.VEO_MODEL_VERSION as '3.0' | '3.1') || '3.1'
);

/**
 * POST /api/tiktok/analyze
 * Analyze video and find best viral moments
 */
router.post('/analyze', async (req: Request, res: Response) => {
  try {
    const { videoPath, count = 10, duration = 60 } = req.body;

    // Validate inputs
    if (!videoPath) {
      return res.status(400).json({
        error: 'videoPath is required',
      });
    }

    // Check if video file exists
    try {
      await fs.access(videoPath);
    } catch (error) {
      return res.status(404).json({
        error: 'Video file not found',
        path: videoPath,
      });
    }

    // Validate count and duration
    if (count < 1 || count > 50) {
      return res.status(400).json({
        error: 'count must be between 1 and 50',
      });
    }

    if (duration < 15 || duration > 180) {
      return res.status(400).json({
        error: 'duration must be between 15 and 180 seconds',
      });
    }

    console.log(`[TikTok API] Analyzing video: ${videoPath}`);
    console.log(`[TikTok API] Looking for ${count} moments of ${duration}s each`);

    // Find best moments
    const result = await momentAnalyzer.findBestMoments({
      videoPath,
      count,
      duration,
      frameInterval: 2,
    });

    // Get video info
    const videoInfo = {
      duration: result.totalDuration,
      resolution: '1920x1080', // Would be extracted from actual video
      fps: 30,
      codec: 'h264',
      size: 0, // Would be from file stats
    };

    res.json({
      moments: result.moments,
      totalDuration: result.totalDuration,
      videoInfo,
      analysisStats: {
        framesAnalyzed: result.framesAnalyzed,
        transcriptLength: result.transcriptLength,
        processingTime: result.processingTime,
      },
    });
  } catch (error: any) {
    console.error('[TikTok API] Analyze error:', error);
    res.status(500).json({
      error: error.message || 'Failed to analyze video',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * POST /api/tiktok/batch-render
 * Render multilingual TikTok videos
 */
router.post('/batch-render', async (req: Request, res: Response) => {
  try {
    const {
      videoPath,
      momentIndexes,
      languages,
      sessionId,
      captionStyle,
      ctaConfig,
    } = req.body;

    // Validate required fields
    if (!videoPath) {
      return res.status(400).json({ error: 'videoPath is required' });
    }

    if (!momentIndexes || !Array.isArray(momentIndexes) || momentIndexes.length === 0) {
      return res.status(400).json({
        error: 'momentIndexes is required and must be a non-empty array',
      });
    }

    if (!languages || !Array.isArray(languages) || languages.length === 0) {
      return res.status(400).json({
        error: 'languages is required and must be a non-empty array',
      });
    }

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    // Check if video file exists
    try {
      await fs.access(videoPath);
    } catch (error) {
      return res.status(404).json({
        error: 'Video file not found',
        path: videoPath,
      });
    }

    // Check if voice is cloned
    const session = sessionManager.getSession(sessionId);
    if (!session?.voiceId) {
      return res.status(400).json({
        error: 'Voice not cloned. Please record a conversation first to clone your voice.',
        sessionId,
      });
    }

    // Validate language codes
    const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
    const invalidLanguages = languages.filter((code: string) => !supportedCodes.includes(code));

    if (invalidLanguages.length > 0) {
      return res.status(400).json({
        error: 'Invalid language codes',
        invalid: invalidLanguages,
        supported: supportedCodes,
      });
    }

    // Get language configs
    const languageConfigs = SUPPORTED_LANGUAGES.filter((l) =>
      languages.includes(l.code)
    );

    console.log(`[TikTok API] Batch render request`);
    console.log(`[TikTok API] Video: ${videoPath}`);
    console.log(`[TikTok API] Moments: ${momentIndexes.join(', ')}`);
    console.log(`[TikTok API] Languages: ${languages.join(', ')}`);
    console.log(`[TikTok API] Voice ID: ${session.voiceId}`);

    // Create operation ID
    const operationId = `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Calculate total operations
    const totalOperations = momentIndexes.length * languages.length;

    // Create operation tracker
    const operation = operationTracker.createOperation(
      operationId,
      'batch-render',
      totalOperations
    );

    // Start async batch rendering
    (async () => {
      try {
        // First, re-analyze to get the moments data
        const analysis = await momentAnalyzer.findBestMoments({
          videoPath,
          count: 50, // Analyze many moments
          duration: 60,
        });

        // Filter to requested moment indexes
        const selectedMoments = analysis.moments.filter((m) =>
          momentIndexes.includes(m.index)
        );

        if (selectedMoments.length === 0) {
          throw new Error('No moments found for the specified indexes');
        }

        // Build batch config
        const config: BatchConfig = {
          videoPath,
          moments: selectedMoments,
          languages,
          voiceId: session.voiceId!,
          captionStyle: captionStyle || DEFAULT_CAPTION_STYLE,
          ctaConfig: ctaConfig || DEFAULT_CTA_CONFIG,
        };

        // Render batch with progress tracking
        const batch = await batchRenderer.renderMultilingual(config);

        // Update operation as completed
        operationTracker.completeOperation(operationId, batch);

        console.log(`[TikTok API] Batch ${operationId} completed successfully`);
      } catch (error: any) {
        console.error(`[TikTok API] Batch ${operationId} failed:`, error);
        operationTracker.failOperation(operationId, error.message);
      }
    })();

    // Return immediately with operation ID
    res.json({
      operationId,
      status: 'pending',
      message: 'Batch rendering started',
      totalOperations,
      estimatedTime: `${(totalOperations * 30) / 60} minutes`,
    });
  } catch (error: any) {
    console.error('[TikTok API] Batch render error:', error);
    res.status(500).json({
      error: error.message || 'Failed to start batch rendering',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * GET /api/tiktok/status/:operationId
 * Poll batch rendering progress
 */
router.get('/status/:operationId', async (req: Request, res: Response) => {
  try {
    const { operationId } = req.params;

    const operation = operationTracker.getOperation(operationId);

    if (!operation) {
      return res.status(404).json({
        error: 'Operation not found',
        operationId,
      });
    }

    res.json({
      status: operation.status,
      progress: {
        current: operation.progress.current,
        total: operation.progress.total,
        percentage: operation.progress.percentage,
        currentTask: operation.progress.currentTask,
      },
      result: operation.status === 'completed' ? operation.result : undefined,
      error: operation.error,
      createdAt: operation.createdAt,
      updatedAt: operation.updatedAt,
      completedAt: operation.completedAt,
    });
  } catch (error: any) {
    console.error('[TikTok API] Status check error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get operation status',
    });
  }
});

/**
 * GET /api/tiktok/download/:filename
 * Download rendered TikTok video
 */
router.get('/download/:filename', async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;

    // Validate filename format (prevent directory traversal)
    if (!/^moment_\d+_[a-z]{2}\.mp4$/.test(filename)) {
      return res.status(400).json({
        error: 'Invalid filename format. Expected: moment_1_en.mp4',
      });
    }

    // Find file in output directory
    const outputDir = path.join(process.cwd(), 'output', 'tiktok');
    const filePath = path.join(outputDir, filename);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        error: 'Video file not found',
        filename,
      });
    }

    // Get file stats
    const stats = await fs.stat(filePath);

    // Set headers
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    // Stream file
    const fileStream = (await import('fs')).createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error: any) {
    console.error('[TikTok API] Download error:', error);
    res.status(500).json({
      error: error.message || 'Failed to download video',
    });
  }
});

/**
 * GET /api/tiktok/languages
 * Get supported languages
 */
router.get('/languages', async (req: Request, res: Response) => {
  try {
    res.json({
      languages: SUPPORTED_LANGUAGES,
      total: SUPPORTED_LANGUAGES.length,
    });
  } catch (error: any) {
    console.error('[TikTok API] Languages error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get supported languages',
    });
  }
});

/**
 * DELETE /api/tiktok/cleanup/:operationId
 * Clean up rendered videos and temp files
 */
router.delete('/cleanup/:operationId', async (req: Request, res: Response) => {
  try {
    const { operationId } = req.params;

    const operation = operationTracker.getOperation(operationId);

    if (!operation) {
      return res.status(404).json({
        error: 'Operation not found',
        operationId,
      });
    }

    if (operation.status !== 'completed' && operation.status !== 'failed') {
      return res.status(400).json({
        error: 'Cannot cleanup operation that is still processing',
        status: operation.status,
      });
    }

    let deleted = 0;
    let freed = 0;

    // Clean up video files if operation completed
    if (operation.status === 'completed' && operation.result?.videos) {
      for (const video of operation.result.videos) {
        try {
          const stats = await fs.stat(video.path);
          await fs.unlink(video.path);
          deleted++;
          freed += stats.size;
        } catch (error) {
          console.warn(`[TikTok API] Failed to delete ${video.path}:`, error);
        }
      }
    }

    // Delete operation from tracker
    operationTracker.deleteOperation(operationId);

    console.log(`[TikTok API] Cleaned up operation ${operationId}`);
    console.log(`[TikTok API] Deleted ${deleted} files, freed ${freed} bytes`);

    res.json({
      deleted,
      freed,
      freedMB: (freed / 1024 / 1024).toFixed(2),
      operationId,
    });
  } catch (error: any) {
    console.error('[TikTok API] Cleanup error:', error);
    res.status(500).json({
      error: error.message || 'Failed to cleanup operation',
    });
  }
});

/**
 * POST /api/tiktok/session
 * Create or update session with voice ID
 */
router.post('/session', async (req: Request, res: Response) => {
  try {
    const { sessionId, voiceId, voiceName } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required' });
    }

    const session = sessionManager.createSession(sessionId, {
      voiceId,
      voiceName,
    });

    res.json({
      session: {
        id: session.id,
        voiceId: session.voiceId,
        voiceName: session.voiceName,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
      },
    });
  } catch (error: any) {
    console.error('[TikTok API] Session error:', error);
    res.status(500).json({
      error: error.message || 'Failed to create/update session',
    });
  }
});

/**
 * GET /api/tiktok/session/:sessionId
 * Get session information
 */
router.get('/session/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = sessionManager.getSession(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        sessionId,
      });
    }

    res.json({
      session: {
        id: session.id,
        voiceId: session.voiceId,
        voiceName: session.voiceName,
        hasVoiceCloned: !!session.voiceId,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        metadata: session.metadata,
      },
    });
  } catch (error: any) {
    console.error('[TikTok API] Get session error:', error);
    res.status(500).json({
      error: error.message || 'Failed to get session',
    });
  }
});

/**
 * POST /api/tiktok/generate-video
 * Generate AI video from text prompt using Veo 3.1
 * Supports both text-to-video and image-to-video generation
 *
 * Request body:
 * {
 *   prompt: string;           // Text description of video
 *   duration?: number;        // 1-8 seconds (default: 8)
 *   aspectRatio?: string;     // '9:16', '16:9', '1:1' (default: '9:16')
 *   modelVersion?: string;    // '3.0' or '3.1' (default: from env)
 *   negativePrompt?: string;  // What to avoid
 *   imagePath?: string;       // Path to reference image (for image-to-video)
 *   imageUrl?: string;        // URL to reference image (for image-to-video)
 *   imageBase64?: string;     // Base64-encoded image (for image-to-video)
 * }
 */
router.post('/generate-video', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      duration = 8,
      aspectRatio = '9:16',
      modelVersion,
      negativePrompt,
      imagePath,
      imageUrl,
      imageBase64,
    } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'prompt is required and must be a non-empty string',
      });
    }

    // Validate duration
    if (duration < 1 || duration > 8) {
      return res.status(400).json({
        error: 'duration must be between 1 and 8 seconds',
      });
    }

    // Validate aspect ratio
    const validAspectRatios = ['9:16', '16:9', '1:1'];
    if (!validAspectRatios.includes(aspectRatio)) {
      return res.status(400).json({
        error: 'aspectRatio must be one of: 9:16, 16:9, 1:1',
        validOptions: validAspectRatios,
      });
    }

    const hasImage = !!(imagePath || imageUrl || imageBase64);

    console.log(`[TikTok API] Generating video with Veo ${modelVersion || '3.1'}`);
    console.log(`[TikTok API] Mode: ${hasImage ? 'Image-to-Video' : 'Text-to-Video'}`);
    console.log(`[TikTok API] Prompt: "${prompt}"`);
    console.log(`[TikTok API] Duration: ${duration}s, Aspect Ratio: ${aspectRatio}`);

    // Handle base64 image if provided
    let imageBuffer: Buffer | undefined;
    if (imageBase64) {
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      imageBuffer = Buffer.from(base64Data, 'base64');
      console.log(`[TikTok API] Using base64 image (${imageBuffer.length} bytes)`);
    }

    // Generate video
    const result = await veoGenerator.generateVideo({
      prompt: prompt.trim(),
      duration,
      aspectRatio: aspectRatio as '9:16' | '16:9' | '1:1',
      modelVersion: (modelVersion || process.env.VEO_MODEL_VERSION || '3.1') as '3.0' | '3.1',
      negativePrompt,
      imagePath,
      imageUrl,
      imageBuffer,
    });

    // Save video to output directory
    const outputDir = path.join(process.cwd(), 'output', 'generated');
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `veo-${duration}s-${Date.now()}.mp4`;
    const filepath = path.join(outputDir, filename);

    if (result.videoBuffer) {
      await fs.writeFile(filepath, result.videoBuffer);
      console.log(`[TikTok API] Video saved: ${filepath}`);
    }

    // Return result
    res.json({
      success: true,
      mode: hasImage ? 'image-to-video' : 'text-to-video',
      video: {
        url: result.videoUrl,
        filename,
        path: filepath,
        duration: result.duration,
        resolution: result.resolution,
        aspectRatio: result.aspectRatio,
        size: result.videoBuffer ? result.videoBuffer.length : 0,
        sizeMB: result.videoBuffer ? (result.videoBuffer.length / 1024 / 1024).toFixed(2) : 0,
      },
      metadata: {
        prompt: result.prompt,
        model: result.metadata.model,
        generationTime: result.generationTime,
        generationTimeSeconds: (result.generationTime / 1000).toFixed(2),
        cost: result.cost,
        timestamp: result.metadata.timestamp,
        usedReferenceImage: result.metadata.usedReferenceImage,
      },
    });
  } catch (error: any) {
    console.error('[TikTok API] Generate video error:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate video',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * POST /api/tiktok/extend-video
 * Extend an existing video using Veo 3.1
 *
 * Request body:
 * {
 *   videoPath?: string;         // Path to video file
 *   videoFilename?: string;     // Filename in output/generated/
 *   prompt: string;             // Extension description
 *   extensionDuration?: number; // 7 seconds (default)
 *   iterations?: number;        // 1-20 (default: 1)
 * }
 */
router.post('/extend-video', async (req: Request, res: Response) => {
  try {
    const {
      videoPath,
      videoFilename,
      prompt,
      extensionDuration = 7,
      iterations = 1,
    } = req.body;

    // Validate required fields
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'prompt is required and must be a non-empty string',
      });
    }

    // Must provide either videoPath or videoFilename
    if (!videoPath && !videoFilename) {
      return res.status(400).json({
        error: 'Either videoPath or videoFilename is required',
      });
    }

    // Validate iterations
    if (iterations < 1 || iterations > 20) {
      return res.status(400).json({
        error: 'iterations must be between 1 and 20',
      });
    }

    // Resolve video path
    let resolvedVideoPath = videoPath;
    if (videoFilename && !videoPath) {
      const generatedDir = path.join(process.cwd(), 'output', 'generated');
      resolvedVideoPath = path.join(generatedDir, videoFilename);
    }

    // Check if video file exists
    try {
      await fs.access(resolvedVideoPath!);
    } catch (error) {
      return res.status(404).json({
        error: 'Video file not found',
        path: resolvedVideoPath,
      });
    }

    console.log(`[TikTok API] Extending video: ${resolvedVideoPath}`);
    console.log(`[TikTok API] Extension prompt: "${prompt}"`);
    console.log(`[TikTok API] Iterations: ${iterations} (adds ${extensionDuration * iterations}s)`);

    // Read video buffer
    const videoBuffer = await fs.readFile(resolvedVideoPath!);

    // Extend video
    const result = await veoGenerator.extendVideo({
      videoBuffer,
      prompt: prompt.trim(),
      extensionDuration,
      iterations,
    });

    // Save extended video
    const outputDir = path.join(process.cwd(), 'output', 'extended');
    await fs.mkdir(outputDir, { recursive: true });

    const filename = `veo-extended-${result.totalDuration}s-${Date.now()}.mp4`;
    const filepath = path.join(outputDir, filename);

    if (result.videoBuffer) {
      await fs.writeFile(filepath, result.videoBuffer);
      console.log(`[TikTok API] Extended video saved: ${filepath}`);
    }

    // Return result
    res.json({
      success: true,
      video: {
        filename,
        path: filepath,
        originalDuration: result.originalDuration,
        extensionDuration: result.extensionDuration,
        totalDuration: result.totalDuration,
        iterations: result.iterations,
        size: result.videoBuffer ? result.videoBuffer.length : 0,
        sizeMB: result.videoBuffer ? (result.videoBuffer.length / 1024 / 1024).toFixed(2) : 0,
      },
      metadata: {
        prompt,
        generationTime: result.generationTime,
        generationTimeSeconds: (result.generationTime / 1000).toFixed(2),
        cost: result.cost,
        costPerIteration: (result.cost / result.iterations).toFixed(4),
      },
    });
  } catch (error: any) {
    console.error('[TikTok API] Extend video error:', error);
    res.status(500).json({
      error: error.message || 'Failed to extend video',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

export default router;
