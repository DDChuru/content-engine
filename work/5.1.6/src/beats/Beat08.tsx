/** Beat 8 · What I told you, on the tissue. No new slide: the balanced tissue with its pans, the starred lineage and
 * tumour, the benign and malignant panels with the vessels and the secondary tumour, and the chromosome inset in its
 * post-division state; static; key points fade in in place. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Pile, Balance, AbCell} from '../TissueGrowthModel';
import {fi, pulse} from '../util';
import {ChromInset} from './tis';

export default function Beat08(s: any) {
  const a = s.a;
  const b = (k: string) => (a(k) >= 0 ? Math.max(0.5, pulse(a(k), 1.4)) : 0);
  const A = {x: 70, y: 280, w: 440, h: 170, cols: 5, hc: 130}, Bx = {x: 680, y: 280, w: 560, h: 170, cols: 6, hc: 130};
  const Cb = {x: 70, y: 640, w: 560, h: 150, cols: 6, hc: 110}, Dm = {x: 680, y: 640, w: 560, h: 150, cols: 6, hc: 110};
  const GA = tGeom(A as any), GB = tGeom(Bx as any), GC = tGeom(Cb as any), GD = tGeom(Dm as any);
  const pt = (x: number, y: number, t: string, k: string) => a(k) >= 0 ? <Tag x={x} y={y} text={t} size={17} opacity={fi(a(k), 0.4)} /> : null;
  const hiRect = (x: number, y: number, w: number, h: number, v: number) => v > 0 ? <rect data-role="decor" x={x} y={y} width={w} height={h} rx={12} fill="none" stroke={T5.ring} strokeWidth={4} opacity={v} /> : null;
  return (
    <g>
      <Tissue {...A} t={0.3} shed={0} />
      <Balance x={595} y={340} tilt={0} op={0.9} hi={b('bal')} s={0.45} />
      <Tissue {...Bx} t={0.3} shed={0} />
      <Pile cx={GB.colX(3)} bm={GB.bm} n={14} r={16} />
      <Tissue {...Cb} t={0.3} shed={0} />
      <Pile cx={GC.colX(3)} bm={GC.bm} n={12} r={15} boundary={1} />
      <Tissue {...Dm} t={0.3} shed={0} labels={1} />
      <Pile cx={GD.colX(3)} bm={GD.bm} n={12} r={15} invade={1} />
      <rect data-role="decor" x={1270} y={640} width={580} height={250} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <Txt x={1284} y={664} size={15} weight={700} fill={C.muted} italic>elsewhere in the body (schematic)</Txt>
      <g data-role="drawing"><rect x={1290} y={800} width={540} height={34} rx={17} fill="#F6D9D3" stroke="#B98A80" strokeWidth={2} /></g>
      {[0, 1, 2, 3, 4, 5].map((i) => <AbCell key={i} x={1560 + ((i % 3) - 1) * 26} y={760 - Math.floor(i / 3) * 22} r={13} seed={i + 3} />)}
      <Txt x={1600} y={720} size={16} weight={800} fill={T5.ringHalo}>secondary tumour</Txt>
      <ChromInset x={1560} y={390} r={110} rep={-1} star={1} caption="one daughter chromosome with the starred band" />
      <Txt x={A.x} y={A.y - 14} size={16} weight={700} fill={T5.ringHalo}>balanced tissue</Txt>
      <Txt x={Bx.x} y={Bx.y - 14} size={16} weight={700} fill={T5.ringHalo}>starred lineage → tumour</Txt>
      <Txt x={Cb.x} y={Cb.y - 14} size={16} weight={700} fill={T5.ringHalo}>benign tumour</Txt>
      <Txt x={Dm.x} y={Dm.y - 14} size={16} weight={700} fill={T5.ringHalo}>malignant tumour (a cancer)</Txt>
      {hiRect(A.x - 6, A.y - 6, A.w + 12, A.h + A.hc + 12, b('bal'))}
      {hiRect(1440, 270, 240, 240, b('mut'))}
      {hiRect(Bx.x - 6, Bx.y - 6, Bx.w + 12, Bx.h + 12, Math.max(b('inh'), b('mass')))}
      {hiRect(Cb.x - 6, Cb.y - 6, Cb.w + 12, Cb.h + 12, b('ben'))}
      {hiRect(Dm.x - 6, Dm.y - 6, Dm.w + 12, Dm.h + Dm.hc + 12, Math.max(b('mal'), b('spread')))}
      {hiRect(1270, 640, 580, 250, b('spread'))}
      {pt(A.x + 10, A.y + A.h + A.hc + 30, 'controlled mitosis replaces lost cells', 'bal')}
      {pt(1330, 540, 'a control-disrupting mutation → loss of control', 'mut')}
      {pt(Bx.x + 10, Bx.y + Bx.h + Bx.hc + 30, 'inherited → repeated, uncontrolled mitosis', 'inh')}
      {pt(Bx.x + 10, Bx.y + Bx.h + Bx.hc + 62, 'mass of abnormal cells = tumour', 'mass')}
      {pt(Cb.x + 10, Cb.y + Cb.h + Cb.hc + 34, 'benign: typically stays in one place', 'ben')}
      {pt(Dm.x + 10, Dm.y + Dm.h + Dm.hc + 34, 'malignant: invades; can spread; secondary tumours', 'mal')}
      <Txt x={70} y={950} size={14} weight={600} fill={C.muted} italic>schematic tissue; not to scale</Txt>
    </g>
  );
}
