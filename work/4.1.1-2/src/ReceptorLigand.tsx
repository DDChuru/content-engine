/** ReceptorLigand (4.1.3 basic `rest`, `bind-basic`; 4.1.4 adds `wrong-ligand-fail`, `seat`, `response-uptake`).
 * The receptor is the `receptor-glycoprotein` of FluidMosaicMembrane: spanning the bilayer, a V-shaped cup on its
 * outer face = the BINDING SITE (never "active site"), a 3-bead carbohydrate chain beside it on the outer face.
 * Ligand A (magenta wedge) is complementary to the cup; ligand B (magenta square) is not.
 * Motions: `seat` 0.8 s (A descends along the normal and seats flush); `wrong-ligand-fail` 1.5 s (B descends,
 * touches the rim, rocks once, fails to seat, drifts away). Non-covalent approach/fit/failure only; the receptor
 * never changes shape. */
import React from 'react';
import {T4} from './t4-palette';
import {PROT, roundRect} from './TransportProteinSet';

export const REC = {cupW: 0.92, cupD: 0.58, capH: 0.26};
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const f = (n: number) => n.toFixed(2);

/** Receptor body path with its binding-site cup (outer face up). */
export function receptorPath(x: number, y: number, u: number) {
  const H = PROT.H * u, W = PROT.W * u / 2, top = y - H, bot = y + H + 0.1 * u, r = 0.34 * u, k = 0.5523 * r;
  const cw = REC.cupW * u / 2, cd = REC.cupD * u;
  return `M${f(x - W + r)} ${f(top)}L${f(x - cw)} ${f(top)}L${f(x)} ${f(top + cd)}L${f(x + cw)} ${f(top)}L${f(x + W - r)} ${f(top)}` +
    `C${f(x + W - r + k)} ${f(top)} ${f(x + W)} ${f(top + r - k)} ${f(x + W)} ${f(top + r)}L${f(x + W)} ${f(bot - r)}` +
    `C${f(x + W)} ${f(bot - r + k)} ${f(x + W - r + k)} ${f(bot)} ${f(x + W - r)} ${f(bot)}L${f(x - W + r)} ${f(bot)}` +
    `C${f(x - W + r - k)} ${f(bot)} ${f(x - W)} ${f(bot - r + k)} ${f(x - W)} ${f(bot - r)}L${f(x - W)} ${f(top + r)}` +
    `C${f(x - W)} ${f(top + r - k)} ${f(x - W + r - k)} ${f(top)} ${f(x - W + r)} ${f(top)}Z`;
}
/** Where a seated ligand A's reference point (its top-centre) sits: the cup rim level. */
export const receptorSite = (x: number, y: number, u: number) => ({x, y: y - PROT.H * u, cupBottom: y - PROT.H * u + REC.cupD * u});

/** The receptor protein (no chain: the chain is drawn by the membrane as a bead chain so it can be revealed). */
export function ReceptorProtein({x, y, u = 58, opacity = 1, hl = 0, siteGlow = 0}: any) {
  if (opacity <= 0) return null;
  const H = PROT.H * u, W = PROT.W * u / 2, top = y - H, cw = REC.cupW * u / 2, cd = REC.cupD * u;
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      {hl > 0 && <path d={roundRect(x - W - 9, top - 9, x + W + 9, y + H + 0.1 * u + 9, 0.34 * u + 9)} fill="#FFFFFF" opacity={0.8 * hl} />}
      <path d={receptorPath(x, y, u)} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} strokeLinejoin="round" />
      {siteGlow > 0 && <path d={`M${f(x - cw)} ${f(top)}L${f(x)} ${f(top + cd)}L${f(x + cw)} ${f(top)}`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinejoin="round" opacity={siteGlow} />}
    </g>
  );
}

/** Ligand A: magenta wedge. (x, y) = the wedge's TOP-centre; it points down. `s` scales with u. */
export function LigandA({x, y, u = 58, opacity = 1, rot = 0}: any) {
  if (opacity <= 0) return null;
  const cw = REC.cupW * u / 2 * 0.97, cd = REC.cupD * u * 0.97, ch = REC.capH * u, cap = cw * 1.12;
  const d = `M${f(x - cap)} ${f(y - ch)}L${f(x + cap)} ${f(y - ch)}L${f(x + cap)} ${f(y)}L${f(x + cw)} ${f(y)}L${f(x)} ${f(y + cd)}L${f(x - cw)} ${f(y)}L${f(x - cap)} ${f(y)}Z`;
  return <path data-role="drawing" d={d} fill={T4.ligand} stroke={T4.ligandEdge} strokeWidth={2.2} strokeLinejoin="round" opacity={opacity < 1 ? opacity : undefined} transform={rot ? `rotate(${f(rot)} ${f(x)} ${f(y)})` : undefined} />;
}
/** Ligand B: magenta square (not complementary). (x, y) = its BOTTOM-centre. */
export function LigandB({x, y, u = 58, opacity = 1, rot = 0}: any) {
  if (opacity <= 0) return null;
  const s = 0.98 * u;
  return <rect data-role="drawing" x={x - s / 2} y={y - s} width={s} height={s} rx={0.06 * u} fill={T4.ligand} stroke={T4.ligandEdge} strokeWidth={2.2} opacity={opacity < 1 ? opacity : undefined} transform={rot ? `rotate(${f(rot)} ${f(x)} ${f(y)})` : undefined} />;
}

/** `seat` / `bind-basic` (0.8 s): ligand A top-centre position relative to the site, units u (dy < 0 = above). */
export function seatMotion(age: number, from = -2.6) {
  if (age < 0) return {dy: from, seated: false};
  const k = ease(age / 0.8);
  return {dy: from * (1 - k), seated: age >= 0.8};
}
/** `wrong-ligand-fail` (1.5 s): ligand B bottom-centre relative to the rim centre (units u) and its rock angle.
 * Descends (0–0.55 s) until its lower edge touches the rim, rocks once (0.55–1.0 s), lifts and drifts away (1.0–1.5 s). */
export function failMotion(age: number, from = -2.4, away = [1.6, -2.2]) {
  if (age < 0) return {dx: 0, dy: from, rot: 0, done: false};
  if (age < 0.55) return {dx: 0, dy: from * (1 - ease(age / 0.55)), rot: 0, done: false};
  if (age < 1.0) { const k = (age - 0.55) / 0.45; return {dx: 0, dy: -0.02, rot: 9 * Math.sin(k * Math.PI * 2) * (1 - k * 0.3), done: false}; }
  if (age < 1.5) { const k = ease((age - 1.0) / 0.5); return {dx: away[0] * k, dy: -0.02 + away[1] * k, rot: -6 * k, done: false}; }
  return {dx: away[0], dy: -0.02 + away[1], rot: -6, done: true};
}
