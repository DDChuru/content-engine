/** MitosisCellModel — SHARED-SPECS §5 and the 5.2.1 storyboard "The models, specified once" (built by cloud run 009b,
 * because the SHARED_FROM set (009a) did not include it; 5.2.1 publishes the teaching of it).
 * Two variants, the same 2n = 4 chromosome set (C1, C2 long; C3, C4 short — ChromosomeModel Z0 instances, gene bands and
 * grey telomere blocks identical on sister chromatids) and the same stage ids:
 *   interphase · prophase-early · prophase-late · metaphase · anaphase · telophase · cytokinesis   (see MSTAGES)
 * Every change is driven by continuous parameters, so every transition is MOTION:
 *   cond      chromosomes condense (replicated-extended → replicated-condensed)
 *   nucleolus nucleolus of the interphase nucleus (fades in prophase-early)
 *   env       nuclear envelope: 1 intact double line … 0 fragmented and dispersed (fragments drift outward)
 *   centro    animal: the two centrosomes (each a pair of centrioles) move round the envelope to the poles
 *   spindle   spindle microtubules grow from the poles (outside the envelope while it is intact; attached fibres reach the
 *             centromeres, opposite poles to the two sister chromatids, only after envelope breakdown)
 *   align     chromosomes drawn to the equator (centromeres on it, each chromatid facing a different pole)
 *   sep       0 | 1 — the centromeres divide: switched in ONE rendered frame by the beat on the cue frame
 *   pole      daughter chromosomes move to the poles, centromere leading, arms trailing
 *   newEnv    telophase: envelope fragments gather and close round each group
 *   newNuc    telophase: a nucleolus grows back in each new nucleus
 *   decond    telophase: chromosomes decondense
 *   spOff     telophase: spindle shortens back and fades (breakdown)
 *   cyto      animal: cleavage furrow (cell surface membrane drawn in) until two cells part (0 … 1)
 *             plant: vesicles travel to the equator (0–0.4), fuse into a cell plate from the centre out (0.4–0.75),
 *             the plate becomes the new cell walls with membrane on each side (0.75–1)
 * Geometry: the spindle axis is horizontal (poles left/right; equator a vertical line through the centre).
 * animal: round cell, diameter 620 px at size 1 (cell surface membrane, single line); nucleus with a double-line nuclear
 * envelope and a nucleolus; two centrosomes at upper left in interphase. plant: rectangular cell wall 660 × 440 px with the
 * cell surface membrane just inside; no centrioles; broad unmarked pole regions.
 * Colours only from T5. No labels are drawn here (beats label via mGeom). Top <g> is data-role="drawing". */
import React from 'react';
import {T5} from './t5-palette';
import {Chromosome, CId, SPECS, chromGeom} from './ChromosomeModel';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f1 = (v: number) => v.toFixed(1);

export type MParams = {
  cond: number; nucleolus: number; env: number; centro: number; spindle: number; align: number; sep: number; pole: number;
  newEnv: number; newNuc: number; decond: number; spOff: number; cyto: number;
};
/** Stage presets = the state reached at the END of each stage (beats blend between them with mixM). */
export const MSTAGES: Record<string, MParams> = {
  'interphase':     {cond: 0, nucleolus: 1, env: 1, centro: 0, spindle: 0, align: 0, sep: 0, pole: 0, newEnv: 0, newNuc: 0, decond: 0, spOff: 0, cyto: 0},
  'prophase-early': {cond: 1, nucleolus: 0, env: 1, centro: 0.35, spindle: 0, align: 0, sep: 0, pole: 0, newEnv: 0, newNuc: 0, decond: 0, spOff: 0, cyto: 0},
  'prophase-late':  {cond: 1, nucleolus: 0, env: 0, centro: 1, spindle: 0.55, align: 0, sep: 0, pole: 0, newEnv: 0, newNuc: 0, decond: 0, spOff: 0, cyto: 0},
  'metaphase':      {cond: 1, nucleolus: 0, env: 0, centro: 1, spindle: 1, align: 1, sep: 0, pole: 0, newEnv: 0, newNuc: 0, decond: 0, spOff: 0, cyto: 0},
  'anaphase':       {cond: 1, nucleolus: 0, env: 0, centro: 1, spindle: 1, align: 1, sep: 1, pole: 1, newEnv: 0, newNuc: 0, decond: 0, spOff: 0, cyto: 0},
  'telophase':      {cond: 1, nucleolus: 0, env: 0, centro: 1, spindle: 1, align: 1, sep: 1, pole: 1, newEnv: 1, newNuc: 1, decond: 1, spOff: 1, cyto: 0},
  'cytokinesis':    {cond: 1, nucleolus: 0, env: 0, centro: 1, spindle: 1, align: 1, sep: 1, pole: 1, newEnv: 1, newNuc: 1, decond: 1, spOff: 1, cyto: 1},
};
export const MORDER = ['interphase', 'prophase-early', 'prophase-late', 'metaphase', 'anaphase', 'telophase', 'cytokinesis'];
/** Blend two parameter sets (u 0..1). `sep` is never blended: it takes b's value only when u >= 1 (the beat sets it on
 * the cue frame explicitly when a separation is shown). */
