/**
 * TikTok Multilingual Pipeline - Service Exports
 *
 * Central export point for all TikTok video processing services
 */

// Core Services
export { MomentAnalyzer } from './moment-analyzer.js';
export { TranslationService, getTranslationService, resetTranslationService } from './translation.js';
export { VerticalConverter, verticalConverter } from './vertical-converter.js';
export { CTAOverlay, ctaOverlay } from './cta-overlay.js';
export { BatchRenderer, getBatchRenderer, resetBatchRenderer } from './batch-renderer.js';

// Type Definitions
export type {
  // Moment Analysis
  Moment,
  Frame,
  Transcript,
  TranscriptSegment,
  AnalysisCriteria,
  MomentAnalysisResult,
  ExtractionConfig,
  ClipExtractionOptions,

  // Styling & Configuration
  CaptionStyle,
  CTAConfig,

  // Batch Processing
  BatchConfig,
  TikTokVideo,
  TikTokBatch,
  BatchError,
  TranscriptionSegment,
  AudioTranscription,
  SupportedLanguage,
} from './types.js';

export { SUPPORTED_LANGUAGES } from './types.js';

// Translation Types
export type {
  LanguageConfig,
  TranslationResult,
  TranslationError,
  BatchTranslationResult,
} from './translation.js';

// Vertical Converter Types
export type {
  ConversionStyle,
  ConversionConfig,
  VideoInfo,
} from './vertical-converter.js';

// CTA Overlay Types
export type {
  CTAConfig as CTAConfigBase,
  AnimatedCTAConfig,
} from './cta-overlay.js';
