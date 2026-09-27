/** Beat 13 · What I told you, on the wheel and the graph. No new slide: the built layout returns, static; key points
 * fade in in place (arc + band + trace segment), with small stills of states the student watched. */
import React from 'react';
import {Tag, Txt} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome} from '../ChromosomeModel';
import {fi, fe} from '../util';
import {Stage, W, ALL} from './stage';

const K = (a: number) => fi(a, 0.5);
export default function Beat13(s: any) {
  const a = s.a;
  const hiK = (k: string, until: string) => K(a(k)) * (1 - fi(a(until), 0.4));
  return (
    <Stage wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos: 1.05,
      hi: {g1: hiK('g1', 's'), s: hiK('s', 'g2'), g2: hiK('g2', 'm'), m: hiK('m', 'c'), c: K(a('c'))},
      inset: {on: 1, cell: 1, nucleus: 1, cellGrow: 0.2, rep: -1, cond: 0}}}
      graph={{pen: 1.3, hiG1: hiK('u1', 's'), hiRise: hiK('rise', 'g2'), hiG2: hiK('g2', 'm'), hiDrop: K(a('back'))}}
      rows={[{chrom: 4, dna: 4, comp: 'each daughter cell'}]} human="typical diploid human somatic cell: each daughter cell 46 · 46" insetCap={1}>
      <Tag x={700} y={430} text="growth" size={18} opacity={K(a('g1'))} />
      <Tag x={560} y={880} text="DNA replication, S (synthesis) phase of interphase" size={17} anchor="middle" opacity={K(a('s'))} />
      {a('sis') >= 0 && <g opacity={K(a('sis'))}>
        <rect data-role="decor" x={690} y={456} width={190} height={156} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Chromosome x={785} y={508} id="C1" cond={0} rep={1} rot={90} scale={0.24} wave={0.3} />
        <Txt x={785} y={572} size={20} weight={700} fill={T5.ringHalo} anchor="middle">one chromosome,</Txt>
        <Txt x={785} y={596} size={20} weight={700} fill={T5.ringHalo} anchor="middle">two DNA molecules</Txt>
      </g>}
      <Tag x={75} y={760} text="more growth" size={16} opacity={K(a('g2'))} />
      {a('m') >= 0 && <g opacity={K(a('m'))}>
        <rect data-role="decor" x={70} y={300} width={200} height={116} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing"><circle cx={135} cy={350} r={28} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={2} /><circle cx={205} cy={350} r={28} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={2} /></g>
        <Txt x={170} y={404} size={20} weight={800} fill={T5.ringHalo} anchor="middle">nuclear division</Txt>
      </g>}
      {a('c') >= 0 && <g opacity={K(a('c'))}>
        <rect data-role="decor" x={600} y={250} width={270} height={124} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing"><circle cx={695} cy={300} r={34} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} /><circle cx={775} cy={300} r={34} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />
          <circle cx={695} cy={300} r={15} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={1.5} /><circle cx={775} cy={300} r={15} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={1.5} /></g>
        <Txt x={735} y={362} size={20} weight={800} fill={T5.ringHalo} anchor="middle">division of the cytoplasm</Txt>
      </g>}
      {a('back') >= 0 && <rect data-role="decor" x={898} y={660} width={934} height={66} rx={10} fill={T5.ring} opacity={0.4 * K(a('back'))} />}
    </Stage>
  );
}
