/**
 * TikTok Moment Analyzer Service
 * Analyzes long-form videos to find viral TikTok moments
 *
 * Features:
 * - Extracts key frames for visual analysis
 * - Transcribes audio with Whisper
 * - Uses Claude to identify best moments
 * - Extracts clips using FFmpeg
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';
import * as os from 'os';
import OpenAI from 'openai';
import { ClaudeService } from '../claude.js';
import type {
  Moment,
  Frame,
  Transcript,
  TranscriptSegment,
  AnalysisCriteria,
  MomentAnalysisResult,
  ExtractionConfig,
  ClipExtractionOptions
} from './types.js';

/**
 * Default analysis criteria for selecting viral moments
 */
const DEFAULT_CRITERIA: AnalysisCriteria = {
  hookDuration: 3,
  minViralScore: 6,
  requiresSelfContained: true,
  emotionalEngagement: true
};

/**
 * MomentAnalyzer - Finds viral moments in long-form videos
 */
export class MomentAnalyzer {
  private openai: OpenAI;
  private claude: ClaudeService;
  private tempDir: string;

  constructor(openaiKey: string, claudeKey: string) {
    this.openai = new OpenAI({ apiKey: openaiKey });
    this.claude = new ClaudeService(claudeKey);
    this.tempDir = path.join(os.tmpdir(), 'moment-analyzer');
  }

  /**
   * Main method to find best viral moments in a video
   */
  async findBestMoments(
    config: ExtractionConfig
  ): Promise<MomentAnalysisResult> {
    const startTime = Date.now();

    try {
      // Create temp directory
      await this.ensureTempDir();

      // Get video duration
      const totalDuration = await this.getVideoDuration(config.videoPath);

      // Extract key frames at intervals
      const frames = await this.extractKeyFrames(
        config.videoPath,
        config.frameInterval || 2
      );

      // Transcribe the video audio
      const transcript = await this.transcribeVideo(config.videoPath);

      // Analyze with Claude to find best moments
      const moments = await this.analyzeWithClaude(
        frames,
        transcript,
        config.count,
        config.duration,
        config.criteria
      );

      // Clean up temp files
      await this.cleanup();

      const processingTime = Date.now() - startTime;

      return {
        moments,
        totalDuration,
        framesAnalyzed: frames.length,
        transcriptLength: transcript.text.length,
        processingTime
      };
    } catch (error) {
      await this.cleanup();
      throw error;
    }
  }

  /**
   * Extract key frames from video at regular intervals
   */
  async extractKeyFrames(
    videoPath: string,
    intervalSeconds: number = 2
  ): Promise<Frame[]> {
    const frames: Frame[] = [];
    const duration = await this.getVideoDuration(videoPath);
    const frameCount = Math.floor(duration / intervalSeconds);

    for (let i = 0; i < frameCount; i++) {
      const timestamp = i * intervalSeconds;
      const framePath = path.join(
        this.tempDir,
        `frame_${timestamp.toFixed(2)}.jpg`
      );

      // Extract frame using FFmpeg
      await this.runFFmpeg([
        '-ss', timestamp.toString(),
        '-i', videoPath,
        '-vframes', '1',
        '-q:v', '2',
        framePath
      ]);

      // Read frame as base64
      const frameBuffer = await fs.readFile(framePath);
      const base64 = frameBuffer.toString('base64');

      frames.push({
        timestamp,
        base64
      });
    }

    return frames;
  }

  /**
   * Transcribe video audio using OpenAI Whisper
   */
  async transcribeVideo(videoPath: string): Promise<Transcript> {
    // Extract audio to temp file
    const audioPath = path.join(this.tempDir, 'audio.mp3');

    await this.runFFmpeg([
      '-i', videoPath,
      '-vn',
      '-acodec', 'libmp3lame',
      '-ab', '192k',
      '-ar', '44100',
      audioPath
    ]);

    // Transcribe with Whisper
    const transcription = await this.openai.audio.transcriptions.create({
      file: await fs.readFile(audioPath).then(buffer => {
        return new File([buffer], 'audio.mp3', { type: 'audio/mpeg' });
      }),
      model: 'whisper-1',
      response_format: 'verbose_json',
      timestamp_granularities: ['segment']
    });

    // Convert to our Transcript format
    const segments: TranscriptSegment[] = (transcription.segments || []).map((seg: any, index: number) => ({
      id: index,
      start: seg.start,
      end: seg.end,
      text: seg.text
    }));

    return {
      text: transcription.text || '',
      segments
    };
  }

