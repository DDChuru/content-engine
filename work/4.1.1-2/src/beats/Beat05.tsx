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
  const rx = 1600, ry = 450, rr = 60 + 55 * why;
  const hx = 960, hy = 300, PH = 'heads to the water, tails to each other', hw = textW(PH, 32, 700);
  // memory hook, one link at a time (RULE-MEMORY-HOOKS): l1 heads↔heads + water↔water; l2 tails↔tails + each other↔core
  const off = fi(a('written') - 1.2, 0.8);                      // the mapping stays lit (≥ 2 s completed-map hold) until the sentence builds
  const L1 = fi(a('l1'), 0.4) * (1 - off), L2 = fi(a('l2'), 0.4) * (1 - off);
  const word = (w: string) => { const i = PH.indexOf(w); const x0 = hx - hw / 2 + textW(PH.slice(0, i), 32, 700); return [x0, x0 + textW(w, 32, 700)]; };
  const [hA, hB] = word('heads'), [wA, wB] = word('water'), [tA, tB] = word('tails'), [eA, eB] = word('each other');
  const AMBER = '#F6D38B', BLUE = '#CFE6F4', GREY = '#DCD6CB';
  const top = cy - FACE * u, bot = cy + FACE * u;
  return (
    <g>
      {/* link targets (drawn under the membrane): heads rows, the water above and below, the core */}
      <Wash x={Lf.x0 - 24} y={Lf.outerHead - 30} w={Lf.width + 48} h={60} o={Math.max(0.9 * pulse(a('c1'), 2.4), 0.95 * L1)} fill={L1 > 0 ? AMBER : '#FFF3C4'} />
      <Wash x={Lf.x0 - 24} y={Lf.innerHead - 30} w={Lf.width + 48} h={60} o={Math.max(0.9 * pulse(a('c1'), 2.4), 0.95 * L1)} fill={L1 > 0 ? AMBER : '#FFF3C4'} />
      <Wash x={Lf.x0 - 24} y={cy - 70} w={Lf.width + 48} h={140} o={Math.max(0.9 * pulse(a('c2'), 2.4), 0.95 * L2)} fill={L2 > 0 ? GREY : '#FFF3C4'} />
      <Wash x={80} y={214} w={1760} h={top - 10 - 214} o={0.8 * L1} fill={BLUE} />
      <Wash x={80} y={bot + 12} w={1760} h={936 - bot - 12} o={0.8 * L1} fill={BLUE} />
      <Stage s={s} mem={{show: BILAYER}} n={[30, 30]} />
      <Lbl x={90} y={cy - FACE * u - 34} text={rbc > 0 ? 'outside the cell (watery): plasma' : 'outside the cell (watery)'} size={24} fill={C.teal} />
      <Lbl x={90} y={cy + FACE * u + 50} text="cytoplasm (watery)" size={24} fill={C.teal} />
      <Lbl x={Lf.x0 - 60} y={cy + 8} text="hydrophobic core" size={24} anchor="end" fill={C.muted} />
      <Lbl x={Lf.x1 + 40} y={Lf.outerHead - 70} text="phospholipid bilayer" size={26} o={1 - Math.max(why, fi(a('handle'), 0.5))} />
      {/* the handle: a memory aid, boxed as such; each hook word lights with its target as it is spoken */}
      {fi(a('handle'), 0.5) > 0 && <g opacity={fi(a('handle'), 0.5)}>
        <rect data-role="decor" x={hx - hw / 2 - 22} y={hy - 38} width={hw + 44} height={54} rx={10} fill="#FFFFFF" stroke={C.muted} strokeWidth={2} strokeDasharray={fi(a('aid'), 0.4) > 0 ? '7 5' : undefined} />
        {L1 > 0 && <rect data-role="decor" x={hA - 3} y={hy - 30} width={hB - hA + 6} height={40} rx={6} fill={AMBER} opacity={L1} />}
        {L1 > 0 && <rect data-role="decor" x={wA - 3} y={hy - 30} width={wB - wA + 6} height={40} rx={6} fill={BLUE} opacity={L1} />}
        {L2 > 0 && <rect data-role="decor" x={tA - 3} y={hy - 30} width={tB - tA + 6} height={40} rx={6} fill={GREY} opacity={L2} />}
        {L2 > 0 && <rect data-role="decor" x={eA - 3} y={hy - 30} width={eB - eA + 6} height={40} rx={6} fill={GREY} opacity={L2} />}
        <Txt x={hx} y={hy} size={32} weight={700} anchor="middle" italic>{PH}</Txt>
        <Pill x={hx - hw / 2 - 22} y={hy - 56} text="handle" />
        <Pill x={hx + hw / 2 + 22} y={hy - 56} text="memory aid only" anchor="end" o={fi(a('aid'), 0.4)} fill={C.primary} />
      </g>}
      {/* connectors: hook word → its target (heads → the head row; water → the water; tails / each other → the core) */}
      {L1 > 0 && <g opacity={L1}>
        <path data-role="decor" d={`M${(hA + hB) / 2} ${hy + 18}L${(hA + hB) / 2 - 60} ${Lf.outerHead - 26}`} stroke="#B8801F" strokeWidth={3} strokeDasharray="7 5" fill="none" />
        <path data-role="decor" d={`M${(wA + wB) / 2} ${hy + 18}L${(wA + wB) / 2} ${350}`} stroke="#3D7FA6" strokeWidth={3} strokeDasharray="7 5" fill="none" />
        <Lbl x={Lf.x1 + 34} y={Lf.outerHead + 8} text="heads" size={24} fill="#8A5A0F" o={1} />
        <Lbl x={Lf.x1 + 34} y={Lf.innerHead + 8} text="heads" size={24} fill="#8A5A0F" o={1} />
        <Lbl x={1820} y={362} text="water" size={24} fill="#2F6B8F" anchor="end" o={1} />
        <Lbl x={1820} y={bot + 52} text="water" size={24} fill="#2F6B8F" anchor="end" o={1} />
      </g>}
      {L2 > 0 && <g opacity={L2}>
        <path data-role="decor" d={`M${(tA + eB) / 2} ${hy + 18}L${Lf.x1 - 2.5 * u} ${cy - 40}`} stroke="#6F6A60" strokeWidth={3} strokeDasharray="7 5" fill="none" />
        <Lbl x={Lf.x1 + 34} y={cy + 8} text="tails meet: core" size={24} fill="#4F4A42" o={1} />
      </g>}
      <Sentence x={210} y={742} w={1500} o={fe(a('written'), 0.6)} tag="written properly" size={27} lines={[
        {text: 'Phospholipids form a bilayer because the hydrophilic heads interact with water on both sides,', o: fi(a('c1'), 0.5), hi: ['because'], hiO: fi(a('c2'), 0.5)},
        {text: 'while the hydrophobic tails are excluded from water and held together by hydrophobic interactions.', o: fi(a('c2'), 0.5), hi: ['while'], hiO: fi(a('c2'), 0.5)},
      ]} />
      {/* why it matters: the red blood cell, watery inside and out */}
      <RBC x={rx} y={ry} r={rr} window={why} glow={pulse(a('compart'), 1.6)} />
      <Lbl x={rx} y={ry + rr + 34} text="red blood cell" anchor="middle" size={22} o={why} />
      <Lbl x={rx} y={ry - rr - 58} text="plasma (watery)" anchor="middle" size={20} fill={C.teal} o={why} />
      <Lbl x={rx + rr + 14} y={ry + 8} text="cytoplasm" size={20} fill={C.teal} o={why} lx={rx + 12} ly={ry} />
      {rbc > 0 && <path data-role="decor" d={`M${rx - rr} ${ry}L${Lf.x1 + 14} ${Lf.outerHead}M${rx - rr} ${ry}L${Lf.x1 + 14} ${Lf.innerHead}`} stroke={C.ink} strokeWidth={2} strokeDasharray="6 5" fill="none" opacity={rbc} />}
      <InkRing cx={Lf.x0 + 150} cy={cy - FACE * u - 60} rx={130} ry={46} p={fe(a('separate'), 0.6)} color={C.teal} />
      <InkRing cx={Lf.x0 + 150} cy={cy + FACE * u + 50} rx={130} ry={40} p={fe(a('separate') - 0.3, 0.6)} color={C.teal} />
      <Cite x={rx} y={ry + rr + 64} text="framing: why a bilayer suits a cell" anchor="middle" opacity={fi(a('separate'), 0.5)} />
      {/* next: placeholders where proteins will sit */}
      {fi(a('next'), 0.5) > 0 && [3, 7, 9].map((k, i) => <rect key={i} data-role="decor" x={Lf.x0 + k * u - 24} y={cy - 2.6 * u} width={48} height={5.2 * u} rx={14} fill="none" stroke={T4.proteinEdge} strokeWidth={3} strokeDasharray="8 6" opacity={fi(a('next') - i * 0.2, 0.4)} />)}
      <Pill x={Lf.x0 + 7 * u} y={cy - 2.6 * u - 16} text="next: proteins" anchor="middle" o={fi(a('next'), 0.5)} fill={T4.proteinEdge} />
      <Cite x={Lf.x1 + 40} y={Lf.outerHead - 40} text={SCHEM} opacity={1 - fi(a('why'), 0.25)} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
