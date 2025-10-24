/**
 * Batch Renderer Service for TikTok Multilingual Pipeline
 *
 * Orchestrates the full pipeline for rendering multiple TikTok videos
 * across different languages with voice cloning, captions, and CTAs.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { spawn } from 'child_process';
import { promisify } from 'util';
import { exec } from 'child_process';
import { GeminiTranslationService } from './translation-gemini.js';
import { ElevenLabsService } from './elevenlabs.js';
import { VerticalConverter } from './vertical-converter.js';
import { CTAOverlay } from './cta-overlay.js';
import {
  Moment,
  BatchConfig,
  TikTokVideo,
  TikTokBatch,
  BatchError,
  AudioTranscription,
  TranscriptionSegment,
  CaptionStyle,
  CTAConfig,
} from './types.js';

const execAsync = promisify(exec);

/**
 * Voice Cloning Service Interface
 * Represents the ElevenLabs API integration for voice cloning
 */
interface VoiceCloneRequest {
  text: string;
  voiceId: string;
  languageCode?: string;
  modelId?: string;
}

/**
 * Caption Generator for SRT creation and burning
 */
class CaptionGenerator {
  /**
   * Generate SRT caption file from transcription
   */
  async generateSRT(
    transcription: AudioTranscription,
    outputPath: string
  ): Promise<string> {
    let srtContent = '';

    for (let i = 0; i < transcription.segments.length; i++) {
      const segment = transcription.segments[i];
      srtContent += `${i + 1}\n`;
      srtContent += `${this.formatTimestamp(segment.start)} --> ${this.formatTimestamp(segment.end)}\n`;
      srtContent += `${segment.text}\n\n`;
    }

    await fs.writeFile(outputPath, srtContent, 'utf-8');
    return outputPath;
  }

