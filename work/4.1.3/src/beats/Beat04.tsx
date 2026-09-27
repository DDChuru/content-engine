import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Bracket, Wash, Stage3, RoleGrid, Regions3, Sentence, RBC, Halo, lanes, turnBack, gridFill, DIM_ALL, L3, C, Txt, Cite, SCHEM, PARTS, clamp01} from '../kit';
import {fmmLayout, FULL} from '../FluidMosaicMembrane';
import {O2Tok, IonTok, GlucoseTok, WaterTok} from '../T4Tokens';

/** Beat 4 · Phospholipids × permeability: small non-polar molecules cross the bilayer; the hydrophobic core turns
 * back ions and polar molecules (turn-back motion); handle "oil and water" → the creditworthy sentence. */
export default function Beat04(s: any) {
  const t = gt(s), a = s.a, {cx, cy, u} = L3, M = {cx, cy, u, t, show: FULL};
  const Lf = fmmLayout(M), LN = lanes(M);
  const top = Lf.top - 2.6 * u, bot = Lf.bottom + 1.8 * u;
  const cross = (age: number, ln: number[], up = false) => { const k = clamp01(age / 1.3); const e = k * k * (3 - 2 * k); return up ? [ln[1] + (ln[0] - ln[1]) * e, bot + (top - bot) * e] : [ln[0] + (ln[1] - ln[0]) * e, top + (bot - top) * e]; };
  const o2s = [[0, LN[0], false], [0.5, LN[1], false], [1.0, LN[2], true], [1.6, LN[3], false]].map(([d, ln, up]: any) => ({age: a('o2') - d, ln, up}));
  const o2glow = pulse(a('c1'), 1.6);
  // Na⁺ and glucose with their halos: appear, turn back at the core, hold, glow at clause 2
  const bx = [LN[1][0] + 0.2 * u, LN[2][0] - 0.3 * u];
  const tb = (i: number) => turnBack(a('bounce') - i * 0.3, bx[i], Lf.top - 1.3 * u, Lf.outerHead + 0.55 * u);
  const halo = fi(a('halo'), 0.5), c2g = pulse(a('c2'), 1.6);
  const rbcIn = fi(a('rbc'), 0.5) * (1 - fe(a('oil'), 0.5)), oil = fi(a('oil'), 0.5);
  const rin = path((a('rbc') - 0.4) % 3.2, [[0, 132, 846], [1.6, 240, 846]]);
  return (
    <g>
      <Wash x={Lf.x0 - 10} y={cy - 1.5 * u} w={Lf.width + 20} h={3 * u} o={0.8 * fi(a('core'), 0.5) * (1 - fe(a('halo'), 0.5))} fill="#EDE7DA" />
      <Stage3 s={s} mem={{compDim: DIM_ALL}} />
      <Regions3 o={1} />
      <RoleGrid t={t} fill={gridFill(s)} rowLit={{phospholipids: fi(a('open'), 0.4)}} colLit={{permeability: fi(a('open'), 0.4)}} />
      <Bracket x={Lf.x0 - 6} y0={cy - 1.5 * u} y1={cy + 1.5 * u} side={1} o={fi(a('core'), 0.4)} />
      <Lbl x={cx + 60} y={Lf.bottom + 58} text="hydrophobic core: non-polar fatty-acid tails" anchor="middle" o={fi(a('core'), 0.4) * (1 - fe(a('written'), 0.4))} size={19} fill={C.muted} />
      <Lbl x={cx + 60} y={Lf.bottom + 80} text="very little water" anchor="middle" o={fi(a('core'), 0.4) * (1 - fe(a('written'), 0.4))} size={17} weight={600} fill={C.muted} />
      {/* O₂ crossings (along the normal, between phospholipids) */}
      {o2s.map((o, i) => o.age >= 0 && o.age < 1.4 ? <O2Tok key={i} x={cross(o.age, o.ln, o.up)[0]} y={cross(o.age, o.ln, o.up)[1]} r={8} /> : null)}
      {o2glow > 0 && [0, 1].map((i) => { const p = cross(0.35 + 0.4 * i + (s.local % 1.2) * 0, LN[i], false); return <g key={'g' + i}><circle data-role="decor" cx={LN[i][0]} cy={top + 30} r={20} fill="#FFF3C4" opacity={o2glow} /><O2Tok x={LN[i][0]} y={top + 30} r={8} opacity={o2glow} /></g>; })}
      <Pill x={cx + 60} y={Lf.bottom + 118} text="which way, and why: 4.2.1" anchor="middle" o={fi(a('o2'), 0.5) * (1 - fe(a('halo'), 0.5))} />
      <Txt x={cx + 60} y={Lf.bottom + 150} size={18} weight={700} fill={C.muted} anchor="middle" opacity={fi(a('co2'), 0.5) * (1 - fe(a('halo'), 0.5))}>carbon dioxide crosses the same way</Txt>
      {/* example inset: oxygen enters a red blood cell */}
      {rbcIn > 0 && <g opacity={rbcIn}>
        <rect data-role="decor" x={90} y={770} width={330} height={160} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <RBC x={260} y={846} r={56} />
        {a('rbc') > 0.4 && <O2Tok x={rin[0]} y={rin[1] - 24} r={7} />}{a('rbc') > 0.7 && <O2Tok x={rin[0] - 20} y={rin[1] + 20} r={7} />}
        <Txt x={105} y={794} size={16} weight={700} fill={C.muted}>example</Txt>
        <Txt x={255} y={920} size={16} weight={700} anchor="middle">red blood cell; outside: plasma</Txt>
      </g>}
      {/* Na⁺ and glucose, each surrounded by water */}
      {halo > 0 && a('written') < 0.6 && [0, 1].map((i) => { const p = a('bounce') >= 0 ? tb(i) : [bx[i], Lf.top - 1.3 * u]; return (
        <g key={'h' + i} opacity={halo * (1 - fe(a('written'), 0.5))}>
          <Halo x={p[0]} y={p[1]} t={t} />
          {i === 0 ? <IonTok x={p[0]} y={p[1]} r={11} /> : <GlucoseTok x={p[0]} y={p[1]} r={13} />}
        </g>); })}
      {c2g > 0 && <g opacity={c2g}><Halo x={bx[0]} y={Lf.top - 1.3 * u} t={t} /><IonTok x={bx[0]} y={Lf.top - 1.3 * u} r={11} /><Halo x={bx[1]} y={Lf.top - 1.3 * u} t={t} /><GlucoseTok x={bx[1]} y={Lf.top - 1.3 * u} r={13} /></g>}
      <Lbl x={bx[0] - 34} y={Lf.top - 1.1 * u} text="sodium ion" anchor="end" o={halo * (1 - fe(a('written'), 0.5))} size={18} fill="#553585" />
      <Lbl x={bx[1] + 34} y={Lf.top - 1.1 * u} text="glucose" o={halo * (1 - fe(a('written'), 0.5))} size={18} fill="#A4561A" />
      <Txt x={(bx[0] + bx[1]) / 2} y={Lf.top - 2.55 * u} size={17} weight={700} anchor="middle" fill={C.muted} opacity={halo * (1 - fe(a('written'), 0.5))}>surrounded by water (schematic)</Txt>
      <Pill x={cx + 60} y={Lf.bottom + 118} text="barrier to ions and polar molecules" anchor="middle" o={fi(a('barrier'), 0.5)} fill={C.primary} />
      {/* handle inset: oil drops sit apart on water */}
      {oil > 0 && <g opacity={oil}>
        <rect data-role="decor" x={90} y={770} width={330} height={160} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
        <g data-role="drawing">
          <path d="M150 800L150 906Q150 916 160 916L250 916Q260 916 260 906L260 800" fill="none" stroke="#6F6A60" strokeWidth={3} />
          <rect x={152} y={840} width={106} height={74} fill="#DDEFF9" />
          {[[170, 838], [196, 836], [226, 839], [246, 837]].map(([x, y], i) => <ellipse key={i} cx={x + 2 * Math.sin(t + i)} cy={y} rx={11} ry={5} fill="#E9C85A" stroke="#A98B24" strokeWidth={1.5} />)}
        </g>
        <Txt x={275} y={830} size={17} weight={700}>oil and water</Txt>
        <Txt x={275} y={852} size={17} weight={700}>don't mix</Txt>
        <Pill x={275} y={895} text="handle, not the exam answer" size={13} fill={C.primary} />
      </g>}
      <Sentence x={436} y={640} w={612} o={fe(a('written'), 0.6)} size={20} lines={[
        {text: 'Small non-polar molecules cross the phospholipid bilayer,', o: fi(a('c1'), 0.5)},
        {text: 'but its hydrophobic core is a barrier to ions', o: fi(a('c2'), 0.5), hi: ['barrier'], hiO: fi(a('c2'), 0.5)},
        {text: 'and polar molecules.', o: fi(a('c2'), 0.5)},
      ]} />
      <Lbl x={Lf.x1} y={Lf.top - 3.2 * u} text="partially permeable" anchor="end" o={fi(a('pp'), 0.5)} size={24} fill={C.primary} />
      <Cite x={1040} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
