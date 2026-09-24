/** Typography and annotation primitives (house style). Labels are SVG text nodes, never pixels. */
import React from 'react';
import {BRAND as C, BODY, clamp01} from './theme';

export function Txt({x, y, size = 24, weight = 600, fill = C.ink, anchor = 'start', opacity = 1, italic = false, family, children, deco}: any) {
  if (opacity <= 0) return null;
  return (
    <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} opacity={opacity < 1 ? opacity : undefined}
      fontFamily={family ?? BODY} fontStyle={italic ? 'italic' : undefined} textDecoration={deco}>{children}</text>
  );
}
/** Multi-line text: '\n' separates lines. */
export function Lines({x, y, text, size = 24, step, weight = 600, fill = C.ink, anchor = 'start', opacity = 1, italic = false}: any) {
  if (opacity <= 0) return null;
  const ls = String(text).split('\n');
  const st = step ?? size * 1.3;
  return <g opacity={opacity < 1 ? opacity : undefined}>{ls.map((l, i) => <Txt key={i} x={x} y={y + i * st} size={size} weight={weight} fill={fill} anchor={anchor} italic={italic}>{l}</Txt>)}</g>;
}
/** Approximate advance width for Source Sans 3 (for pills and underlines). */
export const textW = (t: string, size: number, weight = 600) => {
  let w = 0;
  for (const ch of String(t)) w += /[mwMW@]/.test(ch) ? 0.8 : /[A-Z0-9]/.test(ch) ? 0.6 : /[iljtfr.,:;'’|! ]/.test(ch) ? 0.28 : /[–—→✓✗]/.test(ch) ? 0.75 : 0.5;
  return w * size * (weight >= 700 ? 1.04 : 1);
};
export function Card({x, y, w, h, fill = C.white, stroke = C.line, opacity = 1, active = false, rx = 16, children}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={active ? C.primary : stroke} strokeWidth={active ? 4 : 2} />
      {children}
    </g>
  );
}
/** Pill label. */
export function Tag({x, y, text, size = 20, fill = C.ink, bg = C.white, stroke = C.line, anchor = 'start', opacity = 1, weight = 700}: any) {
  if (opacity <= 0) return null;
  const w = textW(text, size, weight) + size * 1.1, h = size * 1.55;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x0} y={y - h * 0.68} width={w} height={h} rx={h / 2} fill={bg} stroke={stroke} strokeWidth={1.5} />
      <Txt x={x0 + w / 2} y={y} size={size} weight={weight} fill={fill} anchor="middle">{text}</Txt>
    </g>
  );
}
/** Small-type source line. */
export function Cite({x, y, text, size = 17, anchor = 'start', opacity = 1, fill = C.muted}: any) {
  return <Txt x={x} y={y} size={size} weight={600} fill={fill} anchor={anchor} opacity={opacity} italic>{text}</Txt>;
}
/** Hand-drawn ring (pre-drawn ink that POINTS AT structure); p 0..1 reveals the stroke. */
export function InkRing({cx, cy, rx, ry, p = 1, color = C.primary, width = 4, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const d = `M${cx + rx} ${cy}C${cx + rx} ${cy - ry * 1.05} ${cx - rx * 1.02} ${cy - ry * 1.08} ${cx - rx} ${cy}C${cx - rx * 0.98} ${cy + ry * 1.06} ${cx + rx * 1.06} ${cy + ry * 1.02} ${cx + rx * 1.02} ${cy - ry * 0.12}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp01(p)} opacity={opacity < 1 ? opacity : undefined} />;
}
/** Hand underline, revealed left to right. */
export function Underline({x1, x2, y, p = 1, color = C.primary, width = 4, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  return <path d={`M${x1} ${y}H${x1 + (x2 - x1) * clamp01(p)}`} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity < 1 ? opacity : undefined} />;
}
/** Straight or curved (bend = perpendicular offset of the control point) arrow. */
export function Arrow({x1, y1, x2, y2, color = C.ink, width = 3, head = 12, opacity = 1, bend = 0, dash}: any) {
  if (opacity <= 0) return null;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, L = Math.hypot(x2 - x1, y2 - y1) || 1;
  const cx = mx - (y2 - y1) / L * bend, cy = my + (x2 - x1) / L * bend;
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const hx = x2 - head * Math.cos(ang), hy = y2 - head * Math.sin(ang);
  const p1 = `${hx - head * 0.55 * Math.sin(ang)},${hy + head * 0.55 * Math.cos(ang)}`, p2 = `${hx + head * 0.55 * Math.sin(ang)},${hy - head * 0.55 * Math.cos(ang)}`;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <path d={bend ? `M${x1} ${y1}Q${cx} ${cy} ${hx} ${hy}` : `M${x1} ${y1}L${hx} ${hy}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} />
      <polygon points={`${x2},${y2} ${p1} ${p2}`} fill={color} />
    </g>
  );
}
