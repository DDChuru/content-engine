/**
 * Translation Service using Google Gemini API
 *
 * Provides translation using Gemini AI for more contextual, natural translations.
 * Better for TikTok captions, slang, and cultural context.
 *
 * Features:
 * - Natural language translation via Gemini
 * - Batch translation support
 * - Cost-effective (uses existing Gemini API key)
 * - Better context understanding
 * - TikTok caption optimization
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type {
  TranslationResult,
  BatchTranslationResult,
  TranslationError,
  CostEstimation,
  SupportedLanguageCode,
} from './types.js';

export class GeminiTranslationService {
  private gemini: GoogleGenerativeAI;
  private model: any;
  private cache: Map<string, string> = new Map();

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('Gemini API key is required. Set GEMINI_API_KEY environment variable.');
    }

    this.gemini = new GoogleGenerativeAI(key);
    // Try gemini-2.0-flash-exp (latest experimental model)
    this.model = this.gemini.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  }

  /**
   * Translate a single text to target language
   */
  async translateText(
    text: string,
    targetLanguage: SupportedLanguageCode,
    sourceLanguage: SupportedLanguageCode = 'en'
  ): Promise<TranslationResult> {
    // Check cache first
    const cacheKey = `${sourceLanguage}:${targetLanguage}:${text}`;
    if (this.cache.has(cacheKey)) {
      return {
        original: text,
        translated: this.cache.get(cacheKey)!,
        sourceLanguage,
        targetLanguage,
        confidence: 1.0,
      };
    }

    try {
      const languageNames = this.getLanguageNames();
      const sourceName = languageNames[sourceLanguage] || sourceLanguage;
      const targetName = languageNames[targetLanguage] || targetLanguage;

      const prompt = `Translate the following text from ${sourceName} to ${targetName}.
Keep the tone casual and engaging, suitable for TikTok/social media.
Preserve emojis, hashtags, and formatting.
Only respond with the translation, nothing else.

Text to translate:
${text}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const translated = response.text().trim();

      // Cache the result
      this.cache.set(cacheKey, translated);

      return {
        original: text,
        translated,
        sourceLanguage,
        targetLanguage,
        confidence: 0.95, // Gemini is high quality
      };
    } catch (error: any) {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  /**
   * Batch translate multiple texts to multiple languages
   */
  async batchTranslate(
    texts: string[],
    languages: SupportedLanguageCode[],
    sourceLanguage: SupportedLanguageCode = 'en'
  ): Promise<BatchTranslationResult> {
    const results = new Map<string, string[]>();
    const errors: TranslationError[] = [];

    for (const language of languages) {
      const translations: string[] = [];

      for (let i = 0; i < texts.length; i++) {
        try {
          const result = await this.translateText(texts[i], language, sourceLanguage);
          translations.push(result.translated);
        } catch (error: any) {
          console.error(`[Gemini] Translation failed for text ${i} to ${language}:`, error);
          errors.push({
            language,
            error: error.message,
            index: i,
          });
          // Use original text as fallback
          translations.push(texts[i]);
        }
      }

      results.set(language, translations);
    }

    return {
      results,
      errors,
    };
  }

  /**
   * Batch translate with progress callback
   */
  async batchTranslateWithProgress(
    texts: string[],
    languages: SupportedLanguageCode[],
    onProgress?: (progress: number, language: string) => void,
    sourceLanguage: SupportedLanguageCode = 'en'
  ): Promise<BatchTranslationResult> {
    const results = new Map<string, string[]>();
    const errors: TranslationError[] = [];

    const totalOperations = texts.length * languages.length;
    let completedOperations = 0;

    for (const language of languages) {
      const translations: string[] = [];

      for (let i = 0; i < texts.length; i++) {
        try {
          const result = await this.translateText(texts[i], language, sourceLanguage);
          translations.push(result.translated);

          completedOperations++;
          if (onProgress) {
            const progress = Math.round((completedOperations / totalOperations) * 100);
            onProgress(progress, language);
          }
        } catch (error: any) {
          console.error(`[Gemini] Translation failed for text ${i} to ${language}:`, error);
          errors.push({
            language,
            error: error.message,
            index: i,
          });
          translations.push(texts[i]);

          completedOperations++;
          if (onProgress) {
            const progress = Math.round((completedOperations / totalOperations) * 100);
            onProgress(progress, language);
          }
        }
      }

      results.set(language, translations);
    }

    return {
      results,
      errors,
    };
  }

  /**
   * Estimate cost for translation
   * Gemini pricing: ~$0.00025 per 1K characters for gemini-pro
   */
  estimateCost(texts: string[], languages: SupportedLanguageCode[]): CostEstimation {
    const totalCharacters = texts.reduce((sum, text) => sum + text.length, 0);
    const totalTexts = texts.length * languages.length;

    // Gemini Pro pricing (approximate)
    const pricePerThousandChars = 0.00025;

    // Each translation includes the prompt overhead (~100 chars)
    const promptOverhead = 100 * totalTexts;
    const estimatedChars = totalCharacters * languages.length + promptOverhead;

    const estimatedCost = (estimatedChars / 1000) * pricePerThousandChars;

    return {
      totalCharacters: estimatedChars,
      estimatedCost,
      breakdown: {
        service: 'Google Gemini',
        texts: texts.length,
        languages: languages.length,
        totalOperations: totalTexts,
        pricePerThousandChars,
      },
    };
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): SupportedLanguageCode[] {
    return ['en', 'sn', 'es', 'pt', 'fr', 'zu', 'sw', 'af', 'xh', 'yo'];
  }

  /**
   * Validate language code
   */
  validateLanguageCode(code: string): boolean {
    return this.getSupportedLanguages().includes(code as SupportedLanguageCode);
  }

  /**
   * Get language name from code
   */
  getLanguageName(code: SupportedLanguageCode): string {
    const names = this.getLanguageNames();
    return names[code] || code;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Language name mappings
   */
  private getLanguageNames(): Record<SupportedLanguageCode, string> {
    return {
      en: 'English',
      sn: 'Shona',
      es: 'Spanish',
      pt: 'Portuguese',
      fr: 'French',
      zu: 'Zulu',
      sw: 'Swahili',
      af: 'Afrikaans',
      xh: 'Xhosa',
      yo: 'Yoruba',
    };
  }
}

// Singleton instance
let instance: GeminiTranslationService | null = null;

export function getGeminiTranslationService(): GeminiTranslationService {
  if (!instance) {
    instance = new GeminiTranslationService();
  }
  return instance;
}
