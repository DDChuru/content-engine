/**
 * Video Stitcher Service
 *
 * Combines multiple video clips into a single video with:
 * - Crossfade transitions
 * - Audio mixing
 * - Text overlays
 * - Format conversion
 *
 * Uses FFmpeg for all video operations
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

export interface VideoClip {
  path: string;
  duration?: number;  // in seconds
  startTrim?: number; // trim from start
  endTrim?: number;   // trim from end
}

export interface TransitionConfig {
  type: 'crossfade' | 'fade' | 'wipe' | 'none';
  duration: number;  // in seconds
}

export interface StitchOptions {
  clips: VideoClip[];
  outputPath: string;
  transition?: TransitionConfig;
  audioTrack?: string;  // Background music path
  audioVolume?: number; // 0.0 to 1.0
  resolution?: {
    width: number;
    height: number;
  };
  fps?: number;
}

export interface ExtractFrameOptions {
  videoPath: string;
  outputPath: string;
  position: 'first' | 'last' | number;  // number = seconds from start
}

export interface StitchResult {
  success: boolean;
  outputPath?: string;
  duration?: number;
  error?: string;
}

export class VideoStitcher {

  /**
   * Stitch multiple clips together with transitions
   */
  async stitchClips(options: StitchOptions): Promise<StitchResult> {
    try {
      console.log(`[VideoStitcher] Stitching ${options.clips.length} clips...`);

      // Verify all clips exist
      for (const clip of options.clips) {
        try {
          await fs.access(clip.path);
        } catch {
          throw new Error(`Clip not found: ${clip.path}`);
        }
      }

      const outputDir = path.dirname(options.outputPath);
      await fs.mkdir(outputDir, { recursive: true });

      // Build FFmpeg command based on transition type
      const command = options.transition?.type === 'crossfade'
        ? await this.buildCrossfadeCommand(options)
        : await this.buildConcatCommand(options);

      console.log(`[VideoStitcher] Running FFmpeg command...`);
      console.log(`  Command: ${command.substring(0, 200)}...`);

      const { stdout, stderr } = await execAsync(command, {
        maxBuffer: 50 * 1024 * 1024  // 50MB buffer for long videos
      });

      // Get output duration
      const duration = await this.getVideoDuration(options.outputPath);

      console.log(`[VideoStitcher] ✓ Video stitched: ${options.outputPath}`);
      console.log(`  Duration: ${duration.toFixed(2)}s`);

      return {
        success: true,
        outputPath: options.outputPath,
        duration
      };

    } catch (error: any) {
      console.error(`[VideoStitcher] Error:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Build FFmpeg command for simple concatenation
   */
  private async buildConcatCommand(options: StitchOptions): Promise<string> {
    // Create concat file
    const concatFilePath = path.join(
      path.dirname(options.outputPath),
      `concat_${Date.now()}.txt`
    );

    const concatContent = options.clips
      .map(clip => `file '${clip.path}'`)
      .join('\n');

    await fs.writeFile(concatFilePath, concatContent);

    let command = `ffmpeg -y -f concat -safe 0 -i "${concatFilePath}"`;

    // Add audio if provided
    if (options.audioTrack) {
      const volume = options.audioVolume ?? 0.3;
      command += ` -i "${options.audioTrack}" -filter_complex "[1:a]volume=${volume}[music];[0:a][music]amix=inputs=2:duration=first[aout]" -map 0:v -map "[aout]"`;
    }

    // Resolution and FPS
    if (options.resolution) {
      command += ` -vf "scale=${options.resolution.width}:${options.resolution.height}"`;
    }
    if (options.fps) {
      command += ` -r ${options.fps}`;
    }

    command += ` -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k "${options.outputPath}"`;

    // Clean up concat file after (async, don't wait)
    setTimeout(() => fs.unlink(concatFilePath).catch(() => {}), 5000);

    return command;
  }

  /**
   * Build FFmpeg command for crossfade transitions
   */
  private async buildCrossfadeCommand(options: StitchOptions): Promise<string> {
    const clips = options.clips;
    const transitionDuration = options.transition?.duration ?? 0.5;

    // Get durations for all clips
    const durations: number[] = [];
    for (const clip of clips) {
      const duration = clip.duration || await this.getVideoDuration(clip.path);
      durations.push(duration);
    }

    // Build inputs
    const inputs = clips.map(c => `-i "${c.path}"`).join(' ');

    // Build complex filter for xfade
    let filterComplex = '';
    let currentLabel = '[0:v]';
    let audioFilter = '';
    let audioCurrentLabel = '[0:a]';

    for (let i = 1; i < clips.length; i++) {
      const offset = durations.slice(0, i).reduce((a, b) => a + b, 0) - (transitionDuration * i);
      const nextLabel = i === clips.length - 1 ? '[vout]' : `[v${i}]`;
      const audioNextLabel = i === clips.length - 1 ? '[aout]' : `[a${i}]`;

      filterComplex += `${currentLabel}[${i}:v]xfade=transition=fade:duration=${transitionDuration}:offset=${offset.toFixed(2)}${nextLabel};`;
      audioFilter += `${audioCurrentLabel}[${i}:a]acrossfade=d=${transitionDuration}${audioNextLabel};`;

      currentLabel = nextLabel;
      audioCurrentLabel = audioNextLabel;
    }

    // Handle single clip (no transitions needed)
    if (clips.length === 1) {
      filterComplex = '[0:v]copy[vout];';
      audioFilter = '[0:a]acopy[aout];';
    }

    let command = `ffmpeg -y ${inputs} -filter_complex "${filterComplex}${audioFilter.slice(0, -1)}"`;

    // Add background music if provided
    if (options.audioTrack) {
      const volume = options.audioVolume ?? 0.3;
      command = `ffmpeg -y ${inputs} -i "${options.audioTrack}" -filter_complex "${filterComplex}[aout];[aout]volume=1[main];[${clips.length}:a]volume=${volume}[music];[main][music]amix=inputs=2:duration=first[finalout]" -map "[vout]" -map "[finalout]"`;
    } else {
      command += ` -map "[vout]" -map "[aout]"`;
    }

    // Resolution
    if (options.resolution) {
      command += ` -vf "scale=${options.resolution.width}:${options.resolution.height}"`;
    }

    command += ` -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 192k "${options.outputPath}"`;

    return command;
  }

  /**
   * Extract a frame from video
   */
  async extractFrame(options: ExtractFrameOptions): Promise<string> {
    try {
      let position: string;

      if (options.position === 'first') {
        position = '00:00:00.100';
      } else if (options.position === 'last') {
        const duration = await this.getVideoDuration(options.videoPath);
        position = this.secondsToTimestamp(duration - 0.1);
      } else {
        position = this.secondsToTimestamp(options.position);
      }

      const command = `ffmpeg -y -ss ${position} -i "${options.videoPath}" -frames:v 1 -q:v 2 "${options.outputPath}"`;

      await execAsync(command);

      console.log(`[VideoStitcher] ✓ Frame extracted: ${options.outputPath}`);
      return options.outputPath;

    } catch (error: any) {
      console.error(`[VideoStitcher] Frame extraction error:`, error);
      throw error;
    }
  }

  /**
   * Get video duration in seconds
   */
  async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const command = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`;
      const { stdout } = await execAsync(command);
      return parseFloat(stdout.trim());
    } catch {
      return 8;  // Default to 8 seconds (Veo clip length)
    }
  }

  /**
   * Add text overlay to video
   */
  async addTextOverlay(options: {
    videoPath: string;
    outputPath: string;
    text: string;
    position?: 'top' | 'center' | 'bottom';
    fontSize?: number;
    fontColor?: string;
    startTime?: number;
    endTime?: number;
  }): Promise<string> {
    const {
      videoPath,
      outputPath,
      text,
      position = 'bottom',
      fontSize = 48,
      fontColor = 'white',
      startTime,
      endTime
    } = options;

    // Position coordinates
    const yPositions = {
      top: '100',
      center: '(h-text_h)/2',
      bottom: 'h-text_h-100'
    };

    let filter = `drawtext=text='${text.replace(/'/g, "\\'")}':fontsize=${fontSize}:fontcolor=${fontColor}:x=(w-text_w)/2:y=${yPositions[position]}:box=1:boxcolor=black@0.7:boxborderw=10`;

    // Add enable for timed overlay
    if (startTime !== undefined && endTime !== undefined) {
      filter += `:enable='between(t,${startTime},${endTime})'`;
    }

    const command = `ffmpeg -y -i "${videoPath}" -vf "${filter}" -c:a copy "${outputPath}"`;
    await execAsync(command);

    return outputPath;
  }

  /**
   * Convert seconds to HH:MM:SS.mmm timestamp
   */
  private secondsToTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = (seconds % 60).toFixed(3);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${secs.padStart(6, '0')}`;
  }

  /**
   * Get video info (resolution, fps, duration)
   */
  async getVideoInfo(videoPath: string): Promise<{
    width: number;
    height: number;
    fps: number;
    duration: number;
  }> {
    const command = `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,r_frame_rate,duration -of json "${videoPath}"`;
    const { stdout } = await execAsync(command);
    const data = JSON.parse(stdout);

    const stream = data.streams[0];
    const [fpsNum, fpsDen] = stream.r_frame_rate.split('/').map(Number);

    return {
      width: stream.width,
      height: stream.height,
      fps: fpsNum / fpsDen,
      duration: parseFloat(stream.duration)
    };
  }
}

// Singleton instance
export const videoStitcher = new VideoStitcher();
export default VideoStitcher;
