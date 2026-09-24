/** Inside the cell, or secreted to work outside. Catalase inside (balanced formula tag only); a second
 * silhouette MOVES out of the cell (secretion named, no vesicle mechanism); amylase with starch beads and
 * lipase outside. Brackets intracellular / extracellular. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, Lines} from '../../shared/src/Type';
import {Cell, Beads, RegionTag} from '../Scenes';
import {Enzyme, Label} from '../Model';
import {fi, fe, pulse, path} from '../util';

export const CELL4 = {x: 660, y: 580, rx: 420, ry: 270};
export function CellScene({a, dim = 0, secrete = -1, glowIn = 0, glowOut = 0, pulseBoth = 0, showAll = false}: any) {
  const V = (k: string, d = 0.45) => (showAll ? 1 : fi(a(k), d));
  const sec = showAll ? 99 : secrete >= 0 ? secrete : a('secrete');
  const [ax, ay] = path(sec, [[0, 850, 640], [1.6, 1180, 590], [2.6, 1330, 505]]);
  return (
    <g opacity={1 - dim}>
      <Cell x={CELL4.x} y={CELL4.y} rx={CELL4.rx} ry={CELL4.ry} opacity={V('open')} />
      <Txt x={CELL4.x} y={CELL4.y + CELL4.ry + 40} size={19} weight={700} fill={C.muted} anchor="middle" opacity={V('open')}>a cell (MODEL; no organelles drawn)</Txt>
      <g opacity={V('inside')}>
        <Enzyme x={520} y={515} s={0.36} pulse={pulseBoth} />
        <Label lx={520} ly={610} text="catalase" anchor="middle" size={26} opacity={V('catalase')} />
      </g>
      <g opacity={V('h2o2')}>
        <Tag x={520} y={668} text="2H₂O₂ → 2H₂O + O₂" size={24} fill={C.ink} anchor="middle" />
        <Lines x={520} y={708} size={16} step={20} weight={600} fill={C.muted} anchor="middle" italic text={'balanced formula equation only;\nthe atom-resolved reaction is drawn in L2'} />
      </g>
      <RegionTag x={CELL4.x} y={390} text="intracellular: inside the cell" opacity={V('intra')} glow={glowIn} color={glowIn > 0 ? C.primary : C.teal} />
      {sec > -1e8 && <g opacity={showAll ? 1 : fi(sec + 0.3)}>
        <Enzyme x={ax} y={ay} s={0.36} pulse={pulseBoth} />
      </g>}
      <g opacity={V('amylase')}>
        <Label lx={1330} ly={380} text="amylase" anchor="middle" size={26} />
        <Txt x={1330} y={412} size={17} weight={600} fill={C.muted} anchor="middle" italic>in saliva, in the mouth</Txt>
      </g>
      <Beads x={1470} y={505} n={6} r={12} opacity={V('starch')} label="starch" />
      <g opacity={V('lipase')}>
        <Enzyme x={1330} y={720} s={0.36} pulse={pulseBoth} />
        <Label lx={1330} ly={820} text="lipase" anchor="middle" size={26} />
        <Txt x={1330} y={850} size={17} weight={600} fill={C.muted} anchor="middle" italic>in the intestine</Txt>
      </g>
      <RegionTag x={1560} y={300} text="extracellular: outside the cell" opacity={V('extra')} glow={glowOut} color={glowOut > 0 ? C.primary : C.teal} />
    </g>
  );
}
export default function Beat04(s: any) {
  const {a} = s;
  const pb = pulse(a('same'), 0.9);
  const glow = a('where') >= 0 ? fe(a('where'), 0.4) : 0;
  return (
    <g>
      <Txt x={1180} y={250} size={34} weight={800} opacity={fi(a('open'))}>Where does it work?</Txt>
      <CellScene a={a} pulseBoth={pb} glowIn={glow} glowOut={glow} />
      <g opacity={fi(a('secrete'))}>
        <Lines x={1180} y={898} size={18} step={22} weight={600} fill={C.muted} italic
          text={'secreted: released from the cell\n(the mechanism, exocytosis, is Topic 1/4)'} />
      </g>
      <Txt x={660} y={930} size={24} weight={800} fill={C.primary} anchor="middle" opacity={fi(a('same'))}>same kind of molecule · different place</Txt>
    </g>
  );
}
