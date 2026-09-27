/** DNAContentGraph — published by 5.1.3 (SHARED-SPECS §5). The per-cell graph is the teaching trace.
 * y: "DNA mass per cell / arbitrary units" (ticks 0, 1, 2 only); x: "time" (no values). G1 flat at 1; S a straight rise
 * 1 → 2 (note "slope schematic — not a constant replication rate"); G2 and M flat at 2; a vertical drop to 1 when
 * cytokinesis divides the cell (t = 1, end of the C band); a second G1 band follows. Phase bands beneath, aligned to
 * the CellCycleWheel arcs and colours. Caption "schematic; not measured data".
 * Named variant `per-nucleus`: y "DNA mass per nucleus / arbitrary units"; the open-mitosis interval (nucleus fade
 * complete → two new nuclei formed) hatched and labelled "schematic — no intact nucleus", no trace through it; the value
 * resumes at 1 from the frame the two new nuclei form (inside the M band). The pen position `pen` is in cycle units
 * (the wheel marker's `pos`), so the trace is drawn as the marker travels. */
import React from 'react';
import {T5} from './t5-palette';
import {BODY} from '../shared/src/theme';
import {ARCS, ARC_ORDER, M_EVENTS} from './CellCycleWheel';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const f1 = (v: number) => v.toFixed(1);
export const T_MAX = 1.3;
const BAND: Record<string, string> = {g1: T5.g1, s: T5.s, g2: T5.g2, m: T5.m, c: T5.c};
const BL: Record<string, string> = {g1: 'G1', s: 'S', g2: 'G2', m: 'M', c: 'C'};

export type GraphProps = {
  x: number; y: number; w: number; h: number; variant?: 'per-cell' | 'per-nucleus'; pen?: number; opacity?: number;
  axes?: number; bands?: number; caption?: number; slopeNote?: number; unitKey?: number; hatch?: number; hatchLabel?: number;
  hiRise?: number; hiDrop?: number; hiG1?: number; hiG2?: number; hiM?: number; hiG1b?: number; overlap?: number; dim?: number;
  small?: boolean;
};
/** Plot geometry: gx(t) for time in cycle units; gy(v) for DNA units 0..2. */
export function graphGeom(p: GraphProps) {
  const L = p.x + (p.small ? 56 : 78), R = p.x + p.w - 14, T = p.y + 14, B = p.y + p.h - (p.small ? 44 : 60);
  const gx = (t: number) => L + (R - L) * (t / T_MAX), gy = (v: number) => B - (B - T) * (v / 2.35);
  return {L, R, T, B, gx, gy};
}
/** The value of the trace at time t (per-cell or per-nucleus); null = no trace (hatched open mitosis). */
export function dnaAt(t: number, variant = 'per-cell') {
  const [s0, s1] = ARCS.s;
  if (t < s0) return 1;
  if (t < s1) return 1 + (t - s0) / (s1 - s0);
  if (variant === 'per-nucleus') {
    if (t < M_EVENTS.nucleusGone) return 2;
    if (t < M_EVENTS.newNuclei) return null;
    return 1;
  }
  return t < 1 ? 2 : 1;
}

