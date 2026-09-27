/** Topic 4 particle tokens (SHARED-SPECS §4 colour roles, t4-palette.ts). Every token is a DRAWN MODEL
 * (data-role="drawing"); labels are added by the beat as SVG text. Sizes are in px at the given radius. */
import React from 'react';
import {T4} from './t4-palette';

const op = (o: number) => (o < 1 ? o : undefined);
const hexPts = (x: number, y: number, r: number, rot = 0) =>
  Array.from({length: 6}, (_, i) => { const a = rot + Math.PI / 6 + (i * Math.PI) / 3; return `${(x + r * Math.cos(a)).toFixed(2)},${(y + r * Math.sin(a)).toFixed(2)}`; }).join(' ');

/** Water token: small pale blue circle. */
export function WaterTok({x, y, r = 7, opacity = 1}: any) {
  if (opacity <= 0) return null;
  return <circle data-role="drawing" cx={x} cy={y} r={r} fill={T4.water} stroke={T4.waterEdge} strokeWidth={1.4} opacity={op(opacity)} />;
}
/** Glucose token: orange hexagon. */
export function GlucoseTok({x, y, r = 15, rot = 0, opacity = 1}: any) {
  if (opacity <= 0) return null;
  return <polygon data-role="drawing" points={hexPts(x, y, r, rot)} fill={T4.glucose} stroke={T4.glucoseEdge} strokeWidth={2} opacity={op(opacity)} />;
}
/** Sucrose token: larger orange double hexagon. */
export function SucroseTok({x, y, r = 14, rot = 0, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const dx = r * 0.93;
  return (
    <g data-role="drawing" opacity={op(opacity)} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
      <polygon points={hexPts(x - dx, y, r)} fill={T4.glucose} stroke={T4.glucoseEdge} strokeWidth={2} />
      <polygon points={hexPts(x + dx, y, r)} fill={T4.glucose} stroke={T4.glucoseEdge} strokeWidth={2} />
    </g>
  );
}
/** Ion token: small violet circle with + or −. */
export function IonTok({x, y, r = 12, sign = '+', opacity = 1}: any) {
  if (opacity <= 0) return null;
  const s = r * 0.5;
  return (
    <g data-role="drawing" opacity={op(opacity)}>
      <circle cx={x} cy={y} r={r} fill={T4.ion} stroke={T4.ionEdge} strokeWidth={1.8} />
      <path d={`M${x - s} ${y}H${x + s}`} stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" />
      {sign === '+' && <path d={`M${x} ${y - s}V${y + s}`} stroke="#FFFFFF" strokeWidth={2.6} strokeLinecap="round" />}
    </g>
  );
}
/** O₂ token: two joined red circles (a token, not a bond diagram). */
export function O2Tok({x, y, r = 9, rot = 0, opacity = 1}: any) {
  if (opacity <= 0) return null;
  const a = (rot * Math.PI) / 180, dx = Math.cos(a) * r * 0.78, dy = Math.sin(a) * r * 0.78;
  return (
    <g data-role="drawing" opacity={op(opacity)}>
      <circle cx={x - dx} cy={y - dy} r={r} fill={T4.o2} stroke={T4.o2Edge} strokeWidth={1.6} />
      <circle cx={x + dx} cy={y + dy} r={r} fill={T4.o2} stroke={T4.o2Edge} strokeWidth={1.6} />
    </g>
  );
}
/** Generic dissolved-substance dot (no identity): grey. */
export function SoluteDot({x, y, r = 8, shape = 'circle', opacity = 1}: any) {
  if (opacity <= 0) return null;
  if (shape === 'square') return <rect data-role="drawing" x={x - r} y={y - r} width={2 * r} height={2 * r} rx={2} fill="#A9A49A" stroke="#6F6A60" strokeWidth={1.5} opacity={op(opacity)} />;
  if (shape === 'tri') return <polygon data-role="drawing" points={`${x},${y - r * 1.1} ${x + r},${y + r * 0.8} ${x - r},${y + r * 0.8}`} fill="#A9A49A" stroke="#6F6A60" strokeWidth={1.5} opacity={op(opacity)} />;
  return <circle data-role="drawing" cx={x} cy={y} r={r} fill="#A9A49A" stroke="#6F6A60" strokeWidth={1.5} opacity={op(opacity)} />;
}
/** ATP token: yellow rounded tag with its text (the text is part of the token). */
export function ATPTag({x, y, text = 'ATP', w = 64, h = 30, opacity = 1, struck = false}: any) {
  if (opacity <= 0) return null;
  return (
    <g data-role="drawing" opacity={op(opacity)}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h / 2} fill={struck ? '#E3DED3' : T4.atp} stroke={struck ? '#9A958B' : T4.atpEdge} strokeWidth={2} />
      <text x={x} y={y + h * 0.24} fontSize={h * 0.62} fontWeight={700} fontFamily="'Stem4Life Source Sans 3', 'DejaVu Sans', sans-serif" fill={struck ? '#8A857B' : '#4A3608'} textAnchor="middle">{text}</text>
      {struck && <path d={`M${x - w / 2 - 4} ${y + h / 2 + 2}L${x + w / 2 + 4} ${y - h / 2 - 2}`} stroke="#6F6A60" strokeWidth={3} strokeLinecap="round" />}
    </g>
  );
}
