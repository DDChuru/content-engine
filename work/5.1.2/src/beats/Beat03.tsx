/** Beat 3 · Recall: copy in S, share in anaphase. Part 1 (recall: 5.1.3): the wheel's marker crosses S while the C1 inset
 * replicates in step with the per-cell DNA rise; ALL counts change on the completion frame; the inset condenses; gene
 * bands match on the sisters. Part 2 (recall: 5.2.1): the animal MitosisCellModel at metaphase; the centromeres divide
 * in ONE frame (relabel + count change on that frame); daughter chromosomes move to the poles, centromere leading. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel, ARCS, wheelGeom} from '../CellCycleWheel';
import {DNAContentGraph} from '../DNAContentGraph';
import {CountStrip} from '../ChromosomeModel';
import {MSTAGES, MCOUNT, mixM} from '../MitosisCellModel';
import {Label, Ring, Leader} from '../T5Annot';
import {ChainBody, cellGeom, IC} from '../IdenticalChain';
import {fi, fe, lerp, pulse} from '../util';

export const W3 = {cx: 400, cy: 590, R: 200, thick: 58};
export default function Beat03(s: any) {
  const a = s.a;
  const [s0, s1] = ARCS.s;
  const done = a('done') >= 0, mit = a('mit') >= 0;
  const Trep = a('rep') - a('done');
  const prog = a('rep') < 0 ? 0 : done ? 1 : Math.min(0.985, a('rep') / Trep);
  const pos = a('s') < 0 ? 0.05 : a('rep') < 0 ? lerp(0.05, s0, fe(a('s'), 1.4)) : !done ? s0 + (s1 - s0) * prog : lerp(s1, 0.82, fe(a('done') - 0.4, 2.8));
  const cond = done ? fe(a('done') - 1.6, 2.4) : 0;
  const inProg = a('rep') >= 0 && !done;
  const rows = [{chrom: '4', chromNote: done ? '(8 sister chromatids)' : undefined, dna: inProg ? 'replication in progress' : done ? 8 : 4, comp: 'whole cell'}];
  const out = fe(a('mit'), 0.5);   // run 009g: part 1 is gone (no slide off the frame) before part 2 fades in
  const g = wheelGeom(W3 as any);
  // part 2: mitosis replay
  const sep = a('divide') >= 0 ? 1 : 0;
  const pole = fe(a('poles'), 3.2);
  const m = {...MSTAGES['metaphase'], sep, pole};
  const G = cellGeom(m);
  const rows2 = !sep ? MCOUNT.replicated : a('each') >= 0 ? MCOUNT.arrived : MCOUNT.separated;
  const inOp = fi(a('mit') - 0.55, 0.5);
  const dl = fi(a('divide'), 0.001);
  const cs = G.chroms;
  return (
    <g>
      <Tag x={70} y={206} text={mit && out > 0.5 ? 'recall: 5.2.1' : 'recall: 5.1.3'} size={18} />
      {out < 1 && <g opacity={1 - out}>
        <CellCycleWheel {...W3} labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} bracket={1} caption={1} marker={1} pos={pos}
          hi={{s: pulse(a('s'), 1.4)}}
          inset={{on: 1, nucleus: 1 - cond, cell: 1, rep: a('rep') < 0 ? -1 : prog, cond, hiGene: Math.max(pulse(a('copy'), 1.6), a('genes') >= 0 ? 0.6 : 0), hiCen: pulse(a('sisters') - 0.6, 1.2)}} />
        <DNAContentGraph x={900} y={240} w={940} h={340} pen={pos} caption={1} unitKey={1} hiRise={inProg ? 0.6 : 0} />
        <CountStrip x={900} y={650} w={700} size={24} rows={rows} />
        {a('s') >= 0 && <Label x={g.mid('s')[0] + 50} y={g.mid('s')[1] + 60} text="S (synthesis) phase of interphase" size={20} opacity={fi(a('s'), 0.4)} />}
        {a('rep') >= 0 && <Txt x={W3.cx} y={900} size={15} weight={600} fill={C.muted} anchor="middle" italic opacity={fi(a('rep'), 0.4)}>schematic account of replication during S; detailed replication in 6.1.4</Txt>}
        {a('sisters') >= 0 && <g opacity={fi(a('sisters'), 0.4)}>
          {/* run 009g: outside the wheel (was inside, on top of the G1 label), with leaders to the inset */}
          <Label x={W3.cx + W3.R + 70} y={W3.cy + 6} text="centromere" size={20} />
          <Leader x1={W3.cx + W3.R + 62} y1={W3.cy} x2={W3.cx + 10} y2={W3.cy} />
          <Label x={W3.cx + W3.R + 70} y={W3.cy + 62} text="sister chromatids" size={20} />
          <Leader x1={W3.cx + W3.R + 62} y1={W3.cy + 56} x2={W3.cx + 22} y2={W3.cy + 40} />
        </g>}
        {a('copy') >= 0 && <Label x={W3.cx - 60} y={W3.cy + 92} text="gene" size={19} anchor="end" opacity={fi(a('copy'), 0.4)} />}
        {a('genes') >= 0 && <Txt x={W3.cx} y={W3.cy + 132} size={17} weight={700} fill={T5.ringHalo} anchor="middle" opacity={fi(a('genes'), 0.4)}>matching gene bands on both sisters</Txt>}
      </g>}
      {inOp > 0 && <g opacity={inOp < 1 ? inOp : undefined}>
        <ChainBody m={m} rows={rows2} parentOp={0} cardsOp={0} />
        {sep > 0 && <g opacity={dl}>
          <Label x={cs[0].x - 230} y={cs[0].y - 36} text="daughter chromosome" size={19} anchor="end" />
          <Leader x1={cs[0].x - 226} y1={cs[0].y - 42} x2={cs[0].x - 8 - pole * 240} y2={cs[0].y - 20} />
          <Label x={cs[3].x + 230} y={cs[3].y + 50} text="daughter chromosome" size={19} />
          <Leader x1={cs[3].x + 228} y1={cs[3].y + 44} x2={cs[3].x + 8 + pole * 240} y2={cs[3].y + 20} />
        </g>}
        {a('poles') >= 0 && <Txt x={IC.cx} y={IC.cy - 310 * IC.size - 18} size={15} weight={600} fill={C.muted} anchor="middle" italic opacity={fi(a('poles'), 0.4)}>in this schematic, arms trail the leading centromere; real chromosomes may look U- or V-shaped</Txt>}
        {a('each') >= 0 && G.poles.map((p, i) => <Ring key={i} cx={p[0] + (i ? -1 : 1) * 95} cy={p[1]} rx={80} ry={190} p={fe(a('each'), 0.7)} />)}
        {a('each') >= 0 && <Txt x={IC.cx} y={IC.cy + 310 * IC.size + 56} size={19} weight={800} fill={T5.ringHalo} anchor="middle" opacity={fi(a('each') - 0.5, 0.4)}>each pole: one of every chromosome (C1, C2, C3, C4)</Txt>}
      </g>}
    </g>
  );
}
