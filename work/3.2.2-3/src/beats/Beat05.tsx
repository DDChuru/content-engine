/** Beat 5 · The construction: Vmax, half it, across, down. Worked example (our values match the S23/31 MS
 * reading): plateau 9.0 au → ½ × 9.0 = 4.5 au → across to the curve at the LOCKED point (18, 4.5) → down: 18. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag} from '../shared/Type';
import {fi, fe, between} from '../util';
import {Axes, CurvePath, G, gx, gy} from '../RateGraph';
import {LactaseGraph, LAC, lacG} from './lactase';
import {StepStrip, Small} from './common';

const g = lacG(300, 250, 1000, 470);
const g0: G = {x: 300, y: 250, w: 1000, h: 470, xmax: 100, ymax: 10};
export default function Beat05(s: any) {
  const {a} = s;
  const reset = fi(a('reset'), 0.5);
  const mx = a('across') > 0 ? gx(g, 18 * clamp01(a('across') / 1.6)) : g.x;
  const lit = a('steps') > 0 ? 1 + a('steps') / 0.5 : a('strip') > 0 ? 0 : 0;
  return (
    <g>
      {/* before the reset: the plain schematic from Beats 3–4 */}
      <g opacity={1 - reset}>
        <Axes g={g0} xLabel="substrate concentration / mmol dm⁻³" yLabel="initial rate / arbitrary units" />
        <CurvePath g={g0} c={{id: 'no-inhibitor', vmax: 8, km: 12}} />
      </g>
      <g opacity={reset}>
        <LactaseGraph g={g} v={clamp01(a('vline') / 0.9)} h={clamp01(a('hline') / 0.9)} k={clamp01(a('drop') / 0.9)} ring18={fe(a('read'), 0.5)} kmLabel={fi(a('km'))} />
        <CurvePath g={g} c={LAC} from={0.5} to={1} p={clamp01(a('plateau') / 0.8)} color={C.teal} width={11} opacity={0.4 * (1 - clamp01((a('plateau') - 4) / 0.5))} />
        <Tag x={g.x - 14} y={gy(g, 9) + 8} text="9.0" size={20} anchor="end" bg="#E7F1F5" stroke={C.teal} fill={C.teal} opacity={fi(a('plateau'))} />
        <Tag x={g.x - 14} y={gy(g, 4.5) + 8} text="4.5" size={20} anchor="end" bg="#E7F1F5" stroke={C.teal} fill={C.teal} opacity={fi(a('halve') - 0.4)} />
        {a('across') > 0 && <circle cx={mx} cy={gy(g, 4.5)} r={11} fill={C.white} stroke={C.teal} strokeWidth={4} />}
        <InkRing cx={gx(g, 18)} cy={gy(g, 4.5)} rx={24} ry={22} p={fe(a('across') - 1.6, 0.5)} color={C.teal} />
        <Small x={g.x + g.w} y={g.y - 16} text="our schematic; values chosen to match the MS reading" anchor="end" />
        {/* the working, as it arrives */}
        <g>
          <Txt x={1370} y={400} size={26} weight={800} fill={C.teal} opacity={fi(a('plateau'))}>plateau at 9.0 au</Txt>
          <Txt x={1370} y={440} size={26} weight={800} fill={C.ink} opacity={fi(a('plateau') + 0.2 - 0.6)}>Vmax = 9.0 au</Txt>
          <Txt x={1370} y={510} size={26} weight={800} fill={C.ink} opacity={fi(a('halve'))}>½ × 9.0 = 4.5 au</Txt>
          <Txt x={1370} y={550} size={22} weight={700} fill={C.muted} opacity={fi(a('hline'))}>½Vmax = 4.5 au</Txt>
          <Txt x={1370} y={620} size={26} weight={800} fill={C.ink} opacity={fi(a('across'))}>across to the curve</Txt>
          <Txt x={1370} y={680} size={26} weight={800} fill={C.ink} opacity={fi(a('drop'))}>down to the axis: 18</Txt>
          <Txt x={1370} y={750} size={30} weight={800} fill={C.teal} opacity={fi(a('km'))}>Km = 18 mmol dm⁻³</Txt>
        </g>
      </g>
      <g opacity={fi(a('strip'))}>
        <Small x={300} y={866} text="show the construction on the graph:" />
        <StepStrip x={620} y={834} lit={lit} size={26} />
      </g>
    </g>
  );
}
