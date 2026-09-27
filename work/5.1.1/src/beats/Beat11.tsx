/** Beat 11 · How it is asked, and the reject card. Forms surface beside the familiar C1 X (on from the first frame);
 * credited answer lines first; exact R/I lines in small type; one authored reject card (our wording contrast; struck
 * in ink — this lesson has no error marker, and terracotta is reserved for it). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {Ring, Leader, Tick, Label} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {FormRow, formRowH, Caption, INK} from './kit';
import {textW} from '../../shared/src/Type';

const GOOD = '#1D6B40';
export default function Beat11(s: any) {
  const a = s.a;
  const X: any = {x: 1480, y: 450, id: 'C1', cond: 1, rep: 1, scale: 1.35};
  const G = chromGeom(X);
  const FX = 80, FW = 960;
  const c1 = 's23_21 Q4(c)(i), QP p14 / MS p15; our framing of the question; 2 marks for A and B together';
  const c2 = 'w20_21 Q1(a)(i), 3 marks, QP p2 / MS p6; our framing; demand PDF-VERIFIED (round-1 check)';
  const c3 = 's20_12 Q19 (D) · s21_12 Q17 (C) · s23_12 Q20 (D, histone/DNA organisation); keys PDF-VERIFIED (plan check); stems and keys PDF-VERIFIED (round-1 check)';
  const y1 = 222, h1 = formRowH(c1, FW);
  const ya = y1 + h1 + 36;
  const y2 = 668, y3 = y2 + formRowH(c2, FW) + 12;
  const fn = 'function: holds the sister chromatids together';
  const fx = FX + 20, fnY = ya + 46;
  const sx0 = fx + textW('function: holds the ', 26, 700), sx1 = fx + textW('function: holds the sister chromatids', 26, 700);
  const card = fi(a('card'), 0.4), strike = fe(a('card') - 1.2, 0.9);
  const wrong = 'a chromosome after replication is two chromosomes';
  const right = 'after replication a chromosome is two sister chromatids joined at the centromere';
  return (
    <g>
      <Chromosome {...X} />
      <Label x={G.centromere[0] + 170} y={G.centromere[1] - 40} text="A" size={34} opacity={fi(a('row1'), 0.4)} />
      <Leader x1={G.centromere[0] + 162} y1={G.centromere[1] - 50} x2={G.centromere[0] + 8} y2={G.centromere[1] - 2} opacity={fi(a('row1'), 0.4)} />
      <Label x={G.sides[1].top[0] + 40} y={G.sides[1].top[1] + 30} text="sister chromatids" size={20} />
      <Ring cx={G.centromere[0]} cy={G.centromere[1] + 20} rx={120} ry={200} p={fe(a('hold'), 0.8)} opacity={1 - fe(a('reject'), 0.6)} />
      <Ring cx={G.centromere[0]} cy={G.centromere[1]} rx={36} ry={30} p={fe(a('one'), 0.6)} />
      <Txt x={G.centromere[0] - 110} y={G.centromere[1] + 16} size={46} weight={800} fill={INK} opacity={fi(a('one') - 0.5, 0.3)}>1</Txt>
      <FormRow x={FX} y={y1} w={FW} title="name and give the function of a labelled structure" cite={c1} a={a('row1')} />
      {/* credited answer lines land first and stay visible */}
      <g opacity={fi(a('answer'), 0.4)}>
        <rect data-role="decor" x={FX} y={ya} width={FW} height={260} rx={12} fill="#F2FAF5" stroke="#1D8A4E" strokeWidth={2} />
        <Txt x={fx} y={ya + 38} size={26} weight={700} fill={INK}>name: centromere</Txt>
        <Tick x={fx + 250} y={ya + 26} p={fe(a('name'), 0.4)} />
        <Txt x={fx} y={fnY + 26} size={26} weight={700} fill={INK}>{fn}</Txt>
        <Caption x={fx} y={fnY + 58} size={15} maxW={FW - 40} weight={600} fill={C.muted} text="Centromere: holds sister chromatids together — credited in s23_21 Q4(c)(i), MS p.15. This is one accepted function; attachment to the spindle is also accepted. “Daughter chromatids” is rejected for this function in this item; “kinetochore” is ignored as the name of A here. (PDF-VERIFIED (round-1 check))" />
        <Txt x={fx} y={ya + 206} size={16} weight={700} fill={INK} opacity={fi(a('mark'), 0.4)}>A: 1 mark (5.1.1); B, spindle fibres: 1 mark (5.2.1)</Txt>
        <Txt x={fx + 480} y={ya + 38} size={16} weight={600} fill={C.muted} italic opacity={fi(a('name'), 0.4)}>I “kinetochore” (naming A) · PDF-VERIFIED (plan check)</Txt>
        <Txt x={fx} y={ya + 240} size={16} weight={600} fill={C.muted} italic opacity={fi(a('reject'), 0.4)}>R “daughter chromatids” (the function answer) · MS p15 · PDF-VERIFIED (plan check)</Txt>
        {a('reject') >= 0 && <path data-role="decor" d={`M${sx0} ${fnY + 34}H${sx0 + (sx1 - sx0) * fe(a('reject'), 0.6)}`} stroke={T5.ring} strokeWidth={5} />}
      </g>
      <FormRow x={FX} y={y2} w={FW} title="complete a chromosome cloze" cite={c2} a={a('row2')} />
      <FormRow x={FX} y={y3} w={FW} title="multiple choice on chromosome structure" cite={c3} a={a('row3')} />
      <Txt x={FX} y={y3 + formRowH(c3, FW) + 22} size={15} weight={600} fill={C.muted} italic opacity={fi(a('row3') - 0.5, 0.4)}>counting chromatids is also asked: s21_12 Q18, key C (taught with the cycle, 5.1.3)</Txt>
      {card > 0 && <g opacity={card < 1 ? card : undefined}>
        <rect data-role="decor" x={1090} y={712} width={760} height={200} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <Txt x={1112} y={760} size={26} weight={800} fill={INK}>✗</Txt>
        <Txt x={1146} y={760} size={23} weight={600} fill="#2B3A8C" italic>{wrong}</Txt>
        {strike > 0 && <path data-role="decor" d={`M1146 752H${1146 + (textW(wrong, 23, 600) + 10) * strike}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />}
        <Txt x={1112} y={812} size={26} weight={800} fill={GOOD} opacity={fi(a('card') - 1.8, 0.4)}>✓</Txt>
        <Caption x={1146} y={812} size={23} maxW={680} weight={700} fill={GOOD} text={right} opacity={fi(a('card') - 1.8, 0.4)} />
        <Txt x={1112} y={896} size={15} weight={600} fill={C.muted} italic>our wording contrast; not an examiner-reported error</Txt>
      </g>}
    </g>
  );
}
