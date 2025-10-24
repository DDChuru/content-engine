/**
 * TikTok Multilingual Pipeline - Shared Types
 * Types used across TikTok video processing services
 */

/**
 * Represents a potential viral moment in a video
 */
export interface Moment {
  index: number;
  startTime: number;
  endTime: number;
  duration: number;
  hook: string;
  keyMessage: string;
  viralPotential: number; // 1-10 scale
  caption: string;
}

/**
 * Represents a video frame with timestamp
 */
export interface Frame {
  timestamp: number;
  base64?: string;
}

/**
 * Represents a video transcript with segments
 */
export interface Transcript {
  text: string;
  segments: TranscriptSegment[];
}

/**
 * Represents a segment of transcribed audio
 */
export interface TranscriptSegment {
  id: number;
  start: number;
  end: number;
  text: string;
}

/**
 * Analysis criteria for moment selection
 */
export interface AnalysisCriteria {
  hookDuration: number; // seconds for hook (default: 3)
  minViralScore: number; // minimum viral potential score (default: 6)
  requiresSelfContained: boolean; // must make sense standalone
  emotionalEngagement: boolean; // must be emotionally engaging
}

/**
 * Result from moment analysis
 */
export interface MomentAnalysisResult {
  moments: Moment[];
  totalDuration: number;
  framesAnalyzed: number;
  transcriptLength: number;
  processingTime: number; // milliseconds
}

/**
 * Configuration for moment extraction
 */
export interface ExtractionConfig {
  videoPath: string;
  count: number; // number of moments to find
  duration: number; // desired duration of each moment in seconds
  frameInterval?: number; // seconds between frames (default: 2)
  criteria?: Partial<AnalysisCriteria>;
}

/**
 * Options for clip extraction
 */
export interface ClipExtractionOptions {
  outputPath: string;
  format?: string; // default: 'mp4'
  codec?: string; // default: 'libx264'
  audioBitrate?: string; // default: '128k'
  videoBitrate?: string; // default: '2000k'
}

/**
 * Caption styling options
 */
export interface CaptionStyle {
  fontFamily?: string;
  fontSize?: number;
  fontColor?: string;
  backgroundColor?: string;
  position?: 'top' | 'center' | 'bottom';
  animation?: 'none' | 'fade' | 'slide' | 'pop';
  outline?: boolean;
  outlineColor?: string;
}

/**
 * Call-to-Action overlay configuration
 */
export interface CTAConfig {
  text: string;
  position?: 'top' | 'bottom';
  duration?: number;  // Seconds to display at end
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
}

/**
 * Batch rendering configuration
 */
export interface BatchConfig {
  videoPath: string;
  moments: Moment[];
  languages: string[];
  voiceId: string;
  outputDir?: string;
  captionStyle?: CaptionStyle;
  ctaConfig?: CTAConfig;
}

/**
 * Rendered TikTok video information
 */
export interface TikTokVideo {
  momentIndex: number;
  language: string;
  path: string;
  caption: string;
  duration: number;
  size: number;  // File size in bytes
}

/**
 * Batch rendering result
 */
export interface TikTokBatch {
  videos: TikTokVideo[];
  totalCount: number;
  totalCost: number;
  costPerVideo: number;
  processingTime: number; // Seconds
  errors?: BatchError[];
}

/**
 * Batch processing error
 */
export interface BatchError {
  momentIndex: number;
  language: string;
  error: string;
  timestamp: Date;
}

/**
 * Audio transcription segment
 */
export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}

/**
 * Audio transcription result
 */
export interface AudioTranscription {
  segments: TranscriptionSegment[];
  duration: number;
  language: string;
}

/**
 * Language code mapping for ElevenLabs multilingual model
 */
export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', voice: 'en-US', region: 'United States' },
  { code: 'sn', name: 'Shona', voice: 'en-US', region: 'Zimbabwe' },
  { code: 'es', name: 'Spanish', voice: 'es-ES', region: 'Spain' },
  { code: 'pt', name: 'Portuguese', voice: 'pt-BR', region: 'Brazil' },
  { code: 'fr', name: 'French', voice: 'fr-FR', region: 'France' },
  { code: 'zu', name: 'Zulu', voice: 'en-ZA', region: 'South Africa' },
  { code: 'sw', name: 'Swahili', voice: 'en-KE', region: 'East Africa' },
  { code: 'af', name: 'Afrikaans', voice: 'en-ZA', region: 'South Africa' },
  { code: 'xh', name: 'Xhosa', voice: 'en-ZA', region: 'South Africa' },
  { code: 'yo', name: 'Yoruba', voice: 'en-NG', region: 'Nigeria' },
];

export type SupportedLanguage = 'en' | 'sn' | 'es' | 'pt' | 'fr' | 'zu' | 'sw' | 'af' | 'xh' | 'yo';

/**
 * Default caption style configuration
 */
export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  fontFamily: 'Montserrat',
  fontSize: 48,
  fontColor: '#FFFFFF',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  position: 'bottom',
  animation: 'pop',
  outline: true,
  outlineColor: '#000000',
};

/**
 * Default CTA configuration
 */
