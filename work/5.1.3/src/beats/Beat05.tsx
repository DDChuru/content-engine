/** Beat 5 · S phase: replication, drawn as it happens. The marker crosses S; the inset copy grows in step with the
 * marker and the pen (one continuous motion); DNA values read "replication in progress" until the s-end frame, where
 * the inset completes and ALL counts change together. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {chromGeom} from '../ChromosomeModel';
import {ARCS} from '../CellCycleWheel';
import {Label, Ring, Bracket} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {Stage, W, ALL} from './stage';

export default function Beat05(s: any) {
  const a = s.a;
  const [s0, s1] = ARCS.s;
  const done = a('send') >= 0;
  const T = (a('rep') - a('send'));                          // seconds from "As copying proceeds" to "By the end of the S phase"
  const prog = a('rep') < 0 ? 0 : done ? 1 : Math.min(0.985, a('rep') / T);
  const pos = a('s') < 0 ? 0.34 : a('rep') < 0 ? lerp(0.34, s0, fe(a('s'), 1.2)) : s0 + (s1 - s0) * prog;
  const pen = pos;
  const rep = a('rep') < 0 ? -1 : prog;
  const inProg = a('rep') >= 0 && !done;
  const rows = [{chrom: 4, chromNote: done ? '(8 sister chromatids)' : undefined, dna: inProg ? 'replication in progress' : done ? 8 : 4, comp: 'whole cell'}];
  const human = inProg ? 'typical diploid human somatic cell: whole cell 46 chromosomes · replication in progress'
    : done ? 'typical diploid human somatic cell: whole cell 46 chromosomes (92 chromatids) · 92 DNA molecules' : 'typical diploid human somatic cell: whole cell 46 chromosomes · 46 DNA molecules';
  const ic = inProg ? 'this chromosome: 1 chromosome · replication in progress' : done ? 'this chromosome: 1 chromosome · 2 DNA molecules' : 'this chromosome: 1 chromosome · 1 DNA molecule';
  const P: any = {x: W.cx, y: W.cy, id: 'C1', cond: 0, rep: done ? 1 : -1, rot: -28, scale: 0.3};
  const G = chromGeom(P);
  const icPulse = pulse(a('one'), 1.2);
  return (
    <Stage
      wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos, long: {s: fi(a('s'), 0.3)},
        inset: {on: 1, nucleus: 1, cell: 1, cellGrow: 1, rep, cond: 0, hiGene: done ? pulse(a('sisters') - 0.3, 1.4) : 0, hiCen: pulse(a('cen'), 1.2)}}}
      graph={{pen, hiRise: pulse(a('slope'), 1.4), slopeNote: fi(a('note'), 0.4)}}
      rows={rows} human={human} insetCount={ic}>
      <Txt x={W.cx} y={878} size={15} weight={600} fill={C.muted} anchor="middle" italic opacity={a('s') >= 0 ? fi(a('s'), 0.4) : 0}>schematic account of replication during S; detailed replication in 6.1.4</Txt>
      {done && <>
        <Label x={W.cx + 40} y={W.cy - 64} text="sister" size={20} opacity={fi(a('sisters'), 0.4)} />
        <Label x={W.cx + 40} y={W.cy - 41} text="chromatids" size={20} opacity={fi(a('sisters'), 0.4)} />
        <Label x={W.cx - 30} y={W.cy + 36} text="centromere" size={19} anchor="end" opacity={fi(a('cen'), 0.4)} />
        <Bracket x1={G.sides[-1].top[0] - 16} y1={G.sides[-1].top[1] - 8} x2={G.sides[1].top[0] + 16} y2={G.sides[1].top[1] - 8} side={1} depth={10} opacity={fi(a('one'), 0.4)} />
        <Label x={W.cx - 70} y={W.cy - 105} text="one chromosome" size={19} anchor="middle" opacity={fi(a('one'), 0.4)} />
      </>}
      {icPulse > 0 && <rect data-role="decor" x={W.cx - 250} y={885} width={500} height={38} rx={10} fill={T5.ring} opacity={0.35 * icPulse} />}
      {pulse(a('model'), 1.4) > 0 && <rect data-role="decor" x={890} y={650} width={950} height={74} rx={12} fill={T5.ring} opacity={0.35 * pulse(a('model'), 1.4)} />}
      {pulse(a('human'), 1.4) > 0 && <rect data-role="decor" x={890} y={745} width={950} height={40} rx={10} fill={T5.ring} opacity={0.35 * pulse(a('human'), 1.4)} />}
    </Stage>
  );
}
