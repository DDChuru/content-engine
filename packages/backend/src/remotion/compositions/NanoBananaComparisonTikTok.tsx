import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

/* ─────────────────────────────────────────────────
   Nano Banana 1 vs 2 Comparison TikTok (9:16)
   ───────────────────────────────────────────────── */

const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f0f0ff',
  textMuted: '#8888aa',
  cyan: '#00d9ff',
  purple: '#a855f7',
  orange: '#ff8c00',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  mono: '"JetBrains Mono", "Fira Code", monospace',
  sans: '"Inter", system-ui, sans-serif',
};

// ── Segment timings (0.15s gaps) ──
const SEG = {
  hook:     { start: 0.0,    dur: 8.04 },
  intro:    { start: 8.19,   dur: 9.48 },
  versus:   { start: 17.82,  dur: 4.48 },
  prompt1:  { start: 22.45,  dur: 11.0 },
  prompt2:  { start: 33.60,  dur: 7.48 },
  prompt3:  { start: 41.23,  dur: 8.96 },
  verdict:  { start: 50.34,  dur: 7.24 },
  cta:      { start: 57.73,  dur: 4.96 },
};

const TOTAL_DURATION_S = 63;

export function getNanoBananaComparisonDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export interface NanoBananaComparisonTikTokProps {
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
  const translateY = interpolate(frame, [cf, cf + fadeDur * fps], [20, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return { opacity, translateY, isActive: frame >= cf };
}

// ── Background ───────────────────────────────────
const GlowBg: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, backgroundColor: T.bg }} />
      <div style={{
        position: 'absolute', top: '15%', left: '5%', width: 500, height: 500,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${T.orange}12 0%, transparent 70%)`,
        transform: `translate(${Math.sin(t * 0.2) * 20}px, ${Math.cos(t * 0.3) * 15}px)`,
        filter: 'blur(50px)',
      }} />
      <div style={{
        position: 'absolute', bottom: '20%', right: '0%', width: 400, height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${T.purple}12 0%, transparent 70%)`,
        transform: `translate(${Math.cos(t * 0.25) * 15}px, ${Math.sin(t * 0.35) * 20}px)`,
        filter: 'blur(50px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${T.surface}20 1px, transparent 1px), linear-gradient(90deg, ${T.surface}20 1px, transparent 1px)`,
        backgroundSize: '50px 50px', opacity: 0.2,
      }} />
    </AbsoluteFill>
  );
};

// ── Model Badge ──────────────────────────────────
const ModelBadge: React.FC<{
  label: string; version: string; color: string; side: 'left' | 'right';
}> = ({ label, version, color, side }) => (
  <div style={{
    position: 'absolute', top: 20,
    [side]: 20,
    padding: '8px 16px',
    borderRadius: 8,
    backgroundColor: `${color}20`,
    border: `2px solid ${color}60`,
    zIndex: 10,
  }}>
    <div style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 800, color, lineHeight: 1.2 }}>
      {label}
    </div>
    <div style={{ fontFamily: T.mono, fontSize: 13, color: T.textMuted, lineHeight: 1.2 }}>
      {version}
    </div>
  </div>
);

