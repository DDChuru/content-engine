/** TelomereEndModel — published by 5.1.4 (SHARED-SPECS §5; storyboard 5.1.4 "The models, specified once").
 * One chromatid end at Z2-like scale: a plain two-strand helix strip (DNA; no bases), two gene bands, then the telomere
 * as GREY SCHEMATIC BLOCKS running to the tip (arbitrary lengths — not individual TTAGGG repeats, not a measured loss).
 * Geometry is in fractions of the parent length `len` measured from the strip's left edge (the chromosome continues
 * off to the left). Real state: gene 1 at 0.30, gene 2 at 0.52, telomere run 0.62 → 1.00 (the tip).
 * Motion contract: each round the daughter molecule is drawn GROWING along the template from the gene end towards the
 * tip (`grow` 0..1 of the way to `stop`) and stops short; the template then fades and the daughter slides into its
 * place (`swap` 0..1). No block is ever detached; a shorter daughter is simply drawn shorter. Gene bands untouched in
 * the real state. State `no-telomere` (thought experiment): `telo` → 0 fades the grey run; the template ends at NT_END. */
import React from 'react';
import {T5} from './t5-palette';
import {BODY} from '../shared/src/theme';

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const f1 = (v: number) => v.toFixed(1);
const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export const GENES: [number, number][] = [[0.285, 0.315], [0.505, 0.535]];
export const RUN: [number, number] = [0.62, 1.0];
/** Block boundaries inside the run (arbitrary schematic lengths). */
export const BLOCKS = [0.62, 0.69, 0.765, 0.83, 0.905, 0.955, 1.0];
/** Real-state endpoints after rounds 0..3; thought-experiment endpoints (no telomere) after rounds 0..3. */
export const ENDS = [1.0, 0.935, 0.868, 0.8];
export const NT_ENDS = [0.585, 0.565, 0.545, 0.522];

