/**
 * Global Video API Routes
 *
 * Accessible to ALL workspaces (education, marketing, documentation, etc.)
 * Uses WebSlides-inspired Remotion components
 */

import * as express from 'express';
import { Request, Response } from 'express';
import { videoRenderer, WebSlidesScene } from '../services/video-renderer.js';
import { themes, ThemeName } from '../remotion/components/webslides/index.js';

const router = express.Router();

/**
 * GET /api/video/themes
 *
 * List all available themes
 */
router.get('/themes', (req: Request, res: Response) => {
  try {
    const themeList = Object.keys(themes).map(name => ({
      name,
      colors: themes[name as ThemeName].colors,
      description: themes[name as ThemeName].name
    }));

    res.json({
      success: true,
      themes: themeList,
      count: themeList.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/video/render-webslides
 *
 * Render video using WebSlides aesthetic
 *
 * Body:
 * {
 *   "scenes": [
 *     {
 *       "id": 1,
 *       "title": "Sets",
 *       "subtitle": "Cambridge IGCSE Mathematics",
 *       "mathNotation": "A ∪ B = {1, 2, 3, 4, 5, 6, 7, 8}",
 *       "visual": "/path/to/manim-video.mp4",
 *       "duration": 10,
 *       "type": "webslides-venn"
 *     }
 *   ],
 *   "theme": "education-dark",
 *   "outputFilename": "sets-lesson.mp4"
 * }
 */
router.post('/render-webslides', async (req: Request, res: Response) => {
  try {
    const { scenes, theme, outputFilename } = req.body;

    if (!scenes || !Array.isArray(scenes)) {
      return res.status(400).json({
        success: false,
        error: 'scenes array is required'
      });
    }

    if (!outputFilename) {
      return res.status(400).json({
        success: false,
        error: 'outputFilename is required'
      });
    }

    console.log(`[VideoAPI] Render request: ${scenes.length} scenes, theme: ${theme || 'education-dark'}`);

    const result = await videoRenderer.quickRender(
      scenes as WebSlidesScene[],
      outputFilename,
      (theme as ThemeName) || 'education-dark'
    );

    if (result.success) {
      res.json({
        success: true,
        videoPath: result.videoPath,
        duration: result.duration,
        metadata: result.metadata
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('[VideoAPI] Error rendering video:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/video/render-presentation
 *
 * Render generic presentation video (marketing, docs, etc.)
 *
 * Similar to render-webslides but uses marketing/documentation theme by default
 */
router.post('/render-presentation', async (req: Request, res: Response) => {
  try {
    const { scenes, theme, outputPath } = req.body;

    if (!scenes || !Array.isArray(scenes)) {
      return res.status(400).json({
        success: false,
        error: 'scenes array is required'
      });
    }

    if (!outputPath) {
      return res.status(400).json({
        success: false,
        error: 'outputPath is required'
      });
    }

    console.log(`[VideoAPI] Presentation render: ${scenes.length} scenes`);

    const result = await videoRenderer.renderPresentation({
      scenes: scenes as WebSlidesScene[],
      theme: (theme as ThemeName) || 'marketing',
      outputPath,
      codec: 'h264',
      width: 1920,
      height: 1080,
      fps: 30
    });

    if (result.success) {
      res.json({
        success: true,
        videoPath: result.videoPath,
        duration: result.duration,
        metadata: result.metadata
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('[VideoAPI] Error rendering presentation:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/video/clear-cache
 *
 * Clear Remotion bundle cache (development only)
 */
router.post('/clear-cache', (req: Request, res: Response) => {
  try {
    videoRenderer.clearCache();

    res.json({
      success: true,
      message: 'Video renderer cache cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * GET /api/video/health
 *
 * Health check for video rendering service
 */
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'video-renderer',
    status: 'operational',
    features: {
      webslides: true,
      themes: Object.keys(themes),
      compositions: ['EducationalLesson']
    }
  });
});

export default router;
