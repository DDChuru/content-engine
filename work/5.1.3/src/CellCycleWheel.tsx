/** CellCycleWheel — published by 5.1.3 (SHARED-SPECS §5; storyboard 5.1.3 "The models, specified once").
 * Ring, clockwise from 12 o'clock: G1 (widest arc), S, G2, M (mitosis), C (cytokinesis); a bracket outside the ring
 * spanning G1–S–G2 labelled "interphase"; caption "schematic proportions — interphase is typically the longest part".
 * A travelling marker (position in cycle units: 0 = 12 o'clock, 1 = one lap). No G0 arc, no checkpoints, no proteins.
 * A ChromosomeModel inset (one C1 chromosome) in a round window inside the ring; its state is set from continuous
 * parameters so every change is MOTION; named inset states (INSET_STATES) give the published ids:
 *   g1 (unreplicated-extended) · s (replicating, rep = progress) · g2 (replicated-extended) ·
 *   m-condense · m-align (inset spindle elements: pole marks, fibres to the centromere, dashed equator) ·
 *   m-separate (centromere divides in ONE frame: sep 0 → 1; daughters move to the poles) ·
 *   m-decondense (a nucleus outline draws round each pole group as each daughter chromosome decondenses) ·
 *   c (the schematic cell outline, already enclosing both nuclei, pinches in until two cells separate) · g1-next. */
import React from 'react';
import {T5} from './t5-palette';
import {BODY} from '../shared/src/theme';
import {textW} from '../shared/src/Type';
import {Chromosome} from './ChromosomeModel';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const f1 = (v: number) => v.toFixed(1);

export type Arc = 'g1' | 's' | 'g2' | 'm' | 'c';
/** Schematic proportions (fractions of one lap). G1 widest; interphase (G1+S+G2) the longest part. */
export const ARCS: Record<Arc, [number, number]> = {g1: [0, 0.37], s: [0.37, 0.62], g2: [0.62, 0.79], m: [0.79, 0.92], c: [0.92, 1.0]};
export const ARC_ORDER: Arc[] = ['g1', 's', 'g2', 'm', 'c'];
export const SHORT: Record<Arc, string> = {g1: 'G1', s: 'S', g2: 'G2', m: 'M', c: 'C'};
export const LONG: Record<Arc, string> = {
  g1: 'G1 — growth', s: 'S — DNA replication (synthesis)', g2: 'G2 — growth, preparation for division',
  m: 'M — mitosis: nuclear division', c: 'C — cytokinesis: division of the cytoplasm',
};
const FILL: Record<Arc, string> = {g1: T5.g1, s: T5.s, g2: T5.g2, m: T5.m, c: T5.c};
/** Marker positions used as cue targets (cycle units). */
export const POS = {g1: 0.05, 's-start': 0.37, 's-end': 0.62, g2: 0.7, m: 0.79, c: 0.92, 'g1-next': 1.05};
/** Moments inside M used by the inset (cycle units): nucleus fade complete; new nuclei formed. */
export const M_EVENTS = {nucleusGone: 0.815, newNuclei: 0.885};

export const ang = (f: number) => (f * 2 * Math.PI) - Math.PI / 2;   // radians, clockwise from 12 o'clock (SVG y down)
export const onRing = (cx: number, cy: number, r: number, f: number) => [cx + r * Math.cos(ang(f)), cy + r * Math.sin(ang(f))];

function sector(cx: number, cy: number, r0: number, r1: number, a: number, b: number) {
  const n = Math.max(2, Math.ceil((b - a) * 120));
  const outer = Array.from({length: n + 1}, (_, i) => onRing(cx, cy, r1, a + (b - a) * i / n));
  const inner = Array.from({length: n + 1}, (_, i) => onRing(cx, cy, r0, b - (b - a) * i / n));
  return 'M' + [...outer, ...inner].map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L') + 'Z';
}
function arcPath(cx: number, cy: number, r: number, a: number, b: number) {
  const n = Math.max(2, Math.ceil((b - a) * 120));
  return 'M' + Array.from({length: n + 1}, (_, i) => onRing(cx, cy, r, a + (b - a) * i / n)).map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L');
}

