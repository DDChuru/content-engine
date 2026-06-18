/**
 * Mathematical Proof — TikTok (9:16) v1
 *
 * Cambridge 9709 Pure Mathematics — Proof Methods
 * Deduction, Exhaustion, Contradiction, Counter-example.
 *
 * Pure CSS motion graphics — no images needed.
 * Animated formulas, step reveals, color-coded method badges.
 *
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
} from 'remotion';

// ── Constants ────────────────────────────────────────────────────────
const FPS = 30;
const TOTAL_DURATION_S = 95;

// ── Theme ────────────────────────────────────────────────────────────
const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',      // Deduction
  success: '#22c55e',      // Exhaustion
  accent: '#c084fc',       // Contradiction
  danger: '#ef4444',       // Counter-example
  gold: '#fbbf24',
  warning: '#f59e0b',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// Method colors — consistent throughout
const METHOD = {
  deduction: { color: T.primary, label: 'DEDUCTION', icon: '→' },
  exhaustion: { color: T.success, label: 'EXHAUSTION', icon: '✓' },
  contradiction: { color: T.accent, label: 'CONTRADICTION', icon: '⚡' },
  counterExample: { color: T.danger, label: 'COUNTER-EXAMPLE', icon: '✗' },
};

// ── Cue Map — Whisper-resolved + manually corrected (2026-02-15) ────
const DEFAULT_CUES: Record<string, number> = {
  // Hook
  'prove': 0.36,
  // Intro
  'proof': 3.42,
  'go': 8.18,
  'four-methods': 9.16,
  // Deduction
  'deduction': 13.38,
  'logical': 16.04,
  'even-numbers': 18.52,
  'two-a': 22.58,
  'brackets': 26.48,
  'proven': 29.06,
  // Exhaustion
  'exhaustion': 31.12,
  'check-all': 33.54,
  'n-squared': 34.74,
  'case-1': 39.96,
  'case-2': 43.48,
  'case-3': 45.64,
  'all-cases': 47.28,
  // Contradiction
  'contradiction': 50.12,
  'opposite': 51.92,
  'root-two': 54.50,
  'assume': 56.56,
  'lowest-terms': 58.52,
  'square-both': 59.94,
  'a-even': 67.56,
  'b-even': 68.98,
  'both-even': 70.98,
  'wasnt-lowest': 72.14,
  'contradiction-result': 73.92,
  'irrational': 76.20,
  // Counter-example
  'counter-example': 79.20,
  'one-example': 80.12,
  'primes-odd': 81.94,
  'two-prime': 83.34,
  'disproved': 86.18,
  // Summary
  'summary-deduction': 86.80,
  'summary-exhaustion': 88.48,
  'summary-contradiction': 89.40,
  'summary-counter': 90.30,
  'four-final': 91.42,
  // CTA
  'save': 92.22,
  'exam': 93.38,
};

// ── Types ────────────────────────────────────────────────────────────
export interface MathsProofTikTokProps {
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

function useCueSpring(cueTimeSeconds: number, config = { damping: 16, stiffness: 180 }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({ frame: Math.max(0, frame - cueFrame), fps, config, durationInFrames: 20 });
  return {
    opacity: frame >= cueFrame ? progress : 0,
    scale: frame >= cueFrame ? interpolate(progress, [0, 1], [0.85, 1]) : 0.85,
    translateY: frame >= cueFrame ? interpolate(progress, [0, 1], [30, 0]) : 30,
    isActive: frame >= cueFrame,
  };
}

// ── Reusable Components ─────────────────────────────────────────────

const SceneBg: React.FC<{ accentColor?: string }> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.01) * 5;
  return (
    <AbsoluteFill style={{
      background: `radial-gradient(ellipse at 50% ${40 + drift}%, ${accentColor ? `${accentColor}12` : '#0d122a'} 0%, ${T.bg} 70%)`,
    }}>
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(${T.text}22 1px, transparent 1px), linear-gradient(90deg, ${T.text}22 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
    </AbsoluteFill>
  );
};

/** Method badge — top-left corner */
const MethodBadge: React.FC<{
  method: keyof typeof METHOD; cueTime: number;
  step?: string;
}> = ({ method, cueTime, step }) => {
  const m = METHOD[method];
  const { opacity, scale } = useCueSpring(cueTime);
  return (
    <div style={{
      position: 'absolute', top: 80, left: 50, right: 50,
      display: 'flex', alignItems: 'center', gap: 16,
      opacity, transform: `scale(${scale})`,
    }}>
      {step && (
        <div style={{
          background: `${m.color}22`, border: `2px solid ${m.color}88`,
          borderRadius: 30, padding: '8px 24px',
          fontSize: 24, fontWeight: 700, color: m.color, fontFamily: T.font,
        }}>
          {step}
        </div>
      )}
      <div style={{
        fontSize: 20, fontWeight: 600, color: m.color,
        fontFamily: T.font, letterSpacing: '0.05em',
      }}>
        {m.icon} {m.label}
      </div>
    </div>
  );
};

