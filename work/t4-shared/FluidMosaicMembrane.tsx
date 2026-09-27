/** FluidMosaicMembrane (published by 4.1.1-2 with ALL component layers; reused across Topic 4).
 * Orientation fixed: OUTSIDE THE CELL AT THE TOP, CYTOPLASM AT THE BOTTOM. 12 phospholipids per leaflet in every
 * state. POSITIONS = SHARED-SPECS §FluidMosaicMembrane, read literally as 1-based slots counted left to right in the
 * `full` section (1 slot = 1 phospholipid width u):
 *   1 phospholipid · 2 glycolipid (outer leaflet; inner leaflet: phospholipid) · 3 phospholipid ·
 *   4–5 intrinsic-channel (spanning) · 6 cholesterol (outer; inner: phospholipid) · 7 cholesterol (inner; outer:
 *   phospholipid) · 8–9 receptor-glycoprotein (spanning; 3-bead chain beside its cup) · 10–11 intrinsic-carrier
 *   (spanning; notch to the outside at rest) · 12 glycoprotein (spanning; 5-bead chain) · 13–21 phospholipids (outer
 *   9 at unit spacing; the inner leaflet's remaining 8 spread across the same stretch) · extrinsic on the cytoplasmic
 *   face centred under the 3|4 boundary (touching the heads at 3 and the channel's lower end).
 *   Outer leaflet: 12 phospholipids at slots 1, 3, 7, 13–21. Inner: 12 at slots 1, 2, 3, 6 and 8 across 13–21.
 * Layout is columnar: spanning proteins are shared columns, so both leaflets meet each protein at the same x. Where
 * the two leaflets hold different numbers of items between two columns (slots 1–3 before the glycolipid is in;
 * slots 13–21 always), the stretch takes a width between the two counts (denser leaflet ≥ 0.88u spacing, heads never
 * touch). With no components present each leaflet is laid out on its own at unit spacing (12 wide).
 * ENTRY (008f, review 4.1.1-2 #1): a component enters AT ITS SEAT. Its drawn footprint widens from zero (horizontal
 * scale = entry progress) while the molecules on either side part by exactly that footprint: no hole ever opens ahead
 * of it and it never crosses another glyph. A sideways path from the section's edge is impossible in a cross-section
 * without a spanning protein passing over occupied lipid positions, so there is none. Nothing crosses the core or
 * moves between leaflets. `extrinsic` rises from the cytoplasm onto the face (through water only).
 * States: assemble (`assemble` 0..1 with `scatter` 0..1; `keep` = token indices already in place), full (default `show`), highlight:<id> (`highlight` + `hl`).
 * Motion contract: phospholipids jitter and drift sideways (≤ 1 token width per 2 s; here ≤ 0.16u/s); proteins drift
 * more slowly; nothing crosses between leaflets; carbohydrate chains stay on the external (top) face. */
import React from 'react';
import {T4} from './t4-palette';
import {PhospholipidToken, PL, tailPaths} from './PhospholipidToken';
import {ChannelProtein, CarrierProtein, PROT, roundRect} from './TransportProteinSet';
import {ReceptorProtein} from './ReceptorLigand';

