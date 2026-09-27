import React from 'react';
import {fi, fe, pulse} from '../util';
import {Lbl, Pill, RBC, Stage, RegionLabels, Wash, C, Txt, Cite, SCHEM, PARTS} from '../kit';
import {fmmLayout, compPos, plPos, FULL} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {Arrow} from '../../shared/src/Type';

/** Beat 12 · What I told you, ON the membrane they watched being built. No new slide: the same `full` model, held
 * STILL (the clock is frozen at the beat's first frame, so nothing jumps), key points fading in in place. */
export default function Beat12(s: any) {
  const a = s.a, u = 46, cy = 470, show = FULL, t = s.sc.startFrame / 30;
  const M = {cx: 960, cy, u, t, show};
  const Lf = fmmLayout(M), P = (k: any) => compPos(M, k);
  const ch = P('channel'), rc = P('receptor'), ca = P('carrier'), gp = P('glycoprotein'), gl = P('glycolipid'), ex = P('extrinsic'), co = P('cholOut'), ci = P('cholIn');
  const H = PROT.H * u, top = cy - H, bot = cy + H;
  const on = (k: string) => fi(a(k), 0.6);
  const h0 = plPos(M, 1), h1 = plPos(M, 13);
  const span = [ch, ca, rc, gp];
  const rb = on('intrinsic') * 0.5;
  // recap labels: left column (heads, tails) with horizontal leaders; below the section a staircase ordered by
  // DESCENDING target x, each leader rising from the label's left part, so no leader crosses another label; every
  // leader is painted beneath every label (two passes).
  const RL: any[] = [
    ['bilayer', Lf.x0 - 36, Lf.outerHead + 8, 'hydrophilic heads:', Lf.outer[0].x - 0.45 * u, Lf.outerHead, C.teal, 'end'],
    ['bilayer', Lf.x0 - 36, Lf.outerHead + 34, 'interact with water on both sides', null, null, C.teal, 'end'],
    ['core', Lf.x0 - 36, cy + 4, 'hydrophobic tails: held together', Lf.outer[0].x - 0.15 * u, cy - 4, C.primary, 'end'],
    ['core', Lf.x0 - 36, cy + 30, 'by hydrophobic interactions', null, null, C.primary, 'end'],
    ['fluid', Lf.x1 + 36, Lf.innerHead + 0.75 * u + 8, 'fluid: phospholipids and many', Lf.x1 - 1.6 * u + 4, Lf.innerHead + 0.75 * u, '#A36B17', 'start'],
    ['fluid', Lf.x1 + 36, Lf.innerHead + 0.75 * u + 34, 'proteins move sideways', null, null, '#A36B17', 'start'],
    ['mosaic', gp.x - 16, 664, 'mosaic: proteins scattered through it', gp.x, bot + 12, C.primary, 'start'],
    ['four', ca.x - 16, 694, 'the four spanning proteins drawn here: transmembrane', ca.x, bot + 16, C.teal, 'start'],
    ['chol', ci.x - 16, 724, 'cholesterol: both layers, OH towards the heads', ci.x, ci.y + 10, '#8A5F12', 'start'],
    ['intrinsic', ch.x - 4, 754, 'intrinsic proteins: embedded,', ch.x + 12, bot + 4, C.ink, 'start'],
    ['intrinsic', ch.x - 4, 780, 'hydrophobic R groups against the tails', null, null, C.ink, 'start'],
    ['extrinsic', ex.x - 30, 812, 'extrinsic protein: on a surface', ex.x - 14, ex.y + 0.3 * u, C.ink, 'start'],
  ];
  const lbls = (part: string) => RL.map(([k, x, y, text, lx, ly, fill, anchor]: any, i: number) => <Lbl key={part + i} part={part} x={x} y={y} text={text} o={on(k)} size={21} fill={fill} anchor={anchor} lx={lx ?? undefined} ly={ly ?? undefined} />);
  return (
    <g>
      <Wash x={Lf.x0 - 16} y={Lf.outerHead - 0.5 * u} w={Lf.width + 32} h={u} o={0.9 * on('bilayer')} />
      <Wash x={Lf.x0 - 16} y={Lf.innerHead - 0.5 * u} w={Lf.width + 32} h={u} o={0.9 * on('bilayer')} />
      <Wash x={Lf.x0 - 16} y={cy - 1.4 * u} w={Lf.width + 32} h={2.8 * u} o={0.7 * on('core')} fill="#EDE7DA" />
      {[gl.x + 0.15 * u, rc.x + 0.62 * u, gp.x].map((x, i) => <rect key={i} data-role="decor" x={x - 0.5 * u} y={Lf.top - 2.2 * u} width={1.0 * u + (i === 0 ? 0.3 * u : 0)} height={2.2 * u} rx={12} fill="#E3F2DC" opacity={on('chains')} />)}
      <Stage s={s} cy={cy} u={u} mem={{show, t, rBands: rb, rBandsOn: ['channel', 'receptor', 'carrier', 'glycoprotein']}} n={[28, 24]} />
      <RegionLabels cy={cy} u={u} x={90} oCore={0} />
      {/* spanning proteins bracketed; extrinsic; all five outlined for mosaic */}
      {span.map((p, i) => { const w = (i === 3 ? 0.9 : PROT.W) * u; return <path key={i} data-role="decor" d={`M${p.x - w / 2 - 6} ${top - 14}H${p.x + w / 2 + 6}M${p.x - w / 2 - 6} ${bot + 14}H${p.x + w / 2 + 6}`} stroke={C.teal} strokeWidth={4} opacity={on('four')} />; })}
      {[...span.map((p, i) => ({x: p.x, y: cy, w: (i === 3 ? 0.9 : PROT.W) * u + 22, h: 2 * H + 22})), {x: ex.x, y: ex.y, w: 1.9 * u, h: 1.0 * u}].map((o, i) => <rect key={'m' + i} data-role="decor" x={o.x - o.w / 2} y={o.y - o.h / 2} width={o.w} height={o.h} rx={14} fill="none" stroke={C.primary} strokeWidth={3} opacity={on('mosaic')} />)}
      {on('extrinsic') > 0 && <rect data-role="decor" x={ex.x - 1.05 * u} y={ex.y - 0.6 * u} width={2.1 * u} height={1.2 * u} rx={18} fill="none" stroke={C.teal} strokeWidth={4} opacity={on('extrinsic')} />}
      {on('fluid') > 0 && <g opacity={on('fluid')}>
        <Arrow x1={Lf.x1 - 5.2 * u} y1={Lf.outerHead - 0.75 * u} x2={Lf.x1 - 6.8 * u} y2={Lf.outerHead - 0.75 * u} color="#A36B17" width={3} head={12} />
        <Arrow x1={Lf.x1 - 5.2 * u} y1={Lf.outerHead - 0.75 * u} x2={Lf.x1 - 3.6 * u} y2={Lf.outerHead - 0.75 * u} color="#A36B17" width={3} head={12} />
        <Arrow x1={Lf.x1 - 3.2 * u} y1={Lf.innerHead + 0.75 * u} x2={Lf.x1 - 4.8 * u} y2={Lf.innerHead + 0.75 * u} color="#A36B17" width={3} head={12} />
        <Arrow x1={Lf.x1 - 3.2 * u} y1={Lf.innerHead + 0.75 * u} x2={Lf.x1 - 1.6 * u} y2={Lf.innerHead + 0.75 * u} color="#A36B17" width={3} head={12} />
      </g>}
      {on('chol') > 0 && <path data-role="decor" d={`M${Lf.x0 - 20} ${co.y}H${Lf.x1 + 20}M${Lf.x0 - 20} ${ci.y}H${Lf.x1 + 20}`} stroke="#B8862F" strokeWidth={2} strokeDasharray="9 7" opacity={on('chol')} />}
      {/* key points: all leaders first, then all labels */}
      {lbls('leader')}
      {lbls('label')}
      <Lbl x={960} y={232} text="carbohydrate chains: outer face only (cell surface membrane)" anchor="middle" o={on('chains')} size={22} fill="#35652B" />
      <Txt x={1850} y={232} size={20} weight={700} fill={C.muted} anchor="end" opacity={fi(a('open'), 0.5)}>recap: the same membrane</Txt>
      <RBC x={1760} y={330} r={30} />
      <Cite x={90} y={930} text={SCHEM} />
      <Cite x={1850} y={930} text={PARTS} anchor="end" />
    </g>
  );
}
