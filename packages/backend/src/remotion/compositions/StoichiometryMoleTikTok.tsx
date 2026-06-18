/**
 * Stoichiometry #1 — "What Even IS a Mole?" TikTok (9:16) v1
 *
 * Cambridge IGCSE / AS Chemistry — Introduction to the Mole concept.
 * Avogadro's number, rice analogy, molar mass examples.
 *
 * Pure CSS motion graphics.
 * 7 scenes, ~70 seconds, 1080x1920.
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
const TOTAL_DURATION_S = 70.36;

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
  sodium: '#a78bfa',      // purple for sodium
  iron: '#f97316',        // orange for iron
  oxygen: '#ef4444',      // red for oxygen
  hydrogen: '#38bdf8',    // light blue for hydrogen
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved timestamps ────────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  'mole':      7.12,     // "mole" first mentioned
  'six':       12.98,    // 6.022 × 10²³ number
  'rice':      22.20,    // rice grains analogy
  'twelve':    28.92,    // 12g carbon example
  'mass':      47.60,    // molar mass concept
  'eighteen':  52.76,    // 18g water example
  'weigh':     61.92,    // scale connection
};

// ── Types ────────────────────────────────────────────────────────────
export interface StoichiometryMoleTikTokProps {
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

// Periodic table element card
const ElementCard: React.FC<{
  symbol: string; name: string; mass: string; color: string;
  opacity: number; scale?: number;
}> = ({ symbol, name, mass, color, opacity, scale = 1 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    width: 180, height: 220, borderRadius: 16,
    border: `2px solid ${color}60`, background: `${color}08`,
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 6,
    boxShadow: `0 0 30px ${color}20, inset 0 0 20px ${color}08`,
  }}>
    <div style={{
      fontFamily: T.mono, fontSize: 14, color: `${color}80`, fontWeight: 600,
    }}>{mass}</div>
    <div style={{
      fontFamily: T.font, fontSize: 72, fontWeight: 900, color,
      textShadow: `0 0 40px ${color}50`,
      lineHeight: 1,
    }}>{symbol}</div>
    <div style={{
      fontFamily: T.font, fontSize: 18, color: T.textMuted, fontWeight: 500,
    }}>{name}</div>
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

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook (0–7s) ────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns slow zoom on hook image
  const hookScale = interpolate(frame, [0, 7 * fps], [1.0, 1.12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Title fade in
  const titleOpacity = interpolate(frame, [15, 40], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleScale = interpolate(frame, [15, 40], [0.9, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Subtitle delayed
  const subOpacity = interpolate(frame, [50, 70], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Question mark pulse
  const pulse = 0.85 + 0.15 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image */}
      <Img src={staticFile('images/stoichiometry/01-mole-hook.png')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 20], [0, 0.45],
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
            Chemistry's weirdest unit...
          </div>

          <GlowText fontSize={68} color={T.primary}>
            WHAT IS A MOLE?
          </GlowText>

          <div style={{
            fontFamily: T.mono, fontSize: 22, color: `${T.gold}90`,
            opacity: subOpacity,
          }}>
            (not the animal)
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Mole Intro (7–13s) ────────────────────────────────────
const MoleIntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const moleCue = useCueSpring(ct('mole'));

  // Counting number animation
  const countProgress = moleCue.isActive
    ? interpolate(frame - ct('mole') * fps, [0, 60], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Glow pulse
  const glowPulse = 0.6 + 0.4 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <Particle
          key={i}
          x={80 + (i * 47) % 920}
          y={200 + (i * 83) % 1500}
          size={4 + (i % 4) * 2}
          color={i % 2 === 0 ? T.primary : T.secondary}
          delay={i * 0.7}
        />
      ))}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{
          opacity: moleCue.opacity, transform: `scale(${moleCue.scale})`,
        }}>
          <GlowText fontSize={42} color={T.textMuted}>
            The
          </GlowText>
          <GlowText fontSize={80} color={T.primary} style={{
            textShadow: `0 0 ${40 * glowPulse}px ${T.primary}80, 0 0 80px ${T.primary}40`,
          }}>
            MOLE
          </GlowText>
        </div>

        <div style={{
          opacity: moleCue.opacity,
          fontFamily: T.font, fontSize: 26, color: T.textMuted, textAlign: 'center',
          maxWidth: 800, lineHeight: 1.5,
          transform: `translateY(${interpolate(countProgress, [0, 1], [20, 0])}px)`,
        }}>
          A <span style={{ color: T.gold, fontWeight: 700 }}>counting unit</span> for atoms
        </div>

        <div style={{
          opacity: interpolate(countProgress, [0.3, 0.7], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', gap: 20, alignItems: 'center',
        }}>
          <Badge label="dozen = 12" color={T.textMuted} opacity={1} fontSize={22} />
          <div style={{
            fontFamily: T.font, fontSize: 28, color: T.primary, fontWeight: 800,
          }}>vs</div>
          <Badge label="mole = ?" color={T.primary} opacity={1} fontSize={22} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Avogadro's Number (13–22s) ─────────────────────────────
const AvogadroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sixCue = useCueSpring(ct('six'));

  // Number building animation
  const numProgress = sixCue.isActive
    ? interpolate(frame - ct('six') * fps, [0, 45], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Digit cascade
  const digits = ['6', '.', '0', '2', '2'];
  const exponent = '10²³';

  // Pulsing glow
  const pulse = 0.7 + 0.3 * Math.sin(frame / 8);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Particle field */}
      {Array.from({ length: 30 }, (_, i) => {
        const angle = (i / 30) * Math.PI * 2 + frame / 60;
        const radius = 300 + Math.sin(frame / 30 + i) * 80;
        return (
          <Particle
            key={i}
            x={540 + Math.cos(angle) * radius - 4}
            y={960 + Math.sin(angle) * radius - 4}
            size={3 + (i % 3) * 2}
            color={[T.primary, T.secondary, T.gold][i % 3]}
            delay={i * 0.5}
          />
        );
      })}

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40,
      }}>
        <div style={{ opacity: sixCue.opacity }}>
          <GlowText fontSize={32} color={T.textMuted}>Avogadro's Number</GlowText>
        </div>

        {/* Main number reveal */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: 0,
          opacity: sixCue.opacity, transform: `scale(${sixCue.scale})`,
        }}>
          {digits.map((d, i) => {
            const digitDelay = i * 0.08;
            const digitOpacity = interpolate(numProgress, [digitDelay, digitDelay + 0.15], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
            return (
              <div key={i} style={{
                fontFamily: T.mono, fontSize: 96, fontWeight: 900,
                color: T.primary,
                textShadow: `0 0 ${30 * pulse}px ${T.primary}80`,
                opacity: digitOpacity,
              }}>{d}</div>
            );
          })}
          <div style={{
            fontFamily: T.mono, fontSize: 60, fontWeight: 700,
            color: T.gold, marginLeft: 16,
            textShadow: `0 0 30px ${T.gold}60`,
            opacity: interpolate(numProgress, [0.5, 0.8], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            {'\u00d7'} {exponent}
          </div>
        </div>

        {/* Scale labels */}
        <div style={{
          opacity: interpolate(numProgress, [0.7, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 26, color: T.text, textAlign: 'center',
          }}>
            = <span style={{ color: T.gold, fontWeight: 700 }}>602,200,000,000,000,000,000,000</span>
          </div>
          <Badge label="particles in 1 mole" color={T.primary} opacity={1} fontSize={22} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Rice Analogy (22–29s) ──────────────────────────────────
const RiceAnalogyScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const riceCue = useCue(ct('rice'));

  // Rice grains counter animation
  const counterProgress = riceCue.isActive
    ? interpolate(frame - ct('rice') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Earth growing
  const earthScale = riceCue.isActive
    ? interpolate(frame - ct('rice') * fps, [0, 60], [0.5, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0.5;

  // Grain dots cascading
  const grainCount = Math.floor(counterProgress * 40);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: riceCue.opacity }}>
          <GlowText fontSize={36} color={T.warning}>HOW BIG IS THAT?</GlowText>
        </div>

        {/* Earth visualization */}
        <div style={{
          width: 350, height: 350, borderRadius: '50%',
          border: `3px solid ${T.primary}40`,
          background: `radial-gradient(circle at 40% 35%, ${T.primary}20, ${T.success}15, ${T.bg})`,
          position: 'relative', overflow: 'hidden',
          opacity: riceCue.opacity,
          transform: `scale(${earthScale})`,
          boxShadow: `0 0 60px ${T.primary}20, inset 0 0 40px ${T.primary}10`,
        }}>
          {/* Continents approximation */}
          <div style={{
            position: 'absolute', top: '20%', left: '25%',
            width: '35%', height: '40%', borderRadius: '40% 60% 55% 45%',
            background: `${T.success}25`, border: `1px solid ${T.success}30`,
          }} />
          <div style={{
            position: 'absolute', top: '35%', left: '65%',
            width: '25%', height: '30%', borderRadius: '50% 50% 40% 60%',
            background: `${T.success}25`, border: `1px solid ${T.success}30`,
          }} />

          {/* Rice grain dots filling earth */}
          {Array.from({ length: grainCount }, (_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${15 + (i * 37) % 70}%`,
              top: `${10 + (i * 53) % 80}%`,
              width: 6, height: 10, borderRadius: '50%',
              background: T.gold,
              opacity: 0.7 + (i % 3) * 0.1,
              boxShadow: `0 0 4px ${T.gold}80`,
              transform: `rotate(${i * 45}deg)`,
            }} />
          ))}
        </div>

        <div style={{
          opacity: interpolate(counterProgress, [0.2, 0.5], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
            padding: '10px 30px', background: `${T.warning}10`, borderRadius: 12,
          }}>
            <span style={{ color: T.gold, fontWeight: 700 }}>6.022 {'\u00d7'} 10{'\u00b2\u00b3'}</span> grains of rice
          </div>
          <div style={{
            fontFamily: T.font, fontSize: 28, color: T.danger, fontWeight: 700,
            textAlign: 'center',
            opacity: interpolate(counterProgress, [0.5, 0.8], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            would cover the ENTIRE EARTH
          </div>
          <Badge
            label="9 km deep"
            color={T.danger}
            opacity={interpolate(counterProgress, [0.7, 1], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
            fontSize={24}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Element Examples (29–48s) ──────────────────────────────
const ElementExamplesScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const twelveCue = useCue(ct('twelve'));
  const massCue = useCue(ct('mass'));

  // Stagger the element cards
  const carbonDelay = ct('twelve');
  const sodiumDelay = carbonDelay + 4;
  const ironDelay = sodiumDelay + 4;

  const carbonCue = useCueSpring(carbonDelay);
  const sodiumCue = useCueSpring(sodiumDelay);
  const ironCue = useCueSpring(ironDelay);

  // Arrow animation
  const arrowProgress = massCue.isActive
    ? interpolate(frame - ct('mass') * fps, [0, 30], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
      }}>
        <div style={{ opacity: twelveCue.opacity }}>
          <GlowText fontSize={36} color={T.primary}>1 MOLE OF...</GlowText>
        </div>

        {/* Element cards row */}
        <div style={{
          display: 'flex', gap: 30, alignItems: 'center',
          marginTop: 20,
        }}>
          <ElementCard
            symbol="C" name="Carbon" mass="12.01"
            color={T.carbon} opacity={carbonCue.opacity} scale={carbonCue.scale}
          />
          <ElementCard
            symbol="Na" name="Sodium" mass="22.99"
            color={T.sodium} opacity={sodiumCue.opacity} scale={sodiumCue.scale}
          />
          <ElementCard
            symbol="Fe" name="Iron" mass="55.85"
            color={T.iron} opacity={ironCue.opacity} scale={ironCue.scale}
          />
        </div>

        {/* Arrow: "weighs exactly" */}
        <div style={{
          opacity: arrowProgress,
          fontFamily: T.font, fontSize: 24, color: T.textMuted,
          marginTop: 10,
        }}>
          weighs exactly...
        </div>

        {/* Mass values */}
        <div style={{
          display: 'flex', gap: 30, alignItems: 'center',
          opacity: massCue.opacity,
        }}>
          {[
            { mass: '12 g', color: T.carbon },
            { mass: '23 g', color: T.sodium },
            { mass: '56 g', color: T.iron },
          ].map((item, i) => (
            <div key={i} style={{
              fontFamily: T.mono, fontSize: 44, fontWeight: 900,
              color: item.color,
              textShadow: `0 0 20px ${item.color}50`,
              opacity: interpolate(arrowProgress, [0.2 + i * 0.2, 0.4 + i * 0.2], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              width: 180, textAlign: 'center',
            }}>{item.mass}</div>
          ))}
        </div>

        {/* Key insight */}
        <Badge
          label="MOLAR MASS = atomic mass in grams"
          color={T.gold}
          opacity={massCue.opacity}
          fontSize={20}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Water Example (48–62s) ─────────────────────────────────
const WaterExampleScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const eighteenCue = useCue(ct('eighteen'));

  // Formula build animation
  const buildProgress = eighteenCue.isActive
    ? interpolate(frame - ct('eighteen') * fps, [0, 90], [0, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  // Molecule bobbing
  const bob = Math.sin(frame / 20) * 5;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35,
      }}>
        <div style={{ opacity: eighteenCue.opacity }}>
          <GlowText fontSize={38} color={T.hydrogen}>WATER — H{'\u2082'}O</GlowText>
        </div>

        {/* Water molecule visual */}
        <div style={{
          opacity: eighteenCue.opacity,
          transform: `translateY(${bob}px)`,
          position: 'relative', width: 350, height: 250,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          {/* Oxygen atom (center) */}
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${T.oxygen}60, ${T.oxygen}30)`,
            border: `3px solid ${T.oxygen}80`,
            boxShadow: `0 0 40px ${T.oxygen}30`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.font, fontSize: 36, fontWeight: 900, color: T.text,
            position: 'absolute', zIndex: 2,
          }}>O</div>

          {/* H atom left */}
          <div style={{
            position: 'absolute', left: 30, top: 20,
            width: 80, height: 80, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${T.hydrogen}60, ${T.hydrogen}30)`,
            border: `3px solid ${T.hydrogen}80`,
            boxShadow: `0 0 30px ${T.hydrogen}30`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.font, fontSize: 28, fontWeight: 900, color: T.text,
            zIndex: 2,
          }}>H</div>

          {/* H atom right */}
          <div style={{
            position: 'absolute', right: 30, top: 20,
            width: 80, height: 80, borderRadius: '50%',
            background: `radial-gradient(circle at 35% 35%, ${T.hydrogen}60, ${T.hydrogen}30)`,
            border: `3px solid ${T.hydrogen}80`,
            boxShadow: `0 0 30px ${T.hydrogen}30`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: T.font, fontSize: 28, fontWeight: 900, color: T.text,
            zIndex: 2,
          }}>H</div>

          {/* Bonds */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 1 }}>
            <line x1="110" y1="95" x2="170" y2="125" stroke={T.textMuted} strokeWidth={4} strokeLinecap="round" />
            <line x1="240" y1="95" x2="180" y2="125" stroke={T.textMuted} strokeWidth={4} strokeLinecap="round" />
          </svg>
        </div>

        {/* Calculation breakdown */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          opacity: interpolate(buildProgress, [0.1, 0.4], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {/* H contribution */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            fontFamily: T.mono, fontSize: 32, color: T.text,
            opacity: interpolate(buildProgress, [0.1, 0.3], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.hydrogen, fontWeight: 700 }}>H</span>
            <span style={{ color: T.textMuted, fontSize: 24 }}>{'='}</span>
            <span style={{ color: T.hydrogen }}>1</span>
            <span style={{ color: T.textMuted, fontSize: 24 }}>{'\u00d7'}</span>
            <span style={{ color: T.gold }}>2</span>
            <span style={{ color: T.textMuted, fontSize: 24 }}>{'='}</span>
            <span style={{ color: T.primary, fontWeight: 900 }}>2</span>
          </div>

          {/* O contribution */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            fontFamily: T.mono, fontSize: 32, color: T.text,
            opacity: interpolate(buildProgress, [0.3, 0.5], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.oxygen, fontWeight: 700 }}>O</span>
            <span style={{ color: T.textMuted, fontSize: 24 }}>{'='}</span>
            <span style={{ color: T.oxygen }}>16</span>
            <span style={{ color: T.textMuted, fontSize: 24 }}>{'\u00d7'}</span>
            <span style={{ color: T.gold }}>1</span>
            <span style={{ color: T.textMuted, fontSize: 24 }}>{'='}</span>
            <span style={{ color: T.primary, fontWeight: 900 }}>16</span>
          </div>

          {/* Divider line */}
          <div style={{
            width: 500, height: 3, borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${T.primary}60, transparent)`,
            opacity: interpolate(buildProgress, [0.5, 0.6], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }} />

          {/* Total */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16,
            fontFamily: T.mono, fontSize: 40, fontWeight: 900,
            opacity: interpolate(buildProgress, [0.6, 0.8], [0, 1],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ color: T.textMuted }}>2 + 16 =</span>
            <span style={{
              color: T.gold,
              textShadow: `0 0 30px ${T.gold}60`,
              fontSize: 56,
            }}>18 g</span>
          </div>
        </div>

        <Badge
          label="1 mole of water = 18 g"
          color={T.hydrogen}
          opacity={interpolate(buildProgress, [0.8, 1], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Connection + CTA (62–70s) ──────────────────────────────
const ConnectionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const weighCue = useCueSpring(ct('weigh'));

  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  // Scale icon growing
  const scaleGrow = weighCue.isActive
    ? interpolate(frame - ct('weigh') * fps, [0, 30], [0.7, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0.7;

  // Summary items stagger
  const items = [
    { text: 'Mole = counting unit for atoms', color: T.primary },
    { text: '6.022 \u00d7 10\u00b2\u00b3 particles', color: T.gold },
    { text: 'Molar mass = atomic mass in grams', color: T.success },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30,
        padding: 50,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        {/* Scale icon */}
        <div style={{
          opacity: weighCue.opacity, transform: `scale(${scaleGrow * weighCue.scale})`,
          marginBottom: 10,
        }}>
          <svg width={120} height={100} viewBox="0 0 120 100">
            <line x1={60} y1={10} x2={60} y2={50} stroke={T.gold} strokeWidth={4} />
            <line x1={20} y1={50} x2={100} y2={50} stroke={T.gold} strokeWidth={4} />
            <line x1={20} y1={50} x2={20} y2={70} stroke={T.primary} strokeWidth={3} />
            <line x1={100} y1={50} x2={100} y2={70} stroke={T.primary} strokeWidth={3} />
            <rect x={5} y={70} width={30} height={20} rx={4} fill={`${T.primary}40`} stroke={T.primary} strokeWidth={2} />
            <rect x={85} y={70} width={30} height={20} rx={4} fill={`${T.primary}40`} stroke={T.primary} strokeWidth={2} />
            <text x={20} y={85} fontFamily={T.mono} fontSize={10} fill={T.text} textAnchor="middle">g</text>
            <text x={100} y={85} fontFamily={T.mono} fontSize={10} fill={T.text} textAnchor="middle">mol</text>
            <polygon points="55,5 65,5 60,0" fill={T.gold} />
          </svg>
        </div>

        <GlowText fontSize={36} color={T.gold} style={{ opacity: weighCue.opacity }}>
          WEIGH IT. COUNT IT.
        </GlowText>

        {/* Summary bullets */}
        {items.map((item, i) => {
          const itemOpacity = weighCue.isActive
            ? interpolate(frame - ct('weigh') * fps, [15 + i * 15, 30 + i * 15], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0;
          return (
            <div key={i} style={{
              opacity: itemOpacity,
              fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
              padding: '8px 20px', background: `${item.color}10`, borderRadius: 10,
              border: `1px solid ${item.color}30`, width: 800,
            }}>
              <span style={{ color: item.color, fontWeight: 700 }}>{'\u2713'}</span>{' '}
              {item.text}
            </div>
          );
        })}

        <Badge
          label="FOLLOW FOR PART 2: Calculations"
          color={T.secondary}
          opacity={weighCue.isActive
            ? interpolate(frame - ct('weigh') * fps, [60, 80], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : 0}
          fontSize={22}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',             startS: 0,     durationS: 7.12,  Component: HookScene },
  { id: 'mole-intro',      startS: 7.12,  durationS: 5.86,  Component: MoleIntroScene },
  { id: 'avogadro',        startS: 12.98, durationS: 9.22,  Component: AvogadroScene },
  { id: 'rice-analogy',    startS: 22.20, durationS: 6.72,  Component: RiceAnalogyScene },
  { id: 'element-examples', startS: 28.92, durationS: 18.68, Component: ElementExamplesScene },
  { id: 'water-example',   startS: 47.60, durationS: 14.32, Component: WaterExampleScene },
  { id: 'connection-cta',  startS: 61.92, durationS: 8.44,  Component: ConnectionScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const StoichiometryMoleTikTok: React.FC<StoichiometryMoleTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/stoichiometry/01-mole-narration.mp3')} volume={1} />
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

export function getStoichiometryMoleDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const StoichiometryMoleCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/stoichiometry/01-mole-cover.png')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.45, filter: 'brightness(0.5)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={56} color={T.primary}>WHAT IS A MOLE?</GlowText>
      <div style={{
        fontFamily: T.mono, fontSize: 36, color: T.gold, marginTop: 20,
        textShadow: `0 0 20px ${T.gold}40`,
      }}>
        6.022 {'\u00d7'} 10{'\u00b2\u00b3'}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20 }}>
        Stoichiometry #1 — The Mole Concept
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 10 }}>
        Cambridge IGCSE / AS Chemistry
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
