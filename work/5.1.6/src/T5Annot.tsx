/** Topic 5 annotation primitives (shared, run 009). Rings and highlights use T5.ring over a thin ink halo —
 * never terracotta (reserved for the error marker). Everything here is data-role="decor": it POINTS AT structure. */
import React from 'react';
import {T5} from './t5-palette';
import {BODY} from '../shared/src/theme';
import {textW} from '../shared/src/Type';

const c01 = (v: number) => Math.max(0, Math.min(1, v));

/** Hand ring around (cx, cy); p 0..1 reveals the stroke. Accent over an ink halo so it reads on any ground. */
export function Ring({cx, cy, rx, ry, p = 1, width = 5, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const d = `M${cx + rx} ${cy}C${cx + rx} ${cy - ry * 1.05} ${cx - rx * 1.02} ${cy - ry * 1.08} ${cx - rx} ${cy}C${cx - rx * 0.98} ${cy + ry * 1.06} ${cx + rx * 1.06} ${cy + ry * 1.02} ${cx + rx * 1.02} ${cy - ry * 0.12}`;
  const off = 1 - c01(p);
  return (
    <g data-role="decor" opacity={opacity < 1 ? opacity : undefined}>
      <path d={d} fill="none" stroke={T5.ringHalo} strokeOpacity={0.55} strokeWidth={width + 3} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={off} />
      <path d={d} fill="none" stroke={T5.ring} strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={off} />
    </g>
  );
}
/** Soft accent glow behind a point (a highlight pulse); a = 0..1 strength. */
export function Glow({cx, cy, r, a = 1}: any) {
  if (a <= 0) return null;
  return (
    <g data-role="decor">
      <circle cx={cx} cy={cy} r={r} fill={T5.ring} opacity={0.28 * c01(a)} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={T5.ring} opacity={0.3 * c01(a)} />
    </g>
  );
}
/** Accent trace along a straight or poly path (points [[x,y],...]); p reveals it. */
export function Trace({pts, p = 1, width = 6, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0 || pts.length < 2) return null;
  const d = 'M' + pts.map((q: number[]) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L');
  const off = 1 - c01(p);
  return (
    <g data-role="decor" opacity={opacity < 1 ? opacity : undefined}>
      <path d={d} fill="none" stroke={T5.ringHalo} strokeOpacity={0.45} strokeWidth={width + 3} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={off} />
      <path d={d} fill="none" stroke={T5.ring} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={off} />
    </g>
  );
}
/** A leader line from a label to a point on a drawing. */
export function Leader({x1, y1, x2, y2, opacity = 1, color = T5.ringHalo}: any) {
  if (opacity <= 0) return null;
  return (
    <g data-role="decor" opacity={opacity < 1 ? opacity : undefined}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2} />
      <circle cx={x2} cy={y2} r={3.5} fill={color} />
    </g>
  );
}
/** Square bracket (vertical or horizontal) with a label; decor. */
export function Bracket({x1, y1, x2, y2, side = -1, depth = 12, opacity = 1, color = T5.ringHalo, width = 2.5}: any) {
  if (opacity <= 0) return null;
  const vertical = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  const d = vertical
    ? `M${x1 - side * depth} ${y1}H${x1}V${y2}H${x1 - side * depth}`
    : `M${x1} ${y1 - side * depth}V${y1}H${x2}V${y1 - side * depth}`;
  return <path data-role="decor" d={d} fill="none" stroke={color} strokeWidth={width} opacity={opacity < 1 ? opacity : undefined} />;
}
/** A tick mark ✓ drawn in ink (not terracotta). */
export function Tick({x, y, s = 1, p = 1, color = '#1D6B40'}: any) {
  if (p <= 0) return null;
  const d = `M${x - 10 * s} ${y}L${x - 3 * s} ${y + 8 * s}L${x + 12 * s} ${y - 10 * s}`;
  return <path data-role="decor" d={d} fill="none" stroke={color} strokeWidth={5 * s} strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - c01(p)} />;
}
/** Small caption line in the model's own small type (schematic notes). */
export function Note({x, y, text, size = 17, anchor = 'start', opacity = 1, fill = '#6F6A60', weight = 600, italic = true}: any) {
  if (opacity <= 0) return null;
  return <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontStyle={italic ? 'italic' : undefined} fontFamily={BODY} opacity={opacity < 1 ? opacity : undefined}>{text}</text>;
}
/** A label with a white halo box so it reads over drawings (decor box + text). */
export function Label({x, y, text, size = 22, anchor = 'start', opacity = 1, fill = T5.ringHalo, weight = 700, box = true}: any) {
  if (opacity <= 0) return null;
  const w = textW(text, size, weight), x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      {box && <rect data-role="decor" x={x0 - 6} y={y - size * 0.86} width={w + 12} height={size * 1.18} rx={5} fill="#FFFFFF" fillOpacity={0.86} />}
      <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} fontFamily={BODY}>{text}</text>
    </g>
  );
}
