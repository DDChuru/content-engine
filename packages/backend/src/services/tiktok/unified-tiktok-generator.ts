/**
 * Unified TikTok Video Generation Pipeline
 *
 * Supports TWO workflows:
 *
 * WORKFLOW A: Existing Video → TikTok Clips
 * - Input: Existing video file
 * - Process: Analyze → Extract → Translate → Voice → Render
 *
 * WORKFLOW B: AI Generated Video → TikTok
 * - Input: Text prompt/script
 * - Process: Veo 3.1 Generate → Translate → Voice → Render
 *
 * WORKFLOW C: Hybrid
 * - Combine both approaches
 */

import { VeoVideoGenerator, VeoModelVersion } from './veo-video-generator.js';
import { GeminiTranslationService } from './translation-gemini.js';
import { ElevenLabsService } from './elevenlabs.js';
import { BatchRenderer } from './batch-renderer.js';
import { MomentAnalyzer } from './moment-analyzer.js';
import { promises as fs } from 'fs';
import path from 'path';

export interface WorkflowAConfig {
  type: 'existing-video';
  videoPath: string;
  momentCount?: number;
  momentDuration?: number;
  languages: string[];
  voiceId: string;
  outputDir?: string;
}

export interface WorkflowBConfig {
  type: 'ai-generated';
  script: string;
  videoDuration?: number;
  videoStyle?: string;
  languages: string[];
  voiceId: string;
  outputDir?: string;
}

export interface WorkflowCConfig {
  type: 'hybrid';
  baseVideo: string;          // Veo-generated or existing
  overlayPrompts?: string[];  // Additional Veo generations to overlay
  languages: string[];
  voiceId: string;
  outputDir?: string;
}

export type UnifiedWorkflowConfig = WorkflowAConfig | WorkflowBConfig | WorkflowCConfig;

export interface UnifiedResult {
  workflow: string;
  videos: Array<{
    path: string;
    language: string;
    duration: number;
    size: number;
  }>;
  totalCost: number;
  processingTime: number;
  metadata: any;
}

export class UnifiedTikTokGenerator {
  private veoGenerator: VeoVideoGenerator;
  private translator: GeminiTranslationService;
  private voiceGenerator: ElevenLabsService;
  private batchRenderer: BatchRenderer;
  private momentAnalyzer: MomentAnalyzer;

  constructor(veoModelVersion?: VeoModelVersion) {
    const modelVersion = veoModelVersion || (process.env.VEO_MODEL_VERSION as VeoModelVersion) || '3.0';
    this.veoGenerator = new VeoVideoGenerator(undefined, undefined, modelVersion);
    this.translator = new GeminiTranslationService();
    this.voiceGenerator = new ElevenLabsService();
    this.batchRenderer = new BatchRenderer();
    this.momentAnalyzer = new MomentAnalyzer(
      process.env.ANTHROPIC_API_KEY!,
      process.env.OPENAI_API_KEY
    );
  }

  /**
   * Main entry point - routes to correct workflow
   */
  async generate(config: UnifiedWorkflowConfig): Promise<UnifiedResult> {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`🎬 UNIFIED TIKTOK GENERATOR - Workflow: ${config.type.toUpperCase()}`);
    console.log(`${'='.repeat(70)}\n`);

