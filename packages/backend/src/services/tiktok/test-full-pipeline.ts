/**
 * Complete TikTok Multilingual Pipeline Test
 *
 * End-to-end test of the full video generation workflow:
 * 1. Analyze video for viral moments
 * 2. Translate content to EN + SN
 * 3. Generate voice with ElevenLabs
 * 4. Render final videos
 *
 * Usage:
 *   npx tsx src/services/tiktok/test-full-pipeline.ts [video-path] [voice-id]
 *
 * Example:
 *   npx tsx src/services/tiktok/test-full-pipeline.ts ./sample.mp4 voice_abc123
 *
 * Prerequisites:
 *   - Video file (MP4 format recommended)
 *   - ElevenLabs voice ID (get from https://elevenlabs.io/voices)
 *   - API keys in .env file
 */

import 'dotenv/config';
import { MomentAnalyzer } from './moment-analyzer.js';
import { GeminiTranslationService } from './translation-gemini.js';
import { ElevenLabsService } from './elevenlabs.js';
import { SUPPORTED_LANGUAGES } from './types.js';
import { promises as fs } from 'fs';
import path from 'path';

// Configuration
const TARGET_LANGUAGES = ['en', 'sn'];
const OUTPUT_DIR = path.join(process.cwd(), 'output', 'tiktok-test');
const NUM_MOMENTS = 3;
const MOMENT_DURATION = 60; // seconds

interface PipelineConfig {
  videoPath: string;
  voiceId: string;
  languages: string[];
  outputDir: string;
}

/**
 * Main pipeline execution
 */
async function runPipeline(config: PipelineConfig) {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║   🎬 TikTok Multilingual Video Generation Pipeline           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  printConfig(config);

  // Ensure output directory exists
  await fs.mkdir(config.outputDir, { recursive: true });

  try {
    // Step 1: Analyze video
    const moments = await analyzeVideo(config.videoPath);

    // Step 2: Translate captions
    const translations = await translateCaptions(moments);

    // Step 3: Generate voice audio
    const audioFiles = await generateVoiceAudio(translations, config.voiceId);

    // Step 4: Save results
    await saveResults(moments, translations, audioFiles, config.outputDir);

    // Step 5: Print summary
    printSuccess(moments, translations, audioFiles);

  } catch (error: any) {
    console.error('\n❌ Pipeline failed:', error.message);
    console.error('   Stack trace:', error.stack);
    process.exit(1);
  }
}

/**
 * Print pipeline configuration
 */
function printConfig(config: PipelineConfig) {
  console.log('📋 Configuration:');
  console.log(`   Video: ${config.videoPath}`);
  console.log(`   Voice ID: ${config.voiceId}`);
  console.log(`   Languages: ${config.languages.join(', ')}`);
  console.log(`   Output: ${config.outputDir}`);
  console.log(`   Moments: ${NUM_MOMENTS}`);
  console.log(`   Duration: ${MOMENT_DURATION}s\n`);
}

/**
 * Step 1: Analyze video for viral moments
 */
async function analyzeVideo(videoPath: string) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 1: Analyze Video for Viral Moments');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if video exists
  try {
    await fs.access(videoPath);
    console.log(`✓ Video file found: ${videoPath}\n`);
  } catch (error) {
    throw new Error(`Video file not found: ${videoPath}`);
  }

  const analyzer = new MomentAnalyzer(
    process.env.ANTHROPIC_API_KEY!,
    process.env.OPENAI_API_KEY
  );

  console.log(`🔍 Analyzing video (looking for ${NUM_MOMENTS} moments of ${MOMENT_DURATION}s)...`);
  console.log('   This may take a few minutes...\n');

  const result = await analyzer.findBestMoments({
    videoPath,
    count: NUM_MOMENTS,
    duration: MOMENT_DURATION,
    frameInterval: 2,
  });

  console.log(`✅ Found ${result.moments.length} viral moments!\n`);

  // Print moments
  result.moments.forEach((moment, index) => {
    console.log(`Moment ${index + 1}:`);
    console.log(`   Time: ${formatTime(moment.startTime)} - ${formatTime(moment.endTime)}`);
    console.log(`   Hook: ${moment.hook}`);
    console.log(`   Message: ${moment.keyMessage}`);
    console.log(`   Viral Score: ${moment.viralPotential}/10`);
    console.log(`   Caption: ${moment.caption.substring(0, 60)}...`);
    console.log();
  });

  console.log(`📊 Analysis Stats:`);
  console.log(`   Frames analyzed: ${result.framesAnalyzed}`);
  console.log(`   Processing time: ${(result.processingTime / 1000).toFixed(1)}s\n`);

  return result.moments;
}

