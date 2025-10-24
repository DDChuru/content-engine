/**
 * Avatar Helper Utility
 *
 * Generic helper for adding AI-powered lip-sync avatars to ANY video pipeline
 * Can be used by educational videos, video director, strategy consultant, etc.
 */

import AvatarService from '../services/avatar-service.js';
import AvatarCompositor from '../services/avatar-compositor.js';
import type { AvatarProvider, AvatarPosition } from '../types/avatar.js';
import fs from 'fs/promises';
import path from 'path';

export interface AvatarOptions {
  /** Enable/disable avatar feature */
  enabled: boolean;

  /** Path or URL to avatar image */
  avatarImage?: string;

  /** Path to audio file for lip-sync */
  audioFile?: string;

  /** Avatar provider (default: a2e) */
  provider?: AvatarProvider;

  /** Quality level */
  quality?: 'standard' | 'high' | 'ultra';

  /** Frames per second */
  fps?: number;

  /** Position on screen */
  position?: AvatarPosition;

  /** Scale factor (0.1 - 0.5) */
  scale?: number;

  /** Add border around avatar */
  addBorder?: boolean;

  /** Border color */
  borderColor?: string;
}

export interface AvatarResult {
  /** Whether avatar was added */
  hasAvatar: boolean;

  /** Path to avatar video (if generated) */
  avatarVideoPath?: string;

  /** Path to final composited video */
  finalVideoPath: string;

  /** Cost of avatar generation */
  avatarCost: number;

  /** Duration of avatar */
  avatarDuration?: number;
}

/**
 * Add avatar to any video
 */
export async function addAvatarToVideo(
  videoPath: string,
  options: AvatarOptions
): Promise<AvatarResult> {
  // If avatar not enabled, return original video
  if (!options.enabled) {
    return {
      hasAvatar: false,
      finalVideoPath: videoPath,
      avatarCost: 0
    };
  }

  // Validate required fields
  if (!options.avatarImage) {
    console.warn('[Avatar] Avatar enabled but no image provided, skipping');
    return {
      hasAvatar: false,
      finalVideoPath: videoPath,
      avatarCost: 0
    };
  }

  if (!options.audioFile) {
    console.warn('[Avatar] Avatar enabled but no audio provided, skipping');
    return {
      hasAvatar: false,
      finalVideoPath: videoPath,
      avatarCost: 0
    };
  }

  console.log('[Avatar Helper] Adding avatar to video...');
  console.log(`   Video: ${videoPath}`);
  console.log(`   Avatar: ${options.avatarImage}`);
  console.log(`   Audio: ${options.audioFile}`);

  try {
    // Step 1: Generate avatar video
    const avatarService = new AvatarService(
      options.provider || 'a2e',
      undefined,
      'output/avatars'
    );

    // Check if configured
    if (!avatarService.isConfigured()) {
      console.warn('[Avatar Helper] Avatar service not configured, skipping');
      return {
        hasAvatar: false,
        finalVideoPath: videoPath,
        avatarCost: 0
      };
    }

    console.log('[Avatar Helper] Generating avatar video...');
    const avatarResult = await avatarService.generateAvatar({
      avatarImage: options.avatarImage,
      audioFile: options.audioFile,
      quality: options.quality || 'standard',
      fps: options.fps || 30,
      provider: options.provider || 'a2e'
    });

    console.log(`[Avatar Helper] Avatar generated: ${avatarResult.videoPath}`);
    console.log(`[Avatar Helper] Cost: $${avatarResult.cost.toFixed(3)}`);

    // Step 2: Composite avatar onto video
    console.log('[Avatar Helper] Compositing avatar onto video...');
    const compositor = new AvatarCompositor(path.dirname(videoPath));

    const compositeResult = await compositor.createPictureInPicture(
      videoPath,
      avatarResult.videoPath,
      {
        position: options.position || 'top-right',
        scale: options.scale || 0.2,
        addBorder: options.addBorder !== false,
        outputPath: videoPath.replace(/\.mp4$/, '_with_avatar.mp4')
      }
    );

    console.log(`[Avatar Helper] Compositing complete: ${compositeResult.videoPath}`);

    return {
      hasAvatar: true,
      avatarVideoPath: avatarResult.videoPath,
      finalVideoPath: compositeResult.videoPath,
      avatarCost: avatarResult.cost,
      avatarDuration: avatarResult.duration
    };
  } catch (error: any) {
    console.error('[Avatar Helper] Failed to add avatar:', error.message);
    // Return original video if avatar fails
    return {
      hasAvatar: false,
      finalVideoPath: videoPath,
      avatarCost: 0
    };
  }
}

