/** Beat 9 · When the count goes up: daughter chromosomes. Simplified model cell (no envelope/nucleolus/spindle drawn);
 * the X's line up; replicated → separated in ONE rendered frame at "centromere divides" (relabel + overlay 8 · 8 on
 * that frame; DNA unchanged); daughter chromosomes MOVE to the poles, centromere leading; one pole: 4 · 4. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom, ModelCell, CountStrip, HistoneFiber, CId} from '../ChromosomeModel';
import {Ring, Glow, Tick, Label, Bracket} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {INK} from './kit';

const CH: {id: CId; x0: number; y0: number; x1: number}[] = [
  {id: 'C1', x0: 490, y0: 590, x1: 425}, {id: 'C2', x0: 585, y0: 590, x1: 568}, {id: 'C3', x0: 678, y0: 600, x1: 690}, {id: 'C4', x0: 765, y0: 600, x1: 792},
];
const CX = 620, CY = 600, SC = 0.62;
export default function Beat09(s: any) {
  const a = s.a;
  const env = 1 - fe(s.local, 0.5);                     // change of drawing (not a narrated event)
  const al = fe(a('line'), 1.6);
  const sep = a('divide') >= 0 ? 1 : 0;
  const dist = fe(a('move'), 1.8) * 150;
  const trail = a('move') < 0 ? 0 : 1;
  const P = (c: any) => ({x: lerp(c.x0, c.x1, al), y: lerp(c.y0, CY, al), id: c.id, cond: 1, rep: 1, sep, dist: dist / SC, trail, scale: lerp(0.9, SC, al), rot: lerp(0, 90, al)});
  const G = CH.map((c) => chromGeom(P(c)));
  const rows: any[] = [{chrom: sep ? 8 : 4, dna: 8, comp: 'whole cell'}];
  if (a('pole') >= 0) rows.push({chrom: 4, dna: 4, comp: 'one pole'});
  const cens: number[][] = sep ? G.flatMap((g: any) => [g.sides[-1].cen, g.sides[1].cen]) : [];
  return (
    <g>
      <Txt x={90} y={262} size={20} weight={700} fill={INK}>model cell (2n = 4), schematic</Txt>
      <Txt x={1040} y={790} size={17} weight={600} fill={C.muted} italic>schematic; envelope, nucleolus, spindle and stages not shown: 5.2.1</Txt>
      <ModelCell x={CX} y={CY} r={300} nr={205} envelope={env} nucleolus={env} nucleolusAt={[700, 470]}>
        {al > 0 && <line data-role="decor" x1={CX - 250} y1={CY} x2={CX + 250} y2={CY} stroke={T5.spindle} strokeWidth={2} strokeDasharray="8 7" opacity={0.6 * al} />}
        {CH.map((c, i) => <Chromosome key={c.id} {...P(c)} />)}
      </ModelCell>
      <Label x={CX} y={CY - 312} text="pole" size={24} anchor="middle" opacity={fi(a('line') - 0.6, 0.4)} />
      <Label x={CX} y={CY + 334} text="pole" size={24} anchor="middle" opacity={fi(a('line') - 0.6, 0.4)} />
      <Tag x={950} y={420} text="later: 5.2.1" size={18} bg="#FFF3EC" opacity={fi(a('line'), 0.4)} />
      {sep > 0 && G[0] && <g>
        <Label x={G[0].sides[-1].cen[0] - 40} y={G[0].sides[-1].cen[1] - 30} text="daughter chromosome" size={21 + 3 * pulse(a('daughter'), 1)} anchor="end" />
        <Label x={G[0].sides[1].cen[0] - 40} y={G[0].sides[1].cen[1] + 44} text="daughter chromosome" size={21 + 3 * pulse(a('daughter'), 1)} anchor="end" />
        <Tag x={1400} y={860} text="each separated unit: a daughter chromosome" size={19} anchor="middle" />
      </g>}
      {sep > 0 && <Ring cx={G[1].sides[-1].cen[0]} cy={G[1].sides[-1].cen[1]} rx={24} ry={22} p={fe(a('own'), 0.5)} opacity={1 - fe(a('eight'), 0.5)} />}
      {cens.map((q, i) => <Tick key={i} x={q[0] + 22} y={q[1] - 16} s={0.7} p={fe(a('eight') - i * 0.25, 0.25)} />).filter(() => a('move') < 0)}
      <CountStrip x={1040} y={470} w={790} size={32} rows={rows} hiRow={0} hiCol={1} hiA={pulse(a('eight') + 0.0 - 1.8, 1.2)} />
      {/* Z1 inset: one daughter chromosome still carries its own DNA molecule */}
      <g opacity={fi(a('dna'), 0.4)}>
        <rect data-role="decor" x={1040} y={250} width={560} height={140} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g transform="translate(1056 305) scale(0.4)"><HistoneFiber x={0} y={0} beads={6} gap={165} r={36} lead={90} /></g>
        <Txt x={1056} y={372} size={17} weight={700} fill={INK}>one daughter chromosome: one DNA molecule</Txt>
        <Tag x={1480} y={290} text="DNA unchanged; relabelled only" size={16} anchor="middle" />
      </g>
      {a('pole') >= 0 && <Bracket x1={CX - 250} y1={CY - 150 - 60} x2={CX + 250} y2={CY - 150 - 60} side={-1} depth={-16} opacity={fi(a('pole'), 0.4)} />}
      <Tag x={CX - 330} y={CY - 250} text="how: 5.2.1" size={18} bg="#FFF3EC" opacity={fi(a('how'), 0.4)} anchor="middle" />
      <Txt x={1040} y={740} size={16} weight={600} fill={C.muted} italic opacity={fi(a('move'), 0.4)}>in this schematic, the arms trail behind the leading centromere; real chromosomes may look U- or V-shaped</Txt>
    </g>
  );
}
