/**
 * MathNotation - Math Formula Display
 *
 * WebSlides .math-notation pattern with Courier New monospace font
 */

import React from 'react';
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { WebSlidesTheme, defaultTheme, getMathNotationStyle } from './themes';

export interface MathNotationProps {
  children: React.ReactNode;
  theme?: WebSlidesTheme;
  delay?: number;  // Delay in frames
  style?: React.CSSProperties;
  animate?: boolean;  // Enable entrance animation
}

export const MathNotation: React.FC<MathNotationProps> = ({
  children,
  theme = defaultTheme,
  delay = 30,
  style = {},
  animate = true
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in animation (optional)
  const opacity = animate
    ? spring({
        frame: frame - delay,
        fps,
        config: {
          damping: 100,
          stiffness: 200,
          mass: 0.5
        }
      })
    : 1;

  // Scale up slightly on entrance (emphasize formula)
  const scale = animate
    ? spring({
        frame: frame - delay,
        fps,
        from: 0.9,
        to: 1,
        config: {
          damping: 100,
          stiffness: 200,
          mass: 0.5
        }
      })
    : 1;

  const mathStyle = getMathNotationStyle(theme);

  return (
    <div
      style={{
        ...mathStyle,
        ...style,
        opacity,
        transform: `scale(${scale})`
      }}
    >
      {children}
    </div>
  );
};
