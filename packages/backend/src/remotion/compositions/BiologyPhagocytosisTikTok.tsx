/**
 * Phagocytosis — TikTok (9:16) v1
 *
 * Cambridge 9700 Topic 1 — How Cells Engulf & Destroy
 * 5-step process: Detection → Attachment → Engulfment → Digestion → Antigen Presentation.
 *
 * Pure CSS motion graphics — WBC engulfing bacteria, step cards.
 * 8 scenes, ~85 seconds, 1080×1920.
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
const TOTAL_DURATION_S = 88;

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
  wbc: '#60a5fa',         // White blood cell blue
  bacteria: '#4ade80',    // Bacteria green
  lysosome: '#a855f7',    // Lysosome purple
  antigen: '#fb923c',     // Antigen orange
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved + manually corrected ──────────────────
const DEFAULT_CUES: Record<string, number> = {
  'bacterium': 0.14,
  'dead': 3.12,
  'phagocytosis': 5.28,       // manually corrected (Whisper: "Phegocytosis")
  'phago-eat': 6.68,          // manually corrected (Whisper: "Phego")
  'phagocyte-eats': 11.50,
  'step-1': 14.22,
  'recognises': 16.32,
  'chemotaxis': 20.88,
  'step-2': 23.04,
  'receptors': 25.52,
  'antigens': 27.54,
  'step-3': 31.00,
  'pseudopods': 33.10,
  'phagosome': 41.02,
  'step-4': 43.24,
  'phagolysosome': 47.58,     // manually corrected (Whisper: "phagolisosome")
  'hydrolytic': 50.30,
  'step-5': 56.72,
  'cytoplasm': 59.64,
  'expelled': 61.16,
  'exam-trick': 64.36,
  'presents': 67.30,
  'antigen-presenting': 71.54,
  'adaptive': 74.04,
  'b-cells': 76.52,
  'cta-detection': 78.50,
  'cta-attachment': 79.50,
  'cta-engulfment': 80.50,
  'cta-digestion': 81.52,
  'cta-antigen': 82.68,
  'five-steps': 84.80,        // manually corrected (CTA occurrence)
  'full-marks': 86.62,
};

export interface BiologyPhagocytosisTikTokProps {
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

const StepCard: React.FC<{
  number: number; title: string; detail: string; color: string; opacity: number; translateY: number;
}> = ({ number, title, detail, color, opacity, translateY }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    display: 'flex', alignItems: 'flex-start', gap: 16,
    padding: '14px 20px', background: `${color}08`,
    borderLeft: `4px solid ${color}`, borderRadius: 10, width: 880,
  }}>
    <div style={{
      fontFamily: T.mono, fontWeight: 900, fontSize: 28, color,
      width: 40, flexShrink: 0, textAlign: 'center',
    }}>{number}</div>
    <div>
      <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 24, color }}>
        {title}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted, marginTop: 4 }}>
        {detail}
      </div>
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
  const bacteriumCue = useCue(ct('bacterium'));
  const deadCue = useCueSpring(ct('dead'));

  const hookScale = interpolate(frame, [0, 5 * 30], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <Img src={staticFile('images/biology/phagocytosis/hook-wbc.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        transform: `scale(${hookScale})`,
        opacity: interpolate(frame, [0, 15], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.35)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.textMuted,
          opacity: bacteriumCue.opacity, marginBottom: 20,
        }}>
          A <span style={{ color: T.bacteria, fontWeight: 700 }}>bacterium</span> enters your blood
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 26, color: T.textMuted,
          opacity: bacteriumCue.opacity, marginBottom: 20,
        }}>
          Within seconds —
        </div>

        <div style={{ opacity: deadCue.opacity, transform: `scale(${deadCue.scale})` }}>
          <GlowText fontSize={100} color={T.danger}>DEAD</GlowText>
        </div>

        <div style={{
          fontFamily: T.font, fontSize: 24, color: T.textMuted,
          opacity: deadCue.opacity, marginTop: 20,
        }}>
          Here's <span style={{ color: T.gold, fontWeight: 700 }}>exactly how</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 2: Definition ──────────────────────────────────────────────
const DefinitionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const phagoCue = useCue(ct('phagocytosis'));
  const phagoEatCue = useCue(ct('phago-eat'));
  const eatsCue = useCueSpring(ct('phagocyte-eats'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 50px' }}>
        <div style={{ opacity: phagoCue.opacity }}>
          <GlowText fontSize={42} color={T.wbc}>PHAGOCYTOSIS</GlowText>
        </div>

        <div style={{ display: 'flex', gap: 30, opacity: phagoEatCue.opacity }}>
          <div style={{
            fontFamily: T.mono, fontSize: 22, color: T.wbc,
            padding: '10px 20px', background: `${T.wbc}10`, borderRadius: 10,
          }}>
            <span style={{ color: T.gold }}>Phago</span> = eat
          </div>
          <div style={{
            fontFamily: T.mono, fontSize: 22, color: T.wbc,
            padding: '10px 20px', background: `${T.wbc}10`, borderRadius: 10,
          }}>
            <span style={{ color: T.gold }}>Cyte</span> = cell
          </div>
        </div>

        <div style={{ opacity: eatsCue.opacity, transform: `scale(${eatsCue.scale})` }}>
          <Badge label="A CELL THAT EATS PATHOGENS" color={T.danger} opacity={1} fontSize={24} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Steps 1-2 ──────────────────────────────────────────────
const Steps12Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const s1Cue = useCue(ct('step-1'));
  const chemoCue = useCue(ct('chemotaxis'));
  const s2Cue = useCue(ct('step-2'));
  const antigenCue = useCue(ct('antigens'));

  // WBC moving toward bacteria
  const wbcX = interpolate(frame, [0, 90], [100, 500],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Animation: WBC approaching bacteria */}
      <div style={{ position: 'relative', width: 800, height: 150, opacity: s1Cue.opacity, marginBottom: 20 }}>
        {/* Bacteria */}
        <div style={{
          position: 'absolute', right: 80, top: 40,
          width: 50, height: 25, borderRadius: 12,
          background: `${T.bacteria}40`, border: `2px solid ${T.bacteria}`,
          boxShadow: `0 0 10px ${T.bacteria}30`,
        }} />
        {/* WBC moving */}
        <div style={{
          position: 'absolute', left: wbcX, top: 20,
          width: 70, height: 70, borderRadius: '50%',
          background: `${T.wbc}20`, border: `3px solid ${T.wbc}`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontFamily: T.mono, fontSize: 14, color: T.wbc, fontWeight: 700,
          boxShadow: `0 0 15px ${T.wbc}30`,
        }}>WBC</div>
        {/* Chemical trail */}
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            position: 'absolute', left: 580 - i * 40, top: 55,
            width: 6, height: 6, borderRadius: '50%',
            background: T.bacteria, opacity: 0.3 - i * 0.06,
          }} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <StepCard number={1} title="Detection"
          detail="Phagocyte detects chemicals → moves toward bacterium (chemotaxis)"
          color={T.primary} opacity={s1Cue.opacity} translateY={s1Cue.translateY} />

        <div style={{ opacity: chemoCue.opacity, marginLeft: 60 }}>
          <Badge label="CHEMOTAXIS" color={T.primary} opacity={1} fontSize={20} />
        </div>

        <StepCard number={2} title="Attachment"
          detail="Membrane receptors bind to antigens on bacterium's surface"
          color={T.antigen} opacity={s2Cue.opacity} translateY={s2Cue.translateY} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Step 3 — Engulfment ────────────────────────────────────
