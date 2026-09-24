/** Typography and ink primitives. Labels are SVG text nodes, never pixels. */
import React from 'react';
import {BRAND as C, BODY, clamp01} from './theme';

export function Txt({x, y, size = 24, weight = 600, fill = C.ink, anchor = 'start', opacity = 1, children, family = BODY, ls, rotate}: any) {
  if (opacity <= 0) return null;
  return <text x={x} y={y} fontSize={size} fontWeight={weight} fill={fill} textAnchor={anchor} opacity={opacity < 1 ? opacity : undefined} fontFamily={family} letterSpacing={ls} transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}>{children}</text>;
}
/** Multi-line text: '\n' separated. */
export function Lines({x, y, text, size = 24, step, weight = 600, fill = C.ink, anchor = 'start', opacity = 1}: any) {
  const st = step ?? size * 1.3;
  return <g opacity={opacity < 1 ? opacity : undefined}>{String(text).split('\n').map((l, i) => <Txt key={i} x={x} y={y + i * st} size={size} weight={weight} fill={fill} anchor={anchor}>{l}</Txt>)}</g>;
}
export function Card({x, y, w, h, opacity = 1, active = false, stroke, fill, rx = 16, children, dash}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill ?? C.card} stroke={stroke ?? (active ? C.primary : C.line)} strokeWidth={active ? 4 : 2} strokeDasharray={dash} />
      {children}
    </g>
  );
}
/** Pill tag. Width estimated from the text length (Source Sans 3 ≈ 0.52 em average). */
export function Tag({x, y, text, size = 22, fill = C.ink, bg = C.white, stroke = C.line, opacity = 1, anchor = 'start', weight = 800, strike = 0}: any) {
  if (opacity <= 0) return null;
  const w = textW(text, size, weight) + size * 1.1, h = size * 1.6;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect x={x0} y={y - size * 1.12} width={w} height={h} rx={h / 2} fill={bg} stroke={stroke} strokeWidth={2} />
      <Txt x={x0 + w / 2} y={y} size={size} weight={weight} fill={fill} anchor="middle">{text}</Txt>
      {strike > 0 && <path d={`M${x0 + 6} ${y - size * 0.32}H${x0 + 6 + (w - 12) * clamp01(strike)}`} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />}
    </g>
  );
}
export const tagWidth = (text: string, size = 22) => textW(text, size, 800) + size * 1.1;
export function Cite({x, y, text, size = 17, fill = C.muted, anchor = 'start', opacity = 1}: any) {
  return <Txt x={x} y={y} size={size} weight={700} fill={fill} anchor={anchor} opacity={opacity}>{text}</Txt>;
}
/** Hand-drawn ink ring (pre-drawn, revealed by p). pathLength=1 is expanded for librsvg by raster-svg.cjs. */
export function InkRing({cx, cy, rx, ry, p = 1, color = C.primary, width = 4.5, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  const k = 0.5523;
  const x0 = cx + rx * 0.98, y0 = cy - ry * 0.18;
  const d = `M${x0} ${y0}C${cx + rx} ${cy + ry * k} ${cx + rx * k} ${cy + ry} ${cx} ${cy + ry}C${cx - rx * k} ${cy + ry} ${cx - rx} ${cy + ry * k} ${cx - rx} ${cy}C${cx - rx} ${cy - ry * k} ${cx - rx * k} ${cy - ry} ${cx} ${cy - ry}C${cx + rx * k} ${cy - ry} ${cx + rx * 1.06} ${cy - ry * 0.6} ${cx + rx * 1.02} ${cy - ry * 0.02}`;
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - clamp01(p)} opacity={opacity < 1 ? opacity : undefined} />;
}
export function Arrow({x1, y1, x2, y2, color = C.ink, width = 3, head = 12, opacity = 1, dash}: any) {
  if (opacity <= 0) return null;
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (s: number) => x2 - head * Math.cos(a + s), hy = (s: number) => y2 - head * Math.sin(a + s);
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <path d={`M${x1} ${y1}L${x2 - Math.cos(a) * head * 0.6} ${y2 - Math.sin(a) * head * 0.6}`} stroke={color} strokeWidth={width} strokeLinecap="round" strokeDasharray={dash} />
      <path d={`M${x2} ${y2}L${hx(0.45)} ${hy(0.45)}L${hx(-0.45)} ${hy(-0.45)}Z`} fill={color} />
    </g>
  );
}
/** Straight strike-through drawn by hand, progress p. */
export function Strike({x, y, w, p = 1, color = C.primary, width = 5}: any) {
  if (p <= 0) return null;
  return <path d={`M${x} ${y}L${x + w * clamp01(p)} ${y - 2 * clamp01(p)}`} stroke={color} strokeWidth={width} strokeLinecap="round" />;
}
/** Underline drawn left to right. */
export function Under({x, y, w, p = 1, color = C.primary, width = 4}: any) {
  if (p <= 0) return null;
  return <path d={`M${x} ${y}H${x + w * clamp01(p)}`} stroke={color} strokeWidth={width} strokeLinecap="round" />;
}
export const Cross = ({x, y, s = 16, color = C.primary, width = 5, opacity = 1}: any) => opacity <= 0 ? null : <path d={`M${x - s} ${y - s}L${x + s} ${y + s}M${x + s} ${y - s}L${x - s} ${y + s}`} stroke={color} strokeWidth={width} strokeLinecap="round" opacity={opacity < 1 ? opacity : undefined} />;
export const Tick = ({x, y, s = 16, color = C.good, width = 5, opacity = 1}: any) => opacity <= 0 ? null : <path d={`M${x - s} ${y}L${x - s * 0.3} ${y + s * 0.7}L${x + s} ${y - s * 0.8}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity < 1 ? opacity : undefined} />;
import M from './metrics.json';
/** Measured advance width of a string in Source Sans 3 (fallback glyphs ≈ 0.55 em). */
export function textW(str: string, size: number, weight = 600) {
  const w = [400, 600, 700, 800].reduce((b, x) => (Math.abs(x - weight) < Math.abs(b - weight) ? x : b), 600);
  const t = (M as any)[w];
  let s = 0;
  for (const ch of String(str)) s += t[ch] ?? 0.55;
  return s * size;
}
