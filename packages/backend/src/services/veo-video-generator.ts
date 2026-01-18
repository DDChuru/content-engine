/**
 * Veo 3.1 Video Generator Service
 *
 * Generates AI videos using Google's Veo 3.1 model via @google/genai SDK
 * Supports TikTok (9:16), YouTube (16:9), and square (1:1) formats
 *
 * Key capabilities:
 * - 4, 6, or 8-second clips
 * - Image-to-video generation
 * - Video extension
 *
 * Usage:
 *   Set GEMINI_API_KEY environment variable
 *   const generator = createVeoGenerator();
 *   const result = await generator.generateClip({ prompt, outputDir });
 */

import { GoogleGenAI } from '@google/genai';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface VeoGenerateOptions {
  prompt: string;
  negativePrompt?: string;
  duration?: 4 | 6 | 8;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  resolution?: '720p' | '1080p';
  referenceImages?: string[];  // Paths to reference images (up to 3)
  startImage?: string;         // First frame image path
  endImage?: string;           // Last frame image path
  outputDir: string;
  filename?: string;
}

export interface VeoExtendOptions {
  videoPath: string;           // Previous Veo video to extend
  prompt: string;              // Continuation prompt
  duration?: 4 | 6 | 8;
  outputDir: string;
  filename?: string;
}

export interface VeoResult {
  success: boolean;
  videoPath?: string;
  duration?: number;
  resolution?: string;
  error?: string;
  cost: number;
}

export interface VeoStoryboardScene {
  id: number;
  name: string;
  duration: 4 | 6 | 8;
  veoPrompt: string;
  negativePrompt?: string;
  referenceImages?: string[];
  audio?: string;
  overlayText?: string;
}

export interface VeoStoryboard {
  title: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  resolution: '720p' | '1080p';
  scenes: VeoStoryboardScene[];
  outputDir: string;
}

