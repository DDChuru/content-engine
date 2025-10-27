/**
 * SlideTitle - Animated Title Component
 *
 * Fades in with spring animation (WebSlides entrance effect)
 */

import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WebSlidesTheme, defaultTheme, getTitleStyle } from './themes';

export interface SlideTitleProps {
  children: React.ReactNode;
  theme?: WebSlidesTheme;
  delay?: number;  // Delay in frames
  style?: React.CSSProperties;
}

export const SlideTitle: React.FC<SlideTitleProps> = ({
  children,
  theme = defaultTheme,
  delay = 10,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for smooth entrance
  const opacity = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5
    }
  });

  // Slight upward movement (WebSlides slide-in effect)
  const translateY = spring({
    frame: frame - delay,
    fps,
    from: 20,
    to: 0,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5
    }
  });

  const titleStyle = getTitleStyle(theme);

  return (
    <h1
      style={{
        ...titleStyle,
        ...style,
        opacity,
        transform: `translateY(${translateY}px)`
      }}
    >
      {children}
    </h1>
  );
};