// ── Side-by-Side Image Comparison ────────────────
const SideBySide: React.FC<{
  nb1Src: string; nb2Src: string; promptLabel: string; showAt: number;
}> = ({ nb1Src, nb2Src, promptLabel, showAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerScale = spring({
    frame: Math.max(0, frame),
    fps,
    config: { damping: 16, stiffness: 140 },
    durationInFrames: 20,
  });

  const nb1Reveal = useCue(0.3, 0.5);
  const nb2Reveal = useCue(1.5, 0.5);

  const dividerGlow = 0.5 + Math.sin(frame * 0.1) * 0.5;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 30 }}>
      {/* Prompt label at top */}
      <div style={{
        position: 'absolute', top: 100,
        fontFamily: T.mono, fontSize: 22, color: T.cyan,
        textAlign: 'center', padding: '8px 20px',
        backgroundColor: `${T.cyan}10`, borderRadius: 8,
        border: `1px solid ${T.cyan}30`,
        maxWidth: 900,
      }}>
        {promptLabel}
      </div>

      <div style={{
        display: 'flex', gap: 0, transform: `scale(${containerScale})`,
        marginTop: 60,
      }}>
        {/* NB1 — Left */}
        <div style={{
          width: 490, position: 'relative',
          opacity: nb1Reveal.opacity,
          transform: `translateY(${nb1Reveal.translateY}px)`,
        }}>
          <ModelBadge label="NB1" version="3 Pro" color={T.orange} side="left" />
          <div style={{
            width: 490, height: 650, borderRadius: '12px 0 0 12px', overflow: 'hidden',
            border: `2px solid ${T.orange}40`, borderRight: 'none',
          }}>
            <Img src={staticFile(nb1Src)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 4, backgroundColor: T.text, zIndex: 10,
          boxShadow: `0 0 ${12 * dividerGlow}px ${T.text}80`,
        }} />

        {/* NB2 — Right */}
        <div style={{
          width: 490, position: 'relative',
          opacity: nb2Reveal.opacity,
          transform: `translateY(${nb2Reveal.translateY}px)`,
        }}>
          <ModelBadge label="NB2" version="3.1 Flash" color={T.purple} side="right" />
          <div style={{
            width: 490, height: 650, borderRadius: '0 12px 12px 0', overflow: 'hidden',
            border: `2px solid ${T.purple}40`, borderLeft: 'none',
          }}>
            <Img src={staticFile(nb2Src)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          </div>
        </div>
      </div>

      {/* VS badge in center */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 56, height: 56, borderRadius: '50%',
        backgroundColor: T.bg, border: `2px solid ${T.text}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.sans, fontSize: 18, fontWeight: 800, color: T.text,
        zIndex: 20,
        marginTop: 30,
      }}>
        VS
      </div>
    </AbsoluteFill>
  );
};

// ── Stacked (Top/Bottom) Image Comparison ────────
const TopBottom: React.FC<{
  nb1Src: string; nb2Src: string; promptLabel: string;
}> = ({ nb1Src, nb2Src, promptLabel }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerScale = spring({
    frame, fps, config: { damping: 16, stiffness: 140 }, durationInFrames: 20,
  });

  const nb1Reveal = useCue(0.3, 0.5);
  const nb2Reveal = useCue(1.5, 0.5);
  const dividerGlow = 0.5 + Math.sin(frame * 0.1) * 0.5;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 30 }}>
      {/* Prompt label at top */}
      <div style={{
        position: 'absolute', top: 80,
        fontFamily: T.mono, fontSize: 22, color: T.cyan,
        textAlign: 'center', padding: '8px 20px',
        backgroundColor: `${T.cyan}10`, borderRadius: 8,
        border: `1px solid ${T.cyan}30`, maxWidth: 900,
      }}>
        {promptLabel}
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', gap: 0,
        transform: `scale(${containerScale})`, marginTop: 40,
      }}>
        {/* NB1 — Top */}
        <div style={{
          width: 920, position: 'relative',
          opacity: nb1Reveal.opacity,
          transform: `translateY(${nb1Reveal.translateY}px)`,
        }}>
          <div style={{
            position: 'absolute', top: 12, left: 12, padding: '6px 14px',
            borderRadius: 8, backgroundColor: `${T.orange}20`,
            border: `2px solid ${T.orange}60`, zIndex: 10,
          }}>
            <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 800, color: T.orange }}>
              NB1
            </span>
            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.textMuted, marginLeft: 8 }}>
              3 Pro
            </span>
          </div>
          <div style={{
            width: 920, height: 420, borderRadius: '12px 12px 0 0', overflow: 'hidden',
            border: `2px solid ${T.orange}40`, borderBottom: 'none',
          }}>
            <Img src={staticFile(nb1Src)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: 4, backgroundColor: T.text, zIndex: 10,
          boxShadow: `0 0 ${12 * dividerGlow}px ${T.text}80`,
        }} />

        {/* NB2 — Bottom */}
        <div style={{
          width: 920, position: 'relative',
          opacity: nb2Reveal.opacity,
          transform: `translateY(${nb2Reveal.translateY}px)`,
        }}>
          <div style={{
            position: 'absolute', top: 12, left: 12, padding: '6px 14px',
            borderRadius: 8, backgroundColor: `${T.purple}20`,
            border: `2px solid ${T.purple}60`, zIndex: 10,
          }}>
            <span style={{ fontFamily: T.sans, fontSize: 18, fontWeight: 800, color: T.purple }}>
              NB2
            </span>
            <span style={{ fontFamily: T.mono, fontSize: 13, color: T.textMuted, marginLeft: 8 }}>
              3.1 Flash
            </span>
          </div>
          <div style={{
            width: 920, height: 420, borderRadius: '0 0 12px 12px', overflow: 'hidden',
            border: `2px solid ${T.purple}40`, borderTop: 'none',
          }}>
            <Img src={staticFile(nb2Src)} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          </div>
        </div>
      </div>

      {/* VS badge */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 56, height: 56, borderRadius: '50%',
        backgroundColor: T.bg, border: `2px solid ${T.text}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: T.sans, fontSize: 18, fontWeight: 800, color: T.text,
        zIndex: 20, marginTop: 20,
      }}>
        VS
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 1: HOOK ────────────────────────────────
const HookScene: React.FC = () => {
  const line1 = useCue(0.0, 0.5);
  const line2 = useCue(2.5, 0.5);
  const line3 = useCue(5.5, 0.5);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 48, fontWeight: 700, color: T.textMuted,
          lineHeight: 1.4, opacity: line1.opacity, transform: `translateY(${line1.translateY}px)`,
        }}>
          Remember when
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 56, fontWeight: 800, color: T.orange,
          lineHeight: 1.3, opacity: line2.opacity, transform: `translateY(${line2.translateY}px)`,
          textShadow: `0 0 20px ${T.orange}50`, marginTop: 12,
        }}>
          Nano Banana
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 44, fontWeight: 600, color: T.textMuted,
          lineHeight: 1.4, opacity: line2.opacity, transform: `translateY(${line2.translateY}px)`,
          marginTop: 8,
        }}>
          blew everyone's minds?
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 42, fontWeight: 600, color: T.cyan,
          opacity: line3.opacity, transform: `translateY(${line3.translateY}px)`,
          marginTop: 30,
        }}>
          We didn't have to wait long.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: INTRO NB2 ──────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 14, stiffness: 120 }, durationInFrames: 25 });
  const subtitle = useCue(1.5, 0.5);
  const features = useCue(4.0, 0.4);
  const verdict = useCue(6.5, 0.5);

  const glowPulse = 0.5 + Math.sin(frame * 0.08) * 0.5;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 72, fontWeight: 900, color: T.purple,
          transform: `scale(${titleScale})`,
          textShadow: `0 0 ${25 * glowPulse}px ${T.purple}60`,
        }}>
          Nano Banana 2
        </div>

        <div style={{
          fontFamily: T.mono, fontSize: 24, color: T.textMuted,
          marginTop: 16, opacity: subtitle.opacity,
          transform: `translateY(${subtitle.translateY}px)`,
        }}>
          Gemini 3.1 Flash Image Preview
        </div>

        {/* Feature pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center',
          marginTop: 40, opacity: features.opacity,
          transform: `translateY(${features.translateY}px)`,
        }}>
          {['Faster', 'Cheaper', '4K output', 'Search grounding', 'New ratios'].map((f, i) => (
            <div key={i} style={{
              padding: '10px 20px', borderRadius: 20,
              backgroundColor: `${T.purple}15`, border: `1px solid ${T.purple}40`,
              fontFamily: T.sans, fontSize: 22, fontWeight: 600, color: T.purple,
            }}>
              {f}
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: T.sans, fontSize: 40, fontWeight: 700, color: T.text,
          marginTop: 40, opacity: verdict.opacity,
          transform: `translateY(${verdict.translateY}px)`,
        }}>
          The quality is wild.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: VERSUS ──────────────────────────────
const VersusScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftSlide = spring({ frame, fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const rightSlide = spring({ frame: Math.max(0, frame - 8), fps, config: { damping: 14, stiffness: 100 }, durationInFrames: 20 });
  const vsScale = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 10, stiffness: 150 }, durationInFrames: 15 });

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
        <div style={{
          fontFamily: T.sans, fontSize: 64, fontWeight: 900, color: T.orange,
          textShadow: `0 0 20px ${T.orange}50`,
          transform: `translateX(${interpolate(leftSlide, [0, 1], [-200, 0])}px)`,
          opacity: leftSlide,
        }}>
          NB1
        </div>

        <div style={{
          fontFamily: T.sans, fontSize: 80, fontWeight: 900, color: T.text,
          transform: `scale(${vsScale})`,
        }}>
          vs
        </div>

        <div style={{
          fontFamily: T.sans, fontSize: 64, fontWeight: 900, color: T.purple,
          textShadow: `0 0 20px ${T.purple}50`,
          transform: `translateX(${interpolate(rightSlide, [0, 1], [200, 0])}px)`,
          opacity: rightSlide,
        }}>
          NB2
        </div>
      </div>

      <div style={{
        position: 'absolute', bottom: 500,
        fontFamily: T.sans, fontSize: 36, color: T.textMuted,
        opacity: interpolate(frame, [fps * 2, fps * 2.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        Same prompt. Both models. Let's go.
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 7: VERDICT ─────────────────────────────
const VerdictScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const line1 = useCue(0.0, 0.5);
  const line2 = useCue(2.0, 0.5);
  const line3 = useCue(4.5, 0.5);

  // Speed stats
  const statReveal = useCue(2.5, 0.4);

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 50 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: T.sans, fontSize: 48, fontWeight: 700, color: T.text,
          opacity: line1.opacity, transform: `translateY(${line1.translateY}px)`,
        }}>
          Flash is competing
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 48, fontWeight: 700, color: T.purple,
          opacity: line1.opacity, transform: `translateY(${line1.translateY}px)`,
          textShadow: `0 0 15px ${T.purple}50`,
        }}>
          with Pro now.
        </div>

        {/* Speed stats */}
        <div style={{
          display: 'flex', gap: 30, justifyContent: 'center', marginTop: 40,
          opacity: statReveal.opacity, transform: `translateY(${statReveal.translateY}px)`,
        }}>
          {[
            { label: 'Speed', value: 'Up to 37%', sub: 'faster', color: T.green },
            { label: 'Cost', value: 'Lower', sub: 'mainstream pricing', color: T.amber },
            { label: 'Quality', value: 'On par', sub: 'gap is gone', color: T.cyan },
          ].map((stat, i) => (
            <div key={i} style={{
              padding: '20px 24px', borderRadius: 12,
              backgroundColor: `${stat.color}10`, border: `1px solid ${stat.color}30`,
              textAlign: 'center', width: 260,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 16, color: T.textMuted }}>{stat.label}</div>
              <div style={{ fontFamily: T.sans, fontSize: 32, fontWeight: 800, color: stat.color, marginTop: 8 }}>{stat.value}</div>
              <div style={{ fontFamily: T.sans, fontSize: 18, color: T.textMuted, marginTop: 4 }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        <div style={{
          fontFamily: T.sans, fontSize: 36, fontWeight: 600, color: T.textMuted,
          marginTop: 40, opacity: line3.opacity, transform: `translateY(${line3.translateY}px)`,
        }}>
          The quality gap is basically gone.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 14, stiffness: 130 }, durationInFrames: 25 });
  const arrowBounce = Math.sin(frame * 0.15) * 8;

  return (
    <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{ textAlign: 'center', transform: `scale(${cardScale})` }}>
        <div style={{ fontFamily: T.sans, fontSize: 50, fontWeight: 700, color: T.text, marginBottom: 20 }}>
          Which looks better?
        </div>
        <div style={{
          display: 'flex', gap: 30, justifyContent: 'center', marginBottom: 30,
        }}>
          <div style={{
            padding: '16px 32px', borderRadius: 12,
            backgroundColor: `${T.orange}15`, border: `2px solid ${T.orange}50`,
            fontFamily: T.sans, fontSize: 36, fontWeight: 800, color: T.orange,
          }}>
            NB1
          </div>
          <div style={{
            fontFamily: T.sans, fontSize: 36, fontWeight: 600, color: T.textMuted,
            padding: '16px 0',
          }}>
            or
          </div>
          <div style={{
            padding: '16px 32px', borderRadius: 12,
            backgroundColor: `${T.purple}15`, border: `2px solid ${T.purple}50`,
            fontFamily: T.sans, fontSize: 36, fontWeight: 800, color: T.purple,
          }}>
            NB2
          </div>
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 38, color: T.textMuted, marginBottom: 20,
        }}>
          Drop a comment
        </div>
        <div style={{
          fontFamily: T.sans, fontSize: 32, color: T.cyan,
          transform: `translateY(${arrowBounce}px)`,
        }}>
          Follow for more AI tools
        </div>
        <div style={{
          marginTop: 30, fontSize: 48, color: T.cyan,
          transform: `translateY(${arrowBounce}px)`,
        }}>
          ↓
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Main Composition ─────────────────────────────
export const NanoBananaComparisonTikTok: React.FC<NanoBananaComparisonTikTokProps> = ({
  audioEnabled = true,
}) => {
  const { fps } = useVideoConfig();
  const s = (sec: number) => Math.round(sec * fps);

  return (
    <AbsoluteFill>
      <GlowBg />

      {/* Scene 1: Hook */}
      <Sequence from={s(SEG.hook.start)} durationInFrames={s(SEG.hook.dur + 0.15)}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Intro NB2 */}
      <Sequence from={s(SEG.intro.start)} durationInFrames={s(SEG.intro.dur + 0.15)}>
        <IntroScene />
      </Sequence>

      {/* Scene 3: Versus */}
      <Sequence from={s(SEG.versus.start)} durationInFrames={s(SEG.versus.dur + 0.15)}>
        <VersusScene />
      </Sequence>

      {/* Scene 4: Prompt 1 — Menu (text rendering) */}
      <Sequence from={s(SEG.prompt1.start)} durationInFrames={s(SEG.prompt1.dur + 0.15)}>
        <SideBySide
          nb1Src="images/nano-banana-comparison/prompt1-nb1-menu.png"
          nb2Src="images/nano-banana-comparison/prompt1-nb2-menu.png"
          promptLabel="Restaurant menu — text rendering"
        showAt={0}
        />
      </Sequence>

      {/* Scene 5: Prompt 2 — Coffee (photorealism) */}
      <Sequence from={s(SEG.prompt2.start)} durationInFrames={s(SEG.prompt2.dur + 0.15)}>
        <SideBySide
          nb1Src="images/nano-banana-comparison/prompt2-nb1-coffee.png"
          nb2Src="images/nano-banana-comparison/prompt2-nb2-coffee.png"
          promptLabel="Coffee shop — photorealism"
          showAt={0}
        />
      </Sequence>

      {/* Scene 6: Prompt 3 — Infographic (stacked for wide images) */}
      <Sequence from={s(SEG.prompt3.start)} durationInFrames={s(SEG.prompt3.dur + 0.15)}>
        <TopBottom
          nb1Src="images/nano-banana-comparison/prompt3-nb1-infographic.png"
          nb2Src="images/nano-banana-comparison/prompt3-nb2-infographic.png"
          promptLabel="Tech infographic — data visualization"
        />
      </Sequence>

      {/* Scene 7: Verdict */}
      <Sequence from={s(SEG.verdict.start)} durationInFrames={s(SEG.verdict.dur + 0.15)}>
        <VerdictScene />
      </Sequence>

      {/* Scene 8: CTA */}
      <Sequence from={s(SEG.cta.start)} durationInFrames={s(SEG.cta.dur + 1.0)}>
        <CTAScene />
      </Sequence>

      {/* Audio */}
      {audioEnabled && (
        <Audio
          src={staticFile('audio/nano-banana-comparison/full-narration.wav')}
          volume={1}
        />
      )}
    </AbsoluteFill>
  );
};
