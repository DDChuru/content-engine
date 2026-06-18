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
 * POST /api/video/render-scene
 *
 * Render a single scene using Documentary composition (Ken Burns effect)
 * Used by Life Stories for image-to-video conversion
 *
 * Body:
 * {
 *   "sceneId": "scene-1",
 *   "title": "The Early Years",
 *   "narration": "Born in 1937...",
 *   "imageUrl": "data:image/png;base64,..." or "/path/to/image.png",
 *   "duration": 12,
 *   "effect": "ken-burns" (optional, default)
 * }
 */
router.post('/render-scene', async (req: Request, res: Response) => {
  try {
    const { sceneId, title, narration, imageUrl, duration = 10 } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'imageUrl is required'
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        error: 'title is required'
      });
    }

    console.log(`[VideoAPI] Rendering scene: ${sceneId || 'unnamed'} - ${title}`);

    // Import fs and path
    const { promises: fs } = await import('fs');
    const path = await import('path');
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } = await import('@remotion/renderer');
    const { fileURLToPath } = await import('url');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Create output directories
    const publicDir = path.join(__dirname, '../remotion/public');
    const imagesDir = path.join(publicDir, 'images/life-stories');
    const outputDir = path.join(process.cwd(), 'output/life-stories-videos');

    await fs.mkdir(imagesDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    // Save image to Remotion public directory
    let imagePath: string;
    const imageFilename = `scene_${sceneId || Date.now()}.png`;

    if (imageUrl.startsWith('data:')) {
      // Base64 image - decode and save
      const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      imagePath = path.join(imagesDir, imageFilename);
      await fs.writeFile(imagePath, imageBuffer);
      console.log(`[VideoAPI] Saved base64 image: ${imagePath}`);
    } else if (imageUrl.startsWith('/') || imageUrl.startsWith('http')) {
      // URL or path - copy file if local
      if (imageUrl.startsWith('/output/')) {
        const sourcePath = path.join(process.cwd(), imageUrl);
        imagePath = path.join(imagesDir, imageFilename);
        await fs.copyFile(sourcePath, imagePath);
        console.log(`[VideoAPI] Copied image: ${sourcePath} -> ${imagePath}`);
      } else {
        // External URL - fetch and save
        const response = await fetch(imageUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        imagePath = path.join(imagesDir, imageFilename);
        await fs.writeFile(imagePath, buffer);
        console.log(`[VideoAPI] Downloaded image: ${imageUrl}`);
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid imageUrl format'
      });
    }

    // Prepare scene for Documentary composition
    const documentaryScene = {
      id: sceneId || `scene-${Date.now()}`,
      title: title,
      narration: narration || '',
      imageUrl: `images/life-stories/${imageFilename}`, // Relative to Remotion public
      duration: duration
    };

    // Bundle Remotion project
    console.log('[VideoAPI] Bundling Remotion project...');
    const bundleResult = await bundle({
      entryPoint: path.join(__dirname, '../remotion/Root.tsx'),
      publicDir: publicDir,
    });

    const serveUrl = typeof bundleResult === 'string' ? bundleResult : (bundleResult as any).serveUrl;

    // Calculate total duration (title card + scene)
    const fps = 30;
    const titleCardDuration = 4 * fps; // 4 seconds
    const sceneDurationFrames = duration * fps;
    const totalDuration = titleCardDuration + sceneDurationFrames;

    // Get Documentary composition
    const composition = await selectComposition({
      serveUrl,
      id: 'Documentary',
      inputProps: {
        title: title,
        subtitle: '',
        scenes: [documentaryScene]
      }
    });

    // Override duration based on our calculation
    const adjustedComposition = {
      ...composition,
      durationInFrames: totalDuration
    };

    // Output filename
    const outputFilename = `${sceneId || 'scene'}_${Date.now()}.mp4`;
    const outputPath = path.join(outputDir, outputFilename);

    // Render video
    console.log('[VideoAPI] Rendering Documentary scene...');
    await renderMedia({
      composition: adjustedComposition,
      serveUrl,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        title: title,
        subtitle: '',
        scenes: [documentaryScene]
      }
    });

    console.log(`[VideoAPI] ✓ Scene rendered: ${outputPath}`);

    // Return URL for serving
    const videoUrl = `/output/life-stories-videos/${outputFilename}`;

    res.json({
      success: true,
      videoUrl,
      videoPath: outputPath,
      duration: totalDuration / fps,
      metadata: {
        sceneId,
        title,
        effect: 'ken-burns',
        resolution: '1920x1080',
        fps: 30
      }
    });

  } catch (error) {
    console.error('[VideoAPI] Error rendering scene:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * POST /api/video/render-documentary
 *
 * Render full documentary from multiple scenes using Ken Burns effect
 * Used by Life Stories for batch rendering
 *
 * Body:
 * {
 *   "title": "Edgar Tekere: A Life",
 *   "subtitle": "1937 - 2011",
 *   "scenes": [
 *     { "id": "scene-1", "title": "...", "narration": "...", "imageUrl": "...", "duration": 12 }
 *   ],
 *   "outputFilename": "edgar-tekere.mp4"
 * }
 */
router.post('/render-documentary', async (req: Request, res: Response) => {
  try {
    const { title, subtitle, scenes, outputFilename } = req.body;

    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'scenes array is required and must not be empty'
      });
    }

    if (!outputFilename) {
      return res.status(400).json({
        success: false,
        error: 'outputFilename is required'
      });
    }

    console.log(`[VideoAPI] Rendering documentary: ${title} (${scenes.length} scenes)`);

    const { promises: fs } = await import('fs');
    const path = await import('path');
    const { bundle } = await import('@remotion/bundler');
    const { renderMedia, selectComposition } = await import('@remotion/renderer');
    const { fileURLToPath } = await import('url');

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const publicDir = path.join(__dirname, '../remotion/public');
    const imagesDir = path.join(publicDir, 'images/life-stories');
    const outputDir = path.join(process.cwd(), 'output/life-stories-videos');

    await fs.mkdir(imagesDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    // Process all scenes - save images and prepare for composition
    const processedScenes = [];
    for (const scene of scenes) {
      const imageFilename = `scene_${scene.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}.png`;

      if (scene.imageUrl.startsWith('data:')) {
        const base64Data = scene.imageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');
        await fs.writeFile(path.join(imagesDir, imageFilename), imageBuffer);
      } else if (scene.imageUrl.startsWith('/output/')) {
        const sourcePath = path.join(process.cwd(), scene.imageUrl);
        await fs.copyFile(sourcePath, path.join(imagesDir, imageFilename));
      }

      processedScenes.push({
        id: scene.id,
        title: scene.title,
        narration: scene.narration || '',
        imageUrl: `images/life-stories/${imageFilename}`,
        duration: scene.duration || 10
      });
    }

    // Bundle Remotion project
    console.log('[VideoAPI] Bundling Remotion project...');
    const bundleResult = await bundle({
      entryPoint: path.join(__dirname, '../remotion/Root.tsx'),
      publicDir: publicDir,
    });

    const serveUrl = typeof bundleResult === 'string' ? bundleResult : (bundleResult as any).serveUrl;

    // Calculate total duration
    const fps = 30;
    const titleCardDuration = 4 * fps;
    const scenesDuration = processedScenes.reduce((sum, s) => sum + (s.duration * fps), 0);
    const totalDuration = titleCardDuration + scenesDuration;

    // Get composition
    const composition = await selectComposition({
      serveUrl,
      id: 'Documentary',
      inputProps: {
        title: title || 'Documentary',
        subtitle: subtitle || '',
        scenes: processedScenes
      }
    });

    const adjustedComposition = {
      ...composition,
      durationInFrames: totalDuration
    };

    const outputPath = path.join(outputDir, outputFilename);

    // Render video
    console.log('[VideoAPI] Rendering full documentary...');
    await renderMedia({
      composition: adjustedComposition,
      serveUrl,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        title: title || 'Documentary',
        subtitle: subtitle || '',
        scenes: processedScenes
      }
    });

    console.log(`[VideoAPI] ✓ Documentary rendered: ${outputPath}`);

    const videoUrl = `/output/life-stories-videos/${outputFilename}`;

    res.json({
      success: true,
      videoUrl,
      videoPath: outputPath,
      duration: totalDuration / fps,
      metadata: {
        title,
        scenes: processedScenes.length,
        effect: 'ken-burns',
        resolution: '1920x1080',
        fps: 30
      }
    });

  } catch (error) {
    console.error('[VideoAPI] Error rendering documentary:', error);
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
      compositions: ['EducationalLesson', 'Documentary'],
      endpoints: [
        'POST /render-scene - Single scene with Ken Burns',
        'POST /render-documentary - Full documentary with multiple scenes',
        'POST /render-webslides - Educational slides',
        'POST /render-presentation - Marketing/docs presentations'
      ]
    }
  });
});

export default router;
