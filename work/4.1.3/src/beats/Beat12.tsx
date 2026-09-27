import React from 'react';
import {fi, fe, pulse} from '../util';
import {Lbl, Pill, Wash, Stage3, RoleGrid, gridFill, COLS, ROWS, L3, C, Txt, Cite, SCHEM} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';
import {LigandA} from '../ReceptorLigand';

/** Beat 12 · What I told you, on the membrane: the SAME layout (membrane left, completed RoleGrid right), held still
 * (the clock freezes at the beat's first frame), key points brightening in place. No new slide. */
export default function Beat12(s: any) {
  const a = s.a, {cx, cy, u} = L3, t = s.sc.startFrame / 30;
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), P = (k: any) => compPos(M, k);
  const ch = P('channel'), ca = P('carrier'), rc = P('receptor'), gp = P('glycoprotein'), gl = P('glycolipid'), co = P('cholOut'), ci = P('cholIn');
  const span = (k1: string, k2: string) => fe(a(k1), 0.5) * (1 - fe(a(k2), 0.5));
  const on = {pl: span('pl', 'chol'), ch: span('chol', 'prot'), pr: span('prot', 'gp'), gp: span('gp', 'gl'), gl: span('gl', 'six'), six: fe(a('six'), 0.5)};
  const rows = {phospholipids: on.pl, cholesterol: on.ch, proteins: on.pr, glycoproteins: on.gp, glycolipids: on.gl};
  const rowLit: any = {}, colLit: any = {};
  ROWS.forEach((r) => { rowLit[r] = Math.max((rows as any)[r] ?? 0, on.six * 0.8); });
  COLS.forEach((c) => { colLit[c] = on.six * 0.8; });
  const H = PROT.H * u;
  const tag = (k: string, x: number, y: number, text: string, lx: number, ly: number, fill = C.ink) => <Lbl x={x} y={y} text={text} o={fi(a(k), 0.5)} size={20} fill={fill} lx={lx} ly={ly} />;
  const chainGlow = Math.max(on.gp, on.gl);
  return (
    <g>
      <Wash x={Lf.x0 - 10} y={cy - 1.5 * u} w={Lf.width + 20} h={3 * u} o={0.8 * on.pl} fill="#EDE7DA" />
      {[co, ci].map((p, i) => <circle key={i} data-role="decor" cx={p.x} cy={p.y + (i ? -0.7 : 0.7) * u} r={0.9 * u} fill="#FFF3C4" opacity={0.8 * on.ch} />)}
      {[ch, ca, rc].map((p, i) => <rect key={i} data-role="decor" x={p.x - PROT.W * u / 2 - 8} y={cy - H - 8} width={PROT.W * u + 16} height={2 * H + 16} rx={14} fill="#FFFFFF" opacity={0.8 * (i < 2 ? on.pr * (1 - fe(a('rec'), 0.4)) : on.pr * fe(a('rec'), 0.4))} />)}
      {chainGlow > 0 && [gl.x + 0.2 * u, rc.x + 0.62 * u, gp.x].map((x, i) => <rect key={'c' + i} data-role="decor" x={x - 0.55 * u} y={Lf.top - 2.2 * u} width={1.1 * u} height={2.2 * u} rx={12} fill="#E3F2DC" opacity={i === 0 ? on.gl : on.gp} />)}
      <Stage3 s={s} mem={{t}} />
      <LigandA x={rc.x} y={rc.y - H} u={u} />
      <Lbl x={250} y={cy + 2.3 * u + 84} text="cytoplasm (watery)" size={21} fill={C.teal} />
      <RoleGrid t={t} fill={gridFill(s)} rowLit={rowLit} colLit={colLit} />
      <Txt x={Lf.x0 + 10} y={236} size={24} weight={800} fill={C.primary} opacity={fi(a('pl'), 0.5)}>partially permeable</Txt>
      {tag('barrier', 110, 690, 'barrier to ions and polar molecules', Lf.x0 + 1.2 * u, cy + 0.4 * u, C.primary)}
      {tag('fluid', 110, 726, 'fluid: phospholipids move sideways', Lf.x0 + 2.2 * u, Lf.innerHead + 0.3 * u, '#A36B17')}
      {tag('chol', 110, 762, 'cholesterol: fluidity, stability, permeability', ci.x, ci.y + 0.3 * u, '#8A5F12')}
      {tag('prot', 560, 690, 'channel proteins · carrier proteins', ca.x, cy + H + 4, '#2F7F86')}
      {tag('rec', 560, 726, 'binding site', rc.x + 6, rc.y - H + 14, '#2F7F86')}
      {tag('gp', 560, 762, 'glycoproteins: receptors, recognition, stability', gp.x + 0.4 * u, cy + H, '#35652B')}
      {tag('gl', 560, 798, 'glycolipids: recognition, stability', gl.x + 0.3 * u, Lf.innerHead + 0.4 * u, '#35652B')}
      <Txt x={560} y={870} size={24} weight={800} anchor="middle" opacity={fi(a('six'), 0.5)}>six roles · five kinds of molecule · one membrane</Txt>
      <Txt x={1040} y={236} size={18} weight={700} fill={C.muted} anchor="end" opacity={fi(a('open'), 0.5)}>recap: the same membrane</Txt>
      <Cite x={1040} y={948} text={SCHEM} anchor="end" />
    </g>
  );
}
