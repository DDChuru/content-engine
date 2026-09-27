/** Beat 7 · What I told you, on the end you watched. No new slide: the built layout returns, static; key points fade
 * in in place (no new replication is animated). */
import React from 'react';
import {Tag, Txt, Arrow} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {TelomereEndModel, RoundCounter, telGeom, ENDS, GENES} from '../TelomereEndModel';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {CellCycleWheel} from '../CellCycleWheel';
import {Glow} from '../T5Annot';
import {fi, pulse} from '../util';
import {TP, StartGuide, EndTicks, LostBracket, RunLabel, Captions} from './tel';
import {SentenceStrip} from './kit';

const SENT = 'Written properly: telomeres are repeated non-coding DNA at chromosome ends. In typical dividing somatic cells, shortening during repeated replication initially removes telomeric DNA, protecting nearby genes.';
const K = (a: number) => fi(a, 0.5);
export default function Beat07(s: any) {
  const a = s.a;
  const P = {...TP, x: 560, len: 1180, y: 480};
  const g = telGeom(P);
  const X: any = {x: 260, y: 700, id: 'C1', cond: 1, rep: 1, scale: 0.8};
  const G = chromGeom(X);
  const ends = [G.sides[-1].top, G.sides[1].top, G.sides[1].bottom, G.sides[-1].bottom];
  const tick = [0, 1, 2].map((i) => K(a('ticks') - i * 0.7) * (1 - fi(a('lost'), 0.5)));
  const genes = K(a('genes'));
  return (
    <g>
      <CellCycleWheel cx={260} cy={390} R={110} thick={34} small labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} marker={0} lit={{s: 1}} hi={{s: K(a('s'))}} />
      <Txt x={260} y={540} size={15} weight={800} fill={T5.ringHalo} anchor="middle" opacity={0.6 + 0.4 * K(a('s'))}>S (synthesis) phase of interphase</Txt>
      {ends.map((q: number[], i: number) => <Glow key={i} cx={q[0]} cy={q[1]} r={24} a={K(a('ends'))} />)}
      <Chromosome {...X} />
      <TelomereEndModel {...P} end={ENDS[3]} hiGenes={genes} hiRun={K(a('what')) * (1 - fi(a('ends'), 0.5))} />
      <StartGuide p={P} />
      <EndTicks p={P} n={3} hi={tick} />
      <LostBracket p={P} hi={K(a('lost'))} />
      <RunLabel p={P} text="telomere: repeated, non-coding DNA" dy={-120} hi={K(a('what')) * (1 - fi(a('ends'), 0.5))} />
      <RoundCounter x={1580} y={220} value={3} hi={tick[2]} />
      <Tag x={1705} y={335} text="typical dividing somatic cells" size={16} anchor="middle" bg={K(a('typ')) > 0 ? '#FFD9CA' : '#FFFFFF'} />
      <Tag x={(g.X(0.3) + g.X(0.52)) / 2} y={P.y + 125} text="genes intact" size={20} anchor="middle" opacity={0.5 + 0.5 * genes} />
      {genes > 0 && <Arrow x1={g.X(0.88)} y1={P.y - 70} x2={g.X(0.42)} y2={P.y - 40} color={T5.ring} width={5} bend={-40} opacity={genes} />}
      <SentenceStrip x={560} y={700} w={1260} text={SENT} shown={SENT.length} size={24} label="written properly" />
      {genes > 0 && <rect data-role="decor" x={580} y={742} width={1220} height={32} rx={8} fill={T5.ring} opacity={0.3 * genes} />}
      <Captions x={560} y={900} compare={0} />
    </g>
  );
}