export type CompId = 'glycolipid' | 'intrinsic-channel' | 'cholesterol' | 'receptor-glycoprotein' | 'intrinsic-carrier' | 'glycoprotein' | 'extrinsic';
export type ShowKey = 'channel' | 'receptor' | 'carrier' | 'glycoprotein' | 'cholOut' | 'cholIn' | 'glycolipid' | 'extrinsic';
export const FULL: Record<ShowKey, number> = {channel: 1, receptor: 1, carrier: 1, glycoprotein: 1, cholOut: 1, cholIn: 1, glycolipid: 1, extrinsic: 1};
export const BILAYER: Record<ShowKey, number> = {channel: 0, receptor: 0, carrier: 0, glycoprotein: 0, cholOut: 0, cholIn: 0, glycolipid: 0, extrinsic: 0};
export const HY = 1.9;           // head-centre offset from mid-core, units u
export const FACE = HY + PL.headR; // outer / cytoplasmic face offset (2.3u)
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => { t = clamp01(t); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
const f = (n: number) => n.toFixed(2);

// Stretches (lipid-leaflet items between columns) and columns (spanning proteins), left → right; see the header.
const SEGS: any[] = [
  {outer: ['pl', 'glycolipid', 'pl'], inner: ['pl', 'pl', 'pl']},                              // slots 1–3
  {prot: 'channel', w: 2},                                                                       // 4–5
  {outer: ['cholOut', 'pl'], inner: ['pl', 'cholIn']},                                           // 6–7
  {prot: 'receptor', w: 2},                                                                      // 8–9
  {prot: 'carrier', w: 2},                                                                       // 10–11
  {prot: 'glycoprotein', w: 1},                                                                  // 12
  {outer: ['pl', 'pl', 'pl', 'pl', 'pl', 'pl', 'pl', 'pl', 'pl'], inner: ['pl', 'pl', 'pl', 'pl', 'pl', 'pl', 'pl', 'pl']}, // 13–21
];
const PROT_KEYS = ['channel', 'receptor', 'carrier', 'glycoprotein'];
export const COMP_OF: Record<string, CompId> = {channel: 'intrinsic-channel', receptor: 'receptor-glycoprotein', carrier: 'intrinsic-carrier', glycoprotein: 'glycoprotein', cholOut: 'cholesterol', cholIn: 'cholesterol', glycolipid: 'glycolipid', extrinsic: 'extrinsic'};
/** Canonical slot numbers (1-based, `full`) — checked by fmm-selftest.cjs against fmmLayout. */
export const SLOTS = {glycolipid: [2], channel: [4, 5], cholOut: [6], cholIn: [7], receptor: [8, 9], carrier: [10, 11], glycoprotein: [12], extrinsicUnder: [3, 4]};
const IMBALANCE = 0.35;   // a stretch with n and n+1 items is (n + 1 − 0.35) wide

/** Entry timing: during the first ALIGN of a component's `show` progress the lipids only drift so the two leaflets
 * line up at the (zero-width) columns; the component's footprint then widens over the rest. */
const ALIGN = 0.2;
const grow = (p: number) => clamp01((p - ALIGN) / (1 - ALIGN));

function bilayerOnly(cx: number, u: number) {
  const outer: any[] = [], inner: any[] = [];
  const x0 = cx - 6 * u;
  let io = 0, ii = 0;
  for (const s of SEGS) if (!s.prot) for (const [arr, list, isOut] of [[outer, s.outer, true], [inner, s.inner, false]] as any) for (const k of list) {
    if (k !== 'pl') { arr.push({kind: k, x: NaN, idx: -1, p: 0}); continue; }
    const idx = isOut ? io++ : ii++;
    arr.push({kind: k, x: x0 + (idx + 0.5) * u, idx, p: 1});
  }
  return {outer, inner, x0, total: 12 * u};
}
function columnar(cx: number, u: number, sh: any, compShift: any) {
  const W = (k: string) => (k === 'pl' ? 1 : ease(grow(sh[k] ?? 1)));
  const widths = SEGS.map((s) => {
    if (s.prot) return s.w * ease(grow(sh[s.prot]));
    const so = s.outer.reduce((a: number, k: string) => a + W(k), 0), si = s.inner.reduce((a: number, k: string) => a + W(k), 0);
    return Math.max(so, si) - IMBALANCE * Math.min(1, Math.abs(so - si));
  });
  // lateral shift of a run of adjacent columns: the stretch on its left gains dx, the stretch on its right loses dx
  for (const [k, dx] of Object.entries(compShift || {})) {
    const i = SEGS.findIndex((s) => s.prot === k); if (i < 0 || !dx) continue;
    let l = i; while (l > 0 && SEGS[l - 1].prot) l--;
    let r = i; while (r < SEGS.length - 1 && SEGS[r + 1].prot) r++;
    if (l > 0) widths[l - 1] += dx as number;
    if (r < SEGS.length - 1) widths[r + 1] -= dx as number;
  }
  const total = widths.reduce((a, b) => a + b, 0) * u, x0 = cx - total / 2;
  const outer: any[] = [], inner: any[] = [], comps: any = {};
  let x = x0, io = 0, ii = 0;
  SEGS.forEach((s, si) => {
    const sw = widths[si] * u;
    if (s.prot) comps[s.prot] = {x: x + sw / 2, w: s.w * u, p: sh[s.prot], sx: ease(grow(sh[s.prot]))};
    else for (const [arr, list, isOut] of [[outer, s.outer, true], [inner, s.inner, false]] as any) {
      const sum = list.reduce((a: number, k: string) => a + W(k), 0) || 1;
      let c = 0;
      for (const k of list) {
        const w = W(k), xc = x + ((c + w / 2) / sum) * sw;
        c += w;
        const item = {kind: k, x: xc, idx: k === 'pl' ? (isOut ? io++ : ii++) : -1, p: k === 'pl' ? 1 : sh[k]};
        arr.push(item);
        if (k !== 'pl') comps[k] = {x: xc, w: u, p: item.p, sx: ease(grow(item.p))};
      }
    }
    x += sw;
  });
  return {outer, inner, comps, x0, total};
}

/** Geometry of the section: x of every item, protein columns (with `sx` = drawn footprint scale 0..1), faces, extent.
 * `compShift` {protKey: dx in u} slides a protein's run of adjacent columns sideways; the stretches either side
 * widen / narrow by the same amount (neighbours make way; nothing overlaps). */
export function fmmLayout({cx = 960, cy = 560, u = 58, show = FULL, compShift = {}}: any) {
  const sh: any = {...FULL, ...show};
  const pMax = Math.max(...PROT_KEYS.map((k) => sh[k]), sh.cholOut, sh.cholIn, sh.glycolipid);
  const C = columnar(cx, u, sh, compShift);
  let {outer, inner, x0, total} = C;
  const a = ease(clamp01(pMax / ALIGN));
  if (a < 1) {
    const B = bilayerOnly(cx, u), mix = (bb: any[], cc: any[]) => cc.map((it, i) => (it.kind === 'pl' ? {...it, x: bb[i].x + (it.x - bb[i].x) * a} : it));
    // same stretch order in both layouts, so items correspond one to one
    outer = mix(B.outer, C.outer); inner = mix(B.inner, C.inner);
    x0 = B.x0 + (C.x0 - B.x0) * a; total = B.total + (C.total - B.total) * a;
  }
  const comps = C.comps, ch = comps.channel;
  comps.extrinsic = {x: ch.x - (ch.w * ch.sx) / 2 - 0.02 * u, w: 1.7 * u, p: sh.extrinsic};
  return {cx, cy, u, outer, inner, comps, x0, x1: x0 + total, width: total,
    outerHead: cy - HY * u, innerHead: cy + HY * u, top: cy - FACE * u, bottom: cy + FACE * u, protTop: cy - PROT.H * u, protBottom: cy + PROT.H * u};
}

/** Lateral drift (spatially correlated so neighbours move together) + jiggle, px. */
function wobble(t: number, i: number, x0: number, u: number, amt: number, jig: number, slow = 1) {
  const drift = u * amt * slow * (0.22 * Math.sin(0.55 * t + x0 * 0.0035) + 0.1 * Math.sin(0.31 * t + 1.3 + x0 * 0.0055));
  const jx = u * jig * (0.035 * Math.sin(t * 5.1 + i * 2.3) + 0.02 * Math.sin(t * 7.7 + i * 1.1));
  const jy = u * jig * 0.03 * Math.sin(t * 6.3 + i * 1.7);
  const ja = jig * 3.2 * Math.sin(t * 4.3 + i * 0.9);
  return {dx: drift + jx, dy: jy, da: ja};
}

/** Carbohydrate bead chain rising from (x, y) on the outer face. n beads; `reveal` 0..1 grows it from the base. */
export function BeadChain({x, y, u = 58, n = 4, t = 0, reveal = 1, branch = -1, opacity = 1, hl = 0, sway = 1}: any) {
  if (opacity <= 0 || reveal <= 0) return null;
  const r = 0.155 * u, step = 0.36 * u, pts: number[][] = [], par: number[] = [];
  const shown = Math.max(0, Math.min(n, reveal * n));
  for (let k = 0; k < n; k++) {
    const sx = sway * u * 0.05 * (k + 1) * Math.sin(t * 1.3 + x * 0.01 + k * 0.4);
    const pk = k === 0 ? -1 : branch >= 0 && (k === branch + 1 || k === branch + 2) ? branch : k - 1;
    par.push(pk);
    const base = pk < 0 ? [x, y + step * 0.2] : pts[pk];
    if (branch >= 0 && k === branch + 1) pts.push([base[0] + step * 0.8 + sx * 0.2, base[1] - step * 0.55]);
    else pts.push([base[0] + sx * 0.25, base[1] - step]);
  }
  const beads = pts.slice(0, Math.ceil(shown));
  const last = shown - Math.floor(shown);
  const links = beads.map((p, k) => { const q = par[k] < 0 ? [x, y] : pts[par[k]]; return `M${f(q[0])} ${f(q[1])}L${f(p[0])} ${f(p[1])}`; });
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      {hl > 0 && beads.map((p, k) => <circle key={'h' + k} cx={p[0]} cy={p[1]} r={r + 6} fill="#FFFFFF" opacity={0.8 * hl} />)}
      <path d={links.join('')} stroke={T4.carbEdge} strokeWidth={2.4} fill="none" />
      {beads.map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r={k === beads.length - 1 && last > 0 ? r * (0.35 + 0.65 * last) : r} fill={T4.carb} stroke={T4.carbEdge} strokeWidth={1.8} />)}
    </g>
  );
}

