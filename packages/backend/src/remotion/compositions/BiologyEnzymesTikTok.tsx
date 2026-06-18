/**
 * Enzymes — TikTok (9:16) v1
 *
 * Cambridge 9700 Topic 3.1 — Lock & Key vs Induced Fit
 * Temperature/pH effects, denaturation.
 *
 * Pure CSS motion graphics.
 * 8 scenes, ~102 seconds, 1080×1920.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';

// ── Constants ────────────────────────────────────────────────────────
const FPS = 30;
const TOTAL_DURATION_S = 102;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',
  success: '#22c55e',
  accent: '#c084fc',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  enzyme: '#22d3ee',
  substrate: '#f97316',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved + manually corrected ──────────────────
const DEFAULT_CUES: Record<string, number> = {
  'lied': 0.66,
  'lock-and-key': 5.38,
  'substrate-fits': 8.36,
  'rigid': 14.66,
  'product': 17.06,
  'simplified': 19.94,
  'induced-fit': 21.60,
  'changes-shape': 26.04,
  'moulds': 29.40,       // manually corrected (Whisper: "molds")
  'hand-ball': 31.82,
  'strain': 34.06,
  'activation': 36.82,
  'lower': 40.58,
  'faster': 44.90,
  'millions': 46.48,
  'kills': 49.56,
  'temperature': 50.86,
  'low-temp': 53.72,
  'few-collisions': 54.94,
  'increases': 58.34,
  'kinetic': 59.58,
  'optimum': 63.62,
  'maximum': 65.04,
  '37-degrees': 68.04,
  'above-optimum': 69.68,
  'vibrations': 71.42,
  'hydrogen-bonds': 72.18,
  'tertiary': 73.84,
  'permanently': 76.70,
  'denatured': 80.56,
  'ph': 84.82,
  'ionic': 88.76,
  'induced-not-lock': 94.54,
  'denatured-not-destroyed': 97.22,  // manually corrected to CTA section
  'guaranteed': 100.82,
};

// ── Types ────────────────────────────────────────────────────────────
export interface BiologyEnzymesTikTokProps {
  audioEnabled?: boolean;
  cueOverrides?: Record<string, number>;
}

// ── Hooks ────────────────────────────────────────────────────────────

function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { opacity, translateY, isActive: frame >= cueFrame };
}

function useCueSpring(cueTimeSeconds: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({ frame: frame - cueFrame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = frame >= cueFrame ? progress : 0;
  const scale = frame >= cueFrame ? interpolate(progress, [0, 1], [0.85, 1]) : 0;
  return { opacity, scale, isActive: frame >= cueFrame };
}

// ── Shared Components ────────────────────────────────────────────────

const GlowText: React.FC<{
  children: React.ReactNode; color?: string; fontSize?: number; style?: React.CSSProperties;
}> = ({ children, color = T.primary, fontSize = 48, style }) => (
  <div style={{
    fontFamily: T.font, fontWeight: 800, fontSize, color,
    textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`, textAlign: 'center', ...style,
  }}>{children}</div>
);

const Badge: React.FC<{
  label: string; color: string; opacity: number; scale?: number; fontSize?: number;
}> = ({ label, color, opacity, scale = 1, fontSize = 24 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    fontFamily: T.font, fontWeight: 800, fontSize, color,
    padding: '10px 28px', border: `2px solid ${color}60`, borderRadius: 30,
    background: `${color}15`, textShadow: `0 0 20px ${color}40`,
  }}>{label}</div>
);

// Enzyme shape (simplified active site)
const EnzymeShape: React.FC<{
  color: string; isRigid?: boolean; morphAmount?: number; size?: number;
}> = ({ color, isRigid = true, morphAmount = 0, size = 200 }) => {
  // Pac-man-like shape that closes for induced fit
  const mouthAngle = isRigid ? 40 : interpolate(morphAmount, [0, 1], [40, 10]);
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="enzymeGlow">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <path
        d={`M ${r} ${r} L ${r + r * Math.cos(-mouthAngle * Math.PI / 180)} ${r + r * Math.sin(-mouthAngle * Math.PI / 180)} A ${r} ${r} 0 1 0 ${r + r * Math.cos(mouthAngle * Math.PI / 180)} ${r + r * Math.sin(mouthAngle * Math.PI / 180)} Z`}
        fill={`${color}30`}
        stroke={color}
        strokeWidth={3}
        filter="url(#enzymeGlow)"
      />
      <text x={r - 20} y={r + 8} fontFamily={T.font} fontSize={16} fill={color} fontWeight={700}>
        Active{'\n'}Site
      </text>
    </svg>
  );
};

// Substrate blob
const SubstrateBlob: React.FC<{
  x: number; y: number; opacity: number; color?: string; size?: number;
}> = ({ x, y, opacity, color = T.substrate, size = 50 }) => (
  <div style={{
    position: 'absolute', left: x, top: y, opacity,
    width: size, height: size, borderRadius: '40% 60% 50% 50%',
    background: `${color}40`, border: `2px solid ${color}`,
    boxShadow: `0 0 20px ${color}30`,
  }} />
);

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const liedCue = useCueSpring(ct('lied'));

  // Shaking enzyme
  const shake = Math.sin(frame / 3) * 3;

  // Ken Burns slow zoom
  const hookScale = interpolate(frame, [0, 5 * 30], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/biology/enzymes/hook-enzyme.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.4)',
      }} />

      {/* Content overlay */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontFamily: T.font, fontWeight: 400, fontSize: 28, color: T.textMuted,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          marginBottom: 16,
        }}>
          Your textbook
        </div>

        <GlowText fontSize={64} color={T.danger} style={{
          opacity: liedCue.opacity, transform: `scale(${liedCue.scale})`,
        }}>
          LIED TO YOU
        </GlowText>

        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.textMuted,
          opacity: liedCue.opacity, marginTop: 12,
        }}>
          about enzymes
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Lock & Key ──────────────────────────────────────────────
const LockKeyScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lockCue = useCue(ct('lock-and-key'));
  const substrateCue = useCue(ct('substrate-fits'));
  const rigidCue = useCue(ct('rigid'));
  const productCue = useCue(ct('product'));
  const simpleCue = useCue(ct('simplified'));

  // Substrate sliding in
  const slideIn = substrateCue.isActive
    ? interpolate(frame - ct('substrate-fits') * fps, [0, 30], [200, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 200;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: lockCue.opacity }}>
        <GlowText fontSize={36} color={T.enzyme}>LOCK & KEY MODEL</GlowText>
      </div>

      {/* Visual: Enzyme + Substrate */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
        <div style={{ opacity: lockCue.opacity }}>
          <EnzymeShape color={T.enzyme} isRigid={true} size={180} />
        </div>
        <div style={{ opacity: substrateCue.opacity, transform: `translateX(-${slideIn}px)` }}>
          <div style={{
            width: 60, height: 60, borderRadius: '35% 65% 50% 50%',
            background: `${T.substrate}40`, border: `3px solid ${T.substrate}`,
            boxShadow: `0 0 20px ${T.substrate}40`,
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <div style={{
          opacity: rigidCue.opacity, transform: `translateY(${rigidCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text,
          padding: '10px 24px', background: `${T.enzyme}10`, borderRadius: 10,
        }}>
          Active site is <span style={{ color: T.enzyme, fontWeight: 700 }}>rigid</span>
        </div>
        <div style={{
          opacity: productCue.opacity, transform: `translateY(${productCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text,
          padding: '10px 24px', background: `${T.substrate}10`, borderRadius: 10,
        }}>
          Substrate slots in → <span style={{ color: T.success, fontWeight: 700 }}>Product released</span>
        </div>
        <Badge
          label="THE SIMPLIFIED VERSION"
          color={T.warning}
          opacity={simpleCue.opacity}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Induced Fit ─────────────────────────────────────────────
const InducedFitScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inducedCue = useCue(ct('induced-fit'));
  const changesCue = useCue(ct('changes-shape'));
  const mouldsCue = useCue(ct('moulds'));
  const handCue = useCue(ct('hand-ball'));
  const strainCue = useCue(ct('strain'));
  const activationCue = useCue(ct('activation'));

  // Enzyme morphing
  const morphProgress = changesCue.isActive
    ? interpolate(frame - ct('changes-shape') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: inducedCue.opacity }}>
        <GlowText fontSize={36} color={T.success}>INDUCED FIT MODEL</GlowText>
        <div style={{ fontFamily: T.font, fontSize: 20, color: T.success, textAlign: 'center', marginTop: 4 }}>
          The real one
        </div>
      </div>

      {/* Morphing enzyme */}
      <div style={{ opacity: changesCue.opacity, marginBottom: 30 }}>
        <EnzymeShape color={T.success} isRigid={false} morphAmount={morphProgress} size={200} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', padding: '0 50px' }}>
        <div style={{
          opacity: changesCue.opacity, transform: `translateY(${changesCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
          padding: '10px 24px', background: `${T.success}10`, borderRadius: 10,
        }}>
          Active site <span style={{ color: T.success, fontWeight: 700 }}>CHANGES SHAPE</span>
        </div>
        <div style={{
          opacity: handCue.opacity, transform: `translateY(${handCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
        }}>
          Like a <span style={{ color: T.gold }}>hand closing around a ball</span>
        </div>
        <div style={{
          opacity: strainCue.opacity, transform: `translateY(${strainCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
        }}>
          Puts <span style={{ color: T.danger, fontWeight: 700 }}>strain</span> on the bonds
        </div>
        <Badge
          label="↓ LOWERS ACTIVATION ENERGY"
          color={T.primary}
          opacity={activationCue.opacity}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: What Enzymes Do ─────────────────────────────────────────
const WhatEnzymesDoScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lowerCue = useCue(ct('lower'));
  const fasterCue = useCueSpring(ct('faster'));
  const millionsCue = useCueSpring(ct('millions'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{
          opacity: lowerCue.opacity, transform: `translateY(${lowerCue.translateY}px)`,
        }}>
          <GlowText fontSize={32} color={T.textMuted}>They lower the</GlowText>
          <GlowText fontSize={48} color={T.primary}>ACTIVATION ENERGY</GlowText>
        </div>

        {/* Energy diagram simplified */}
        <div style={{
          opacity: fasterCue.opacity,
          width: 800, height: 200, position: 'relative',
        }}>
          {/* Without enzyme - high hump */}
          <svg width={800} height={200} style={{ position: 'absolute' }}>
            <path d="M 50 180 Q 200 180 300 40 Q 400 180 750 180"
              fill="none" stroke={`${T.danger}60`} strokeWidth={3} strokeDasharray="8 4" />
            <text x={280} y={30} fontFamily={T.font} fontSize={14} fill={T.danger}>Without enzyme</text>
            <path d="M 50 180 Q 200 180 300 100 Q 400 180 750 180"
              fill="none" stroke={T.success} strokeWidth={3} />
            <text x={280} y={95} fontFamily={T.font} fontSize={14} fill={T.success}>With enzyme</text>
          </svg>
        </div>

        <div style={{
          opacity: millionsCue.opacity, transform: `scale(${millionsCue.scale})`,
        }}>
          <GlowText fontSize={56} color={T.gold}>MILLIONS</GlowText>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.textMuted, textAlign: 'center',
          }}>
            of times faster
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Temperature ─────────────────────────────────────────────
const TemperatureScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const killsCue = useCue(ct('kills'));
  const lowCue = useCue(ct('low-temp'));
  const increasesCue = useCue(ct('increases'));
  const optimumCue = useCueSpring(ct('optimum'));
  const degreesCue = useCue(ct('37-degrees'));

  // Temperature graph animation
  const graphProgress = increasesCue.isActive
    ? interpolate(frame - ct('increases') * fps, [0, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: killsCue.opacity }}>
        <GlowText fontSize={36} color={T.danger}>WHAT KILLS AN ENZYME?</GlowText>
      </div>

      {/* Temperature curve */}
      <div style={{ width: 800, height: 350, position: 'relative', marginTop: 40 }}>
        <svg width={800} height={350} style={{ opacity: lowCue.opacity }}>
          {/* Axes */}
          <line x1={100} y1={300} x2={750} y2={300} stroke={T.textMuted} strokeWidth={2} />
          <line x1={100} y1={300} x2={100} y2={30} stroke={T.textMuted} strokeWidth={2} />
          <text x={400} y={340} fontFamily={T.font} fontSize={18} fill={T.textMuted} textAnchor="middle">Temperature →</text>
          <text x={60} y={170} fontFamily={T.font} fontSize={18} fill={T.textMuted} textAnchor="middle" transform="rotate(-90, 60, 170)">Rate →</text>

          {/* Curve (bell shape) */}
          <clipPath id="tempCurveClip">
            <rect x={100} y={0} width={650 * graphProgress} height={350} />
          </clipPath>
          <path
            d="M 100 290 Q 200 280 300 200 Q 400 80 450 60 Q 500 80 550 200 Q 600 280 700 290"
            fill="none" stroke={T.primary} strokeWidth={4}
            clipPath="url(#tempCurveClip)"
          />

          {/* Optimum marker */}
          {optimumCue.isActive && (
            <>
              <line x1={450} y1={60} x2={450} y2={300} stroke={T.gold} strokeWidth={2} strokeDasharray="6 4" />
              <circle cx={450} cy={60} r={8} fill={T.gold} />
              <text x={450} y={45} fontFamily={T.font} fontSize={16} fill={T.gold} textAnchor="middle" fontWeight={700}>
                OPTIMUM
              </text>
            </>
          )}
        </svg>
      </div>

      <div style={{ display: 'flex', gap: 24, opacity: degreesCue.opacity }}>
        <Badge label="Human enzymes: 37°C" color={T.gold} opacity={1} fontSize={22} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Denaturation ────────────────────────────────────────────
const DenaturationScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const aboveCue = useCue(ct('above-optimum'));
  const vibCue = useCue(ct('vibrations'));
  const hBondsCue = useCue(ct('hydrogen-bonds'));
  const tertiaryCue = useCue(ct('tertiary'));
  const permCue = useCueSpring(ct('permanently'));
  const denaturedCue = useCueSpring(ct('denatured'));

  // Shaking for vibrations
  const shakeX = vibCue.isActive ? Math.sin(frame * 0.8) * 4 : 0;
  const shakeY = vibCue.isActive ? Math.cos(frame * 0.6) * 3 : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: aboveCue.opacity }}>
        <GlowText fontSize={36} color={T.danger}>ABOVE THE OPTIMUM</GlowText>
      </div>

      {/* Breaking enzyme visual */}
      <div style={{
        transform: `translate(${shakeX}px, ${shakeY}px)`,
        opacity: vibCue.opacity,
        marginBottom: 20,
      }}>
        <EnzymeShape color={denaturedCue.isActive ? T.danger : T.enzyme} isRigid={false}
          morphAmount={denaturedCue.isActive ? 0.9 : 0} size={180} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center', padding: '0 50px' }}>
        <div style={{
          opacity: vibCue.opacity, transform: `translateY(${vibCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '8px 20px', background: `${T.danger}10`, borderRadius: 10, width: 880,
        }}>
          Vibrations break <span style={{ color: T.danger, fontWeight: 700 }}>hydrogen bonds</span>
        </div>
        <div style={{
          opacity: tertiaryCue.opacity, transform: `translateY(${tertiaryCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '8px 20px', background: `${T.accent}10`, borderRadius: 10, width: 880,
        }}>
          <span style={{ color: T.accent, fontWeight: 700 }}>Tertiary structure</span> unravels
        </div>
        <div style={{
          opacity: permCue.opacity, transform: `scale(${permCue.scale})`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '8px 20px', background: `${T.warning}10`, borderRadius: 10, width: 880,
        }}>
          Active site changes shape <span style={{ color: T.warning, fontWeight: 700 }}>permanently</span>
        </div>
        <div style={{
          opacity: denaturedCue.opacity, transform: `scale(${denaturedCue.scale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 10,
        }}>
          <GlowText fontSize={44} color={T.danger}>DENATURED</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted }}>
            Not <span style={{ textDecoration: 'line-through' }}>destroyed</span> — denatured
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: pH ──────────────────────────────────────────────────────
const PhScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const phCue = useCue(ct('ph'));
  const ionicCue = useCue(ct('ionic'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ opacity: phCue.opacity }}>
          <GlowText fontSize={42} color={T.accent}>SAME WITH pH</GlowText>
        </div>

        {/* pH scale */}
        <div style={{
          opacity: phCue.opacity,
          display: 'flex', alignItems: 'center', gap: 0, marginTop: 20,
        }}>
          {Array.from({ length: 14 }, (_, i) => (
            <div key={i} style={{
              width: 55, height: 60, display: 'flex', justifyContent: 'center', alignItems: 'center',
              background: i < 4 ? `${T.danger}${(40 - i * 8).toString(16).padStart(2, '0')}`
                : i < 9 ? `${T.success}${((i - 3) * 8).toString(16).padStart(2, '0')}`
                : `${T.accent}${((i - 8) * 8).toString(16).padStart(2, '0')}`,
              fontFamily: T.mono, fontSize: 16, color: T.text, fontWeight: 600,
              borderRight: `1px solid ${T.bg}`,
            }}>
              {i + 1}
            </div>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', width: 770,
          fontFamily: T.font, fontSize: 16, color: T.textMuted,
        }}>
          <span style={{ color: T.danger }}>Acidic</span>
          <span style={{ color: T.success }}>Neutral</span>
          <span style={{ color: T.accent }}>Alkaline</span>
        </div>

        <div style={{
          opacity: ionicCue.opacity, transform: `translateY(${ionicCue.translateY}px)`,
          display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
            padding: '10px 24px', background: `${T.accent}10`, borderRadius: 10,
          }}>
            <span style={{ color: T.accent, fontWeight: 700 }}>Ionic bonds</span> break
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
          }}>
            Active site distorted → Enzyme denatured
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────────────────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const inducedCue = useCueSpring(ct('induced-not-lock'));
  const denaturedCue = useCueSpring(ct('denatured-not-destroyed'));
  const guaranteedCue = useCueSpring(ct('guaranteed'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        padding: 50,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        <div style={{ opacity: inducedCue.opacity, transform: `scale(${inducedCue.scale})` }}>
          <div style={{ fontFamily: T.font, fontSize: 32, color: T.text, textAlign: 'center' }}>
            <span style={{ color: T.success, fontWeight: 800 }}>Induced fit</span>
            <span style={{ color: T.textMuted }}>, not </span>
            <span style={{ textDecoration: 'line-through', color: T.textMuted }}>lock & key</span>
          </div>
        </div>
        <div style={{ opacity: denaturedCue.opacity, transform: `scale(${denaturedCue.scale})` }}>
          <div style={{ fontFamily: T.font, fontSize: 32, color: T.text, textAlign: 'center' }}>
            <span style={{ color: T.danger, fontWeight: 800 }}>Denatured</span>
            <span style={{ color: T.textMuted }}>, not </span>
            <span style={{ textDecoration: 'line-through', color: T.textMuted }}>destroyed</span>
          </div>
        </div>
        <Badge
          label="GUARANTEED MARKS ✓"
          color={T.gold}
          opacity={guaranteedCue.opacity}
          scale={guaranteedCue.scale}
          fontSize={28}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',         startS: 0,     durationS: 5.38,  Component: HookScene },
  { id: 'lock-key',     startS: 5.38,  durationS: 16.22, Component: LockKeyScene },
  { id: 'induced-fit',  startS: 21.60, durationS: 16.98, Component: InducedFitScene },
  { id: 'what-enzymes', startS: 38.58, durationS: 10.98, Component: WhatEnzymesDoScene },
  { id: 'temperature',  startS: 49.56, durationS: 20.12, Component: TemperatureScene },
  { id: 'denaturation', startS: 69.68, durationS: 14.14, Component: DenaturationScene },
  { id: 'ph',           startS: 83.82, durationS: 10.72, Component: PhScene },
  { id: 'cta',          startS: 94.54, durationS: 7.46,  Component: CTAScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const BiologyEnzymesTikTok: React.FC<BiologyEnzymesTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/enzymes-narration.mp3')} volume={1} />
      )}
      {SCENES.map((scene) => {
        const startFrame = Math.round(scene.startS * fps);
        const durationFrames = Math.round(scene.durationS * fps);
        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationFrames}>
            <scene.Component ct={(id: string) => ct(id) - scene.startS} />
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `${T.text}10` }}>
      <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${T.enzyme}, ${T.gold})`, borderRadius: 2 }} />
    </div>
  );
};

export function getBiologyEnzymesDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyEnzymesCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/enzymes/cover-enzyme.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.45, filter: 'brightness(0.5)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={52} color={T.danger}>YOUR TEXTBOOK</GlowText>
      <GlowText fontSize={52} color={T.danger}>LIED TO YOU</GlowText>
      <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20 }}>
        Enzymes — Lock & Key vs Induced Fit
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 10 }}>
        Cambridge 9700 · Topic 3.1
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
