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

/* ─────────────────────────────────────────────────
   Claude Code --continue TikTok (9:16, 1080×1920)
   ───────────────────────────────────────────────── */

// ── Theme ────────────────────────────────────────
const T = {
  bg: '#0a0a1a',
  surface: '#12122a',
  terminal: '#1a1a2e',
  termBorder: '#2d2d5e',
  text: '#e8e8ff',
  textMuted: '#7a7a9e',
  cyan: '#00d9ff',
  purple: '#a855f7',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  prompt: '#22c55e',
  command: '#e8e8ff',
  flag: '#00d9ff',
  mono: '"JetBrains Mono", "Fira Code", "Cascadia Code", monospace',
  sans: '"Inter", system-ui, -apple-system, sans-serif',
};

const FPS = 30;

// ── Segment timing v2 (chatty, 0.15s gaps) ──
const SEG = {
  hook:        { start: 0.0,    dur: 5.80 },
  setup:       { start: 5.95,   dur: 10.0 },
  sessionEnds: { start: 16.10,  dur: 3.64 },
  nextDay:     { start: 19.89,  dur: 0.96 },
  command:     { start: 21.00,  dur: 2.44 },
  payoff:      { start: 23.59,  dur: 7.68 },
  tagline:     { start: 31.42,  dur: 5.96 },
  cta:         { start: 37.53,  dur: 4.36 },
};

const TOTAL_DURATION_S = 42; // rounded up from 41.89

export function getClaudeCodeContinueDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

// ── Props ────────────────────────────────────────
export interface ClaudeCodeContinueTikTokProps {
  audioEnabled?: boolean;
}

// ── Animation hooks ──────────────────────────────
function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const translateY = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  return { opacity, translateY, isActive: frame >= cueFrame };
}

function useCueWindow(startS: number, endS: number, fadeIn = 0.4, fadeOut = 0.4) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sf = startS * fps;
  const ef = endS * fps;
  const inO = interpolate(frame, [sf, sf + fadeIn * fps], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const outO = interpolate(frame, [ef - fadeOut * fps, ef], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return { opacity: inO * outO, isActive: frame >= sf && frame <= ef };
}

function useTypewriter(text: string, startS: number, charsPerSecond = 20) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = (frame / fps) - startS;
  const chars = Math.min(Math.floor(Math.max(0, elapsed) * charsPerSecond), text.length);
  const done = chars >= text.length;
  return { displayText: text.slice(0, chars), done, chars };
}

// ── Reusable components ──────────────────────────

const Cursor: React.FC<{ visible?: boolean }> = ({ visible = true }) => {
  const frame = useCurrentFrame();
  const blink = Math.sin(frame * 0.3) > 0 ? 1 : 0;
  if (!visible) return null;
  return (
    <span
      style={{
        display: 'inline-block',
        width: 12,
        height: 28,
        backgroundColor: T.cyan,
        opacity: blink,
        marginLeft: 2,
        verticalAlign: 'middle',
        boxShadow: `0 0 8px ${T.cyan}`,
      }}
    />
  );
};

