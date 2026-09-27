/** Beat 7 · Count the centromeres. The C1 X; the staple handle (converted at once into the written sentence);
 * the rule card; before/after per-chromosome labels (per chromosome, not a cell count). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {Ring, Label, Trace, Glow} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {SentenceStrip, typed, StapleInset, INK} from './kit';

const SENT = 'After replication, a chromosome consists of two sister chromatids, each its own DNA molecule, joined at one centromere.';
export default function Beat07(s: any) {
  const a = s.a;
  const X: any = {x: 820, y: 470, id: 'C1', cond: 1, rep: 1, scale: 1.6};
  const G = chromGeom(X);
  const arms = [G.sides[-1].at(0.12), G.sides[1].at(0.12), G.sides[-1].at(0.85), G.sides[1].at(0.85)];
  const tr = (sd: number) => Array.from({length: 41}, (_, i) => G.sides[sd].at(i / 40));
  const stapleO = fi(a('staple'), 0.4) * lerp(1, 0.35, fe(a('written'), 0.6));
  const ghost = fe(a('before'), 0.9);
  const card = fi(a('rule1'), 0.4);
  return (
    <g>
      <Txt x={70} y={250} size={18} weight={600} fill={C.muted} italic>schematic · C1, replicated</Txt>
      {arms.map((q, i) => <Glow key={i} cx={q[0]} cy={q[1]} r={34} a={pulse(a('how') - 0.2 - i * 0.3, 0.8)} />)}
      <Chromosome {...X} hiCen={pulse(a('rule1'), 1.2)} />
      <Tag x={820} y={272} text="how many chromosomes?" size={24} anchor="middle" opacity={between(a('how'), a('staple') - 3)} />
      <Ring cx={G.centromere[0]} cy={G.centromere[1]} rx={44} ry={36} p={fe(a('how') - 1.6, 0.6)} />
      <Txt x={G.centromere[0] + 70} y={G.centromere[1] + 14} size={48} weight={800} fill={INK} opacity={fi(a('how') - 2.2, 0.3)}>1</Txt>
      {[-1, 1].map((sd, i) => <Trace key={sd} pts={tr(sd)} p={fe(a('each') - i * 0.9, 0.9)} width={5} opacity={between(a('each') - i * 0.9, a('each') - 3.5)} />)}
      {stapleO > 0 && <g opacity={stapleO < 1 ? stapleO : undefined}>
        <StapleInset x={1420} y={250} p={fe(a('staple') - 0.6, 0.8)} pulse={pulse(a('set'), 1)} />
        <Tag x={1520} y={500} text="two sheets, one set" size={20} anchor="middle" opacity={fi(a('set'), 0.4)} />
        <Tag x={1520} y={540} text="handle: not the exam answer" size={16} anchor="middle" opacity={fi(a('written'), 0.4)} bg="#FFF3EC" />
      </g>}
      {card > 0 && <g opacity={card < 1 ? card : undefined}>
        <rect data-role="decor" x={1180} y={590} width={640} height={120} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2.5} />
        <Txt x={1204} y={636} size={27} weight={800} fill={INK}>chromosomes: count centromeres</Txt>
        <Txt x={1204} y={684} size={23} weight={700} fill={INK} opacity={fi(a('rule2'), 0.4)}>DNA molecules: count separately (one per chromatid)</Txt>
      </g>}
      {ghost > 0 && <g opacity={ghost < 1 ? ghost : undefined} transform={`translate(${lerp(-120, 0, ghost)} 0)`}>
        <Chromosome x={380} y={470} id="C1" cond={1} rep={-1} scale={1.6} opacity={0.9} />
        <Txt x={380} y={718} size={24} weight={800} fill={INK} anchor="middle">1 centromere · 1 DNA molecule</Txt>
        <Txt x={380} y={744} size={16} weight={600} fill={C.muted} anchor="middle" italic>per chromosome, not a cell count</Txt>
        <Tag x={380} y={270} text="before replication" size={18} anchor="middle" />
      </g>}
      <Arrow x1={470} y1={470} x2={700} y2={470} color={INK} opacity={fi(a('after') - 0.4, 0.4)} />
      <Txt x={585} y={452} size={20} weight={700} fill={INK} anchor="middle" opacity={fi(a('after') - 0.4, 0.4)}>replication</Txt>
      <g opacity={fi(a('after'), 0.4)}>
        <Txt x={820} y={718} size={24} weight={800} fill={INK} anchor="middle">1 centromere · 2 DNA molecules</Txt>
        <Txt x={820} y={744} size={16} weight={600} fill={C.muted} anchor="middle" italic>per chromosome, not a cell count</Txt>
      </g>
      <SentenceStrip x={210} y={782} w={1500} text={SENT} shown={typed(SENT, a('written') - 0.9, 15).length} opacity={fi(a('written'), 0.4)} size={27} />
    </g>
  );
}
