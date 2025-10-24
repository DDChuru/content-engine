#!/usr/bin/env node

/**
 * Simple TikTok Pipeline Test
 *
 * This script tests the basic TikTok multilingual pipeline with a sample video.
 *
 * Prerequisites:
 * 1. Environment variables set (see .env.example)
 * 2. Sample video file
 * 3. FFmpeg installed
 *
 * Usage:
 *   node test-tiktok-simple.js /path/to/video.mp4
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'bright');
  console.log('='.repeat(60) + '\n');
}

async function checkEnvironment() {
  header('Step 1: Environment Check');

  const required = [
    'OPENAI_API_KEY',
    'GOOGLE_CLOUD_API_KEY',
    'ELEVENLABS_API_KEY',
    'ANTHROPIC_API_KEY'
  ];

  const missing = [];

  for (const key of required) {
    if (process.env[key]) {
      log(`✓ ${key} is set`, 'green');
    } else {
      log(`✗ ${key} is MISSING`, 'red');
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    log('\n⚠️  Missing environment variables!', 'yellow');
    log('Please set these in your .env file:', 'yellow');
    missing.forEach(key => log(`   ${key}=your_key_here`, 'cyan'));
    return false;
  }

  log('\n✓ All environment variables set!', 'green');
  return true;
}

async function checkFFmpeg() {
  header('Step 2: FFmpeg Check');

  try {
    const { execSync } = await import('child_process');
    const ffmpegVersion = execSync('ffmpeg -version', { encoding: 'utf8' });
    const firstLine = ffmpegVersion.split('\n')[0];
    log(`✓ FFmpeg installed: ${firstLine}`, 'green');
    return true;
  } catch (error) {
    log('✗ FFmpeg not found!', 'red');
    log('Please install FFmpeg:', 'yellow');
    log('  Ubuntu/Debian: sudo apt-get install ffmpeg', 'cyan');
    log('  macOS: brew install ffmpeg', 'cyan');
    log('  Windows: Download from ffmpeg.org', 'cyan');
    return false;
  }
}

async function checkVideoFile(videoPath) {
  header('Step 3: Video File Check');

  if (!videoPath) {
    log('✗ No video path provided!', 'red');
    log('Usage: node test-tiktok-simple.js /path/to/video.mp4', 'yellow');
    return false;
  }

  if (!fs.existsSync(videoPath)) {
    log(`✗ Video file not found: ${videoPath}`, 'red');
    return false;
  }

  const stats = fs.statSync(videoPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);

  log(`✓ Video file found: ${videoPath}`, 'green');
  log(`  Size: ${sizeMB} MB`, 'cyan');

  return true;
}

async function testMomentAnalyzer(videoPath) {
  header('Step 4: Testing Moment Analyzer');

  try {
    log('Importing MomentAnalyzer...', 'cyan');
    const { MomentAnalyzer } = await import('./packages/backend/src/services/tiktok/moment-analyzer.js');

    log('Creating analyzer instance...', 'cyan');
    const analyzer = new MomentAnalyzer();

    log('Analyzing video for best moments (this may take 2-3 minutes)...', 'cyan');
    log('This will:', 'yellow');
    log('  1. Extract key frames from video', 'yellow');
    log('  2. Transcribe audio with Whisper', 'yellow');
    log('  3. Analyze with Claude for viral moments', 'yellow');

    const startTime = Date.now();

    const moments = await analyzer.findBestMoments({
      videoPath,
      count: 3,
      duration: 60
    });

    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);

    log(`\n✓ Analysis complete in ${elapsedTime} seconds!`, 'green');
    log(`\nFound ${moments.length} viral moments:`, 'bright');

    moments.forEach((moment, index) => {
      console.log(`\n  Moment ${index + 1}:`);
      log(`    Time: ${moment.startTime}s - ${moment.endTime}s`, 'cyan');
      log(`    Viral Score: ${moment.viralPotential}/10`, 'cyan');
      log(`    Hook: ${moment.hook}`, 'yellow');
      log(`    Caption: ${moment.caption}`, 'yellow');
    });

    return moments;

  } catch (error) {
    log(`✗ Error testing Moment Analyzer: ${error.message}`, 'red');
    console.error(error);
    return null;
  }
}

async function testVerticalConverter(videoPath) {
  header('Step 5: Testing Vertical Converter');

  try {
    log('Importing VerticalConverter...', 'cyan');
    const { verticalConverter } = await import('./packages/backend/src/services/tiktok/vertical-converter.js');

    log('Converting to 9:16 vertical format...', 'cyan');
    const outputPath = await verticalConverter.convertToVertical(videoPath, {
      style: 'blur-background'
    });

    log(`✓ Conversion complete!`, 'green');
    log(`  Output: ${outputPath}`, 'cyan');

    return outputPath;

  } catch (error) {
    log(`✗ Error testing Vertical Converter: ${error.message}`, 'red');
    console.error(error);
    return null;
  }
}

async function testTranslation() {
  header('Step 6: Testing Translation Service');

  try {
    log('Importing TranslationService...', 'cyan');
    const { TranslationService } = await import('./packages/backend/src/services/tiktok/translation.js');

    const service = new TranslationService();

    log('Testing translation...', 'cyan');
    const result = await service.translateText('Check out the full video on YouTube!', 'es');

    log(`✓ Translation successful!`, 'green');
    log(`  Original: Check out the full video on YouTube!`, 'yellow');
    log(`  Spanish: ${result.translated}`, 'cyan');

    return true;

  } catch (error) {
    log(`✗ Error testing Translation Service: ${error.message}`, 'red');
    console.error(error);
    return false;
  }
}

async function main() {
  const videoPath = process.argv[2];

  log('\n🎬 TikTok Multilingual Pipeline - Simple Test\n', 'bright');

  // Step 1: Check environment
  const envOk = await checkEnvironment();
  if (!envOk) {
    log('\n❌ Environment check failed. Please fix and try again.\n', 'red');
    process.exit(1);
  }

  // Step 2: Check FFmpeg
  const ffmpegOk = await checkFFmpeg();
  if (!ffmpegOk) {
    log('\n❌ FFmpeg check failed. Please install and try again.\n', 'red');
    process.exit(1);
  }

  // Step 3: Check video file
  const videoOk = await checkVideoFile(videoPath);
  if (!videoOk) {
    log('\n❌ Video check failed. Please provide a valid video file.\n', 'red');
    process.exit(1);
  }

  // Step 4: Test Moment Analyzer
  const moments = await testMomentAnalyzer(videoPath);
  if (!moments) {
    log('\n⚠️  Moment Analyzer test failed, but continuing...\n', 'yellow');
  }

  // Step 5: Test Vertical Converter (use first 10 seconds of video for speed)
  log('\nNote: Testing with first 10 seconds of video for speed...', 'yellow');
  const { execSync } = await import('child_process');
  const testClipPath = '/tmp/test-clip-10s.mp4';

  try {
    execSync(`ffmpeg -i "${videoPath}" -t 10 -c copy "${testClipPath}" -y 2>&1`, { encoding: 'utf8' });
    log(`✓ Created 10-second test clip`, 'green');
  } catch (error) {
    log('⚠️  Could not create test clip, using full video', 'yellow');
  }

  const verticalVideo = await testVerticalConverter(fs.existsSync(testClipPath) ? testClipPath : videoPath);
  if (!verticalVideo) {
    log('\n⚠️  Vertical Converter test failed, but continuing...\n', 'yellow');
  }

  // Step 6: Test Translation
  const translationOk = await testTranslation();
  if (!translationOk) {
    log('\n⚠️  Translation test failed, but continuing...\n', 'yellow');
  }

  // Summary
  header('Test Summary');

  log('✓ Environment: OK', 'green');
  log('✓ FFmpeg: OK', 'green');
  log('✓ Video File: OK', 'green');
  log(moments ? '✓ Moment Analyzer: OK' : '⚠️  Moment Analyzer: FAILED', moments ? 'green' : 'yellow');
  log(verticalVideo ? '✓ Vertical Converter: OK' : '⚠️  Vertical Converter: FAILED', verticalVideo ? 'green' : 'yellow');
  log(translationOk ? '✓ Translation: OK' : '⚠️  Translation: FAILED', translationOk ? 'green' : 'yellow');

  log('\n📊 Next Steps:', 'bright');
  log('  1. Review the test results above', 'cyan');
  log('  2. Fix any failed tests', 'cyan');
  log('  3. Run full batch render test: node test-tiktok-batch.js', 'cyan');
  log('  4. If all tests pass, merge to master branch\n', 'cyan');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
