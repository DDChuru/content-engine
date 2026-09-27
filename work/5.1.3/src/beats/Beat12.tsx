/** Beat 12 · E5-02 (EXAM CONTRAST, the scheme's ignore line). Two faults: the marker clears only when both are replaced
 * and the card reads the completed answer (Lesson ERROR_BEATS[12], clearKey 'fix2' = end of "to opposite poles"). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, InkRing, Underline, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel} from '../CellCycleWheel';
import {Chromosome} from '../ChromosomeModel';
import {Label} from '../T5Annot';
import {fi, fe, lerp, pulse, between} from '../util';
import {QHeader, Written, span, SideNote, QuoteTab, Strike, GOOD} from '../Panels';
import {Caption, typed, INK} from './kit';

const WRONG = 'ATP supplies energy for DNA replication and for cytokinesis.';
const R1 = 'ATP supplies energy for spindle formation';
const R2 = ' and for movement of daughter chromosomes to opposite poles.';
export default function Beat12(s: any) {
  const a = s.a;
  const PX = 850, PW = 1000, WS = 30, cy = 480, cx0 = PX + 24;
  const done = a('fix2') >= 0;
  const wheelLit = fi(a('wheel'), 0.5);
  const r1 = span(cx0, WRONG, WRONG.indexOf('DNA replication'), WRONG.indexOf('DNA replication') + 15, WS);
  const r2 = span(cx0, WRONG, WRONG.indexOf('cytokinesis'), WRONG.indexOf('cytokinesis') + 11, WS);
  const zero = pulse(a('zero'), 1.2);
  const fix = a('fix') >= 0;
  const header = 'Describe the role of ATP in mitosis.';
  const hx = PX + 22 + textW('Describe the role of ATP in ', 27, 700);
  const right = a('fix1') < 0 ? '' : a('move') < 0 ? typed(R1, a('fix1') + 0.4, 30) : R1 + (done ? R2 : typed(R2, a('move'), (R2.length - 2) / Math.max(0.5, a('move') - a('fix2'))));
  const mini = fi(a('inside'), 0.5);
  const MX = 1660, MY = 780;
  const sep = a('move') >= 0 ? 1 : 0;
  const tab = fi(a('tab'), 0.4);
  const tabQ = 'w20_21 Q1(a)(iii), MS p6: “I ref. to replication or cytokinesis”';
  return (
    <g>
      <g opacity={lerp(0.4, 1, wheelLit)}>
        <CellCycleWheel cx={390} cy={560} R={190} thick={54} labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} bracket={1} marker={1} pos={0.85}
          outline={{m: Math.max(fi(a('scope'), 0.4), pulse(a('inside'), 1.2))}} grey={{s: fi(a('outS'), 0.4), c: fi(a('outC'), 0.4)}}
          inset={{on: 1, cell: 1, rep: 1, cond: 1, align: 1, poles: 1, fibres: 0, equator: 1}} />
      </g>
      <Tag x={390} y={270} text="the question's scope: M" size={18} anchor="middle" opacity={fi(a('scope'), 0.4)} />
      <Tag x={530} y={860} text="outside M" size={16} anchor="middle" opacity={fi(a('outS'), 0.4)} />
      <Tag x={470} y={320} text="outside M" size={16} anchor="middle" opacity={fi(a('outC'), 0.4)} />
      <Caption x={PX} y={214} size={15} maxW={PW} weight={600} fill={C.muted} text="basis: a real question; no examiner report on how often; the scheme's ignore line. w20_21 Q1(a)(iii), QP p2 / MS p6; 2 marks, any two credited points" />
      <QHeader x={PX} y={250} w={PW} label="OUR FRAMING" text={header} size={27} opacity={fi(a('q'), 0.4)} src="our framing of w20_21 Q1(a)(iii); the paper's command word is suggest (PDF-VERIFIED, round-1 check)"
        hi={a('scope') >= 0 ? <Underline x1={hx} x2={hx + textW('mitosis', 27, 700)} y={250 + 44 + 27 + 8} p={fe(a('scope'), 0.5)} color={T5.ring} /> : null} />
      <g opacity={fi(a('card'), 0.4)}>
        <rect data-role="decor" x={PX} y={cy - 50} width={PW} height={fix ? 160 : 90} rx={12} fill="#FFFFFF" stroke="#C9BFA8" strokeWidth={2} />
        <g opacity={done ? 1 - fi(a('fix2'), 0.3) * 0.75 : 1}><Written x={cx0} y={cy} text={WRONG} size={WS} /></g>
        <Txt x={PX + PW - 14} y={cy - 58} size={15} weight={600} fill={C.muted} anchor="end" italic>our composite; not a transcript</Txt>
      </g>
      <InkRing cx={(r1[0] + r1[1]) / 2} cy={cy - 10} rx={(r1[1] - r1[0]) / 2 + 12} ry={26 + 4 * zero} p={fe(a('ring1'), 0.6)} opacity={fix ? 1 - fi(a('fix1'), 0.4) : 1} />
      <InkRing cx={(r2[0] + r2[1]) / 2} cy={cy - 10} rx={(r2[1] - r2[0]) / 2 + 12} ry={26 + 4 * zero} p={fe(a('ring2'), 0.6)} opacity={fix ? 1 - fi(a('move'), 0.4) : 1} />
      {a('fix1') >= 0 && <Strike x1={r1[0]} x2={r1[1]} y={cy - 10} p={fe(a('fix1'), 0.5)} />}
      {a('move') >= 0 && <Strike x1={r2[0]} x2={r2[1]} y={cy - 10} p={fe(a('move'), 0.5)} />}
      {right && <g>
        <Txt x={cx0} y={cy + 56} size={WS} weight={800} fill={GOOD}>✓</Txt>
        <Caption x={cx0 + WS * 1.05} y={cy + 56} size={27} maxW={PW - 80} weight={600} fill={GOOD} text={right} />
      </g>}
      <Txt x={PX} y={cy + 140} size={15} weight={600} fill={C.muted} italic opacity={fi(a('fix2'), 0.4)}>Lesson model answer; all its points are supported by W20/21 Q1(a)(iii), MS p6; maximum two marks.</Txt>
      <SideNote x={PX} y={620} text="both use energy; both are in the cycle" size={22} color={INK} opacity={between(a('energy'), a('tab'))} />
      {tab > 0 && <g opacity={tab < 1 ? tab : undefined}>
        <QuoteTab x={PX} y={640} w={640} size={20} quote={tabQ} source="PDF-VERIFIED (plan check A07)" accent />
        <Underline x1={PX + 18 + textW('w20_21 Q1(a)(iii), MS p6: “', 20, 600)} x2={PX + 18 + textW(tabQ, 20, 600)} y={640 + 36} p={fe(a('ign'), 0.6)} color={T5.ring} />
      </g>}
      {a('bound') >= 0 && <g opacity={fi(a('bound'), 0.4)}>
        <rect data-role="decor" x={PX} y={750} width={640} height={70} rx={10} fill="#EAF0F8" stroke="#B3C9E7" strokeWidth={2} />
        <Caption x={PX + 16} y={778} size={18} maxW={610} weight={700} text="ignore line: local to this question; it does not say ATP is unused in replication or cytokinesis" />
      </g>}
      <SideNote x={PX} y={870} text="0 credited points here" size={22} color={INK} opacity={between(a('zero'), a('fix'))} />
      {/* the M inset, enlarged beside the card */}
      {mini > 0 && <g opacity={mini < 1 ? mini : undefined}>
        <rect data-role="decor" x={MX - 170} y={MY - 150} width={340} height={300} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} />
        <g data-role="drawing">
          <line x1={MX} y1={MY - 120} x2={MX} y2={MY + 120} stroke={T5.spindle} strokeWidth={2} strokeDasharray="7 6" opacity={1 - fe(a('move'), 1.2)} />
          {[-1, 1].map((sd) => <circle key={sd} cx={MX + sd * 140} cy={MY} r={8} fill={T5.centriole} />)}
          {[-1, 1].map((sd) => { const f = fe(a('fix1'), 1.6); const d = fe(a('move'), 2.2) * 100; const ex = MX + sd * (6 + d); return f > 0 ? [-12, 0, 12].map((dy, j) => <line key={sd + '' + j} x1={MX + sd * 140} y1={MY} x2={lerp(MX + sd * 140, ex, f)} y2={MY + dy * f} stroke={T5.spindle} strokeWidth={2} />) : null; })}
        </g>
        <Chromosome x={MX} y={MY} id="C1" cond={1} rep={1} sep={sep} dist={fe(a('move'), 2.2) * 100 / 0.62} trail={sep} scale={0.62} />
        {sep > 0 && [-1, 1].map((sd) => <Label key={sd} x={MX + sd * 80} y={MY - 118} text="daughter chromosome" size={14} anchor="middle" />)}
        <Txt x={MX} y={MY + 142} size={14} weight={600} fill={C.muted} anchor="middle" italic>M inset, enlarged (schematic)</Txt>
      </g>}
    </g>
  );
}
