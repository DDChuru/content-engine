/**
 * PointerOverlay Component
 *
 * Renders an animated pointer overlay for educational videos.
 * Uses recorded pointer movement data from the Whiteboard Recorder tool.
 *
 * Usage:
 * 1. Record pointer movements using whiteboard-recorder.html
 * 2. Export the JSON file
 * 3. Import the data and pass to this component
 *
 * Example:
 * ```tsx
 * import pointerData from './recordings/my-recording.json';
 *
 * <PointerOverlay
 *   movements={pointerData.movements}
 *   style="circle"
 *   color="#ffd700"
 *   size={30}
 * />
 * ```
 */

import React, { useMemo } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

export interface PointerMovement {
  x: number;  // Relative X position (0-1)
  y: number;  // Relative Y position (0-1)
  t: number;  // Time in milliseconds from start
}

export interface PointerOverlayProps {
  movements: PointerMovement[];
  style?: 'circle' | 'dot' | 'crosshair' | 'spotlight';
  color?: string;
  size?: number;
  opacity?: number;
  smoothing?: number;  // Number of frames to smooth over
  startFrame?: number; // Frame offset to start the animation
  showTrail?: boolean; // Show trailing path
  trailLength?: number; // Number of points in trail
}

export const PointerOverlay: React.FC<PointerOverlayProps> = ({
  movements,
  style = 'circle',
  color = '#ffd700',
  size = 30,
  opacity = 0.8,
  smoothing = 2,
  startFrame = 0,
  showTrail = false,
  trailLength = 10,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Convert frame to time in milliseconds
  const currentTime = useMemo(() => {
    const adjustedFrame = Math.max(0, frame - startFrame);
    return (adjustedFrame / fps) * 1000;
  }, [frame, fps, startFrame]);

  // Find current position based on time
  const currentPosition = useMemo(() => {
    if (movements.length === 0) return null;
    if (frame < startFrame) return null;

    // Find the two movements we're between
    let prevIndex = 0;
    for (let i = 0; i < movements.length; i++) {
      if (movements[i].t <= currentTime) {
        prevIndex = i;
      } else {
        break;
      }
    }

    const nextIndex = Math.min(prevIndex + 1, movements.length - 1);
    const prev = movements[prevIndex];
    const next = movements[nextIndex];

    // If we're past the recording, stay at last position
    if (currentTime > movements[movements.length - 1].t) {
      const last = movements[movements.length - 1];
      return { x: last.x * width, y: last.y * height };
    }

    // Interpolate between positions
    const timeDiff = next.t - prev.t;
    const progress = timeDiff > 0 ? (currentTime - prev.t) / timeDiff : 0;

    const x = interpolate(progress, [0, 1], [prev.x, next.x], {
      easing: Easing.linear,
    }) * width;

    const y = interpolate(progress, [0, 1], [prev.y, next.y], {
      easing: Easing.linear,
    }) * height;

    return { x, y };
  }, [movements, currentTime, width, height, frame, startFrame]);

  // Get trail positions
  const trailPositions = useMemo(() => {
    if (!showTrail || movements.length === 0 || frame < startFrame) return [];

    const positions: Array<{ x: number; y: number; opacity: number }> = [];
    const endIndex = movements.findIndex(m => m.t > currentTime);
    const startIndex = Math.max(0, endIndex - trailLength);

    for (let i = startIndex; i < endIndex && i < movements.length; i++) {
      const progress = (i - startIndex) / trailLength;
      positions.push({
        x: movements[i].x * width,
        y: movements[i].y * height,
        opacity: progress * 0.5,
      });
    }

    return positions;
  }, [movements, currentTime, showTrail, trailLength, width, height, frame, startFrame]);

  if (!currentPosition) return null;

  // Pointer styles
  const getPointerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: currentPosition.x,
      top: currentPosition.y,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 1000,
    };

    switch (style) {
      case 'circle':
        return {
          ...baseStyle,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: hexToRgba(color, 0.4 * opacity),
          border: `3px solid ${color}`,
          boxShadow: `0 0 ${size}px ${hexToRgba(color, 0.5 * opacity)}`,
        };

      case 'dot':
        return {
          ...baseStyle,
          width: size / 2.5,
          height: size / 2.5,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 ${size / 2}px ${hexToRgba(color, 0.8 * opacity)}`,
        };

      case 'crosshair':
        return {
          ...baseStyle,
          width: size,
          height: size,
          borderRadius: 0,
          backgroundColor: 'transparent',
          border: `2px solid ${color}`,
        };

      case 'spotlight':
        return {
          ...baseStyle,
          width: size * 3,
          height: size * 3,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${hexToRgba(color, 0)} 0%, ${hexToRgba(color, 0)} 30%, ${hexToRgba('#000', 0.7 * opacity)} 100%)`,
          mixBlendMode: 'multiply' as const,
        };

      default:
        return baseStyle;
    }
  };

  return (
    <>
      {/* Trail */}
      {showTrail && trailPositions.map((pos, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            transform: 'translate(-50%, -50%)',
            width: size / 4,
            height: size / 4,
            borderRadius: '50%',
            backgroundColor: color,
            opacity: pos.opacity,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Main pointer */}
      <div style={getPointerStyle()}>
        {style === 'crosshair' && (
          <>
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: 0,
                transform: 'translateX(-50%)',
                width: 2,
                height: '100%',
                backgroundColor: color,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                transform: 'translateY(-50%)',
                width: '100%',
                height: 2,
                backgroundColor: color,
              }}
            />
          </>
        )}
      </div>
    </>
  );
};

