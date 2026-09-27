/** Beat 5 · Replicated: two sister chromatids. Schematic replication along the C1 molecule (progress marker, MOTION);
 * the per-chromosome label changes 1 → 2 DNA molecules ONLY on the completion frame. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom, HistoneFiber} from '../ChromosomeModel';
import {Ring, Label, Trace, Bracket} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {INK} from './kit';

export default function Beat05(s: any) {
  const a = s.a;
  const done = a('complete') >= 0;
  const rep = done ? 1 : a('build') < 0 ? -1 : Math.min(0.985, a('build') / 3.1);
  const P: any = {x: 1090, y: 640, id: 'C1', cond: 0, rep, rot: 90, scale: 2.65, wave: 0.22, hiGene: pulse(a('genes'), 1.2) + pulse(a('genes') - 1.3, 1.2)};
  const G = chromGeom(P);
  const sides = rep < 0 ? [0] : [-1, 1];
  const trace = (sd: number) => Array.from({length: 61}, (_, i) => G.sides[sd].at(i / 60));
  const lab = done ? '1 centromere · 2 DNA molecules' : '1 centromere · 1 DNA molecule';
  const labO = fi(a('copies'), 0.4);
  const insetRows = rep < 0 ? 1 : 2;
  return (
    <g>
      <Txt x={70} y={540} size={18} weight={600} fill={C.muted} italic>schematic · C1</Txt>
      <Chromosome {...P} />
      {/* per-chromosome label (not a cell count) */}
      {labO > 0 && <g opacity={labO < 1 ? labO : undefined}>
        <rect data-role="decor" x={1180} y={236} width={560} height={96} rx={12} fill="#FFFFFF" stroke={done && a('complete') < 1.2 ? T5.ring : '#D6CEBD'} strokeWidth={done && a('complete') < 1.2 ? 4 : 2} />
        <Txt x={1200} y={280} size={30} weight={800} fill={INK}>{lab}</Txt>
        <Txt x={1200} y={314} size={17} weight={600} fill={C.muted} italic>per chromosome, not a cell count</Txt>
        <Tag x={1600} y={370} text="replication complete" size={19} opacity={fi(a('complete'), 0.3)} anchor="middle" />
      </g>}
      {/* S-phase strip (recall tag) and the replication caption, on until the completed frame */}
      <g opacity={fi(a('sphase'), 0.4)}>
        <rect data-role="decor" x={300} y={440} width={820} height={48} rx={10} fill="#EAF0F8" stroke="#B3C9E7" strokeWidth={2} />
        <Txt x={318} y={473} size={22} weight={700} fill={INK}>{done ? 'S phase of interphase: replication complete (schematic)' : 'S phase of interphase: replication in progress (schematic)'}</Txt>
        <Tag x={1180} y={472} text="later: 5.1.3" size={17} bg="#FFF3EC" />
      </g>
      <Txt x={960} y={890} size={21} weight={600} fill={C.muted} italic anchor="middle" opacity={a('sphase') >= 0 && !done ? fi(a('sphase'), 0.4) : 0}>schematic account of replication during S; detailed replication in 6.1.4</Txt>
      {/* Z1 inset: DNA on histone beads; during replication a second row winds onto its own beads */}
      <g>
        <rect data-role="decor" x={80} y={236} width={560} height={insetRows === 1 ? 120 : 176} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g transform="translate(96 296) scale(0.4)"><HistoneFiber x={0} y={0} beads={6} gap={165} r={36} lead={90} /></g>
        {rep >= 0 && <g transform="translate(96 352) scale(0.4)"><HistoneFiber x={0} y={0} beads={6} gap={165} r={36} lead={90} wound={rep * 6} beadsShown={0.5 + rep * 6} /></g>}
        <Txt x={96} y={insetRows === 1 ? 344 : 400} size={16} weight={700} fill={INK}>{rep >= 1 ? 'Z1: each DNA molecule with its own histones' : 'Z1: DNA on histone beads'}</Txt>
      </g>
      <Ring cx={360} cy={330} rx={290} ry={70} p={fe(a('histones'), 0.7)} opacity={1 - fe(a('identical'), 0.5)} />
      {/* identical copies */}
      {done && [-1, 1].map((sd, i) => <Trace key={sd} pts={trace(sd)} p={fe(a('identical') - i * 0.5, 1.2)} width={4} opacity={between(a('identical'), a('identical') - 4.2)} />)}
      <Tag x={1090} y={800} text="identical: one is a copy of the other" size={22} anchor="middle" opacity={fi(a('identical') - 0.8, 0.4)} />
      {done && G.sides[-1].genes.map((q: number[], i: number) => { const r2 = G.sides[1].genes[i]; const o = fi(a('genes') - i * 0.5, 0.3); return o > 0 ? <line key={i} data-role="decor" x1={q[0]} y1={q[1] - 40} x2={r2[0]} y2={r2[1] + 40} stroke={T5.ring} strokeWidth={3} strokeDasharray="5 4" opacity={o} /> : null; })}
      {done && <Bracket x1={G.sides[-1].top[0] + 26} y1={G.sides[-1].top[1] - 4} x2={G.sides[1].top[0] + 26} y2={G.sides[1].top[1] + 4} side={1} depth={14} opacity={fi(a('sisters'), 0.4)} />}
      <Label x={1790} y={G.centromere[1] - 64} text="sister chromatids" size={26} anchor="end" opacity={fi(a('sisters'), 0.4)} />
      {done && <Label x={G.sides[1].at(0.85)[0]} y={G.sides[1].at(0.85)[1] + 58} text="chromatid" size={22} anchor="middle" opacity={fi(a('sisters') - 0.6, 0.4)} />}
      <Ring cx={G.centromere[0]} cy={G.centromere[1]} rx={46} ry={40} p={fe(a('cen'), 0.7)} />
      <Label x={G.centromere[0]} y={G.centromere[1] - 60} text="centromere" size={26} anchor="middle" opacity={fi(a('cen') - 0.2, 0.4)} />
    </g>
  );
}