  /**
   * Use Claude to analyze frames and transcript to identify best moments
   */
  async analyzeWithClaude(
    frames: Frame[],
    transcript: Transcript,
    count: number,
    duration: number,
    criteria?: Partial<AnalysisCriteria>
  ): Promise<Moment[]> {
    const analysisCriteria = { ...DEFAULT_CRITERIA, ...criteria };

    // Build the prompt for Claude
    const systemPrompt = `You are an expert TikTok content strategist analyzing long-form videos to identify viral moments.

Your task is to find the ${count} best moments that would perform well as standalone TikTok videos.

ANALYSIS CRITERIA:
1. HOOK (First ${analysisCriteria.hookDuration} seconds): Must be immediately attention-grabbing
   - Start with action, emotion, or intrigue
   - Visual or verbal hook that stops scrolling
   - Promise of value or entertainment

2. VALUE/INSIGHT: Clear takeaway or entertainment value
   - Educational: Teaches something useful
   - Entertaining: Makes people laugh/feel emotion
   - Inspirational: Motivates or inspires
   - Relatable: "This is so me" factor

3. SELF-CONTAINED: Makes sense without context
   ${analysisCriteria.requiresSelfContained ? '- REQUIRED: Must tell complete micro-story' : '- Preferred but not required'}
   - No references to "earlier" or "later"
   - Complete thought from start to finish

4. EMOTIONAL ENGAGEMENT:
   ${analysisCriteria.emotionalEngagement ? '- REQUIRED: Must evoke emotion' : '- Preferred but not required'}
   - Surprise, joy, curiosity, inspiration
   - "I need to share this" feeling

5. SHAREABILITY:
   - Would people send this to friends?
   - Does it spark conversation?
   - Is it quotable or memorable?

VIRAL POTENTIAL SCORING (1-10):
- 9-10: Extremely viral, hits all criteria perfectly
- 7-8: Strong potential, hits most criteria
- 5-6: Good potential, meets minimum requirements
- Below 5: Don't recommend

TARGET DURATION: ${duration} seconds (±2 seconds acceptable)

Return EXACTLY ${count} moments as a JSON array. Each moment must include:
- index: Sequential number (1, 2, 3...)
- startTime: Start timestamp in seconds
- endTime: End timestamp in seconds
- duration: Clip duration in seconds
- hook: Description of the hook in first 3 seconds
- keyMessage: The main value/insight of the moment
- viralPotential: Score from 1-10
- caption: Suggested TikTok caption (include 3-5 relevant hashtags)

IMPORTANT:
- Moments should NOT overlap
- Prioritize highest viral potential
- Ensure timing aligns with transcript segments
- Caption should be punchy and include hook`;

    // Prepare the content array with frames (sample every 5th frame to reduce tokens)
    const sampledFrames = frames.filter((_, index) => index % 5 === 0);
    const imageContent = sampledFrames.map(frame => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: 'image/jpeg' as const,
        data: frame.base64 || ''
      }
    }));

    // Build transcript context
    const transcriptContext = `FULL TRANSCRIPT WITH TIMESTAMPS:
${transcript.segments.map(seg =>
  `[${this.formatTimestamp(seg.start)} - ${this.formatTimestamp(seg.end)}] ${seg.text}`
).join('\n')}

TOTAL TRANSCRIPT:
${transcript.text}`;

    const userMessage = {
      role: 'user' as const,
      content: [
        {
          type: 'text' as const,
          text: `Analyze this video to find the ${count} best TikTok moments.

${transcriptContext}

I've provided frames at regular intervals for visual context. Based on the transcript timing and visual content, identify the ${count} best moments of approximately ${duration} seconds each.

Return your analysis as a JSON array following this exact structure:
[
  {
    "index": 1,
    "startTime": 0.0,
    "endTime": ${duration},
    "duration": ${duration},
    "hook": "Description of what happens in first 3 seconds that grabs attention",
    "keyMessage": "The main value or insight of this moment",
    "viralPotential": 8,
    "caption": "Punchy caption here #relevant #hashtags #tiktok"
  }
]`
        },
        ...imageContent
      ]
    };

    // Call Claude
    const response = await this.claude.sendMessage(
      [userMessage],
      undefined,
      systemPrompt,
      'claude-sonnet-4-5-20251001' // Use latest model for best analysis
    );

    // Extract and parse JSON from response
    const textResponse = response.content.find((c: any) => c.type === 'text')?.text || '';
    const moments = this.parseClaudeResponse(textResponse);

    // Filter by minimum viral score
    return moments.filter(m => m.viralPotential >= analysisCriteria.minViralScore);
  }

  /**
   * Extract a specific moment as a video clip
   */
  async extractClip(
    videoPath: string,
    moment: Moment,
    options: ClipExtractionOptions
  ): Promise<string> {
    const { outputPath, format = 'mp4', codec = 'libx264', audioBitrate = '128k', videoBitrate = '2000k' } = options;

    await this.runFFmpeg([
      '-i', videoPath,
      '-ss', moment.startTime.toString(),
      '-t', moment.duration.toString(),
      '-c:v', codec,
      '-b:v', videoBitrate,
      '-c:a', 'aac',
      '-b:a', audioBitrate,
      '-movflags', '+faststart', // Optimize for web playback
      '-y', // Overwrite output file
      outputPath
    ]);

    return outputPath;
  }

  /**
   * Extract multiple clips at once
   */
  async extractClips(
    videoPath: string,
    moments: Moment[],
    outputDir: string,
    options?: Partial<ClipExtractionOptions>
  ): Promise<string[]> {
    await fs.mkdir(outputDir, { recursive: true });

    const clipPaths: string[] = [];

    for (const moment of moments) {
      const outputPath = path.join(
        outputDir,
        `moment_${moment.index}_${moment.startTime.toFixed(0)}s.mp4`
      );

      await this.extractClip(videoPath, moment, {
        outputPath,
        ...options
      });

      clipPaths.push(outputPath);
    }

    return clipPaths;
  }

  // ===== UTILITY METHODS =====

  /**
   * Get video duration using FFprobe
   */
  private async getVideoDuration(videoPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1',
        videoPath
      ]);

      let output = '';
      ffprobe.stdout.on('data', (data) => {
        output += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code === 0) {
          resolve(parseFloat(output.trim()));
        } else {
          reject(new Error(`FFprobe failed with code ${code}`));
        }
      });
    });
  }

  /**
   * Run FFmpeg command
   */
  private async runFFmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', args);

      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg failed with code ${code}: ${stderr}`));
        }
      });
    });
  }

  /**
   * Parse Claude's JSON response
   */
  private parseClaudeResponse(response: string): Moment[] {
    try {
      // Try to find JSON array in the response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in Claude response');
      }

      const moments = JSON.parse(jsonMatch[0]);

      // Validate structure
      if (!Array.isArray(moments)) {
        throw new Error('Response is not an array');
      }

      return moments.map(m => ({
        index: m.index || 0,
        startTime: m.startTime || 0,
        endTime: m.endTime || 0,
        duration: m.duration || 0,
        hook: m.hook || '',
        keyMessage: m.keyMessage || '',
        viralPotential: m.viralPotential || 0,
        caption: m.caption || ''
      }));
    } catch (error) {
      console.error('Failed to parse Claude response:', error);
      console.error('Response:', response);
      throw new Error(`Failed to parse Claude response: ${error}`);
    }
  }

  /**
   * Format timestamp as MM:SS
   */
  private formatTimestamp(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Ensure temp directory exists
   */
  private async ensureTempDir(): Promise<void> {
    await fs.mkdir(this.tempDir, { recursive: true });
  }

  /**
   * Clean up temp files
   */
  private async cleanup(): Promise<void> {
    try {
      await fs.rm(this.tempDir, { recursive: true, force: true });
    } catch (error) {
      console.warn('Failed to clean up temp directory:', error);
    }
  }

  /**
   * Get moment by index
   */
  getMomentByIndex(moments: Moment[], index: number): Moment | undefined {
    return moments.find(m => m.index === index);
  }

  /**
   * Sort moments by viral potential
   */
  sortByViralPotential(moments: Moment[]): Moment[] {
    return [...moments].sort((a, b) => b.viralPotential - a.viralPotential);
  }

  /**
   * Filter moments by minimum viral score
   */
  filterByViralScore(moments: Moment[], minScore: number): Moment[] {
    return moments.filter(m => m.viralPotential >= minScore);
  }
}

export default MomentAnalyzer;
