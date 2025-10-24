import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

/**
 * CTA Configuration Interface
 */
export interface CTAConfig {
  text: string;                  // CTA text (e.g., "Full video on YouTube 👆")
  position: 'top' | 'bottom';   // Vertical position
  startTime?: number;            // When to show (default: 0)
  duration?: number;             // How long to show (default: last 3 seconds)
  fontSize?: number;             // Font size (default: 40)
  fontColor?: string;            // Text color (default: 'white')
  backgroundColor?: string;      // Background color (optional)
  borderColor?: string;          // Border color (default: 'black')
  borderWidth?: number;          // Border width (default: 3)
}

/**
 * Animated CTA Configuration Interface
 */
export interface AnimatedCTAConfig extends CTAConfig {
  animation: 'fade' | 'slide' | 'bounce' | 'pulse';
  arrow?: boolean;               // Show arrow pointing up
  arrowAnimation?: boolean;      // Animate arrow (bounce)
}

/**
 * CTAOverlay Service
 * Handles adding Call-to-Action overlays to TikTok videos
 */
export class CTAOverlay {
  private readonly defaultFontPaths = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    '/Windows/Fonts/arialbd.ttf',
    'C:\\Windows\\Fonts\\arialbd.ttf',
  ];

  private readonly fallbackFonts = [
    '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
    '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
    '/System/Library/Fonts/Helvetica.ttc',
    '/Windows/Fonts/arial.ttf',
  ];

  /**
   * Get video duration in seconds
   */
  async getVideoDuration(videoPath: string): Promise<number> {
    try {
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
      );
      return parseFloat(stdout.trim());
    } catch (error) {
      throw new Error(`Failed to get video duration: ${error}`);
    }
  }

  /**
   * Calculate start time for CTA based on duration
   */
  calculateStartTime(videoDuration: number, showDuration: number = 3): number {
    return Math.max(0, videoDuration - showDuration);
  }

  /**
   * Sanitize CTA text for FFmpeg drawtext filter
   * Escape special characters while preserving emojis
   */
  sanitizeCTAText(text: string): string {
    // FFmpeg drawtext requires escaping of special characters
    // Preserve emojis but escape: : \ ' [ ] , ;
    return text
      .replace(/\\/g, '\\\\')     // Escape backslashes
      .replace(/:/g, '\\:')       // Escape colons
      .replace(/'/g, "\\'")       // Escape single quotes
      .replace(/\[/g, '\\[')      // Escape brackets
      .replace(/\]/g, '\\]')
      .replace(/,/g, '\\,')       // Escape commas
      .replace(/;/g, '\\;');      // Escape semicolons
  }

  /**
   * Find available font file
   */
  async findFontFile(): Promise<string> {
    // Try default fonts first
    for (const fontPath of this.defaultFontPaths) {
      try {
        await fs.access(fontPath);
        return fontPath;
      } catch {
        continue;
      }
    }

    // Try fallback fonts
    for (const fontPath of this.fallbackFonts) {
      try {
        await fs.access(fontPath);
        return fontPath;
      } catch {
        continue;
      }
    }

    throw new Error('No suitable font file found on system');
  }

  /**
   * Build FFmpeg drawtext filter for simple CTA
   */
  async buildCTAFilter(config: CTAConfig, videoDuration?: number): Promise<string> {
    const {
      text,
      position = 'top',
      startTime,
      duration = 3,
      fontSize = 40,
      fontColor = 'white',
      backgroundColor,
      borderColor = 'black',
      borderWidth = 3,
    } = config;

    const fontFile = await this.findFontFile();
    const sanitizedText = this.sanitizeCTAText(text);

    // Calculate start time if not provided
    let enableTime = startTime ?? 0;
    if (videoDuration && startTime === undefined) {
      enableTime = this.calculateStartTime(videoDuration, duration);
    }

    // Calculate Y position
    const yPos = position === 'top' ? '100' : 'h-text_h-100';

    // Build filter parts
    const filterParts = [
      `text='${sanitizedText}'`,
      `fontfile=${fontFile}`,
      `fontsize=${fontSize}`,
      `fontcolor=${fontColor}`,
      `bordercolor=${borderColor}`,
      `borderw=${borderWidth}`,
      `x=(w-text_w)/2`,  // Center horizontally
      `y=${yPos}`,
    ];

    // Add background box if specified
    if (backgroundColor) {
      filterParts.push(`box=1`);
      filterParts.push(`boxcolor=${backgroundColor}`);
      filterParts.push(`boxborderw=10`);
    }

    // Add enable condition for timing
    if (enableTime > 0) {
      filterParts.push(`enable='gte(t,${enableTime})'`);
    }

    return `drawtext=${filterParts.join(':')}`;
  }

  /**
   * Build FFmpeg filter for animated CTA
   */
  async buildAnimatedFilter(config: AnimatedCTAConfig, videoDuration?: number): Promise<string> {
    const {
      text,
      position = 'top',
      startTime,
      duration = 3,
      fontSize = 40,
      fontColor = 'white',
      backgroundColor,
      borderColor = 'black',
      borderWidth = 3,
      animation,
      arrow = false,
      arrowAnimation = false,
    } = config;

    const fontFile = await this.findFontFile();
    const sanitizedText = this.sanitizeCTAText(text);

    // Calculate start time if not provided
    let enableTime = startTime ?? 0;
    if (videoDuration && startTime === undefined) {
      enableTime = this.calculateStartTime(videoDuration, duration);
    }

    // Base Y position
    const baseYPos = position === 'top' ? '100' : 'h-text_h-100';

    // Build animation-specific parameters
    let animatedParams: { [key: string]: string } = {};

    switch (animation) {
      case 'fade':
        // Fade in over 1 second
        animatedParams.alpha = `'if(lt(t,${enableTime}),0,if(lt(t,${enableTime + 1}),(t-${enableTime}),1))'`;
        break;

      case 'slide':
        // Slide in from top or bottom
        if (position === 'top') {
          // Slide down from above
          animatedParams.y = `'if(lt(t,${enableTime}),-text_h,if(lt(t,${enableTime + 1}),${baseYPos}*(t-${enableTime}),${baseYPos}))'`;
        } else {
          // Slide up from below
          animatedParams.y = `'if(lt(t,${enableTime}),h,if(lt(t,${enableTime + 1}),h-(h-${baseYPos})*(t-${enableTime}),${baseYPos}))'`;
        }
        break;

      case 'bounce':
        // Bounce effect using elastic easing
        const bounceFormula = position === 'top'
          ? `'${baseYPos}-20*sin(2*PI*(t-${enableTime}))*exp(-3*(t-${enableTime}))'`
          : `'${baseYPos}+20*sin(2*PI*(t-${enableTime}))*exp(-3*(t-${enableTime}))'`;
        animatedParams.y = bounceFormula;
        break;

      case 'pulse':
        // Pulsing size effect
        animatedParams.fontsize = `'${fontSize}+5*sin(2*PI*(t-${enableTime}))'`;
        break;
    }

    // Build filter parts
    const filterParts = [
      `text='${sanitizedText}'`,
      `fontfile=${fontFile}`,
      `fontsize=${animatedParams.fontsize || fontSize}`,
      `fontcolor=${fontColor}`,
      `bordercolor=${borderColor}`,
      `borderw=${borderWidth}`,
      `x=(w-text_w)/2`,  // Center horizontally
    ];

    // Add Y position (static or animated)
    if (animatedParams.y) {
      filterParts.push(`y=${animatedParams.y}`);
    } else {
      filterParts.push(`y=${baseYPos}`);
    }

    // Add alpha if fading
    if (animatedParams.alpha) {
      filterParts.push(`alpha=${animatedParams.alpha}`);
    }

    // Add background box if specified
    if (backgroundColor) {
      filterParts.push(`box=1`);
      filterParts.push(`boxcolor=${backgroundColor}`);
      filterParts.push(`boxborderw=10`);
    }

    // Add enable condition for timing
    if (enableTime > 0) {
      filterParts.push(`enable='gte(t,${enableTime})'`);
    }

    const mainFilter = `drawtext=${filterParts.join(':')}`;

    // Add arrow overlay if requested
    if (arrow) {
      const arrowText = position === 'top' ? '⬆️' : '⬇️';
      const arrowYPos = position === 'top' ? '50' : 'h-text_h-50';

      let arrowYAnimation = arrowYPos;
      if (arrowAnimation) {
        // Bounce arrow up and down
        arrowYAnimation = `'${arrowYPos}+10*sin(4*PI*(t-${enableTime}))'`;
      }

      const arrowFilter = `drawtext=text='${arrowText}':fontfile=${fontFile}:fontsize=${fontSize + 10}:fontcolor=${fontColor}:bordercolor=${borderColor}:borderw=${borderWidth}:x=(w-text_w)/2:y=${arrowYAnimation}:enable='gte(t,${enableTime})'`;

      return `${mainFilter},${arrowFilter}`;
    }

    return mainFilter;
  }

  /**
   * Add simple CTA overlay to video
   */
  async addCTA(
    videoPath: string,
    config: CTAConfig,
    outputPath?: string
  ): Promise<string> {
    try {
      // Get video duration
      const duration = await this.getVideoDuration(videoPath);

      // Build CTA filter
      const filter = await this.buildCTAFilter(config, duration);

      // Determine output path
      const output = outputPath || this.generateOutputPath(videoPath, 'cta');

      // Apply filter with FFmpeg
      const command = `ffmpeg -i "${videoPath}" -vf "${filter}" -c:a copy -y "${output}"`;

      console.log('Applying CTA overlay...');
      console.log('Filter:', filter);

      await execAsync(command);

      console.log(`CTA overlay added: ${output}`);
      return output;
    } catch (error) {
      throw new Error(`Failed to add CTA overlay: ${error}`);
    }
  }

  /**
   * Add animated CTA overlay to video
   */
  async addAnimatedCTA(
    videoPath: string,
    config: AnimatedCTAConfig,
    outputPath?: string
  ): Promise<string> {
    try {
      // Get video duration
      const duration = await this.getVideoDuration(videoPath);

      // Build animated CTA filter
      const filter = await this.buildAnimatedFilter(config, duration);

      // Determine output path
      const output = outputPath || this.generateOutputPath(videoPath, `cta-${config.animation}`);

      // Apply filter with FFmpeg
      const command = `ffmpeg -i "${videoPath}" -vf "${filter}" -c:a copy -y "${output}"`;

      console.log('Applying animated CTA overlay...');
      console.log('Animation:', config.animation);
      console.log('Filter:', filter);

      await execAsync(command);

      console.log(`Animated CTA overlay added: ${output}`);
      return output;
    } catch (error) {
      throw new Error(`Failed to add animated CTA overlay: ${error}`);
    }
  }

  /**
   * Add default CTA overlay (Full video on YouTube 👆)
   */
  async addDefaultCTA(videoPath: string, outputPath?: string): Promise<string> {
    const defaultConfig: CTAConfig = {
      text: 'Full video on YouTube 👆',
      position: 'top',
      fontSize: 40,
      fontColor: 'white',
      borderColor: 'black',
      borderWidth: 3,
      duration: 3,
    };

    return this.addCTA(videoPath, defaultConfig, outputPath);
  }

  /**
   * Add default animated CTA with fade effect
   */
  async addDefaultAnimatedCTA(videoPath: string, outputPath?: string): Promise<string> {
    const defaultConfig: AnimatedCTAConfig = {
      text: 'Full video on YouTube 👆',
      position: 'top',
      fontSize: 40,
      fontColor: 'white',
      borderColor: 'black',
      borderWidth: 3,
      duration: 3,
      animation: 'fade',
      arrow: false,
      arrowAnimation: false,
    };

    return this.addAnimatedCTA(videoPath, defaultConfig, outputPath);
  }

  /**
   * Create CTA with custom styling and background
   */
  async addStyledCTA(
    videoPath: string,
    text: string,
    options: {
      position?: 'top' | 'bottom';
      animation?: 'fade' | 'slide' | 'bounce' | 'pulse';
      backgroundColor?: string;
      fontColor?: string;
      fontSize?: number;
      showArrow?: boolean;
      animateArrow?: boolean;
    } = {},
    outputPath?: string
  ): Promise<string> {
    const config: AnimatedCTAConfig = {
      text,
      position: options.position || 'top',
      fontSize: options.fontSize || 40,
      fontColor: options.fontColor || 'white',
      backgroundColor: options.backgroundColor,
      borderColor: 'black',
      borderWidth: 3,
      duration: 3,
      animation: options.animation || 'fade',
      arrow: options.showArrow || false,
      arrowAnimation: options.animateArrow || false,
    };

    return this.addAnimatedCTA(videoPath, config, outputPath);
  }

  /**
   * Generate output path with suffix
   */
  private generateOutputPath(inputPath: string, suffix: string): string {
    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const name = path.basename(inputPath, ext);
    return path.join(dir, `${name}-${suffix}${ext}`);
  }

  /**
   * Batch add CTAs to multiple videos
   */
  async addCTABatch(
    videoPaths: string[],
    config: CTAConfig | AnimatedCTAConfig,
    outputDir?: string
  ): Promise<string[]> {
    const results: string[] = [];

    for (const videoPath of videoPaths) {
      try {
        let outputPath: string | undefined;
        if (outputDir) {
          const filename = path.basename(videoPath);
          outputPath = path.join(outputDir, filename);
        }

        const result = 'animation' in config
          ? await this.addAnimatedCTA(videoPath, config as AnimatedCTAConfig, outputPath)
          : await this.addCTA(videoPath, config, outputPath);

        results.push(result);
      } catch (error) {
        console.error(`Failed to add CTA to ${videoPath}:`, error);
        throw error;
      }
    }

    return results;
  }

  /**
   * Preview CTA configuration (returns filter string without processing)
   */
  async previewCTAFilter(
    config: CTAConfig | AnimatedCTAConfig,
    videoDuration: number = 60
  ): Promise<string> {
    if ('animation' in config) {
      return this.buildAnimatedFilter(config as AnimatedCTAConfig, videoDuration);
    } else {
      return this.buildCTAFilter(config, videoDuration);
    }
  }

  /**
   * Get available fonts on system
   */
  async getAvailableFonts(): Promise<string[]> {
    const availableFonts: string[] = [];
    const allFonts = [...this.defaultFontPaths, ...this.fallbackFonts];

    for (const fontPath of allFonts) {
      try {
        await fs.access(fontPath);
        availableFonts.push(fontPath);
      } catch {
        continue;
      }
    }

    return availableFonts;
  }
}

// Export singleton instance
export const ctaOverlay = new CTAOverlay();

// Export default instance
export default ctaOverlay;