export const DEFAULT_CTA_CONFIG: CTAConfig = {
  text: 'Follow for more!',
  position: 'bottom',
  duration: 2,
  backgroundColor: '#FF0050',
  textColor: '#FFFFFF',
  fontSize: 36,
};

/**
 * Translation Service Types
 */

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
 * Language detection result
 */
export interface LanguageDetectionResult {
  language: string;
  confidence: number;
}

/**
 * Cost estimation result
 */
export interface CostEstimation {
  totalCharacters: number;
  estimatedCost: number;
  breakdown: any; // Flexible breakdown structure
}

/**
 * Cache statistics
 */
export interface CacheStats {
  size: number;
  keys: string[];
}

/**
 * Translation options
 */
export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  useCache?: boolean;
}

/**
 * Batch translation options
 */
export interface BatchTranslationOptions {
  texts: string[];
  languages: string[];
  onProgress?: (progress: number, language: string) => void;
  useCache?: boolean;
}

/**
 * Supported language codes for translation
 */
export type SupportedLanguageCode =
  | 'en'  // English
  | 'sn'  // Shona
  | 'es'  // Spanish
  | 'pt'  // Portuguese
  | 'fr'  // French
  | 'zu'  // Zulu
  | 'sw'  // Swahili
  | 'af'  // Afrikaans
  | 'xh'  // Xhosa
  | 'yo'; // Yoruba

/**
 * ElevenLabs voice locales
 */
export type VoiceLocale =
  | 'en-US'
  | 'en-ZA'
  | 'en-KE'
  | 'en-NG'
  | 'es-ES'
  | 'pt-BR'
  | 'fr-FR';

/**
 * Translation service configuration
 */
export interface TranslationServiceConfig {
  apiKey?: string;
  cacheEnabled?: boolean;
  maxCacheSize?: number;
  defaultSourceLanguage?: string;
}

/**
 * Language pair for translation
 */
export interface LanguagePair {
  source: SupportedLanguageCode;
  target: SupportedLanguageCode;
}

/**
 * Translation metadata
 */
export interface TranslationMetadata {
  timestamp: number;
  cached: boolean;
  processingTime?: number;
  characterCount: number;
}

/**
 * Extended translation result with metadata
 */
export interface ExtendedTranslationResult extends TranslationResult {
  metadata: TranslationMetadata;
}

/**
 * Multilingual content package
 */
export interface MultilingualContent {
  originalLanguage: string;
  originalText: string;
  translations: Map<string, string>;
  voiceLocales: Map<string, string>;
  metadata: {
    createdAt: number;
    totalCharacters: number;
    languageCount: number;
  };
}

/**
 * TikTok script segment
 */
export interface TikTokScriptSegment {
  id: string;
  text: string;
  duration?: number;
  translations?: Map<string, string>;
}

/**
 * TikTok multilingual script
 */
export interface TikTokMultilingualScript {
  id: string;
  title: string;
  segments: TikTokScriptSegment[];
  languages: SupportedLanguageCode[];
  createdAt: number;
}

/**
 * Translation queue item
 */
export interface TranslationQueueItem {
  id: string;
  text: string;
  targetLanguage: SupportedLanguageCode;
  priority?: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: TranslationResult;
  error?: string;
}

/**
 * Batch translation job
 */
export interface BatchTranslationJob {
  id: string;
  texts: string[];
  languages: SupportedLanguageCode[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  results?: BatchTranslationResult;
  createdAt: number;
  completedAt?: number;
}

/**
 * ElevenLabs Service Types
 */

/**
 * Voice settings for ElevenLabs TTS
 */
export interface VoiceSettings {
  stability: number;           // 0-1, higher = more stable
  similarity_boost: number;    // 0-1, higher = more similar to original voice
  style?: number;              // 0-1, style exaggeration
  use_speaker_boost?: boolean; // Enable speaker boost
}

/**
 * Audio generation options
 */
export interface AudioGenerationOptions {
  model_id?: string;           // Model to use (default: eleven_multilingual_v2)
  language_code?: VoiceLocale; // Language locale
  stability?: number;
  similarity_boost?: number;
  style?: number;
  use_speaker_boost?: boolean;
}

/**
 * Audio generation result
 */
export interface AudioGenerationResult {
  audioBuffer: Buffer;
  characterCount: number;
  duration: number;
  voiceId: string;
  model: string;
  processingTime: number;
  cost: number;
}

/**
 * Batch audio generation options
 */
export interface BatchAudioGenerationOptions {
  texts: string[];
  voiceId: string;
  language_code?: VoiceLocale;
  voiceSettings?: Partial<VoiceSettings>;
  onProgress?: (current: number, total: number, currentText: string) => void;
}

/**
 * Batch audio generation result
 */
export interface BatchAudioGenerationResult {
  results: AudioGenerationResult[];
  errors: Array<{ index: number; text: string; error: string }>;
  totalCharacters: number;
  totalCost: number;
  processingTime: number;
  successCount: number;
  errorCount: number;
}

/**
 * Voice clone options
 */
export interface VoiceCloneOptions {
  name: string;
  audioFiles: Array<string | Buffer>;
  description?: string;
}

/**
 * Voice clone result
 */
export interface VoiceCloneResult {
  voiceId: string;
  name: string;
  description?: string;
  createdAt: Date;
}
