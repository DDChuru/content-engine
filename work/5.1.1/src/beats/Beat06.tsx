/** Beat 6 · Condensed: short, thick and visible. replicated-extended → replicated-condensed by continuous coiling
 * MOTION; the light-microscope field schematic resolves from a faint blur to a dark X. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom, HistoneFiber} from '../ChromosomeModel';
import {Ring, Label, Trace, Glow} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {FieldSchematic, INK} from './kit';

export default function Beat06(s: any) {
  const a = s.a;
  const cond = a('coil') < 0 ? 0 : Math.min(1, 0.62 * fe(a('coil'), 2.3) + 0.38 * fe(a('thick'), 1.8));
  const P: any = {x: lerp(1000, 720, cond), y: lerp(540, 610, cond), id: 'C1', cond, rep: 1, rot: lerp(90, 0, cond), scale: lerp(2.4, 2.05, cond), wave: 0.22};
  const G = chromGeom(P);
  const tr = (sd: number) => Array.from({length: 61}, (_, i) => G.sides[sd].at(i / 60));
  const f = fi(a('thin'), 0.5);
  const ends = [G.sides[-1].telTop, G.sides[1].telTop, G.sides[1].telBottom, G.sides[-1].telBottom];
  const gap = lerp(165, 80, fe(a('coil'), 4));
  return (
    <g>
      <Txt x={70} y={250} size={18} weight={600} fill={C.muted} italic>schematic · C1, replicated</Txt>
      <Chromosome {...P} />
      {[-1, 1].map((sd, i) => <Trace key={sd} pts={tr(sd)} p={fe(a('thin') - i * 0.4, 1.4)} width={4} opacity={between(a('thin'), a('thin') - 3.6)} />)}
      <Tag x={1000} y={500} text="typically long and thin" size={21} anchor="middle" opacity={between(a('thin') - 0.4, a('coil'))} />
      <FieldSchematic x={1660} y={370} r={112} resolve={fe(a('visible'), 1.2)} opacity={f} />
      <Tag x={1660} y={560} text="not resolved" size={19} anchor="middle" opacity={between(a('fine'), a('visible'))} />
      <Tag x={1660} y={560} text="visible with a light microscope" size={19} anchor="middle" opacity={fi(a('visible') - 0.8, 0.4)} />
      <Tag x={1180} y={780} text="start of mitosis: later, 5.2.1" size={20} bg="#FFF3EC" opacity={fi(a('begin'), 0.4)} />
      {/* Z1 inset: the beaded fibre coiling further (beads drawn closer together) */}
      <g opacity={fi(a('coil'), 0.4)}>
        <rect data-role="decor" x={1180} y={640} width={520} height={110} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g transform={`translate(1196 690) scale(0.4)`}><HistoneFiber x={0} y={0} beads={9} gap={gap} r={36} lead={90} /></g>
        <Txt x={1196} y={738} size={15} weight={700} fill={INK}>Z1: the DNA–histone fibre coils further</Txt>
      </g>
      <Ring cx={P.x} cy={P.y + 40} rx={170} ry={300} p={fe(a('x'), 0.9)} opacity={1 - fe(a('held'), 0.6) * 0.6} />
      <Label x={P.x + 150} y={P.y - 200} text="sister chromatids" size={26} opacity={fi(a('held'), 0.4)} />
      <Label x={P.x - 170} y={P.y + 8} text="centromere" size={26} anchor="end" opacity={fi(a('held') - 0.4, 0.4)} />
      {ends.map((q: number[], i: number) => <Glow key={i} cx={q[0]} cy={q[1]} r={34} a={pulse(a('four') - i * 0.35, 0.9)} />)}
      <Label x={ends[0][0] - 40} y={ends[0][1] - 10} anchor="end" text="telomere" size={24} opacity={fi(a('four'), 0.4)} />
      <Tag x={P.x} y={915} text="4 ends: 4 telomeres" size={22} anchor="middle" opacity={fi(a('four') - 1.2, 0.4)} />
    </g>
  );
}
