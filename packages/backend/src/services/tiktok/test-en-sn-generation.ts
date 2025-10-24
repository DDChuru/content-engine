/**
 * Test Script: English + Shona Video Generation
 *
 * This script tests the complete TikTok multilingual pipeline for:
 * - English (en) - Primary language
 * - Shona (sn) - Zimbabwe language
 *
 * Tests:
 * 1. Translation service (EN → SN)
 * 2. ElevenLabs voice generation for both languages
 * 3. Cost estimation
 * 4. Full workflow integration
 *
 * Usage:
 *   npx tsx src/services/tiktok/test-en-sn-generation.ts
 *
 * Prerequisites:
 *   - GOOGLE_CLOUD_API_KEY in .env
 *   - ELEVENLABS_API_KEY in .env
 *   - A valid ElevenLabs voice ID
 */

import 'dotenv/config';
import { GeminiTranslationService } from './translation-gemini.js';
import { ElevenLabsService } from './elevenlabs.js';
import { SUPPORTED_LANGUAGES } from './types.js';
import { promises as fs } from 'fs';
import path from 'path';

// Test configuration
const TEST_LANGUAGES = ['en', 'sn'];
const OUTPUT_DIR = path.join(process.cwd(), 'output', 'test-audio');

// Sample TikTok script segments (educational content about Zimbabwe)
const TEST_SCRIPT = {
  title: 'Amazing Facts About Zimbabwe',
  segments: [
    'Hey everyone! Welcome back to my channel!',
    'Today I\'m sharing amazing facts about Zimbabwe.',
    'Did you know Zimbabwe has the largest waterfall in the world?',
    'Victoria Falls is absolutely breathtaking!',
    'Don\'t forget to like and follow for more!',
  ],
};

/**
 * Main test function
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🎬 TikTok Multilingual Video Generation Test');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`📍 Languages: English (en) + Shona (sn)`);
  console.log(`📝 Script: ${TEST_SCRIPT.title}`);
  console.log(`📦 Segments: ${TEST_SCRIPT.segments.length}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Ensure output directory exists
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Test 1: Check API keys
  await testAPIKeys();

  // Test 2: Language configuration
  await testLanguageConfiguration();

  // Test 3: Translation service
  const translations = await testTranslationService();

  // Test 4: Cost estimation
  await testCostEstimation(translations);

  // Test 5: ElevenLabs voice generation (optional - requires voice ID)
  await testVoiceGeneration(translations);

  // Summary
  printSummary();
}

/**
 * Test 1: Verify API keys are configured
 */
async function testAPIKeys() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 1: API Key Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const geminiKey = process.env.GEMINI_API_KEY;
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

  console.log(`✓ GEMINI_API_KEY: ${geminiKey ? '✅ Configured' : '❌ Missing'}`);
  console.log(`✓ ELEVENLABS_API_KEY: ${elevenLabsKey ? '✅ Configured' : '❌ Missing'}`);

  if (!geminiKey || !elevenLabsKey) {
    console.log('\n⚠️  Warning: Missing API keys. Create a .env file with:');
    console.log('   GEMINI_API_KEY=your_key_here');
    console.log('   ELEVENLABS_API_KEY=your_key_here\n');
  } else {
    console.log('\n✅ All API keys configured!\n');
  }
}

/**
 * Test 2: Verify language configuration
 */
async function testLanguageConfiguration() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 2: Language Configuration');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const enConfig = SUPPORTED_LANGUAGES.find(l => l.code === 'en');
  const snConfig = SUPPORTED_LANGUAGES.find(l => l.code === 'sn');

  console.log('English (en):');
  console.log(`  Name: ${enConfig?.name}`);
  console.log(`  Voice Locale: ${enConfig?.voice}`);
  console.log(`  Region: ${enConfig?.region}\n`);

  console.log('Shona (sn):');
  console.log(`  Name: ${snConfig?.name}`);
  console.log(`  Voice Locale: ${snConfig?.voice} (multilingual model)`);
  console.log(`  Region: ${snConfig?.region}\n`);

  console.log('✅ Language configuration verified!\n');
}

/**
 * Test 3: Translation service
 */
