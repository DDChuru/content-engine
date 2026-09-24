/** Objectives: own styled surface (dark), no lesson diagram. Three lines, each keyed to its cue. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';
import {fi, fe} from '../util';

function Line({n, y, head, a, children}: any) {
  const o = fi(a, 0.5), dx = (1 - fe(a, 0.6)) * -60;
  return (
    <g opacity={o} transform={`translate(${dx} 0)`}>
      <circle cx={150} cy={y - 16} r={40} fill={C.primary} />
      <Txt x={150} y={y} anchor="middle" size={44} weight={800} fill={C.white}>{n}</Txt>
      <Txt x={225} y={y} size={46} weight={800} fill={C.accent}>{head}</Txt>
      {children}
    </g>
  );
}
function Chip({x, y, text, on, size = 36}: any) {
  const w = text.length * size * 0.5 + 34;
  return (
    <g>
      <rect x={x - 14} y={y - size - 6} width={w} height={size + 26} rx={14} fill={C.primary} opacity={on * 0.4} />
      <Txt x={x} y={y} size={size} weight={700} fill={C.warm} opacity={0.35 + 0.65 * on}>{text}</Txt>
    </g>
  );
}
export default function Beat02(s: any) {
  const {a} = s;
  return (
    <g>
      <Txt x={120} y={250} size={30} weight={700} fill={C.muted} opacity={fi(a('open'))}>BY THE END OF THIS YOU WILL BE ABLE TO</Txt>
      <Line n="1" y={370} head="STATE" a={a('l1')}>
        <Txt x={420} y={370} size={40} weight={700} fill={C.warm}>what an enzyme is, and where it works:</Txt>
        <Chip x={420} y={440} text="intracellular" on={fi(a('l1b'))} />
        <Txt x={680} y={440} size={36} weight={700} fill={C.muted}>or</Txt>
        <Chip x={740} y={440} text="extracellular" on={fi(a('l1b'))} />
      </Line>
      <Line n="2" y={560} head="EXPLAIN" a={a('l2')}>
        <Txt x={470} y={560} size={40} weight={700} fill={C.warm}>the mode of action:</Txt>
        <Chip x={225} y={632} text="active site" on={fi(a('l2a'))} size={33} />
        <Chip x={470} y={632} text="enzyme–substrate complex" on={fi(a('l2b'))} size={33} />
        <Chip x={944} y={632} text="lowering of activation energy" on={fi(a('l2c'))} size={33} />
        <Chip x={1466} y={632} text="specificity" on={fi(a('l2d'))} size={33} />
      </Line>
      <Line n="3" y={760} head="KEEP APART" a={a('l3')}>
        <Txt x={560} y={760} size={40} weight={700} fill={C.warm}>the two hypotheses:</Txt>
        <Chip x={225} y={832} text="lock-and-key hypothesis" on={fi(a('l3a'))} size={33} />
        <Chip x={680} y={832} text="induced-fit hypothesis" on={fi(a('l3a') - 0.4)} size={33} />
        <Txt x={1130} y={832} size={30} weight={700} fill={C.accent} opacity={fi(a('l3b'))}>two pictures · two names</Txt>
      </Line>
      <Txt x={120} y={920} size={19} weight={600} fill={C.muted} italic opacity={fi(a('open'))}>syllabus 3.1.1 "state", 3.1.2 "explain", p.20</Txt>
    </g>
  );
}