export function mixM(a: MParams, b: MParams, u: number): MParams {
  const k = c01(u), out: any = {};
  for (const key of Object.keys(a)) out[key] = key === 'sep' ? (k >= 1 ? (b as any)[key] : (a as any)[key]) : lerp((a as any)[key], (b as any)[key], k);
  return out;
}
/** Parameters for a continuous stage coordinate q: 0 = interphase … 6 = cytokinesis complete (q = i + u blends stage i →
 * i+1). Separation (q crossing 3 → 4) must still be switched by the beat on its cue frame via `sep`. */
export function stageAt(q: number, sep?: number): MParams {
  const i = Math.max(0, Math.min(5, Math.floor(q))), u = c01(q - i);
  const p = mixM(MSTAGES[MORDER[i]], MSTAGES[MORDER[i + 1]], q >= 6 ? 1 : u);
  if (sep != null) p.sep = sep;
  return p;
}

export type MProps = Partial<MParams> & {
  x: number; y: number; size?: number; variant?: 'animal' | 'plant'; opacity?: number;
  hiGene?: number; hiCen?: number; chromOpacity?: number; dimSpindle?: number;
};
const ORDER: CId[] = ['C1', 'C3', 'C2', 'C4'];
const SCAT = [[-0.42, -0.34, 32], [0.36, -0.3, -38], [-0.3, 0.4, 68], [0.34, 0.34, -16]];   // interphase scatter (× nucleus r)

/** Full layout for a parameter set: chromosome instances and page-space key points. */
export function mLayout(p: MProps) {
  const size = p.size ?? 1, R = 310 * size, plant = p.variant === 'plant';
  const W = 660 * size, H = 440 * size;
  const cs = 0.5 * size, gap = 14 * size;
  const cond = c01(p.cond ?? 0), align = ease(c01(p.align ?? 0)), pole = ease(c01(p.pole ?? 0)), decond = ease(c01(p.decond ?? 0));
  const sep = (p.sep ?? 0) >= 0.5;
  const nr = 0.36 * R;
  const cellOff = c01(p.cyto ?? 0);
  const Dpole = (plant ? 0.52 * W / 2 * 1.1 : 0.6 * R);
  const Dn = plant ? Dpole * 0.93 : 0.5 * R;
  const nucX = plant ? Dn : lerp(Dn, 0.74 * R, ease(cellOff));
  const P = plant ? W / 2 - 40 * size : 0.82 * R;           // pole x (animal: centrosomes; plant: broad region centre)
  const Ls = ORDER.map((id) => SPECS[id].lenC * cs);
  const total = Ls.reduce((a, b) => a + b, 0) + gap * (ORDER.length - 1);
  let cur = -total / 2;
  const chroms = ORDER.map((id, i) => {
    const L = Ls[i], cenY = cur + SPECS[id].cen * L; cur += L + gap;
    const [sx, sy, sr] = SCAT[i];
    // interphase: small, scattered in the nucleus; condensing grows the drawing scale back to cs
    const sc0 = lerp(0.3 * cs, cs, ease(cond));
    const yComp = lerp(1, 0.78, pole) * lerp(1, 0.4, decond);
    const x = lerp(sx * nr * 0.9, 0, align), y = lerp(sy * nr * 0.9, cenY * yComp, align), rot = lerp(sr, 0, align);
    const dPage = pole * Dpole - (Dpole - Dn) * decond * 0.75 + (nucX - Dn);
    const ccond = cond * (1 - 0.42 * decond);
    const sc = sc0 * lerp(1, 0.62, decond);
    return {id, x: p.x + x, y: p.y + y, rot, scale: sc, cond: ccond, rep: 1, sep: sep ? 1 : 0, dist: sep ? dPage / sc : 0,
      trail: sep ? Math.min(1, pole * 5) * (1 - 0.5 * decond) : 0, wave: lerp(0.8, 0.35, decond)};
  });
  return {size, R, W, H, plant, nr, P, Dpole, chroms,
    poles: [[p.x - P, p.y], [p.x + P, p.y]],
    nuclei: [[p.x - nucX, p.y], [p.x + nucX, p.y]], newNr: plant ? 0.3 * R : 0.25 * R,
    cells: plant ? [[p.x - W / 4, p.y], [p.x + W / 4, p.y]] : [[p.x - 0.74 * R, p.y], [p.x + 0.74 * R, p.y]],
    centre: [p.x, p.y]};
}
/** Page-space geometry for labels and rings (beats use this; the model draws no labels). */
export const mGeom = (p: MProps) => mLayout(p);

