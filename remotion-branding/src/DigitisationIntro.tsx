import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  staticFile,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/**
 * Scene 1 — "Paper → Digital" cold open.
 * The Ecowize paper way (a mountain of files) sweeps away and is replaced by the
 * digital platform e-wizer on a tablet, with the e-wizer character as the through-line,
 * landing on "Welcome to the Incidents, Injuries & Near-Misses module".
 *
 * 1350 frames @ 30fps = 45s, synced to public/scene1-narration.mp3 (~44.2s).
 *
 * Beat timeline (frames):
 *   A  Paper world        0   – 500   ("…attention to detail… all of it lived on paper")
 *   B  Sweep away         500 – 600   ("Today, that changes.")
 *   C  Digital / tablet   570 – 930   ("…just wiser. Meet e-wiser… right in your hand")
 *   D  Welcome to IINM    930 – 1350  ("Welcome to the Incidents, Injuries & Near-Misses…")
 */

const ECOWIZE_BLUE = '#1B6AC9';
const TEAL = '#14B8A6';
const INK = '#0F172A';
const MUTED = '#64748B';
const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const DigitisationIntro: React.FC = () => {
  // Visual beats were tuned to a 44.2s VO; the production voice is ~39.4s, so run the
  // visual clock proportionally faster (audio stays real-time via <Audio>) to keep sync.
  const frame = useCurrentFrame() * (44.2 / 39.42);
  const { fps, width, height } = useVideoConfig();

  // ── background: light → soft teal wash for the digital half ──
  const tealWash = interpolate(frame, [540, 660], [0, 1], clamp);

  // ── Ecowize logo (top, beat A) ──
  const logoIn = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 90 } });
  const logoOut = interpolate(frame, [500, 580], [1, 0], clamp);
  const logoOpacity = Math.min(logoIn, logoOut);

  // ── Paper stack: rise in (A), then sweep up & out (B) ──
  const paperIn = spring({ frame: frame - 20, fps, config: { damping: 16, stiffness: 70 } });
  const paperSweep = interpolate(frame, [500, 600], [0, 1], clamp); // 0 = settled, 1 = gone
  const paperY = interpolate(paperIn, [0, 1], [120, 0]) - paperSweep * 1100;
  const paperRot = paperSweep * -14;
  const paperOpacity = Math.min(
    interpolate(paperIn, [0, 1], [0, 1]),
    interpolate(frame, [520, 595], [1, 0], clamp),
  );
  const paperScale = interpolate(paperIn, [0, 1], [0.86, 1]) * (1 - paperSweep * 0.12);

  // ── Tablet: rises from below with the e-wizer platform (C) ──
  const tabletSpring = spring({ frame: frame - 580, fps, config: { damping: 18, stiffness: 80 } });
  const tabletY = interpolate(tabletSpring, [0, 1], [420, 0]);
  const tabletScale = interpolate(tabletSpring, [0, 1], [0.7, 1]);
  const tabletOpacity = interpolate(frame, [575, 640], [0, 1], clamp);
  const tabletGlow = 0.35 + 0.25 * Math.sin(frame / 14);
  // ease the tablet up a touch into beat D to make room for the title
  const tabletShift = interpolate(frame, [930, 1010], [0, -210], clamp);
  const tabletDscale = interpolate(frame, [930, 1010], [1, 0.58], clamp);

  // ── e-wizer character: enters from the right (A), persists, settles right (D) ──
  const charIn = spring({ frame: frame - 60, fps, config: { damping: 18, stiffness: 70 } });
  const charX = interpolate(charIn, [0, 1], [460, 0]);
  const charOpacity = interpolate(frame, [60, 130], [0, 1], clamp);
  const charFloat = Math.sin(frame / 24) * 8;

  // ── text helpers ──
  const fadeSlide = (start: number, end: number, fadeOut?: [number, number]) => {
    const o = interpolate(frame, [start, end], [0, 1], clamp);
    const y = interpolate(frame, [start, end], [26, 0], clamp);
    const oo = fadeOut ? interpolate(frame, fadeOut, [1, 0], clamp) : 1;
    return { opacity: Math.min(o, oo), transform: `translateY(${y}px)` };
  };

  // Beat C wordmark + tagline
  const wmIn = fadeSlide(620, 690, [930, 990]);
  // Beat D title
  const titleScale = spring({ frame: frame - 950, fps, config: { damping: 16, stiffness: 90 } });
  const underline = interpolate(frame, [1010, 1090], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: 'hidden' }}>
      {/* light base background */}
      <AbsoluteFill
        style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #F8FBFD 62%, #F2F6FA 100%)' }}
      />
      {/* teal wash for the digital half */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(120% 100% at 50% 120%, #DBF5F1 0%, #EAFAF7 40%, rgba(234,250,247,0) 75%)',
          opacity: tealWash,
        }}
      />

      {/* Ecowize logo (top center, beat A) */}
      <div
        style={{
          position: 'absolute',
          top: 90,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: logoOpacity,
          transform: `translateY(${interpolate(logoIn, [0, 1], [-30, 0])}px)`,
        }}
      >
        <Img src={staticFile('images/ecowize-logo.webp')} style={{ height: 96 }} />
      </div>

      {/* Paper stack (beats A → B) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '52%',
          transform: `translate(-50%, -50%) translateY(${paperY}px) rotate(${paperRot}deg) scale(${paperScale})`,
          opacity: paperOpacity,
          width: 720,
          height: 720,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Img
          src={staticFile('images/scene-paper-stack.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Tablet with the e-wizer platform (beats C → D) */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%, -50%) translateY(${tabletY + tabletShift}px) scale(${tabletScale * tabletDscale})`,
          opacity: tabletOpacity,
          width: 640,
          height: 640,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: `drop-shadow(0 30px 60px rgba(20,184,166,${0.18 + tabletGlow * 0.15}))`,
        }}
      >
        <Img
          src={staticFile('images/scene-tablet-ewizer.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
        />
      </div>

      {/* e-wizer character (enters A, persists) */}
      <div
        style={{
          position: 'absolute',
          right: 56,
          bottom: 36,
          width: 400,
          height: 548,
          opacity: charOpacity,
          transform: `translateX(${charX}px) translateY(${charFloat}px)`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        <Img
          src={staticFile('images/ewizer-branded.png')}
          style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Beat A text: attention to detail */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          bottom: 150,
          ...fadeSlide(70, 150, [470, 540]),
        }}
      >
        <div style={{ fontSize: 22, letterSpacing: 4, fontWeight: 700, color: ECOWIZE_BLUE, textTransform: 'uppercase' }}>
          The Ecowize Standard
        </div>
        <div style={{ fontSize: 66, fontWeight: 800, color: INK, lineHeight: 1.05, marginTop: 12 }}>
          Attention to detail.
        </div>
        <div style={{ fontSize: 30, color: MUTED, marginTop: 14 }}>
          Every check. Every audit. Every record.
        </div>
      </div>

      {/* Beat A→B caption near the stack */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 90,
          textAlign: 'center',
          fontSize: 26,
          color: MUTED,
          fontStyle: 'italic',
          ...fadeSlide(300, 360, [490, 540]),
        }}
      >
        …but all of it lived on paper.
      </div>

      {/* Beat C: e-wizer wordmark + tagline */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 34,
          textAlign: 'center',
          opacity: wmIn.opacity,
          transform: wmIn.transform,
        }}
      >
        <div style={{ fontSize: 26, color: MUTED, fontWeight: 600 }}>The same precision. Now wiser.</div>
        <div style={{ fontSize: 64, fontWeight: 800, marginTop: 4, letterSpacing: -1 }}>
          <span style={{ color: TEAL }}>e</span>
          <span style={{ color: INK }}>-wizer</span>
        </div>
        <div style={{ fontSize: 23, color: ECOWIZE_BLUE, fontWeight: 600, marginTop: 2 }}>
          Your management system. Now digital.
        </div>
      </div>

      {/* Beat D: Welcome to the IINM module */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 430,
          bottom: 150,
          textAlign: 'center',
          opacity: interpolate(frame, [945, 1010], [0, 1], clamp),
          transform: `scale(${interpolate(titleScale, [0, 1], [0.9, 1])})`,
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 6, fontWeight: 700, color: TEAL, textTransform: 'uppercase' }}>
          Welcome to the module
        </div>
        <div style={{ fontSize: 70, fontWeight: 800, color: INK, lineHeight: 1.05, marginTop: 14 }}>
          Incidents, Injuries &amp; Near-Misses
        </div>
        <div
          style={{
            height: 8,
            width: `${underline * 520}px`,
            background: `linear-gradient(90deg, ${TEAL}, ${ECOWIZE_BLUE})`,
            borderRadius: 8,
            margin: '26px auto 0',
          }}
        />
        <div style={{ fontSize: 30, color: MUTED, marginTop: 22 }}>
          Captured, classified, and closed out — the moment it happens.
        </div>
      </div>

      <Audio src={staticFile('scene1-narration.mp3')} />
    </AbsoluteFill>
  );
};
