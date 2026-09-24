/** Benedict's 3: reading the result. Blue = reagent (negative under these conditions); four separate
 * endpoint tubes after the same heating (green, yellow, orange, brick-red) with a precipitate, first
 * suspended, then settled; observation in words → inference; green/yellow positive; red is one end. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag, Cite, Arrow, InkRing} from '../../../shared/src/Type';
import {Tube, Rack} from '../Apparatus';
import {COIStack} from '../Panels';
import {fi, fe, between} from '../util';

const POS = [
  {key: 'g', k: 'green', x: 470},
  {key: 'y', k: 'yellow', x: 645},
  {key: 'o', k: 'orange', x: 820},
  {key: 'br', k: 'brickred', x: 995},
];

export default function Beat08(s: any) {
  const {a, local} = s;
  const ppt = fi(a('ppt'), 0.8);
  const settle = fe(a('settle'), 2.2);
  const pulse = a('pos') > 0 && a('further') < 0 ? 0.5 + 0.5 * Math.sin(local * 6) : 0;
  return (
    <g>
      <Rack x={640} y={420} w={1000} h={250} slots={5}>
        <Tube id="b8" x={250} y={330} h={300} w={66} level={0.45} k="blue" opacity={fi(a('blue'))} pillY={712} />
        {POS.map((p) => (
          <g key={p.key} transform={`translate(0 ${(1 - fe(a(p.key), 0.5)) * -60})`}>
            <Tube id={'p8' + p.key} x={p.x} y={330} h={300} w={66} level={0.45} k={p.k} opacity={fi(a(p.key), 0.4)}
              ppt={p.k === 'green' ? ppt * 0.6 : ppt} settle={settle} glow={(p.k === 'green' || p.k === 'yellow') && pulse > 0.5} pillY={712} />
          </g>
        ))}
      </Rack>
      <Tag x={250} y={300} text="negative under these conditions" size={17} anchor="middle" opacity={fi(a('neg'))} />
      <g opacity={fi(a('sep'))}>
        <path d="M440 290V276H1030V290" fill="none" stroke={C.ink} strokeWidth={3} />
        <Txt x={735} y={262} size={20} anchor="middle" weight={800}>separate tubes, each after the same heating</Txt>
      </g>
      <g opacity={between(a('g'), a('sep'))}>
        <Txt x={735} y={272} size={20} anchor="middle" weight={800} fill={C.muted}>positive results: separate endpoint tubes</Txt>
      </g>
      {/* green and yellow are positive */}
      <g opacity={fi(a('pos'))}>
        <Tag x={470} y={776} text="positive" size={20} anchor="middle" fill={C.white} bg="#1D8A4E" stroke="#1D8A4E" />
        <Tag x={645} y={776} text="positive" size={20} anchor="middle" fill={C.white} bg="#1D8A4E" stroke="#1D8A4E" />
      </g>
      <g opacity={fi(a('further'))}>
        <Arrow x1={470} y1={825} x2={1010} y2={825} color={C.ink} width={4} head={16} />
        <Txt x={470} y={862} size={19} weight={700}>standards heated alike: more reducing sugar → further along</Txt>
      </g>
      <Cite x={96} y={904} size={17} opacity={fi(a('next'))} text={"9700/12 June 2022 Q6, key D: after 240 s, blue → green → yellow → red with increasing reducing sugar · standards: 2.1.2"} />
      {fi(a('redend')) > 0 && <InkRing cx={995} cy={500} rx={70} ry={200} p={fe(a('redend'), 0.7)} />}
      <Tag x={1000} y={776} text="one end of the row" size={19} anchor="middle" fill={C.primary} opacity={fi(a('redend') - 0.4)} />
      {/* precipitate close-up: liquid vs solid labelled separately */}
      <g opacity={fi(a('ppt'))}>
        <rect x={1180} y={230} width={660} height={320} rx={18} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Txt x={1480} y={268} size={20} weight={800} fill={C.muted}>CLOSE-UP · MODEL</Txt>
        <Tube id="z8" x={1330} y={255} h={270} w={90} level={0.62} k="brickred" ppt={1} settle={settle} pill={false} />
        <path d={`M1380 ${settle > 0.5 ? 505 : 430}H1470`} stroke={C.primary} strokeWidth={2.5} />
        <Txt x={1480} y={settle > 0.5 ? 512 : 437} size={22} weight={800} fill={C.primary}>precipitate (a solid)</Txt>
        <Txt x={1480} y={settle > 0.5 ? 540 : 465} size={18} weight={700} fill={C.muted}>{settle > 0.5 ? 'settled as a layer' : 'suspended: clouds the liquid'}</Txt>
        <path d="M1380 380H1470" stroke={C.ink} strokeWidth={2} opacity={fi(a('settle') - 1.2)} />
        <Txt x={1480} y={387} size={22} weight={800} opacity={fi(a('settle') - 1.2)}>liquid</Txt>
      </g>
      {/* observation → inference */}
      <g opacity={fi(a('say'))}>
        <COIStack x={1180} y={580} w={660} cond={"Benedict's, ≥ 80 °C, 4 min"} obs="orange, with precipitate" obsK="orange" inf="reducing sugar present" o={fi(a('say') - 0.3)} i={fi(a('say') - 1.4)} hiObs={between(a('say'), a('pos')) > 0.5} />
        <Cite x={1186} y={800} size={18} text={'9700/33 June 2021 MS: "Benedict\'s solution and colour(s)\nstated, e.g. red, brown, green, yellow ;"'} />
      </g>
      <Cite x={1186} y={862} size={16} opacity={fi(a('neg'))} text={'Photograph: no licensed asset identified; these labelled\nmodels are shown instead, never recoloured.'} />
    </g>
  );
}
Beat08.pin = (s: any) => (s.a('say') > 0 && s.a('pos') < 0 ? 'O' : 'O');
