/** Why it is faster: activation energy. EnergyProfileGraph built cue by cue; endpoints fixed; token
 * climbs and slides back twice; catalysed curve from the SAME levels; brackets; reduction between peaks;
 * tall brackets dim; illustrative tokens (no numerical claim); reaction arrow thickens. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Lines, Arrow} from '../../shared/src/Type';
import {EnergyGraph, geom, humpPoint} from '../Graph';
import {fi, fe, pulse, between} from '../util';

export const G10 = {x: 230, y: 270, w: 1100, h: 540};
export default function Beat10(s: any) {
  const {a} = s;
  const g = geom(G10.x, G10.y, G10.w, G10.h);
  const v = {axes: fi(a('axes')), yl: fi(a('yl')), xl: fi(a('xl')), sub: fi(a('sub')), prod: fi(a('prod')),
    u: fe(a('hill'), 1.2), ea1: fe(a('ea1'), 0.7), c: fe(a('cat'), 1.2), ea2: fe(a('ea2'), 0.7), red: fe(a('red') + 0.3, 0.7),
    ring: between(a('red'), a('dim') + 0.8), dimTall: between(a('dim'), a('tokens'), 0.3)};
  const hi = {same: pulse(a('same'), 1.0) + pulse(a('same') - 1.0, 1.0), red: pulse(a('dim'), 1.2)};
  // one token climbs the high hill and slides back, twice
  const cl = a('climb');
  const tc = cl >= 0 && cl < 4 ? 0.42 * Math.sin(Math.PI * ((cl % 2) / 2)) : -1;
  const tok = tc >= 0 ? humpPoint(g, g.yu, tc) : null;
  // illustrative tokens: over the lower hill, more make it in a given time
  const tk = a('tokens');
  const stream = (pk: number, n: number, over: number, color: string, phase: number) => Array.from({length: n}, (_, i) => {
    const age = tk - i * 0.35 - phase;
    if (age < 0) return null;
    const goes = i < over, T = 2.2;
    const u = (age % T) / T;
    const t = goes ? u : 0.42 * Math.sin(Math.PI * u);
    const [x, y] = humpPoint(g, pk, t);
    return <circle key={i} cx={x} cy={y - 10} r={9} fill={color} stroke={C.ink} strokeWidth={1.5} />;
  });
  const rate = a('rate') >= 0 ? fe(a('rate'), 0.8) : 0;
  return (
    <g>
      <EnergyGraph {...G10} v={v} hi={hi} />
      {tok && <circle cx={tok[0]} cy={tok[1] - 11} r={11} fill={C.sub} stroke={C.subEdge} strokeWidth={2} />}
      <Txt x={g.x0} y={g.yr - 60} size={18} weight={700} fill={C.muted} opacity={between(a('climb'), a('cat'))}>a substrate particle: not enough energy to get over</Txt>
      {tk >= 0 && <g>
        {stream(g.yu, 6, 1, '#D5DBE2', 0)}
        {stream(g.yc, 6, 4, C.sub, 0.15)}
      </g>}
      <g opacity={fi(a('tokens'))}>
        <Lines x={1420} y={330} size={22} step={28} weight={800} text={'lower hill →\nmore get over it\nin a given time'} fill={C.teal} />
        <Txt x={1420} y={430} size={17} weight={600} fill={C.muted} italic>illustrative tokens; no numerical claim</Txt>
      </g>
      <g opacity={fi(a('rate'))}>
        <Txt x={1420} y={560} size={22} weight={800}>substrate</Txt>
        <Arrow x1={1540} y1={553} x2={1720} y2={553} color={C.primary} width={3 + 9 * rate} head={16 + 8 * rate} />
        <Txt x={1735} y={560} size={22} weight={800}>product</Txt>
        <Txt x={1420} y={604} size={26} weight={800} fill={C.primary}>rate goes up</Txt>
      </g>
      <Txt x={G10.x} y={915} size={16} weight={600} fill={C.muted} italic opacity={fi(a('axes'))}>modelled on the form of S21/12 Q13 (key B: the arrow between the two peaks); our axis is progress of reaction.</Txt>
    </g>
  );
}
