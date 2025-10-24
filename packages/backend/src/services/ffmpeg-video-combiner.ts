import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

export interface CombinerScene {
  id: number;
  title: string;
  visual: string;
  audio: string;
  duration: number;
  type: 'manim' | 'gemini';
}

export interface CombinerOptions {
  scenes: CombinerScene[];
  outputFilename?: string;
}

export class FFmpegVideoCombiner {
  private outputDir = 'output/education/videos';
  private tempDir = 'output/education/temp';

  constructor() {
    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.outputDir, { recursive: true });
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  /**
   * Combine all scenes into final video using FFmpeg
   */
  async combineScenesIntoFinalVideo(options: CombinerOptions): Promise<string> {
    const { scenes, outputFilename } = options;

    console.log('\n🎬 Starting FFmpeg video composition...');
    console.log(`   Scenes: ${scenes.length}`);

    try {
      // Step 1: Process each scene (add audio to video/image)
      const processedScenes: string[] = [];

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        console.log(`\n📹 Processing scene ${i + 1}/${scenes.length}: ${scene.title}`);

        const processedPath = await this.processScene(scene, i);
        processedScenes.push(processedPath);
      }

      // Step 2: Concatenate using filter_complex (handles timebase mismatches)
      const outputPath = path.join(
        this.outputDir,
        outputFilename || `final_lesson_${Date.now()}.mp4`
      );

      console.log('\n🎥 Concatenating all scenes...');

      // Build filter_complex concat command
      const inputs = processedScenes.map(p => `-i "${p}"`).join(' ');
      const filterInputs = processedScenes.map((_, i) => `[${i}:v][${i}:a]`).join('');
      const filterComplex = `${filterInputs}concat=n=${processedScenes.length}:v=1:a=1[v][a]`;

      const concatCommand = `ffmpeg ${inputs} -filter_complex "${filterComplex}" -map "[v]" -map "[a]" -c:v libx264 -c:a aac -movflags +faststart "${outputPath}" -y`;

      const { stdout, stderr } = await execAsync(concatCommand, {
        timeout: 180000,
        maxBuffer: 10 * 1024 * 1024
      });

      console.log(`\n✅ Final video created: ${outputPath}`);

      // Cleanup temp files
      await this.cleanup(processedScenes);

      return outputPath;
    } catch (error: any) {
      console.error('FFmpeg composition failed:', error);
      throw new Error(`Failed to combine scenes: ${error.message}`);
    }
  }

  /**
   * Process a single scene (combine visual + audio)
   */
  private async processScene(scene: CombinerScene, index: number): Promise<string> {
    const outputPath = path.join(this.tempDir, `scene_${index}_${Date.now()}.mp4`);

    // Clean paths (remove line breaks and extra spaces)
    const cleanVisual = scene.visual.replace(/\s+/g, ' ').trim().replace(/ /g, '');
    const cleanAudio = scene.audio.replace(/\s+/g, ' ').trim().replace(/ /g, '');

    if (scene.type === 'manim') {
      // Video scene: Sync video with audio
      console.log(`   🎬 Syncing Manim video with audio...`);
      console.log(`      Visual: ${cleanVisual}`);
      console.log(`      Audio: ${cleanAudio}`);

      // Get actual durations
      const videoDuration = await this.getVideoDuration(cleanVisual);
      const audioDuration = await this.getAudioDuration(cleanAudio);

      console.log(`      Video duration: ${videoDuration}s`);
      console.log(`      Audio duration: ${audioDuration}s`);

      // Strategy: Use audio as the master timeline
      // If video is shorter: loop last frame
      // If video is longer: extend audio with silence
      // Normalize all videos to consistent settings for concat compatibility
      if (videoDuration < audioDuration) {
        // Video is shorter - extend video by repeating last frame
        console.log(`      🔄 Extending video to match audio (${audioDuration}s)`);
        const command = `ffmpeg -i "${cleanVisual}" -i "${cleanAudio}" \\
          -filter_complex "[0:v]tpad=stop_mode=clone:stop_duration=${audioDuration - videoDuration},fps=15,scale=1920:1080:flags=lanczos,format=yuv420p[v]" \\
          -map "[v]" -map 1:a -c:v libx264 -preset fast -c:a aac -t ${audioDuration} "${outputPath}" -y`;

        await execAsync(command.replace(/\\\n/g, ' '), {
          timeout: 60000,
          maxBuffer: 10 * 1024 * 1024
        });
      } else if (videoDuration > audioDuration) {
        // Video is longer - extend audio with silence
        console.log(`      🔇 Extending audio with silence to match video (${videoDuration}s)`);
        const command = `ffmpeg -i "${cleanVisual}" -i "${cleanAudio}" \\
          -filter_complex "[0:v]fps=15,scale=1920:1080:flags=lanczos,format=yuv420p[v];[1:a]apad=whole_dur=${videoDuration}[a]" \\
          -map "[v]" -map "[a]" -c:v libx264 -preset fast -c:a aac -t ${videoDuration} "${outputPath}" -y`;

        await execAsync(command.replace(/\\\n/g, ' '), {
          timeout: 60000,
          maxBuffer: 10 * 1024 * 1024
        });
      } else {
        // Durations match - normalize video settings
        console.log(`      ✅ Durations match perfectly`);
        const command = `ffmpeg -i "${cleanVisual}" -i "${cleanAudio}" \\
          -vf "fps=15,scale=1920:1080:flags=lanczos,format=yuv420p" \\
          -c:v libx264 -preset fast -c:a aac -shortest "${outputPath}" -y`;

        await execAsync(command.replace(/\\\n/g, ' '), {
          timeout: 60000,
          maxBuffer: 10 * 1024 * 1024
        });
      }
    } else {
      // Image scene: Create video from image with exact audio duration
      console.log(`   🖼️  Creating video from image + audio...`);
      console.log(`      Image: ${cleanVisual}`);
      console.log(`      Audio: ${cleanAudio}`);

      const audioDuration = await this.getAudioDuration(cleanAudio);
      console.log(`      Duration: ${audioDuration}s`);

      const command = `ffmpeg -loop 1 -i "${cleanVisual}" -i "${cleanAudio}" -vf "fps=15,scale=1920:1080:flags=lanczos,format=yuv420p" -c:v libx264 -preset fast -tune stillimage -c:a aac -t ${audioDuration} "${outputPath}" -y`;

      await execAsync(command, {
        timeout: 60000,
        maxBuffer: 10 * 1024 * 1024
      });
    }

    console.log(`   ✅ Scene processed: ${outputPath}`);
    return outputPath;
  }

  /**
   * Get video duration using ffprobe
   */
  private async getVideoDuration(videoPath: string): Promise<number> {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`,
      { timeout: 10000 }
    );
    return parseFloat(stdout.trim());
  }

  /**
   * Get audio duration using ffprobe
   */
  private async getAudioDuration(audioPath: string): Promise<number> {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`,
      { timeout: 10000 }
    );
    return parseFloat(stdout.trim());
  }

  /**
   * Cleanup temporary files
   */
  private async cleanup(processedScenes: string[]): Promise<void> {
    try {
      console.log('\n🧹 Cleaning up temporary files...');

      // Delete processed scene files
      for (const scenePath of processedScenes) {
        await fs.unlink(scenePath).catch(() => {});
      }

      console.log('✅ Cleanup complete');
    } catch (error) {
      console.warn('Warning: Cleanup had some errors:', error);
    }
  }

  /**
   * Check if FFmpeg is available
   */
  async checkFFmpeg(): Promise<boolean> {
    try {
      await execAsync('ffmpeg -version');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default FFmpegVideoCombiner;
