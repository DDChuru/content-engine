/**
 * Translation Service for TikTok Multilingual Pipeline
 *
 * Handles text translation using Google Cloud Translation API
 * with caching, batch processing, and language detection.
 */

import { Translate } from '@google-cloud/translate/build/src/v2/index.js';

/**
 * Language configuration with ElevenLabs voice mapping
 */
export interface LanguageConfig {
  code: string;        // ISO 639-1 code (e.g., 'en', 'sn')
  name: string;        // Human-readable name
  voice: string;       // ElevenLabs voice locale
  region?: string;     // Geographic region
}

/**
 * Single translation result
 */
export interface TranslationResult {
  original: string;
  translated: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence?: number;
}

/**
 * Translation error details
 */
export interface TranslationError {
  language: string;
  error: string;
  index?: number;
}

/**
 * Batch translation result
 */
export interface BatchTranslationResult {
  results: Map<string, string[]>;
  errors: TranslationError[];
}

/**
 * Translation Service
 *
 * Provides text translation with caching, batch processing,
 * and language detection capabilities.
 */
export class TranslationService {
  private translate: Translate;
  private cache: Map<string, string>;
  private supportedLanguages: Map<string, LanguageConfig>;

  constructor(apiKey?: string) {
    // Initialize Google Cloud Translation API
    const key = apiKey || process.env.GOOGLE_CLOUD_API_KEY;

    if (!key) {
      throw new Error('Google Cloud API key is required. Set GOOGLE_CLOUD_API_KEY environment variable.');
    }

    this.translate = new Translate({
      key: key,
    });

    // Initialize translation cache
    this.cache = new Map();

    // Initialize supported languages
    this.supportedLanguages = this.initializeSupportedLanguages();
  }

  /**
   * Initialize supported languages with voice mappings
   */
  private initializeSupportedLanguages(): Map<string, LanguageConfig> {
    const languages: LanguageConfig[] = [
      {
        code: 'en',
        name: 'English',
        voice: 'en-US',
        region: 'Global'
      },
      {
        code: 'sn',
        name: 'Shona',
        voice: 'en-US', // Multilingual model
        region: 'Zimbabwe'
      },
      {
        code: 'es',
        name: 'Spanish',
        voice: 'es-ES',
        region: 'Spain'
      },
      {
        code: 'pt',
        name: 'Portuguese',
        voice: 'pt-BR',
        region: 'Brazil'
      },
      {
        code: 'fr',
        name: 'French',
        voice: 'fr-FR',
        region: 'France'
      },
      {
        code: 'zu',
        name: 'Zulu',
        voice: 'en-ZA',
        region: 'South Africa'
      },
      {
        code: 'sw',
        name: 'Swahili',
        voice: 'en-KE',
        region: 'East Africa'
      },
      {
        code: 'af',
        name: 'Afrikaans',
        voice: 'en-ZA',
        region: 'South Africa'
      },
      {
        code: 'xh',
        name: 'Xhosa',
        voice: 'en-ZA',
        region: 'South Africa'
      },
      {
        code: 'yo',
        name: 'Yoruba',
        voice: 'en-NG',
        region: 'Nigeria'
      }
    ];

    const map = new Map<string, LanguageConfig>();
    languages.forEach(lang => map.set(lang.code, lang));
    return map;
  }

  /**
   * Generate cache key for translation
   */
  private getCacheKey(text: string, targetLanguage: string): string {
    return `${targetLanguage}:${text}`;
  }

  /**
   * Translate a single text to target language
   */
  async translateText(
    text: string,
    targetLanguage: string,
    sourceLanguage?: string
  ): Promise<TranslationResult> {
    // Validate target language
    if (!this.validateLanguageCode(targetLanguage)) {
      throw new Error(`Unsupported language: ${targetLanguage}`);
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLanguage);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return {
        original: text,
        translated: cached,
        sourceLanguage: sourceLanguage || 'auto',
        targetLanguage,
      };
    }