const Step3Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const s3Cue = useCue(ct('step-3'));
  const pseudoCue = useCueSpring(ct('pseudopods'));
  const phagosomeCue = useCueSpring(ct('phagosome'));

  // Pseudopod wrapping animation
  const wrapAngle = interpolate(frame, [0, 60], [0, 280],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <StepCard number={3} title="Engulfment"
          detail="Pseudopods extend around the bacterium"
          color={T.wbc} opacity={s3Cue.opacity} translateY={s3Cue.translateY} />

        {/* Engulfment visual */}
        <svg width={300} height={300} style={{ opacity: pseudoCue.opacity }}>
          {/* Bacteria in center */}
          <ellipse cx={150} cy={150} rx={25} ry={12}
            fill={`${T.bacteria}40`} stroke={T.bacteria} strokeWidth={2} />
          {/* WBC membrane wrapping around */}
          <path
            d={`M ${150 + 80 * Math.cos(-wrapAngle * Math.PI / 360)} ${150 + 80 * Math.sin(-wrapAngle * Math.PI / 360)}
                A 80 80 0 ${wrapAngle > 180 ? 1 : 0} 1
                ${150 + 80 * Math.cos(wrapAngle * Math.PI / 360)} ${150 + 80 * Math.sin(wrapAngle * Math.PI / 360)}`}
            fill="none" stroke={T.wbc} strokeWidth={4} opacity={0.8}
          />
        </svg>

        <div style={{ opacity: phagosomeCue.opacity, transform: `scale(${phagosomeCue.scale})` }}>
          <Badge label="→ PHAGOSOME" color={T.wbc} opacity={1} fontSize={26} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Steps 4-5 ──────────────────────────────────────────────
const Steps45Scene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const s4Cue = useCue(ct('step-4'));
  const phagolysoCue = useCueSpring(ct('phagolysosome'));
  const enzymeCue = useCue(ct('hydrolytic'));
  const s5Cue = useCue(ct('step-5'));
  const expelledCue = useCue(ct('expelled'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <StepCard number={4} title="Digestion"
          detail="Lysosome fuses with phagosome → phagolysosome"
          color={T.lysosome} opacity={s4Cue.opacity} translateY={s4Cue.translateY} />

        <div style={{ opacity: phagolysoCue.opacity, transform: `scale(${phagolysoCue.scale})`, marginLeft: 40 }}>
          <Badge label="PHAGOLYSOSOME" color={T.lysosome} opacity={1} fontSize={22} />
        </div>

        <div style={{
          opacity: enzymeCue.opacity, transform: `translateY(${enzymeCue.translateY}px)`,
          fontFamily: T.font, fontSize: 20, color: T.text, textAlign: 'center',
          padding: '10px 20px', background: `${T.danger}10`, borderRadius: 10,
        }}>
          <span style={{ color: T.danger, fontWeight: 700 }}>Hydrolytic enzymes</span> break down bacterium
        </div>

        <StepCard number={5} title="Absorption"
          detail="Useful molecules absorbed → waste expelled by exocytosis"
          color={T.success} opacity={s5Cue.opacity} translateY={s5Cue.translateY} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Exam Trick — Antigen Presentation ──────────────────────
const ExamTrickScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const trickCue = useCue(ct('exam-trick'));
  const presentsCue = useCue(ct('presents'));
  const apcCue = useCueSpring(ct('antigen-presenting'));
  const adaptiveCue = useCue(ct('adaptive'));
  const bCellsCue = useCue(ct('b-cells'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: trickCue.opacity, marginBottom: 20 }}>
        <GlowText fontSize={30} color={T.warning}>EXAM TRICK</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', padding: '0 50px' }}>
        <div style={{
          opacity: presentsCue.opacity, transform: `translateY(${presentsCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '14px 24px', background: `${T.antigen}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.antigen}`, width: 880,
        }}>
          After digestion, the phagocyte <span style={{ color: T.antigen, fontWeight: 700 }}>presents antigens</span> on its surface
        </div>

        <div style={{ opacity: apcCue.opacity, transform: `scale(${apcCue.scale})` }}>
          <Badge label="ANTIGEN-PRESENTING CELL" color={T.antigen} opacity={1} fontSize={24} />
        </div>

        <div style={{
          opacity: adaptiveCue.opacity, transform: `translateY(${adaptiveCue.translateY}px)`,
          fontFamily: T.font, fontSize: 22, color: T.text, textAlign: 'center',
          padding: '14px 24px', background: `${T.accent}10`, borderRadius: 12,
          borderLeft: `4px solid ${T.accent}`, width: 880,
        }}>
          This triggers the <span style={{ color: T.accent, fontWeight: 700 }}>adaptive immune response</span>
        </div>

        <div style={{
          opacity: bCellsCue.opacity, display: 'flex', gap: 16,
        }}>
          <Badge label="B cells" color={T.primary} opacity={bCellsCue.opacity} fontSize={22} />
          <Badge label="T cells" color={T.success} opacity={bCellsCue.opacity} fontSize={22} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: CTA — Steps appear one by one as narrated ───────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const marksCue = useCueSpring(ct('full-marks'));
  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  const steps = ['Detection', 'Attachment', 'Engulfment', 'Digestion', 'Antigen Presentation'];
  const colors = [T.primary, T.antigen, T.wbc, T.lysosome, T.danger];
  const cueIds = ['cta-detection', 'cta-attachment', 'cta-engulfment', 'cta-digestion', 'cta-antigen'];

  // Each step gets its own cue, timed to the narration
  const stepCues = [
    useCueSpring(ct(cueIds[0])),
    useCueSpring(ct(cueIds[1])),
    useCueSpring(ct(cueIds[2])),
    useCueSpring(ct(cueIds[3])),
    useCueSpring(ct(cueIds[4])),
  ];

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
        padding: 40,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24, background: `${T.gold}08`,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: stepCues[i].opacity,
              transform: `scale(${stepCues[i].scale})`,
            }}>
              <div style={{
                fontFamily: T.mono, fontSize: 20, fontWeight: 900, color: colors[i],
                width: 28, textAlign: 'center',
              }}>{i + 1}</div>
              <div style={{
                fontFamily: T.font, fontSize: 22, fontWeight: 700, color: colors[i],
                padding: '6px 16px', background: `${colors[i]}15`, borderRadius: 8,
              }}>{step}</div>
            </div>
          ))}
        </div>

        <div style={{ opacity: marksCue.opacity, transform: `scale(${marksCue.scale})`, marginTop: 10 }}>
          <GlowText fontSize={36} color={T.gold}>
            That's your full marks
          </GlowText>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',         startS: 0,      durationS: 5.28,  Component: HookScene },
  { id: 'definition',   startS: 5.28,   durationS: 8.94,  Component: DefinitionScene },
  { id: 'steps-1-2',    startS: 14.22,  durationS: 16.78, Component: Steps12Scene },
  { id: 'step-3',       startS: 31.00,  durationS: 12.24, Component: Step3Scene },
  { id: 'steps-4-5',    startS: 43.24,  durationS: 21.12, Component: Steps45Scene },
  { id: 'exam-trick',   startS: 64.36,  durationS: 14.14, Component: ExamTrickScene },
  { id: 'cta',          startS: 78.50,  durationS: 9.50,  Component: CTAScene },
];

export const BiologyPhagocytosisTikTok: React.FC<BiologyPhagocytosisTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/phagocytosis-narration.mp3')} volume={1} />
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
        background: `linear-gradient(90deg, ${T.wbc}, ${T.bacteria})`, borderRadius: 2 }} />
    </div>
  );
};

export function getBiologyPhagocytosisDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyPhagocytosisCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/phagocytosis/cover-phagocytosis.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.4, filter: 'brightness(0.45)',
    }} />
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <GlowText fontSize={60} color={T.danger}>ENGULF</GlowText>
      <GlowText fontSize={60} color={T.danger}>& DESTROY</GlowText>
      <div style={{
        fontFamily: T.font, fontSize: 28, color: T.textMuted, marginTop: 20, textAlign: 'center',
      }}>
        How your immune cells kill bacteria
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 30 }}>
        {['Detection', 'Engulfment', 'Digestion'].map(s => (
          <Badge key={s} label={s} color={T.wbc} opacity={1} fontSize={18} />
        ))}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: `${T.primary}80`, marginTop: 20 }}>
        Cambridge 9700 · Chapter 1
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);
