import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';
import { Orientation } from '../BirthdayTribute';

interface Props {
  orientation: Orientation;
}

export const ClosingFace: React.FC<Props> = ({ orientation }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity, backgroundColor: '#000' }}>
      <OffthreadVideo
        src={staticFile('birthday-tribute/video/closing-face.mp4')}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        muted={false}
        volume={1}
      />

      <AbsoluteFill
        style={{
          background:
            orientation === 'vertical'
              ? 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)'
              : 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
