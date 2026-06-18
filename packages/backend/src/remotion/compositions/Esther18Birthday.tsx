import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  Audio,
  Sequence,
  Easing,
} from 'remotion';
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';

// ─────────────────────────────────────────────────
// TYPES & CONFIG
// ─────────────────────────────────────────────────

export interface Esther18Props {
  audioEnabled: boolean;
}

const FPS = 30;
const PHOTOS_BASE = 'images/esther-18';

// Scene durations (seconds) - matched to narration audio segments
// intro: 10.87s, school-concert: 7.0s, face-paint: 7.52s, silly-phase: 8.72s
// yolo: 5.28s, dad-moments: 7.55s, transition: 1.70s, glow-up: 7.78s, outro: 4.62s
// Combined narration: 70.24s (includes pauses between segments)
const SCENE_DURATIONS = {
  intro: 13,        // 10.87s narration + visual buffer
  schoolConcert: 8, // 7.0s narration + pause
  facePaint: 8.5,   // 7.52s + pause
  sillyPhase: 10,   // 8.72s + pause
  yolo: 6.5,        // 5.28s + pause
  dadMoments: 8.5,  // 7.55s + pause
  transition: 3,    // 1.70s + dramatic pause
  glowUp: 9,        // 7.78s + pause
  outro: 9,         // 4.62s + long hold for ending
};

const TOTAL_DURATION = 72; // seconds (covers 70.24s narration + buffer)

export function getEsther18Duration(fps: number): number {
  return TOTAL_DURATION * fps;
}

// ─────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────

function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return { opacity, isActive: frame >= cueFrame };
}

function useSpringIn(delay = 0, damping = 10) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delay * fps), fps, config: { damping } });
}

function useShake(intensity = 3, speed = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return {
    x: Math.sin(t * speed * 20) * intensity,
    y: Math.cos(t * speed * 15) * intensity * 0.5,
    rotation: Math.sin(t * speed * 12) * intensity * 0.3,
  };
}

// ─────────────────────────────────────────────────
// CONFETTI PARTICLES
// ─────────────────────────────────────────────────

const CONFETTI_COLORS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF69B4', '#A855F7', '#22D3EE', '#FB923C'];

function ConfettiParticle({ index, total }: { index: number; total: number }) {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();

  const seed = index * 137.5;
  const x = ((seed * 7.3) % 100);
  const startDelay = ((seed * 3.1) % 30);
  const speed = 80 + ((seed * 2.7) % 120);
  const wobble = 20 + ((seed * 1.9) % 40);
  const size = 8 + ((seed * 1.3) % 16);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];

  const t = Math.max(0, frame - startDelay) / fps;
  const y = -50 + t * speed;
  const xOffset = Math.sin(t * 3 + seed) * wobble;
  const rotation = t * 200 + seed * 10;
  const opacity = y > height ? 0 : 1;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: y,
        transform: `translateX(${xOffset}px) rotate(${rotation}deg)`,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: 2,
        opacity,
      }}
    />
  );
}

