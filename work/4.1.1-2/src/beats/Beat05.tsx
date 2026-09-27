import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, RBC, Wash, Sentence, Stage, C, Txt, Cite, SCHEM, PARTS, CY, U, textW} from '../kit';
import {BILAYER, fmmLayout, FACE} from '../FluidMosaicMembrane';
import {InkRing} from '../../shared/src/Type';
import {T4} from '../t4-palette';

/** Beat 5 · The handle (a memory aid), converted at once into the creditworthy sentence; why a bilayer suits a cell. */
export default function Beat05(s: any) {
  const t = gt(s), a = s.a, u = U, cy = CY;
  const Lf = fmmLayout({cx: 960, cy, u, show: BILAYER});
  const why = fe(a('why'), 0.8), rbc = fe(a('rbc'), 0.7);
  const rx = 1640, ry = 450, rr = 60 + 55 * why;
  const hx = 960, hy = 300, hw = textW('heads to the water, tails to each other', 30, 600);
  return (
    <g>
      <Wash x={Lf.x0 - 24} y={Lf.outerHead - 30} w={Lf.width + 48} h={60} o={0.9 * pulse(a('c1'), 2.4)} />
      <Wash x={Lf.x0 - 24} y={Lf.innerHead - 30} w={Lf.width + 48} h={60} o={0.9 * pulse(a('c1'), 2.4)} />
      <Wash x={Lf.x0 - 24} y={cy - 70} w={Lf.width + 48} h={140} o={0.9 * pulse(a('c2'), 2.4)} />
      <Stage s={s} mem={{show: BILAYER}} n={[30, 30]} />
      <Lbl x={90} y={cy - FACE * u - 34} text={rbc > 0 ? 'outside the cell (watery): plasma' : 'outside the cell (watery)'} size={24} fill={C.teal} />
      <Lbl x={90} y={cy + FACE * u + 50} text="cytoplasm (watery)" size={24} fill={C.teal} />
      <Lbl x={Lf.x0 - 60} y={cy + 8} text="hydrophobic core" size={24} anchor="end" fill={C.muted} />
      <Lbl x={Lf.x1 + 40} y={Lf.outerHead - 70} text="phospholipid bilayer" size={26} o={1 - why} />
      {/* the handle: a memory aid, boxed as such */}
      {fi(a('handle'), 0.5) > 0 && <g opacity={fi(a('handle'), 0.5)}>
        {fi(a('aid'), 0.4) > 0 && <rect data-role="decor" x={hx - hw / 2 - 20} y={hy - 34} width={hw + 40} height={50} rx={10} fill="#FFFFFF" stroke={C.muted} strokeWidth={2} strokeDasharray="7 5" opacity={fi(a('aid'), 0.4)} />}
        <Txt x={hx} y={hy} size={30} weight={600} anchor="middle" italic>heads to the water, tails to each other</Txt>
        <Pill x={hx - hw / 2 - 20} y={hy - 50} text="handle" />
        <Pill x={hx + hw / 2 + 20} y={hy - 50} text="memory aid only" anchor="end" o={fi(a('aid'), 0.4)} fill={C.primary} />
      </g>}
      <Sentence x={210} y={742} w={1500} o={fe(a('written'), 0.6)} tag="written properly" size={27} lines={[
        {text: 'Phospholipids form a bilayer because the hydrophilic heads interact with water on both sides,', o: fi(a('c1'), 0.5), hi: ['because'], hiO: fi(a('c2'), 0.5)},
        {text: 'while the hydrophobic tails are excluded from water and held together by hydrophobic interactions.', o: fi(a('c2'), 0.5), hi: ['while'], hiO: fi(a('c2'), 0.5)},
      ]} />
      {/* why it matters: the red blood cell, watery inside and out */}
      <RBC x={rx} y={ry} r={rr} window={why} glow={pulse(a('compart'), 1.6)} />
      <Lbl x={rx} y={ry + rr + 34} text="red blood cell" anchor="middle" size={22} o={why} />
      <Lbl x={rx} y={ry - rr - 58} text="plasma (watery)" anchor="middle" size={20} fill={C.teal} o={why} />
      <Lbl x={rx} y={ry + 4} text="cytoplasm" anchor="middle" size={17} fill={C.teal} o={why} />
      {rbc > 0 && <path data-role="decor" d={`M${rx - rr} ${ry}L${Lf.x1 + 14} ${Lf.outerHead}M${rx - rr} ${ry}L${Lf.x1 + 14} ${Lf.innerHead}`} stroke={C.ink} strokeWidth={2} strokeDasharray="6 5" fill="none" opacity={rbc} />}
      <InkRing cx={Lf.x0 + 150} cy={cy - FACE * u - 60} rx={130} ry={46} p={fe(a('separate'), 0.6)} color={C.teal} />
      <InkRing cx={Lf.x0 + 150} cy={cy + FACE * u + 50} rx={130} ry={40} p={fe(a('separate') - 0.3, 0.6)} color={C.teal} />
      <Cite x={rx} y={ry + rr + 62} text="framing: why a bilayer suits a cell" anchor="middle" opacity={fi(a('separate'), 0.5)} />
      {/* next: placeholders where proteins will sit */}
      {fi(a('next'), 0.5) > 0 && [4, 7, 9].map((k, i) => <rect key={i} data-role="decor" x={Lf.x0 + k * u - 24} y={cy - 2.6 * u} width={48} height={5.2 * u} rx={14} fill="none" stroke={T4.proteinEdge} strokeWidth={3} strokeDasharray="8 6" opacity={fi(a('next') - i * 0.2, 0.4)} />)}
      <Pill x={Lf.x0 + 7 * u} y={cy - 2.6 * u - 16} text="next: proteins" anchor="middle" o={fi(a('next'), 0.5)} fill={T4.proteinEdge} />
      <Cite x={Lf.x1 + 40} y={Lf.outerHead - 40} text={SCHEM} opacity={1 - why} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
