/**
 * Scene Component - Individual video scene with image, title, and transitions
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { VIDEO_CONFIG } from './config';

export interface SceneProps {
  id: number;
  title: string;
  imagePath: string;
  duration: number;
  transitionType?: 'fade' | 'slide' | 'zoom';
}

export const Scene: React.FC<SceneProps> = ({
  title,
  imagePath,
  duration,
  transitionType = 'fade',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;
  const transitionFrames = VIDEO_CONFIG.transitionDuration;

  // Fade in at start
  const fadeIn = interpolate(
    frame,
    [0, transitionFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Fade out at end
  const fadeOut = interpolate(
    frame,
    [totalFrames - transitionFrames, totalFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Zoom effect
  const scale = transitionType === 'zoom'
    ? interpolate(
        frame,
        [0, totalFrames],
        [1, 1.1],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      )
    : 1;

  // Slide effect
  const translateX = transitionType === 'slide'
    ? interpolate(
        frame,
        [0, transitionFrames],
        [100, 0],
        {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        }
      )
    : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: VIDEO_CONFIG.colors.background,
        opacity,
      }}
    >
      {/* Background Image */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${scale}) translateX(${translateX}px)`,
          }}
        />
      </div>

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Title Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: 80,
          right: 80,
          color: VIDEO_CONFIG.colors.text,
          fontFamily: VIDEO_CONFIG.text.titleFont,
          fontSize: VIDEO_CONFIG.text.subtitleSize,
          fontWeight: 'bold',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
          lineHeight: 1.4,
        }}
      >
        {title}
      </div>
    </AbsoluteFill>
  );
};
