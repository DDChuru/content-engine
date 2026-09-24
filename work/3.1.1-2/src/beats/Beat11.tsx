/** E35 · five moves · COMMON MISTAKE (ECR Paper 2 Q6(a)(iii), p.54: "The most common mistake…"). Our
 * framing of June 2016 Paper 22 Q6(a)(iii); the written answer is shown, never voiced. The ruling is kept
 * LOCAL: the boundary tab cites S24/23 Q4(b), where lowering activation energy was credited. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Lines, Arrow, Underline, InkRing, textW} from '../../shared/src/Type';
import {QHeader, QuoteTab, quoteSpan, SideNote, Strike, PEN, GOOD} from '../Panels';
import {EnergyGraph} from '../Graph';
import {G10} from './Beat10';
import {fi, fe, pulse, between} from '../util';

const PX = 700, PW = 1150;
const L1 = 'The enzyme is needed to form the branches,', L2 = 'and it lowers the activation energy of the reaction.';
const R1 = 'It catalyses the formation of α-1,6 glycosidic', R2 = 'bonds (the branch points).';
const Q = `"The most common mistake was to be too general and state that the enzyme was needed to form branches, or that\nthe enzyme lowered activation energy, rather than stating precisely the type of bond catalysed by glycogen\nbranching enzyme or showing an understanding of active sites and specificity in bond formation."`;
const B = `local ruling: that question. S24/23 Q4(b), MS p.9: "lowers, activation energy / energy of activation;"\nis a marking point for the mode of action of laccase.`;
const HS = 26, HT = 'Why is glycogen branching enzyme needed in addition to glycogen synthase?';

/** Topic 2 recall: a glycogen chain with one branch point. */
function Branch({x, y, a}: any) {
  const main = Array.from({length: 7}, (_, i) => [x + i * 44, y]);
  const br = Array.from({length: 3}, (_, i) => [x + 3 * 44 + 22 + i * 44, y - 62 - i * 0]);
  const known = a('recall') >= 0;
  return (
    <g opacity={fi(a('header'))}>
      <Txt x={x - 10} y={y - 120} size={18} weight={800} fill={C.muted}>recall (Topic 2): glycogen branch point, MODEL</Txt>
      {main.slice(1).map((p, i) => <path key={i} d={`M${main[i][0]} ${main[i][1]}L${p[0]} ${p[1]}`} stroke="#8A6414" strokeWidth={4} />)}
      {br.slice(1).map((p, i) => <path key={'b' + i} d={`M${br[i][0]} ${br[i][1]}L${p[0]} ${p[1]}`} stroke="#8A6414" strokeWidth={4} />)}
      <path d={`M${main[3][0]} ${main[3][1]}L${br[0][0]} ${br[0][1]}`} stroke={known ? C.primary : '#8A6414'} strokeWidth={known ? 6 : 4} />
      {[...main, ...br].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r={13} fill={C.sub} stroke="#8A6414" strokeWidth={2.5} />)}
      <Txt x={x + 3 * 44 + 22 + 2 * 44 + 30} y={y - 54} size={22} weight={800} fill={known ? C.primary : C.muted}>{known ? 'α-1,6 glycosidic bond' : '?'}</Txt>
      {known && <path d={`M${x + 3 * 44 + 22 + 2 * 44 + 26} ${y - 60}Q${x + 3 * 44 + 60} ${y - 70} ${x + 3 * 44 + 18} ${y - 36}`} fill="none" stroke={C.primary} strokeWidth={2.5} />}
      <Txt x={x + 6 * 44 + 24} y={y + 6} size={17} weight={700} fill={C.muted}>α-1,4</Txt>
      {known && <InkRing cx={main[3][0] + 11} cy={y - 31} rx={36} ry={44} p={fe(a('recall'), 0.6)} />}
    </g>
  );
}
export default function Beat11(s: any) {
  const {a, k, at} = s;
  const cf = k - Math.ceil(at.correct * 30 - 1e-9);
  const strike = clamp01(cf / 9), repl = clamp01((cf - 9) / 9), corrected = cf >= 18;
  const hy = 196, cardY = 408, ws = 33;
  const cx0 = PX + 30 + ws * 1.05;
  const hdrW0 = PX + 22 + textW('Why is ', HS, 700), hdrW1 = hdrW0 + textW('glycogen branching enzyme', HS, 700);
  const hdrOn = pulse(a('hdr1'), 1.4) + pulse(a('hdr2'), 1.4);
  const u1 = [cx0 + textW('and it ', ws, 600), cx0 + textW('and it lowers the activation energy', ws, 600)];
  const u2 = [cx0 + textW('The enzyme is needed to ', ws, 600), cx0 + textW('The enzyme is needed to form the branches', ws, 600)];
  const qy = 598, by = 760;
  const b1 = quoteSpan(PX, by, B, 0, 0, 27, 19), b2 = quoteSpan(PX, by, B, 0, B.indexOf('"lowers'), B.indexOf(';"') + 2, 19);
  const tint = between(a('tint'), a('hdr2'), 0.4);
  return (
    <g>
      <g transform="translate(40 200) scale(0.46)" opacity={0.45}>
        <EnergyGraph {...G10} v={{axes: 1, yl: 1, xl: 1, sub: 1, prod: 1, u: 1, c: 1, ea1: 1, ea2: 1, red: 1}} hi={{red: pulse(a('ul1'), 1.2) * 1.0}} small />
      </g>
      <Txt x={60} y={300} size={18} weight={700} fill={C.muted}>from Beat 10: the energy profile</Txt>
      <Branch x={120} y={770} a={a} />
      <QHeader x={PX} y={hy} w={PW} label="THE QUESTION · our framing" size={HS} opacity={fi(a('header'))} text={HT}
        src={'Our framing of June 2016 Paper 22 Q6(a)(iii); question reproduced in ECR Paper 2 p.48, original instruction "Suggest why glycogen\nbranching enzyme is needed in addition to glycogen synthase."; examiner comment quoted from p.54.'}
        hi={hdrOn > 0 ? <rect x={hdrW0 - 6} y={hy + 44} width={hdrW1 - hdrW0 + 12} height={HS * 1.35} rx={6} fill={C.accent} opacity={0.6 * Math.min(1, hdrOn)} /> : null} />
      {/* written answer */}
      <g opacity={fi(a('show'), 0.3)}>
        <rect x={PX} y={cardY - 40} width={PW} height={160} rx={14} fill={tint > 0 ? '#FFF1EA' : C.white} stroke={corrected ? '#1D8A4E' : C.primary} strokeWidth={4} />
        <Txt x={PX + 22} y={cardY - 14} size={16} weight={800} fill={C.muted}>A WRITTEN ANSWER</Txt>
        <g opacity={1 - repl}>
          <Txt x={PX + 30} y={cardY + 36} size={ws} weight={800} fill={C.primary}>✗</Txt>
          <Txt x={cx0} y={cardY + 36} size={ws} weight={600} fill={PEN} italic>{L1}</Txt>
          <Txt x={cx0} y={cardY + 80} size={ws} weight={600} fill={PEN} italic>{L2}</Txt>
          {a('bracket') >= 0 && <path d={`M${cx0 - 6} ${cardY + 46}V${cardY + 52}H${cx0 + textW(L1, ws, 600)}V${cardY + 46}`} fill="none" stroke={C.primary} strokeWidth={4} opacity={fi(a('bracket'))} />}
          {a('ul1') >= 0 && <Underline x1={u1[0]} x2={u1[1]} y={cardY + 90} p={fe(a('ul1'), 0.5)} />}
          {a('ul2') >= 0 && <Underline x1={u2[0]} x2={u2[1]} y={cardY + 44} p={fe(a('ul2'), 0.5)} color={C.teal} />}
          {strike > 0 && <><Strike x1={cx0 - 4} x2={cx0 + textW(L1, ws, 600)} y={cardY + 26} p={strike} /><Strike x1={cx0 - 4} x2={cx0 + textW(L2, ws, 600)} y={cardY + 70} p={strike} /></>}
        </g>
        {repl > 0 && <g opacity={repl}>
          <Txt x={PX + 30} y={cardY + 36} size={ws} weight={800} fill={GOOD}>✓</Txt>
          <Txt x={cx0} y={cardY + 36} size={ws} weight={700} fill={GOOD} italic>{R1}</Txt>
          <Txt x={cx0} y={cardY + 80} size={ws} weight={700} fill={GOOD} italic>{R2}</Txt>
          <Txt x={cx0} y={cardY + 110} size={15} weight={600} fill={C.muted} italic>ECR p.54: "stating the function of the glycogen branching enzyme in forming α-1,6 glycosidic bonds would have gained credit."</Txt>
        </g>}
      </g>
      {a('ul2') >= 0 && a('tint') < 0 && <Arrow x1={(hdrW0 + hdrW1) / 2 - 40} y1={hy + 80} x2={(u2[0] + u2[1]) / 2} y2={cardY + 8} color={C.teal} width={3} head={12} bend={-30} opacity={fi(a('ul2'))} />}
      <SideNote x={PX + 740} y={cardY - 12} text="role given; bond not identified" size={20} opacity={between(a('bracket'), a('tint'))} />
      <SideNote x={PX + 740} y={cardY - 12} text="the sentence just learnt" size={20} opacity={tint} color={C.muted} />
            <QuoteTab x={PX} y={qy} w={PW} quote={Q} source="ECR Paper 2 Q6(a)(iii), p.54 (examiner comment)" size={19} opacity={fi(a('cite'))} />
      <QuoteTab x={PX} y={by} w={PW} quote={B} source="the boundary" size={19} opacity={fi(a('boundary'))} accent>
        {a('ul3') >= 0 && <Underline x1={b1.x0} x2={b1.x1} y={b1.y} p={fe(a('ul3'), 0.5)} color={C.teal} width={3} />}
        {a('ul4') >= 0 && <Underline x1={b2.x0} x2={b2.x1} y={b2.y} p={fe(a('ul4'), 0.5)} color={C.teal} width={3} />}
      </QuoteTab>
    </g>
  );
}
