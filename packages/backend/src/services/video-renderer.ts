/**
 * Video Rendering Service
 * Uses Remotion to render videos programmatically
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface RenderOptions {
  sessionId: string;
  title: string;
  scenes: Array<{
    id: number;
    title: string;
    narration: string;
    visualDescription: string;
    duration: number;
    imagePath: string;
    audioPath: string;
    videoStyle?: 'gallery' | 'presentation' | 'hybrid';
  }>;
  totalDuration: number;
  outputPath: string;
  videoStyle?: 'gallery' | 'presentation' | 'hybrid';
}

export interface RenderProgress {
  stage: 'bundling' | 'rendering' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
  error?: string;
}

export class VideoRenderer {
  private progressCallbacks: Map<string, (progress: RenderProgress) => void> = new Map();

  /**
   * Render a video from storyboard data
   */
  async renderVideo(options: RenderOptions, onProgress?: (progress: RenderProgress) => void): Promise<string> {
    const { sessionId, title, scenes, totalDuration, outputPath, videoStyle = 'gallery' } = options;

    if (onProgress) {
      this.progressCallbacks.set(sessionId, onProgress);
    }

    try {
      this.updateProgress(sessionId, {
        stage: 'bundling',
        progress: 0,
        message: 'Bundling Remotion project...'
      });

      // Step 1: Bundle the Remotion project
      const remotionRoot = path.join(__dirname, '..', 'remotion', 'Root.tsx');
      const publicDir = path.join(__dirname, '..', 'remotion', 'public');

      console.log(`📦 Bundling Remotion project from: ${remotionRoot}`);
      console.log(`📁 Public directory: ${publicDir}`);
      console.log(`🎨 Video style: ${videoStyle}`);

      const bundleLocation = await bundle({
        entryPoint: remotionRoot,
        publicDir,
        webpackOverride: (config) => config,
      });

      console.log(`✅ Bundle created at: ${bundleLocation}`);

      this.updateProgress(sessionId, {
        stage: 'bundling',
        progress: 30,
        message: 'Bundle complete, preparing composition...'
      });

      // Step 2: Select the composition
      const compositionId = 'VideoDirector';

      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: compositionId,
        inputProps: {
          title,
          scenes,
          totalDuration,
          videoStyle,
        },
      });

      console.log(`🎬 Composition selected: ${composition.id}`);
      console.log(`   Duration: ${composition.durationInFrames} frames (${composition.durationInFrames / composition.fps}s)`);
      console.log(`   Dimensions: ${composition.width}x${composition.height}`);
      console.log(`   FPS: ${composition.fps}`);

      this.updateProgress(sessionId, {
        stage: 'rendering',
        progress: 40,
        message: 'Starting video render...'
      });

      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Step 3: Render the video
      console.log(`🎥 Rendering video to: ${outputPath}`);

      await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: {
          title,
          scenes,
          totalDuration,
          videoStyle,
        },
        onProgress: ({ progress, renderedFrames, encodedFrames }) => {
          const overallProgress = 40 + (progress * 60); // 40-100%
          this.updateProgress(sessionId, {
            stage: 'rendering',
            progress: overallProgress,
            message: `Rendering: ${renderedFrames} frames rendered, ${encodedFrames} frames encoded (${Math.round(progress * 100)}%)`
          });

          if (renderedFrames % 30 === 0) { // Log every second
            console.log(`   Progress: ${Math.round(progress * 100)}% (${renderedFrames}/${composition.durationInFrames} frames)`);
          }
        },
      });

      console.log(`✅ Video rendered successfully: ${outputPath}`);

      this.updateProgress(sessionId, {
        stage: 'complete',
        progress: 100,
        message: 'Video rendering complete!'
      });

      // Cleanup: Remove bundle directory
      await fs.rm(bundleLocation, { recursive: true, force: true });

      return outputPath;

    } catch (error: any) {
      console.error('❌ Video rendering failed:', error);

      this.updateProgress(sessionId, {
        stage: 'error',
        progress: 0,
        message: 'Video rendering failed',
        error: error.message
      });

      throw error;
    } finally {
      this.progressCallbacks.delete(sessionId);
    }
  }

  /**
   * Update progress for a rendering session
   */
  private updateProgress(sessionId: string, progress: RenderProgress) {
    const callback = this.progressCallbacks.get(sessionId);
    if (callback) {
      callback(progress);
    }
  }

  /**
   * Get estimated render time
   */
  estimateRenderTime(durationSeconds: number): number {
    // Rough estimate: ~2-4x real-time on average hardware
    // A 10-minute video might take 20-40 minutes to render
    const multiplier = 3; // Conservative estimate
    return durationSeconds * multiplier;
  }
}

// Singleton instance
export const videoRenderer = new VideoRenderer();
