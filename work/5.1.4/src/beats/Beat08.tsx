/** Beat 8 · How it is asked, and the reject card. The model (reduced, real state) stays at right from the first frame;
 * forms at left with credited answers first; the hook magnifier returns; the authored reject card, struck in ink. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Arrow, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {TelomereEndModel, telGeom, ENDS} from '../TelomereEndModel';
import {Chromosome} from '../ChromosomeModel';
import {Tick} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {TP, StartGuide, EndTicks, LostBracket, RunLabel, CAPTION} from './tel';
import {FormRow, formRowH, Caption, INK} from './kit';

const GOOD = '#1D6B40';
export default function Beat08(s: any) {
  const a = s.a;
  const P = {...TP, x: 1000, len: 800, y: 330, amp: 14, copyGap: 50};
  const g = telGeom(P);
  const FX = 70, FW = 880;
  const r1 = 's21_22 Q1(b), part D: 1 mark of a 4-mark cloze (QP p3 / MS p8); parts A–C are Topic 6';
  const r2 = 's21_12 Q19, QP p7 / MS p2, key A';
  const r3 = 'S22/12 Q18, QP p7 / MS p2, key A (PDF-VERIFIED (round-1 check))';
  let y = 300;
  const y1 = y; y += formRowH(r1, FW) + 40;
  const y2 = y; y += formRowH(r2, FW) + 10;
  const y3 = y;
  const tick = [0, 1, 2].map(() => pulse(a('ticks'), 1.6));
  const hook = fi(a('hook'), 0.4);
  const card = fi(a('card'), 0.4), strike = fe(a('card') - 0.4, 0.8);
  const wrong = 'telomeres stop the DNA getting shorter';
  const right = 'In typical dividing somatic cells, telomeres can shorten over repeated replication; initially, telomeric DNA is lost rather than nearby genes.';
  const arrow = Math.max(fi(a('link'), 0.4) * (1 - fi(a('row1'), 0.4)), fi(a('genes'), 0.4));
  return (
    <g>
      <TelomereEndModel {...P} end={ENDS[3]} hiRun={pulse(a('rep'), 1.6)} hiGenes={Math.max(fi(a('genes'), 0.4), 0)} />
      <StartGuide p={P} />
      <EndTicks p={P} n={3} hi={tick} />
      <LostBracket p={P} hi={pulse(a('copy'), 1.6)} />
      <Txt x={1000} y={560} size={16} weight={700} fill={T5.ringHalo} italic>{CAPTION}</Txt>
      {arrow > 0 && <Arrow x1={g.X(0.88)} y1={P.y - 60} x2={g.X(0.42)} y2={P.y - 30} color={T5.ring} width={4} bend={-30} opacity={arrow} />}
      {a('link') >= 0 && <g opacity={fi(a('link'), 0.4)}>
        <rect data-role="decor" x={1000} y={590} width={850} height={82} rx={10} fill="#FFFFFF" stroke={C.teal} strokeWidth={2} />
        <Caption x={1016} y={616} size={16} maxW={820} text="Written properly: telomeres are repeated non-coding DNA at chromosome ends. In typical dividing somatic cells, shortening during repeated replication initially removes telomeric DNA, protecting nearby genes." />
        <Txt x={1000} y={692} size={14} weight={600} fill={C.muted} italic>our note: short, but the link from telomeric shortening to nearby genes kept is the answer</Txt>
      </g>}
      <Tag x={FX} y={242} text="outline" size={24} opacity={fi(a('outline'), 0.4)} />
      <Txt x={FX + 130} y={250} size={15} weight={600} fill={C.muted} italic opacity={fi(a('outline'), 0.4)}>Learner Guide PDF p15: “Detail is not required.” — PDF-VERIFIED (plan check)</Txt>
      <FormRow x={FX} y={y1} w={FW} title="cloze: name the structure" cite={r1} a={a('row1')} />
      <Txt x={FX + 20} y={y1 + formRowH(r1, FW) + 22} size={14} weight={600} fill={C.muted} italic opacity={fi(a('rep'), 0.4)}>PDF-VERIFIED in round-one check; displayed wording is our paraphrase</Txt>
      {a('ans') >= 0 && <g opacity={fi(a('ans'), 0.4)}><Txt x={FX + FW - 190} y={y1 + 38} size={26} weight={800} fill={GOOD}>telomeres</Txt><Tick x={FX + FW - 30} y={y1 + 28} p={fe(a('ans'), 0.5)} /></g>}
      <FormRow x={FX} y={y2} w={FW} title="MCQ: telomeres after more divisions" cite={r2} a={a('row2')} />
      <g opacity={fi(a('row3'), 0.4)}>
        <rect data-role="decor" x={FX} y={y3} width={FW} height={104} rx={12} fill="#F2FAF5" stroke="#1D8A4E" strokeWidth={2} />
        <Txt x={FX + 20} y={y3 + 38} size={24} weight={700} fill={INK} italic>If telomeres become too short, a cell may stop dividing.</Txt>
        <Txt x={FX + 20} y={y3 + 64} size={15} weight={600} fill={C.muted} italic>{r3}</Txt>
        <Txt x={FX + 20} y={y3 + 88} size={15} weight={600} fill={C.muted} italic>maintained telomere length in stem and cancer cells is supplied context in the question</Txt>
      </g>
      <Txt x={FX} y={y3 + 126} size={14} weight={600} fill={C.muted} italic opacity={fi(a('row3'), 0.4)}>Question-demand summaries are our paraphrases; the row-3 answer sentence is Cambridge's exact option-A wording.</Txt>
      {hook > 0 && <g opacity={hook < 1 ? hook : undefined}>
        <rect data-role="decor" x={FX} y={800} width={FW} height={140} rx={12} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Chromosome x={FX + 60} y={870} id="C1" cond={1} rep={-1} scale={0.55} />
        <defs><clipPath id="mag8"><circle cx={FX + 260} cy={870} r={56} /></clipPath></defs>
        <g data-role="drawing"><circle cx={FX + 260} cy={870} r={60} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={3} /></g>
        <g clipPath="url(#mag8)"><TelomereEndModel x={FX + 305 - 420} y={858} len={420} amp={8} copyGap={26} grow={fe(a('copy'), 1.4)} stop={0.93} /></g>
        <Txt x={FX + 340} y={860} size={16} weight={700} fill={T5.ringHalo} italic>{CAPTION}</Txt>
        <Txt x={FX + 340} y={886} size={14} weight={600} fill={C.muted} italic>the hook: copying leaves a shorter telomere; nearby genes intact</Txt>
      </g>}
      {card > 0 && <g opacity={card < 1 ? card : undefined}>
        <rect data-role="decor" x={1000} y={730} width={850} height={206} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <Txt x={1020} y={772} size={24} weight={800} fill={INK}>✗</Txt>
        <Txt x={1052} y={772} size={22} weight={600} fill="#2B3A8C" italic>{wrong}</Txt>
        {strike > 0 && <path data-role="decor" d={`M1052 764H${1052 + (textW(wrong, 22, 600) + 8) * strike}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />}
        <Txt x={1020} y={814} size={24} weight={800} fill={GOOD}>✓</Txt>
        <Caption x={1052} y={814} size={21} maxW={780} weight={700} fill={GOOD} text={right} />
        <Txt x={1020} y={900} size={14} weight={600} fill={C.muted} italic>our wording contrast; not an examiner-reported error</Txt>
        <Txt x={1020} y={922} size={14} weight={600} fill={C.muted} italic>basis: plan 5.1.4 reject card; no telomere reject line or examiner report is held</Txt>
      </g>}
    </g>
  );
}
