/**
 * Translation Service Examples
 *
 * Demonstrates usage of the Translation Service for TikTok Multilingual Pipeline
 */

import { TranslationService } from './translation.js';

/**
 * Example 1: Single Text Translation
 */
async function exampleSingleTranslation() {
  console.log('\n=== Example 1: Single Text Translation ===\n');

  const service = new TranslationService();

  const text = 'Welcome to our platform! Let\'s create amazing content together.';
  const targetLanguage = 'es'; // Spanish

  try {
    const result = await service.translateText(text, targetLanguage);

    console.log('Original:', result.original);
    console.log('Translated:', result.translated);
    console.log('Source Language:', result.sourceLanguage);
    console.log('Target Language:', result.targetLanguage);
  } catch (error) {
    console.error('Translation error:', error);
  }
}

/**
 * Example 2: Batch Translation (1 text → 4 languages)
 */
async function exampleBatchTranslation() {
  console.log('\n=== Example 2: Batch Translation (1 text → 4 languages) ===\n');

  const service = new TranslationService();

  const text = 'Hello! How are you today?';
  const languages = ['es', 'fr', 'pt', 'sn']; // Spanish, French, Portuguese, Shona

  try {
    const result = await service.batchTranslate([text], languages);

    console.log('Original text:', text);
    console.log('\nTranslations:');

    result.results.forEach((translations, language) => {
      const langName = service.getLanguageName(language);
      const voiceLocale = service.getVoiceLocale(language);
      console.log(`\n${langName} (${language}):`);
      console.log(`  Translation: ${translations[0]}`);
      console.log(`  Voice Locale: ${voiceLocale}`);
    });

    if (result.errors.length > 0) {
      console.log('\nErrors:');
      result.errors.forEach(err => {
        console.log(`  ${err.language}: ${err.error}`);
      });
    }
  } catch (error) {
    console.error('Batch translation error:', error);
  }
}

/**
 * Example 3: Language Detection
 */
async function exampleLanguageDetection() {
  console.log('\n=== Example 3: Language Detection ===\n');

  const service = new TranslationService();

  const texts = [
    'Hello, how are you?',
    'Bonjour, comment allez-vous?',
    'Hola, ¿cómo estás?',
    'Mhoro, makadii?', // Shona
  ];

  for (const text of texts) {
    try {
      const detection = await service.detectLanguage(text);
      const langName = service.getLanguageName(detection.language);

      console.log(`Text: "${text}"`);
      console.log(`  Detected: ${detection.language} ${langName ? `(${langName})` : ''}`);
      console.log(`  Confidence: ${(detection.confidence * 100).toFixed(1)}%\n`);
    } catch (error) {
      console.error(`Detection error for "${text}":`, error);
    }
  }
}

/**
 * Example 4: Multiple Texts to Multiple Languages
 */
async function exampleMultipleTextsAndLanguages() {
  console.log('\n=== Example 4: Multiple Texts to Multiple Languages ===\n');

  const service = new TranslationService();

  const texts = [
    'Welcome to TikTok!',
    'Like and subscribe!',
    'Thank you for watching!'
  ];

  const languages = ['es', 'fr', 'pt', 'sn'];

  try {
    const result = await service.batchTranslate(texts, languages);

    console.log('Translating', texts.length, 'texts to', languages.length, 'languages\n');

    result.results.forEach((translations, language) => {
      const langName = service.getLanguageName(language);
      console.log(`\n${langName} (${language}):`);
      translations.forEach((translation, index) => {
        console.log(`  ${index + 1}. ${translation}`);
      });
    });

    if (result.errors.length > 0) {
      console.log('\nErrors:', result.errors.length);
    }
  } catch (error) {
    console.error('Translation error:', error);
  }
}

/**
 * Example 5: Translation with Progress Tracking
 */
async function exampleTranslationWithProgress() {
  console.log('\n=== Example 5: Translation with Progress Tracking ===\n');

  const service = new TranslationService();

  const texts = [
    'Creating content has never been easier.',
    'Join our community today!',
    'Share your story with the world.'
  ];

  const languages = ['es', 'fr', 'pt'];

  try {
    const result = await service.batchTranslateWithProgress(
      texts,
      languages,
      (progress, language) => {
        console.log(`Progress: ${progress.toFixed(1)}% - Processing ${language}`);
      }
    );

    console.log('\nTranslation complete!');
    console.log('Total languages:', result.results.size);
    console.log('Total errors:', result.errors.length);
  } catch (error) {
    console.error('Translation error:', error);
  }
}

/**
 * Example 6: Cost Estimation
 */
async function exampleCostEstimation() {
  console.log('\n=== Example 6: Cost Estimation ===\n');

  const service = new TranslationService();

  const texts = [
    'This is a sample text for translation.',
    'Another text to be translated.',
    'And one more for good measure!'
  ];

  const languages = ['es', 'fr', 'pt', 'sn', 'zu', 'sw'];

  const estimate = service.estimateCost(texts, languages);

  console.log('Cost Estimation:');
  console.log(`  Total Characters: ${estimate.totalCharacters.toLocaleString()}`);
  console.log(`  Estimated Cost: $${estimate.estimatedCost.toFixed(4)}`);
  console.log('\nBreakdown by Language:');
  estimate.breakdown.forEach(item => {
    const langName = service.getLanguageName(item.language);
    console.log(`  ${langName} (${item.language}): ${item.characters} chars = $${item.cost.toFixed(4)}`);
  });
}