/** Scene title */
const SceneTitle: React.FC<{
  text: string; subtitle?: string; color: string;
  cueTime: number; top?: number;
}> = ({ text, subtitle, color, cueTime, top = 160 }) => {
  const { opacity, translateY } = useCue(cueTime, 0.6);
  return (
    <div style={{
      position: 'absolute', top, left: 60, right: 60,
      opacity, transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        fontSize: 46, fontWeight: 900, color, fontFamily: T.font,
        letterSpacing: '-0.02em', textShadow: `0 0 40px ${color}55`,
        lineHeight: 1.15,
      }}>
        {text}
      </div>
      {subtitle && (
        <div style={{
          fontSize: 24, fontWeight: 500, color: T.textMuted,
          fontFamily: T.font, marginTop: 8,
        }}>
          {subtitle}
        </div>
      )}
      <div style={{
        width: 80, height: 4, marginTop: 14, borderRadius: 2,
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
    </div>
  );
};

/** Animated formula line — typewriter monospace with glow */
const FormulaLine: React.FC<{
  text: string; cueTime: number; y: number;
  color?: string; fontSize?: number; align?: 'left' | 'center';
}> = ({ text, cueTime, y, color = T.primary, fontSize = 28, align = 'center' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTime * fps;
  const elapsed = Math.max(0, frame - cueFrame);
  const charsToShow = Math.min(text.length, Math.floor(elapsed / 1.5));
  const opacity = interpolate(frame, [cueFrame, cueFrame + 8], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{
      position: 'absolute', top: y,
      left: align === 'center' ? 60 : 70, right: 60,
      textAlign: align, opacity,
      fontSize, fontWeight: 700, color,
      fontFamily: T.mono, textShadow: `0 0 20px ${color}33`,
      lineHeight: 1.4,
    }}>
      {text.slice(0, charsToShow)}
      {charsToShow < text.length && (
        <span style={{ opacity: Math.sin(frame * 0.3) > 0 ? 1 : 0 }}>▊</span>
      )}
    </div>
  );
};

/** Simple text bullet with icon */
const Bullet: React.FC<{
  text: string; cueTime: number; y: number;
  color?: string; icon?: string; fontSize?: number;
}> = ({ text, cueTime, y, color = T.text, icon, fontSize = 24 }) => {
  const { opacity, translateY } = useCue(cueTime, 0.5);
  return (
    <div style={{
      position: 'absolute', top: y, left: 60, right: 60,
      opacity, transform: `translateY(${translateY}px)`,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      {icon && (
        <span style={{ fontSize: fontSize + 2, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
      )}
      <span style={{
        fontSize, fontWeight: 600, color, fontFamily: T.font,
        lineHeight: 1.35, textShadow: `0 2px 10px rgba(0,0,0,0.6)`,
      }}>
        {text}
      </span>
    </div>
  );
};

/** QED / result badge with bounce */
const ResultBadge: React.FC<{
  text: string; color: string; cueTime: number; y: number;
}> = ({ text, color, cueTime, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTime * fps;
  const progress = spring({ frame: Math.max(0, frame - cueFrame), fps,
    config: { damping: 12, stiffness: 200 }, durationInFrames: 25 });
  const scale = frame >= cueFrame ? interpolate(progress, [0, 1], [0, 1.08]) : 0;
  const finalScale = frame >= cueFrame + 25 ? 1 : scale;

  return (
    <div style={{
      position: 'absolute', top: y, left: 60, right: 60,
      display: 'flex', justifyContent: 'center',
      opacity: frame >= cueFrame ? progress : 0,
      transform: `scale(${finalScale})`,
    }}>
      <div style={{
        background: `${color}18`, border: `3px solid ${color}`,
        borderRadius: 20, padding: '14px 36px',
        fontSize: 28, fontWeight: 800, color, fontFamily: T.font,
        textAlign: 'center', boxShadow: `0 0 30px ${color}22`,
      }}>
        {text}
      </div>
    </div>
  );
};

/** Proof step — numbered algebraic step in a box */
const ProofStep: React.FC<{
  step: number; formula: string; annotation?: string;
  cueTime: number; y: number; color?: string;
}> = ({ step, formula, annotation, cueTime, y, color = T.primary }) => {
  const { opacity, translateY } = useCue(cueTime, 0.4);
  return (
    <div style={{
      position: 'absolute', top: y, left: 50, right: 50,
      opacity, transform: `translateY(${translateY}px)`,
    }}>
      <div style={{
        background: `${color}08`, border: `1px solid ${color}22`,
        borderRadius: 14, padding: '14px 24px',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `${color}22`, border: `2px solid ${color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color, fontFamily: T.font,
          flexShrink: 0,
        }}>
          {step}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 24, fontWeight: 700, color,
            fontFamily: T.mono, lineHeight: 1.3,
          }}>
            {formula}
          </div>
          {annotation && (
            <div style={{
              fontSize: 18, fontWeight: 500, color: T.textMuted,
              fontFamily: T.font, marginTop: 4,
            }}>
              {annotation}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** Checkmark case row */
const CaseCheck: React.FC<{
  formula: string; result: string; cueTime: number; y: number;
  color?: string;
}> = ({ formula, result, cueTime, y, color = T.success }) => {
  const { opacity, scale } = useCueSpring(cueTime);
  return (
    <div style={{
      position: 'absolute', top: y, left: 60, right: 60,
      opacity, transform: `scale(${scale})`,
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        background: `${color}22`, border: `2px solid ${color}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, fontWeight: 800, color,
      }}>
        ✓
      </div>
      <div style={{
        fontSize: 24, fontWeight: 600, color: T.text,
        fontFamily: T.mono,
      }}>
        {formula}
      </div>
      <div style={{
        fontSize: 22, fontWeight: 700, color,
        fontFamily: T.font, marginLeft: 'auto',
      }}>
        {result}
      </div>
    </div>
  );
};

/** Progress bar */
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 4, background: `${T.text}10`, zIndex: 100,
    }}>
      <div style={{
        height: '100%', width: `${progress}%`,
        background: `linear-gradient(90deg, ${T.primary}, ${T.accent})`,
        borderRadius: '0 2px 2px 0',
      }} />
    </div>
  );
};

// ── Scene Timing ─────────────────────────────────────────────────────

interface SceneTiming {
  id: string;
  startS: number;
  durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene Components ─────────────────────────────────────────────────

/** Scene 1: Hook — "Can you PROVE it?" */
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 20, stiffness: 100 }, durationInFrames: 15 });

  // Floating math symbols
  const symbols = ['∴', '∀', '∃', '→', '≠', '∎', '⇒', '¬'];

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Floating symbols */}
      {symbols.map((sym, i) => {
        const angle = (i / symbols.length) * Math.PI * 2;
        const radius = 350;
        const x = 540 + Math.cos(angle + frame * 0.005) * radius;
        const y = 960 + Math.sin(angle + frame * 0.005) * radius * 0.6;
        const delay = i * 4;
        const symOpacity = interpolate(frame, [delay, delay + 15], [0, 0.15],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{
            position: 'absolute', left: x - 30, top: y - 30,
            fontSize: 52, color: T.primary, opacity: symOpacity,
            fontFamily: T.mono,
          }}>
            {sym}
          </div>
        );
      })}

      {/* Main question */}
      <div style={{
        position: 'absolute', top: 700, left: 60, right: 60, textAlign: 'center',
        opacity: entrance,
        transform: `scale(${interpolate(entrance, [0, 1], [1.1, 1])})`,
      }}>
        <div style={{
          fontSize: 64, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.02em', lineHeight: 1.2,
        }}>
          Can you<br/><span style={{ color: T.primary }}>prove</span> it?
        </div>
        <div style={{
          fontSize: 38, fontWeight: 600, color: T.textMuted, fontFamily: T.font,
          marginTop: 20,
        }}>
          Really prove it?
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Scene 2: Intro — "Mathematical Proof. 9709. Let's GO!" */
const IntroScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 120 }, durationInFrames: 20 });
  const goCue = useCue(ct('go'), 0.3);

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.primary} />

      <div style={{
        position: 'absolute', top: 400, left: 0, right: 0, textAlign: 'center',
        opacity: entrance,
      }}>
        <div style={{
          display: 'inline-block', background: `${T.primary}15`,
          border: `2px solid ${T.primary}55`, borderRadius: 16,
          padding: '14px 36px', fontSize: 22, fontWeight: 600,
          color: T.primary, fontFamily: T.font,
        }}>
          Cambridge 9709
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 530, left: 60, right: 60, textAlign: 'center',
        opacity: entrance, transform: `scale(${interpolate(entrance, [0, 1], [0.9, 1])})`,
      }}>
        <div style={{
          fontSize: 62, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.02em', lineHeight: 1.15,
        }}>
          Mathematical<br/>Proof
        </div>
      </div>

      {/* LET'S GO! */}
      <div style={{
        position: 'absolute', top: 780, left: 0, right: 0, textAlign: 'center',
        opacity: goCue.opacity,
        transform: `scale(${1 + (1 - goCue.opacity) * 0.3}) translateY(${goCue.translateY}px)`,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 900, color: T.gold,
          fontFamily: T.font, letterSpacing: '0.06em',
          textShadow: `0 0 40px ${T.gold}55`,
        }}>
          LET'S GO!
        </div>
      </div>

      {/* Four method pills preview */}
      {(() => {
        const fourCue = useCue(ct('four-methods'), 0.5);
        const methods = [METHOD.deduction, METHOD.exhaustion, METHOD.contradiction, METHOD.counterExample];
        return (
          <div style={{
            position: 'absolute', top: 950, left: 40, right: 40,
            display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap',
            opacity: fourCue.opacity,
          }}>
            {methods.map((m, i) => {
              const delay = i * 3;
              const s = spring({ frame: Math.max(0, frame - (ct('four-methods') * fps + delay)), fps,
                config: { damping: 14, stiffness: 200 }, durationInFrames: 15 });
              return (
                <div key={i} style={{
                  background: `${m.color}15`, border: `2px solid ${m.color}55`,
                  borderRadius: 12, padding: '8px 20px',
                  fontSize: 18, fontWeight: 700, color: m.color, fontFamily: T.font,
                  opacity: s, transform: `scale(${s})`,
                }}>
                  {m.icon} {m.label}
                </div>
              );
            })}
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

/** Scene 3: Proof by Deduction — even numbers example */
const DeductionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.primary} />

      <MethodBadge method="deduction" cueTime={0} step="1/4" />
      <SceneTitle text="Proof by Deduction"
        subtitle="Logical steps to your conclusion"
        color={T.primary} cueTime={ct('deduction')} />

      <Bullet text="Prove: sum of two even numbers is always even"
        cueTime={ct('even-numbers')} y={340} color={T.text} icon="📝" />

      <ProofStep step={1} formula="Let them be 2a and 2b"
        cueTime={ct('two-a')} y={430} color={T.primary} />

      <ProofStep step={2} formula="2a + 2b = 2(a + b)"
        annotation="Factor out the 2"
        cueTime={ct('brackets')} y={530} color={T.primary} />

      <ProofStep step={3} formula="2(a + b) is even  ∎"
        annotation="Multiple of 2 → always even"
        cueTime={ct('proven') - 0.5} y={640} color={T.primary} />

      <ResultBadge text="✓ PROVEN by deduction"
        color={T.primary} cueTime={ct('proven')} y={780} />
    </AbsoluteFill>
  );
};

/** Scene 4: Proof by Exhaustion — n²+n cases */
const ExhaustionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.success} />

      <MethodBadge method="exhaustion" cueTime={0} step="2/4" />
      <SceneTitle text="Proof by Exhaustion"
        subtitle="Only a few cases? Check them ALL"
        color={T.success} cueTime={ct('exhaustion')} />

      <Bullet text="Is n² + n always even for n = 1, 2, 3?"
        cueTime={ct('n-squared')} y={340} color={T.text} icon="🔢" />

      <CaseCheck formula="n=1: 1+1 = 2"  result="EVEN ✓"
        cueTime={ct('case-1')} y={440} color={T.success} />

      <CaseCheck formula="n=2: 4+2 = 6"  result="EVEN ✓"
        cueTime={ct('case-2')} y={520} color={T.success} />

      <CaseCheck formula="n=3: 9+3 = 12" result="EVEN ✓"
        cueTime={ct('case-3')} y={600} color={T.success} />

      <ResultBadge text="✓ ALL cases checked — PROVEN"
        color={T.success} cueTime={ct('all-cases')} y={720} />
    </AbsoluteFill>
  );
};

