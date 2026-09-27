/** Beat 2 · Recall: copied in the S phase of interphase (recall: 5.1.3). The wheel enlarges; the marker crosses S while
 * the inset replicates (schematic progress, completing as the marker leaves S); then the C1 X with its four telomeres. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel, ARCS} from '../CellCycleWheel';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {Label, Glow} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';

export default function Beat02(s: any) {
  const a = s.a, t = s.local;
  const at = (k: string) => t - a(k);
  const [s0, s1] = ARCS.s;
  const T = at('sisters') - at('rep');
  const done = a('sisters') >= 0;
  const prog = a('rep') < 0 ? 0 : done ? 1 : Math.min(0.985, a('rep') / T);
  const pos = a('s') < 0 ? 0.2 : a('rep') < 0 ? lerp(0.2, s0 + 0.01, fe(a('s'), 1.2)) : done ? lerp(s1, s1 + 0.04, fe(a('sisters'), 1)) : s0 + 0.01 + (s1 - s0 - 0.01) * prog;
  const rep = a('rep') < 0 ? -1 : done ? 1 : prog;
  const grow = fe(t, 1.0);
  const CX = lerp(1640, 660, grow), CY = lerp(560, 560, grow), R = lerp(95, 210, grow), TH = lerp(30, 60, grow);
  const X: any = {x: 1450, y: 560, id: 'C1', cond: 1, rep: 1, scale: 1.5};
  const G = chromGeom(X);
  const ends = [G.sides[-1].top, G.sides[1].top, G.sides[1].bottom, G.sides[-1].bottom];
  const pan = fi(a('four'), 0.5);
  return (
    <g>
      <Tag x={70} y={240} text="recall: 5.1.3" size={20} bg="#FFF3EC" />
      <CellCycleWheel cx={CX} cy={CY} R={R} thick={TH} labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} bracket={grow} caption={grow} marker={1} pos={pos}
        lit={{s: fi(a('s'), 0.4)}} outline={{m: 0.6 * fi(a('m'), 0.4)}} longPos={{s: [80, 900, 'start']}} long={{s: 0}}
        inset={{on: grow, nucleus: 1, cell: 1, rep, cond: 0}} />
      <Tag x={CX + R + 40} y={CY + R - 20} text="S (synthesis) phase of interphase" size={20} opacity={fi(a('s'), 0.4)} />
      <Tag x={CX - R - 20} y={CY - R + 10} text="mitosis" size={18} anchor="end" opacity={fi(a('m'), 0.4)} />
      <Txt x={CX} y={CY + R + 122} size={20} weight={600} fill={C.muted} anchor="middle" italic opacity={a('rep') >= 0 ? 1 : 0}>schematic account of replication during S; detailed replication in 6.1.4</Txt>
      <Label x={CX + 36} y={CY - 66} text="sister" size={20} opacity={fi(a('sisters'), 0.4) * (1 - pan * 0.3)} />
      <Label x={CX + 36} y={CY - 43} text="chromatids" size={20} opacity={fi(a('sisters'), 0.4) * (1 - pan * 0.3)} />
      <Label x={CX - 40} y={CY + 40} text="centromere" size={20} anchor="end" opacity={fi(a('cen'), 0.4)} />
      <Tag x={CX} y={CY - R - 50} text="still one chromosome: one centromere" size={20} anchor="middle" opacity={fi(a('one'), 0.4)} />
      {pan > 0 && <g opacity={pan < 1 ? pan : undefined}>
        <rect data-role="decor" x={1262} y={250} width={500} height={620} rx={16} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        {ends.map((q: number[], i: number) => <Glow key={i} cx={q[0]} cy={q[1]} r={32} a={fi(a('four') - 0.4 - i * 0.45, 0.3)} />)}
        <Chromosome {...X} />
        <Tag x={1280} y={290} text="recall: 5.1.1" size={20} bg="#FFF3EC" />
        <Txt x={1745} y={850} size={20} weight={600} fill={C.muted} italic anchor="end">drawn condensed for clarity</Txt>
        {ends.map((q: number[], i: number) => <Label key={'l' + i} x={q[0] + (i === 0 || i === 3 ? -30 : 30)} y={q[1] + (i < 2 ? -18 : 34)} text="telomere" size={20} anchor={i === 0 || i === 3 ? 'end' : 'start'} opacity={fi(a('four') - 0.4 - i * 0.45, 0.3)} />)}
      </g>}
    </g>
  );
}
