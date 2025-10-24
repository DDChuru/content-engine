/**
 * Presentation Scene Component
 * Animated presentation-style scene with image moving to bottom-right corner
 * and bullet points appearing synchronized with narration
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

export interface PresentationSceneProps {
  id: number;
  title: string;
  imagePath: string;
  duration: number;
  narration: string;
}

/**
 * Extract key points from narration for bullet points
 * This is a simple implementation - in production, you might use AI to extract key points
 */
function extractBulletPoints(narration: string): string[] {
  // Split by sentence and take first 3-4 key sentences
  const sentences = narration
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 20)
    .slice(0, 4);

  // Simplify sentences to bullet points
  return sentences.map(s => {
    // Remove common filler words and shorten
    return s
      .replace(/^(Here's|That's|This is|We|Our|Your|The)\s+/i, '')
      .substring(0, 80)
      .trim() + (s.length > 80 ? '...' : '');
  });
}

export const PresentationScene: React.FC<PresentationSceneProps> = ({
  title,
  imagePath,
  duration,
  narration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const totalFrames = duration * fps;

  // Animation timings
  const IMAGE_INTRO_DURATION = 30; // 1 second for image to fade in and center
  const IMAGE_MOVE_DURATION = 20; // 0.67 seconds to move to corner
  const IMAGE_MOVE_START = IMAGE_INTRO_DURATION;
  const IMAGE_MOVE_END = IMAGE_INTRO_DURATION + IMAGE_MOVE_DURATION;
  const CONTENT_START = IMAGE_MOVE_END + 5; // Content starts appearing shortly after image settles

  // Image fade in (0-30 frames)
  const imageFadeIn = interpolate(
    frame,
    [0, IMAGE_INTRO_DURATION],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Image position animation: Start centered, then move to bottom-right
  const imageScale = interpolate(
    frame,
    [IMAGE_MOVE_START, IMAGE_MOVE_END],
    [1, 0.35], // Shrink to 35% of original size
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const imageX = interpolate(
    frame,
    [IMAGE_MOVE_START, IMAGE_MOVE_END],
    [0, 55], // Move to right (percentage)
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  const imageY = interpolate(
    frame,
    [IMAGE_MOVE_START, IMAGE_MOVE_END],
    [0, 50], // Move down (percentage)
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Fade out at end
  const sceneOpacity = interpolate(
    frame,
    [totalFrames - 15, totalFrames],
    [1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Extract bullet points from narration
  const bulletPoints = extractBulletPoints(narration);

  // Calculate when each bullet point should appear
  const bulletStartFrame = CONTENT_START;
  const framesPerBullet = Math.floor((totalFrames - bulletStartFrame - 30) / bulletPoints.length);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: VIDEO_CONFIG.colors.background,
        opacity: sceneOpacity,
      }}
    >
      {/* Animated Image */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: `${imageScale * 100}%`,
            height: `${imageScale * 100}%`,
            transform: `translate(${imageX}%, ${imageY}%)`,
            transition: 'all 0.3s ease-out',
            borderRadius: frame > IMAGE_MOVE_END ? '12px' : '0px',
            overflow: 'hidden',
            boxShadow: frame > IMAGE_MOVE_END ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
            opacity: imageFadeIn,
          }}
        >
          <Img
            src={staticFile(imagePath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* Content Area (appears after image moves) */}
      {frame > CONTENT_START && (
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 80,
            right: '40%',
            bottom: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: 30,
          }}
        >
          {/* Scene Title */}
          <div
            style={{
              fontSize: VIDEO_CONFIG.text.titleSize * 0.7,
              fontWeight: 'bold',
              color: VIDEO_CONFIG.colors.text,
              fontFamily: VIDEO_CONFIG.text.titleFont,
              textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
              marginBottom: 20,
              opacity: interpolate(
                frame,
                [CONTENT_START, CONTENT_START + 15],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              ),
            }}
          >
            {title}
          </div>

          {/* Bullet Points */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 25,
            }}
          >
            {bulletPoints.map((bullet, index) => {
              const bulletAppearFrame = bulletStartFrame + (index * framesPerBullet);
              const bulletOpacity = interpolate(
                frame,
                [bulletAppearFrame, bulletAppearFrame + 15],
                [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              );

              const bulletSlide = interpolate(
                frame,
                [bulletAppearFrame, bulletAppearFrame + 15],
                [-30, 0],
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
                    fontSize: VIDEO_CONFIG.text.subtitleSize * 0.75,
                    color: VIDEO_CONFIG.colors.text,
                    fontFamily: VIDEO_CONFIG.text.bodyFont,
                    lineHeight: 1.5,
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: VIDEO_CONFIG.colors.accent,
                      marginRight: 20,
                      marginTop: 8,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>{bullet}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