function arcD(cx: number, cy: number, r: number, a0: number, a1: number) {
  const n = Math.max(3, Math.ceil(Math.abs(a1 - a0) * 10));
  return 'M' + Array.from({length: n + 1}, (_, i) => { const a = a0 + (a1 - a0) * i / n; return f1(cx + r * Math.cos(a)) + ' ' + f1(cy + r * Math.sin(a)); }).join('L');
}
/** Double-line envelope: intact (k = 1) or broken into 12 fragments drifting outward (k < 1); `gather` = re-forming. */
function Envelope({cx, cy, r, k, size, fill = true}: any) {
  const kk = c01(k);
  if (kk <= 0) return null;
  const d = 7 * size;
  if (kk >= 1) return (
    <g>
      {fill && <circle cx={f1(cx)} cy={f1(cy)} r={f1(r)} fill={T5.nucleoplasm} />}
      <circle cx={f1(cx)} cy={f1(cy)} r={f1(r)} fill="none" stroke={T5.envelope} strokeWidth={f1(2.6 * size + 0.6)} />
      <circle cx={f1(cx)} cy={f1(cy)} r={f1(r - d)} fill="none" stroke={T5.envelope} strokeWidth={f1(2 * size + 0.5)} />
    </g>
  );
  const rr = r * (1 + (1 - kk) * 0.55), cover = lerp(0.3, 0.92, kk), out: any[] = [];
  for (let i = 0; i < 12; i++) {
    const mid = (i + 0.5) * Math.PI / 6 + (1 - kk) * 0.25 * Math.sin(i * 2.1), half = cover * Math.PI / 12;
    out.push(<path key={'o' + i} d={arcD(cx, cy, rr, mid - half, mid + half)} fill="none" stroke={T5.envelope} strokeWidth={f1(2.6 * size + 0.6)} strokeLinecap="round" />);
    out.push(<path key={'i' + i} d={arcD(cx, cy, rr - d, mid - half * 0.94, mid + half * 0.94)} fill="none" stroke={T5.envelope} strokeWidth={f1(2 * size + 0.5)} strokeLinecap="round" />);
  }
  return <g opacity={kk < 0.35 ? f1(kk / 0.35) : undefined}>{fill && <circle cx={f1(cx)} cy={f1(cy)} r={f1(r)} fill={T5.nucleoplasm} opacity={f1(kk * kk)} />}{out}</g>;
}
/** A centrosome: pale halo with a pair of centrioles (two short perpendicular cylinders). */
function Centrosome({x, y, size}: any) {
  const s = size;
  return (
    <g>
      <circle cx={f1(x)} cy={f1(y)} r={f1(20 * s + 3)} fill={T5.vesicle} opacity={0.8} />
      <rect x={f1(x - 11 * s - 1)} y={f1(y - 4 * s - 1)} width={f1(22 * s + 2)} height={f1(8 * s + 2)} rx={f1(2 * s)} fill={T5.centriole} />
      <rect x={f1(x + 1 * s)} y={f1(y - 2 * s - 11 * s)} width={f1(8 * s + 2)} height={f1(22 * s + 2)} rx={f1(2 * s)} fill={T5.centriole} opacity={0.85} />
    </g>
  );
}
/** Animal cell outline for cleavage: the union of two circles moving apart (c 0 = one cell … 1 = two cells). */
function cellPath(cx: number, cy: number, R: number, c: number) {
  const k = ease(c01(c)), d = k * 0.74 * R, r = lerp(R, 0.7 * R, k);
  if (d <= 0.5) return [arcD(cx, cy, r, 0, 2 * Math.PI) + 'Z'];
  if (d >= r) return [arcD(cx - d, cy, r, 0, 2 * Math.PI) + 'Z', arcD(cx + d, cy, r, 0, 2 * Math.PI) + 'Z'];
  const phi = Math.atan2(Math.sqrt(r * r - d * d), d);
  const A = arcD(cx - d, cy, r, phi, 2 * Math.PI - phi);                    // left cell, round the far side
  const B = arcD(cx + d, cy, r, -(Math.PI - phi), Math.PI - phi).replace('M', 'L');   // right cell
  return [A + B + 'Z'];
}

