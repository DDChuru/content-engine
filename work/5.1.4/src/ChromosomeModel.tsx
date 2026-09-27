/** ChromosomeModel — published by 5.1.1 (SHARED-SPECS §5; storyboard 5.1.1 "The models, specified once").
 * One component draws every state from continuous parameters, so every transition is MOTION:
 *   state ids → parameters (see STATES):
 *     unreplicated-extended   cond 0, rep -1
 *     unreplicated-condensed  cond 1, rep -1                 (single rod, centromere, two telomeres)
 *     replicating             cond 0, rep 0..1               (a second identical copy builds from one end; S only)
 *     replicated-extended     cond 0, rep 1                  (two identical threads lying together, one centromere)
 *     replicated-condensed    cond 1, rep 1                  (X: two sister chromatids at one centromere; 4 telomeres)
 *     separated               cond 1, rep 1, sep 1, dist d   (two daughter chromosomes, each its own centromere)
 * Zoom levels: Z0 = <Chromosome/>; Z1 = <HistoneFiber/> (DNA wound round histone beads); Z2 = <HelixStrip/> (plain
 * two-strand helix, no bases). C1–C4 hues from T5 only; colour means WHICH chromosome. Gene bands: two per chromatid at
 * fixed positions, identical on sisters. Telomeres: grey schematic blocks. Centromere: constriction + small dark dot.
 * Also published here: <ModelCell/> (model-cell outline, 2n = 4) and <CountStrip/> (count overlay with compartment tag).
 * The replicated → separated switch is a ONE-FRAME change of `sep` (0 → 1) driven by the beat on the cue frame. */
import React from 'react';
import {T5} from './t5-palette';
import {BODY} from '../shared/src/theme';
import {textW} from '../shared/src/Type';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const f1 = (v: number) => v.toFixed(1);

export type CId = 'C1' | 'C2' | 'C3' | 'C4';
/** Fixed geometry per chromosome (px at scale 1). lenC = condensed length, lenE = extended length. */
export const SPECS: Record<CId, {lenC: number; lenE: number; cen: number; genes: [number, number]; fill: string; edge: string; phase: number}> = {
  C1: {lenC: 190, lenE: 620, cen: 0.40, genes: [0.19, 0.71], fill: T5.c1, edge: T5.c1Edge, phase: 0.0},
  C2: {lenC: 170, lenE: 560, cen: 0.45, genes: [0.24, 0.68], fill: T5.c2, edge: T5.c2Edge, phase: 1.3},
  C3: {lenC: 110, lenE: 360, cen: 0.36, genes: [0.18, 0.70], fill: T5.c3, edge: T5.c3Edge, phase: 2.1},
  C4: {lenC: 100, lenE: 330, cen: 0.42, genes: [0.22, 0.74], fill: T5.c4, edge: T5.c4Edge, phase: 0.7},
};
export const STATES: Record<string, {cond: number; rep: number; sep: number}> = {
  'unreplicated-extended': {cond: 0, rep: -1, sep: 0},
  'unreplicated-condensed': {cond: 1, rep: -1, sep: 0},
  'replicating': {cond: 0, rep: 0.5, sep: 0},
  'replicated-extended': {cond: 0, rep: 1, sep: 0},
  'replicated-condensed': {cond: 1, rep: 1, sep: 0},
  'separated': {cond: 1, rep: 1, sep: 1},
};
const TEL = 0.075;        // telomere run: fraction of the chromatid at each end
const N = 72;             // centreline samples

