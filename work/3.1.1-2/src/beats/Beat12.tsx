/** The lock-and-key hypothesis. Two panels (two drawings); left: rest-lk, complementary BEFORE binding,
 * the substrate seats (motion), the complex, products (one-frame switch, then drift), the cleft traced again:
 * shape unchanged throughout. Not a wrong picture: June 2024 credited lock-and-key diagrams. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Lines} from '../../shared/src/Type';
import {Enzyme, Substrate, Products, Ticks, ComplexBracket, ModelTag} from '../Model';
import {QuoteTab} from '../Panels';
import {Lock} from './Beat07';
import {fi, fe, pulse, path, between} from '../util';

export const LKC = '#2F7F86', IFC = '#7A4FA0';
export const PANEL = {lk: {x: 70, cx: 500}, if: {x: 990, cx: 1420}, y: 200, w: 860, h: 610, my: 560, s: 0.72};
export function Frame({which, a0 = 1, dim = 0, glow = 0, tick = 0, grey = false}: any) {
  const P = which === 'lk' ? PANEL.lk : PANEL.if, col = which === 'lk' ? LKC : IFC;
  const title = which === 'lk' ? 'lock-and-key hypothesis' : 'induced-fit hypothesis';
  return (
    <g opacity={a0}>
      <rect x={P.x} y={PANEL.y} width={PANEL.w} height={PANEL.h} rx={18} fill={C.white} opacity={grey ? 0.4 : 1 - 0.5 * dim} stroke={glow > 0 ? col : C.line} strokeWidth={2 + 4 * glow} />
      <rect x={P.x} y={PANEL.y} width={PANEL.w} height={58} rx={18} fill={col} opacity={grey ? 0.25 : (1 - 0.5 * dim) * (0.85 + 0.15 * glow)} />
      <Txt x={P.x + 24} y={PANEL.y + 40} size={30} weight={800} fill={C.white} opacity={grey ? 0.7 : 1}>{title}</Txt>
      {tick > 0 && <path d={`M${P.x + PANEL.w - 64} ${PANEL.y + 28}l12 12l24 -26`} stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" opacity={tick} />}
    </g>
  );
}
/** One lock-and-key run inside the left panel, driven by ages. */
export function LKRun({seat, complex, leave, same, trace = 0, dim = 0, labels = true, lyso = false}: any) {
  const P = PANEL.lk;
  const [dx, dy] = seat >= 0 ? path(seat, [[0, 0, -175], [0.8, 0, 0]]) : [0, -175];
  const lv = leave >= 0 ? fe(leave, 1.4) : 0;
  return (
    <g opacity={1 - 0.6 * dim}>
      <Enzyme x={P.cx} y={PANEL.my} s={PANEL.s} trace={trace > 0 ? trace : same >= 0 ? fe(same, 0.8) : 0} traceColor={same >= 0 ? C.primary : LKC}>
        {leave < 0 && <Substrate kind="gen" dx={dx} dy={dy} trace={seat < 0 ? trace : 0} traceColor={LKC} />}
        {leave < 0 && seat >= 0.8 && <Ticks p={fi(seat - 0.8, 0.3)} />}
        {leave >= 0 && <Products lx={-140 * lv} ly={-170 * lv} rx={140 * lv} ry={-190 * lv} lrot={-25 * lv} rrot={25 * lv} opacity={1 - fi(leave - 1.8, 0.5)} />}
        <ComplexBracket p={between(complex, leave, 0.3)} color={LKC} />
      </Enzyme>
    </g>
  );
}
export default function Beat12(s: any) {
  const {a} = s;
  const P = PANEL.lk;
  return (
    <g>
      <Txt x={960} y={520} size={40} weight={800} anchor="middle" opacity={1 - fi(a('split'), 0.4)}>two hypotheses · two separate drawings</Txt>
      <g opacity={fi(a('split'), 0.5)}>
        <Frame which="lk" tick={fi(a('tick'))} glow={pulse(a('lk'), 1)} />
        <Frame which="if" grey />
        <Txt x={PANEL.if.cx} y={520} size={24} weight={700} fill={C.muted} anchor="middle">next</Txt>
      </g>
      <g opacity={fi(a('lk'))}>
        <LKRun seat={a('fits')} complex={a('complex')} leave={a('leave')} same={a('same')} trace={between(a('trace'), a('fits'), 0.3) > 0 ? fe(a('trace'), 0.8) : 0} />
        <ModelTag x={P.x + PANEL.w - 70} y={PANEL.y + 470} caption={false} size={16} />
      </g>
      <Tag x={P.x + 30} y={PANEL.y + 112} text="complementary before binding" size={21} fill={LKC} opacity={fi(a('trace'))} />
      <g opacity={fi(a('icon'))}>
        <Lock x={P.x + 690} y={PANEL.y + 120} s={0.6} />
        <Txt x={P.x + 690} y={PANEL.y + 172} size={16} weight={700} fill={C.muted} anchor="middle">analogy</Txt>
      </g>
      <Txt x={P.cx} y={PANEL.y + 532} size={22} weight={800} fill={LKC} anchor="middle" opacity={between(a('complex'), a('leave'))}>enzyme–substrate complex</Txt>
      <Tag x={P.x + 30} y={PANEL.y + 152} text="active site shape unchanged" size={21} fill={C.primary} opacity={fi(a('same'))} />
      <Txt x={P.cx} y={PANEL.y + 580} size={22} weight={800} fill={C.ink} anchor="middle" opacity={fi(a('simple'))}>the simpler model; explains specificity</Txt>
      <QuoteTab x={70} y={832} w={1780} size={19} opacity={fi(a('cite'))} source="s24_22 Q3(a), MS p.13" quote={'lock-and-key diagrams for lysozyme, any three from four drawing points'} />
    </g>
  );
}
