/**
 * Stoichiometry #4 — "Balancing Equations Like a Pro" TikTok (9:16) v1
 *
 * Cambridge IGCSE / AS Chemistry — Balancing chemical equations.
 * Atom counting, coefficient placement, mole ratios.
 *
 * Pure CSS motion graphics.
 * 8 scenes, ~70.5 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 70.54;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00ffff',     // cyan — main accent
  secondary: '#ff00ff',   // magenta
  accent: '#c084fc',      // purple
  success: '#22c55e',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  hydrogen: '#38bdf8',    // light blue for H
  oxygen: '#ef4444',      // red for O
  coefficient: '#fbbf24', // gold for coefficients
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'atoms':        2.06,   // golden rule: atoms in = atoms out
  'water':       10.60,   // water equation intro
  'two':         25.78,   // add coefficient 2 to H₂O
  'hydrogen':    30.76,   // fix hydrogen side
  'balanced':    39.22,   // final balanced check
  'method':      46.76,   // 5-step method
  'coefficients': 62.00,  // coefficients → mole ratios CTA
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryBalancingTikTokProps {
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

// Atom dot — colored circle representing an atom
const AtomDot: React.FC<{
  symbol: string; color: string; size?: number; opacity?: number; x?: number; y?: number;
  style?: React.CSSProperties;
}> = ({ symbol, color, size = 50, opacity = 1, x, y, style }) => (
  <div style={{
    position: x !== undefined ? 'absolute' : 'relative',
    left: x, top: y,
    width: size, height: size, borderRadius: '50%',
    background: `${color}30`, border: `3px solid ${color}`,
    boxShadow: `0 0 20px ${color}40, inset 0 0 10px ${color}20`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: T.font, fontWeight: 800, fontSize: size * 0.45, color,
    opacity, ...style,
  }}>{symbol}</div>
);

// Chemical equation text with glowing coefficient
const ChemEquation: React.FC<{
  parts: Array<{ text: string; color?: string; glow?: boolean; bold?: boolean }>;
  fontSize?: number; opacity?: number; style?: React.CSSProperties;
}> = ({ parts, fontSize = 48, opacity = 1, style }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', gap: 4,
    fontFamily: T.mono, fontSize, opacity, ...style,
  }}>
    {parts.map((p, i) => (
      <span key={i} style={{
        color: p.color || T.text,
        fontWeight: p.bold ? 900 : 600,
        textShadow: p.glow ? `0 0 20px ${p.color || T.primary}80, 0 0 40px ${p.color || T.primary}40` : undefined,
      }}>{p.text}</span>
    ))}
  </div>
);

// Checkmark icon
const Checkmark: React.FC<{
  opacity: number; scale?: number; color?: string; size?: number;
}> = ({ opacity, scale = 1, color = T.success, size = 48 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    width: size, height: size, borderRadius: '50%',
    background: `${color}20`, border: `3px solid ${color}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 20px ${color}40`,
  }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// Cross icon
const CrossMark: React.FC<{
  opacity: number; scale?: number; color?: string; size?: number;
}> = ({ opacity, scale = 1, color = T.danger, size = 48 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    width: size, height: size, borderRadius: '50%',
    background: `${color}20`, border: `3px solid ${color}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: `0 0 20px ${color}40`,
  }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24">
      <path d="M6 6l12 12M18 6l-12 12" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
    </svg>
  </div>
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

// Step card for the method scene
const StepCard: React.FC<{
  number: number; text: string; color: string; opacity: number; translateY: number;
}> = ({ number, text, color, opacity, translateY }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'flex', alignItems: 'center', gap: 18,
    padding: '16px 28px', borderRadius: 16,
    background: `${color}08`, border: `2px solid ${color}30`,
    width: 860,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: '50%',
      background: `${color}20`, border: `2px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: T.mono, fontSize: 24, fontWeight: 900, color,
      flexShrink: 0,
    }}>{number}</div>
    <div style={{
      fontFamily: T.font, fontSize: 26, fontWeight: 600, color: T.text,
      lineHeight: 1.3,
    }}>{text}</div>
  </div>
);

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook (0–2s) ────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 2 * fps], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title fade in quick
  const titleOpacity = interpolate(frame, [5, 20], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [5, 20], [0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/stoichiometry/04-balancing-hook.png')} style={{
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
          opacity: titleOpacity, transform: `scale(${titleScale})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontWeight: 400, fontSize: 22, color: `${T.primary}80`,
          }}>
            Stoichiometry #4
          </div>
          <GlowText fontSize={62} color={T.primary}>
            BALANCING EQUATIONS
          </GlowText>
          <GlowText fontSize={40} color={T.secondary}>
            LIKE A PRO
          </GlowText>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Atoms Rule (2–10.6s) ──────────────────────────────────
const AtomsRuleScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const atomsCue = useCueSpring(ct('atoms'));

  // Floating atoms in background
  const atoms = [
    { sym: 'H', color: T.hydrogen, x: 120, y: 300 },
    { sym: 'O', color: T.oxygen, x: 800, y: 400 },
    { sym: 'H', color: T.hydrogen, x: 300, y: 1200 },
    { sym: 'C', color: T.accent, x: 700, y: 1100 },
    { sym: 'O', color: T.oxygen, x: 200, y: 800 },
    { sym: 'N', color: T.success, x: 850, y: 700 },
  ];

  // Golden rule reveal — staggered
  const ruleProgress = atomsCue.isActive
    ? interpolate(frame - ct('atoms') * fps, [0, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <Particle
          key={i}
          x={60 + (i * 73) % 960}
          y={150 + (i * 127) % 1600}
          size={3 + (i % 4) * 2}
          color={i % 2 === 0 ? T.primary : T.secondary}
          delay={i * 0.8}
        />
      ))}

      {/* Floating atom dots */}
      {atoms.map((a, i) => {
        const drift = Math.sin((frame + i * 40) / 50) * 15;
        const atomOp = atomsCue.isActive
          ? interpolate(frame - ct('atoms') * fps, [i * 8, i * 8 + 15], [0, 0.6],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
          : 0;
        return (
          <AtomDot key={i} symbol={a.sym} color={a.color} size={60}
            x={a.x} y={a.y + drift} opacity={atomOp} />
        );
      })}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
        zIndex: 1,
      }}>
        {/* Crown / golden rule icon */}
        <div style={{
          opacity: atomsCue.opacity, transform: `scale(${atomsCue.scale})`,
          fontFamily: T.font, fontSize: 60,
        }}>
          {'\u{1F451}'}
        </div>

        <GlowText fontSize={52} color={T.gold} style={{
          opacity: atomsCue.opacity,
        }}>
          THE GOLDEN RULE
        </GlowText>

        {/* Atoms in = Atoms out — animated */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20,
          opacity: interpolate(ruleProgress, [0.2, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            padding: '16px 36px', borderRadius: 16,
            background: `${T.primary}10`, border: `2px solid ${T.primary}40`,
          }}>
            <GlowText fontSize={38} color={T.primary}>Atoms IN</GlowText>
          </div>

          <GlowText fontSize={48} color={T.gold}>=</GlowText>

          <div style={{
            padding: '16px 36px', borderRadius: 16,
            background: `${T.secondary}10`, border: `2px solid ${T.secondary}40`,
          }}>
            <GlowText fontSize={38} color={T.secondary}>Atoms OUT</GlowText>
          </div>
        </div>

        {/* Sub-explanation */}
        <div style={{
          opacity: interpolate(ruleProgress, [0.5, 0.8], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.font, fontSize: 26, color: T.textMuted, textAlign: 'center',
          maxWidth: 800, lineHeight: 1.5,
        }}>
          Matter <span style={{ color: T.danger, fontWeight: 700 }}>cannot</span> be created or destroyed
        </div>

        <Badge
          label="Conservation of Mass"
          color={T.gold}
          opacity={interpolate(ruleProgress, [0.7, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Water Equation Unbalanced (10.6–25.8s) ────────────────
const WaterEquationScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const waterCue = useCueSpring(ct('water'));

  // Staggered reveals for atom counting
  const eqProgress = waterCue.isActive
    ? interpolate(frame - ct('water') * fps, [0, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Counting dots — left side (reactants)
  const leftH = 2;  // H₂ has 2 H atoms
  const leftO = 2;  // O₂ has 2 O atoms
  // Right side (products, unbalanced: 1 H₂O)
  const rightH = 2; // H₂O has 2 H
  const rightO = 1; // H₂O has 1 O

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: `radial-gradient(${T.primary}08 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        zIndex: 1,
      }}>
        <GlowText fontSize={36} color={T.textMuted} style={{
          opacity: waterCue.opacity,
        }}>
          Let's balance water
        </GlowText>

        {/* Unbalanced equation */}
        <div style={{
          opacity: waterCue.opacity, transform: `scale(${waterCue.scale})`,
        }}>
          <ChemEquation fontSize={56} parts={[
            { text: 'H', color: T.hydrogen, bold: true },
            { text: '\u2082', color: T.hydrogen },
            { text: '  +  ', color: T.textMuted },
            { text: 'O', color: T.oxygen, bold: true },
            { text: '\u2082', color: T.oxygen },
            { text: '  \u2192  ', color: T.gold },
            { text: 'H', color: T.hydrogen, bold: true },
            { text: '\u2082', color: T.hydrogen },
            { text: 'O', color: T.oxygen, bold: true },
          ]} />
        </div>

        {/* "UNBALANCED" warning */}
        <div style={{
          opacity: interpolate(eqProgress, [0.15, 0.3], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.font, fontWeight: 800, fontSize: 28, color: T.danger,
          padding: '8px 24px', border: `2px solid ${T.danger}60`, borderRadius: 12,
          background: `${T.danger}10`,
          textShadow: `0 0 20px ${T.danger}40`,
        }}>
          {'\u26A0'} UNBALANCED
        </div>

        {/* Atom count table */}
        <div style={{
          opacity: interpolate(eqProgress, [0.3, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', gap: 80, marginTop: 20,
        }}>
          {/* Left side — Reactants */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.primary,
              borderBottom: `2px solid ${T.primary}40`, paddingBottom: 8, width: 200, textAlign: 'center',
            }}>REACTANTS</div>

            {/* H count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: leftH }, (_, i) => (
                  <AtomDot key={i} symbol="H" color={T.hydrogen} size={40}
                    opacity={interpolate(eqProgress, [0.4 + i * 0.05, 0.5 + i * 0.05], [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.hydrogen,
              }}>{leftH}</div>
            </div>

            {/* O count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: leftO }, (_, i) => (
                  <AtomDot key={i} symbol="O" color={T.oxygen} size={40}
                    opacity={interpolate(eqProgress, [0.5 + i * 0.05, 0.6 + i * 0.05], [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.oxygen,
              }}>{leftO}</div>
            </div>
          </div>

          {/* vs divider */}
          <div style={{
            display: 'flex', alignItems: 'center',
            fontFamily: T.font, fontSize: 28, fontWeight: 800, color: T.gold,
          }}>vs</div>

          {/* Right side — Products */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.secondary,
              borderBottom: `2px solid ${T.secondary}40`, paddingBottom: 8, width: 200, textAlign: 'center',
            }}>PRODUCTS</div>

            {/* H count */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: rightH }, (_, i) => (
                  <AtomDot key={i} symbol="H" color={T.hydrogen} size={40}
                    opacity={interpolate(eqProgress, [0.55 + i * 0.05, 0.65 + i * 0.05], [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.hydrogen,
              }}>{rightH}</div>
            </div>

            {/* O count — MISMATCH highlighted */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: rightO }, (_, i) => (
                  <AtomDot key={i} symbol="O" color={T.oxygen} size={40}
                    opacity={interpolate(eqProgress, [0.6 + i * 0.05, 0.7 + i * 0.05], [0, 1],
                      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                  />
                ))}
              </div>
              <div style={{
                fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.danger,
                textShadow: `0 0 15px ${T.danger}60`,
              }}>{rightO} {'\u2260'} {leftO}</div>
            </div>
          </div>
        </div>

        {/* Oxygen mismatch callout */}
        <div style={{
          opacity: interpolate(eqProgress, [0.75, 0.9], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 10,
        }}>
          <CrossMark opacity={1} size={36} />
          <div style={{
            fontFamily: T.font, fontSize: 24, fontWeight: 700, color: T.danger,
          }}>
            Oxygen: 2 on left, only 1 on right!
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Fix Oxygen (25.8–30.8s) ────────────────────────────────
const FixOxygenScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const twoCue = useCueSpring(ct('two'));

  const fixProgress = twoCue.isActive
    ? interpolate(frame - ct('two') * fps, [0, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Coefficient glow pulse
  const coefPulse = 0.7 + 0.3 * Math.sin(frame / 6);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <Particle key={i}
          x={80 + (i * 97) % 920} y={300 + (i * 153) % 1200}
          size={3 + (i % 3) * 2} color={T.oxygen} delay={i * 0.5}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        zIndex: 1,
      }}>
        <GlowText fontSize={32} color={T.textMuted} style={{ opacity: twoCue.opacity }}>
          Step 1: Fix the oxygen
        </GlowText>

        {/* Equation with coefficient appearing */}
        <div style={{
          opacity: twoCue.opacity, transform: `scale(${twoCue.scale})`,
        }}>
          <ChemEquation fontSize={52} parts={[
            { text: 'H', color: T.hydrogen, bold: true },
            { text: '\u2082', color: T.hydrogen },
            { text: '  +  ', color: T.textMuted },
            { text: 'O', color: T.oxygen, bold: true },
            { text: '\u2082', color: T.oxygen },
            { text: '  \u2192  ', color: T.gold },
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H', color: T.hydrogen, bold: true },
            { text: '\u2082', color: T.hydrogen },
            { text: 'O', color: T.oxygen, bold: true },
          ]} />
        </div>

        {/* Coefficient highlight */}
        <div style={{
          opacity: interpolate(fixProgress, [0.2, 0.4], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: `${T.coefficient}15`, border: `3px solid ${T.coefficient}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: T.mono, fontSize: 40, fontWeight: 900, color: T.coefficient,
            textShadow: `0 0 ${20 * coefPulse}px ${T.coefficient}80`,
            boxShadow: `0 0 ${30 * coefPulse}px ${T.coefficient}30`,
          }}>2</div>
          <div style={{
            fontFamily: T.font, fontSize: 26, color: T.text,
          }}>
            = coefficient (multiplier)
          </div>
        </div>

        {/* Oxygen count now matches */}
        <div style={{
          opacity: interpolate(fixProgress, [0.5, 0.7], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', alignItems: 'center', gap: 30,
          padding: '16px 30px', borderRadius: 16,
          background: `${T.success}08`, border: `2px solid ${T.success}30`,
        }}>
          <div style={{ display: 'flex', gap: 6 }}>
            <AtomDot symbol="O" color={T.oxygen} size={40} />
            <AtomDot symbol="O" color={T.oxygen} size={40} />
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 28, fontWeight: 800, color: T.success,
          }}>O: 2 = 2</div>
          <Checkmark opacity={interpolate(fixProgress, [0.7, 0.9], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            size={36}
          />
        </div>

        {/* But hydrogen is now broken */}
        <div style={{
          opacity: interpolate(fixProgress, [0.8, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <CrossMark opacity={1} size={32} />
          <div style={{
            fontFamily: T.font, fontSize: 22, fontWeight: 700, color: T.warning,
          }}>
            But now H: 2 {'\u2260'} 4 ... fix it!
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Fix Hydrogen (30.8–39.2s) ──────────────────────────────
const FixHydrogenScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hCue = useCueSpring(ct('hydrogen'));

  const fixProgress = hCue.isActive
    ? interpolate(frame - ct('hydrogen') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Pulsing glow for the final equation
  const finalGlow = 0.6 + 0.4 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <GlowText fontSize={32} color={T.textMuted} style={{ opacity: hCue.opacity }}>
          Step 2: Fix the hydrogen
        </GlowText>

        {/* Old equation fading */}
        <div style={{
          opacity: interpolate(fixProgress, [0, 0.3], [0.4, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <ChemEquation fontSize={40} parts={[
            { text: 'H\u2082', color: `${T.hydrogen}60` },
            { text: ' + ', color: T.textMuted },
            { text: 'O\u2082', color: `${T.oxygen}60` },
            { text: ' \u2192 ', color: T.textMuted },
            { text: '2H\u2082O', color: `${T.text}60` },
          ]} />
        </div>

        {/* New balanced equation — hero */}
        <div style={{
          opacity: interpolate(fixProgress, [0.2, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          transform: `scale(${interpolate(fixProgress, [0.2, 0.5], [0.9, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })})`,
          padding: '24px 40px', borderRadius: 20,
          background: `${T.primary}06`,
          border: `2px solid ${T.primary}30`,
          boxShadow: `0 0 ${40 * finalGlow}px ${T.primary}15`,
        }}>
          <ChemEquation fontSize={56} parts={[
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H', color: T.hydrogen, bold: true },
            { text: '\u2082', color: T.hydrogen },
            { text: '  +  ', color: T.textMuted },
            { text: 'O', color: T.oxygen, bold: true },
            { text: '\u2082', color: T.oxygen },
            { text: '  \u2192  ', color: T.gold },
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H', color: T.hydrogen, bold: true },
            { text: '\u2082', color: T.hydrogen },
            { text: 'O', color: T.oxygen, bold: true },
          ]} />
        </div>

        {/* Both sides count */}
        <div style={{
          opacity: interpolate(fixProgress, [0.5, 0.7], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', gap: 60, marginTop: 10,
        }}>
          {/* H count */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.hydrogen,
            }}>Hydrogen</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <AtomDot key={i} symbol="H" color={T.hydrogen} size={36}
                  opacity={interpolate(fixProgress, [0.5 + i * 0.03, 0.6 + i * 0.03], [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                />
              ))}
            </div>
            <div style={{
              fontFamily: T.mono, fontSize: 24, fontWeight: 800, color: T.success,
            }}>4 = 4</div>
          </div>

          {/* O count */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              fontFamily: T.font, fontWeight: 700, fontSize: 22, color: T.oxygen,
            }}>Oxygen</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: 2 }, (_, i) => (
                <AtomDot key={i} symbol="O" color={T.oxygen} size={36}
                  opacity={interpolate(fixProgress, [0.6 + i * 0.05, 0.7 + i * 0.05], [0, 1],
                    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
                />
              ))}
            </div>
            <div style={{
              fontFamily: T.mono, fontSize: 24, fontWeight: 800, color: T.success,
            }}>2 = 2</div>
          </div>
        </div>

        {/* BALANCED badge */}
        <div style={{
          opacity: interpolate(fixProgress, [0.8, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <Badge label={'\u2705 BALANCED!'} color={T.success} opacity={1} fontSize={28} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Balanced Check (39.2–46.8s) ────────────────────────────
const BalancedCheckScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const balancedCue = useCueSpring(ct('balanced'));

  const checkProgress = balancedCue.isActive
    ? interpolate(frame - ct('balanced') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const checks = [
    { element: 'H', left: 4, right: 4, color: T.hydrogen },
    { element: 'O', left: 2, right: 2, color: T.oxygen },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Celebration particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2 + frame / 80;
        const radius = 350 + Math.sin(frame / 25 + i) * 60;
        return (
          <Particle key={i}
            x={540 + Math.cos(angle) * radius - 3}
            y={960 + Math.sin(angle) * radius - 3}
            size={3 + (i % 3) * 2}
            color={[T.success, T.gold, T.primary][i % 3]}
            delay={i * 0.4}
          />
        );
      })}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        zIndex: 1,
      }}>
        <GlowText fontSize={42} color={T.success} style={{
          opacity: balancedCue.opacity,
        }}>
          VERIFICATION CHECK
        </GlowText>

        {/* Final equation reference */}
        <div style={{
          opacity: balancedCue.opacity, transform: `scale(${balancedCue.scale})`,
          padding: '14px 30px', borderRadius: 14,
          background: `${T.surface}`, border: `1px solid ${T.primary}30`,
        }}>
          <ChemEquation fontSize={40} parts={[
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H\u2082', color: T.hydrogen, bold: true },
            { text: ' + ', color: T.textMuted },
            { text: 'O\u2082', color: T.oxygen, bold: true },
            { text: ' \u2192 ', color: T.gold },
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H\u2082O', color: T.primary, bold: true },
          ]} />
        </div>

        {/* Atom check rows */}
        {checks.map((chk, i) => {
          const rowDelay = 0.2 + i * 0.2;
          const rowOpacity = interpolate(checkProgress, [rowDelay, rowDelay + 0.15], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const checkmarkOpacity = interpolate(checkProgress, [rowDelay + 0.15, rowDelay + 0.3], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={i} style={{
              opacity: rowOpacity,
              display: 'flex', alignItems: 'center', gap: 20,
              padding: '18px 36px', borderRadius: 16,
              background: `${chk.color}08`, border: `2px solid ${chk.color}25`,
              width: 700,
            }}>
              {/* Left count */}
              <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
                {Array.from({ length: chk.left }, (_, j) => (
                  <AtomDot key={j} symbol={chk.element} color={chk.color} size={44} />
                ))}
              </div>

              {/* Equals sign */}
              <div style={{
                fontFamily: T.mono, fontSize: 36, fontWeight: 900, color: T.success,
                textShadow: `0 0 15px ${T.success}60`,
              }}>=</div>

              {/* Right count */}
              <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center' }}>
                {Array.from({ length: chk.right }, (_, j) => (
                  <AtomDot key={j} symbol={chk.element} color={chk.color} size={44} />
                ))}
              </div>

              {/* Checkmark */}
              <Checkmark opacity={checkmarkOpacity} size={40} />
            </div>
          );
        })}

        {/* Summary text */}
        <div style={{
          opacity: interpolate(checkProgress, [0.7, 0.9], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <GlowText fontSize={32} color={T.gold}>
            4H = 4H {'\u2022'} 2O = 2O
          </GlowText>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.textMuted,
          }}>
            Every atom accounted for!
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: 5-Step Method (46.8–62s) ───────────────────────────────
const MethodScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const methodCue = useCueSpring(ct('method'));

  const steps = [
    { text: 'Write the unbalanced equation', color: T.primary },
    { text: 'Count atoms on each side', color: T.hydrogen },
    { text: 'Add coefficients to the MOST complex molecule first', color: T.gold },
    { text: 'Balance remaining elements one by one', color: T.oxygen },
    { text: 'Double-check: every atom must match!', color: T.success },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Subtle background grid */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        backgroundImage: `linear-gradient(${T.primary}05 1px, transparent 1px), linear-gradient(90deg, ${T.primary}05 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        zIndex: 1,
      }}>
        <GlowText fontSize={42} color={T.primary} style={{
          opacity: methodCue.opacity,
        }}>
          THE 5-STEP METHOD
        </GlowText>

        <div style={{
          opacity: methodCue.opacity,
          fontFamily: T.font, fontSize: 22, color: T.textMuted,
          marginBottom: 10,
        }}>
          Works for ANY equation
        </div>

        {/* Steps — appearing one by one */}
        {steps.map((step, i) => {
          const stepDelayS = i * 0.8;
          const stepFrame = (ct('method') + stepDelayS) * fps;
          const fadeDur = 0.6 * fps;
          const stepOpacity = interpolate(frame, [stepFrame, stepFrame + fadeDur], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          const stepTranslateY = interpolate(frame, [stepFrame, stepFrame + fadeDur], [20, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
          return (
            <StepCard
              key={i}
              number={i + 1}
              text={step.text}
              color={step.color}
              opacity={stepOpacity}
              translateY={stepTranslateY}
            />
          );
        })}

        {/* Pro tip */}
        <div style={{
          opacity: methodCue.isActive
            ? interpolate(frame - ct('method') * fps, [120, 150], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0,
          fontFamily: T.mono, fontSize: 20, color: `${T.gold}90`,
          padding: '10px 24px', borderRadius: 10,
          background: `${T.gold}08`, border: `1px solid ${T.gold}20`,
          marginTop: 10,
        }}>
          {'\uD83D\uDCA1'} Start with the element that appears in the fewest formulas
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: Mole Ratios + CTA (62–70.5s) ──────────────────────────
const MoleRatiosScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coefCue = useCueSpring(ct('coefficients'));

  const ratioProgress = coefCue.isActive
    ? interpolate(frame - ct('coefficients') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Glowing pulse
  const pulse = 0.7 + 0.3 * Math.sin(frame / 7);

  const ratios = [
    { label: '2 mol H\u2082', color: T.hydrogen },
    { label: '1 mol O\u2082', color: T.oxygen },
    { label: '2 mol H\u2082O', color: T.primary },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Particle celebration */}
      {Array.from({ length: 25 }, (_, i) => (
        <Particle key={i}
          x={40 + (i * 41) % 1000} y={100 + (i * 71) % 1700}
          size={3 + (i % 3) * 2}
          color={[T.primary, T.secondary, T.gold, T.success][i % 4]}
          delay={i * 0.3}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        zIndex: 1,
      }}>
        <GlowText fontSize={36} color={T.textMuted} style={{ opacity: coefCue.opacity }}>
          Coefficients tell you more...
        </GlowText>

        {/* Balanced equation reference */}
        <div style={{
          opacity: coefCue.opacity, transform: `scale(${coefCue.scale})`,
          padding: '14px 30px', borderRadius: 14,
          background: T.surface, border: `1px solid ${T.primary}20`,
        }}>
          <ChemEquation fontSize={42} parts={[
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H\u2082', color: T.hydrogen, bold: true },
            { text: ' + ', color: T.textMuted },
            { text: 'O\u2082', color: T.oxygen, bold: true },
            { text: ' \u2192 ', color: T.gold },
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H\u2082O', color: T.primary, bold: true },
          ]} />
        </div>

        <GlowText fontSize={42} color={T.gold} style={{
          opacity: interpolate(ratioProgress, [0.1, 0.3], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          MOLE RATIOS
        </GlowText>

        {/* Ratio badges */}
        <div style={{
          display: 'flex', gap: 20, alignItems: 'center',
          opacity: interpolate(ratioProgress, [0.2, 0.45], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {ratios.map((r, i) => (
            <React.Fragment key={i}>
              {i > 0 && (
                <div style={{
                  fontFamily: T.font, fontSize: 28, fontWeight: 800, color: T.gold,
                }}>:</div>
              )}
              <div style={{
                padding: '14px 24px', borderRadius: 14,
                background: `${r.color}10`, border: `2px solid ${r.color}50`,
                fontFamily: T.mono, fontSize: 26, fontWeight: 800, color: r.color,
                textShadow: `0 0 15px ${r.color}40`,
              }}>{r.label}</div>
            </React.Fragment>
          ))}
        </div>

        {/* Arrow down */}
        <div style={{
          opacity: interpolate(ratioProgress, [0.4, 0.55], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.font, fontSize: 36, color: T.gold,
        }}>
          {'\u2193'}
        </div>

        {/* Simplified ratio */}
        <div style={{
          opacity: interpolate(ratioProgress, [0.5, 0.7], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          padding: '16px 40px', borderRadius: 16,
          background: `${T.gold}10`, border: `2px solid ${T.gold}40`,
          boxShadow: `0 0 ${30 * pulse}px ${T.gold}20`,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 36, fontWeight: 900, color: T.gold,
            textShadow: `0 0 20px ${T.gold}60`,
          }}>
            2 : 1 : 2
          </div>
        </div>

        <div style={{
          opacity: interpolate(ratioProgress, [0.6, 0.8], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.font, fontSize: 24, color: T.textMuted, textAlign: 'center',
          maxWidth: 800, lineHeight: 1.5,
        }}>
          Coefficients <span style={{ color: T.primary, fontWeight: 700 }}>=</span> mole ratios.
          This is the key to all stoichiometry calculations!
        </div>

        {/* CTA */}
        <Badge
          label="FOLLOW for #5: Limiting Reagents"
          color={T.secondary}
          opacity={interpolate(ratioProgress, [0.8, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',            startS: 0,     durationS: 2.06,   Component: HookScene },
  { id: 'atoms-rule',      startS: 2.06,  durationS: 8.54,   Component: AtomsRuleScene },
  { id: 'water-equation',  startS: 10.60, durationS: 15.18,  Component: WaterEquationScene },
  { id: 'fix-oxygen',      startS: 25.78, durationS: 4.98,   Component: FixOxygenScene },
  { id: 'fix-hydrogen',    startS: 30.76, durationS: 8.46,   Component: FixHydrogenScene },
  { id: 'balanced-check',  startS: 39.22, durationS: 7.54,   Component: BalancedCheckScene },
  { id: 'method',          startS: 46.76, durationS: 15.24,  Component: MethodScene },
  { id: 'mole-ratios',     startS: 62.00, durationS: 8.54,   Component: MoleRatiosScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryBalancingTikTok: React.FC<StoichiometryBalancingTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/04-balancing-narration.mp3')} volume={1} />
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

export function getStoichiometryBalancingDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const StoichiometryBalancingCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.primary}15 0%, transparent 70%)`,
      }} />

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, zIndex: 1,
      }}>
        <GlowText fontSize={52} color={T.primary}>BALANCING EQUATIONS</GlowText>
        <GlowText fontSize={36} color={T.secondary}>LIKE A PRO</GlowText>

        {/* Mini equation */}
        <div style={{ marginTop: 10 }}>
          <ChemEquation fontSize={32} parts={[
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H\u2082', color: T.hydrogen, bold: true },
            { text: ' + ', color: T.textMuted },
            { text: 'O\u2082', color: T.oxygen, bold: true },
            { text: ' \u2192 ', color: T.gold },
            { text: '2', color: T.coefficient, bold: true, glow: true },
            { text: 'H\u2082O', color: T.primary, bold: true },
          ]} />
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 24, color: T.textMuted, marginTop: 10,
        }}>
          Stoichiometry #4 — Balancing Equations
        </div>
        <div style={{
          fontFamily: T.font, fontSize: 18, color: `${T.primary}80`, marginTop: 4,
        }}>
          Cambridge IGCSE / AS Chemistry
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