export type ChromProps = {
  x: number; y: number; id?: CId; scale?: number; rot?: number;
  cond?: number;          // 0 extended … 1 condensed (continuous coiling motion)
  rep?: number;           // -1 unreplicated; 0..1 replication progress (copy builds from s=0); 1 replicated
  sep?: number;           // 0 joined; 1 separated (switch in ONE frame on the cue)
  dist?: number;          // separated: distance each daughter chromosome has moved from the centre (px)
  trail?: number;         // 0..1 arms trail behind the leading centromere while moving
  pinch?: number;         // 0..1 centromere constriction visible (default 1)
  opacity?: number; ghost?: boolean;
  hiTel?: number; hiGene?: number; hiCen?: number;   // highlight strengths 0..1 (accent glow)
  only?: -1 | 1;          // draw only one sister (for insets that follow one daughter chromosome)
  showMarker?: boolean;   // progress marker while replicating (default true)
  wave?: number;          // extended meander amplitude multiplier (default 1)
  tel?: number; genes?: number; // visibility of telomere blocks and gene bands (default 1)
  cenDot?: number;        // visibility of the centromere dot (default 1)
};

/** Centreline of one chromatid (local coords: centromere at 0,0, long axis vertical, before rotation). */
function centre(p: ChromProps, side: number) {
  const S = SPECS[p.id ?? 'C1'], sc = p.scale ?? 1, c = c01(p.cond ?? 0), ec = ease(c);
  const L = lerp(S.lenE, S.lenC, ec) * sc, w = width(p);
  const rep = p.rep ?? -1, pair = rep < 0 ? 0 : c01(rep * 12 + (rep >= 1 ? 1 : 0));
  const sep = (p.sep ?? 0) >= 0.5, dist = (p.dist ?? 0) * sc, trail = c01(p.trail ?? 0);
  const wave = p.wave ?? 1;
  const base = (s: number) => (1 - ec) * wave * 0.085 * S.lenE * sc * Math.sin(2 * Math.PI * (1.25 * s) + S.phase) * Math.sin(Math.PI * s)
    + w * 0.75 * Math.sin(Math.PI * c) * Math.sin(2 * Math.PI * lerp(6, 15, c) * s);   // meander fades; a coil appears mid-condensation
  const b0 = base(S.cen);
  const pts: number[][] = [];
  for (let i = 0; i <= N; i++) {
    const s = i / N, d = s - S.cen, y = d * L, ad = Math.abs(d) * L;
    let x = base(s) - b0;
    // sisters: side by side, touching at the centromere; arms diverge into an X when condensed
    if (side !== 0) {
      const spread = lerp(0.035, 0.2, ec);
      x += side * pair * (w * 0.5 + spread * ad);
      if (sep) x += side * dist - side * trail * (0.2 + spread) * ad * 1.35;
    }
    pts.push([x, y]);
  }
  return pts;
}
export function width(p: ChromProps) { return lerp(6, 30, ease(c01(p.cond ?? 0))) * (p.scale ?? 1); }

