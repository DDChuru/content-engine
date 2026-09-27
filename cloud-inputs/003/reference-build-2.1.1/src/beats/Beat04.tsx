/** THE ONE IDEA: a tube receives conditions and a MODEL swatch flips; four readout rows build
 * (emulsion is the THIRD row: cloudiness, not a colour reaction); CONDITIONS → OBSERVATION →
 * INFERENCE card; a faint control tube joins the schematic. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Arrow} from '../../../shared/src/Type';
import {Swatch, NamePill} from '../../../shared/src/Swatch';
import {Tube} from '../Apparatus';
import {fi, fe} from '../util';

const ROWS = [
  {k: 'r1', cond: "Benedict's (Cu²⁺ in excess) + heat", sw: 'brickred', read: 'colour + precipitate', cls: 'reducing sugars'},
  {k: 'r2', cond: 'iodine in KI', sw: 'blueblack', read: 'blue-black complex', cls: 'starch'},
  {k: 'r3', cond: 'ethanol, then water', sw: 'cloudy', read: 'cloudy dispersion', cls: 'lipid'},
  {k: 'r4', cond: 'alkali + Cu²⁺', sw: 'violet', read: 'violet', cls: 'peptide bonds', sub: 'in proteins'},
];
const X0 = 640, CX = [640, 1175, 1535], RX = 622, RW = 1228;

export default function Beat04(s: any) {
  const {a} = s;
  const flip = a('cond') >= 1.3 ? 1 : 0; // a switch, never a cross-fade through false colours
  const hiRead = fi(a('rec')), hiCls = fi(a('infer')), cloud = fi(a('cloud'));
  const coi = a('coi');
  return (
    <g>
      {/* opener: one idea, before any apparatus */}
      <g opacity={Math.min(fi(a('open'), 0.5), 1 - fi(a('schem'), 0.5))}>
        <Txt x={960} y={560} size={120} anchor="middle" weight={800} fill={C.primary}>ONE IDEA</Txt>
        <Txt x={960} y={630} size={30} anchor="middle" weight={700} fill={C.muted}>before any apparatus</Txt>
      </g>
      {/* schematic */}
      <g opacity={fi(a('schem'))}>
        <Tube id="s4" x={250} y={300} h={300} w={80} level={0.45} k="colourless" pill={false} label="sample" />
        <Txt x={250} y={652} anchor="middle" size={22} weight={700} fill={C.muted}>the sample</Txt>
      </g>
      <g opacity={fi(a('cond'))}>
        <Arrow x1={250} y1={222} x2={250} y2={290} color={C.primary} width={6} head={18} />
        <Tag x={300} y={250} text="conditions" size={24} fill={C.primary} />
        <Swatch x={96} y={700} w={170} h={62} k="blue" to="brickred" t={flip} size={19} />
        <Arrow x1={276} y1={731} x2={340} y2={731} color={C.ink} width={3} head={10} opacity={fi(a('cond') - 0.9)} />
        <Txt x={352} y={740} size={21} weight={700} fill={C.muted}>visible change</Txt>
      </g>
      <g opacity={fi(a('control')) * 0.8}>
        <Tube id="c4" x={470} y={380} h={220} w={60} level={0.45} k="colourless" pill={false} label="ctrl" />
        <Tag x={470} y={690} text="control: unchanged" size={19} anchor="middle" />
      </g>
      {/* four readout rows */}
      <g opacity={fi(a('r1'))}>
        <Txt x={CX[0]} y={236} size={19} weight={800} fill={C.muted}>CONDITIONS YOU GIVE</Txt>
        <Txt x={CX[1]} y={236} size={19} weight={800} fill={hiRead > 0 ? C.primary : C.muted}>WHAT YOU SEE (MODEL)</Txt>
        <Txt x={CX[2]} y={236} size={19} weight={800} fill={hiCls > 0 ? C.primary : C.muted}>CLASS IT POINTS TO</Txt>
      </g>
      {ROWS.map((r, i) => {
        const o = fi(a(r.k), 0.4), y = 262 + i * 98;
        const em = i === 2 && cloud > 0;
        return (
          <g key={r.k} opacity={o} transform={`translate(${(1 - fe(a(r.k), 0.5)) * 40} 0)`}>
            <rect x={RX} y={y} width={RW} height={86} rx={14} fill={C.white} stroke={em ? C.primary : C.line} strokeWidth={em ? 3 : 2} />
            <Txt x={CX[0]} y={y + (i === 2 && cloud > 0 ? 42 : 52)} size={24} weight={700}>{r.cond}</Txt>
            <Arrow x1={CX[1] - 42} y1={y + 43} x2={CX[1] - 14} y2={y + 43} color={C.muted} width={3} head={9} />
            <NamePill x={CX[1]} y={y + (i === 2 ? 40 : 50)} k={r.sw} text={r.read} anchor="start" size={19} model={false} />
            {i === 2 && <Txt x={CX[0]} y={y + 78} size={19} weight={800} fill={C.primary} opacity={cloud}>readout: cloudiness, not a colour reaction</Txt>}
            <Arrow x1={CX[2] - 42} y1={y + 43} x2={CX[2] - 14} y2={y + 43} color={C.muted} width={3} head={9} />
            <Txt x={CX[2]} y={y + (r.sub ? 42 : 52)} size={25} weight={800}>{r.cls}</Txt>
            {r.sub && <Txt x={CX[2]} y={y + 72} size={19} weight={700} fill={C.muted}>{r.sub}</Txt>}
          </g>
        );
      })}
      {hiRead > 0 && <rect x={CX[1] - 12} y={252} width={CX[2] - CX[1] - 42} height={400} rx={12} fill="none" stroke={C.primary} strokeWidth={3.5} opacity={hiRead} />}
      {hiCls > 0 && <rect x={CX[2] - 12} y={252} width={RX + RW - CX[2] + 8} height={400} rx={12} fill="none" stroke={C.primary} strokeWidth={3.5} opacity={hiCls} />}
      {/* the order, pinned for the rest of the lesson */}
      {coi > 0 && (
        <g opacity={fi(coi)}>
          {['CONDITIONS', 'OBSERVATION', 'INFERENCE'].map((t, i) => (
            <g key={t} opacity={fi(coi - i * 0.45, 0.35)}>
              <rect x={640 + i * 410} y={700} width={350} height={96} rx={18} fill={C.primary} />
              <Txt x={815 + i * 410} y={760} anchor="middle" size={34} weight={800} fill={C.white}>{t}</Txt>
              {i < 2 && <Arrow x1={998 + i * 410} y1={748} x2={1043 + i * 410} y2={748} color={C.ink} width={5} head={14} />}
            </g>
          ))}
          <Txt x={640} y={840} size={22} weight={700} fill={C.muted}>always in this order · pinned for the rest of the lesson</Txt>
        </g>
      )}
    </g>
  );
}
