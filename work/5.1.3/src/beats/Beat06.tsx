/** Beat 6 · G2: replicated, still long and thin. Marker through G2; pen flat at 2; order tag. */
import React from 'react';
import {Tag, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {onRing} from '../CellCycleWheel';
import {fi, fe, lerp, pulse} from '../util';
import {Stage, W, ALL} from './stage';

export default function Beat06(s: any) {
  const a = s.a;
  const pen = a('flat2') < 0 ? lerp(0.62, 0.68, fe(s.local, 3)) : lerp(0.68, 0.785, fe(a('flat2'), 3));
  const rows = [{chrom: 4, chromNote: '(8 sister chromatids)', dna: 8, comp: 'whole cell'}];
  const gl = (t: number) => pulse(a('order') - t, 1.1);
  const p1 = onRing(W.cx, W.cy, W.R + W.thick / 2 + 24, 0.76), p2 = onRing(W.cx, W.cy, W.R + W.thick / 2 + 24, 0.8);
  return (
    <Stage
      wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos: pen, long: {g2: fi(s.local, 0.3)},
        hi: {s: gl(0), g2: gl(0.9), m: gl(1.8)},
        inset: {on: 1, nucleus: 1, cell: 1, cellGrow: 1, rep: 1, cond: 0, ripple: a('thin') < 0 ? 0 : Math.min(2, a('thin') / 1.2)}}}
      graph={{pen}} rows={rows} human="typical diploid human somatic cell: whole cell 46 chromosomes (92 chromatids) · 92 DNA molecules"
      insetCount="this chromosome: 1 chromosome · 2 DNA molecules">
      <Tag x={W.cx} y={W.cy + 120} text="replicated, not yet visible" size={20} anchor="middle" opacity={fi(a('thin'), 0.4)} />
      <g opacity={fi(a('later'), 0.4)}>
        <Arrow x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} color={T5.ringHalo} bend={-14} />
        <Tag x={75} y={340} text="condense here" size={20} />
        <Tag x={75} y={378} text="(5.2.1 names the stages)" size={20} />
      </g>
      <Tag x={890} y={880} text="copied (S) → still thin (G2) → condenses (M)" size={22} opacity={fi(a('order') + 0.0 - 2.2, 0.4)} />
    </Stage>
  );
}
