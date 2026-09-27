import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, SCHEM, clamp01} from '../kit';
import {LigandA} from '../ReceptorLigand';
import {GlucoseTok} from '../T4Tokens';
import {InkRing} from '../../shared/src/Type';

/** A simple schematic body outline with a branching vessel network (flow is motion along each branch). */
export const NET: number[][][] = [
  [[400, 430], [400, 340], [400, 285]], [[400, 430], [330, 400], [290, 470], [270, 555]], [[400, 430], [470, 400], [510, 470], [530, 555]],
  [[400, 430], [400, 560], [372, 640], [360, 860]], [[400, 430], [400, 560], [428, 640], [440, 860]],
];
export function along(pl: number[][], k: number) {
  const seg: number[] = []; let L = 0;
  for (let i = 1; i < pl.length; i++) { const d = Math.hypot(pl[i][0] - pl[i - 1][0], pl[i][1] - pl[i - 1][1]); seg.push(d); L += d; }
  let s = (((k % 1) + 1) % 1) * L;
  for (let i = 0; i < seg.length; i++) { if (s <= seg[i]) { const u = s / seg[i]; return [pl[i][0] + (pl[i + 1][0] - pl[i][0]) * u, pl[i][1] + (pl[i + 1][1] - pl[i][1]) * u]; } s -= seg[i]; }
  return pl[pl.length - 1];
}
export function Body({x = 0, y = 0, sc = 1, t = 0, flow = 1, wedges = 0, glucose = 0, pancreas = 0, o = 1}: any) {
  if (o <= 0) return null;
  const out: any[] = [];
  NET.forEach((pl, b) => {
    for (let k = 0; k < 3; k++) { const p = along(pl, t * 0.18 * flow + k / 3 + b * 0.13); out.push(<circle key={`d${b}${k}`} cx={p[0]} cy={p[1]} r={4} fill="#FFFFFF" opacity={0.85 * flow} />); }
    if (wedges > 0) for (let k = 0; k < 2; k++) { const p = along(pl, t * 0.15 + k / 2 + b * 0.21); out.push(<LigandA key={`w${b}${k}`} x={p[0]} y={p[1] - 5} u={9} opacity={wedges} />); }
    if (glucose > 0) { const p = along(pl, t * 0.17 + 0.5 + b * 0.3); out.push(<GlucoseTok key={`g${b}`} x={p[0]} y={p[1]} r={6} opacity={glucose} />); }
  });
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`} opacity={o < 1 ? o : undefined}>
      <g data-role="drawing">
        <circle cx={400} cy={255} r={46} fill="#F3E3D3" stroke="#8E7A66" strokeWidth={3} />
        <path d="M350 318Q400 305 450 318L500 340L545 560L518 568L470 420L462 620L482 880L440 886L405 660L395 660L360 886L318 880L338 620L330 420L282 568L255 560L300 340Z" fill="#F3E3D3" stroke="#8E7A66" strokeWidth={3} />
        {pancreas > 0 && <ellipse cx={432} cy={498} rx={34} ry={13} fill="#E8B45A" stroke="#A36B17" strokeWidth={2} opacity={pancreas} />}
        {NET.map((pl, i) => <path key={i} d={'M' + pl.map((p) => p.join(' ')).join('L')} stroke="#C0453D" strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />)}
        {out}
      </g>
    </g>
  );
}

/** Beat 1 · Hook and context: a hormone released into the blood reaches cells of many kinds — why is it acted on
 * only in the right places? Body outline + a magnified vessel segment with three unlabelled cells. */
export default function Beat01(s: any) {
  const t = gt(s), a = s.a, end = s.sc.duration - s.local, fade = fe(1.0 - end, 1.0);
  const W = {x: 860, y: 290, w: 960, h: 560}, vy = 575;
  const cells = [{x: 1030, y: 420, k: 'ell'}, {x: 1330, y: 735, k: 'hex'}, {x: 1630, y: 420, k: 'circ'}];
  const trace = fe(a('comp'), 0.8);
  const sig = a('signal'), sp = [cells[0].x + (cells[2].x - cells[0].x) * clamp01(sig / 4) , cells[0].y - 20 - 60 * Math.sin(Math.PI * clamp01(sig / 4))];
  const wedgesIn = fi(a('insulin'), 0.5);
  const glow = fe(a('why'), 0.6);
  const cellShape = (c: any, i: number) => {
    const st = {fill: glow > 0 && i === 2 ? '#FFF1C9' : '#F7F2F8', stroke: '#6B5B7B', strokeWidth: 3};
    if (c.k === 'ell') return <ellipse key={i} cx={c.x} cy={c.y} rx={110} ry={70} {...st} />;
    if (c.k === 'hex') return <polygon key={i} points={Array.from({length: 6}, (_, k) => { const an = Math.PI / 6 + (k * Math.PI) / 3; return `${(c.x + 90 * Math.cos(an)).toFixed(1)},${(c.y + 80 * Math.sin(an)).toFixed(1)}`; }).join(' ')} {...st} />;
    return <circle key={i} cx={c.x} cy={c.y} r={75} {...st} />;
  };
  return (
    <g opacity={1 - 0.6 * fade}>
      <Body t={t} flow={0.35 + 0.65 * fi(a('flow'), 0.6)} wedges={fi(a('insulin'), 0.6)} glucose={fi(a('meal'), 0.6)} pancreas={fi(a('insulin'), 0.4)} />
      {fi(a('meal'), 0.5) > 0 && <g opacity={fi(a('meal'), 0.5)}>
        <g data-role="drawing"><ellipse cx={640} cy={330} rx={56} ry={16} fill="#FFFFFF" stroke="#8E7A66" strokeWidth={3} /><ellipse cx={640} cy={326} rx={34} ry={8} fill="#E9D8B8" /></g>
        <Pill x={560} y={284} text="blood glucose rises" fill="#A4561A" />
      </g>}
      <Lbl x={566} y={600} text="insulin" o={fi(a('insulin'), 0.4)} size={22} fill="#7D1F5A" lx={462} ly={502} />
      {/* magnified window: a vessel segment with three different cells */}
      <path data-role="decor" d={`M430 560L${W.x} ${W.y + 40}M430 580L${W.x} ${W.y + W.h - 40}`} stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 6" />
      <rect data-role="decor" x={W.x} y={W.y} width={W.w} height={W.h} rx={18} fill="#FBF3DD" stroke={C.ink} strokeWidth={3} />
      <g data-role="drawing">
        <rect x={W.x + 4} y={vy - 40} width={W.w - 8} height={80} fill="#A63A33" />
        {[0, 1, 2, 3, 4, 5].map((k) => { const xx = W.x + 20 + ((t * 90 + k * 160) % (W.w - 40)); return <ellipse key={k} cx={xx} cy={vy + (k % 2 ? 14 : -12)} rx={18} ry={10} fill="#D9534B" stroke="#8E2A24" strokeWidth={1.5} />; })}
        {cells.map(cellShape)}
        {glow > 0 && <circle cx={cells[2].x} cy={cells[2].y} r={92} fill="none" stroke="#F2C45A" strokeWidth={10} opacity={0.7 * glow} />}
      </g>
      {wedgesIn > 0 && [0, 1, 2, 3, 4].map((k) => { const xx = W.x + 30 + ((t * 110 + k * 190) % (W.w - 60)); return <LigandA key={k} x={xx} y={vy - 10 + (k % 2 ? 12 : -4)} u={13} opacity={wedgesIn} />; })}
      {cells.map((c, i) => <InkRing key={i} cx={c.x} cy={c.y} rx={c.k === 'ell' ? 122 : 98} ry={c.k === 'ell' ? 82 : 92} p={fe(a('comp') - i * 0.3, 0.6)} opacity={1 - fe(a('signal'), 0.6)} color={C.teal} />)}
      <Pill x={W.x + W.w / 2} y={W.y + W.h - 14} text="each cell inside its own membrane" anchor="middle" o={trace * (1 - fe(a('meal'), 0.5))} fill={C.teal} />
      {sig >= 0 && sig < 4.6 && <g><LigandA x={sp[0]} y={sp[1]} u={13} /><Pill x={W.x + 24} y={W.y + 36} text="chemical signal" fill="#7D1F5A" o={fi(sig, 0.4) * (1 - fe(sig - 3.8, 0.6))} /></g>}
      <Pill x={cells[2].x} y={cells[2].y - 110} text="why here?" anchor="middle" o={glow} fill={C.primary} />
      <Txt x={960} y={250} size={29} weight={700} anchor="middle" opacity={fi(a('hook'), 0.5)}>Ever wondered how a hormone finds exactly the right cells?</Txt>
      <Cite x={1820} y={880} text={SCHEM} anchor="end" />
    </g>
  );
}
