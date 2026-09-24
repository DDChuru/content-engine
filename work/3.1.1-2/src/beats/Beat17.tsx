/** What I told you, read off the model. NO new slide: the familiar pieces (Beat 4 cell, the model in bound,
 * the energy profile, the two hypothesis panels) static, key points brightened in place, cue by cue. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {Enzyme, Substrate, Ticks, ComplexBracket, ModelTag, Label, pt} from '../Model';
import {EnergyGraph} from '../Graph';
import {CellScene} from './Beat04';
import {Frame, LKRun, PANEL, LKC, IFC} from './Beat12';
import {IFRun, Strip} from './Beat13';
import {fi, fe, pulse} from '../util';

export default function Beat17(s: any) {
  const {a} = s;
  const on = (k: string) => (a(k) >= 0 ? Math.max(0.35, pulse(a(k), 1.6)) : 0);
  const X = 830, Y = 470, S = 0.72;
  const [tx, ty] = pt(X, Y, S, 124, -104);
  return (
    <g opacity={fi(a('open'), 0.6)}>
      <g transform="translate(20 180) scale(0.38)"><CellScene a={a} showAll glowIn={on('intra')} glowOut={on('extra')} /></g>
      <Enzyme x={X} y={Y} s={S} trace={on('site') > 0 ? Math.min(1, fe(a('site'), 0.8)) : 0} pulse={pulse(a('unch'), 1.2)}>
        <Substrate kind="gen" trace={on('site') > 0 ? Math.min(1, fe(a('site'), 0.8)) : 0} />
        <Ticks p={1} glow={pulse(a('ticks'), 1.2) + pulse(a('ticks') - 1.2, 1.2)} />
        <ComplexBracket p={0.6} glow={on('esc')} />
      </Enzyme>
      <ModelTag x={X - 260} y={Y + 150} caption={false} size={15} />
      <Label lx={X} ly={Y + 196} text="globular protein · biological catalyst" size={26} anchor="middle" hi={on('cap') > 0.36} />
      <Tag x={X + 200} y={Y - 230} text="specificity" size={22} fill={C.white} bg={on('spec') > 0 ? C.primary : C.muted} stroke={C.line} />
      <Label lx={X + 200} ly={Y - 170} text="enzyme–substrate complex" size={22} color={C.teal} hi={on('esc') > 0.36} />
      <Tag x={X + 200} y={Y + 70} text="✓ unchanged" size={22} fill="#1D6B40" bg={on('unch') > 0 ? '#DDF2E5' : C.white} />
      <g transform="translate(1230 180) scale(0.45)">
        <EnergyGraph x={230} y={270} w={1100} h={540} v={{axes: 1, yl: 1, xl: 1, sub: 1, prod: 1, u: 1, c: 1, ea1: 1, ea2: 1, red: 1}} hi={{ea2: on('ea')}} small />
      </g>
      {/* the two hypothesis panels, beneath */}
      <g transform="translate(70 700) scale(0.33)"><g transform={`translate(${-PANEL.lk.x} ${-PANEL.y})`}>
        <Frame which="lk" tick={1} glow={on('lk')} /><LKRun seat={-1} complex={-1} leave={1e9} same={1e9} />
      </g></g>
      <Tag x={375} y={760} text="lock-and-key: a fixed shape" size={20} fill={C.white} bg={on('lk') > 0 ? LKC : C.muted} stroke={C.line} />
      <Tag x={375} y={800} text="active site shape unchanged" size={18} fill={C.primary} />
      <g transform="translate(700 700) scale(0.33)"><g transform={`translate(${-PANEL.if.x} ${-PANEL.y})`}>
        <Frame which="if" glow={on('if')} /><IFRun cl={-1} match={-1} complex={-1} leave={1e9} reopen={-1} />
      </g></g>
      <Strip x={1010} y={790} f1={1} f2={1} f3={1} glow={on('if')} />
      <Tag x={1010} y={890} text="induced fit: changes shape to fit, then returns" size={20} fill={C.white} bg={on('if') > 0 ? IFC : C.muted} stroke={C.line} />
    </g>
  );
}
