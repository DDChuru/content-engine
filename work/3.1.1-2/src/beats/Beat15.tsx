/** The sentence you write: the four clauses land one by one while the model performs each state
 * (traced → bound → reduction bracket inset → products, one-frame switch → unchanged tick). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {Enzyme, Substrate, Products, Ticks, ComplexBracket, ModelTag} from '../Model';
import {EnergyGraph} from '../Graph';
import {Frame, PANEL, LKRun} from './Beat12';
import {IFRun} from './Beat13';
import {fi, fe, path, between} from '../util';

const CL = [
  ['c1', 'The active site of the enzyme is complementary to its substrate;'],
  ['c2', 'the substrate binds, forming an enzyme–substrate complex;'],
  ['c3', 'the enzyme lowers the activation energy, so the reaction is faster;'],
  ['c4', 'the products are released and the enzyme is unchanged and used again.'],
];
export default function Beat15(s: any) {
  const {a} = s;
  const X = 540, Y = 500, S = 0.74;
  const shrink = fe(a('layout'), 0.8);
  const [dx, dy] = a('c2') >= 0 ? path(a('c2'), [[0, 0, -170], [0.8, 0, 0]]) : [0, -170];
  const lv = a('c4') >= 0 ? fe(a('c4'), 1.4) : 0;
  return (
    <g>
      <g opacity={1 - shrink * 0.2} transform={`translate(${1540 * shrink} ${200 * shrink}) scale(${1 - 0.67 * shrink})`}>
        <g><g transform={`translate(${-PANEL.lk.x * shrink} ${-PANEL.y * shrink})`}><Frame which="lk" tick={1} /><LKRun seat={-1} complex={-1} leave={1e9} same={1e9} /><g transform={`translate(${(PANEL.lk.x - PANEL.if.x) * shrink} ${(PANEL.h + 30) * shrink})`}><Frame which="if" /><IFRun cl={-1} match={-1} complex={-1} leave={1e9} reopen={-1} /></g></g></g>
      </g>
      <g opacity={fi(a('layout'))}>
        <Enzyme x={X} y={Y} s={S} trace={between(a('c1'), a('c2')) > 0 ? fe(a('c1'), 0.8) : 0}>
          {a('c4') < 0 && <Substrate kind="gen" dx={dx} dy={dy} trace={between(a('c1'), a('c2')) > 0 ? fe(a('c1'), 0.8) : 0} />}
          {a('c4') < 0 && a('c2') >= 0.8 && <Ticks p={fi(a('c2') - 0.8, 0.3)} />}
          {a('c4') >= 0 && <Products lx={-190 * lv} ly={-90 * lv} rx={190 * lv} ry={-100 * lv} lrot={-25 * lv} rrot={25 * lv} />}
          <ComplexBracket p={between(a('c2') + 0.2, a('c4'))} />
        </Enzyme>
        <ModelTag x={X - 290} y={Y + 150} caption={false} size={16} />
        {a('c4b') >= 0 && <g opacity={fi(a('c4b'))}>
          <path d={`M${X + 120} ${Y + 20}l22 24l44 -52`} stroke="#1D8A4E" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <Tag x={X + 200} y={Y + 50} text="unchanged, used again" size={22} fill="#1D6B40" />
        </g>}
      </g>
      <g opacity={fi(a('c3'))} transform="translate(900 160) scale(0.44)">
        <EnergyGraph x={230} y={270} w={1100} h={540} v={{axes: 1, sub: 1, prod: 1, u: 1, c: 1, red: 1}} small />
      </g>
      <Txt x={1015} y={236} size={18} weight={700} fill={C.muted} opacity={fi(a('c3'))}>energy profile: the reduction</Txt>
      <g opacity={fi(a('layout'))}>
        <rect x={90} y={690} width={1740} height={236} rx={16} fill={C.white} stroke={C.line} strokeWidth={2} />
        <Txt x={116} y={726} size={18} weight={800} fill={C.primary}>THE SENTENCE THE EXAMINERS CREDIT · built clause by clause</Txt>
        {CL.map(([k, t], i) => <g key={k} opacity={fi(a(k), 0.4)}>
          <Txt x={116} y={774 + i * 44} size={30} weight={700} fill={C.ink}>{t}</Txt>
        </g>)}
      </g>
    </g>
  );
}
