/**
 * TikTok Story Composition
 *
 * Combines Veo-generated video clips with animated text overlays,
 * hooks, and captions for vertical short-form content.
 *
 * Features:
 * - 9:16 vertical format (1080x1920)
 * - Animated hook text at key moments
 * - Caption overlays
 * - Smooth transitions between clips
 * - Call-to-action ending
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Video,
  Img,
  Audio,
} from 'remotion';

// Hook text component with dramatic animation
const HookText: React.FC<{
  text: string;
  style?: 'bold-white' | 'gold-gradient' | 'glitch';
}> = ({ text, style = 'bold-white' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Typewriter effect
  const charsToShow = Math.floor(
    interpolate(frame, [0, fps * 1.5], [0, text.length], {
      extrapolateRight: 'clamp',
    })
  );

  // Scale in animation
  const scale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });

  // Glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [20, 40]
  );

  const baseStyle: React.CSSProperties = {
    fontFamily: '"Bebas Neue", "Impact", sans-serif',
    fontSize: 72,
    fontWeight: 900,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    padding: '0 40px',
    transform: `scale(${scale})`,
  };

  const styles: Record<string, React.CSSProperties> = {
    'bold-white': {
      ...baseStyle,
      color: '#FFFFFF',
      textShadow: `0 0 ${glowIntensity}px rgba(255,255,255,0.8), 0 4px 20px rgba(0,0,0,0.9)`,
    },
    'gold-gradient': {
      ...baseStyle,
      background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: `drop-shadow(0 0 ${glowIntensity}px rgba(255,215,0,0.6))`,
    },
    'glitch': {
      ...baseStyle,
      color: '#FFFFFF',
      textShadow: `2px 0 #ff0000, -2px 0 #00ffff, 0 4px 20px rgba(0,0,0,0.9)`,
    },
  };

  return (
    <div style={styles[style]}>
      {text.substring(0, charsToShow)}
      {charsToShow < text.length && (
        <span style={{ opacity: frame % 10 < 5 ? 1 : 0 }}>|</span>
      )}
    </div>
  );
};

// Caption overlay component
const CaptionOverlay: React.FC<{
  text: string;
  position?: 'top' | 'center' | 'bottom';
}> = ({ text, position = 'bottom' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideUp = interpolate(frame, [0, fps * 0.3], [50, 0], {
    extrapolateRight: 'clamp',
  });

  const opacity = interpolate(frame, [0, fps * 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { top: 100 },
    center: { top: '50%', transform: 'translateY(-50%)' },
    bottom: { bottom: 200 },
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        ...positionStyles[position],
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${slideUp}px)`,
      }}
    >
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '16px 32px',
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        }}
      >
        <span
          style={{
            fontFamily: '"Inter", "SF Pro", sans-serif',
            fontSize: 36,
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

// Video clip with crossfade transition
const VideoClip: React.FC<{
  src: string;
  transitionDuration?: number;
}> = ({ src, transitionDuration = 15 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in at start
  const fadeIn = interpolate(frame, [0, transitionDuration], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - transitionDuration, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
    }
  );

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
      <Video
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </AbsoluteFill>
  );
};

// Call-to-action component
const CallToAction: React.FC<{
  text: string;
  icon?: string;
}> = ({ text, icon = '👆' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bounce = Math.sin(frame * 0.2) * 5;

  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 150 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${scale}) translateY(${bounce}px)`,
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px 40px',
          borderRadius: 50,
          boxShadow: '0 10px 40px rgba(102, 126, 234, 0.5)',
        }}
      >
        <span
          style={{
            fontFamily: '"Inter", sans-serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#FFFFFF',
          }}
        >
          {icon} {text}
        </span>
      </div>
    </div>
  );
};

// Scene types
export interface TikTokHook {
  id: string;
  startFrame: number;
  durationFrames: number;
  text: string;
  style?: 'bold-white' | 'gold-gradient' | 'glitch';
}

export interface TikTokScene {
  id: number;
  name: string;
  videoSrc: string;
  startFrame: number;
  durationFrames: number;
  caption?: string;
  captionPosition?: 'top' | 'center' | 'bottom';
}

export interface TikTokStoryProps {
  scenes: TikTokScene[];
  hooks: TikTokHook[];
  audioSrc?: string;
  callToAction?: {
    text: string;
    icon?: string;
  };
}

// Main composition
export const TikTokStory: React.FC<TikTokStoryProps> = ({
  scenes,
  hooks,
  audioSrc,
  callToAction,
}) => {
  const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* Background audio */}
      {audioSrc && (
        <Audio
          src={audioSrc}
          volume={0.3}
        />
      )}

      {/* Video scenes */}
      {scenes.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
        >
          <VideoClip src={scene.videoSrc} />

          {/* Caption overlay */}
          {scene.caption && (
            <CaptionOverlay
              text={scene.caption}
              position={scene.captionPosition}
            />
          )}
        </Sequence>
      ))}

      {/* Hook text overlays */}
      {hooks.map((hook) => (
        <Sequence
          key={hook.id}
          from={hook.startFrame}
          durationInFrames={hook.durationFrames}
        >
          <AbsoluteFill
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)',
            }}
          >
            <HookText text={hook.text} style={hook.style} />
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Call to action at the end */}
      {callToAction && (
        <Sequence
          from={durationInFrames - fps * 5}
          durationInFrames={fps * 5}
        >
          <CallToAction
            text={callToAction.text}
            icon={callToAction.icon}
          />
        </Sequence>
      )}

      {/* TikTok-style progress bar at top */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// Progress bar component
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 20,
        right: 20,
        height: 4,
        background: 'rgba(255,255,255,0.3)',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: '#FFFFFF',
          borderRadius: 2,
          transition: 'width 0.1s linear',
        }}
      />
    </div>
  );
};

export default TikTokStory;
