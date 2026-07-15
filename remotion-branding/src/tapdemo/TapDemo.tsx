/**
 * TapDemo — PROOF of the "annotate an existing recording" idea.
 *
 * Takes a real in-app screen recording (iOS ReplayKit capture of the e-wizer
 * Daily Hygiene flow), plays it inside a phone bezel, and fires an animated
 * Ecowize tap-ripple on a button press — wrapped in the shared EcowizeBookends
 * intro/outro. This is the app-demo template: intro → annotated recording →
 * outro, all one composition, one render.
 *
 * The tap markers are the new primitive. Each is authored in NORMALIZED
 * clip-space (0..1 of the source video), so a ring survives any display scale —
 * same resolution-independence trick as lib/annotations.ts / the Box mapper.
 */
import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SKY, SKY_DEEP, EMERALD, FG, FG2, MUTED, DISPLAY, BODY } from '../kit/palette';
import {
  BrandIntro,
  BrandOutro,
  BOOKEND_INTRO_FRAMES,
  BOOKEND_OUTRO_FRAMES,
} from '../brand/EcowizeBookends';

// ─── The clip + its tap annotations (the authorable schema) ──────────────────
const CLIP = 'tapdemo/hygiene-clip.mp4';
const CLIP_FRAMES = 270; // 9s @ 30fps

type Tap = {
  /** Clip-local frame the tap fires on. */
  atFrame: number;
  /** Normalized 0..1 position in the source video. */
  nx: number;
  ny: number;
  /** Diameter of the ripple at full expand, in screen px. */
  size?: number;
  /** Caption chip shown beside the tap. */
  label: string;
};

const TAPS: Tap[] = [
  { atFrame: 42, nx: 0.235, ny: 0.393, size: 210, label: 'Scan QR code' },
];

// Phone geometry inside the 1920×1080 canvas
const SRC_W = 660;
const SRC_H = 1434;
const PHONE_SCALE = 0.66;
const VID_W = Math.round(SRC_W * PHONE_SCALE); // 436
const VID_H = Math.round(SRC_H * PHONE_SCALE); // 946
const PHONE_X = 250;
const PHONE_Y = Math.round((1080 - VID_H) / 2); // 67
const BEZEL_PAD = 14;