export type TelProps = {
  x: number; y: number; len: number; amp?: number; opacity?: number;
  end?: number;          // template (current) endpoint, fraction
  telo?: number;         // 1 real state; 0 no-telomere (grey run faded)
  grow?: number;         // daughter copy growth 0..1 (0 = none)
  stop?: number;         // daughter endpoint (fraction)
  swap?: number;         // 0..1 template fades, daughter slides up into its place
  copyGap?: number;      // vertical spacing of the daughter strip below the template
  hiRun?: number;        // highlight over the whole grey run (0..1)
  sweep?: number;        // -1 none, else 0..1 sweep position along the whole run (continuous)
  hiGenes?: number;
  geneCut?: number;      // thought experiment: ring the missing part of gene 2 in the daughter (0..1)
  showGenes?: number;
};
export function telGeom(p: TelProps) {
  const X = (f: number) => p.x + f * p.len, amp = p.amp ?? 20, gap = p.copyGap ?? amp * 3.4;
  return {X, amp, yT: p.y, yD: p.y + gap, gene: (i: number) => X((GENES[i][0] + GENES[i][1]) / 2), runMid: X((RUN[0] + RUN[1]) / 2)};
}
/** One molecule strip from the left edge to `end` (fraction), at vertical centre y. telo: grey run visibility. */
function Strip({p, y, end, telo, geneClip = 1, key0}: {p: TelProps; y: number; end: number; telo: number; geneClip?: number; key0: string}) {
  const {X, amp} = telGeom(p);
  const x0 = X(0), x1 = X(end), h = amp * 2 + 8;
  if (x1 <= x0 + 1) return null;
  const n = Math.max(8, Math.round((x1 - x0) / 5));
  const strand = (ph: number) => 'M' + Array.from({length: n + 1}, (_, i) => { const xx = x0 + (x1 - x0) * i / n; return f1(xx) + ' ' + f1(y + amp * Math.sin(2 * Math.PI * ((xx - x0) / 84) + ph)); }).join('L');
  const blocks: any[] = [];
  if (telo > 0) for (let i = 0; i < BLOCKS.length - 1; i++) {
    const a = BLOCKS[i], b = Math.min(BLOCKS[i + 1], end); if (b <= a) break;
    blocks.push(<rect key={key0 + 'bl' + i} x={f1(X(a) + 1.5)} y={f1(y - h / 2)} width={f1(X(b) - X(a) - 3)} height={f1(h)} rx={4} fill={T5.telomere} stroke={T5.telomereEdge} strokeWidth={1.5} opacity={telo < 1 ? telo : undefined} />);
  }
  const genes = GENES.map(([a, b], i) => {
    const bb = Math.min(b, end); if (bb <= a) return null;
    return <rect key={key0 + 'g' + i} x={f1(X(a))} y={f1(y - h / 2 - 5)} width={f1(X(bb) - X(a))} height={f1(h + 10)} fill={T5.gene} stroke={T5.geneEdge} strokeWidth={2} opacity={geneClip < 1 ? geneClip : undefined} />;
  });
  return (
    <g>
      <rect x={f1(x0)} y={f1(y - h / 2)} width={f1(x1 - x0)} height={f1(h)} fill="#E9EDF3" rx={3} />
      {blocks}
      <path d={strand(0)} fill="none" stroke={T5.dna} strokeWidth={4} strokeLinecap="round" />
      <path d={strand(Math.PI)} fill="none" stroke="#5B6B86" strokeWidth={4} strokeLinecap="round" />
      {genes}
    </g>
  );
}
export function TelomereEndModel(p: TelProps) {
  const op = p.opacity ?? 1;
  if (op <= 0) return null;
  const g = telGeom(p), end = p.end ?? 1, telo = c01(p.telo ?? 1), grow = c01(p.grow ?? 0), stop = p.stop ?? end, swap = ease(c01(p.swap ?? 0));
  const yD = g.yD + (g.yT - g.yD) * swap;              // daughter slides up into the template's place
  const dEnd = grow > 0 ? stop * grow : 0;              // the copy grows from the left edge towards its stop
  const glow = c01(p.hiRun ?? 0), sw = p.sweep ?? -1, amp = g.amp, h = amp * 2 + 8;
  return (
    <g opacity={op < 1 ? op : undefined}>
      <g data-role="drawing">
        <g opacity={swap > 0 ? 1 - swap : undefined}><Strip p={p} y={g.yT} end={end} telo={telo} key0="T" /></g>
        {grow > 0 && <Strip p={p} y={yD} end={dEnd} telo={telo} key0="D" />}
      </g>
      <g data-role="decor">
        {glow > 0 && telo > 0 && <rect x={f1(g.X(RUN[0]))} y={f1(g.yT - h / 2 - 8)} width={f1(g.X(Math.min(end, RUN[1])) - g.X(RUN[0]))} height={f1(h + 16)} rx={10} fill={T5.ring} opacity={0.4 * glow} />}
        {sw >= 0 && telo > 0 && (() => { const xs = g.X(RUN[0]) + (g.X(Math.min(end, RUN[1])) - g.X(RUN[0])) * c01(sw); return <rect x={f1(g.X(RUN[0]))} y={f1(g.yT - h / 2 - 8)} width={f1(xs - g.X(RUN[0]))} height={f1(h + 16)} rx={10} fill={T5.ring} opacity={0.45} />; })()}
        {(p.hiGenes ?? 0) > 0 && GENES.map(([a, b], i) => <rect key={'hg' + i} x={f1(g.X(a) - 8)} y={f1(g.yT - h / 2 - 14)} width={f1(g.X(b) - g.X(a) + 16)} height={f1(h + 28)} rx={8} fill={T5.ring} opacity={0.4 * c01(p.hiGenes!)} />)}
      </g>
    </g>
  );
}
/** Replication-round counter (not a chromosome count; no compartment tag). */
export function RoundCounter({x, y, value, label = 'replication rounds', opacity = 1, hi = 0}: any) {
  if (opacity <= 0) return null;
  return (
    <g opacity={opacity < 1 ? opacity : undefined}>
      <rect data-role="decor" x={x} y={y} width={250} height={86} rx={12} fill="#FFFFFF" stroke={hi > 0 ? T5.ring : '#D6CEBD'} strokeWidth={hi > 0 ? 3 + 2 * hi : 2} />
      <text x={x + 16} y={y + 28} fontSize={17} fontWeight={700} fill="#6F6A60" fontFamily={BODY}>{label}</text>
      <text x={x + 16} y={y + 72} fontSize={40} fontWeight={800} fill={T5.ringHalo} fontFamily={BODY}>{value}</text>
    </g>
  );
}
