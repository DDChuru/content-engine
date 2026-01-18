import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export interface IntroProps {
  title: string;
  subtitle?: string;
  brandColor?: string;
  logo?: string;
}

export const Intro: React.FC<IntroProps> = ({
  title,
  subtitle = 'Professional Training Content',
  brandColor = '#4f46e5',
  logo,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring animation for logo/icon
  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.5,
    },
  });

  // Slide in animation for title
  const titleSlide = spring({
    frame: frame - 15, // Delay by 15 frames
    fps,
    from: -100,
    to: 0,
    config: {
      damping: 20,
    },
  });

  // Fade in for subtitle
  const subtitleOpacity = interpolate(
    frame,
    [30, 50],
    [0, 1],
    {
      extrapolateRight: 'clamp',
    }
  );

  // Background gradient animation
  const gradientPosition = interpolate(
    frame,
    [0, 90],
    [0, 100],
    {
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${brandColor} ${gradientPosition}%, #1e293b ${gradientPosition + 20}%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      {/* Logo/Icon */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          marginBottom: 40,
        }}
      >
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            style={{
              width: 150,
              height: 150,
              objectFit: 'contain',
            }}
          />
        ) : (
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: 60,
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
            }}
          >
            CE
          </div>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontSize: 80,
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          textAlign: 'center',
          transform: `translateX(${titleSlide}px)`,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          maxWidth: '80%',
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 32,
          color: 'rgba(255, 255, 255, 0.9)',
          margin: '20px 0 0 0',
          textAlign: 'center',
          opacity: subtitleOpacity,
        }}
      >
        {subtitle}
      </p>

      {/* Decorative line */}
      <div
        style={{
          width: interpolate(frame, [40, 70], [0, 300], {
            extrapolateRight: 'clamp',
          }),
          height: 4,
          background: 'white',
          marginTop: 30,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  );
};
