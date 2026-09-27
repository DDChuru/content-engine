/** Beat 10 · What I told you, on the chromosome you built. No new slide: the built layout returns (C1 X labelled
 * "Recap: after replication", Z1 inset, the ghost single thread with the replication arrow, the small model cell with
 * its overlay). Static; key points fade in in place. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom, HistoneFiber, ModelCell, CountStrip, CId} from '../ChromosomeModel';
import {Glow} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {HookNucleus, ScaleBar, INK} from './kit';

const K = (a: number) => fi(a, 0.5);
export default function Beat10(s: any) {
  const a = s.a;
  const X: any = {x: 760, y: 540, id: 'C1', cond: 1, rep: 1, scale: 1.6};
  const G = chromGeom(X);
  const glowX = K(a('dna')) * (1 - fe(a('hist'), 0.6)) + K(a('fits')) * 0.8;
  return (
    <g>
      <Tag x={760} y={262} text="Recap: after replication" size={20} anchor="middle" bg="#EAF0F8" />
      {/* Z1 inset */}
      <rect data-role="decor" x={80} y={236} width={440} height={130} rx={12} fill="#FFFFFF" stroke={a('hist') >= 0 ? T5.ring : '#D6CEBD'} strokeWidth={a('hist') >= 0 ? 4 : 2} />
      <g transform="translate(96 290) scale(0.36)"><HistoneFiber x={0} y={0} beads={6} gap={165} r={36} lead={90} /></g>
      <Txt x={96} y={352} size={18} weight={800} fill={INK} opacity={K(a('hist'))}>DNA + histone proteins</Txt>
      {/* ghost single thread + replication arrow */}
      <Chromosome x={330} y={540} id="C1" cond={1} rep={-1} scale={1.6} opacity={0.75} />
      <Arrow x1={420} y1={540} x2={640} y2={540} color={INK} />
      <Txt x={530} y={522} size={20} weight={700} fill={INK} anchor="middle">replication</Txt>
      {glowX > 0 && [-1, 1].map((sd) => <Glow key={sd} cx={G.sides[sd].at(0.5)[0]} cy={G.sides[sd].at(0.5)[1]} r={120} a={glowX} />)}
      <Chromosome {...X} hiGene={K(a('sisters')) * (1 - fe(a('cen'), 0.5))} hiTel={K(a('tel')) * (1 - fe(a('coil'), 0.5))} hiCen={K(a('cen')) * (1 - fe(a('tel'), 0.5)) + K(a('count')) * (1 - fe(a('comp'), 0.5))} />
      <Tag x={930} y={400} text="one DNA molecule per chromatid" size={21} opacity={K(a('dna'))} />
      <Tag x={930} y={450} text="sister chromatids: identical copies" size={21} opacity={K(a('sisters'))} />
      <Tag x={930} y={550} text="centromere" size={21} opacity={K(a('cen'))} />
      <Tag x={930} y={660} text="telomeres: repeated, non-coding DNA at the ends" size={21} opacity={K(a('tel'))} />
      <Tag x={930} y={710} text="condensed: short, thick, visible" size={21} opacity={K(a('coil'))} />
      {/* small model cell with its overlay (whole cell: 4 · 8) */}
      <ModelCell x={1640} y={360} r={130} nr={92} nucleolusAt={[1680, 300]}>
        {(['C1', 'C2', 'C3', 'C4'] as CId[]).map((id, i) => <Chromosome key={id} x={1584 + i * 40} y={370} id={id} cond={1} rep={1} scale={0.33} />)}
      </ModelCell>
      <CountStrip x={1290} y={778} w={560} size={24} rows={[{chrom: 4, dna: 8, comp: 'whole cell'}]} hiRow={0} hiCol={-1} hiA={K(a('comp')) * 0.9} />
      <g opacity={K(a('count'))}>
        <rect data-role="decor" x={930} y={870} width={920} height={56} rx={12} fill="#FFFFFF" stroke={T5.ring} strokeWidth={3} />
        <Txt x={950} y={907} size={23} weight={800} fill={INK}>chromosomes: count centromeres · DNA molecules: count separately</Txt>
      </g>
      {/* human-scale nucleus returns small in the corner, separate from the model cell */}
      <g opacity={K(a('metres'))}>
        <rect data-role="decor" x={1440} y={515} width={410} height={245} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <HookNucleus x={1530} y={600} r={58} />
        <ScaleBar x={1482} y={680} len={48} label="5 µm" />
        <Txt x={1610} y={590} size={17} weight={700} fill={INK}>about 2 m of DNA</Txt>
        <Txt x={1610} y={612} size={17} weight={700} fill={INK}>in a few µm</Txt>
        <Txt x={1645} y={748} size={13} weight={600} fill={C.muted} italic anchor="middle">typical diploid human cell; schematic, not to scale</Txt>
      </g>
      <Tag x={760} y={820} text="packing with histones + coiling" size={22} anchor="middle" opacity={K(a('fits'))} />
    </g>
  );
}
