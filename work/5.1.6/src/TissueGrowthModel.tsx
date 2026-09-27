/** TissueGrowthModel — 5.1.6's own model (published here). A schematic skin-like epithelium in side view (ContextStrip's
 * SkinStrip: dividing basal row on a basement layer, cells flattening as they rise, shed at the surface), connective
 * tissue beneath with one blood vessel (red channel, red blood cells) and one lymph vessel (pale channel), and a balance
 * pictogram (cells made / cells lost). States (driven by the beat, every change continuous MOTION):
 *   balanced · held · growing (side inset) · mutation (UV arrows; black star on one basal nucleus) ·
 *   repeated-division (starred cells double round by round into a pile; ordinary surface loss continues) ·
 *   benign-mass (rounded mass inside a thin continuous boundary; basement intact) ·
 *   malignant-invading (no continuous boundary; finger-like extensions through the basement layer) ·
 *   spread (a cell detaches, squeezes into the blood vessel and is carried; another enters the lymph vessel; at a distant
 *   panel a carried cell leaves the vessel and divides repeatedly into a secondary tumour).
 * Terracotta is never used; rings/highlights use T5.ring (the beats). Top <g> data-role="drawing". */
import React from 'react';
import {BRAND as C} from '../shared/src/theme';
import {Txt} from '../shared/src/Type';
import {T5} from './t5-palette';
import {SkinStrip} from './ContextStrip';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const f1 = (v: number) => v.toFixed(1);
export const UV = '#7B4FB5';
export const RED = '#C0392B';

/** Five-point black star (the mutation marker). */
export function Star({x, y, r = 7, op = 1}: any) {
  if (op <= 0) return null;
  const pts = Array.from({length: 10}, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return f1(x + rr * Math.cos(a)) + ' ' + f1(y + rr * Math.sin(a)); });
  return <path data-role="drawing" d={'M' + pts.join('L') + 'Z'} fill={T5.mutationStar} opacity={op < 1 ? f1(op) : undefined} />;
}
/** An abnormal (starred) cell: slightly larger, irregular outline. */
export function AbCell({x, y, r = 16, seed = 0, op = 1, star = 1}: any) {
  if (op <= 0.01) return null;
  const n = 9, pts = Array.from({length: n}, (_, i) => { const a = (i / n) * 2 * Math.PI, rr = r * (0.86 + 0.22 * Math.abs(Math.sin(seed * 3.7 + i * 2.3))); return f1(x + rr * Math.cos(a)) + ' ' + f1(y + rr * Math.sin(a)); });
  return (
    <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>
      <path d={'M' + pts.join('L') + 'Z'} fill="#EFE2CF" stroke={T5.membrane} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx={f1(x)} cy={f1(y)} r={f1(r * 0.42)} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={1.2} />
      {star > 0 && <Star x={x} y={y} r={r * 0.32} />}
    </g>
  );
}

export type TProps = {x: number; y: number; w: number; h: number; t?: number; shed?: number; cols?: number;
  hc?: number; vesselT?: number; op?: number; labels?: number; basalStar?: number; starCol?: number; divAt?: number; divU?: number; hiBase?: number};
