/** Beat 8 · How it is asked, and the reject card. Forms at left (the syllabus outline row with the Learner Guide line;
 * the w22_13 Q20 row with the keyed exam answer shown first); the skin strip and marrow lineage stay at right from the
 * first frame; the red-cell callback on a panel labelled "beyond the mark scheme"; ONE authored reject card; 2 s hold. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {RBC} from '../StemCellLineage';
import {fi, fe, pulse} from '../util';
import {LineageBuilt, SkinBuilt, MIT, DIF} from './lin';
import {FormRow, formRowH, RejectCard, rejectSpan, SentenceStrip} from './kit';
import {SENT4} from './Beat04';

const WRONG = 'stem cells divide by differentiation';
const RIGHT = 'stem cells divide by mitosis; some of the daughter cells then differentiate';
export default function Beat08(s: any) {
  const a = s.a;
  const FX = 70, FW = 820;
  const T1 = 'outline the role of stem cells', c1 = 'syllabus 5.1.5, p.23';
  const T2 = 'stem cells in the base layer of the skin, paired with the Golgi body';
  const c2 = 'w22_13 Q20 (Paper 1), QP p10 / MS p2, key B, 1 mark; key and demand PDF-VERIFIED (plan check A09); stem, options and key PDF-VERIFIED (round-1 check); stem not reproduced';
  const y1 = 214, y2 = y1 + formRowH(c1, FW, T1) + 70;
  const RX = 930, RW = 920;
  const bm = a('beyond') >= 0;
  const cardY = 760;
  const sp = rejectSpan(RX, cardY, RW, WRONG, RIGHT, 'mitosis', 22), spD = rejectSpan(RX, cardY, RW, WRONG, RIGHT, 'differentiate', 22);
  const newRed = bm ? fe(a('bdiff'), 2.0) : 0;
  return (
    <g>
      {/* right: the familiar skin strip and marrow lineage, reduced, from the first frame */}
      <SkinBuilt x={1040} y={260} w={560} h={190} t={0.4} shed={0} fill={1} labels={0} arrows={0} hi={{base: Math.max(pulse(a('r2'), 1.6), a('r2') >= 0 ? 0.5 : 0)}} />
      <Txt x={1040} y={236} size={17} weight={800} fill={T5.ringHalo}>skin: base layer stem cells (schematic)</Txt>
      <g transform="translate(900 470) scale(0.5)"><LineageBuilt t={s.local} vesselX1={1850} hi={{mit: pulse(a('bmit'), 1.6), dif: pulse(a('bdiff'), 1.6)}} /></g>
      {newRed > 0 && newRed < 1 && <RBC x={900 + 0.5 * (650 + (1010 - 650) * newRed)} y={470 + 0.5 * 480 - Math.sin(Math.PI * newRed) * 16} r={14} />}
      {bm && <g opacity={fi(a('beyond'), 0.4)}>
        <rect data-role="decor" x={930} y={590} width={920} height={160} rx={14} fill="none" stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="8 6" />
        <Tag x={940} y={590} text="beyond the mark scheme" size={18} />
      </g>}
      {/* left: the forms */}
      <FormRow x={FX} y={y1} w={FW} title={T1} cite={c1} a={a('r1')} />
      {a('linked') >= 0 && <Txt x={FX + 20} y={y1 + formRowH(c1, FW, T1) + 26} size={15} weight={600} fill={C.muted} italic opacity={fi(a('linked'), 0.4)}>Learner Guide PDF p15, outline command: “Detail is not required.” (PDF-VERIFIED (plan check) A01); this governs exam answers, not the teaching</Txt>}
      <FormRow x={FX} y={y2} w={FW} title={T2} cite={c2} a={a('r2')} />
      {a('r2') >= 0 && <g opacity={fi(a('r2') - 0.4, 0.4)}>
        <rect data-role="decor" x={FX} y={y2 + formRowH(c2, FW, T2) + 12} width={FW} height={52} rx={10} fill="#F2FAF5" stroke={C.greenDark} strokeWidth={2} />
        <Txt x={FX + 20} y={y2 + formRowH(c2, FW, T2) + 46} size={22} weight={800} fill={C.greenDark}>exam answer · B: basal cells only; Golgi body</Txt>
      </g>}
      {a('golgi') >= 0 && <g opacity={fi(a('golgi'), 0.4)}>
        <g data-role="drawing" transform={`translate(${FX + 700} ${y2 + formRowH(c2, FW, T2) + 110})`}>
          {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-40 + i * 3} ${-18 + i * 12}C${-20} ${-28 + i * 12} ${20} ${-28 + i * 12} ${40 - i * 3} ${-18 + i * 12}`} fill="none" stroke={T5.ringHalo} strokeWidth={5} strokeLinecap="round" />)}
        </g>
        <Txt x={FX + 650} y={y2 + formRowH(c2, FW, T2) + 170} size={16} weight={700} fill={T5.ringHalo}>Golgi body · recall: 1.2.1</Txt>
      </g>}
      {a('linked') >= 0 && <SentenceStrip x={FX} y={800} w={FW} text={SENT4} shown={999} size={21} opacity={0.6 + 0.4 * pulse(a('linked'), 1.6)} />}
      <RejectCard x={RX} y={cardY} w={RW} wrong={WRONG} right={RIGHT} a={a('reject')} strikeAt={0.6} rightAt={1.2} />
      {sp && a('first') >= 0 && <rect data-role="decor" x={sp[0] - 4} y={sp[2] - 22} width={sp[1] - sp[0] + 8} height={30} rx={8} fill={MIT} opacity={0.35 * Math.max(0.5, pulse(a('first'), 1.2))} />}
      {spD && a('then') >= 0 && <rect data-role="decor" x={spD[0] - 4} y={spD[2] - 22} width={spD[1] - spD[0] + 8} height={30} rx={8} fill={DIF} opacity={0.35 * Math.max(0.5, pulse(a('then'), 1.2))} />}
    </g>
  );
}
