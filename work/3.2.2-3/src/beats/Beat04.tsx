/** Beat 4 · One number for affinity: Km. Different curves (faint, then gone); the name; the s21_51 QP p.5
 * definition verbatim; Km is read on the concentration axis; the y-axis dims with a struck ghost "Km". */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Cross} from '../shared/Type';
import {fi, fe, between} from '../util';
import {Axes, CurvePath, G} from '../RateGraph';
import {QuoteTab} from '../Panels';
import {Small} from './common';

const g: G = {x: 250, y: 300, w: 780, h: 470, xmax: 100, ymax: 10};
const c = {id: 'no-inhibitor', vmax: 8, km: 12};
const others = [{id: 'other-1', vmax: 5.4, km: 26}, {id: 'other-2', vmax: 9.4, km: 6}];
const DEF = '"The Michaelis-Menten constant, Km, is the substrate\nconcentration at which the initial rate of reaction\nis half its maximum value, Vmax."';
export default function Beat04(s: any) {
  const {a} = s;
  const faint = between(a('curves'), a('curves') - 5.5, 0.5);
  const trace = clamp01(a('conc') / 1.2);
  return (
    <g>
      <Axes g={g} xLabel="substrate concentration / mmol dm⁻³" yLabel="initial rate / arbitrary units" traceX={trace} xUnitPulse={between(a('units'), a('units') - 2) * (0.5 + 0.5 * Math.sin(a('units') * 8))} dimY={between(a('notrate'), a('notrate') - 2.4)} />
      {others.map((o, i) => <CurvePath key={o.id} g={g} c={o} p={clamp01((a('curves') - i * 0.4) / 1)} opacity={0.45 * faint} color={i ? C.curveB : C.curveC} dash="10 7" />)}
      <CurvePath g={g} c={c} />
      <Small x={g.x + g.w} y={g.y - 20} text="our schematic; no values" anchor="end" />
      <Small x={g.x + g.w - 20} y={g.y + 40} text="different enzymes, different curves" anchor="end" opacity={faint} />
      {/* Km is read here */}
      <g opacity={fi(a('conc') - 0.6)}>
        <path d={`M${g.x + 40} ${g.y + g.h + 100}H${g.x + g.w - 40}`} stroke={C.teal} strokeWidth={3} />
        <path d={`M${g.x + 40} ${g.y + g.h + 90}V${g.y + g.h + 110}M${g.x + g.w - 40} ${g.y + g.h + 90}V${g.y + g.h + 110}`} stroke={C.teal} strokeWidth={3} />
        <Txt x={g.x + g.w + 40} y={g.y + g.h + 104} size={28} weight={800} fill={C.teal}>Km is read here</Txt>
      </g>
      {/* ghost Km on the rate axis, struck and dissolving */}
      <g opacity={between(a('notrate'), a('notrate') - 2.4)}>
        <Txt x={g.x + 26} y={g.y + g.h / 2} size={34} weight={800} fill={C.muted} opacity={0.6}>Km</Txt>
        <Cross x={g.x + 110} y={g.y + g.h / 2 - 12} s={16} />
        <Txt x={g.x + 140} y={g.y + g.h / 2 - 2} size={22} weight={800} fill={C.primary}>not a rate</Txt>
      </g>
      {/* the name and the definition */}
      <g opacity={fi(a('name'))} transform={`translate(0 ${(1 - fe(a('name'), 0.5)) * 16})`}>
        <Txt x={1110} y={330} size={40} weight={800} fill={C.ink}>Michaelis–Menten constant (Km)</Txt>
      </g>
      <QuoteTab x={1110} y={372} w={740} size={25} opacity={fi(a('def'))} quote={DEF} source="9700/51 June 2021 question paper, p.5 (the paper's own words)"
        under={[[0, 'the substrate', clamp01(a('d1') / 0.6), C.teal], [1, 'concentration at which', clamp01((a('d1') - 0.5) / 0.6), C.teal], [2, 'half its maximum value', clamp01(a('d2') / 0.7), C.teal]]} />
      <g opacity={fi(a('conc'))}>
        <Txt x={1110} y={600} size={30} weight={800} fill={C.teal}>a concentration</Txt>
        <Txt x={1110} y={642} size={24} weight={700} fill={C.ink}>on the bottom axis, with concentration units</Txt>
      </g>
      <g opacity={fi(a('notrate'))}>
        <Txt x={1110} y={720} size={30} weight={800} fill={C.ink}>Vmax is used to get to it;</Txt>
        <Txt x={1110} y={762} size={30} weight={800} fill={C.ink}>Km is not a rate</Txt>
      </g>
    </g>
  );
}