  /**
   * Format timestamp for SRT (HH:MM:SS,mmm)
   */
  private formatTimestamp(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millis = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${millis.toString().padStart(3, '0')}`;
  }

  /**
   * Burn SRT captions into video
   */
  async burnCaptions(
    videoPath: string,
    srtPath: string,
    style: CaptionStyle = {},
    outputPath?: string
  ): Promise<string> {
    const output = outputPath || videoPath.replace('.mp4', '_captioned.mp4');

    // Build subtitles filter with styling
    const fontSize = style.fontSize || 24;
    const fontColor = style.fontColor || 'white';
    const backgroundColor = style.backgroundColor || 'black@0.5';
    const position = style.position || 'bottom';

    // Calculate margin based on position
    const marginV = position === 'top' ? 50 : position === 'bottom' ? 50 : 0;

    // Escape SRT path for FFmpeg
    const escapedSrtPath = srtPath.replace(/\\/g, '\\\\').replace(/:/g, '\\:');

    const subtitlesFilter = `subtitles=${escapedSrtPath}:force_style='FontSize=${fontSize},PrimaryColour=&H${this.colorToHex(fontColor)},OutlineColour=&H${this.colorToHex('black')},BackColour=&H${this.colorToHex(backgroundColor)},Outline=2,Shadow=1,MarginV=${marginV},Alignment=${position === 'top' ? '8' : position === 'bottom' ? '2' : '5'}'`;

    const command = `ffmpeg -i "${videoPath}" -vf "${subtitlesFilter}" -c:a copy -y "${output}"`;

    console.log('Burning captions into video...');
    await execAsync(command);

    return output;
  }

  /**
   * Convert color name to hex for FFmpeg
   */
  private colorToHex(color: string): string {
    const colorMap: { [key: string]: string } = {
      'white': 'FFFFFF',
      'black': '000000',
      'red': 'FF0000',
      'green': '00FF00',
      'blue': '0000FF',
      'yellow': 'FFFF00',
      'cyan': '00FFFF',
      'magenta': 'FF00FF',
    };

    // Handle transparency (e.g., "black@0.5")
    if (color.includes('@')) {
      const [baseColor, alpha] = color.split('@');
      const hex = colorMap[baseColor.toLowerCase()] || 'FFFFFF';
      const alphaHex = Math.floor(parseFloat(alpha) * 255).toString(16).padStart(2, '0');
      return alphaHex + hex; // FFmpeg uses AABBGGRR format
    }

    return colorMap[color.toLowerCase()] || 'FFFFFF';
  }
}

/**
 * Moment Analyzer Service (stub - would be implemented by another agent)
 */
class MomentAnalyzer {
  /**
   * Extract video clip for a specific moment
   */
  async extractClip(
    videoPath: string,
    moment: Moment,
    outputPath: string
  ): Promise<string> {
    const command = `ffmpeg -i "${videoPath}" -ss ${moment.startTime} -t ${moment.duration} -c copy -y "${outputPath}"`;

    console.log(`Extracting clip: ${moment.startTime}s - ${moment.endTime}s`);
    await execAsync(command);

    return outputPath;
  }
}

/**
 * Batch Renderer - Main orchestration service
 *
 * Now uses:
 * - GeminiTranslationService for AI-powered translation
 * - ElevenLabsService for multilingual voice generation
 */
export class BatchRenderer {
  private translationService: GeminiTranslationService;
  private elevenLabs: ElevenLabsService;
  private verticalConverter: VerticalConverter;
  private ctaOverlay: CTAOverlay;
  private captionGenerator: CaptionGenerator;
  private momentAnalyzer: MomentAnalyzer;
  private tempFiles: string[] = [];

  constructor(
    geminiApiKey?: string,
    elevenLabsApiKey?: string
  ) {
    this.translationService = new GeminiTranslationService(geminiApiKey);
    this.elevenLabs = new ElevenLabsService(elevenLabsApiKey);
    this.verticalConverter = new VerticalConverter();
    this.ctaOverlay = new CTAOverlay();
    this.captionGenerator = new CaptionGenerator();
    this.momentAnalyzer = new MomentAnalyzer();
  }

  /**
   * Main orchestration method - renders all moment � language combinations
   */
  async renderMultilingual(config: BatchConfig): Promise<TikTokBatch> {
    const startTime = Date.now();
    const videos: TikTokVideo[] = [];
    const errors: BatchError[] = [];
    let totalCost = 0;

    const outputDir = config.outputDir || path.join(process.cwd(), 'output', 'tiktok');
    await fs.mkdir(outputDir, { recursive: true });

    const totalOperations = config.moments.length * config.languages.length;
    let completed = 0;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`<� Starting TikTok Multilingual Batch Render`);
    console.log(`${'='.repeat(60)}`);
    console.log(`=� Video: ${path.basename(config.videoPath)}`);
    console.log(`<� Moments: ${config.moments.length}`);
    console.log(`< Languages: ${config.languages.join(', ')}`);
    console.log(`=� Total videos to render: ${totalOperations}`);
    console.log(`${'='.repeat(60)}\n`);

    // Process each moment
    for (let momentIndex = 0; momentIndex < config.moments.length; momentIndex++) {
      const moment = config.moments[momentIndex];

      // Process each language for this moment
      for (const language of config.languages) {
        completed++;
        const progress = ((completed / totalOperations) * 100).toFixed(1);

        console.log(`\n=� Progress: ${completed}/${totalOperations} (${progress}%)`);
        console.log(`<� Rendering: Moment ${moment.index}/${config.moments.length}, Language: ${language} (${completed}/${totalOperations})`);

        try {
          const video = await this.renderSingle(
            config.videoPath,
            moment,
            language,
            config.voiceId,
            outputDir,
            config.captionStyle,
            config.ctaConfig
          );

          videos.push(video);
          totalCost += this.elevenLabs.estimateCost([moment.caption]).estimatedCost;

          console.log(` Success: moment_${moment.index}_${language}.mp4`);
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`L Failed: Moment ${moment.index}, Language ${language}: ${errorMsg}`);

          errors.push({
            momentIndex: moment.index,
            language,
            error: errorMsg,
            timestamp: new Date(),
          });
        }
      }
    }

    // Cleanup temp files
    await this.cleanupTempFiles(this.tempFiles);

    const processingTime = (Date.now() - startTime) / 1000;
    const costPerVideo = videos.length > 0 ? totalCost / videos.length : 0;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`( Batch Render Complete!`);
    console.log(`${'='.repeat(60)}`);
    console.log(` Successful: ${videos.length}/${totalOperations}`);
    console.log(`L Failed: ${errors.length}`);
    console.log(`=� Total cost: $${totalCost.toFixed(4)}`);
    console.log(`=� Cost per video: $${costPerVideo.toFixed(4)}`);
    console.log(`�  Processing time: ${processingTime.toFixed(1)}s`);
    console.log(`${'='.repeat(60)}\n`);

    return {
      videos,
      totalCount: videos.length,
      totalCost,
      costPerVideo,
      processingTime,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Render a single moment � language variation
   */
  async renderSingle(
    videoPath: string,
    moment: Moment,
    language: string,
    voiceId: string,
    outputDir: string,
    captionStyle?: CaptionStyle,
    ctaConfig?: CTAConfig
  ): Promise<TikTokVideo> {
    console.log(`  =9 Step 1/9: Extracting clip...`);
    // 1. Extract clip from original video
    const clipPath = path.join(outputDir, `temp_clip_${moment.index}_${Date.now()}.mp4`);
    this.tempFiles.push(clipPath);
    await this.momentAnalyzer.extractClip(videoPath, moment, clipPath);

    console.log(`  =9 Step 2/9: Converting to vertical 9:16...`);
    // 2. Convert to 9:16 vertical
    const verticalPath = await this.verticalConverter.convertToVertical(clipPath, {
      style: 'blur-background',
    });
    this.tempFiles.push(verticalPath);

    console.log(`  =9 Step 3/9: Translating caption to ${language}...`);
    // 3. Translate caption to target language
    const translatedCaption = language === 'en'
      ? moment.caption
      : (await this.translationService.translateText(moment.caption, language)).translated;

    console.log(`  =9 Step 4/9: Generating voiceover in ${language}...`);
    // 4. Generate voiceover in user's cloned voice with ElevenLabs
    // The multilingual model auto-detects language from the translated text
    const audioResult = await this.elevenLabs.generateSpeech(
      translatedCaption,
      voiceId,
      {
        ...ElevenLabsService.getRecommendedSettings('narration')
      }
    );
    const audioBuffer = audioResult.audioBuffer;

    console.log(`  =9 Step 5/9: Saving audio file...`);
    // 5. Save audio to temp file
    const audioPath = await this.saveAudio(audioBuffer, outputDir, moment.index, language);
    this.tempFiles.push(audioPath);

    console.log(`  =9 Step 6/9: Transcribing voiceover for caption timing...`);
    // 6. Transcribe voiceover for caption timing
    const transcription = await this.transcribeAudio(audioPath, language);

    console.log(`  =9 Step 7/9: Generating SRT captions...`);
    // 7. Generate SRT captions
    const srtPath = path.join(outputDir, `temp_captions_${moment.index}_${language}.srt`);
    this.tempFiles.push(srtPath);
    await this.captionGenerator.generateSRT(transcription, srtPath);

    console.log(`  =9 Step 8/9: Burning captions into video...`);
    // 8. Replace audio and burn captions
    const videoWithCaptions = await this.replaceAudioAndBurnCaptions(
      verticalPath,
      audioPath,
      srtPath,
      captionStyle,
      outputDir,
      moment.index,
      language
    );
    this.tempFiles.push(videoWithCaptions);

    console.log(`  =9 Step 9/9: Adding CTA overlay...`);
    // 9. Add CTA overlay
    const finalPath = path.join(outputDir, `moment_${moment.index}_${language}.mp4`);
    let finalVideo: string;

    if (ctaConfig) {
      finalVideo = await this.ctaOverlay.addCTA(videoWithCaptions, ctaConfig, finalPath);
    } else {
      // Use default CTA
      finalVideo = await this.ctaOverlay.addDefaultCTA(videoWithCaptions, finalPath);
    }

    // Get file size
    const stats = await fs.stat(finalVideo);

    return {
      momentIndex: moment.index,
      language,
      path: finalVideo,
      caption: translatedCaption,
      duration: moment.duration,
      size: stats.size,
    };
  }

  /**
   * Save audio buffer to temp file
   */
  async saveAudio(
    buffer: Buffer,
    outputDir: string,
    momentIndex: number,
    language: string
  ): Promise<string> {
    const audioPath = path.join(outputDir, `temp_audio_${momentIndex}_${language}_${Date.now()}.mp3`);
    await fs.writeFile(audioPath, buffer);
    return audioPath;
  }

  /**
   * Transcribe audio using OpenAI Whisper API
   */
  async transcribeAudio(
    audioPath: string,
    language: string
  ): Promise<AudioTranscription> {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OpenAI API key required for transcription. Set OPENAI_API_KEY environment variable.');
    }

    // Read audio file
    const audioData = await fs.readFile(audioPath);

    // Create form data
    const formData = new FormData();
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    formData.append('file', audioBlob, path.basename(audioPath));
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'verbose_json');
    formData.append('timestamp_granularities[]', 'segment');

    // Call Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Whisper API error: ${error}`);
    }