/** Scene 5: Proof by Contradiction — √2 is irrational */
const ContradictionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.accent} />

      <MethodBadge method="contradiction" cueTime={0} step="3/4" />
      <SceneTitle text="Proof by Contradiction"
        subtitle="Assume the opposite → find the contradiction"
        color={T.accent} cueTime={ct('contradiction')} />

      <Bullet text="Prove: √2 is irrational"
        cueTime={ct('root-two')} y={320} color={T.text} icon="📐" />

      <ProofStep step={1} formula="Assume √2 = a/b"
        annotation="In lowest terms (fully simplified)"
        cueTime={ct('assume')} y={400} color={T.accent} />

      <ProofStep step={2} formula="2 = a²/b²  →  a² = 2b²"
        annotation="Square both sides"
        cueTime={ct('square-both')} y={500} color={T.accent} />

      <ProofStep step={3} formula="∴ a must be even"
        annotation="a² is even → a is even"
        cueTime={ct('a-even')} y={600} color={T.accent} />

      <ProofStep step={4} formula="∴ b must be even too"
        annotation="Substitute a=2k → b² is even → b is even"
        cueTime={ct('b-even')} y={700} color={T.accent} />

      <Bullet text="Both even? Then a/b wasn't in lowest terms!"
        cueTime={ct('wasnt-lowest')} y={810} color={T.warning} icon="⚠️" />

      {/* Contradiction explosion */}
      {(() => {
        const cue = useCueSpring(ct('contradiction-result'));
        return (
          <div style={{
            position: 'absolute', top: 900, left: 60, right: 60,
            display: 'flex', justifyContent: 'center',
            opacity: cue.opacity, transform: `scale(${cue.scale})`,
          }}>
            <div style={{
              background: `${T.accent}22`, border: `3px solid ${T.accent}`,
              borderRadius: 20, padding: '16px 40px',
              fontSize: 30, fontWeight: 900, color: T.accent, fontFamily: T.font,
              boxShadow: `0 0 40px ${T.accent}33`,
            }}>
              ⚡ CONTRADICTION
            </div>
          </div>
        );
      })()}

      <FormulaLine text="∴ √2 is irrational  ∎"
        cueTime={ct('irrational')} y={1010} color={T.accent} fontSize={30} />
    </AbsoluteFill>
  );
};

