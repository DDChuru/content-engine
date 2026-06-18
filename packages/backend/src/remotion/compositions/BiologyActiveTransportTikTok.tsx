/**
 * Active Transport — TikTok (9:16) v1
 *
 * Cambridge 9700 Topic 4.3 — Sodium-Potassium Pump
 * Against the gradient, ATP-powered, 3Na+ out / 2K+ in.
 *
 * Pure CSS motion graphics — pump animation, ion flow, ATP counter.
 * 8 scenes, ~94 seconds, 1080×1920.
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

const FPS = 30;
const TOTAL_DURATION_S = 94;

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
  sodium: '#f97316',    // Na+
  potassium: '#a855f7',  // K+
  atp: '#22d3ee',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved + manually corrected ──────────────────
const DEFAULT_CUES: Record<string, number> = {
  'forty-percent': 1.16,
  'active-transport': 5.96,
  'against': 8.76,
  'low-to-high': 11.72,
  'atp': 14.88,
  'uphill': 19.14,
  'diffusion-free': 20.68,
  'fights': 23.18,
  'sodium-potassium': 27.86,
  'step-1': 31.42,   // manually corrected
  'step-2': 34.74,   // manually added
  'step-3': 39.94,   // Step 3 word at 39.94
  'step-4': 44.64,   // manually corrected
  'step-5': 47.86,   // Step 5 word
  'step-6': 53.24,   // Step 6 word
  '3-out-2-in': 57.24,
  'electrochemical': 62.66,
  'nerve': 67.22,
  'muscle': 69.52,
  'brain-stops': 73.06,
  'heart-stops': 74.26,
  'gut': 77.80,
  'glucose': 78.62,
  'root-hair': 84.60,
  'mineral': 86.10,
  'exam-answer': 93.52,
};

export interface BiologyActiveTransportTikTokProps {
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

// Ion particle
const Ion: React.FC<{
  type: 'Na' | 'K'; x: number; y: number; opacity: number; size?: number;
}> = ({ type, x, y, opacity, size = 44 }) => {
  const color = type === 'Na' ? T.sodium : T.potassium;
  return (
    <div style={{
      position: 'absolute', left: x, top: y, opacity,
      width: size, height: size, borderRadius: '50%',
      background: `${color}30`, border: `2px solid ${color}`,
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      fontFamily: T.mono, fontSize: size * 0.35, color, fontWeight: 800,
      boxShadow: `0 0 15px ${color}40`,
    }}>
      {type}⁺
    </div>
  );
};

// Step card for pump animation
const PumpStep: React.FC<{
  number: number; text: string; color: string; opacity: number; translateY: number;
}> = ({ number, text, color, opacity, translateY }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'flex', alignItems: 'flex-start', gap: 16,
    padding: '12px 20px', background: `${color}08`,
    borderLeft: `4px solid ${color}`, borderRadius: 10, width: 860,
  }}>
    <div style={{
      fontFamily: T.mono, fontWeight: 900, fontSize: 28, color,
      width: 40, flexShrink: 0, textAlign: 'center',
    }}>{number}</div>
    <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 22, color: T.text }}>
      {text}
    </div>
  </div>
);

interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const fortyCue = useCueSpring(ct('forty-percent'));

  // Pulsing energy percentage
  const pulse = 1 + 0.05 * Math.sin(frame / 8);

  const hookScale = interpolate(frame, [0, 5 * 30], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image — membrane pump */}
      <Img src={staticFile('images/biology/active-transport/hook-pump.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.35)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontFamily: T.font, fontSize: 28, color: T.textMuted,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          marginBottom: 20,
        }}>
          Your cells spend
        </div>

        <div style={{
          opacity: fortyCue.opacity, transform: `scale(${fortyCue.scale * pulse})`,
        }}>
          <GlowText fontSize={120} color={T.danger}>40%</GlowText>
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 28, color: T.textMuted,
          opacity: fortyCue.opacity, marginTop: 20,
        }}>
          of their energy on <span style={{ color: T.gold, fontWeight: 700 }}>this one process</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Definition ──────────────────────────────────────────────
const DefinitionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const activeCue = useCue(ct('active-transport'));
  const againstCue = useCue(ct('against'));
  const lowHighCue = useCue(ct('low-to-high'));
  const atpCue = useCueSpring(ct('atp'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 50px' }}>
        <div style={{ opacity: activeCue.opacity }}>
          <GlowText fontSize={38} color={T.primary}>ACTIVE TRANSPORT</GlowText>
        </div>

        <div style={{
          opacity: againstCue.opacity, transform: `translateY(${againstCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text, textAlign: 'center',
          padding: '14px 24px', background: `${T.danger}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.danger}`,
        }}>
          Movement <span style={{ color: T.danger, fontWeight: 700 }}>AGAINST</span> the concentration gradient
        </div>

        <div style={{
          opacity: lowHighCue.opacity, transform: `translateY(${lowHighCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.primary,
            padding: '10px 20px', background: `${T.primary}10`, borderRadius: 10,
          }}>LOW</div>
          <div style={{ fontFamily: T.mono, fontSize: 28, color: T.gold }}>→</div>
          <div style={{
            fontFamily: T.mono, fontSize: 28, color: T.danger,
            padding: '10px 20px', background: `${T.danger}10`, borderRadius: 10,
          }}>HIGH</div>
        </div>

        <div style={{
          opacity: atpCue.opacity, transform: `scale(${atpCue.scale})`,
        }}>
          <Badge label="REQUIRES ATP ⚡" color={T.atp} opacity={1} fontSize={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Uphill Analogy ──────────────────────────────────────────
const UphillScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const uphillCue = useCue(ct('uphill'));
  const diffusionCue = useCue(ct('diffusion-free'));
  const fightsCue = useCueSpring(ct('fights'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        {/* Hill visual */}
        <svg width={800} height={250} style={{ opacity: uphillCue.opacity }}>
          {/* Hill shape */}
          <path d="M 50 230 Q 400 230 750 50" fill="none" stroke={T.textMuted} strokeWidth={3} />

          {/* Diffusion ball rolling down */}
          <circle cx={interpolate(frame % 90, [0, 89], [700, 100])} cy={
            interpolate(frame % 90, [0, 89], [80, 220])
          } r={20} fill={`${T.success}60`} stroke={T.success} strokeWidth={2} opacity={diffusionCue.opacity} />
          <text x={650} y={70} fontFamily={T.font} fontSize={16} fill={T.success} opacity={diffusionCue.opacity}>
            Diffusion ↓
          </text>
          <text x={650} y={90} fontFamily={T.font} fontSize={14} fill={T.textMuted} opacity={diffusionCue.opacity}>
            FREE
          </text>

          {/* Active transport ball pushing up */}
          <circle cx={interpolate(frame % 90, [0, 89], [100, 700])} cy={
            interpolate(frame % 90, [0, 89], [220, 80])
          } r={20} fill={`${T.danger}60`} stroke={T.danger} strokeWidth={2} opacity={uphillCue.opacity} />
          <text x={100} y={200} fontFamily={T.font} fontSize={16} fill={T.danger} opacity={uphillCue.opacity}>
            Active ↑
          </text>
          <text x={100} y={220} fontFamily={T.font} fontSize={14} fill={T.atp} opacity={uphillCue.opacity}>
            NEEDS ATP
          </text>
        </svg>

        <Badge label="FIGHTS THE GRADIENT" color={T.danger} opacity={fightsCue.opacity}
          scale={fightsCue.scale} fontSize={28} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Pump Steps 1-3 ─────────────────────────────────────────
const PumpSteps1Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const sNaCue = useCue(ct('sodium-potassium'));
  const s1Cue = useCue(ct('step-1'));
  const s2Cue = useCue(ct('step-2'));
  const s3Cue = useCue(ct('step-3'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: sNaCue.opacity }}>
        <GlowText fontSize={32} color={T.primary}>Na⁺/K⁺ PUMP</GlowText>
      </div>

      {/* Ion visuals */}
      <div style={{ position: 'relative', width: 300, height: 100, opacity: s1Cue.opacity, marginTop: 20, marginBottom: 10 }}>
        <Ion type="Na" x={40} y={20} opacity={s1Cue.opacity} />
        <Ion type="Na" x={120} y={20} opacity={s1Cue.opacity} />
        <Ion type="Na" x={200} y={20} opacity={s1Cue.opacity} />
        <div style={{
          position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
          fontFamily: T.font, fontSize: 16, color: T.sodium,
        }}>3 Na⁺ inside</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
        <PumpStep number={1} text="3 sodium ions bind inside the cell"
          color={T.sodium} opacity={s1Cue.opacity} translateY={s1Cue.translateY} />
        <PumpStep number={2} text="ATP hydrolysed → phosphate attaches to pump"
          color={T.atp} opacity={s2Cue.opacity} translateY={s2Cue.translateY} />
        <PumpStep number={3} text="Pump changes shape → Na⁺ released OUTSIDE"
          color={T.success} opacity={s3Cue.opacity} translateY={s3Cue.translateY} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Pump Steps 4-6 ─────────────────────────────────────────
const PumpSteps2Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const s4Cue = useCue(ct('step-4'));
  const s5Cue = useCue(ct('step-5'));
  const s6Cue = useCue(ct('step-6'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80 }}>
        <GlowText fontSize={32} color={T.primary}>Na⁺/K⁺ PUMP (cont.)</GlowText>
      </div>

      {/* K+ ions */}
      <div style={{ position: 'relative', width: 200, height: 100, opacity: s4Cue.opacity, marginTop: 20, marginBottom: 10 }}>
        <Ion type="K" x={30} y={20} opacity={s4Cue.opacity} />
        <Ion type="K" x={110} y={20} opacity={s4Cue.opacity} />
        <div style={{
          position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
          fontFamily: T.font, fontSize: 16, color: T.potassium,
        }}>2 K⁺ outside</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
        <PumpStep number={4} text="2 potassium ions bind outside"
          color={T.potassium} opacity={s4Cue.opacity} translateY={s4Cue.translateY} />
        <PumpStep number={5} text="Phosphate detaches → pump returns to original shape"
          color={T.atp} opacity={s5Cue.opacity} translateY={s5Cue.translateY} />
        <PumpStep number={6} text="Potassium ions released INSIDE the cell"
          color={T.success} opacity={s6Cue.opacity} translateY={s6Cue.translateY} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Ratio + Significance ────────────────────────────────────
const RatioScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const ratioCue = useCueSpring(ct('3-out-2-in'));
  const electroCue = useCue(ct('electrochemical'));
  const nerveCue = useCue(ct('nerve'));
  const muscleCue = useCue(ct('muscle'));
  const brainCue = useCueSpring(ct('brain-stops'));
  const heartCue = useCueSpring(ct('heart-stops'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Big ratio display */}
      <div style={{
        opacity: ratioCue.opacity, transform: `scale(${ratioCue.scale})`,
        display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30,
      }}>
        <div style={{
          fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.sodium,
          padding: '12px 24px', background: `${T.sodium}15`, borderRadius: 12,
        }}>3 Na⁺ OUT</div>
        <div style={{ fontFamily: T.mono, fontSize: 36, color: T.textMuted }}>:</div>
        <div style={{
          fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.potassium,
          padding: '12px 24px', background: `${T.potassium}15`, borderRadius: 12,
        }}>2 K⁺ IN</div>
      </div>

      <Badge label="ELECTROCHEMICAL GRADIENT" color={T.primary} opacity={electroCue.opacity} fontSize={22} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 30, alignItems: 'center' }}>
        <div style={{
          opacity: nerveCue.opacity, transform: `translateY(${nerveCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text,
          padding: '10px 24px', background: `${T.primary}10`, borderRadius: 10,
        }}>
          ⚡ <span style={{ color: T.primary, fontWeight: 700 }}>Nerve impulses</span> depend on it
        </div>
        <div style={{
          opacity: muscleCue.opacity, transform: `translateY(${muscleCue.translateY}px)`,
          fontFamily: T.font, fontSize: 24, color: T.text,
          padding: '10px 24px', background: `${T.accent}10`, borderRadius: 10,
        }}>
          💪 <span style={{ color: T.accent, fontWeight: 700 }}>Muscle contractions</span> depend on it
        </div>
        <div style={{
          opacity: brainCue.opacity, transform: `scale(${brainCue.scale})`,
          fontFamily: T.font, fontSize: 22, color: T.danger, textAlign: 'center',
          marginTop: 10,
        }}>
          Without this pump: brain stops, heart stops
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: Other Examples ──────────────────────────────────────────
const OtherExamplesScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const gutCue = useCue(ct('gut'));
  const glucoseCue = useCue(ct('glucose'));
  const rootCue = useCue(ct('root-hair'));
  const mineralCue = useCue(ct('mineral'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 100 }}>
        <GlowText fontSize={34} color={T.gold}>OTHER EXAMPLES</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }}>
        <div style={{
          opacity: gutCue.opacity, transform: `translateY(${gutCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 24px', background: `${T.sodium}08`,
          borderLeft: `4px solid ${T.sodium}`, borderRadius: 12, width: 880,
        }}>
          <div style={{ fontSize: 36, flexShrink: 0 }}>🫁</div>
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 24, color: T.text }}>
              Gut (Ileum)
            </div>
            <div style={{
              opacity: glucoseCue.opacity,
              fontFamily: T.font, fontSize: 20, color: T.textMuted, marginTop: 4,
            }}>
              Absorbing <span style={{ color: T.sodium }}>glucose</span> & amino acids against gradient
            </div>
          </div>
        </div>

        <div style={{
          opacity: rootCue.opacity, transform: `translateY(${rootCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '16px 24px', background: `${T.success}08`,
          borderLeft: `4px solid ${T.success}`, borderRadius: 12, width: 880,
        }}>
          <div style={{ fontSize: 36, flexShrink: 0 }}>🌱</div>
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 24, color: T.text }}>
              Root Hair Cells
            </div>
            <div style={{
              opacity: mineralCue.opacity,
              fontFamily: T.font, fontSize: 20, color: T.textMuted, marginTop: 4,
            }}>
              Absorbing <span style={{ color: T.success }}>mineral ions</span> from soil
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────────────────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const examCue = useCueSpring(ct('exam-answer'));
  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
        padding: 50,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        <div style={{
          opacity: examCue.opacity, transform: `scale(${examCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 36, fontWeight: 900, color: T.sodium,
            padding: '8px 16px', background: `${T.sodium}15`, borderRadius: 8,
          }}>3 Na⁺</div>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>out</div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, fontWeight: 900, color: T.potassium,
            padding: '8px 16px', background: `${T.potassium}15`, borderRadius: 8,
          }}>2 K⁺</div>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>in</div>
          <div style={{
            fontFamily: T.mono, fontSize: 36, fontWeight: 900, color: T.atp,
            padding: '8px 16px', background: `${T.atp}15`, borderRadius: 8,
          }}>1 ATP</div>
        </div>

        <GlowText fontSize={36} color={T.gold}>
          That's your exam answer
        </GlowText>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',        startS: 0,     durationS: 5.96,  Component: HookScene },
  { id: 'definition',  startS: 5.96,  durationS: 11.90, Component: DefinitionScene },
  { id: 'uphill',      startS: 17.86, durationS: 10.00, Component: UphillScene },
  { id: 'pump-1-3',    startS: 27.86, durationS: 16.78, Component: PumpSteps1Scene },
  { id: 'pump-4-6',    startS: 44.64, durationS: 12.60, Component: PumpSteps2Scene },
  { id: 'ratio',       startS: 57.24, durationS: 20.56, Component: RatioScene },
  { id: 'examples',    startS: 77.80, durationS: 11.72, Component: OtherExamplesScene },
  { id: 'cta',         startS: 89.52, durationS: 4.48,  Component: CTAScene },
];

export const BiologyActiveTransportTikTok: React.FC<BiologyActiveTransportTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/active-transport-narration.mp3')} volume={1} />
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
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `${T.text}10` }}>
      <div style={{ height: '100%', width: `${(frame / durationInFrames) * 100}%`,
        background: `linear-gradient(90deg, ${T.sodium}, ${T.potassium})`, borderRadius: 2 }} />
    </div>
  );
};

export function getBiologyActiveTransportDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyActiveTransportCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/active-transport/cover-transport.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.4, filter: 'brightness(0.45)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={120} color={T.danger}>40%</GlowText>
      <div style={{
        fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20, textAlign: 'center',
      }}>
        of your cell's energy goes to
      </div>
      <GlowText fontSize={42} color={T.primary} style={{ marginTop: 12 }}>THIS ONE PROCESS</GlowText>
      <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
        <Badge label="3 Na⁺" color={T.sodium} opacity={1} fontSize={22} />
        <Badge label="2 K⁺" color={T.potassium} opacity={1} fontSize={22} />
        <Badge label="1 ATP" color={T.atp} opacity={1} fontSize={22} />
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 20 }}>
        Cambridge 9700 · Topic 4.3
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
