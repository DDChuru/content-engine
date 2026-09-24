/** Beat 1 · Hook and context. Cell inset: one enzyme stops, a terracotta shape binds it (motion, schematic);
 * two number boxes; the RateGraph from L4b (no numbers); Km and Vmax fill the boxes. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Lines, InkRing, Tag} from '../shared/Type';
import {fi, fe, path} from '../util';
import {Axes, CurvePath, G} from '../RateGraph';
import {CellInset, Tablet, NumberBox, CELL_ENZ, STOPPED, Small} from './common';

const g: G = {x: 1250, y: 400, w: 560, h: 380, xmax: 100, ymax: 10};
const curve = {id: 'no-inhibitor', vmax: 8.2, km: 14};
export default function Beat01(s: any) {
  const {a, local} = s;
  const cx = 520, cy = 590, cs = 0.86;
  const [sx, sy] = CELL_ENZ[STOPPED];
  const target = [cx + (sx - 22) * cs, cy + (sy - 34) * cs];
  const tab = [160, 360];
  const [dx, dy] = path(a('binds'), [[0, tab[0] + 40, tab[1] + 10], [1.6, target[0] - 40, target[1] - 60], [2.4, target[0], target[1]]]);
  const graphIn = fe(a('graph'), 0.8);
  const redraw = a('redraw') > 0 ? clamp01(a('redraw') / 1.6) : 1;
  const drawP = a('redraw') > 0 ? redraw : clamp01(a('graph') / 1.4);
  return (
    <g>
      <Lines x={90} y={236} size={30} step={40} weight={700} fill={C.ink} opacity={fi(a('open'))}
        text={'Ever wondered how a tablet can switch off one enzyme in your body …'} />
      <Txt x={90} y={276} size={30} weight={700} fill={C.ink} opacity={fi(a('dim'))}>… and leave thousands of others running?</Txt>
      <CellInset x={cx} y={cy} s={cs} t={local} dim={clamp01(a('dim') / 1)} opacity={fi(a('tablet'))} />
      <Tablet x={tab[0]} y={tab[1]} opacity={fi(a('tablet'))} s={0.85} />
      {a('binds') > 0 && <circle cx={dx} cy={dy} r={11} fill={C.inhibitor} stroke={C.primary} strokeWidth={3} data-mol="drug" />}
      {a('binds') > 0 && <Small x={tab[0] - 50} y={tab[1] + 64} text="MODEL · schematic" opacity={fi(a('binds'))} />}
      <InkRing cx={target[0]} cy={target[1]} rx={30} ry={28} p={fe(a('vmax'), 0.6)} color={C.primary} />
      {/* the two numbers */}
      <g opacity={fi(a('boxes'))}>
        <Txt x={1000} y={424} size={20} weight={800} fill={C.muted} anchor="middle">two numbers</Txt>
        <NumberBox x={915} y={436} text="Km" fill={fi(a('km'), 0.5)} hi={Math.max(0, 1 - Math.abs(a('km') - 0.6) / 0.9) * (a('km') > 0 ? 1 : 0)} />
        <Small x={1000} y={568} text="compare enzymes" anchor="middle" opacity={fi(a('km'))} fill={C.teal} size={18} />
        <Small x={1000} y={724} text="what an inhibitor does" anchor="middle" opacity={fi(a('vmax'))} fill={C.primary} size={18} />
        <NumberBox x={915} y={590} text="Vmax" fill={fi(a('vmax'), 0.5)} hi={Math.max(0, 1 - Math.abs(a('vmax') - 0.6) / 0.9) * (a('vmax') > 0 ? 1 : 0)} />
      </g>
      {/* the graph they have already drawn */}
      <g opacity={graphIn} transform={`translate(${(1 - graphIn) * 120} 0)`}>
        <rect x={1140} y={330} width={730} height={560} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Tag x={1160} y={372} text="from L4b" size={19} bg="#EAF1F4" stroke={C.teal} fill={C.teal} />
        <Axes g={g} xLabel="substrate concentration" yLabel="initial rate" size={22} />
        <CurvePath g={g} c={curve} p={drawP} />
        <Small x={1160} y={872} text="our schematic; no values" />
      </g>
    </g>
  );
}
