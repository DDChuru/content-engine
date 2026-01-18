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
} from 'remotion';

// Placard images - v2 with consistent character throughout
const PLACARDS = [
  'images/econet/placards-v2/placard-01-purchase.jpg',
  'images/econet/placards-v2/placard-02-speeds.jpg',
  'images/econet/placards-v2/placard-03-tried-everything.jpg',
  'images/econet/placards-v2/placard-04-support-fail.jpg',
  'images/econet/placards-v2/placard-05-hung-up.jpg',
  'images/econet/placards-v2/placard-06-denied.jpg',
  'images/econet/placards-v2/placard-07-smartbiz.jpg',
  'images/econet/placards-v2/placard-08-smart4u.jpg',
  'images/econet/placards-v2/placard-09-endgame.jpg',
  'images/econet/placards-v2/placard-10-miswai.jpg',  // FINALE: "Econet Zim, MISWAI!!"
];

// Branding assets
const TAURAIZIM_LOGO = 'images/tauraizim/tauraizim-icon.jpg';
const ECONET_LOGO = 'images/econet/econe--logo.png';

// Color palette
const COLORS = {
  primary: '#dc2626',
  secondary: '#f59e0b',
  background: '#0a0a0a',
  text: '#ffffff',
  textMuted: '#9ca3af',
  zimbabweGreen: '#319200',
  zimbabweGold: '#FFD200',
  zimbabweRed: '#DE2010',
};