// ─── The tap ripple ──────────────────────────────────────────────────────────
const TapRipple: React.FC<{ tap: Tap; clipFrame: number }> = ({ tap, clipFrame }) => {
  const { fps } = useVideoConfig();
  const cx = PHONE_X + tap.nx * VID_W;
  const cy = PHONE_Y + tap.ny * VID_H;
  const size = tap.size ?? 190;
  const local = clipFrame - tap.atFrame;

  // Two expanding rings, staggered
  const rings = [0, 9].map((offset, i) => {
    const l = local - offset;
    const p = interpolate(l, [0, 32], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
    const scale = 0.32 + p * 1.15;
    const opacity = interpolate(l, [0, 5, 32], [0, 0.75, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return { i, scale, opacity };
  });

  // Center dot: quick spring pop, then holds faint
  const pop = spring({ frame: local, fps, durationInFrames: 16, config: { damping: 140 } });
  const dotOpacity = interpolate(local, [0, 6, 40, 54], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Label chip fades in with the tap, holds
  const labelReveal = spring({ frame: local - 4, fps, durationInFrames: 18, config: { damping: 150 } });
  const labelFade = interpolate(local, [0, 8, 46, 60], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  if (local < -2 || local > 64) return null;

  return (
    <>
      {rings.map(({ i, scale, opacity }) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: cx - size / 2,
            top: cy - size / 2,
            width: size,
            height: size,
            borderRadius: size,
            border: `4px solid ${SKY}`,
            boxShadow: `0 0 24px rgba(60,182,224,0.55)`,
            opacity,
            transform: `scale(${scale})`,
          }}
        />
      ))}
      {/* solid center dot */}
      <div
        style={{
          position: 'absolute',
          left: cx - 22,
          top: cy - 22,
          width: 44,
          height: 44,
          borderRadius: 44,
          background: `radial-gradient(circle at 40% 35%, ${SKY}, ${SKY_DEEP})`,
          boxShadow: `0 0 26px rgba(60,182,224,0.7)`,
          opacity: dotOpacity,
          transform: `scale(${0.6 + pop * 0.4})`,
        }}
      />
      {/* label chip */}
      <div
        style={{
          position: 'absolute',
          left: cx + size / 2 - 8,
          top: cy - 26,
          opacity: labelFade,
          transform: `translateX(${interpolate(labelReveal, [0, 1], [-14, 0])}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 18px',
          borderRadius: 999,
          background: '#FFFFFF',
          border: `1px solid rgba(21,130,171,0.18)`,
          boxShadow: '0 12px 30px rgba(7,16,24,0.22)',
          fontFamily: BODY,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 800, color: MUTED, letterSpacing: 1 }}>TAP</span>
        <span style={{ fontSize: 24, fontWeight: 900, color: FG }}>{tap.label}</span>
      </div>
    </>
  );
};

// ─── The demo scene: phone + video + taps + side caption ─────────────────────
const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, durationInFrames: 26, config: { damping: 170 } });

  return (
    <AbsoluteFill style={{ background: 'linear-gradient(135deg, #0C1723, #071018 70%)', fontFamily: BODY }}>
      {/* soft sky glow behind the phone */}
      <div
        style={{
          position: 'absolute',
          left: PHONE_X - 120,
          top: PHONE_Y - 40,
          width: VID_W + 240,
          height: VID_H + 80,
          background: 'radial-gradient(circle at 50% 40%, rgba(60,182,224,0.22), transparent 62%)',
          filter: 'blur(8px)',
        }}
      />

      {/* phone bezel */}
      <div
        style={{
          position: 'absolute',
          left: PHONE_X - BEZEL_PAD,
          top: PHONE_Y - BEZEL_PAD,
          width: VID_W + BEZEL_PAD * 2,
          height: VID_H + BEZEL_PAD * 2,
          borderRadius: 54,
          background: '#05090D',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 40px 90px rgba(0,0,0,0.5)',
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
        }}
      />
      {/* the recording, clipped to the phone screen */}
      <div
        style={{
          position: 'absolute',
          left: PHONE_X,
          top: PHONE_Y,
          width: VID_W,
          height: VID_H,
          borderRadius: 42,
          overflow: 'hidden',
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
        }}
      >
        <OffthreadVideo src={staticFile(CLIP)} style={{ width: VID_W, height: VID_H, objectFit: 'cover' }} />
      </div>

      {/* tap ripples (share the same clip frame as the video) */}
      {TAPS.map((tap, i) => (
        <TapRipple key={i} tap={tap} clipFrame={frame} />
      ))}

      {/* side caption */}
      <div
        style={{
          position: 'absolute',
          left: 840,
          top: 300,
          width: 880,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 46, height: 46, borderRadius: 23, background: `linear-gradient(135deg, ${SKY}, ${SKY_DEEP})`, boxShadow: '0 0 30px rgba(60,182,224,0.5)' }} />
          <div style={{ color: SKY, fontSize: 26, fontWeight: 950, letterSpacing: 4, textTransform: 'uppercase' }}>Step 1 · Start your shift</div>
        </div>
        <div style={{ marginTop: 26, color: '#FFFFFF', fontSize: 76, lineHeight: 1.02, fontWeight: 950, fontFamily: DISPLAY }}>
          Scan a zone to check in
        </div>
        <div style={{ marginTop: 26, color: 'rgba(255,255,255,0.74)', fontSize: 32, lineHeight: 1.3, fontWeight: 600 }}>
          From Home, tap <span style={{ color: SKY, fontWeight: 800 }}>Scan QR code</span> to open your first
          area. The ring shows exactly where to press.
        </div>
        <div style={{ marginTop: 40, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRadius: 16, background: 'rgba(31,156,90,0.14)', border: '1px solid rgba(31,156,90,0.4)' }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: EMERALD }} />
          <span style={{ color: '#CFF0DD', fontSize: 26, fontWeight: 800 }}>Real in-app recording — not a mockup</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Full composition: intro → demo → outro ──────────────────────────────────
export const TAPDEMO_FPS = 30;
export const TAPDEMO_FRAMES = BOOKEND_INTRO_FRAMES + CLIP_FRAMES + BOOKEND_OUTRO_FRAMES;

export const TapDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: '#071018' }}>
      <Sequence durationInFrames={BOOKEND_INTRO_FRAMES}>
        <BrandIntro
          title="Daily Hygiene"
          tagline="Your in-app walkthrough — every tap, shown on the real screen."
          accentA={SKY}
          accentB={SKY_DEEP}
        />
      </Sequence>

      <Sequence from={BOOKEND_INTRO_FRAMES} durationInFrames={CLIP_FRAMES}>
        <DemoScene />
      </Sequence>

      <Sequence from={BOOKEND_INTRO_FRAMES + CLIP_FRAMES} durationInFrames={BOOKEND_OUTRO_FRAMES}>
        <BrandOutro
          outroKicker="e-wizer field guide"
          outroHeadline="That's your shift start"
          outroBody="Scan · check · sign off. The whole flow, guided tap by tap."
          outroCards={[
            { label: 'Scan', color: SKY },
            { label: 'Check', color: EMERALD },
            { label: 'Sign off', color: SKY_DEEP },
          ]}
          accentA={SKY}
          accentB={SKY_DEEP}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