/** Width profile along s: constriction at the centromere. */
function wAt(p: ChromProps, s: number) {
  const S = SPECS[p.id ?? 'C1'], w = width(p), L = lerp(S.lenE, S.lenC, ease(c01(p.cond ?? 0))) * (p.scale ?? 1);
  const pin = c01(p.pinch ?? 1) * lerp(0.42, 0.5, c01(p.cond ?? 0));
  const g = Math.exp(-Math.pow(((s - S.cen) * L) / (w * 0.9 + 4), 2));
  return w * (1 - pin * g);
}
/** Outline polygon for s in [s0, s1] with half-width fn; round-ish caps at the true ends. */
function band(pts: number[][], p: ChromProps, s0: number, s1: number, extra = 0) {
  const i0 = Math.max(0, Math.floor(s0 * N)), i1 = Math.min(N, Math.ceil(s1 * N));
  if (i1 <= i0) return '';
  const L: number[][] = [], R: number[][] = [];
  for (let i = i0; i <= i1; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)];
    let tx = b[0] - a[0], ty = b[1] - a[1]; const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
    const hw = wAt(p, i / N) / 2 + extra;
    L.push([pts[i][0] - ty * hw, pts[i][1] + tx * hw]); R.push([pts[i][0] + ty * hw, pts[i][1] - tx * hw]);
  }
  const cap = (q: number[], r: number[], c: number[], dir: number) => {
    // semicircle-ish cap through 3 points
    const mx = (q[0] + r[0]) / 2, my = (q[1] + r[1]) / 2;
    const hx = (c[0] - mx), hy = (c[1] - my);
    return [[mx + hx * 0.7 + (q[0] - mx) * 0.7, my + hy * 0.7 + (q[1] - my) * 0.7], [mx + hx, my + hy], [mx + hx * 0.7 + (r[0] - mx) * 0.7, my + hy * 0.7 + (r[1] - my) * 0.7]];
  };
  const out: number[][] = [...L];
  if (i1 === N) {
    const e = pts[N], a = pts[N - 1], n = Math.hypot(e[0] - a[0], e[1] - a[1]) || 1, hw = wAt(p, 1) / 2 + extra;
    out.push(...cap(L[L.length - 1], R[R.length - 1], [e[0] + (e[0] - a[0]) / n * hw, e[1] + (e[1] - a[1]) / n * hw], 1));
  }
  out.push(...R.reverse());
  if (i0 === 0) {
    const e = pts[0], a = pts[1], n = Math.hypot(e[0] - a[0], e[1] - a[1]) || 1, hw = wAt(p, 0) / 2 + extra;
    out.push(...cap(R[R.length - 1], L[0], [e[0] + (e[0] - a[0]) / n * hw, e[1] + (e[1] - a[1]) / n * hw], -1));
  }
  return 'M' + out.map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L') + 'Z';
}
const at = (pts: number[][], s: number) => { const f = s * N, i = Math.min(N - 1, Math.floor(f)), t = f - i; return [lerp(pts[i][0], pts[i + 1][0], t), lerp(pts[i][1], pts[i + 1][1], t)]; };

function Chromatid({p, side, upto = 1}: {p: ChromProps; side: number; upto?: number}) {
  // Drawn as a chain of short round-capped segments whose width follows the profile (constriction at the centromere):
  // a tube that can coil over itself without outline artefacts.
  const S = SPECS[p.id ?? 'C1'], pts = centre(p, side), w = width(p);
  const tel = p.tel ?? 1, genes = p.genes ?? 1, u = c01(upto);
  if (u <= 0.002) return null;
  const iu = Math.max(1, Math.round(u * N));
  const edgeW = Math.max(1.2, w * 0.08);
  const seg = (i: number, sw: number, col: string, key: string, op = 1) => <line key={key} x1={f1(pts[i][0])} y1={f1(pts[i][1])} x2={f1(pts[i + 1][0])} y2={f1(pts[i + 1][1])} stroke={col} strokeWidth={f1(sw)} strokeLinecap="round" opacity={op < 1 ? op : undefined} />;
  const edge: any[] = [], body: any[] = [], marks: any[] = [];
  const isTel = (s: number) => s < TEL || s > 1 - TEL;
  for (let i = 0; i < iu; i++) {
    const s = (i + 0.5) / N, ww = wAt(p, s);
    edge.push(seg(i, ww + 2 * edgeW, isTel(s) ? T5.telomereEdge : S.edge, 'e' + i));
  }
  for (let i = 0; i < iu; i++) {
    const s = (i + 0.5) / N, ww = wAt(p, s);
    body.push(seg(i, ww, isTel(s) && tel > 0 ? T5.telomere : S.fill, 'b' + i));
  }
  // telomere block divisions (schematic, arbitrary lengths) and gene bands (white, thin dark outline)
  const cross = (s: number, key: string, col: string, sw: number, extra = 0) => {
    const q = at(pts, s), q2 = at(pts, Math.min(1, s + 0.004)); let tx = q2[0] - q[0], ty = q2[1] - q[1]; const n = Math.hypot(tx, ty) || 1; tx /= n; ty /= n;
    const hw = wAt(p, s) / 2 + extra;
    return <line key={key} x1={f1(q[0] - ty * hw)} y1={f1(q[1] + tx * hw)} x2={f1(q[0] + ty * hw)} y2={f1(q[1] - tx * hw)} stroke={col} strokeWidth={f1(sw)} />;
  };
  if (tel > 0) for (const [a0, a1] of [[0, TEL], [1 - TEL, 1]]) for (let j = 1; j < 3; j++) { const s = a0 + (a1 - a0) * j / 3; if (s < u) marks.push(cross(s, 'tb' + a0 + j, T5.telomereEdge, Math.max(1, w * 0.06))); }
  const gh = Math.max(7, w * 0.26), ex = lerp(3.5, 0.6, ease(c01(p.cond ?? 0))) * (p.scale ?? 1);
  if (genes > 0) S.genes.forEach((g, i) => { if (g + 0.01 <= u) { marks.push(<g key={'g' + i} opacity={genes < 1 ? genes : undefined}>{cross(g, 'go' + i, T5.geneEdge, gh + 2.6, ex + 1.3)}{cross(g, 'gw' + i, T5.gene, gh, ex)}</g>); } });
  return <g>{edge}{body}{marks}</g>;
}