/** Inset parameter set. All continuous; a beat animates them between cue frames. */
export type Inset = {
  on?: number; nucleus?: number; cell?: number; cellGrow?: number;
  rep?: number; cond?: number; rot?: number; scale?: number; wave?: number;
  poles?: number; fibres?: number; equator?: number; align?: number;
  sep?: number; dist?: number; decond?: number; newNuc?: number;
  cyto?: number; cytoOutline?: number; follow?: number; ripple?: number;
  hiGene?: number; hiCen?: number;
};
export const INSET_STATES: Record<string, Inset> = {
  'g1': {on: 1, nucleus: 1, cell: 1, rep: -1, cond: 0},
  's': {on: 1, nucleus: 1, cell: 1, rep: 0.5, cond: 0},
  'g2': {on: 1, nucleus: 1, cell: 1, rep: 1, cond: 0},
  'm-condense': {on: 1, nucleus: 0, cell: 1, rep: 1, cond: 1},
  'm-align': {on: 1, nucleus: 0, cell: 1, rep: 1, cond: 1, poles: 1, fibres: 1, equator: 1, align: 1},
  'm-separate': {on: 1, nucleus: 0, cell: 1, rep: 1, cond: 1, poles: 1, fibres: 1, equator: 1, align: 1, sep: 1, dist: 1},
  'm-decondense': {on: 1, nucleus: 0, cell: 1, rep: 1, cond: 1, poles: 1, fibres: 0, equator: 0, align: 1, sep: 1, dist: 1, decond: 1, newNuc: 1},
  'c': {on: 1, cell: 1, rep: 1, sep: 1, dist: 1, align: 1, decond: 1, newNuc: 1, cyto: 1},
};

/** Geometry of the inset (page coords) for labels: window centre/radius, pole x, chromosome centre. */
export function insetGeom(cx: number, cy: number, R: number, thick: number) {
  const ri = R - thick / 2 - 12;
  return {cx, cy, ri, poleX: ri * 0.66, nucR: ri * 0.34};
}

