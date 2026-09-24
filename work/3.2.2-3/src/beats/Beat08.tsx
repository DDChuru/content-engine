/** Beat 8 · Three enzymes, each from its own half-Vmax. Constructions in order Y, X, Z (narration order),
 * order strip X → Z → Y, Y's plateau + Km ringed, a ghost common horizontal flashed with ✗ and dissolved. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Cross} from '../shared/Type';
import {fi, fe, between} from '../util';
import {CurvePath, gx, gy} from '../RateGraph';
import {ThreeGraph, threeG, X, Y, Z} from './three';
import {Small} from './common';

const g = threeG(330, 250, 880, 500);
const P = (t: number, d = 0.7) => clamp01(t / d);
const pulse = (t: number) => (t > 0 && t < 1.8 ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
function Row({y, c, name, a0, a1, a2}: any) {
  return (
    <g>
      <Txt x={1340} y={y} size={28} weight={800} fill={c.color} opacity={fi(a0)}>{name}</Txt>
      <Txt x={1380} y={y} size={24} weight={700} fill={C.ink} opacity={fi(a0)}>Vmax {c.vmax}</Txt>
      <Txt x={1540} y={y} size={24} weight={700} fill={C.ink} opacity={fi(a1)}>→ ½ {c.vmax / 2}</Txt>
      <Txt x={1690} y={y} size={24} weight={800} fill={c.color} opacity={fi(a2)}>→ Km {c.km}</Txt>
    </g>
  );
}
export default function Beat08(s: any) {
  const {a} = s;
  const ghost = between(a('ghost'), a('ghost') - 2.6, 0.3);
  const pp = pulse(a('pulse'));
  return (
    <g>
      <g opacity={fi(a('reset'))}>
        <ThreeGraph g={g} curves={clamp01(a('reset') / 1.4)}
          con={{Y: [P(a('yv')), P(a('yh')), P(a('yk'))], X: [P(a('xv')), P(a('xh')), P(a('xk'))], Z: [P(a('zv')), P(a('zh')), P(a('zk'))]}}
          pulse={{Y: [0, pp, 0], X: [0, pp, 0], Z: [0, pp, 0]}} />
        {[['Y', Y, 0], ['X', X, 1.1], ['Z', Z, 2.2]].map(([n, c, d]: any) => (
          <CurvePath key={n} g={g} c={c} p={clamp01((a('trace') - d) / 0.9)} color={c.color} width={11} opacity={0.35 * (1 - clamp01((a('trace') - d - 1.3) / 0.4))} />
        ))}
        <Small x={g.x + 24} y={g.y - 20} text="our schematic, modelled on the form of S24/12 Q11; our values" />
        <InkRing cx={gx(g, 1500)} cy={gy(g, Y.vmax)} rx={130} ry={30} p={fe(a('ring'), 0.6) * (1 - fi(a('ghost') - 0.3))} color={Y.color} />
        <InkRing cx={gx(g, Y.km)} cy={g.y + g.h + 62} rx={34} ry={24} p={fe(a('ring') - 0.3, 0.6) * (1 - fi(a('ghost') - 0.3))} color={Y.color} />
        {/* the ghost common line: never drawn as method */}
        <g opacity={ghost}>
          <path d={`M${g.x} ${gy(g, 1250)}H${g.x + g.w}`} stroke={C.primary} strokeWidth={4} strokeDasharray="14 9" />
          <Cross x={g.x + g.w - 60} y={gy(g, 1250) - 30} s={18} />
          <Txt x={g.x + g.w - 100} y={gy(g, 1250) - 22} size={22} weight={800} fill={C.primary} anchor="end">not one line across all three</Txt>
        </g>
      </g>
      {/* the readings, as constructed */}
      <g opacity={fi(a('yv'))}>
        <Txt x={1340} y={300} size={20} weight={800} fill={C.muted}>EACH FROM ITS OWN PLATEAU</Txt>
        <Row y={360} c={Y} name="Y" a0={a('yv')} a1={a('yh')} a2={a('yk')} />
        <Row y={420} c={X} name="X" a0={a('xv')} a1={a('xh')} a2={a('xk')} />
        <Row y={480} c={Z} name="Z" a0={a('zv')} a1={a('zh')} a2={a('zk')} />
        <Small x={1340} y={516} text="rate: product per second · Km: µmol dm⁻³" />
      </g>
      <g opacity={fi(a('order'))}>
        <rect x={1320} y={570} width={530} height={150} rx={16} fill={C.white} stroke={C.teal} strokeWidth={3} />
        <Txt x={1345} y={612} size={20} weight={800} fill={C.teal}>LOWEST Km FIRST = HIGHEST AFFINITY FIRST</Txt>
        <Txt x={1345} y={676} size={36} weight={800} fill={C.ink}>
          <tspan fill={X.color}>X (100)</tspan> → <tspan fill={Z.color}>Z (200)</tspan> → <tspan fill={Y.color}>Y (400)</tspan>
        </Txt>
        <Small x={1345} y={704} text="highest affinity first" />
      </g>
      <g opacity={fi(a('ring'))}>
        <Txt x={1320} y={780} size={24} weight={800} fill={Y.color}>Y: highest Vmax, lowest affinity</Txt>
      </g>
      <g opacity={fi(a('pulse'))}>
        <Txt x={1320} y={830} size={22} weight={700} fill={C.ink}>each half line: half of its OWN maximum</Txt>
      </g>
    </g>
  );
}