    const result = await response.json() as any;

    // Convert to our format
    const segments: TranscriptionSegment[] = (result.segments || []).map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    }));

    return {
      segments,
      duration: result.duration || 0,
      language,
    };
  }

  /**
   * Replace video audio with voiceover and burn captions
   */
  async replaceAudioAndBurnCaptions(
    videoPath: string,
    audioPath: string,
    srtPath: string,
    captionStyle: CaptionStyle | undefined,
    outputDir: string,
    momentIndex: number,
    language: string
  ): Promise<string> {
    // First, replace audio
    const audioReplacedPath = path.join(
      outputDir,
      `temp_audio_replaced_${momentIndex}_${language}_${Date.now()}.mp4`
    );

    const replaceAudioCmd = `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -map 0:v:0 -map 1:a:0 -shortest -y "${audioReplacedPath}"`;

    await execAsync(replaceAudioCmd);

    // Then burn captions
    const captionedPath = await this.captionGenerator.burnCaptions(
      audioReplacedPath,
      srtPath,
      captionStyle
    );

    return captionedPath;
  }

  /**
   * Clean up temporary files
   */
  async cleanupTempFiles(files: string[]): Promise<void> {
    console.log(`\n>� Cleaning up ${files.length} temporary files...`);

    let cleaned = 0;
    for (const file of files) {
      try {
        await fs.unlink(file);
        cleaned++;
      } catch (error) {
        // Ignore cleanup errors
        console.warn(`�  Could not delete temp file: ${file}`);
      }
    }

    console.log(` Cleaned up ${cleaned}/${files.length} temp files`);
    this.tempFiles = [];
  }

  /**
   * Estimate total cost for batch
   */
  estimateBatchCost(config: BatchConfig): {
    totalCost: number;
    costPerVideo: number;
    breakdown: { moment: number; language: string; cost: number }[];
  } {
    const breakdown: { moment: number; language: string; cost: number }[] = [];
    let totalCost = 0;

    for (const moment of config.moments) {
      for (const language of config.languages) {
        const cost = this.elevenLabs.estimateCost([moment.caption]).estimatedCost;
        breakdown.push({
          moment: moment.index,
          language,
          cost,
        });
        totalCost += cost;
      }
    }

    const totalVideos = config.moments.length * config.languages.length;
    const costPerVideo = totalVideos > 0 ? totalCost / totalVideos : 0;

    return {
      totalCost,
      costPerVideo,
      breakdown,
    };
  }

  /**
   * Get progress callback function
   */
  onProgress(callback: (completed: number, total: number, momentIndex: number, language: string) => void): void {
    // This could be implemented using EventEmitter for real-time progress updates
    // For now, progress is logged to console in renderMultilingual
  }
}

// Export singleton factory
let batchRendererInstance: BatchRenderer | null = null;

/**
 * Get or create singleton batch renderer instance
 */
export function getBatchRenderer(
  googleApiKey?: string,
  elevenLabsApiKey?: string
): BatchRenderer {
  if (!batchRendererInstance) {
    batchRendererInstance = new BatchRenderer(googleApiKey, elevenLabsApiKey);
  }
  return batchRendererInstance;
}

/**
 * Reset batch renderer instance (useful for testing)
 */
export function resetBatchRenderer(): void {
  batchRendererInstance = null;
}

export default BatchRenderer;
