/**
 * Documentary Composition
 * Ken Burns style slideshow with pan/zoom effects
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  Audio,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  staticFile,
} from 'remotion';

interface DocumentaryScene {
  id: string;
  title: string;
  narration: string;
  imageUrl: string;
  audioUrl?: string; // Optional narration audio file
  duration: number; // in seconds
}

interface DocumentaryProps {
  scenes: DocumentaryScene[];
  title: string;
  subtitle?: string;
}

// Ken Burns effect directions
type KenBurnsDirection = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown';

const kenBurnsDirections: KenBurnsDirection[] = [
  'zoomIn', 'panRight', 'zoomOut', 'panLeft', 'zoomIn', 'panUp', 'zoomOut', 'panDown'
];

const SceneSlide: React.FC<{
  scene: DocumentaryScene;
  direction: KenBurnsDirection;
  durationInFrames: number;
  sceneIndex: number;
}> = ({ scene, direction, durationInFrames, sceneIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Progress through the scene (0 to 1)
  const progress = frame / durationInFrames;

  // Ken Burns parameters based on direction
  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case 'zoomIn':
      scale = interpolate(progress, [0, 1], [1, 1.15]);
      break;
    case 'zoomOut':
      scale = interpolate(progress, [0, 1], [1.15, 1]);
      break;
    case 'panLeft':
      scale = 1.1;
      translateX = interpolate(progress, [0, 1], [5, -5]);
      break;
    case 'panRight':
      scale = 1.1;
      translateX = interpolate(progress, [0, 1], [-5, 5]);
      break;
    case 'panUp':
      scale = 1.1;
      translateY = interpolate(progress, [0, 1], [5, -5]);
      break;
    case 'panDown':
      scale = 1.1;
      translateY = interpolate(progress, [0, 1], [-5, 5]);
      break;
  }

  // Fade in/out
  const fadeIn = interpolate(frame, [0, fps * 0.5], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps * 0.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  // Title animation
  const titleSpring = spring({
    frame: frame - fps * 0.3,
    fps,
    config: { damping: 12, stiffness: 100 }
  });

  const titleOpacity = interpolate(
    frame,
    [durationInFrames - fps * 1.5, durationInFrames - fps * 0.5],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Audio file path based on scene index
  const audioPath = scene.audioUrl || `audio/documentary/scene_${sceneIndex + 1}.wav`;

  // Audio volume with fade out at end to prevent harsh cuts
  const audioFadeOutStart = durationInFrames - fps * 1; // Start fade 1 second before end
  const audioVolume = interpolate(
    frame,
    [0, fps * 0.3, audioFadeOutStart, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Scene narration audio with fade in/out */}
      <Audio src={staticFile(audioPath)} volume={audioVolume} />

      {/* Image with Ken Burns effect */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          opacity,
        }}
      >
        <Img
          src={staticFile(scene.imageUrl)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
          }}
        />
      </div>

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40%',
          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
          opacity: titleSpring * titleOpacity,
        }}
      />

      {/* Scene title */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: 60,
          right: 60,
          opacity: titleSpring * titleOpacity,
          transform: `translateY(${(1 - titleSpring) * 30}px)`,
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'white',
            fontFamily: 'Inter, system-ui, sans-serif',
            margin: 0,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          {scene.title}
        </h2>
      </div>

      {/* Narration text (subtitle style) */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          left: 60,
          right: 60,
          opacity: interpolate(frame, [fps * 1, fps * 1.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) * titleOpacity,
        }}
      >
        <p
          style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'Inter, system-ui, sans-serif',
            margin: 0,
            lineHeight: 1.4,
            textShadow: '0 1px 10px rgba(0,0,0,0.8)',
          }}
        >
          {scene.narration}
        </p>
      </div>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{ title: string; subtitle?: string; durationInFrames: number }> = ({
  title,
  subtitle,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame: frame - fps * 0.5, fps, config: { damping: 15 } });
  const subtitleSpring = spring({ frame: frame - fps * 1, fps, config: { damping: 15 } });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeOut,
      }}
    >
      <h1
        style={{
          fontSize: 72,
          fontWeight: 800,
          color: 'white',
          fontFamily: 'Inter, system-ui, sans-serif',
          margin: 0,
          opacity: titleSpring,
          transform: `translateY(${(1 - titleSpring) * 50}px)`,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.6)',
            fontFamily: 'Inter, system-ui, sans-serif',
            marginTop: 20,
            opacity: subtitleSpring,
            transform: `translateY(${(1 - subtitleSpring) * 30}px)`,
          }}
        >
          {subtitle}
        </p>
      )}
    </AbsoluteFill>
  );
};

export const Documentary: React.FC<DocumentaryProps> = ({ scenes, title, subtitle }) => {
  const { fps } = useVideoConfig();

  // Title card duration
  const titleDuration = fps * 4; // 4 seconds

  // Calculate frame positions for each scene
  let currentFrame = titleDuration;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Title Card */}
      <Sequence from={0} durationInFrames={titleDuration}>
        <TitleCard title={title} subtitle={subtitle} durationInFrames={titleDuration} />
      </Sequence>

      {/* Scenes */}
      {scenes.map((scene, index) => {
        const sceneDurationInFrames = scene.duration * fps;
        const startFrame = currentFrame;
        currentFrame += sceneDurationInFrames;

        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={sceneDurationInFrames}>
            <SceneSlide
              scene={scene}
              direction={kenBurnsDirections[index % kenBurnsDirections.length]}
              durationInFrames={sceneDurationInFrames}
              sceneIndex={index}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export default Documentary;