/**
 * Get estimated cost for avatar
 */
export function estimateAvatarCost(
  durationSeconds: number,
  provider: AvatarProvider = 'a2e'
): number {
  const avatarService = new AvatarService(provider);
  return avatarService.getEstimatedCost(durationSeconds);
}

/**
 * Check if avatar feature is available
 */
export function isAvatarAvailable(provider: AvatarProvider = 'a2e'): boolean {
  try {
    const avatarService = new AvatarService(provider);
    return avatarService.isConfigured();
  } catch {
    return false;
  }
}

/**
 * Get avatar provider info
 */
export function getAvatarProviderInfo(provider: AvatarProvider = 'a2e') {
  const avatarService = new AvatarService(provider);
  return avatarService.getProviderInfo();
}

/**
 * Parse avatar options from request body
 */
export function parseAvatarOptions(body: any, defaultEnabled: boolean = false): AvatarOptions {
  return {
    enabled: body.avatar?.enabled ?? body.avatarEnabled ?? defaultEnabled,
    avatarImage: body.avatar?.image ?? body.avatarImage,
    audioFile: body.avatar?.audio ?? body.audioFile,
    provider: body.avatar?.provider ?? body.avatarProvider ?? 'a2e',
    quality: body.avatar?.quality ?? body.avatarQuality ?? 'standard',
    fps: body.avatar?.fps ?? body.avatarFps ?? 30,
    position: body.avatar?.position ?? body.avatarPosition ?? 'top-right',
    scale: body.avatar?.scale ?? body.avatarScale ?? 0.2,
    addBorder: body.avatar?.addBorder ?? body.avatarAddBorder ?? true,
    borderColor: body.avatar?.borderColor ?? body.avatarBorderColor ?? 'white'
  };
}

/**
 * Create avatar options from uploaded file
 */
export async function createAvatarOptionsFromUpload(
  file: Express.Multer.File | undefined,
  audioPath: string,
  options: Partial<AvatarOptions> = {}
): Promise<AvatarOptions | null> {
  if (!file) {
    return null;
  }

  // Save uploaded file temporarily
  const tempImagePath = `/tmp/avatar_${Date.now()}.${file.mimetype.split('/')[1]}`;
  await fs.writeFile(tempImagePath, file.buffer);

  return {
    enabled: true,
    avatarImage: tempImagePath,
    audioFile: audioPath,
    provider: options.provider || 'a2e',
    quality: options.quality || 'standard',
    fps: options.fps || 30,
    position: options.position || 'top-right',
    scale: options.scale || 0.2,
    addBorder: options.addBorder !== false,
    borderColor: options.borderColor || 'white'
  };
}

/**
 * Cleanup temporary avatar files
 */
export async function cleanupAvatarTemp(imagePath?: string): Promise<void> {
  if (imagePath && imagePath.startsWith('/tmp/avatar_')) {
    try {
      await fs.unlink(imagePath);
      console.log('[Avatar Helper] Cleaned up temp file:', imagePath);
    } catch (error) {
      // Ignore cleanup errors
    }
  }
}

export default {
  addAvatarToVideo,
  estimateAvatarCost,
  isAvatarAvailable,
  getAvatarProviderInfo,
  parseAvatarOptions,
  createAvatarOptionsFromUpload,
  cleanupAvatarTemp
};
