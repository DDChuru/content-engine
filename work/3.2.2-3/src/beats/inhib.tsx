/** Shared inhibitor-comparison graph (Beats 11–15): the same enzyme, no inhibitor / competitive / non-competitive.
 * No numbers asserted (CHECK value audit): competitive shares the plateau (Vmax unchanged) with a larger Km;
 * non-competitive (simplified model) has a lower plateau with the SAME Km. Each curve its own half-line. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt} from '../shared/Type';
import {Axes, CurvePath, G} from '../RateGraph';
export const NONE = {id: 'no-inhibitor', vmax: 8, km: 20, color: C.ink};
export const COMP = {id: 'competitive', vmax: 8, km: 45, color: '#C0602E'};
export const NONC = {id: 'non-competitive', vmax: 4.4, km: 20, color: '#7A4FA0'};
export const inhG = (x: number, y: number, w: number, h: number): G => ({x, y, w, h, xmax: 240, ymax: 10});
export function InhAxes({g, size = 20}: any) {
  return <Axes g={g} xLabel="substrate concentration / mmol dm⁻³" yLabel="initial rate / arbitrary units" size={size} xLabelDy={32} />;
}
export function CurveLabel({g, c, text, dy = -12, opacity = 1, size = 20, x}: any) {
  return <Txt x={x ?? g.x + g.w - 6} y={g.y + g.h - (c.vmax / g.ymax) * g.h + dy} size={size} weight={800} fill={c.color} anchor="end" opacity={opacity}>{text}</Txt>;
}
export {CurvePath};