function Inset({cx, cy, ri, s}: {cx: number; cy: number; ri: number; s: Inset}) {
  const on = s.on ?? 0;
  if (on <= 0) return null;
  const cond = c01(s.cond ?? 0), rep = s.rep ?? -1, align = c01(s.align ?? 0), sep = (s.sep ?? 0) >= 0.5;
  const dec = c01(s.decond ?? 0), cyto = c01(s.cyto ?? 0), follow = c01(s.follow ?? 0);
  const poleX = ri * 0.66, nucR = ri * 0.3, nucX = ri * 0.5;
  // chromosome placement: diagonal in interphase, vertical long axis once condensing/aligned (poles left and right)
  const rot = s.rot ?? lerp(-28, 0, ease(Math.max(cond, align)));
  const scale = (s.scale ?? lerp(0.3, 0.72, ease(cond))) * lerp(1, 0.42, ease(dec));
  const condNow = cond * (1 - dec);
  const ripple = s.ripple ?? 0;
  const wave = (s.wave ?? 1) * (1 + 0.25 * Math.sin(ripple * Math.PI * 2)) * lerp(1, 1.6, dec);
  const dist = (s.dist ?? 0) * poleX;
  const cellG = lerp(0.9, 1, c01(s.cellGrow ?? 1));
  // cell outline: one rounded outline → pinches at the equator (cyto) → two cells
  const cellOutline = () => {
    const a = nucX, rb = ri * 0.4, hw0 = ri * 0.78 * cellG;
    const gap = cyto >= 1 ? 6 : 0, hw = lerp(hw0, 0, ease(cyto));
    if (cyto <= 0) return <ellipse cx={f1(cx)} cy={f1(cy)} rx={f1((a + rb) * cellG)} ry={f1(hw0)} fill="none" stroke={T5.membrane} strokeWidth={2.5} opacity={c01(s.cytoOutline ?? s.cell ?? 0)} />;
    const top: number[][] = [];
    const X0 = -(a + rb), X1 = a + rb, n = 80;
    for (let i = 0; i <= n; i++) {
      const x = X0 + (X1 - X0) * i / n;
      const yl = Math.abs(x + a) <= rb ? Math.sqrt(rb * rb - (x + a) * (x + a)) : 0;
      const yr = Math.abs(x - a) <= rb ? Math.sqrt(rb * rb - (x - a) * (x - a)) : 0;
      const env = Math.max(yl, yr), waist = hw * Math.sqrt(Math.max(0, 1 - Math.pow(x / (a + rb), 2)));
      top.push([x, Math.max(env, waist)]);
    }
    const shift = (x: number) => x + Math.sign(x) * gap;
    if (cyto >= 1) {
      return <g fill="none" stroke={T5.membrane} strokeWidth={2.5}><circle cx={f1(cx - a - gap)} cy={f1(cy)} r={f1(rb)} /><circle cx={f1(cx + a + gap)} cy={f1(cy)} r={f1(rb)} /></g>;
    }
    const d = 'M' + top.map((q) => f1(cx + shift(q[0])) + ' ' + f1(cy - q[1])).join('L') + 'L' + top.slice().reverse().map((q) => f1(cx + shift(q[0])) + ' ' + f1(cy + q[1])).join('L') + 'Z';
    return <path d={d} fill="none" stroke={T5.membrane} strokeWidth={2.5} />;
  };
  const followShift = follow * (nucX + 6);   // follow the RIGHT daughter cell to the window centre
  const otherOp = 1 - follow;
  const nucOutline = (x: number, p: number, key: string) => p > 0 ? <circle key={key} cx={f1(x)} cy={f1(cy)} r={f1(nucR)} fill={T5.nucleoplasm} fillOpacity={0.6 * p} stroke={T5.envelope} strokeWidth={2} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p} /> : null;
  const fib = c01(s.fibres ?? 0), poles = c01(s.poles ?? 0), eq = c01(s.equator ?? 0);
  // centromere position (before separation): drifts from interphase spot to the equator (x = 0) as it aligns
  const chromX = cx, chromY = cy;
  const fibreEnds = sep ? [[chromX - dist, chromY], [chromX + dist, chromY]] : [[chromX - 4, chromY], [chromX + 4, chromY]];
  return (
    <g opacity={on < 1 ? on : undefined}>
      <g data-role="drawing">
        <circle cx={f1(cx)} cy={f1(cy)} r={f1(ri)} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      </g>
      <defs><clipPath id={'insclip' + Math.round(cx) + '_' + Math.round(cy)}><circle cx={f1(cx)} cy={f1(cy)} r={f1(ri - 2)} /></clipPath></defs>
      <g clipPath={`url(#insclip${Math.round(cx)}_${Math.round(cy)})`}>
      <g data-role="drawing" transform={follow > 0 ? `translate(${f1(-followShift)} 0)` : undefined}>
        {(s.cell ?? 0) > 0 && cellOutline()}
        {(s.nucleus ?? 0) > 0 && <circle cx={f1(cx)} cy={f1(cy)} r={f1(ri * 0.62 * cellG)} fill={T5.nucleoplasm} fillOpacity={0.7 * c01(s.nucleus ?? 0)} stroke={T5.envelope} strokeWidth={2} strokeOpacity={c01(s.nucleus ?? 0)} />}
        {eq > 0 && <line x1={f1(cx)} y1={f1(cy - ri * 0.62)} x2={f1(cx)} y2={f1(cy + ri * 0.62)} stroke={T5.spindle} strokeWidth={2} strokeDasharray="7 6" opacity={0.8 * eq} />}
        {poles > 0 && [-1, 1].map((sd) => <circle key={'p' + sd} cx={f1(cx + sd * poleX)} cy={f1(cy)} r={7} fill={T5.centriole} opacity={poles} />)}
        {fib > 0 && [-1, 1].map((sd, i) => { const ex = fibreEnds[i][0], x0 = cx + sd * poleX; const xe = x0 + (ex - x0) * fib; return [-10, 0, 10].map((dy, j) => <line key={'f' + sd + j} x1={f1(x0)} y1={f1(cy)} x2={f1(xe)} y2={f1(chromY + dy * fib)} stroke={T5.spindle} strokeWidth={2} />); })}
        {nucOutline(cx - nucX, c01(s.newNuc ?? 0), 'n1')}
        {nucOutline(cx + nucX, c01(s.newNuc ?? 0), 'n2')}
        {!sep ? <Chromosome x={chromX} y={chromY} id="C1" cond={cond} rep={rep} rot={rot} scale={scale} wave={wave} hiGene={s.hiGene} hiCen={s.hiCen} /> : <>
          <g opacity={otherOp < 1 ? otherOp : undefined}><Chromosome x={chromX - (dec > 0 ? lerp(dist, nucX, dec) - dist : 0)} y={chromY} id="C1" cond={condNow} rep={1} sep={1} dist={dist / scale} trail={lerp(1, 0, dec)} rot={0} scale={scale} only={-1} wave={wave} /></g>
          <Chromosome x={chromX + (dec > 0 ? lerp(dist, nucX, dec) - dist : 0)} y={chromY} id="C1" cond={condNow} rep={1} sep={1} dist={dist / scale} trail={lerp(1, 0, dec)} rot={0} scale={scale} only={1} wave={wave} />
        </>}
      </g>
      </g>
    </g>
  );
}

