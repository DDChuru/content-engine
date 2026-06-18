/**
 * BakeryTrainingScene — Narration-cue-driven bakery training composition
 *
 * All visual timing is driven by Whisper word-level timestamps from the scene map.
 * Each scene's visibility is controlled by startCue/endCue (seconds).
 * Each text layer animates in at enterAt and out at exitAt (seconds).
 * Scenes are rendered simultaneously with absolute positioning — no TransitionSeries.
 *
 * v2 — Premium visual upgrade: neon glow, animated backgrounds, varied text entrances,
 *       partner badge grid, roadmap flow, enhanced recap slide.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from 'remotion';

// ══════════════════════════════════════════════════════════════════════════
// TYPES
// ══════════════════════════════════════════════════════════════════════════

export interface TextLayer {
  text: string;
  style:
    | 'badge'
    | 'title'
    | 'subtitle'
    | 'headline'
    | 'body'
    | 'quote'
    | 'accent'
    | 'accent_large'
    | 'warning'
    | 'partner_badge'
    | 'rootcause'
    | 'roadmap_item'
    | 'closing';
  enterAt: number; // seconds
  exitAt: number; // seconds
}

export interface Scene {
  id: string;
  startCue: number; // seconds
  endCue: number; // seconds
  images: string[]; // staticFile paths
  imageTimings?: number[]; // when to switch between multiple images (seconds)
  textLayers: TextLayer[];
  narration?: string;
}

export interface BakeryTrainingProps {
  sectionId: string;
  chapterNumber: number;
  sectionNumber: number;
  chapterTitle: string;
  sectionTitle: string;
  scenes: Scene[];
  audioFile: string;
  durationInFrames: number;
}

// ══════════════════════════════════════════════════════════════════════════
// CONSTANTS & COLOR PALETTE
// ══════════════════════════════════════════════════════════════════════════

const CROSSFADE_FRAMES = 15; // 0.5s crossfade between scenes

const C = {
  accent: '#8b5cf6',
  accentGlow: '#a78bfa',
  warning: '#ef4444',
  warningGlow: '#f87171',
  gold: '#fbbf24',
  success: '#10b981',
  bg: '#0a0a14',
  bgCard: '#1a1a2e',
  text: '#ffffff',
  textMuted: 'rgba(255,255,255,0.7)',
  textDim: 'rgba(255,255,255,0.4)',
};

const FONT_FAMILY =
  "'Inter', 'Segoe UI', 'DejaVu Sans', 'Helvetica Neue', Arial, sans-serif";

// Warning/floor-walk scene IDs that get heavier vignette + red tint
const VIGNETTE_SCENES = new Set([
  'rodent_droppings',
  'flaking_paint',
  'missing_bolt',
  'mould_condensation',
]);

// ══════════════════════════════════════════════════════════════════════════
// TEXT STYLE MAP (base styles — glow/shadow applied dynamically)
// ══════════════════════════════════════════════════════════════════════════

const TEXT_STYLES: Record<TextLayer['style'], React.CSSProperties> = {
  badge: {
    fontSize: 22,
    color: C.accent,
    fontWeight: 700,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 58,
    color: 'white',
    fontWeight: 800,
    lineHeight: 1.15,
  },
  subtitle: {
    fontSize: 24,
    color: C.textMuted,
    fontWeight: 400,
    lineHeight: 1.4,
  },
  headline: {
    fontSize: 40,
    color: C.accent,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  body: {
    fontSize: 34,
    color: 'white',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  quote: {
    fontSize: 30,
    color: 'white',
    fontWeight: 500,
    fontStyle: 'italic',
    borderLeft: `4px solid ${C.accent}`,
    paddingLeft: 20,
    lineHeight: 1.4,
  },
  accent: {
    fontSize: 28,
    color: C.accent,
    fontWeight: 700,
    lineHeight: 1.3,
  },
  accent_large: {
    fontSize: 42,
    color: C.accent,
    fontWeight: 800,
    lineHeight: 1.2,
  },
  warning: {
    fontSize: 36,
    color: C.warning,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: 'uppercase',
    lineHeight: 1.2,
  },
  partner_badge: {
    fontSize: 26,
    color: 'white',
    fontWeight: 600,
    background: `${C.accent}30`,
    padding: '8px 20px',
    borderRadius: 8,
    border: `1px solid ${C.accent}80`,
    display: 'inline-block',
    lineHeight: 1.3,
  },
  rootcause: {
    fontSize: 30,
    color: C.gold,
    fontWeight: 600,
    paddingLeft: 30,
    borderLeft: `3px solid ${C.gold}`,
    lineHeight: 1.3,
  },
  roadmap_item: {
    fontSize: 26,
    color: 'white',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  closing: {
    fontSize: 32,
    color: 'white',
    fontWeight: 500,
    textAlign: 'center',
    lineHeight: 1.6,
  },
};

// ══════════════════════════════════════════════════════════════════════════
// HOOK: useTextAnimation (style-aware entrance effects)
// ══════════════════════════════════════════════════════════════════════════

function useTextAnimation(
  enterAtSeconds: number,
  exitAtSeconds: number,
  style: TextLayer['style'],
  layerIndex: number
) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFrame = enterAtSeconds * fps;
  const exitFrame = exitAtSeconds * fps;

  // Spring entrance
  const entrance = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  // Fade exit
  const exit = interpolate(
    frame,
    [exitFrame - 15, exitFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isVisible = frame >= enterFrame - 5 && frame <= exitFrame + 5;

  // Style-specific entrance variants
  let opacity: number;
  let translateY: number;
  let scale: number;

  switch (style) {
    case 'headline':
    case 'title':
    case 'accent_large': {
      // Scale from 0.95 to 1.0 + fade in
      scale = interpolate(entrance, [0, 1], [0.95, 1.0]);
      opacity = Math.min(interpolate(entrance, [0, 1], [0, 1]), exit);
      translateY = interpolate(entrance, [0, 1], [10, 0]);
      break;
    }
    case 'subtitle': {
      // Fade in only (no slide), delayed slightly
      const delayedEntrance = spring({
        frame: frame - enterFrame - 15,
        fps,
        config: { damping: 200 },
        durationInFrames: 20,
      });
      opacity = Math.min(interpolate(delayedEntrance, [0, 1], [0, 1]), exit);
      translateY = 0;
      scale = 1;
      break;
    }
    case 'warning': {
      // Flash overshoot: opacity goes to 1.2 then settles to 1.0
      const rawOpacity = interpolate(entrance, [0, 0.5, 1], [0, 1.2, 1.0]);
      opacity = Math.min(rawOpacity, exit);
      translateY = interpolate(entrance, [0, 1], [15, 0]);
      scale = 1;
      break;
    }
    case 'closing': {
      // Typewriter reveal — characters appear progressively
      opacity = Math.min(interpolate(entrance, [0, 1], [0, 1]), exit);
      translateY = 0;
      scale = 1;
      break;
    }
    default: {
      // Body, badge, quote, accent, etc.: slide up from 30px + fade
      opacity = Math.min(interpolate(entrance, [0, 1], [0, 1]), exit);
      translateY = interpolate(entrance, [0, 1], [30, 0]);
      scale = 1;
      break;
    }
  }

  // Neon glow pulse for headlines and accent_large
  const glowPulse =
    style === 'headline' || style === 'accent_large' || style === 'title'
      ? 0.6 + Math.sin(frame * 0.08) * 0.4
      : 0;

  // Warning glow pulse
  const warningGlowPulse =
    style === 'warning'
      ? 0.6 + Math.sin(frame * 0.1) * 0.4
      : 0;

  // Typewriter progress for closing style
  const typewriterProgress =
    style === 'closing'
      ? interpolate(
          frame - enterFrame,
          [0, 60],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )
      : 1;

  return {
    opacity,
    translateY,
    scale,
    isVisible,
    glowPulse,
    warningGlowPulse,
    typewriterProgress,
    entrance,
  };
}

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: AnimatedAccentLine
// ══════════════════════════════════════════════════════════════════════════

const AnimatedAccentLine: React.FC<{
  enterAt: number;
  color?: string;
  width?: number;
}> = ({ enterAt, color = C.accent, width = 200 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterFrame = enterAt * fps;
  const entrance = spring({
    frame: frame - enterFrame,
    fps,
    config: { damping: 200 },
    durationInFrames: 25,
  });

  const lineWidth = interpolate(entrance, [0, 1], [0, width]);
  const lineOpacity = interpolate(entrance, [0, 1], [0, 0.8]);

  if (frame < enterFrame - 5) return null;

  return (
    <div
      style={{
        height: 2,
        width: lineWidth,
        background: `linear-gradient(to right, ${color}, ${color}40)`,
        opacity: lineOpacity,
        marginTop: 8,
        marginBottom: 8,
        borderRadius: 1,
        boxShadow: `0 0 8px ${color}40`,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: TextLayerRenderer (with premium effects)
// ══════════════════════════════════════════════════════════════════════════

const TextLayerRenderer: React.FC<{
  layer: TextLayer;
  layerIndex: number;
  isWarningScene: boolean;
}> = ({ layer, layerIndex, isWarningScene }) => {
  const {
    opacity,
    translateY,
    scale,
    isVisible,
    glowPulse,
    warningGlowPulse,
    typewriterProgress,
  } = useTextAnimation(layer.enterAt, layer.exitAt, layer.style, layerIndex);

  if (!isVisible) return null;

  const baseStyle = TEXT_STYLES[layer.style];

  // Build text shadow based on style
  let textShadow = '0 2px 12px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)';

  if (layer.style === 'headline' || layer.style === 'accent_large') {
    // Neon glow on headlines
    const glowColor = isWarningScene ? C.warningGlow : C.accentGlow;
    textShadow = [
      `0 0 ${20 * glowPulse}px ${glowColor}80`,
      `0 0 ${40 * glowPulse}px ${glowColor}40`,
      '0 2px 12px rgba(0,0,0,0.9)',
    ].join(', ');
  } else if (layer.style === 'title') {
    // Softer glow on title
    textShadow = [
      `0 0 ${15 * glowPulse}px ${C.accentGlow}60`,
      `0 0 ${30 * glowPulse}px ${C.accentGlow}30`,
      '0 2px 16px rgba(0,0,0,0.95)',
    ].join(', ');
  } else if (layer.style === 'warning') {
    // Red/amber glow on warnings
    textShadow = [
      `0 0 ${20 * warningGlowPulse}px ${C.warningGlow}80`,
      `0 0 ${40 * warningGlowPulse}px ${C.warning}40`,
      '0 2px 12px rgba(0,0,0,0.9)',
    ].join(', ');
  } else if (layer.style === 'rootcause') {
    // Gold glow on rootcause
    textShadow = `0 0 12px ${C.gold}40, 0 2px 12px rgba(0,0,0,0.9)`;
  }

  // Typewriter effect for closing text
  let displayText = layer.text;
  if (layer.style === 'closing' && typewriterProgress < 1) {
    const charCount = Math.floor(layer.text.length * typewriterProgress);
    displayText = layer.text.slice(0, charCount);
  }

  return (
    <div
      style={{
        fontFamily: FONT_FAMILY,
        textShadow,
        whiteSpace: 'pre-line',
        ...baseStyle,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
      }}
    >
      {displayText}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: PartnerBadgeGrid (2x2 pill badge layout with stagger)
// ══════════════════════════════════════════════════════════════════════════

const PartnerBadgeGrid: React.FC<{
  layers: TextLayer[];
  isWarningScene: boolean;
}> = ({ layers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
        maxWidth: 900,
      }}
    >
      {layers.map((layer, i) => {
        const enterFrame = layer.enterAt * fps;
        const exitFrame = layer.exitAt * fps;

        // Stagger: each badge delays by 0.3s * index
        const staggerDelay = Math.round(i * 0.3 * fps);
        const entrance = spring({
          frame: frame - enterFrame - staggerDelay,
          fps,
          config: { damping: 200 },
          durationInFrames: 20,
        });

        const exit = interpolate(
          frame,
          [exitFrame - 15, exitFrame],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const badgeOpacity = Math.min(
          interpolate(entrance, [0, 1], [0, 1]),
          exit
        );
        const badgeScale = interpolate(entrance, [0, 1], [0.85, 1.0]);
        const badgeY = interpolate(entrance, [0, 1], [20, 0]);

        if (frame < enterFrame - 5 || frame > exitFrame + 5) return null;

        return (
          <div
            key={`badge-${i}`}
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 26,
              color: 'white',
              fontWeight: 600,
              background: `linear-gradient(135deg, ${C.accent}30, ${C.bgCard})`,
              padding: '12px 24px',
              borderRadius: 12,
              border: `1px solid ${C.accent}60`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 12px ${C.accent}20`,
              opacity: badgeOpacity,
              transform: `translateY(${badgeY}px) scale(${badgeScale})`,
              lineHeight: 1.3,
              minWidth: 180,
              textAlign: 'center',
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {layer.text}
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: RoadmapFlow (grid with stagger + connecting dots)
// ══════════════════════════════════════════════════════════════════════════

const RoadmapFlow: React.FC<{
  layers: TextLayer[];
}> = ({ layers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 14,
        justifyContent: 'flex-start',
        maxWidth: 960,
      }}
    >
      {layers.map((layer, i) => {
        const enterFrame = layer.enterAt * fps;
        const exitFrame = layer.exitAt * fps;

        // Stagger: 0.3s between items
        const staggerDelay = Math.round(i * 0.3 * fps);
        const entrance = spring({
          frame: frame - enterFrame - staggerDelay,
          fps,
          config: { damping: 200 },
          durationInFrames: 20,
        });

        const exit = interpolate(
          frame,
          [exitFrame - 15, exitFrame],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const itemOpacity = Math.min(
          interpolate(entrance, [0, 1], [0, 1]),
          exit
        );
        const itemScale = interpolate(entrance, [0, 1], [0.9, 1.0]);
        const itemY = interpolate(entrance, [0, 1], [15, 0]);

        if (frame < enterFrame - 5 || frame > exitFrame + 5) return null;

        return (
          <div
            key={`roadmap-${i}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: itemOpacity,
              transform: `translateY(${itemY}px) scale(${itemScale})`,
            }}
          >
            {/* Connecting dot */}
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: C.accent,
                boxShadow: `0 0 8px ${C.accent}80`,
                flexShrink: 0,
              }}
            />
            {/* Connecting line to next item (not for last) */}
            {i < layers.length - 1 && (
              <div
                style={{
                  position: 'absolute',
                  left: 3,
                  top: '100%',
                  width: 2,
                  height: 14,
                  background: `${C.accent}30`,
                }}
              />
            )}
            <div
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 26,
                color: 'white',
                fontWeight: 500,
                lineHeight: 1.3,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                background: `${C.bgCard}cc`,
                padding: '8px 18px',
                borderRadius: 8,
                border: `1px solid ${C.accent}25`,
              }}
            >
              {layer.text}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: RecapSlide (enhanced with numbered circles + icon bg)
