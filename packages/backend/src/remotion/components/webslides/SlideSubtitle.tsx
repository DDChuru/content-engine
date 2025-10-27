/**
 * SlideSubtitle - Subtitle with Yellow Accent
 *
 * WebSlides .subtitle pattern with highlight color
 */

import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WebSlidesTheme, defaultTheme, getSubtitleStyle } from './themes';

export interface SlideSubtitleProps {
  children: React.ReactNode;
  theme?: WebSlidesTheme;
  delay?: number;  // Delay in frames
  style?: React.CSSProperties;
}

export const SlideSubtitle: React.FC<SlideSubtitleProps> = ({
  children,
  theme = defaultTheme,
  delay = 20,
  style = {}
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in after title
  const opacity = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5
    }
  });

  const subtitleStyle = getSubtitleStyle(theme);

  return (
    <div
      style={{
        ...subtitleStyle,
        ...style,
        opacity
      }}
    >
      {children}
    </div>
  );
};