/** Cholesterol: small polar OH knob at head level, flat four-ring plate among the tails, short tail. dir +1 = outer
 * leaflet (OH up), −1 = inner leaflet (OH down). (x, y) = OH knob centre. */
export function Cholesterol({x, y, u = 58, dir = 1, opacity = 1, hl = 0, angle = 0}: any) {
  if (opacity <= 0) return null;
  const s = dir, w = 0.44 * u, y0 = y + s * 0.2 * u, y1 = y + s * 1.2 * u, r = 0.12 * u;
  const top = Math.min(y0, y1), h = Math.abs(y1 - y0);
  const hex = (cx0: number, cy0: number, rr: number, n = 6) => 'M' + Array.from({length: n}, (_, i) => { const a = Math.PI / 2 + (i * 2 * Math.PI) / n; return `${f(cx0 + rr * Math.cos(a))} ${f(cy0 + rr * Math.sin(a))}`; }).join('L') + 'Z';
  const rr = 0.13 * u, ring = [0.2, 0.42, 0.64].map((k, i) => hex(x + (i % 2 ? 0.07 : -0.07) * u, top + k * h * 1.18, rr)).join('') + hex(x + 0.03 * u, top + 0.86 * h * 1.08, rr * 0.92, 5);
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined} transform={angle ? `rotate(${f(angle)} ${f(x)} ${f(y)})` : undefined}>
      {hl > 0 && <path d={roundRect(x - w / 2 - 8, Math.min(y - 0.3 * u, top) - 8, x + w / 2 + 8, Math.max(y + 0.3 * u, top + h) + 0.5 * u + 8, 14)} fill="#FFFFFF" opacity={0.8 * hl} />}
      <path d={`M${f(x)} ${f(y1)}L${f(x + 0.08 * u)} ${f(y1 + s * 0.28 * u)}L${f(x - 0.02 * u)} ${f(y1 + s * 0.55 * u)}`} stroke={T4.cholesterolEdge} strokeWidth={Math.max(2.2, 0.06 * u)} fill="none" strokeLinecap="round" />
      <path d={roundRect(x - w / 2, top, x + w / 2, top + h, r)} fill={T4.cholesterol} stroke={T4.cholesterolEdge} strokeWidth={2} />
      <path d={ring} fill="none" stroke={T4.cholesterolEdge} strokeWidth={1.4} opacity={0.8} />
      <circle cx={x} cy={y} r={0.17 * u} fill="#E5C27A" stroke={T4.cholesterolEdge} strokeWidth={2} />
    </g>
  );
}

