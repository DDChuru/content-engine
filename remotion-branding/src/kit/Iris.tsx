/**
 * Iris — the CCV bookend motif: a cyan aperture (outer ring + iris blades +
 * pupil) that opens and closes. openness 0 = shut, 1 = fully open; `flicker`
 * adds failure jitter (the hook's "iris tries to open and fails"). All motion
 * is frame-driven. Extracted verbatim from src/ccv/ccvShared.tsx.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { clamp01, hexToRgb, SKY } from './palette';

export const Iris: React.FC<{
  cx: number;
  cy: number;
  r: number;
  openness: number;
  glow?: number; // 0..1 extra glow
  flicker?: number; // 0..1
  color?: string;
}> = ({ cx, cy, r, openness, glow = 0.6, flicker = 0, color = SKY }) => {
  const frame = useCurrentFrame();
  const jitter =
    flicker > 0
      ? flicker * (0.5 + 0.5 * Math.sin(frame * 2.7)) * (0.4 + 0.6 * Math.abs(Math.sin(frame * 1.13)))
      : 0;
  const open = clamp01(openness - jitter * 0.7);
  const alpha = clamp01(0.35 + open * 0.65 - jitter * 0.5);
  const rgb = hexToRgb(color);
  if (openness <= 0.002) return null;
  return (
    <div style={{ position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2, pointerEvents: 'none' }}>
      <svg width={r * 2} height={r * 2} viewBox="0 0 200 200">
        {/* outer ring */}
        <circle cx={100} cy={100} r={92} fill="none" stroke={`rgba(${rgb},${alpha})`} strokeWidth={3.4} />
        <circle
          cx={100}
          cy={100}
          r={92}
          fill="none"
          stroke={`rgba(${rgb},${alpha * 0.5})`}
          strokeWidth={10}
          style={{ filter: 'blur(6px)' }}
        />
        {/* aperture: two lids closing from top/bottom */}
        <g>
          <ellipse cx={100} cy={100} rx={80} ry={80 * open} fill="none" stroke={`rgba(${rgb},${alpha})`} strokeWidth={2.6} />
          <ellipse
            cx={100}
            cy={100}
            rx={58}
            ry={58 * open}
            fill={`rgba(${rgb},${0.08 * open})`}
            stroke={`rgba(${rgb},${alpha * 0.75})`}
            strokeWidth={1.8}
          />
          {/* pupil */}
          <circle cx={100} cy={100} r={13 * open} fill={`rgba(${rgb},${alpha})`} style={{ filter: 'blur(0.4px)' }} />
        </g>
        {/* tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + frame * 0.003;
          return (
            <line
              key={i}
              x1={100 + Math.cos(a) * 86}
              y1={100 + Math.sin(a) * 86}
              x2={100 + Math.cos(a) * 79}
              y2={100 + Math.sin(a) * 79}
              stroke={`rgba(${rgb},${alpha * 0.75})`}
              strokeWidth={2}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: -r * 0.35,
          borderRadius: '50%',
          boxShadow: `0 0 ${r * 0.9 * glow}px rgba(${rgb},${0.4 * glow * open})`,
        }}
      />
    </div>
  );
};