/** Scene 6: Disproof by Counter-example */
const CounterExampleScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.danger} />

      <MethodBadge method="counterExample" cueTime={0} step="4/4" />
      <SceneTitle text="Disproof by Counter-example"
        subtitle="One example breaks it"
        color={T.danger} cueTime={ct('counter-example')} />

      {/* The false claim */}
      <Bullet text={`Claim: "All prime numbers are odd"`}
        cueTime={ct('primes-odd')} y={380} color={T.textMuted} icon="💬" />

      {/* The counter-example — big dramatic "2" */}
      {(() => {
        const twoCue = useCueSpring(ct('two-prime'));
        return (
          <div style={{
            position: 'absolute', top: 520, left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: twoCue.opacity, transform: `scale(${twoCue.scale})`,
          }}>
            <div style={{
              width: 200, height: 200, borderRadius: '50%',
              background: `radial-gradient(circle at 35% 35%, ${T.danger}ee, ${T.danger}44)`,
              boxShadow: `0 0 60px ${T.danger}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 100, fontWeight: 900, color: T.text, fontFamily: T.font,
            }}>
              2
            </div>
            <div style={{
              marginTop: 20, fontSize: 26, fontWeight: 700,
              color: T.danger, fontFamily: T.font,
            }}>
              PRIME and EVEN
            </div>
          </div>
        );
      })()}

      {/* Big X through the claim */}
      {(() => {
        const xCue = useCueSpring(ct('disproved'));
        return (
          <div style={{
            position: 'absolute', top: 850, left: 60, right: 60,
            display: 'flex', justifyContent: 'center',
            opacity: xCue.opacity, transform: `scale(${xCue.scale})`,
          }}>
            <div style={{
              fontSize: 80, fontWeight: 900, color: T.danger,
              fontFamily: T.font, textShadow: `0 0 30px ${T.danger}44`,
            }}>
              ✗ DISPROVED
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

/** Scene 7: Summary — four methods recap */
const SummaryScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const methods = [
    { ...METHOD.deduction, cue: ct('summary-deduction') },
    { ...METHOD.exhaustion, cue: ct('summary-exhaustion') },
    { ...METHOD.contradiction, cue: ct('summary-contradiction') },
    { ...METHOD.counterExample, cue: ct('summary-counter') },
  ];

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.gold} />

      {/* Method cards appearing one by one */}
      {methods.map((m, i) => {
        const cueFrame = m.cue * fps;
        const progress = spring({ frame: Math.max(0, frame - cueFrame), fps,
          config: { damping: 14, stiffness: 180 }, durationInFrames: 20 });
        return (
          <div key={i} style={{
            position: 'absolute', top: 340 + i * 130, left: 60, right: 60,
            opacity: frame >= cueFrame ? progress : 0,
            transform: `translateX(${interpolate(progress, [0, 1], [40, 0])}px)`,
          }}>
            <div style={{
              background: `${m.color}12`, border: `2px solid ${m.color}44`,
              borderRadius: 16, padding: '18px 28px',
              display: 'flex', alignItems: 'center', gap: 18,
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: `${m.color}22`, border: `2px solid ${m.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 800, color: m.color, fontFamily: T.font,
              }}>
                {i + 1}
              </div>
              <div style={{
                fontSize: 28, fontWeight: 800, color: m.color,
                fontFamily: T.font, letterSpacing: '0.02em',
              }}>
                {m.icon} {m.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* "Four methods" badge */}
      {(() => {
        const fourCue = useCueSpring(ct('four-final'));
        return (
          <div style={{
            position: 'absolute', top: 900, left: 0, right: 0, textAlign: 'center',
            opacity: fourCue.opacity, transform: `scale(${fourCue.scale})`,
          }}>
            <div style={{
              fontSize: 46, fontWeight: 900, color: T.gold, fontFamily: T.font,
              textShadow: `0 0 30px ${T.gold}44`,
            }}>
              Four methods. 📐
            </div>
          </div>
        );
      })()}
    </AbsoluteFill>
  );
};

/** Scene 8: CTA — "Save this" */
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const { opacity: saveO, scale: saveS } = useCueSpring(ct('save'));

  return (
    <AbsoluteFill>
      <SceneBg accentColor={T.gold} />

      <div style={{
        position: 'absolute', top: 700, left: 60, right: 60, textAlign: 'center',
        opacity: saveO, transform: `scale(${saveS})`,
      }}>
        <div style={{
          fontSize: 56, fontWeight: 900, color: T.gold, fontFamily: T.font,
          textShadow: `0 0 40px ${T.gold}44`,
        }}>
          💾 Save this!
        </div>
        <div style={{
          fontSize: 28, fontWeight: 600, color: T.text, fontFamily: T.font,
          marginTop: 20, opacity: 0.8,
        }}>
          Guaranteed exam marks.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene Array ──────────────────────────────────────────────────────

const SCENES: SceneTiming[] = [
  { id: 'hook',            startS: 0,     durationS: 3.42,  Component: HookScene },
  { id: 'intro',           startS: 3.42,  durationS: 9.96,  Component: IntroScene },
  { id: 'deduction',       startS: 13.38, durationS: 17.74, Component: DeductionScene },
  { id: 'exhaustion',      startS: 31.12, durationS: 18.0,  Component: ExhaustionScene },
  { id: 'contradiction',   startS: 49.12, durationS: 29.08, Component: ContradictionScene },
  { id: 'counter-example', startS: 78.20, durationS: 8.60,  Component: CounterExampleScene },
  { id: 'summary',         startS: 86.80, durationS: 5.42,  Component: SummaryScene },
  { id: 'cta',             startS: 92.22, durationS: 2.78,  Component: CTAScene },
];

// ── Main Composition ─────────────────────────────────────────────────

export const MathsProofTikTok: React.FC<MathsProofTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string): number => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/maths/proof-narration.mp3')} />
      )}

      <ProgressBar />

      {SCENES.map((scene) => (
        <Sequence
          key={scene.id}
          from={Math.round(scene.startS * FPS)}
          durationInFrames={Math.round(scene.durationS * FPS)}
          name={scene.id}
        >
          <scene.Component ct={(id: string) => ct(id) - scene.startS} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// ── Duration helper ──────────────────────────────────────────────────

export function getMathsProofDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Cover Image ──────────────────────────────────────────────────────

export const MathsProofCover: React.FC = () => {
  const methods = [METHOD.deduction, METHOD.exhaustion, METHOD.contradiction, METHOD.counterExample];

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      <SceneBg accentColor={T.primary} />

      <div style={{
        position: 'absolute', top: 220, left: 0, right: 0, textAlign: 'center',
      }}>
        <span style={{
          display: 'inline-block', background: `${T.primary}15`,
          border: `2px solid ${T.primary}55`, borderRadius: 14,
          padding: '12px 32px', fontSize: 22, fontWeight: 600,
          color: T.primary, fontFamily: T.font,
        }}>
          CAMBRIDGE 9709
        </span>
      </div>

      <div style={{
        position: 'absolute', top: 350, left: 60, right: 60, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 80, fontWeight: 900, color: T.text, fontFamily: T.font,
          letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>
          Mathematical<br/>Proof
        </div>
        <div style={{
          fontSize: 30, fontWeight: 500, color: T.textMuted, fontFamily: T.font,
          marginTop: 16,
        }}>
          Pure Mathematics
        </div>
      </div>

      <div style={{
        position: 'absolute', top: 700, left: 40, right: 40,
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {methods.map((m, i) => (
          <div key={i} style={{
            background: `${m.color}12`, border: `2px solid ${m.color}44`,
            borderRadius: 14, padding: '14px 24px', textAlign: 'center',
            fontSize: 24, fontWeight: 800, color: m.color, fontFamily: T.font,
          }}>
            {m.icon} {m.label}
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute', bottom: 200, left: 0, right: 0, textAlign: 'center',
      }}>
        <div style={{
          fontSize: 34, fontWeight: 800, color: T.gold, fontFamily: T.font,
        }}>
          4 methods. Guaranteed marks. 📐
        </div>
      </div>
    </AbsoluteFill>
  );
};
