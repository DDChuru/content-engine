/**
 * Ecowize Digital Platform Pitch — v10 (Streamlined 15-Slide Storyboard)
 *
 * Narrative Arc: Hook → Problem → Impact → Solution → Proof → Partnership → CTA
 *
 * Key changes from v8 (22 slides):
 * - Merged slides 6-8 (visibility/accountability) into single Problem slide
 * - Moved pain points to opening (slides 2-5)
 * - Combined "How We Work" + "Why Us" into single Partnership slide
 * - Cut redundant slides, focused on executive impact
 *
 * Animation features:
 * - Ken Burns on images (slow zoom/pan)
 * - Typewriter for key statements
 * - Animated stat counters
 * - Spring-animated bars & comparison columns
 * - Word highlighting for emphasis
 * - Staggered reveals with spring physics
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Easing,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { ecowizeCorporateTheme as theme } from '../components/webslides/themes';
import { withOpacity } from '../components/webslides/themes';

const FPS = 30;
const TRANSITION_FRAMES = 15;

// v10 — 15-slide storyboard durations
// Narrative: Hook → Problem (2) → Impact (2) → Solution (4) → Proof (3) → Partnership → CTA
const SILENT_DURATIONS = [
  8,   // 1. Food Safety Without Blind Spots (Hook)
  10,  // 2. The Accountability Gap (Problem)
  10,  // 3. If It's Not Recorded... (Problem)
  10,  // 4. One Incident, Enterprise Impact (Impact)
  10,  // 5. Audit Drag and Decision Lag (Impact)
  12,  // 6. The Ecowize Digital Platform (Solution)
  12,  // 7. Cleaning Verification (Solution)
  12,  // 8. NCR Management (Solution)
  10,  // 9. Internal Audits (Solution)
  10,  // 10. Executive Command Centre (Solution)
  8,   // 11. Trusted by Food Safety Leaders (Proof)
  32,  // 12. Proven Capabilities (Proof - zoom reveal)
  10,  // 13. Co-Build and Own (Partnership)
  15,  // 14. The Transformation (Differentiation)
  8,   // 15. Let's Build This Together (CTA)
];
const NARRATED_DURATIONS = [
  36,  // 1. Food Safety Without Blind Spots (Hook)
  72,  // 2. The Accountability Gap (Problem)
  52,  // 3. If It's Not Recorded... (Problem)
  31,  // 4. One Incident, Enterprise Impact (Impact)
  29,  // 5. Audit Drag and Decision Lag (Impact)
  30,  // 6. The Ecowize Digital Platform (Solution)
  79,  // 7. Cleaning Verification (Solution)
  45,  // 8. NCR Management (Solution)
  50,  // 9. Internal Audits (Solution)
  48,  // 10. Executive Command Centre (Solution)
  44,  // 11. Trusted by Food Safety Leaders (Proof)
  34,  // 12. Proven Capabilities (Proof - zoom reveal)
  39,  // 13. Co-Build and Own (Partnership)
  63,  // 14. The Transformation (Differentiation)
  27,  // 15. Let's Build This Together (CTA)
];

export interface EcowizePitchProps {
  audioNarration?: boolean;
}

export function getEcowizePitchDuration(fps: number, audioNarration = true): number {
  const durations = audioNarration ? NARRATED_DURATIONS : SILENT_DURATIONS;
  const totalFrames = durations.reduce((sum, d) => sum + d * fps, 0);
  return totalFrames - (durations.length - 1) * TRANSITION_FRAMES;
}

// ── Images & Colours ─────────────────────────────────────────────
const IMG = {
  title: 'images/ecowize/01-title.jpg',
  factory: 'images/ecowize/02-factory-floor.jpg',
  risk: 'images/ecowize/04-risk-exposure.jpg',
  accountability: 'images/ecowize/05-accountability-chain.jpg',
  visibility: 'images/ecowize/06-visibility-gap.jpg',
  platform: 'images/ecowize/07-platform-overview.jpg',
  cleaning: 'images/ecowize/08-cleaning-verification.jpg',
  ncr: 'images/ecowize/09-ncr-management.jpg',
  audit: 'images/ecowize/10-internal-audit.jpg',
  haccp: 'images/ecowize/11-haccp-admin.jpg',
  command: 'images/ecowize/12-command-centre.jpg',
  closing: 'images/ecowize/16-partnership.jpg',
  // Pain point slides
  painReality: 'images/ecowize/pain-01-reality.jpg',
  painConsequences: 'images/ecowize/pain-02-consequences.jpg',
  painAudit: 'images/ecowize/pain-03-audit.jpg',
  painSystem: 'images/ecowize/pain-04-system.jpg',
  // Module showcase (10 modules) - using real screenshots + generated dashboards
  modCleaning: 'images/ecowize/showcase/mod-01-cleaning.png',
  modGlass: 'images/ecowize/showcase/mod-09-glass.png',
  modNcr: 'images/ecowize/showcase/mod-02-ncr.png',
  modAudit: 'images/ecowize/showcase/mod-03-audit.png',
  modComplaints: 'images/ecowize/showcase/mod-10-complaints.png',
  modSurveys: 'images/ecowize/showcase/mod-11-surveys.png',
  modQr: 'images/ecowize/showcase/mod-05-qr.png',
  modAssets: 'images/ecowize/showcase/mod-08-assets.png',
  modTraining: 'images/ecowize/showcase/mod-06-training.png',
  modDocs: 'images/ecowize/showcase/mod-07-docs.png',
};

const C = {
  bg: theme.colors.background,
  text: theme.colors.text,
  accent: theme.colors.accent,
  highlight: theme.colors.highlight,
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
};

const FONT = theme.typography.fontFamily;

// ── Reusable animation components ────────────────────────────────

/** Ken Burns — slow zoom + pan on an image */
const KenBurns: React.FC<{
  src: string;
  opacity?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
}> = ({ src, opacity = 0.65, zoomFrom = 1.0, zoomTo = 1.12, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const tx = interpolate(frame, [0, durationInFrames], [0, panX], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ty = interpolate(frame, [0, durationInFrames], [0, panY], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity,
        transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
      }}
    />
  );
};

/** Animated number counter (0 → target) */
const AnimatedNumber: React.FC<{
  target: number;
  suffix?: string;
  prefix?: string;
  startFrame?: number;
  durationFrames?: number;
  fontSize?: number;
  color?: string;
}> = ({ target, suffix = '', prefix = '', startFrame = 10, durationFrames = 40, fontSize = 72, color = C.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay: startFrame,
    config: { damping: 200 },
    durationInFrames: durationFrames,
  });

  const value = Math.round(progress * target);

  return (
    <span style={{ fontSize, fontWeight: 800, color, fontFamily: FONT }}>
      {prefix}{value}{suffix}
    </span>
  );
};

/** Typewriter text with blinking cursor */
const Typewriter: React.FC<{
  text: string;
  startFrame?: number;
  charFrames?: number;
  fontSize?: number;
  color?: string;
  highlightWord?: string;
  highlightColor?: string;
}> = ({
  text, startFrame = 0, charFrames = 2, fontSize = 42, color = C.text,
  highlightWord, highlightColor = C.accent,
}) => {
  const frame = useCurrentFrame();

  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(text.length, Math.floor(elapsed / charFrames));
  const typedText = text.slice(0, charCount);
  const cursorVisible = elapsed % 16 < 10;
  const done = charCount >= text.length;

  // Render with highlight if specified
  let rendered: React.ReactNode = typedText;
  if (highlightWord && typedText.includes(highlightWord)) {
    const idx = typedText.indexOf(highlightWord);
    rendered = (
      <>
        {typedText.slice(0, idx)}
        <span style={{
          backgroundColor: withOpacity(highlightColor, 0.25),
          borderBottom: `3px solid ${highlightColor}`,
          padding: '0 4px',
        }}>
          {highlightWord}
        </span>
        {typedText.slice(idx + highlightWord.length)}
      </>
    );
  }

  return (
    <div style={{ fontSize, fontWeight: 600, color, fontFamily: FONT, lineHeight: 1.4 }}>
      {rendered}
      {!done && <span style={{ opacity: cursorVisible ? 1 : 0, color: C.accent }}>▌</span>}
    </div>
  );
};

/** Word highlight with spring wipe */
const WordHighlight: React.FC<{
  pre: string;
  highlight: string;
  post: string;
  delay?: number;
  fontSize?: number;
  color?: string;
  highlightColor?: string;
}> = ({ pre, highlight, post, delay = 30, fontSize = 44, color = C.text, highlightColor = C.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const wipeProgress = spring({
    fps, frame,
    config: { damping: 200 },
    delay,
    durationInFrames: 18,
  });

  return (
    <div style={{ fontSize, fontWeight: 600, color, fontFamily: FONT, lineHeight: 1.5, opacity: textOp }}>
      {pre}
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span style={{
          position: 'absolute', left: 0, right: 0, top: '50%',
          height: '1.1em', transform: `translateY(-50%) scaleX(${wipeProgress})`,
          transformOrigin: 'left center',
          backgroundColor: withOpacity(highlightColor, 0.2),
          borderRadius: 4, zIndex: 0,
        }} />
        <span style={{
          position: 'relative', zIndex: 1, color: highlightColor,
          borderBottom: `3px solid ${withOpacity(highlightColor, wipeProgress)}`,
        }}>
          {highlight}
        </span>
      </span>
      {post}
    </div>
  );
};

/** Animated horizontal bar */
const AnimatedBar: React.FC<{
  label: string;
  value: number;
  maxValue: number;
  color: string;
  index: number;
}> = ({ label, value, maxValue, color, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay: 20 + index * 8,
    config: { damping: 18, stiffness: 80 },
  });

  const barWidth = (value / maxValue) * 100 * progress;
  const labelOp = interpolate(frame, [15 + index * 8, 30 + index * 8], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, opacity: labelOp }}>
      <div style={{ width: 200, fontSize: 22, color: C.text, fontFamily: FONT, textAlign: 'right', flexShrink: 0 }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 32, backgroundColor: withOpacity(color, 0.15), borderRadius: 6, overflow: 'hidden' }}>
        <div style={{
          width: `${barWidth}%`, height: '100%',
          backgroundColor: color, borderRadius: 6,
        }} />
      </div>
      <div style={{ width: 60, fontSize: 20, fontWeight: 700, color, fontFamily: FONT }}>
        {Math.round(value * progress)}
      </div>
    </div>
  );
};

/** Spring-animated bullet point */
const SpringBullet: React.FC<{
  text: string;
  index: number;
  startFrame?: number;
  gap?: number;
  accentColor?: string;
}> = ({ text, index, startFrame = 25, gap = 15, accentColor = C.accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = startFrame + index * gap;
  const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 200 } });

  const opacity = Math.min(1, entrance);
  const translateY = interpolate(entrance, [0, 1], [25, 0]);
  const translateX = interpolate(entrance, [0, 1], [-15, 0]);

  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start',
      opacity, transform: `translate(${translateX}px, ${translateY}px)`,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', backgroundColor: accentColor,
        marginRight: 18, marginTop: 12, flexShrink: 0,
        transform: `scale(${entrance})`,
      }} />
      <div style={{ fontSize: 26, color: C.text, fontFamily: FONT, lineHeight: 1.55 }}>
        {text}
      </div>
    </div>
  );
};

// ── Slide types ──────────────────────────────────────────────────

