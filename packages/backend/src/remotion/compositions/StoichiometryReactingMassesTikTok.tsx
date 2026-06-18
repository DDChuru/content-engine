/**
 * Stoichiometry #5 — "Reacting Masses" TikTok (9:16) v1
 *
 * Cambridge IGCSE / AS Chemistry — Predicting reacting masses
 * from balanced equations using moles.
 * 12g C + O₂ → ? g CO₂  →  44g CO₂
 *
 * Pure CSS motion graphics.
 * 9 scenes, ~70 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 69.94;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',     // cyan — main accent
  secondary: '#ff00ff',   // magenta
  accent: '#c084fc',      // purple
  success: '#22c55e',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  carbon: '#4ade80',      // green for carbon
  oxygen: '#ef4444',      // red for oxygen
  co2: '#a78bfa',         // purple for CO₂
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'powerful':  1.80,     // "powerful" — predict reactions
  'co2':       9.56,     // question: how much CO₂?
  'equation': 15.76,     // balanced equation
  'moles':    26.40,     // convert to moles
  'ratio':    33.10,     // mole ratio from equation
  'grams':    40.28,     // convert back to grams
  'answer':   49.62,     // big reveal 44g
  'pattern':  55.52,     // flow diagram + CTA
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryReactingMassesTikTokProps {
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

// Floating particle dot
const Particle: React.FC<{
  x: number; y: number; size: number; color: string; delay: number;
}> = ({ x, y, size, color, delay }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin((frame + delay * 30) / 15);
  const drift = Math.sin((frame + delay * 20) / 40) * 8;
  return (
    <div style={{
      position: 'absolute', left: x + drift, top: y,
      width: size, height: size, borderRadius: '50%',
      background: color, opacity: pulse * 0.7,
      boxShadow: `0 0 ${size * 2}px ${color}60`,
    }} />
  );
};

// Step number badge (top-right)
const StepBadge: React.FC<{
  step: number; total: number; opacity: number;
}> = ({ step, total, opacity }) => (
  <div style={{
    position: 'absolute', top: 60, right: 40, opacity,
    fontFamily: T.mono, fontSize: 22, color: T.textMuted,
    padding: '8px 16px', borderRadius: 20,
    border: `1px solid ${T.primary}30`, background: `${T.primary}08`,
  }}>
    {step}/{total}
  </div>
);

// Arrow component for flow diagrams
const Arrow: React.FC<{
  opacity: number; color?: string; direction?: 'right' | 'down';
}> = ({ opacity, color = T.primary, direction = 'right' }) => (
  <div style={{
    opacity, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transform: direction === 'down' ? 'rotate(90deg)' : undefined,
  }}>
    <svg width={40} height={24} viewBox="0 0 40 24">
      <line x1={0} y1={12} x2={30} y2={12} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <polygon points="28,4 40,12 28,20" fill={color} />
    </svg>
  </div>
);

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook (0–1.8s) ──────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 1.8 * fps], [1.0, 1.12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title fade in
  const titleOpacity = interpolate(frame, [8, 25], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [8, 25], [0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Question mark pulse
  const pulse = 0.85 + 0.15 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/stoichiometry/05-reacting-masses-hook.png')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 10], [0, 0.45],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.4)',
      }} />

      {/* Dark gradient overlay */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: 'linear-gradient(180deg, transparent 30%, #050510cc 70%, #050510 100%)',
      }} />

      {/* Content overlay */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          opacity: titleOpacity, transform: `scale(${titleScale * pulse})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontWeight: 400, fontSize: 28, color: T.textMuted,
          }}>
            Chemistry prediction power...
          </div>

          <GlowText fontSize={64} color={T.primary}>
            REACTING MASSES
          </GlowText>

          <div style={{
            fontFamily: T.mono, fontSize: 22, color: `${T.gold}90`,
            opacity: interpolate(frame, [30, 45], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            Stoichiometry #5
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: PowerfulIntro (1.8–9.6s) ──────────────────────────────
const PowerfulIntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const powerfulCue = useCueSpring(ct('powerful'));

  // Dramatic text scale
  const dramScale = powerfulCue.isActive
    ? interpolate(frame - ct('powerful') * fps, [0, 20], [1.2, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 1.2;

  // Sub-text stagger
  const line1Opacity = powerfulCue.isActive
    ? interpolate(frame - ct('powerful') * fps, [20, 40], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;
  const line2Opacity = powerfulCue.isActive
    ? interpolate(frame - ct('powerful') * fps, [45, 65], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.6 + 0.4 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <Particle
          key={i}
          x={80 + (i * 67) % 920}
          y={200 + (i * 113) % 1500}
          size={4 + (i % 4) * 2}
          color={i % 3 === 0 ? T.primary : i % 3 === 1 ? T.gold : T.secondary}
          delay={i * 0.7}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        padding: '0 60px',
      }}>
        {/* Main dramatic text */}
        <div style={{
          opacity: powerfulCue.opacity,
          transform: `scale(${dramScale * powerfulCue.scale})`,
        }}>
          <GlowText fontSize={52} color={T.gold} style={{
            textShadow: `0 0 ${40 * pulse}px ${T.gold}80, 0 0 80px ${T.gold}40`,
          }}>
            PREDICT EXACTLY
          </GlowText>
        </div>

        {/* Explanation lines */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            opacity: line1Opacity,
            fontFamily: T.font, fontSize: 30, color: T.text, textAlign: 'center',
            lineHeight: 1.5,
          }}>
            how much <span style={{ color: T.carbon, fontWeight: 700 }}>product</span> you get
          </div>
          <div style={{
            opacity: line2Opacity,
            fontFamily: T.font, fontSize: 30, color: T.text, textAlign: 'center',
            lineHeight: 1.5,
          }}>
            from any <span style={{ color: T.oxygen, fontWeight: 700 }}>reactant</span> mass
          </div>
        </div>

        {/* Equation preview badge */}
        <Badge
          label="using balanced equations + molar mass"
          color={T.primary}
          opacity={line2Opacity}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: QuestionScene (9.6–15.8s) ──────────────────────────────
const QuestionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const co2Cue = useCueSpring(ct('co2'));

  const pulse = 0.7 + 0.3 * Math.sin(frame / 8);

  // Question mark bounce
  const qBounce = co2Cue.isActive
    ? interpolate(frame - ct('co2') * fps, [0, 15, 30], [0, -15, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 12 }, (_, i) => (
        <Particle
          key={i}
          x={100 + (i * 83) % 880}
          y={300 + (i * 137) % 1300}
          size={3 + (i % 3) * 2}
          color={i % 2 === 0 ? T.co2 : T.carbon}
          delay={i * 0.5}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: co2Cue.opacity }}>
          <GlowText fontSize={36} color={T.warning}>THE QUESTION</GlowText>
        </div>

        {/* Question card */}
        <div style={{
          opacity: co2Cue.opacity, transform: `scale(${co2Cue.scale})`,
          padding: '40px 60px', borderRadius: 24,
          border: `2px solid ${T.primary}40`, background: `${T.surface}cc`,
          boxShadow: `0 0 60px ${T.primary}15, inset 0 0 30px ${T.primary}05`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        }}>
          {/* Reactant */}
          <div style={{
            fontFamily: T.mono, fontSize: 56, fontWeight: 900, color: T.carbon,
            textShadow: `0 0 30px ${T.carbon}50`,
          }}>
            12g C
          </div>

          {/* Arrow */}
          <div style={{
            fontFamily: T.font, fontSize: 36, color: T.textMuted,
          }}>{'\u2192'}</div>

          {/* Product with question */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              fontFamily: T.mono, fontSize: 56, fontWeight: 900,
              color: `${T.co2}${Math.round(pulse * 255).toString(16).padStart(2, '0')}`,
              textShadow: `0 0 30px ${T.co2}50`,
              transform: `translateY(${qBounce}px)`,
            }}>
              ? g CO{'\u2082'}
            </div>
          </div>
        </div>

        <Badge
          label="Let's work it out step by step"
          color={T.primary}
          opacity={co2Cue.isActive
            ? interpolate(frame - ct('co2') * fps, [40, 60], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: EquationScene (15.8–26.4s) ─────────────────────────────
const EquationScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eqCue = useCueSpring(ct('equation'));

  // Build the equation piece by piece
  const buildProgress = eqCue.isActive
    ? interpolate(frame - ct('equation') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Glow pulse for "balanced" indicator
  const pulse = 0.6 + 0.4 * Math.sin(frame / 10);

  const pieces = [
    { text: 'C', color: T.carbon, delay: 0 },
    { text: '+', color: T.textMuted, delay: 0.1 },
    { text: 'O\u2082', color: T.oxygen, delay: 0.2 },
    { text: '\u2192', color: T.gold, delay: 0.35 },
    { text: 'CO\u2082', color: T.co2, delay: 0.5 },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <StepBadge step={1} total={4} opacity={eqCue.opacity} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
      }}>
        <div style={{ opacity: eqCue.opacity }}>
          <GlowText fontSize={36} color={T.primary}>BALANCED EQUATION</GlowText>
        </div>

        {/* Equation display */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '30px 50px', borderRadius: 20,
          border: `2px solid ${T.primary}30`, background: `${T.surface}80`,
        }}>
          {pieces.map((piece, i) => (
            <div key={i} style={{
              fontFamily: T.mono, fontSize: 64, fontWeight: 900, color: piece.color,
              textShadow: `0 0 25px ${piece.color}50`,
              opacity: interpolate(buildProgress, [piece.delay, piece.delay + 0.12], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              transform: `translateY(${interpolate(
                buildProgress, [piece.delay, piece.delay + 0.12], [15, 0],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
              )}px)`,
            }}>{piece.text}</div>
          ))}
        </div>

        {/* Coefficient labels */}
        <div style={{
          display: 'flex', gap: 80, alignItems: 'center',
          opacity: interpolate(buildProgress, [0.6, 0.8], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.carbon,
            padding: '6px 20px', borderRadius: 12, background: `${T.carbon}12`,
            border: `1px solid ${T.carbon}30`,
          }}>1 mol</div>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.oxygen,
            padding: '6px 20px', borderRadius: 12, background: `${T.oxygen}12`,
            border: `1px solid ${T.oxygen}30`,
          }}>1 mol</div>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.co2,
            padding: '6px 20px', borderRadius: 12, background: `${T.co2}12`,
            border: `1px solid ${T.co2}30`,
          }}>1 mol</div>
        </div>

        {/* Balanced indicator */}
        <Badge
          label={'\u2713 Already balanced — coefficients are all 1'}
          color={T.success}
          opacity={interpolate(buildProgress, [0.8, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: MolesStepScene (26.4–33.1s) ────────────────────────────
const MolesStepScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const molesCue = useCueSpring(ct('moles'));

  // Calculation animation
  const calcProgress = molesCue.isActive
    ? interpolate(frame - ct('moles') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <StepBadge step={2} total={4} opacity={molesCue.opacity} />

      {/* Background particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <Particle
          key={i}
          x={100 + (i * 97) % 880}
          y={250 + (i * 163) % 1400}
          size={3 + (i % 3) * 2}
          color={i % 2 === 0 ? T.carbon : T.primary}
          delay={i * 0.6}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        <div style={{ opacity: molesCue.opacity }}>
          <GlowText fontSize={36} color={T.carbon}>GRAMS {'\u2192'} MOLES</GlowText>
        </div>

        {/* Formula box */}
        <div style={{
          opacity: molesCue.opacity, transform: `scale(${molesCue.scale})`,
          padding: '20px 40px', borderRadius: 16,
          border: `1px solid ${T.primary}30`, background: `${T.surface}80`,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.textMuted, textAlign: 'center',
          }}>
            moles = <span style={{ color: T.primary }}>mass</span> {'\u00f7'} <span style={{ color: T.gold }}>M{'\u1d63'}</span>
          </div>
        </div>

        {/* Calculation steps */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          padding: '30px 50px', borderRadius: 20,
          border: `2px solid ${T.carbon}25`, background: `${T.carbon}06`,
        }}>
          {/* Line 1: mass of C */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 36, color: T.text,
            opacity: interpolate(calcProgress, [0, 0.2], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.textMuted }}>moles =</span>
            <span style={{ color: T.carbon, fontWeight: 700 }}>12</span>
            <span style={{ color: T.textMuted }}>{'\u00f7'}</span>
            <span style={{ color: T.gold, fontWeight: 700 }}>12</span>
          </div>

          {/* Divider */}
          <div style={{
            width: 400, height: 3, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${T.primary}60, transparent)`,
            opacity: interpolate(calcProgress, [0.3, 0.45], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }} />

          {/* Result */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 48, fontWeight: 900,
            opacity: interpolate(calcProgress, [0.5, 0.7], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{
              color: T.primary,
              textShadow: `0 0 30px ${T.primary}60`,
              fontSize: 64,
            }}>1 mol</span>
          </div>
        </div>

        {/* Explanation label */}
        <Badge
          label="M\u1d63 of carbon = 12 g/mol"
          color={T.gold}
          opacity={interpolate(calcProgress, [0.7, 0.9], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: RatioStepScene (33.1–40.3s) ────────────────────────────
const RatioStepScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ratioCue = useCueSpring(ct('ratio'));

  const progress = ratioCue.isActive
    ? interpolate(frame - ct('ratio') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Arrow drawing animation
  const arrowWidth = interpolate(progress, [0.3, 0.6], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <StepBadge step={3} total={4} opacity={ratioCue.opacity} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        <div style={{ opacity: ratioCue.opacity }}>
          <GlowText fontSize={36} color={T.gold}>MOLE RATIO</GlowText>
        </div>

        {/* Equation reminder (small) */}
        <div style={{
          opacity: ratioCue.opacity,
          fontFamily: T.mono, fontSize: 24, color: T.textMuted,
          padding: '10px 24px', borderRadius: 12,
          border: `1px solid ${T.textMuted}20`, background: `${T.surface}60`,
        }}>
          C + O{'\u2082'} {'\u2192'} CO{'\u2082'}
        </div>

        {/* Arrow diagram: C → CO₂ */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 30,
          opacity: interpolate(progress, [0.1, 0.3], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {/* C box */}
          <div style={{
            width: 200, padding: '24px 0', borderRadius: 20,
            border: `2px solid ${T.carbon}60`, background: `${T.carbon}10`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.carbon,
              textShadow: `0 0 20px ${T.carbon}40`,
            }}>C</div>
            <div style={{
              fontFamily: T.mono, fontSize: 28, color: T.primary, fontWeight: 700,
            }}>1 mol</div>
          </div>

          {/* Animated arrow */}
          <div style={{ opacity: arrowWidth }}>
            <svg width={80} height={50} viewBox="0 0 80 50">
              <line x1={0} y1={25} x2={55} y2={25} stroke={T.gold} strokeWidth={4} strokeLinecap="round" />
              <polygon points="53,12 80,25 53,38" fill={T.gold} />
            </svg>
          </div>

          {/* CO₂ box */}
          <div style={{
            width: 200, padding: '24px 0', borderRadius: 20,
            border: `2px solid ${T.co2}60`, background: `${T.co2}10`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            opacity: interpolate(progress, [0.4, 0.6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.co2,
              textShadow: `0 0 20px ${T.co2}40`,
            }}>CO{'\u2082'}</div>
            <div style={{
              fontFamily: T.mono, fontSize: 28, color: T.primary, fontWeight: 700,
            }}>1 mol</div>
          </div>
        </div>

        {/* Ratio highlight */}
        <div style={{
          opacity: interpolate(progress, [0.6, 0.8], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 52, fontWeight: 900, color: T.gold,
            textShadow: `0 0 30px ${T.gold}60`,
          }}>
            1 : 1
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.textMuted,
          }}>
            1 mol C produces exactly 1 mol CO{'\u2082'}
          </div>
        </div>

        <Badge
          label="Ratio comes from the equation coefficients"
          color={T.primary}
          opacity={interpolate(progress, [0.85, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={18}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: GramsStepScene (40.3–49.6s) ────────────────────────────
const GramsStepScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const gramsCue = useCueSpring(ct('grams'));

  const calcProgress = gramsCue.isActive
    ? interpolate(frame - ct('grams') * fps, [0, 100], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <StepBadge step={4} total={4} opacity={gramsCue.opacity} />

      {/* Background particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <Particle
          key={i}
          x={80 + (i * 89) % 920}
          y={200 + (i * 151) % 1500}
          size={3 + (i % 3) * 2}
          color={i % 2 === 0 ? T.co2 : T.gold}
          delay={i * 0.5}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        <div style={{ opacity: gramsCue.opacity }}>
          <GlowText fontSize={36} color={T.co2}>MOLES {'\u2192'} GRAMS</GlowText>
        </div>

        {/* Formula box */}
        <div style={{
          opacity: gramsCue.opacity, transform: `scale(${gramsCue.scale})`,
          padding: '20px 40px', borderRadius: 16,
          border: `1px solid ${T.primary}30`, background: `${T.surface}80`,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.textMuted, textAlign: 'center',
          }}>
            mass = <span style={{ color: T.primary }}>moles</span> {'\u00d7'} <span style={{ color: T.gold }}>M{'\u1d63'}</span>
          </div>
        </div>

        {/* Calculation steps */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          padding: '30px 50px', borderRadius: 20,
          border: `2px solid ${T.co2}25`, background: `${T.co2}06`,
        }}>
          {/* M_r of CO₂ */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: T.mono, fontSize: 28, color: T.textMuted,
            opacity: interpolate(calcProgress, [0, 0.15], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            M{'\u1d63'}(CO{'\u2082'}) = <span style={{ color: T.carbon }}>12</span> + <span style={{ color: T.oxygen }}>16</span>{'\u00d7'}2 = <span style={{ color: T.gold, fontWeight: 700 }}>44</span>
          </div>

          {/* Main calculation */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 36, color: T.text,
            opacity: interpolate(calcProgress, [0.2, 0.4], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.textMuted }}>mass =</span>
            <span style={{ color: T.primary, fontWeight: 700 }}>1</span>
            <span style={{ color: T.textMuted }}>{'\u00d7'}</span>
            <span style={{ color: T.gold, fontWeight: 700 }}>44</span>
          </div>

          {/* Divider */}
          <div style={{
            width: 400, height: 3, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${T.co2}60, transparent)`,
            opacity: interpolate(calcProgress, [0.45, 0.55], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }} />

          {/* Result */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: T.mono, fontSize: 48, fontWeight: 900,
            opacity: interpolate(calcProgress, [0.6, 0.8], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.textMuted }}>=</span>
            <span style={{
              color: T.co2,
              textShadow: `0 0 30px ${T.co2}60`,
              fontSize: 64,
            }}>44 g</span>
          </div>
        </div>

        <Badge
          label="of CO\u2082 produced"
          color={T.co2}
          opacity={interpolate(calcProgress, [0.85, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: AnswerScene (49.6–55.5s) ───────────────────────────────
const AnswerScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const answerCue = useCueSpring(ct('answer'));

  const pulse = 0.6 + 0.4 * Math.sin(frame / 8);

  // Celebration particles burst
  const burstProgress = answerCue.isActive
    ? interpolate(frame - ct('answer') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Burst particles */}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const radius = burstProgress * 350 + 50;
        return (
          <Particle
            key={i}
            x={540 + Math.cos(angle) * radius - 4}
            y={960 + Math.sin(angle) * radius - 4}
            size={4 + (i % 4) * 2}
            color={[T.primary, T.gold, T.co2, T.carbon, T.secondary][i % 5]}
            delay={i * 0.3}
          />
        );
      })}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{
          opacity: answerCue.opacity,
          fontFamily: T.font, fontSize: 28, color: T.textMuted, fontWeight: 500,
        }}>
          THE ANSWER
        </div>

        {/* Big reveal card */}
        <div style={{
          opacity: answerCue.opacity, transform: `scale(${answerCue.scale})`,
          padding: '50px 70px', borderRadius: 28,
          border: `3px solid ${T.gold}${Math.round(pulse * 100 + 50).toString(16).padStart(2, '0')}`,
          background: `linear-gradient(135deg, ${T.surface}, ${T.gold}08)`,
          boxShadow: `0 0 80px ${T.gold}20, inset 0 0 40px ${T.gold}05`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        }}>
          {/* Reactant */}
          <div style={{
            fontFamily: T.mono, fontSize: 52, fontWeight: 900, color: T.carbon,
            textShadow: `0 0 25px ${T.carbon}50`,
          }}>12g C</div>

          {/* Arrow */}
          <svg width={60} height={40} viewBox="0 0 60 40">
            <line x1={30} y1={0} x2={30} y2={28} stroke={T.gold} strokeWidth={4} strokeLinecap="round" />
            <polygon points="18,26 42,26 30,40" fill={T.gold} />
          </svg>

          {/* Product — big and glowing */}
          <div style={{
            fontFamily: T.mono, fontSize: 72, fontWeight: 900, color: T.gold,
            textShadow: `0 0 ${40 * pulse}px ${T.gold}80, 0 0 80px ${T.gold}40`,
          }}>
            44g CO{'\u2082'}
          </div>
        </div>

        {/* Confirmation badge */}
        <Badge
          label={'\u2713 From just 12 grams of carbon!'}
          color={T.success}
          opacity={answerCue.isActive
            ? interpolate(frame - ct('answer') * fps, [40, 60], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 9: PatternScene (55.5–70s) ────────────────────────────────
const PatternScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const patternCue = useCueSpring(ct('pattern'));

  const progress = patternCue.isActive
    ? interpolate(frame - ct('pattern') * fps, [0, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Flow steps
  const flowSteps = [
    { label: 'GRAMS', color: T.carbon, sub: 'of reactant' },
    { label: 'MOLES', color: T.primary, sub: '\u00f7 M\u1d63' },
    { label: 'RATIO', color: T.gold, sub: 'from equation' },
    { label: 'MOLES', color: T.primary, sub: 'of product' },
    { label: 'GRAMS', color: T.co2, sub: '\u00d7 M\u1d63' },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        padding: '0 40px',
      }}>
        <div style={{ opacity: patternCue.opacity }}>
          <GlowText fontSize={36} color={T.gold}>THE PATTERN</GlowText>
        </div>

        {/* Flow diagram */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          {flowSteps.map((step, i) => {
            const stepDelay = i * 0.12;
            const stepOpacity = interpolate(progress, [stepDelay, stepDelay + 0.1], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            const isActive = i === 0 || i === flowSteps.length - 1; // Highlight first/last

            return (
              <React.Fragment key={i}>
                <div style={{
                  opacity: stepOpacity,
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 36px', borderRadius: 16,
                  border: `2px solid ${step.color}${isActive ? '80' : '40'}`,
                  background: `${step.color}${isActive ? '15' : '08'}`,
                  boxShadow: isActive ? `0 0 30px ${step.color}20` : 'none',
                  minWidth: 380, justifyContent: 'center',
                }}>
                  <div style={{
                    fontFamily: T.mono, fontSize: 28, fontWeight: 900, color: step.color,
                    textShadow: isActive ? `0 0 20px ${step.color}50` : 'none',
                  }}>{step.label}</div>
                  <div style={{
                    fontFamily: T.font, fontSize: 18, color: T.textMuted,
                  }}>{step.sub}</div>
                </div>

                {/* Arrow between steps */}
                {i < flowSteps.length - 1 && (
                  <div style={{
                    opacity: interpolate(progress, [stepDelay + 0.06, stepDelay + 0.12], [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                  }}>
                    <Arrow opacity={1} color={T.textMuted} direction="down" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Summary */}
        <div style={{
          opacity: interpolate(progress, [0.7, 0.85], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
            padding: '10px 30px', background: `${T.gold}10`, borderRadius: 12,
          }}>
            Works for <span style={{ color: T.gold, fontWeight: 700 }}>ANY</span> reaction!
          </div>
        </div>

        {/* CTA */}
        <Badge
          label="FOLLOW for Part 6: Limiting Reagents"
          color={T.secondary}
          opacity={interpolate(progress, [0.88, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
          scale={0.9 + 0.1 * pulse}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',             startS: 0,     durationS: 1.80,  Component: HookScene },
  { id: 'powerful-intro',   startS: 1.80,  durationS: 7.76,  Component: PowerfulIntroScene },
  { id: 'question',         startS: 9.56,  durationS: 6.20,  Component: QuestionScene },
  { id: 'equation',         startS: 15.76, durationS: 10.64, Component: EquationScene },
  { id: 'moles-step',       startS: 26.40, durationS: 6.70,  Component: MolesStepScene },
  { id: 'ratio-step',       startS: 33.10, durationS: 7.18,  Component: RatioStepScene },
  { id: 'grams-step',       startS: 40.28, durationS: 9.34,  Component: GramsStepScene },
  { id: 'answer',           startS: 49.62, durationS: 5.90,  Component: AnswerScene },
  { id: 'pattern-cta',      startS: 55.52, durationS: 14.42, Component: PatternScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryReactingMassesTikTok: React.FC<StoichiometryReactingMassesTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/05-reacting-masses-narration.mp3')} volume={1} />
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
      <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${T.primary}, ${T.gold})`, borderRadius: 2 }} />
    </div>
  );
};

export function getStoichiometryReactingMassesDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const StoichiometryReactingMassesCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
      }}>
        <GlowText fontSize={52} color={T.gold}>REACTING MASSES</GlowText>
        <div style={{
          fontFamily: T.mono, fontSize: 40, color: T.text, marginTop: 10,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <span style={{ color: T.carbon }}>12g C</span>
          <span style={{ color: T.textMuted }}>{'\u2192'}</span>
          <span style={{ color: T.co2 }}>44g CO{'\u2082'}</span>
        </div>
        <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20 }}>
          Stoichiometry #5 — Predicting Products
        </div>
        <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 10 }}>
          Cambridge IGCSE / AS Chemistry
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
