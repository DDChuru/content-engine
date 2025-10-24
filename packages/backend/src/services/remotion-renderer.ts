import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

export interface RemotionScene {
  id: number;
  title: string;
  visual: string;
  audio: string;
  duration: number;
  type: 'manim' | 'gemini';
}

export interface RenderOptions {
  scenes: RemotionScene[];
  outputFilename?: string;
}

export class RemotionRenderer {
  private outputDir = 'output/education/videos';
  private __dirname: string;

  constructor() {
    // Get directory name in ES modules
    const __filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(__filename);
    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
  }

  /**
   * Render final video from scenes using Remotion
   */
  async renderFinalVideo(options: RenderOptions): Promise<string> {
    const { scenes, outputFilename } = options;

    console.log('\n🎬 Starting Remotion render...');
    console.log(`   Scenes: ${scenes.length}`);
    console.log(`   Total duration: ${this.calculateTotalDuration(scenes)}s`);

    try {
      // 1. Bundle Remotion code
      console.log('📦 Bundling Remotion composition...');
      const bundleLocation = await bundle({
        entryPoint: path.join(this.__dirname, '../remotion/Root.tsx'),
        // @ts-ignore
        webpackOverride: (config) => config,
      });

      console.log(`✅ Bundle created: ${bundleLocation}`);

      // 2. Get composition
      const composition = await selectComposition({
        serveUrl: bundleLocation,
        id: 'EducationalLesson',
        inputProps: {
          scenes: this.prepareScenes(scenes)
        },
      });

      console.log(`✅ Composition selected: ${composition.id}`);

      // 3. Calculate total duration
      const totalDuration = this.calculateTotalDuration(scenes);
      const fps = composition.fps;
      const durationInFrames = Math.round(totalDuration * fps);

      // 4. Output path
      const outputPath = path.join(
        this.outputDir,
        outputFilename || `lesson_${Date.now()}.mp4`
      );

      // 5. Render video
      console.log('🎥 Rendering final video...');
      await renderMedia({
        composition: {
          ...composition,
          durationInFrames
        },
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation: outputPath,
        inputProps: {
          scenes: this.prepareScenes(scenes)
        },
        onProgress: ({ progress }) => {
          console.log(`   Render progress: ${(progress * 100).toFixed(1)}%`);
        },
      });

      console.log(`\n✅ Final video rendered: ${outputPath}`);

      return outputPath;
    } catch (error: any) {
      console.error('Remotion rendering failed:', error);
      throw new Error(`Failed to render final video: ${error.message}`);
    }
  }

  /**
   * Prepare scenes with absolute paths
   */
  private prepareScenes(scenes: RemotionScene[]): RemotionScene[] {
    return scenes.map(scene => ({
      ...scene,
      visual: path.isAbsolute(scene.visual)
        ? scene.visual
        : path.resolve(scene.visual),
      audio: path.isAbsolute(scene.audio)
        ? scene.audio
        : path.resolve(scene.audio)
    }));
  }

  /**
   * Calculate total duration including transitions
   */
  private calculateTotalDuration(scenes: RemotionScene[]): number {
    // Each scene + 1 second transition (except last)
    const sceneDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
    const transitionDuration = (scenes.length - 1) * 1; // 1s per transition
    return sceneDuration + transitionDuration;
  }

  /**
   * Preview composition in browser (development only)
   */
  async previewComposition(scenes: RemotionScene[]): Promise<string> {
    console.log('🎬 Starting Remotion preview server...');

    const bundleLocation = await bundle({
      entryPoint: path.join(this.__dirname, '../remotion/Root.tsx'),
      // @ts-ignore
      webpackOverride: (config) => config,
    });

    console.log(`\n✅ Preview available at: ${bundleLocation}`);
    console.log('   Press Ctrl+C to stop preview server');

    return bundleLocation;
  }
}

export default RemotionRenderer;
