/**
 * Avatar Compositor
 *
 * Composites AI-generated avatar videos onto main educational videos
 * using FFmpeg filters for picture-in-picture effects
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import type { CompositeConfig, CompositeResult, AvatarPosition } from '../types/avatar.js';

const execAsync = promisify(exec);

export class AvatarCompositor {
  private outputDir: string;

  constructor(outputDir: string = 'output/videos') {
    this.outputDir = path.resolve(outputDir);
  }

  /**
   * Composite avatar video onto main video
   */
  async composite(config: CompositeConfig): Promise<CompositeResult> {
    console.log('[Compositor] Starting avatar compositing');
    console.log(`[Compositor] Main video: ${config.mainVideo}`);
    console.log(`[Compositor] Avatar video: ${config.avatarVideo}`);
    console.log(`[Compositor] Position: ${config.position}, Scale: ${config.scale}`);

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    // Generate output path
    const outputPath =
      config.outputPath ||
      path.join(this.outputDir, `with_avatar_${Date.now()}.mp4`);

    // Build FFmpeg filter
    const filter = this.buildFFmpegFilter(config);

    // Build FFmpeg command
    const command = [
      'ffmpeg',
      '-y', // Overwrite output
      `-i "${config.mainVideo}"`, // Main video input
      `-i "${config.avatarVideo}"`, // Avatar video input
      '-filter_complex', `"${filter}"`,
      '-c:a copy', // Copy audio from main video
      '-c:v libx264', // Encode video with H.264
      '-preset fast', // Fast encoding
      '-crf 23', // Quality level
      `"${outputPath}"`,
    ].join(' ');

    console.log('[Compositor] Executing FFmpeg...');

    try {
      const { stdout, stderr } = await execAsync(command);

      if (stderr) {
        console.log('[Compositor] FFmpeg output:', stderr);
      }

      // Get file info
      const stats = await fs.stat(outputPath);
      const duration = await this.getVideoDuration(outputPath);

      console.log('[Compositor] Compositing complete!');
      console.log(`[Compositor] Output: ${outputPath}`);
      console.log(`[Compositor] Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);

      return {
        videoPath: outputPath,
        duration,
        fileSize: stats.size,
      };
    } catch (error: any) {
      console.error('[Compositor] Error:', error.message);
      throw new Error(`Avatar compositing failed: ${error.message}`);
    }
  }

  /**
   * Build FFmpeg filter complex string
   */
  private buildFFmpegFilter(config: CompositeConfig): string {
    const scale = config.scale;
    const position = this.getPositionCoordinates(config.position);
    const border = config.addBorder ? this.getBorderFilter(config.borderColor) : '';

    // Filter parts:
    // 1. Scale avatar to desired size
    // 2. Optionally add border
    // 3. Overlay on main video at specified position
    const filters: string[] = [];

    // Scale avatar
    filters.push(`[1:v]scale=iw*${scale}:ih*${scale}[scaled]`);

    // Add border if requested
    if (config.addBorder) {
      const borderColor = config.borderColor || 'white';
      const borderSize = Math.round(scale * 10); // 10px border scaled
      filters.push(
        `[scaled]pad=iw+${borderSize * 2}:ih+${borderSize * 2}:${borderSize}:${borderSize}:${borderColor}[bordered]`
      );
      filters.push(`[0:v][bordered]overlay=${position}[out]`);
    } else {
      filters.push(`[0:v][scaled]overlay=${position}[out]`);
    }

    return filters.join(';');
  }

  /**
   * Get overlay position coordinates for FFmpeg
   */
  private getPositionCoordinates(position: AvatarPosition): string {
    const margin = 10; // Pixels from edge

    switch (position) {
      case 'top-right':
        return `W-w-${margin}:${margin}`;
      case 'top-left':
        return `${margin}:${margin}`;
      case 'bottom-right':
        return `W-w-${margin}:H-h-${margin}`;
      case 'bottom-left':
        return `${margin}:H-h-${margin}`;
      default:
        return `W-w-${margin}:${margin}`; // Default to top-right
    }
  }

  /**
   * Get border filter string
   */
  private getBorderFilter(color?: string): string {
    const borderColor = color || 'white';
    return `pad=iw+20:ih+20:10:10:${borderColor}`;
  }

  /**
   * Get video duration using FFprobe
   */
  private async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      const { stdout } = await execAsync(command);
      return parseFloat(stdout.trim());
    } catch (error) {
      console.warn('[Compositor] Could not get duration, using 0');
      return 0;
    }
  }

  /**
   * Create picture-in-picture composite (convenience method)
   */
  async createPictureInPicture(
    mainVideo: string,
    avatarVideo: string,
    options: {
      position?: AvatarPosition;
      scale?: number;
      addBorder?: boolean;
      outputPath?: string;
    } = {}
  ): Promise<CompositeResult> {
    return this.composite({
      mainVideo,
      avatarVideo,
      position: options.position || 'top-right',
      scale: options.scale || 0.2,
      addBorder: options.addBorder !== false, // Default true
      borderColor: 'white',
      outputPath: options.outputPath,
    });
  }

  /**
   * Create split screen composite
   */
  async createSplitScreen(
    mainVideo: string,
    avatarVideo: string,
    outputPath?: string
  ): Promise<CompositeResult> {
    console.log('[Compositor] Creating split screen layout');

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    const output = outputPath || path.join(this.outputDir, `split_screen_${Date.now()}.mp4`);

    // Split screen filter: scale both videos and place side by side
    const filter = [
      '[0:v]scale=iw/2:ih[left]',
      '[1:v]scale=iw/2:ih[right]',
      '[left][right]hstack[out]',
    ].join(';');

    const command = [
      'ffmpeg',
      '-y',
      `-i "${mainVideo}"`,
      `-i "${avatarVideo}"`,
      '-filter_complex',
      `"${filter}"`,
      '-map', '"[out]"',
      '-c:a', 'copy',
      '-c:v', 'libx264',
      '-preset', 'fast',
      `"${output}"`,
    ].join(' ');

    console.log('[Compositor] Executing FFmpeg for split screen...');

    try {
      await execAsync(command);

      const stats = await fs.stat(output);
      const duration = await this.getVideoDuration(output);

      console.log('[Compositor] Split screen complete!');

      return {
        videoPath: output,
        duration,
        fileSize: stats.size,
      };
    } catch (error: any) {
      throw new Error(`Split screen compositing failed: ${error.message}`);
    }
  }

  /**
   * Get composite preview/info without rendering
   */
  async getCompositeInfo(config: CompositeConfig): Promise<{
    mainDuration: number;
    avatarDuration: number;
    estimatedSize: number;
    filter: string;
  }> {
    const mainDuration = await this.getVideoDuration(config.mainVideo);
    const avatarDuration = await this.getVideoDuration(config.avatarVideo);
    const filter = this.buildFFmpegFilter(config);

    // Rough estimate: main video size + 20% overhead
    const mainStats = await fs.stat(config.mainVideo);
    const estimatedSize = Math.round(mainStats.size * 1.2);

    return {
      mainDuration,
      avatarDuration,
      estimatedSize,
      filter,
    };
  }
}

export default AvatarCompositor;
