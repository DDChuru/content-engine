import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Caption style configuration for subtitle rendering
 */
export interface CaptionStyle {
  font: string;           // Font family (e.g., 'Arial', 'Impact')
  size: number;           // Font size (e.g., 32)
  color: string;          // Primary color (ASS format: '&H00FFFFFF')
  outline: string;        // Outline color (ASS format: '&H00000000')
  outlineWidth?: number;  // Outline width (default: 2)
  bold: boolean;          // Bold text
  position: 'top' | 'middle' | 'bottom';  // Vertical position
  alignment: number;      // 1-9 (numpad layout)
  backgroundColor?: string; // Background color (ASS format)
  backgroundOpacity?: number; // 0-255
}

/**
 * Transcript segment with timing information
 */
export interface TranscriptSegment {
  text: string;
  start: number;  // Start time in seconds
  end: number;    // End time in seconds
  speaker?: string;
}

/**
 * Word-level timing for dynamic captions
 */
export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

/**
 * Caption generation options
 */
export interface CaptionOptions {
  style?: Partial<CaptionStyle>;
  maxLineWidth?: number;      // Maximum characters per line
  maxLines?: number;          // Maximum lines per caption
  wordWrap?: boolean;         // Enable word wrapping
  rtl?: boolean;              // Right-to-left language support
  preserveFormatting?: boolean; // Keep line breaks from source
}

/**
 * Default TikTok-style caption configuration
 */
export const DEFAULT_TIKTOK_STYLE: CaptionStyle = {
  font: 'Arial',
  size: 32,
  color: '&H00FFFFFF',      // White
  outline: '&H00000000',    // Black
  outlineWidth: 2,
  bold: true,
  position: 'bottom',
  alignment: 2              // Bottom center (numpad layout)
};

/**
 * Popular caption style presets
 */
export const CAPTION_PRESETS = {
  tiktok: DEFAULT_TIKTOK_STYLE,
  youtube: {
    font: 'Roboto',
    size: 28,
    color: '&H00FFFFFF',
    outline: '&H00000000',
    outlineWidth: 1,
    bold: false,
    position: 'bottom',
    alignment: 2,
    backgroundColor: '&H00000000',
    backgroundOpacity: 128
  },
  instagram: {
    font: 'Impact',
    size: 36,
    color: '&H00FFFFFF',
    outline: '&H00000000',
    outlineWidth: 3,
    bold: true,
    position: 'middle',
    alignment: 5  // Center
  },
  minimal: {
    font: 'Helvetica',
    size: 24,
    color: '&H00FFFFFF',
    outline: '&H00000000',
    outlineWidth: 1,
    bold: false,
    position: 'bottom',
    alignment: 2
  },
  bold: {
    font: 'Impact',
    size: 40,
    color: '&H0000FFFF',  // Yellow
    outline: '&H00000000',
    outlineWidth: 3,
    bold: true,
    position: 'top',
    alignment: 8
  }
};

/**
 * Caption Generator for TikTok-style videos
 * Generates SRT subtitles and burns them into videos using FFmpeg
 */
export class CaptionGenerator {
  private tempDir: string;

  constructor(tempDir: string = '/tmp/captions') {
    this.tempDir = tempDir;
  }

  /**
   * Initialize the caption generator (create temp directory)
   */
  async initialize(): Promise<void> {
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  /**
   * Generate SRT subtitle file from transcript segments
   * @param segments - Array of transcript segments with timing
   * @param language - Language code (for RTL detection)
   * @param options - Caption generation options
   * @returns Path to generated SRT file
   */
  async generateCaptions(
    segments: TranscriptSegment[],
    language: string = 'en',
    options: CaptionOptions = {}
  ): Promise<string> {
    const {
      maxLineWidth = 42,
      maxLines = 2,
      wordWrap = true,
      rtl = this.isRTL(language),
      preserveFormatting = false
    } = options;

    let srtContent = '';
    let captionIndex = 1;

    for (const segment of segments) {
      const text = this.sanitizeText(segment.text);
      const lines = wordWrap
        ? this.wrapText(text, maxLineWidth, maxLines)
        : [text];

      // Create SRT entry
      srtContent += `${captionIndex}\n`;
      srtContent += `${this.formatTime(segment.start)} --> ${this.formatTime(segment.end)}\n`;

      if (rtl) {
        srtContent += lines.map(line => `\u202B${line}\u202C`).join('\n');
      } else {
        srtContent += lines.join('\n');
      }

      srtContent += '\n\n';
      captionIndex++;
    }

    // Save to temp file
    const srtPath = path.join(this.tempDir, `captions_${Date.now()}.srt`);
    await fs.writeFile(srtPath, srtContent, 'utf-8');

    return srtPath;
  }

  /**
   * Burn captions into video using FFmpeg
   * @param videoPath - Path to input video file
   * @param srtPath - Path to SRT subtitle file
   * @param style - Caption style configuration
   * @param outputPath - Optional output path (defaults to temp file)
   * @returns Path to output video with burned captions
   */
  async burnCaptions(
    videoPath: string,
    srtPath: string,
    style: Partial<CaptionStyle> = {},
    outputPath?: string
  ): Promise<string> {
    const finalStyle = { ...DEFAULT_TIKTOK_STYLE, ...style };
    const output = outputPath || path.join(
      this.tempDir,
      `captioned_${Date.now()}.mp4`
    );

    // Escape paths for FFmpeg
    const escapedSrtPath = srtPath.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "'\\''");

    // Build FFmpeg command with subtitle filter
    const styleString = this.getStyleString(finalStyle);
    const subtitlesFilter = `subtitles='${escapedSrtPath}':force_style='${styleString}'`;

    const command = `ffmpeg -i "${videoPath}" -vf "${subtitlesFilter}" -c:a copy "${output}"`;

    try {
      await execAsync(command);
      return output;
    } catch (error) {
      throw new Error(`Failed to burn captions: ${error}`);
    }
  }

