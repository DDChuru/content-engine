/**
 * VennDiagramSlide - Sets Visualization Slide
 *
 * Integrates with Sets Agent spatial_calculator output
 * Displays Venn diagrams with Manim video or D3 SVG
 */

import React from 'react';
import { Video, Img, spring, useCurrentFrame, useVideoConfig, staticFile } from 'remotion';
import { WebSlidesSlide } from './WebSlidesSlide';
import { SlideTitle } from './SlideTitle';
import { SlideSubtitle } from './SlideSubtitle';
import { MathNotation } from './MathNotation';
import { WebSlidesTheme, defaultTheme } from './themes';

export interface VennDiagramSlideProps {
  title: string;
  subtitle?: string;
  mathNotation?: string;

  // Visual content (Manim video OR D3 SVG OR static image)
  visualType: 'manim' | 'd3-svg' | 'image';
  visualPath: string;

  // Optional: Sets Agent layout data (for debugging/overlay)
  layout?: {
    union_size?: number;
    intersection_size?: number;
    circle_radius?: number;
    circle_separation?: number;
    tier?: string;
  };

  theme?: WebSlidesTheme;
}

export const VennDiagramSlide: React.FC<VennDiagramSlideProps> = ({
  title,
  subtitle,
  mathNotation,
  visualType,
  visualPath,
  layout,
  theme = defaultTheme
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animate visual container entrance
  const visualOpacity = spring({
    frame: frame - 40,  // Delay after title/subtitle
    fps,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5
    }
  });

  const visualScale = spring({
    frame: frame - 40,
    fps,
    from: 0.95,
    to: 1,
    config: {
      damping: 100,
      stiffness: 200,
      mass: 0.5
    }
  });

  return (
    <WebSlidesSlide theme={theme}>
      {/* Title */}
      <SlideTitle theme={theme} delay={10}>
        {title}
      </SlideTitle>

      {/* Subtitle (optional) */}
      {subtitle && (
        <SlideSubtitle theme={theme} delay={20}>
          {subtitle}
        </SlideSubtitle>
      )}

      {/* Visual Container */}
      <div
        style={{
          width: '900px',
          height: '600px',
          margin: `${theme.spacing.margin} auto`,
          opacity: visualOpacity,
          transform: `scale(${visualScale})`,
          borderRadius: theme.effects.borderRadius,
          overflow: 'hidden',
          boxShadow: theme.effects.shadow
        }}
      >
        {/* Render based on visual type */}
        {visualType === 'manim' && (
          <Video
            src={staticFile(visualPath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: theme.colors.background
            }}
          />
        )}

        {visualType === 'd3-svg' && (
          <Img
            src={staticFile(visualPath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              backgroundColor: theme.colors.background
            }}
          />
        )}

        {visualType === 'image' && (
          <Img
            src={staticFile(visualPath)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              backgroundColor: theme.colors.background
            }}
          />
        )}
      </div>

      {/* Math Notation (optional) */}
      {mathNotation && (
        <MathNotation theme={theme} delay={50}>
          {mathNotation}
        </MathNotation>
      )}

      {/* Debug info (optional - only if layout provided) */}
      {layout && process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            fontSize: '0.8rem',
            color: theme.colors.text,
            opacity: 0.5,
            fontFamily: theme.typography.mathFont
          }}
        >
          <div>Union: {layout.union_size}</div>
          <div>Intersection: {layout.intersection_size}</div>
          <div>Tier: {layout.tier}</div>
          <div>Separation: {layout.circle_separation?.toFixed(2)}</div>
        </div>
      )}
    </WebSlidesSlide>
  );
};
