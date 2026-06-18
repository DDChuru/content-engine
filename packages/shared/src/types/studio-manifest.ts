/**
 * Content Studio Pipeline Types
 *
 * Manifest-driven video production where narration timing drives visual sync.
 * Pipeline: /storyboard → /script → Record/TTS → /transcribe → /render
 */

// ============================================================================
// Core Transcript Types (matching Whisper output format)
// ============================================================================

export interface WordTiming {
  word: string;
  start: number;  // seconds
  end: number;    // seconds
}

export interface TranscriptSegment {
  id: number;
  start: number;  // seconds
  end: number;    // seconds
  text: string;
  words: WordTiming[];
}

export interface TranscriptData {
  slide: number;
  duration: number;  // total duration in seconds
  text: string;      // full transcript text
  segments: TranscriptSegment[];
}

// ============================================================================
// Cue Points - Visual sync triggers from narration
// ============================================================================

export interface CuePoint {
  id: string;           // e.g., 'foodSafety', 'platformOverview'
  keyword: string;      // word/phrase to match in transcript
  timestamp?: number;   // resolved timestamp (set by /transcribe)
  action: CueAction;    // what to trigger when this cue is reached
}

export type CueAction =
  | { type: 'fadeIn'; target: string; duration?: number }
  | { type: 'slideIn'; target: string; direction: 'left' | 'right' | 'top' | 'bottom'; duration?: number }
  | { type: 'reveal'; target: string }
  | { type: 'highlight'; target: string; color?: string }
  | { type: 'showImage'; src: string; position?: 'full' | 'left' | 'right' | 'center' }
  | { type: 'showDashboard'; src: string }
  | { type: 'custom'; handler: string; params?: Record<string, any> };

// ============================================================================
// Slide Manifest - Per-slide content and timing
// ============================================================================

export interface SlideManifest {
  slideNum: number;
  title: string;

  // Content
  narration: {
    text: string;           // Full narration script
    speakerNotes?: string;  // Additional context for narrator
    cueMarkers: string[];   // Keywords marked in script for cue generation
  };

  // Visual elements
  visuals: {
    background?: string;           // Image path or gradient
    elements: SlideElement[];      // Text, images, charts to animate
  };

  // Timing (populated by /transcribe)
  timing?: {
    duration: number;              // Total slide duration (from audio)
    audioFile: string;             // Path to audio file
    transcript?: TranscriptData;   // Full transcript with word timings
    cues: ResolvedCue[];           // Cues with resolved timestamps
  };
}

export interface SlideElement {
  id: string;
  type: 'text' | 'image' | 'chart' | 'bullet' | 'icon' | 'dashboard';
  content: string;           // Text content or image path
  style?: Record<string, any>;
  position?: { x: number; y: number; width?: number; height?: number };
  cueId?: string;            // Which cue triggers this element
}

export interface ResolvedCue extends CuePoint {
  timestamp: number;  // Guaranteed to be resolved
  frame?: number;     // Frame number at 30fps
}

// ============================================================================
// Project Manifest - Full project state
// ============================================================================

export type PhaseStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface PhaseInfo {
  status: PhaseStatus;
  startedAt?: string;
  completedAt?: string;
  error?: string;
  output?: Record<string, any>;
}

export interface StudioProjectManifest {
  // Identification
  id: string;
  slug: string;           // URL-safe identifier
  name: string;
  description?: string;

  // Metadata
  createdAt: string;
  updatedAt: string;
  createdBy?: string;

  // Project settings
  settings: {
    fps: number;           // Default 30
    resolution: { width: number; height: number };  // Default 1920x1080
    aspectRatio: '16:9' | '9:16' | '4:3' | '1:1';
    theme?: string;        // Theme name or path
    voiceId?: string;      // ElevenLabs voice ID for TTS
  };

  // Pipeline phases
  phases: {
    storyboard: PhaseInfo & {
      output?: {
        slides: number;
        approved: boolean;
        playgroundUrl?: string;
      };
    };
    script: PhaseInfo & {
      output?: {
        slides: number;
        totalWords: number;
        estimatedDuration: number;  // seconds
      };
    };
    recording: PhaseInfo & {
      output?: {
        method: 'manual' | 'tts' | 'clone';
        slidesRecorded: number;
        totalDuration: number;  // seconds
      };
    };
    transcription: PhaseInfo & {
      output?: {
        slidesTranscribed: number;
        cuesResolved: number;
        totalDuration: number;  // seconds
      };
    };
    render: PhaseInfo & {
      output?: {
        videoPath: string;
        duration: number;  // seconds
        fileSize: number;  // bytes
      };
    };
  };

  // Content
  slides: SlideManifest[];

  // File paths (relative to project directory)
  paths: {
    root: string;           // e.g., 'projects/product-launch-2024/'
    storyboard: string;     // 'storyboard/'
    script: string;         // 'script/'
    audio: string;          // 'audio/'
    transcripts: string;    // 'transcripts/'
    visuals: string;        // 'visuals/'
    output: string;         // 'output/'
  };
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateProjectRequest {
  name: string;
  description?: string;
  settings?: Partial<StudioProjectManifest['settings']>;
}

export interface CreateProjectResponse {
  success: boolean;
  project: StudioProjectManifest;
  paths: {
    manifest: string;
    root: string;
  };
}

export interface UpdatePhaseRequest {
  phase: keyof StudioProjectManifest['phases'];
  status: PhaseStatus;
  output?: Record<string, any>;
  error?: string;
}

export interface TranscribeRequest {
  audioFiles?: string[];  // Specific files, or all in audio/ dir
  model?: 'whisper-1';    // Whisper model
}

export interface TranscribeResponse {
  success: boolean;
  transcribed: number;
  failed: number;
  results: Array<{
    slideNum: number;
    duration: number;
    transcript: TranscriptData;
    cuesResolved: number;
  }>;
  errors?: Array<{
    slideNum: number;
    error: string;
  }>;
}

// ============================================================================
// Utility Types
// ============================================================================

export interface FindWordResult {
  found: boolean;
  word?: WordTiming;
  timestamp?: number;
  segmentId?: number;
}

/**
 * Helper function type for finding word timestamps in transcripts
 */
export type FindWordTimestamp = (
  transcript: TranscriptData,
  keyword: string,
  options?: { fuzzy?: boolean; afterTimestamp?: number }
) => FindWordResult;