export function MitosisCellModel(p: MProps) {
  const op = p.opacity ?? 1;
  if (op <= 0) return null;
  const G = mLayout(p), s = G.size, {R, W, H, plant, nr} = G;
  const x = p.x, y = p.y;
  const env = c01(p.env ?? 1), newEnv = c01(p.newEnv ?? 0), spindle = c01(p.spindle ?? 0), spOff = c01(p.spOff ?? 0);
  const cyto = c01(p.cyto ?? 0), sep = (p.sep ?? 0) >= 0.5, cen = ease(c01(p.centro ?? 0));
  const els: any[] = [];
  // ---- cell boundary
  if (plant) {
    const wt = 16 * s, mIn = 6 * s;
    els.push(<rect key="wall" x={f1(x - W / 2)} y={f1(y - H / 2)} width={f1(W)} height={f1(H)} rx={f1(10 * s)} fill={T5.cellWall} opacity={0.55} />);
    els.push(<rect key="wallEdge" x={f1(x - W / 2)} y={f1(y - H / 2)} width={f1(W)} height={f1(H)} rx={f1(10 * s)} fill="none" stroke={T5.cellWall} strokeWidth={f1(3 * s + 0.6)} />);
    els.push(<rect key="cyto" x={f1(x - W / 2 + wt)} y={f1(y - H / 2 + wt)} width={f1(W - 2 * wt)} height={f1(H - 2 * wt)} rx={f1(6 * s)} fill={T5.cytoplasm} />);
    els.push(<rect key="mem" x={f1(x - W / 2 + wt + mIn * 0.2)} y={f1(y - H / 2 + wt + mIn * 0.2)} width={f1(W - 2 * wt - mIn * 0.4)} height={f1(H - 2 * wt - mIn * 0.4)} rx={f1(6 * s)} fill="none" stroke={T5.membrane} strokeWidth={f1(2 * s + 0.5)} />);
  } else {
    cellPath(x, y, R, cyto).forEach((d, i) => els.push(<path key={'cell' + i} d={d} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={f1(3 * s + 0.5)} strokeLinejoin="round" />));
  }
  // ---- spindle (thin grey lines). Attached fibres pole → centromere only after envelope breakdown.
  const spOp = spindle * (1 - spOff) * (1 - 0.6 * c01(p.dimSpindle ?? 0));
  if (spOp > 0.01) {
    const fib: any[] = [];
    const [[plx, ply], [prx, pry]] = G.poles;
    const polePt = (side: number, j: number) => plant ? [side < 0 ? plx : prx, y + (j - 1.5) * 0.14 * H * lerp(1, 0.6, spOff)] : [side < 0 ? plx : prx, side < 0 ? ply : pry];
    const grow = c01(spindle / 0.6);
    // overlapping (non-attached) fibres: from each pole across the equator; kept outside an intact envelope
    const envR = nr * (1 + (1 - env) * 0.55) + 4 * s;
    for (const side of [-1, 1]) for (let j = 0; j < 4; j++) {
      const [ax, ay] = polePt(side, j);
      const ty = y + (j - 1.5) * (plant ? 0.2 * H : 0.26 * R) * (env > 0.3 ? 1.9 : 1);
      const tx = x - side * 0.12 * R;
      let ex = lerp(ax, tx, grow), ey = lerp(ay, ty, grow);
      if (env > 0.3) { const L = Math.hypot(ex - x, ey - y); if (L < envR) { const k2 = envR / Math.max(L, 1); ex = x + (ex - x) * k2; ey = y + (ey - y) * k2; } }
      fib.push(<line key={`o${side}${j}`} x1={f1(ax)} y1={f1(ay)} x2={f1(ex)} y2={f1(ey)} stroke={T5.spindle} strokeWidth={f1(1.6 * s + 0.4)} opacity={0.6} />);
    }
    // chromosome-attached fibres: opposite poles to the two sister chromatids (after envelope breakdown)
    const att = c01((spindle - 0.55) / 0.45) * c01((0.3 - env) / 0.3);
    if (att > 0) G.chroms.forEach((c, i) => {
      for (const side of [-1, 1]) {
        const cp = chromCen(c, side);
        const [ax, ay] = polePt(side, i);
        fib.push(<line key={`a${i}${side}`} x1={f1(ax)} y1={f1(ay)} x2={f1(lerp(ax, cp[0], att))} y2={f1(lerp(ay, cp[1], att))} stroke={T5.spindle} strokeWidth={f1(2.4 * s + 0.5)} />);
      }
    });
    els.push(<g key="spindle" opacity={spOp < 1 ? f1(spOp) : undefined}>{fib}</g>);
  }
  // ---- the interphase nucleus (fragments as env falls)
  els.push(<Envelope key="env" cx={x} cy={y} r={nr} k={env} size={s} />);
  const nuc = c01(p.nucleolus ?? 1) * c01(env * 3);
  if (nuc > 0) els.push(<circle key="nucl" cx={f1(x + 0.42 * nr)} cy={f1(y - 0.5 * nr)} r={f1(0.15 * nr * lerp(0.3, 1, nuc))} fill={T5.nucleolus} opacity={nuc < 1 ? f1(nuc) : undefined} />);
  // ---- new nuclei (telophase): fill under the chromosomes
  if (newEnv > 0) G.nuclei.forEach((q, i) => els.push(<circle key={'nf' + i} cx={f1(q[0])} cy={f1(q[1])} r={f1(G.newNr)} fill={T5.nucleoplasm} opacity={f1(newEnv * newEnv)} />));
  const newNuc = c01(p.newNuc ?? 0);
  if (newNuc > 0) G.nuclei.forEach((q, i) => els.push(<circle key={'nn' + i} cx={f1(q[0] + (i ? -1 : 1) * 0.4 * G.newNr)} cy={f1(q[1] - 0.52 * G.newNr)} r={f1(0.16 * G.newNr * newNuc)} fill={T5.nucleolus} />));
  // ---- chromosomes
  const cop = p.chromOpacity ?? 1;
  els.push(<g key="chroms" opacity={cop < 1 ? f1(cop) : undefined}>{G.chroms.map((c, i) => <Chromosome key={i} {...(c as any)} hiGene={p.hiGene} hiCen={p.hiCen} />)}</g>);
  // ---- new envelope lines (over the chromosomes' edges)
  if (newEnv > 0) G.nuclei.forEach((q, i) => els.push(<Envelope key={'ne' + i} cx={q[0]} cy={q[1]} r={G.newNr} k={newEnv} size={s} fill={false} />));
  // ---- centrosomes (animal): together at upper left in interphase; move round the envelope to the poles
  if (!plant) {
    const start = Math.atan2(-0.62, -0.5), rr = nr + 38 * s;
    const aL = lerp(start - 0.12, Math.PI, cen), aR = lerp(start + 0.12, 2 * Math.PI, cen);
    const rad = lerp(rr, G.P, cen);
    const k2 = ease(cyto);
    const pts = [[lerp(x + rad * Math.cos(aL), x - 0.74 * R, k2), lerp(y + rad * Math.sin(aL), y - 0.42 * R, k2)], [lerp(x + rad * Math.cos(aR), x + 0.74 * R, k2), lerp(y + rad * Math.sin(aR), y - 0.42 * R, k2)]];
    // after cytokinesis each daughter keeps its centrosome near its old pole
    pts.forEach((q, i) => els.push(<Centrosome key={'cs' + i} x={q[0]} y={q[1]} size={s} />));
  }
  // ---- plant cytokinesis: vesicles → cell plate → new cell walls
  if (plant && cyto > 0) {
    const nV = 14, inner = H / 2 - 18 * s;
    const plateHalf = inner * c01((cyto - 0.4) / 0.35);
    const thick = c01((cyto - 0.75) / 0.25);
    for (let i = 0; i < nV; i++) {
      const vy = y - inner + (2 * inner) * (i + 0.5) / nV;
      if (Math.abs(vy - y) < plateHalf) continue;              // fused into the plate
      const travel = ease(c01(cyto / 0.4));
      const sx = x + (i % 2 ? 1 : -1) * (0.22 + 0.1 * ((i * 7) % 3)) * W / 2, sy = vy + ((i * 5) % 3 - 1) * 16 * s;
      els.push(<circle key={'v' + i} cx={f1(lerp(sx, x, travel))} cy={f1(lerp(sy, vy, travel))} r={f1(9 * s + 0.8)} fill={T5.vesicle} stroke={T5.cellWall} strokeWidth={f1(1.4 * s + 0.4)} />);
    }
    if (plateHalf > 0) {
      const w = lerp(5 * s + 1, 16 * s, thick);
      els.push(<rect key="plate" x={f1(x - w / 2)} y={f1(y - plateHalf)} width={f1(w)} height={f1(2 * plateHalf)} rx={f1(Math.min(w / 2, 4 * s))} fill={T5.cellWall} opacity={lerp(0.85, 0.55, thick)} />);
      els.push(<rect key="plateE" x={f1(x - w / 2)} y={f1(y - plateHalf)} width={f1(w)} height={f1(2 * plateHalf)} rx={f1(Math.min(w / 2, 4 * s))} fill="none" stroke={T5.cellWall} strokeWidth={f1(2 * s + 0.4)} />);
      if (thick > 0) for (const sd of [-1, 1]) els.push(<line key={'pm' + sd} x1={f1(x + sd * (w / 2 + 3 * s))} y1={f1(y - plateHalf)} x2={f1(x + sd * (w / 2 + 3 * s))} y2={f1(y + plateHalf)} stroke={T5.membrane} strokeWidth={f1(2 * s + 0.5)} opacity={f1(thick)} />);
    }
  }
  return <g data-role="drawing" opacity={op < 1 ? f1(op) : undefined}>{els}</g>;
}

