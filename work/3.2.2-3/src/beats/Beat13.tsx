/** Beat 13 · E41 · COMMON MISTAKE (June 2023 ER p.22; March 2023 ER p.2). The sketch card has two faults: a lower
 * plateau that never meets the original (the non-competitive shape) and a fainter curve ABOVE the maximum. The
 * above-maximum ghost is struck first ("which an inhibitor does not do"); the marker stays on. At "Redraw it" the
 * lower-plateau sketch is struck and the correct competitive curve draws (below at first, merging at the plateau);
 * the marker clears on the completed frame (correct cue + 54 frames). Wrong curves are drawn, never voiced. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag, Card, Arrow, Under, textW} from '../shared/Type';
import {fi, fe, between, move} from '../util';
import {QuestionCard, QuoteTab} from '../Panels';
import {Axes, CurvePath, G, gx, gy, rate} from '../RateGraph';
import {Enzyme, Mol} from '../Enzyme';
import {NONE, COMP} from './inhib';
import {Small} from './common';

const Q = 'Sulfonamide is a competitive inhibitor of carbonic anhydrase. Fig. 3.2 shows the effect of increasing substrate concentration on the rate\nof the reaction catalysed by carbonic anhydrase. Sketch a curve on Fig. 3.2 to show the effect of sulfonamide on the rate of reaction\ncatalysed by carbonic anhydrase.';
const ER1 = '"There were a number who went above the maximum or who drew\nthe curve for a non-competitive inhibitor."';
const ER2 = '"About a quarter of candidates selected option D instead of the correct\nanswer. … they had confused the relationship between substrate concentration\nand rate of reaction in the presence of a competitive inhibitor with that in the\npresence of a non-competitive inhibitor. With competitive inhibitors, an increase\nin substrate concentration can overcome inhibition so that the maximum possible\nrate of breakdown is unchanged."';
const MSQ = 'MS p.13: "curve below the original line ; curve, merging / will merge,\nwith the original line after it begins to plateau ;"';
const g: G = {x: 250, y: 470, w: 660, h: 340, xmax: 240, ymax: 10};
const WRONG = {id: 'sketch-lower-plateau', vmax: 5.4, km: 26};
const GHOST = {id: 'sketch-above-max', vmax: 9.5, km: 15};
/** A hand-sketched curve: the model curve with a small deterministic wobble (pen, not construction). */
function Sketch({c, p = 1, color, width = 5, opacity = 1}: any) {
  if (p <= 0 || opacity <= 0) return null;
  let d = '';
  const n = 90, end = clamp01(p) * g.xmax;
  for (let i = 0; i <= n; i++) {
    const S = (end * i) / n, wob = 1.6 * Math.sin(i * 0.9) + 1.1 * Math.sin(i * 2.3);
    d += (i ? 'L' : 'M') + gx(g, S).toFixed(1) + ' ' + (gy(g, rate(c, S)) + (i > 2 ? wob : 0)).toFixed(1);
  }
  return <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" opacity={opacity < 1 ? opacity : undefined} data-sketch={c.id} />;
}
export default function Beat13(s: any) {
  const {a, k} = s;
  const cf = a('correct') * 30;
  const strikeW = clamp01(cf / 9), draw = clamp01((cf - 9) / 45);
  const ghostStrike = clamp01(a('strike') / 0.4);
  const underX = 120 + textW('Sulfonamide is a ', 20, 600);
  return (
    <g>
      <QuestionCard x={90} y={190} w={1760} size={20} text={Q} cite="9700/23 June 2023 Q3(b)(ii), 2 marks · question paper p.7" opacity={fi(a('header'))} />
      <Under x={underX} y={266} w={textW('competitive', 20, 600)} p={clamp01(a('said') / 0.5)} color={C.primary} />
      {/* our graph with the original curve */}
      <g opacity={fi(a('enter') - 0.4)}>
        <Card x={110} y={390} w={880} h={540} />
        <Small x={130} y={420} text="our schematic (no values); the paper's Fig. 3.2 is not reproduced" />
        <Axes g={g} xLabel="substrate concentration" yLabel="rate of reaction" size={20} />
        <CurvePath g={g} c={NONE} width={4.5} />
        <Txt x={gx(g, 60)} y={gy(g, 8) - 14} size={19} weight={800} fill={C.ink}>original curve</Txt>
      </g>
      {/* the written sketch: two faults */}
      <g opacity={fi(a('card')) * (1 - 0.7 * clamp01((cf - 60) / 18))}>
        <Sketch c={GHOST} p={clamp01((a('card') - 0.8) / 1)} color={C.primary} width={4} opacity={0.45} />
        <Sketch c={WRONG} p={clamp01(a('card') / 1)} color={C.primary} opacity={1 - 0.55 * strikeW} />
        <Tag x={gx(g, 150)} y={gy(g, 9.5) - 12} text="also seen" size={18} fill={C.primary} stroke={C.primary} bg="#FFF4F0" opacity={fi(a('card') - 1.6) * (1 - 0.5 * ghostStrike)} strike={ghostStrike} />
        <Txt x={gx(g, 150)} y={gy(g, 5.4) + 34} size={19} weight={800} fill={C.primary} opacity={1 - strikeW}>sketched curve</Txt>
        <Small x={130} y={915} text="THE SKETCH · the two faults the June 2023 report describes; composite, not a transcript" fill={C.primary} />
        {/* strikes */}
        {ghostStrike > 0 && <path d={`M${gx(g, 40)} ${gy(g, 9.9)}L${gx(g, 40) + (gx(g, 230) - gx(g, 40)) * ghostStrike} ${gy(g, 9.0)}`} stroke={C.primary} strokeWidth={4} strokeLinecap="round" />}
        {strikeW > 0 && <path d={`M${gx(g, 30)} ${gy(g, 5.9)}L${gx(g, 30) + (gx(g, 235) - gx(g, 30)) * strikeW} ${gy(g, 4.9)}`} stroke={C.primary} strokeWidth={5} strokeLinecap="round" />}
      </g>
      {/* talk-through highlights */}
      <InkRing cx={gx(g, 215)} cy={gy(g, 5.4)} rx={50} ry={28} p={fe(a('end'), 0.6) * (1 - fi(a('low')))} />
      <g opacity={between(a('gap'), a('low'), 0.3)}>
        <path d={`M${gx(g, 228)} ${gy(g, 8)}h14V${gy(g, 5.4)}h-14`} fill="none" stroke={C.primary} strokeWidth={3.5} />
        <Txt x={gx(g, 226)} y={gy(g, 6.8)} size={18} weight={800} fill={C.primary} anchor="end">its own lower plateau</Txt>
      </g>
      <Tag x={gx(g, 120)} y={gy(g, 3)} text="non-competitive shape" size={20} fill="#7A4FA0" stroke="#7A4FA0" bg="#F3EDF8" opacity={between(a('nctitle'), a('low'), 0.3)} />
      <g opacity={between(a('low'), a('high'), 0.3)}>
        <CurvePath g={g} c={WRONG} from={0} to={0.12} color={C.teal} width={10} opacity={0.5} />
        <Tag x={gx(g, 50)} y={gy(g, 2)} text="looks right at low concentrations" size={19} fill={C.teal} stroke={C.teal} bg="#E7F1F5" />
      </g>
      <g opacity={between(a('high'), a('replay'), 0.3)}>
        <InkRing cx={gx(g, 205)} cy={gy(g, 6.8)} rx={70} ry={80} p={fe(a('high'), 0.6)} color={C.teal} />
        <Txt x={gx(g, 205)} y={gy(g, 6.8) + 12} size={40} weight={800} fill={C.teal} anchor="middle">?</Txt>
      </g>
      <g opacity={between(a('arrow'), a('correct'), 0.3)}>
        <Arrow x1={gx(g, 215)} y1={gy(g, 5.4) - 10} x2={gx(g, 215)} y2={gy(g, 8) + 10} color={C.teal} width={5} head={16} />
        <Txt x={gx(g, 210)} y={gy(g, 6.9)} size={19} weight={800} fill={C.teal} anchor="end">must meet the original plateau</Txt>
      </g>
      {/* the correction, in place */}
      <CurvePath g={g} c={COMP} p={draw} color={C.teal} width={5.5} />
      <g opacity={fi(a('labels'))}>
        <Tag x={gx(g, 125)} y={gy(g, 4.2)} text="Vmax unchanged, Km increased" size={20} fill={C.teal} stroke={C.teal} bg="#E7F1F5" />
        <Txt x={gx(g, 125)} y={gy(g, 4.2) + 40} size={20} weight={800} fill={C.teal}>that is competitive</Txt>
      </g>
      {/* right column: replay, report quotes, mark scheme */}
      <g opacity={between(a('replay'), a('cite'), 0.4)}>
        <Card x={1030} y={390} w={820} h={300} />
        <Txt x={1054} y={426} size={19} weight={800} fill={C.muted}>RECALL · BEAT 11 (MODEL)</Txt>
        <Enzyme x={1200} y={600} s={0.5} />
        <Mol x={1200} y={600} s={0.5} kind="comp" off={move(a('replay') - 1.0, 1.0, 0, 150)} slide={move(a('replay') - 1.0, 1.0, 0, 170)} opacity={1 - fi(a('replay') - 2.2)} />
        <Mol x={1200} y={600} s={0.5} kind="substrate" off={move(a('replay') - 2.0, 0.9, 150, 0)} />
        {[0, 1, 2].map((i) => <Mol key={i} x={1200} y={600} s={0.5} kind="substrate" off={120 + i * 20} slide={(i - 1) * 110} opacity={fi(a('replay') - 0.3 * i)} />)}
        <Txt x={1560} y={540} size={22} weight={800} fill={C.ink}>more substrate:</Txt>
        <Txt x={1560} y={572} size={22} weight={800} fill={C.ink}>the inhibitor loses</Txt>
        <Small x={1560} y={600} text="the site, more often, holds substrate" />
      </g>
      <QuoteTab x={1030} y={390} w={820} size={21} quote={ER1} source="June 2023 examiner report p.22 (9700/23 Q3(b)(ii))" opacity={between(a('cite'), a('cite2'), 0.4)} />
      <QuoteTab x={1030} y={390} w={820} size={19} quote={ER2} source="March 2023 examiner report p.2 (9700/12 Q16, key B)" opacity={fi(a('cite2'))} />
      <g opacity={fi(a('labels') + 0.3)}>
        <QuoteTab x={1030} y={740} w={820} size={19} quote={MSQ} source="9700/23 June 2023 mark scheme p.13" />
      </g>
    </g>
  );
}
