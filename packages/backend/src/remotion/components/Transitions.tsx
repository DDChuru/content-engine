/**
 * Transitions.tsx - Professional Video Transition Effects
 *
 * A comprehensive library of video transitions for Remotion compositions.
 * These transitions can be used between scenes, slides, or any video segments.
 */

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

// ============================================
// TRANSITION TYPES
// ============================================

export type TransitionType =
  | 'fade'
  | 'fadeToBlack'
  | 'fadeToWhite'
  | 'slideLeft'
  | 'slideRight'
  | 'slideUp'
  | 'slideDown'
  | 'zoomIn'
  | 'zoomOut'
  | 'wipeLeft'
  | 'wipeRight'
  | 'wipeUp'
  | 'wipeDown'
  | 'wipeDiagonal'
  | 'circleWipe'
  | 'dissolve'
  | 'blur'
  | 'pixelate'
  | 'crossZoom';

export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'bounce' | 'elastic';

export interface TransitionConfig {
  type: TransitionType;
  duration: number;  // in frames
  easing?: EasingType;
  color?: string;    // for fade transitions
  direction?: 'in' | 'out';
}

// ============================================
// EASING FUNCTIONS
// ============================================

const getEasing = (type: EasingType = 'easeInOut') => {
  switch (type) {
    case 'linear': return Easing.linear;
    case 'easeIn': return Easing.in(Easing.cubic);
    case 'easeOut': return Easing.out(Easing.cubic);
    case 'easeInOut': return Easing.inOut(Easing.cubic);
    case 'bounce': return Easing.bounce;
    case 'elastic': return Easing.elastic(1);
    default: return Easing.inOut(Easing.cubic);
  }
};

// ============================================
// BASE TRANSITION COMPONENT
// ============================================

export interface BaseTransitionProps {
  duration?: number;
  easing?: EasingType;
  direction?: 'in' | 'out';
  children?: React.ReactNode;
}

// ============================================
// FADE TRANSITIONS
// ============================================

export const FadeToColor: React.FC<BaseTransitionProps & { color?: string }> = ({
  duration = 15,
  easing = 'easeInOut',
  color = '#000000',
  direction = 'in'
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: color, opacity }} />
  );
};

export const CrossDissolve: React.FC<BaseTransitionProps & {
  fromContent: React.ReactNode;
  toContent: React.ReactNode;
}> = ({ duration = 30, easing = 'easeInOut', fromContent, toContent }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  return (
    <>
      <AbsoluteFill style={{ opacity: 1 - progress }}>
        {fromContent}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: progress }}>
        {toContent}
      </AbsoluteFill>
    </>
  );
};

// ============================================
// SLIDE TRANSITIONS
// ============================================

type SlideDirection = 'left' | 'right' | 'up' | 'down';

