/** The induced-fit hypothesis. Right panel: the SEPARATE rest-if asset (not fully complementary: different
 * trace colours, gap shaded); substrate travels in and the cleft CLOSES around it (~0.6 s motion); fully
 * complementary; complex; products (one-frame switch) leave; the cleft OPENS back to rest-if; three-frame
 * strip; credited phrases; two names. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {Enzyme, Substrate, Products, Ticks, ComplexBracket, ModelTag, cleftAt, cleftPath} from '../Model';
import {QuoteTab} from '../Panels';
import {Frame, LKRun, PANEL, LKC, IFC} from './Beat12';
import {fi, fe, pulse, path, between} from '../util';

/** close amount from ages: closes 0.8→1.4 s after `close`, opens over 0.6 s after `reopen`. */
export const closeAt = (cl: number, ro: number) => (ro >= 0 ? 1 - fe(ro, 0.6) : cl >= 0.8 ? fe(cl - 0.8, 0.6) : 0);
export function IFRun({cl, match, complex, leave, reopen, gap = 0, dim = 0, s = PANEL.s, x = PANEL.if.cx, y = PANEL.my}: any) {
  const [dx, dy] = cl >= 0 ? path(cl, [[0, 0, -175], [0.8, 0, -10]]) : [0, -175];
  const close = closeAt(cl, reopen);
  const seated = cl >= 0.8 ? [0, -10 + 10 * fe(cl - 0.8, 0.6)] : [dx, dy];
  const lv = leave >= 0 ? fe(leave, 1.4) : 0;
  const cp = cleftAt('if', 0);
  return (
    <g opacity={1 - 0.6 * dim}>
      <Enzyme x={x} y={y} s={s} mode="if" close={close} trace={match >= 0 && leave < 0 ? fe(match, 0.6) : gap > 0 ? gap : 0} traceColor={match >= 0 ? IFC : C.gold}>
        {gap > 0 && <path d={cleftPath(cp) + 'Z'} fill={C.gold} opacity={0.22 * gap} />}
        {leave < 0 && <Substrate kind="gen" dx={seated[0]} dy={seated[1]} trace={gap > 0 && cl < 0 ? gap : match >= 0 ? fe(match, 0.6) : 0} traceColor={IFC} />}
        {gap > 0 && cl < 0 && <Substrate kind="gen" ghost edge={IFC} opacity={0.8 * gap} />}
        {leave < 0 && cl >= 1.4 && <Ticks p={fi(cl - 1.4, 0.3)} />}
        {leave >= 0 && <Products lx={-140 * lv} ly={-170 * lv} rx={140 * lv} ry={-190 * lv} lrot={-25 * lv} rrot={25 * lv} opacity={1 - fi(leave - 1.8, 0.5)} />}
        <ComplexBracket p={between(complex, leave, 0.3)} color={IFC} />
      </Enzyme>
    </g>
  );
}
export function Strip({x, y, f1, f2, f3, glow = 0}: any) {
  const items: [string, number, boolean, number][] = [['resting shape', 0, false, f1], ['change on binding', 1, true, f2], ['the return', 0, false, f3]];
  return (
    <g>
      {glow > 0 && <rect x={x - 20} y={y - 70} width={640} height={148} rx={14} fill={C.accent} opacity={0.35 * glow} />}
      {items.map(([t, cl, sub, o], i) => (
        <g key={i} opacity={o}>
          <Enzyme x={x + 90 + i * 210} y={y + 20} s={0.2} mode="if" close={cl}>{sub && <Substrate kind="gen" />}</Enzyme>
          <Txt x={x + 90 + i * 210} y={y + 70} size={17} weight={800} anchor="middle" fill={IFC}>{t}</Txt>
          {i < 2 && <Txt x={x + 195 + i * 210} y={y + 26} size={26} weight={800} anchor="middle" fill={C.muted}>→</Txt>}
        </g>
      ))}
    </g>
  );
}
const QT = `"idea that active site shape not fully complementary to (shape of) monolignols ;" · "active site changes shape to, fit / bind to, monolignols ; AW" ·\n"becomes fully complementary ;" · "laccase returns to original shape, after product leaves active site / for re-use / AW ;"`;
export default function Beat13(s: any) {
  const {a} = s;
  const P = PANEL.if;
  const both = pulse(a('both'), 1.4);
  return (
    <g>
      <Frame which="lk" dim={1} glow={both} tick={1} />
      <LKRun seat={-1} complex={-1} leave={1e9} same={1e9} dim={1} />
      <Tag x={PANEL.lk.x + 30} y={PANEL.y + 152} text="active site shape unchanged" size={21} fill={C.primary} opacity={0.5} />
      <Frame which="if" glow={Math.max(fi(a('open')) * 0.6, both)} />
      <g opacity={fi(a('open'))}>
        <IFRun cl={a('close')} match={a('match')} complex={a('complex')} leave={a('leave')} reopen={a('reopen')} gap={between(a('gap'), a('close'), 0.3)} />
        <ModelTag x={P.x + PANEL.w - 70} y={PANEL.y + 470} caption={false} size={16} />
      </g>
      <Tag x={P.x + 30} y={PANEL.y + 112} text="not fully complementary at rest" size={21} fill={C.gold} opacity={between(a('gap'), a('match'))} />
      <Tag x={P.x + 30} y={PANEL.y + 112} text="changes shape: now fully complementary" size={21} fill={IFC} opacity={between(a('match'), a('reopen'))} />
      <Tag x={P.x + 30} y={PANEL.y + 112} text="returns to original shape" size={21} fill={IFC} opacity={fi(a('reopen'))} />
      <Txt x={P.x + 30} y={PANEL.y + 152} size={22} weight={800} fill={IFC} opacity={between(a('complex'), a('leave'))}>enzyme–substrate complex</Txt>
      <Strip x={P.x + 130} y={PANEL.y + 520} f1={fi(a('f1'))} f2={fi(a('f2'))} f3={fi(a('f3'))} />
      <Tag x={P.x + PANEL.w - 30} y={PANEL.y + 112} text="the accepted refinement" size={21} fill={C.ink} anchor="end" opacity={fi(a('accepted'))} />
      <QuoteTab x={70} y={832} w={1780} size={17} opacity={fi(a('cite'))} source="s24_23 Q4(b), MS p.9" quote={QT} />
      {both > 0 && <path d="M960 230V790" stroke={C.ink} strokeWidth={3} opacity={both} />}
    </g>
  );
}
