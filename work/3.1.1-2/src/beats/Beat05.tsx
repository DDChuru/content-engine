/** E32 · five moves · COMMON MISTAKE (ECR Paper 2 Q1 comment D lists the ex- terms; W20/21 MS credits
 * "extracellular"). Announce → written card → 3 s silent read → talk-through with synced highlights →
 * correction IN PLACE. The four ex- words appear only inside the quoted report; none is voiced. Marker from
 * the first frame to the exit cue (end of "not where"). */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Arrow, Underline, textW} from '../../shared/src/Type';
import {QHeader, Written, span, QuoteTab, quoteSpan, SideNote, Strike, PEN} from '../Panels';
import {CellScene} from './Beat04';
import {fi, fe, between} from '../util';

const Q1 = `"D. Terms with the prefix 'ex' were given, such as 'extrinsic', 'external cellular',\n'exocellular' and 'exocytosis'. 'Catalysts' was also given as an incorrect response."`;
const Q2 = `"macromolecule and extracellular enzyme ;"`;
const WRONG = 'exocellular enzyme', RIGHT = 'extracellular enzyme';
const PX = 740, PW = 1110;

export default function Beat05(s: any) {
  const {a, k, at} = s;
  const cf = k - Math.ceil(at.correct * 30 - 1e-9);
  const strike = clamp01(cf / 9), repl = clamp01((cf - 9) / 9);
  const corrected = cf >= 18;
  const cardY = 420, ws = 50;
  const [p0, p1] = span(PX + 30, WRONG, 0, 3, ws);
  const q1y = 560, q2y = 700;
  const cat = quoteSpan(PX, q1y, Q1, 1, Q1.split('\n')[1].indexOf("'Catalysts'"), Q1.split('\n')[1].indexOf("'Catalysts'") + 11);
  const replayAge = a('replay') >= 0 ? (a('replay') % 3.2) : -1;
  return (
    <g>
      {/* the Beat 4 cell, dimmed, at left */}
      <g transform="translate(40 190) scale(0.4)">
        <CellScene a={a} showAll dim={0.55} glowOut={fe(a('correct') - 0.4, 0.4)} />
      </g>
      {replayAge >= 0 && a('cite') < 0 && <g transform="translate(40 190) scale(0.4)" opacity={0.6}>
        <CellScene a={() => -1e9} secrete={replayAge} dim={0} />
      </g>}
      <Txt x={60} y={560} size={20} weight={700} fill={C.muted} opacity={fi(a('announce'))}>from Beat 4: the cell</Txt>
      <g opacity={fi(a('announce'), 0.4)}>
        <QHeader x={PX} y={200} w={PW} label="THE QUESTION · our framing" size={27} opacity={fi(a('header'))}
          text={'the term for an enzyme that is secreted and catalyses reactions outside cells'}
          src={'Our framing of June 2016 Paper 22 Q1; question reproduced in ECR Paper 2 p.7; examiner comment quoted from p.10.'} />
      </g>
      {/* the written answer card */}
      <g opacity={fi(a('show'), 0.3)}>
        <rect x={PX} y={cardY - 70} width={700} height={112} rx={14} fill={C.white} stroke={corrected ? '#1D8A4E' : C.primary} strokeWidth={4} />
        <Txt x={PX + 22} y={cardY - 44} size={16} weight={800} fill={C.muted}>A WRITTEN ANSWER</Txt>
        {!corrected && <Written x={PX + 30} y={cardY + 12} text={WRONG} size={ws} opacity={1 - repl} />}
        {a('prefix') >= 0 && !corrected && <Underline x1={p0} x2={p1} y={cardY + 22} p={fe(a('prefix'), 0.5)} width={5} />}
        {strike > 0 && !corrected && <Strike x1={p0 - 4} x2={p1 + 4} y={cardY - 4} p={strike} />}
        {repl > 0 && <Written x={PX + 30} y={cardY + 12} text={RIGHT} size={ws} ok opacity={repl} />}
      </g>
      <SideNote x={PX + 730} y={cardY - 10} text="ex- = out" opacity={between(a('exout'), a('replay'))} />
      {/* ghost word: leaving blurs into where */}
      <g opacity={between(a('ghost'), a('cite'), 0.4)}>
        <Txt x={PX + 760} y={cardY + 80} size={34} weight={600} fill={C.muted} italic>exocytosis</Txt>
        <Txt x={PX + 760} y={cardY + 108} size={17} weight={700} fill={C.muted}>the word for LEAVING the cell</Txt>
        <Arrow x1={PX + 750} y1={cardY + 70} x2={(p0 + p1) / 2} y2={cardY + 34} color={C.primary} width={3} head={12} bend={40} opacity={fi(a('ghost') - 0.4)} />
      </g>
      {/* the examiners' list */}
      <QuoteTab x={PX} y={q1y} w={PW} quote={Q1} source="ECR Paper 2 Q1, p.10 (examiner comment)" size={20} opacity={fi(a('cite'))}>
        {a('catalyst') >= 0 && <Underline x1={cat.x0} x2={cat.x1} y={cat.y} p={fe(a('catalyst'), 0.5)} width={4} />}
      </QuoteTab>
      <QuoteTab x={PX} y={q2y} w={520} quote={Q2} source="w20_21 Q2(b)(i), MS p.7" size={21} opacity={fi(a('credited'))} accent />
      <g opacity={fi(a('qp'))}>
        <Txt x={PX + 548} y={q2y + 26} size={16} weight={800} fill={C.muted}>THE TERMS OFFERED (QP), UNDERLINE THOSE THAT DESCRIBE LIPASES</Txt>
        {['macromolecule', 'extracellular enzyme', 'fibrous protein', 'polysaccharide'].map((t, i) => {
          const x = PX + 548 + [0, 170, 0, 190][i], y = q2y + 64 + (i > 1 ? 40 : 0), w = textW(t, 21, 700);
          return <g key={t}><Txt x={x} y={y} size={21} weight={700}>{t}</Txt>
            {i < 2 && <Underline x1={x} x2={x + w} y={y + 7} p={fe(a('qp') - 0.4 - i * 0.3, 0.4)} color={C.teal} width={4} />}</g>;
        })}
      </g>
      <SideNote x={PX + 730} y={cardY + 34} text={'what it does,\nnot where'} opacity={fi(a('catalyst') - 0.3)} />
    </g>
  );
}