// Helper function
function hexToRgba(hex: string, alpha: number): string {
  // Handle rgba input
  if (hex.startsWith('rgba')) return hex;
  if (hex.startsWith('rgb')) {
    return hex.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }

  // Handle hex input
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(255, 215, 0, ${alpha})`;

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Animated Pointer that follows a predefined path
 * Useful for highlighting specific areas of a whiteboard
 */
export interface AnimatedPointerProps {
  points: Array<{ x: number; y: number; pauseFrames?: number }>;
  style?: 'circle' | 'dot' | 'crosshair';
  color?: string;
  size?: number;
  framesPerSegment?: number;
}

export const AnimatedPointer: React.FC<AnimatedPointerProps> = ({
  points,
  style = 'circle',
  color = '#ffd700',
  size = 30,
  framesPerSegment = 30,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const currentPosition = useMemo(() => {
    if (points.length === 0) return null;
    if (points.length === 1) {
      return { x: points[0].x * width, y: points[0].y * height };
    }

    let totalFrames = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const segmentFrames = framesPerSegment + (points[i].pauseFrames || 0);

      if (frame < totalFrames + segmentFrames) {
        const localFrame = frame - totalFrames;
        const pauseFrames = points[i].pauseFrames || 0;

        // During pause
        if (localFrame < pauseFrames) {
          return { x: points[i].x * width, y: points[i].y * height };
        }

        // During movement
        const moveFrame = localFrame - pauseFrames;
        const progress = moveFrame / framesPerSegment;

        const x = interpolate(progress, [0, 1], [points[i].x, points[i + 1].x], {
          easing: Easing.inOut(Easing.ease),
        }) * width;

        const y = interpolate(progress, [0, 1], [points[i].y, points[i + 1].y], {
          easing: Easing.inOut(Easing.ease),
        }) * height;

        return { x, y };
      }

      totalFrames += segmentFrames;
    }

    // Past end - stay at last point
    const last = points[points.length - 1];
    return { x: last.x * width, y: last.y * height };
  }, [points, frame, width, height, framesPerSegment]);

  if (!currentPosition) return null;

  const getPointerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: currentPosition.x,
      top: currentPosition.y,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 1000,
    };

    switch (style) {
      case 'circle':
        return {
          ...baseStyle,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: hexToRgba(color, 0.4),
          border: `3px solid ${color}`,
          boxShadow: `0 0 ${size}px ${hexToRgba(color, 0.5)}`,
        };

      case 'dot':
        return {
          ...baseStyle,
          width: size / 2.5,
          height: size / 2.5,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 ${size / 2}px ${hexToRgba(color, 0.8)}`,
        };

      case 'crosshair':
        return {
          ...baseStyle,
          width: size,
          height: size,
          borderRadius: 0,
          backgroundColor: 'transparent',
          border: `2px solid ${color}`,
        };

      default:
        return baseStyle;
    }
  };

  return <div style={getPointerStyle()} />;
};

export default PointerOverlay;
