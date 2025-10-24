import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const FadeTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade from transparent to black and back to transparent
  const opacity = interpolate(
    frame,
    [0, durationInFrames / 2, durationInFrames],
    [0, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#000000',
        opacity
      }}
    />
  );
};
