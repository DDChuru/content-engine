/** Beat 3 · The curve, and Vmax from the plateau. RateGraph fills the frame (no values: our schematic);
 * axes read; t = 0 progress-curve recall inset; steep section, filling active sites (MODEL), plateau;
 * vmax-line; "Vmax (supplied)"; still-rising inset (S23/51 Q1(d)(iii)): its last point is NOT Vmax. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag} from '../shared/Type';
import {fi, fe, between, move} from '../util';
import {Axes, CurvePath, VmaxLine, G, gx, gy, rate, ProgressInset} from '../RateGraph';
import {Enzyme, Mol} from '../Enzyme';
import {Small} from './common';

const g: G = {x: 250, y: 250, w: 960, h: 560, xmax: 100, ymax: 10};
const c = {id: 'no-inhibitor', vmax: 8, km: 12};
const gi: G = {x: 1340, y: 650, w: 440, h: 190, xmax: 10, ymax: 12};
const ci = {id: 'rising', vmax: 14, km: 6};
export default function Beat03(s: any) {
  const {a} = s;
  const pulse = a('pulse') > 0 && a('pulse') < 2.2 ? 0.5 + 0.5 * Math.sin(a('pulse') * 7) : 0;
  const sup = between(a('supplied'), a('supplied') - 2.6, 0.3);
  return (
    <g>
      <g opacity={fi(a('graph'))}>
        <Axes g={g} xLabel="substrate concentration / mmol dm⁻³" yLabel="initial rate / arbitrary units" hiX={between(a('xlab'), a('xlab') - 3)} hiY={between(a('ylab'), a('ylab') - 3.5)} />
        <CurvePath g={g} c={c} p={clamp01(a('graph') / 1.2)} />
        <CurvePath g={g} c={c} from={0} to={0.22} p={clamp01(a('steep') / 1)} color={C.teal} width={10} opacity={0.55 * (1 - clamp01((a('steep') - 3) / 0.6))} />
        <CurvePath g={g} c={c} from={0.45} to={1} p={clamp01(a('plateau') / 1)} color={C.teal} width={10} opacity={0.55 * (a('pulse') > 0 ? 0.5 + pulse : 1) * (1 - clamp01((a('plateau') - 9) / 0.6))} />
        <VmaxLine g={g} c={c} p={clamp01(a('vmax') / 0.8)} noLabel pulse={pulse} />
        <g opacity={fi(a('vmax') - 0.5)}>
          <Txt x={g.x + 18} y={gy(g, c.vmax) - 14} size={28} weight={800} fill={C.teal} opacity={1 - sup}>Vmax</Txt>
          <Txt x={g.x + 18} y={gy(g, c.vmax) - 14} size={28} weight={800} fill={C.teal} opacity={sup}>Vmax (supplied)</Txt>
          <Small x={g.x + 250} y={gy(g, c.vmax) - 16} text="the value is given in the question" opacity={sup} />
          <Small x={g.x + 18} y={gy(g, c.vmax) + 30} text="from the plateau, or a supplied value" opacity={fi(a('supplied') - 2.8)} fill={C.teal} size={18} />
        </g>
        <Txt x={gx(g, 9)} y={gy(g, rate(c, 9)) + 70} size={21} weight={800} fill={C.teal} opacity={between(a('steep'), a('steep') - 3.4)}>steep rise at low substrate</Txt>
        <Txt x={gx(g, 70)} y={gy(g, c.vmax) + 60} size={21} weight={800} fill={C.teal} anchor="middle" opacity={between(a('plateau'), a('plateau') - 2.9)}>the curve levels off</Txt>
        <Small x={g.x} y={g.y + g.h + 110} text="our schematic; no values from any paper" />
      </g>
      <ProgressInset x={1320} y={250} w={320} h={170} opacity={between(a('inset'), a('inset') - 3.6)} />
      {/* three miniatures: active sites fill */}
      <g opacity={fi(a('fill')) * (1 - fi(a('rising') - 0.2))}>
        {[0, 1, 2].map((i) => {
          const ex = 1400 + i * 170, ey = 430;
          return (
            <g key={i}>
              <Enzyme x={ex} y={ey} s={0.38} />
              <Mol x={ex} y={ey} s={0.38} off={move(a('fill') - i * 0.35, 0.7, 150, 0)} />
            </g>
          );
        })}
        <Small x={1570} y={540} text="active sites filling (MODEL)" anchor="middle" />
      </g>
      {/* still rising: a different run, cut off */}
      <g opacity={fi(a('rising'))}>
        <rect x={1270} y={590} width={600} height={330} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
        <path d={`M${gi.x} ${gi.y - 10}V${gi.y + gi.h}H${gi.x + gi.w + 20}`} fill="none" stroke={C.ink} strokeWidth={2.5} />
        <CurvePath g={gi} c={ci} p={clamp01(a('rising') / 1)} width={4} />
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((S) => <circle key={S} cx={gx(gi, S)} cy={gy(gi, rate(ci, S))} r={5} fill={C.ink} opacity={fi(a('rising') - S * 0.08)} />)}
        <InkRing cx={gx(gi, 10)} cy={gy(gi, rate(ci, 10))} rx={22} ry={20} p={fe(a('rising') - 1.2, 0.5)} />
        <Tag x={gx(gi, 10) - 20} y={gi.y + 20} text="not Vmax; still rising" size={19} anchor="end" fill={C.primary} stroke={C.primary} opacity={fi(a('rising') - 1.5)} />
        <Small x={1290} y={620} text="another curve, cut off while rising" />
        <Small x={1290} y={905} text="S23/51 Q1(d)(iii): the graph has not plateaued" />
      </g>
    </g>
  );
}
