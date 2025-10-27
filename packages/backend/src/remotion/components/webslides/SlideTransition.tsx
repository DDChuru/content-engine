/**
 * SlideTransition - Fade Transition Between Slides
 *
 * WebSlides smooth transitions between scenes
 */

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { WebSlidesTheme, defaultTheme } from './themes';

export interface SlideTransitionProps {
  theme?: WebSlidesTheme;
  duration?: number;  // Duration in frames (default: 30 = 1 second at 30fps)
}

export const SlideTransition: React.FC<SlideTransitionProps> = ({
  theme = defaultTheme,
  duration = 30
}) => {
  const frame = useCurrentFrame();

  // Fade from transparent to opaque
  const opacity = interpolate(
    frame,
    [0, duration],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp'
    }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        opacity
      }}
    />
  );
};
