/** Beat 6 · E37 · COMMON MISTAKE (June 2023 ER p.26: "The most common error …"). Five moves: announce (marker from
 * the first frame) → the written answer beside a BARE graph → 4 s silent read → talk-through (number right, graph
 * bare; MS p.7, ER p.26, ECR p.10 tabs) → correction IN PLACE: vmax-line, half-line, km-drop drawn on the graph and
 * the "no working on the graph" tag struck. Marker clears 18 frames after "all three marks are on the page". */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag, Tick, textW, Under} from '../shared/Type';
import {fi, fe, between} from '../util';
import {QuestionCard, QuoteTab, AnswerCard, PEN} from '../Panels';
import {LactaseGraph, lacG} from './lactase';
import {Small} from './common';
import {gx, gy} from '../RateGraph';

const Q = 'Use the graph in Fig. 1.2 to estimate the Michaelis-Menten constant (Km) of lactase. Show your working on the graph in Fig. 1.2.';
const MS = '"1 shows Vmax on graph ; 2 shows ½ Vmax on graph ; 3 18 ;"';
const ER = '"The most common error was to calculate Km correctly showing the calculation\ninstead of showing how the figures for Vmax and ½ Vmax were obtained on the graph."';
const ECR = '"Some candidates gave ½ Vmax, but this is a stage in deriving Km."';
const g = lacG(270, 420, 600, 360);
export default function Beat06(s: any) {
  const {a} = s;
  const underX = 120 + textW(Q.slice(0, Q.indexOf('Show your working on the graph')), 22, 600);
  const tabMS = between(a('ms'), a('er'), 0.3), tabER = between(a('er'), a('stage'), 0.3), tabECR = between(a('stage'), a('draw') - 1.2, 0.3);
  const strike = clamp01((a('dk') - 0.7) / 0.4);
  const done = a('correct') > 0;
  return (
    <g>
      <QuestionCard x={90} y={190} w={1760} size={22} text={Q} cite="9700/31 June 2023 Q1(b)(ii), 3 marks · question paper p.9" opacity={fi(a('header'))} />
      <Under x={underX} y={268} w={textW('Show your working on the graph', 22, 600)} p={clamp01(a('said') / 0.7)} color={C.primary} />
      {/* our graph: bare until the correction */}
      <g opacity={fi(a('enter') - 0.6)}>
        <rect x={110} y={360} width={840} height={560} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <LactaseGraph g={g} size={18} v={clamp01(a('dv') / 0.5)} h={clamp01(a('dh') / 0.5)} k={clamp01(a('dk') / 0.7)} ring18={done ? 1 : 0} />
        <Small x={130} y={392} text="our schematic; the paper's Fig. 1.2 is not reproduced" />
        <Tag x={gx(g, 70)} y={gy(g, 5)} text="✗ no working on the graph" size={24} anchor="middle" fill={C.primary} stroke={C.primary} bg="#FFF4F0" opacity={fi(a('card')) * (1 - 0.5 * strike)} strike={strike} />
        <InkRing cx={gx(g, 60)} cy={gy(g, 5)} rx={330} ry={200} p={fe(a('graph'), 0.7) * (1 - fi(a('calc') - 1.5))} />
        <InkRing cx={gx(g, 60)} cy={gy(g, 5)} rx={336} ry={206} p={fe(a('er2'), 0.7) * (1 - fi(a('stage')))} />
      </g>
      {/* the written answer */}
      <AnswerCard x={1000} y={360} w={850} h={330} title="A WRITTEN ANSWER" note="illustrating the error the June 2023 report describes; not a transcript" opacity={fi(a('card'))} active={!done}>
        <Txt x={1040} y={448} size={34} weight={600} fill={PEN}>Vmax = 9 au</Txt>
        <Txt x={1040} y={494} size={34} weight={600} fill={PEN}>½ × 9 = 4.5 au</Txt>
        <Txt x={1040} y={540} size={34} weight={600} fill={PEN}>Km = 18 mmol dm⁻³</Txt>
        <Txt x={1040} y={640} size={28} weight={700} fill={C.ink}>Km =</Txt>
        <Txt x={1120} y={640} size={34} weight={600} fill={PEN}>18</Txt>
        <path d="M1110 648H1190" stroke={C.ink} strokeWidth={1.5} strokeDasharray="3 4" />
        <Txt x={1200} y={640} size={28} weight={700} fill={C.ink}>mmol dm⁻³</Txt>
        <InkRing cx={1140} cy={628} rx={34} ry={28} p={fe(a('num'), 0.5)} color={C.teal} />
        <Tick x={1200} y={590} s={14} opacity={fi(a('num') - 0.4)} />
        <g opacity={fi(a('calc'))}>
          <path d={`M1320 426H1338V548H1320`} fill="none" stroke={C.primary} strokeWidth={4} />
          <Txt x={1352} y={474} size={21} weight={800} fill={C.primary}>written beside the graph,</Txt>
          <Txt x={1352} y={500} size={21} weight={800} fill={C.primary}>not on it</Txt>
        </g>
        <Tag x={1352} y={546} text="arithmetic ≠ working on the graph" size={20} fill={C.primary} stroke={C.primary} bg="#FFF4F0" opacity={fi(a('arith'))} />
        <g opacity={fi(a('stage') + 0.3)}>
          <Tag x={1040} y={590} text="↑ 4.5 au: a stage, not the answer" size={20} fill={C.primary} stroke={C.primary} bg="#FFF4F0" opacity={between(a('stage'), a('draw'), 0.3)} />
        </g>
      </AnswerCard>
      {/* citation tabs, one slot, in turn */}
      <QuoteTab x={1000} y={716} w={850} size={22} quote={MS} source="9700/31 June 2023 mark scheme p.7 · 3 marks" opacity={tabMS}
        under={[[0, '1 shows Vmax on graph ;', clamp01(a('ms12') / 0.6)], [0, '2 shows ½ Vmax on graph ;', clamp01((a('ms12') - 0.5) / 0.6)]]} />
      <QuoteTab x={1000} y={716} w={850} size={20} quote={ER} source="June 2023 examiner report p.26" opacity={tabER}
        under={[[1, 'showing how the figures for Vmax and ½ Vmax were obtained on the graph', clamp01(a('er2') / 0.9)]]} />
      <QuoteTab x={1000} y={716} w={850} size={22} quote={ECR} source="ECR Paper 2 Q1, p.10" opacity={tabECR} />
      <g opacity={fi(a('correct'))}>
        <Txt x={1000} y={760} size={30} weight={800} fill={C.good}>✓ Vmax shown · ✓ ½Vmax shown · ✓ 18</Txt>
        <Txt x={1000} y={800} size={22} weight={700} fill={C.muted}>all three marks on the page</Txt>
      </g>
    </g>
  );
}
