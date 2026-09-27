import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Bracket, Wash, Stage3, RoleGrid, Regions3, Sentence, RBC, Halo, lanes, turnBack, gridFill, DIM_ALL, L3, C, Txt, Cite, SCHEM, PARTS, clamp01, textW} from '../kit';
import {fmmLayout, FULL} from '../FluidMosaicMembrane';
import {O2Tok, IonTok, GlucoseTok, WaterTok} from '../T4Tokens';

/** Beat 4 · Phospholipids × permeability: small non-polar molecules cross the bilayer; the hydrophobic core turns
 * back ions and polar molecules (turn-back motion); handle "oil and water" → the creditworthy sentence. */
export default function Beat04(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3, M = {cx, cy, u, t, show: FULL};
  const Lf = fmmLayout(M), LN = lanes(M);
  const top = Lf.top - 2.6 * u, bot = Lf.bottom + 0.8 * u;
  const cross = (age: number, ln: number[], up = false) => { const k = clamp01(age / 1.3); const e = k * k * (3 - 2 * k); return up ? [ln[1] + (ln[0] - ln[1]) * e, bot + (top - bot) * e] : [ln[0] + (ln[1] - ln[0]) * e, top + (bot - top) * e]; };
  const o2s = [[0, LN[0], false], [0.5, LN[1], false], [1.0, LN[2], true], [1.6, LN[3], false]].map(([d, ln, up]: any) => ({age: a('o2') - d, ln, up}));
  const o2glow = pulse(a('c1'), 1.6);
  // Na⁺ and glucose with their halos: appear, turn back at the core, hold, glow at clause 2
  const bx = [LN[1][0] + 0.2 * u, LN[2][0] - 0.3 * u];
  const tb = (i: number) => turnBack(a('bounce') - i * 0.3, bx[i], Lf.top - 1.3 * u, Lf.outerHead + 0.55 * u);
  const halo = fi(a('halo'), 0.5), c2g = pulse(a('c2'), 1.6);
  const rbcIn = fi(a('rbc'), 0.5) * (1 - fe(a('oil') + 0.5, 0.45)), oil = fi(a('oil'), 0.5);
  const rin = path((a('rbc') - 0.4) % 3.2, [[0, 110, 808], [1.6, 240, 808]]);
  // memory hook (RULE-MEMORY-HOOKS): l1 oil ↔ the non-polar tails (core); l2 water ↔ the watery solutions each side
  const off = fi(a('written') - 0.4, 0.6), L1 = fi(a('l1'), 0.4) * (1 - off), L2 = fi(a('l2'), 0.4) * (1 - off);
  const OCHRE = '#F2DC8C', BLUE = '#CFE6F4';
  const IN = {x: 80, y: 704, w: 540, h: 222};
  const bw = {x: IN.x + 300, y: IN.y + 70};
  const w1 = textW('oil', 24, 700), w2 = textW('oil and ', 24, 700), w3 = textW('water', 24, 700);
  return (
    <g>
      <Wash x={Lf.x0 - 10} y={cy - 1.5 * u} w={Lf.width + 20} h={3 * u} o={Math.max(0.8 * fi(a('core'), 0.5) * (1 - fe(a('halo'), 0.5)), 0.95 * L1)} fill={L1 > 0 ? OCHRE : '#EDE7DA'} />
      <Wash x={74} y={214} w={762} h={Lf.top - 6 - 214} o={0.75 * L2} fill={BLUE} />
      <Wash x={74} y={Lf.bottom + 6} w={762} h={IN.y - 30 - Lf.bottom - 6} o={0.75 * L2} fill={BLUE} />
      <Stage3 s={s} mem={{compDim: DIM_ALL}} />
      <Regions3 o={1} />
      <RoleGrid t={t} fill={gridFill(s)} rowLit={{phospholipids: fi(a('open'), 0.4)}} colLit={{permeability: fi(a('open'), 0.4)}} />
      <Bracket x={Lf.x0 - 6} y0={cy - 1.5 * u} y1={cy + 1.5 * u} side={1} o={fi(a('core'), 0.4)} />
      {L1 > 0 && <rect data-role="decor" x={Lf.x0 + 4} y={Lf.bottom + 38} width={textW('hydrophobic core: non-polar fatty-acid tails', 20, 700) + 12} height={28} rx={6} fill={OCHRE} opacity={L1} />}
      <Lbl x={Lf.x0 + 10} y={Lf.bottom + 58} text="hydrophobic core: non-polar fatty-acid tails" o={fi(a('core'), 0.4) * (1 - fe(a('written'), 0.4))} size={20} fill={L1 > 0.5 ? '#6B5410' : C.muted} halo={L1 > 0 ? null : C.warm} />
      <Lbl x={Lf.x0 + 10} y={Lf.bottom + 84} text="very little water" o={fi(a('core'), 0.4) * (1 - fe(a('written'), 0.4))} size={20} weight={600} fill={C.muted} />
      {/* O₂ crossings (along the normal, between phospholipids) */}
      {o2s.map((o, i) => o.age >= 0 && o.age < 1.4 ? <O2Tok key={i} x={cross(o.age, o.ln, o.up)[0]} y={cross(o.age, o.ln, o.up)[1]} r={8} /> : null)}
      {o2glow > 0 && [0, 1].map((i) => <g key={'g' + i}><circle data-role="decor" cx={LN[i][0]} cy={top + 30} r={20} fill="#FFF3C4" opacity={o2glow} /><O2Tok x={LN[i][0]} y={top + 30} r={8} opacity={o2glow} /></g>)}
      <Pill x={Lf.x0 + 10} y={Lf.bottom + 122} text="which way, and why: 4.2.1" o={fi(a('o2'), 0.5) * (1 - fe(a('halo'), 0.5))} />
      <Txt x={Lf.x0 + 10} y={Lf.bottom + 156} size={20} weight={700} fill={C.muted} opacity={fi(a('co2'), 0.5) * (1 - fe(a('halo'), 0.5))}>carbon dioxide crosses the same way</Txt>
      {/* example inset: oxygen enters a red blood cell */}
      {rbcIn > 0 && <g opacity={rbcIn}>
        <rect data-role="decor" x={IN.x} y={IN.y} width={IN.w} height={IN.h} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <RBC x={IN.x + 170} y={IN.y + 104} r={62} />
        {a('rbc') > 0.4 && <O2Tok x={rin[0]} y={rin[1] - 24} r={7} />}{a('rbc') > 0.7 && <O2Tok x={rin[0] - 20} y={rin[1] + 20} r={7} />}
        <Txt x={IN.x + 16} y={IN.y + 30} size={20} weight={700} fill={C.muted}>example</Txt>
        <Txt x={IN.x + 290} y={IN.y + 96} size={20} weight={700}>red blood cell;</Txt>
        <Txt x={IN.x + 290} y={IN.y + 122} size={20} weight={700}>outside: plasma</Txt>
      </g>}
      {/* Na⁺ and glucose, each surrounded by water */}
      {halo > 0 && a('written') < 0.6 && [0, 1].map((i) => { const p = a('bounce') >= 0 ? tb(i) : [bx[i], Lf.top - 1.3 * u]; return (
        <g key={'h' + i} opacity={halo * (1 - fe(a('written'), 0.5))}>
          <Halo x={p[0]} y={p[1]} t={t} />
          {i === 0 ? <IonTok x={p[0]} y={p[1]} r={11} /> : <GlucoseTok x={p[0]} y={p[1]} r={13} />}
        </g>); })}
      {c2g > 0 && <g opacity={c2g}><Halo x={bx[0]} y={Lf.top - 1.3 * u} t={t} /><IonTok x={bx[0]} y={Lf.top - 1.3 * u} r={11} /><Halo x={bx[1]} y={Lf.top - 1.3 * u} t={t} /><GlucoseTok x={bx[1]} y={Lf.top - 1.3 * u} r={13} /></g>}
      <Lbl x={bx[0] - 36} y={Lf.top - 1.1 * u} text="sodium ion" anchor="end" o={halo * (1 - fe(a('written'), 0.5))} size={20} fill="#553585" />
      <Lbl x={bx[1] + 36} y={Lf.top - 1.1 * u} text="glucose" o={halo * (1 - fe(a('written'), 0.5))} size={20} fill="#A4561A" />
      <Txt x={(bx[0] + bx[1]) / 2} y={Lf.top - 2.7 * u} size={20} weight={700} anchor="middle" fill={C.muted} opacity={halo * (1 - fe(a('written'), 0.5))}>surrounded by water (schematic)</Txt>
      <Pill x={Lf.x0 + 10} y={Lf.bottom + 122} text="barrier to ions and polar molecules" o={fi(a('barrier'), 0.5)} fill={C.primary} />
      {/* handle inset: oil drops sit apart on water; each hook word lights with its target */}
      {oil > 0 && <g opacity={oil * (1 - fe(a('written') - 0.2, 0.5))}>
        <rect data-role="decor" x={IN.x} y={IN.y} width={IN.w} height={IN.h} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        {L2 > 0 && <rect data-role="decor" x={IN.x + 62} y={IN.y + 88} width={126} height={92} fill={BLUE} opacity={L2} />}
        <g data-role="drawing">
          <path d={`M${IN.x + 60} ${IN.y + 40}L${IN.x + 60} ${IN.y + 176}Q${IN.x + 60} ${IN.y + 186} ${IN.x + 70} ${IN.y + 186}L${IN.x + 180} ${IN.y + 186}Q${IN.x + 190} ${IN.y + 186} ${IN.x + 190} ${IN.y + 176}L${IN.x + 190} ${IN.y + 40}`} fill="none" stroke="#6F6A60" strokeWidth={3} />
          <rect x={IN.x + 62} y={IN.y + 92} width={126} height={92} fill="#DDEFF9" />
          {[[82, 90], [112, 88], [146, 91], [170, 89]].map(([x, y], i) => <ellipse key={i} cx={IN.x + x + 2 * Math.sin(t + i)} cy={IN.y + y} rx={13} ry={6} fill={L1 > 0.3 ? '#E0B83A' : '#E9C85A'} stroke="#A98B24" strokeWidth={1.5} />)}
        </g>
        {L1 > 0 && <rect data-role="decor" x={IN.x + 222} y={IN.y + 50} width={w1 + 8} height={32} rx={6} fill={OCHRE} opacity={L1} />}
        {L2 > 0 && <rect data-role="decor" x={IN.x + 226 + w2 - 4} y={IN.y + 50} width={w3 + 8} height={32} rx={6} fill={BLUE} opacity={L2} />}
        <Txt x={IN.x + 226} y={IN.y + 74} size={24} weight={700}>oil and water</Txt>
        <Txt x={IN.x + 226} y={IN.y + 106} size={24} weight={700}>don't mix</Txt>
        <Pill x={IN.x + 222} y={IN.y + 150} text="handle, not the exam answer" size={20} fill={C.primary} />
        {L1 > 0 && <Txt x={IN.x + 222} y={IN.y + 196} size={20} weight={700} fill="#6B5410" opacity={L1}>oil → the tails (core)</Txt>}
        {L2 > 0 && <Txt x={IN.x + 222} y={IN.y + 218} size={20} weight={700} fill="#2F6B8F" opacity={L2}>water → both sides</Txt>}
      </g>}
      <Txt x={Lf.x0 + 10} y={Lf.bottom + 156} size={20} weight={700} fill={C.primary} italic opacity={fi(a('film'), 0.5) * (1 - fe(a('written') - 0.2, 0.5))}>the image is for the core only; a membrane is not a layer of oil</Txt>
      <Sentence x={80} y={IN.y - 20} w={756} o={fe(a('written'), 0.6)} size={21} lines={[
        {text: 'Small non-polar molecules cross the phospholipid bilayer,', o: fi(a('c1'), 0.5)},
        {text: 'but its hydrophobic core is a barrier to ions and polar molecules.', o: fi(a('c2'), 0.5), hi: ['barrier'], hiO: fi(a('c2'), 0.5)},
      ]} />
      <Lbl x={Lf.x1} y={Lf.top - 3.2 * u} text="partially permeable" anchor="end" o={fi(a('pp'), 0.5)} size={24} fill={C.primary} />
      <Cite x={1850} y={940} text={PARTS} anchor="end" />
    </g>
  );
}
