import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Orientation } from '../BirthdayTribute';

interface Props {
  orientation: Orientation;
}

export const EndCard: React.FC<Props> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
  });
  const fadeOut = interpolate(frame, [45, 60], [1, 0], { extrapolateLeft: 'clamp' });
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0a0a0f',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
      }}
    >
      <div style={{ textAlign: 'center', padding: '0 60px' }}>
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: orientation === 'vertical' ? 64 : 56,
            color: '#d4a574',
            marginBottom: 20,
            letterSpacing: 2,
          }}
        >
          Plus one.
        </div>
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            fontSize: orientation === 'vertical' ? 40 : 36,
            color: '#ffffff',
            opacity: 0.85,
            letterSpacing: 1,
          }}
        >
          This year belongs to them.
        </div>
      </div>
    </AbsoluteFill>
  );
};