/** Glycolipid: schematic lipid anchor (two hydrophobic tails + neutral-coloured attachment node; NOT the amber
 * phosphate head) carrying the 4-bead carbohydrate chain above the outer surface. (x, y) = node centre. */
export function Glycolipid({x, y, u = 58, t = 0, opacity = 1, hl = 0, chain = 1, angle = 0}: any) {
  if (opacity <= 0) return null;
  const [a, b] = tailPaths(x, y, u), n = 0.3 * u;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <g data-role="drawing" transform={angle ? `rotate(${f(angle)} ${f(x)} ${f(y)})` : undefined}>
        {hl > 0 && <circle cx={x} cy={y} r={n + 8} fill="#FFFFFF" opacity={0.85 * hl} />}
        <path d={a} stroke={T4.tail} strokeWidth={Math.max(2.2, u * 0.075)} strokeLinecap="round" fill="none" />
        <path d={b} stroke={T4.tail} strokeWidth={Math.max(2.2, u * 0.075)} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x={x - n} y={y - n * 0.85} width={2 * n} height={1.7 * n} rx={n * 0.45} fill="#DCD5C6" stroke="#8C8578" strokeWidth={2} />
      </g>
      <BeadChain x={x} y={y - n * 0.85} u={u} n={4} t={t} reveal={chain} branch={1} hl={hl} />
    </g>
  );
}

