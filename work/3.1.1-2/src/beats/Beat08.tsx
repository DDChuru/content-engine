/** Held in place: the enzyme–substrate complex. bound state: dashed temporary-bond ticks, R groups on the
 * wall, the 2.3.3 dashed legend, the complex bracket and its full name, the ring. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, InkRing, Underline, textW} from '../../shared/src/Type';
import {Enzyme, Substrate, Ticks, ComplexBracket, ModelTag, Label, pt} from '../Model';
import {fi, fe, pulse} from '../util';

export default function Beat08(s: any) {
  const {a} = s;
  const X = 760, Y = 640, S = 1.2;
  const [tx, ty] = pt(X, Y, S, 124, -104);
  const bw = textW('enzyme–substrate complex', 34, 700);
  return (
    <g>
      <Enzyme x={X} y={Y} s={S} stubs={fi(a('rgroups'))}>
        <Substrate kind="gen" />
        <Ticks p={fi(a('bound'))} glow={pulse(a('ticks'), 1.0) + pulse(a('ticks') - 1.1, 1.0)} />
        <ComplexBracket p={fe(a('bracket'), 0.7)} glow={pulse(a('ring'), 1.2)} />
      </Enzyme>
      <ModelTag x={X} y={Y + 270} opacity={1} />
      <Label lx={1250} ly={420} tx={tx} ty={ty} text="temporary bonds (e.g. hydrogen bonds)" size={26} opacity={fi(a('ticks'))} />
      <g opacity={fi(a('legend'))}>
        <Tag x={1250} y={478} text="recall 2.3.3 bond legend" size={19} fill={C.teal} />
        <path d="M1256 516H1316" stroke={C.ink} strokeWidth={4} strokeDasharray="5 4" />
        <Txt x={1330} y={523} size={20} weight={700}>hydrogen bond (dashed)</Txt>
      </g>
      <Txt x={1250} y={590} size={22} weight={800} fill={C.primary} opacity={fi(a('rgroups'))}>R groups lining the active site</Txt>
      <g opacity={fi(a('bracket'))}>
        <Txt x={1250} y={690} size={34} weight={700} fill={C.teal}>enzyme–substrate complex</Txt>
        <Underline x1={1250} x2={1250 + bw} y={702} p={fe(a('underline'), 0.6)} />
        <Txt x={1250} y={742} size={19} weight={600} fill={C.muted} italic opacity={fi(a('underline'))}>write it out: enzyme-substrate complex (June 2024 ER p.12)</Txt>
      </g>
      {a('ring') >= 0 && <InkRing cx={X + 70 * S} cy={Y - 130 * S} rx={170} ry={120} p={fe(a('ring'), 0.6)} width={4 + 3 * pulse(a('ring') - 0.6, 1.0)} />}
      <Txt x={1250} y={830} size={26} weight={800} opacity={fi(a('ring'))}>the reaction happens inside the complex</Txt>
    </g>
  );
}