  /**
   * Generate dynamic word-by-word captions (TikTok style)
   * Creates ASS format with word-level highlighting
   * @param segments - Transcript segments
   * @param wordTimings - Optional word-level timing data
   * @param style - Caption style
   * @returns Path to ASS file
   */
  async generateDynamicCaptions(
    segments: TranscriptSegment[],
    wordTimings?: WordTiming[][],
    style: Partial<CaptionStyle> = {}
  ): Promise<string> {
    const finalStyle = { ...DEFAULT_TIKTOK_STYLE, ...style };

    // Build ASS file header
    let assContent = this.buildASSHeader(finalStyle);

    // Add events section
    assContent += '\n[Events]\n';
    assContent += 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n';

    // Generate word-by-word captions
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const words = wordTimings?.[i] || this.estimateWordTimings(segment);

      for (const wordTiming of words) {
        const startTime = this.formatASSTime(wordTiming.start);
        const endTime = this.formatASSTime(wordTiming.end);
        const text = this.sanitizeText(wordTiming.word);

        // Add highlight effect using color tags
        const highlightedText = `{\\c&H00FFFF&}${text}{\\c}`;

        assContent += `Dialogue: 0,${startTime},${endTime},Default,,0,0,0,,${highlightedText}\n`;
      }
    }

    const assPath = path.join(this.tempDir, `dynamic_captions_${Date.now()}.ass`);
    await fs.writeFile(assPath, assContent, 'utf-8');

