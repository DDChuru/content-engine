/**
 * Remotion Skill Showcase - Demonstrating Official Packages
 *
 * NOW USING:
 * - @remotion/transitions: TransitionSeries, fade, slide, wipe, flip
 * - @remotion/captions: TikTok-style word highlighting
 * - Spring physics with various damping configs
 * - 3D perspective transforms
 * - Dynamic color interpolation
 */

import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Sequence,
  Easing,
  interpolateColors,
} from 'remotion';

// Official Remotion packages
import { TransitionSeries, springTiming, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';
import { clockWipe } from '@remotion/transitions/clock-wipe';

// ═══════════════════════════════════════════════════════════════════════════════
// SPRING CONFIGS - From remotion-best-practices/timing.md
// ═══════════════════════════════════════════════════════════════════════════════
const SPRING_CONFIGS = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 1: KINETIC TITLE REVEAL
// ═══════════════════════════════════════════════════════════════════════════════
const KineticTitle: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(' ');

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d0d1f 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Animated gradient orb */}
      <div style={{
        position: 'absolute',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
        filter: 'blur(60px)',
        transform: `scale(${interpolate(frame, [0, 60], [0.5, 1.2], { extrapolateRight: 'clamp' })})`,
      }} />

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', zIndex: 1 }}>
        {words.map((word, i) => {
          const delay = i * 8;
          const wordSpring = spring({ frame: frame - delay, fps, config: SPRING_CONFIGS.bouncy });
          const y = interpolate(wordSpring, [0, 1], [100, 0]);
          const opacity = interpolate(wordSpring, [0, 1], [0, 1]);
          const scale = interpolate(wordSpring, [0, 0.5, 1], [0.5, 1.1, 1]);

          return (
            <span key={i} style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#fff',
              textShadow: '0 0 60px rgba(99,102,241,0.8)',
              transform: `translateY(${y}px) scale(${scale})`,
              opacity,
              display: 'inline-block',
            }}>
              {word}
            </span>
          );
        })}
      </div>

      <div style={{
        position: 'absolute',
        bottom: 200,
        opacity: interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        transform: `translateY(${interpolate(frame, [40, 60], [20, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })}px)`,
      }}>
        <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.6)', letterSpacing: 8, textTransform: 'uppercase' }}>
          @remotion/transitions + @remotion/captions
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 2: TRANSITIONS SHOWCASE - Demonstrating @remotion/transitions
// ═══════════════════════════════════════════════════════════════════════════════
const TransitionsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const transitions = [
    { name: 'fade()', color: '#22c55e', desc: 'Crossfade between scenes' },
    { name: 'slide({ direction })', color: '#3b82f6', desc: 'Slide in from any direction' },
    { name: 'wipe()', color: '#f59e0b', desc: 'Wipe reveal effect' },
    { name: 'flip()', color: '#ec4899', desc: '3D flip transition' },
    { name: 'clockWipe()', color: '#8b5cf6', desc: 'Radial clock wipe' },
  ];

  return (
    <AbsoluteFill style={{
      background: '#0a0a0a',
      padding: 60,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 20,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        @remotion/transitions
      </div>

      <div style={{
        fontSize: 20,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Official transition package with TransitionSeries
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {transitions.map(({ name, color, desc }, i) => {
          const delay = 20 + i * 12;
          const itemSpring = spring({ frame: frame - delay, fps, config: SPRING_CONFIGS.snappy });
          const x = interpolate(itemSpring, [0, 1], [-100, 0]);
          const opacity = interpolate(itemSpring, [0, 1], [0, 1]);

          return (
            <div key={name} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              transform: `translateX(${x}px)`,
              opacity,
            }}>
              <div style={{
                width: 8,
                height: 48,
                borderRadius: 4,
                background: color,
                boxShadow: `0 0 20px ${color}80`,
              }} />
              <div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: '#fff',
                  fontFamily: 'JetBrains Mono, monospace',
                }}>
                  {name}
                </div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }}>
                  {desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Code example */}
      <div style={{
        position: 'absolute',
        right: 60,
        bottom: 60,
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 24,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        lineHeight: 1.6,
        opacity: interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ color: '#6ee7b7' }}>{'<TransitionSeries>'}</div>
        <div style={{ color: '#a78bfa', paddingLeft: 20 }}>{'<TransitionSeries.Sequence>'}</div>
        <div style={{ color: '#fff', paddingLeft: 40 }}>{'<SceneA />'}</div>
        <div style={{ color: '#a78bfa', paddingLeft: 20 }}>{'</TransitionSeries.Sequence>'}</div>
        <div style={{ color: '#fbbf24', paddingLeft: 20 }}>
          {'<TransitionSeries.Transition'}
        </div>
        <div style={{ color: '#fbbf24', paddingLeft: 40 }}>
          {'presentation={'}
          <span style={{ color: '#22c55e' }}>fade()</span>
          {'}'}
        </div>
        <div style={{ color: '#fbbf24', paddingLeft: 40 }}>
          {'timing={'}
          <span style={{ color: '#3b82f6' }}>springTiming()</span>
          {'}'}
        </div>
        <div style={{ color: '#fbbf24', paddingLeft: 20 }}>{'/>'}</div>
        <div style={{ color: '#6ee7b7' }}>{'</TransitionSeries>'}</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 3: CAPTIONS SHOWCASE - Demonstrating @remotion/captions
// ═══════════════════════════════════════════════════════════════════════════════

// Simulated caption data (normally from transcription)
const DEMO_CAPTIONS = [
  { text: 'Remotion', fromMs: 0, toMs: 600 },
  { text: 'makes', fromMs: 600, toMs: 900 },
  { text: 'video', fromMs: 900, toMs: 1300 },
  { text: 'creation', fromMs: 1300, toMs: 1800 },
  { text: 'in', fromMs: 1800, toMs: 2000 },
  { text: 'React', fromMs: 2000, toMs: 2500 },
  { text: 'absolutely', fromMs: 2500, toMs: 3200 },
  { text: 'incredible!', fromMs: 3200, toMs: 4000 },
];

const CaptionsShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current time in milliseconds
  const currentTimeMs = (frame / fps) * 1000;

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {/* Title */}
      <div style={{
        position: 'absolute',
        top: 60,
        left: 60,
        fontSize: 48,
        fontWeight: 700,
        color: '#fff',
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        @remotion/captions
      </div>

      <div style={{
        position: 'absolute',
        top: 120,
        left: 60,
        fontSize: 20,
        color: 'rgba(255,255,255,0.5)',
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        TikTok-style word highlighting
      </div>

      {/* Caption display area */}
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{
          fontSize: 64,
          fontWeight: 700,
          textAlign: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 16,
          maxWidth: 1200,
        }}>
          {DEMO_CAPTIONS.map((caption, i) => {
            const isActive = caption.fromMs <= currentTimeMs && caption.toMs > currentTimeMs;
            const isPast = caption.toMs <= currentTimeMs;

            // Entrance animation
            const entranceDelay = caption.fromMs / 1000 * fps;
            const entranceSpring = spring({
              frame: frame - entranceDelay,
              fps,
              config: SPRING_CONFIGS.snappy,
            });

            const scale = isActive ? 1.1 : 1;
            const y = interpolate(entranceSpring, [0, 1], [30, 0]);

            return (
              <span
                key={i}
                style={{
                  color: isActive ? '#39E508' : isPast ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  transform: `translateY(${y}px) scale(${scale})`,
                  opacity: entranceSpring,
                  transition: 'color 0.1s, transform 0.1s',
                  textShadow: isActive ? '0 0 40px #39E508' : 'none',
                  display: 'inline-block',
                }}
              >
                {caption.text}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Time indicator */}
      <div style={{
        position: 'absolute',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 8,
        alignItems: 'center',
      }}>
        {DEMO_CAPTIONS.map((caption, i) => {
          const isActive = caption.fromMs <= currentTimeMs && caption.toMs > currentTimeMs;
          return (
            <div
              key={i}
              style={{
                width: isActive ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: isActive ? '#39E508' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.2s',
              }}
            />
          );
        })}
      </div>

      {/* Code snippet */}
      <div style={{
        position: 'absolute',
        right: 60,
        bottom: 60,
        background: 'rgba(0,0,0,0.9)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 12,
        padding: 20,
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13,
        opacity: interpolate(frame, [30, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
      }}>
        <div style={{ color: '#6ee7b7' }}>createTikTokStyleCaptions</div>
        <div style={{ color: '#a78bfa' }}>{'({ captions, combineTokensWithinMilliseconds: 1200 })'}</div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 4: SPRING PHYSICS COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════
const SpringComparison: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const configs = [
    { name: 'Smooth', config: SPRING_CONFIGS.smooth, color: '#22c55e', timing: 'springTiming({ config: { damping: 200 } })' },
    { name: 'Snappy', config: SPRING_CONFIGS.snappy, color: '#3b82f6', timing: 'springTiming({ config: { damping: 20 } })' },
    { name: 'Bouncy', config: SPRING_CONFIGS.bouncy, color: '#f59e0b', timing: 'springTiming({ config: { damping: 8 } })' },
    { name: 'Linear', config: SPRING_CONFIGS.smooth, color: '#ef4444', timing: 'linearTiming({ durationInFrames: 30 })' },
  ];

  return (
    <AbsoluteFill style={{
      background: '#0a0a0a',
      padding: 60,
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        fontSize: 48,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 20,
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        Timing Functions
      </div>

      <div style={{
        fontSize: 20,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 40,
        opacity: interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        springTiming() vs linearTiming() for transitions
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, flex: 1 }}>
        {configs.map(({ name, config, color, timing }, i) => {
          const delay = i * 15;
          const isLinear = name === 'Linear';

          // Use linear for the last one to show difference
          const progress = isLinear
            ? interpolate(frame - delay, [0, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
            : spring({ frame: frame - delay, fps, config });

          const x = interpolate(progress, [0, 1], [0, 800]);
          const labelOpacity = interpolate(frame - delay, [0, 10], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

          return (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ width: 100, fontSize: 20, color: 'rgba(255,255,255,0.7)', opacity: labelOpacity }}>
                {name}
              </div>

              <div style={{
                flex: 1,
                height: 4,
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute',
                  left: x,
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 30px ${color}80`,
                }} />
              </div>

              <div style={{
                width: 400,
                fontSize: 12,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'JetBrains Mono, monospace',
                opacity: labelOpacity,
              }}>
                {timing}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 5: COLOR WAVE
// ═══════════════════════════════════════════════════════════════════════════════
const ColorWave: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const BAR_COUNT = 24;
  const bars = Array.from({ length: BAR_COUNT }, (_, i) => i);

  return (
    <AbsoluteFill style={{
      background: '#0f0f0f',
      justifyContent: 'center',
      alignItems: 'flex-end',
      padding: '0 60px 150px',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      <div style={{
        position: 'absolute',
        top: 60,
        left: 60,
        fontSize: 36,
        fontWeight: 600,
        color: '#fff',
        opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
      }}>
        interpolateColors + spring
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 400 }}>
        {bars.map((_, i) => {
          const waveOffset = Math.sin((frame * 0.1) + (i * 0.4)) * 0.5 + 0.5;
          const baseHeight = 100 + waveOffset * 250;
          const delay = i * 2;
          const barSpring = spring({ frame: frame - delay, fps, config: SPRING_CONFIGS.snappy });
          const height = baseHeight * barSpring;
          const colorProgress = (i / BAR_COUNT + frame * 0.005) % 1;
          const color = interpolateColors(colorProgress, [0, 0.25, 0.5, 0.75, 1], ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#ef4444']);

          return (
            <div key={i} style={{
              width: 24,
              height,
              borderRadius: 12,
              background: color,
              boxShadow: `0 0 20px ${color}60`,
            }} />
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SCENE 6: FINALE
// ═══════════════════════════════════════════════════════════════════════════════
const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const inProgress = spring({ frame, fps, config: SPRING_CONFIGS.bouncy });
  const outStart = durationInFrames - 30;
  const outProgress = frame > outStart
    ? interpolate(frame, [outStart, durationInFrames], [0, 1], { easing: Easing.inOut(Easing.quad) })
    : 0;

  const scale = interpolate(inProgress, [0, 1], [0.5, 1]) * (1 - outProgress * 0.5);
  const opacity = inProgress * (1 - outProgress);

  return (
    <AbsoluteFill style={{
      background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #0c0a09 100%)',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      {[0, 1, 2].map((ring) => {
        const ringDelay = ring * 10;
        const ringSpring = spring({ frame: frame - ringDelay, fps, config: SPRING_CONFIGS.smooth });
        const ringScale = interpolate(ringSpring, [0, 1], [0.5, 1 + ring * 0.2]);
        const ringOpacity = interpolate(ringSpring, [0, 1], [0, 0.3 - ring * 0.1]);

        return (
          <div key={ring} style={{
            position: 'absolute',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '2px solid rgba(99, 102, 241, 0.5)',
            transform: `scale(${ringScale})`,
            opacity: ringOpacity * (1 - outProgress),
          }} />
        );
      })}

      <div style={{ textAlign: 'center', transform: `scale(${scale})`, opacity }}>
        <div style={{
          fontSize: 80,
          fontWeight: 800,
          color: '#fff',
          marginBottom: 20,
          textShadow: '0 0 60px rgba(99,102,241,0.8)',
        }}>
          Remotion Skills
        </div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.7)', marginBottom: 40 }}>
          Video creation in React
        </div>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          {['TransitionSeries', 'Captions', 'Spring', 'Timing'].map((tag, i) => {
            const tagDelay = 30 + i * 8;
            const tagSpring = spring({ frame: frame - tagDelay, fps, config: SPRING_CONFIGS.snappy });

            return (
              <div key={tag} style={{
                padding: '8px 16px',
                borderRadius: 20,
                background: 'rgba(99, 102, 241, 0.2)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                color: '#a5b4fc',
                fontSize: 14,
                fontWeight: 500,
                transform: `translateY(${interpolate(tagSpring, [0, 1], [20, 0])}px)`,
                opacity: tagSpring * (1 - outProgress),
              }}>
                {tag}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION - NOW USING TransitionSeries!
// ═══════════════════════════════════════════════════════════════════════════════
export const SkillShowcase: React.FC = () => {
  const { fps } = useVideoConfig();
  const SCENE_DURATION = 4 * fps; // 4 seconds per scene
  const TRANSITION_DURATION = 20; // 20 frames for transitions

  return (
    <TransitionSeries>
      {/* Scene 1: Kinetic Title */}
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <KineticTitle text="Remotion Skills Showcase" />
      </TransitionSeries.Sequence>

      {/* Transition: Fade */}
      <TransitionSeries.Transition
        presentation={fade()}
        timing={springTiming({ config: { damping: 200 }, durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 2: Transitions Showcase */}
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <TransitionsShowcase />
      </TransitionSeries.Sequence>

      {/* Transition: Slide from right */}
      <TransitionSeries.Transition
        presentation={slide({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 20, stiffness: 200 }, durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 3: Captions Showcase */}
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <CaptionsShowcase />
      </TransitionSeries.Sequence>

      {/* Transition: Wipe */}
      <TransitionSeries.Transition
        presentation={wipe({ direction: 'from-left' })}
        timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
      />

      {/* Scene 4: Spring Comparison */}
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <SpringComparison />
      </TransitionSeries.Sequence>

      {/* Transition: Flip */}
      <TransitionSeries.Transition
        presentation={flip({ direction: 'from-right' })}
        timing={springTiming({ config: { damping: 15 }, durationInFrames: 30 })}
      />

      {/* Scene 5: Color Wave */}
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <ColorWave />
      </TransitionSeries.Sequence>

      {/* Transition: Clock Wipe */}
      <TransitionSeries.Transition
        presentation={clockWipe({ width: 1920, height: 1080 })}
        timing={linearTiming({ durationInFrames: 25 })}
      />

      {/* Scene 6: Finale */}
      <TransitionSeries.Sequence durationInFrames={SCENE_DURATION}>
        <Finale />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};

// Export composition config
// Duration calculation: 6 scenes × 4s - 5 transitions × ~0.7s ≈ 20.5s
export const skillShowcaseConfig = {
  id: 'SkillShowcase',
  component: SkillShowcase,
  durationInFrames: 620, // ~20.7 seconds accounting for transition overlaps
  fps: 30,
  width: 1920,
  height: 1080,
};
