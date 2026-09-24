/** Specificity. Three outlines try the active site (MOTION): the wrong-notch wedge reaches the cleft,
 * rocks once, slides away; the round blob the same; the generic substrate seats. Complementary traces,
 * the not-the-same-shape ghost, specificity, the two rejects (bounded to THESE two), handle → sentence. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag, Lines} from '../../shared/src/Type';
import {Enzyme, Substrate, ModelTag, Label, SEAT, pt} from '../Model';
import {fi, fe, path, wobble, between} from '../util';

export const X7 = 760, Y7 = 650, S7 = 1.1;
/** screen position of a substrate's seat point → offset in enzyme coordinates */
export const off = (sx: number, sy: number) => [(sx - X7) / S7 - SEAT[0], (sy - Y7) / S7 - SEAT[1]];
const LINE: [number, number][] = [[330, 372], [560, 372], [1200, 372]];
const ABOVE = pt(X7, Y7, S7, SEAT[0], SEAT[1]);

function tryFit(age: number, off0: number[], stop: number, leaveAt: number) {
  // travel to just above the cleft, rock once, slide back out
  const [x0, y0] = off0;
  const keys = [[0, x0, y0], [1.0, 0, stop], [leaveAt, 0, stop], [leaveAt + 0.9, x0, y0]];
  const [dx, dy] = path(age, keys);
  const rot = age > 1.0 && age < leaveAt ? wobble(age - 1.0, 8) : 0;
  return {dx, dy, rot};
}
export function Lock({x, y, s = 1, opacity = 1}: any) {
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <path d="M-18 -8V-24A18 18 0 0 1 18 -24V-8" fill="none" stroke={C.ink} strokeWidth={6} />
      <rect x={-28} y={-10} width={56} height={46} rx={8} fill={C.gold} stroke={C.ink} strokeWidth={3} />
      <circle cx={0} cy={8} r={6} fill={C.ink} /><rect x={-2.5} y={8} width={5} height={14} fill={C.ink} />
      <g transform="translate(52 6)"><circle cx={0} cy={0} r={13} fill="none" stroke={C.ink} strokeWidth={5} /><path d="M13 0H52M40 0V10M48 0V8" stroke={C.ink} strokeWidth={5} /></g>
    </g>
  );
}
export default function Beat07(s: any) {
  const {a} = s;
  const o0 = off(...LINE[0]), o1 = off(...LINE[1]), o2 = off(...LINE[2]);
  const m1 = a('m1') >= 0 ? tryFit(a('m1'), o0, -55, 2.9) : {dx: o0[0], dy: o0[1], rot: 0};
  const m2 = a('m2') >= 0 ? tryFit(a('m2'), o1, 0, 1.25) : {dx: o1[0], dy: o1[1], rot: 0};
  let g3 = a('m3') >= 0 ? path(a('m3'), [[0, o2[0], o2[1]], [1.0, 0, -40], [1.4, 0, 0]]) : o2;
  const lift = a('ghost') >= 0 ? path(a('ghost'), [[0, 0, 0], [0.6, 0, -150], [2.4, 0, -150], [2.9, 0, 0]])[1] : 0;
  if (a('m3') >= 1.4) g3 = [0, lift];
  const trace = fe(a('trace'), 0.8);
  const rej = fi(a('reject'));
  return (
    <g>
      <Enzyme x={X7} y={Y7} s={S7} trace={between(a('trace'), a('spec'), 0.3) > 0 ? trace : 0}>
        <Substrate kind="wrong" dx={m1.dx} dy={m1.dy} rot={m1.rot} opacity={fi(a('line'))} ghost={rej > 0} />
        <Substrate kind="round" dx={m2.dx} dy={m2.dy} rot={m2.rot} opacity={fi(a('line') - 0.2)} ghost={rej > 0} />
        {a('ghost') >= 0.6 && a('ghost') < 2.4 && <Substrate kind="gen" dx={0} dy={0} ghost opacity={fi(a('ghost') - 0.6, 0.3)} edge={C.primary} />}
        <Substrate kind="gen" dx={g3[0]} dy={g3[1]} opacity={fi(a('line') - 0.4)} trace={between(a('trace'), a('spec'), 0.3) > 0 && a('m3') >= 1.4 && lift === 0 ? trace : 0} />
      </Enzyme>
      <ModelTag x={1060} y={860} opacity={fi(a('line'))} />
      {rej > 0 && [LINE[0], LINE[1]].map(([x, y], i) => <Txt key={i} x={x + 60} y={y - 70} size={46} weight={800} fill={C.primary} opacity={rej}>✗</Txt>)}
      <Label lx={1280} ly={470} tx={ABOVE[0] + 60} ty={ABOVE[1] - 60} text="substrate" size={28} opacity={fi(a('m3') - 1.2)} />
      <g opacity={between(a('trace'), a('ghost'), 0.4)}>
        <Txt x={1280} y={540} size={26} weight={800} fill={C.teal}>active site ↔ substrate:</Txt>
        <Txt x={1280} y={574} size={26} weight={800} fill={C.teal}>complementary in shape</Txt>
      </g>
      <g opacity={between(a('ghost') - 0.5, a('spec'), 0.4)}>
        <Txt x={1280} y={540} size={26} weight={800} fill={C.primary}>not the same shape:</Txt>
        <Lines x={1280} y={576} size={21} step={27} weight={700} fill={C.ink} text={'dashed = the substrate\'s own outline over the cleft;\nwhere the cleft has a bump, the substrate has a notch'} />
      </g>
      <g opacity={fi(a('spec'))}>
        <Txt x={1280} y={560} size={40} weight={800} fill={C.primary}>specificity</Txt>
        <Lines x={1280} y={600} size={21} step={26} weight={600} fill={C.muted} italic opacity={fi(a('group'))} text={'a particular substrate or a limited\ngroup of related substrates'} />
      </g>
      <Txt x={300} y={500} size={20} weight={700} fill={C.primary} opacity={rej}>these two do not fit this active site</Txt>
      <g opacity={fi(a('handle'))}>
        <Lock x={1300} y={690} s={0.8} />
        <Txt x={1400} y={704} size={30} weight={800} fill={C.ink}>lock and key</Txt>
        <Txt x={1400} y={732} size={17} weight={600} fill={C.muted} italic>the handle (an analogy), never the exam answer</Txt>
      </g>
      <g opacity={fi(a('sentence'))}>
        <rect x={1262} y={770} width={600} height={134} rx={14} fill="#F2FAF5" stroke="#1D8A4E" strokeWidth={3} />
        <rect x={1262} y={770} width={10} height={134} rx={5} fill="#1D8A4E" />
        <Lines x={1290} y={808} size={24} step={30} weight={800} text={'the active site is complementary in shape\nto its substrate, so the enzyme is specific'} />
        <Txt x={1290} y={886} size={16} weight={600} fill={C.muted} italic>a particular substrate or a limited group of related substrates</Txt>
      </g>
      <Txt x={70} y={930} size={16} weight={600} fill={C.muted} italic opacity={fi(a('ghost'))}>S21/12 Q12, key A: the suggestion that cannot be correct says "not the same shape as the active site".</Txt>
    </g>
  );
}