/** Geometry of the tissue box. */
export function tGeom(p: TProps) {
  const cols = p.cols ?? 12, cw = p.w / cols, rowH = p.h / 4.3, base = p.y + p.h - rowH * 0.55;
  const hc = p.hc ?? 240, bm = base + rowH * 0.5;
  return {cols, cw, rowH, base, bm, colX: (j: number) => p.x + cw * (j + 0.5), blood: [bm + hc * 0.54, Math.min(44, hc * 0.2)], lymph: [bm + hc * 0.82, Math.min(34, hc * 0.15)], hc, bottom: p.y + p.h + hc};
}
/** The tissue: epithelium + connective tissue + vessels. */
export function Tissue(p: TProps) {
  const op = p.op ?? 1;
  if (op <= 0) return null;
  const G = tGeom(p), t = p.vesselT ?? 0;
  const [by, bh] = G.blood, [ly, lh] = G.lymph;
  const rbcs = Array.from({length: 8}, (_, i) => { const u = ((i / 8 + t * 0.04) % 1 + 1) % 1; return <circle key={i} cx={f1(p.x + 16 + u * (p.w - 32))} cy={f1(by + ((i % 3) - 1) * bh * 0.18)} r={f1(bh * 0.24)} fill={RED} stroke="#7E2620" strokeWidth={1} />; });
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <g data-role="drawing">
        <rect x={f1(p.x)} y={f1(G.bm)} width={f1(p.w)} height={f1(G.hc - 6)} fill="#F4EAD8" />
        <rect x={f1(p.x)} y={f1(by - bh / 2)} width={f1(p.w)} height={f1(bh)} rx={f1(bh / 2)} fill="#F6D9D3" stroke="#B98A80" strokeWidth={2} />
        {rbcs}
        <rect x={f1(p.x)} y={f1(ly - lh / 2)} width={f1(p.w)} height={f1(lh)} rx={f1(lh / 2)} fill="#EEF1E4" stroke="#A9B38E" strokeWidth={2} />
      </g>
      <SkinStrip x={p.x} y={p.y} w={p.w} h={p.h} cols={G.cols} t={p.t ?? 0} shed={p.shed ?? 1} divAt={p.divAt ?? -1} divU={p.divU ?? 0} hiBase={p.hiBase ?? 0} nucGone={1} />
      <path data-role="drawing" d={`M${f1(p.x)} ${f1(G.bm)}H${f1(p.x + p.w)}`} stroke="#8E7B5A" strokeWidth={3} />
      {(p.basalStar ?? 0) > 0 && <Star x={G.colX(p.starCol ?? 5)} y={G.base} r={8} op={p.basalStar} />}
      {(p.labels ?? 0) > 0 && <g opacity={f1(p.labels ?? 0)}>
        <Txt x={p.x + p.w - 10} y={by - bh / 2 - 6} size={16} weight={700} fill="#7E2620" anchor="end">blood vessel</Txt>
        <Txt x={p.x + p.w - 10} y={ly + lh / 2 + 18} size={16} weight={700} fill="#5E6B3A" anchor="end">lymph vessel</Txt>
      </g>}
    </g>
  );
}

/** Positions for a pile of n cells above the basement at column centre cx (benign/malignant shapes). invade 0..1 lets
 * some cells extend as fingers below the basement line. */
export function pilePositions(cx: number, bm: number, n: number, r: number, invade = 0) {
  const out: number[][] = [];
  const up: number[][] = [];
  for (let ring = 0; ring < 8; ring++) for (let k = -ring; k <= ring; k++) {
    const x = cx + k * r * 1.7, y = bm - r * 1.1 - ring * r * 1.45 + Math.abs(k) * r * 0.5;
    if (y < bm - r * 1.0) up.push([x, y]);
  }
  up.sort((a, b) => Math.hypot(a[0] - cx, (a[1] - bm) * 1.3) - Math.hypot(b[0] - cx, (b[1] - bm) * 1.3));
  const fingers = [[-1.8, 1], [0.4, 1], [2.2, 1]];
  const down: number[][] = [];
  for (let d = 1; d <= 3; d++) for (const [fx] of fingers) down.push([cx + fx * r * 1.7 + (d % 2 ? r * 0.3 : -r * 0.2), bm + r * 1.0 + (d - 1) * r * 1.6]);
  const nd = Math.round(invade * down.length);
  for (let i = 0; i < n; i++) out.push(up[i] ?? up[up.length - 1]);
  return {up: out, down: down.slice(0, nd)};
}
/** The starred pile. n = cells (continuous: the next cell grows out of its parent). boundary 0..1 draws the benign
 * boundary line; invade 0..1 grows finger-like extensions through the basement. */
export function Pile({cx, bm, n, r = 15, boundary = 0, invade = 0, op = 1, hide = -1, star = 1}: any) {
  if (op <= 0 || n <= 0) return null;
  const N = Math.ceil(n), P = pilePositions(cx, bm, N, r, invade);
  const cells: any[] = [];
  for (let i = 0; i < N; i++) {
    if (i === hide) continue;
    const k = i === N - 1 ? c01(n - (N - 1)) : 1;
    const par = P.up[Math.floor(i / 2)] ?? P.up[0];
    const e = ease(k);
    cells.push(<AbCell key={i} x={lerp(par[0], P.up[i][0], e)} y={lerp(par[1], P.up[i][1], e)} r={r * lerp(0.8, 1, e)} seed={i} op={i === 0 ? 1 : lerp(0.4, 1, e)} star={star} />);
  }
  P.down.forEach((q, i) => cells.push(<AbCell key={'d' + i} x={q[0]} y={q[1]} r={r} seed={50 + i} op={c01(invade * P.down.length - i + 0.5)} star={star} />));
  let bd = null;
  if (boundary > 0) {
    const xs = P.up.map((q) => q[0]), ys = P.up.map((q) => q[1]);
    const x0 = Math.min(...xs) - r * 1.6, x1 = Math.max(...xs) + r * 1.6, y0 = Math.min(...ys) - r * 1.6, yb = bm - 2;
    const d = `M${f1(x0)} ${f1(yb)}C${f1(x0)} ${f1(y0 - r)} ${f1(x1)} ${f1(y0 - r)} ${f1(x1)} ${f1(yb)}`;
    bd = <path data-role="drawing" d={d} fill="none" stroke={T5.ringHalo} strokeWidth={2.5} pathLength="1" strokeDasharray="1" strokeDashoffset={f1(1 - c01(boundary))} />;
  }
  return <g opacity={op < 1 ? f1(op) : undefined}>{cells}{bd}</g>;
}