export const SlideTransition: React.FC<BaseTransitionProps & {
  slideDirection: SlideDirection;
  content: React.ReactNode;
  backgroundColor?: string;
}> = ({
  duration = 20,
  easing = 'easeOut',
  slideDirection,
  content,
  backgroundColor = 'transparent',
  direction = 'in'
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const getOffset = () => {
    switch (slideDirection) {
      case 'left': return { x: direction === 'in' ? width : 0, y: 0 };
      case 'right': return { x: direction === 'in' ? -width : 0, y: 0 };
      case 'up': return { x: 0, y: direction === 'in' ? height : 0 };
      case 'down': return { x: 0, y: direction === 'in' ? -height : 0 };
    }
  };

  const offset = getOffset();

  const translateX = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [offset.x, 0] : [0, -offset.x],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  const translateY = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [offset.y, 0] : [0, -offset.y],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      <AbsoluteFill style={{ transform: `translate(${translateX}px, ${translateY}px)` }}>
        {content}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// ZOOM TRANSITIONS
// ============================================

export const ZoomTransition: React.FC<BaseTransitionProps & {
  zoomType: 'in' | 'out';
  content: React.ReactNode;
  maxScale?: number;
}> = ({
  duration = 25,
  easing = 'easeInOut',
  zoomType,
  content,
  maxScale = 1.5,
  direction = 'in'
}) => {
  const frame = useCurrentFrame();

  const scale = interpolate(
    frame,
    [0, duration],
    zoomType === 'in'
      ? (direction === 'in' ? [0, 1] : [1, maxScale])
      : (direction === 'in' ? [maxScale, 1] : [1, 0]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  const opacity = interpolate(
    frame,
    [0, duration * 0.3, duration],
    direction === 'in' ? [0, 1, 1] : [1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{
      transform: `scale(${scale})`,
      opacity,
      transformOrigin: 'center center'
    }}>
      {content}
    </AbsoluteFill>
  );
};

// ============================================
// WIPE TRANSITIONS
// ============================================

export const WipeTransition: React.FC<BaseTransitionProps & {
  wipeDirection: 'left' | 'right' | 'up' | 'down' | 'diagonal';
  content: React.ReactNode;
  backgroundColor?: string;
}> = ({
  duration = 20,
  easing = 'easeInOut',
  wipeDirection,
  content,
  backgroundColor = '#000000',
  direction = 'in'
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  const getClipPath = () => {
    const p = progress * 100;
    switch (wipeDirection) {
      case 'left': return `inset(0 ${100 - p}% 0 0)`;
      case 'right': return `inset(0 0 0 ${100 - p}%)`;
      case 'up': return `inset(${100 - p}% 0 0 0)`;
      case 'down': return `inset(0 0 ${100 - p}% 0)`;
      case 'diagonal': return `polygon(0 0, ${p * 2}% 0, 0 ${p * 2}%)`;
    }
  };

  return (
    <>
      <AbsoluteFill style={{ backgroundColor }} />
      <AbsoluteFill style={{ clipPath: getClipPath() }}>
        {content}
      </AbsoluteFill>
    </>
  );
};

// ============================================
// CIRCLE WIPE (IRIS)
// ============================================

export const CircleWipe: React.FC<BaseTransitionProps & {
  content: React.ReactNode;
  backgroundColor?: string;
  centerX?: number;  // 0-100 percent
  centerY?: number;  // 0-100 percent
}> = ({
  duration = 25,
  easing = 'easeInOut',
  content,
  backgroundColor = '#000000',
  centerX = 50,
  centerY = 50,
  direction = 'in'
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  // Calculate radius to cover full screen from center point
  const maxRadius = Math.sqrt(
    Math.pow(Math.max(centerX, 100 - centerX), 2) +
    Math.pow(Math.max(centerY, 100 - centerY), 2)
  ) * 1.5;

  const radius = progress * maxRadius;

  return (
    <>
      <AbsoluteFill style={{ backgroundColor }} />
      <AbsoluteFill style={{
        clipPath: `circle(${radius}% at ${centerX}% ${centerY}%)`
      }}>
        {content}
      </AbsoluteFill>
    </>
  );
};

// ============================================
// BLUR TRANSITION
// ============================================

export const BlurTransition: React.FC<BaseTransitionProps & {
  content: React.ReactNode;
  maxBlur?: number;
}> = ({
  duration = 20,
  easing = 'easeInOut',
  content,
  maxBlur = 20,
  direction = 'in'
}) => {
  const frame = useCurrentFrame();

  const blur = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [maxBlur, 0] : [0, maxBlur],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  const opacity = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{
      filter: `blur(${blur}px)`,
      opacity
    }}>
      {content}
    </AbsoluteFill>
  );
};

// ============================================
// CROSS ZOOM (Ken Burns style)
// ============================================

export const CrossZoom: React.FC<BaseTransitionProps & {
  fromContent: React.ReactNode;
  toContent: React.ReactNode;
  intensity?: number;
}> = ({
  duration = 30,
  easing = 'easeInOut',
  fromContent,
  toContent,
  intensity = 1.3
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: getEasing(easing) }
  );

  const fromScale = interpolate(progress, [0, 1], [1, intensity]);
  const toScale = interpolate(progress, [0, 1], [1 / intensity, 1]);

  const fromOpacity = interpolate(progress, [0, 0.5], [1, 0], { extrapolateRight: 'clamp' });
  const toOpacity = interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' });

  const blur = interpolate(
    progress,
    [0, 0.5, 1],
    [0, 8, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      <AbsoluteFill style={{
        transform: `scale(${fromScale})`,
        opacity: fromOpacity,
        filter: `blur(${blur}px)`,
        transformOrigin: 'center center'
      }}>
        {fromContent}
      </AbsoluteFill>
      <AbsoluteFill style={{
        transform: `scale(${toScale})`,
        opacity: toOpacity,
        filter: `blur(${blur}px)`,
        transformOrigin: 'center center'
      }}>
        {toContent}
      </AbsoluteFill>
    </>
  );
};

// ============================================
// GLITCH TRANSITION
// ============================================

export const GlitchTransition: React.FC<BaseTransitionProps & {
  content: React.ReactNode;
}> = ({
  duration = 15,
  content,
  direction = 'in'
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(
    frame,
    [0, duration],
    direction === 'in' ? [0, 1] : [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Glitch offset varies based on frame
  const glitchX = Math.sin(frame * 2.5) * (1 - progress) * 20;
  const glitchY = Math.cos(frame * 3.2) * (1 - progress) * 10;

  // RGB split effect
  const rgbOffset = (1 - progress) * 10;

  return (
    <AbsoluteFill>
      {/* Red channel offset */}
      <AbsoluteFill style={{
        transform: `translate(${glitchX - rgbOffset}px, ${glitchY}px)`,
        opacity: progress * 0.5,
        mixBlendMode: 'screen',
        filter: 'url(#redChannel)'
      }}>
        {content}
      </AbsoluteFill>

      {/* Main content */}
      <AbsoluteFill style={{
        transform: `translate(${glitchX}px, ${glitchY}px)`,
        opacity: progress
      }}>
        {content}
      </AbsoluteFill>

      {/* Blue channel offset */}
      <AbsoluteFill style={{
        transform: `translate(${glitchX + rgbOffset}px, ${glitchY}px)`,
        opacity: progress * 0.5,
        mixBlendMode: 'screen',
        filter: 'url(#blueChannel)'
      }}>
        {content}
      </AbsoluteFill>

      {/* SVG filters for RGB separation */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="redChannel">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="blueChannel">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================
// UNIVERSAL TRANSITION WRAPPER
// ============================================

export interface TransitionProps {
  type: TransitionType;
  duration?: number;
  easing?: EasingType;
  direction?: 'in' | 'out';
  color?: string;
  content?: React.ReactNode;
  fromContent?: React.ReactNode;
  toContent?: React.ReactNode;
}

export const Transition: React.FC<TransitionProps> = ({
  type,
  duration = 20,
  easing = 'easeInOut',
  direction = 'in',
  color = '#000000',
  content,
  fromContent,
  toContent
}) => {
  const props = { duration, easing, direction };

  switch (type) {
    case 'fade':
    case 'fadeToBlack':
      return <FadeToColor {...props} color="#000000" />;
    case 'fadeToWhite':
      return <FadeToColor {...props} color="#ffffff" />;
    case 'slideLeft':
      return <SlideTransition {...props} slideDirection="left" content={content} />;
    case 'slideRight':
      return <SlideTransition {...props} slideDirection="right" content={content} />;
    case 'slideUp':
      return <SlideTransition {...props} slideDirection="up" content={content} />;
    case 'slideDown':
      return <SlideTransition {...props} slideDirection="down" content={content} />;
    case 'zoomIn':
      return <ZoomTransition {...props} zoomType="in" content={content} />;
    case 'zoomOut':
      return <ZoomTransition {...props} zoomType="out" content={content} />;
    case 'wipeLeft':
      return <WipeTransition {...props} wipeDirection="left" content={content} backgroundColor={color} />;
    case 'wipeRight':
      return <WipeTransition {...props} wipeDirection="right" content={content} backgroundColor={color} />;
    case 'wipeUp':
      return <WipeTransition {...props} wipeDirection="up" content={content} backgroundColor={color} />;
    case 'wipeDown':
      return <WipeTransition {...props} wipeDirection="down" content={content} backgroundColor={color} />;
    case 'wipeDiagonal':
      return <WipeTransition {...props} wipeDirection="diagonal" content={content} backgroundColor={color} />;
    case 'circleWipe':
      return <CircleWipe {...props} content={content} backgroundColor={color} />;
    case 'dissolve':
      return fromContent && toContent
        ? <CrossDissolve {...props} fromContent={fromContent} toContent={toContent} />
        : <FadeToColor {...props} color="transparent" />;
    case 'blur':
      return <BlurTransition {...props} content={content} />;
    case 'crossZoom':
      return fromContent && toContent
        ? <CrossZoom {...props} fromContent={fromContent} toContent={toContent} />
        : <ZoomTransition {...props} zoomType="in" content={content} />;
    default:
      return <FadeToColor {...props} color="#000000" />;
  }
};

// ============================================
// EXPORT ALL
// ============================================

// Named exports for convenience (CrossZoom already exported above)
export {
  FadeToColor as Fade,
  SlideTransition as Slide,
  ZoomTransition as Zoom,
  WipeTransition as Wipe,
  CircleWipe as Iris,
  BlurTransition as Blur,
  CrossDissolve as Dissolve,
  GlitchTransition as Glitch
};
