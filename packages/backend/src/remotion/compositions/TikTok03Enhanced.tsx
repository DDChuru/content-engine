/**
 * TikTok 03 Enhanced - "What AI Changed About Coding"
 *
 * Multi-image composition with images synced to narration segments
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from 'remotion';

// Scene configuration with timing (at 30fps)
const SCENES = [
  {
    id: 'thumbnail',
    image: '', // Dark frame for thumbnail
    startFrame: 0,
    durationFrames: 15, // 0.5 seconds dark intro
    text: '',
    textStyle: 'hook' as const,
  },
  {
    id: 'hook',
    image: 'images/ai-changes/tiktok03/01_hook.jpg',
    startFrame: 15,
    durationFrames: 75, // 2.5 seconds
    text: "Here's what AI actually changed",
    textStyle: 'hook' as const,
  },
  {
    id: 'two_categories',
    image: 'images/ai-changes/tiktok03/02_two_categories.jpg',
    startFrame: 90,
    durationFrames: 180, // 6 seconds
    text: 'AI reorganized skills into TWO categories',
    textStyle: 'main' as const,
  },
  {
    id: 'must_know',
    image: 'images/ai-changes/tiktok03/03_must_know.jpg',
    startFrame: 270,
    durationFrames: 240, // 8 seconds
    text: 'What you MUST know:\nArchitecture • Security\nCode Review • UX • Business Logic',
    textStyle: 'list' as const,
  },
  {
    id: 'delegatable',
    image: 'images/ai-changes/tiktok03/04_delegatable.jpg',
    startFrame: 510,
    durationFrames: 240, // 8 seconds
    text: 'What you can DELEGATE:\nSyntax • Boilerplate • CSS\nDocumentation • REGEX',
    textStyle: 'list' as const,
  },
  {
    id: 'director',
    image: 'images/ai-changes/tiktok03/05_director.jpg',
    startFrame: 750,
    durationFrames: 240, // 8 seconds
    text: 'You don\'t PRODUCE code anymore.\nYou DIRECT and VERIFY.',
    textStyle: 'emphasis' as const,
  },
  {
    id: 'elevator',
    image: 'images/ai-changes/tiktok03/06_elevator.jpg',
    startFrame: 990,
    durationFrames: 360, // 12 seconds (until end)
    text: 'The skill ceiling didn\'t lower.\nThe skill FLOOR rose dramatically.',
    textStyle: 'conclusion' as const,
  },
];

// Animated text component
const AnimatedText: React.FC<{
  text: string;
  style: 'hook' | 'main' | 'list' | 'emphasis' | 'conclusion';
  delay?: number;
}> = ({ text, style, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100 }
  });

  const translateY = spring({
    frame: frame - delay,
    fps,
    from: 40,
    to: 0,
    config: { damping: 15, stiffness: 100 }
  });

  const styles: Record<string, React.CSSProperties> = {
    hook: {
      fontSize: 52,
      fontWeight: 800,
      color: '#ffd700',
      textShadow: '0 0 30px rgba(255,215,0,0.5), 0 4px 20px rgba(0,0,0,0.9)',
    },
    main: {
      fontSize: 44,
      fontWeight: 700,
      color: 'white',
      textShadow: '0 4px 20px rgba(0,0,0,0.9)',
    },
    list: {
      fontSize: 36,
      fontWeight: 600,
      color: 'white',
      textShadow: '0 4px 20px rgba(0,0,0,0.9)',
      lineHeight: 1.5,
    },
    emphasis: {
      fontSize: 42,
      fontWeight: 700,
      color: '#00ff88',
      textShadow: '0 0 20px rgba(0,255,136,0.5), 0 4px 20px rgba(0,0,0,0.9)',
    },
    conclusion: {
      fontSize: 40,
      fontWeight: 700,
      color: '#667eea',
      textShadow: '0 0 20px rgba(102,126,234,0.5), 0 4px 20px rgba(0,0,0,0.9)',
    },
  };

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: '"SF Pro Display", system-ui, sans-serif',
        textAlign: 'center',
        padding: '0 40px',
        whiteSpace: 'pre-line',
        ...styles[style],
      }}
    >
      {text}
    </div>
  );
};

// Progress indicator
const ProgressDots: React.FC<{ currentScene: number; totalScenes: number }> = ({
  currentScene,
  totalScenes,
}) => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 100,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 12,
    }}>
      {Array.from({ length: totalScenes }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === currentScene ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i === currentScene ? '#667eea' : 'rgba(255,255,255,0.3)',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  );
};

// Main composition
export const TikTok03Enhanced: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Determine current scene
  let currentSceneIndex = 0;
  for (let i = SCENES.length - 1; i >= 0; i--) {
    if (frame >= SCENES[i].startFrame) {
      currentSceneIndex = i;
      break;
    }
  }

  const currentScene = SCENES[currentSceneIndex];
  const sceneFrame = frame - currentScene.startFrame;

  // Ken Burns effect
  const imageScale = interpolate(
    sceneFrame,
    [0, currentScene.durationFrames],
    [1, 1.1],
    { extrapolateRight: 'clamp' }
  );

  // Cross-fade between images
  const fadeIn = spring({
    frame: sceneFrame,
    fps,
    config: { damping: 100 }
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      {/* Background image with Ken Burns */}
      <AbsoluteFill style={{ overflow: 'hidden' }}>
        {currentScene.image ? (
          <Img
            src={staticFile(currentScene.image)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              transform: `scale(${imageScale})`,
              opacity: fadeIn,
            }}
          />
        ) : (
          /* Dark thumbnail frame */
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0a0a0a 100%)',
          }} />
        )}
        {/* Gradient overlay for text readability */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </AbsoluteFill>

      {/* Text overlay */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <AnimatedText
          text={currentScene.text}
          style={currentScene.textStyle}
          delay={10}
        />
      </AbsoluteFill>

      {/* Progress dots */}
      <ProgressDots currentScene={currentSceneIndex} totalScenes={SCENES.length} />

      {/* Part indicator */}
      <div style={{
        position: 'absolute',
        top: 60,
        right: 30,
        backgroundColor: 'rgba(102,126,234,0.9)',
        padding: '8px 16px',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: 600,
        color: 'white',
        fontFamily: 'system-ui',
      }}>
        Part 3/6
      </div>

      {/* Audio */}
      <Audio src={staticFile('audio/ai-changes/tiktok_03_new_world.mp3')} volume={1} />
    </AbsoluteFill>
  );
};
