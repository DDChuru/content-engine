/** Beat 9 · E36 · COMMON MISTAKE (June 2024 ER p.4 reports both reasonings). Two faults on the card:
 * line 1 (Vmax taken as affinity) is corrected at "Affinity is read from Km" — marker STAYS; line 2 (gradient taken
 * as affinity) is corrected at "Lowest Km, highest affinity" — the last fault; the marker clears 18 frames later,
 * on the completed correct frame. Wrong answers are written, never voiced. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag, Under, Strike, textW} from '../shared/Type';
import {fi, fe, between} from '../util';
import {QuestionCard, QuoteTab, AnswerCard, PEN} from '../Panels';
import {CurvePath, gx, gy, rate} from '../RateGraph';
import {ThreeGraph, threeG, X, Y, Z} from './three';
import {Small} from './common';

const Q = 'What is the correct order of affinity of these enzymes for their substrates, starting with the enzyme with the highest affinity?';
const ER = '"Some candidates confused Km with Vmax and selected option C. A similar proportion\nthought that the gradient of the initial curve showed enzyme affinity, and so selected\noption A."';
const g = threeG(290, 420, 640, 370);
const W1 = '✗ highest Vmax = highest affinity → Y, X, Z', W2 = '✗ steepest start = highest affinity → X, Y, Z';
const R1 = '✓ lowest Km = highest affinity', R2 = '✓ Km: X 100, Z 200, Y 400 → X, Z, Y';
function Fixable({x, y, wrong, right, t, size = 30, under = 0}: any) {
  const f = t * 30, strike = clamp01(f / 9), repl = clamp01((f - 9) / 9);
  const w = textW(wrong, size, 600);
  return (
    <g>
      <Txt x={x} y={y} size={size} weight={600} fill={PEN} opacity={1 - repl}>{wrong}</Txt>
      <g opacity={1 - repl}>
        <Under x={x} y={y + 10} w={w} p={under} color={C.primary} />
        <Strike x={x - 4} y={y - size * 0.32} w={w + 8} p={strike} color={C.primary} />
      </g>
      <Txt x={x} y={y} size={size} weight={700} fill={C.goodDark} opacity={repl}>{right}</Txt>
    </g>
  );
}
export default function Beat09(s: any) {
  const {a} = s;
  const redraw = (d: number) => clamp01((a('redraw') - d) / 0.6);
  const talk = a('l1') > 0 && a('correct') < 0.6;
  return (
    <g>
      <QuestionCard x={90} y={190} w={1760} size={22} text={Q} cite="9700/12 June 2024 Q11, key B (X, Z, Y) · question paper p.6" opacity={fi(a('header'))} />
      <g opacity={fi(a('enter') - 0.4)}>
        <rect x={110} y={340} width={860} height={580} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <ThreeGraph g={g} size={17}
          con={{Y: [redraw(0), redraw(0.4), redraw(0.8)], X: [redraw(1.4), redraw(1.8), redraw(2.2)], Z: [redraw(2.8), redraw(3.2), redraw(3.6)]}} />
        <Small x={130} y={372} text="our schematic (Beat 8's values); the paper's graph is not reproduced" />
        {/* talk-through highlights */}
        <InkRing cx={gx(g, 1400)} cy={gy(g, Y.vmax)} rx={120} ry={26} p={fe(a('yring'), 0.6) * (1 - fi(a('fix1')))} />
        <Tag x={g.x + 16} y={g.y + 20} text="Vmax: a rate" size={20} fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={fi(a('yaxis'))} />
        <Tag x={g.x + g.w} y={g.y + g.h + 128} text="Km: a concentration" size={20} anchor="end" fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={fi(a('xaxis'))} />
        <CurvePath g={g} c={X} from={0} to={0.06} p={clamp01(a('xsteep') / 0.7)} color={C.primary} width={10} opacity={0.7 * (1 - fi(a('fix1')))} />
        <g opacity={between(a('tri'), a('fix1'), 0.3)}>
          <path d={`M${gx(g, 0)} ${gy(g, 0)}H${gx(g, 80)}V${gy(g, rate(X, 80))}Z`} fill="#FBE3DA" stroke={C.primary} strokeWidth={3} />
          <Tag x={gx(g, 110)} y={gy(g, 250)} text="gradient: rate ÷ concentration" size={19} fill={C.primary} stroke={C.primary} bg="#FFF4F0" strike={clamp01((a('tri') - 2.2) / 0.5)} />
        </g>
      </g>
      <AnswerCard x={1010} y={340} w={840} h={290} title="TWO WRITTEN ANSWERS" note="the two wrong reasonings the June 2024 report describes (options C and A); composite, not a transcript" opacity={fi(a('card'))} active={s.k < 99999 && a('correct') < 0.6}>
        <Fixable x={1040} y={450} wrong={W1} right={R1} t={a('fix1')} under={clamp01(a('l1') / 0.6)} />
        <Fixable x={1040} y={550} wrong={W2} right={R2} t={a('correct')} under={clamp01(a('l2') / 0.6)} />
      </AnswerCard>
      <QuoteTab x={1010} y={660} w={840} size={20} quote={ER} source="June 2024 examiner report p.4 (9700/12 Q11)" opacity={fi(a('cite'))}
        under={[[0, 'A similar proportion', clamp01(a('cite2') / 0.4)], [1, 'thought that the gradient of the initial curve showed enzyme affinity, and so selected', clamp01((a('cite2') - 0.3) / 0.8)], [2, 'option A."', clamp01((a('cite2') - 1.1) / 0.3)]]} />
      {!talk && a('correct') > 0.6 && <Txt x={1010} y={880} size={24} weight={800} fill={C.goodDark} opacity={fi(a('correct') - 0.6)}>Affinity is read from Km: each curve, its own ½Vmax</Txt>}
    </g>
  );
}
