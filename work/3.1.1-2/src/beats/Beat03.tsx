/** A globular protein, and a catalyst. The chain draws as a compact tangle and settles into the rest-lk
 * silhouette; captions globular protein / biological catalyst; a reaction arrow speeds; unchanged tick. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Lines} from '../../shared/src/Type';
import {Enzyme, ModelTag, Label} from '../Model';
import {RxArrow} from '../Scenes';
import {fi, fe, pulse} from '../util';

export default function Beat03(s: any) {
  const {a, local} = s;
  const X = 640, Y = 560;
  const tangle = fe(a('fold'), 1.6);
  const settle = fe(a('fold') - 1.4, 0.8);
  const speed = a('rate') >= 0 ? 0.35 + 0.65 * fe(a('rate'), 0.8) : 0.15;
  const bright = a('rate') >= 0 ? 1 : 0.5;
  const tick = fe(a('unchanged'), 0.4);
  const fw = pulse(a('forward'), 1.2);
  return (
    <g>
      <Txt x={X + 290} y={Y - 250} size={36} weight={800} fill={C.ink} opacity={fi(a('open'), 0.4)}>What is an enzyme?</Txt>
      <Enzyme x={X} y={Y} s={1.05} tangle={settle} backbone={a('fold') >= 0 ? tangle : 0} pulse={pulse(a('unchanged'), 0.8)} cleftGlow={fw} />
      <ModelTag x={X} y={Y + 245} opacity={fi(a('fold') - 1.6)} />
      <g opacity={fi(a('fold') - 1.8)}>
        <Label lx={X + 290} ly={Y - 170} tx={X + 190} ty={Y - 110} text="globular protein" size={32} hi={fw > 0} />
      </g>
      <Lines x={X + 290} y={Y - 128} size={19} step={24} weight={600} fill={C.muted} italic opacity={fi(a('chains'))}
        text={'this model shows one chain;\na globular protein can have more than one'} />
      <Tag x={X + 290} y={Y - 44} text="recall 2.3.4: globular, generally soluble, physiological roles" size={19} fill={C.teal} opacity={fi(a('recall'))} />
      <g opacity={fi(a('catalyst'))}>
        {fw > 0 && <rect x={X - 200} y={Y + 300} width={400} height={62} rx={14} fill={C.accent} opacity={0.5 * fw} />}
        <Txt x={X} y={Y + 342} size={36} weight={800} fill={C.primary} anchor="middle">biological catalyst</Txt>
      </g>
      <g opacity={fi(a('rate'))}>
        <Txt x={1180} y={560} size={24} weight={800}>reaction</Txt>
        <RxArrow x={1320} y={552} t={local} speed={speed} bright={bright} len={200} />
        <Txt x={1320} y={612} size={20} weight={700} fill={C.muted} opacity={fi(a('rate') - 0.6)}>faster with the enzyme</Txt>
      </g>
      {tick > 0 && <g opacity={tick}>
        <path d={`M${X + 150} ${Y + 40}l22 24l44 -52`} stroke="#1D8A4E" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <Tag x={X + 330} y={Y + 70} text="unchanged at the end" size={24} fill="#1D6B40" />
      </g>}
      <Tag x={1320} y={700} text="ready to go again" size={22} fill="#1D6B40" opacity={fi(a('again'))} />
    </g>
  );
}
