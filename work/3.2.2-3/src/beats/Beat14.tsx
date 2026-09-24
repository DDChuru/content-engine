/** Beat 14 · The sentences you write, clause by clause (Express). The two panels shrink to the top; the two
 * creditworthy sentences build beneath; connectives (so, because) highlighted; panels pulse as clauses land. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Card, textW} from '../shared/Type';
import {fi, fe} from '../util';
import {MiniPanel, pulseV} from './panels';

const K = C.teal;
function Clause({y, a, parts, size = 25}: any) {
  const o = fi(a, 0.45), dx = (1 - fe(a, 0.5)) * 30;
  return (
    <g opacity={o} transform={`translate(${dx} 0)`}>
      {(() => { let cx = 150; return parts.map(([t, c]: any, i: number) => { const w = c ? 800 : 700, el = <Txt key={i} x={cx} y={y} size={size} weight={w} fill={c ?? C.ink}>{t.trim()}</Txt>; cx += textW(t.trim(), size, w) + (i < parts.length - 1 ? size * 0.26 : 0); return el; }); })()}
    </g>
  );
}
export default function Beat14(s: any) {
  const {a} = s;
  const shrink = fe(a('open'), 0.8);
  const caus = a('c5b') > 0 && a('c5b') < 2.5 ? 0.5 + 0.5 * Math.sin(a('c5b') * 7) : 0;
  return (
    <g>
      <g opacity={shrink}>
        <MiniPanel x={90} y={190} kind="comp" pv={pulseV(a('c1'))} ph={pulseV(a('c2'))} pm={pulseV(a('c4'))} pl={pulseV(a('c5'))} />
        <MiniPanel x={990} y={190} kind="nonc" pm={pulseV(a('c6'))} pl={pulseV(a('c7'))} />
      </g>
      <Card x={90} y={510} w={1760} h={425} opacity={fi(a('b1'))} fill="#FFFFFF" />
      <Txt x={120} y={552} size={18} weight={800} fill={C.muted} opacity={fi(a('b1'))}>FOR Km (3.2.2)</Txt>
      <Clause y={590} a={a('c1')} parts={[['Vmax is the maximum initial rate;']]} />
      <Clause y={628} a={a('c2')} parts={[['Km is the substrate concentration at ½Vmax, read by construction from each enzyme\'s own curve;']]} />
      <Clause y={666} a={a('c3')} parts={[['a lower Km means a higher affinity for the substrate.']]} />
      <Txt x={120} y={718} size={18} weight={800} fill={C.muted} opacity={fi(a('b2'))}>FOR INHIBITORS (3.2.3)</Txt>
      <Clause y={756} a={a('c4')} parts={[['A competitive inhibitor binds reversibly in the active site, ']]} />
      <Clause y={794} a={a('c5')} parts={[['so', K], ['\u00A0Vmax is unchanged and Km increases, ']]} />
      <g opacity={fi(a('c5b'))}>
        {caus > 0 && <rect x={146} y={808} width={112} height={38} rx={8} fill={C.accent} opacity={0.45 * caus} />}
        <Clause y={832} a={a('c5b')} parts={[['because', K], ['\u00A0more substrate can overcome it;']]} />
      </g>
      <Clause y={870} a={a('c6')} parts={[['a non-competitive inhibitor binds at a site other than the active site and changes the shape of the active site,']]} size={24} />
      <Clause y={908} a={a('c7')} parts={[['so', K], ['\u00A0(simplified model) Vmax decreases and Km is unchanged.']]} />
    </g>
  );
}
