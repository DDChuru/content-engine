import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Cite, SCHEM, sceneAges, receptorSites, CUE, clamp01, wrapText as wrap} from '../kit';
import {FluidMosaicMembrane, compPos, FULL} from '../FluidMosaicMembrane';
import {LigandA, receptorSite} from '../ReceptorLigand';

/** The small close-up of the seated insulin with the Beat 5 sentence (008f: every text ≥ 20 px; the box is sized to
 * the text, the membrane drawing carries no text). */
export function MiniClose({x, y, w = 420, h = 270, t, edge = 0, site = 0, o = 1}: any) {
  if (o <= 0) return null;
  const M = {cx: x + 130, cy: y + 88, u: 12, t, show: FULL}, r = compPos(M, 'receptor'), st = receptorSite(r.x, r.y, M.u);
  const lines = wrap('The ligand binds to a specific receptor because their shapes are complementary.', w - 28, 20, 700);
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={12} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      <defs><clipPath id={'mini' + x}><rect x={x + 6} y={y + 6} width={250} height={170} /></clipPath></defs>
      <g clipPath={`url(#mini${x})`}><FluidMosaicMembrane {...M} /></g>
      <LigandA x={r.x} y={st.y} u={M.u} />
      {edge > 0 && <path data-role="decor" d={`M${r.x - 0.46 * M.u} ${st.y}L${r.x} ${st.y + 0.56 * M.u}L${r.x + 0.46 * M.u} ${st.y}`} stroke="#E0892B" strokeWidth={3} fill="none" opacity={edge} />}
      <Lbl x={x + w - 14} y={y + 40} text="binding site" anchor="end" size={20} fill={site > 0 ? C.primary : C.ink} lx={r.x + 0.5 * M.u} ly={st.y + 2} />
      {lines.map((l, i) => <Txt key={i} x={x + 14} y={y + h - 38 - (lines.length - 1 - i) * 24} size={20} weight={700}>{l}</Txt>)}
      <Txt x={x + 14} y={y + h - 12} size={20} weight={600} fill={C.muted} italic>close-up: schematic; not to scale</Txt>
    </g>
  );
}
/** Beat 8 · What I told you, on the scene: no new slide; the scene built through the lesson, settled; the key
 * points brighten in place. */
export default function Beat08(s: any) {
  const a = s.a, t = Math.min(gt(s), CUE(8, 'settle'));
  const P = (k: string, d = 4.0) => fi(a(k), 0.4) * (1 - fe(a(k) - d, 0.6));
  const R = receptorSites(), B = SS.beta;
  const edge = {x: B.x + B.rx - 2, y: B.y - 20};
  return (
    <g>
      <Scene t={t} {...sceneAges(t)} bindMuscle={99} bind={99} fail={99} respond={1} vesselPulse={P('tra', 3)} liverGlow={0}
        receptorGlow={{muscle: Math.max(P('bin', 5), P('share', 3.5)), liver: Math.max(P('bin', 5), P('share', 3.5)), other: 0}}
        stage={{secretion: 0.45 + 0.55 * P('sec', 5.5), transport: 0.45 + 0.55 * P('tra', 5.5), binding: 0.45 + 0.55 * P('bin', 6), response: 0.45 + 0.55 * P('resp', 3)}}
        labels={{beta: 1, capillary: 1, muscle: 1, liver: 1, other: 1, gtp: 1}} />
      {P('sec', 5) > 0 && <circle data-role="decor" cx={edge.x} cy={edge.y} r={26} fill="none" stroke="#E0892B" strokeWidth={4} opacity={P('sec', 5)} />}
      <Lbl x={edge.x + 12} y={edge.y - 40} text="exocytosis" o={0.5 + 0.5 * P('exo', 2.5)} size={20} fill={P('exo', 2.5) > 0 ? C.primary : C.muted} />
      {P('tf', 2.8) > 0 && <rect data-role="decor" x={968} y={252} width={872} height={676} rx={24} fill="none" stroke="#8A6414" strokeWidth={5} strokeDasharray="12 8" opacity={P('tf', 2.8)} />}
      <Lbl x={1000} y={292} text="tissue fluid" o={0.5 + 0.5 * P('tf', 2.8)} size={20} fill="#8A6414" />
      {P('resp', 3) > 0 && <circle data-role="decor" cx={SS.muscle.x + SS.muscle.w / 2 - 70} cy={SS.muscle.y - SS.muscle.h / 2} r={34} fill="none" stroke="#E0892B" strokeWidth={4} opacity={P('resp', 3)} />}
      <Pill x={1840} y={560} text="one receptor, several cell types" anchor="end" o={0.45 + 0.55 * P('share', 3.5)} fill={C.teal} size={20} />
      <Pill x={SS.other.x - SS.other.r - 16} y={SS.other.y + 6} text="no response to insulin" anchor="end" o={0.45 + 0.55 * fi(a('none'), 0.4)} size={20} fill={C.primary} />
      <Pill x={SS.liver.x + SS.liver.r + 16} y={SS.liver.y + 42} text="responds (Topic 14)" o={0.6} size={20} fill="#8A6414" />
      <MiniClose x={112} y={652} t={t} edge={P('comp', 4)} site={P('comp', 4)} />
    </g>
  );
}
