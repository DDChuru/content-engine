import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/* ─────────────────────────────────────────────────
   Differentiation from First Principles TikTok
   9:16, 1080×1920, KaTeX-rendered math
   ───────────────────────────────────────────────── */

const T = {
  bg: '#0a0a14',
  surface: '#111128',
  text: '#f0f0ff',
  textMuted: '#7a7aaa',
  cyan: '#00d9ff',
  purple: '#a855f7',
  orange: '#ff8c00',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
  mono: '"JetBrains Mono", "Fira Code", monospace',
  sans: '"Inter", system-ui, sans-serif',
};

// ── Segment timing (0.3s gaps for math pacing) ──
const SEG = {
  hook:       { start: 0.0,    dur: 6.76 },
  definition: { start: 7.06,   dur: 9.88 },
  function:   { start: 17.24,  dur: 3.04 },
  substitute: { start: 20.58,  dur: 6.44 },
  expand:     { start: 27.32,  dur: 9.04 },
  cancel:     { start: 36.66,  dur: 6.44 },
  factor:     { start: 43.40,  dur: 8.88 },
  limit:      { start: 52.58,  dur: 7.88 },
  closer:     { start: 60.76,  dur: 8.0  },
};

const TOTAL_DURATION_S = 69;

export function getDifferentiationDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export interface DifferentiationTikTokProps {
  audioEnabled?: boolean;
}