/** Glycoprotein body (1 slot wide, spanning). */
function GlycoproteinBody({x, y, u, hl = 0}: any) {
  const H = PROT.H * u, w = 0.43 * u;
  return (
    <g data-role="drawing">
      {hl > 0 && <path d={roundRect(x - w - 8, y - H - 8, x + w + 8, y + H + 8, 0.3 * u + 8)} fill="#FFFFFF" opacity={0.8 * hl} />}
      <path d={roundRect(x - w, y - H, x + w, y + H, 0.3 * u)} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} />
    </g>
  );
}
/** Extrinsic protein: rounded blob on the cytoplasmic face. (x, y) = its top-centre (touching the heads). */
function ExtrinsicBody({x, y, u, hl = 0}: any) {
  const w = 0.85 * u, h = 0.8 * u, k = 0.5523;
  const d = `M${f(x - w)} ${f(y + h * 0.45)}C${f(x - w)} ${f(y + h * 0.45 - h * 0.45 * k)} ${f(x - w * 0.55)} ${f(y)} ${f(x - w * 0.1)} ${f(y)}L${f(x + w * 0.25)} ${f(y)}C${f(x + w * 0.7)} ${f(y)} ${f(x + w)} ${f(y + h * 0.2)} ${f(x + w)} ${f(y + h * 0.5)}C${f(x + w)} ${f(y + h * 0.85)} ${f(x + w * 0.6)} ${f(y + h)} ${f(x + w * 0.1)} ${f(y + h)}L${f(x - w * 0.35)} ${f(y + h)}C${f(x - w * 0.8)} ${f(y + h)} ${f(x - w)} ${f(y + h * 0.8)} ${f(x - w)} ${f(y + h * 0.45)}Z`;
  return (
    <g data-role="drawing">
      {hl > 0 && <path d={roundRect(x - w - 8, y - 8, x + w + 8, y + h + 8, 20)} fill="#FFFFFF" opacity={0.8 * hl} />}
      <path d={d} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={2.4} />
    </g>
  );
}

