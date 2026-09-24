/** How it is asked, with the real question on screen. v2 (Durai's review): NO text-only frame. ONE model stays
 * on screen for the whole beat: while "draw labelled diagrams" is read, the substrate seats and the diagram is
 * LABELLED (enzyme, active site, substrate, complex; then the supplied-example annotations); for "mode of action"
 * the model runs bound → products (one-frame switch) → unchanged, with a compact energy inset; for "complementary
 * shapes" both outlines are traced. The forms are a compact card BESIDE the model. Then the verbatim s24_22 Q3(a)
 * instruction (no Cambridge artwork, no answer space) → 5 s anchored read → the credited points land on the same
 * model with the lysozyme labels → the bread answered. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag, Lines, Cite} from '../../shared/src/Type';
import {Enzyme, Substrate, Products, Ticks, ComplexBracket, ModelTag, Label, pt, MiniEnzyme} from '../Model';
import {Mouth, Bread, Beads, TongueCells} from '../Scenes';
import {EnergyGraph} from '../Graph';
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
  const r1 = a('r1'), r2 = a('r2'), cs0 = a('contrast');
  // phase 1 (before the question): seat at r1, products at r2, a fresh substrate apart (traced) at contrast
  const p1Seat = r1 >= 0.3 ? path(r1 - 0.3, [[0, 0, -175], [0.8, 0, 0]]) : [0, -175];
  const p1Prod = r2 - 1.0, lv1 = p1Prod >= 0 ? fe(p1Prod, 1.2) : 0;
  const fresh = cs0 >= 0;
  const inP1 = L < 0;
  const [dx, dy] = L >= 0.6 ? path(L - 0.6, [[0, 0, -175], [0.8, 0, 0]]) : fresh || !inP1 ? [0, -175] : p1Seat;
  const lab = (t: number) => fi(r1 - t, 0.3) * (1 - fi(a('q'), 0.5));
  const exA = between(a('r1b'), a('r2b'), 0.3) * (1 - fi(a('q'), 0.5)), exB = fi(a('r2b')) * (1 - fi(a('q'), 0.5));
  const complexOn = between(r1 - 1.9, p1Prod, 0.3) * (1 - fi(a('q'), 0.5));
  const trace = fresh ? fe(cs0 - 0.3, 0.8) * (1 - fi(a('q'), 0.5)) : 0;
  const prodAge = L - 2.8, lv = prodAge >= 0 ? fe(prodAge, 1.2) : 0;
  const tick = (i: number) => fi(L - [0.4, 1.4, 2.0, 3.6][i], 0.3);
  const cs = a('contrast');
  const seat = a('seat');
  const [bx, byy] = seat >= 0 ? path(seat, [[0, 740, 640], [1.0, 668, 700]]) : [740, 640];
  return (
    <g>
      {/* forms: a COMPACT card beside the model (never alone on the page) */}
      <g opacity={(1 - out) * fi(a('open'))} transform={`translate(${-500 * out} 0)`}>
        <rect x={70} y={210} width={830} height={560} rx={16} fill="#FBF8F1" stroke={C.line} strokeWidth={2} />
        <Txt x={94} y={246} size={18} weight={800} fill={C.primary}>HOW IT IS ASKED · two forms</Txt>
        <g opacity={fi(a('r1'))}>
          <Txt x={94} y={300} size={30} weight={800}>1 · draw labelled diagrams</Txt><Cite x={94} y={330} text="s24_22 Q3(a), 3 marks" size={18} />
          <Lines x={94} y={362} size={17} step={22} weight={600} fill={C.muted} italic opacity={fi(a('r1b'))} text={'MS p.13: "labelled or included in an annotation";\n"max 2 if no ref. to specific example"'} />
        </g>
        <g opacity={fi(a('r2'))}>
          <Txt x={94} y={450} size={30} weight={800}>2 · describe and explain the mode of action</Txt><Cite x={94} y={480} text="s24_23 Q4(b), 5 marks" size={18} />
          <Lines x={94} y={512} size={17} step={22} weight={600} fill={C.muted} italic opacity={fi(a('r2b'))} text={'MS p.9: "max 4 if no reference to laccase / monolignols"'} />
        </g>
        <g opacity={fi(cs)}>
          <rect x={94} y={560} width={782} height={186} rx={12} fill={C.white} stroke={C.line} strokeWidth={2} />
          <Txt x={114} y={606} size={24} weight={800} fill={C.primary}>✗</Txt>
          <Txt x={146} y={606} size={24} weight={600} fill={PEN} italic>the substrate is the same shape as the active site</Txt>
          <Strike x1={142} x2={146 + 540} y={598} p={fe(cs - 0.5, 0.5)} width={4} />
          <Txt x={114} y={660} size={24} weight={800} fill={GOOD} opacity={fi(cs - 0.9)}>✓ the substrate is complementary in shape</Txt>
          <Txt x={146} y={692} size={24} weight={800} fill={GOOD} opacity={fi(cs - 0.9)}>to the active site</Txt>
          <Txt x={114} y={730} size={15} weight={600} fill={C.muted} italic>our wording contrast; based on S21/12 Q12, key A</Txt>
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
      {/* ONE model for the whole beat (phase 1: forms; phase 2: the real question) */}
      <g>
        <Enzyme x={X} y={Y} s={S} trace={trace}>
          {inP1 && !fresh && p1Prod < 0 && <Substrate kind="gen" dx={dx} dy={dy} />}
          {inP1 && !fresh && p1Prod < 0 && r1 >= 1.1 && <Ticks p={fi(r1 - 1.1, 0.3)} />}
          {inP1 && !fresh && p1Prod >= 0 && <Products lx={-170 * lv1} ly={-150 * lv1} rx={170 * lv1} ry={-160 * lv1} lrot={-20 * lv1} rrot={20 * lv1} opacity={1 - fi(p1Prod - 2.4, 0.6)} />}
          {inP1 && fresh && <Substrate kind="gen" dx={0} dy={-175} opacity={fi(cs0, 0.4)} trace={trace} />}
          {!inP1 && prodAge < 0 && <Substrate kind="gen" dx={dx} dy={dy} />}
          {!inP1 && prodAge < 0 && L >= 1.4 && <Ticks p={fi(L - 1.4, 0.3)} />}
          {!inP1 && prodAge >= 0 && <Products lx={-170 * lv} ly={-150 * lv} rx={170 * lv} ry={-160 * lv} lrot={-20 * lv} rrot={20 * lv} />}
          <ComplexBracket p={inP1 ? complexOn : between(L - 2.0, prodAge, 0.3)} />
        </Enzyme>
        {/* phase 1: the diagram being labelled */}
        <Label lx={X - 250} ly={Y + 170} tx={pt(X, Y, S, -150, 60)[0]} ty={pt(X, Y, S, -150, 60)[1]} text="enzyme" size={24} opacity={lab(0.5)} />
        <Label lx={X + 150} ly={Y - 20} tx={pt(X, Y, S, 110, -100)[0]} ty={pt(X, Y, S, 110, -100)[1]} text="active site" size={22} opacity={lab(1.0) * (1 - fi(L, 0.3))} />
        <Label lx={X - 330} ly={Y - 230} tx={pt(X, Y, S, 40, -190)[0]} ty={pt(X, Y, S, 40, -190)[1]} text="substrate" size={22} opacity={lab(1.4) * (1 - fi(r2 - 1.0, 0.3))} />
        <Txt x={X + 70} y={Y + 214} size={22} weight={800} fill={C.teal} anchor="middle" opacity={complexOn}>enzyme–substrate complex</Txt>
        <Txt x={X - 250} y={Y + 198} size={19} weight={700} fill={C.primary} italic opacity={exA}>e.g. lysozyme</Txt>
        <Txt x={X - 330} y={Y - 202} size={19} weight={700} fill={C.primary} italic opacity={exA * (1 - fi(r2 - 1.0, 0.3))}>e.g. peptidoglycan</Txt>
        <Txt x={X - 250} y={Y + 198} size={19} weight={700} fill={C.primary} italic opacity={exB}>e.g. laccase</Txt>
        <Tag x={X + 150} y={Y - 250} text="annotation links the drawing to the example" size={17} fill={C.primary} opacity={exA} />
        <Tag x={X + 150} y={Y - 250} text="name the enzyme or its substrate" size={17} fill={C.primary} opacity={exB * (1 - fi(cs0, 0.3))} />
        <Label lx={X - 330} ly={Y - 230} text="products" size={22} opacity={inP1 && !fresh ? fi(p1Prod - 0.6, 0.3) * (1 - fi(p1Prod - 2.4, 0.6)) : 0} />
        <Tag x={X + 150} y={Y + 80} text="✓ enzyme unchanged" size={20} fill="#1D6B40" opacity={between(r2 - 2.4, cs0, 0.3)} />
        <Tag x={X + 150} y={Y - 250} text="complementary in shape" size={20} fill={C.teal} opacity={trace} />
        {/* mode of action: compact energy inset beside the model */}
        <g opacity={between(r2 + 0.4, cs0, 0.4)} transform="translate(1440 620) scale(0.28)">
          <rect x={150} y={200} width={1280} height={760} rx={30} fill={C.white} stroke={C.line} strokeWidth={5} />
          <EnergyGraph x={230} y={270} w={1100} h={540} v={{axes: 1, sub: 1, prod: 1, u: 1, c: 1, red: 1}} small />
        </g>
        <Txt x={1482} y={666} size={16} weight={700} fill={C.muted} opacity={between(r2 + 0.4, cs0, 0.4)}>lowers the activation energy</Txt>
      </g>
      {/* phase 2 labels */}
      <ModelTag x={X + 250} y={Y - 110} caption={false} size={15} />
      <g opacity={fi(L, 0.5)}>
        <Label lx={X - 150} ly={Y + 170} text="lysozyme" size={24} />
        <Label lx={X + 150} ly={Y - 20} tx={pt(X, Y, S, 110, -100)[0]} ty={pt(X, Y, S, 110, -100)[1]} text="active site" size={22} />
        <Label lx={X - 330} ly={Y - 230} text="peptidoglycan" size={22} opacity={1 - fi(prodAge)} />
        <Txt x={X + 70} y={Y + 214} size={22} weight={800} fill={C.teal} anchor="middle" opacity={between(L - 2.0, prodAge)}>enzyme-substrate complex</Txt>
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
