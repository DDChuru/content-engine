/** Beat 8 · Cytokinesis: the cytoplasm divides, the graph drops. On the "giving two daughter cells" frame: the cells
 * separate, the per-cell trace drops 2 → 1, the count strip becomes each daughter cell 4 · 4 (human 46 · 46) and the inset
 * counter follows one daughter cell. Then g1-next: one daughter carries on round the ring. */
import React from 'react';
import {Txt, Tag} from '../../shared/src/Type';
import {BRAND as C} from '../../shared/src/theme';
import {T5} from '../t5-palette';
import {insetGeom} from '../CellCycleWheel';
import {graphGeom} from '../DNAContentGraph';
import {Label} from '../T5Annot';
import {fi, fe, lerp, pulse, ramp} from '../util';
import {Stage, W, GR, ALL} from './stage';

export default function Beat08(s: any) {
  const a = s.a, t = s.local;
  const at = (k: string) => t - a(k);
  const split = a('split') >= 0;
  const pos = split ? (a('next') < 0 ? 1.0 : lerp(1.0, 1.05, fe(a('next'), 1.0))) : ramp(t, [[0, 0.905], [0.8, 0.92], [at('split') - 0.04, 0.995]]);
  const pen = split ? (a('next') < 0 ? 1.0 : lerp(1.0, 1.12, fe(a('next'), 1.0))) : pos;
  const cyto = split ? 1 : a('pinch') < 0 ? 0 : Math.min(0.97, a('pinch') / (at('split') - at('pinch')) * 0.97);
  const ins = {on: 1, cell: 1, cellGrow: 1, rep: 1, sep: 1, dist: 1, align: 1, decond: 1, newNuc: 1, cyto, follow: fe(a('next'), 0.9)};
  const rows = split ? [{chrom: 4, dna: 4, comp: 'each daughter cell'}] : [{chrom: 8, dna: 8, comp: 'whole cell'}, {chrom: 4, dna: 4, comp: 'each new nucleus'}];
  const human = split ? 'typical diploid human somatic cell: each daughter cell 46 · 46' : 'typical diploid human somatic cell: whole cell 92 · 92; each new nucleus 46 · 46';
  const ic = split ? 'tracked chromosome in this daughter cell: 1 chromosome · 1 DNA molecule' : undefined;
  const gg = graphGeom(GR as any);
  const g = insetGeom(W.cx, W.cy, W.R, W.thick);
  const hl = pulse(a('d4'), 1.4);
  return (
    <Stage
      wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos, long: {c: fi(t, 0.3) * (1 - fi(a('next'), 0.3))},
        hi: {m: pulse(a('order'), 1.0), c: pulse(a('order') - 0.8, 1.0)}, inset: ins}}
      graph={{pen, overlap: fi(a('overlap'), 0.4), hiDrop: split ? Math.max(pulse(a('drop'), 1.6), 0) : 0}} rows={rows} human={human} insetCount={ic}>
      {!split && <><Txt x={W.cx} y={906} size={16} weight={800} fill={T5.ringHalo} anchor="middle">tracked pair: 2 daughter chromosomes · 2 DNA molecules in total;</Txt>
        <Txt x={W.cx} y={928} size={16} weight={800} fill={T5.ringHalo} anchor="middle">1 DNA molecule per daughter chromosome</Txt></>}
      <Txt x={W.cx} y={878} size={14} weight={600} fill={C.muted} anchor="middle" italic opacity={1 - fi(a('next'), 0.4)}>schematic; how plant and animal cells divide the cytoplasm: 5.2.1</Txt>
      <Tag x={gg.gx(0.92)} y={gg.B + 80} text="typical order; they can overlap" size={17} anchor="middle" opacity={fi(a('overlap'), 0.4)} />
      {split && [-1, 1].map((sd) => <Label key={sd} x={W.cx + sd * g.ri * 0.52} y={W.cy + 90} text="daughter cell" size={15} anchor="middle" opacity={1 - fe(a('next'), 0.6)} />)}
      <Tag x={gg.gx(1.0) - 16} y={gg.gy(1.5)} text="2 units ÷ 2 cells = 1 unit each" size={20} anchor="end" opacity={fi(a('half'), 0.4)} />
      {hl > 0 && <rect data-role="decor" x={898} y={660} width={934} height={66} rx={10} fill={T5.ring} opacity={0.4 * hl} />}
      {pulse(a('d46'), 1.4) > 0 && <rect data-role="decor" x={890} y={745} width={950} height={40} rx={10} fill={T5.ring} opacity={0.35 * pulse(a('d46'), 1.4)} />}
      <Tag x={W.cx} y={290} text="each daughter cell can go round again" size={20} anchor="middle" opacity={fi(a('next') - 0.35, 0.4)} />
    </Stage>
  );
}