/** Page-space key points for labels and rings. sides: [-1,+1] when replicated, [0] when not. */
export function chromGeom(p: ChromProps) {
  const S = SPECS[p.id ?? 'C1'], rep = p.rep ?? -1, sides = rep < 0 ? [0] : [-1, 1];
  const r = ((p.rot ?? 0) * Math.PI) / 180, co = Math.cos(r), si = Math.sin(r);
  const T = (q: number[]) => [p.x + q[0] * co - q[1] * si, p.y + q[0] * si + q[1] * co];
  const out: any = {sides: {}, centromere: T([0, 0]), width: width(p)};
  for (const sd of sides) {
    const pts = centre(p, sd);
    out.sides[sd] = {top: T(pts[0]), bottom: T(pts[N]), cen: T(at(pts, S.cen)), genes: S.genes.map((g) => T(at(pts, g))), telTop: T(at(pts, TEL / 2)), telBottom: T(at(pts, 1 - TEL / 2)), at: (s: number) => T(at(pts, s))};
  }
  return out;
}

export function Chromosome(p: ChromProps) {
  const op = p.opacity ?? 1;
  if (op <= 0) return null;
  const S = SPECS[p.id ?? 'C1'], rep = p.rep ?? -1, sep = (p.sep ?? 0) >= 0.5, w = width(p);
  const g = chromGeom({...p, x: 0, y: 0, rot: 0});
  const hi = (a: number | undefined) => c01(a ?? 0);
  const glow = (q: number[], r: number, a: number, k: string) => a > 0 ? <g key={k}><circle cx={f1(q[0])} cy={f1(q[1])} r={r} fill={T5.ring} opacity={0.35 * a} /><circle cx={f1(q[0])} cy={f1(q[1])} r={r * 0.6} fill={T5.ring} opacity={0.35 * a} /></g> : null;
  const glows: any[] = [];
  for (const sd of Object.keys(g.sides)) {
    const s = g.sides[sd];
    if (hi(p.hiTel)) { glows.push(glow(s.telTop, w * 0.9 + 10, hi(p.hiTel), 't1' + sd)); glows.push(glow(s.telBottom, w * 0.9 + 10, hi(p.hiTel), 't2' + sd)); }
    if (hi(p.hiGene)) s.genes.forEach((q: number[], i: number) => glows.push(glow(q, w * 0.8 + 10, hi(p.hiGene), 'g' + i + sd)));
  }
  const cens: number[][] = sep ? [g.sides[-1].cen, g.sides[1].cen] : [[0, 0]];
  if (hi(p.hiCen)) cens.forEach((q, i) => glows.push(glow(q, w * 0.9 + 12, hi(p.hiCen), 'c' + i)));
  const only = p.only;
  const show = (sd: number) => !only || sd === only;
  const marker = rep > 0 && rep < 1 && p.showMarker !== false ? (() => { const q = g.sides[1].at(c01(rep)); return <g><circle cx={f1(q[0])} cy={f1(q[1])} r={w * 0.6 + 7} fill="none" stroke={T5.ringHalo} strokeWidth={4} /><circle cx={f1(q[0])} cy={f1(q[1])} r={w * 0.6 + 7} fill="none" stroke={T5.ring} strokeWidth={2.5} /></g>; })() : null;
  const dot = Math.max(3, w * 0.2);
  return (
    <g data-role="drawing" transform={`translate(${f1(p.x)} ${f1(p.y)})${p.rot ? ` rotate(${p.rot})` : ''}`} opacity={op < 1 ? op : undefined}>
      {glows}
      {rep < 0 ? <Chromatid p={p} side={0} /> : <>
        {show(-1) && <Chromatid p={p} side={-1} />}
        {show(1) && <Chromatid p={p} side={1} upto={rep >= 1 ? 1 : rep} />}
      </>}
      {(p.cenDot ?? 1) > 0 && cens.map((q, i) => (!only || (sep ? (i === 0 ? -1 : 1) === only : true)) ? <circle key={'cd' + i} cx={f1(q[0])} cy={f1(q[1])} r={f1(dot)} fill={T5.centromere} opacity={(p.cenDot ?? 1) < 1 ? p.cenDot : undefined} /> : null)}
      {marker}
    </g>
  );
}

