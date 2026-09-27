/** TransportProteinSet (4.1.3 previews `channel-open`, `carrier-bind` + one-time flip preview; 4.2.1a full passive
 * states). Shapes are drawn at a protein centre (x, y = mid-core) in membrane units u. Proteins span the bilayer
 * (transmembrane examples of intrinsic proteins), teal. Outside is UP, cytoplasm DOWN.
 *  - Channel: two walls around a central water-filled pore lined by hydrophilic R groups (light core with polar
 *    dots). The channel NEVER changes shape (no shape parameter exists).
 *  - Carrier: two halves around a binding-site pocket. `phase` 0 = rest (notch/binding site open to the outside),
 *    1 = notch open to the cytoplasm. The outer slot closes by phase 0.45 and the inner slot opens only after 0.55:
 *    at no phase is there a continuous pore through both faces. Silhouettes interpolate continuously (never a cut).
 * Timings (SHARED-SPECS §4): bind 0.6 s, flip 0.8 s, release 0.5 s, reset 0.8 s (cycle 2.7 s). */
import React from 'react';
import {T4} from './t4-palette';

export const PROT = {H: 2.65, W: 1.9, poreW: 0.46, pocketR: 0.42, pocketH: 0.5, pocketY: 1.25};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const f = (n: number) => n.toFixed(2);

function roundRect(x0: number, y0: number, x1: number, y1: number, r: number) {
  const k = 0.5523 * r;
  return `M${f(x0 + r)} ${f(y0)}L${f(x1 - r)} ${f(y0)}C${f(x1 - r + k)} ${f(y0)} ${f(x1)} ${f(y0 + r - k)} ${f(x1)} ${f(y0 + r)}` +
    `L${f(x1)} ${f(y1 - r)}C${f(x1)} ${f(y1 - r + k)} ${f(x1 - r + k)} ${f(y1)} ${f(x1 - r)} ${f(y1)}L${f(x0 + r)} ${f(y1)}` +
    `C${f(x0 + r - k)} ${f(y1)} ${f(x0)} ${f(y1 - r + k)} ${f(x0)} ${f(y1 - r)}L${f(x0)} ${f(y0 + r)}C${f(x0)} ${f(y0 + r - k)} ${f(x0 + r - k)} ${f(y0)} ${f(x0 + r)} ${f(y0)}Z`;
}
export {roundRect};

/** Channel protein. `hl` halo (0..1); `poreWater` draws three pale water tokens in the pore. */
export function ChannelProtein({x, y, u = 58, opacity = 1, hl = 0, poreWater = false, lining = true}: any) {
  if (opacity <= 0) return null;
  const H = PROT.H * u, W = PROT.W * u / 2, p = PROT.poreW * u / 2, r = 0.32 * u;
  const L = roundRect(x - W, y - H, x - p, y + H, r), R = roundRect(x + p, y - H, x + W, y + H, r);
  const dots = [];
  if (lining) for (let i = 0; i < 7; i++) { const yy = y - H * 0.78 + (i * H * 1.56) / 6; dots.push(<circle key={'l' + i} cx={x - p - 0.02 * u} cy={yy} r={0.055 * u} fill="#FFFFFF" stroke={T4.proteinEdge} strokeWidth={1} />, <circle key={'r' + i} cx={x + p + 0.02 * u} cy={yy + H * 0.13} r={0.055 * u} fill="#FFFFFF" stroke={T4.proteinEdge} strokeWidth={1} />); }
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      {hl > 0 && <path d={roundRect(x - W - 8, y - H - 8, x + W + 8, y + H + 8, r + 8)} fill="#FFFFFF" opacity={0.8 * hl} />}
      <rect x={x - p} y={y - H + 0.1 * u} width={2 * p} height={2 * H - 0.2 * u} fill="#E4F3FA" />
      <path d={L} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} />
      <path d={R} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} />
      {dots}
      {poreWater && [-0.95, 0.05, 1.05].map((k, i) => <circle key={i} cx={x + (i === 1 ? 0.04 : -0.04) * u} cy={y + k * u} r={0.13 * u} fill={T4.water} stroke={T4.waterEdge} strokeWidth={1.2} />)}
    </g>
  );
}

/** Half-gap of the carrier's inner edge at height y (relative to centre, px). */
function carrierGap(yy: number, s: number, u: number) {
  const H = PROT.H * u, pw = PROT.pocketR * u, ph = PROT.pocketH * u;
  const yc = (-PROT.pocketY + 2 * PROT.pocketY * s) * u;
  const gt = pw * clamp01((0.45 - s) / 0.45), gb = pw * clamp01((s - 0.55) / 0.45);
  const pocket = Math.abs(yy - yc) < ph ? pw * Math.sqrt(1 - ((yy - yc) / ph) ** 2) : 0;
  const top = yy <= yc ? gt * (1 + 0.3 * clamp01((yc - yy) / (H + yc))) : 0;
  const bot = yy >= yc ? gb * (1 + 0.3 * clamp01((yy - yc) / (H - yc))) : 0;
  return Math.max(pocket, top, bot, 0.015 * u);
}
/** Binding-site (pocket) centre offset from the carrier centre, px, at phase s. */
export const carrierSiteY = (s: number, u = 58) => (-PROT.pocketY + 2 * PROT.pocketY * s) * u;

