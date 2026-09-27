import React from 'react';
import {fi, fe, pulse} from '../util';
import {Lbl, Pill, Wash, Stage3, RoleGrid, gridFill, COLS, ROWS, L3, C, Txt, Cite, SCHEM} from '../kit';
import {fmmLayout, compPos, plPos, FULL} from '../FluidMosaicMembrane';
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
  const H = PROT.H * u, pl3 = plPos(M, 15);   // inner phospholipid at slot 6 (clear of the extrinsic protein)
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
      <Lbl x={836} y={cy + 2.3 * u + 40} text="cytoplasm (watery)" anchor="end" size={21} fill={C.teal} />
      <RoleGrid t={t} fill={gridFill(s)} rowLit={rowLit} colLit={colLit} />
      <Txt x={Lf.x0 + 10} y={236} size={24} weight={800} fill={C.primary} opacity={fi(a('pl'), 0.5)}>partially permeable</Txt>
      {/* key points: above the membrane the glycolipid (leader to the OUTER glycolipid's chain/lipid junction; review
          4.1.3 #1) and the binding site; below, a staircase ordered by descending target x; all leaders under all labels */}
      {(['leader', 'label'] as const).map((part) => <g key={part}>
        <Lbl part={part} x={86} y={266} text="glycolipids: recognition, stability" o={fi(a('gl'), 0.5)} size={20} fill="#35652B" lx={gl.x} ly={Lf.outerHead - 0.34 * u} />
        <Lbl part={part} x={434} y={236} text="binding site" o={fi(a('rec'), 0.5)} size={20} fill="#2F7F86" lx={rc.x + 2} ly={rc.y - H + 12} />
        <Lbl part={part} x={gp.x - 16} y={604} text="glycoproteins: receptors," o={fi(a('gp'), 0.5)} size={20} fill="#35652B" lx={gp.x} ly={cy + H + 2} />
        <Lbl part={part} x={gp.x - 16} y={628} text="recognition, stability" o={fi(a('gp'), 0.5)} size={20} fill="#35652B" />
        <Lbl part={part} x={ca.x - 16} y={660} text="channel proteins · carrier proteins" o={fi(a('prot'), 0.5)} size={20} fill="#2F7F86" lx={ca.x} ly={cy + H + 4} />
        <Lbl part={part} x={ci.x - 16} y={692} text="cholesterol: fluidity, stability, permeability" o={fi(a('chol'), 0.5)} size={20} fill="#8A5F12" lx={ci.x} ly={ci.y + 0.3 * u} />
        <Lbl part={part} x={pl3.x - 16} y={724} text="fluid: phospholipids move sideways" o={fi(a('fluid'), 0.5)} size={20} fill="#A36B17" lx={pl3.x} ly={pl3.y + 0.4 * u} />
        <Lbl part={part} x={90} y={764} text="barrier to ions and polar molecules" o={fi(a('barrier'), 0.5)} size={20} fill={C.primary} />
      </g>)}
      <Txt x={560} y={870} size={24} weight={800} anchor="middle" opacity={fi(a('six'), 0.5)}>six roles · five kinds of molecule · one membrane</Txt>
      <Txt x={836} y={236} size={20} weight={700} fill={C.muted} anchor="end" opacity={fi(a('open'), 0.5)}>recap: the same membrane</Txt>
      <Cite x={1850} y={944} text={SCHEM} anchor="end" />
    </g>
  );
}