    try {
      // Perform translation
      const [translation, metadata] = await this.translate.translate(text, {
        from: sourceLanguage,
        to: targetLanguage,
      });

      // Cache the result
      this.cache.set(cacheKey, translation);

      return {
        original: text,
        translated: translation,
        sourceLanguage: metadata?.data?.translations?.[0]?.detectedSourceLanguage || sourceLanguage || 'auto',
        targetLanguage,
      };
    } catch (error) {
      throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Batch translate multiple texts to multiple languages
   */
  async batchTranslate(
    texts: string[],
    languages: string[]
  ): Promise<BatchTranslationResult> {
    const results = new Map<string, string[]>();
    const errors: TranslationError[] = [];

    // Validate all languages first
    const validLanguages = languages.filter(lang => {
      if (!this.validateLanguageCode(lang)) {
        errors.push({
          language: lang,
          error: `Unsupported language code: ${lang}`
        });
        return false;
      }
      return true;
    });

    // Process translations in parallel for each language
    await Promise.all(
      validLanguages.map(async (language) => {
        try {
          const translations: string[] = [];

          // Translate each text
          for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            try {
              const result = await this.translateText(text, language);
              translations.push(result.translated);
            } catch (error) {
              errors.push({
                language,
                error: error instanceof Error ? error.message : 'Unknown error',
                index: i
              });
              // Use original text as fallback
              translations.push(text);
            }
          }

          results.set(language, translations);
        } catch (error) {
          errors.push({
            language,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      })
    );

    return { results, errors };
  }

  /**
   * Detect the language of given text
   */
  async detectLanguage(text: string): Promise<{
    language: string;
    confidence: number;
  }> {
    try {
      const [detection] = await this.translate.detect(text);

      return {
        language: detection.language,
        confidence: detection.confidence || 0,
      };
    } catch (error) {
      throw new Error(`Language detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get list of supported languages
   */
  getSupportedLanguages(): LanguageConfig[] {
    return Array.from(this.supportedLanguages.values());
  }

  /**
   * Validate if a language code is supported
   */
  validateLanguageCode(code: string): boolean {
    return this.supportedLanguages.has(code);
  }

  /**
   * Get human-readable language name
   */
  getLanguageName(code: string): string | null {
    const lang = this.supportedLanguages.get(code);
    return lang ? lang.name : null;
  }

  /**
   * Get ElevenLabs voice locale for a language
   */
  getVoiceLocale(code: string): string | null {
    const lang = this.supportedLanguages.get(code);
    return lang ? lang.voice : null;
  }

  /**
   * Get language configuration
   */
  getLanguageConfig(code: string): LanguageConfig | null {
    return this.supportedLanguages.get(code) || null;
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
  getCacheStats(): {
    size: number;
    keys: string[];
  } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Add custom language support
   */
  addLanguage(config: LanguageConfig): void {
    this.supportedLanguages.set(config.code, config);
  }

  /**
   * Batch translate with progress callback
   */
  async batchTranslateWithProgress(
    texts: string[],
    languages: string[],
    onProgress?: (progress: number, language: string) => void
  ): Promise<BatchTranslationResult> {
    const results = new Map<string, string[]>();
    const errors: TranslationError[] = [];

    const validLanguages = languages.filter(lang => this.validateLanguageCode(lang));
    const totalOperations = validLanguages.length * texts.length;
    let completed = 0;

    for (const language of validLanguages) {
      try {
        const translations: string[] = [];

        for (let i = 0; i < texts.length; i++) {
          const text = texts[i];
          try {
            const result = await this.translateText(text, language);
            translations.push(result.translated);
          } catch (error) {
            errors.push({
              language,
              error: error instanceof Error ? error.message : 'Unknown error',
              index: i
            });
            translations.push(text);
          }

          completed++;
          if (onProgress) {
            const progress = (completed / totalOperations) * 100;
            onProgress(progress, language);
          }
        }

        results.set(language, translations);
      } catch (error) {
        errors.push({
          language,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { results, errors };
  }

  /**
   * Estimate translation cost
   * Google Cloud Translation charges per character
   */
  estimateCost(
    texts: string[],
    languages: string[],
    pricePerMillionChars: number = 20 // $20 per million characters (default Google pricing)
  ): {
    totalCharacters: number;
    estimatedCost: number;
    breakdown: {
      language: string;
      characters: number;
      cost: number;
    }[];
  } {
    const totalChars = texts.reduce((sum, text) => sum + text.length, 0);
    const breakdown = languages.map(lang => {
      const chars = totalChars;
      const cost = (chars / 1000000) * pricePerMillionChars;
      return {
        language: lang,
        characters: chars,
        cost
      };
    });

    const totalCharacters = totalChars * languages.length;
    const estimatedCost = (totalCharacters / 1000000) * pricePerMillionChars;

    return {
      totalCharacters,
      estimatedCost,
      breakdown
    };
  }
}

// Export singleton instance factory
let translationServiceInstance: TranslationService | null = null;

/**
 * Get or create singleton translation service instance
 */
export function getTranslationService(apiKey?: string): TranslationService {
  if (!translationServiceInstance) {
    translationServiceInstance = new TranslationService(apiKey);
  }
  return translationServiceInstance;
}

/**
 * Reset translation service instance (useful for testing)
 */
export function resetTranslationService(): void {
  translationServiceInstance = null;
}