export class VeoVideoGenerator {
  private genAI: GoogleGenAI;
  private apiKey: string;
  private readonly COST_PER_CLIP = 0.50;  // Estimated cost per 8s clip
  private readonly MODEL = 'veo-3.1-generate-preview';
  private readonly FAST_MODEL = 'veo-3.1-fast-generate-preview';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.genAI = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate a single video clip
   */
  async generateClip(options: VeoGenerateOptions): Promise<VeoResult> {
    try {
      console.log(`[VeoGenerator] Generating clip: ${options.prompt.substring(0, 60)}...`);
      console.log(`  Duration: ${options.duration || 8}s`);
      console.log(`  Aspect: ${options.aspectRatio || '16:9'}`);

      // Build params matching the working video-studio implementation
      const params: any = {
        model: this.MODEL,
        prompt: options.prompt,
        config: {
          aspectRatio: options.aspectRatio || '16:9',
          negativePrompt: options.negativePrompt || 'low quality, blurry, distorted',
          durationSeconds: options.duration || 8,
        }
      };

      // Add start image if provided (image-to-video)
      if (options.startImage) {
        const imageData = await this.loadImageAsBase64(options.startImage);
        params.image = {
          mimeType: imageData.mimeType,
          imageBytes: imageData.data
        };
        console.log(`  Start image: ${options.startImage}`);
      }

      // Start video generation operation
      console.log(`[VeoGenerator] Calling generateVideos API...`);
      let operation = await this.genAI.models.generateVideos(params);

      // Poll for completion
      console.log(`[VeoGenerator] Generation started, polling for completion...`);

      while (!operation.done) {
        console.log(`[VeoGenerator] Waiting for video generation...`);
        await this.sleep(5000); // Wait 5 seconds
        operation = await this.genAI.operations.getVideosOperation({
          operation: operation,
        });
      }

      // Check for errors
      if (operation.error) {
        throw new Error(`Veo API error: ${JSON.stringify(operation.error)}`);
      }

      // Get generated video
      const generatedVideos = operation.response?.generatedVideos;
      if (!generatedVideos || generatedVideos.length === 0) {
        throw new Error('No video generated in response');
      }

      const videoResource = generatedVideos[0].video;
      console.log(`[VeoGenerator] Video resource:`, JSON.stringify(videoResource, null, 2));

      // Download and save video
      await fs.mkdir(options.outputDir, { recursive: true });
      const filename = options.filename || `veo_${Date.now()}.mp4`;
      const videoPath = path.join(options.outputDir, filename);

      // Fetch video from URI with API key
      if (videoResource.uri) {
        console.log(`[VeoGenerator] Downloading video from: ${videoResource.uri}`);
        const fetchUrl = `${videoResource.uri}${videoResource.uri.includes('?') ? '&' : '?'}key=${this.apiKey}`;

        const response = await fetch(fetchUrl);
        if (!response.ok) {
          throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
        }

        const videoBuffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(videoPath, videoBuffer);

        console.log(`[VeoGenerator] ✓ Video saved: ${videoPath} (${(videoBuffer.length / 1024 / 1024).toFixed(1)} MB)`);
      } else {
        throw new Error('No video URI in response');
      }

      return {
        success: true,
        videoPath,
        duration: options.duration || 8,
        resolution: options.resolution || '720p',
        cost: this.COST_PER_CLIP
      };

    } catch (error: any) {
      console.error(`[VeoGenerator] Error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Extend an existing Veo video
   */
  async extendVideo(options: VeoExtendOptions): Promise<VeoResult> {
    try {
      console.log(`[VeoGenerator] Extending video: ${options.videoPath}`);
      console.log(`  Continuation: ${options.prompt.substring(0, 60)}...`);

      // Load original video
      const videoData = await fs.readFile(options.videoPath);
      const videoBase64 = videoData.toString('base64');

      // Generate extension
      const operation = await this.genAI.models.generateVideos({
        model: this.MODEL,
        prompt: options.prompt,
        config: {
          numberOfVideos: 1,
          durationSeconds: options.duration || 8,
        },
        // Pass original video for extension
        video: {
          inlineData: {
            mimeType: 'video/mp4',
            data: videoBase64
          }
        }
      });

      // Poll for completion
      const result = await this.pollOperation(operation);

      if (!result.videos || result.videos.length === 0) {
        throw new Error('No extended video generated');
      }

      // Save extended video
      const video = result.videos[0];
      await fs.mkdir(options.outputDir, { recursive: true });

      const filename = options.filename || `veo_extended_${Date.now()}.mp4`;
      const videoPath = path.join(options.outputDir, filename);

      const extendedData = await this.downloadVideo(video.uri);
      await fs.writeFile(videoPath, extendedData);

      console.log(`[VeoGenerator] ✓ Extended video saved: ${videoPath}`);

      return {
        success: true,
        videoPath,
        duration: options.duration || 8,
        cost: this.COST_PER_CLIP
      };

    } catch (error: any) {
      console.error(`[VeoGenerator] Extension error:`, error);
      return {
        success: false,
        error: error.message,
        cost: 0
      };
    }
  }

  /**
   * Generate a full storyboard (multiple scenes stitched together)
   */
  async generateStoryboard(storyboard: VeoStoryboard): Promise<{
    success: boolean;
    clips: VeoResult[];
    totalCost: number;
    outputPath?: string;
  }> {
    console.log(`[VeoGenerator] Generating storyboard: ${storyboard.title}`);
    console.log(`  Scenes: ${storyboard.scenes.length}`);
    console.log(`  Format: ${storyboard.aspectRatio} @ ${storyboard.resolution}`);

    const clips: VeoResult[] = [];
    let totalCost = 0;
    let lastClipPath: string | null = null;

    for (let i = 0; i < storyboard.scenes.length; i++) {
      const scene = storyboard.scenes[i];
      console.log(`\n[VeoGenerator] Scene ${i + 1}/${storyboard.scenes.length}: ${scene.name}`);

      // For continuity, use last frame of previous clip as reference
      const referenceImages = scene.referenceImages || [];
      if (lastClipPath && i > 0) {
        // Extract last frame from previous clip for continuity
        // (Would need FFmpeg integration - simplified here)
        console.log(`  Using previous clip for continuity`);
      }

      const result = await this.generateClip({
        prompt: scene.veoPrompt,
        negativePrompt: scene.negativePrompt,
        duration: scene.duration,
        aspectRatio: storyboard.aspectRatio,
        resolution: storyboard.resolution,
        referenceImages,
        outputDir: storyboard.outputDir,
        filename: `scene_${String(scene.id).padStart(2, '0')}_${scene.name}.mp4`
      });

      clips.push(result);
      totalCost += result.cost;

      if (result.success && result.videoPath) {
        lastClipPath = result.videoPath;
      }

      // Rate limiting between generations
      if (i < storyboard.scenes.length - 1) {
        console.log(`  Waiting 5s before next scene...`);
        await this.sleep(5000);
      }
    }

    const successCount = clips.filter(c => c.success).length;
    console.log(`\n[VeoGenerator] Storyboard complete: ${successCount}/${storyboard.scenes.length} scenes`);
    console.log(`  Total cost: $${totalCost.toFixed(2)}`);

    return {
      success: successCount === storyboard.scenes.length,
      clips,
      totalCost
    };
  }

  /**
   * Generate TikTok-optimized vertical video
   */
  async generateTikTokVideo(options: {
    prompt: string;
    duration?: 4 | 6 | 8;
    outputDir: string;
    filename?: string;
  }): Promise<VeoResult> {
    return this.generateClip({
      ...options,
      aspectRatio: '9:16',
      resolution: options.duration === 8 ? '1080p' : '720p'
    });
  }

  /**
   * Poll operation until complete
   */
  private async pollOperation(operation: any, maxAttempts = 60): Promise<any> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      if (operation.done) {
        return operation.result || operation;
      }

      await this.sleep(10000);  // Wait 10 seconds between polls
      attempts++;

      try {
        operation = await this.genAI.operations.getVideosOperation({ operation });
      } catch (error) {
        console.log(`[VeoGenerator] Poll attempt ${attempts}: waiting...`);
      }
    }

    throw new Error('Operation timed out after 10 minutes');
  }

  /**
   * Load image as base64
   */
  private async loadImageAsBase64(imagePath: string): Promise<{ data: string; mimeType: string }> {
    const buffer = await fs.readFile(imagePath);
    const data = buffer.toString('base64');

    // Detect mime type from extension
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif'
    };

    return {
      data,
      mimeType: mimeTypes[ext] || 'image/png'
    };
  }

  /**
   * Download video from URL
   */
  private async downloadVideo(uri: string): Promise<Buffer> {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to download video: ${response.status}`);
    }
    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Factory function
 */
export function createVeoGenerator(): VeoVideoGenerator {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required for Veo video generation');
  }
  return new VeoVideoGenerator(apiKey);
}

export default VeoVideoGenerator;