export function DNAContentGraph(p: GraphProps) {
  const op = p.opacity ?? 1;
  if (op <= 0) return null;
  const g = graphGeom(p), {L, R, T, B, gx, gy} = g, v = p.variant ?? 'per-cell', pen = Math.max(0, Math.min(T_MAX, p.pen ?? 0));
  const ax = c01(p.axes ?? 1), bands = c01(p.bands ?? 1), fs = p.small ? 15 : 19;
  const spans: [string, number, number][] = [...ARC_ORDER.map((k) => [k, ARCS[k][0], ARCS[k][1]] as [string, number, number]), ['g1', 1, T_MAX]];
  const bandEls = bands > 0 ? spans.map(([k, a, b], i) => (
    <g key={'b' + i} opacity={bands < 1 ? bands : undefined}>
      <rect x={f1(gx(a))} y={f1(T)} width={f1(gx(b) - gx(a))} height={f1(B - T)} fill={BAND[k]} opacity={0.8} />
      <text x={f1((gx(a) + gx(b)) / 2)} y={f1(B + fs * 1.25)} fontSize={fs} fontWeight={800} fill={T5.ringHalo} textAnchor="middle" fontFamily={BODY}>{BL[k]}</text>
    </g>
  )) : null;
  // trace: explicit vertices per variant, clipped at the pen (the per-cell drop at t = 1 is one vertical step)
  const [s0, s1] = ARCS.s;
  const polys: number[][][] = v === 'per-nucleus'
    ? [[[0, 1], [s0, 1], [s1, 2], [M_EVENTS.nucleusGone, 2]], [[M_EVENTS.newNuclei, 1], [T_MAX, 1]]]
    : [[[0, 1], [s0, 1], [s1, 2], [1, 2], [1, 1], [T_MAX, 1]]];
  const segs: number[][][] = [];
  for (const poly of polys) {
    if (pen < poly[0][0]) continue;
    const out: number[][] = [poly[0]];
    for (let i = 1; i < poly.length; i++) {
      const [ta, va] = poly[i - 1], [tb, vb] = poly[i];
      if (pen >= tb) { out.push(poly[i]); continue; }
      if (tb > ta) out.push([pen, va + (vb - va) * (pen - ta) / (tb - ta)]);
      break;
    }
    if (out.length > 1) segs.push(out.map(([t, val]) => [gx(t), gy(val)]));
  }
  const dim = c01(p.dim ?? 0);
  const hl = (a: number | undefined, t0: number, t1: number, v0: number, v1: number, k: string) => (a ?? 0) > 0 ? (
    <path key={k} d={`M${f1(gx(t0))} ${f1(gy(v0))}L${f1(gx(t1))} ${f1(gy(v1))}`} stroke={T5.ring} strokeWidth={16} strokeLinecap="round" opacity={0.6 * c01(a!)} />
  ) : null;
  const hatch = c01(p.hatch ?? 0);
  const hx0 = gx(M_EVENTS.nucleusGone), hx1 = gx(M_EVENTS.newNuclei);
  return (
    <g opacity={op < 1 ? op : undefined}>
      <g data-role="drawing">
        {bandEls}
        {v === 'per-nucleus' && hatch > 0 && <g opacity={hatch}>
          <rect x={f1(hx0)} y={f1(T)} width={f1(hx1 - hx0)} height={f1(B - T)} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={1.5} />
          {Array.from({length: Math.ceil((B - T + (hx1 - hx0)) / 12)}, (_, i) => { const y0 = T + i * 12; return <line key={i} x1={f1(hx0)} y1={f1(Math.min(B, y0))} x2={f1(Math.min(hx1, hx0 + (y0 - T)))} y2={f1(Math.min(B, y0) - Math.min(hx1 - hx0, y0 - T))} stroke={T5.ringHalo} strokeWidth={1.3} opacity={0.6} />; })}
        </g>}
        {ax > 0 && <g opacity={ax < 1 ? ax : undefined}>
          <path d={`M${f1(L)} ${f1(T - 6)}L${f1(L)} ${f1(B)}L${f1(R + 6)} ${f1(B)}`} fill="none" stroke={T5.ringHalo} strokeWidth={3} />
          {[0, 1, 2].map((k) => <line key={k} x1={f1(L - 9)} y1={f1(gy(k))} x2={f1(L)} y2={f1(gy(k))} stroke={T5.ringHalo} strokeWidth={2.5} />)}
          {[1, 2].map((k) => <line key={'g' + k} x1={f1(L)} y1={f1(gy(k))} x2={f1(R)} y2={f1(gy(k))} stroke={T5.ringHalo} strokeWidth={1} strokeDasharray="4 6" opacity={0.35} />)}
        </g>}
        {segs.map((sg, i) => <path key={'tr' + i} d={'M' + sg.map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L')} fill="none" stroke={T5.ringHalo} strokeWidth={p.small ? 5 : 6} strokeLinejoin="round" strokeLinecap="round" />)}
      </g>
      <g data-role="decor">
        {hl(p.hiG1, 0, ARCS.s[0], 1, 1, 'h1')}{hl(p.hiRise, ARCS.s[0], ARCS.s[1], 1, 2, 'h2')}{hl(p.hiG2, ARCS.s[1], ARCS.g2[1], 2, 2, 'h3')}
        {hl(p.hiM, ARCS.m[0], 1, 2, 2, 'h4')}{hl(p.hiDrop, 1, 1, 2, 1, 'h5')}{hl(p.hiG1b, 1, T_MAX, 1, 1, 'h6')}
        {(p.overlap ?? 0) > 0 && <rect x={f1(gx(ARCS.m[1] - 0.03))} y={f1(B - 10)} width={f1(gx(ARCS.m[1] + 0.03) - gx(ARCS.m[1] - 0.03))} height={10} fill={T5.ring} opacity={c01(p.overlap!)} />}
      </g>
      {ax > 0 && <g opacity={ax < 1 ? ax : undefined}>
        {[0, 1, 2].map((k) => <text key={k} x={f1(L - 15)} y={f1(gy(k) + 7)} fontSize={fs + 1} fontWeight={700} fill={T5.ringHalo} textAnchor="end" fontFamily={BODY}>{k}</text>)}
        <text transform={`translate(${f1(p.x + (p.small ? 16 : 22))} ${f1((T + B) / 2)}) rotate(-90)`} fontSize={p.small ? 14 : 18} fontWeight={700} fill={T5.ringHalo} textAnchor="middle" fontFamily={BODY}>{v === 'per-nucleus' ? 'DNA mass per nucleus / arbitrary units' : 'DNA mass per cell / arbitrary units'}</text>
        <text x={f1(R)} y={f1(B + fs * 2.55)} fontSize={fs} fontWeight={700} fill={T5.ringHalo} textAnchor="end" fontFamily={BODY}>time</text>
      </g>}
      {(p.caption ?? 0) > 0 && <text x={f1(L)} y={f1(p.y - 4)} fontSize={p.small ? 13 : 16} fontWeight={600} fill="#6F6A60" fontStyle="italic" fontFamily={BODY} opacity={p.caption! < 1 ? p.caption : undefined}>schematic; not measured data</text>}
      {(p.unitKey ?? 0) > 0 && <text x={f1(R)} y={f1(p.y - 4)} fontSize={p.small ? 12 : 15} fontWeight={600} fill="#6F6A60" fontStyle="italic" textAnchor="end" fontFamily={BODY} opacity={p.unitKey! < 1 ? p.unitKey : undefined}>1 unit = the G1 amount of DNA in one cell (schematic)</text>}
      {(p.slopeNote ?? 0) > 0 && <text x={f1(gx(ARCS.s[0]) + 8)} y={f1(gy(0.55))} fontSize={p.small ? 13 : 16} fontWeight={700} fill={T5.ringHalo} fontStyle="italic" fontFamily={BODY} opacity={p.slopeNote! < 1 ? p.slopeNote : undefined}>slope schematic — not a constant replication rate</text>}
      {v === 'per-nucleus' && (p.hatchLabel ?? 0) > 0 && <text x={f1((hx0 + hx1) / 2)} y={f1(T - 8)} fontSize={p.small ? 13 : 16} fontWeight={700} fill={T5.ringHalo} textAnchor="middle" fontStyle="italic" fontFamily={BODY} opacity={p.hatchLabel! < 1 ? p.hatchLabel : undefined}>schematic — no intact nucleus</text>}
      {dim > 0 && <rect data-role="decor" x={p.x} y={p.y - 30} width={p.w} height={p.h + 40} fill="#F6F3EB" opacity={0.6 * dim} />}
    </g>
  );
}