/** Title slide with Ken Burns + animated counter stats */
const TitleSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, from: 0.85, to: 1, config: { damping: 200 } });
  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOp = interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineW = interpolate(frame, [20, 55], [0, 400], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.title} opacity={0.5} panX={-20} panY={-10} />

      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.65)} 55%, ${withOpacity(C.bg, 0.15)} 100%)`,
      }} />

      <div style={{
        position: 'absolute', inset: 0, padding: 100,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 78, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, transform: `scale(${titleScale})`, lineHeight: 1.1, maxWidth: 900,
        }}>
          A Digital Platform for Ecowize
        </div>

        <div style={{ width: lineW, height: 5, backgroundColor: C.accent, marginTop: 35, marginBottom: 35, borderRadius: 3 }} />

        <div style={{
          fontSize: 28, color: C.accent, fontFamily: FONT, opacity: subOp, maxWidth: 800, lineHeight: 1.4,
        }}>
          Cleaning Verification · NCR Management · Internal Audits · Multi-Site Visibility
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Split layout with Ken Burns image and spring bullets */
const SplitSlide: React.FC<{
  title: string;
  bullets: string[];
  imagePath: string;
  imagePosition?: 'right' | 'left';
  accentColor?: string;
  panX?: number;
  panY?: number;
}> = ({ title, bullets, imagePath, imagePosition = 'right', accentColor = C.accent, panX = -15, panY = -8 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleSlide = interpolate(frame, [5, 22], [imagePosition === 'right' ? -25 : 25, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
  });

  const isRight = imagePosition === 'right';

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: isRight ? 'row' : 'row-reverse' }}>
        {/* Text side — 55% */}
        <div style={{
          width: '55%', padding: '70px 60px 70px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
            opacity: titleOp, transform: `translateX(${titleSlide}px)`,
            lineHeight: 1.15, marginBottom: 10,
          }}>
            {title}
          </div>

          <div style={{
            width: 60, height: 4, backgroundColor: accentColor, marginBottom: 36, opacity: titleOp,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {bullets.map((b, i) => (
              <SpringBullet key={i} text={b} index={i} accentColor={accentColor} />
            ))}
          </div>
        </div>

        {/* Image side — 45% with Ken Burns */}
        <div style={{ width: '45%', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', top: 0, [isRight ? 'left' : 'right']: 0,
            width: 140, height: '100%',
            background: `linear-gradient(${isRight ? '90deg' : '270deg'}, ${C.bg} 0%, transparent 100%)`,
            zIndex: 2,
          }} />
          <KenBurns src={imagePath} opacity={0.85} panX={panX} panY={panY} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Hero slide — full-bleed Ken Burns + typewriter statement */
const HeroSlide: React.FC<{
  statement: string;
  highlightWord?: string;
  subtitle?: string;
  imagePath: string;
}> = ({ statement, highlightWord, subtitle, imagePath }) => {
  const frame = useCurrentFrame();

  const barOp = interpolate(frame, [10, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOp = interpolate(frame, [80, 95], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={imagePath} opacity={0.6} zoomFrom={1.02} zoomTo={1.15} panX={20} panY={-10} />

      {/* Bottom gradient */}
      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '55%',
        background: `linear-gradient(180deg, transparent 0%, ${withOpacity(C.bg, 0.96)} 55%)`,
        opacity: barOp,
      }} />

      {/* Top vignette */}
      <div style={{
        position: 'absolute', top: 0, width: '100%', height: '30%',
        background: `linear-gradient(180deg, ${withOpacity(C.bg, 0.5)} 0%, transparent 100%)`,
      }} />

      {/* Typewriter statement */}
      <div style={{ position: 'absolute', bottom: 80, left: 80, right: 80 }}>
        {highlightWord ? (
          <WordHighlight
            pre={statement.split(highlightWord)[0]}
            highlight={highlightWord}
            post={statement.split(highlightWord).slice(1).join(highlightWord)}
            delay={40}
            fontSize={48}
          />
        ) : (
          <Typewriter text={statement} startFrame={15} charFrames={1} fontSize={48} />
        )}

        {subtitle && (
          <div style={{
            fontSize: 24, color: withOpacity(C.text, 0.7), fontFamily: FONT,
            opacity: subOp, marginTop: 20, lineHeight: 1.5, maxWidth: 900,
          }}>
            {subtitle}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/** Stat card slide — big numbers with animated counters */
const StatSlide: React.FC<{
  title: string;
  stats: { value: number; suffix: string; label: string; color?: string }[];
  imagePath: string;
  bullets?: string[];
}> = ({ title, stats, imagePath, bullets }) => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        {/* Left — stats */}
        <div style={{
          width: '55%', padding: '70px 50px 70px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
            opacity: titleOp, marginBottom: 8,
          }}>
            {title}
          </div>
          <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: 30, marginBottom: 30 }}>
            {stats.map((stat, i) => {
              const { fps } = useVideoConfig();
              const cardEntrance = spring({ frame, fps, delay: 15 + i * 12, config: { damping: 200 } });
              return (
                <div key={i} style={{
                  flex: 1, padding: '24px 20px', borderRadius: 12,
                  backgroundColor: withOpacity(stat.color || C.accent, 0.1),
                  border: `1px solid ${withOpacity(stat.color || C.accent, 0.2)}`,
                  opacity: cardEntrance, transform: `translateY(${(1 - cardEntrance) * 20}px)`,
                  textAlign: 'center',
                }}>
                  <AnimatedNumber
                    target={stat.value}
                    suffix={stat.suffix}
                    startFrame={20 + i * 12}
                    color={stat.color || C.accent}
                  />
                  <div style={{ fontSize: 18, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginTop: 8 }}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional bullets */}
          {bullets && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {bullets.map((b, i) => <SpringBullet key={i} text={b} index={i} startFrame={60} />)}
            </div>
          )}
        </div>

        {/* Right — image */}
        <div style={{ width: '45%', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, width: 140, height: '100%',
            background: `linear-gradient(90deg, ${C.bg} 0%, transparent 100%)`,
            zIndex: 2,
          }} />
          <KenBurns src={imagePath} opacity={0.85} panX={-12} panY={5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** NCR severity bars — animated bar chart */
const NCRSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        <div style={{
          width: '55%', padding: '70px 50px 70px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
            opacity: titleOp, marginBottom: 8,
          }}>
            NCR Management
          </div>
          <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

          {/* Animated severity bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 30 }}>
            <AnimatedBar label="Critical (0-2h)" value={95} maxValue={100} color="#ef4444" index={0} />
            <AnimatedBar label="Major (2-24h)" value={80} maxValue={100} color="#f97316" index={1} />
            <AnimatedBar label="Minor (1-7d)" value={60} maxValue={100} color="#eab308" index={2} />
            <AnimatedBar label="Observation (30d)" value={35} maxValue={100} color="#22d3ee" index={3} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SpringBullet text="7-status workflow with RACI at every stage" index={0} startFrame={60} />
            <SpringBullet text="Auto-escalation — critical NCRs reach management immediately" index={1} startFrame={60} />
            <SpringBullet text="Full audit trail: who, what, when" index={2} startFrame={60} />
          </div>
        </div>

        <div style={{ width: '45%', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, width: 140, height: '100%',
            background: `linear-gradient(90deg, ${C.bg} 0%, transparent 100%)`, zIndex: 2,
          }} />
          <KenBurns src={IMG.ncr} opacity={0.85} panX={10} panY={-5} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Traditional vs Our Approach — animated flow diagram */
const TraditionalVsDigitalSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Traditional items — appear as disconnected, scattered cards
  const traditionalItems = [
    'Master Cleaning Schedule',
    'Standard Cleaning Instructions',
    'Checklists',
    'MSDS Records',
    'Chemical Verification',
  ];

  // Our flow — connected chain
  const flowSteps = [
    { label: 'Scheduled Item', icon: '📋' },
    { label: 'Linked Instruction', icon: '📄' },
    { label: 'Electronic Task', icon: '📱' },
    { label: 'Timestamped Proof', icon: '✓' },
  ];

  // Phase 2: punchline
  const punchOp = interpolate(frame, [220, 250], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const punchSlide = interpolate(frame, [220, 260], [30, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, marginBottom: 8,
        }}>
          Traditional vs Digital
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        <div style={{ display: 'flex', flex: 1, gap: 60 }}>
          {/* LEFT: Traditional — disconnected cards */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 18, fontWeight: 700, color: '#ef4444', fontFamily: FONT,
              textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24,
              opacity: interpolate(frame, [12, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              Traditional Approach
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {traditionalItems.map((item, i) => {
                const delay = 18 + i * 10;
                const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });
                // Slight random-looking offset to emphasize "disconnected"
                const offsetX = [0, 12, -8, 18, -4][i];

                return (
                  <div key={i} style={{
                    padding: '14px 20px', borderRadius: 8,
                    backgroundColor: withOpacity('#ef4444', 0.06),
                    border: `1px dashed ${withOpacity('#ef4444', 0.25)}`,
                    fontSize: 22, color: withOpacity(C.text, 0.6), fontFamily: FONT,
                    opacity: entrance,
                    transform: `translateX(${offsetX + (1 - entrance) * -40}px)`,
                  }}>
                    {item}
                  </div>
                );
              })}
            </div>

            {/* Manual dependency note */}
            <div style={{
              marginTop: 20, fontSize: 19, color: withOpacity('#ef4444', 0.7), fontFamily: FONT,
              fontStyle: 'italic',
              opacity: interpolate(frame, [90, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              Heavily dependent on manual intervention and site-level expertise to keep in sync
            </div>
          </div>

          {/* Divider */}
          <div style={{
            width: 2, backgroundColor: withOpacity(C.text, 0.1),
            opacity: interpolate(frame, [15, 30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }} />

          {/* RIGHT: Our approach — connected flow */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: FONT,
              textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24,
              opacity: interpolate(frame, [12, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
            }}>
              Our Approach
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', paddingLeft: 30 }}>
              {/* Connecting line */}
              {(() => {
                const lineH = interpolate(frame, [80, 80 + flowSteps.length * 25], [0, 100], {
                  extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad),
                });
                return (
                  <div style={{
                    position: 'absolute', left: 47, top: 30, width: 3,
                    height: `${lineH}%`,
                    backgroundColor: withOpacity(C.accent, 0.3),
                    borderRadius: 2,
                  }} />
                );
              })()}

              {flowSteps.map((step, i) => {
                const delay = 80 + i * 20;
                const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 200 } });
                const circleScale = spring({ frame, fps, delay: delay + 8, config: { damping: 12 } });

                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 20, marginBottom: 22,
                    opacity: entrance, transform: `translateX(${(1 - entrance) * 40}px)`,
                  }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      backgroundColor: withOpacity(C.accent, 0.15),
                      border: `2px solid ${C.accent}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transform: `scale(${circleScale})`,
                    }}>
                      <span style={{ fontSize: 18 }}>{step.icon}</span>
                    </div>
                    <div style={{
                      padding: '12px 20px', borderRadius: 8, flex: 1,
                      backgroundColor: withOpacity(C.accent, 0.08),
                      border: `1px solid ${withOpacity(C.accent, 0.2)}`,
                      fontSize: 22, color: C.text, fontFamily: FONT, fontWeight: 600,
                    }}>
                      {step.label}
                    </div>
                    {i < flowSteps.length - 1 && (
                      <div style={{
                        position: 'absolute', left: 44, marginTop: 52,
                        fontSize: 18, color: withOpacity(C.accent, entrance * 0.6),
                      }}>
                        ↓
                      </div>
                    )}
                  </div>
                );
              })}

              {/* "Only dismissed upon proof" callout */}
              <div style={{
                marginTop: 8, padding: '10px 16px', borderRadius: 8,
                backgroundColor: withOpacity(C.highlight, 0.1),
                border: `1px solid ${withOpacity(C.highlight, 0.3)}`,
                fontSize: 18, color: C.highlight, fontFamily: FONT, fontWeight: 600,
                opacity: interpolate(frame, [180, 200], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
                marginLeft: 58,
              }}>
                Task only dismissed with electronic, timestamped proof of presence
              </div>
            </div>
          </div>
        </div>

        {/* Punchline */}
        <div style={{
          marginTop: 20, textAlign: 'center',
          opacity: punchOp, transform: `translateY(${punchSlide}px)`,
        }}>
          <span style={{
            fontSize: 30, fontWeight: 700, color: C.text, fontFamily: FONT,
          }}>
            Manual systems can be verified — but often{' '}
            <span style={{
              backgroundColor: withOpacity(C.highlight, 0.2),
              borderBottom: `3px solid ${C.highlight}`,
              padding: '0 6px', color: C.highlight,
            }}>
              too late
            </span>
            .{' '}
            <span style={{ color: C.accent }}>
              You can only manage what you know.
            </span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Workflow Progressive Reveal — each step zooms from full-screen to thumbnail node */
const WorkflowRevealSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Thumbnail dimensions and node positions (U-shape flow)
  const TW = 240; // thumbnail width
  const TH = 150; // thumbnail height
  const CX = 960; // screen center X
  const CY = 540; // screen center Y

  const steps = [
    {
      img: 'images/ecowize/wf-01-schedule.jpg',
      label: 'Schedule',
      question: 'What is to be cleaned?',
      note: 'Schedules captured electronically',
      pos: { x: 180, y: 300 },
    },
    {
      img: 'images/ecowize/wf-02-instruction.jpg',
      label: 'Instruction',
      question: 'How is it to be cleaned?',
      note: 'Instructions linked to every scheduled item',
      pos: { x: 580, y: 300 },
    },
    {
      img: 'images/ecowize/wf-03-task.jpg',
      label: 'Task Creation',
      question: 'When?',
      note: 'Electronic instruction with inspection point images',
      pos: { x: 980, y: 300 },
    },
    {
      img: 'images/ecowize/wf-04-qr-scan.jpg',
      label: 'Claiming',
      question: 'Who?',
      note: 'QR scan — responsible cleaner identified',
      pos: { x: 1380, y: 300 },
    },
    {
      img: 'images/ecowize/wf-05-checklist.jpg',
      label: 'Records',
      question: 'Proof of execution',
      note: 'Trends, KPIs, and compliance tracking',
      pos: { x: 1080, y: 680 },
    },
  ];

  // NCR branch off Records
  const ncrPos = { x: 480, y: 680 };

  // Timing: each step gets 100 frames (reveal 0-30, zoom 30-80, settle 80-100)
  const STEP_DURATION = 100;
  const STEP_GAP = 90; // overlap slightly

  // --- Connecting arrows (SVG) ---
  const renderArrows = () => {
    const arrows: { from: { x: number; y: number }; to: { x: number; y: number }; stepIdx: number }[] = [];
    for (let i = 1; i < steps.length; i++) {
      arrows.push({
        from: { x: steps[i - 1].pos.x + TW / 2, y: steps[i - 1].pos.y + TH / 2 },
        to: { x: steps[i].pos.x + TW / 2, y: steps[i].pos.y + TH / 2 },
        stepIdx: i,
      });
    }
    // NCR arrow from Records
    arrows.push({
      from: { x: steps[4].pos.x + TW / 2, y: steps[4].pos.y + TH / 2 },
      to: { x: ncrPos.x + TW / 2, y: ncrPos.y + TH / 2 },
      stepIdx: 5,
    });

    return (
      <svg style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }} width={1920} height={1080}>
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={C.accent} />
          </marker>
          <marker id="arrowhead-red" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
          </marker>
        </defs>
        {arrows.map((arrow, i) => {
          const stepFrame = arrow.stepIdx * STEP_GAP;
          const arrowProgress = interpolate(frame, [stepFrame + 70, stepFrame + 95], [0, 1], {
            extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
          });
          if (arrowProgress <= 0) return null;

          const dx = arrow.to.x - arrow.from.x;
          const dy = arrow.to.y - arrow.from.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          // Shorten arrows to not overlap thumbnails
          const pad = 90;
          const nx = dx / len;
          const ny = dy / len;
          const x1 = arrow.from.x + nx * pad;
          const y1 = arrow.from.y + ny * pad;
          const x2 = arrow.from.x + nx * (pad + (len - 2 * pad) * arrowProgress);
          const y2 = arrow.from.y + ny * (pad + (len - 2 * pad) * arrowProgress);

          const isNcr = arrow.stepIdx === 5;

          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={isNcr ? '#ef4444' : C.accent}
              strokeWidth={3}
              strokeDasharray={isNcr ? '8 4' : 'none'}
              markerEnd={arrowProgress > 0.9 ? `url(#arrowhead${isNcr ? '-red' : ''})` : undefined}
              opacity={0.7}
            />
          );
        })}
      </svg>
    );
  };

  // --- Render each workflow step ---
  const renderStep = (step: typeof steps[0], i: number) => {
    const stepStart = i * STEP_GAP;

    // Phase 1: Full-screen image (frames 0-25 of step)
    const fullScreenOp = interpolate(frame, [stepStart, stepStart + 8], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Phase 2: Zoom out (frames 25-75 of step)
    const zoomProgress = spring({
      frame, fps,
      delay: stepStart + 20,
      config: { damping: 28, stiffness: 60 },
      durationInFrames: 60,
    });

    // Scale: from filling screen to thumbnail
    const scaleX = 1920 / TW;
    const scaleY = 1080 / TH;
    const fullScale = Math.max(scaleX, scaleY);
    const currentScale = interpolate(zoomProgress, [0, 1], [fullScale, 1]);

    // Position: from center to node position
    const targetX = step.pos.x + TW / 2;
    const targetY = step.pos.y + TH / 2;
    const currentX = interpolate(zoomProgress, [0, 1], [CX, targetX]);
    const currentY = interpolate(zoomProgress, [0, 1], [CY, targetY]);

    // Opacity: full-screen is bright, thumbnail settles to normal
    const imgOpacity = interpolate(zoomProgress, [0, 0.3], [1, 0.95], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Label appears after zoom settles
    const labelOp = interpolate(frame, [stepStart + 65, stepStart + 85], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Note appears slightly after label
    const noteOp = interpolate(frame, [stepStart + 78, stepStart + 95], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Question overlay on full-screen phase
    const questionOp = interpolate(frame, [stepStart + 5, stepStart + 15, stepStart + 35, stepStart + 50],
      [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

    // Border glow while zooming
    const glowOp = interpolate(zoomProgress, [0.8, 1], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Not visible yet
    if (frame < stepStart) return null;

    return (
      <React.Fragment key={i}>
        {/* Image — zooms from full-screen to thumbnail */}
        <div style={{
          position: 'absolute',
          left: currentX - TW / 2,
          top: currentY - TH / 2,
          width: TW,
          height: TH,
          transform: `scale(${currentScale})`,
          transformOrigin: 'center center',
          zIndex: zoomProgress < 0.95 ? 20 + i : 10 + i,
          opacity: fullScreenOp,
          borderRadius: zoomProgress > 0.5 ? 12 : 0,
          overflow: 'hidden',
          boxShadow: glowOp > 0
            ? `0 0 ${20 * glowOp}px ${withOpacity(C.accent, 0.3 * glowOp)}, 0 4px 20px rgba(0,0,0,0.4)`
            : '0 4px 20px rgba(0,0,0,0.3)',
          border: glowOp > 0 ? `2px solid ${withOpacity(C.accent, 0.4 * glowOp)}` : '2px solid transparent',
        }}>
          <Img
            src={staticFile(step.img)}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              opacity: imgOpacity,
            }}
          />

          {/* Question overlay during full-screen phase */}
          {questionOp > 0 && zoomProgress < 0.3 && (
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(180deg, transparent 40%, ${withOpacity(C.bg, 0.85)} 100%)`,
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
              padding: 20, opacity: questionOp,
            }}>
              <div style={{
                fontSize: 32 / currentScale, fontWeight: 700, color: C.accent, fontFamily: FONT,
                textAlign: 'center', textShadow: `0 2px 8px ${withOpacity(C.bg, 0.8)}`,
              }}>
                {step.question}
              </div>
            </div>
          )}
        </div>

        {/* Step number badge */}
        {glowOp > 0 && (
          <div style={{
            position: 'absolute',
            left: step.pos.x - 14,
            top: step.pos.y - 14,
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: C.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 30 + i,
            opacity: glowOp,
            transform: `scale(${spring({ frame, fps, delay: stepStart + 75, config: { damping: 12 } })})`,
            boxShadow: `0 0 12px ${withOpacity(C.accent, 0.4)}`,
          }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.bg, fontFamily: FONT }}>
              {i + 1}
            </span>
          </div>
        )}

        {/* Label below thumbnail */}
        <div style={{
          position: 'absolute',
          left: step.pos.x,
          top: step.pos.y + TH + 10,
          width: TW,
          textAlign: 'center',
          zIndex: 15 + i,
          opacity: labelOp,
          transform: `translateY(${(1 - labelOp) * 10}px)`,
        }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT }}>
            {step.label}
          </div>
          <div style={{ fontSize: 15, color: C.accent, fontFamily: FONT, marginTop: 2 }}>
            {step.question}
          </div>
        </div>

        {/* Side note — appears as a floating card */}
        <div style={{
          position: 'absolute',
          left: step.pos.x + TW + 8,
          top: step.pos.y + TH - 20,
          maxWidth: 180,
          zIndex: 15 + i,
          opacity: noteOp,
          transform: `translateX(${(1 - noteOp) * 15}px)`,
        }}>
          <div style={{
            fontSize: 13, color: withOpacity(C.text, 0.6), fontFamily: FONT,
            lineHeight: 1.35,
            padding: '6px 10px', borderRadius: 6,
            backgroundColor: withOpacity(C.accent, 0.06),
            borderLeft: `2px solid ${withOpacity(C.accent, 0.3)}`,
          }}>
            {step.note}
          </div>
        </div>
      </React.Fragment>
    );
  };

  // --- NCR branch ---
  const ncrStart = 5 * STEP_GAP;
  const ncrEntrance = spring({ frame, fps, delay: ncrStart + 20, config: { damping: 20, stiffness: 120 } });
  const ncrLabelOp = interpolate(frame, [ncrStart + 60, ncrStart + 80], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // --- Title ---
  const titleOp = interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  // Title fades out once first step starts zooming
  const titleFade = interpolate(frame, [25, 50], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Title — visible briefly at start */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, pointerEvents: 'none',
        opacity: titleOp * titleFade,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT,
          textAlign: 'center',
        }}>
          How The System Works
        </div>
      </div>

      {/* Connecting arrows */}
      {renderArrows()}

      {/* Workflow steps */}
      {steps.map((step, i) => renderStep(step, i))}

      {/* NCR branch node */}
      {frame >= ncrStart && (
        <>
          <div style={{
            position: 'absolute',
            left: ncrPos.x, top: ncrPos.y,
            width: TW, height: TH,
            borderRadius: 12, overflow: 'hidden',
            border: `2px solid ${withOpacity('#ef4444', 0.5 * ncrEntrance)}`,
            boxShadow: `0 0 20px ${withOpacity('#ef4444', 0.2 * ncrEntrance)}`,
            opacity: ncrEntrance,
            transform: `scale(${0.8 + 0.2 * ncrEntrance})`,
            zIndex: 16,
          }}>
            <Img
              src={staticFile('images/ecowize/wf-06-ncr.jpg')}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
            />
          </div>

          {/* NCR badge */}
          <div style={{
            position: 'absolute',
            left: ncrPos.x - 14, top: ncrPos.y - 14,
            width: 32, height: 32, borderRadius: '50%',
            backgroundColor: '#ef4444',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 36, opacity: ncrEntrance,
            transform: `scale(${spring({ frame, fps, delay: ncrStart + 40, config: { damping: 12 } })})`,
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: FONT }}>!</span>
          </div>

          {/* NCR label */}
          <div style={{
            position: 'absolute',
            left: ncrPos.x, top: ncrPos.y + TH + 10,
            width: TW, textAlign: 'center',
            zIndex: 16, opacity: ncrLabelOp,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444', fontFamily: FONT }}>
              NCR Raised
            </div>
            <div style={{ fontSize: 15, color: withOpacity('#ef4444', 0.7), fontFamily: FONT, marginTop: 2 }}>
              Non-conformance → escalation
            </div>
          </div>

          {/* NCR side note */}
          <div style={{
            position: 'absolute',
            left: ncrPos.x - 10, top: ncrPos.y - 50,
            maxWidth: 220, zIndex: 16, opacity: ncrLabelOp,
            transform: `translateY(${(1 - ncrLabelOp) * 10}px)`,
          }}>
            <div style={{
              fontSize: 14, color: withOpacity('#ef4444', 0.8), fontFamily: FONT,
              lineHeight: 1.35, padding: '8px 12px', borderRadius: 6,
              backgroundColor: withOpacity('#ef4444', 0.06),
              borderLeft: `2px solid ${withOpacity('#ef4444', 0.3)}`,
            }}>
              Automatic escalation by severity — Critical, Major, Minor
            </div>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/** Comparison slide with spring-animated columns */
const ComparisonSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const rows = [
    { left: 'Records locked in cabinets', right: 'Accessible from any device' },
    { left: 'No proof at 2am', right: 'Timestamped, geolocated, photo-verified' },
    { left: 'NCRs lost in communication', right: 'Auto-escalation with RACI' },
    { left: 'Audits take weeks to compile', right: 'Real-time scoring and trends' },
    { left: 'Site visits needed', right: 'Command centre — always on' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, marginBottom: 8,
        }}>
          Paper vs Digital
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 50, opacity: titleOp }} />

        {/* Column headers with spring entrance */}
        <div style={{ display: 'flex', marginBottom: 24, opacity: interpolate(frame, [12, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>
          <div style={{ width: '48%', fontSize: 20, fontWeight: 700, color: '#ef4444', fontFamily: FONT, textTransform: 'uppercase', letterSpacing: 3 }}>
            ✕  Paper-Based
          </div>
          <div style={{ width: '4%' }} />
          <div style={{ width: '48%', fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT, textTransform: 'uppercase', letterSpacing: 3 }}>
            ✓  Digital Platform
          </div>
        </div>

        {rows.map((row, i) => {
          const delay = 20 + i * 10;
          const leftEntrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 200 } });
          const rightEntrance = spring({ frame, fps, delay: delay + 5, config: { damping: 20, stiffness: 200 } });

          return (
            <div key={i} style={{ display: 'flex', marginBottom: 14 }}>
              <div style={{
                width: '48%', fontSize: 23, color: withOpacity(C.text, 0.5), fontFamily: FONT,
                lineHeight: 1.4, padding: '14px 18px', borderRadius: 8,
                backgroundColor: withOpacity('#ef4444', 0.06),
                opacity: leftEntrance,
                transform: `translateX(${(1 - leftEntrance) * -30}px)`,
              }}>
                {row.left}
              </div>
              <div style={{ width: '4%' }} />
              <div style={{
                width: '48%', fontSize: 23, color: C.text, fontFamily: FONT,
                lineHeight: 1.4, padding: '14px 18px', borderRadius: 8,
                backgroundColor: withOpacity(C.accent, 0.08),
                opacity: rightEntrance,
                transform: `translateX(${(1 - rightEntrance) * 30}px)`,
              }}>
                {row.right}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** We Understand Your Reality — pain points slide */
const YourRealitySlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Pain points with icons and emotional weight
  const painPoints = [
    {
      icon: '⚖️',
      text: 'Due diligence obligation across every facility',
      subtext: 'Prove compliance — not just claim it',
    },
    {
      icon: '🛡️',
      text: 'PRP accountability is non-negotiable',
      subtext: 'Hygiene and sanitation: the foundation of food safety',
    },
    {
      icon: '📋',
      text: 'What\'s not recorded didn\'t happen',
      subtext: 'Records are your only defence when questions arise',
    },
    {
      icon: '⚠️',
      text: 'A failure in sanitation has devastating consequences',
      subtext: 'Recalls, illness, litigation, brand damage',
    },
  ];

  // Bottom statement
  const bottomOp = interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
        {/* Left content — 60% */}
        <div style={{
          width: '60%', padding: '70px 50px 70px 80px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
            opacity: titleOp, marginBottom: 8, lineHeight: 1.15,
          }}>
            We Understand Your Reality
          </div>
          <div style={{ width: 60, height: 4, backgroundColor: '#ef4444', marginBottom: 40, opacity: titleOp }} />

          {/* Pain point cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {painPoints.map((point, i) => {
              const delay = 25 + i * 22;
              const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                  opacity: entrance,
                  transform: `translateX(${(1 - entrance) * -40}px)`,
                }}>
                  <div style={{
                    fontSize: 32, flexShrink: 0, marginTop: 2,
                    transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})`,
                  }}>
                    {point.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONT,
                      lineHeight: 1.3,
                    }}>
                      {point.text}
                    </div>
                    <div style={{
                      fontSize: 17, color: withOpacity('#ef4444', 0.8), fontFamily: FONT,
                      marginTop: 4, fontStyle: 'italic',
                    }}>
                      {point.subtext}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom emphasis */}
          <div style={{
            marginTop: 36, padding: '16px 24px', borderRadius: 10,
            backgroundColor: withOpacity('#ef4444', 0.08),
            borderLeft: `4px solid #ef4444`,
            opacity: bottomOp,
            transform: `translateY(${(1 - bottomOp) * 15}px)`,
          }}>
            <span style={{
              fontSize: 20, fontWeight: 600, color: C.text, fontFamily: FONT,
            }}>
              This is not a tick-box exercise —{' '}
              <span style={{ color: '#ef4444' }}>
                it's brand protection and risk mitigation.
              </span>
            </span>
          </div>
        </div>

        {/* Right image — 40% with Ken Burns */}
        <div style={{ width: '40%', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', left: 0, top: 0, width: 140, height: '100%',
            background: `linear-gradient(90deg, ${C.bg} 0%, transparent 100%)`,
            zIndex: 2,
          }} />
          <KenBurns src={IMG.painReality} opacity={0.8} panX={-10} panY={5} zoomFrom={1.0} zoomTo={1.1} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** What You Need From a System — requirements slide */
const SystemRequirementsSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Requirements with visual representation
  const requirements = [
    {
      icon: '🔮',
      title: 'Proactive, Not Reactive',
      desc: 'Identify issues before they become incidents — early warnings, trend detection, predictive insights',
      color: C.accent,
    },
    {
      icon: '📊',
      title: 'Insightful & Actionable',
      desc: 'Real-time dashboards, compliance scoring, performance trends — data that drives decisions',
      color: C.highlight,
    },
    {
      icon: '✅',
      title: 'Audit-Ready on Any Given Day',
      desc: 'Unannounced or scheduled — your records are complete, accessible, and defensible',
      color: '#22c55e',
    },
    {
      icon: '🏰',
      title: 'Brand Protection & Risk Mitigation',
      desc: 'Beyond compliance — a competitive advantage that protects your reputation',
      color: C.primary,
    },
  ];

  // Closing statement
  const closeOp = interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'row-reverse' }}>
        {/* Right content — 60% */}
        <div style={{
          width: '60%', padding: '70px 80px 70px 50px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}>
          <div style={{
            fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
            opacity: titleOp, marginBottom: 8, lineHeight: 1.15,
          }}>
            What You Need From a System
          </div>
          <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 36, opacity: titleOp }} />

          {/* Requirement cards — 2x2 grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              {requirements.slice(0, 2).map((req, i) => {
                const delay = 25 + i * 20;
                const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

                return (
                  <div key={i} style={{
                    flex: 1, padding: '20px 22px', borderRadius: 12,
                    backgroundColor: withOpacity(req.color, 0.06),
                    border: `1px solid ${withOpacity(req.color, 0.15)}`,
                    opacity: entrance,
                    transform: `translateY(${(1 - entrance) * 25}px)`,
                  }}>
                    <div style={{
                      fontSize: 32, marginBottom: 10,
                      transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})`,
                    }}>
                      {req.icon}
                    </div>
                    <div style={{
                      fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT,
                      marginBottom: 6,
                    }}>
                      {req.title}
                    </div>
                    <div style={{
                      fontSize: 15, color: withOpacity(C.text, 0.6), fontFamily: FONT,
                      lineHeight: 1.4,
                    }}>
                      {req.desc}
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {requirements.slice(2, 4).map((req, i) => {
                const delay = 65 + i * 20;
                const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

                return (
                  <div key={i} style={{
                    flex: 1, padding: '20px 22px', borderRadius: 12,
                    backgroundColor: withOpacity(req.color, 0.06),
                    border: `1px solid ${withOpacity(req.color, 0.15)}`,
                    opacity: entrance,
                    transform: `translateY(${(1 - entrance) * 25}px)`,
                  }}>
                    <div style={{
                      fontSize: 32, marginBottom: 10,
                      transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})`,
                    }}>
                      {req.icon}
                    </div>
                    <div style={{
                      fontSize: 20, fontWeight: 700, color: C.text, fontFamily: FONT,
                      marginBottom: 6,
                    }}>
                      {req.title}
                    </div>
                    <div style={{
                      fontSize: 15, color: withOpacity(C.text, 0.6), fontFamily: FONT,
                      lineHeight: 1.4,
                    }}>
                      {req.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Closing statement */}
          <div style={{
            marginTop: 28, textAlign: 'center',
            opacity: closeOp,
          }}>
            <span style={{
              fontSize: 20, color: withOpacity(C.text, 0.7), fontFamily: FONT, fontStyle: 'italic',
            }}>
              As a trusted food safety partner —{' '}
              <span style={{ color: C.accent, fontWeight: 600, fontStyle: 'normal' }}>
                proactive, insightful, audit-ready.
              </span>
            </span>
          </div>
        </div>

        {/* Left image — 40% with Ken Burns */}
        <div style={{ width: '40%', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute', right: 0, top: 0, width: 140, height: '100%',
            background: `linear-gradient(270deg, ${C.bg} 0%, transparent 100%)`,
            zIndex: 2,
          }} />
          <KenBurns src={IMG.painSystem} opacity={0.8} panX={10} panY={-5} zoomFrom={1.02} zoomTo={1.12} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** How We Work — partnership philosophy */
const HowWeWorkSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Main statement with typewriter effect
  const statement = "We don't prescribe solutions. We partner with you to build what works.";

  // Key principles
  const principles = [
    {
      icon: '🤝',
      title: 'Collaborative Development',
      desc: 'Your workflows, your requirements — we translate them into digital reality',
    },
    {
      icon: '🔐',
      title: 'Your Intellectual Property',
      desc: 'The application we build together remains Ecowize IP — fully owned by you',
    },
    {
      icon: '🎯',
      title: 'Competency First',
      desc: 'We demonstrate our expertise; you decide if there\'s scope to work together',
    },
  ];

  // Punchline
  const punchOp = interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, marginBottom: 8,
        }}>
          How We Work
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        {/* Main statement */}
        <div style={{ marginBottom: 50 }}>
          <Typewriter
            text={statement}
            startFrame={15}
            charFrames={1}
            fontSize={36}
            color={C.text}
            highlightWord="partner"
            highlightColor={C.accent}
          />
        </div>

        {/* Principle cards */}
        <div style={{ display: 'flex', gap: 30, flex: 1, alignItems: 'center' }}>
          {principles.map((p, i) => {
            const delay = 60 + i * 25;
            const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

            return (
              <div key={i} style={{
                flex: 1, padding: '36px 28px', borderRadius: 16,
                backgroundColor: withOpacity(C.accent, 0.04),
                border: `1px solid ${withOpacity(C.accent, 0.12)}`,
                opacity: entrance,
                transform: `translateY(${(1 - entrance) * 30}px)`,
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center',
              }}>
                <div style={{
                  fontSize: 48, marginBottom: 16,
                  transform: `scale(${spring({ frame, fps, delay: delay + 10, config: { damping: 12 } })})`,
                }}>
                  {p.icon}
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONT,
                  marginBottom: 12,
                }}>
                  {p.title}
                </div>
                <div style={{
                  fontSize: 18, color: withOpacity(C.text, 0.65), fontFamily: FONT,
                  lineHeight: 1.45,
                }}>
                  {p.desc}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom punchline */}
        <div style={{
          marginTop: 30, textAlign: 'center',
          opacity: punchOp,
        }}>
          <span style={{
            fontSize: 24, color: withOpacity(C.text, 0.7), fontFamily: FONT, fontStyle: 'italic',
          }}>
            "Our goal is to deliver{' '}
            <span style={{ color: C.accent, fontWeight: 600, fontStyle: 'normal' }}>your vision</span>
            , not impose ours."
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Why Us — core expertise and differentiators */
const WhyUsSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Strength cards with icons
  const strengths = [
    {
      icon: '📈',
      title: 'Scalable Architecture',
      desc: 'Proven ability to handle sizeable, multi-site deployments that grow with your operation',
      color: C.accent,
    },
    {
      icon: '🛡️',
      title: 'Food Safety Expertise',
      desc: 'Deep understanding of FSSC, BRC, SANS 10049 — we speak your compliance language',
      color: C.highlight,
    },
    {
      icon: '⚡',
      title: 'Agile & Dedicated',
      desc: 'Small team, direct communication, rapid iteration — no corporate bureaucracy',
      color: C.primary,
    },
    {
      icon: '💰',
      title: 'Cost-Effective Delivery',
      desc: 'Enterprise capability without enterprise pricing — value at every stage',
      color: '#22c55e',
    },
  ];

  // Commitment banner
  const commitmentOp = interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, marginBottom: 8,
        }}>
          Why Partner With Us
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        {/* 2x2 grid of strength cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {strengths.slice(0, 2).map((s, i) => {
              const delay = 25 + i * 18;
              const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

              return (
                <div key={i} style={{
                  flex: 1, padding: '28px 32px', borderRadius: 14,
                  backgroundColor: withOpacity(s.color, 0.05),
                  border: `1px solid ${withOpacity(s.color, 0.15)}`,
                  opacity: entrance,
                  transform: `translateX(${(1 - entrance) * (i === 0 ? -30 : 30)}px)`,
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                }}>
                  <div style={{
                    fontSize: 40,
                    transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})`,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 24, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
                    }}>
                      {s.title}
                    </div>
                    <div style={{
                      fontSize: 18, color: withOpacity(C.text, 0.6), fontFamily: FONT, lineHeight: 1.45,
                    }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            {strengths.slice(2, 4).map((s, i) => {
              const delay = 60 + i * 18;
              const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

              return (
                <div key={i} style={{
                  flex: 1, padding: '28px 32px', borderRadius: 14,
                  backgroundColor: withOpacity(s.color, 0.05),
                  border: `1px solid ${withOpacity(s.color, 0.15)}`,
                  opacity: entrance,
                  transform: `translateX(${(1 - entrance) * (i === 0 ? -30 : 30)}px)`,
                  display: 'flex', alignItems: 'flex-start', gap: 20,
                }}>
                  <div style={{
                    fontSize: 40,
                    transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})`,
                  }}>
                    {s.icon}
                  </div>
                  <div>
                    <div style={{
                      fontSize: 24, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
                    }}>
                      {s.title}
                    </div>
                    <div style={{
                      fontSize: 18, color: withOpacity(C.text, 0.6), fontFamily: FONT, lineHeight: 1.45,
                    }}>
                      {s.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Commitment banner */}
        <div style={{
          marginTop: 30, padding: '20px 32px', borderRadius: 12,
          backgroundColor: withOpacity(C.accent, 0.08),
          border: `1px solid ${withOpacity(C.accent, 0.2)}`,
          textAlign: 'center',
          opacity: commitmentOp,
          transform: `translateY(${(1 - commitmentOp) * 20}px)`,
        }}>
          <span style={{
            fontSize: 22, fontWeight: 600, color: C.text, fontFamily: FONT,
          }}>
            Our Commitment:{' '}
            <span style={{ color: C.accent }}>
              Systems and records synced — always. Never miss a beat.
            </span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Proven Capabilities — module showcase with screenshots */
const ProvenCapabilitiesSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Module categories with their screenshots
  const modules = [
    { img: IMG.modCleaning, label: 'Cleaning Verification', sub: 'Task Management' },
    { img: IMG.modNcr, label: 'NCR Management', sub: 'Full Workflow' },
    { img: IMG.modAudit, label: 'Internal Audits', sub: 'Scored Templates' },
    { img: IMG.modDashboard, label: 'Command Centre', sub: 'Multi-Site BI' },
    { img: IMG.modQr, label: 'Proof of Presence', sub: 'QR · GPS · NFC' },
    { img: IMG.modTraining, label: 'Online Training', sub: 'LMS Modules' },
    { img: IMG.modDocs, label: 'Document Control', sub: 'Version & Approval' },
    { img: IMG.modAssets, label: 'Asset Registers', sub: 'Equipment Tracking' },
  ];

  // Additional capabilities listed below
  const extraCapabilities = [
    'Glass Registers & PRP Programs',
    'Customer Complaints',
    'Customer Satisfaction Surveys',
    'Photo Evidence Framework',
    'Real-Time Stakeholder Updates',
  ];

  // Footer statement
  const footerOp = interpolate(frame, [280, 310], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: '50px 60px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{
          fontSize: 40, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, marginBottom: 6, lineHeight: 1.15,
        }}>
          Proven Capabilities
        </div>
        <div style={{
          fontSize: 20, color: withOpacity(C.text, 0.6), fontFamily: FONT,
          opacity: titleOp, marginBottom: 20,
        }}>
          Modules we've built and scaled — with Proof of Presence, Photo Evidence, and Communication Frameworks
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 24, opacity: titleOp }} />

        {/* Module grid — 4x2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            {modules.slice(0, 4).map((mod, i) => {
              const delay = 20 + i * 12;
              const entrance = spring({ frame, fps, delay, config: { damping: 22, stiffness: 180 } });
              const imgScale = spring({ frame, fps, delay: delay + 15, config: { damping: 30, stiffness: 100 } });

              return (
                <div key={i} style={{
                  flex: 1, borderRadius: 12, overflow: 'hidden',
                  backgroundColor: withOpacity(C.accent, 0.04),
                  border: `1px solid ${withOpacity(C.accent, 0.12)}`,
                  opacity: entrance,
                  transform: `translateY(${(1 - entrance) * 30}px)`,
                  display: 'flex', flexDirection: 'column',
                }}>
                  {/* Screenshot thumbnail */}
                  <div style={{
                    flex: 1, position: 'relative', overflow: 'hidden',
                    minHeight: 160,
                  }}>
                    <Img
                      src={staticFile(mod.img)}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transform: `scale(${0.9 + 0.1 * imgScale})`,
                        opacity: 0.85,
                      }}
                    />
                    {/* Subtle overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(180deg, transparent 60%, ${withOpacity(C.bg, 0.7)} 100%)`,
                    }} />
                  </div>
                  {/* Label */}
                  <div style={{ padding: '12px 14px', backgroundColor: withOpacity(C.bg, 0.5) }}>
                    <div style={{
                      fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONT,
                    }}>
                      {mod.label}
                    </div>
                    <div style={{
                      fontSize: 13, color: C.accent, fontFamily: FONT, marginTop: 2,
                    }}>
                      {mod.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 16, flex: 1 }}>
            {modules.slice(4, 8).map((mod, i) => {
              const delay = 70 + i * 12;
              const entrance = spring({ frame, fps, delay, config: { damping: 22, stiffness: 180 } });
              const imgScale = spring({ frame, fps, delay: delay + 15, config: { damping: 30, stiffness: 100 } });

              return (
                <div key={i} style={{
                  flex: 1, borderRadius: 12, overflow: 'hidden',
                  backgroundColor: withOpacity(C.accent, 0.04),
                  border: `1px solid ${withOpacity(C.accent, 0.12)}`,
                  opacity: entrance,
                  transform: `translateY(${(1 - entrance) * 30}px)`,
                  display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    flex: 1, position: 'relative', overflow: 'hidden',
                    minHeight: 160,
                  }}>
                    <Img
                      src={staticFile(mod.img)}
                      style={{
                        width: '100%', height: '100%', objectFit: 'cover',
                        transform: `scale(${0.9 + 0.1 * imgScale})`,
                        opacity: 0.85,
                      }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `linear-gradient(180deg, transparent 60%, ${withOpacity(C.bg, 0.7)} 100%)`,
                    }} />
                  </div>
                  <div style={{ padding: '12px 14px', backgroundColor: withOpacity(C.bg, 0.5) }}>
                    <div style={{
                      fontSize: 16, fontWeight: 700, color: C.text, fontFamily: FONT,
                    }}>
                      {mod.label}
                    </div>
                    <div style={{
                      fontSize: 13, color: C.accent, fontFamily: FONT, marginTop: 2,
                    }}>
                      {mod.sub}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Extra capabilities — horizontal pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16,
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <span style={{
            fontSize: 14, color: withOpacity(C.text, 0.5), fontFamily: FONT, marginRight: 8,
          }}>
            Also:
          </span>
          {extraCapabilities.map((cap, i) => {
            const pillEntrance = spring({ frame, fps, delay: 160 + i * 8, config: { damping: 20, stiffness: 200 } });
            return (
              <div key={i} style={{
                padding: '6px 14px', borderRadius: 20,
                backgroundColor: withOpacity(C.accent, 0.08),
                border: `1px solid ${withOpacity(C.accent, 0.15)}`,
                fontSize: 13, color: C.text, fontFamily: FONT,
                opacity: pillEntrance,
                transform: `scale(${0.8 + 0.2 * pillEntrance})`,
              }}>
                {cap}
              </div>
            );
          })}
        </div>

        {/* Footer — IP assurance */}
        <div style={{
          marginTop: 16, padding: '14px 20px', borderRadius: 10,
          backgroundColor: withOpacity(C.highlight, 0.06),
          borderLeft: `4px solid ${C.highlight}`,
          opacity: footerOp,
          transform: `translateY(${(1 - footerOp) * 15}px)`,
        }}>
          <span style={{
            fontSize: 17, color: C.text, fontFamily: FONT, lineHeight: 1.5,
          }}>
            These are{' '}
            <span style={{ fontWeight: 700, color: C.highlight }}>capabilities we've proven</span>
            {' '}— not systems we resell. What we build together is{' '}
            <span style={{ fontWeight: 700, color: C.highlight }}>Ecowize IP</span>
            , tailored to your operations, owned by you.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Proven Capabilities Reveal — zoom-out showcase of 10 modules */
const ProvenCapabilitiesRevealSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 10 modules with their images and labels
  const modules = [
    { img: IMG.modCleaning, label: 'Cleaning Verification', sub: 'Task Management' },
    { img: IMG.modGlass, label: 'Glass Registers', sub: 'PRP Programs' },
    { img: IMG.modNcr, label: 'NCR Management', sub: 'Full 7-Status Workflow' },
    { img: IMG.modAudit, label: 'Internal Audits', sub: 'Scored Templates' },
    { img: IMG.modComplaints, label: 'Customer Complaints', sub: 'Tracking & Resolution' },
    { img: IMG.modSurveys, label: 'Satisfaction Surveys', sub: 'Feedback Loop' },
    { img: IMG.modQr, label: 'Proof of Presence', sub: 'QR · GPS · NFC' },
    { img: IMG.modAssets, label: 'Asset Registers', sub: 'Equipment Tracking' },
    { img: IMG.modTraining, label: 'Online Training', sub: 'LMS Modules' },
    { img: IMG.modDocs, label: 'Document Control', sub: 'Version & Approval' },
  ];

  // Grid: 5x2 layout
  const COLS = 5;
  const ROWS = 2;
  const TW = 340; // thumbnail width
  const TH = 200; // thumbnail height
  const GAP_X = 24;
  const GAP_Y = 20;
  const GRID_START_X = (1920 - (COLS * TW + (COLS - 1) * GAP_X)) / 2;
  const GRID_START_Y = 220;

  // Timing per module
  const INTRO_DURATION = 60; // Title intro frames
  const MODULE_FULL_SCREEN = 45; // Each module full-screen duration
  const MODULE_ZOOM_OUT = 35; // Zoom-out duration
  const MODULE_GAP = 10; // Overlap between modules
  const MODULE_CYCLE = MODULE_FULL_SCREEN + MODULE_ZOOM_OUT - MODULE_GAP;
  const OUTRO_START = INTRO_DURATION + modules.length * MODULE_CYCLE;

  // Get grid position for module index
  const getGridPos = (i: number) => ({
    x: GRID_START_X + (i % COLS) * (TW + GAP_X) + TW / 2,
    y: GRID_START_Y + Math.floor(i / COLS) * (TH + GAP_Y + 50) + TH / 2,
  });

  // Title animation
  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleFade = interpolate(frame, [INTRO_DURATION - 15, INTRO_DURATION], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subtitleOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Render each module with zoom-out effect
  const renderModule = (mod: typeof modules[0], i: number) => {
    const moduleStart = INTRO_DURATION + i * MODULE_CYCLE;

    // Not visible yet
    if (frame < moduleStart) return null;

    // Phase 1: Full-screen (0 to MODULE_FULL_SCREEN)
    const localFrame = frame - moduleStart;

    // Zoom progress (full-screen to thumbnail)
    const zoomProgress = spring({
      frame,
      fps,
      delay: moduleStart + MODULE_FULL_SCREEN - 15,
      config: { damping: 28, stiffness: 60 },
      durationInFrames: MODULE_ZOOM_OUT + 15,
    });

    // Entrance fade
    const entranceOp = interpolate(frame, [moduleStart, moduleStart + 10], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Scale from full-screen to thumbnail
    const fullScaleX = 1920 / TW;
    const fullScaleY = 1080 / TH;
    const fullScale = Math.max(fullScaleX, fullScaleY);
    const currentScale = interpolate(zoomProgress, [0, 1], [fullScale, 1]);

    // Position from center to grid
    const targetPos = getGridPos(i);
    const currentX = interpolate(zoomProgress, [0, 1], [960, targetPos.x]);
    const currentY = interpolate(zoomProgress, [0, 1], [540, targetPos.y]);

    // Image brightness (bright when full-screen, normal when thumbnail)
    const brightness = interpolate(zoomProgress, [0, 0.5], [1.1, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Label at bottom appears as it zooms out
    const labelOp = interpolate(zoomProgress, [0.6, 0.9], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Full-screen label (appears when large)
    const fullLabelOp = interpolate(localFrame, [8, 18, MODULE_FULL_SCREEN - 10, MODULE_FULL_SCREEN], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Border glow after settling
    const glowOp = interpolate(zoomProgress, [0.85, 1], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

    // Z-index: higher when zooming, lower when settled
    const zIndex = zoomProgress < 0.95 ? 50 + (modules.length - i) : 10 + i;

    return (
      <React.Fragment key={i}>
        {/* Image container */}
        <div style={{
          position: 'absolute',
          left: currentX - TW / 2,
          top: currentY - TH / 2,
          width: TW,
          height: TH,
          transform: `scale(${currentScale})`,
          transformOrigin: 'center center',
          zIndex,
          opacity: entranceOp,
          borderRadius: zoomProgress > 0.3 ? 12 : 0,
          overflow: 'hidden',
          boxShadow: glowOp > 0
            ? `0 0 ${24 * glowOp}px ${withOpacity(C.accent, 0.35 * glowOp)}, 0 8px 32px rgba(0,0,0,0.5)`
            : '0 8px 32px rgba(0,0,0,0.4)',
          border: glowOp > 0 ? `2px solid ${withOpacity(C.accent, 0.5 * glowOp)}` : '2px solid transparent',
        }}>
          <Img
            src={staticFile(mod.img)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: `brightness(${brightness})`,
            }}
          />

          {/* Full-screen label overlay */}
          {fullLabelOp > 0 && zoomProgress < 0.4 && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 50%, ${withOpacity(C.bg, 0.9)} 100%)`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: 30 / currentScale,
              opacity: fullLabelOp,
            }}>
              <div style={{
                fontSize: 42 / currentScale,
                fontWeight: 700,
                color: C.text,
                fontFamily: FONT,
                textAlign: 'center',
                textShadow: `0 2px 12px ${withOpacity(C.bg, 0.8)}`,
              }}>
                {mod.label}
              </div>
              <div style={{
                fontSize: 22 / currentScale,
                color: C.accent,
                fontFamily: FONT,
                marginTop: 8 / currentScale,
              }}>
                {mod.sub}
              </div>
            </div>
          )}
        </div>

        {/* Module number badge */}
        {glowOp > 0 && (
          <div style={{
            position: 'absolute',
            left: targetPos.x - TW / 2 - 12,
            top: targetPos.y - TH / 2 - 12,
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: C.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: zIndex + 1,
            opacity: glowOp,
            transform: `scale(${spring({ frame, fps, delay: moduleStart + MODULE_FULL_SCREEN + 20, config: { damping: 12 } })})`,
            boxShadow: `0 0 10px ${withOpacity(C.accent, 0.4)}`,
          }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.bg, fontFamily: FONT }}>
              {i + 1}
            </span>
          </div>
        )}

        {/* Thumbnail label below */}
        <div style={{
          position: 'absolute',
          left: targetPos.x - TW / 2,
          top: targetPos.y + TH / 2 + 8,
          width: TW,
          textAlign: 'center',
          zIndex: 15 + i,
          opacity: labelOp,
          transform: `translateY(${(1 - labelOp) * 10}px)`,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, fontFamily: FONT }}>
            {mod.label}
          </div>
          <div style={{ fontSize: 12, color: C.accent, fontFamily: FONT, marginTop: 2 }}>
            {mod.sub}
          </div>
        </div>
      </React.Fragment>
    );
  };

  // Framework badges (appear after all modules)
  const frameworks = [
    { label: 'Proof of Presence', icon: '📍' },
    { label: 'Photo Evidence', icon: '📸' },
    { label: 'Communication Framework', icon: '📡' },
  ];

  const frameworksOp = interpolate(frame, [OUTRO_START + 20, OUTRO_START + 50], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // Closing statement
  const closingOp = interpolate(frame, [OUTRO_START + 60, OUTRO_START + 90], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Opening title — fades out as modules start */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: titleOp * titleFade,
      }}>
        <div style={{
          fontSize: 56,
          fontWeight: 700,
          color: C.text,
          fontFamily: FONT,
          textAlign: 'center',
        }}>
          Proven Capabilities
        </div>
        <div style={{
          width: 80,
          height: 4,
          backgroundColor: C.accent,
          marginTop: 24,
          marginBottom: 24,
        }} />
        <div style={{
          fontSize: 26,
          color: withOpacity(C.text, 0.7),
          fontFamily: FONT,
          textAlign: 'center',
          opacity: subtitleOp,
          maxWidth: 800,
          lineHeight: 1.5,
        }}>
          What we've built and scaled — not systems we resell
        </div>
      </div>

      {/* Header bar (visible after intro) */}
      <div style={{
        position: 'absolute',
        top: 40,
        left: 60,
        right: 60,
        opacity: interpolate(frame, [INTRO_DURATION, INTRO_DURATION + 30], [0, 1], {
          extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
        }),
        zIndex: 5,
      }}>
        <div style={{
          fontSize: 32,
          fontWeight: 700,
          color: C.text,
          fontFamily: FONT,
        }}>
          Proven Capabilities
        </div>
        <div style={{
          fontSize: 16,
          color: withOpacity(C.text, 0.6),
          fontFamily: FONT,
          marginTop: 4,
        }}>
          Modules built with Proof of Presence, Photo Evidence, and Communication Frameworks
        </div>
        <div style={{ width: 50, height: 3, backgroundColor: C.accent, marginTop: 12 }} />
      </div>

      {/* Render all modules */}
      {modules.map((mod, i) => renderModule(mod, i))}

      {/* Framework badges — bottom center */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        opacity: frameworksOp,
        zIndex: 60,
      }}>
        {frameworks.map((fw, i) => {
          const badgeEntrance = spring({
            frame,
            fps,
            delay: OUTRO_START + 25 + i * 12,
            config: { damping: 20, stiffness: 200 },
          });
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 24px',
              borderRadius: 30,
              backgroundColor: withOpacity(C.accent, 0.1),
              border: `1px solid ${withOpacity(C.accent, 0.25)}`,
              opacity: badgeEntrance,
              transform: `scale(${0.8 + 0.2 * badgeEntrance})`,
            }}>
              <span style={{ fontSize: 22 }}>{fw.icon}</span>
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                color: C.text,
                fontFamily: FONT,
              }}>
                {fw.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Closing statement */}
      <div style={{
        position: 'absolute',
        bottom: 36,
        left: 0,
        right: 0,
        textAlign: 'center',
        opacity: closingOp,
        zIndex: 60,
      }}>
        <span style={{
          fontSize: 18,
          color: withOpacity(C.text, 0.7),
          fontFamily: FONT,
          fontStyle: 'italic',
        }}>
          Your IP, your platform —{' '}
          <span style={{ color: C.highlight, fontWeight: 600, fontStyle: 'normal' }}>
            we demonstrate capability, you decide scope.
          </span>
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Roadmap with animated connecting line */
const RoadmapSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const phases = [
    { label: 'Discovery', detail: 'Site visits, workflow mapping, template design' },
    { label: 'Core Build', detail: 'Cleaning verification + NCR modules' },
    { label: 'Pilot', detail: 'Deploy to 1-2 sites, train teams' },
    { label: 'Audit Module', detail: 'Templates, scoring, digital signatures' },
    { label: 'Rollout', detail: 'Multi-site with command centre' },
  ];

  // Animated connecting line height
  const lineProgress = interpolate(frame, [20, 20 + phases.length * 22], [0, 100], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: 80, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, marginBottom: 8,
        }}>
          Implementation Roadmap
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 50, opacity: titleOp }} />

        <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 28, paddingLeft: 40 }}>
          {/* Connecting line */}
          <div style={{
            position: 'absolute', left: 65, top: 26, width: 3,
            height: `${lineProgress}%`,
            backgroundColor: withOpacity(C.accent, 0.3),
            borderRadius: 2,
          }} />

          {phases.map((phase, i) => {
            const delay = 22 + i * 18;
            const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 200 } });
            const circleScale = spring({ frame, fps, delay: delay + 5, config: { damping: 12 } });

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 28,
                opacity: entrance, transform: `translateX(${(1 - entrance) * 50}px)`,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', backgroundColor: C.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  transform: `scale(${circleScale})`,
                  boxShadow: `0 0 20px ${withOpacity(C.accent, 0.3)}`,
                }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: C.bg, fontFamily: FONT }}>
                    {i + 1}
                  </span>
                </div>

                <div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: C.text, fontFamily: FONT }}>
                    {phase.label}
                  </div>
                  <div style={{ fontSize: 21, color: withOpacity(C.text, 0.6), fontFamily: FONT, marginTop: 2 }}>
                    {phase.detail}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Closing with spring scale + Ken Burns */
const ClosingSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineScale = spring({ frame, fps, from: 0.85, to: 1, config: { damping: 200 } });
  const headlineOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const taglineOp = interpolate(frame, [35, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.closing} opacity={0.4} zoomFrom={1.0} zoomTo={1.08} panX={15} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `radial-gradient(ellipse at center, ${withOpacity(C.bg, 0.55)} 0%, ${withOpacity(C.bg, 0.92)} 70%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 100,
      }}>
        <div style={{
          fontSize: 72, fontWeight: 700, color: C.text, fontFamily: FONT,
          textAlign: 'center', opacity: headlineOp, transform: `scale(${headlineScale})`,
        }}>
          Let's Build This Together
        </div>
        <div style={{
          width: 300, height: 4, backgroundColor: C.accent,
          marginTop: 40, marginBottom: 40, opacity: headlineOp,
        }} />
        <div style={{
          fontSize: 28, color: C.accent, fontFamily: FONT, textAlign: 'center',
          opacity: taglineOp, lineHeight: 1.5, maxWidth: 800,
        }}>
          Delegate responsibility at site level. Retain accountability at the top. See everything.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════
// v10 NEW SLIDES — Streamlined 15-Slide Storyboard
// ══════════════════════════════════════════════════════════════════

/** Hook slide — "Food Safety Without Blind Spots" */
const HookSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, from: 0.9, to: 1, config: { damping: 200 } });
  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const subOp = interpolate(frame, [35, 55], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const lineW = interpolate(frame, [20, 60], [0, 500], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const bannerOp = interpolate(frame, [50, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.title} opacity={0.55} zoomFrom={1.0} zoomTo={1.15} panX={-30} panY={-15} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(135deg, ${withOpacity(C.bg, 0.92)} 0%, ${withOpacity(C.bg, 0.7)} 50%, ${withOpacity(C.bg, 0.3)} 100%)`,
      }} />

      <div style={{
        position: 'absolute', inset: 0, padding: 100,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 82, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: titleOp, transform: `scale(${titleScale})`, lineHeight: 1.05, maxWidth: 1000,
        }}>
          Food Safety Without Blind Spots
        </div>

        <div style={{
          width: lineW, height: 6, backgroundColor: C.accent,
          marginTop: 40, marginBottom: 40, borderRadius: 3,
        }} />

        <div style={{
          fontSize: 30, color: withOpacity(C.text, 0.85), fontFamily: FONT,
          opacity: subOp, maxWidth: 900, lineHeight: 1.45,
        }}>
          For global food brands, sanitation is a board-level risk — not a line item.
          <br />
          The Ecowize Digital Platform delivers <span style={{ color: C.accent, fontWeight: 600 }}>always-on assurance</span>.
        </div>

        {/* "Always On Assurance" banner */}
        <div style={{
          marginTop: 50, padding: '18px 32px', borderRadius: 12, display: 'inline-flex',
          backgroundColor: withOpacity(C.accent, 0.12), border: `2px solid ${C.accent}`,
          opacity: bannerOp, transform: `translateY(${(1 - bannerOp) * 20}px)`,
          alignSelf: 'flex-start',
        }}>
          <span style={{
            fontSize: 22, fontWeight: 700, color: C.accent, fontFamily: FONT, letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            Cleaning Verification · NCR Management · Internal Audits · Multi-Site Visibility
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Problem Slide 1: The Accountability Gap */
const AccountabilityGapSlide: React.FC = () => {
  const frame = useCurrentFrame();

  const chainOp = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const breakOp = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.accountability} opacity={0.5} zoomFrom={1.02} zoomTo={1.12} panX={20} panY={-10} />

      <div style={{
        position: 'absolute', bottom: 0, width: '100%', height: '60%',
        background: `linear-gradient(180deg, transparent 0%, ${withOpacity(C.bg, 0.95)} 50%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT, lineHeight: 1.2,
          marginBottom: 30, opacity: chainOp,
        }}>
          The Accountability Gap
        </div>

        {/* Chain of command diagram */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 20, marginBottom: 30,
          opacity: chainOp, transform: `translateX(${(1 - chainOp) * -30}px)`,
        }}>
          <div style={{ padding: '14px 24px', borderRadius: 10, backgroundColor: withOpacity(C.accent, 0.15), border: `1px solid ${C.accent}` }}>
            <span style={{ fontSize: 20, color: C.text, fontFamily: FONT, fontWeight: 600 }}>Site Supervisor</span>
          </div>
          <div style={{ fontSize: 28, color: withOpacity(C.accent, 0.7) }}>→</div>
          <div style={{ padding: '14px 24px', borderRadius: 10, backgroundColor: withOpacity('#ef4444', 0.15), border: `2px dashed ${breakOp > 0.5 ? '#ef4444' : withOpacity(C.accent, 0.3)}` }}>
            <span style={{ fontSize: 20, color: breakOp > 0.5 ? '#ef4444' : C.text, fontFamily: FONT, fontWeight: 600 }}>
              {breakOp > 0.5 ? '? Blind Spot ?' : 'Paper Records'}
            </span>
          </div>
          <div style={{ fontSize: 28, color: withOpacity('#ef4444', breakOp * 0.7), opacity: breakOp }}>✕</div>
          <div style={{ padding: '14px 24px', borderRadius: 10, backgroundColor: withOpacity(C.highlight, 0.15), border: `1px solid ${C.highlight}` }}>
            <span style={{ fontSize: 20, color: C.text, fontFamily: FONT, fontWeight: 600 }}>Leadership</span>
          </div>
        </div>

        <Typewriter
          text="Those executing sanitation are not those held accountable. Leadership relies on periodic reports and site visits to assess risk."
          startFrame={90}
          charFrames={1}
          fontSize={28}
          color={withOpacity(C.text, 0.85)}
        />
      </div>
    </AbsoluteFill>
  );
};

/** Problem Slide 2: If It's Not Recorded... */
const IfNotRecordedSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const transformOp = interpolate(frame, [50, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Paper fading, digital appearing
  const paperOp = interpolate(frame, [30, 60, 100, 130], [0, 1, 1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const digitalOp = interpolate(frame, [100, 140], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.painReality} opacity={0.45} zoomFrom={1.0} zoomTo={1.1} panX={15} panY={5} />

      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.9)} 0%, ${withOpacity(C.bg, 0.6)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '80px 100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontSize: 56, fontWeight: 700, color: C.text, fontFamily: FONT, lineHeight: 1.15,
          opacity: titleOp, marginBottom: 40,
        }}>
          If It Isn't Recorded, It Didn't Happen
        </div>

        {/* Transformation visual */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginBottom: 40 }}>
          {/* Paper side */}
          <div style={{
            flex: 1, padding: '30px', borderRadius: 12,
            backgroundColor: withOpacity('#ef4444', 0.08), border: `1px dashed ${withOpacity('#ef4444', 0.4)}`,
            opacity: paperOp, transform: `scale(${0.9 + 0.1 * paperOp})`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#ef4444', fontFamily: FONT, marginBottom: 12 }}>📋 Paper Records</div>
            <div style={{ fontSize: 18, color: withOpacity(C.text, 0.7), fontFamily: FONT, lineHeight: 1.5 }}>
              Torn logbook pages · Faded checklists · No timestamps · No geolocation
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            fontSize: 40, color: C.accent, opacity: transformOp,
            transform: `scale(${spring({ frame, fps, delay: 80, config: { damping: 12 } })})`,
          }}>
            →
          </div>

          {/* Digital side */}
          <div style={{
            flex: 1, padding: '30px', borderRadius: 12,
            backgroundColor: withOpacity(C.accent, 0.08), border: `2px solid ${C.accent}`,
            opacity: digitalOp, transform: `translateX(${(1 - digitalOp) * 30}px)`,
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.accent, fontFamily: FONT, marginBottom: 12 }}>📱 Digital Evidence</div>
            <div style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
              Timestamped · Geolocated · Photo evidence · Immutable audit trail
            </div>
          </div>
        </div>

        <div style={{
          fontSize: 26, color: withOpacity(C.text, 0.85), fontFamily: FONT, lineHeight: 1.5,
          opacity: interpolate(frame, [150, 180], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Paper can't prove what occurred on a night shift or at a remote site.
          <br />
          <span style={{ color: C.accent, fontWeight: 600 }}>Executives need evidence that is timestamped, traceable, and defensible.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Impact Slide 1: One Incident, Enterprise Impact */
const EnterpriseImpactSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const crackOp = interpolate(frame, [40, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleScale = spring({ frame, fps, delay: 50, config: { damping: 15, stiffness: 40 } });

  const impacts = [
    { label: 'Product Recalls', color: '#ef4444' },
    { label: 'Lost Shelf Space', color: '#f97316' },
    { label: 'Regulatory Action', color: '#eab308' },
    { label: 'Reputational Damage', color: '#dc2626' },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.risk} opacity={0.5} zoomFrom={1.0} zoomTo={1.12} panX={-20} panY={-10} />

      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `radial-gradient(ellipse at center, ${withOpacity(C.bg, 0.6)} 0%, ${withOpacity(C.bg, 0.95)} 70%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '80px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          fontSize: 54, fontWeight: 700, color: C.text, fontFamily: FONT, textAlign: 'center',
          marginBottom: 50, lineHeight: 1.15,
          opacity: interpolate(frame, [5, 25], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          One Incident, Enterprise Impact
        </div>

        {/* Impact ripple effect */}
        <div style={{ position: 'relative', width: 600, height: 300, marginBottom: 40 }}>
          {/* Central incident */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            width: 120, height: 120, borderRadius: '50%',
            backgroundColor: withOpacity('#ef4444', 0.2), border: `3px solid #ef4444`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <span style={{ fontSize: 40 }}>⚠️</span>
          </div>

          {/* Ripple rings */}
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: `translate(-50%, -50%) scale(${rippleScale * (0.5 + i * 0.4)})`,
              width: 120 + i * 100, height: 120 + i * 60, borderRadius: '50%',
              border: `2px solid ${withOpacity('#ef4444', 0.3 - i * 0.08)}`,
              opacity: crackOp * (1 - i * 0.2),
            }} />
          ))}

          {/* Impact labels */}
          {impacts.map((impact, i) => {
            const angle = -45 + i * 40;
            const radius = 200;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius * 0.6;
            const delay = 70 + i * 15;

            return (
              <div key={i} style={{
                position: 'absolute', left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
                transform: 'translate(-50%, -50%)',
                padding: '10px 18px', borderRadius: 8,
                backgroundColor: withOpacity(impact.color, 0.15), border: `1px solid ${impact.color}`,
                opacity: interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
              }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: impact.color, fontFamily: FONT }}>{impact.label}</span>
              </div>
            );
          })}
        </div>

        <div style={{
          fontSize: 24, color: withOpacity(C.text, 0.85), fontFamily: FONT, textAlign: 'center', lineHeight: 1.5,
          opacity: interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          A single sanitation failure can cascade across the enterprise.
          <br />
          <span style={{ color: C.highlight, fontWeight: 600 }}>The exposure multiplies with every site and every customer.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Impact Slide 2: Audit Drag and Decision Lag */
const AuditDragSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Binder pile animation
  const binderOp = interpolate(frame, [20, 50], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const binderFade = interpolate(frame, [100, 130], [1, 0.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Slow loading dashboard
  const dashOp = interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const loadProgress = interpolate(frame, [110, 200], [0, 0.35], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.painAudit} opacity={0.4} zoomFrom={1.02} zoomTo={1.1} panX={10} />

      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.92)} 0%, ${withOpacity(C.bg, 0.7)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleOp,
        }}>
          Audit Drag and Decision Lag
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        <div style={{ display: 'flex', gap: 60, flex: 1, alignItems: 'center' }}>
          {/* Left: Binder pile */}
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: binderOp * binderFade,
          }}>
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              {/* Stack of binders */}
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  position: 'absolute', left: i * 8, bottom: i * 40,
                  width: 180, height: 50, borderRadius: 4,
                  backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e'][i],
                  opacity: 0.7, boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  transform: `rotate(${-2 + i * 1.5}deg)`,
                }} />
              ))}
            </div>
            <div style={{
              marginTop: 20, fontSize: 18, color: '#ef4444', fontFamily: FONT, fontWeight: 600,
            }}>
              Weeks of Compilation
            </div>
          </div>

          {/* Arrow */}
          <div style={{
            fontSize: 50, color: withOpacity(C.accent, 0.5),
            opacity: dashOp,
          }}>
            →
          </div>

          {/* Right: Slow loading dashboard */}
          <div style={{
            flex: 1, padding: 30, borderRadius: 12,
            backgroundColor: withOpacity(C.accent, 0.05), border: `1px solid ${withOpacity(C.accent, 0.2)}`,
            opacity: dashOp,
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 20 }}>
              📊 Dashboard Loading...
            </div>
            <div style={{
              height: 12, backgroundColor: withOpacity(C.accent, 0.15), borderRadius: 6, overflow: 'hidden',
            }}>
              <div style={{
                width: `${loadProgress * 100}%`, height: '100%', backgroundColor: C.accent, borderRadius: 6,
              }} />
            </div>
            <div style={{
              marginTop: 12, fontSize: 14, color: withOpacity(C.text, 0.5), fontFamily: FONT,
            }}>
              {Math.round(loadProgress * 100)}% — Data from 3 months ago
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div style={{
          marginTop: 30, fontSize: 26, color: withOpacity(C.text, 0.85), fontFamily: FONT, lineHeight: 1.5,
          opacity: interpolate(frame, [180, 210], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          Manual records slow audits and obscure trends until they become incidents.
          <br />
          <span style={{ color: C.highlight, fontWeight: 600 }}>By the time leadership sees the data, the risk has already matured.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Solution Overview Slide: The Ecowize Digital Platform */
const PlatformOverviewSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const pillars = [
    { icon: '✓', label: 'Verify', sub: 'Cleaning at point of work', color: C.accent },
    { icon: '⚠', label: 'Correct', sub: 'NCRs with auto-escalation', color: '#f97316' },
    { icon: '📋', label: 'Audit', sub: 'Templates & scoring', color: C.highlight },
    { icon: '👁', label: 'Oversee', sub: 'Multi-site command centre', color: C.primary },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.platform} opacity={0.35} zoomFrom={1.0} zoomTo={1.1} panX={-15} panY={10} />

      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.75)} 60%, ${withOpacity(C.bg, 0.5)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleOp,
        }}>
          The Ecowize Digital Platform
        </div>
        <div style={{
          fontSize: 22, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginBottom: 30,
          opacity: titleOp,
        }}>
          A unified platform that turns sanitation into a live, auditable system — not monthly snapshots.
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        {/* Four pillars */}
        <div style={{ display: 'flex', gap: 24, marginBottom: 40 }}>
          {pillars.map((pillar, i) => {
            const delay = 30 + i * 15;
            const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

            return (
              <div key={i} style={{
                flex: 1, padding: '30px 24px', borderRadius: 14,
                backgroundColor: withOpacity(pillar.color, 0.08),
                border: `2px solid ${withOpacity(pillar.color, 0.25)}`,
                textAlign: 'center',
                opacity: entrance, transform: `translateY(${(1 - entrance) * 30}px)`,
              }}>
                <div style={{
                  fontSize: 48, marginBottom: 16,
                  transform: `scale(${spring({ frame, fps, delay: delay + 10, config: { damping: 12 } })})`,
                }}>
                  {pillar.icon}
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: pillar.color, fontFamily: FONT, marginBottom: 8 }}>
                  {pillar.label}
                </div>
                <div style={{ fontSize: 16, color: withOpacity(C.text, 0.7), fontFamily: FONT }}>
                  {pillar.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform capabilities */}
        <div style={{
          display: 'flex', gap: 30,
          opacity: interpolate(frame, [100, 130], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {[
            { icon: '📱', text: 'Mobile-first, offline-capable' },
            { icon: '🔄', text: 'Real-time sync to dashboards' },
            { icon: '🔒', text: 'Secure, timestamped records' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span style={{ fontSize: 18, color: C.text, fontFamily: FONT }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Partnership Slide: Co-Build and Own (merged How We Work + Why Us + IP) */
const PartnershipSlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const points = [
    { icon: '🤝', title: 'Co-Design Workflows', desc: 'We work with your teams to map processes and build what fits your operations' },
    { icon: '🏢', title: 'Enterprise Food Safety Expertise', desc: 'Deep domain knowledge from years serving global food brands' },
    { icon: '📈', title: 'Scalable Architecture', desc: 'Platform built to grow from pilot to global rollout' },
    { icon: '🔒', title: 'Your IP, Your Asset', desc: 'The platform and IP remain yours — protecting competitive advantage' },
  ];

  const ipBannerOp = interpolate(frame, [200, 240], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleOp,
        }}>
          Co-Build and Own
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        {/* Partnership points — 2x2 grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 20 }}>
            {points.slice(0, 2).map((p, i) => {
              const delay = 25 + i * 15;
              const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });

              return (
                <div key={i} style={{
                  flex: 1, padding: '24px 28px', borderRadius: 12,
                  backgroundColor: withOpacity(C.accent, 0.05),
                  border: `1px solid ${withOpacity(C.accent, 0.15)}`,
                  opacity: entrance, transform: `translateX(${(1 - entrance) * (i === 0 ? -25 : 25)}px)`,
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                }}>
                  <div style={{ fontSize: 36, transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})` }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 16, color: withOpacity(C.text, 0.65), fontFamily: FONT, lineHeight: 1.45 }}>{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            {points.slice(2, 4).map((p, i) => {
              const delay = 60 + i * 15;
              const entrance = spring({ frame, fps, delay, config: { damping: 20, stiffness: 180 } });
              const isIP = i === 1; // Last card is IP ownership

              return (
                <div key={i} style={{
                  flex: 1, padding: '24px 28px', borderRadius: 12,
                  backgroundColor: withOpacity(isIP ? C.highlight : C.accent, isIP ? 0.08 : 0.05),
                  border: `${isIP ? 2 : 1}px solid ${withOpacity(isIP ? C.highlight : C.accent, isIP ? 0.3 : 0.15)}`,
                  opacity: entrance, transform: `translateX(${(1 - entrance) * (i === 0 ? -25 : 25)}px)`,
                  display: 'flex', alignItems: 'flex-start', gap: 18,
                }}>
                  <div style={{ fontSize: 36, transform: `scale(${spring({ frame, fps, delay: delay + 8, config: { damping: 12 } })})` }}>
                    {p.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: isIP ? C.highlight : C.text, fontFamily: FONT, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 16, color: withOpacity(C.text, 0.65), fontFamily: FONT, lineHeight: 1.45 }}>{p.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* IP ownership banner */}
        <div style={{
          marginTop: 24, padding: '18px 28px', borderRadius: 10,
          backgroundColor: withOpacity(C.highlight, 0.08), borderLeft: `4px solid ${C.highlight}`,
          opacity: ipBannerOp, transform: `translateY(${(1 - ipBannerOp) * 15}px)`,
        }}>
          <span style={{ fontSize: 18, color: C.text, fontFamily: FONT, lineHeight: 1.5 }}>
            What we build together is{' '}
            <span style={{ fontWeight: 700, color: C.highlight }}>Ecowize IP</span>
            {' '}— tailored to your operations, owned by you, protecting your competitive advantage.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Credibility Slide: Trusted by Food Safety Leaders */
const CredibilitySlide: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOp = interpolate(frame, [5, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const stats = [
    { value: 25, suffix: '+', label: 'Years in Food Safety', color: C.accent },
    { value: 5, suffix: '', label: 'Countries', color: C.highlight },
    { value: 12, suffix: '+', label: 'Industries Served', color: C.primary },
  ];

  const clients = ['Heineken', 'Nestlé', 'PepsiCo', 'Tiger Brands', 'AB InBev'];

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.factory} opacity={0.35} zoomFrom={1.0} zoomTo={1.08} panX={10} panY={-5} />

      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: `linear-gradient(90deg, ${withOpacity(C.bg, 0.95)} 0%, ${withOpacity(C.bg, 0.7)} 100%)`,
      }} />

      <div style={{ position: 'absolute', inset: 0, padding: '70px 80px', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          fontSize: 48, fontWeight: 700, color: C.text, fontFamily: FONT, marginBottom: 8,
          opacity: titleOp,
        }}>
          Trusted by Food Safety Leaders
        </div>
        <div style={{ width: 60, height: 4, backgroundColor: C.accent, marginBottom: 40, opacity: titleOp }} />

        {/* Stat cards */}
        <div style={{ display: 'flex', gap: 30, marginBottom: 40 }}>
          {stats.map((stat, i) => {
            const delay = 20 + i * 12;
            const entrance = spring({ frame, fps, delay, config: { damping: 20 } });

            return (
              <div key={i} style={{
                flex: 1, padding: '30px', borderRadius: 14,
                backgroundColor: withOpacity(stat.color, 0.08),
                border: `2px solid ${withOpacity(stat.color, 0.2)}`,
                textAlign: 'center',
                opacity: entrance, transform: `translateY(${(1 - entrance) * 25}px)`,
              }}>
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  startFrame={delay + 10}
                  color={stat.color}
                  fontSize={64}
                />
                <div style={{ fontSize: 18, color: withOpacity(C.text, 0.7), fontFamily: FONT, marginTop: 10 }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Client logos placeholder */}
        <div style={{
          display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'center',
          opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          {clients.map((client, i) => (
            <div key={i} style={{
              padding: '12px 24px', borderRadius: 8,
              backgroundColor: withOpacity(C.accent, 0.06),
              border: `1px solid ${withOpacity(C.accent, 0.12)}`,
            }}>
              <span style={{ fontSize: 18, color: C.text, fontFamily: FONT, fontWeight: 500 }}>{client}</span>
            </div>
          ))}
        </div>

        {/* Enterprise-grade banner */}
        <div style={{
          marginTop: 'auto', padding: '16px 24px', borderRadius: 10,
          backgroundColor: withOpacity(C.highlight, 0.06), borderLeft: `4px solid ${C.highlight}`,
          opacity: interpolate(frame, [130, 160], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}>
          <span style={{ fontSize: 18, color: C.text, fontFamily: FONT }}>
            We already support global leaders — the bar is <span style={{ color: C.highlight, fontWeight: 600 }}>enterprise-grade</span>.
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Audio ────────────────────────────────────────────────────────
// v10 — 15-slide audio mapping (slides with narration are numbered, 0 = no audio yet)
// Future: Record narration for each slide and update this map
const AUDIO_MAP_V10 = [
  1,  // 1. Food Safety Without Blind Spots (Hook)
  2,  // 2. The Accountability Gap (Problem)
  3,  // 3. If It's Not Recorded... (Problem)
  4,  // 4. One Incident, Enterprise Impact (Impact)
  5,  // 5. Audit Drag and Decision Lag (Impact)
  6,  // 6. The Ecowize Digital Platform (Solution)
  7,  // 7. Cleaning Verification (Solution)
  8,  // 8. NCR Management (Solution)
  9,  // 9. Internal Audits (Solution)
  10, // 10. Executive Command Centre (Solution)
  11, // 11. Trusted by Food Safety Leaders (Proof)
  12, // 12. Proven Capabilities → slide-12.mp3
  13, // 13. Co-Build and Own (Partnership) → slide-13.mp3
  14, // 14. The Transformation (Differentiation) → slide-14.mp3
  15, // 15. Let's Build This Together (CTA) → slide-15.mp3
];

function audioSrc(slideNum: number): string {
  return `audio/ecowize/v10/slide-${String(slideNum).padStart(2, '0')}.mp3`;
}

const Narrated: React.FC<{
  idx: number;
  audio: boolean;
  children: React.ReactNode;
}> = ({ idx, audio, children }) => (
  <AbsoluteFill>
    {children}
    {audio && AUDIO_MAP_V10[idx] > 0 && <Audio src={staticFile(audioSrc(AUDIO_MAP_V10[idx]))} volume={0.9} />}
  </AbsoluteFill>
);

// ── Transitions ──────────────────────────────────────────────────
const fadeT = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;
const slideR = <TransitionSeries.Transition presentation={slide({ direction: 'from-right' })} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

// ══════════════════════════════════════════════════════════════════
// v10 MAIN COMPOSITION — 15-Slide Executive Storyboard
// ══════════════════════════════════════════════════════════════════
export const EcowizePitch: React.FC<EcowizePitchProps> = ({ audioNarration = true }) => {
  const D = audioNarration ? NARRATED_DURATIONS : SILENT_DURATIONS;
  const a = audioNarration;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>

        {/* ═══════════════════════════════════════════════════════════════
            v10 STREAMLINED 15-SLIDE STORYBOARD
            Narrative: Hook → Problem (2) → Impact (2) → Solution (4) → Proof (3) → Partnership → CTA
            ═══════════════════════════════════════════════════════════════ */}

        {/* 1. HOOK — Food Safety Without Blind Spots */}
        <TransitionSeries.Sequence durationInFrames={D[0] * FPS}>
          <Narrated idx={0} audio={a}><HookSlide /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* ─── PROBLEM SECTION ─────────────────────────────────────────── */}

        {/* 2. PROBLEM — The Accountability Gap */}
        <TransitionSeries.Sequence durationInFrames={D[1] * FPS}>
          <Narrated idx={1} audio={a}><AccountabilityGapSlide /></Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* 3. PROBLEM — If It's Not Recorded, It Didn't Happen */}
        <TransitionSeries.Sequence durationInFrames={D[2] * FPS}>
          <Narrated idx={2} audio={a}><IfNotRecordedSlide /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* ─── IMPACT SECTION ──────────────────────────────────────────── */}

        {/* 4. IMPACT — One Incident, Enterprise Impact */}
        <TransitionSeries.Sequence durationInFrames={D[3] * FPS}>
          <Narrated idx={3} audio={a}><EnterpriseImpactSlide /></Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* 5. IMPACT — Audit Drag and Decision Lag */}
        <TransitionSeries.Sequence durationInFrames={D[4] * FPS}>
          <Narrated idx={4} audio={a}><AuditDragSlide /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* ─── SOLUTION SECTION ────────────────────────────────────────── */}

        {/* 6. SOLUTION — The Ecowize Digital Platform */}
        <TransitionSeries.Sequence durationInFrames={D[5] * FPS}>
          <Narrated idx={5} audio={a}><PlatformOverviewSlide /></Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* 7. SOLUTION — Cleaning Verification */}
        <TransitionSeries.Sequence durationInFrames={D[6] * FPS}>
          <Narrated idx={6} audio={a}>
            <StatSlide
              title="Cleaning Verification"
              stats={[
                { value: 97, suffix: '%', label: 'Less data noise', color: C.accent },
              ]}
              imagePath={IMG.cleaning}
              bullets={[
                'QR-scanned zones — irrefutable proof of where and when',
                'Exception-based: only failures documented',
                'Photo evidence attached to every finding',
              ]}
            />
          </Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* 8. SOLUTION — NCR Management */}
        <TransitionSeries.Sequence durationInFrames={D[7] * FPS}>
          <Narrated idx={7} audio={a}><NCRSlide /></Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* 9. SOLUTION — Internal Audits */}
        <TransitionSeries.Sequence durationInFrames={D[8] * FPS}>
          <Narrated idx={8} audio={a}>
            <SplitSlide
              title="Internal Audit Platform"
              bullets={[
                'Configurable templates — FSSC, BRC, SANS 10049',
                'Scored questions with compliance percentages',
                'NCRs raised from findings — fully linked',
                'Digital signatures, offline, historical comparison',
              ]}
              imagePath={IMG.audit}
            />
          </Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* 10. SOLUTION — Executive Command Centre */}
        <TransitionSeries.Sequence durationInFrames={D[9] * FPS}>
          <Narrated idx={9} audio={a}>
            <SplitSlide
              title="Executive Command Centre"
              bullets={[
                'Single dashboard — SA, Namibia, Australia, NZ, USA',
                'Compliance scores with drill-down to areas',
                'NCR ageing by severity across the business',
                'Faster decisions, fewer surprises',
              ]}
              imagePath={IMG.command}
              imagePosition="left"
              accentColor={C.highlight}
            />
          </Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* ─── PROOF SECTION ───────────────────────────────────────────── */}

        {/* 11. PROOF — Trusted by Food Safety Leaders */}
        <TransitionSeries.Sequence durationInFrames={D[10] * FPS}>
          <Narrated idx={10} audio={a}><CredibilitySlide /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* 12. PROOF — Proven Capabilities (zoom-out reveal) */}
        <TransitionSeries.Sequence durationInFrames={D[11] * FPS}>
          <Narrated idx={11} audio={a}><ProvenCapabilitiesRevealSlide /></Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* ─── PARTNERSHIP SECTION ─────────────────────────────────────── */}

        {/* 13. PARTNERSHIP — Co-Build and Own */}
        <TransitionSeries.Sequence durationInFrames={D[12] * FPS}>
          <Narrated idx={12} audio={a}><PartnershipSlide /></Narrated>
        </TransitionSeries.Sequence>
        {fadeT}

        {/* ─── DIFFERENTIATION ─────────────────────────────────────────── */}

        {/* 14. DIFFERENTIATION — The Transformation */}
        <TransitionSeries.Sequence durationInFrames={D[13] * FPS}>
          <Narrated idx={13} audio={a}><ComparisonSlide /></Narrated>
        </TransitionSeries.Sequence>
        {slideR}

        {/* ─── CALL TO ACTION ──────────────────────────────────────────── */}

        {/* 15. CTA — Let's Build This Together */}
        <TransitionSeries.Sequence durationInFrames={D[14] * FPS}>
          <Narrated idx={14} audio={a}><ClosingSlide /></Narrated>
        </TransitionSeries.Sequence>

      </TransitionSeries>
    </AbsoluteFill>
  );
};
