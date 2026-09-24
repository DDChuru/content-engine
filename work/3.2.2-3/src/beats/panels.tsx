/** Compact versions of the Beat 11 (competitive) and Beat 12 (non-competitive) panels, reused by Beats 14 and 15. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, Card, Tag} from '../shared/Type';
import {Enzyme, Mol} from '../Enzyme';
import {VmaxLine, HalfLine, KmDrop, G, gx, gy} from '../RateGraph';
import {NONE, COMP, NONC, CurvePath} from './inhib';
import {Axes} from '../RateGraph';

const pulseV = (t: number) => (t > 0 && t < 1.8 ? 0.5 + 0.5 * Math.sin(t * 8) : 0);
export {pulseV};
/** kind 'comp' | 'nonc'. pm: model pulse; pv/ph: construction pulses; pl: label pulse. */
export function MiniPanel({x, y, w = 860, h = 300, kind, pm = 0, pv = 0, ph = 0, pl = 0, opacity = 1, showNone = true}: any) {
  if (opacity <= 0) return null;
  const inh = kind === 'comp' ? COMP : NONC;
  const g: G = {x: x + 420, y: y + 60, w: 380, h: 170, xmax: 240, ymax: 10};
  return (
    <g opacity={opacity < 1 ? opacity : undefined} data-panel={kind}>
      <Card x={x} y={y} w={w} h={h} />
      <Txt x={x + 22} y={y + 36} size={22} weight={800}>{kind === 'comp' ? 'competitive' : 'non-competitive'}</Txt>
      {kind === 'nonc' && <Txt x={x + 22} y={y + 60} size={15} weight={700} fill={inh.color}>simplified non-competitive model</Txt>}
      {pm > 0 && <circle cx={x + 190} cy={y + 170} r={112} fill={C.teal} opacity={0.12 * pm} />}
      <Enzyme x={x + 190} y={y + 175} s={0.55} distort={kind === 'nonc' ? 1 : 0} />
      <Mol x={x + 190} y={y + 175} s={0.55} kind={kind === 'comp' ? 'comp' : 'noncomp'} off={0} />
      <Txt x={x + 190} y={y + h - 14} size={15} weight={700} fill={C.muted} anchor="middle">MODEL · schematic</Txt>
      <Axes g={g} xLabel="substrate concentration" yLabel="initial rate" size={15} />
      <CurvePath g={g} c={NONE} color={NONE.color} width={3.5} />
      <CurvePath g={g} c={inh} color={inh.color} width={3.5} />
      <VmaxLine g={g} c={NONE} noLabel color={C.ink} pulse={pv} />
      {kind === 'nonc' && <VmaxLine g={g} c={NONC} noLabel color={NONC.color} />}
      <HalfLine g={g} c={NONE} noLabel color={C.ink} pulse={ph} />
      <KmDrop g={g} c={NONE} color={C.ink} pulse={ph} />
      {kind === 'comp' && <><KmDrop g={g} c={COMP} color={COMP.color} /></>}
      {kind === 'nonc' && <><HalfLine g={g} c={NONC} noLabel color={NONC.color} /><KmDrop g={g} c={NONC} color={NONC.color} /></>}
      <g opacity={1}>
        {pl > 0 && <rect x={g.x + 190} y={g.y + (kind === 'comp' ? 84 : 110)} width={180} height={58} rx={10} fill={C.teal} opacity={0.16 * pl} />}
        <Txt x={g.x + 200} y={g.y + (kind === 'comp' ? 106 : 132)} size={17} weight={800} fill={inh.color}>{kind === 'comp' ? 'Vmax unchanged' : 'Vmax decreased'}</Txt>
        <Txt x={g.x + 200} y={g.y + (kind === 'comp' ? 130 : 156)} size={17} weight={800} fill={inh.color}>{kind === 'comp' ? 'Km increased' : 'Km unchanged'}</Txt>
      </g>
    </g>
  );
}