const TerminalChrome: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  opacity?: number;
  scale?: number;
}> = ({ children, style, opacity = 1, scale = 1 }) => (
  <div
    style={{
      width: 960,
      borderRadius: 16,
      overflow: 'hidden',
      border: `1px solid ${T.termBorder}`,
      backgroundColor: T.terminal,
      boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,217,255,0.08)`,
      opacity,
      transform: `scale(${scale})`,
      ...style,
    }}
  >
    {/* Title bar */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px',
        backgroundColor: '#0d0d22',
        borderBottom: `1px solid ${T.termBorder}`,
      }}
    >
      <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
      <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#febc2e' }} />
      <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: '#28c840' }} />
      <span
        style={{
          marginLeft: 12,
          fontFamily: T.mono,
          fontSize: 16,
          color: T.textMuted,
        }}
      >
        Terminal — bash
      </span>
    </div>
    {/* Content */}
    <div style={{ padding: '20px 24px', minHeight: 200 }}>{children}</div>
  </div>
);

const TerminalLine: React.FC<{
  prompt?: string;
  command: string;
  startS: number;
  speed?: number;
  flagHighlight?: string;
}> = ({ prompt = '~/my-project $', command, startS, speed = 18, flagHighlight }) => {
  const { displayText, done } = useTypewriter(command, startS, speed);

  const renderCommand = (text: string) => {
    if (!flagHighlight || !text.includes(flagHighlight)) {
      return <span style={{ color: T.command }}>{text}</span>;
    }
    const idx = text.indexOf(flagHighlight);
    return (
      <>
        <span style={{ color: T.command }}>{text.slice(0, idx)}</span>
        <span
          style={{
            color: T.cyan,
            textShadow: `0 0 12px ${T.cyan}80`,
            fontWeight: 700,
          }}
        >
          {text.slice(idx, idx + flagHighlight.length)}
        </span>
        <span style={{ color: T.command }}>{text.slice(idx + flagHighlight.length)}</span>
      </>
    );
  };

  return (
    <div
      style={{
        fontFamily: T.mono,
        fontSize: 24,
        lineHeight: 1.6,
        whiteSpace: 'pre',
      }}
    >
      <span style={{ color: T.prompt }}>{prompt} </span>
      {renderCommand(displayText)}
      <Cursor visible={!done} />
    </div>
  );
};

const OutputLine: React.FC<{
  text: string;
  color?: string;
  startS: number;
  fadeDuration?: number;
}> = ({ text, color = T.textMuted, startS, fadeDuration = 0.3 }) => {
  const { opacity, translateY } = useCue(startS, fadeDuration);
  return (
    <div
      style={{
        fontFamily: T.mono,
        fontSize: 22,
        lineHeight: 1.6,
        color,
        opacity,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {text}
    </div>
  );
};

// ── Glow background effect ───────────────────────
const GlowBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill>
      {/* Base dark */}
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />

      {/* Floating purple orb */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.purple}15 0%, transparent 70%)`,
          transform: `translate(${Math.sin(t * 0.3) * 30}px, ${Math.cos(t * 0.4) * 20}px)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Floating cyan orb */}
      <div
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '5%',
          width: 350,
          height: 350,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.cyan}12 0%, transparent 70%)`,
          transform: `translate(${Math.cos(t * 0.25) * 25}px, ${Math.sin(t * 0.35) * 15}px)`,
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(${T.termBorder}15 1px, transparent 1px),
            linear-gradient(90deg, ${T.termBorder}15 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          opacity: 0.3,
        }}
      />
    </AbsoluteFill>
  );
};

// ── Scene 1: HOOK ────────────────────────────────
// "Here's one Claude Code feature we take for granted, but it's pretty powerful."
const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = useCue(0.0, 0.4);
  const line2 = useCue(1.8, 0.4);
  const line3 = useCue(3.5, 0.5);

  const glowPulse = 0.6 + Math.sin(frame * 0.1) * 0.4;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 48,
            fontWeight: 600,
            color: T.textMuted,
            lineHeight: 1.4,
            opacity: line1.opacity,
            transform: `translateY(${line1.translateY}px)`,
          }}
        >
          Here's one Claude Code feature
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 48,
            fontWeight: 600,
            color: T.textMuted,
            lineHeight: 1.4,
            opacity: line2.opacity,
            transform: `translateY(${line2.translateY}px)`,
            marginTop: 8,
          }}
        >
          we all take for granted...
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 60,
            fontWeight: 800,
            color: T.cyan,
            marginTop: 24,
            opacity: line3.opacity,
            transform: `translateY(${line3.translateY}px)`,
            textShadow: `0 0 ${25 * glowPulse}px ${T.cyan}60`,
          }}
        >
          but it's pretty powerful.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: SETUP ───────────────────────────────