export function carrierHalves(x: number, y: number, s: number, u: number) {
  const H = PROT.H * u, N = 40, rc = 0.3 * u;
  const outer = (yy: number) => PROT.W * u / 2 + 0.09 * u * ((1 - s) * (-yy / H) + s * (yy / H));
  const halves: string[] = [];
  for (const side of [-1, 1]) {
    const pts: number[][] = [];
    // inner edge top → bottom
    for (let i = 0; i <= N; i++) { const yy = -H + (2 * H * i) / N; pts.push([x + side * carrierGap(yy, s, u), y + yy]); }
    // bottom edge to outer corner (rounded)
    const ob = outer(H), ot = outer(-H);
    for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); pts.push([x + side * (ob - rc + rc * Math.sin(a)), y + H - rc + rc * Math.cos(a)]); }
    for (let i = 1; i < 12; i++) { const yy = H - rc - ((2 * H - 2 * rc) * i) / 12; pts.push([x + side * outer(yy), y + yy]); }
    for (let i = 0; i <= 6; i++) { const a = (Math.PI / 2) * (i / 6); pts.push([x + side * (ot - rc + rc * Math.cos(a)), y - H + rc - rc * Math.sin(a)]); }
    halves.push('M' + pts.map((p) => f(p[0]) + ' ' + f(p[1])).join('L') + 'Z');
  }
  return halves;
}
/** Carrier protein at phase s (0 = binding site open to the outside). */
export function CarrierProtein({x, y, u = 58, phase = 0, opacity = 1, hl = 0}: any) {
  if (opacity <= 0) return null;
  const s = clamp01(phase), [A, B] = carrierHalves(x, y, s, u), H = PROT.H * u, W = PROT.W * u / 2;
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      {hl > 0 && <path d={roundRect(x - W - 10, y - H - 8, x + W + 10, y + H + 8, 0.3 * u + 8)} fill="#FFFFFF" opacity={0.8 * hl} />}
      <path d={A} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} strokeLinejoin="round" />
      <path d={B} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} strokeLinejoin="round" />
    </g>
  );
}

/** Forward cycle (outside → cytoplasm) by age since its start, seconds: bind 0.6, flip 0.8, release 0.5, reset 0.8.
 * Returns the carrier phase and the solute position relative to the carrier centre (units u), and the stage name. */
export function carrierCycle(age: number, from = -4.2) {
  const seatY = -PROT.pocketY, relY = PROT.pocketY;
  if (age < 0) return {phase: 0, ty: from, stage: 'rest', tok: false};
  if (age < 0.6) return {phase: 0, ty: from + (seatY - from) * ease(age / 0.6), stage: 'bind', tok: true};
  if (age < 1.4) { const s = ease((age - 0.6) / 0.8); return {phase: s, ty: seatY + (relY - seatY) * s, stage: 'flip', tok: true}; }
  if (age < 1.9) return {phase: 1, ty: relY + (4.2 - relY) * ease((age - 1.4) / 0.5), stage: 'release', tok: true};
  if (age < 2.7) return {phase: 1 - ease((age - 1.9) / 0.8), ty: 4.2, stage: 'reset', tok: false, released: true};
  return {phase: 0, ty: 4.2, stage: 'done', tok: false, released: true};
}
/** Reverse cycle (cytoplasm → outside): the empty carrier reorients 0.8, a cytoplasm-side token seats 0.6, the
 * protein changes shape back 0.8, the token is released outside 0.5. */
export function carrierReverse(age: number, from = 4.2) {
  const seatY = PROT.pocketY, relY = -PROT.pocketY;
  if (age < 0) return {phase: 0, ty: from, stage: 'rest', tok: false};
  if (age < 0.8) return {phase: ease(age / 0.8), ty: from, stage: 'reorient', tok: false};
  if (age < 1.4) return {phase: 1, ty: from + (seatY - from) * ease((age - 0.8) / 0.6), stage: 'bind', tok: true};
  if (age < 2.2) { const s = ease((age - 1.4) / 0.8); return {phase: 1 - s, ty: seatY + (relY - seatY) * s, stage: 'flip', tok: true}; }
  if (age < 2.7) return {phase: 0, ty: relY + (-4.2 - relY) * ease((age - 2.2) / 0.5), stage: 'release', tok: true};
  return {phase: 0, ty: -4.2, stage: 'done', tok: false, released: true};
}
/** Straight passage through the channel pore (outside → cytoplasm), ~1.2 s, along the pore axis only. */
export function channelPass(age: number, dur = 1.2, from = -4.0, to = 4.0) {
  if (age < 0) return {ty: from, tok: false};
  if (age > dur) return {ty: to, tok: false, done: true};
  return {ty: from + (to - from) * ease(age / dur), tok: true};
}
