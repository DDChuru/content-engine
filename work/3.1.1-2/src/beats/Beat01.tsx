/** Hook and context. Mouth + bread → saliva → starch beads cut into maltose (one-frame link switch, then
 * motion) → tongue cells untouched → amylase model → one cell with many reactions → slow → enzymes land →
 * one arrow ringed → zoom out to the objectives. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag, InkRing} from '../../shared/src/Type';
import {Mouth, Bread, Beads, TongueCells, Cell, RxArrow} from '../Scenes';
import {Enzyme, Substrate, ModelTag, Label, pt} from '../Model';
import {fi, fe, pulse} from '../util';

const ARROWS = Array.from({length: 12}, (_, i) => [640 + (i % 4) * 190 + (Math.floor(i / 4) % 2) * 60, 420 + Math.floor(i / 4) * 130] as [number, number]);
const RING_I = 5;

export default function Beat01(s: any) {
  const {a, local} = s;
  const toCell = fe(a('cell'), 0.9);
  const A = 1 - toCell;
  const cut = a('cut') >= 0.6;
  const spread = cut ? 34 * fe(a('cut') - 0.6, 0.9) : 0;
  const bright = a('speed') >= 0 ? 0.3 + 0.7 * fe(a('speed') - 0.5, 0.6) : a('slow') >= 0 ? 1 - 0.7 * fe(a('slow'), 0.8) : 1;
  const speed = a('speed') >= 0.5 ? 1 : a('slow') >= 0 ? 0.08 : 0.35;
  const zoom = fe(a('zoom'), 1.2);
  const [rx, ry] = ARROWS[RING_I];
  const E = [1500, 560, 0.62];
  return (
    <g>
      {/* ---- phase A: the mouth ---- */}
      <g opacity={A}>
        <Txt x={1000} y={262} size={36} weight={800} fill={C.ink} opacity={fi(a('open'))}>Ever wondered why bread turns sweet</Txt>
        <Txt x={1000} y={306} size={36} weight={800} fill={C.ink} opacity={fi(a('open'))}>if you keep it in your mouth?</Txt>
        <Mouth x={560} y={610} s={0.82} saliva={fi(a('saliva'), 0.8)} opacity={fi(a('open'), 0.6)}>
          <Bread opacity={fi(a('bread'))} />
        </Mouth>
        <Txt x={300} y={872} size={17} weight={600} fill={C.muted} italic opacity={fi(a('open'))}>mouth, side view (MODEL)</Txt>
        <Tag x={640} y={520} text="sweet" size={24} fill={C.white} bg={C.primary} stroke={C.primary} anchor="middle" opacity={fi(a('sweet'))} />
        <Tag x={430} y={700} text="saliva" size={20} fill={C.ink} bg="#DCEBF5" anchor="middle" opacity={fi(a('saliva'))} />
        <Beads x={1010} y={450} n={8} cut={cut} spread={spread} opacity={fi(a('saliva') - 0.4)} label="starch" labelCut="maltose · maltose · maltose · maltose" />
        <Txt x={1010} y={520} size={18} weight={700} fill={C.muted} opacity={fi(a('saliva') - 0.4)}>beads = glucose units (MODEL)</Txt>
        <g opacity={fi(a('cut'))}><Tag x={1010} y={570} text="starch → maltose" size={22} fill={C.primary} /></g>
        <TongueCells x={1010} y={690} opacity={fi(a('cells'))} tag="untouched" tagFill={C.teal} />
        <Txt x={1010} y={672} size={19} weight={700} fill={C.muted} opacity={fi(a('cells'))}>cells of the tongue, in the same saliva</Txt>
        <g opacity={fi(a('enzyme'), 0.6)}>
          <Enzyme x={E[0]} y={E[1]} s={E[2]} pulse={pulse(a('enzyme'), 0.9)} />
          <Label lx={E[0]} ly={E[1] + 150} text="amylase (an enzyme)" anchor="middle" size={26} />
          <ModelTag x={E[0]} y={E[1] + 196} />
        </g>
      </g>
      {/* ---- phase B: one cell, many reactions ---- */}
      <g opacity={toCell * (1 - zoom)} transform={zoom > 0 ? `translate(${rx + 40} ${ry}) scale(${1 + 2.2 * zoom}) translate(${-rx - 40} ${-ry})` : undefined}>
        <Cell x={960} y={560} rx={560} ry={320} />
        <Txt x={960} y={222} size={20} weight={700} fill={C.muted} anchor="middle">one cell (MODEL): each arrow is one reaction</Txt>
        {ARROWS.map(([x, y], i) => {
          const land = a('speed') >= 0 ? fe(a('speed') - i * 0.03, 0.5) : 0;
          return <g key={i}>
            <RxArrow x={x} y={y} t={local + i * 0.37} speed={speed} bright={bright} />
            {land > 0 && <Enzyme x={x + 35} y={y - 36 - 40 * (1 - land)} s={0.1} opacity={land} />}
          </g>;
        })}
        {a('ring') >= 0 && <g>
          <g transform={`translate(${rx + 35} ${ry - 36}) scale(0.1)`}><Substrate kind="gen" opacity={fi(a('ring'))} /></g>
          <InkRing cx={rx + 40} cy={ry - 14} rx={78} ry={60} p={fe(a('ring'), 0.6)} />
          <Txt x={rx + 40} y={ry + 70} size={20} weight={800} fill={C.primary} anchor="middle" opacity={fi(a('ring') - 0.5)}>enzyme + its substrate</Txt>
        </g>}
      </g>
    </g>
  );
}
