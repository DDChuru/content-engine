/**
 * PhoneFrame — a styled phone bezel showing captured app stills, with a
 * status-bar crop, per-beat crossfade, optional vertical pan/zoom window, and
 * a still→screen coordinate mapper so focus rings land in still-pixel space.
 *
 * Extracted from src/ccv/ccvShared.tsx `Phone` and generalised: stills resolve
 * against a caller-supplied `assetBase` instead of a hard-coded folder, and the
 * still geometry (width/height/status-bar crop) is overridable per video.
 */
import React from 'react';
import { Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import {
  CANVAS,
  CROP_TOP as DEFAULT_CROP_TOP,
  hexToRgb,
  SKY,
  STILL_H as DEFAULT_STILL_H,
  STILL_W as DEFAULT_STILL_W,
} from './palette';

export type StillMapper = {
  sx: (x: number) => number;
  sy: (y: number) => number;
  s: (v: number) => number;
};

export type ShotOverlay = (mapper: StillMapper) => React.ReactNode;

export const PhoneFrame: React.FC<{
  x: number;
  y: number;
  height: number;
  /** Asset base the shot paths resolve against, e.g. "ccv-tutorial". */
  assetBase: string;
  /** Cross-fading stack of stills (paths relative to assetBase, e.g. "shots/x.png"). */
  shots: Array<{ src: string; opacity: number }>;
  /** Vertical pan in still px (0 = status-bar crop top). */
  pan?: number;
  /** Visible still-height in still px (< stillH-cropTop zooms in, makes pan meaningful). */
  window?: number;
  tilt?: number;
  /** 0..1 entrance: slides up + fades. */
  entrance?: number;
  overlay?: ShotOverlay;
  stillWidth?: number;
  stillHeight?: number;
  cropTop?: number;
}> = ({
  x,
  y,
  height,
  assetBase,
  shots,
  pan = 0,
  window: visibleWindow,
  tilt = 0,
  entrance = 1,
  overlay,
  stillWidth = DEFAULT_STILL_W,
  stillHeight = DEFAULT_STILL_H,
  cropTop = DEFAULT_CROP_TOP,
}) => {
  const win = visibleWindow ?? stillHeight - cropTop;
  const maxPan = stillHeight - cropTop - win;
  const safePan = Math.min(Math.max(pan, 0), Math.max(maxPan, 0));
  const scale = height / win;
  const width = stillWidth * scale;
  const mapper: StillMapper = {
    sx: (v: number) => v * scale,
    sy: (v: number) => (v - cropTop - safePan) * scale,
    s: (v: number) => v * scale,
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 46}px) scale(${0.965 + entrance * 0.035}) perspective(2600px) rotateY(${tilt}deg)`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: -14,
          width: width + 28,
          height: height + 28,
          borderRadius: 46,
          background: 'linear-gradient(145deg, #2b3846, #0b1016)',
          boxShadow: '0 42px 120px rgba(0,0,0,0.6)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 34,
          overflow: 'hidden',
          background: CANVAS,
          boxShadow: '0 0 0 3px rgba(255,255,255,0.09)',
        }}
      >
        {shots.map(
          (shot) =>
            shot.opacity > 0.004 && (
              <Img
                key={shot.src}
                src={staticFile(`${assetBase}/${shot.src}`)}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: -(cropTop + safePan) * scale,
                  width,
                  height: stillHeight * scale,
                  opacity: shot.opacity,
                }}
              />
            ),
        )}
        {overlay?.(mapper)}
      </div>
    </div>
  );
};

/** Pulsing focus ring, positioned in still coordinates via the PhoneFrame mapper. */
export const Ring: React.FC<{
  box: { x: number; y: number; w: number; h: number };
  color?: string;
  appear: number; // 0..1
  mapper: StillMapper;
}> = ({ box, color = SKY, appear, mapper }) => {
  const frame = useCurrentFrame();
  const pulse = 0.5 + 0.5 * Math.sin(frame / 8);
  const rgb = hexToRgb(color);
  const scale = interpolate(appear, [0, 1], [1.4, 1]);
  if (appear <= 0.004) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: mapper.sx(box.x) - 8,
        top: mapper.sy(box.y) - 8,
        width: mapper.s(box.w) + 16,
        height: mapper.s(box.h) + 16,
        borderRadius: 16,
        border: `4px solid rgba(${rgb},${0.55 + pulse * 0.4})`,
        background: `rgba(${rgb},${0.1 + pulse * 0.05})`,
        boxShadow: `0 0 ${18 + pulse * 22}px rgba(${rgb},0.6)`,
        opacity: appear,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Touch ripple used before a state change on a still. */
export const Tap: React.FC<{
  cx: number;
  cy: number;
  progress: number; // 0..1
  mapper: StillMapper;
}> = ({ cx, cy, progress, mapper }) => {
  if (progress <= 0 || progress >= 1) return null;
  const r = interpolate(progress, [0, 1], [16, 74]);
  const op = interpolate(progress, [0, 0.25, 1], [0, 0.85, 0]);
  return (
    <div
      style={{
        position: 'absolute',
        left: mapper.sx(cx) - r,
        top: mapper.sy(cy) - r,
        width: r * 2,
        height: r * 2,
        borderRadius: r,
        border: `4px solid rgba(${hexToRgb(SKY)},${op})`,
        background: `rgba(${hexToRgb(SKY)},${op * 0.25})`,
        pointerEvents: 'none',
      }}
    />
  );
};
