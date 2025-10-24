import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import fs from 'fs/promises';
import path from 'path';

export interface VoiceCloneOptions {
  name: string;
  description?: string;
  audioSamples: Buffer[];
}

export interface GenerateSpeechOptions {
  text: string;
  voiceId: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  speakerBoost?: boolean;
}

export interface VoiceInfo {
  voiceId: string;
  name: string;
  category: string;
}

export class VoiceCloning {
  private client: ElevenLabsClient;
  private audioDir = 'output/audio';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required');
    }

    this.client = new ElevenLabsClient({ apiKey });
    this.ensureDirectories();
  }

  /**
   * Ensure output directories exist
   */
  private async ensureDirectories(): Promise<void> {
    await fs.mkdir(this.audioDir, { recursive: true });
  }

  /**
   * Clone a voice from audio samples
   */
  async cloneVoice(options: VoiceCloneOptions): Promise<string> {
    try {
      console.log(`🎤 Cloning voice: ${options.name}`);
      console.log(`   Samples: ${options.audioSamples.length}`);

      // Convert Buffers to Files for ElevenLabs API
      const files = options.audioSamples.map((buffer, index) => {
        return new File([buffer], `sample_${index}.mp3`, { type: 'audio/mpeg' });
      });

      // Create voice clone
      const voice = await this.client.voices.add({
        name: options.name,
        description: options.description || `Cloned voice for ${options.name}`,
        files
      });

      console.log(`✅ Voice cloned successfully: ${voice.voice_id}`);

      return voice.voice_id;
    } catch (error: any) {
      console.error('Voice cloning failed:', error);
      throw new Error(`Failed to clone voice: ${error.message}`);
    }
  }

  /**
   * Generate speech with cloned voice
   */
  async generateSpeech(options: GenerateSpeechOptions): Promise<Buffer> {
    try {
      console.log(`🎙️ Generating speech with voice: ${options.voiceId}`);
      console.log(`   Text length: ${options.text.length} characters`);

      const audio = await this.client.textToSpeech.convert(options.voiceId, {
        text: options.text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: options.stability ?? 0.5,
          similarity_boost: options.similarityBoost ?? 0.75,
          style: options.style ?? 0,
          use_speaker_boost: options.speakerBoost ?? true
        }
      });

      // Convert readable stream to buffer
      const chunks: Uint8Array[] = [];
      for await (const chunk of audio) {
        chunks.push(chunk);
      }

      const buffer = Buffer.concat(chunks);
      console.log(`✅ Speech generated: ${buffer.length} bytes`);

      return buffer;
    } catch (error: any) {
      console.error('Speech generation failed:', error);
      throw new Error(`Failed to generate speech: ${error.message}`);
    }
  }

  /**
   * List all voices
   */
  async listVoices(): Promise<VoiceInfo[]> {
    try {
      const voices = await this.client.voices.getAll();

      return voices.voices.map(v => ({
        voiceId: v.voice_id,
        name: v.name,
        category: v.category || 'cloned'
      }));
    } catch (error: any) {
      console.error('Failed to list voices:', error);
      throw new Error(`Failed to list voices: ${error.message}`);
    }
  }

  /**
   * Get voice by ID
   */
  async getVoice(voiceId: string): Promise<VoiceInfo | null> {
    try {
      const voice = await this.client.voices.get(voiceId);

      return {
        voiceId: voice.voice_id,
        name: voice.name,
        category: voice.category || 'cloned'
      };
    } catch (error: any) {
      console.error(`Failed to get voice ${voiceId}:`, error);
      return null;
    }
  }

  /**
   * Delete voice
   */
  async deleteVoice(voiceId: string): Promise<boolean> {
    try {
      await this.client.voices.delete(voiceId);
      console.log(`✅ Voice deleted: ${voiceId}`);
      return true;
    } catch (error: any) {
      console.error(`Failed to delete voice ${voiceId}:`, error);
      return false;
    }
  }

  /**
   * Test voice quality
   */
  async testVoice(voiceId: string, testText: string = 'Hello, this is a test of my cloned voice.'): Promise<Buffer> {
    return this.generateSpeech({
      text: testText,
      voiceId
    });
  }

  /**
   * Save audio to file
   */
  async saveAudio(audioBuffer: Buffer, filename: string): Promise<string> {
    const filepath = path.join(this.audioDir, filename);

    await fs.writeFile(filepath, audioBuffer);
    console.log(`💾 Audio saved: ${filepath}`);

    return filepath;
  }

  /**
   * Generate narration for multiple segments
   */
  async generateNarrationBatch(
    segments: { text: string; filename: string }[],
    voiceId: string
  ): Promise<string[]> {
    const audioPaths: string[] = [];

    for (const segment of segments) {
      console.log(`🎙️ Generating narration: ${segment.filename}`);

      const audio = await this.generateSpeech({
        text: segment.text,
        voiceId
      });

      const filepath = await this.saveAudio(audio, segment.filename);
      audioPaths.push(filepath);

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return audioPaths;
  }

  /**
   * Validate audio for cloning
   * Minimum 60 seconds, maximum 300 seconds recommended
   */
  validateAudioForCloning(audioBuffers: Buffer[]): {
    valid: boolean;
    totalDuration?: number;
    message: string;
  } {
    // This is a simple size-based check
    // For accurate duration, you'd need to use ffprobe or similar
    const totalSize = audioBuffers.reduce((sum, buf) => sum + buf.length, 0);

    // Rough estimate: MP3 at 128kbps = ~16KB per second
    const estimatedDuration = totalSize / 16000;

    if (estimatedDuration < 60) {
      return {
        valid: false,
        totalDuration: estimatedDuration,
        message: `Audio too short: ${estimatedDuration.toFixed(1)}s (minimum 60s required)`
      };
    }

    if (estimatedDuration > 600) {
      return {
        valid: false,
        totalDuration: estimatedDuration,
        message: `Audio too long: ${estimatedDuration.toFixed(1)}s (maximum 600s recommended)`
      };
    }

    return {
      valid: true,
      totalDuration: estimatedDuration,
      message: `Audio duration OK: ${estimatedDuration.toFixed(1)}s`
    };
  }
}

export default VoiceCloning;
