/**
 * ElevenLabs Voice Generation Service
 *
 * Provides text-to-speech with voice cloning and multilingual support.
 *
 * Features:
 * - Voice cloning from audio samples
 * - Multilingual TTS (supports 29+ languages)
 * - Batch audio generation
 * - Voice customization (stability, similarity, style)
 * - Cost estimation
 *
 * @see https://elevenlabs.io/docs/api-reference
 */

import type {
  VoiceSettings,
  VoiceLocale,
  AudioGenerationOptions,
  AudioGenerationResult,
  BatchAudioGenerationOptions,
  BatchAudioGenerationResult,
  VoiceCloneOptions,
  VoiceCloneResult,
  CostEstimation,
} from './types.js';

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';
  private model = 'eleven_multilingual_v2'; // Supports 29 languages

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.ELEVENLABS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key is required');
    }
  }

  /**
   * Generate speech from text using a specific voice
   */
  async generateSpeech(
    text: string,
    voiceId: string,
    options?: AudioGenerationOptions
  ): Promise<AudioGenerationResult> {
    const startTime = Date.now();

    try {
      const voiceSettings: VoiceSettings = {
        stability: options?.stability ?? 0.5,
        similarity_boost: options?.similarity_boost ?? 0.75,
        style: options?.style ?? 0,
        use_speaker_boost: options?.use_speaker_boost ?? true,
      };

      // Build request body - only include language_code if provided
      const requestBody: any = {
        text,
        model_id: options?.model_id || this.model,
        voice_settings: voiceSettings,
      };

      // Note: eleven_multilingual_v2 detects language automatically from text
      // Only include language_code if explicitly provided and needed
      // For most cases, the model auto-detects from the text content

      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`ElevenLabs API error: ${response.status} - ${error}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const processingTime = Date.now() - startTime;

      // Estimate character count for cost calculation
      const characterCount = text.length;
      const estimatedCost = this.estimateCost([text]);

      return {
        audioBuffer: Buffer.from(audioBuffer),
        characterCount,
        duration: 0, // Would need audio analysis to get actual duration
        voiceId,
        model: options?.model_id || this.model,
        processingTime,
        cost: estimatedCost.estimatedCost,
      };
    } catch (error: any) {
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  /**
   * Generate speech for multiple texts in batch
   */
  async batchGenerateSpeech(
    options: BatchAudioGenerationOptions
  ): Promise<BatchAudioGenerationResult> {
    const { texts, voiceId, language_code, voiceSettings, onProgress } = options;
    const startTime = Date.now();

    const results: AudioGenerationResult[] = [];
    const errors: Array<{ index: number; text: string; error: string }> = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];

      try {
        if (onProgress) {
          onProgress(i + 1, texts.length, text.substring(0, 50));
        }

        const result = await this.generateSpeech(text, voiceId, {
          language_code,
          ...voiceSettings,
        });

        results.push(result);
      } catch (error: any) {
        console.error(`[ElevenLabs] Failed to generate audio for text ${i}:`, error);
        errors.push({
          index: i,
          text: text.substring(0, 100),
          error: error.message,
        });
      }
    }

    const totalCharacters = texts.reduce((sum, text) => sum + text.length, 0);
    const totalCost = this.estimateCost(texts).estimatedCost;
    const processingTime = Date.now() - startTime;

    return {
      results,
      errors,
      totalCharacters,
      totalCost,
      processingTime,
      successCount: results.length,
      errorCount: errors.length,
    };
  }

  /**
   * Clone a voice from audio samples
   *
   * @param name - Name for the cloned voice
   * @param audioFiles - Array of audio file paths or buffers
   * @param description - Optional description
   */
  async cloneVoice(
    name: string,
    audioFiles: Array<string | Buffer>,
    description?: string
  ): Promise<VoiceCloneResult> {
    try {
      const formData = new FormData();
      formData.append('name', name);
      if (description) {
        formData.append('description', description);
      }

      // Add audio files
      for (let i = 0; i < audioFiles.length; i++) {
        const file = audioFiles[i];
        if (typeof file === 'string') {
          // File path - would need to read file
          throw new Error('File path support not implemented. Please provide Buffers.');
        } else {
          // Buffer
          const blob = new Blob([file], { type: 'audio/mpeg' });
          formData.append('files', blob, `sample_${i}.mp3`);
        }
      }

      const response = await fetch(`${this.baseUrl}/voices/add`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Voice cloning failed: ${response.status} - ${error}`);
      }

      const data = await response.json();

      return {
        voiceId: data.voice_id,
        name,
        description,
        createdAt: new Date(),
      };
    } catch (error: any) {
      throw new Error(`Failed to clone voice: ${error.message}`);
    }
  }

  /**
   * Get all available voices
   */
  async getVoices(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error: any) {
      throw new Error(`Failed to get voices: ${error.message}`);
    }
  }

  /**
   * Get a specific voice by ID
   */
  async getVoice(voiceId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voice: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      throw new Error(`Failed to get voice: ${error.message}`);
    }
  }

  /**
   * Delete a cloned voice
   */
  async deleteVoice(voiceId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
        method: 'DELETE',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete voice: ${response.status}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to delete voice: ${error.message}`);
    }
  }

  /**
   * Estimate cost for text-to-speech generation
   *
   * ElevenLabs pricing (as of 2024):
   * - Creator: $22/month - 100,000 characters
   * - Pro: $99/month - 500,000 characters
   * - Scale: $330/month - 2,000,000 characters
   *
   * Average cost: ~$0.22 per 1000 characters (Creator tier)
   */
  estimateCost(texts: string[]): CostEstimation {
    const totalCharacters = texts.reduce((sum, text) => sum + text.length, 0);
    const pricePerThousandChars = 0.22; // Creator tier average
    const estimatedCost = (totalCharacters / 1000) * pricePerThousandChars;

    return {
      totalCharacters,
      estimatedCost,
      breakdown: {
        characters: totalCharacters,
        pricePerThousand: pricePerThousandChars,
        tier: 'Creator (estimated)',
      },
    };
  }

  /**
   * Save audio buffer to file
   */
  async saveAudio(audioBuffer: Buffer, outputPath: string): Promise<void> {
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, audioBuffer);
  }

  /**
   * Get recommended voice settings for different use cases
   */
  static getRecommendedSettings(useCase: 'narration' | 'conversation' | 'character' | 'default'): VoiceSettings {
    const settings: Record<string, VoiceSettings> = {
      narration: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0,
        use_speaker_boost: true,
      },
      conversation: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
      character: {
        stability: 0.3,
        similarity_boost: 0.9,
        style: 0.5,
        use_speaker_boost: true,
      },
      default: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0,
        use_speaker_boost: true,
      },
    };

    return settings[useCase];
  }

  /**
   * Get the model to use based on language
   */
  static getModelForLanguage(languageCode: VoiceLocale): string {
    // eleven_multilingual_v2 supports 29 languages including:
    // English, Spanish, French, German, Polish, Portuguese, Italian,
    // Hindi, Arabic, and many more
    return 'eleven_multilingual_v2';
  }
}

// Singleton instance
let instance: ElevenLabsService | null = null;

export function getElevenLabsService(): ElevenLabsService {
  if (!instance) {
    instance = new ElevenLabsService();
  }
  return instance;
}
