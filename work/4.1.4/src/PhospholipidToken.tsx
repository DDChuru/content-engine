/** PhospholipidToken (published by 4.1.1-2; every membrane frame in Topic 4).
 * Round amber head (hydrophilic, phosphate-containing) + two grey fatty-acid tails (one straight, one with a single
 * kink). Drawn head-up at angle 0; `angle` (degrees) rotates about the head centre, so angle 180 = head down.
 * Geometry in units of u (the membrane slot width): head radius 0.40u, tails 1.52u long below the head. */
import React from 'react';
import {T4} from './t4-palette';

export const PL = {headR: 0.4, tailLen: 1.52, tailGap: 0.13, kinkAt: 0.45, kink: 0.16};

export function tailPaths(x: number, y: number, u: number) {
  const top = y + PL.headR * u * 0.8, len = PL.tailLen * u, g = PL.tailGap * u;
  const straight = `M${x - g} ${top}L${x - g} ${top + len}`;
  const k1 = top + len * PL.kinkAt;
  const kinked = `M${x + g} ${top}L${x + g} ${k1}L${x + g + PL.kink * u} ${k1 + len * 0.16}L${x + g + PL.kink * u} ${top + len * 0.98}`;
  return [straight, kinked];
}

/** One phospholipid. `tint` 0..1 lightens the head (tracer); `hl` draws a bright halo; `tails=false` hides them. */
export function PhospholipidToken({x, y, u = 58, angle = 0, opacity = 1, tint = 0, hl = 0, headFill, tailColor, sw}: any) {
  if (opacity <= 0) return null;
  const r = PL.headR * u, [a, b] = tailPaths(x, y, u), w = sw ?? Math.max(2.2, u * 0.075);
  const fill = headFill ?? (tint > 0 ? mix(T4.head, '#FFF1D6', tint) : T4.head);
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined} transform={angle ? `rotate(${angle.toFixed(2)} ${x.toFixed(2)} ${y.toFixed(2)})` : undefined}>
      {hl > 0 && <circle cx={x} cy={y} r={r + 7} fill="#FFFFFF" opacity={0.85 * hl} />}
      <path d={a} stroke={tailColor ?? T4.tail} strokeWidth={w} strokeLinecap="round" fill="none" />
      <path d={b} stroke={tailColor ?? T4.tail} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx={x} cy={y} r={r} fill={fill} stroke={T4.headEdge} strokeWidth={Math.max(1.5, u * 0.04)} />
    </g>
  );
}

/** Hex colour mix (used only for the tracer's lighter AMBER: same hue family, never a tween between roles). */
export function mix(a: string, b: string, t: number) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
}
