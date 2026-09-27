/** Beat 10 · E5-01 (EXAM CONTRAST). Five moves: announce (badge on; basis line) → written wrong answer (our composite)
 * → 4 s silent read (digital silence) → talk-through with cue-synced rings, seen/copied split, graph trace, tabs →
 * correction in place; the marker clears on the completed correct frame (Lesson ERROR_BEATS[10], clearKey 'done'). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, InkRing, Underline, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel, ARCS} from '../CellCycleWheel';
import {DNAContentGraph, graphGeom} from '../DNAContentGraph';
import {Chromosome} from '../ChromosomeModel';
import {fi, fe, lerp, pulse, between} from '../util';
import {QHeader, Written, span, SideNote, QuoteTab, Strike, PEN, GOOD} from '../Panels';
import {Caption, typed, INK} from './kit';

const WRONG = 'DNA is replicated in prophase, when the chromosomes appear.';
const RIGHT = 'DNA is replicated during the S (synthesis) phase of interphase.';
export default function Beat10(s: any) {
  const a = s.a;
  const done = a('done') >= 0;
  const PX = 850, PW = 1000, WS = 30;
  const dimW = 1 - 0.6 * (1 - Math.max(fi(a('graph'), 0.4) * (1 - fi(a('condense'), 0.4)), done ? fi(a('done'), 0.4) : 0));
  const G = {x: 80, y: 640, w: 700, h: 250, small: true};
  const gg = graphGeom(G as any);
  const dot = fe(a('doubled'), 2.2);
  const cy = 470, cx0 = PX + 24;
  const r1 = span(cx0, WRONG, WRONG.indexOf('prophase'), WRONG.indexOf('prophase') + 8, WS);
  const r2 = span(cx0, WRONG, WRONG.indexOf('appear'), WRONG.indexOf('appear') + 6, WS);
  const fix = a('fix') >= 0;
  const s1 = span(cx0, WRONG, WRONG.indexOf('in prophase'), WRONG.indexOf('in prophase') + 11, WS);
  const s2 = span(cx0, WRONG, WRONG.indexOf('when'), WRONG.length - 1, WS);
  const header = 'In which stage of the cell cycle is DNA replicated?';
  const hw = textW('In which stage of the cell cycle is DNA ', 27, 700);
  const tabs = fi(a('tabs'), 0.4);
  return (
    <g>
      {/* familiar models, held at left, dimmed */}
      <g opacity={dimW}>
        <CellCycleWheel cx={300} cy={420} R={125} thick={40} small labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} bracket={1} marker={1} pos={0.05}
          lit={{s: done ? fi(a('done'), 0.3) : 0}} inset={{on: 1, nucleus: 1, cell: 1, rep: -1, cond: 0}} />
        <DNAContentGraph {...G} pen={1.12} caption={1} hiRise={done ? fi(a('done'), 0.3) : 0} />
      </g>
      {dot > 0 && dot < 1.01 && a('condense') < 0 && <circle data-role="decor" cx={lerp(gg.gx(ARCS.s[0]), gg.gx(ARCS.s[1]), dot)} cy={lerp(gg.gy(1), gg.gy(2), dot)} r={10} fill={T5.ring} stroke={T5.ringHalo} strokeWidth={3} />}
      {a('doubled') >= 0 && a('condense') < 0 && <rect data-role="decor" x={gg.gx(ARCS.m[0])} y={gg.gy(2) - 8} width={gg.gx(ARCS.m[1]) - gg.gx(ARCS.m[0])} height={16} rx={6} fill={T5.ring} opacity={0.6 * fi(a('doubled') - 1.5, 0.4)} />}
      {/* the panel */}
      <Caption x={PX} y={214} size={15} maxW={PW} weight={600} fill={C.muted} text="basis: a real question; no examiner report on how often. s23_21 Q4(b)(ii), QP p13 / MS p14, and m24_22 Q4(b), QP p15 / MS p11; PDF-VERIFIED summaries (plan check A05, A06)" />
      <QHeader x={PX} y={250} w={PW} label="OUR FRAMING" text={header} size={27} opacity={fi(a('q'), 0.4)}
        src={'our framing of the demand in s23_21 Q4(b)(ii) (a named stage of interphase) and m24_22 Q4(b) (six supplied event labels to circle);\nnot the papers’ wording or layout; demands PDF-VERIFIED (round-1 check)'}
        hi={a('where') >= 0 ? <Underline x1={PX + 22 + hw} x2={PX + 22 + hw + textW('replicated', 27, 700)} y={250 + 44 + 27 + 8} p={fe(a('where'), 0.5)} color={T5.ring} /> : null} />
      <g opacity={fi(a('card'), 0.4)}>
        <rect data-role="decor" x={PX} y={cy - 50} width={PW} height={fix ? 140 : 90} rx={12} fill="#FFFFFF" stroke="#C9BFA8" strokeWidth={2} />
        <g opacity={done ? 1 - fi(a('done'), 0.3) * 0.75 : 1}><Written x={cx0} y={cy} text={WRONG} size={WS} /></g>
        <Txt x={PX + PW - 14} y={cy - 58} size={15} weight={600} fill={C.muted} anchor="end" italic>our composite; not a transcript</Txt>
      </g>
      <InkRing cx={(r1[0] + r1[1]) / 2} cy={cy - 10} rx={(r1[1] - r1[0]) / 2 + 12} ry={26} p={fe(a('ring1'), 0.6)} opacity={fix ? 1 - fi(a('fix'), 0.4) : 1} />
      <InkRing cx={(r2[0] + r2[1]) / 2} cy={cy - 10} rx={(r2[1] - r2[0]) / 2 + 12} ry={26} p={fe(a('ring2'), 0.6)} opacity={fix ? 1 - fi(a('fix'), 0.4) : 1} />
      {fix && <><Strike x1={s1[0]} x2={s1[1]} y={cy - 10} p={fe(a('fix'), 0.6)} /><Strike x1={s2[0]} x2={s2[1]} y={cy - 10} p={fe(a('fix') - 0.5, 0.8)} /></>}
      {fix && <g>
        <Txt x={cx0} y={cy + 60} size={WS} weight={800} fill={GOOD} opacity={done ? 1 : fi(a('fix') - 1, 0.3)}>✓</Txt>
        <Txt x={cx0 + WS * 1.05} y={cy + 60} size={WS} weight={600} fill={GOOD} italic>{done ? RIGHT : typed(RIGHT, a('fix') - 1.2, (RIGHT.length - 4) / Math.max(1, (a('fix') - a('done')) - 1.4))}</Txt>
      </g>}
      {/* talk-through: first SEEN in prophase (a condensing X), seen vs copied */}
      {between(a('seen'), a('tabs')) > 0 && <g opacity={between(a('seen'), a('tabs'))}>
        <rect data-role="decor" x={PX} y={600} width={300} height={200} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Chromosome x={PX + 150} y={700} id="C1" cond={fe(a('seen'), 2.4)} rep={1} scale={0.42} />
        <Txt x={PX + 150} y={790} size={14} weight={600} fill={C.muted} anchor="middle" italic>replay: mitosis (condensing)</Txt>
        <SideNote x={PX + 150} y={630} text="first SEEN here" size={20} anchor="middle" color={INK} />
      </g>}
      {between(a('split'), a('tabs')) > 0 && <g opacity={between(a('split'), a('tabs'))}>
        <rect data-role="decor" x={PX + 320} y={600} width={330} height={200} rx={12} fill={pulse(a('condense'), 1.2) > 0 ? '#FFF3EC' : '#FFFFFF'} stroke="#D6CEBD" strokeWidth={2} />
        <Txt x={PX + 485} y={640} size={22} weight={800} fill={INK} anchor="middle">seen (condenses)</Txt>
        <Txt x={PX + 485} y={670} size={22} weight={700} fill={INK} anchor="middle">mitosis</Txt>
        <rect data-role="decor" x={PX + 670} y={600} width={330} height={200} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Txt x={PX + 835} y={640} size={22} weight={800} fill={INK} anchor="middle">copied (replicated)</Txt>
        <Txt x={PX + 835} y={670} size={22} weight={700} fill={INK} anchor="middle">S phase</Txt>
        {a('earlier') >= 0 && <g opacity={fi(a('earlier'), 0.4)}><Chromosome x={PX + 835} y={740} id="C1" cond={0} rep={1} rot={90} scale={0.42} wave={0.5} /><Txt x={PX + 835} y={792} size={14} weight={600} fill={C.muted} anchor="middle" italic>G2: replicated, long and thin</Txt></g>}
      </g>}
      {tabs > 0 && <g opacity={tabs < 1 ? tabs : undefined}>
        <QuoteTab x={PX} y={600} w={485} size={18} quote={'s23_21 Q4(b)(ii): which stage of interphase;\n1 mark for S / synthesis phase; a bare ‘S’ ignored'} source="PDF-VERIFIED summary; not the scheme's wording" />
        <QuoteTab x={PX + 505} y={600} w={495} size={18} quote={'m24_22 Q4(b): 1 mark requires circling\nboth interphase and S phase'} source="PDF-VERIFIED summary; not the scheme's wording" />
        <Underline x1={PX + 18 + textW('1 mark for S / synthesis phase; ', 18, 600)} x2={PX + 18 + textW('1 mark for S / synthesis phase; a bare ‘S’ ignored', 18, 600)} y={600 + 30 + 23.4 + 6} p={fe(a('bare'), 0.5)} color={T5.ring} />
        <Underline x1={PX + 523} x2={PX + 523 + textW('both interphase and S phase', 18, 600)} y={600 + 30 + 23.4 + 6} p={fe(a('both'), 0.5)} color={T5.ring} />
        <Txt x={PX} y={760} size={15} weight={600} fill={C.muted} italic>G05: "Locate replication in S phase of interphase" (G05's summary)</Txt>
      </g>}
    </g>
  );
}