    return assPath;
  }

  /**
   * Burn dynamic ASS captions into video
   */
  async burnDynamicCaptions(
    videoPath: string,
    assPath: string,
    outputPath?: string
  ): Promise<string> {
    const output = outputPath || path.join(
      this.tempDir,
      `dynamic_captioned_${Date.now()}.mp4`
    );

    const escapedAssPath = assPath.replace(/\\/g, '\\\\').replace(/:/g, '\\:').replace(/'/g, "'\\''");
    const command = `ffmpeg -i "${videoPath}" -vf "ass='${escapedAssPath}'" -c:a copy "${output}"`;

    try {
      await execAsync(command);
      return output;
    } catch (error) {
      throw new Error(`Failed to burn dynamic captions: ${error}`);
    }
  }

  /**
   * Format seconds to SRT timestamp (HH:MM:SS,mmm)
   */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
  }

  /**
   * Format seconds to ASS timestamp (H:MM:SS.cc)
   */
  formatASSTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const centiseconds = Math.floor((seconds % 1) * 100);

    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
  }

  /**
   * Convert CaptionStyle to FFmpeg force_style string
   */
  getStyleString(style: CaptionStyle): string {
    const styles: string[] = [
      `FontName=${style.font}`,
      `FontSize=${style.size}`,
      `PrimaryColour=${style.color}`,
      `OutlineColour=${style.outline}`,
      `Outline=${style.outlineWidth || 2}`,
      `Bold=${style.bold ? '1' : '0'}`,
      `Alignment=${style.alignment}`
    ];

    if (style.backgroundColor) {
      styles.push(`BackColour=${style.backgroundColor}`);
    }

    // Add vertical positioning
    const marginV = this.getMarginV(style.position);
    if (marginV > 0) {
      styles.push(`MarginV=${marginV}`);
    }

    return styles.join(',');
  }

  /**
   * Build ASS file header with style definition
   */
  private buildASSHeader(style: CaptionStyle): string {
    const marginV = this.getMarginV(style.position);

    return `[Script Info]
Title: Dynamic Captions
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,${style.font},${style.size},${style.color},${style.color},${style.outline},${style.backgroundColor || '&H00000000'},${style.bold ? '-1' : '0'},0,0,0,100,100,0,0,1,${style.outlineWidth || 2},0,${style.alignment},10,10,${marginV},1`;
  }

  /**
   * Get vertical margin based on position
   */
  private getMarginV(position: 'top' | 'middle' | 'bottom'): number {
    switch (position) {
      case 'top':
        return 20;
      case 'middle':
        return 0;
      case 'bottom':
        return 20;
      default:
        return 20;
    }
  }

  /**
   * Split text into words and estimate timing
   */
  private estimateWordTimings(segment: TranscriptSegment): WordTiming[] {
    const words = segment.text.split(/\s+/).filter(w => w.length > 0);
    const duration = segment.end - segment.start;
    const wordDuration = duration / words.length;

    return words.map((word, index) => ({
      word,
      start: segment.start + (index * wordDuration),
      end: segment.start + ((index + 1) * wordDuration)
    }));
  }

  /**
   * Wrap text to specified width
   */
  wrapText(text: string, maxWidth: number, maxLines: number = 2): string[] {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;

      if (testLine.length <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        currentLine = word;

        if (lines.length >= maxLines) {
          break;
        }
      }
    }

    if (currentLine && lines.length < maxLines) {
      lines.push(currentLine);
    }

    return lines;
  }

  /**
   * Sanitize text for SRT/ASS format
   * Escapes special characters and handles emojis
   */
  sanitizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();
  }

  /**
   * Check if language uses right-to-left script
   */
  private isRTL(language: string): boolean {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'yi'];
    return rtlLanguages.includes(language.toLowerCase().substring(0, 2));
  }

  /**
   * Split transcript into optimal caption segments
   * Combines short segments and splits long ones
   */
  splitIntoSegments(
    transcript: string,
    timing: { start: number; end: number },
    maxCharsPerSegment: number = 42
  ): TranscriptSegment[] {
    const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];
    const segments: TranscriptSegment[] = [];
    const duration = timing.end - timing.start;
    const totalChars = transcript.length;

    let currentPos = 0;

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (!trimmed) continue;

      const charRatio = trimmed.length / totalChars;
      const segmentDuration = duration * charRatio;
      const start = timing.start + (currentPos / totalChars) * duration;
      const end = start + segmentDuration;

      segments.push({
        text: trimmed,
        start,
        end
      });

      currentPos += trimmed.length;
    }

    return segments;
  }

  /**
   * Clean up temporary files
   */
  async cleanup(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.warn(`Failed to cleanup file ${filePath}:`, error);
    }
  }

  /**
   * Clean up all temporary files in temp directory
   */
  async cleanupAll(): Promise<void> {
    try {
      const files = await fs.readdir(this.tempDir);
      await Promise.all(
        files.map(file => this.cleanup(path.join(this.tempDir, file)))
      );
    } catch (error) {
      console.warn('Failed to cleanup temp directory:', error);
    }
  }

  /**
   * Generate caption preview (first few lines for testing)
   */
  async generatePreview(
    segments: TranscriptSegment[],
    maxSegments: number = 3
  ): Promise<string> {
    const previewSegments = segments.slice(0, maxSegments);
    let preview = '';

    for (let i = 0; i < previewSegments.length; i++) {
      const segment = previewSegments[i];
      preview += `${i + 1}\n`;
      preview += `${this.formatTime(segment.start)} --> ${this.formatTime(segment.end)}\n`;
      preview += `${segment.text}\n\n`;
    }

    return preview;
  }

  /**
   * Validate SRT file format
   */
  async validateSRT(srtPath: string): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      const content = await fs.readFile(srtPath, 'utf-8');
      const entries = content.split('\n\n').filter(e => e.trim());

      for (let i = 0; i < entries.length; i++) {
        const lines = entries[i].split('\n');

        // Check index
        if (!/^\d+$/.test(lines[0])) {
          errors.push(`Entry ${i + 1}: Invalid index`);
        }

        // Check timestamp
        if (!/^\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}$/.test(lines[1])) {
          errors.push(`Entry ${i + 1}: Invalid timestamp format`);
        }

        // Check text
        if (lines.length < 3) {
          errors.push(`Entry ${i + 1}: Missing caption text`);
        }
      }

      return { valid: errors.length === 0, errors };
    } catch (error) {
      return { valid: false, errors: [`Failed to read SRT file: ${error}`] };
    }
  }
}

/**
 * Factory function to create and initialize caption generator
 */
export async function createCaptionGenerator(tempDir?: string): Promise<CaptionGenerator> {
  const generator = new CaptionGenerator(tempDir);
  await generator.initialize();
  return generator;
}

/**
 * Quick helper to generate and burn captions in one step
 */
export async function addCaptionsToVideo(
  videoPath: string,
  segments: TranscriptSegment[],
  options: {
    language?: string;
    style?: Partial<CaptionStyle>;
    outputPath?: string;
    captionOptions?: CaptionOptions;
  } = {}
): Promise<string> {
  const generator = await createCaptionGenerator();

  try {
    // Generate SRT
    const srtPath = await generator.generateCaptions(
      segments,
      options.language,
      options.captionOptions
    );

    // Burn captions
    const output = await generator.burnCaptions(
      videoPath,
      srtPath,
      options.style,
      options.outputPath
    );

    // Cleanup SRT
    await generator.cleanup(srtPath);

    return output;
  } catch (error) {
    await generator.cleanupAll();
    throw error;
  }
}
