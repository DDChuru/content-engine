/**
 * Veo 3.1 Video Generation Routes
 *
 * Endpoints for AI video generation using Google's Veo 3.1 model
 */

import { Router, Request, Response } from 'express';
import { VeoVideoGenerator, createVeoGenerator, VeoStoryboard } from '../services/veo-video-generator.js';
import path from 'path';

const router = Router();

// Lazy initialization of Veo generator
let veoGenerator: VeoVideoGenerator | null = null;

function getVeoGenerator(): VeoVideoGenerator {
  if (!veoGenerator) {
    veoGenerator = createVeoGenerator();
  }
  return veoGenerator;
}

/**
 * POST /api/veo/generate
 * Generate a single video clip
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      negativePrompt,
      duration = 8,
      aspectRatio = '16:9',
      resolution = '720p',
      filename
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const generator = getVeoGenerator();
    const outputDir = path.join(process.cwd(), 'output', 'veo-videos');

    const result = await generator.generateClip({
      prompt,
      negativePrompt,
      duration,
      aspectRatio,
      resolution,
      outputDir,
      filename
    });

    if (result.success) {
      // Return relative URL for serving
      const videoUrl = `/output/veo-videos/${path.basename(result.videoPath!)}`;
      res.json({
        success: true,
        videoUrl,
        videoPath: result.videoPath,
        duration: result.duration,
        resolution: result.resolution,
        cost: result.cost
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error: any) {
    console.error('[Veo Route] Error:', error);
    res.status(500).json({
      error: 'Video generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/veo/generate-from-image
 * Generate video from a reference image (image-to-video)
 */
router.post('/generate-from-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      imagePath,
      imageBase64,
      duration = 8,
      aspectRatio = '16:9',
      filename
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    if (!imagePath && !imageBase64) {
      return res.status(400).json({ error: 'Either imagePath or imageBase64 is required' });
    }

    const generator = getVeoGenerator();
    const outputDir = path.join(process.cwd(), 'output', 'veo-videos');

    // If base64 provided, save temporarily
    let referenceImagePath = imagePath;
    if (imageBase64 && !imagePath) {
      const tempDir = path.join(process.cwd(), 'output', 'temp');
      const { promises: fs } = await import('fs');
      await fs.mkdir(tempDir, { recursive: true });

      // Extract base64 data (handle data URL format)
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      referenceImagePath = path.join(tempDir, `ref_${Date.now()}.png`);
      await fs.writeFile(referenceImagePath, Buffer.from(base64Data, 'base64'));
    }

    const result = await generator.generateClip({
      prompt,
      duration,
      aspectRatio,
      referenceImages: [referenceImagePath],
      outputDir,
      filename
    });

    if (result.success) {
      const videoUrl = `/output/veo-videos/${path.basename(result.videoPath!)}`;
      res.json({
        success: true,
        videoUrl,
        videoPath: result.videoPath,
        duration: result.duration,
        cost: result.cost
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error: any) {
    console.error('[Veo Route] Error:', error);
    res.status(500).json({
      error: 'Video generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/veo/storyboard
 * Generate multiple scenes as a storyboard
 */
router.post('/storyboard', async (req: Request, res: Response) => {
  try {
    const {
      title,
      scenes,
      aspectRatio = '16:9',
      resolution = '720p'
    } = req.body;

    if (!scenes || !Array.isArray(scenes) || scenes.length === 0) {
      return res.status(400).json({ error: 'scenes array is required' });
    }

    const generator = getVeoGenerator();
    const outputDir = path.join(process.cwd(), 'output', 'veo-videos', title || 'storyboard');

    const storyboard: VeoStoryboard = {
      title: title || 'Untitled Storyboard',
      aspectRatio,
      resolution,
      scenes: scenes.map((scene: any, index: number) => ({
        id: scene.id || index + 1,
        name: scene.name || `scene_${index + 1}`,
        duration: scene.duration || 8,
        veoPrompt: scene.prompt || scene.veoPrompt,
        negativePrompt: scene.negativePrompt,
        referenceImages: scene.referenceImages
      })),
      outputDir
    };

    const result = await generator.generateStoryboard(storyboard);

    res.json({
      success: result.success,
      clips: result.clips.map(clip => ({
        success: clip.success,
        videoUrl: clip.videoPath ? `/output/veo-videos/${title || 'storyboard'}/${path.basename(clip.videoPath)}` : null,
        duration: clip.duration,
        cost: clip.cost,
        error: clip.error
      })),
      totalCost: result.totalCost,
      successfulClips: result.clips.filter(c => c.success).length,
      totalClips: result.clips.length
    });

  } catch (error: any) {
    console.error('[Veo Route] Storyboard error:', error);
    res.status(500).json({
      error: 'Storyboard generation failed',
      details: error.message
    });
  }
});

/**
 * POST /api/veo/tiktok
 * Generate TikTok-optimized vertical video (9:16)
 */
router.post('/tiktok', async (req: Request, res: Response) => {
  try {
    const { prompt, duration = 8, filename } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const generator = getVeoGenerator();
    const outputDir = path.join(process.cwd(), 'output', 'veo-videos', 'tiktok');

    const result = await generator.generateTikTokVideo({
      prompt,
      duration,
      outputDir,
      filename
    });

    if (result.success) {
      const videoUrl = `/output/veo-videos/tiktok/${path.basename(result.videoPath!)}`;
      res.json({
        success: true,
        videoUrl,
        duration: result.duration,
        resolution: result.resolution,
        cost: result.cost
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }

  } catch (error: any) {
    console.error('[Veo Route] TikTok error:', error);
    res.status(500).json({
      error: 'TikTok video generation failed',
      details: error.message
    });
  }
});

/**
 * GET /api/veo/cost-estimate
 * Estimate cost for a storyboard
 */
router.post('/cost-estimate', async (req: Request, res: Response) => {
  const { scenes } = req.body;

  if (!scenes || !Array.isArray(scenes)) {
    return res.status(400).json({ error: 'scenes array is required' });
  }

  const costPerClip = 0.50;
  const totalClips = scenes.length;
  const totalCost = totalClips * costPerClip;
  const totalDuration = scenes.reduce((sum: number, s: any) => sum + (s.duration || 8), 0);

  res.json({
    totalClips,
    totalDuration,
    costPerClip,
    totalCost,
    estimatedTime: `${Math.ceil(totalClips * 2)} minutes` // ~2 min per clip
  });
});

export default router;