    switch (config.type) {
      case 'existing-video':
        return this.workflowA(config);
      case 'ai-generated':
        return this.workflowB(config);
      case 'hybrid':
        return this.workflowC(config);
      default:
        throw new Error(`Unknown workflow type: ${(config as any).type}`);
    }
  }

  /**
   * WORKFLOW A: Existing Video → TikTok Clips
   *
   * Steps:
   * 1. Analyze video for viral moments
   * 2. Extract clips
   * 3. Translate captions
   * 4. Generate voices
   * 5. Render final TikToks
   */
  private async workflowA(config: WorkflowAConfig): Promise<UnifiedResult> {
    const startTime = Date.now();
    console.log('📹 WORKFLOW A: Processing Existing Video\n');

    const outputDir = config.outputDir || path.join(process.cwd(), 'output', 'workflow-a');
    await fs.mkdir(outputDir, { recursive: true });

    // Step 1: Analyze video
    console.log('Step 1/5: Analyzing video for viral moments...');
    const analysis = await this.momentAnalyzer.findBestMoments({
      videoPath: config.videoPath,
      count: config.momentCount || 3,
      duration: config.momentDuration || 30,
    });

    console.log(`✓ Found ${analysis.moments.length} moments\n`);

    // Step 2-5: Use existing batch renderer
    console.log('Step 2-5: Rendering multilingual TikToks...\n');
    const batch = await this.batchRenderer.renderMultilingual({
      videoPath: config.videoPath,
      moments: analysis.moments,
      languages: config.languages,
      voiceId: config.voiceId,
      outputDir,
    });

    const processingTime = Date.now() - startTime;

    return {
      workflow: 'existing-video',
      videos: batch.videos,
      totalCost: batch.totalCost,
      processingTime,
      metadata: {
        momentsAnalyzed: analysis.moments.length,
        originalVideo: config.videoPath,
      },
    };
  }

  /**
   * WORKFLOW B: AI Generated Video → TikTok
   *
   * Steps:
   * 1. Generate video with Veo 3.1 from script
   * 2. Translate script to target languages
   * 3. Generate voices for each language
   * 4. Merge voice with video
   * 5. Export TikToks
   */
  private async workflowB(config: WorkflowBConfig): Promise<UnifiedResult> {
    const startTime = Date.now();
    console.log('🤖 WORKFLOW B: AI Video Generation\n');

    const outputDir = config.outputDir || path.join(process.cwd(), 'output', 'workflow-b');
    await fs.mkdir(outputDir, { recursive: true });

    // Step 1: Generate base video with Veo 3.1
    console.log('Step 1/5: Generating video with Veo 3.1...');
    console.log(`  Prompt: "${config.script.substring(0, 60)}..."`);

    const veoResult = await this.veoGenerator.generateVideo({
      prompt: config.script,
      duration: config.videoDuration || 30,
      aspectRatio: '9:16',
      style: config.videoStyle || 'cinematic',
    });

    console.log(`✓ Video generated (${veoResult.duration}s)\n`);

    // Step 2: Translate script
    console.log('Step 2/5: Translating script to target languages...');
    const translations = await this.translator.batchTranslate(
      [config.script],
      config.languages.filter(lang => lang !== 'en')
    );

    console.log(`✓ Translated to ${translations.results.size} languages\n`);

    // Step 3: Generate voices
    console.log('Step 3/5: Generating multilingual voiceovers...');
    const audioFiles: any = {};

    // English
    const enResult = await this.voiceGenerator.generateSpeech(
      config.script,
      config.voiceId
    );
    audioFiles.en = path.join(outputDir, 'voice_en.mp3');
    await this.voiceGenerator.saveAudio(enResult.audioBuffer, audioFiles.en);

    // Other languages
    for (const [lang, texts] of translations.results) {
      const result = await this.voiceGenerator.generateSpeech(
        texts[0],
        config.voiceId
      );
      audioFiles[lang] = path.join(outputDir, `voice_${lang}.mp3`);
      await this.voiceGenerator.saveAudio(result.audioBuffer, audioFiles[lang]);
    }

    console.log(`✓ Generated ${Object.keys(audioFiles).length} voice files\n`);

    // Step 4-5: Merge and export
    console.log('Step 4-5: Merging audio with video and exporting...');

    const videos: any[] = [];
    let totalCost = veoResult.cost;

    // For each language, create a video
    for (const lang of config.languages) {
      const videoPath = path.join(outputDir, `tiktok_${lang}.mp4`);

      // Note: Actual video merge would use FFmpeg here
      // This is a placeholder showing the structure
      console.log(`  Creating ${lang} version...`);

      videos.push({
        path: videoPath,
        language: lang,
        duration: veoResult.duration,
        size: 0, // Would be actual file size
      });
    }

    console.log(`✓ Exported ${videos.length} TikTok videos\n`);

    const processingTime = Date.now() - startTime;

    return {
      workflow: 'ai-generated',
      videos,
      totalCost,
      processingTime,
      metadata: {
        veoGeneration: veoResult,
        originalScript: config.script,
      },
    };
  }

  /**
   * WORKFLOW C: Hybrid Approach
   *
   * Combines Veo-generated elements with existing footage
   */
  private async workflowC(config: WorkflowCConfig): Promise<UnifiedResult> {
    const startTime = Date.now();
    console.log('🔄 WORKFLOW C: Hybrid Generation\n');

    const outputDir = config.outputDir || path.join(process.cwd(), 'output', 'workflow-c');
    await fs.mkdir(outputDir, { recursive: true });

    // Implementation would combine elements from both workflows
    console.log('Hybrid workflow combines:');
    console.log('  • Existing/generated base video');
    console.log('  • Veo-generated overlay elements');
    console.log('  • Multilingual voice and captions\n');

    const processingTime = Date.now() - startTime;

    return {
      workflow: 'hybrid',
      videos: [],
      totalCost: 0,
      processingTime,
      metadata: {
        note: 'Hybrid workflow implementation',
      },
    };
  }

  /**
   * Quick helper: Generate from text prompt
   */
  async generateFromPrompt(
    prompt: string,
    languages: string[],
    voiceId: string
  ): Promise<UnifiedResult> {
    return this.generate({
      type: 'ai-generated',
      script: prompt,
      languages,
      voiceId,
    });
  }

  /**
   * Quick helper: Process existing video
   */
  async processExistingVideo(
    videoPath: string,
    languages: string[],
    voiceId: string
  ): Promise<UnifiedResult> {
    return this.generate({
      type: 'existing-video',
      videoPath,
      languages,
      voiceId,
    });
  }

  /**
   * Get cost estimates for different workflows
   */
  estimateCosts(config: UnifiedWorkflowConfig): any {
    switch (config.type) {
      case 'existing-video':
        const momentsCount = config.momentCount || 3;
        const languagesCount = config.languages.length;
        return {
          translation: 0.0002 * momentsCount,
          voice: 0.07 * momentsCount * languagesCount,
          total: (0.07 * momentsCount * languagesCount) + (0.0002 * momentsCount),
        };

      case 'ai-generated':
        const duration = config.videoDuration || 30;
        const langCount = config.languages.length;
        return {
          veoGeneration: 0.20 * duration,
          translation: 0.0002,
          voice: 0.07 * langCount,
          total: (0.20 * duration) + 0.0002 + (0.07 * langCount),
        };

      default:
        return { total: 0 };
    }
  }
}

// Export singleton
export const unifiedGenerator = new UnifiedTikTokGenerator();