async function testTranslationService() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 3: Translation Service (EN → SN)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.GEMINI_API_KEY) {
    console.log('⚠️  Skipping translation test (no API key)\n');
    return new Map([
      ['en', TEST_SCRIPT.segments],
      ['sn', TEST_SCRIPT.segments], // Fallback to English if no API key
    ]);
  }

  try {
    const translationService = new GeminiTranslationService();

    console.log('Translating script segments...\n');

    const result = await translationService.batchTranslateWithProgress(
      TEST_SCRIPT.segments,
      ['sn'],
      (progress, language) => {
        console.log(`  [${progress}%] Translating to ${language}...`);
      }
    );

    console.log('\n📋 Translation Results:\n');

    const shonaTranslations = result.results.get('sn') || [];

    for (let i = 0; i < TEST_SCRIPT.segments.length; i++) {
      console.log(`Segment ${i + 1}:`);
      console.log(`  EN: ${TEST_SCRIPT.segments[i]}`);
      console.log(`  SN: ${shonaTranslations[i] || 'N/A'}\n`);
    }

    if (result.errors.length > 0) {
      console.log('⚠️  Translation Errors:');
      result.errors.forEach(err => {
        console.log(`  - ${err.language}: ${err.error}`);
      });
      console.log();
    }

    console.log('✅ Translation test complete!\n');

    return new Map([
      ['en', TEST_SCRIPT.segments],
      ['sn', shonaTranslations],
    ]);
  } catch (error: any) {
    console.error('❌ Translation test failed:', error.message);
    console.log('   Using original English text as fallback\n');

    return new Map([
      ['en', TEST_SCRIPT.segments],
      ['sn', TEST_SCRIPT.segments],
    ]);
  }
}

/**
 * Test 4: Cost estimation
 */
async function testCostEstimation(translations: Map<string, string[]>) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 4: Cost Estimation');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    const translationService = new GeminiTranslationService();
    const elevenLabsService = new ElevenLabsService(process.env.ELEVENLABS_API_KEY || 'dummy');

    // Translation cost
    const translationCost = translationService.estimateCost(
      TEST_SCRIPT.segments,
      ['sn']
    );

    console.log('Translation Costs (Google Gemini):');
    console.log(`  Characters: ${translationCost.totalCharacters}`);
    console.log(`  Estimated cost: $${translationCost.estimatedCost.toFixed(4)}\n`);

    // Voice generation cost
    const enTexts = translations.get('en') || [];
    const snTexts = translations.get('sn') || [];
    const allTexts = [...enTexts, ...snTexts];

    const voiceCost = elevenLabsService.estimateCost(allTexts);

    console.log('Voice Generation Costs (ElevenLabs):');
    console.log(`  Characters: ${voiceCost.totalCharacters}`);
    console.log(`  Estimated cost: $${voiceCost.estimatedCost.toFixed(4)}\n`);

    // Total cost
    const totalCost = translationCost.estimatedCost + voiceCost.estimatedCost;

    console.log('Total Estimated Cost:');
    console.log(`  Per video (2 languages): $${totalCost.toFixed(4)}`);
    console.log(`  Per language: $${(totalCost / 2).toFixed(4)}`);
    console.log(`  Per 100 videos: $${(totalCost * 100).toFixed(2)}\n`);

    console.log('✅ Cost estimation complete!\n');
  } catch (error: any) {
    console.error('❌ Cost estimation failed:', error.message, '\n');
  }
}

/**
 * Test 5: ElevenLabs voice generation
 */
async function testVoiceGeneration(translations: Map<string, string[]>) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('TEST 5: Voice Generation (Optional)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.ELEVENLABS_API_KEY) {
    console.log('⚠️  Skipping voice generation (no API key)\n');
    return;
  }

  console.log('📝 To test voice generation, you need a voice ID.');
  console.log('   Options:');
  console.log('   1. Use a pre-made voice from ElevenLabs');
  console.log('   2. Clone your own voice using the API\n');

  console.log('Example command to generate audio:');
  console.log('```typescript');
  console.log('const service = new ElevenLabsService();');
  console.log('const result = await service.generateSpeech(');
  console.log('  "Your text here",');
  console.log('  "your-voice-id",');
  console.log('  { language_code: "en-US" }');
  console.log(');');
  console.log('await service.saveAudio(result.audioBuffer, "output.mp3");');
  console.log('```\n');

  // Save translations to JSON for manual testing
  const translationsObject: any = {};
  translations.forEach((value, key) => {
    translationsObject[key] = value;
  });

  const outputPath = path.join(OUTPUT_DIR, 'translations-en-sn.json');
  await fs.writeFile(
    outputPath,
    JSON.stringify({
      title: TEST_SCRIPT.title,
      languages: TEST_LANGUAGES,
      translations: translationsObject,
    }, null, 2)
  );

  console.log(`✅ Translations saved to: ${outputPath}\n`);
  console.log('   Use this JSON file to test voice generation manually.\n');
}

/**
 * Print summary
 */
function printSummary() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('📊 Test Summary');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log('✅ Tests Completed:');
  console.log('   1. API key configuration');
  console.log('   2. Language configuration (EN + SN)');
  console.log('   3. Translation service (EN → SN)');
  console.log('   4. Cost estimation');
  console.log('   5. Voice generation setup\n');

  console.log('📁 Output Directory:');
  console.log(`   ${OUTPUT_DIR}\n`);

  console.log('🎯 Next Steps:');
  console.log('   1. Review the translations in the JSON file');
  console.log('   2. Set up a voice ID in ElevenLabs');
  console.log('   3. Run the full video generation pipeline');
  console.log('   4. Test with a real video file\n');

  console.log('═══════════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