/**
 * Step 2: Translate captions to target languages
 */
async function translateCaptions(moments: any[]) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 2: Translate Captions (EN → SN)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const translationService = new GeminiTranslationService();

  // Extract captions
  const captions = moments.map(m => m.caption);

  console.log(`📝 Translating ${captions.length} captions to Shona...\n`);

  const result = await translationService.batchTranslateWithProgress(
    captions,
    ['sn'],
    (progress, language) => {
      console.log(`   [${progress}%] Processing ${language}...`);
    }
  );

  console.log('\n✅ Translation complete!\n');

  const shonaTranslations = result.results.get('sn') || [];

  // Print translations
  console.log('📋 Translation Results:\n');
  for (let i = 0; i < captions.length; i++) {
    console.log(`Caption ${i + 1}:`);
    console.log(`   EN: ${captions[i]}`);
    console.log(`   SN: ${shonaTranslations[i]}`);
    console.log();
  }

  return {
    en: captions,
    sn: shonaTranslations,
  };
}

/**
 * Step 3: Generate voice audio for all languages
 */
async function generateVoiceAudio(translations: any, voiceId: string) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 3: Generate Voice Audio (ElevenLabs)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const elevenLabs = new ElevenLabsService();

  const audioFiles: any = {
    en: [],
    sn: [],
  };

  // Get voice locales from language config
  const enConfig = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
  const snConfig = SUPPORTED_LANGUAGES.find(l => l.code === 'sn');

  // Generate English audio
  console.log('🎙️  Generating English audio...\n');
  for (let i = 0; i < translations.en.length; i++) {
    console.log(`   [${i + 1}/${translations.en.length}] "${translations.en[i].substring(0, 40)}..."`);

    const result = await elevenLabs.generateSpeech(
      translations.en[i],
      voiceId,
      {
        language_code: enConfig?.voice as any,
        ...ElevenLabsService.getRecommendedSettings('narration'),
      }
    );

    const filename = `moment_${i + 1}_en.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);
    await elevenLabs.saveAudio(result.audioBuffer, filepath);

    audioFiles.en.push({
      index: i + 1,
      language: 'en',
      path: filepath,
      filename,
      size: result.audioBuffer.length,
      characterCount: result.characterCount,
    });
  }

  console.log('\n✅ English audio generated!\n');

  // Generate Shona audio
  console.log('🎙️  Generating Shona audio...\n');
  for (let i = 0; i < translations.sn.length; i++) {
    console.log(`   [${i + 1}/${translations.sn.length}] "${translations.sn[i].substring(0, 40)}..."`);

    const result = await elevenLabs.generateSpeech(
      translations.sn[i],
      voiceId,
      {
        language_code: snConfig?.voice as any,
        ...ElevenLabsService.getRecommendedSettings('narration'),
      }
    );

    const filename = `moment_${i + 1}_sn.mp3`;
    const filepath = path.join(OUTPUT_DIR, filename);
    await elevenLabs.saveAudio(result.audioBuffer, filepath);

    audioFiles.sn.push({
      index: i + 1,
      language: 'sn',
      path: filepath,
      filename,
      size: result.audioBuffer.length,
      characterCount: result.characterCount,
    });
  }

  console.log('\n✅ Shona audio generated!\n');

  return audioFiles;
}

/**
 * Step 4: Save results to JSON
 */
async function saveResults(
  moments: any[],
  translations: any,
  audioFiles: any,
  outputDir: string
) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('STEP 4: Save Results');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const results = {
    metadata: {
      timestamp: new Date().toISOString(),
      languages: TARGET_LANGUAGES,
      moments: moments.length,
    },
    moments: moments.map(m => ({
      index: m.index,
      startTime: m.startTime,
      endTime: m.endTime,
      duration: m.duration,
      viralPotential: m.viralPotential,
    })),
    translations,
    audioFiles,
  };

  const resultsPath = path.join(outputDir, 'pipeline-results.json');
  await fs.writeFile(resultsPath, JSON.stringify(results, null, 2));

  console.log(`✅ Results saved to: ${resultsPath}\n`);
}

/**
 * Print success summary
 */
function printSuccess(moments: any[], translations: any, audioFiles: any) {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║              ✅ PIPELINE COMPLETED SUCCESSFULLY!              ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  console.log('📊 Summary:\n');
  console.log(`   Viral Moments Found: ${moments.length}`);
  console.log(`   Languages: ${TARGET_LANGUAGES.join(', ')}`);
  console.log(`   Audio Files Generated: ${audioFiles.en.length + audioFiles.sn.length}`);
  console.log(`   Output Directory: ${OUTPUT_DIR}\n`);

  console.log('📁 Generated Files:\n');
  console.log('   English Audio:');
  audioFiles.en.forEach((file: any) => {
    console.log(`      ${file.filename} (${formatBytes(file.size)})`);
  });
  console.log();
  console.log('   Shona Audio:');
  audioFiles.sn.forEach((file: any) => {
    console.log(`      ${file.filename} (${formatBytes(file.size)})`);
  });
  console.log();

  console.log('🎯 Next Steps:\n');
  console.log('   1. Review the audio files in the output directory');
  console.log('   2. Use these audio files with video rendering');
  console.log('   3. Add captions and CTA overlays');
  console.log('   4. Export final TikTok videos\n');

  console.log('💡 Tips:\n');
  console.log('   - Test different voice IDs for better quality');
  console.log('   - Adjust voice settings (stability, similarity)');
  console.log('   - Experiment with different moment durations\n');
}

/**
 * Helper: Format time in MM:SS
 */
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Helper: Format bytes
 */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Parse command line arguments
const args = process.argv.slice(2);

let videoPath: string;
let voiceId: string;

if (args.length < 1) {
  console.error('Usage: npx tsx test-full-pipeline.ts <video-path> [voice-id]');
  console.error('Example: npx tsx test-full-pipeline.ts ./sample.mp4 voice_abc123');
  console.error('\nVoice ID can be:');
  console.error('  1. Passed as second argument');
  console.error('  2. Set in .env as ELEVENLABS_DEFAULT_VOICE_ID');
  console.error('\nGet a voice ID from: https://elevenlabs.io/voices');
  process.exit(1);
}

videoPath = args[0];

// Use command line arg if provided, otherwise use env variable
if (args.length >= 2) {
  voiceId = args[1];
} else if (process.env.ELEVENLABS_DEFAULT_VOICE_ID) {
  voiceId = process.env.ELEVENLABS_DEFAULT_VOICE_ID;
  console.log(`ℹ️  Using default voice ID from .env: ${voiceId.substring(0, 10)}...\n`);
} else {
  console.error('❌ Error: No voice ID provided!');
  console.error('\nEither:');
  console.error('  1. Pass voice ID as second argument:');
  console.error('     npx tsx test-full-pipeline.ts VIDEO_PATH VOICE_ID');
  console.error('  2. Add to .env file:');
  console.error('     ELEVENLABS_DEFAULT_VOICE_ID=your_voice_id_here');
  console.error('\nGet a voice ID from: https://elevenlabs.io/voices');
  process.exit(1);
}

const config: PipelineConfig = {
  videoPath,
  voiceId,
  languages: TARGET_LANGUAGES,
  outputDir: OUTPUT_DIR,
};

// Run pipeline
runPipeline(config).catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