// ══════════════════════════════════════════════════════════════════════════

const RecapSlide: React.FC<{
  layers: TextLayer[];
  isWarningScene: boolean;
}> = ({ layers }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Separate closing text from recap points
  const closingLayers = layers.filter((l) => l.style === 'closing');
  const recapLayers = layers.filter((l) => l.style !== 'closing');

  // Background icon pulse
  const iconPulse = 0.03 + Math.sin(frame * 0.03) * 0.01;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 80,
      }}
    >
      {/* Background graduation cap / checkmark icon */}
      <div
        style={{
          position: 'absolute',
          fontSize: 400,
          color: C.accent,
          opacity: iconPulse,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        &#x1F393;
      </div>

      {/* Recap points with numbered purple circles */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          position: 'relative',
          zIndex: 2,
          maxWidth: 900,
        }}
      >
        {recapLayers.map((layer, i) => {
          const enterFrame2 = layer.enterAt * fps;
          const exitFrame2 = layer.exitAt * fps;

          const entrance = spring({
            frame: frame - enterFrame2,
            fps,
            config: { damping: 200 },
            durationInFrames: 20,
          });

          const exit = interpolate(
            frame,
            [exitFrame2 - 15, exitFrame2],
            [1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
          );

          const layerOpacity = Math.min(
            interpolate(entrance, [0, 1], [0, 1]),
            exit
          );
          const layerY = interpolate(entrance, [0, 1], [25, 0]);

          if (frame < enterFrame2 - 5 || frame > exitFrame2 + 5) return null;

          // Numbered circle for body-style recap points
          const isNumbered = layer.style === 'body' || layer.style === 'accent';

          return (
            <div
              key={`recap-${i}`}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                opacity: layerOpacity,
                transform: `translateY(${layerY}px)`,
              }}
            >
              {isNumbered && (
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${C.accent}, ${C.accentGlow})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    color: 'white',
                    fontFamily: FONT_FAMILY,
                    flexShrink: 0,
                    boxShadow: `0 0 12px ${C.accent}60`,
                    marginTop: 4,
                  }}
                >
                  {i + 1}
                </div>
              )}
              <TextLayerRenderer
                layer={layer}
                layerIndex={i}
                isWarningScene={false}
              />
            </div>
          );
        })}
      </div>

      {/* Closing line — fades in last with subtle glow */}
      {closingLayers.map((layer, i) => {
        const enterFrame3 = layer.enterAt * fps;
        const exitFrame3 = layer.exitAt * fps;

        const entrance = spring({
          frame: frame - enterFrame3,
          fps,
          config: { damping: 200 },
          durationInFrames: 20,
        });

        const exit = interpolate(
          frame,
          [exitFrame3 - 15, exitFrame3],
          [1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        const closingOpacity = Math.min(
          interpolate(entrance, [0, 1], [0, 1]),
          exit
        );
        const closingGlow = 0.4 + Math.sin(frame * 0.06) * 0.3;

        if (frame < enterFrame3 - 5 || frame > exitFrame3 + 5) return null;

        return (
          <div
            key={`closing-${i}`}
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 32,
              color: 'white',
              fontWeight: 500,
              textAlign: 'center',
              lineHeight: 1.6,
              opacity: closingOpacity,
              marginTop: 30,
              position: 'relative',
              zIndex: 2,
              textShadow: [
                `0 0 ${15 * closingGlow}px ${C.accentGlow}60`,
                '0 2px 12px rgba(0,0,0,0.9)',
              ].join(', '),
            }}
          >
            {layer.text}
          </div>
        );
      })}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: AnimatedSceneBg (drifting radial gradient + grid texture)
