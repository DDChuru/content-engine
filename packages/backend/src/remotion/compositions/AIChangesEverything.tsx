/**
 * AI Changes Everything - Video Compositions
 *
 * Creates TikTok (9:16) and YouTube (16:9) versions of the
 * "AI Changes Everything: A Developer's New Reality" video.
 *
 * Features:
 * - Text-based animated scenes with audio narration
 * - Dynamic typography and transitions
 * - Framework logos and visual elements
 * - Progress indicators
 */

import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Audio,
  staticFile,
  Easing,
} from 'remotion';

// ============================================================
// SHARED COMPONENTS
// ============================================================

// Animated text with typewriter effect
const TypewriterText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  delay?: number;
  speed?: number;
}> = ({ text, fontSize = 48, color = '#FFFFFF', delay = 0, speed = 0.8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveFrame = Math.max(0, frame - delay);
  const charsPerSecond = 30 * speed;
  const charsToShow = Math.floor((effectiveFrame / fps) * charsPerSecond);

  const displayText = text.substring(0, Math.min(charsToShow, text.length));

  return (
    <div
      style={{
        fontFamily: '"Inter", "SF Pro Display", -apple-system, sans-serif',
        fontSize,
        fontWeight: 600,
        color,
        textAlign: 'center',
        lineHeight: 1.4,
        maxWidth: '80%',
      }}
    >
      {displayText}
      {charsToShow < text.length && (
        <span style={{ opacity: frame % 15 < 8 ? 1 : 0, color: '#FFD700' }}>|</span>
      )}
    </div>
  );
};

// Fade in/out wrapper
const FadeInOut: React.FC<{
  children: React.ReactNode;
  fadeInFrames?: number;
  fadeOutFrames?: number;
}> = ({ children, fadeInFrames = 15, fadeOutFrames = 15 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fadeInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const fadeOut = interpolate(
    frame,
    [durationInFrames - fadeOutFrames, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return <div style={{ opacity: fadeIn * fadeOut }}>{children}</div>;
};

// Scale pop animation
const ScalePop: React.FC<{
  children: React.ReactNode;
  delay?: number;
}> = ({ children, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div style={{ transform: `scale(${scale})` }}>
      {children}
    </div>
  );
};

// Gradient background
const GradientBackground: React.FC<{
  colors?: string[];
  animate?: boolean;
}> = ({ colors = ['#1a1a2e', '#16213e', '#0f3460'], animate = true }) => {
  const frame = useCurrentFrame();
  const angle = animate ? frame * 0.3 : 135;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(${angle}deg, ${colors.join(', ')})`,
      }}
    />
  );
};

// Hook text with dramatic styling
const HookText: React.FC<{
  text: string;
  style?: 'white' | 'gold' | 'gradient' | 'glitch';
}> = ({ text, style = 'white' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  const glowIntensity = interpolate(Math.sin(frame * 0.1), [-1, 1], [10, 30]);

  const styles: Record<string, React.CSSProperties> = {
    white: {
      color: '#FFFFFF',
      textShadow: `0 0 ${glowIntensity}px rgba(255,255,255,0.5), 0 4px 30px rgba(0,0,0,0.8)`,
    },
    gold: {
      color: '#FFD700',
      textShadow: `0 0 ${glowIntensity}px rgba(255,215,0,0.6), 0 4px 30px rgba(0,0,0,0.8)`,
    },
    gradient: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: `drop-shadow(0 4px 30px rgba(102, 126, 234, 0.5))`,
    },
    glitch: {
      color: '#FFFFFF',
      textShadow: `${frame % 10 < 5 ? '2px' : '-2px'} 0 #ff0000, ${frame % 10 < 5 ? '-2px' : '2px'} 0 #00ffff`,
    },
  };

  return (
    <div
      style={{
        fontFamily: '"Bebas Neue", "Impact", sans-serif',
        fontSize: 72,
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 4,
        textAlign: 'center',
        transform: `scale(${scale})`,
        ...styles[style],
      }}
    >
      {text}
    </div>
  );
};

// Progress bar
const ProgressBar: React.FC<{ color?: string }> = ({ color = '#FFFFFF' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = (frame / durationInFrames) * 100;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        height: 4,
        background: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: '100%',
          background: color,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

// ============================================================
// TIKTOK COMPOSITION (9:16)
// ============================================================

export interface TikTokSceneProps {
  id: string;
  title: string;
  script: string;
  hook: string;
  audioSrc: string;
  durationFrames: number;
}

export const TikTokScene: React.FC<TikTokSceneProps> = ({
  id,
  title,
  script,
  hook,
  audioSrc,
  durationFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split script into sentences for better display
  const sentences = script.split(/(?<=[.!?])\s+/);
  const wordsPerSentence = sentences.map(s => s.split(' ').length);
  const totalWords = wordsPerSentence.reduce((a, b) => a + b, 0);

  // Calculate which sentence to show based on frame
  const wordsPerFrame = totalWords / (durationFrames * 0.8); // 80% of duration for text
  const currentWordIndex = Math.floor(frame * wordsPerFrame);

  let wordCount = 0;
  let currentSentenceIndex = 0;
  for (let i = 0; i < sentences.length; i++) {
    wordCount += wordsPerSentence[i];
    if (currentWordIndex < wordCount) {
      currentSentenceIndex = i;
      break;
    }
    currentSentenceIndex = i;
  }

  return (
    <AbsoluteFill>
      {/* Background */}
      <GradientBackground colors={['#0f0f23', '#1a1a3e', '#2d1b4e']} />

      {/* Audio */}
      <Audio src={audioSrc} />

      {/* Hook at the start */}
      <Sequence from={0} durationInFrames={fps * 3}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <FadeInOut>
            <HookText text={hook} style="gold" />
          </FadeInOut>
        </AbsoluteFill>
      </Sequence>

      {/* Main content */}
      <Sequence from={fps * 3} durationInFrames={durationFrames - fps * 5}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 40,
          }}
        >
          <FadeInOut>
            <div
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: 42,
                fontWeight: 500,
                color: '#FFFFFF',
                textAlign: 'center',
                lineHeight: 1.5,
                maxWidth: '90%',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              {sentences[currentSentenceIndex]}
            </div>
          </FadeInOut>
        </AbsoluteFill>
      </Sequence>

      {/* CTA at the end */}
      <Sequence from={durationFrames - fps * 2} durationInFrames={fps * 2}>
        <AbsoluteFill
          style={{
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: 200,
          }}
        >
          <ScalePop>
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
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}
              >
                Follow for more
              </span>
            </div>
          </ScalePop>
        </AbsoluteFill>
      </Sequence>

      {/* Progress bar */}
      <ProgressBar color="#667eea" />
    </AbsoluteFill>
  );
};

// ============================================================
// YOUTUBE COMPOSITION (16:9)
// ============================================================

export interface YouTubeSceneData {
  id: string;
  title: string;
  script: string;
  audioSrc: string;
  durationSeconds: number;
  visualNotes?: string;
}

export interface YouTubeVideoProps {
  scenes: YouTubeSceneData[];
  title: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ scenes, title }) => {
  const { fps } = useVideoConfig();

  // Calculate frame positions for each scene
  let currentFrame = 0;
  const scenePositions = scenes.map(scene => {
    const startFrame = currentFrame;
    const durationFrames = Math.round(scene.durationSeconds * fps);
    currentFrame += durationFrames;
    return { ...scene, startFrame, durationFrames };
  });

  return (
    <AbsoluteFill>
      {/* Background */}
      <GradientBackground colors={['#0a0a1a', '#1a1a3e', '#0f2027']} animate={false} />

      {/* Render each scene */}
      {scenePositions.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={scene.startFrame}
          durationInFrames={scene.durationFrames}
        >
          <YouTubeScene
            {...scene}
            sceneNumber={index + 1}
            totalScenes={scenes.length}
          />
        </Sequence>
      ))}

      {/* Progress bar */}
      <ProgressBar color="#FFD700" />
    </AbsoluteFill>
  );
};