// "You're in your project, fire up Claude, ask it to refactor your auth module. Beautiful."
const SetupScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localS = frame / fps;

  // Terminal slides in
  const terminalY = interpolate(frame, [0, fps * 0.4], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const terminalOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `translateY(${terminalY}px)`, opacity: terminalOpacity }}>
        <TerminalChrome>
          {/* Line 1: cd */}
          <TerminalLine
            command="cd ~/my-project"
            startS={0.2}
            speed={25}
          />

          {/* Line 2: claude */}
          {localS > 1.2 && (
            <div style={{ marginTop: 8 }}>
              <TerminalLine
                prompt="~/my-project $"
                command="claude"
                startS={1.4}
                speed={16}
              />
            </div>
          )}

          {/* Claude loading */}
          {localS > 2.2 && (
            <div style={{ marginTop: 20 }}>
              <OutputLine
                text="╭─────────────────────────────────────╮"
                color={T.purple}
                startS={2.2}
              />
              <OutputLine
                text="│  Claude Code  ●  Opus 4.6           │"
                color={T.purple}
                startS={2.4}
              />
              <OutputLine
                text="╰─────────────────────────────────────╯"
                color={T.purple}
                startS={2.6}
              />
            </div>
          )}

          {/* User message */}
          {localS > 3.5 && (
            <div style={{ marginTop: 16 }}>
              <OutputLine
                text="> Refactor the auth module"
                color={T.cyan}
                startS={3.5}
                fadeDuration={0.3}
              />
            </div>
          )}

          {/* Claude response */}
          {localS > 5.0 && (
            <div style={{ marginTop: 12 }}>
              <OutputLine
                text="  Splitting auth into session, middleware"
                color={T.text}
                startS={5.0}
              />
              <OutputLine
                text="  and route guards..."
                color={T.text}
                startS={5.4}
              />
            </div>
          )}

          {/* Check marks — "it does the whole thing, beautiful" */}
          {localS > 6.5 && (
            <div style={{ marginTop: 12 }}>
              <OutputLine
                text="  ✓ Created auth/session.ts"
                color={T.green}
                startS={6.5}
              />
              <OutputLine
                text="  ✓ Created auth/middleware.ts"
                color={T.green}
                startS={7.0}
              />
              <OutputLine
                text="  ✓ Created auth/guards.ts"
                color={T.green}
                startS={7.5}
              />
              <OutputLine
                text="  ✓ Updated routes/index.ts"
                color={T.green}
                startS={8.0}
              />
              <OutputLine
                text="  ✓ All tests passing"
                color={T.green}
                startS={8.5}
              />
            </div>
          )}
        </TerminalChrome>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: SESSION ENDS ────────────────────────
