/**
 * Stoichiometry #8 — "Limiting Reagent & Yield" TikTok (9:16) v1
 *
 * Cambridge IGCSE / AS Chemistry — Limiting reagent identification,
 * sandwich analogy, step-by-step mole calculation, theoretical yield.
 *
 * Pure CSS motion graphics.
 * 10 scenes, ~88 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 89.12;

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
  mg: '#4ade80',          // green for magnesium
  hcl: '#a78bfa',         // purple for HCl
  product: '#38bdf8',     // light blue for MgCl₂
  h2: '#f97316',          // orange for H₂
  bread: '#d4a76a',       // bread brown
  cheese: '#fbbf24',      // cheese yellow
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'perfect':   2.44,     // "perfect" — one runs out first
  'sandwiches': 9.82,    // sandwich analogy begins
  'reaction':  26.72,    // reaction equation setup
  'given':     36.44,    // given amounts
  'mg':        47.16,    // Mg calculation
  'hcl':       52.30,    // HCl calculation
  'limiting':  69.60,    // limiting reagent reveal
  'yield':     71.56,    // yield formula
  'never':     82.30,    // nobody gets 100%
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryLimitingTikTokProps {
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

// Formula text with monospace styling
const FormulaText: React.FC<{
  children: React.ReactNode; fontSize?: number; color?: string; opacity?: number;
  style?: React.CSSProperties;
}> = ({ children, fontSize = 36, color = T.text, opacity = 1, style }) => (
  <div style={{
    fontFamily: T.mono, fontWeight: 700, fontSize, color, opacity,
    textAlign: 'center', ...style,
  }}>{children}</div>
);

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook (0–2.4s) ──────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 2.4 * fps], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title fade in
  const titleOpacity = interpolate(frame, [8, 25], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [8, 25], [0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtitle delayed
  const subOpacity = interpolate(frame, [30, 50], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Question mark pulse
  const pulse = 0.85 + 0.15 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/stoichiometry/08-limiting-hook.png')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.45],
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
            One reagent runs out first...
          </div>

          <GlowText fontSize={64} color={T.danger}>
            LIMITING REAGENT
          </GlowText>

          <div style={{
            fontFamily: T.mono, fontSize: 22, color: `${T.gold}90`,
            opacity: subOpacity,
          }}>
            & theoretical yield
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Perfect Amounts (2.4–9.8s) ─────────────────────────────
const PerfectAmountsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const perfectCue = useCueSpring(ct('perfect'));

  // Two beakers with equal fill animation
  const fillProgress = perfectCue.isActive
    ? interpolate(frame - ct('perfect') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const glowPulse = 0.6 + 0.4 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 15 }, (_, i) => (
        <Particle
          key={i}
          x={80 + (i * 67) % 920}
          y={200 + (i * 113) % 1500}
          size={4 + (i % 4) * 2}
          color={i % 2 === 0 ? T.primary : T.secondary}
          delay={i * 0.7}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: perfectCue.opacity, transform: `scale(${perfectCue.scale})` }}>
          <GlowText fontSize={42} color={T.primary} style={{
            textShadow: `0 0 ${40 * glowPulse}px ${T.primary}80, 0 0 80px ${T.primary}40`,
          }}>
            PERFECT PROPORTIONS?
          </GlowText>
        </div>

        {/* Two beakers */}
        <div style={{
          display: 'flex', gap: 60, alignItems: 'flex-end',
          opacity: perfectCue.opacity,
        }}>
          {[
            { label: 'Reagent A', color: T.mg, fill: fillProgress },
            { label: 'Reagent B', color: T.hcl, fill: fillProgress * 0.4 },
          ].map((beaker, i) => (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            }}>
              {/* Beaker */}
              <div style={{
                width: 140, height: 200, borderRadius: '0 0 16 16',
                border: `3px solid ${beaker.color}60`,
                borderTop: 'none',
                position: 'relative', overflow: 'hidden',
                background: `${T.surface}`,
              }}>
                {/* Fill level */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${beaker.fill * 80}%`,
                  background: `linear-gradient(180deg, ${beaker.color}40, ${beaker.color}20)`,
                  borderTop: `2px solid ${beaker.color}60`,
                  transition: 'height 0.1s',
                }} />
              </div>
              <div style={{
                fontFamily: T.font, fontSize: 20, color: beaker.color, fontWeight: 700,
              }}>{beaker.label}</div>
            </div>
          ))}
        </div>

        <div style={{
          opacity: interpolate(fillProgress, [0.3, 0.7], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.font, fontSize: 26, color: T.danger, fontWeight: 700,
          textAlign: 'center',
        }}>
          Rarely perfectly balanced!
        </div>

        <Badge
          label="One always runs out first"
          color={T.warning}
          opacity={interpolate(fillProgress, [0.6, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Sandwich Analogy (9.8–26.7s) ───────────────────────────
const SandwichAnalogyScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sandwichCue = useCueSpring(ct('sandwiches'));

  const buildProgress = sandwichCue.isActive
    ? interpolate(frame - ct('sandwiches') * fps, [0, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Cross-out cheese animation
  const crossOutProgress = interpolate(buildProgress, [0.6, 0.8], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: sandwichCue.opacity }}>
          <GlowText fontSize={38} color={T.warning}>SANDWICH ANALOGY</GlowText>
        </div>

        {/* Ingredients row */}
        <div style={{
          display: 'flex', gap: 60, alignItems: 'center',
          opacity: sandwichCue.opacity,
        }}>
          {/* Bread stack */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, width: 220, justifyContent: 'center',
            }}>
              {Array.from({ length: 10 }, (_, i) => {
                const itemOpacity = interpolate(buildProgress, [0.05 + i * 0.03, 0.1 + i * 0.03], [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={i} style={{
                    width: 40, height: 28, borderRadius: 6,
                    background: `linear-gradient(180deg, ${T.bread}, ${T.bread}90)`,
                    border: `2px solid ${T.bread}80`,
                    opacity: itemOpacity,
                    boxShadow: `0 2px 4px ${T.bread}20`,
                  }} />
                );
              })}
            </div>
            <FormulaText fontSize={28} color={T.bread}>
              10 bread
            </FormulaText>
          </div>

          <div style={{
            fontFamily: T.font, fontSize: 40, color: T.textMuted, fontWeight: 900,
            opacity: sandwichCue.opacity,
          }}>+</div>

          {/* Cheese stack */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              display: 'flex', gap: 8, justifyContent: 'center',
            }}>
              {Array.from({ length: 3 }, (_, i) => {
                const itemOpacity = interpolate(buildProgress, [0.15 + i * 0.05, 0.25 + i * 0.05], [0, 1],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
                return (
                  <div key={i} style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: `linear-gradient(135deg, ${T.cheese}, ${T.cheese}80)`,
                    border: `2px solid ${T.cheese}80`,
                    opacity: itemOpacity,
                    boxShadow: `0 2px 8px ${T.cheese}20`,
                  }} />
                );
              })}
            </div>
            <FormulaText fontSize={28} color={T.cheese}>
              3 cheese
            </FormulaText>
          </div>
        </div>

        {/* Arrow */}
        <div style={{
          fontFamily: T.font, fontSize: 48, color: T.primary, fontWeight: 900,
          opacity: interpolate(buildProgress, [0.3, 0.45], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>{'\u2193'}</div>

        {/* Result: 3 sandwiches */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
          opacity: interpolate(buildProgress, [0.4, 0.6], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            display: 'flex', gap: 20,
          }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} style={{
                width: 80, height: 60, borderRadius: 12,
                background: `linear-gradient(180deg, ${T.bread}80, ${T.cheese}40, ${T.bread}80)`,
                border: `2px solid ${T.gold}60`,
                boxShadow: `0 0 20px ${T.gold}20`,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                fontFamily: T.font, fontSize: 24, color: T.text, fontWeight: 700,
              }}>{'\ud83e\uddc0'}</div>
            ))}
          </div>

          <GlowText fontSize={44} color={T.gold}>
            = 3 sandwiches
          </GlowText>
        </div>

        {/* Cheese crossed out as limiting */}
        <div style={{
          opacity: crossOutProgress,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.danger, fontWeight: 700,
            padding: '8px 24px', borderRadius: 12,
            background: `${T.danger}15`, border: `2px solid ${T.danger}40`,
            textDecoration: 'none',
            position: 'relative',
          }}>
            Cheese runs out first!
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0, height: 3,
              background: T.danger, transform: 'translateY(-50%)',
              opacity: 0,
            }} />
          </div>
          <Badge
            label="CHEESE = LIMITING REAGENT"
            color={T.danger}
            opacity={interpolate(buildProgress, [0.85, 1], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            fontSize={20}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Reaction Setup (26.7–36.4s) ────────────────────────────
const ReactionSetupScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reactionCue = useCueSpring(ct('reaction'));

  const buildProgress = reactionCue.isActive
    ? interpolate(frame - ct('reaction') * fps, [0, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.7 + 0.3 * Math.sin(frame / 8);

  // Equation parts with staggered reveal
  const parts = [
    { text: 'Mg', color: T.mg },
    { text: '+', color: T.textMuted },
    { text: '2HCl', color: T.hcl },
    { text: '\u2192', color: T.primary },
    { text: 'MgCl\u2082', color: T.product },
    { text: '+', color: T.textMuted },
    { text: 'H\u2082', color: T.h2 },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Particle
          key={i}
          x={80 + (i * 47) % 920}
          y={200 + (i * 83) % 1500}
          size={4 + (i % 4) * 2}
          color={[T.mg, T.hcl, T.product][i % 3]}
          delay={i * 0.7}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
      }}>
        <div style={{ opacity: reactionCue.opacity, transform: `scale(${reactionCue.scale})` }}>
          <GlowText fontSize={36} color={T.primary}>THE REACTION</GlowText>
        </div>

        {/* Balanced equation */}
        <div style={{
          display: 'flex', gap: 16, alignItems: 'center',
          padding: '20px 40px', borderRadius: 20,
          background: `${T.surface}`,
          border: `2px solid ${T.primary}30`,
          boxShadow: `0 0 40px ${T.primary}10`,
        }}>
          {parts.map((part, i) => {
            const partDelay = i * 0.06;
            const partOpacity = interpolate(buildProgress, [partDelay, partDelay + 0.15], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                fontFamily: T.mono, fontSize: 44, fontWeight: 900, color: part.color,
                textShadow: `0 0 ${20 * pulse}px ${part.color}50`,
                opacity: partOpacity,
              }}>{part.text}</div>
            );
          })}
        </div>

        {/* Labels underneath */}
        <div style={{
          display: 'flex', gap: 80, alignItems: 'center',
          opacity: interpolate(buildProgress, [0.5, 0.8], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <Badge label="Magnesium" color={T.mg} opacity={1} fontSize={18} />
            <div style={{ fontFamily: T.font, fontSize: 16, color: T.textMuted }}>metal</div>
          </div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          }}>
            <Badge label="Hydrochloric acid" color={T.hcl} opacity={1} fontSize={18} />
            <div style={{ fontFamily: T.font, fontSize: 16, color: T.textMuted }}>acid</div>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: 50, alignItems: 'center',
          opacity: interpolate(buildProgress, [0.7, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <Badge label="MgCl\u2082 salt" color={T.product} opacity={1} fontSize={18} />
          <Badge label="H\u2082 gas" color={T.h2} opacity={1} fontSize={18} />
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
          opacity: interpolate(buildProgress, [0.8, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Ratio: <span style={{ color: T.mg, fontWeight: 700 }}>1</span> Mg :{' '}
          <span style={{ color: T.hcl, fontWeight: 700 }}>2</span> HCl
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Given Amounts (36.4–47.2s) ─────────────────────────────
const GivenAmountsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const givenCue = useCueSpring(ct('given'));

  const revealProgress = givenCue.isActive
    ? interpolate(frame - ct('given') * fps, [0, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        <div style={{ opacity: givenCue.opacity, transform: `scale(${givenCue.scale})` }}>
          <GlowText fontSize={36} color={T.warning}>GIVEN:</GlowText>
        </div>

        {/* Two data cards */}
        <div style={{
          display: 'flex', gap: 40, alignItems: 'stretch',
        }}>
          {/* Mg card */}
          <div style={{
            opacity: interpolate(revealProgress, [0, 0.3], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            width: 400, padding: '30px 35px', borderRadius: 20,
            background: `${T.mg}08`, border: `2px solid ${T.mg}40`,
            boxShadow: `0 0 30px ${T.mg}15`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              fontFamily: T.font, fontSize: 24, color: T.mg, fontWeight: 700,
            }}>Magnesium</div>
            <div style={{
              fontFamily: T.mono, fontSize: 60, fontWeight: 900, color: T.mg,
              textShadow: `0 0 30px ${T.mg}50`,
              lineHeight: 1,
            }}>2.4 g</div>
            <div style={{
              fontFamily: T.font, fontSize: 18, color: T.textMuted,
            }}>A{'\u1d63'} = 24</div>
          </div>

          {/* HCl card */}
          <div style={{
            opacity: interpolate(revealProgress, [0.2, 0.5], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            width: 400, padding: '30px 35px', borderRadius: 20,
            background: `${T.hcl}08`, border: `2px solid ${T.hcl}40`,
            boxShadow: `0 0 30px ${T.hcl}15`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          }}>
            <div style={{
              fontFamily: T.font, fontSize: 24, color: T.hcl, fontWeight: 700,
            }}>Hydrochloric acid</div>
            <div style={{
              fontFamily: T.mono, fontSize: 60, fontWeight: 900, color: T.hcl,
              textShadow: `0 0 30px ${T.hcl}50`,
              lineHeight: 1,
            }}>100 cm{'\u00b3'}</div>
            <div style={{
              fontFamily: T.font, fontSize: 18, color: T.textMuted,
            }}>concentration = 1 mol/dm{'\u00b3'}</div>
          </div>
        </div>

        {/* Question */}
        <div style={{
          opacity: interpolate(revealProgress, [0.6, 0.9], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.font, fontSize: 28, color: T.primary, fontWeight: 700,
          textAlign: 'center', padding: '12px 30px',
          background: `${T.primary}10`, borderRadius: 14,
          border: `1px solid ${T.primary}30`,
        }}>
          Which one is limiting?
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Mg Calculation (47.2–52.3s) ────────────────────────────
const MgCalcScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mgCue = useCueSpring(ct('mg'));

  const calcProgress = mgCue.isActive
    ? interpolate(frame - ct('mg') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: mgCue.opacity, transform: `scale(${mgCue.scale})` }}>
          <GlowText fontSize={36} color={T.mg}>STEP 1: MOLES OF Mg</GlowText>
        </div>

        {/* Formula */}
        <div style={{
          opacity: interpolate(calcProgress, [0, 0.2], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          padding: '20px 40px', borderRadius: 16,
          background: `${T.surface}`, border: `2px solid ${T.mg}30`,
        }}>
          <FormulaText fontSize={32} color={T.textMuted}>
            n = mass / M{'\u1d63'}
          </FormulaText>
        </div>

        {/* Substitution */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
          opacity: interpolate(calcProgress, [0.2, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            fontFamily: T.mono, fontSize: 40,
          }}>
            <span style={{ color: T.text }}>n =</span>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ color: T.mg, fontWeight: 700 }}>2.4</span>
              <div style={{
                width: 80, height: 3, background: T.textMuted, borderRadius: 2,
              }} />
              <span style={{ color: T.textMuted }}>24</span>
            </div>
          </div>
        </div>

        {/* Result */}
        <div style={{
          opacity: interpolate(calcProgress, [0.5, 0.8], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 56, fontWeight: 900, color: T.mg,
            textShadow: `0 0 40px ${T.mg}60`,
          }}>
            = 0.1 mol
          </div>
          <Badge label="Mg moles found" color={T.mg} opacity={1} fontSize={20} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: HCl Calculation (52.3–69.6s) ───────────────────────────
const HClCalcScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hclCue = useCueSpring(ct('hcl'));

  const calcProgress = hclCue.isActive
    ? interpolate(frame - ct('hcl') * fps, [0, 120], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 25,
      }}>
        <div style={{ opacity: hclCue.opacity, transform: `scale(${hclCue.scale})` }}>
          <GlowText fontSize={36} color={T.hcl}>STEP 2: MOLES OF HCl</GlowText>
        </div>

        {/* Formula */}
        <div style={{
          opacity: interpolate(calcProgress, [0, 0.1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          padding: '16px 36px', borderRadius: 16,
          background: `${T.surface}`, border: `2px solid ${T.hcl}30`,
        }}>
          <FormulaText fontSize={30} color={T.textMuted}>
            n = c {'\u00d7'} V
          </FormulaText>
        </div>

        {/* Substitution */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 14,
          fontFamily: T.mono, fontSize: 36,
          opacity: interpolate(calcProgress, [0.1, 0.25], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <span style={{ color: T.text }}>n =</span>
          <span style={{ color: T.hcl, fontWeight: 700 }}>1</span>
          <span style={{ color: T.textMuted }}>{'\u00d7'}</span>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <span style={{ color: T.hcl }}>100</span>
            <div style={{ width: 80, height: 3, background: T.textMuted, borderRadius: 2 }} />
            <span style={{ color: T.textMuted }}>1000</span>
          </div>
        </div>

        {/* Result */}
        <div style={{
          opacity: interpolate(calcProgress, [0.25, 0.4], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.hcl,
          textShadow: `0 0 30px ${T.hcl}50`,
        }}>
          = 0.1 mol HCl
        </div>

        {/* Divider */}
        <div style={{
          width: 600, height: 2, borderRadius: 2,
          background: `linear-gradient(90deg, transparent, ${T.danger}60, transparent)`,
          opacity: interpolate(calcProgress, [0.4, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }} />

        {/* But needs 0.2! */}
        <div style={{
          opacity: interpolate(calcProgress, [0.5, 0.65], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.textMuted, textAlign: 'center',
          }}>
            Equation needs <span style={{ color: T.hcl, fontWeight: 700 }}>2</span> HCl per{' '}
            <span style={{ color: T.mg, fontWeight: 700 }}>1</span> Mg
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 26, color: T.text, textAlign: 'center',
          }}>
            For 0.1 mol Mg, need{' '}
            <span style={{ color: T.hcl, fontWeight: 900 }}>0.2 mol HCl</span>
          </div>
        </div>

        {/* Shortfall dramatic */}
        <div style={{
          opacity: interpolate(calcProgress, [0.7, 0.85], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 36, color: T.danger, fontWeight: 900,
            textShadow: `0 0 20px ${T.danger}50`,
          }}>
            Have 0.1 {'\u2014'} Need 0.2
          </div>
          <Badge
            label="NOT ENOUGH HCl!"
            color={T.danger}
            opacity={interpolate(calcProgress, [0.85, 1], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            fontSize={22}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: Limiting Reveal (69.6–71.6s) ───────────────────────────
const LimitingRevealScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const limitingCue = useCueSpring(ct('limiting'));

  const pulse = 0.6 + 0.4 * Math.sin(frame / 6);

  // Dramatic zoom-in
  const zoomScale = limitingCue.isActive
    ? interpolate(frame - ct('limiting') * fps, [0, 20], [0.6, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0.6;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Radial glow burst */}
      <div style={{
        position: 'absolute',
        width: 800, height: 800, borderRadius: '50%',
        background: `radial-gradient(circle, ${T.danger}20, transparent 70%)`,
        opacity: limitingCue.opacity * pulse,
      }} />

      <div style={{
        opacity: limitingCue.opacity, transform: `scale(${limitingCue.scale * zoomScale})`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
      }}>
        <div style={{
          fontFamily: T.font, fontSize: 32, color: T.textMuted, fontWeight: 600,
        }}>
          The Limiting Reagent is...
        </div>

        <GlowText fontSize={96} color={T.danger} style={{
          textShadow: `0 0 ${60 * pulse}px ${T.danger}80, 0 0 120px ${T.danger}40`,
          letterSpacing: 4,
        }}>
          HCl
        </GlowText>

        <Badge
          label="It runs out first!"
          color={T.hcl}
          opacity={limitingCue.opacity}
          fontSize={24}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 9: Yield Formula (71.6–82.3s) ─────────────────────────────
const YieldScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const yieldCue = useCueSpring(ct('yield'));

  const buildProgress = yieldCue.isActive
    ? interpolate(frame - ct('yield') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  const pulse = 0.7 + 0.3 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: yieldCue.opacity, transform: `scale(${yieldCue.scale})` }}>
          <GlowText fontSize={38} color={T.gold}>PERCENTAGE YIELD</GlowText>
        </div>

        {/* Formula card */}
        <div style={{
          opacity: interpolate(buildProgress, [0, 0.25], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          padding: '30px 50px', borderRadius: 20,
          background: `${T.surface}`, border: `2px solid ${T.gold}40`,
          boxShadow: `0 0 40px ${T.gold}15`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 36, fontWeight: 700, color: T.text,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ color: T.gold }}>%</span>
            <span>yield =</span>
          </div>

          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <div style={{
              fontFamily: T.mono, fontSize: 32, color: T.success, fontWeight: 700,
              padding: '6px 20px',
            }}>
              actual yield
            </div>
            <div style={{
              width: 400, height: 3, borderRadius: 2,
              background: `linear-gradient(90deg, ${T.gold}40, ${T.gold}, ${T.gold}40)`,
            }} />
            <div style={{
              fontFamily: T.mono, fontSize: 32, color: T.primary, fontWeight: 700,
              padding: '6px 20px',
            }}>
              theoretical yield
            </div>
          </div>

          <div style={{
            fontFamily: T.mono, fontSize: 40, fontWeight: 900, color: T.gold,
            textShadow: `0 0 ${25 * pulse}px ${T.gold}60`,
          }}>
            {'\u00d7'} 100
          </div>
        </div>

        {/* Key insight */}
        <div style={{
          opacity: interpolate(buildProgress, [0.4, 0.65], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.textMuted, textAlign: 'center',
          }}>
            <span style={{ color: T.success, fontWeight: 700 }}>Actual</span> = what you get in the lab
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.textMuted, textAlign: 'center',
          }}>
            <span style={{ color: T.primary, fontWeight: 700 }}>Theoretical</span> = what the maths predicts
          </div>
        </div>

        <Badge
          label="Always < 100% in practice"
          color={T.warning}
          opacity={interpolate(buildProgress, [0.7, 0.95], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 10: CTA (82.3–87.9s) ──────────────────────────────────────
const CtaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const neverCue = useCueSpring(ct('never'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Summary items stagger
  const items = [
    { text: 'Find moles of each reagent', color: T.primary },
    { text: 'Compare to required ratio', color: T.hcl },
    { text: 'The one that runs out = limiting', color: T.danger },
    { text: 'Yield = actual / theoretical \u00d7 100', color: T.gold },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 25,
        padding: 40,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        <div style={{ opacity: neverCue.opacity, transform: `scale(${neverCue.scale})` }}>
          <GlowText fontSize={34} color={T.warning}>
            NOBODY GETS 100%
          </GlowText>
          <div style={{
            fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
            marginTop: 8,
          }}>
            That's real chemistry.
          </div>
        </div>

        {/* Summary bullets */}
        {items.map((item, i) => {
          const itemOpacity = neverCue.isActive
            ? interpolate(frame - ct('never') * fps, [10 + i * 12, 25 + i * 12], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0;
          return (
            <div key={i} style={{
              opacity: itemOpacity,
              fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
              padding: '8px 20px', background: `${item.color}10`, borderRadius: 10,
              border: `1px solid ${item.color}30`, width: 750,
            }}>
              <span style={{ color: item.color, fontWeight: 700 }}>{'\u2713'}</span>{' '}
              {item.text}
            </div>
          );
        })}

        {/* Series complete badge */}
        <div style={{
          opacity: neverCue.isActive
            ? interpolate(frame - ct('never') * fps, [55, 75], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <Badge
            label="STOICHIOMETRY SERIES COMPLETE"
            color={T.secondary}
            opacity={1}
            fontSize={22}
          />
          <div style={{
            fontFamily: T.font, fontSize: 18, color: T.textMuted,
          }}>
            8 / 8 {'\u2014'} Follow for more chemistry
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',               startS: 0,      durationS: 2.44,   Component: HookScene },
  { id: 'perfect-amounts',    startS: 2.44,   durationS: 7.38,   Component: PerfectAmountsScene },
  { id: 'sandwich-analogy',   startS: 9.82,   durationS: 16.90,  Component: SandwichAnalogyScene },
  { id: 'reaction-setup',     startS: 26.72,  durationS: 9.72,   Component: ReactionSetupScene },
  { id: 'given-amounts',      startS: 36.44,  durationS: 10.72,  Component: GivenAmountsScene },
  { id: 'mg-calc',            startS: 47.16,  durationS: 5.14,   Component: MgCalcScene },
  { id: 'hcl-calc',           startS: 52.30,  durationS: 17.30,  Component: HClCalcScene },
  { id: 'limiting-reveal',    startS: 69.60,  durationS: 1.96,   Component: LimitingRevealScene },
  { id: 'yield-formula',      startS: 71.56,  durationS: 10.74,  Component: YieldScene },
  { id: 'cta',                startS: 82.30,  durationS: 5.61,   Component: CtaScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryLimitingTikTok: React.FC<StoichiometryLimitingTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/08-limiting-narration.mp3')} volume={1} />
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

export function getStoichiometryLimitingDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const StoichiometryLimitingCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/stoichiometry/08-limiting-hook.png')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.45, filter: 'brightness(0.5)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={52} color={T.danger}>LIMITING REAGENT</GlowText>
      <div style={{
        fontFamily: T.mono, fontSize: 36, color: T.gold, marginTop: 20,
        textShadow: `0 0 20px ${T.gold}40`,
      }}>
        & Percentage Yield
      </div>
      <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20 }}>
        Stoichiometry #8 — Limiting Reagent & Yield
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 10 }}>
        Cambridge IGCSE / AS Chemistry
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
