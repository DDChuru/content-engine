/** Benedict's 4: controls through the same heating (W stays blue; G known reducing sugar changes),
 * a checklist beside each "if it does not" case, then what a positive means: reducing sugar
 * detected, identity not established (glucose · fructose · maltose give the same kind of result). */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Cite, Card, Arrow} from '../../../shared/src/Type';
import {NamePill, Swatch} from '../../../shared/src/Swatch';
import {Tube, Thermometer, WATER, Holder} from '../Apparatus';
import {Checklist, CorrectCard} from '../Panels';
import {fi, fe, between, path} from '../util';

function Ring({x, y, n = 6, r = 26, fill = '#F2C45A'}: any) {
  const pts = Array.from({length: n}, (_, i) => `${x + r * Math.cos(-Math.PI / 2 + i * 2 * Math.PI / n)},${y + r * Math.sin(-Math.PI / 2 + i * 2 * Math.PI / n)}`).join(' ');
  return <polygon points={pts} fill={fill} stroke={C.ink} strokeWidth={2.5} />;
}

export default function Beat09(s: any) {
  const {a, local} = s;
  // Lowered into the hot bath by a holder, starting with the base above the bath rim (y 440).
  const [wx, wy] = path(a('W'), [[0, 480, 185], [1.1, 480, 420]]);
  const [gx, gy] = path(a('G'), [[0, 600, 185], [1.1, 600, 420]]);
  const holdW = a('W') > 0 && a('W') < 1.5, holdG = a('G') > 0 && a('G') < 1.5;
  const gT = a('Gchange') >= 0.6 ? 1 : 0; // endpoint switch, no false intermediate colour
  const mean = fi(a('means'));
  const early = 1 - mean;
  const pulse = a('detected') > 0 && a('which') < 0 ? 0.5 + 0.5 * Math.sin(local * 6) : 0;
  return (
    <g>
      {/* same heating for all three tubes */}
      {/* one water bath, three tubes: the same heating */}
      <rect x={250} y={440} width={460} height={270} rx={14} fill="#D5DBE2" stroke={C.ink} strokeWidth={3} />
      <rect x={262} y={470} width={436} height={228} fill={WATER} />
      <Tube id="S9" x={360} y={420} h={250} w={56} level={0.44} k="orange" ppt={1} settle={1} label="S" pill={false} />
      {a('W') > 0 && <Tube id="W9" x={wx} y={wy} h={250} w={56} level={0.44} k="blue" label="W" pill={false} />}
      {a('G') > 0 && <Tube id="G9" x={gx} y={gy} h={250} w={56} level={0.44} k="blue" to={gT > 0 ? 'brickred' : undefined} t={gT} ppt={gT > 0.5 ? (gT - 0.5) * 2 : 0} label="G" pill={false} />}
      {holdW && <Holder x={wx - 4} y={wy + 40} s={0.8} opacity={fi(1.5 - a('W'), 0.3)} />}
      {holdG && <Holder x={gx - 4} y={gy + 40} s={0.8} opacity={fi(1.5 - a('G'), 0.3)} />}
      <rect x={262} y={470} width={436} height={228} fill={WATER} opacity={0.35} />
      <Thermometer x={672} y={330} h={330} />
      <Txt x={480} y={745} size={20} anchor="middle" weight={800}>water bath, ≥ 80 °C · same heating for all three</Txt>
      <Tag x={255} y={805} text="S: sample" size={19} />
      <g opacity={fi(a('Wblue'))}>
        <NamePill x={480} y={360} k="blue" size={16} model={false} />
        <Tag x={255} y={850} text="W: distilled water · negative control" size={19} fill={a('tags') > 0 ? C.primary : C.ink} />
      </g>
      <g opacity={fi(a('Gchange') - 1.4)}>
        <NamePill x={600} y={320} k="brickred" size={16} model={false} />
        <Tag x={255} y={895} text="G: known reducing sugar · positive control" size={19} fill={a('tags') > 0 ? C.primary : C.ink} />
      </g>
      <Txt x={96} y={262} size={19} weight={700} fill={C.muted} opacity={fi(a('G'))}>G = glucose, a known reducing sugar · colours: MODEL</Txt>
      {/* "if it does not" cases, each with its checklist */}
      <g opacity={early}>
        <g opacity={fi(a('Wcheck'))}>
          <Card x={930} y={230} w={910} h={258} fill="#FBFAF7" />
          <Tube id="Wf" x={1000} y={260} h={170} w={42} level={0.45} k="green" label="W" pill={false} opacity={0.45} />
          <Txt x={1060} y={275} size={20} weight={800} fill={C.muted}>IF W CHANGED (model)</Txt>
          <Checklist x={1060} y={290} w={760} title="check before trusting anything" items={['the tube', 'the pipette', 'the reagent']} p={fe(a('Wcheck'), 1.6) * 3} />
        </g>
        <g opacity={fi(a('Gcheck'))}>
          <Card x={930} y={508} w={910} h={336} fill="#FBFAF7" />
          <Tube id="Gf" x={1000} y={538} h={170} w={42} level={0.45} k="blue" label="G" pill={false} opacity={0.45} />
          <Txt x={1060} y={553} size={20} weight={800} fill={C.muted}>IF G STAYED BLUE (model)</Txt>
          <Checklist x={1060} y={568} w={760} title="check before trusting anything" items={['the control solution', 'the volumes', 'the mixing', 'the heating']} p={fe(a('Gcheck'), 2.2) * 4} />
        </g>
      </g>
      {/* what the result means */}
      <g opacity={mean}>
        <Txt x={940} y={262} size={22} weight={800} fill={C.muted}>WHAT A POSITIVE BENEDICT'S MEANS</Txt>
        <g opacity={fi(a('detected'))}>
          <rect x={930} y={285} width={910} height={90} rx={18} fill={C.primary} opacity={0.12 + 0.2 * pulse} />
          <Txt x={960} y={342} size={30} weight={800}>INFERENCE:  reducing sugar detected</Txt>
        </g>
        <g opacity={fi(a('which'))}>
          <Txt x={960} y={420} size={22} weight={700}>which one? not established:</Txt>
          {[['glucose', 1060, 6], ['fructose', 1330, 5], ['maltose', 1600, 0]].map(([n, x, k]: any, i) => (
            <g key={n} opacity={fi(a('three') - i * 0.5, 0.4)}>
              {k ? <Ring x={x} y={490} n={k} /> : <><Ring x={x - 26} y={490} /><Ring x={x + 26} y={490} /></>}
              <Txt x={x} y={548} size={21} anchor="middle" weight={800}>{n}</Txt>
              <Arrow x1={x} y1={562} x2={x} y2={596} color={C.muted} width={3} head={9} />
              <NamePill x={x} y={624} k="orange" text="same kind of result" size={16} model={false} />
            </g>
          ))}
          <Txt x={1710} y={560} size={16} weight={700} fill={C.muted} opacity={fi(a('three'))}>icons: MODEL</Txt>
        </g>
        <CorrectCard x={930} y={670} w={910} h={170} opacity={fi(a('card'))} size={25}
          text={"Positive Benedict's: reducing sugar detected;\nidentity not established."}
          cite={'9700/12 June 2021 Q6: option A "detects only the presence or absence\nof glucose" is not correct; key B'} />
      </g>
    </g>
  );
}
Beat09.pin = (s: any) => (s.a('means') > 0 ? 'I' : 'C');