/** Z2: a plain two-strand helix strip (label DNA; no bases). Horizontal, from x to x+len. trace = strands drawn 0..1. */
export function HelixStrip({x, y, len, amp = 22, period = 90, trace = 1, opacity = 1, color = T5.dna, width = 5}: any) {
  if (opacity <= 0) return null;
  const n = Math.max(8, Math.round(len / 6));
  const strand = (ph: number) => 'M' + Array.from({length: n + 1}, (_, i) => { const t = i / n, xx = x + t * len; return f1(xx) + ' ' + f1(y + amp * Math.sin(2 * Math.PI * (t * len / period) + ph)); }).join('L');
  const t = c01(trace);
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      <path d={strand(0)} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - t} />
      <path d={strand(Math.PI)} fill="none" stroke="#5B6B86" strokeWidth={width} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - t} />
    </g>
  );
}

/** Z1: DNA (dark line) wound round histone beads, horizontal from x0. beads = count; wound = 0..beads (how many
 * beads the line has wrapped so far, fractional = partway round the next); beadsShown = beads visible. */
export function HistoneFiber({x, y, beads = 7, gap = 96, r = 26, wound = 99, beadsShown = 99, opacity = 1, linkerHi = 0, lead = 60}: any) {
  if (opacity <= 0) return null;
  const B = Math.min(beads, Math.ceil(beadsShown));
  const circles = Array.from({length: B}, (_, i) => <circle key={i} cx={f1(x + lead + i * gap)} cy={f1(y)} r={r} fill={T5.histone} stroke={T5.histoneEdge} strokeWidth={2} />);
  // DNA path: lead-in, then for each bead a loop wrapping ~1.7 turns drawn as an ellipse-like loop, then a linker
  const segs: string[] = [];
  const pts: number[][] = [[x, y + r + 4]];
  const W = Math.max(0, Math.min(beads, wound));
  for (let i = 0; i < beads; i++) {
    const cx = x + lead + i * gap, part = c01(W - i);
    if (part <= 0) break;
    // approach to the bead's lower-left, wrap round (angles from 120° → 120°+600°) at radius r+4
    const steps = Math.ceil(40 * part), a0 = (140 * Math.PI) / 180, tot = (600 * Math.PI) / 180 * part;
    for (let k = 0; k <= steps; k++) {
      const a = a0 + (tot * k) / steps, rr = r + 5 + 2.5 * Math.sin(a * 0.5);
      pts.push([cx + rr * Math.cos(a) + (k / 40) * 10 - 5, y + rr * Math.sin(a)]);
    }
  }
  if (W >= beads) pts.push([x + lead + (beads - 1) * gap + gap * 0.7, y + r + 4]);
  const d = 'M' + pts.map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L');
  const linkers = linkerHi > 0 ? Array.from({length: Math.max(0, Math.floor(W) - 1)}, (_, i) => {
    const xa = x + lead + i * gap + r + 2, xb = x + lead + (i + 1) * gap - r - 2;
    return <path key={'lk' + i} data-role="decor" d={`M${f1(xa)} ${f1(y + r * 0.35)}L${f1(xb)} ${f1(y + r * 0.35)}`} stroke={T5.ring} strokeWidth={7} strokeLinecap="round" opacity={0.75 * c01(linkerHi)} />;
  }) : null;
  return (
    <g data-role="drawing" opacity={opacity < 1 ? opacity : undefined}>
      {circles}
      {linkers}
      <path d={d} fill="none" stroke={T5.dna} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}
export const fiberBead = (x: number, i: number, gap = 96, lead = 60) => x + lead + i * gap;

/** Model-cell outline (published with ChromosomeModel, for whole-cell counts): round cell (cell surface membrane,
 * single line); nucleus with a double-line nuclear envelope and the nucleolus disc (both optional). */
export function ModelCell({x, y, r = 250, nr, envelope = 1, nucleolus = 1, opacity = 1, nucleolusAt, children}: any) {
  if (opacity <= 0) return null;
  const n = nr ?? r * 0.66, [nx, ny] = nucleolusAt ?? [x + n * 0.52, y - n * 0.55];
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <g data-role="drawing">
        <circle cx={x} cy={y} r={r} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={3} />
        {envelope > 0 && <g opacity={envelope < 1 ? envelope : undefined}>
          <circle cx={x} cy={y} r={n} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={2.5} />
          <circle cx={x} cy={y} r={n - 7} fill="none" stroke={T5.envelope} strokeWidth={2} />
        </g>}
        {nucleolus > 0 && <circle cx={nx} cy={ny} r={n * 0.13} fill={T5.nucleolus} opacity={nucleolus < 1 ? nucleolus : undefined} />}
      </g>
      {children}
    </g>
  );
}

