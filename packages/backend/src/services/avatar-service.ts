/**
 * Avatar Service
 *
 * Unified interface for AI-powered lip-sync avatar generation
 * Supports multiple providers: A2E.ai (primary), HeyGen, Infinity AI
 */

import path from 'path';
import fs from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import type {
  AvatarConfig,
  AvatarResult,
  AvatarJob,
  AvatarProvider,
  A2EUploadResponse,
  A2ELipSyncRequest,
  A2ELipSyncResponse,
} from '../types/avatar.js';

export class AvatarService {
  private outputDir: string;
  private provider: AvatarProvider;
  private apiKey: string;
  private apiUrl: string;

  constructor(
    provider: AvatarProvider = 'a2e',
    apiKey?: string,
    outputDir: string = 'output/avatars'
  ) {
    this.provider = provider;
    this.outputDir = path.resolve(outputDir);

    // Set API configuration based on provider
    switch (provider) {
      case 'a2e':
        this.apiKey = apiKey || process.env.A2E_API_KEY || '';
        this.apiUrl = 'https://api.a2e.ai/v1';
        break;
      case 'heygen':
        this.apiKey = apiKey || process.env.HEYGEN_API_KEY || '';
        this.apiUrl = 'https://api.heygen.com/v1';
        break;
      case 'infinity':
        this.apiKey = apiKey || process.env.INFINITY_API_KEY || '';
        this.apiUrl = 'https://api.infinity.ai/v1';
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  /**
   * Generate lip-synced avatar video
   */
  async generateAvatar(config: AvatarConfig): Promise<AvatarResult> {
    console.log(`[Avatar] Generating with ${this.provider} provider`);
    console.log(`[Avatar] Avatar image: ${config.avatarImage}`);
    console.log(`[Avatar] Audio file: ${config.audioFile}`);

    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true });

    // Route to appropriate provider
    switch (this.provider) {
      case 'a2e':
        return await this.generateWithA2E(config);
      case 'heygen':
        return await this.generateWithHeyGen(config);
      case 'infinity':
        return await this.generateWithInfinity(config);
      default:
        throw new Error(`Provider ${this.provider} not implemented`);
    }
  }

  /**
   * A2E.ai implementation
   */
  private async generateWithA2E(config: AvatarConfig): Promise<AvatarResult> {
    const startTime = Date.now();

    // Step 1: Upload avatar image
    console.log('[A2E] Uploading avatar image...');
    const imageData = await this.uploadFile(config.avatarImage, 'image');

    // Step 2: Upload audio file
    console.log('[A2E] Uploading audio file...');
    const audioData = await this.uploadFile(config.audioFile, 'audio');

    // Step 3: Create lip-sync job
    console.log('[A2E] Creating lip-sync job...');
    const job = await this.createLipSyncJob({
      avatar: imageData.id,
      audio: audioData.id,
      quality: config.quality || 'standard',
      fps: config.fps || 30,
    });

    // Step 4: Poll for completion
    console.log('[A2E] Waiting for completion...');
    const result = await this.pollJobStatus(job.job_id);

    if (result.status === 'failed') {
      throw new Error(`Avatar generation failed: ${result.video_url || 'Unknown error'}`);
    }

    // Step 5: Download video
    console.log('[A2E] Downloading result...');
    const videoPath = await this.downloadVideo(result.video_url!, 'a2e');

    const duration = result.duration || audioData.duration || 0;
    const cost = this.calculateCost(duration, this.provider);

    console.log(`[A2E] Complete! Video: ${videoPath}, Cost: $${cost.toFixed(3)}`);

    return {
      videoUrl: result.video_url!,
      videoPath,
      duration,
      cost,
      provider: this.provider,
      timestamp: Date.now(),
    };
  }

  /**
   * HeyGen implementation (stub for future)
   */
  private async generateWithHeyGen(config: AvatarConfig): Promise<AvatarResult> {
    throw new Error('HeyGen provider not yet implemented');
  }

  /**
   * Infinity AI implementation (stub for future)
   */
  private async generateWithInfinity(config: AvatarConfig): Promise<AvatarResult> {
    throw new Error('Infinity AI provider not yet implemented');
  }

  /**
   * Upload file to provider
   */
  private async uploadFile(
    filePath: string,
    type: 'image' | 'audio'
  ): Promise<A2EUploadResponse> {
    const endpoint = type === 'image' ? '/upload/image' : '/upload/audio';

    // Read file
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    // Create form data
    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append('file', blob, fileName);

    // Upload
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json() as A2EUploadResponse;
    console.log(`[A2E] Uploaded ${type}: ${data.id}`);

    return data;
  }

  /**
   * Create lip-sync job
   */
  private async createLipSyncJob(
    request: A2ELipSyncRequest
  ): Promise<A2ELipSyncResponse> {
    const response = await fetch(`${this.apiUrl}/lipsync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Job creation failed: ${response.statusText}`);
    }

    const data = await response.json() as A2ELipSyncResponse;
    console.log(`[A2E] Job created: ${data.job_id}`);

    return data;
  }

  /**
   * Poll job status until complete
   */
  private async pollJobStatus(
    jobId: string,
    maxAttempts: number = 60,
    intervalMs: number = 5000
  ): Promise<A2ELipSyncResponse> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const response = await fetch(`${this.apiUrl}/lipsync/${jobId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.statusText}`);
      }

      const data = await response.json() as A2ELipSyncResponse;

      if (data.status === 'completed') {
        console.log(`[A2E] Job completed in ${attempt * intervalMs / 1000}s`);
        return data;
      }

      if (data.status === 'failed') {
        return data;
      }

      // Log progress
      if (data.progress !== undefined) {
        console.log(`[A2E] Progress: ${data.progress}%`);
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error('Job timeout - exceeded maximum wait time');
  }

  /**
   * Download video from URL
   */
  private async downloadVideo(url: string, provider: string): Promise<string> {
    const timestamp = Date.now();
    const filename = `avatar_${provider}_${timestamp}.mp4`;
    const outputPath = path.join(this.outputDir, filename);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const fileStream = createWriteStream(outputPath);
    await pipeline(response.body as any, fileStream);

    console.log(`[Avatar] Downloaded to: ${outputPath}`);
    return outputPath;
  }

  /**
   * Calculate cost based on duration and provider
   */
  private calculateCost(durationSeconds: number, provider: AvatarProvider): number {
    const durationMinutes = durationSeconds / 60;

    switch (provider) {
      case 'a2e':
        return durationMinutes * 0.10; // $0.10 per minute
      case 'heygen':
        return durationMinutes * 0.99; // ~$0.99 per minute
      case 'infinity':
        return 0; // Free (for now)
      case 'wav2lip':
        return 0; // Free (self-hosted)
      default:
        return 0;
    }
  }

  /**
   * Get estimated cost before generation
   */
  getEstimatedCost(durationSeconds: number, provider?: AvatarProvider): number {
    return this.calculateCost(durationSeconds, provider || this.provider);
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }

  /**
   * Get provider info
   */
  getProviderInfo(): { provider: AvatarProvider; apiUrl: string; configured: boolean } {
    return {
      provider: this.provider,
      apiUrl: this.apiUrl,
      configured: this.isConfigured(),
    };
  }
}

export default AvatarService;
