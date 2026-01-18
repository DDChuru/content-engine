import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from 'remotion';

export interface IntroWithImageProps {
  title: string;
  subtitle?: string;
  brandColor?: string;
  logoPath?: string;  // Path to your logo image
  backgroundImage?: string;  // Optional background image
}

export const IntroWithImage: React.FC<IntroWithImageProps> = ({
  title,
  subtitle = 'Professional Training Content',
  brandColor = '#4f46e5',
  logoPath,
  backgroundImage,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo zoom animation
  const logoScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 12,
      stiffness: 100,
    },
  });

  // Title slide in
  const titleSlide = spring({
    frame: frame - 15,
    fps,
    from: -100,
    to: 0,
    config: {
      damping: 20,
    },
  });

  // Subtitle fade
  const subtitleOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Background image fade in
  const bgOpacity = interpolate(frame, [0, 20], [0, 0.3], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      {/* Optional background image with overlay */}
      {backgroundImage && (
        <>
          <Img
            src={staticFile(backgroundImage)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: bgOpacity,
            }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, ${brandColor}dd 0%, #1e293bdd 100%)`,
            }}
          />
        </>
      )}

      {/* Solid gradient background if no image */}
      {!backgroundImage && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${brandColor} 0%, #1e293b 100%)`,
          }}
        />
      )}

      {/* Content layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        {/* Logo/Image */}
        {logoPath && (
          <div
            style={{
              transform: `scale(${logoScale})`,
              marginBottom: 40,
            }}
          >
            <Img
              src={staticFile(logoPath)}
              style={{
                width: 200,
                height: 200,
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
              }}
            />
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontSize: 80,
            fontWeight: 'bold',
            color: 'white',
            margin: 0,
            textAlign: 'center',
            transform: `translateX(${titleSlide}px)`,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            maxWidth: '80%',
          }}
        >
          {title}
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 32,
            color: 'rgba(255, 255, 255, 0.95)',
            margin: '20px 0 0 0',
            textAlign: 'center',
            opacity: subtitleOpacity,
            textShadow: '0 2px 10px rgba(0,0,0,0.3)',
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
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
