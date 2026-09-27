/** Beat 5 · Round after round, a shorter end. Each round the daughter molecule grows along the template from the gene
 * end and stops short (MOTION); the template fades and the daughter slides into its place; end ticks; the counter
 * counts replication rounds. No block is ever detached. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {TelomereEndModel, RoundCounter, telGeom, ENDS} from '../TelomereEndModel';
import {Ring, Label} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {TP, StartGuide, EndTicks, LostBracket, RunLabel, GeneRings, Captions} from './tel';

export default function Beat05(s: any) {
  const a = s.a, t = s.local;
  const at = (k: string) => t - a(k);
  // round schedule: [grow start, grow end, swap start]
  const R = [
    [at('grow1'), at('stop1') + 0.3, at('swap1')],
    [at('grow2'), at('stop2') + 0.3, at('stop2') + 1.1],
    [at('r3') + 0.2, at('r3') + 2.8, at('r3') + 3.4],
  ];
  let end = ENDS[0], grow = 0, stop = ENDS[1], swap = 0, round = a('copy') >= 0 ? 0 : -1, ticks = 0;
  for (let r = 0; r < 3; r++) {
    const [g0, g1, s0] = R[r];
    if (t < g0) break;
    round = r + 1; stop = ENDS[r + 1];
    grow = Math.min(1, (t - g0) / (g1 - g0));
    if (t >= s0) { swap = Math.min(1, (t - s0) / 1.2); if (swap >= 1) { end = ENDS[r + 1]; grow = 0; swap = 0; ticks = r + 1; } }
    else { swap = 0; }
    if (swap > 0) ticks = r;
  }
  const g = telGeom(TP);
  const gapRing = a('stop1') >= 0 && a('swap1') < 0;
  return (
    <g>
      <TelomereEndModel {...TP} end={end} grow={grow} stop={stop} swap={swap} />
      <RunLabel text="telomere: repeated, non-coding DNA" dy={-120} />
      <Label x={TP.x - 20} y={TP.y + 8} text={round <= 0 || swap < 1 ? 'parent molecule' : ''} size={18} anchor="end" opacity={a('copy') >= 0 && round === 0 ? fi(a('copy'), 0.4) : 0} />
      {grow > 0 && <Label x={TP.x - 20} y={TP.y + TP.copyGap + 8 - TP.copyGap * swap} text="daughter molecule" size={18} anchor="end" />}
      {grow > 0 && swap === 0 && <Label x={TP.x - 20} y={TP.y + 8} text="template" size={18} anchor="end" />}
      <StartGuide opacity={fi(a('end'), 0.4)} />
      <EndTicks n={ticks} />
      {gapRing && <Ring cx={(g.X(ENDS[1]) + g.X(1)) / 2} cy={TP.y + TP.copyGap / 2} rx={(g.X(1) - g.X(ENDS[1])) / 2 + 30} ry={70} p={fe(a('stop1') - 0.3, 0.6)} />}
      <RoundCounter x={1570} y={220} value={Math.max(0, round)} opacity={fi(a('copy'), 0.4)} />
      <Tag x={1695} y={335} text="typical dividing somatic cells" size={16} anchor="middle" opacity={fi(a('r3'), 0.4)} />
      <Captions y={880} opacity={fi(a('end'), 0.4)} />
      <Txt x={200} y={840} size={15} weight={600} fill={C.muted} italic opacity={fi(a('swap1'), 0.4)}>why the very tip is hard to copy: beyond this outline (general replication: 6.1.4)</Txt>
      {pulse(a('r3') - 3.8, 1.2) > 0 && <rect data-role="decor" x={195} y={872} width={420} height={36} rx={8} fill={T5.ring} opacity={0.4 * pulse(a('r3') - 3.8, 1.2)} />}
      <LostBracket opacity={fi(a('lost'), 0.4)} />
      <GeneRings pr={[fe(a('genes'), 0.5), fe(a('genes') - 0.3, 0.5)]} />
      <Tag x={(g.X(0.3) + g.X(0.52)) / 2} y={TP.y + 130} text="genes intact" size={20} anchor="middle" opacity={fi(a('genes') - 0.6, 0.4)} />
      {a('maintain') >= 0 && <g opacity={fi(a('maintain'), 0.4)}>
        <rect data-role="decor" x={1250} y={680} width={560} height={130} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Txt x={1270} y={712} size={20} weight={800} fill={T5.ringHalo}>some cells maintain their telomeres</Txt>
        <g data-role="drawing"><rect x={1270} y={740} width={360} height={18} rx={6} fill={T5.telomere} stroke={T5.telomereEdge} strokeWidth={1.5} /></g>
        <Txt x={1650} y={757} size={18} weight={800} fill={T5.ringHalo}>rounds: {1 + Math.min(2, Math.floor(Math.max(0, a('maintain') - 0.8) / 0.8))}</Txt>
        <Txt x={1270} y={794} size={14} weight={600} fill={C.muted} italic>how: not needed here</Txt>
      </g>}
    </g>
  );
}