// ══════════════════════════════════════════════════════════════════════════

const AnimatedSceneBg: React.FC<{
  isWarning: boolean;
}> = ({ isWarning }) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame * 0.008) * 3;
  const driftX = Math.cos(frame * 0.006) * 2;

  const glowColor = isWarning ? `${C.warning}0a` : `${C.accent}08`;

  return (
    <>
      {/* Animated radial gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at ${50 + driftX}% ${40 + drift}%, ${glowColor} 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />
      {/* Faint grid pattern overlay for texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.025,
          backgroundImage: [
            `linear-gradient(${C.text}22 1px, transparent 1px)`,
            `linear-gradient(90deg, ${C.text}22 1px, transparent 1px)`,
          ].join(', '),
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      />
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: KenBurnsImage (single image with motion)
// ══════════════════════════════════════════════════════════════════════════

const KenBurnsImage: React.FC<{
  src: string;
  sceneIndex: number;
  progress: number; // 0-1 progress through scene
  opacity?: number;
}> = ({ src, sceneIndex, progress, opacity = 1 }) => {
  // Alternate Ken Burns direction based on scene index
  const isEven = sceneIndex % 2 === 0;

  let transform: string;
  if (isEven) {
    // Slow zoom in: scale 1.0 -> 1.08
    const scale = interpolate(progress, [0, 1], [1.0, 1.08], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    transform = `scale(${scale})`;
  } else {
    // Slow pan: translateX 0 -> -30px (alternating direction)
    const direction = sceneIndex % 4 === 1 ? -1 : 1;
    const tx = interpolate(progress, [0, 1], [0, 30 * direction], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const scale = 1.05;
    transform = `scale(${scale}) translateX(${tx}px)`;
  }

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transform,
        opacity,
      }}
    />
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: MultiImageRenderer
// ══════════════════════════════════════════════════════════════════════════

const MultiImageRenderer: React.FC<{
  images: string[];
  imageTimings?: number[];
  sceneIndex: number;
  sceneStartCue: number;
  sceneEndCue: number;
}> = ({ images, imageTimings, sceneIndex, sceneStartCue, sceneEndCue }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTime = frame / fps;

  if (images.length === 1 || !imageTimings || imageTimings.length <= 1) {
    // Single image — simple Ken Burns
    const progress = interpolate(
      currentTime,
      [sceneStartCue, sceneEndCue],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    );
    return (
      <KenBurnsImage
        src={images[0]}
        sceneIndex={sceneIndex}
        progress={progress}
      />
    );
  }

  // Multiple images — crossfade between them at imageTimings
  return (
    <>
      {images.map((img, i) => {
        const imgStart = imageTimings[i] ?? sceneStartCue;
        const imgEnd =
          i < images.length - 1
            ? (imageTimings[i + 1] ?? sceneEndCue)
            : sceneEndCue;

        // Crossfade duration: 0.5s
        const fadeInStart = imgStart;
        const fadeInEnd = imgStart + 0.5;
        const fadeOutStart = imgEnd - 0.5;
        const fadeOutEnd = imgEnd;

        // First image fades in instantly
        const fadeIn =
          i === 0
            ? 1
            : interpolate(currentTime, [fadeInStart, fadeInEnd], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

        // Last image stays visible
        const fadeOut =
          i === images.length - 1
            ? 1
            : interpolate(currentTime, [fadeOutStart, fadeOutEnd], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });

        const imgOpacity = Math.min(fadeIn, fadeOut);

        // Progress for Ken Burns within this image's range
        const imgProgress = interpolate(
          currentTime,
          [imgStart, imgEnd],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );

        // Don't render if fully invisible
        if (imgOpacity <= 0) return null;

        return (
          <KenBurnsImage
            key={`${img}-${i}`}
            src={img}
            sceneIndex={sceneIndex + i}
            progress={imgProgress}
            opacity={imgOpacity}
          />
        );
      })}
    </>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// COMPONENT: SceneRenderer (upgraded with premium overlays)
// ══════════════════════════════════════════════════════════════════════════

const SceneRenderer: React.FC<{
  scene: Scene;
  sceneIndex: number;
  nextScene?: Scene;
}> = ({ scene, sceneIndex, nextScene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = scene.startCue * fps;
  const endFrame = scene.endCue * fps;

  // Scene visibility with crossfade overlap
  const fadeIn = interpolate(
    frame,
    [startFrame, startFrame + CROSSFADE_FRAMES],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fadeOut = interpolate(
    frame,
    [endFrame - CROSSFADE_FRAMES, endFrame],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const sceneOpacity = Math.min(fadeIn, fadeOut);

  // Don't render if scene is not active at all (with buffer)
  const buffer = CROSSFADE_FRAMES + 5;
  if (frame < startFrame - buffer || frame > endFrame + buffer) {
    return null;
  }

  // Scene classification
  const isWarningScene = VIGNETTE_SCENES.has(scene.id);
  const hasClosingStyle = scene.textLayers.some((l) => l.style === 'closing');
  const hasPartnerBadges = scene.textLayers.some(
    (l) => l.style === 'partner_badge'
  );
  const hasRoadmapItems = scene.textLayers.some(
    (l) => l.style === 'roadmap_item'
  );

  // Check if this looks like a recap scene (multiple body items + closing)
  const bodyCount = scene.textLayers.filter(
    (l) => l.style === 'body' || l.style === 'accent'
  ).length;
  const isRecapScene = hasClosingStyle && bodyCount >= 2;

  // Determine gradient overlay style
  let gradientOverlay: string;
  if (isWarningScene) {
    // Warning: heavy vignette + subtle red tint
    gradientOverlay = [
      'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%)',
    ].join(', ');
  } else if (hasClosingStyle || isRecapScene) {
    // Center text: radial darkening
    gradientOverlay =
      'radial-gradient(ellipse at center, rgba(10,10,20,0.8) 0%, rgba(10,10,20,0.6) 50%, rgba(10,10,20,0.4) 100%)';
  } else {
    // Standard bottom text: improved gradient
    gradientOverlay =
      'linear-gradient(to top, rgba(10,10,20,0.95) 0%, rgba(10,10,20,0.7) 30%, rgba(10,10,20,0.3) 50%, transparent 70%)';
  }

  // Separate text layers by type for special layouts
  const partnerBadgeLayers = scene.textLayers.filter(
    (l) => l.style === 'partner_badge'
  );
  const roadmapLayers = scene.textLayers.filter(
    (l) => l.style === 'roadmap_item'
  );
  const regularLayers = scene.textLayers.filter(
    (l) => l.style !== 'partner_badge' && l.style !== 'roadmap_item'
  );

  // Find the first headline to place accent line after it
  const headlineIndex = regularLayers.findIndex(
    (l) => l.style === 'headline' || l.style === 'accent_large'
  );

  return (
    <AbsoluteFill style={{ opacity: sceneOpacity }}>
      {/* Background images with Ken Burns */}
      <MultiImageRenderer
        images={scene.images}
        imageTimings={scene.imageTimings}
        sceneIndex={sceneIndex}
        sceneStartCue={scene.startCue}
        sceneEndCue={scene.endCue}
      />

      {/* Gradient overlay for text readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: gradientOverlay,
          zIndex: 1,
        }}
      />

      {/* Warning scene: red tint overlay */}
      {isWarningScene && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at center, rgba(255,0,0,0.05) 0%, transparent 70%)',
            zIndex: 1,
          }}
        />
      )}

      {/* Animated scene background (drifting gradient + grid) */}
      <AnimatedSceneBg isWarning={isWarningScene} />

      {/* Recap slide — special layout */}
      {isRecapScene ? (
        <RecapSlide
          layers={scene.textLayers}
          isWarningScene={isWarningScene}
        />
      ) : (
        /* Standard text layers container */
        <div
          style={{
            position: 'absolute',
            zIndex: 4,
            ...(hasClosingStyle
              ? {
                  // Centered positioning for closing scenes
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 80,
                }
              : {
                  // Bottom-up positioning for all other scenes
                  bottom: 80,
                  left: 80,
                  right: 80,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }),
          }}
        >
          {/* Regular text layers */}
          {regularLayers.map((layer, i) => (
            <React.Fragment key={`${scene.id}-text-${i}`}>
              <TextLayerRenderer
                layer={layer}
                layerIndex={i}
                isWarningScene={isWarningScene}
              />
              {/* Accent line after headline */}
              {i === headlineIndex && headlineIndex >= 0 && (
                <AnimatedAccentLine
                  enterAt={layer.enterAt + 0.2}
                  color={isWarningScene ? C.warning : C.accent}
                  width={180}
                />
              )}
            </React.Fragment>
          ))}

          {/* Partner badge grid (2x2 pills) */}
          {hasPartnerBadges && partnerBadgeLayers.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <PartnerBadgeGrid
                layers={partnerBadgeLayers}
                isWarningScene={isWarningScene}
              />
            </div>
          )}

          {/* Roadmap items (flow grid with dots) */}
          {hasRoadmapItems && roadmapLayers.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <RoadmapFlow layers={roadmapLayers} />
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION
// ══════════════════════════════════════════════════════════════════════════

export const BakeryTrainingScene: React.FC<BakeryTrainingProps> = (props) => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Audio layer */}
      <Audio src={staticFile(props.audioFile)} />

      {/* Render all scenes — each handles its own visibility via useCurrentFrame */}
      {props.scenes.map((scene, i) => (
        <SceneRenderer
          key={scene.id}
          scene={scene}
          sceneIndex={i}
          nextScene={props.scenes[i + 1]}
        />
      ))}
    </AbsoluteFill>
  );
};

// ══════════════════════════════════════════════════════════════════════════
// DURATION HELPER
// ══════════════════════════════════════════════════════════════════════════

export function getBakeryTrainingDuration(
  props: BakeryTrainingProps
): number {
  return props.durationInFrames;
}
