/** E34 · five moves · COMMON MISTAKE (June 2024 ER p.15: labels swapped / active site on the peptidoglycan;
 * p.12: "ESC"). A composite drawing (captioned as such) with several faults; the marker stays on through
 * EVERY correction and clears only on the completed correct frame (fix3 + 18 frames, Lesson.tsx). */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag, Arrow, Underline, InkRing, Lines, textW} from '../../shared/src/Type';
import {QHeader, QuoteTab, SideNote, Strike, PEN, GOOD} from '../Panels';
import {Enzyme, Substrate, Label, pt, outline, CLEFT_LK, cleftPath} from '../Model';
import {fi, fe, pulse, between} from '../util';

const QT = 'Draw labelled and annotated diagrams in the space provided to show how the lock and key hypothesis\nwas used to explain the mechanism of action of lysozyme on peptidoglycan.';
const QR = `June 2024 ER p.12: "in Question 3(a) where enzyme-substrate complex rather than ESC should have been used\nwhen labelling the drawn diagram." · p.15: "Some of the weaker responses labelled peptidoglycan as the enzyme\nor lysozyme as the substrate and some thought the active site was part of the peptidoglycan."`;
/** Pen-drawn copy of the model (no fill): a student's drawing. */
function PenModel({x, y, s, sub = [0, 0], opacity = 1, cleftTrace = 0}: any) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
      <path d={outline(CLEFT_LK)} fill={C.white} stroke={PEN} strokeWidth={4 / s * 0.6} strokeLinejoin="round" />
      {cleftTrace > 0 && <path d={cleftPath(CLEFT_LK)} fill="none" stroke="#1D8A4E" strokeWidth={10} strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - cleftTrace} />}
      <Substrate kind="gen" dx={sub[0]} dy={sub[1]} fill="#FFFFFF" edge={PEN} />
    </g>
  );
}
/** a label that can be struck and replaced in place */
function Fixable({x, y, wrong, right, fix, size = 24, anchor = 'start'}: any) {
  const strike = clamp01(fix / 0.3), repl = clamp01((fix - 0.3) / 0.3);
  const w = textW(wrong, size, 600), x0 = anchor === 'end' ? x - w : anchor === 'middle' ? x - w / 2 : x;
  return (
    <g>
      {repl < 1 && <g opacity={1 - repl}>
        <Txt x={x} y={y} size={size} weight={600} fill={PEN} italic anchor={anchor}>{wrong}</Txt>
        {fix >= 0 && <Strike x1={x0 - 4} x2={x0 + w + 4} y={y - size * 0.32} p={strike} width={4} />}
      </g>}
      {repl > 0 && <Txt x={x} y={y} size={size} weight={700} fill={GOOD} italic anchor={anchor} opacity={repl}>✓ {right}</Txt>}
    </g>
  );
}
export default function Beat16(s: any) {
  const {a} = s;
  const S = 0.5, E1: [number, number] = [270, 690], E2: [number, number] = [660, 690];
  const [nx, ny] = pt(E1[0], E1[1], S, 34, -97 - 150);   // notch on the small piece (stage 1, piece lifted 150)
  const [cx, cy] = pt(E1[0], E1[1], S, 70, -100);        // cleft of the big shape
  const [wx, wy] = pt(E1[0], E1[1], S, 70, -330);        // top of the small piece
  const [bx, by] = pt(E1[0], E1[1], S, -150, 60);        // body of the big shape
  const G: [number, number] = [1250, 600], GS = 0.55;
  const [gcx, gcy] = pt(G[0], G[1], GS, 70, -100);
  const f1 = a('fix1'), f2 = a('fix2'), f3 = a('fix3');
  const lblMove = f2 >= 0 ? fe(f2 - 0.3, 0.6) : 0;
  const asY = 560 + (cy + 10 - 560) * lblMove;
  const ringOn = (k: string, until: string) => a(k) >= 0 && a(until) < 0;
  const hdr2 = QT.split('\n')[1];
  const hx = 70 + 22, hy = 200 + 44 + 24 + 24 * 1.25;
  const lz = [hx + textW(hdr2.slice(0, hdr2.indexOf('lysozyme')), 24, 700), hx + textW(hdr2.slice(0, hdr2.indexOf('lysozyme') + 8), 24, 700)];
  const pg = [hx + textW(hdr2.slice(0, hdr2.indexOf('peptidoglycan')), 24, 700), hx + textW(hdr2.slice(0, hdr2.indexOf('peptidoglycan') + 13), 24, 700)];
  const pp = pulse(a('pulse'), 1.4);
  const done = f3 >= 0.6;
  return (
    <g>
      <QHeader x={70} y={196} w={1780} label="THE QUESTION · verbatim, QP p.7" size={24} opacity={fi(a('header'))} text={QT} src={'9700/22 June 2024 Q3(a), 3 marks'}
        hi={pp > 0 ? <g opacity={0.6 * pp}><rect x={lz[0] - 4} y={hy - 22} width={lz[1] - lz[0] + 8} height={30} rx={5} fill={C.accent} /><rect x={pg[0] - 4} y={hy - 22} width={pg[1] - pg[0] + 8} height={30} rx={5} fill={C.accent} /></g> : null} />
      {/* the drawing card */}
      <g opacity={fi(a('kind'))}>
        <rect x={70} y={370} width={830} height={560} rx={16} fill={C.white} stroke={done ? '#1D8A4E' : C.primary} strokeWidth={4} />
        <Txt x={92} y={400} size={16} weight={800} fill={C.muted}>A DRAWING OF THE KIND THE REPORT DESCRIBES</Txt>
        <Txt x={92} y={918} size={15} weight={600} fill={C.muted} italic>composite of the faults described in the June 2024 examiner report pp.12 and 15; not a transcript.</Txt>
      </g>
      <g opacity={fi(a('show'), 0.3)}>
        <PenModel x={E1[0]} y={E1[1]} s={S} sub={[0, -150]} cleftTrace={f2 >= 0 ? fe(f2 - 0.3, 0.6) : 0} />
        <Arrow x1={440} y1={660} x2={520} y2={660} color={PEN} width={3} head={12} />
        <PenModel x={E2[0]} y={E2[1]} s={S} />
        {/* wrong labels, fixable in place */}
        <path d={`M${bx - 40} ${by + 50}L${bx} ${by}`} stroke={PEN} strokeWidth={2} />
        <Fixable x={100} y={by + 70} wrong="peptidoglycan" right="lysozyme (enzyme)" fix={f1} />
        <path d={`M${wx + 70} ${wy - 20}L${wx + 10} ${wy + 6}`} stroke={PEN} strokeWidth={2} />
        <Fixable x={wx + 76} y={wy - 22} wrong="lysozyme" right="peptidoglycan (substrate)" fix={f1} />
        <path d={`M${190} ${asY - 8}L${f2 >= 0.3 ? cx - 18 : nx - 6} ${f2 >= 0.3 ? cy : ny}`} stroke={f2 >= 0.3 ? GOOD : PEN} strokeWidth={2} />
        <Txt x={100} y={asY} size={24} weight={f2 >= 0.3 ? 700 : 600} fill={f2 >= 0.3 ? GOOD : PEN} italic>{f2 >= 0.9 ? '✓ active site' : 'active site'}</Txt>
        {f2 >= 0 && f2 < 0.9 && <g opacity={clamp01(f2 / 0.3) * (1 - clamp01((f2 - 0.6) / 0.3))}><path d={`M${nx - 12} ${ny - 12}l24 24M${nx + 12} ${ny - 12}l-24 24`} stroke={C.primary} strokeWidth={4} /></g>}
        <Fixable x={E2[0]} y={800} wrong="ESC" right="enzyme-substrate complex" fix={f3} anchor="middle" size={26} />
        {/* talk-through highlights */}
        {a('ul') >= 0 && !(f1 >= 0) && <><Underline x1={100} x2={100 + textW('peptidoglycan', 24, 600)} y={by + 78} p={fe(a('ul'), 0.4)} /><Underline x1={wx + 76} x2={wx + 76 + textW('lysozyme', 24, 600)} y={wy - 14} p={fe(a('ul') - 0.3, 0.4)} /></>}
        {between(a('swaparrow'), a('ghostE')) > 0 && <Arrow x1={130} y1={by + 40} x2={wx + 90} y2={wy - 50} color={C.primary} width={3} head={12} bend={-120} opacity={between(a('swaparrow'), a('ghostE'))} />}
        {ringOn('ringAS', 'ringCleft') && <InkRing cx={nx - 30} cy={ny - 10} rx={90} ry={50} p={fe(a('ringAS'), 0.6)} />}
        {ringOn('ringESC', 'cite') && <InkRing cx={E2[0]} cy={792} rx={60} ry={30} p={fe(a('ringESC'), 0.6)} />}
      </g>
      <SideNote x={930} y={420} text="two new names in one sentence" size={21} opacity={between(a('pulse'), a('ringAS'))} />
      {/* the ghost of our model: which is which */}
      <g opacity={fi(a('ghostE')) * (1 - 0.6 * fi(a('fix1')))}>
        <Enzyme x={G[0]} y={G[1]} s={GS} opacity={0.75}><Substrate kind="gen" dy={-150} opacity={fi(a('ghostS'))} /></Enzyme>
        <Label lx={G[0] + 170} ly={G[1] + 60} text="enzyme: lysozyme" size={22} />
        <Label lx={G[0] + 110} ly={G[1] - 200} text="substrate: peptidoglycan" size={22} opacity={fi(a('ghostS'))} />
        {a('ringCleft') >= 0 && <InkRing cx={gcx} cy={gcy} rx={52} ry={40} p={fe(a('ringCleft'), 0.6)} color={C.teal} />}
        <Txt x={G[0] + 110} y={G[1] + 100} size={18} weight={700} fill={C.teal} opacity={fi(a('ringCleft'))}>the active site is part of the enzyme</Txt>
      </g>
      <QuoteTab x={940} y={742} w={910} quote={QR} source="June 2024 examiner report" size={17} opacity={fi(a('cite')) * (1 - fi(a('ticks')))} />
      <g opacity={fi(a('ticks'))}>
        <rect x={940} y={742} width={910} height={160} rx={14} fill="#F2FAF5" stroke="#1D8A4E" strokeWidth={3} />
        <Txt x={962} y={776} size={17} weight={800} fill="#1D6B40">s24_22 Q3(a), MS p.13 drawing points</Txt>
        {['active site on lysozyme, labelled', 'complementary peptidoglycan, labelled', 'enzyme-substrate complex, drawn and labelled'].map((t, i) =>
          <g key={t} opacity={fi(a('ticks') - i * 0.3)}><Txt x={962} y={812 + i * 32} size={22} weight={700} fill="#1D6B40">✓ {t}</Txt></g>)}
      </g>
    </g>
  );
}
