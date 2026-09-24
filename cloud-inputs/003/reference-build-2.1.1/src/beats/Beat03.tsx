/** Objectives: own styled surface (dark), no lesson diagram. Three lines, each keyed to its cue. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt} from '../../../shared/src/Type';
import {fi, fe} from '../util';

function Line({n, y, head, parts, a}: any) {
  const o = fi(a, 0.5), dx = (1 - fe(a, 0.6)) * -60;
  return (
    <g opacity={o} transform={`translate(${dx} 0)`}>
      <circle cx={150} cy={y - 16} r={40} fill={C.primary} />
      <Txt x={150} y={y} anchor="middle" size={44} weight={800} fill={C.white}>{n}</Txt>
      <Txt x={225} y={y} size={46} weight={800} fill={C.accent}>{head}</Txt>
      {parts}
    </g>
  );
}

export default function Beat03(s: any) {
  const {a} = s;
  const tests = [["Benedict's", 'l1'], ['iodine', 'l1b'], ['emulsion', 'l1c'], ['biuret', 'l1d']];
  const xs = [545, 880, 1110, 1405];
  return (
    <g>
      <Txt x={120} y={272} size={30} weight={700} fill={C.muted} opacity={fi(a('open'))}>BY THE END OF THIS YOU WILL BE ABLE TO</Txt>
      <Line n="1" y={420} head="CARRY OUT" a={a('l1')} parts={<>
        {tests.map(([t, k], i) => {
          const on = fi(a(k), 0.35);
          return (
            <g key={t}>
              <rect x={xs[i] - 14} y={372} width={t.length * 26.5 + 28} height={66} rx={14} fill={C.primary} opacity={on * 0.35} />
              <Txt x={xs[i]} y={420} size={42} weight={700} fill={C.warm} opacity={0.35 + 0.65 * on}>{t}</Txt>
              {i < 3 && <Txt x={xs[i + 1] - 22} y={420} size={42} weight={700} fill={C.muted} anchor="middle">·</Txt>}
            </g>
          );
        })}
      </>} />
      <Line n="2" y={580} head="RECORD" a={a('l2')} parts={<>
        <Txt x={470} y={580} size={42} weight={700} fill={C.warm}>the observation,</Txt>
        <Txt x={912} y={580} size={42} weight={700} fill={C.warm} opacity={fi(a('l2b'))}>then infer the class</Txt>
      </>} />
      <Line n="3" y={740} head="CHECK" a={a('l3')} parts={<>
        <Txt x={420} y={740} size={42} weight={700} fill={C.warm}>a doubtful result against its conditions and controls</Txt>
        <g opacity={fi(a('l3b'))}>
          <Txt x={420} y={812} size={42} weight={700} fill={C.accent}>before concluding</Txt>
          <path d={`M420 830H${420 + 425 * fe(a('l3b'), 0.6)}`} stroke={C.accent} strokeWidth={5} strokeLinecap="round" />
        </g>
      </>} />
    </g>
  );
}
