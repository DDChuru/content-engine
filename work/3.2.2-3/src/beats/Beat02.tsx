/** Beat 2 · Objectives: own styled surface (dark), no lesson diagram. Three lines keyed to their cues. */
import React from 'react';
import {BRAND as C} from '../shared/theme';
import {Txt} from '../shared/Type';
import {fi, fe} from '../util';

function Line({n, y, head, rest, rest2, a, rx}: any) {
  const o = fi(a, 0.5), dx = (1 - fe(a, 0.6)) * -60;
  return (
    <g opacity={o} transform={`translate(${dx} 0)`}>
      <circle cx={150} cy={y - 16} r={40} fill={C.primary} />
      <Txt x={150} y={y} anchor="middle" size={44} weight={800} fill={C.white}>{n}</Txt>
      <Txt x={225} y={y} size={46} weight={800} fill={C.accent}>{head}</Txt>
      <Txt x={rx} y={y} size={42} weight={700} fill={C.warm}>{rest}</Txt>
      {rest2 && <Txt x={225} y={y + 60} size={42} weight={700} fill={C.warm}>{rest2}</Txt>}
    </g>
  );
}
export default function Beat02(s: any) {
  const {a} = s;
  return (
    <g>
      <Txt x={120} y={262} size={30} weight={700} fill={C.muted} opacity={fi(a('open'))}>BY THE END OF THIS YOU WILL BE ABLE TO</Txt>
      <Line n="1" y={390} head="READ" rx={352} rest="Vmax, and DERIVE Km by construction on the graph" a={a('l1')} />
      <Line n="2" y={530} head="COMPARE" rx={440} rest="the affinity of different enzymes using Km" a={a('l2')} />
      <Line n="3" y={670} head="EXPLAIN" rx={418} rest="the effects of competitive and non-competitive" rest2="reversible inhibitors, on the enzyme and on the graph" a={a('l3')} />
      <Txt x={120} y={880} size={22} weight={700} fill={C.muted} opacity={fi(a('l3') - 1.5)}>syllabus 3.2.2 and 3.2.3, p.20: "explain"</Txt>
    </g>
  );
}
