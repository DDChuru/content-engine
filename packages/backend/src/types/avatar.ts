/**
 * Avatar Service Types
 *
 * Types for AI-powered lip-sync avatar generation
 * Supporting multiple providers: A2E.ai, HeyGen, Infinity AI, Wav2Lip
 */

export type AvatarProvider = 'a2e' | 'heygen' | 'infinity' | 'wav2lip';

export type AvatarQuality = 'standard' | 'high' | 'ultra';

export type AvatarPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export interface AvatarConfig {
  /** Path or URL to avatar image */
  avatarImage: string;

  /** Path or URL to audio file for lip-sync */
  audioFile: string;

  /** Quality level for generation */
  quality?: AvatarQuality;

  /** Frames per second (24, 30, or 60) */
  fps?: number;

  /** Avatar provider to use */
  provider?: AvatarProvider;
}

export interface AvatarResult {
  /** URL to generated avatar video */
  videoUrl: string;

  /** Local path to downloaded video */
  videoPath: string;

  /** Duration in seconds */
  duration: number;

  /** Cost in USD */
  cost: number;

  /** Provider used */
  provider: AvatarProvider;

  /** Timestamp of generation */
  timestamp: number;
}

export interface AvatarJob {
  /** Unique job ID from provider */
  jobId: string;

  /** Current status */
  status: 'created' | 'processing' | 'completed' | 'failed';

  /** Progress percentage (0-100) */
  progress?: number;

  /** Estimated time remaining in seconds */
  estimatedTime?: number;

  /** Error message if failed */
  error?: string;

  /** Result URL when completed */
  resultUrl?: string;
}

export interface CompositeConfig {
  /** Main video path (Manim animation) */
  mainVideo: string;

  /** Avatar video path */
  avatarVideo: string;

  /** Position on screen */
  position: AvatarPosition;

  /** Scale factor (0.1 - 0.5) */
  scale: number;

  /** Output path for composite video */
  outputPath?: string;

  /** Add border around avatar */
  addBorder?: boolean;

  /** Border color (default: white) */
  borderColor?: string;
}

export interface CompositeResult {
  /** Path to composite video */
  videoPath: string;

  /** Duration in seconds */
  duration: number;

  /** File size in bytes */
  fileSize: number;
}

// A2E.ai specific types
export interface A2EUploadResponse {
  url: string;
  id: string;
  duration?: number;
}

export interface A2ELipSyncRequest {
  avatar: string;
  audio: string;
  quality: AvatarQuality;
  fps: number;
}

export interface A2ELipSyncResponse {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  estimated_time?: number;
  progress?: number;
  video_url?: string;
  duration?: number;
  cost?: number;
}

// HeyGen specific types
export interface HeyGenAvatarRequest {
  avatar_id?: string;
  avatar_url?: string;
  audio_url: string;
  quality?: AvatarQuality;
}

export interface HeyGenAvatarResponse {
  video_id: string;
  status: string;
  video_url?: string;
  error?: string;
}

// Infinity AI specific types (to be defined when API is available)
export interface InfinityAIRequest {
  avatar: string;
  audio: string;
}

export interface InfinityAIResponse {
  video_url: string;
  status: string;
}
