/** Small shared scene pieces used by several beats (hook cell inset, tablet, number boxes, strips). */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Tag} from '../shared/Type';
import {Enzyme} from '../Enzyme';

export const CELL_ENZ: number[][] = [[-190, -60], [20, -110], [210, -20], [-150, 120], [60, 110], [250, 150]];
export const STOPPED = 1;
/** Cell inset with enzyme silhouettes on faint reaction arrows; `dim` stops one; t = local seconds (for running dots). */
export function CellInset({x, y, s = 1, t = 0, dim = 0, opacity = 1, label = true, stoppedDim = 0.33}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-inset="cell">
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <ellipse cx={0} cy={20} rx={380} ry={250} fill="#EEF3F6" stroke={C.enzymeEdge} strokeWidth={4} strokeDasharray="2 0" />
        {CELL_ENZ.map(([ex, ey], i) => {
          const stopped = i === STOPPED;
          const run = stopped ? 1 - clamp01(dim) : 1;
          const off = stopped ? (t * 55 % 30) * run + (1 - run) * 12 : (t * 55 + i * 9) % 30;
          return (
            <g key={i} opacity={stopped ? 1 - (1 - stoppedDim) * clamp01(dim) : 1}>
              <path d={`M${ex - 110} ${ey + 60}H${ex + 110}`} stroke={C.muted} strokeWidth={3} opacity={0.5} />
              <path d={`M${ex + 110} ${ey + 60}l-12 -7v14z`} fill={C.muted} opacity={0.5} />
              {[0, 1, 2, 3, 4, 5, 6].map((j) => { const px = ex - 104 + off + j * 30; return px < ex + 100 ? <circle key={j} cx={px} cy={ey + 60} r={4.5} fill={j * 30 + off < 110 ? C.substrate : '#E3A73A'} opacity={0.35 + 0.65 * run} /> : null; })}
              <Enzyme x={ex} y={ey} s={0.24} />
            </g>
          );
        })}
      </g>
      {label && <Txt x={x} y={y + 305 * s} size={18} weight={800} fill={C.muted} anchor="middle">a cell (MODEL) · enzymes on their reactions</Txt>}
    </g>
  );
}
/** Tablet icon (capsule-shaped pill). */
export function Tablet({x, y, s = 1, opacity = 1}: any) {
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-25)`} opacity={opacity < 1 ? opacity : undefined} data-icon="tablet">
      <rect x={-62} y={-26} width={124} height={52} rx={26} fill={C.white} stroke={C.ink} strokeWidth={3.5} />
      <path d="M0 -26V26" stroke={C.ink} strokeWidth={2.5} />
      <rect x={0} y={-26} width={62} height={52} rx={0} fill="#E9EEF3" opacity={0.9} />
      <rect x={-62} y={-26} width={124} height={52} rx={26} fill="none" stroke={C.ink} strokeWidth={3.5} />
    </g>
  );
}
/** Number box: '?' until filled. */
export function NumberBox({x, y, w = 170, h = 104, text = '?', fill = 0, opacity = 1, hi = 0}: any) {
  if (opacity <= 0) return null;
  const on = clamp01(fill);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={14} fill={on > 0 ? '#E7F1F5' : C.white} stroke={on > 0 ? C.teal : C.ink} strokeWidth={3.5} />
      {hi > 0 && <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={18} fill="none" stroke={C.teal} strokeWidth={4} opacity={hi} />}
      <Txt x={x + w / 2} y={y + h / 2 + 18} size={52} weight={800} anchor="middle" fill={C.muted} opacity={1 - on}>?</Txt>
      <Txt x={x + w / 2} y={y + h / 2 + 18} size={50} weight={800} anchor="middle" fill={C.teal} opacity={on}>{text}</Txt>
    </g>
  );
}
/** Four-step construction strip: Vmax · ½Vmax · across · down, item i lit when lit > i. */
export function StepStrip({x, y, lit = 0, opacity = 1, size = 28}: any) {
  if (opacity <= 0) return null;
  const items = ['Vmax', '½Vmax', 'across', 'down'];
  let cx = x;
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-strip="construction">
      {items.map((t, i) => {
        const on = clamp01(lit - i), w = t.length * size * 0.55 + 56;
        const el = (
          <g key={t}>
            <rect x={cx} y={y} width={w} height={size * 1.9} rx={size} fill={on > 0 ? C.teal : C.white} stroke={on > 0 ? C.teal : C.line} strokeWidth={2.5} opacity={0.4 + 0.6 * (on > 0 ? 1 : 0.6)} />
            <Txt x={cx + w / 2} y={y + size * 1.28} size={size} weight={800} anchor="middle" fill={on > 0 ? C.white : C.muted}>{t}</Txt>
            {i < 3 && <Txt x={cx + w + 22} y={y + size * 1.28} size={size} weight={800} anchor="middle" fill={C.muted}>→</Txt>}
          </g>
        );
        cx += w + 44;
        return el;
      })}
    </g>
  );
}
/** "our schematic" style tag in small type. */
export const Small = ({x, y, text, opacity = 1, anchor = 'start', fill = C.muted, size = 17}: any) => <Txt x={x} y={y} size={size} weight={700} fill={fill} anchor={anchor} opacity={opacity}>{text}</Txt>;
export const Pill = Tag;
