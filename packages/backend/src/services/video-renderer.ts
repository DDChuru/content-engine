/**
 * Global Video Renderer Service
 *
 * Renders videos using Remotion with WebSlides-inspired components
 * Available to ALL workspaces (education, marketing, documentation, etc.)
 */

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import * as path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { ThemeName } from '../remotion/components/webslides';
import { remotionFileManager } from './remotion-file-manager.js';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface WebSlidesScene {
  id: number;
  title: string;
  subtitle?: string;
  mathNotation?: string;
  visual: string;
  audio?: string;
  duration: number;
  type: 'manim' | 'gemini' | 'd3-svg' | 'webslides-venn';

  // Optional: Sets Agent layout data
  layout?: {
    union_size?: number;
    intersection_size?: number;
    circle_radius?: number;
    circle_separation?: number;
    tier?: string;
  };
}

export interface RenderOptions {
  composition?: string;  // Remotion composition name
  scenes: WebSlidesScene[];
  theme?: ThemeName;
  outputPath: string;
  codec?: 'h264' | 'h265' | 'vp8' | 'vp9';
  width?: number;
  height?: number;
  fps?: number;
}

export interface RenderResult {
  success: boolean;
  videoPath?: string;
  duration?: number;
  error?: string;
  metadata: {
    scenes: number;
    codec: string;
    resolution: string;
    fps: number;
  };
}

export class VideoRenderer {
  private bundleCache: string | null = null;
  private defaultOutputDir = 'output/videos';

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.defaultOutputDir, { recursive: true });
    await fs.mkdir('output/videos/education', { recursive: true });
    await fs.mkdir('output/videos/marketing', { recursive: true });
    await fs.mkdir('output/videos/documentation', { recursive: true });
  }

  /**
   * Render video using WebSlides aesthetic
   *
   * This is the main method used by all agents
   */
  async renderWebSlidesVideo(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();

    try {
      console.log('[VideoRenderer] Starting WebSlides video render...');
      console.log(`  Scenes: ${options.scenes.length}`);
      console.log(`  Theme: ${options.theme || 'education-dark'}`);
      console.log(`  Output: ${options.outputPath}`);

      // Copy all assets to Remotion public directory
      console.log('[VideoRenderer] Copying assets to Remotion public directory...');
      const scenesWithRelativePaths = await Promise.all(
        options.scenes.map(async (scene) => {
          // Copy visual asset
          const visualRelativePath = await remotionFileManager.copyVisual(scene.visual);

          // Copy audio if present
          let audioRelativePath = '';
          if (scene.audio) {
            audioRelativePath = await remotionFileManager.copyAudio(scene.audio);
          }

          return {
            ...scene,
            visual: visualRelativePath,
            audio: audioRelativePath
          };
        })
      );
      console.log('[VideoRenderer] ✓ All assets copied');

      // Bundle Remotion project (cache for performance)
      if (!this.bundleCache) {
        console.log('[VideoRenderer] Bundling Remotion project...');
        const bundleResult = await bundle({
          entryPoint: path.join(__dirname, '../remotion/Root.tsx'),
          publicDir: path.join(__dirname, '../remotion/public'),
          webpackOverride: (config) => config,
        });

        // bundleResult can be either a string (serveUrl) or an object with serveUrl property
        if (typeof bundleResult === 'string') {
          this.bundleCache = bundleResult;
        } else if (bundleResult && typeof bundleResult === 'object' && 'serveUrl' in bundleResult) {
          this.bundleCache = bundleResult.serveUrl;
        } else {
          throw new Error(`Bundle result is invalid: ${JSON.stringify(bundleResult)}`);
        }

        console.log(`[VideoRenderer] Bundle cached: ${this.bundleCache}`);
      }

      // Get composition
      const compositionId = options.composition || 'EducationalLesson';
      const composition = await selectComposition({
        serveUrl: this.bundleCache,
        id: compositionId,
        inputProps: {
          scenes: scenesWithRelativePaths,
          theme: options.theme || 'education-dark'
        }
      });

      console.log(`[VideoRenderer] Composition: ${composition.id}`);
      console.log(`  Duration: ${composition.durationInFrames} frames`);
      console.log(`  FPS: ${composition.fps}`);
      console.log(`  Dimensions: ${composition.width}x${composition.height}`);

      // Render video
      console.log('[VideoRenderer] Rendering video...');
      await renderMedia({
        composition,
        serveUrl: this.bundleCache,
        codec: options.codec || 'h264',
        outputLocation: options.outputPath,
        inputProps: {
          scenes: scenesWithRelativePaths,
          theme: options.theme || 'education-dark'
        }
      });

      const executionTime = Date.now() - startTime;
      console.log(`[VideoRenderer] ✓ Video rendered in ${(executionTime / 1000).toFixed(2)}s`);
      console.log(`  Output: ${options.outputPath}`);

      return {
        success: true,
        videoPath: options.outputPath,
        duration: composition.durationInFrames / composition.fps,
        metadata: {
          scenes: options.scenes.length,
          codec: options.codec || 'h264',
          resolution: `${composition.width}x${composition.height}`,
          fps: composition.fps
        }
      };
    } catch (error) {
      console.error('[VideoRenderer] Error rendering video:', error);

      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          scenes: options.scenes.length,
          codec: options.codec || 'h264',
          resolution: `${options.width || 1920}x${options.height || 1080}`,
          fps: options.fps || 30
        }
      };
    }
  }

  /**
   * Render presentation video (generic, no domain-specific styling)
   *
   * For marketing, documentation, general presentations
   */
  async renderPresentation(options: RenderOptions): Promise<RenderResult> {
    console.log('[VideoRenderer] Rendering presentation video...');

    // Use marketing or documentation theme by default
    return this.renderWebSlidesVideo({
      ...options,
      theme: options.theme || 'marketing'
    });
  }

  /**
   * Quick render with defaults (for testing)
   */
  async quickRender(
    scenes: WebSlidesScene[],
    outputFilename: string,
    theme: ThemeName = 'education-dark'
  ): Promise<RenderResult> {
    const outputPath = path.join(this.defaultOutputDir, outputFilename);

    return this.renderWebSlidesVideo({
      scenes,
      theme,
      outputPath,
      codec: 'h264',
      width: 1920,
      height: 1080,
      fps: 30
    });
  }

  /**
   * Clear bundle cache (useful for development)
   */
  clearCache(): void {
    this.bundleCache = null;
    console.log('[VideoRenderer] Cache cleared');
  }
}

/**
 * Singleton instance (global access)
 */
export const videoRenderer = new VideoRenderer();