function Confetti({ count = 50 }: { count?: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiParticle key={i} index={i} total={count} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────
// FLOATING EMOJIS
// ─────────────────────────────────────────────────

function FloatingEmojis() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const emojis = ['🎂', '🎉', '🎈', '🎊', '💃', '🥳', '✨', '💫', '🎁', '👑'];

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {emojis.map((emoji, i) => {
        const seed = i * 97.3;
        const x = 5 + ((seed * 7.1) % 90);
        const startY = 110;
        const speed = 30 + ((seed * 2.3) % 40);
        const delay = ((seed * 1.7) % 60);
        const t = Math.max(0, frame - delay) / fps;
        const y = startY - t * speed;
        const wobbleX = Math.sin(t * 2 + seed) * 30;
        const scale = 0.6 + ((seed * 0.3) % 0.8);
        const opacity = y < -10 ? 0 : y > 100 ? 0.3 : interpolate(y, [0, 50], [0.8, 0.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: `translateX(${wobbleX}px) scale(${scale})`,
              fontSize: 40,
              opacity,
            }}
          >
            {emoji}
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────
// SCENE: INTRO
// ─────────────────────────────────────────────────

function IntroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Giant "18" with spring bounce
  const numberScale = spring({ frame, fps, config: { damping: 8, mass: 1.2 } });
  const numberGlow = interpolate(frame, [0, 30, 60], [0, 20, 10], { extrapolateRight: 'clamp' });

  // "ESTHER" typewriter effect
  const name = 'ESTHER';
  const charsToShow = Math.min(name.length, Math.floor((frame - 30) / 4));

  // Subtitle fade-in
  const subtitleOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtitleY = interpolate(frame, [60, 80], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a0533 0%, #0a0118 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Confetti count={60} />
      <FloatingEmojis />

      {/* Giant 18 */}
      <div
        style={{
          fontSize: 350,
          fontWeight: 900,
          fontFamily: 'system-ui, sans-serif',
          background: 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: `scale(${numberScale})`,
          textShadow: `0 0 ${numberGlow}px rgba(255, 215, 0, 0.5)`,
          filter: `drop-shadow(0 0 ${numberGlow * 2}px rgba(255, 215, 0, 0.3))`,
          lineHeight: 1,
        }}
      >
        18
      </div>

      {/* ESTHER typewriter */}
      <div
        style={{
          fontSize: 90,
          fontWeight: 800,
          fontFamily: 'system-ui, sans-serif',
          color: 'white',
          letterSpacing: 25,
          marginTop: 10,
        }}
      >
        {name.slice(0, Math.max(0, charsToShow))}
        {charsToShow >= 0 && charsToShow < name.length && (
          <span style={{ opacity: frame % 15 < 8 ? 1 : 0 }}>|</span>
        )}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 32,
          color: '#FFD700',
          fontStyle: 'italic',
          marginTop: 20,
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: 'Georgia, serif',
        }}
      >
        She's officially an adult... God help us all
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// SCENE: PHOTO WITH CAPTION
// ─────────────────────────────────────────────────

function PhotoScene({
  photoFile,
  cartoonFile,
  caption,
  subcaption,
  bgColor = '#0a0118',
  accentColor = '#FF69B4',
  photoPosition = 'center',
  showCartoon = true,
}: {
  photoFile: string;
  cartoonFile?: string;
  caption: string;
  subcaption?: string;
  bgColor?: string;
  accentColor?: string;
  photoPosition?: 'left' | 'right' | 'center';
  showCartoon?: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Photo entrance - slide + scale
  const photoScale = spring({ frame, fps, config: { damping: 12 } });
  const photoX = interpolate(frame, [0, 20], [photoPosition === 'left' ? -300 : photoPosition === 'right' ? 300 : 0, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateRight: 'clamp',
  });

  // Caption fly-in from bottom
  const captionY = interpolate(frame, [15, 35], [80, 0], {
    easing: Easing.out(Easing.back(1.5)),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cartoon reveal (wipe from right after 2s)
  const cartoonReveal = interpolate(frame, [60, 90], [100, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Ken Burns - slow zoom
  const kenBurns = interpolate(frame, [0, 180], [1, 1.08], { extrapolateRight: 'clamp' });

  const isCenter = photoPosition === 'center';
  const photoWidth = isCenter ? 700 : 550;
  const photoHeight = isCenter ? 500 : 450;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(ellipse at 30% 50%, ${bgColor}, #0a0118)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FloatingEmojis />

      <div
        style={{
          display: 'flex',
          flexDirection: isCenter ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 60,
          padding: '0 80px',
        }}
      >
        {/* Photo container with frame */}
        <div
          style={{
            position: 'relative',
            transform: `translateX(${photoX}px) scale(${photoScale})`,
          }}
        >
          <div
            style={{
              width: photoWidth,
              height: photoHeight,
              borderRadius: 20,
              overflow: 'hidden',
              border: `4px solid ${accentColor}`,
              boxShadow: `0 0 40px ${accentColor}40, 0 20px 60px rgba(0,0,0,0.5)`,
              position: 'relative',
            }}
          >
            <Img
              src={staticFile(`${PHOTOS_BASE}/${photoFile}`)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${kenBurns})`,
              }}
            />

            {/* Cartoon overlay with wipe reveal */}
            {showCartoon && cartoonFile && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  clipPath: `inset(0 ${cartoonReveal}% 0 0)`,
                }}
              >
                <Img
                  src={staticFile(`${PHOTOS_BASE}/${cartoonFile}`)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}
          </div>

          {/* Decorative sparkle */}
          <div
            style={{
              position: 'absolute',
              top: -15,
              right: -15,
              fontSize: 40,
              transform: `rotate(${frame * 2}deg)`,
              opacity: frame % 30 < 15 ? 1 : 0.5,
            }}
          >
            ✨
          </div>
        </div>

        {/* Caption area */}
        <div
          style={{
            maxWidth: isCenter ? 900 : 500,
            textAlign: isCenter ? 'center' : 'left',
            transform: `translateY(${captionY}px)`,
            opacity: captionOpacity,
          }}
        >
          <h2
            style={{
              fontSize: isCenter ? 48 : 42,
              fontWeight: 800,
              color: 'white',
              fontFamily: 'system-ui, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            }}
          >
            {caption}
          </h2>
          {subcaption && (
            <p
              style={{
                fontSize: 26,
                color: accentColor,
                fontFamily: 'Georgia, serif',
                fontStyle: 'italic',
                marginTop: 15,
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {subcaption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// SCENE: SILLY MONTAGE (3 photos quick cuts)
// ─────────────────────────────────────────────────

function SillyMontage() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photos = [
    { file: 'scene-03-bed-pose.jpeg', label: 'Professional Drama Queen' },
    { file: 'scene-05-school-uniform.jpeg', label: 'Running the School' },
    { file: 'scene-07-screaming.jpeg', label: 'Maximum Chaos Energy' },
  ];

  // Show each photo for ~3.3 seconds
  const framesPerPhoto = Math.floor(SCENE_DURATIONS.sillyPhase * fps / 3);
  const currentPhotoIndex = Math.min(2, Math.floor(frame / framesPerPhoto));
  const localFrame = frame - currentPhotoIndex * framesPerPhoto;

  const photo = photos[currentPhotoIndex];
  const shake = useShake(4, 0.8);

  // Stamp/slap entrance
  const stampScale = spring({ frame: localFrame, fps, config: { damping: 6, mass: 0.8 } });

  // Photo tilt for each
  const tilts = [-5, 3, -4];
  const tilt = tilts[currentPhotoIndex];

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a0533 0%, #0a0118 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Confetti count={30} />

      {/* Main text */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          fontSize: 38,
          fontWeight: 800,
          color: '#FFD700',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        }}
      >
        Born. For. Drama. 🎭
      </div>

      {/* Photo with stamp effect */}
      <div
        style={{
          transform: `scale(${stampScale}) rotate(${tilt + shake.rotation}deg) translate(${shake.x}px, ${shake.y}px)`,
        }}
      >
        <div
          style={{
            width: 600,
            height: 500,
            borderRadius: 16,
            overflow: 'hidden',
            border: '5px solid white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(255,105,180,0.3)',
          }}
        >
          <Img
            src={staticFile(`${PHOTOS_BASE}/${photo.file}`)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          background: 'linear-gradient(135deg, #FF69B4, #A855F7)',
          padding: '12px 40px',
          borderRadius: 50,
          fontSize: 32,
          fontWeight: 700,
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          transform: `scale(${stampScale})`,
          boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
        }}
      >
        {photo.label}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// SCENE: TRANSITION ("But then...")
// ─────────────────────────────────────────────────

function TransitionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOpacity = interpolate(frame, [0, 20, 50, 75], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const textScale = interpolate(frame, [0, 20], [0.8, 1], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dotdotdot = Math.min(3, Math.floor(frame / 10));

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0118',
        position: 'relative',
      }}
    >
      <div
        style={{
          fontSize: 72,
          fontWeight: 300,
          color: 'white',
          fontFamily: 'Georgia, serif',
          fontStyle: 'italic',
          opacity: textOpacity,
          transform: `scale(${textScale})`,
        }}
      >
        But then{'.'.repeat(dotdotdot)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// SCENE: GLOW-UP REVEAL
// ─────────────────────────────────────────────────

function GlowUpScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic slow reveal
  const curtainOpen = interpolate(frame, [0, 60], [0, 100], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Gold border glow pulse
  const glowPulse = interpolate(frame, [60, 90, 120, 150], [0, 30, 15, 25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Text reveal
  const textOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textY = interpolate(frame, [80, 110], [40, 0], {
    easing: Easing.out(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Crown appear
  const crownScale = spring({ frame: Math.max(0, frame - 100), fps, config: { damping: 6 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #0a0118 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Gold shimmer background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(${frame * 2}deg, transparent 40%, rgba(255,215,0,0.05) 50%, transparent 60%)`,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: 80, padding: '0 80px' }}>
        {/* Photo with dramatic reveal */}
        <div style={{ position: 'relative' }}>
          {/* Crown */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: '50%',
              marginLeft: -40,
              fontSize: 70,
              transform: `scale(${crownScale})`,
              zIndex: 10,
              filter: 'drop-shadow(0 4px 10px rgba(255,215,0,0.5))',
            }}
          >
            👑
          </div>

          <div
            style={{
              width: 500,
              height: 650,
              borderRadius: 20,
              overflow: 'hidden',
              border: '4px solid #FFD700',
              boxShadow: `0 0 ${glowPulse}px rgba(255,215,0,0.4), 0 20px 60px rgba(0,0,0,0.5)`,
              clipPath: `inset(0 ${100 - curtainOpen}% 0 0)`,
            }}
          >
            <Img
              src={staticFile(`${PHOTOS_BASE}/scene-09-glow-up.jpeg`)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div
          style={{
            maxWidth: 550,
            opacity: textOpacity,
            transform: `translateY(${textY}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: '#FFD700',
              fontFamily: 'system-ui, sans-serif',
              margin: 0,
              lineHeight: 1.2,
              textShadow: '0 2px 20px rgba(255,215,0,0.3)',
            }}
          >
            She Grew Up.
          </h2>
          <p
            style={{
              fontSize: 30,
              color: 'white',
              fontFamily: 'Georgia, serif',
              fontStyle: 'italic',
              marginTop: 20,
              lineHeight: 1.5,
            }}
          >
            And honestly? She absolutely crushed it.
          </p>
        </div>
      </div>

      <Confetti count={40} />
    </div>
  );
}

// ─────────────────────────────────────────────────
// SCENE: OUTRO - ALL PHOTOS CASCADE
// ─────────────────────────────────────────────────

function OutroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const allPhotos = [
    'scene-01-school-concert.jpeg',
    'scene-02-face-paint.jpeg',
    'scene-03-bed-pose.jpeg',
    'scene-04-yolo.jpeg',
    'scene-05-school-uniform.jpeg',
    'scene-06-dad-selfie.jpeg',
    'scene-07-screaming.jpeg',
    'scene-08-sweet-selfie.jpeg',
    'scene-09-glow-up.jpeg',
  ];

  // Photo grid positions (scattered like a scrapbook)
  const positions = [
    { x: 5, y: 5, rot: -8, size: 200 },
    { x: 75, y: 3, rot: 5, size: 180 },
    { x: 40, y: 2, rot: -3, size: 190 },
    { x: 10, y: 50, rot: 7, size: 170 },
    { x: 72, y: 48, rot: -6, size: 185 },
    { x: 38, y: 55, rot: 4, size: 175 },
    { x: 5, y: 70, rot: -5, size: 165 },
    { x: 70, y: 72, rot: 3, size: 180 },
    { x: 38, y: 75, rot: -2, size: 195 },
  ];

  // Main text
  const mainScale = spring({ frame, fps, config: { damping: 8 } });
  const mainGlow = interpolate(frame, [0, 30, 60], [0, 25, 15], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at center, #1a0533 0%, #0a0118 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Confetti count={80} />

      {/* Scattered photos behind text */}
      {allPhotos.map((photo, i) => {
        const delay = i * 3;
        const photoScale = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12 } });
        const pos = positions[i];

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: `rotate(${pos.rot}deg) scale(${photoScale * 0.8})`,
              opacity: 0.35,
            }}
          >
            <div
              style={{
                width: pos.size,
                height: pos.size * 0.75,
                borderRadius: 10,
                overflow: 'hidden',
                border: '3px solid white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
              }}
            >
              <Img
                src={staticFile(`${PHOTOS_BASE}/${photo}`)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );
      })}

      {/* Main text overlay */}
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${mainScale})`,
          zIndex: 10,
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            background: 'linear-gradient(135deg, #FFD700, #FF6347, #FF69B4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: `drop-shadow(0 0 ${mainGlow}px rgba(255,215,0,0.4))`,
            lineHeight: 1.1,
          }}
        >
          Happy 18th
          <br />
          Birthday
        </div>
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            fontFamily: 'system-ui, sans-serif',
            color: 'white',
            marginTop: 10,
            textShadow: '0 0 30px rgba(255,215,0,0.3), 0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          ESTHER
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#FFD700',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            marginTop: 15,
          }}
        >
          The world isn't ready. But you definitely are. 💛
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────
// MAIN COMPOSITION
// ─────────────────────────────────────────────────

export const Esther18Birthday: React.FC<Esther18Props> = ({ audioEnabled }) => {
  const { fps } = useVideoConfig();
  const TRANS = 15; // 0.5s transition overlap

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Full narration audio */}
      {audioEnabled && (
        <Audio
          src={staticFile(`${PHOTOS_BASE}/narration-full.mp3`)}
          volume={1}
        />
      )}

      <TransitionSeries>
        {/* Scene 1: INTRO - "Eighteen years ago..." */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.intro * fps)}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 2: SCHOOL CONCERT - "It started at the school concert" */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.schoolConcert * fps)}>
          <PhotoScene
            photoFile="scene-01-school-concert.jpeg"
            cartoonFile="cartoon-school-concert.png"
            caption="Where it all began..."
            subcaption="Five years old and already judging everyone"
            accentColor="#FF69B4"
            photoPosition="left"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />

        {/* Scene 3: FACE PAINT - "Then came the face painting phase" */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.facePaint * fps)}>
          <PhotoScene
            photoFile="scene-02-face-paint.jpeg"
            cartoonFile="cartoon-face-paint.png"
            caption="The Face Painting Phase"
            subcaption="She absolutely committed to it"
            accentColor="#4ECDC4"
            photoPosition="right"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 4: SILLY MONTAGE - "This child invented poses..." */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.sillyPhase * fps)}>
          <SillyMontage />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-left' })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 20 })}
        />

        {/* Scene 5: YOLO - "And the YOLO hoodie" */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.yolo * fps)}>
          <PhotoScene
            photoFile="scene-04-yolo.jpeg"
            cartoonFile="cartoon-yolo.png"
            caption="YOLO Before It Was Cool"
            subcaption="Living her best life since day one"
            accentColor="#22D3EE"
            photoPosition="center"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: TRANS })}
        />

        {/* Scene 6: DAD MOMENTS - "Through it all..." */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.dadMoments * fps)}>
          <PhotoScene
            photoFile="scene-06-dad-selfie.jpeg"
            cartoonFile="cartoon-dad-selfie.png"
            caption="Arsenal Household"
            subcaption="Through it all, the jersey stayed on"
            accentColor="#FB923C"
            photoPosition="left"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />

        {/* Scene 7: TRANSITION - "But then..." */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.transition * fps)}>
          <TransitionScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 25 })}
        />

        {/* Scene 8: GLOW-UP - "My little baby... grew up" */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.glowUp * fps)}>
          <GlowUpScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 20 })}
        />

        {/* Scene 9: OUTRO - "Happy 18th birthday Esther!" */}
        <TransitionSeries.Sequence durationInFrames={Math.round(SCENE_DURATIONS.outro * fps)}>
          <OutroScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </div>
  );
};
