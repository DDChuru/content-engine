/**
 * Endocytosis & Exocytosis — TikTok (9:16) v1
 *
 * Cambridge 9700 Topic 1 — How Cells Eat & Spit
 * Membrane invagination, vesicle formation, lysosome digestion.
 *
 * Pure CSS motion graphics — membrane folding, vesicle pinching, lysosome fusion.
 * 7 scenes, ~80 seconds, 1080×1920.
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
const TOTAL_DURATION_S = 82;

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
  membrane: '#3b82f6',    // Phospholipid blue
  vesicle: '#f97316',     // Vesicle orange
  lysosome: '#a855f7',    // Lysosome purple
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved + manually corrected ──────────────────
const DEFAULT_CUES: Record<string, number> = {
  'cells-eat': 0.56,
  'endocytosis': 4.72,
  'wraps': 6.94,
  'folds-inward': 8.78,
  'vesicle': 11.48,
  'inside': 13.54,
  'large-molecules': 17.94,
  'two-types': 22.42,
  'phagocytosis': 23.34,
  'cell-eating': 24.82,
  'pinocytosis': 26.46,       // manually corrected (Whisper: "Phinocytosis")
  'cell-drinking': 28.38,
  'exocytosis': 31.34,
  'fuses': 36.10,
  'released-outside': 37.88,
  'secrete': 40.56,
  'hormones': 42.42,
  'lysosomes': 45.42,
  'endosome': 52.94,
  'lysosome-fuses': 54.22,
  'hydrolytic': 58.04,
  'digestion': 61.58,
  'exam-loves': 64.00,
  'membrane-folds': 66.32,    // manually corrected (2nd occurrence)
  'enzymes-digest': 71.04,
  'endo-in': 74.60,           // manually corrected (CTA occurrence)
  'exo-out': 76.22,
  'three-marks': 79.42,
};

export interface BiologyEndocytosisTikTokProps {
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

// Vesicle circle
const Vesicle: React.FC<{
  x: number; y: number; size: number; color: string; opacity: number; label?: string;
}> = ({ x, y, size, color, opacity, label }) => (
  <div style={{
    position: 'absolute', left: x - size / 2, top: y - size / 2, opacity,
    width: size, height: size, borderRadius: '50%',
    background: `${color}20`, border: `3px solid ${color}`,
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    boxShadow: `0 0 20px ${color}30`,
  }}>
    {label && (
      <div style={{ fontFamily: T.mono, fontSize: size * 0.2, color, fontWeight: 700 }}>
        {label}
      </div>
    )}
  </div>
);

interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const eatCue = useCueSpring(ct('cells-eat'));

  const hookScale = interpolate(frame, [0, 4 * 30], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Img src={staticFile('images/biology/endocytosis/hook-membrane.jpg')} style={{
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
          Your cells
        </div>

        <div style={{ opacity: eatCue.opacity, transform: `scale(${eatCue.scale})` }}>
          <GlowText fontSize={100} color={T.danger}>EAT</GlowText>
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 28, color: T.textMuted,
          opacity: eatCue.opacity, marginTop: 20,
        }}>
          They <span style={{ color: T.gold, fontWeight: 700 }}>literally eat</span>. Here's how.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Endocytosis Definition ──────────────────────────────────
const EndocytosisScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const endoCue = useCue(ct('endocytosis'));
  const wrapsCue = useCue(ct('wraps'));
  const vesicleCue = useCueSpring(ct('vesicle'));
  const largeCue = useCue(ct('large-molecules'));

  // Animated membrane folding
  const foldProgress = interpolate(frame, [0, 60], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 50px' }}>
        <div style={{ opacity: endoCue.opacity }}>
          <GlowText fontSize={38} color={T.membrane}>ENDOCYTOSIS</GlowText>
        </div>

        {/* Membrane folding animation */}
        <svg width={800} height={220} style={{ opacity: wrapsCue.opacity }}>
          {/* Membrane line bending inward */}
          <path
            d={`M 50 60 Q ${200 + foldProgress * 200} ${60 + foldProgress * 140} 400 ${60 + foldProgress * 140} Q ${600 - foldProgress * 200} ${60 + foldProgress * 140} 750 60`}
            fill="none" stroke={T.membrane} strokeWidth={4}
          />
          {/* Particle being engulfed */}
          <circle cx={400} cy={60 + foldProgress * 80} r={16}
            fill={`${T.vesicle}60`} stroke={T.vesicle} strokeWidth={2} />
          <text x={400} y={210} textAnchor="middle"
            fontFamily={T.font} fontSize={16} fill={T.textMuted}>
            Membrane folds inward
          </text>
        </svg>

        <div style={{
          opacity: vesicleCue.opacity, transform: `scale(${vesicleCue.scale})`,
        }}>
          <Badge label="VESICLE FORMS" color={T.vesicle} opacity={1} fontSize={26} />
        </div>

        <div style={{
          opacity: largeCue.opacity, transform: `translateY(${largeCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '12px 24px', background: `${T.membrane}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.membrane}`,
        }}>
          Takes in <span style={{ color: T.membrane, fontWeight: 700 }}>large molecules</span> that
          can't cross by diffusion
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Two Types ───────────────────────────────────────────────
const TwoTypesScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const twoTypesCue = useCue(ct('two-types'));
  const phagoCue = useCue(ct('phagocytosis'));
  const eatCue = useCue(ct('cell-eating'));
  const pinoCue = useCue(ct('pinocytosis'));
  const drinkCue = useCue(ct('cell-drinking'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: twoTypesCue.opacity, marginBottom: 30 }}>
        <GlowText fontSize={34} color={T.gold}>TWO TYPES</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center' }}>
        {/* Phagocytosis */}
        <div style={{
          opacity: phagoCue.opacity, transform: `translateY(${phagoCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '20px 30px', background: `${T.danger}08`,
          borderLeft: `4px solid ${T.danger}`, borderRadius: 14, width: 860,
        }}>
          <div style={{ fontSize: 48, flexShrink: 0 }}>🍽️</div>
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 28, color: T.danger }}>
              Phagocytosis
            </div>
            <div style={{
              opacity: eatCue.opacity,
              fontFamily: T.font, fontSize: 22, color: T.textMuted, marginTop: 6,
            }}>
              "Cell <span style={{ color: T.danger }}>eating</span>" — solid particles
            </div>
          </div>
        </div>

        {/* Pinocytosis */}
        <div style={{
          opacity: pinoCue.opacity, transform: `translateY(${pinoCue.translateY}px)`,
          display: 'flex', alignItems: 'center', gap: 20,
          padding: '20px 30px', background: `${T.primary}08`,
          borderLeft: `4px solid ${T.primary}`, borderRadius: 14, width: 860,
        }}>
          <div style={{ fontSize: 48, flexShrink: 0 }}>💧</div>
          <div>
            <div style={{ fontFamily: T.font, fontWeight: 800, fontSize: 28, color: T.primary }}>
              Pinocytosis
            </div>
            <div style={{
              opacity: drinkCue.opacity,
              fontFamily: T.font, fontSize: 22, color: T.textMuted, marginTop: 6,
            }}>
              "Cell <span style={{ color: T.primary }}>drinking</span>" — liquids
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Exocytosis ──────────────────────────────────────────────
const ExocytosisScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const exoCue = useCue(ct('exocytosis'));
  const fusesCue = useCue(ct('fuses'));
  const releasedCue = useCueSpring(ct('released-outside'));
  const secreteCue = useCue(ct('secrete'));

  // Vesicle moving toward membrane
  const vesicleY = interpolate(frame, [0, 60], [300, 100],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const vesicleOpacity = interpolate(frame, [50, 70], [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{ opacity: exoCue.opacity }}>
          <GlowText fontSize={38} color={T.success}>EXOCYTOSIS</GlowText>
          <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, textAlign: 'center', marginTop: 8 }}>
            The reverse
          </div>
        </div>

        {/* Vesicle fusing animation */}
        <div style={{ position: 'relative', width: 400, height: 200, opacity: fusesCue.opacity }}>
          {/* Membrane line at top */}
          <div style={{
            position: 'absolute', top: 60, left: 0, right: 0, height: 4,
            background: T.membrane, borderRadius: 2,
          }} />
          {/* Vesicle moving up */}
          <Vesicle x={200} y={vesicleY} size={60} color={T.vesicle}
            opacity={vesicleOpacity} label="V" />
          {/* Released particles */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              position: 'absolute',
              left: 160 + i * 40,
              top: interpolate(frame, [70, 90], [60, -20 - i * 15],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              opacity: interpolate(frame, [65, 75], [0, 1],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              width: 12, height: 12, borderRadius: '50%',
              background: T.success, boxShadow: `0 0 10px ${T.success}60`,
            }} />
          ))}
        </div>

        <div style={{ opacity: releasedCue.opacity, transform: `scale(${releasedCue.scale})` }}>
          <Badge label="CONTENTS RELEASED OUTSIDE" color={T.success} opacity={1} fontSize={22} />
        </div>

        <div style={{
          opacity: secreteCue.opacity, transform: `translateY(${secreteCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '12px 24px', background: `${T.success}10`, borderRadius: 12,
        }}>
          Secretes <span style={{ color: T.success, fontWeight: 700 }}>enzymes</span>,{' '}
          <span style={{ color: T.gold, fontWeight: 700 }}>hormones</span>,{' '}
          <span style={{ color: T.accent, fontWeight: 700 }}>neurotransmitters</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Lysosome Digestion ──────────────────────────────────────
const LysosomeScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const lysoCue = useCue(ct('lysosomes'));
  const endosomeCue = useCue(ct('endosome'));
  const fusesCue = useCueSpring(ct('lysosome-fuses'));
  const enzymesCue = useCue(ct('hydrolytic'));
  const digestionCue = useCueSpring(ct('digestion'));

  // Lysosome approaching endosome
  const lysoX = interpolate(frame, [0, 60], [600, 440],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ position: 'absolute', top: 80, opacity: lysoCue.opacity }}>
        <GlowText fontSize={32} color={T.lysosome}>LYSOSOME DIGESTION</GlowText>
      </div>

      {/* Vesicle + Lysosome fusion visual */}
      <div style={{ position: 'relative', width: 800, height: 200, opacity: endosomeCue.opacity }}>
        {/* Endosome */}
        <Vesicle x={300} y={100} size={90} color={T.vesicle} opacity={1} label="Endosome" />
        {/* Lysosome approaching */}
        <Vesicle x={lysoX} y={100} size={70} color={T.lysosome} opacity={1} label="Lysosome" />
        {/* Arrow */}
        <div style={{
          position: 'absolute', left: 500, top: 90,
          fontFamily: T.mono, fontSize: 24, color: T.lysosome,
          opacity: fusesCue.opacity,
        }}>→ FUSE</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginTop: 20 }}>
        <div style={{
          opacity: enzymesCue.opacity, transform: `translateY(${enzymesCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '12px 24px', background: `${T.lysosome}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.lysosome}`,
        }}>
          <span style={{ color: T.lysosome, fontWeight: 700 }}>Hydrolytic enzymes</span> break down contents
        </div>

        <div style={{ opacity: digestionCue.opacity, transform: `scale(${digestionCue.scale})` }}>
          <Badge label="DIGESTION — INSIDE A CELL" color={T.gold} opacity={1} fontSize={24} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Exam Sequence ───────────────────────────────────────────
const ExamSequenceScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const examCue = useCue(ct('exam-loves'));
  const membraneCue = useCue(ct('membrane-folds'));
  const digestCue = useCue(ct('enzymes-digest'));

  const steps = [
    { label: 'Membrane folds inward', color: T.membrane },
    { label: 'Vesicle forms', color: T.vesicle },
    { label: 'Lysosome fuses', color: T.lysosome },
    { label: 'Enzymes digest', color: T.danger },
    { label: 'Products absorbed or expelled', color: T.success },
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: examCue.opacity, marginBottom: 30 }}>
        <GlowText fontSize={30} color={T.gold}>EXAM SEQUENCE</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((step, i) => {
          const stepDelay = i * 0.8;
          const stepOpacity = interpolate(
            (membraneCue.isActive ? 1 : 0) + (digestCue.isActive ? 1 : 0),
            [0, 2], [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );
          const cueTime = ct('membrane-folds') + stepDelay;
          const stepCue = useCue(cueTime);

          return (
            <div key={i} style={{
              opacity: stepCue.opacity, transform: `translateY(${stepCue.translateY}px)`,
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '12px 20px', background: `${step.color}08`,
              borderLeft: `4px solid ${step.color}`, borderRadius: 10, width: 860,
            }}>
              <div style={{
                fontFamily: T.mono, fontWeight: 900, fontSize: 28, color: step.color,
                width: 40, flexShrink: 0, textAlign: 'center',
              }}>{i + 1}</div>
              <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 22, color: T.text }}>
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: CTA ─────────────────────────────────────────────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const endoInCue = useCueSpring(ct('endo-in'));
  const exoOutCue = useCueSpring(ct('exo-out'));
  const marksCue = useCueSpring(ct('three-marks'));
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
          opacity: endoInCue.opacity, transform: `scale(${endoInCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.membrane,
            padding: '8px 20px', background: `${T.membrane}15`, borderRadius: 8,
          }}>Endocytosis</div>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>IN</div>
        </div>

        <div style={{
          opacity: exoOutCue.opacity, transform: `scale(${exoOutCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{
            fontFamily: T.mono, fontSize: 32, fontWeight: 900, color: T.success,
            padding: '8px 20px', background: `${T.success}15`, borderRadius: 8,
          }}>Exocytosis</div>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>OUT</div>
        </div>

        <div style={{
          opacity: marksCue.opacity, transform: `scale(${marksCue.scale})`,
          display: 'flex', alignItems: 'center', gap: 12, marginTop: 10,
        }}>
          <Badge label="Lysosomes digest" color={T.lysosome} opacity={1} fontSize={22} />
        </div>

        <GlowText fontSize={36} color={T.gold}>
          Three marks — just like that
        </GlowText>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',         startS: 0,      durationS: 4.72,  Component: HookScene },
  { id: 'endocytosis',  startS: 4.72,   durationS: 17.70, Component: EndocytosisScene },
  { id: 'two-types',    startS: 22.42,  durationS: 8.92,  Component: TwoTypesScene },
  { id: 'exocytosis',   startS: 31.34,  durationS: 14.08, Component: ExocytosisScene },
  { id: 'lysosome',     startS: 45.42,  durationS: 18.58, Component: LysosomeScene },
  { id: 'exam-seq',     startS: 64.00,  durationS: 10.60, Component: ExamSequenceScene },
  { id: 'cta',          startS: 74.60,  durationS: 7.40,  Component: CTAScene },
];

export const BiologyEndocytosisTikTok: React.FC<BiologyEndocytosisTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/endocytosis-narration.mp3')} volume={1} />
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
        background: `linear-gradient(90deg, ${T.membrane}, ${T.vesicle})`, borderRadius: 2 }} />
    </div>
  );
};

export function getBiologyEndocytosisDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyEndocytosisCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/endocytosis/cover-endo-exo.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.4, filter: 'brightness(0.45)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={80} color={T.danger}>CELLS EAT</GlowText>
      <div style={{
        fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20, textAlign: 'center',
      }}>
        and spit — here's how
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
        <Badge label="Endocytosis" color={T.membrane} opacity={1} fontSize={20} />
        <Badge label="Exocytosis" color={T.success} opacity={1} fontSize={20} />
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 20 }}>
        Cambridge 9700 · Chapter 1
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