/** Page-space centromere of one sister (side −1 = left pole's chromatid) of a laid-out chromosome. */
export function chromCen(c: any, side: number) {
  const g = chromGeom(c);
  return g.sides[side]?.cen ?? g.centromere;
}
/** All centromere points (page space): before separation one per chromosome; after, one per daughter chromosome. */
export function mCentromeres(p: MProps) {
  const G = mLayout(p);
  return G.chroms.flatMap((c: any) => (c.sep ? [chromCen(c, -1), chromCen(c, 1)] : [[c.x, c.y]]));
}

/** Count-strip rows for the model cell (SHARED-SPECS §4), by what the beat shows. */
export const MCOUNT = {
  replicated: [{chrom: '4', chromNote: '(8 sister chromatids)', dna: 8, comp: 'whole cell'}],
  separated: [{chrom: '8', chromNote: 'daughter chromosomes', dna: 8, comp: 'whole cell'}],
  moving: [{chrom: '8', chromNote: 'daughter chromosomes', dna: 8, comp: 'whole cell'}, {chrom: '4', dna: 4, comp: 'moving towards one pole'}],
  arrived: [{chrom: '8', chromNote: 'daughter chromosomes', dna: 8, comp: 'whole cell'}, {chrom: '4', dna: 4, comp: 'one pole'}],
  telophase: [{chrom: '8', dna: 8, comp: 'whole cell'}, {chrom: '4', dna: 4, comp: 'each new nucleus'}],
  daughters: [{chrom: '4', dna: 4, comp: 'each daughter cell'}],
  g1: [{chrom: '4', dna: 4, comp: 'one nucleus'}],
};
