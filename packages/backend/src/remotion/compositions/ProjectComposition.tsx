/**
 * Project Composition — Manifest-Driven Video Production
 *
 * Generic composition that reads from a project manifest and renders
 * slides with cue-driven visual sync based on transcript timestamps.
 *
 * Usage:
 *   npx remotion render ProjectComposition \
 *     --props='{"projectId":"product-launch-2024"}' \
 *     --output=output/product-launch-2024.mp4
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  getInputProps,
} from 'remotion';
import type {
  StudioProjectManifest,
  SlideManifest,
  TranscriptData,
  ResolvedCue,
  CueAction,
} from 'shared/types';

// ============================================================================
// Props & Types
// ============================================================================

export interface ProjectCompositionProps {
  projectId: string;
  manifest?: StudioProjectManifest;  // Can be passed directly or loaded
  audioEnabled?: boolean;
  theme?: ProjectTheme;
}

export interface ProjectTheme {
  colors: {
    background: string;
    text: string;
    accent: string;
    primary: string;
    secondary: string;
  };
  typography: {
    fontFamily: string;
    titleSize: number;
    bodySize: number;
  };
}

// Default theme (can be overridden)
const defaultTheme: ProjectTheme = {
  colors: {
    background: '#0a0a0a',
    text: '#ffffff',
    accent: '#4ade80',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    titleSize: 64,
    bodySize: 24,
  },
};

// ============================================================================
// Utility Hooks (from EcowizePitchFull.tsx)
// ============================================================================

/**
 * Hook to animate elements based on cue timestamps
 * Returns opacity (0-1) and isActive flag
 */
export function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return { opacity, isActive: frame >= cueFrame };
}

/**
 * Hook for spring animations triggered at cue timestamps
 */
export function useCueSpring(
  cueTimeSeconds: number,
  config = { damping: 20, stiffness: 180 }
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, delay: cueTimeSeconds * fps, config });
}

/**
 * Hook to get current cue state from resolved cues
 */
export function useCurrentCue(cues: ResolvedCue[]) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find the most recent cue that has passed
  let activeCue: ResolvedCue | null = null;
  for (const cue of cues) {
    if (cue.timestamp <= currentTime) {
      activeCue = cue;
    }
  }

  return { activeCue, currentTime };
}

// ============================================================================
// Reusable Visual Components
// ============================================================================

/**
 * Ken Burns effect on background images
 */
const KenBurns: React.FC<{
  src: string;
  opacity?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
}> = ({ src, opacity = 0.65, zoomFrom = 1.0, zoomTo = 1.12, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const tx = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ty = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
      }}
    />
  );
};

/**
 * Animated text element with cue support
 */
