/** Beat 10 · Same enzyme, with and without an inhibitor. The switch card; a generic inhibitor (shape deliberately
 * unspecified here) binds and leaves (motion); activity arrow thins and returns; "reversible"; why it matters (cell
 * control, medicines: framing only); two empty panels; the cleft and the second site each ringed once. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Card, Tag} from '../shared/Type';
import {fi, fe, between, path, move} from '../util';
import {Enzyme, ActivityArrow} from '../Enzyme';
import {CellInset, Tablet, Small} from './common';
import {ThreeGraph, threeG} from './three';

const EX = 560, EY = 650;
export default function Beat10(s: any) {
  const {a, local} = s;
  const off = fe(a('switch'), 0.8);
  // generic inhibitor: arrives during the definition, seats on the surface, leaves at "binds and leaves again"
  const seat = [EX - 70, EY - 150];
  const arrive = path(a('inh'), [[0, EX - 380, EY - 330], [2.4, seat[0], seat[1] - 18], [2.9, seat[0], seat[1]]]);
  const leave = path(a('binds') - 1.4, [[0, seat[0], seat[1]], [1.6, EX - 420, EY - 330]]);
  const pos = a('binds') > 1.4 ? leave : arrive;
  const bound = a('inh') > 2.9 && a('binds') < 1.4;
  const level = a('returns') > 0 ? 0.35 + 0.65 * fe(a('returns'), 0.8) : a('lower') > 0 ? 1 - 0.65 * fe(a('lower'), 0.8) : 1;
  const inset = between(a('cells'), a('panels'), 0.4);
  return (
    <g>
      {/* the first half's graph slides off */}
      <g opacity={1 - off} transform={`translate(${-off * 400} 0)`}>
        <ThreeGraph g={threeG(330, 260, 820, 480)} con={{}} readings={false} />
      </g>
      {/* the switch card */}
      <g opacity={fi(a('switch') - 0.3)}>
        <Card x={90} y={190} w={1760} h={140} />
        <rect x={100} y={200} width={860} height={120} rx={12} fill={C.teal} opacity={0.12 * between(a('left'), a('right'), 0.3) + 0.04} />
        <rect x={980} y={200} width={860} height={120} rx={12} fill={C.teal} opacity={0.14 * fi(a("right")) + 0.04} />
        <Txt x={530} y={250} size={20} weight={800} fill={C.muted} anchor="middle">FIRST HALF</Txt>
        <Txt x={530} y={294} size={32} weight={800} fill={C.ink} anchor="middle">different enzymes, side by side</Txt>
        <Txt x={970} y={292} size={40} weight={800} fill={C.muted} anchor="middle">→</Txt>
        <Txt x={1410} y={250} size={20} weight={800} fill={C.muted} anchor="middle">FROM HERE</Txt>
        <Txt x={1410} y={294} size={32} weight={800} fill={C.ink} anchor="middle">the same enzyme, with and without inhibitor</Txt>
        <Small x={1410} y={318} text="same conditions" anchor="middle" />
      </g>
      {/* the model */}
      <g opacity={fi(a('inh'))}>
        <Enzyme x={EX} y={EY} labEnzyme={1} caption={1} ringActive={between(a('where'), a('where') - 1.6)} ringSecond={between(a('where') - 0.8, a('where') - 2.4)} />
        <ActivityArrow x={EX + 250} y={EY - 40} w={200} level={level} />
        {a('inh') > 0 && (a('binds') < 3.2) && <g>
          <path d={`M${pos[0] - 22} ${pos[1]}C${pos[0] - 22} ${pos[1] - 26} ${pos[0] + 24} ${pos[1] - 26} ${pos[0] + 22} ${pos[1]}C${pos[0] + 20} ${pos[1] + 20} ${pos[0] - 20} ${pos[1] + 22} ${pos[0] - 22} ${pos[1]}Z`} fill={C.inhibitor} stroke={C.primary} strokeWidth={3} data-mol="inhibitor-generic" />
          <Txt x={pos[0] - 34} y={pos[1] - 30} size={20} weight={800} fill={C.primary} anchor="end">inhibitor</Txt>
        </g>}
        <Tag x={EX + 350} y={EY + 70} text="reversible" size={26} anchor="middle" fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={fi(a('returns'))} />
        <Small x={EX + 350} y={EY + 116} text="binds, leaves; activity returns" anchor="middle" opacity={fi(a('returns'))} />
        <Small x={EX - 250} y={EY + 250} text={bound ? 'inhibitor bound: activity lowered' : ''} opacity={bound ? 1 : 0} />
      </g>
      {/* why it matters */}
      <g opacity={inset}>
        <CellInset x={1470} y={560} s={0.42} t={local} dim={1} label={false} />
        <Txt x={1470} y={700} size={20} weight={800} fill={C.ink} anchor="middle">control of reactions in cells</Txt>
        <g opacity={fi(a('meds'))}>
          <Tablet x={1740} y={420} s={0.6} />
          <Txt x={1740} y={480} size={20} weight={800} fill={C.ink} anchor="middle">medicines</Txt>
        </g>
        <Small x={1470} y={740} text="framing only; no pathway or drug list is taught here" anchor="middle" />
      </g>
      {/* two classes */}
      <g opacity={fi(a('panels'))}>
        <Card x={1180} y={390} w={670} h={240} />
        <Txt x={1210} y={440} size={32} weight={800} fill={C.ink}>competitive</Txt>
        <Card x={1180} y={660} w={670} h={240} />
        <Txt x={1210} y={710} size={32} weight={800} fill={C.ink}>non-competitive</Txt>
        <Small x={1210} y={476} text="where does it bind?" opacity={fi(a('where'))} />
        <Small x={1210} y={746} text="where does it bind?" opacity={fi(a('where'))} />
      </g>
    </g>
  );
}