/** Balance pictogram: tilt 0 level … 1 tipped toward "cells made" (left pan down). No numbers. */
export function Balance({x, y, tilt = 0, op = 1, hi = 0, s = 1}: any) {
  if (op <= 0) return null;
  if (s !== 1) return <g transform={`translate(${f1(x)} ${f1(y)}) scale(${s}) translate(${f1(-x)} ${f1(-y)})`}><Balance x={x} y={y} tilt={tilt} op={op} hi={hi} s={1} /></g>;
  const a = 0.3 * c01(tilt), L = 150;
  const lx = x - L * Math.cos(a), ly = y + L * Math.sin(a), rx = x + L * Math.cos(a), ry = y - L * Math.sin(a);
  const pan = (px: number, py: number, label: string, k: string) => (
    <g key={k}>
      <path d={`M${f1(px)} ${f1(py)}L${f1(px - 50)} ${f1(py + 60)}M${f1(px)} ${f1(py)}L${f1(px + 50)} ${f1(py + 60)}`} stroke={T5.membrane} strokeWidth={2} />
      <path d={`M${f1(px - 60)} ${f1(py + 60)}H${f1(px + 60)}C${f1(px + 50)} ${f1(py + 86)} ${f1(px - 50)} ${f1(py + 86)} ${f1(px - 60)} ${f1(py + 60)}Z`} fill="#EFE7D6" stroke={T5.membrane} strokeWidth={2} />
      <Txt x={px} y={py + 112} size={18} weight={800} fill={T5.ringHalo} anchor="middle">{label}</Txt>
    </g>
  );
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      {hi > 0 && <rect data-role="decor" x={x - 230} y={y - 60} width={460} height={230} rx={20} fill={T5.ring} opacity={f1(0.3 * hi)} />}
      <g data-role="drawing">
        <path d={`M${f1(x)} ${f1(y)}L${f1(x - 26)} ${f1(y + 150)}H${f1(x + 26)}Z`} fill="#D9CDB4" stroke={T5.membrane} strokeWidth={2} />
        <path d={`M${f1(lx)} ${f1(ly)}L${f1(rx)} ${f1(ry)}`} stroke={T5.ringHalo} strokeWidth={5} strokeLinecap="round" />
        {pan(lx, ly, 'cells made', 'l')}{pan(rx, ry, 'cells lost', 'r')}
      </g>
    </g>
  );
}

/** Tap-and-drain handle inset: water level rises when the tap runs faster than the drain. level 0..1. */
export function TapInset({x, y, level = 0.3, flow = 1, op = 1, t = 0}: any) {
  if (op <= 0) return null;
  const W = 170, H = 110, wl = y + H - 12 - (H - 30) * c01(level);
  return (
    <g opacity={op < 1 ? f1(op) : undefined}>
      <rect data-role="decor" x={x - 30} y={y - 90} width={W + 60} height={H + 150} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <g data-role="drawing">
        <path d={`M${x + 30} ${y - 60}H${x + 80}V${y - 40}`} stroke="#6F7A88" strokeWidth={10} fill="none" strokeLinecap="round" />
        <rect x={x + 42} y={y - 78} width={26} height={14} rx={4} fill="#6F7A88" />
        {flow > 0 && <path d={`M${x + 80} ${y - 36}V${f1(wl)}`} stroke="#6FA8DC" strokeWidth={8} strokeDasharray="10 5" strokeDashoffset={f1(-t * 60)} />}
        <path d={`M${x} ${y}V${y + H}H${x + W}V${y}`} fill="none" stroke={T5.membrane} strokeWidth={3} />
        <rect x={x + 2} y={f1(wl)} width={W - 4} height={f1(y + H - wl - 2)} fill="#BFD9F0" />
        <path d={`M${x + W / 2 - 8} ${y + H}V${y + H + 20}`} stroke="#6FA8DC" strokeWidth={5} strokeDasharray="6 5" strokeDashoffset={f1(-t * 30)} />
      </g>
      <Txt x={x + W / 2} y={y + H + 44} size={15} weight={700} fill={C.muted} anchor="middle" italic>analogy only</Txt>
    </g>
  );
}
