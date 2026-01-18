import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Sequence,
  Img,
  staticFile,
  Audio,
} from 'remotion';

// Image paths for each slide
const IMAGES = {
  attention: 'images/econet/attention-grabber.jpg',
  company: 'images/econet/company-expose.jpg',
  problems: 'images/econet/data-problems.jpg',
  speed: 'images/econet/speed-comparison.jpg',
  response: 'images/econet/company-response.jpg',
  pattern: 'images/econet/pattern-problems.jpg',
  cta: 'images/econet/call-to-action.jpg',
  econetLogo: 'images/econet/econe--logo.png',
};

// TauraiZim logo watermark
const LOGO = 'images/tauraizim/tauraizim-icon.jpg';

// Urgent, attention-grabbing color palette
const COLORS = {
  danger: '#dc2626',
  dangerDark: '#991b1b',
  warning: '#f59e0b',
  background: '#0a0a0a',
  backgroundAlt: '#1a1a1a',
  text: '#ffffff',
  textMuted: '#9ca3af',
  accent: '#ef4444',
};

// ============ WATERMARK COMPONENT ============
interface WatermarkProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: number;
  opacity?: number;
}

const Watermark: React.FC<WatermarkProps> = ({
  position = 'bottom-right',
  size = 80,
  opacity = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in during first second
  const fadeIn = interpolate(
    frame,
    [0, fps * 0.5],
    [0, opacity],
    { extrapolateRight: 'clamp' }
  );

  // Position styles
  const positionStyles: React.CSSProperties = {
    position: 'absolute',
    zIndex: 1000,
  };

  switch (position) {
    case 'bottom-right':
      positionStyles.bottom = 30;
      positionStyles.right = 30;
      break;
    case 'bottom-left':
      positionStyles.bottom = 30;
      positionStyles.left = 30;
      break;
    case 'top-right':
      positionStyles.top = 30;
      positionStyles.right = 30;
      break;
    case 'top-left':
      positionStyles.top = 30;
      positionStyles.left = 30;
      break;
  }

  return (
    <div
      style={{
        ...positionStyles,
        opacity: fadeIn,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 8,
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <Img
        src={staticFile(LOGO)}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          paddingRight: 8,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#1a1a1a',
            letterSpacing: -0.5,
          }}
        >
          @TauraiZim
        </span>
        <span
          style={{
            fontSize: 12,
            color: '#666',
            fontWeight: 500,
          }}
        >
          Consumer Voice
        </span>
      </div>
    </div>
  );
};

// ============ ANIMATED BACKGROUND IMAGE COMPONENT ============
// Shows full image first, then transitions to darkened background
interface AnimatedBackgroundProps {
  src: string;
  revealDuration?: number;  // How long to show full image (seconds)
  transitionDuration?: number;  // How long the transition takes (seconds)
  finalDarken?: number;  // Final overlay darkness (0-1)
  finalBlur?: number;  // Final blur amount
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  src,
  revealDuration = 1.2,
  transitionDuration = 0.8,
  finalDarken = 0.6,
  finalBlur = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const revealFrames = revealDuration * fps;
  const transitionFrames = transitionDuration * fps;

  // Slow zoom animation throughout
  const scale = interpolate(frame, [0, fps * 10], [1, 1.15], { extrapolateRight: 'clamp' });

  // Image starts at full brightness, then darkens
  const darkenAmount = interpolate(
    frame,
    [revealFrames, revealFrames + transitionFrames],
    [0, finalDarken],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Optional blur transition
  const blurAmount = interpolate(
    frame,
    [revealFrames, revealFrames + transitionFrames],
    [0, finalBlur],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale})`,
          filter: blurAmount > 0 ? `blur(${blurAmount}px)` : undefined,
        }}
      />
      {/* Animated dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: `rgba(0,0,0,${darkenAmount})`,
        }}
      />
    </>
  );
};

// Helper to calculate when text should appear (after image reveal + transition)
const getTextStartTime = (revealDuration: number, transitionDuration: number) => {
  return revealDuration + transitionDuration * 0.5; // Start text midway through transition
};

// ============ INTRO SLIDE - ATTENTION GRABBER ============
interface AttentionGrabberProps {
  headline: string;
  subheadline: string;
}

export const AttentionGrabberSlide: React.FC<AttentionGrabberProps> = ({
  headline,
  subheadline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing: Show image for 1.2s, transition 0.6s, then text
  const REVEAL = 1.2;
  const TRANSITION = 0.6;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  // Pulsing warning effect (starts after text appears)
  const pulse = frame > textStart * fps ? Math.sin((frame - textStart * fps) * 0.15) * 0.1 + 0.9 : 0;

  // Text reveal (delayed until after image transition)
  const headlineOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.4)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const headlineScale = spring({
    frame: Math.max(0, frame - fps * textStart),
    fps,
    from: 1.5,
    to: 1,
    config: { damping: 10 }
  });

  const subOpacity = interpolate(
    frame,
    [fps * (textStart + 0.3), fps * (textStart + 0.7)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Warning stripes opacity (fade in with text)
  const stripesOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.5)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal animation */}
      <AnimatedBackground
        src={IMAGES.attention}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.55}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        {/* Animated warning stripes */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            opacity: stripesOpacity,
            background: `repeating-linear-gradient(
              45deg,
              ${COLORS.warning},
              ${COLORS.warning} 30px,
              transparent 30px,
              transparent 60px
            )`,
            transform: `translateX(${-frame * 2}px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            opacity: stripesOpacity,
            background: `repeating-linear-gradient(
              -45deg,
              ${COLORS.warning},
              ${COLORS.warning} 30px,
              transparent 30px,
              transparent 60px
            )`,
            transform: `translateX(${frame * 2}px)`,
          }}
        />

        {/* Warning icon */}
        <div
          style={{
            fontSize: 120,
            marginBottom: 40,
            opacity: headlineOpacity,
            transform: `scale(${pulse || 1})`,
            filter: `drop-shadow(0 0 30px ${COLORS.danger})`,
          }}
        >
          ⚠️
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: COLORS.danger,
            opacity: headlineOpacity,
            transform: `scale(${headlineScale})`,
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 8,
            textShadow: `0 0 40px ${COLORS.danger}, 0 4px 20px rgba(0,0,0,0.8)`,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            fontSize: 48,
            color: COLORS.text,
            opacity: subOpacity,
            marginTop: 30,
            textAlign: 'center',
            maxWidth: 1400,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {subheadline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ COMPANY IDENTIFICATION SLIDE ============
interface CompanySlideProps {
  companyName: string;
  tagline: string;
  logoPath?: string;
}

export const CompanySlide: React.FC<CompanySlideProps> = ({
  companyName,
  tagline,
  logoPath,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const REVEAL = 1.0;
  const TRANSITION = 0.6;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  const opacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.4)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Logo scale animation - starts big, settles
  const logoScale = spring({
    frame: Math.max(0, frame - fps * textStart),
    fps,
    from: 1.3,
    to: 1,
    config: { damping: 12 }
  });

  // Strikethrough animation - delayed for impact
  const strikethrough = interpolate(
    frame,
    [fps * (textStart + 1.0), fps * (textStart + 1.6)],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Red flash when strikethrough completes
  const flashOpacity = interpolate(
    frame,
    [fps * (textStart + 1.5), fps * (textStart + 1.7), fps * (textStart + 2.0)],
    [0, 0.3, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const vignetteOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.5)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal */}
      <AnimatedBackground
        src={IMAGES.company}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.6}
      />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
        }}
      >
        {/* Red vignette effect */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: vignetteOpacity,
            background: `radial-gradient(circle at center, transparent 40%, ${COLORS.danger}40 100%)`,
          }}
        />

        {/* Red flash overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: COLORS.danger,
            opacity: flashOpacity,
          }}
        />

        {/* Logo container with strikethrough */}
        <div
          style={{
            position: 'relative',
            opacity,
            transform: `scale(${logoScale})`,
          }}
        >
          {/* White background box for logo visibility */}
          <div
            style={{
              backgroundColor: 'rgba(255,255,255,0.95)',
              padding: '40px 80px',
              borderRadius: 20,
              boxShadow: '0 10px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Actual Econet Logo */}
            <Img
              src={staticFile(IMAGES.econetLogo)}
              style={{
                height: 120,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Dramatic strikethrough animation */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: -20,
              width: `calc(${strikethrough}% + 40px)`,
              height: 12,
              backgroundColor: COLORS.danger,
              transform: 'translateY(-50%) rotate(-5deg)',
              boxShadow: `0 0 30px ${COLORS.danger}, 0 0 60px ${COLORS.danger}80`,
              borderRadius: 6,
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 48,
            color: COLORS.danger,
            marginTop: 50,
            opacity: interpolate(
              frame,
              [fps * (textStart + 0.5), fps * (textStart + 0.9)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
            fontWeight: 700,
            textShadow: `0 0 30px ${COLORS.danger}, 0 4px 20px rgba(0,0,0,0.8)`,
            textTransform: 'uppercase',
            letterSpacing: 4,
          }}
        >
          {tagline}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ PROBLEM STATEMENT SLIDE ============
interface ProblemSlideProps {
  title: string;
  problems: string[];
}

export const ProblemSlide: React.FC<ProblemSlideProps> = ({
  title,
  problems,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const REVEAL = 1.0;
  const TRANSITION = 0.5;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  const titleOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.4)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal */}
      <AnimatedBackground
        src={IMAGES.problems}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.65}
      />

      <AbsoluteFill style={{ padding: 100 }}>
        {/* Header */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: COLORS.danger,
            marginBottom: 60,
            borderLeft: `8px solid ${COLORS.danger}`,
            paddingLeft: 30,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>

        {/* Problems list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 35 }}>
          {problems.map((problem, index) => {
            const itemDelay = textStart + 0.3 + index * 0.25;
            const opacity = interpolate(
              frame,
              [fps * itemDelay, fps * (itemDelay + 0.4)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            const translateX = interpolate(
              frame,
              [fps * itemDelay, fps * (itemDelay + 0.4)],
              [-50, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  opacity,
                  transform: `translateX(${translateX}px)`,
                  gap: 25,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  padding: '15px 25px',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 8,
                    backgroundColor: COLORS.danger,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    fontSize: 28,
                    fontWeight: 'bold',
                    boxShadow: `0 0 15px ${COLORS.danger}`,
                  }}
                >
                  ✗
                </div>

                <div
                  style={{
                    fontSize: 38,
                    color: COLORS.text,
                    lineHeight: 1.4,
                    flex: 1,
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                  }}
                >
                  {problem}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ SPEED COMPARISON SLIDE ============
interface SpeedComparisonProps {
  advertised: string;
  actual: string;
  percentageLoss: number;
}

export const SpeedComparisonSlide: React.FC<SpeedComparisonProps> = ({
  advertised,
  actual,
  percentageLoss,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const REVEAL = 1.0;
  const TRANSITION = 0.5;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  const titleOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.4)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const barFill = interpolate(
    frame,
    [fps * (textStart + 0.5), fps * (textStart + 1.3)],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const actualBarFill = interpolate(
    frame,
    [fps * (textStart + 1.3), fps * (textStart + 2.1)],
    [0, 100 - percentageLoss],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal */}
      <AnimatedBackground
        src={IMAGES.speed}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.7}
      />

      <AbsoluteFill
        style={{
          padding: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: COLORS.text,
            marginBottom: 80,
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
            opacity: titleOpacity,
          }}
        >
          What They Promise vs. What You Get
        </div>

        {/* Advertised Speed */}
        <div style={{ marginBottom: 60, opacity: titleOpacity }}>
          <div style={{ fontSize: 36, color: COLORS.text, marginBottom: 15, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Advertised Speed
          </div>
          <div style={{ position: 'relative', height: 80, borderRadius: 12, backgroundColor: 'rgba(31,41,55,0.8)' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${barFill}%`,
                borderRadius: 12,
                background: `linear-gradient(90deg, #10b981, #34d399)`,
                boxShadow: '0 0 20px rgba(16,185,129,0.5)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 32,
                fontWeight: 'bold',
                color: COLORS.text,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {advertised}
            </div>
          </div>
        </div>

        {/* Actual Speed */}
        <div style={{ marginBottom: 60, opacity: titleOpacity }}>
          <div style={{ fontSize: 36, color: COLORS.text, marginBottom: 15, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
            Actual Speed (Reality)
          </div>
          <div style={{ position: 'relative', height: 80, borderRadius: 12, backgroundColor: 'rgba(31,41,55,0.8)' }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${actualBarFill}%`,
                borderRadius: 12,
                background: `linear-gradient(90deg, ${COLORS.danger}, #f87171)`,
                boxShadow: `0 0 20px ${COLORS.danger}80`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 32,
                fontWeight: 'bold',
                color: COLORS.text,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {actual}
            </div>
          </div>
        </div>

        {/* Loss indicator */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: COLORS.danger,
            textAlign: 'center',
            opacity: interpolate(
              frame,
              [fps * (textStart + 2.2), fps * (textStart + 2.6)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
            textShadow: `0 0 30px ${COLORS.danger}, 0 4px 20px rgba(0,0,0,0.8)`,
          }}
        >
          {percentageLoss}% SPEED LOSS
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ QUOTE / RESPONSE SLIDE ============
interface QuoteSlideProps {
  quote: string;
  source: string;
  commentary: string;
}

export const QuoteSlide: React.FC<QuoteSlideProps> = ({
  quote,
  source,
  commentary,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const REVEAL = 1.0;
  const TRANSITION = 0.5;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  const quoteOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.5)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const commentaryOpacity = interpolate(
    frame,
    [fps * (textStart + 1.2), fps * (textStart + 1.6)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal */}
      <AnimatedBackground
        src={IMAGES.response}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.7}
      />

      <AbsoluteFill
        style={{
          padding: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* Quote marks */}
        <div
          style={{
            fontSize: 200,
            color: COLORS.danger + '60',
            position: 'absolute',
            top: 80,
            left: 80,
            fontFamily: 'Georgia, serif',
            lineHeight: 1,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            opacity: quoteOpacity,
          }}
        >
          "
        </div>

        {/* Quote box */}
        <div
          style={{
            backgroundColor: 'rgba(10,10,10,0.85)',
            border: `4px solid ${COLORS.danger}`,
            borderRadius: 20,
            padding: 60,
            maxWidth: 1400,
            opacity: quoteOpacity,
            boxShadow: `0 0 40px ${COLORS.danger}40, 0 20px 60px rgba(0,0,0,0.6)`,
          }}
        >
          <div
            style={{
              fontSize: 42,
              color: COLORS.text,
              fontStyle: 'italic',
              lineHeight: 1.6,
              textAlign: 'center',
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            "{quote}"
          </div>
          <div
            style={{
              fontSize: 28,
              color: COLORS.textMuted,
              marginTop: 30,
              textAlign: 'right',
            }}
          >
            — {source}
          </div>
        </div>

        {/* Commentary */}
        <div
          style={{
            fontSize: 56,
            color: COLORS.danger,
            marginTop: 60,
            fontWeight: 'bold',
            opacity: commentaryOpacity,
            textAlign: 'center',
            textShadow: `0 0 30px ${COLORS.danger}, 0 4px 20px rgba(0,0,0,0.8)`,
          }}
        >
          {commentary}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ HISTORY / PATTERN SLIDE ============
interface PatternSlideProps {
  title: string;
  incidents: Array<{ name: string; issue: string }>;
}

export const PatternSlide: React.FC<PatternSlideProps> = ({
  title,
  incidents,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const REVEAL = 1.0;
  const TRANSITION = 0.5;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  const titleOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.4)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal */}
      <AnimatedBackground
        src={IMAGES.pattern}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.7}
      />

      <AbsoluteFill style={{ padding: 100 }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: COLORS.warning,
            marginBottom: 60,
            textAlign: 'center',
            textShadow: `0 0 30px ${COLORS.warning}60, 0 4px 20px rgba(0,0,0,0.8)`,
            opacity: titleOpacity,
          }}
        >
          {title}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {incidents.map((incident, index) => {
            const itemDelay = textStart + 0.3 + index * 0.4;
            const opacity = interpolate(
              frame,
              [fps * itemDelay, fps * (itemDelay + 0.4)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(26,26,26,0.9)',
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity,
                  border: `2px solid ${COLORS.danger}60`,
                  boxShadow: `0 10px 40px rgba(0,0,0,0.5), 0 0 20px ${COLORS.danger}20`,
                }}
              >
                <div
                  style={{
                    backgroundColor: COLORS.danger,
                    padding: '30px 40px',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: `0 0 30px ${COLORS.danger}60`,
                  }}
                >
                  <div style={{ fontSize: 36, fontWeight: 'bold', color: COLORS.text, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {incident.name}
                  </div>
                </div>
                <div
                  style={{
                    padding: '30px 40px',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ fontSize: 32, color: COLORS.text, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    {incident.issue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ CALL TO ACTION SLIDE ============
interface CTASlideProps {
  headline: string;
  actions: string[];
  hashtags: string[];
}

export const CTASlide: React.FC<CTASlideProps> = ({
  headline,
  actions,
  hashtags,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing
  const REVEAL = 1.0;
  const TRANSITION = 0.5;
  const textStart = getTextStartTime(REVEAL, TRANSITION);

  const pulse = frame > textStart * fps
    ? Math.sin((frame - textStart * fps) * 0.1) * 0.05 + 1
    : 1;

  const headlineOpacity = interpolate(
    frame,
    [fps * textStart, fps * (textStart + 0.4)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const overlayOpacity = interpolate(
    frame,
    [fps * REVEAL, fps * (REVEAL + TRANSITION)],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      {/* AI-Generated Background with reveal */}
      <AnimatedBackground
        src={IMAGES.cta}
        revealDuration={REVEAL}
        transitionDuration={TRANSITION}
        finalDarken={0.3}
      />

      {/* Red overlay gradient (fades in) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(135deg, ${COLORS.danger}90 0%, ${COLORS.dangerDark}80 100%)`,
          opacity: overlayOpacity,
        }}
      />

      <AbsoluteFill
        style={{
          padding: 100,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            color: COLORS.text,
            marginBottom: 60,
            textAlign: 'center',
            transform: `scale(${pulse})`,
            textTransform: 'uppercase',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)',
            opacity: headlineOpacity,
          }}
        >
          {headline}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 25, marginBottom: 60 }}>
          {actions.map((action, index) => {
            const itemDelay = textStart + 0.3 + index * 0.2;
            const opacity = interpolate(
              frame,
              [fps * itemDelay, fps * (itemDelay + 0.3)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            );

            return (
              <div
                key={index}
                style={{
                  fontSize: 42,
                  color: COLORS.text,
                  opacity,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                }}
              >
                <span style={{ fontSize: 36 }}>👉</span>
                {action}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 20,
            justifyContent: 'center',
            opacity: interpolate(
              frame,
              [fps * (textStart + 1.5), fps * (textStart + 2)],
              [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
            ),
          }}
        >
          {hashtags.map((tag, index) => (
            <div
              key={index}
              style={{
                backgroundColor: 'rgba(255,255,255,0.25)',
                padding: '15px 30px',
                borderRadius: 50,
                fontSize: 32,
                fontWeight: 'bold',
                color: COLORS.text,
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============ MAIN COMPOSITION ============
export const EconetComplaintVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Slide durations in seconds
  const DURATIONS = {
    attention: 4,
    company: 4,
    problems: 6,
    speed: 5,
    quote: 5,
    pattern: 6,
    cta: 5,
  };

  // Calculate frame starts
  let currentFrame = 0;
  const getStartAndAdvance = (seconds: number) => {
    const start = currentFrame;
    currentFrame += seconds * fps;
    return start;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* TauraiZim Watermark - visible throughout */}
      <Watermark position="bottom-right" size={70} opacity={0.9} />

      {/* Slide 1: Attention Grabber */}
      <Sequence from={getStartAndAdvance(DURATIONS.attention)} durationInFrames={DURATIONS.attention * fps}>
        <AttentionGrabberSlide
          headline="CONSUMER ALERT"
          subheadline="Are you paying for data you can't use? You're not alone."
        />
      </Sequence>

      {/* Slide 2: Company Identification */}
      <Sequence from={getStartAndAdvance(DURATIONS.company)} durationInFrames={DURATIONS.company * fps}>
        <CompanySlide
          companyName="ECONET WIRELESS"
          tagline="When 'unlimited' means unusable"
        />
      </Sequence>

      {/* Slide 3: The Problems */}
      <Sequence from={getStartAndAdvance(DURATIONS.problems)} durationInFrames={DURATIONS.problems * fps}>
        <ProblemSlide
          title="THE PROBLEM"
          problems={[
            "Data speeds so slow you can't even watch YouTube",
            "Purchased data becomes practically unusable",
            "No refunds offered - 'you already connected'",
            "No option to convert to usable data packages",
            "Customer complaints blocked from escalation",
          ]}
        />
      </Sequence>

      {/* Slide 4: Speed Comparison */}
      <Sequence from={getStartAndAdvance(DURATIONS.speed)} durationInFrames={DURATIONS.speed * fps}>
        <SpeedComparisonSlide
          advertised="10+ Mbps"
          actual="< 0.5 Mbps"
          percentageLoss={95}
        />
      </Sequence>

      {/* Slide 5: Their Response */}
      <Sequence from={getStartAndAdvance(DURATIONS.quote)} durationInFrames={DURATIONS.quote * fps}>
        <QuoteSlide
          quote="Since you already tried to connect, we cannot offer a refund or convert your data."
          source="Econet Customer Support"
          commentary="Buying data = No rights?"
        />
      </Sequence>

      {/* Slide 6: Pattern of Issues */}
      <Sequence from={getStartAndAdvance(DURATIONS.pattern)} durationInFrames={DURATIONS.pattern * fps}>
        <PatternSlide
          title="A PATTERN OF BROKEN PROMISES"
          incidents={[
            { name: 'Smart Biz', issue: 'Unlimited data silently cut to 200GB, then service removed without notice' },
            { name: 'Smart 4 U', issue: 'Top-up system with zero transparency' },
            { name: 'Smart Suite', issue: 'Huge price increases, extremely slow speeds' },
          ]}
        />
      </Sequence>

      {/* Slide 7: Call to Action */}
      <Sequence from={getStartAndAdvance(DURATIONS.cta)} durationInFrames={DURATIONS.cta * fps}>
        <CTASlide
          headline="TAURAI! SPEAK UP!"
          actions={[
            "Share your story with @TauraiZim",
            "Tag @EconetWireless",
            "Report to @ABORAZIM / POTRAZ",
            "Demand accountability",
          ]}
          hashtags={['#TauraiZim', '#EconetExposed', '#ZimConsumerRights', '#Taurai']}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