/** Scattered start of `assemble`: 24 tokens at random positions/orientations inside `field` [x0,y0,x1,y1]. */
export function scatterPose(i: number, field: number[], t: number) {
  const r = (k: number) => { const v = Math.sin((i + 1) * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  const col = i % 8, row = Math.floor(i / 8);
  const x = field[0] + ((col + 0.2 + 0.6 * r(1)) / 8) * (field[2] - field[0]);
  const y = field[1] + ((row + 0.2 + 0.6 * r(2)) / 3) * (field[3] - field[1]);
  const a = r(3) * 360 - 180 + 25 * Math.sin(t * 0.9 + i);
  return {x: x + 6 * Math.sin(t * 1.7 + i * 2.1), y: y + 5 * Math.sin(t * 1.3 + i * 1.3), a};
}

/** Lateral-drift amplitude at x: 1 for free lipids, easing to the proteins' 0.45 next to a protein column. */
function driftAmp(Lf: any, x: number) {
  const u = Lf.u; let d = 1e9;
  for (const k of PROT_KEYS) { const c = Lf.comps[k]; if (c.sx > 0) d = Math.min(d, Math.abs(x - c.x) - (c.w * c.sx) / 2); }
  return 0.45 + 0.55 * clamp01((d - 0.5 * u) / (1.5 * u));
}

/** The membrane. See the header for the contract. */
export function FluidMosaicMembrane(props: any) {
  const {cx = 960, cy = 560, u = 58, t = 0, show = FULL, chains = {}, highlight = null, hl = 0, carrierPhase = 0,
    drift = 1, jitter = 1, opacity = 1, tracer = -1, tracerTint = 0, assemble = 1, scatter = 1, field = [220, 260, 1700, 860],
    rBands = 0, rBandsOn = null, poreWater = false, compDim = {}, dimLipids = 0, hideComp = {}, keep = [], plShift = {}, compShift = {}} = props;
  if (opacity <= 0) return null;
  const sh = {...FULL, ...show};
  const Lf = fmmLayout({cx, cy, u, show: sh, compShift});
  const L0 = fmmLayout({cx, cy, u, show: BILAYER});
  const ch = {glycolipid: 1, receptor: 1, glycoprotein: 1, ...chains};
  const dimOf = (id: CompId | 'lipid') => {
    const base = highlight ? (highlight === id ? 1 : 1 - 0.5 * hl) : 1;
    return base * (id === 'lipid' ? 1 - dimLipids : 1 - ((compDim as any)[id] ?? 0));
  };
  const hlOf = (id: CompId) => (highlight === id ? hl : 0);
  const out: any[] = [];
  // ---- assembly (bilayer only) ----
  if (assemble < 1) {
    const toks: any[] = [];
    for (const [arr, isOut] of [[L0.outer, true], [L0.inner, false]] as any) for (const it of arr) {
      if (it.kind !== 'pl') continue;   // component slots are empty (width 0) in the bilayer-only layout
      const i = it.idx + (isOut ? 0 : 12), st = scatterPose(i, field, t);
      const edge = {x: st.x + (st.x < cx ? -900 : 900), y: st.y};
      const sc = keep.includes(i) ? 1 : ease(clamp01(scatter * 1.25 - (i % 5) * 0.06));
      const sx = edge.x + (st.x - edge.x) * sc, sy = st.y;
      const d = ((i * 7) % 24) / 24 * 0.35, q = ease(clamp01((assemble - d) / 0.65));
      const w = wobble(t, i, it.x, u, 0, jitter);
      const fx = it.x + w.dx, fy = (isOut ? Lf.outerHead : Lf.innerHead) + w.dy, fa = isOut ? w.da : 180 + w.da;
      let da = ((fa - st.a) % 360 + 540) % 360 - 180;
      toks.push(<PhospholipidToken key={'a' + i} x={sx + (fx - sx) * q} y={sy + (fy - sy) * q} u={u} angle={st.a + da * q} opacity={sc} />);
    }
    return <g opacity={opacity < 1 ? opacity : undefined}>{toks}</g>;
  }
  // ---- lipids ----
  // entry AT THE SEAT: footprint scale sx 0..1 (the neighbours part by exactly sx × its width; see the header)
  const entry = (k: string, xFinal: number) => { const sx = k in Lf.comps ? Lf.comps[k].sx ?? 1 : 1; return {x: xFinal, sx, o: clamp01(sx * 3)}; };
  const xs = (x: number, sx: number, el: any, key: string) => (sx >= 1 ? el : <g key={key} transform={`translate(${f(x)} 0) scale(${sx.toFixed(4)} 1) translate(${f(-x)} 0)`}>{el}</g>);
  // lipids next to a protein column drift with it (protein drift amplitude), so resting neighbours never collide
  const amp = (x: number) => driftAmp(Lf, x);
  for (const [arr, isOut] of [[Lf.outer, true], [Lf.inner, false]] as any) for (const it of arr) {
    const i = it.idx + (isOut ? 0 : 12);
    if (it.kind === 'pl') {
      const w = wobble(t, i, it.x, u, drift * amp(it.x), jitter), ps = (plShift as any)[i] || {dx: 0, o: 1};   // plShift: lateral swap (units u; o < 1 while passing behind a neighbour)
      out.push(<PhospholipidToken key={'p' + i} x={it.x + w.dx + ps.dx * u} y={(isOut ? Lf.outerHead : Lf.innerHead) + w.dy} u={u} angle={isOut ? w.da : 180 + w.da} opacity={dimOf('lipid') * (ps.o ?? 1)} tint={i === tracer ? tracerTint : 0} />);
    }
  }
  // ---- cholesterol (among the lipids) ----
  for (const k of ['cholOut', 'cholIn']) {
    const it = (k === 'cholOut' ? Lf.outer : Lf.inner).find((x: any) => x.kind === k);
    if (!it || sh[k as ShowKey] <= 0 || (hideComp as any).cholesterol) continue;
    const e = entry(k, it.x), w = wobble(t, k === 'cholOut' ? 30 : 31, it.x, u, drift * amp(it.x), jitter, 0.8);
    out.push(xs(e.x + w.dx, e.sx, <Cholesterol key={k} x={e.x + w.dx} y={(k === 'cholOut' ? Lf.outerHead : Lf.innerHead) + w.dy} u={u} dir={k === 'cholOut' ? 1 : -1} opacity={e.o * dimOf('cholesterol')} hl={hlOf('cholesterol')} />, k));
  }
  // ---- glycolipid ----
  {
    const it = Lf.outer.find((x: any) => x.kind === 'glycolipid');
    if (it && sh.glycolipid > 0 && !(hideComp as any).glycolipid) {
      const e = entry('glycolipid', it.x), w = wobble(t, 32, it.x, u, drift * amp(it.x), jitter, 0.8);
      out.push(xs(e.x + w.dx, e.sx, <Glycolipid key="gl" x={e.x + w.dx} y={Lf.outerHead + w.dy} u={u} t={t} chain={ch.glycolipid} opacity={e.o * dimOf('glycolipid')} hl={hlOf('glycolipid')} angle={w.da * 0.6} />, 'gl'));
    }
  }
  // ---- spanning proteins ----
  const pw = (k: string, i: number) => wobble(t, 40 + i, Lf.comps[k].x, u, drift * 0.45, jitter * 0.4, 1);
  PROT_KEYS.forEach((k, i) => {
    const c = Lf.comps[k];
    if (!c || c.p <= 0 || (hideComp as any)[COMP_OF[k]]) return;
    const e = entry(k, c.x), w = pw(k, i), x = e.x + w.dx, y = cy + w.dy * 0.5, id = COMP_OF[k], o = e.o * dimOf(id);
    const n0 = out.length;
    if (k === 'channel') out.push(<ChannelProtein key={k} x={x} y={y} u={u} opacity={o} hl={hlOf(id)} poreWater={poreWater} />);
    if (k === 'carrier') out.push(<CarrierProtein key={k} x={x} y={y} u={u} phase={carrierPhase} opacity={o} hl={hlOf(id)} />);
    if (k === 'receptor') out.push(<g key={k} opacity={o < 1 ? o : undefined}><ReceptorProtein x={x} y={y} u={u} hl={hlOf(id)} /><BeadChain x={x + 0.62 * u} y={y - PROT.H * u} u={u} n={3} t={t} reveal={ch.receptor} hl={hlOf(id)} /></g>);
    if (k === 'glycoprotein') out.push(<g key={k} opacity={o < 1 ? o : undefined}><GlycoproteinBody x={x} y={y} u={u} hl={hlOf(id)} /><BeadChain x={x} y={y - PROT.H * u} u={u} n={5} t={t} reveal={ch.glycoprotein} hl={hlOf(id)} /></g>);
    if (rBands > 0 && (!rBandsOn || rBandsOn.includes(k))) {
      const hw = (k === 'glycoprotein' ? 0.43 : PROT.W / 2) * u + 3, mid = 1.55 * u, H = PROT.H * u;
      const midP = clamp01(rBands * 2), outP = clamp01(rBands * 2 - 1);
      out.push(<g key={'rb' + k} data-role="decor" opacity={o < 1 ? o : undefined}>
        {midP > 0 && <rect x={x - hw} y={y - mid} width={2 * hw} height={2 * mid} rx={6} fill="#4F6F73" opacity={0.3 * midP} />}
        {outP > 0 && <rect x={x - hw} y={y - H - 3} width={2 * hw} height={H - mid - 0.45 * u} rx={8} fill="#FFFFFF" opacity={0.5 * outP} />}
        {outP > 0 && <rect x={x - hw} y={y + mid + 0.45 * u} width={2 * hw} height={H - mid - 0.45 * u + 3} rx={8} fill="#FFFFFF" opacity={0.5 * outP} />}
      </g>);
    }
    if (e.sx < 1) out.splice(n0, out.length - n0, xs(x, e.sx, <g>{out.slice(n0)}</g>, 'xs' + k));
  });
  // ---- extrinsic ----
  if (sh.extrinsic > 0 && !(hideComp as any).extrinsic) {
    const c = Lf.comps.extrinsic, p = ease(sh.extrinsic), w = pw('channel', 0);
    out.push(<g key="ex" opacity={clamp01(sh.extrinsic * 3) * dimOf('extrinsic') < 1 ? clamp01(sh.extrinsic * 3) * dimOf('extrinsic') : undefined}><ExtrinsicBody x={c.x + w.dx} y={Lf.bottom + 0.02 * u + (1 - p) * 2.2 * u} u={u} hl={hlOf('extrinsic')} /></g>);
  }
  return <g opacity={opacity < 1 ? opacity : undefined}>{out}</g>;
}

/** Live position of a component (with its drift) for pointing labels/ink at it. */
export function compPos(props: any, key: ShowKey) {
  const {cx = 960, cy = 560, u = 58, t = 0, show = FULL, drift = 1, jitter = 1, compShift = {}} = props;
  const Lf = fmmLayout({cx, cy, u, show, compShift});
  if (key === 'cholOut' || key === 'cholIn' || key === 'glycolipid') {
    const it = (key === 'cholIn' ? Lf.inner : Lf.outer).find((x: any) => x.kind === key);
    const w = wobble(t, key === 'cholOut' ? 30 : key === 'cholIn' ? 31 : 32, it.x, u, drift * driftAmp(Lf, it.x), jitter, 0.8);
    return {x: it.x + w.dx, y: (key === 'cholIn' ? Lf.innerHead : Lf.outerHead) + w.dy};
  }
  const i = PROT_KEYS.indexOf(key === 'extrinsic' ? 'channel' : key), c = Lf.comps[key];
  const w = wobble(t, 40 + Math.max(0, i), key === 'extrinsic' ? Lf.comps.channel.x : c.x, u, drift * 0.45, jitter * 0.4, 1);
  return {x: c.x + w.dx, y: key === 'extrinsic' ? Lf.bottom + 0.42 * u : cy + w.dy * 0.5};
}
/** Live position of phospholipid i (0–11 outer, 12–23 inner) head centre. */
export function plPos(props: any, i: number) {
  const {cx = 960, cy = 560, u = 58, t = 0, show = FULL, drift = 1, jitter = 1, compShift = {}} = props;
  const Lf = fmmLayout({cx, cy, u, show, compShift});
  const isOut = i < 12, it = (isOut ? Lf.outer : Lf.inner).find((x: any) => x.kind === 'pl' && x.idx === (isOut ? i : i - 12));
  const w = wobble(t, i, it.x, u, drift * driftAmp(Lf, it.x), jitter);
  return {x: it.x + w.dx, y: (isOut ? Lf.outerHead : Lf.innerHead) + w.dy};
}