export type WheelProps = {
  cx: number; cy: number; R?: number; thick?: number; draw?: number; opacity?: number;
  labels?: Partial<Record<Arc, number>>;      // 0 hidden · 1 short label
  long?: Partial<Record<Arc, number>>;        // long-label callout opacity (beat hands it back to short afterwards)
  bracket?: number; caption?: number; marker?: number; pos?: number;
  hi?: Partial<Record<Arc, number>>; lit?: Partial<Record<Arc, number>>; grey?: Partial<Record<Arc, number>>; outline?: Partial<Record<Arc, number>>;
  bracketHi?: number; inset?: Inset; longPos?: Partial<Record<Arc, [number, number, string?]>>; small?: boolean;
};
/** Default long-label callout anchor (page coords relative to centre) per arc. */
function longAnchor(p: WheelProps, k: Arc) {
  const R = p.R ?? 200, th = p.thick ?? 56, [a, b] = ARCS[k], m = (a + b) / 2;
  const q = onRing(p.cx, p.cy, R + th / 2 + 44, m);
  const anchor = Math.cos(ang(m)) > 0.25 ? 'start' : Math.cos(ang(m)) < -0.25 ? 'end' : 'middle';
  return [q[0], q[1] + (Math.sin(ang(m)) > 0.3 ? 14 : 0), anchor] as [number, number, string];
}
export function wheelGeom(p: WheelProps) {
  const R = p.R ?? 200, th = p.thick ?? 56;
  const mid = (k: Arc) => onRing(p.cx, p.cy, R, (ARCS[k][0] + ARCS[k][1]) / 2);
  return {R, thick: th, mid, marker: (f: number) => onRing(p.cx, p.cy, R, f), inset: insetGeom(p.cx, p.cy, R, th), outer: R + th / 2, bracketR: R + th / 2 + 16};
}