// "Session ends. Terminal closed. You go home."
const SessionEndsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Terminal shrinks and fades
  const scale = interpolate(frame, [0, fps * 1.5], [1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [fps * 0.5, fps * 1.8], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "You go home" text
  const textFade = interpolate(frame, [fps * 2.0, fps * 2.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <TerminalChrome opacity={opacity} scale={scale}>
        <div style={{ fontFamily: T.mono, fontSize: 24, color: T.textMuted }}>
          <div><span style={{ color: T.prompt }}>~/my-project $ </span>claude</div>
          <div style={{ marginTop: 8, color: T.text }}>
            &gt; Help me refactor the auth module
          </div>
          <div style={{ marginTop: 8 }}>
            <span style={{ color: T.green }}>✓</span> Created auth/session.ts
          </div>
          <div>
            <span style={{ color: T.green }}>✓</span> Created auth/middleware.ts
          </div>
        </div>
      </TerminalChrome>

      {/* Overlay text */}
      <div
        style={{
          position: 'absolute',
          bottom: 500,
          opacity: textFade,
          fontFamily: T.sans,
          fontSize: 48,
          fontWeight: 600,
          color: T.textMuted,
          letterSpacing: 2,
        }}
      >
        session closed
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: NEXT DAY ────────────────────────────
const NextDayScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div
        style={{
          fontFamily: T.sans,
          fontSize: 80,
          fontWeight: 800,
          color: T.text,
          transform: `scale(${scale})`,
          textShadow: `0 0 30px ${T.purple}50`,
        }}
      >
        Next day.
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: THE COMMAND ─────────────────────────
// "claude --continue"
const CommandScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const terminalOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity: terminalOpacity }}>
        <TerminalChrome>
          <TerminalLine
            prompt="~/my-project $"
            command="claude --continue"
            startS={0.3}
            speed={14}
            flagHighlight="--continue"
          />
        </TerminalChrome>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 6: PAYOFF ──────────────────────────────
// "Same context. Same conversation."
const PayoffScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localS = frame / fps;

  // Terminal appears with spring
  const termScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 140 },
    durationInFrames: 20,
  });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ transform: `scale(${termScale})` }}>
        <TerminalChrome>
          {/* Header — Claude resumed */}
          <OutputLine
            text="╭─────────────────────────────────────╮"
            color={T.purple}
            startS={0.0}
            fadeDuration={0.2}
          />
          <OutputLine
            text="│  Claude Code  ●  Opus 4.6           │"
            color={T.purple}
            startS={0.1}
            fadeDuration={0.2}
          />
          <OutputLine
            text="│  ↳ Resuming previous conversation   │"
            color={T.cyan}
            startS={0.3}
            fadeDuration={0.3}
          />
          <OutputLine
            text="╰─────────────────────────────────────╯"
            color={T.purple}
            startS={0.4}
            fadeDuration={0.2}
          />

          {/* Previous context restored */}
          {localS > 1.0 && (
            <div style={{ marginTop: 16 }}>
              <OutputLine
                text="  Previous context restored:"
                color={T.textMuted}
                startS={1.0}
              />
            </div>
          )}

          {localS > 1.5 && (
            <div style={{ marginTop: 8 }}>
              <OutputLine
                text="  ✓ auth/session.ts"
                color={T.green}
                startS={1.5}
              />
              <OutputLine
                text="  ✓ auth/middleware.ts"
                color={T.green}
                startS={1.8}
              />
              <OutputLine
                text="  ✓ routes/index.ts"
                color={T.green}
                startS={2.1}
              />
            </div>
          )}

          {/* Claude continues naturally */}
          {localS > 3.0 && (
            <div style={{ marginTop: 16 }}>
              <OutputLine
                text="> What's next?"
                color={T.cyan}
                startS={3.0}
              />
            </div>
          )}

          {localS > 3.8 && (
            <div style={{ marginTop: 12 }}>
              <OutputLine
                text="  Now let's add JWT validation to"
                color={T.text}
                startS={3.8}
              />
              <OutputLine
                text="  the middleware we created yesterday..."
                color={T.text}
                startS={4.1}
              />
            </div>
          )}

          {/* The magic — it knows "yesterday" */}
          {localS > 5.0 && (
            <div style={{ marginTop: 12 }}>
              <OutputLine
                text="  ✓ Updated auth/middleware.ts"
                color={T.green}
                startS={5.0}
              />
              <OutputLine
                text="  ✓ Added tests/auth.test.ts"
                color={T.green}
                startS={5.4}
              />
            </div>
          )}
        </TerminalChrome>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: TAGLINE ─────────────────────────────