/**
 * Example 7: Cache Usage
 */
async function exampleCacheUsage() {
  console.log('\n=== Example 7: Cache Usage ===\n');

  const service = new TranslationService();

  const text = 'This text will be cached.';
  const language = 'es';

  console.log('First translation (API call):');
  const start1 = Date.now();
  await service.translateText(text, language);
  const time1 = Date.now() - start1;
  console.log(`  Time: ${time1}ms`);

  console.log('\nSecond translation (from cache):');
  const start2 = Date.now();
  await service.translateText(text, language);
  const time2 = Date.now() - start2;
  console.log(`  Time: ${time2}ms`);

  const stats = service.getCacheStats();
  console.log('\nCache Statistics:');
  console.log(`  Cached items: ${stats.size}`);
  console.log(`  Speed improvement: ${((time1 / time2) * 100).toFixed(0)}% faster`);
}

/**
 * Example 8: Supported Languages Overview
 */
function exampleSupportedLanguages() {
  console.log('\n=== Example 8: Supported Languages ===\n');

  const service = new TranslationService();
  const languages = service.getSupportedLanguages();

  console.log('Total Supported Languages:', languages.length);
  console.log('\nLanguage Details:\n');

  languages.forEach(lang => {
    console.log(`${lang.name} (${lang.code})`);
    console.log(`  Voice Locale: ${lang.voice}`);
    console.log(`  Region: ${lang.region || 'N/A'}`);
    console.log('');
  });
}

/**
 * Example 9: Error Handling
 */
async function exampleErrorHandling() {
  console.log('\n=== Example 9: Error Handling ===\n');

  const service = new TranslationService();

  // Test 1: Invalid language code
  console.log('Test 1: Invalid language code');
  try {
    await service.translateText('Hello', 'invalid');
  } catch (error) {
    console.log('  Error caught:', error instanceof Error ? error.message : 'Unknown error');
  }

  // Test 2: Batch with some invalid languages
  console.log('\nTest 2: Batch with invalid languages');
  const result = await service.batchTranslate(
    ['Hello'],
    ['es', 'invalid1', 'fr', 'invalid2']
  );
  console.log('  Successful translations:', result.results.size);
  console.log('  Errors:', result.errors.length);
  result.errors.forEach(err => {
    console.log(`    ${err.language}: ${err.error}`);
  });
}

/**
 * Example 10: Real-World TikTok Scenario
 */
async function exampleTikTokScenario() {
  console.log('\n=== Example 10: Real-World TikTok Scenario ===\n');

  const service = new TranslationService();

  // TikTok video script segments
  const scriptSegments = [
    'Hey everyone! Welcome back to my channel!',
    'Today I\'m going to show you something amazing.',
    'Don\'t forget to like and follow!',
    'See you in the next video!'
  ];

  // Target African markets
  const targetLanguages = ['sn', 'zu', 'sw', 'yo'];

  console.log('TikTok Multilingual Content Pipeline\n');
  console.log('Original Script:');
  scriptSegments.forEach((segment, i) => {
    console.log(`  ${i + 1}. ${segment}`);
  });

  console.log('\nTranslating to African languages...\n');

  const result = await service.batchTranslate(scriptSegments, targetLanguages);

  result.results.forEach((translations, langCode) => {
    const config = service.getLanguageConfig(langCode);
    console.log(`\n${config?.name} (${langCode}) - Voice: ${config?.voice}`);
    console.log('─'.repeat(60));
    translations.forEach((translation, i) => {
      console.log(`  ${i + 1}. ${translation}`);
    });
  });

  // Cost estimation
  const estimate = service.estimateCost(scriptSegments, targetLanguages);
  console.log('\n\nCost Analysis:');
  console.log(`  Characters per language: ${estimate.breakdown[0].characters}`);
  console.log(`  Total characters: ${estimate.totalCharacters}`);
  console.log(`  Estimated cost: $${estimate.estimatedCost.toFixed(4)}`);
}

/**
 * Run all examples
 */
async function runAllExamples() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   Translation Service Examples - TikTok Multilingual      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    // Note: These examples require a valid GOOGLE_CLOUD_API_KEY
    // Uncomment the examples you want to run

    // await exampleSingleTranslation();
    // await exampleBatchTranslation();
    // await exampleLanguageDetection();
    // await exampleMultipleTextsAndLanguages();
    // await exampleTranslationWithProgress();
    // await exampleCostEstimation();
    // await exampleCacheUsage();
    exampleSupportedLanguages();
    // await exampleErrorHandling();
    // await exampleTikTokScenario();

    console.log('\n✓ Examples completed successfully!\n');
  } catch (error) {
    console.error('\n✗ Example failed:', error);
    console.log('\nMake sure to set GOOGLE_CLOUD_API_KEY environment variable.\n');
  }
}

// Run examples if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export {
  exampleSingleTranslation,
  exampleBatchTranslation,
  exampleLanguageDetection,
  exampleMultipleTextsAndLanguages,
  exampleTranslationWithProgress,
  exampleCostEstimation,
  exampleCacheUsage,
  exampleSupportedLanguages,
  exampleErrorHandling,
  exampleTikTokScenario,
};
