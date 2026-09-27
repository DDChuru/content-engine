/** Beat 8 · A whole cell, counted with its compartment. Model cell (2n = 4, drawn condensed for counting), reset to a
 * labelled "Before S phase" state; count overlay (whole cell) 4 · 4 → replication in progress → 4 · 8 on the
 * completion frame; typical diploid human somatic cell numbers (not drawn). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom, ModelCell, CountStrip, CId} from '../ChromosomeModel';
import {Ring, Glow, Tick} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {INK} from './kit';

const CH: {id: CId; x: number; y: number}[] = [{id: 'C1', x: 490, y: 590}, {id: 'C2', x: 585, y: 590}, {id: 'C3', x: 678, y: 600}, {id: 'C4', x: 765, y: 600}];
export default function Beat08(s: any) {
  const a = s.a, T = 2.8;
  const repA = a('rep');
  const done = repA >= T;
  const rep = repA < 0 ? -1 : done ? 1 : Math.min(0.985, repA / T);
  const inProg = repA >= 0 && !done;
  const ov = fi(a('count') - 1.2, 0.4);
  const rows = [{chrom: 4, dna: inProg ? 'replication in progress' : done ? 8 : 4, comp: 'whole cell'}];
  const Gs = CH.map((c) => chromGeom({x: c.x, y: c.y, id: c.id, cond: 1, rep: done ? 1 : -1, scale: 0.9}));
  const hum = fi(a('human'), 0.4);
  const hrows: any[] = [];
  if (a('h46') >= 0) hrows.push({chrom: 46, dna: 46, comp: 'whole cell', chromNote: 'before replication'});
  if (a('h92') >= 0) hrows.push({chrom: 46, chromNote: '(92 chromatids) after', dna: 92, comp: 'whole cell'});
  const chromatids: number[][] = done ? Gs.flatMap((g: any) => [g.sides[-1].at(0.8), g.sides[1].at(0.8)]) : [];
  return (
    <g>
      <Tag x={330} y={262} text={done ? "after replication" : "Before S phase"} size={22} bg="#EAF0F8" />
      <Txt x={620} y={930} size={18} weight={600} fill={C.muted} anchor="middle" italic>drawn condensed so they can be counted; in a real interphase cell they are long and thin</Txt>
      <Txt x={930} y={262} size={20} weight={700} fill={INK} anchor="middle">model cell (2n = 4), schematic</Txt>
      <ModelCell x={620} y={600} r={300} nr={205} nucleolusAt={[700, 470]}>
        {CH.map((c, i) => <g key={c.id}>
          <Glow cx={c.x} cy={c.y} r={70} a={pulse(a('four') - i * 0.45, 0.8)} />
          <Chromosome x={c.x} y={c.y} id={c.id} cond={1} rep={rep} scale={0.9} />
        </g>)}
      </ModelCell>
      {Gs.map((g: any, i: number) => <Ring key={i} cx={g.centromere[0]} cy={g.centromere[1]} rx={26} ry={22} p={fe(a('count') - i * 0.3, 0.4)} opacity={1 - fe(a('rep'), 0.5)} />)}
      <g opacity={fi(a('key'), 0.4)}>
        <rect data-role="decor" x={1060} y={236} width={420} height={52} rx={10} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        {[T5.c1, T5.c2, T5.c3, T5.c4].map((c, i) => <rect key={i} data-role="decor" x={1076 + i * 26} y={250} width={18} height={24} rx={4} fill={c} />)}
        <Txt x={1190} y={271} size={21} weight={700} fill={INK}>colour = which chromosome</Txt>
      </g>
      <Txt x={1060} y={334} size={16} weight={600} fill={C.muted} italic opacity={inProg ? 1 : 0}>schematic account of replication during S; detailed replication in 6.1.4</Txt>
      <CountStrip x={1040} y={350} w={790} size={32} rows={rows} opacity={ov} hiRow={0} hiCol={0} hiA={done ? Math.max(0, 1 - (repA - T) / 1.5) : 0} />
      {chromatids.map((q, i) => <Tick key={i} x={q[0]} y={q[1] + 40} s={0.8} p={fe(a('eight') - i * 0.3, 0.3)} />)}
      <Tag x={620} y={870} text="8 sister chromatids" size={22} anchor="middle" opacity={fi(a('eight') - 2.4, 0.4)} />
      {hum > 0 && <g opacity={hum < 1 ? hum : undefined}>
        <CountStrip x={1040} y={540} w={790} size={32} title="typical diploid human somatic cell (numbers only; not drawn)" rows={hrows.length ? hrows : [{chrom: '', dna: '', comp: 'whole cell', opacity: 0}]} />
      </g>}
    </g>
  );
}
