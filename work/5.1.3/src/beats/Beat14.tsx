/** Beat 14 · How it is asked, and the reject card. Forms surface beside the familiar wheel and per-cell graph (on from
 * the first frame); citations in small type; one authored reject card (our wording contrast); the hook callback. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel} from '../CellCycleWheel';
import {DNAContentGraph} from '../DNAContentGraph';
import {Ring, Glow} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {FormRow, formRowH, Caption, INK} from './kit';

const GOOD = '#1D6B40';
const ROWS = [
  ['which stage of interphase is DNA replicated in?', 'our framing of s23_21 Q4(b)(ii), 1 mark (QP p13 / MS p14)', 'r1'],
  ['circle the phase(s) of the cycle', 'our framing of m24_22 Q4(b), 1 mark (QP p15 / MS p11); both interphase and S phase circled for the mark (PDF-VERIFIED summary, A06)', 'r2'],
  ['DNA mass or chromatid numbers through the cycle', 's22_12 Q19 (key D); s21_12 Q18 (key C, 92/46/92 chromatids); s23_12 Q21 (key B); s24_12 Q19 (key D); keys PDF-VERIFIED; keys and demands re-checked against the PDFs (round-1 check); stems not quoted', 'r3'],
  ['the role of ATP in mitosis', 'w20_21 Q1(a)(iii), 2 marks (QP p2 / MS p6); MS “I ref. to replication or cytokinesis” (PDF-VERIFIED, A07)', 'r4'],
  ['apply supplied information to the S phase, G2 and chromatid state', 's24_23 Q5(c)(i–ii), 2 + 2 marks (QP p13 / MS pp9–10); demands and marking points PDF-VERIFIED (round-1 check), summarised, not quoted', 'forms'],
];
export default function Beat14(s: any) {
  const a = s.a;
  const FX = 70, FW = 800;
  let y = 214;
  const rows = ROWS.map(([t, c, k], i) => { const yy = y; y += formRowH(c, FW) + (i === 0 ? 30 : 10); return {t, c, k, y: yy}; });
  const card = fi(a('card'), 0.4), strike = fe(a('card') - 1.0, 0.8);
  const wrong = 'mitosis: the cell grows, replicates its DNA and divides in two';
  const right = 'mitosis is nuclear division; the mitotic cell cycle is interphase (G1, S, G2), mitosis and cytokinesis';
  const g3 = (d: number) => pulse(a('card') - 2.2 - d, 1.0);
  const hook = fi(a('hook'), 0.4);
  const HX = 910, HY = 790;
  return (
    <g>
      <CellCycleWheel cx={1090} cy={400} R={130} thick={42} small labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} bracket={1} caption={0} marker={1} pos={0.05}
        hi={{g2: pulse(s.local - 0.3, 1.4), s: Math.max(pulse(a('r1'), 1.4), pulse(a('copied'), 1.6)), m: Math.max(pulse(a('r4'), 1.4), g3(0.9), pulse(a('shared'), 1.2)), c: Math.max(g3(1.8), pulse(a('shared') - 0.9, 1.2))}}
        bracketHi={Math.max(pulse(a('r2'), 1.4), g3(0))} inset={{on: 1, cell: 1, nucleus: 1, rep: -1, cond: 0}} />
      <Ring cx={1090} cy={400} rx={175} ry={175} p={fe(a('r2'), 0.8)} opacity={1 - fi(a('r3'), 0.4)} />
      <DNAContentGraph x={1270} y={240} w={580} h={300} small pen={1.3} caption={1} hiRise={pulse(a('r3'), 1.6)} hiDrop={pulse(a('r3') - 0.8, 1.6)} />
      {rows.map((r, i) => <FormRow key={i} x={FX} y={r.y} w={FW} title={r.t} cite={r.c} a={a(r.k)} />)}
      <Txt x={FX + 20} y={rows[0].y + 104} size={15} weight={600} fill={C.muted} italic opacity={fi(a('r1b'), 0.4)}>S / synthesis phase credited; a bare 'S' ignored (PDF-VERIFIED summary, A05)</Txt>
      <Caption x={FX} y={908} size={14} maxW={FW} weight={600} fill={C.muted} text={'outline answers — Learner Guide PDF p15: “Detail is not required.” (PDF-VERIFIED, plan check A01): guidance for the exam answer, not for how fully we explain.'} />
      {card > 0 && <g opacity={card < 1 ? card : undefined}>
        <rect data-role="decor" x={910} y={580} width={940} height={180} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <Txt x={932} y={624} size={24} weight={800} fill={INK}>✗</Txt>
        <Txt x={964} y={624} size={22} weight={600} fill="#2B3A8C" italic>{wrong}</Txt>
        {strike > 0 && <path data-role="decor" d={`M964 616H${964 + (textW(wrong, 22, 600) + 8) * strike}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />}
        <g opacity={fi(a('card') - 1.6, 0.4)}>
          <Txt x={932} y={670} size={24} weight={800} fill={GOOD}>✓</Txt>
          <Caption x={964} y={670} size={22} maxW={860} weight={700} fill={GOOD} text={right} />
        </g>
        <Txt x={932} y={746} size={14} weight={600} fill={C.muted} italic>our wording contrast; not an examiner-reported error</Txt>
      </g>}
      {hook > 0 && <g opacity={hook < 1 ? hook : undefined}>
        <rect data-role="decor" x={HX} y={HY} width={540} height={140} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing">
          {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={HX + 20 + i * 50} y={HY + 70} width={46} height={48} rx={6} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />)}
          <rect x={HX + 120} y={HY + 22} width={46} height={48} rx={6} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />
          {[[HX + 143, HY + 94], [HX + 143, HY + 46]].map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r={13} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={2} />)}
        </g>
        {[[HX + 143, HY + 94], [HX + 143, HY + 46]].map((q, i) => <Glow key={'g' + i} cx={q[0]} cy={q[1]} r={24} a={fi(a('full'), 0.4)} />)}
        <Txt x={HX + 272} y={HY + 44} size={20} weight={800} fill={INK} opacity={fi(a('full'), 0.4)}>full genetic set in each</Txt>
        <Txt x={HX + 272} y={HY + 90} size={20} weight={600} fill={C.muted} italic>the hook: skin's deepest</Txt>
        <Txt x={HX + 272} y={HY + 114} size={20} weight={600} fill={C.muted} italic>layer (schematic)</Txt>
      </g>}
    </g>
  );
}