const YouTubeScene: React.FC<
  YouTubeSceneData & {
    startFrame: number;
    durationFrames: number;
    sceneNumber: number;
    totalScenes: number;
  }
> = ({ id, title, script, audioSrc, durationFrames, sceneNumber, totalScenes }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Split into sentences
  const sentences = script.split(/(?<=[.!?])\s+/).filter(s => s.trim());

  // Calculate which sentence to show
  const sentenceDuration = durationFrames / sentences.length;
  const currentSentenceIndex = Math.min(
    Math.floor(frame / sentenceDuration),
    sentences.length - 1
  );

  // Fade for current sentence
  const sentenceFrame = frame % sentenceDuration;
  const sentenceOpacity = interpolate(
    sentenceFrame,
    [0, 10, sentenceDuration - 10, sentenceDuration],
    [0, 1, 1, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* Audio */}
      <Audio src={audioSrc} />

      {/* Scene title */}
      <Sequence from={0} durationInFrames={fps * 2}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <FadeInOut fadeInFrames={15} fadeOutFrames={15}>
            <div
              style={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: 64,
                fontWeight: 700,
                color: '#FFD700',
                textTransform: 'uppercase',
                letterSpacing: 4,
                textShadow: '0 4px 30px rgba(255,215,0,0.3)',
              }}
            >
              {title}
            </div>
          </FadeInOut>
        </AbsoluteFill>
      </Sequence>

      {/* Main content */}
      <Sequence from={fps * 2} durationInFrames={durationFrames - fps * 2}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 100px',
          }}
        >
          <div
            style={{
              fontFamily: '"Inter", "SF Pro Display", sans-serif',
              fontSize: 48,
              fontWeight: 500,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 1.6,
              opacity: sentenceOpacity,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {sentences[currentSentenceIndex]}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scene indicator */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 60,
          fontFamily: '"Inter", sans-serif',
          fontSize: 18,
          fontWeight: 600,
          color: 'rgba(255,255,255,0.5)',
        }}
      >
        {sceneNumber} / {totalScenes}
      </div>
    </AbsoluteFill>
  );
};

// ============================================================
// EXPORTS & DURATION CALCULATION
// ============================================================

export const getTikTokDuration = (fps: number): number => {
  return 60 * fps; // 60 seconds
};

export const getYouTubeDuration = (scenes: YouTubeSceneData[], fps: number): number => {
  return scenes.reduce((total, scene) => total + Math.round(scene.durationSeconds * fps), 0);
};
