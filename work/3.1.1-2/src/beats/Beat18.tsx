/** How it is asked, with the real question on screen. Forms surface (two cited forms + our wording contrast)
 * → the verbatim s24_22 Q3(a) instruction (no Cambridge artwork, no answer space) → 5 s anchored read →
 * the credited points land on our lock-and-key model with the lysozyme labels → the bread answered. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag, Lines, Cite} from '../../shared/src/Type';
import {Enzyme, Substrate, Products, Ticks, ComplexBracket, ModelTag, Label, pt, MiniEnzyme} from '../Model';
import {Mouth, Bread, Beads, TongueCells} from '../Scenes';
import {Strike, GOOD, PEN} from '../Panels';
import {fi, fe, path, between} from '../util';

const QT = '"Draw labelled and annotated diagrams in the\nspace provided to show how the lock and key\nhypothesis was used to explain the mechanism\nof action of lysozyme on peptidoglycan."';
const PTS = ['active site with a specific shape as part of a lysozyme molecule drawn and active site labelled',
  'complementary shaped peptidoglycan drawn and labelled', 'enzyme-substrate complex drawn and labelled',
  'lysozyme with same shaped active site and two products / NAM and NAG drawn'];
export default function Beat18(s: any) {
  const {a} = s;
  const out = fe(a('q'), 0.8);
  const L = a('land');
  const X = 1260, Y = 560, S = 0.62;
  const [dx, dy] = L >= 0.6 ? path(L - 0.6, [[0, 0, -175], [0.8, 0, 0]]) : [0, -175];
  const prodAge = L - 2.8, lv = prodAge >= 0 ? fe(prodAge, 1.2) : 0;
  const tick = (i: number) => fi(L - [0.4, 1.4, 2.0, 3.6][i], 0.3);
  const cs = a('contrast');
  const seat = a('seat');
  const [bx, byy] = seat >= 0 ? path(seat, [[0, 740, 640], [1.0, 668, 700]]) : [740, 640];
  return (
    <g>
      {/* forms surface */}
      <g opacity={1 - out} transform={`translate(${-500 * out} 0)`}>
        <Txt x={90} y={250} size={22} weight={800} fill={C.muted} opacity={fi(a('open'))}>HOW IT IS ASKED</Txt>
        <g opacity={fi(a('r1'))}>
          <Txt x={90} y={320} size={34} weight={800}>draw labelled diagrams</Txt><Cite x={90} y={352} text="s24_22 Q3(a), 3 marks" size={19} />
          <Lines x={90} y={386} size={18} step={23} weight={600} fill={C.muted} italic opacity={fi(a('r1b'))} text={'MS p.13: "labelled or included in an annotation"; "max 2 if no ref. to specific example"'} />
        </g>
        <g opacity={fi(a('r2'))}>
          <Txt x={90} y={470} size={34} weight={800}>describe and explain the mode of action</Txt><Cite x={90} y={502} text="s24_23 Q4(b), 5 marks" size={19} />
          <Lines x={90} y={536} size={18} step={23} weight={600} fill={C.muted} italic opacity={fi(a('r2b'))} text={'MS p.9: "max 4 if no reference to laccase / monolignols"'} />
        </g>
        <g opacity={fi(cs)}>
          <rect x={90} y={600} width={900} height={170} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
          <Txt x={112} y={652} size={27} weight={800} fill={C.primary}>✗</Txt>
          <Txt x={150} y={652} size={27} weight={600} fill={PEN} italic>the substrate is the same shape as the active site</Txt>
          <Strike x1={146} x2={150 + 600} y={643} p={fe(cs - 0.5, 0.5)} width={4} />
          <Txt x={112} y={704} size={27} weight={800} fill={GOOD} opacity={fi(cs - 0.9)}>✓ the substrate is complementary in shape to the active site</Txt>
          <Txt x={112} y={750} size={16} weight={600} fill={C.muted} italic>our wording contrast; based on S21/12 Q12, key A</Txt>
        </g>
      </g>
      {/* the real question, verbatim */}
      <g opacity={fi(a('q'), 0.6)}>
        <rect x={70} y={210} width={820} height={330} rx={16} fill="#FBF8F1" stroke={C.line} strokeWidth={2} />
        <Txt x={94} y={246} size={18} weight={800} fill={C.primary}>THE QUESTION · verbatim, QP p.7</Txt>
        <Lines x={94} y={296} size={30} step={40} weight={700} text={QT} />
        <Txt x={94} y={516} size={18} weight={700} fill={C.muted}>9700/22 June 2024 Q3(a), 3 marks · answer space and artwork not reproduced</Txt>
        <Tag x={640} y={246} text="draw and label" size={22} fill={C.white} bg={C.primary} stroke={C.primary} opacity={fi(a('read'))} />
      </g>
      {/* our model, lysozyme labels */}
      <g opacity={fi(L, 0.5)}>
        <Enzyme x={X} y={Y} s={S}>
          {prodAge < 0 && <Substrate kind="gen" dx={dx} dy={dy} />}
          {prodAge < 0 && L >= 1.4 && <Ticks p={fi(L - 1.4, 0.3)} />}
          {prodAge >= 0 && <Products lx={-170 * lv} ly={-150 * lv} rx={170 * lv} ry={-160 * lv} lrot={-20 * lv} rrot={20 * lv} />}
          <ComplexBracket p={between(L - 2.0, prodAge, 0.3)} />
        </Enzyme>
        <ModelTag x={X + 250} y={Y + 150} caption={false} size={15} />
        <Label lx={X - 150} ly={Y + 170} text="lysozyme" size={24} />
        <Label lx={X + 150} ly={Y - 20} tx={pt(X, Y, S, 110, -100)[0]} ty={pt(X, Y, S, 110, -100)[1]} text="active site" size={22} />
        <Label lx={X - 330} ly={Y - 230} text="peptidoglycan" size={22} opacity={1 - fi(prodAge)} />
        <Txt x={X - 60} y={Y + 210} size={22} weight={800} fill={C.teal} anchor="middle" opacity={between(L - 2.0, prodAge)}>enzyme-substrate complex</Txt>
        {prodAge >= 0 && <g opacity={fi(prodAge - 0.6)}>
          <Txt x={pt(X, Y, S, 40 - 170 * lv, -150 * lv - 150)[0]} y={pt(X, Y, S, 40 - 170 * lv, -150 * lv - 150)[1] - 70} size={22} weight={800} anchor="middle">NAM</Txt>
          <Txt x={pt(X, Y, S, 100 + 170 * lv, -160 * lv - 150)[0]} y={pt(X, Y, S, 100 + 170 * lv, -160 * lv - 150)[1] - 70} size={22} weight={800} anchor="middle">NAG</Txt>
        </g>}
        <rect x={930} y={770} width={920} height={170} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Txt x={950} y={796} size={16} weight={800} fill={C.muted}>MS p.13 drawing points · any three from four; peptidoglycan's structure is not drawn</Txt>
        {PTS.map((t, i) => <g key={i}>
          <Txt x={950} y={826 + i * 30} size={17} weight={700} fill={tick(i) > 0 ? '#1D6B40' : C.muted}>{tick(i) > 0 ? '✓' : '·'} {t}</Txt>
        </g>)}
      </g>
      {/* the bread, answered */}
      <g opacity={fi(a('bread'))}>
        <rect x={70} y={560} width={820} height={370} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Txt x={92} y={592} size={16} weight={800} fill={C.muted}>THE BREAD (Beat 1), MODEL</Txt>
        <Mouth x={250} y={740} s={0.36} saliva={1}><Bread /></Mouth>
        <MiniEnzyme x={640} y={740} s={0.4} />
        <Beads x={bx} y={byy} n={5} r={11} />
        <Txt x={660} y={836} size={20} weight={800} anchor="middle">amylase · extracellular</Txt>
        <Txt x={660} y={862} size={17} weight={700} fill={C.teal} anchor="middle" opacity={fi(seat)}>active site complementary to starch</Txt>
        <g transform="translate(120 872) scale(0.45)"><TongueCells x={0} y={0} /></g>
        <Tag x={260} y={904} text="tongue cells: not a substrate" size={17} fill={C.primary} anchor="start" opacity={fi(a('tag'))} />
      </g>
    </g>
  );
}