export function CellCycleWheel(p: WheelProps) {
  const op = p.opacity ?? 1;
  if (op <= 0) return null;
  const R = p.R ?? 200, th = p.thick ?? 56, r0 = R - th / 2, r1 = R + th / 2, cx = p.cx, cy = p.cy;
  const draw = c01(p.draw ?? 1), lab = p.labels ?? {}, lng = p.long ?? {}, hi = p.hi ?? {}, lit = p.lit ?? {}, grey = p.grey ?? {}, outl = p.outline ?? {};
  const fs = p.small ? 20 : 27;
  const arcs = ARC_ORDER.map((k) => {
    const [a, b] = ARCS[k]; if (draw <= a) return null;
    const bb = Math.min(b, draw);
    return (
      <g key={k}>
        <path d={sector(cx, cy, r0, r1, a, bb)} fill={FILL[k]} stroke="#FFFFFF" strokeWidth={3} />
        {(grey[k] ?? 0) > 0 && <path d={sector(cx, cy, r0, r1, a, bb)} fill="#B9B9B9" opacity={0.85 * c01(grey[k]!)} />}
      </g>
    );
  });
  const deco = ARC_ORDER.map((k) => {
    const [a, b] = ARCS[k];
    const els: any[] = [];
    if ((lit[k] ?? 0) > 0) els.push(<path key={'l' + k} d={sector(cx, cy, r0, r1, a, b)} fill={T5.ring} opacity={0.75 * c01(lit[k]!)} />);
    if ((hi[k] ?? 0) > 0) els.push(<path key={'h' + k} d={sector(cx, cy, r0 - 5, r1 + 5, a, b)} fill={T5.ring} opacity={0.4 * c01(hi[k]!)} />);
    if ((outl[k] ?? 0) > 0) els.push(<g key={'o' + k} opacity={c01(outl[k]!)}><path d={sector(cx, cy, r0 - 4, r1 + 4, a, b)} fill="none" stroke={T5.ringHalo} strokeWidth={6} /><path d={sector(cx, cy, r0 - 4, r1 + 4, a, b)} fill="none" stroke={T5.ring} strokeWidth={4} /></g>);
    return els;
  });
  const labels = ARC_ORDER.map((k) => {
    const v = lab[k] ?? 0; if (v <= 0) return null;
    const [a, b] = ARCS[k], q = onRing(cx, cy, R, (a + b) / 2);
    return <text key={'t' + k} x={f1(q[0])} y={f1(q[1] + fs * 0.35)} fontSize={fs} fontWeight={800} fill={T5.ringHalo} textAnchor="middle" fontFamily={BODY} opacity={v < 1 ? v : undefined}>{SHORT[k]}</text>;
  });
  const longs = ARC_ORDER.map((k) => {
    const v = lng[k] ?? 0; if (v <= 0) return null;
    const [x, y, anc] = (p.longPos?.[k] as any) ?? longAnchor(p, k);
    const size = p.small ? 17 : 22, w = textW(LONG[k], size, 700) + 22, h = size * 1.6;
    let x0 = anc === 'start' ? x : anc === 'end' ? x - w : x - w / 2;
    x0 = Math.max(72, Math.min(1848 - w, x0));
    const m = onRing(cx, cy, r1 + 3, (ARCS[k][0] + ARCS[k][1]) / 2);
    return (
      <g key={'L' + k} opacity={v < 1 ? v : undefined}>
        <line data-role="decor" x1={f1(m[0])} y1={f1(m[1])} x2={f1(Math.max(x0, Math.min(x0 + w, m[0])))} y2={f1(y - size * 0.35)} stroke={T5.ringHalo} strokeWidth={1.5} />
        <rect data-role="decor" x={f1(x0)} y={f1(y - h * 0.72)} width={f1(w)} height={f1(h)} rx={h / 2} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} />
        <text x={f1(x0 + w / 2)} y={f1(y)} fontSize={size} fontWeight={700} fill={T5.ringHalo} textAnchor="middle" fontFamily={BODY}>{LONG[k]}</text>
      </g>
    );
  });
  const br = c01(p.bracket ?? 0), rb = r1 + 16, bEnd = ARCS.g2[1];
  const bracket = br > 0 ? (
    <g opacity={p.bracketHi ? undefined : undefined}>
      <path data-role="decor" d={arcPath(cx, cy, rb, 0.004, 0.004 + (bEnd - 0.008) * br)} fill="none" stroke={T5.ringHalo} strokeWidth={p.bracketHi ? 3 + 3 * c01(p.bracketHi) : 3} />
      {[0.004, bEnd - 0.004].map((f, i) => (i === 0 || br >= 1) ? <path key={i} data-role="decor" d={`M${f1(onRing(cx, cy, rb, f)[0])} ${f1(onRing(cx, cy, rb, f)[1])}L${f1(onRing(cx, cy, rb - 12, f)[0])} ${f1(onRing(cx, cy, rb - 12, f)[1])}`} stroke={T5.ringHalo} strokeWidth={3} /> : null)}
      {br >= 1 && (() => { const q = onRing(cx, cy, rb + (p.small ? 12 : 16), bEnd / 2); return <text x={f1(q[0] + 4)} y={f1(q[1] + 12)} fontSize={p.small ? 17 : 23} fontWeight={800} fill={T5.ringHalo} textAnchor="start" fontFamily={BODY} fontStyle="italic">interphase</text>; })()}
    </g>
  ) : null;
  const mk = p.marker ?? 0, pos = p.pos ?? 0;
  const mq = onRing(cx, cy, R, ((pos % 1) + 1) % 1);
  const ins = wheelGeom(p).inset;
  return (
    <g opacity={op < 1 ? op : undefined}>
      <g data-role="drawing">{arcs}</g>
      <g data-role="decor">{deco}</g>
      {labels}
      {bracket}
      {p.inset && <Inset cx={ins.cx} cy={ins.cy} ri={ins.ri} s={p.inset} />}
      {mk > 0 && <g data-role="decor" opacity={mk < 1 ? mk : undefined}><circle cx={f1(mq[0])} cy={f1(mq[1])} r={p.small ? 10 : 14} fill={T5.ring} stroke={T5.ringHalo} strokeWidth={3.5} /></g>}
      {longs}
      {(p.caption ?? 0) > 0 && <text x={f1(cx)} y={f1(cy + r1 + (p.small ? 38 : 58))} fontSize={p.small ? 14 : 18} fontWeight={600} fill="#6F6A60" textAnchor="middle" fontStyle="italic" fontFamily={BODY} opacity={p.caption! < 1 ? p.caption : undefined}>schematic proportions — interphase is typically the longest part</text>}
    </g>
  );
}
