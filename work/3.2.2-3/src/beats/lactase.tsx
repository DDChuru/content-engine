/** The worked example (Beats 5, 6, 17): our lactase-style curve, plateau 9.0 au, Km 18 mmol dm⁻³ (the S23/31 MS
 * reading), axes as S23/31 labels them. Values ours; the paper's Fig. 1.2 is never reproduced. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing} from '../shared/Type';
import {Axes, CurvePath, VmaxLine, HalfLine, KmDrop, G, gx, gy} from '../RateGraph';
export const LAC = {id: 'lactase', vmax: 9, km: 18};
export const lacG = (x: number, y: number, w: number, h: number): G => ({x, y, w, h, xmax: 120, ymax: 10});
/** v, h, k: progress of the three construction lines; ring18: ring on the axis reading; col: ink colour. */
export function LactaseGraph({g, v = 0, h = 0, k = 0, ring18 = 0, col = C.teal, curveP = 1, size = 20, kmLabel = 0, vLab = 'Vmax', hLab = '½Vmax', ringColor}: any) {
  return (
    <g data-graph="lactase">
      <Axes g={g} xLabel="concentration of lactose / mmol dm⁻³" yLabel="initial rate of reaction / au" xTicks={[0, 20, 40, 60, 80, 100, 120]} yTicks={[0, 2, 4, 6, 8, 10]} size={size} />
      <CurvePath g={g} c={LAC} p={curveP} width={4.5} />
      <VmaxLine g={g} c={LAC} p={v} color={col} label={vLab} size={size + 2} />
      <HalfLine g={g} c={LAC} p={h} color={col} label={hLab} size={size + 2} labelAt="axis" />
      <KmDrop g={g} c={LAC} p={k} color={col} size={size + 2} dot={h >= 1} />
      {ring18 > 0 && <InkRing cx={gx(g, 18)} cy={g.y + g.h + 24} rx={26} ry={22} p={clamp01(ring18)} color={ringColor ?? col} />}
      <g opacity={clamp01(kmLabel)}>
        <Txt x={gx(g, 18) + 16} y={gy(g, 1.6)} size={size + 6} weight={800} fill={col}>Km = 18 mmol dm⁻³</Txt>
      </g>
    </g>
  );
}
