/** The bench: every object named where it sits, at its cue. Geography fixed for the lesson. */
import React from 'react';
import {BRAND as C} from '../../../shared/src/theme';
import {Bench} from '../Bench';
import {fi, fe} from '../util';

const ORDER = ['rack', 'label', 'syringe', 'dropper', 'bath', 'holder', 'tile', 'goggles', 'reagents', 'water'];

export default function Beat05(s: any) {
  const {a} = s;
  const show: Record<string, number> = {};
  const labels: Record<string, number> = {};
  for (const k of ORDER) { show[k] = fi(a(k), 0.5); labels[k] = fi(a(k) - 0.3, 0.4); }
  show.electric = show.bath; labels.electric = labels.bath;
  show.waste = show.water; labels.waste = labels.water;
  // current object glows until the next cue
  let glow = '';
  for (const k of ORDER) if (a(k) >= 0) glow = k;
  if (a('meet') >= 0) glow = '';
  if (glow === 'water') glow = 'waste';
  const lab = fe(a('label'), 1.0);
  const tubes = [0, 1, 2, 3].map((i) => ({id: 'b5' + i, k: undefined, level: 0, label: i === 0 && lab > 0.6 ? 'S' : undefined, glow: i === 0 && glow === 'label'}));
  const slide = (1 - fe(a('reagents'), 0.8)) * -120;
  return (
    <g>
      <Bench show={{...show, reagents: 0}} labels={{...labels, reagents: 0}} glow={glow} tubes={tubes} />
      {/* reagents slide in from the left, with the full-name legend and hazard pictograms */}
      <g transform={`translate(${slide} 0)`} opacity={show.reagents}>
        <Bench show={{reagents: 1}} labels={{reagents: labels.reagents}} reagentGlow={glow === 'waste' ? 'water' : ''} bare />
      </g>
      <Bench show={{}} legend={labels.reagents} bare />
    </g>
  );
}
Beat05.pin = () => '';
