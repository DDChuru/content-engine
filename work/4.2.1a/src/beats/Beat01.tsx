import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Stage, RBC, C, Txt, Cite, SCHEM, clamp01, fmmLayout, FULL, ATPTag, WaterTok} from '../kit';
import {GlucoseTok, O2Tok} from '../T4Tokens';
import {HY} from '../FluidMosaicMembrane';

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
/** Vignette labels (vignette-local coordinates), always drawn OUTSIDE the drawn shapes and never inside a scaled
 * group: Beat 1 draws them at 1:1 beside the full-size vignettes and hides them before the vignettes shrink. */
export const VLABELS: {x: number; y: number; text: string; fill: string; anchor?: string}[][] = [
  [{x: 130, y: 385, text: 'alveolus', fill: '#8E4B5A', anchor: 'middle'}, {x: 375, y: 438, text: 'red blood cell', fill: '#A63A33', anchor: 'middle'}],
  [{x: 40, y: 30, text: 'blood plasma', fill: '#A63A33'}, {x: 412, y: 350, text: 'a cell', fill: '#6B5B7B'}],
  [{x: 270, y: 440, text: 'a cell', fill: '#6B5B7B', anchor: 'middle'}],
];
export function VLabels({k, dx = 0, dy = 0, o = 1}: any) {
  if (o <= 0) return null;
  return <g opacity={o < 1 ? o : undefined}>{VLABELS[k].map((L, i) => <Txt key={i} x={dx + L.x} y={dy + L.y} size={22} weight={700} fill={L.fill} anchor={L.anchor ?? 'start'}>{L.text}</Txt>)}</g>;
}
/** One of the three context vignettes, drawn in its own 540×470 frame at (0,0); `age` = seconds since it opened. */
export function Vignette({k, t, age, labels = true}: any) {
  const o = clamp01(age / 0.5);
  if (o <= 0) return null;
  const loop = (i: number, per: number) => ((t + i * per * 0.37) % per) / per;
  if (k === 0) {
    const out: any[] = [];
    for (let i = 0; i < 5; i++) { const u = loop(i, 3.2); const x = lerp(150, 370, u), y = lerp(150 + i * 38, 215 + (i % 3) * 20, u); out.push(<O2Tok key={i} x={x} y={y} r={9} rot={i * 50} />); }
    return (
      <g opacity={o}>
        <g data-role="drawing">
          <circle cx={130} cy={235} r={110} fill="#FBE9EC" stroke="#B5707E" strokeWidth={3} />
          <rect x={300} y={40} width={150} height={360} rx={18} fill="#E9A39C" stroke="#A63A33" strokeWidth={3} />
          <RBC x={375} y={225} r={52} />
          {out}
        </g>
        {labels && <VLabels k={0} />}
      </g>
    );
  }
  if (k === 1) {
    const out: any[] = [];
    for (let i = 0; i < 4; i++) { const u = loop(i, 3.6); const pre = u < 0.55; const x = pre ? lerp(60 + i * 30, 230, u / 0.55) : 230; const y = pre ? lerp(95 + (i % 2) * 20, 205, u / 0.55) : lerp(205, 360, (u - 0.55) / 0.45); out.push(<GlucoseTok key={i} x={x} y={y} r={13} rot={i * 30 + t * 20} />); }
    return (
      <g opacity={o}>
        <g data-role="drawing">
          <rect x={20} y={40} width={500} height={120} rx={20} fill="#E9A39C" stroke="#A63A33" strokeWidth={3} />
          <ellipse cx={230} cy={340} rx={170} ry={120} fill="#F7F2F8" stroke="#6B5B7B" strokeWidth={3} />
          <rect x={215} y={208} width={30} height={30} rx={6} fill={'#7FC3BE'} stroke="#2F7F7A" strokeWidth={2} />
          {out}
        </g>
        {labels && <VLabels k={1} />}
      </g>
    );
  }
  const out: any[] = [];
  for (let i = 0; i < 8; i++) { const u = loop(i, 2.8), inw = i % 2 === 0; const an = i * 0.8 + 0.3; const r0 = inw ? 205 : 110, r1 = inw ? 110 : 205, r = lerp(r0, r1, u); out.push(<WaterTok key={i} x={270 + Math.cos(an) * r * 1.15} y={240 + Math.sin(an) * r * 0.8} r={8} />); }
  return (
    <g opacity={o}>
      <g data-role="drawing"><ellipse cx={270} cy={240} rx={180} ry={128} fill="#F7F2F8" stroke="#6B5B7B" strokeWidth={3} />{out}</g>
      {labels && <VLabels k={2} />}
    </g>
  );
}

