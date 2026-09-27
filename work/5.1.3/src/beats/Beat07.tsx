/** Beat 7 · Mitosis: one nucleus becomes two. Inset: nucleus outline fades; condensation (motion); spindle elements
 * grow; alignment at the equator; the centromere divides in ONE frame (relabel; whole-cell counts 8 · 8 and the
 * tracked-pair inset counter on that frame); daughter chromosomes move to the poles; decondense as two nucleus outlines
 * draw; the each-new-nucleus row is added as the nuclei form. Per-cell DNA stays at 2. */
import React from 'react';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {insetGeom, ARCS} from '../CellCycleWheel';
import {Label, Leader} from '../T5Annot';
import {fi, fe, lerp, pulse, ramp} from '../util';
import {Stage, W, ALL} from './stage';

export default function Beat07(s: any) {
  const a = s.a, t = s.local;
  const at = (k: string) => t - a(k);                      // cue time (s) within the beat
  const nucForm = fe(a('nuc'), 2.5), formed = a('nuc') >= 2.5;
  const pen = ramp(t, [[0, 0.785], [0.6, 0.79], [at('fib'), 0.815], [at('div'), 0.84], [at('move') + 2.5, 0.86], [at('nuc') + 2.5, 0.885], [s.sc.duration, 0.905]]);
  const sep = a('div') >= 0 ? 1 : 0;
  const ins = {on: 1, nucleus: 1 - fe(t, at('fib') - 0.3), cell: 1, cellGrow: 1, rep: 1, cond: fe(a('cond'), 3.2),
    poles: fi(a('fib'), 0.6) * (1 - fe(a('nuc'), 2)), fibres: fe(a('fib'), 2) * (1 - fe(a('nuc'), 1.5)), equator: fi(a('eq'), 0.5) * (1 - fe(a('move'), 1.5)),
    align: fe(a('eq'), 1.5), sep, dist: fe(a('move'), 2.5), decond: nucForm, newNuc: nucForm};
  const rows: any[] = [{chrom: sep ? 8 : 4, chromNote: sep ? undefined : '(8 sister chromatids)', dna: 8, comp: 'whole cell'}];
  if (formed) rows.push({chrom: 4, dna: 4, comp: 'each new nucleus'});
  const human = 'typical diploid human somatic cell: ' + (sep ? 'whole cell 92 · 92' : 'whole cell 46 chromosomes (92 chromatids) · 92 DNA molecules') + (formed ? '; each new nucleus 46 · 46' : '');
  const ic = sep ? 'tracked pair: 2 daughter chromosomes · 2 DNA molecules in total; 1 DNA molecule per daughter chromosome' : 'this chromosome: 1 chromosome · 2 DNA molecules';
  const g = insetGeom(W.cx, W.cy, W.R, W.thick);
  const hiRow = pulse(a('w8'), 1.4) > 0 ? 0 : pulse(a('n4'), 1.4) > 0 ? 1 : -1;
  return (
    <Stage
      wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos: pen, long: {m: fi(t, 0.3)}, inset: ins}}
      graph={{pen}} rows={rows} human={human} insetCount={sep ? undefined : ic} hiRow={hiRow} hiA={0.9 * Math.max(pulse(a('w8'), 1.4), pulse(a('n4'), 1.4))}>
      {sep > 0 && <><Txt x={W.cx} y={906} size={20} weight={800} fill={T5.ringHalo} anchor="middle">tracked pair: 2 daughter chromosomes · 2 DNA molecules in total;</Txt>
        <Txt x={W.cx} y={930} size={20} weight={800} fill={T5.ringHalo} anchor="middle">1 DNA molecule per daughter chromosome</Txt></>}
      <Label x={W.cx} y={W.cy - g.ri + 30} text="spindle fibres" size={20} anchor="middle" opacity={fi(a('fib') - 0.8, 0.4) * (1 - fe(a('nuc'), 1))} />
      <Label x={W.cx} y={W.cy + g.ri - 18} text="equator" size={20} anchor="middle" opacity={fi(a('eq'), 0.4) * (1 - fe(a('move'), 1))} />
      {/* run 009f: the two daughter-chromosome labels sit OUTSIDE the wheel, one each side, with leaders to their own
          daughter chromosome (they collided inside the inset) */}
      {sep > 0 && [-1, 1].map((sd) => { const o = 1 - fe(a('nuc'), 1); const lx = sd < 0 ? 180 : 686, tx = W.cx + sd * (fe(a('move'), 2.5) * g.poleX * 0.9 + 14);
        return o > 0 ? <g key={sd}>
          <Leader x1={sd < 0 ? lx + 6 : lx - 6} y1={416} x2={tx} y2={W.cy - 34} opacity={o} />
          <Label x={lx} y={408} text="daughter" size={21} anchor={sd < 0 ? 'end' : 'start'} opacity={o} />
          <Label x={lx} y={432} text="chromosome" size={21} anchor={sd < 0 ? 'end' : 'start'} opacity={o} />
        </g> : null; })}
      {[-1, 1].map((sd) => <Label key={'p' + sd} x={W.cx + sd * g.poleX} y={W.cy + 34} text="pole" size={20} anchor="middle" opacity={fi(a('move'), 0.4) * (1 - fe(a('nuc'), 1))} />)}
      {[-1, 1].map((sd) => <Label key={'n' + sd} x={W.cx + sd * g.ri * 0.5} y={W.cy + 78} text="new nucleus" size={20} anchor="middle" opacity={fi(a('nuc') - 1.5, 0.4)} />)}
      <Tag x={1480} y={330} text="nothing has left the cell yet" size={20} opacity={fi(a('flatm'), 0.4)} />
    </Stage>
  );
}
