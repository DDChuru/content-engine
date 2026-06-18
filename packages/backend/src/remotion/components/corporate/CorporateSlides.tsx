/**
 * Corporate Slide Components for EnviroWize presentations
 *
 * Reusable slide types: Title, Content (bullets), Table, Timeline,
 * Comparison (two-column), and Closing.
 */

import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';
import { WebSlidesTheme, withOpacity } from '../webslides/themes';

// ─── Shared helpers ──────────────────────────────────────────────

function fadeIn(frame: number, start: number, duration = 15): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function slideUp(frame: number, start: number, distance = 30, duration = 15): number {
  return interpolate(frame, [start, start + duration], [distance, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

interface ImageBackgroundProps {
  src: string;
  opacity?: number;
}

const ImageBackground: React.FC<ImageBackgroundProps> = ({ src, opacity = 0.35 }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      opacity,
    }}
  />
);

const GradientOverlay: React.FC<{ theme: WebSlidesTheme }> = ({ theme }) => (
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: `linear-gradient(135deg, ${withOpacity(theme.colors.background, 0.92)} 0%, ${withOpacity(theme.colors.secondary, 0.85)} 100%)`,
    }}
  />
);

// ─── 1. Title Slide ──────────────────────────────────────────────

export interface CorporateTitleSlideProps {
  title: string;
  subtitle: string;
  imagePath?: string;
  theme: WebSlidesTheme;
}

