# Translation Service - Quick Start Guide

## Setup (5 minutes)

### 1. Get Google Cloud API Key

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing
3. Enable "Cloud Translation API"
4. Go to Credentials → Create API Key
5. Copy the API key

### 2. Configure Environment

```bash
cd /home/dachu/Documents/projects/worktrees/tiktok-multilingual/packages/backend

# Copy environment template
cp .env.example .env

# Edit .env and add your API key
nano .env
# Add: GOOGLE_CLOUD_API_KEY=your_actual_api_key_here
```

### 3. Test Installation

```bash
# Run test suite (works without API key)
npx tsx src/services/tiktok/translation-test.ts

# Expected output: All tests pass ✓
```

## Basic Usage

### Translate Single Text

```typescript
import { TranslationService } from './services/tiktok/translation.js';

const service = new TranslationService();

// Translate to Shona
const result = await service.translateText(
  'Hello, welcome to our platform!',
  'sn'
);

console.log(result.translated);
// Output: "Mhoro, makakwazisa kwechikuva chedu!"
```

### Translate TikTok Script

```typescript
const segments = [
  'Hey everyone!',
  'Check out this amazing content!',
  'Don\'t forget to follow!'
];

const languages = ['sn', 'zu', 'sw']; // Shona, Zulu, Swahili

const result = await service.batchTranslate(segments, languages);

// Access translations
result.results.forEach((translations, lang) => {
  console.log(`${lang}:`, translations);
});
```

### Get Voice Locale for Audio

```typescript
// Translate content
const result = await service.translateText('Hello', 'sn');

// Get voice locale for ElevenLabs
const voiceLocale = service.getVoiceLocale('sn');
console.log(voiceLocale); // "en-US"

// Use with ElevenLabs API
await elevenLabs.textToSpeech({
  text: result.translated,
  language_code: voiceLocale
});
```

## Supported Languages

| Code | Language | Voice Locale | Region |
|------|----------|--------------|--------|
| en | English | en-US | Global |
| sn | Shona | en-US | Zimbabwe |
| zu | Zulu | en-ZA | South Africa |
| xh | Xhosa | en-ZA | South Africa |
| af | Afrikaans | en-ZA | South Africa |
| sw | Swahili | en-KE | East Africa |
| yo | Yoruba | en-NG | Nigeria |
| es | Spanish | es-ES | Spain |
| pt | Portuguese | pt-BR | Brazil |
| fr | French | fr-FR | France |

## Cost Estimation

```typescript
// Estimate before translating
const estimate = service.estimateCost(
  ['Text 1', 'Text 2', 'Text 3'],
  ['sn', 'zu', 'sw', 'yo']
);

console.log(`Characters: ${estimate.totalCharacters}`);
console.log(`Cost: $${estimate.estimatedCost.toFixed(4)}`);

// Proceed if cost is acceptable
if (estimate.estimatedCost < 0.10) {
  await service.batchTranslate(texts, languages);
}
```

## Examples

Run comprehensive examples:

```bash
# Set API key first
export GOOGLE_CLOUD_API_KEY="your_key"

# Run all examples
npx tsx src/services/tiktok/translation-examples.ts
```

Examples included:
1. Single text translation
2. Batch translation (1→4 languages)
3. Language detection
4. Multiple texts to multiple languages
5. Progress tracking
6. Cost estimation
7. Cache usage
8. Supported languages
9. Error handling
10. Real-world TikTok scenario

## API Reference

### Main Methods

```typescript
// Translate single text
await service.translateText(text, targetLang, sourceLang?)

// Batch translate
await service.batchTranslate(texts, languages)

// With progress tracking
await service.batchTranslateWithProgress(texts, langs, callback)

// Detect language
await service.detectLanguage(text)

// Get supported languages
service.getSupportedLanguages()

// Validate language code
service.validateLanguageCode(code)

// Get language name
service.getLanguageName(code)

// Get voice locale
service.getVoiceLocale(code)

// Get full config
service.getLanguageConfig(code)

// Estimate cost
service.estimateCost(texts, languages)

// Cache management
service.clearCache()
service.getCacheStats()
```

## Troubleshooting

### Error: API key required

```bash
# Check if environment variable is set
echo $GOOGLE_CLOUD_API_KEY

# Set it temporarily
export GOOGLE_CLOUD_API_KEY="your_key"

# Or add to .env file
echo "GOOGLE_CLOUD_API_KEY=your_key" >> .env
```

### Error: Invalid language code

```typescript
// Check if language is supported
if (service.validateLanguageCode('sn')) {
  // Proceed with translation
} else {
  console.log('Language not supported');
}

// Get list of supported languages
const languages = service.getSupportedLanguages();
console.log(languages.map(l => l.code));
```

### Error: Network/API issues

```typescript
// Use error handling
try {
  const result = await service.translateText(text, 'sn');
} catch (error) {
  console.error('Translation failed:', error.message);
  // Use fallback or retry
}

// For batch operations
const result = await service.batchTranslate(texts, languages);
if (result.errors.length > 0) {
  // Handle errors per language
  result.errors.forEach(err => {
    console.log(`${err.language}: ${err.error}`);
  });
}
```

## Performance Tips

1. **Use Caching:** Second translation of same text is ~100x faster
2. **Batch Processing:** Translate multiple texts in parallel
3. **Estimate First:** Check costs before large batches
4. **Reuse Instance:** Create service once, use many times

```typescript
// Good: Create once
const service = new TranslationService();
for (const text of texts) {
  await service.translateText(text, 'sn'); // Uses cache
}

// Bad: Create multiple times
for (const text of texts) {
  const service = new TranslationService(); // No cache benefit
  await service.translateText(text, 'sn');
}
```

## Next Steps

1. **Test with API key:** Run examples with real translations
2. **Integrate with Audio:** Use voice locales with ElevenLabs
3. **Integrate with Video:** Use translations for captions
4. **Monitor Costs:** Track usage and optimize caching

## Support

- **Documentation:** See `TRANSLATION-SERVICE-IMPLEMENTATION.md`
- **Examples:** See `translation-examples.ts`
- **Tests:** Run `translation-test.ts`
- **Google Cloud:** https://cloud.google.com/translate/docs

## Pricing

Google Cloud Translation: $20 per million characters

### Example Costs
- 1 TikTok video (4 segments, 5 languages): $0.00002
- 100 videos: $0.002
- 1,000 videos/month: $0.02
- 10,000 videos/month: $0.20

Very affordable for production use!
