/**
 * Proof Notation — TikTok (9:16) v1
 *
 * Companion to MathsProofTikTok. Covers language of proof:
 * Number sets (ℕ, ℤ, ℚ, ℝ), algebraic forms (2k, 2k+1),
 * LHS/RHS, examiner tips.
 *
 * Pure CSS motion graphics — no images.
 * 7 scenes, ~73 seconds, 1080×1920.
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
const TOTAL_DURATION_S = 73;

// ── Theme (matches MathsProofTikTok) ────────────────────────────────
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
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// Number set colors
const SET_COLORS = {
  N: '#fbbf24',   // gold
  Z: '#00d9ff',   // cyan
  Q: '#22c55e',   // green
  R: '#c084fc',   // purple
};

// ── Cue Map — Whisper-resolved (2026-02-15) ──────────────────────────
const DEFAULT_CUES: Record<string, number> = {
  // Hook
  'language': 2.04,
  // Number sets
  'number-sets': 2.90,
  'n-natural': 7.04,
  'counting': 11.82,
  'z-integers': 14.36,
  'negatives': 16.66,
  'q-rational': 18.96,
  'fraction': 22.32,
  'r-real': 24.80,
  'number-line': 27.08,
  // Algebraic forms
  'algebraic': 32.32,
  'even-2k': 33.74,
  'odd-2k1': 36.30,
  'multiples-3k': 39.12,
  'general-form': 44.46,
  'manipulate': 45.78,
  // LHS/RHS
  'lhs': 47.38,
  'rhs': 49.22,
  'equal-proven': 51.44,
  // Examiner tips
  'examiner': 53.38,
  'try-values': 56.76,
  'try-negatives': 59.98,
  'try-zero': 61.18,  // manually corrected — was 17.46 (wrong "zero")
  'pattern': 62.76,
  // Primes shortcut
  'primes': 65.18,
  'square-root': 68.22,
  'shortcut': 69.60,
  // CTA
  'master-language': 70.62,
  'master-proof': 71.94,
};

// ── Types ────────────────────────────────────────────────────────────
export interface MathsProofNotationTikTokProps {
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
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, color = T.primary, fontSize = 48, style }) => (
  <div style={{
    fontFamily: T.font,
    fontWeight: 800,
    fontSize,
    color,
    textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`,
    textAlign: 'center',
    ...style,
  }}>
    {children}
  </div>
);

const MonoFormula: React.FC<{
  children: React.ReactNode;
  color?: string;
  fontSize?: number;
  style?: React.CSSProperties;
}> = ({ children, color = T.primary, fontSize = 36, style }) => (
  <div style={{
    fontFamily: T.mono,
    fontWeight: 700,
    fontSize,
    color,
    textShadow: `0 0 20px ${color}50`,
    textAlign: 'center',
    letterSpacing: 2,
    ...style,
  }}>
    {children}
  </div>
);

// Number set card
const SetCard: React.FC<{
  symbol: string;
  name: string;
  description: string;
  examples: string;
  color: string;
  opacity: number;
  translateY: number;
}> = ({ symbol, name, description, examples, color, opacity, translateY }) => (
  <div style={{
    opacity,
    transform: `translateY(${translateY}px)`,
    display: 'flex',
    alignItems: 'center',
    gap: 24,
    padding: '18px 28px',
    background: `${color}10`,
    borderLeft: `4px solid ${color}`,
    borderRadius: 12,
    width: 900,
  }}>
    <div style={{
      fontFamily: T.mono,
      fontWeight: 900,
      fontSize: 64,
      color,
      textShadow: `0 0 30px ${color}50`,
      width: 90,
      textAlign: 'center',
      flexShrink: 0,
    }}>
      {symbol}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontFamily: T.font, fontWeight: 700, fontSize: 26, color: T.text }}>
        {name}
      </div>
      <div style={{ fontFamily: T.font, fontSize: 20, color: T.textMuted }}>
        {description}
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 18, color: `${color}cc` }}>
        {examples}
      </div>
    </div>
  </div>
);

// Algebraic form row
const AlgebraRow: React.FC<{
  label: string;
  formula: string;
  color: string;
  opacity: number;
  scale: number;
}> = ({ label, formula, color, opacity, scale }) => (
  <div style={{
    opacity,
    transform: `scale(${scale})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    padding: '16px 0',
  }}>
    <div style={{
      fontFamily: T.font,
      fontWeight: 600,
      fontSize: 28,
      color: T.textMuted,
      width: 240,
      textAlign: 'right',
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: T.mono,
      fontWeight: 800,
      fontSize: 44,
      color,
      textShadow: `0 0 25px ${color}50`,
      padding: '8px 32px',
      background: `${color}12`,
      borderRadius: 12,
      border: `2px solid ${color}30`,
    }}>
      {formula}
    </div>
  </div>
);

// LHS = RHS display
const EqualsDisplay: React.FC<{
  lhs: string;
  rhs: string;
  lhsOpacity: number;
  rhsOpacity: number;
  equalsOpacity: number;
}> = ({ lhs, rhs, lhsOpacity, rhsOpacity, equalsOpacity }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  }}>
    <div style={{
      opacity: lhsOpacity,
      fontFamily: T.mono,
      fontWeight: 800,
      fontSize: 48,
      color: T.primary,
      padding: '12px 28px',
      background: `${T.primary}15`,
      borderRadius: 12,
      border: `2px solid ${T.primary}40`,
      textShadow: `0 0 20px ${T.primary}40`,
    }}>
      {lhs}
    </div>
    <div style={{
      opacity: equalsOpacity,
      fontFamily: T.mono,
      fontWeight: 900,
      fontSize: 56,
      color: T.gold,
      textShadow: `0 0 30px ${T.gold}60`,
    }}>
      =
    </div>
    <div style={{
      opacity: rhsOpacity,
      fontFamily: T.mono,
      fontWeight: 800,
      fontSize: 48,
      color: T.accent,
      padding: '12px 28px',
      background: `${T.accent}15`,
      borderRadius: 12,
      border: `2px solid ${T.accent}40`,
      textShadow: `0 0 20px ${T.accent}40`,
    }}>
      {rhs}
    </div>
  </div>
);

// Tip row
const TipRow: React.FC<{
  icon: string;
  text: string;
  color: string;
  opacity: number;
  translateY: number;
}> = ({ icon, text, color, opacity, translateY }) => (
  <div style={{
    opacity,
    transform: `translateY(${translateY}px)`,
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: '14px 24px',
    background: `${color}10`,
    borderRadius: 10,
    width: 880,
  }}>
    <div style={{ fontSize: 32, flexShrink: 0 }}>{icon}</div>
    <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 24, color: T.text }}>
      {text}
    </div>
  </div>
);

// ── Scene Types ──────────────────────────────────────────────────────
interface SceneTiming {
  id: string;
  startS: number;
  durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

// ── Scene 1: Hook ────────────────────────────────────────────────────
const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Floating math symbols background
  const symbols = ['ℕ', 'ℤ', 'ℚ', 'ℝ', '∈', '⊂', '∀', '∃'];
  const positions = [
    { x: 15, y: 10 }, { x: 75, y: 15 }, { x: 25, y: 80 }, { x: 80, y: 75 },
    { x: 50, y: 20 }, { x: 10, y: 50 }, { x: 85, y: 45 }, { x: 45, y: 85 },
  ];

  const hookCue = useCue(ct('language'), 0.6);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Floating symbols */}
      {symbols.map((s, i) => {
        const drift = Math.sin((frame + i * 40) / 60) * 15;
        const symbolOpacity = interpolate(frame, [i * 4, i * 4 + 15], [0, 0.15],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${positions[i].x}%`,
            top: `${positions[i].y}%`,
            transform: `translateY(${drift}px)`,
            fontFamily: T.mono,
            fontSize: 72,
            color: T.primary,
            opacity: symbolOpacity,
          }}>
            {s}
          </div>
        );
      })}

      {/* Main text */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div style={{
          fontFamily: T.font,
          fontWeight: 400,
          fontSize: 32,
          color: T.textMuted,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Before you prove anything...
        </div>
        <GlowText
          fontSize={56}
          color={T.gold}
          style={{
            opacity: hookCue.opacity,
            transform: `translateY(${hookCue.translateY}px)`,
          }}
        >
          LEARN THE LANGUAGE
        </GlowText>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Number Sets ─────────────────────────────────────────────
const NumberSetsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const nCue = useCue(ct('n-natural'));
  const countingCue = useCue(ct('counting'));
  const zCue = useCue(ct('z-integers'));
  const negCue = useCue(ct('negatives'));
  const qCue = useCue(ct('q-rational'));
  const fracCue = useCue(ct('fraction'));
  const rCue = useCue(ct('r-real'));
  const lineCue = useCue(ct('number-line'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: 80 }}>
        <GlowText fontSize={40} color={T.primary}>NUMBER SETS</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }}>
        <SetCard
          symbol="ℕ"
          name="Natural Numbers"
          description="The counting numbers"
          examples="1, 2, 3, 4, ..."
          color={SET_COLORS.N}
          opacity={nCue.opacity}
          translateY={nCue.translateY}
        />
        <SetCard
          symbol="ℤ"
          name="Integers"
          description="Whole numbers inc. negatives & zero"
          examples="..., -2, -1, 0, 1, 2, ..."
          color={SET_COLORS.Z}
          opacity={zCue.opacity}
          translateY={zCue.translateY}
        />
        <SetCard
          symbol="ℚ"
          name="Rational Numbers"
          description="Anything writable as a fraction a/b"
          examples="½, -¾, 0.333..., 7"
          color={SET_COLORS.Q}
          opacity={qCue.opacity}
          translateY={qCue.translateY}
        />
        <SetCard
          symbol="ℝ"
          name="Real Numbers"
          description="Everything on the number line"
          examples="π, √2, -3.14, 0, 7"
          color={SET_COLORS.R}
          opacity={rCue.opacity}
          translateY={rCue.translateY}
        />
      </div>

      {/* Subset chain at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: lineCue.opacity,
        transform: `translateY(${lineCue.translateY}px)`,
      }}>
        {['ℕ', '⊂', 'ℤ', '⊂', 'ℚ', '⊂', 'ℝ'].map((s, i) => (
          <div key={i} style={{
            fontFamily: T.mono,
            fontWeight: i % 2 === 0 ? 800 : 400,
            fontSize: i % 2 === 0 ? 36 : 28,
            color: i % 2 === 0
              ? [SET_COLORS.N, '', SET_COLORS.Z, '', SET_COLORS.Q, '', SET_COLORS.R][i]
              : T.textMuted,
          }}>
            {s}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Algebraic Forms ─────────────────────────────────────────
const AlgebraicScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const evenCue = useCueSpring(ct('even-2k'));
  const oddCue = useCueSpring(ct('odd-2k1'));
  const multCue = useCueSpring(ct('multiples-3k'));
  const genCue = useCue(ct('general-form'));
  const manipCue = useCue(ct('manipulate'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Title */}
      <div style={{ position: 'absolute', top: 80 }}>
        <GlowText fontSize={38} color={T.accent}>ALGEBRAIC FORMS</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
        <AlgebraRow
          label="Even numbers"
          formula="2k"
          color={T.primary}
          opacity={evenCue.opacity}
          scale={evenCue.scale}
        />
        <AlgebraRow
          label="Odd numbers"
          formula="2k + 1"
          color={T.success}
          opacity={oddCue.opacity}
          scale={oddCue.scale}
        />
        <AlgebraRow
          label="Multiples of 3"
          formula="3k"
          color={T.gold}
          opacity={multCue.opacity}
          scale={multCue.scale}
        />
      </div>

      {/* Bottom caption */}
      <div style={{
        position: 'absolute',
        bottom: 160,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          opacity: genCue.opacity,
          transform: `translateY(${genCue.translateY}px)`,
          fontFamily: T.font,
          fontWeight: 600,
          fontSize: 26,
          color: T.text,
          textAlign: 'center',
          padding: '0 60px',
        }}>
          Express the <span style={{ color: T.gold }}>general form</span>,
        </div>
        <div style={{
          opacity: manipCue.opacity,
          transform: `translateY(${manipCue.translateY}px)`,
          fontFamily: T.font,
          fontWeight: 600,
          fontSize: 26,
          color: T.text,
          textAlign: 'center',
        }}>
          then <span style={{ color: T.accent }}>manipulate</span>.
        </div>
      </div>

      {/* k ∈ ℤ footnote */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        fontFamily: T.mono,
        fontSize: 22,
        color: T.textMuted,
        opacity: genCue.opacity,
      }}>
        where k ∈ ℤ
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: LHS / RHS ──────────────────────────────────────────────
const LhsRhsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const lhsCue = useCue(ct('lhs'));
  const rhsCue = useCue(ct('rhs'));
  const equalCue = useCueSpring(ct('equal-proven'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 60 }}>
        {/* LHS label */}
        <div style={{
          opacity: lhsCue.opacity,
          transform: `translateY(${lhsCue.translateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <MonoFormula fontSize={52} color={T.primary}>LHS</MonoFormula>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>
            Left-Hand Side
          </div>
        </div>

        {/* Equals */}
        <div style={{
          opacity: equalCue.opacity,
          transform: `scale(${equalCue.scale})`,
        }}>
          <EqualsDisplay
            lhs="2(a+b)"
            rhs="2a + 2b"
            lhsOpacity={equalCue.opacity}
            rhsOpacity={equalCue.opacity}
            equalsOpacity={equalCue.opacity}
          />
        </div>

        {/* RHS label */}
        <div style={{
          opacity: rhsCue.opacity,
          transform: `translateY(${rhsCue.translateY}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
        }}>
          <MonoFormula fontSize={52} color={T.accent}>RHS</MonoFormula>
          <div style={{ fontFamily: T.font, fontSize: 24, color: T.textMuted }}>
            Right-Hand Side
          </div>
        </div>

        {/* Proven badge */}
        <div style={{
          opacity: equalCue.opacity,
          transform: `scale(${equalCue.scale})`,
          fontFamily: T.font,
          fontWeight: 800,
          fontSize: 28,
          color: T.success,
          padding: '10px 32px',
          border: `2px solid ${T.success}60`,
          borderRadius: 30,
          background: `${T.success}15`,
          textShadow: `0 0 20px ${T.success}40`,
        }}>
          SHOW THEY'RE EQUAL → PROVEN ✓
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Examiner Tips ───────────────────────────────────────────
const ExaminerTipsScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const tipsCue = useCue(ct('examiner'));
  const valCue = useCue(ct('try-values'));
  const negCue = useCue(ct('try-negatives'));
  const zeroCue = useCue(ct('try-zero'));
  const patCue = useCue(ct('pattern'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 100,
        opacity: tipsCue.opacity,
        transform: `translateY(${tipsCue.translateY}px)`,
      }}>
        <GlowText fontSize={42} color={T.warning}>EXAMINER TIPS</GlowText>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 80 }}>
        <TipRow
          icon="🔢"
          text="Try values: 1, 2, 3 — spot the pattern"
          color={T.primary}
          opacity={valCue.opacity}
          translateY={valCue.translateY}
        />
        <TipRow
          icon="➖"
          text="Try negatives — edge cases matter"
          color={T.accent}
          opacity={negCue.opacity}
          translateY={negCue.translateY}
        />
        <TipRow
          icon="0️⃣"
          text="Try zero — the classic trap"
          color={T.danger}
          opacity={zeroCue.opacity}
          translateY={zeroCue.translateY}
        />
        <TipRow
          icon="🎯"
          text="Spot the pattern first, then prove it"
          color={T.success}
          opacity={patCue.opacity}
          translateY={patCue.translateY}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: Primes Shortcut ─────────────────────────────────────────
const PrimesScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const primesCue = useCue(ct('primes'));
  const sqrtCue = useCueSpring(ct('square-root'));
  const shortcutCue = useCueSpring(ct('shortcut'));

  // Animated √ symbol
  const sqrtScale = sqrtCue.isActive
    ? interpolate(frame - ct('square-root') * fps, [0, 20], [0.5, 1],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    : 0;

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        {/* Title */}
        <div style={{
          opacity: primesCue.opacity,
          transform: `translateY(${primesCue.translateY}px)`,
        }}>
          <GlowText fontSize={38} color={T.success}>TESTING PRIMES</GlowText>
        </div>

        {/* Main insight */}
        <div style={{
          opacity: primesCue.opacity,
          fontFamily: T.font,
          fontWeight: 600,
          fontSize: 26,
          color: T.textMuted,
          textAlign: 'center',
          padding: '0 60px',
        }}>
          Only test factors up to...
        </div>

        {/* Big √n */}
        <div style={{
          opacity: sqrtCue.opacity,
          transform: `scale(${sqrtCue.scale})`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <MonoFormula fontSize={100} color={T.gold}>√n</MonoFormula>
        </div>

        {/* Example */}
        <div style={{
          opacity: sqrtCue.opacity,
          fontFamily: T.mono,
          fontSize: 24,
          color: T.textMuted,
          textAlign: 'center',
        }}>
          Is 97 prime? Only test: 2, 3, 5, 7
        </div>
        <div style={{
          opacity: sqrtCue.opacity,
          fontFamily: T.mono,
          fontSize: 20,
          color: `${T.success}aa`,
        }}>
          (√97 ≈ 9.8 → test up to 9)
        </div>

        {/* Shortcut badge */}
        <div style={{
          opacity: shortcutCue.opacity,
          transform: `scale(${shortcutCue.scale})`,
          fontFamily: T.font,
          fontWeight: 800,
          fontSize: 30,
          color: T.gold,
          padding: '12px 36px',
          border: `2px solid ${T.gold}60`,
          borderRadius: 30,
          background: `${T.gold}15`,
          textShadow: `0 0 20px ${T.gold}40`,
        }}>
          YOUR SHORTCUT ⚡
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: CTA ─────────────────────────────────────────────────────
const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const langCue = useCueSpring(ct('master-language'));
  const proofCue = useCueSpring(ct('master-proof'));

  // Pulsing border
  const pulse = 0.5 + 0.5 * Math.sin(frame / 10);

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 30,
        padding: 60,
        border: `2px solid ${T.gold}${Math.round(pulse * 60 + 20).toString(16).padStart(2, '0')}`,
        borderRadius: 24,
        background: `${T.gold}08`,
      }}>
        <div style={{
          opacity: langCue.opacity,
          transform: `scale(${langCue.scale})`,
        }}>
          <GlowText fontSize={42} color={T.primary}>
            Master the language
          </GlowText>
        </div>
        <div style={{
          opacity: proofCue.opacity,
          transform: `scale(${proofCue.scale})`,
        }}>
          <GlowText fontSize={42} color={T.gold}>
            Then master the proof
          </GlowText>
        </div>
        <div style={{
          opacity: proofCue.opacity,
          fontFamily: T.font,
          fontWeight: 600,
          fontSize: 22,
          color: T.textMuted,
          marginTop: 10,
        }}>
          Part 1 of 2 — Proof Notation
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array (AFTER component definitions) ───────────────────────
const SCENES: SceneTiming[] = [
  { id: 'hook',         startS: 0,     durationS: 5.80,  Component: HookScene },
  { id: 'number-sets',  startS: 5.80,  durationS: 24.52, Component: NumberSetsScene },
  { id: 'algebraic',    startS: 30.32, durationS: 17.06, Component: AlgebraicScene },
  { id: 'lhs-rhs',      startS: 47.38, durationS: 5.62,  Component: LhsRhsScene },
  { id: 'examiner',     startS: 53.00, durationS: 12.18, Component: ExaminerTipsScene },
  { id: 'primes',       startS: 65.18, durationS: 5.44,  Component: PrimesScene },
  { id: 'cta',          startS: 70.62, durationS: 2.38,  Component: CTAScene },
];

// ── Main Composition ─────────────────────────────────────────────────
export const MathsProofNotationTikTok: React.FC<MathsProofNotationTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/maths/proof-notation-narration.mp3')} volume={1} />
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

      {/* Progress bar */}
      <ProgressBar />
    </AbsoluteFill>
  );
};

// ── Progress Bar ─────────────────────────────────────────────────────
const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = (frame / durationInFrames) * 100;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `${T.text}10`,
    }}>
      <div style={{
        height: '100%',
        width: `${progress}%`,
        background: `linear-gradient(90deg, ${T.primary}, ${T.gold})`,
        borderRadius: 2,
      }} />
    </div>
  );
};

// ── Duration Helper ──────────────────────────────────────────────────
export function getMathsProofNotationDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Cover Still ──────────────────────────────────────────────────────
export const MathsProofNotationCover: React.FC = () => (
  <AbsoluteFill style={{
    background: T.bg,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    {/* Big set symbols */}
    <div style={{
      display: 'flex',
      gap: 36,
      marginBottom: 40,
    }}>
      {[
        { s: 'ℕ', c: SET_COLORS.N },
        { s: 'ℤ', c: SET_COLORS.Z },
        { s: 'ℚ', c: SET_COLORS.Q },
        { s: 'ℝ', c: SET_COLORS.R },
      ].map(({ s, c }) => (
        <div key={s} style={{
          fontFamily: T.mono,
          fontWeight: 900,
          fontSize: 80,
          color: c,
          textShadow: `0 0 30px ${c}60`,
        }}>
          {s}
        </div>
      ))}
    </div>

    <GlowText fontSize={48} color={T.gold}>PROOF NOTATION</GlowText>
    <div style={{
      fontFamily: T.font,
      fontSize: 24,
      color: T.textMuted,
      marginTop: 16,
    }}>
      Cambridge 9709 / AQA — Language of Proof
    </div>
    <div style={{
      fontFamily: T.mono,
      fontSize: 20,
      color: `${T.primary}80`,
      marginTop: 30,
    }}>
      2k · 2k+1 · LHS = RHS · √n
    </div>
  </AbsoluteFill>
);
