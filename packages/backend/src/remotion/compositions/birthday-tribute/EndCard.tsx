import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Orientation, tributeFonts } from '../BirthdayTribute';

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

  // "Plus one." letterspacing breathes from 0px → 8px over the 60-frame fade —
  // a quiet typographic flourish that makes the words feel like they're settling
  // into place rather than dropping in. Subtle, but elevates the closing moment.
  const headlineLetterSpacing = interpolate(frame, [0, 45], [0, 8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // Subhead lags the headline slightly — appears once "Plus one." has landed.
  const subheadOpacity = interpolate(frame, [12, 30], [0, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subheadLetterSpacing = interpolate(frame, [12, 45], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
            fontFamily: tributeFonts.serifItalic,
            fontSize: orientation === 'vertical' ? 64 : 56,
            color: '#d4a574',
            marginBottom: 24,
            letterSpacing: headlineLetterSpacing,
          }}
        >
          Plus one.
        </div>
        <div
          style={{
            fontFamily: tributeFonts.serifItalic,
            fontSize: orientation === 'vertical' ? 40 : 36,
            color: '#ffffff',
            opacity: subheadOpacity,
            letterSpacing: subheadLetterSpacing,
          }}
        >
          This year belongs to them.
        </div>
      </div>
    </AbsoluteFill>
  );
};
