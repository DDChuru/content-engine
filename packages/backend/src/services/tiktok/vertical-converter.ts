import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);

/**
 * Conversion styles for vertical video transformation
 */
export type ConversionStyle = 'crop' | 'blur-background' | 'zoom';

/**
 * Configuration options for video conversion
 */
export interface ConversionConfig {
  style: ConversionStyle;
  outputResolution?: string; // Default: '1080x1920'
  blurIntensity?: number; // For blur-background style (default: 20)
  zoomFactor?: number; // For zoom style (default: 1.5)
}

/**
 * Video metadata information
 */
export interface VideoInfo {
  width: number;
  height: number;
  duration: number;
  format: string;
  aspectRatio: number;
  bitrate?: number;
  codec?: string;
}

/**
 * VerticalConverter - Converts horizontal videos to vertical 9:16 format for TikTok
 *
 * Supports three conversion styles:
 * 1. crop: Simple center crop to 9:16
 * 2. blur-background: Scale to fit height, blur background fills sides (RECOMMENDED)
 * 3. zoom: Smart zoom into subject, crop to 9:16
 */
export class VerticalConverter {
  private readonly defaultResolution = '1080x1920';
  private readonly defaultBlurIntensity = 20;
  private readonly defaultZoomFactor = 1.5;

  /**
   * Convert a video to vertical 9:16 format
   * @param inputPath Path to input video file
   * @param config Conversion configuration
   * @returns Path to converted video file
   */
  async convertToVertical(
    inputPath: string,
    config: ConversionConfig = { style: 'blur-background' }
  ): Promise<string> {
    // Validate input
    await this.validateVideo(inputPath);

    // Get video info
    const videoInfo = await this.getVideoInfo(inputPath);

    // Check if already vertical
    if (videoInfo.aspectRatio <= 0.6) {
      console.log('Video is already vertical (9:16 or similar), skipping conversion');
      return inputPath;
    }

    // Generate output path
    const outputPath = this.generateOutputPath(inputPath, config.style);

    try {
      // Convert based on style
      switch (config.style) {
        case 'crop':
          await this.cropCenter(inputPath, outputPath, config);
          break;
        case 'blur-background':
          await this.blurBackground(inputPath, outputPath, config);
          break;
        case 'zoom':
          await this.smartZoom(inputPath, outputPath, config);
          break;
        default:
          throw new Error(`Unknown conversion style: ${config.style}`);
      }

      return outputPath;
    } catch (error) {
      // Clean up failed output file
      try {
        if (fs.existsSync(outputPath)) {
          await unlink(outputPath);
        }
      } catch (cleanupError) {
        console.error('Failed to clean up output file:', cleanupError);
      }
      throw error;
    }
  }

  /**
   * Simple center crop to 9:16 aspect ratio
   * Fast but may lose important content on the sides
   */
  async cropCenter(
    input: string,
    output: string,
    config: ConversionConfig
  ): Promise<void> {
    const [width, height] = this.parseResolution(
      config.outputResolution || this.defaultResolution
    );

    // FFmpeg command: crop to 9:16 ratio from center, then scale to target resolution
    // crop=ih*(9/16):ih - crop width to maintain 9:16 ratio based on input height
    const ffmpegArgs = [
      '-i', input,
      '-vf', `crop=ih*(9/16):ih,scale=${width}:${height}`,
      '-c:a', 'copy', // Copy audio without re-encoding
      '-y', // Overwrite output file
      output
    ];

    await this.runFFmpeg(ffmpegArgs, 'Center crop conversion');
  }

  /**
   * Scale video to fit height, blur background fills the sides (RECOMMENDED)
   * Professional look, preserves all content, no cropping
   */
  async blurBackground(
    input: string,
    output: string,
    config: ConversionConfig
  ): Promise<void> {
    const [width, height] = this.parseResolution(
      config.outputResolution || this.defaultResolution
    );
    const blurIntensity = config.blurIntensity || this.defaultBlurIntensity;

    // Complex filter pipeline:
    // 1. [0:v]scale=1080:1920:force_original_aspect_ratio=decrease,boxblur=20:5[bg]
    //    - Scale to fill frame (may have black bars), blur heavily for background
    // 2. [0:v]scale=-1:1920[fg]
    //    - Scale original to fit height, maintain aspect ratio for foreground
    // 3. [bg][fg]overlay=(W-w)/2:(H-h)/2
    //    - Overlay centered foreground on blurred background
    const filterComplex = [
      `[0:v]scale=${width}:${height}:force_original_aspect_ratio=increase,boxblur=${blurIntensity}:5[bg]`,
      `[0:v]scale=-1:${height}[fg]`,
      `[bg][fg]overlay=(W-w)/2:(H-h)/2`
    ].join(';');

    const ffmpegArgs = [
      '-i', input,
      '-filter_complex', filterComplex,
      '-c:a', 'copy',
      '-y',
      output
    ];

    await this.runFFmpeg(ffmpegArgs, 'Blur background conversion');
  }

  /**
   * Zoom into subject and crop to 9:16
   * Good for presentations or content with centered subject
   */
  async smartZoom(
    input: string,
    output: string,
    config: ConversionConfig
  ): Promise<void> {
    const [width, height] = this.parseResolution(
      config.outputResolution || this.defaultResolution
    );
    const zoomFactor = config.zoomFactor || this.defaultZoomFactor;

    // Scale up by zoom factor, then crop to 9:16 from center
    const ffmpegArgs = [
      '-i', input,
      '-vf', `scale=iw*${zoomFactor}:ih*${zoomFactor},crop=${width}:${height}`,
      '-c:a', 'copy',
      '-y',
      output
    ];

    await this.runFFmpeg(ffmpegArgs, 'Smart zoom conversion');
  }

