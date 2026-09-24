/** The three-enzyme comparison (Beats 8, 9, 15): our values, modelled on the FORM of S24/12 Q11 (not its numbers).
 * X Vmax 1500 Km 100 · Z Vmax 600 Km 200 · Y Vmax 2500 Km 400 (product per second; µmol dm⁻³), one linear scale.
 * Initial steepness X > Y > Z; affinity order X, Z, Y (key B). Each Km from its OWN ½Vmax; locked points. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt} from '../shared/Type';
import {Axes, CurvePath, VmaxLine, HalfLine, KmDrop, G, gx, gy} from '../RateGraph';
export const X = {id: 'enzyme-X', vmax: 1500, km: 100, color: '#2E8B6E'};
export const Y = {id: 'enzyme-Y', vmax: 2500, km: 400, color: '#7A4FA0'};
export const Z = {id: 'enzyme-Z', vmax: 600, km: 200, color: '#B8741A'};
export const ENZ = {X, Y, Z};
export const threeG = (x: number, y: number, w: number, h: number): G => ({x, y, w, h, xmax: 2000, ymax: 3000});
/** con: per-enzyme [v, h, k] progress; curves: draw progress; pulse: per-enzyme [v,h,k] pulses. */
export function ThreeGraph({g, curves = 1, con = {}, pulse = {}, size = 20, labels = 1, readings = true, curveOpacity = {}, hideTicks = false}: any) {
  const list: [string, any][] = [['Y', Y], ['X', X], ['Z', Z]];
  return (
    <g data-graph="three-enzymes">
      <Axes g={g} xLabel="substrate concentration / µmol dm⁻³" yLabel="rate of reaction / product per second" xTicks={hideTicks ? [] : [0, 500, 1000, 1500, 2000]} yTicks={hideTicks ? [] : [0, 500, 1000, 1500, 2000, 2500, 3000]} size={size} xLabelDy={30} />
      {list.map(([n, c]) => <CurvePath key={n} g={g} c={c} p={typeof curves === 'number' ? curves : curves[n] ?? 0} color={c.color} width={4.5} opacity={curveOpacity[n] ?? 1} />)}
      {list.map(([n, c]) => <Txt key={'l' + n} x={g.x + g.w + 12} y={gy(g, c.vmax) + (n === 'Z' ? 26 : 8)} size={size + 4} weight={800} fill={c.color} opacity={clamp01(labels) * (curveOpacity[n] ?? 1)}>{n}</Txt>)}
      {list.map(([n, c]) => {
        const [v, h, k] = con[n] ?? [0, 0, 0], [pv, ph, pk] = pulse[n] ?? [0, 0, 0];
        return (
          <g key={'c' + n}>
            <VmaxLine g={g} c={c} p={v} color={c.color} noLabel pulse={pv} />
            <HalfLine g={g} c={c} p={h} color={c.color} noLabel pulse={ph} />
            <KmDrop g={g} c={c} p={k} color={c.color} pulse={pk} label={readings ? String(c.km) : undefined} labelDy={30} size={size} />
          </g>
        );
      })}
    </g>
  );
}