export const CorporateTitleSlide: React.FC<CorporateTitleSlideProps> = ({
  title,
  subtitle,
  imagePath,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, from: 0.8, to: 1, durationInFrames: 30 });
  const titleOpacity = fadeIn(frame, 5);
  const subtitleOpacity = fadeIn(frame, 25);
  const lineWidth = interpolate(frame, [20, 50], [0, 300], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {imagePath && <ImageBackground src={imagePath} opacity={0.25} />}
      <GradientOverlay theme={theme} />

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            textAlign: 'center',
            opacity: titleOpacity,
            transform: `scale(${titleScale})`,
            lineHeight: 1.15,
          }}
        >
          {title}
        </div>

        {/* Accent line */}
        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: theme.colors.accent,
            marginTop: 30,
            marginBottom: 30,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontSize: 32,
            color: theme.colors.accent,
            fontFamily: theme.typography.fontFamily,
            textAlign: 'center',
            opacity: subtitleOpacity,
          }}
        >
          {subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 1b. Image Feature Slide (foreground image) ─────────────────

export interface CorporateImageSlideProps {
  title: string;
  caption: string;
  imagePath: string;
  theme: WebSlidesTheme;
}

export const CorporateImageSlide: React.FC<CorporateImageSlideProps> = ({
  title,
  caption,
  imagePath,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const imgScale = spring({ frame, fps, from: 1.05, to: 1, config: { damping: 200 }, durationInFrames: 40 });
  const imgOpacity = fadeIn(frame, 0, 20);
  const titleOpacity = fadeIn(frame, 15);
  const captionOpacity = fadeIn(frame, 35);
  const captionSlide = slideUp(frame, 35, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Large foreground image */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          right: 80,
          bottom: 180,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
          opacity: imgOpacity,
          transform: `scale(${imgScale})`,
        }}
      >
        <Img
          src={staticFile(imagePath)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        {/* Subtle gradient at bottom for text readability */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: `linear-gradient(transparent, ${withOpacity(theme.colors.background, 0.85)})`,
          }}
        />
        {/* Title overlay on image */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 40,
            right: 40,
            fontSize: 42,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>
      </div>

      {/* Caption below image */}
      <div
        style={{
          position: 'absolute',
          bottom: 50,
          left: 80,
          right: 80,
          fontSize: 24,
          color: withOpacity(theme.colors.text, 0.75),
          fontFamily: theme.typography.fontFamily,
          textAlign: 'center',
          fontStyle: 'italic',
          opacity: captionOpacity,
          transform: `translateY(${captionSlide}px)`,
        }}
      >
        {caption}
      </div>
    </AbsoluteFill>
  );
};

// ─── 2. Content Slide (bullets) ──────────────────────────────────

export interface CorporateContentSlideProps {
  title: string;
  bullets: string[];
  imagePath?: string;
  theme: WebSlidesTheme;
}

export const CorporateContentSlide: React.FC<CorporateContentSlideProps> = ({
  title,
  bullets,
  imagePath,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, 5);
  const BULLET_START = 25;
  const BULLET_INTERVAL = 20;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {imagePath && <ImageBackground src={imagePath} opacity={0.2} />}
      {imagePath && <GradientOverlay theme={theme} />}

      <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column' }}>
        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            opacity: titleOpacity,
            marginBottom: 12,
          }}
        >
          {title}
        </div>

        {/* Accent bar */}
        <div
          style={{
            width: 80,
            height: 4,
            backgroundColor: theme.colors.accent,
            marginBottom: 40,
            opacity: titleOpacity,
          }}
        />

        {/* Bullets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, justifyContent: 'center' }}>
          {bullets.map((bullet, i) => {
            const start = BULLET_START + i * BULLET_INTERVAL;
            const opacity = fadeIn(frame, start);
            const slide = slideUp(frame, start);

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  opacity,
                  transform: `translateY(${slide}px)`,
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: theme.colors.accent,
                    marginRight: 20,
                    marginTop: 10,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    fontSize: 28,
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily,
                    lineHeight: 1.5,
                  }}
                >
                  {bullet}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 3. Table Slide ──────────────────────────────────────────────

export interface CorporateTableSlideProps {
  title: string;
  headers: string[];
  rows: string[][];
  theme: WebSlidesTheme;
}

export const CorporateTableSlide: React.FC<CorporateTableSlideProps> = ({
  title,
  headers,
  rows,
  theme,
}) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 5);
  const ROW_START = 25;
  const ROW_INTERVAL = 15;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            opacity: titleOpacity,
            marginBottom: 12,
          }}
        >
          {title}
        </div>
        <div style={{ width: 80, height: 4, backgroundColor: theme.colors.accent, marginBottom: 40, opacity: titleOpacity }} />

        {/* Table */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {/* Header row */}
          <div
            style={{
              display: 'flex',
              borderBottom: `2px solid ${theme.colors.accent}`,
              paddingBottom: 14,
              marginBottom: 10,
              opacity: fadeIn(frame, 15),
            }}
          >
            {headers.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: 700,
                  color: theme.colors.accent,
                  fontFamily: theme.typography.fontFamily,
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* Data rows */}
          {rows.map((row, ri) => {
            const start = ROW_START + ri * ROW_INTERVAL;
            const opacity = fadeIn(frame, start);
            const slide = slideUp(frame, start, 20);

            return (
              <div
                key={ri}
                style={{
                  display: 'flex',
                  padding: '12px 0',
                  borderBottom: `1px solid ${withOpacity(theme.colors.text, 0.1)}`,
                  opacity,
                  transform: `translateY(${slide}px)`,
                }}
              >
                {row.map((cell, ci) => (
                  <div
                    key={ci}
                    style={{
                      flex: 1,
                      fontSize: 20,
                      color: ci === 0 ? theme.colors.highlight : theme.colors.text,
                      fontWeight: ci === 0 ? 600 : 400,
                      fontFamily: theme.typography.fontFamily,
                      lineHeight: 1.4,
                    }}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 4. Timeline Slide ───────────────────────────────────────────

export interface TimelinePhase {
  label: string;
  detail: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface CorporateTimelineSlideProps {
  title: string;
  phases: TimelinePhase[];
  imagePath?: string;
  theme: WebSlidesTheme;
}

export const CorporateTimelineSlide: React.FC<CorporateTimelineSlideProps> = ({
  title,
  phases,
  imagePath,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleOpacity = fadeIn(frame, 5);
  const PHASE_START = 30;
  const PHASE_INTERVAL = 20;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {imagePath && <ImageBackground src={imagePath} opacity={0.15} />}
      {imagePath && <GradientOverlay theme={theme} />}

      <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            opacity: titleOpacity,
            marginBottom: 50,
          }}
        >
          {title}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          {phases.map((phase, i) => {
            const start = PHASE_START + i * PHASE_INTERVAL;
            const opacity = fadeIn(frame, start);
            const checkScale = spring({ frame: Math.max(0, frame - start - 10), fps, from: 0, to: 1, durationInFrames: 15 });

            const statusColor =
              phase.status === 'completed' ? theme.colors.accent :
              phase.status === 'current' ? theme.colors.highlight :
              withOpacity(theme.colors.text, 0.4);

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  opacity,
                  padding: '14px 20px',
                  borderRadius: 8,
                  backgroundColor: phase.status === 'current' ? withOpacity(theme.colors.highlight, 0.1) : 'transparent',
                }}
              >
                {/* Status indicator */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: `2px solid ${statusColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: phase.status === 'completed' ? statusColor : 'transparent',
                    transform: `scale(${phase.status === 'completed' ? checkScale : 1})`,
                  }}
                >
                  {phase.status === 'completed' && (
                    <span style={{ color: theme.colors.background, fontSize: 18, fontWeight: 700 }}>✓</span>
                  )}
                  {phase.status === 'current' && (
                    <span style={{ color: theme.colors.highlight, fontSize: 14, fontWeight: 700 }}>●</span>
                  )}
                </div>

                {/* Phase text */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 22, fontWeight: 600, color: statusColor, fontFamily: theme.typography.fontFamily }}>
                    {phase.label}
                  </div>
                  <div style={{ fontSize: 17, color: withOpacity(theme.colors.text, 0.7), fontFamily: theme.typography.fontFamily }}>
                    {phase.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 5. Comparison Slide (two-column) ────────────────────────────

export interface ComparisonRow {
  left: string;
  right: string;
}

export interface CorporateComparisonSlideProps {
  title: string;
  leftHeader: string;
  rightHeader: string;
  rows: ComparisonRow[];
  theme: WebSlidesTheme;
}

export const CorporateComparisonSlide: React.FC<CorporateComparisonSlideProps> = ({
  title,
  leftHeader,
  rightHeader,
  rows,
  theme,
}) => {
  const frame = useCurrentFrame();
  const titleOpacity = fadeIn(frame, 5);
  const ROW_START = 30;
  const ROW_INTERVAL = 18;

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 52,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            opacity: titleOpacity,
            marginBottom: 40,
          }}
        >
          {title}
        </div>

        {/* Column headers */}
        <div style={{ display: 'flex', gap: 60, marginBottom: 20, opacity: fadeIn(frame, 15) }}>
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: theme.colors.highlight, fontFamily: theme.typography.fontFamily }}>
            {leftHeader}
          </div>
          <div style={{ width: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
          <div style={{ flex: 1, fontSize: 24, fontWeight: 700, color: theme.colors.accent, fontFamily: theme.typography.fontFamily }}>
            {rightHeader}
          </div>
        </div>

        <div style={{ width: '100%', height: 2, backgroundColor: withOpacity(theme.colors.text, 0.15), marginBottom: 20 }} />

        {/* Rows */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          {rows.map((row, i) => {
            const start = ROW_START + i * ROW_INTERVAL;
            const opacity = fadeIn(frame, start);
            const slide = slideUp(frame, start, 20);

            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 60,
                  opacity,
                  transform: `translateY(${slide}px)`,
                  padding: '8px 0',
                }}
              >
                <div style={{ flex: 1, fontSize: 20, color: withOpacity(theme.colors.text, 0.85), fontFamily: theme.typography.fontFamily }}>
                  {row.left}
                </div>
                <div style={{ color: theme.colors.accent, fontSize: 24, fontWeight: 700 }}>→</div>
                <div style={{ flex: 1, fontSize: 20, color: theme.colors.text, fontFamily: theme.typography.fontFamily }}>
                  {row.right}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── 6. Closing Slide ────────────────────────────────────────────

export interface CorporateClosingSlideProps {
  headline: string;
  tagline: string;
  companyName: string;
  imagePath?: string;
  theme: WebSlidesTheme;
}

export const CorporateClosingSlide: React.FC<CorporateClosingSlideProps> = ({
  headline,
  tagline,
  companyName,
  imagePath,
  theme,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineScale = spring({ frame, fps, from: 0.85, to: 1, durationInFrames: 25 });
  const headlineOpacity = fadeIn(frame, 5);
  const taglineOpacity = fadeIn(frame, 30);
  const companyOpacity = fadeIn(frame, 45);
  const lineWidth = interpolate(frame, [20, 50], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {imagePath && <ImageBackground src={imagePath} opacity={0.2} />}
      <GradientOverlay theme={theme} />

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: theme.typography.headingWeight,
            color: theme.colors.text,
            fontFamily: theme.typography.fontFamily,
            textAlign: 'center',
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            width: lineWidth,
            height: 4,
            backgroundColor: theme.colors.accent,
            marginTop: 30,
            marginBottom: 30,
            borderRadius: 2,
          }}
        />

        <div
          style={{
            fontSize: 28,
            color: theme.colors.accent,
            fontFamily: theme.typography.fontFamily,
            textAlign: 'center',
            fontStyle: 'italic',
            opacity: taglineOpacity,
          }}
        >
          {tagline}
        </div>

        <div
          style={{
            fontSize: 22,
            color: withOpacity(theme.colors.text, 0.6),
            fontFamily: theme.typography.fontFamily,
            textAlign: 'center',
            marginTop: 40,
            opacity: companyOpacity,
          }}
        >
          {companyName}
        </div>
      </div>
    </AbsoluteFill>
  );
};