/** Count overlay: rows of [chromosomes (count centromeres) · DNA molecules · compartment]. A value is shown exactly
 * as passed — the beat changes it ON the event frame. dna may be a number or 'replication in progress'.
 * Run 009f: every label >= MIN_T5_TEXT (17 px after branding); the row height, the DNA column and the width grow to
 * fit the labels (never text pushed into a neighbouring column). countStripW/countStripH give the real box. */
export const MIN_T5_TEXT = 20;
const fz = (v: number) => Math.max(v, MIN_T5_TEXT);
const CHROM_HEAD = 'chromosomes (count centromeres)', DNA_HEAD = 'DNA molecules';
function stripLayout(rows: any[], w: number, size: number, title?: string) {
  const lab = fz(size * 0.62), val = fz(size * 1.1), note = fz(size * 0.7), dnaWord = fz(size * 0.72), tag = fz(size * 0.66);
  const rh = Math.max(size * 2.05, lab + val + 22), tfs = fz(size * 0.78), head = title ? tfs * 1.9 : 0;
  const c0 = Math.max(...rows.map((r: any) => textW(String(r.chrom ?? ''), val, 800) + (r.chromNote ? 10 + textW(r.chromNote, note, 600) : 0)), textW(CHROM_HEAD, lab, 600));
  const c1 = Math.max(...rows.map((r: any) => typeof r.dna === 'number' ? textW(String(r.dna), val, 800) : textW(String(r.dna ?? ''), dnaWord, 800)), textW(DNA_HEAD, lab, 600));
  const tw = Math.max(...rows.map((r: any) => textW(String(r.comp ?? ''), tag, 700) + tag * 1.2));
  const col1 = Math.max(w * 0.5, 18 + c0 + 26);
  const W = Math.max(w, col1 + 8 + c1 + 22 + tw + 12, title ? textW(title, tfs, 700) + 32 : 0);
  return {lab, val, note, dnaWord, tag, rh, tfs, head, col1, W, h: head + rh * rows.length + 16};
}
export const countStripW = (rows: any[], w = 560, size = 23, title?: string) => stripLayout(rows, w, size, title).W;
export function CountStrip({x, y, rows, w = 560, title, opacity = 1, size = 23, hiRow = -1, hiCol = -1, hiA = 0, anchor = 'start'}: any) {
  if (opacity <= 0) return null;
  const L = stripLayout(rows, w, size, title), {lab, val, rh, head, h} = L, W = L.W;
  if (anchor === 'end') x = x + w - W;   // grow leftwards when the caller's right edge is fixed
  const cols = [0, L.col1];
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect data-role="decor" x={x} y={y} width={W} height={h} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      {title && <text x={x + 16} y={y + L.tfs * 1.42} fontSize={L.tfs} fontWeight={700} fill="#6F6A60" fontFamily={BODY}>{title}</text>}
      {rows.map((r: any, i: number) => {
        const yy = y + head + 10 + rh * i;
        const hl = (col: number) => hiA > 0 && hiRow === i && (hiCol === col || hiCol === -1);
        const dnaTxt = typeof r.dna === 'number' ? String(r.dna) : r.dna;
        return (
          <g key={i} opacity={r.opacity != null && r.opacity < 1 ? r.opacity : undefined}>
            {hl(0) && <rect data-role="decor" x={x + 8} y={yy} width={cols[1] - 12} height={rh - 6} rx={8} fill={T5.ring} opacity={0.45 * hiA} />}
            {hl(1) && <rect data-role="decor" x={x + cols[1] - 2} y={yy} width={Math.max(W * 0.3, textW(DNA_HEAD, lab, 600) + 20)} height={rh - 6} rx={8} fill={T5.ring} opacity={0.45 * hiA} />}
            <text x={x + 18} y={yy + lab + 2} fontSize={lab} fontWeight={600} fill="#6F6A60" fontFamily={BODY}>{CHROM_HEAD}</text>
            <text x={x + 18} y={yy + lab + 6 + val * 0.9} fontSize={val} fontWeight={800} fill={T5.ringHalo} fontFamily={BODY}>{r.chrom}{r.chromNote ? <tspan dx={10} fontSize={L.note} fontWeight={600}>{r.chromNote}</tspan> : null}</text>
            <text x={x + cols[1] + 8} y={yy + lab + 2} fontSize={lab} fontWeight={600} fill="#6F6A60" fontFamily={BODY}>{DNA_HEAD}</text>
            <text x={x + cols[1] + 8} y={yy + lab + 6 + val * 0.9} fontSize={typeof r.dna === 'number' ? val : L.dnaWord} fontWeight={800} fill={T5.ringHalo} fontFamily={BODY}>{dnaTxt}</text>
            <CompTag x={x + W - 12} y={yy + rh * 0.72} text={r.comp} size={L.tag} />
          </g>
        );
      })}
    </g>
  );
}
export const countStripH = (rows: number, size = 23, title = false) => (title ? fz(size * 0.78) * 1.9 : 0) + Math.max(size * 2.05, fz(size * 0.62) + fz(size * 1.1) + 22) * rows + 16;
/** Compartment tag (whole cell / one pole / one nucleus / one daughter cell / moving towards one pole). */
export function CompTag({x, y, text, size = 20, anchor = 'end'}: any) {
  size = fz(size);
  const w = textW(text, size, 700) + size * 1.2, h = size * 1.6;
  const x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
  return (
    <g data-role="decor">
      <rect x={x0} y={y - h * 0.7} width={w} height={h} rx={h / 2} fill={T5.ringHalo} />
      <text x={x0 + w / 2} y={y} fontSize={size} fontWeight={700} fill="#FFFFFF" textAnchor="middle" fontFamily={BODY}>{text}</text>
    </g>
  );
}