const CuedText: React.FC<{
  text: string;
  cueTime: number;
  style?: React.CSSProperties;
  animationType?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'scale';
}> = ({ text, cueTime, style, animationType = 'fadeIn' }) => {
  const { opacity } = useCue(cueTime);

  let transform = '';
  switch (animationType) {
    case 'slideUp':
      transform = `translateY(${(1 - opacity) * 30}px)`;
      break;
    case 'slideLeft':
      transform = `translateX(${(1 - opacity) * -30}px)`;
      break;
    case 'scale':
      transform = `scale(${0.9 + opacity * 0.1})`;
      break;
    default:
      transform = '';
  }

  return (
    <div
      style={{
        opacity,
        transform,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Bullet list with sequential cue reveals
 */
const CuedBulletList: React.FC<{
  items: Array<{ text: string; cueTime: number }>;
  theme: ProjectTheme;
}> = ({ items, theme }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {items.map((item, index) => {
        const { opacity } = useCue(item.cueTime);
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 16,
              opacity,
              transform: `translateX(${(1 - opacity) * 20}px)`,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: theme.colors.accent,
                marginTop: 8,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                fontSize: theme.typography.bodySize,
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                lineHeight: 1.5,
              }}
            >
              {item.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ============================================================================
// Slide Renderer
// ============================================================================

interface SlideRendererProps {
  slide: SlideManifest;
  theme: ProjectTheme;
  audioEnabled: boolean;
  projectPath: string;
}

const SlideRenderer: React.FC<SlideRendererProps> = ({
  slide,
  theme,
  audioEnabled,
  projectPath,
}) => {
  const { fps } = useVideoConfig();
  const cues = slide.timing?.cues || [];

  // Get first cue for title animation (or default to 0)
  const titleCueTime = cues.length > 0 ? cues[0].timestamp : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Background image if specified */}
      {slide.visuals.background && (
        <KenBurns
          src={`${projectPath}/visuals/${slide.visuals.background}`}
          opacity={0.4}
        />
      )}

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${theme.colors.background}ee 0%, ${theme.colors.background}88 100%)`,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: 80,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        {/* Title */}
        <CuedText
          text={slide.title}
          cueTime={titleCueTime}
          animationType="slideUp"
          style={{
            fontSize: theme.typography.titleSize,
            fontWeight: 700,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            lineHeight: 1.1,
            maxWidth: 1200,
            marginBottom: 40,
          }}
        />

        {/* Visual elements */}
        {slide.visuals.elements.map((element) => {
          const elementCue = cues.find((c) => c.id === element.cueId);
          const cueTime = elementCue?.timestamp || 0;

          switch (element.type) {
            case 'text':
              return (
                <CuedText
                  key={element.id}
                  text={element.content}
                  cueTime={cueTime}
                  animationType="slideUp"
                  style={{
                    fontSize: theme.typography.bodySize,
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily,
                    maxWidth: 900,
                    lineHeight: 1.6,
                    ...element.style,
                  }}
                />
              );

            case 'bullet':
              // Parse bullets from content (newline-separated)
              const bulletItems = element.content.split('\n').map((text, i) => ({
                text,
                cueTime: cueTime + i * 0.5, // Stagger by 0.5s
              }));
              return (
                <div key={element.id} style={{ marginTop: 30 }}>
                  <CuedBulletList items={bulletItems} theme={theme} />
                </div>
              );

            case 'image':
              const { opacity } = useCue(cueTime);
              return (
                <div
                  key={element.id}
                  style={{
                    opacity,
                    transform: `scale(${0.95 + opacity * 0.05})`,
                    marginTop: 40,
                  }}
                >
                  <Img
                    src={staticFile(`${projectPath}/visuals/${element.content}`)}
                    style={{
                      maxWidth: '100%',
                      maxHeight: 500,
                      borderRadius: 16,
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {/* Audio */}
      {audioEnabled && slide.timing?.audioFile && (
        <Audio src={staticFile(`${projectPath}/${slide.timing.audioFile}`)} />
      )}
    </AbsoluteFill>
  );
};

// ============================================================================
// Main Composition
// ============================================================================

export const ProjectComposition: React.FC<ProjectCompositionProps> = ({
  projectId,
  manifest,
  audioEnabled = true,
  theme = defaultTheme,
}) => {
  const { fps } = useVideoConfig();

  // Calculate slide timings
  const slideSequences = useMemo(() => {
    if (!manifest) return [];

    let frameOffset = 0;
    return manifest.slides.map((slide) => {
      const durationSeconds = slide.timing?.duration || 30;
      const durationFrames = Math.ceil(durationSeconds * fps);
      const sequence = {
        slide,
        from: frameOffset,
        durationInFrames: durationFrames,
      };
      frameOffset += durationFrames;
      return sequence;
    });
  }, [manifest, fps]);

  if (!manifest) {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: theme.colors.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: theme.colors.text,
            fontSize: 32,
            fontFamily: theme.typography.fontFamily,
          }}
        >
          Loading project: {projectId}
        </div>
      </AbsoluteFill>
    );
  }

  const projectPath = `projects/${manifest.slug}`;

  return (
    <AbsoluteFill>
      {slideSequences.map(({ slide, from, durationInFrames }) => (
        <Sequence
          key={slide.slideNum}
          from={from}
          durationInFrames={durationInFrames}
          name={`Slide ${slide.slideNum}: ${slide.title}`}
        >
          <SlideRenderer
            slide={slide}
            theme={theme}
            audioEnabled={audioEnabled}
            projectPath={projectPath}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ============================================================================
// Duration Calculator
// ============================================================================

export function getProjectDuration(
  manifest: StudioProjectManifest | null,
  fps: number
): number {
  if (!manifest || manifest.slides.length === 0) {
    return 30 * fps; // Default 30 seconds
  }

  const totalSeconds = manifest.slides.reduce((sum, slide) => {
    return sum + (slide.timing?.duration || 30);
  }, 0);

  return Math.ceil(totalSeconds * fps);
}

// ============================================================================
// Calculate Metadata (for dynamic duration)
// ============================================================================

export const calculateProjectMetadata = async ({
  props,
}: {
  props: ProjectCompositionProps;
}) => {
  const fps = 30;
  const durationInFrames = getProjectDuration(props.manifest || null, fps);

  return {
    fps,
    durationInFrames,
    width: props.manifest?.settings.resolution.width || 1920,
    height: props.manifest?.settings.resolution.height || 1080,
  };
};

export default ProjectComposition;
