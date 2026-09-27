/** Beat 11 · Read the axis label first. Per-cell graph (ours) and the named variant per-nucleus beneath on the same time
 * axis; labelled replays in the wheel inset (new nuclei forming; the nucleus outline fading "earlier in mitosis"). */
import React from 'react';
import {Tag, Arrow, Txt} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel, M_EVENTS} from '../CellCycleWheel';
import {DNAContentGraph, graphGeom} from '../DNAContentGraph';
import {Ring} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {W, LONGPOS, ALL, GR} from './stage';

export default function Beat11(s: any) {
  const a = s.a;
  const G1 = {...GR, h: 330}, G2 = {x: GR.x, y: 640, w: GR.w, h: 270};
  const g1 = graphGeom(G1 as any), g2 = graphGeom(G2 as any);
  const pn = fe(a('pn'), 0.7);
  const pen2 = a('pn') < 0 ? 0 : a('earlier') < 0 ? 0.79 * fe(a('pn') - 0.6, 3.2) : a('nuclei') < 0 ? lerp(0.79, M_EVENTS.newNuclei - 0.001, fe(a('earlier'), 1.8)) : lerp(M_EVENTS.newNuclei, 1.3, fe(a('nuclei'), 2.5));
  const replayPos = a('pn') >= 0 && a('earlier') < 0 ? 0.79 * fe(a('pn') - 0.6, 3.2) : a('earlier') >= 0 && a('hatch') < 0 ? pen2 : 0.05;
  const decRep = a('earlier') >= 0 && a('hatch') < 0, fadeRep = a('hatch') >= 0;
  const ins: any = decRep ? {on: 1, cell: 1, rep: 1, sep: 1, dist: 1, align: 1, cond: 1, decond: fe(a('earlier'), 1.9), newNuc: fe(a('earlier'), 1.9)}
    : fadeRep ? {on: 1, cell: 1, rep: 1, cond: 0, nucleus: 1 - fe(a('hatch'), 2.5)}
    : {on: 1, cell: 1, nucleus: 1, cellGrow: 0.2, rep: -1, cond: 0};
  const xN = g2.gx(M_EVENTS.newNuclei), xC = g1.gx(1);
  return (
    <g>
      <CellCycleWheel {...W} longPos={LONGPOS} labels={ALL} bracket={1} caption={1} marker={1} pos={replayPos} inset={ins} />
      {(decRep || fadeRep) && <Tag x={W.cx} y={W.cy - 130} text={fadeRep ? 'earlier in mitosis' : 'replay: new nuclei form'} size={15} anchor="middle" bg="#EAF0F8" />}
      {a('pn') >= 0 && a('earlier') < 0 && <Tag x={W.cx} y={W.cy - 130} text="replay" size={15} anchor="middle" bg="#EAF0F8" />}
      <DNAContentGraph {...(G1 as any)} pen={1.3} caption={1} hiDrop={pulse(a('notcell'), 1.6)} />
      <Ring cx={G1.x + 22} cy={(g1.T + g1.B) / 2} rx={24} ry={165} p={fe(a('axis'), 0.7)} opacity={1 - fi(a('pn'), 0.4) * 0.6} />
      <Ring cx={G1.x + 22} cy={(g1.T + g1.B) / 2 - 90} rx={20} ry={40} p={pulse(a('cell'), 1.2) > 0 ? 1 : 0} opacity={pulse(a('cell'), 1.2)} />
      {pn > 0 && <g opacity={pn < 1 ? pn : undefined} transform={`translate(0 ${lerp(60, 0, pn)})`}>
        <DNAContentGraph {...(G2 as any)} variant="per-nucleus" pen={pen2} caption={1} hatch={fi(a('hatch'), 0.6)} hatchLabel={fi(a('hatch') - 0.3, 0.4)} />
        {pulse(a('hatch2'), 1.2) > 0 && <rect data-role="decor" x={g2.gx(M_EVENTS.nucleusGone)} y={g2.T} width={xN - g2.gx(M_EVENTS.nucleusGone)} height={g2.B - g2.T} fill={T5.ring} opacity={0.45 * pulse(a('hatch2'), 1.2)} />}
      </g>}
      {a('nuclei') >= 0 && <g opacity={fi(a('nuclei'), 0.3)}><line data-role="decor" x1={xN} y1={g2.gy(1)} x2={xN} y2={g1.gy(0)} stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="6 5" /></g>}
      {a('notcell') >= 0 && <g opacity={fi(a('notcell'), 0.4)}>
        <Ring cx={xC} cy={g1.gy(1.5)} rx={22} ry={46} />
        <Arrow x1={xN + 6} y1={g1.gy(0.4)} x2={xC - 6} y2={g1.gy(0.4)} color={T5.ringHalo} />
        <Arrow x1={xC - 6} y1={g1.gy(0.4)} x2={xN + 6} y2={g1.gy(0.4)} color={T5.ringHalo} />
        <Tag x={(xN + xC) / 2} y={g1.gy(0.4) - 26} text="same cell, different axis" size={17} anchor="middle" />
      </g>}
    </g>
  );
}