// ── Hooks ────────────────────────────────────────
function useCue(cueS: number, fadeDur = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cf = cueS * fps;
  const opacity = interpolate(frame, [cf, cf + fadeDur * fps], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const translateY = interpolate(frame, [cf, cf + fadeDur * fps], [15, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return { opacity, translateY, isActive: frame >= cf };
}

// ── KaTeX Math Component ─────────────────────────
// NOTE: KaTeX renderToString with hardcoded LaTeX strings only (no user input).
// This is safe as the LaTeX is defined in source code, not from external input.
const katexCSS = `
  .katex { font-size: 1em; }
  .katex .mord, .katex .mop, .katex .mrel, .katex .mopen, .katex .mclose,
  .katex .mpunct, .katex .mbin, .katex .minner { color: inherit; }
`;

const MathTeX: React.FC<{
  tex: string;
  fontSize?: number;
  color?: string;
  display?: boolean;
  style?: React.CSSProperties;
}> = ({ tex, fontSize = 48, color = T.text, display = true, style }) => {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: display,
    output: 'html',
    // KaTeX sanitizes its own output — only valid math markup is produced
    strict: false,
  });

  return (
    <div style={{ fontSize, color, lineHeight: 1.6, ...style }}>
      <style>{katexCSS}</style>
      {/* Safe: html is from katex.renderToString with hardcoded LaTeX, not user input */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

// Animated math line — fades in at cue time
const MathStep: React.FC<{
  tex: string;
  cueS: number;
  fontSize?: number;
  color?: string;
  label?: string;
  labelColor?: string;
}> = ({ tex, cueS, fontSize = 44, color = T.text, label, labelColor = T.textMuted }) => {
  const { opacity, translateY } = useCue(cueS, 0.6);
  return (
    <div style={{ opacity, transform: `translateY(${translateY}px)`, marginBottom: 16 }}>
      {label && (
        <div style={{
          fontFamily: T.sans, fontSize: 20, color: labelColor,
          marginBottom: 6, fontWeight: 600,
        }}>
          {label}
        </div>
      )}
      <MathTeX tex={tex} fontSize={fontSize} color={color} />
    </div>
  );
};

// ── Background ───────────────────────────────────
const MathBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${15 + i * 10}%`, left: `${10 + (i * 17) % 80}%`,
          width: 3, height: 3, borderRadius: '50%',
          backgroundColor: `${T.text}08`,
          transform: `translate(${Math.sin(t * 0.2 + i) * 10}px, ${Math.cos(t * 0.15 + i * 2) * 8}px)`,
        }} />
      ))}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: `linear-gradient(to top, ${T.blue}08, transparent)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: `linear-gradient(${T.text}20 1px, transparent 1px), linear-gradient(90deg, ${T.text}20 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
    </AbsoluteFill>
  );
};

// ── Step indicator ───────────────────────────────
const StepBadge: React.FC<{ step: number; total: number; color?: string }> = ({
  step, total, color = T.cyan
}) => (
  <div style={{
    position: 'absolute', top: 70, right: 40,
    fontFamily: T.mono, fontSize: 20, color,
    padding: '6px 14px', borderRadius: 8,
    backgroundColor: `${color}10`, border: `1px solid ${color}30`,
  }}>
    {step}/{total}
  </div>
);

// ── Scene 1: HOOK ────────────────────────────────
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const line1 = useCue(0.0, 0.6);
  const line2 = useCue(2.0, 0.6);
  const formula = useCue(4.0, 0.8);
  const glowPulse = 0.5 + Math.sin(frame * 0.08) * 0.5;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 46, fontWeight: 600, color: T.textMuted,
          opacity: line1.opacity, transform: `translateY(${line1.translateY}px)`, lineHeight: 1.4,
        }}>
          The most beautiful proof
          <br />in all of calculus.
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 56, fontWeight: 800, color: T.cyan,
          marginTop: 30, opacity: line2.opacity, transform: `translateY(${line2.translateY}px)`,
          textShadow: `0 0 ${20 * glowPulse}px ${T.cyan}60`,
        }}>
          Differentiation
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 40, fontWeight: 600, color: T.text,
          opacity: line2.opacity, transform: `translateY(${line2.translateY}px)`,
        }}>
          from first principles
        </div>
        <div style={{ marginTop: 50, opacity: formula.opacity, transform: `translateY(${formula.translateY}px)` }}>
          <MathTeX tex="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" fontSize={42} color={T.text} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: DEFINITION ──────────────────────────
const DefinitionScene: React.FC = () => {
  const title = useCue(0.0, 0.4);
  const formula = useCue(1.5, 0.8);
  const b1 = useCue(4.5, 0.5);
  const b2 = useCue(6.0, 0.5);
  const b3 = useCue(7.5, 0.5);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <StepBadge step={1} total={6} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 32, fontWeight: 700, color: T.cyan,
          opacity: title.opacity, marginBottom: 40, letterSpacing: 2, textTransform: 'uppercase',
        }}>
          The Definition
        </div>
        <div style={{
          opacity: formula.opacity, transform: `translateY(${formula.translateY}px)`,
          padding: '30px 40px', borderRadius: 16,
          backgroundColor: `${T.surface}cc`, border: `1px solid ${T.cyan}30`,
        }}>
          <MathTeX tex="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" fontSize={46} color={T.text} />
        </div>
        <div style={{ marginTop: 40, textAlign: 'left', paddingLeft: 60 }}>
          <div style={{
            fontFamily: T.sans, fontSize: 26, color: T.amber,
            opacity: b1.opacity, transform: `translateY(${b1.translateY}px)`, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <MathTeX tex="f(x+h)" fontSize={28} color={T.amber} display={false} />
            <span style={{ color: T.textMuted }}>= tiny step ahead</span>
          </div>
          <div style={{
            fontFamily: T.sans, fontSize: 26, color: T.purple,
            opacity: b2.opacity, transform: `translateY(${b2.translateY}px)`, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <MathTeX tex="f(x)" fontSize={28} color={T.purple} display={false} />
            <span style={{ color: T.textMuted }}>= where we are</span>
          </div>
          <div style={{
            fontFamily: T.sans, fontSize: 26, color: T.green,
            opacity: b3.opacity, transform: `translateY(${b3.translateY}px)`,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <MathTeX tex="h" fontSize={28} color={T.green} display={false} />
            <span style={{ color: T.textMuted }}>= that tiny step (approaches 0)</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: PICK FUNCTION ───────────────────────
const FunctionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const title = useCue(0.0, 0.3);
  const func = useCue(0.5, 0.6);
  const funcScale = spring({
    frame: Math.max(0, frame - 0.5 * fps),
    fps, config: { damping: 12, stiffness: 130 }, durationInFrames: 20,
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <StepBadge step={2} total={6} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 30, color: T.textMuted,
          opacity: title.opacity, marginBottom: 30,
        }}>
          Let's try it with
        </div>
        <div style={{
          opacity: func.opacity, transform: `scale(${funcScale})`,
          padding: '24px 50px', borderRadius: 16,
          backgroundColor: `${T.orange}10`, border: `2px solid ${T.orange}40`,
        }}>
          <MathTeX tex="f(x) = x^2" fontSize={64} color={T.orange} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: SUBSTITUTE ──────────────────────────
const SubstituteScene: React.FC = () => {
  const arrow = useCue(2.5, 0.4);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <StepBadge step={3} total={6} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 24, color: T.cyan, marginBottom: 30,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          Substitute
        </div>
        <MathStep tex="\lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" cueS={0.5} fontSize={38} color={T.textMuted} />
        <div style={{ opacity: arrow.opacity, fontSize: 40, color: T.cyan, margin: '16px 0' }}>&#8595;</div>
        <MathStep tex="= \lim_{h \to 0} \frac{(x+h)^2 - x^2}{h}" cueS={3.0} fontSize={44} color={T.text} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: EXPAND ──────────────────────────────
const ExpandScene: React.FC = () => {
  const arrow1 = useCue(3.0, 0.3);
  const arrow2 = useCue(6.0, 0.3);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <StepBadge step={4} total={6} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 24, color: T.cyan, marginBottom: 24,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          Expand
        </div>
        <MathStep tex="\frac{(x+h)^2 - x^2}{h}" cueS={0.5} fontSize={42} color={T.textMuted} />
        <div style={{ opacity: arrow1.opacity, fontSize: 36, color: T.cyan, margin: '8px 0' }}>&#8595;</div>
        <MathStep tex="\frac{x^2 + 2xh + h^2 - x^2}{h}" cueS={3.5} fontSize={42} color={T.text} />
        <div style={{ opacity: arrow2.opacity, fontSize: 36, color: T.cyan, margin: '8px 0' }}>&#8595;</div>
        <MathStep
          tex="\frac{\cancel{x^2} + 2xh + h^2 - \cancel{x^2}}{h}"
          cueS={6.5} fontSize={42} color={T.amber}
          label="the x² terms cancel!" labelColor={T.amber}
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: SIMPLIFY ────────────────────────────
const CancelScene: React.FC = () => {
  const arrow = useCue(2.5, 0.3);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <StepBadge step={5} total={6} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 24, color: T.cyan, marginBottom: 30,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          Simplify
        </div>
        <MathStep tex="\frac{2xh + h^2}{h}" cueS={0.3} fontSize={48} color={T.text} />
        <div style={{ opacity: arrow.opacity, fontSize: 40, color: T.cyan, margin: '16px 0' }}>&#8595;</div>
        <MathStep tex="\frac{h(2x + h)}{h}" cueS={3.0} fontSize={48} color={T.text} label="Factor out h" labelColor={T.green} />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: CANCEL h ────────────────────────────
const FactorScene: React.FC = () => {
  const arrow = useCue(3.0, 0.3);
  const highlight = useCue(5.5, 0.5);
  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <StepBadge step={5} total={6} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 24, color: T.cyan, marginBottom: 30,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          Cancel
        </div>
        <MathStep
          tex="\frac{\cancel{h}(2x + h)}{\cancel{h}}"
          cueS={0.3} fontSize={52} color={T.amber}
          label="The h's cancel!" labelColor={T.amber}
        />
        <div style={{ opacity: arrow.opacity, fontSize: 40, color: T.cyan, margin: '16px 0' }}>&#8595;</div>
        <MathStep tex="\lim_{h \to 0} (2x + h)" cueS={3.5} fontSize={52} color={T.text} />
        <div style={{
          marginTop: 30, fontFamily: T.sans, fontSize: 28, color: T.green, fontWeight: 600,
          opacity: highlight.opacity, transform: `translateY(${highlight.translateY}px)`,
        }}>
          Almost there...
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: TAKE THE LIMIT ──────────────────────
const LimitScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const arrow = useCue(2.5, 0.3);
  const result = useCue(3.5, 0.8);
  const resultScale = spring({
    frame: Math.max(0, frame - 3.5 * fps),
    fps, config: { damping: 10, stiffness: 120 }, durationInFrames: 25,
  });
  const glowPulse = 0.5 + Math.sin(frame * 0.08) * 0.5;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <StepBadge step={6} total={6} color={T.green} />
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 24, color: T.green, marginBottom: 30,
          letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700,
        }}>
          Take the Limit
        </div>
        <MathStep tex="\lim_{h \to 0} (2x + h) = 2x + 0" cueS={0.3} fontSize={44} color={T.textMuted} />
        <div style={{ opacity: arrow.opacity, fontSize: 40, color: T.green, margin: '16px 0' }}>&#8595;</div>
        <div style={{
          opacity: result.opacity, transform: `scale(${resultScale})`,
          padding: '30px 50px', borderRadius: 20,
          backgroundColor: `${T.green}10`, border: `2px solid ${T.green}50`,
          boxShadow: `0 0 ${30 * glowPulse}px ${T.green}20`,
        }}>
          <MathTeX tex="f'(x) = 2x" fontSize={72} color={T.green} />
        </div>
        <div style={{
          marginTop: 30, fontFamily: T.sans, fontSize: 30, color: T.text, fontWeight: 600,
          opacity: result.opacity,
        }}>
          The derivative of x&#178; is 2x
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 9: CLOSER ──────────────────────────────
const CloserScene: React.FC = () => {
  const frame = useCurrentFrame();
  const line1 = useCue(0.0, 0.5);
  const line2 = useCue(2.0, 0.5);
  const line3 = useCue(4.5, 0.5);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 42, fontWeight: 600, color: T.textMuted,
          opacity: line1.opacity, transform: `translateY(${line1.translateY}px)`, lineHeight: 1.5,
        }}>
          From the definition,
          <br />to the answer.
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 42, fontWeight: 700, color: T.text,
          marginTop: 30, opacity: line2.opacity, transform: `translateY(${line2.translateY}px)`,
        }}>
          No shortcuts. Pure maths.
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 36, fontWeight: 600, color: T.cyan,
          marginTop: 40, opacity: line3.opacity, transform: `translateY(${line3.translateY}px)`,
        }}>
          Follow for more
        </div>
        <div style={{
          marginTop: 10, fontSize: 32, color: T.cyan, opacity: line3.opacity,
          transform: `translateY(${Math.sin(frame * 0.15) * 6}px)`,
        }}>
          &#8595;
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ─────────────────────────────
export const DifferentiationTikTok: React.FC<DifferentiationTikTokProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);

  return (
    <AbsoluteFill>
      <MathBg />
      <Sequence from={s(SEG.hook.start)} durationInFrames={s(SEG.hook.dur + 0.3)}><HookScene /></Sequence>
      <Sequence from={s(SEG.definition.start)} durationInFrames={s(SEG.definition.dur + 0.3)}><DefinitionScene /></Sequence>
      <Sequence from={s(SEG.function.start)} durationInFrames={s(SEG.function.dur + 0.3)}><FunctionScene /></Sequence>
      <Sequence from={s(SEG.substitute.start)} durationInFrames={s(SEG.substitute.dur + 0.3)}><SubstituteScene /></Sequence>
      <Sequence from={s(SEG.expand.start)} durationInFrames={s(SEG.expand.dur + 0.3)}><ExpandScene /></Sequence>
      <Sequence from={s(SEG.cancel.start)} durationInFrames={s(SEG.cancel.dur + 0.3)}><CancelScene /></Sequence>
      <Sequence from={s(SEG.factor.start)} durationInFrames={s(SEG.factor.dur + 0.3)}><FactorScene /></Sequence>
      <Sequence from={s(SEG.limit.start)} durationInFrames={s(SEG.limit.dur + 0.3)}><LimitScene /></Sequence>
      <Sequence from={s(SEG.closer.start)} durationInFrames={s(SEG.closer.dur + 1.0)}><CloserScene /></Sequence>
      {audioEnabled && (
        <Audio src={staticFile('audio/differentiation-tiktok/full-narration.wav')} volume={1} />
      )}
    </AbsoluteFill>
  );
};
