/**
 * WebSlidesSlide - Main Slide Container
 *
 * Mimics WebSlides slide-content centered layout
 */

import React from 'react';
import { AbsoluteFill } from 'remotion';
import { WebSlidesTheme, defaultTheme, getSlideContainerStyle } from './themes';

export interface WebSlidesSlideProps {
  children: React.ReactNode;
  theme?: WebSlidesTheme;
  style?: React.CSSProperties;
}

export const WebSlidesSlide: React.FC<WebSlidesSlideProps> = ({
  children,
  theme = defaultTheme,
  style = {}
}) => {
  const containerStyle = getSlideContainerStyle(theme);

  return (
    <AbsoluteFill
      style={{
        ...containerStyle,
        ...style
      }}
    >
      {/* Centered content container (WebSlides .slide-content pattern) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: theme.spacing.padding,
          gap: theme.spacing.gap
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};
