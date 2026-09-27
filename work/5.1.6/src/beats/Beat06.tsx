/** Beat 6 · Benign or malignant. The tumour shown in two panels on the same tissue: left `benign-mass` (a continuous
 * boundary line; grows inside it; basement intact); right `malignant-invading` (extensions through the basement), then
 * `spread`: a cell detaches, squeezes into the blood vessel and is carried; another travels in the lymph; at the distant
 * panel a carried cell leaves the vessel and divides repeatedly into a secondary tumour. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Pile, AbCell, pilePositions} from '../TissueGrowthModel';
import {fi, fe, lerp} from '../util';

export const LB = {x: 70, y: 280, w: 860, h: 250, cols: 9, hc: 230};
export const RB = {x: 990, y: 280, w: 860, h: 250, cols: 9, hc: 230};
export default function Beat06(s: any) {
  const a = s.a, L = s.local;
  const GL = tGeom(LB as any), GR = tGeom(RB as any);
  const lc = GL.colX(4), rc = GR.colX(4);
  const nB = 12 + 4 * fe(a('bound'), 2.4);
  const inv = a('inv') >= 0 ? fe(a('inv'), 2.4) : 0;
  const P = pilePositions(rc, GR.bm, 12, 20, 1);
  const tip = P.down[P.down.length - 1] ?? [rc, GR.bm + 60];
  const away = a('away') >= 0 ? fe(a('away'), 1.4) : 0;
  const trav = a('travel') >= 0 ? Math.min(1, a('travel') / 2.6) : 0;
  const [by] = GR.blood, [ly] = GR.lymph;
  // carried cell (blood): detaches from the tip, squeezes into the vessel, is carried right and out of the panel
  const bx = trav > 0 ? lerp(tip[0], RB.x + RB.w + 10, trav) : lerp(tip[0], tip[0] + 10, away);
  const byy = trav > 0 ? by : lerp(tip[1], by, away);
  const lx2 = trav > 0 ? lerp(tip[0] - 60, RB.x + RB.w + 10, Math.min(1, trav * 0.8)) : tip[0] - 60, lyy = trav > 0 ? ly : lerp(tip[1], ly, away);
  const DP = {x: 1200, y: 790, w: 650, h: 150};
  const settle = a('settle') >= 0 ? fe(a('settle'), 1.4) : 0;
  const nSec = a('sec') >= 0 ? 1 + 5 * Math.min(1, a('sec') / 2.4) : 1;
  return (
    <g>
      <Tissue {...LB} t={L * 0.16} shed={1} vesselT={L} labels={0} />
      <Tissue {...RB} t={L * 0.16} shed={1} vesselT={L} labels={1} />
      <Pile cx={lc} bm={GL.bm} n={nB} r={20} boundary={fe(a('bound'), 1.2)} />
      <Pile cx={rc} bm={GR.bm} n={12} r={20} invade={inv} />
      {a('noinv') >= 0 && <path data-role="decor" d={`M${LB.x} ${GL.bm}H${LB.x + LB.w}`} stroke={T5.ring} strokeWidth={6} opacity={fi(a('noinv'), 0.4)} />}
      <Tag x={LB.x + 10} y={LB.y - 14} text="benign tumour" size={22} opacity={fi(a('benign'), 0.4)} />
      {a('noinv') >= 0 && <Tag x={LB.x + 300} y={GL.bottom + 22} text="stays in one place; does not invade" size={19} opacity={fi(a('noinv'), 0.4)} />}
      <Tag x={RB.x + 10} y={RB.y - 14} text="malignant tumour (a cancer)" size={22} opacity={fi(a('malig'), 0.4)} />
      {a('inv') >= 0 && <Tag x={RB.x + 470} y={GR.bm + 60} text="invades surrounding tissue" size={18} opacity={fi(a('inv'), 0.4)} />}
      {a('away') >= 0 && trav < 1 && <AbCell x={bx} y={byy} r={16} seed={7} />}
      {a('away') >= 0 && trav < 1 && <AbCell x={lx2} y={lyy} r={14} seed={9} />}
      {a('settle') >= 0 && <g opacity={fi(a('settle'), 0.5)}>
        <rect data-role="decor" x={DP.x} y={DP.y} width={DP.w} height={DP.h} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <Txt x={DP.x + 14} y={DP.y + 24} size={16} weight={700} fill={C.muted} italic>elsewhere in the body (schematic)</Txt>
        <g data-role="drawing">
          <rect x={DP.x + 20} y={DP.y + 100} width={DP.w - 40} height={34} rx={17} fill="#F6D9D3" stroke="#B98A80" strokeWidth={2} />
          <rect x={DP.x + 20} y={DP.y + 40} width={DP.w - 40} height={50} rx={10} fill="#F4EAD8" />
        </g>
        {a('sec') < 0 ? <AbCell x={lerp(DP.x + 60, DP.x + 330, settle)} y={lerp(DP.y + 117, DP.y + 70, settle)} r={14} seed={7} />
          : Array.from({length: Math.ceil(nSec)}, (_, i) => { const k = i === Math.ceil(nSec) - 1 ? nSec - i : 1; return <AbCell key={i} x={DP.x + 330 + ((i % 3) - 1) * 26 * k} y={DP.y + 70 - Math.floor(i / 3) * 22 * k} r={13} seed={i + 3} op={Math.min(1, 0.4 + k)} />; })}
        {a('sec') >= 0 && <Tag x={DP.x + 400} y={DP.y + 64} text="secondary tumour" size={18} opacity={fi(a('sec'), 0.4)} />}
      </g>}
      <Txt x={70} y={950} size={15} weight={600} fill={C.muted} italic>schematic tissue; not to scale · division shown compressed; interphase and early mitosis omitted</Txt>
    </g>
  );
}
