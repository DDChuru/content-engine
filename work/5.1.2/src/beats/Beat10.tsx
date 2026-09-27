/** Beat 10 · How it is asked, and the reject card. Forms surface at left (citations in small type; the examples of
 * accepted points first and kept visible) beside the familiar IdenticalChain (on from the first frame); the growth and
 * repair panels beside rows 2 and 3; ONE authored reject card (our wording contrast); final frame held 2 s. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Ring} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {Panel, ChainThumb} from './strip';
import {FormRow, formRowH, RejectCard, rejectH, rejectSpan} from './kit';

const WRONG = 'the daughter cells are identical because each gets the same number of chromosomes';
const RIGHT = 'each daughter nucleus receives one copy of every chromosome, made by replication in the S phase of interphase: the same number and the same genetic information';
const CHK = 'question framings and summaries are our wording';
export default function Beat10(s: any) {
  const a = s.a;
  const FX = 70, FW = 820;
  const T1 = 'identify and explain two cell-cycle events that produce genetically identical daughter cells';
  const c1 = 'our framing of a real question · ' + CHK;
  const y1 = 214, y2 = y1 + formRowH(c1, FW, T1) + 150, c2 = 'a real multiple-choice item · ' + CHK, y3 = y2 + formRowH(c2, FW - 300, 'purpose of mitosis') + 16, c3 = 'a real multiple-choice item · ' + CHK;
  const RX = 940, RW = 910, RY = 600;
  const sp = rejectSpan(RX, RY, RW, WRONG, RIGHT, 'one copy of every chromosome');
  const ringA = a('ring');
  return (
    <g>
      <ChainThumb x={940} y={200} sc={0.5} hi={{l1: pulse(a('r1'), 1.6), l2: pulse(a('r1'), 1.6), l3: pulse(a('r1'), 1.6), cards: pulse(ringA, 1.4) + pulse(ringA - 1.4, 1.4)}} />
      <FormRow x={FX} y={y1} w={FW} title={T1} cite={c1} a={a('r1')} />
      {a('r1') >= 0 && <g opacity={fi(a('r1') - 0.4, 0.4)}>
        <Txt x={FX + 20} y={y1 + formRowH(c1, FW, T1) + 30} size={17} weight={800} fill={T5.ringHalo}>Examples of credit — alternatives, not a compulsory checklist</Txt>
        {['identical sister chromatids', 'alignment at the equator', 'distribution to opposite poles'].map((t, i) => <Tag key={i} x={FX + 20 + i * 270} y={y1 + formRowH(c1, FW, T1) + 70} text={t} size={18} />)}
        <Txt x={FX + 20} y={y1 + formRowH(c1, FW, T1) + 120} size={16} weight={700} fill={C.muted} italic opacity={fi(a('marks'), 0.4)}>3 marks, any three listed points</Txt>
      </g>}
      <FormRow x={FX} y={y2} w={FW - 300} title="purpose of mitosis" cite={c2} a={a('r2')} />
      <FormRow x={FX} y={y3} w={FW - 300} title="roles of mitosis in growth and repair" cite={c3} a={a('r3')} />
      {a('r2') >= 0 && <Panel k={0} r={{x: FX + FW - 280, y: y2, w: 280, h: 180}} st={{elong: 1, grow: 1}} op={fi(a('r2'), 0.4)} />}
      {a('r3') >= 0 && <Panel k={2} r={{x: FX + FW - 280, y: y2 + 190, w: 280, h: 180}} st={{fill: 1, diff: 1, shed: 0, t: 0.3}} op={fi(a('r3'), 0.4)} />}
      <RejectCard x={RX} y={RY} w={RW} wrong={WRONG} right={RIGHT} a={a('reject')} strikeAt={0.8} rightAt={1.5} />
      {sp && ringA >= 0 && <Ring cx={(sp[0] + sp[1]) / 2} cy={sp[2] - 8} rx={(sp[1] - sp[0]) / 2 + 14} ry={22} p={fe(ringA, 0.6)} />}
    </g>
  );
}
