/**
 * Remotion Video Configuration
 *
 * Defines video specifications for the AI Video Director output
 */

export const VIDEO_CONFIG = {
  // Video dimensions (1080p)
  width: 1920,
  height: 1080,

  // Frame rate
  fps: 30,

  // Default duration per scene (in seconds)
  defaultSceneDuration: 5,

  // Transition duration (in frames)
  transitionDuration: 15, // 0.5 seconds at 30fps

  // Audio settings
  audio: {
    sampleRate: 48000,
    channels: 2,
  },

  // Text overlay settings
  text: {
    titleFont: 'Inter, sans-serif',
    bodyFont: 'Inter, sans-serif',
    titleSize: 72,
    subtitleSize: 36,
    captionSize: 24,
  },

  // Colors
  colors: {
    primary: '#6366f1', // Indigo
    secondary: '#8b5cf6', // Purple
    accent: '#ec4899', // Pink
    background: '#1e1b4b', // Dark indigo
    text: '#ffffff',
    textSecondary: '#e0e7ff',
  },
};

export type VideoConfig = typeof VIDEO_CONFIG;