/** Beat 1 · Hook and context: a membrane with glucose above it; three context vignettes (lungs, glucose into a cell,
 * water both ways); back to the membrane: the hydrophobic core, glucose (polar), how does it get in, any ATP? */
export default function Beat01(s: any) {
  const t = gt(s), a = s.a;
  const down = fe(a('trade'), 0.9) * (1 - fe(a('core'), 0.9));
  const cy = lerp(700, 905, down), u = lerp(50, 24, down);
  const M = {cx: 960, cy, u, t, show: FULL};
  const Lf = fmmLayout(M);
  const thumb = fe(a('core'), 0.9);
  const vx = [110, 690, 1270];
  const glu = [[640, 470], [980, 420], [1320, 480]].map(([x, y], i) => [x + 40 * Math.sin(t * 0.5 + i * 2), y + 16 * Math.sin(t * 0.7 + i)]);
  const gAlpha = 1 - down;
  const hookO = fi(a('open'), 0.5) * (1 - fe(a('trade'), 0.5));
  const coreGlow = pulse(a("core0"), 1.8) * 0.3;
  return (
    <g>
      <Stage s={s} cx={960} cy={cy} u={u} xw={[Lf.x0, Lf.x1]} waterTop={cy - 3.9 * u - 60} waterBottom={Math.min(950, cy + 5 * u)} n={[16, 12]} mem={{show: FULL}} />
      {coreGlow > 0 && <rect data-role="decor" x={Lf.x0} y={cy - (HY - 0.3) * u} width={Lf.width} height={2 * (HY - 0.3) * u} fill="#8A8A8A" opacity={coreGlow} />}
      {glu.map((g, i) => <GlucoseTok key={i} x={g[0]} y={g[1]} r={15} rot={t * 15 + i * 40} opacity={gAlpha} />)}
      <Txt x={960} y={246} size={30} weight={700} anchor="middle" opacity={hookO}>How does sugar get into a cell,</Txt>
      <Txt x={960} y={290} size={30} weight={700} anchor="middle" opacity={hookO}>when the membrane is built to keep water-loving things out?</Txt>
      {[0, 1, 2].map((k) => {
        const key = ['o2', 'glu', 'water'][k], age = a(key);
        if (age < 0) return null;
        const sc = lerp(1, 0.3, thumb), x = lerp(vx[k], 80 + k * 184, thumb), y = lerp(215, 200, thumb);
        // labels only while the vignettes are full size: they fade out just before the shrink starts
        const labO = clamp01(age / 0.5) * (1 - clamp01((a('core') + 0.5) / 0.5));
        return (
          <g key={k}>
            <rect data-role="decor" x={x - 4} y={y - 4} width={548 * sc} height={478 * sc} rx={14 * sc + 4} fill="#FFFFFF" stroke={C.line} strokeWidth={2} opacity={clamp01(age / 0.5)} />
            <g transform={`translate(${x} ${y}) scale(${sc})`}><Vignette k={k} t={t} age={age} labels={false} /></g>
            {thumb <= 0 && <VLabels k={k} dx={x} dy={y} o={labO} />}
            {k === 0 && <Pill x={x + 270 * sc} y={y + 470 * sc + 30} text="Topic 9 context: named, not taught" anchor="middle" o={thumb <= 0 ? labO : 0} size={17} />}
            {k === 1 && <Pill x={x + 270 * sc} y={y + 470 * sc + 30} text="used in respiration" anchor="middle" o={thumb <= 0 ? labO : 0} size={17} fill="#A4561A" />}
            {k === 2 && <Pill x={x + 270 * sc} y={y + 470 * sc + 30} text="water: in and out" anchor="middle" o={thumb <= 0 ? labO : 0} size={17} fill={C.teal} />}
          </g>
        );
      })}
      <Lbl x={Lf.x1 + 18} y={cy + 8} text="hydrophobic core" o={fi(a('core'), 0.5)} size={24} fill={C.muted} />
      <Lbl x={glu[1][0] + 26} y={glu[1][1] - 26} text="glucose (polar)" o={fi(a('polar'), 0.4)} size={24} fill="#A4561A" lx={glu[1][0] + 12} ly={glu[1][1] - 12} />
      <Pill x={glu[1][0]} y={glu[1][1] - 70} text="?" anchor="middle" o={fi(a('how'), 0.4)} size={30} fill={C.primary} />
      {a('atp') >= 0 && <g opacity={fi(a('atp'), 0.4)}><ATPTag x={1560} y={cy - 120} /><Pill x={1560} y={cy - 170} text="energy cost?" anchor="middle" size={18} fill="#4A3608" /></g>}
      <Cite x={1840} y={940} text={SCHEM} anchor="end" />
    </g>
  );
}
