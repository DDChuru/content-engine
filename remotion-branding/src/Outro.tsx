import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export interface OutroProps {
  title: string;
  callToAction?: string;
  contactInfo?: string;
  socialHandles?: {
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  brandColor?: string;
}

export const Outro: React.FC<OutroProps> = ({
  title,
  callToAction = 'Subscribe for more!',
  contactInfo,
  socialHandles,
  brandColor = '#4f46e5',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scale in animation
  const scale = spring({
    frame,
    fps,
    from: 0.8,
    to: 1,
    config: {
      damping: 15,
    },
  });

  // Fade in
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Social icons slide in
  const socialSlide = spring({
    frame: frame - 20,
    fps,
    from: 50,
    to: 0,
    config: {
      damping: 20,
    },
  });

  // Pulse effect for CTA button
  const pulseScale = 1 + Math.sin((frame / 15) * Math.PI) * 0.05;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #1e293b 0%, ${brandColor} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, Arial, sans-serif',
        opacity,
      }}
    >
      {/* Thank you message */}
      <h1
        style={{
          fontSize: 90,
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          marginBottom: 20,
          transform: `scale(${scale})`,
          textShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        {title}
      </h1>

      {/* Call to Action */}
      <div
        style={{
          background: 'white',
          padding: '20px 60px',
          borderRadius: 50,
          marginTop: 40,
          transform: `scale(${pulseScale})`,
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        }}
      >
        <p
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: brandColor,
            margin: 0,
          }}
        >
          {callToAction}
        </p>
      </div>

      {/* Social Media / Contact Info */}
      {(socialHandles || contactInfo) && (
        <div
          style={{
            marginTop: 60,
            transform: `translateY(${socialSlide}px)`,
          }}
        >
          {socialHandles && (
            <div
              style={{
                display: 'flex',
                gap: 40,
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              {socialHandles.youtube && (
                <SocialHandle
                  icon="▶"
                  handle={socialHandles.youtube}
                  color="#FF0000"
                />
              )}
              {socialHandles.twitter && (
                <SocialHandle
                  icon="🐦"
                  handle={socialHandles.twitter}
                  color="#1DA1F2"
                />
              )}
              {socialHandles.website && (
                <SocialHandle
                  icon="🌐"
                  handle={socialHandles.website}
                  color="#ffffff"
                />
              )}
            </div>
          )}

          {contactInfo && (
            <p
              style={{
                fontSize: 28,
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0,
                textAlign: 'center',
              }}
            >
              {contactInfo}
            </p>
          )}
        </div>
      )}

      {/* Decorative elements */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 10,
          background: brandColor,
        }}
      />
    </AbsoluteFill>
  );
};

// Helper component for social handles
const SocialHandle: React.FC<{
  icon: string;
  handle: string;
  color: string;
}> = ({ icon, handle, color }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(255, 255, 255, 0.1)',
      padding: '10px 20px',
      borderRadius: 25,
      backdropFilter: 'blur(10px)',
    }}
  >
    <span style={{ fontSize: 24 }}>{icon}</span>
    <span
      style={{
        fontSize: 24,
        color: 'white',
        fontWeight: '500',
      }}
    >
      {handle}
    </span>
  </div>
);