  /**
   * Get detailed video information using FFprobe
   */
  async getVideoInfo(videoPath: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        videoPath
      ]);

      let stdout = '';
      let stderr = '';

      ffprobe.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      ffprobe.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`FFprobe failed with code ${code}: ${stderr}`));
          return;
        }

        try {
          const data = JSON.parse(stdout);
          const videoStream = data.streams.find((s: any) => s.codec_type === 'video');

          if (!videoStream) {
            reject(new Error('No video stream found'));
            return;
          }

          const width = videoStream.width;
          const height = videoStream.height;
          const duration = parseFloat(data.format.duration || '0');
          const format = data.format.format_name || 'unknown';
          const bitrate = parseInt(data.format.bit_rate || '0');
          const codec = videoStream.codec_name || 'unknown';

          resolve({
            width,
            height,
            duration,
            format,
            aspectRatio: width / height,
            bitrate,
            codec
          });
        } catch (error) {
          reject(new Error(`Failed to parse FFprobe output: ${error}`));
        }
      });

      ffprobe.on('error', (error) => {
        reject(new Error(`Failed to spawn FFprobe: ${error.message}`));
      });
    });
  }

  /**
   * Validate that video file exists and is accessible
   */
  async validateVideo(videoPath: string): Promise<void> {
    try {
      const stats = await stat(videoPath);

      if (!stats.isFile()) {
        throw new Error(`Path is not a file: ${videoPath}`);
      }

      if (stats.size === 0) {
        throw new Error(`Video file is empty: ${videoPath}`);
      }
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        throw new Error(`Video file not found: ${videoPath}`);
      }
      throw error;
    }
  }

  /**
   * Run FFmpeg command with progress tracking
   */
  private async runFFmpeg(args: string[], operation: string): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`Starting ${operation}...`);
      console.log(`FFmpeg command: ffmpeg ${args.join(' ')}`);

      const ffmpeg = spawn('ffmpeg', args);

      let stderr = '';

      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
        // Parse progress from FFmpeg output
        const timeMatch = data.toString().match(/time=(\d+):(\d+):(\d+\.\d+)/);
        if (timeMatch) {
          const hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const seconds = parseFloat(timeMatch[3]);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;
          process.stdout.write(`\r${operation}: ${totalSeconds.toFixed(1)}s processed`);
        }
      });

      ffmpeg.on('close', (code) => {
        process.stdout.write('\n');

        if (code !== 0) {
          console.error(`FFmpeg stderr: ${stderr}`);
          reject(new Error(`FFmpeg failed with code ${code}`));
          return;
        }

        console.log(`${operation} completed successfully`);
        resolve();
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`Failed to spawn FFmpeg: ${error.message}`));
      });
    });
  }

  /**
   * Generate output path based on input and style
   */
  private generateOutputPath(inputPath: string, style: ConversionStyle): string {
    const parsed = path.parse(inputPath);
    const timestamp = Date.now();
    return path.join(
      parsed.dir,
      `${parsed.name}_vertical_${style}_${timestamp}${parsed.ext}`
    );
  }

  /**
   * Parse resolution string (e.g., '1080x1920') into [width, height]
   */
  private parseResolution(resolution: string): [number, number] {
    const parts = resolution.split('x');
    if (parts.length !== 2) {
      throw new Error(`Invalid resolution format: ${resolution}`);
    }

    const width = parseInt(parts[0]);
    const height = parseInt(parts[1]);

    if (isNaN(width) || isNaN(height)) {
      throw new Error(`Invalid resolution values: ${resolution}`);
    }

    return [width, height];
  }

  /**
   * Get recommended conversion style based on video aspect ratio
   */
  getRecommendedStyle(aspectRatio: number): ConversionStyle {
    // 16:9 ≈ 1.78
    // 4:3 ≈ 1.33
    // 9:16 ≈ 0.56

    if (aspectRatio >= 1.6) {
      // Wide video (16:9 or wider) - blur-background works best
      return 'blur-background';
    } else if (aspectRatio >= 1.2) {
      // Medium aspect ratio (4:3) - crop or zoom work well
      return 'crop';
    } else {
      // Already close to vertical - simple crop
      return 'crop';
    }
  }

  /**
   * Batch convert multiple videos
   */
  async convertBatch(
    inputs: string[],
    config: ConversionConfig
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();

    for (const input of inputs) {
      try {
        console.log(`\nConverting ${input}...`);
        const output = await this.convertToVertical(input, config);
        results.set(input, output);
      } catch (error) {
        console.error(`Failed to convert ${input}:`, error);
        results.set(input, `ERROR: ${error}`);
      }
    }

    return results;
  }

  /**
   * Get conversion statistics
   */
  async getConversionStats(
    originalPath: string,
    convertedPath: string
  ): Promise<{
    originalSize: number;
    convertedSize: number;
    sizeReduction: number;
    originalInfo: VideoInfo;
    convertedInfo: VideoInfo;
  }> {
    const [originalStats, convertedStats, originalInfo, convertedInfo] = await Promise.all([
      stat(originalPath),
      stat(convertedPath),
      this.getVideoInfo(originalPath),
      this.getVideoInfo(convertedPath)
    ]);

    const sizeReduction = ((originalStats.size - convertedStats.size) / originalStats.size) * 100;

    return {
      originalSize: originalStats.size,
      convertedSize: convertedStats.size,
      sizeReduction,
      originalInfo,
      convertedInfo
    };
  }
}

// Export singleton instance
export const verticalConverter = new VerticalConverter();

// Export for testing
export default VerticalConverter;