// ============ INTRO SLIDE ============
const IntroSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 12 }
  });

  const textOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 1],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const subtitleOpacity = interpolate(
    frame,
    [fps * 1, fps * 1.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const econetOpacity = interpolate(
    frame,
    [fps * 1.5, fps * 2],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Strikethrough on Econet logo
  const strikethrough = interpolate(
    frame,
    [fps * 2.2, fps * 2.8],
    [0, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.background} 0%, #1a1a2e 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* TauraiZim Logo */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        <Img
          src={staticFile(TAURAIZIM_LOGO)}
          style={{
            width: 150,
            height: 150,
            borderRadius: 20,
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.text,
          opacity: textOpacity,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        @TauraiZim
      </div>

      <div
        style={{
          fontSize: 36,
          color: COLORS.zimbabweGold,
          opacity: subtitleOpacity,
          textAlign: 'center',
          marginBottom: 60,
          fontWeight: 600,
        }}
      >
        Consumer Voice of Zimbabwe
      </div>

      {/* Econet Logo with strikethrough */}
      <div
        style={{
          position: 'relative',
          opacity: econetOpacity,
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '20px 50px',
            borderRadius: 12,
          }}
        >
          <Img
            src={staticFile(ECONET_LOGO)}
            style={{
              height: 60,
              width: 'auto',
            }}
          />
        </div>
        {/* Strikethrough */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: -10,
            width: `calc(${strikethrough}% + 20px)`,
            height: 8,
            backgroundColor: COLORS.primary,
            transform: 'translateY(-50%) rotate(-5deg)',
            boxShadow: `0 0 20px ${COLORS.primary}`,
            borderRadius: 4,
          }}
        />
      </div>

      <div
        style={{
          fontSize: 28,
          color: COLORS.primary,
          marginTop: 30,
          opacity: interpolate(frame, [fps * 2.8, fps * 3.2], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontWeight: 600,
        }}
      >
        MY REAL STORY
      </div>
    </AbsoluteFill>
  );
};

// ============ PLACARD SLIDE ============
interface PlacardSlideProps {
  imagePath: string;
  slideNumber: number;
  totalSlides: number;
}

const PlacardSlide: React.FC<PlacardSlideProps> = ({
  imagePath,
  slideNumber,
  totalSlides,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns effect - slow zoom
  const scale = interpolate(
    frame,
    [0, fps * 4],
    [1, 1.08],
    { extrapolateRight: 'clamp' }
  );

  // Slide in from right
  const translateX = spring({
    frame,
    fps,
    from: 100,
    to: 0,
    config: { damping: 15 }
  });

  // Progress indicator
  const progress = (slideNumber / totalSlides) * 100;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Main image with Ken Burns */}
      <Img
        src={staticFile(imagePath)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${translateX * 0.1}px)`,
        }}
      />

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Progress bar at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 6,
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            backgroundColor: COLORS.zimbabweGold,
            boxShadow: `0 0 10px ${COLORS.zimbabweGold}`,
          }}
        />
      </div>

      {/* Slide counter */}
      <div
        style={{
          position: 'absolute',
          top: 30,
          left: 30,
          backgroundColor: 'rgba(0,0,0,0.7)',
          padding: '10px 20px',
          borderRadius: 8,
          fontSize: 24,
          color: COLORS.text,
          fontWeight: 600,
        }}
      >
        {slideNumber} / {totalSlides}
      </div>
    </AbsoluteFill>
  );
};

// ============ CTA SLIDE ============
const CTASlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pulse = Math.sin(frame * 0.1) * 0.03 + 1;

  const titleOpacity = interpolate(
    frame,
    [0, fps * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.background} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 80,
      }}
    >
      {/* TauraiZim Logo */}
      <Img
        src={staticFile(TAURAIZIM_LOGO)}
        style={{
          width: 120,
          height: 120,
          borderRadius: 16,
          marginBottom: 40,
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          opacity: titleOpacity,
        }}
      />

      <div
        style={{
          fontSize: 72,
          fontWeight: 900,
          color: COLORS.text,
          textAlign: 'center',
          marginBottom: 30,
          transform: `scale(${pulse})`,
          textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          opacity: titleOpacity,
        }}
      >
        TAURAI! SPEAK UP!
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          marginBottom: 50,
        }}
      >
        {[
          'Share YOUR story with @TauraiZim',
          'Tag @EconetWireless',
          'Report to POTRAZ',
          'Demand accountability!',
        ].map((action, index) => {
          const itemOpacity = interpolate(
            frame,
            [fps * (0.5 + index * 0.2), fps * (0.8 + index * 0.2)],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          return (
            <div
              key={index}
              style={{
                fontSize: 36,
                color: COLORS.text,
                opacity: itemOpacity,
                display: 'flex',
                alignItems: 'center',
                gap: 15,
              }}
            >
              <span>👉</span> {action}
            </div>
          );
        })}
      </div>

      {/* Hashtags */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 15,
          justifyContent: 'center',
          opacity: interpolate(frame, [fps * 2, fps * 2.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      >
        {['#TauraiZim', '#EconetExposed', '#ZimConsumerRights', '#Taurai'].map((tag, i) => (
          <div
            key={i}
            style={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              padding: '12px 25px',
              borderRadius: 30,
              fontSize: 28,
              fontWeight: 'bold',
              color: COLORS.text,
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ============ WATERMARK ============
const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(
    frame,
    [0, fps * 0.5],
    [0, 0.9],
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 25,
        right: 25,
        zIndex: 1000,
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        backgroundColor: 'rgba(255,255,255,0.95)',
        padding: 8,
        borderRadius: 10,
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      }}
    >
      <Img
        src={staticFile(TAURAIZIM_LOGO)}
        style={{
          width: 50,
          height: 50,
          borderRadius: 6,
        }}
      />
      <div style={{ paddingRight: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#1a1a1a' }}>
          @TauraiZim
        </div>
        <div style={{ fontSize: 10, color: '#666' }}>
          Consumer Voice
        </div>
      </div>
    </div>
  );
};

// ============ MAIN COMPOSITION ============
export const PlacardProtestVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Timing
  const INTRO_DURATION = 4; // 4 seconds
  const PLACARD_DURATION = 3.5; // 3.5 seconds each
  const CTA_DURATION = 5; // 5 seconds

  let currentFrame = 0;

  const getStartAndAdvance = (seconds: number) => {
    const start = currentFrame;
    currentFrame += seconds * fps;
    return start;
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Intro */}
      <Sequence from={getStartAndAdvance(INTRO_DURATION)} durationInFrames={INTRO_DURATION * fps}>
        <IntroSlide />
      </Sequence>

      {/* Placard slides */}
      {PLACARDS.map((placard, index) => (
        <Sequence
          key={index}
          from={getStartAndAdvance(PLACARD_DURATION)}
          durationInFrames={PLACARD_DURATION * fps}
        >
          <PlacardSlide
            imagePath={placard}
            slideNumber={index + 1}
            totalSlides={PLACARDS.length}
          />
        </Sequence>
      ))}

      {/* CTA */}
      <Sequence from={getStartAndAdvance(CTA_DURATION)} durationInFrames={CTA_DURATION * fps}>
        <CTASlide />
      </Sequence>

      {/* Watermark - visible throughout */}
      <Watermark />
    </AbsoluteFill>
  );
};

// Calculate total duration for registration
export const getPlacardVideoDuration = (fps: number) => {
  const INTRO_DURATION = 4;
  const PLACARD_DURATION = 3.5;
  const CTA_DURATION = 5;
  const PLACARD_COUNT = PLACARDS.length; // Dynamic based on array

  return Math.ceil((INTRO_DURATION + (PLACARD_DURATION * PLACARD_COUNT) + CTA_DURATION) * fps);
};
