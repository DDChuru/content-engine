/**
 * Hybrid Scene Component
 * Combines Gallery (full-screen) and Presentation (bullet points) styles
 * Image stays full-screen with overlay text appearing partway through
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

export interface HybridSceneProps {
  id: number;
  title: string;
  imagePath: string;
  duration: number;
  narration: string;
  transitionType?: 'fade' | 'slide' | 'zoom';
}

/**
 * Extract key points from narration for bullet points
 */
function extractBulletPoints(narration: string, count: number = 2): string[] {
  const sentences = narration
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, count);

  return sentences.map(s => {
    return s
      .replace(/^(Here's|That's|This is|We|Our|Your|The)\s+/i, '')
      .substring(0, 70)
      .trim() + (s.length > 70 ? '...' : '');
  });
}

export const HybridScene: React.FC<HybridSceneProps> = ({
  title,
  imagePath,
  duration,
  narration,
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

  // Content appears after the first third of the scene
  const CONTENT_START = Math.floor(totalFrames / 3);
  const bulletPoints = extractBulletPoints(narration, 2);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: VIDEO_CONFIG.colors.background,
        opacity,
      }}
    >
      {/* Background Image (Full Screen like Gallery) */}
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
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)',
        }}
      />

      {/* Title Overlay (Always visible) */}
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

      {/* Content Overlay (Appears partway through) */}
      {frame > CONTENT_START && (
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 80,
            right: '50%',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            opacity: interpolate(
              frame,
              [CONTENT_START, CONTENT_START + 20],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
          }}
        >
          {bulletPoints.map((bullet, index) => {
            const bulletAppearFrame = CONTENT_START + (index * 30);
            const bulletOpacity = interpolate(
              frame,
              [bulletAppearFrame, bulletAppearFrame + 15],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const bulletSlide = interpolate(
              frame,
              [bulletAppearFrame, bulletAppearFrame + 15],
              [-20, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  opacity: bulletOpacity,
                  transform: `translateX(${bulletSlide}px)`,
                  fontSize: VIDEO_CONFIG.text.subtitleSize * 0.65,
                  color: VIDEO_CONFIG.colors.text,
                  fontFamily: VIDEO_CONFIG.text.bodyFont,
                  lineHeight: 1.5,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  padding: '15px 20px',
                  borderRadius: '8px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: VIDEO_CONFIG.colors.accent,
                    marginRight: 15,
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>{bullet}</div>
              </div>
            );
          })}
        </div>
      )}
    </AbsoluteFill>
  );
};
