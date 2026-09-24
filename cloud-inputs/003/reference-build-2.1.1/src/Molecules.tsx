/** Qualitative particle icons (MODEL): never an equation, never a reaction mechanism. */
import React from 'react';
import {BRAND as C, clamp01, rng} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';

export const CU = '#2F6FD0';
export function CuIon({x, y, r = 11, opacity = 1}: any) {
  return <g opacity={opacity}><circle cx={x} cy={y} r={r} fill={CU} stroke={C.ink} strokeWidth={1.5} /><Txt x={x} y={y + 4} size={r * 0.8} anchor="middle" weight={800} fill="#FFFFFF">Cu</Txt></g>;
}
export function Sugar({x, y, r = 13, reacted = 0, hi = false, opacity = 1}: any) {
  const pts = Array.from({length: 6}, (_, i) => `${x + r * Math.cos(Math.PI / 6 + i * Math.PI / 3)},${y + r * Math.sin(Math.PI / 6 + i * Math.PI / 3)}`).join(' ');
  return (
    <g opacity={opacity}>
      {hi && <circle cx={x} cy={y} r={r + 7} fill="none" stroke={C.primary} strokeWidth={3} />}
      <polygon points={pts} fill={reacted > 0.5 ? '#C9CED6' : '#F2C45A'} stroke={C.ink} strokeWidth={1.8} />
    </g>
  );
}

/** Round cutaway of a tube's contents: nCu copper ions and nS sugars; p 0..1 = how far the reaction has gone.
 * The limiting set is used up and disappears; the other remains. Qualitative only. */
export function Cutaway({cx, cy, R = 150, nCu, nS, p = 0, seed = 3, title, tag, tagColor, opacity = 1}: any) {
  const r = rng(seed);
  const place = (n: number) => Array.from({length: n}, () => { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * (R - 26); return [cx + d * Math.cos(a), cy + d * Math.sin(a)]; });
  const cu = place(nCu), su = place(nS);
  const used = Math.min(nCu, nS);
  return (
    <g opacity={opacity}>
      <circle cx={cx} cy={cy} r={R} fill="#EAF2F8" stroke={C.ink} strokeWidth={3} />
      {su.map(([x, y], i) => <Sugar key={'s' + i} x={x} y={y} reacted={i < used ? p : 0} hi={nS > nCu && i >= used && p > 0.95} />)}
      {cu.map(([x, y], i) => <CuIon key={'c' + i} x={x} y={y} opacity={i < used ? 1 - clamp01(p) : 1} />)}
      {title && <Txt x={cx} y={cy - R - 16} size={22} anchor="middle" weight={800}>{title}</Txt>}
      {tag && <Txt x={cx} y={cy + R + 34} size={20} anchor="middle" weight={800} fill={tagColor ?? C.primary}>{tag}</Txt>}
    </g>
  );
}