// "No re-explaining. No copy pasting. Just --continue."
const TaglineScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = useCue(0.0, 0.4);
  const line2 = useCue(1.5, 0.4);
  const line3 = useCue(3.0, 0.5);

  const glowPulse = 0.5 + Math.sin(frame * 0.08) * 0.5;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 56,
            fontWeight: 700,
            color: T.textMuted,
            opacity: line1.opacity,
            transform: `translateY(${line1.translateY}px)`,
            marginBottom: 24,
            textDecoration: 'line-through',
            textDecorationColor: T.red,
          }}
        >
          No re-explaining.
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 56,
            fontWeight: 700,
            color: T.textMuted,
            opacity: line2.opacity,
            transform: `translateY(${line2.translateY}px)`,
            marginBottom: 40,
            textDecoration: 'line-through',
            textDecorationColor: T.red,
          }}
        >
          No copy-pasting.
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 68,
            fontWeight: 800,
            color: T.cyan,
            opacity: line3.opacity,
            transform: `translateY(${line3.translateY}px)`,
            textShadow: `0 0 ${25 * glowPulse}px ${T.cyan}80`,
          }}
        >
          Just <span style={{ fontFamily: T.mono }}>--continue</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 130 },
    durationInFrames: 25,
  });

  const commentPulse = spring({
    frame: Math.max(0, frame - fps * 1.5),
    fps,
    config: { damping: 10, stiffness: 100 },
    durationInFrames: 20,
  });

  const arrowBounce = Math.sin(frame * 0.15) * 8;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 60,
      }}
    >
      <div
        style={{
          textAlign: 'center',
          transform: `scale(${cardScale})`,
        }}
      >
        {/* Comment icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 30,
            transform: `scale(${commentPulse}) translateY(${arrowBounce}px)`,
          }}
        >
          💬
        </div>

        {/* CTA text */}
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 46,
            fontWeight: 700,
            color: T.text,
            lineHeight: 1.4,
            marginBottom: 20,
          }}
        >
          Drop a comment
        </div>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 52,
            fontWeight: 800,
            color: T.cyan,
            textShadow: `0 0 20px ${T.cyan}60`,
            marginBottom: 30,
            padding: '8px 24px',
            border: `2px solid ${T.cyan}50`,
            borderRadius: 12,
            display: 'inline-block',
          }}
        >
          Claude Code
        </div>
        <div
          style={{
            fontFamily: T.sans,
            fontSize: 40,
            fontWeight: 500,
            color: T.textMuted,
            lineHeight: 1.5,
          }}
        >
          for a chance to win
          <br />
          <span style={{ color: T.amber, fontWeight: 700 }}>one week free trial</span>
        </div>

        {/* Down arrow pointing to comment box */}
        <div
          style={{
            marginTop: 40,
            fontSize: 48,
            color: T.cyan,
            transform: `translateY(${arrowBounce}px)`,
          }}
        >
          ↓
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ─────────────────────────────
export const ClaudeCodeContinueTikTok: React.FC<ClaudeCodeContinueTikTokProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const s = (seconds: number) => Math.round(seconds * fps);

  return (
    <AbsoluteFill>
      <GlowBg />

      {/* Scene 1: Hook */}
      <Sequence from={s(SEG.hook.start)} durationInFrames={s(SEG.hook.dur + 0.4)}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Setup — terminal demo */}
      <Sequence from={s(SEG.setup.start)} durationInFrames={s(SEG.setup.dur + 0.4)}>
        <SetupScene />
      </Sequence>

      {/* Scene 3: Session ends */}
      <Sequence from={s(SEG.sessionEnds.start)} durationInFrames={s(SEG.sessionEnds.dur + 0.4)}>
        <SessionEndsScene />
      </Sequence>

      {/* Scene 4: Next day */}
      <Sequence from={s(SEG.nextDay.start)} durationInFrames={s(SEG.nextDay.dur + 0.8)}>
        <NextDayScene />
      </Sequence>

      {/* Scene 5: The command */}
      <Sequence from={s(SEG.command.start)} durationInFrames={s(SEG.command.dur + 0.4)}>
        <CommandScene />
      </Sequence>

      {/* Scene 6: Payoff — context restored */}
      <Sequence from={s(SEG.payoff.start)} durationInFrames={s(SEG.payoff.dur + 0.4)}>
        <PayoffScene />
      </Sequence>

      {/* Scene 7: Tagline */}
      <Sequence from={s(SEG.tagline.start)} durationInFrames={s(SEG.tagline.dur + 0.4)}>
        <TaglineScene />
      </Sequence>

      {/* Scene 8: CTA */}
      <Sequence from={s(SEG.cta.start)} durationInFrames={s(SEG.cta.dur + 1.0)}>
        <CTAScene />
      </Sequence>

      {/* Audio */}
      {audioEnabled && (
        <Audio
          src={staticFile('audio/claude-code-tiktok/full-narration-v2.wav')}
          volume={1}
        />
      )}
    </AbsoluteFill>
  );
};
