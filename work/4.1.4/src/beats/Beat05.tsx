import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Cite, SCHEM, Stage, RegionLabels, Sentence, sceneAges, receptorSites, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {LigandA, LigandB, receptorSite, seatMotion, failMotion} from '../ReceptorLigand';
import {InkRing} from '../../shared/src/Type';

const ez = (k: number) => { k = clamp01(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; };
/** The binding close-up used by Beats 5–7: FluidMosaicMembrane with the receptor glycoprotein near x = 760. */
export const CL = {cx: 673, cy: 560, u: 58};
export function closeM(t: number, extra: any = {}) { return {...CL, t, show: FULL, ...extra}; }
/** Ligand A's top-centre for the seated insulin at global t (seated from Beat 5's `seat` on). */
export function seatedA(M: any, age: number) {
  const r = compPos(M, 'receptor'), site = receptorSite(r.x, r.y, M.u), sm = seatMotion(age);
  return {x: r.x, y: site.y + sm.dy * M.u, r, site};
}
/** An envelope passing a row of three numbered doors; it stops and the matching door opens (the handle). */
export function EnvelopeInset({x, y, a0, am, o = 1}: any) {
  if (o <= 0) return null;
  const doors = [{n: '12', x: x + 90}, {n: '27', x: x + 230}, {n: '35', x: x + 370}];
  const ex = am < 0 ? x + 20 + 360 * clamp01(a0 / 5.4) : x + 380;
  const open = ez(am / 0.8);
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={480} height={250} rx={14} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      <g data-role="drawing">
        <rect x={x + 16} y={y + 150} width={448} height={16} fill="#C9A98A" />
        {doors.map((d, i) => <g key={i}>
          <rect x={d.x - 30} y={y + 70} width={60} height={80} fill="#8C6C4E" />
          <rect x={d.x - 30} y={y + 70} width={60 * (i === 2 ? 1 - 0.75 * open : 1)} height={80} fill="#B9936E" stroke="#6B4F36" strokeWidth={2} />
        </g>)}
        <rect x={ex - 30} y={y + 20} width={60} height={38} rx={4} fill="#FFFDF5" stroke="#5E6B75" strokeWidth={2} />
        <path d={`M${ex - 30} ${y + 20}L${ex} ${y + 42}L${ex + 30} ${y + 20}`} stroke="#5E6B75" strokeWidth={2} fill="none" />
      </g>
      {doors.map((d, i) => <text key={i} x={d.x} y={y + 188} fontSize={20} fontWeight={800} fill="#253247" textAnchor="middle" fontFamily="'Stem4Life Source Sans 3', sans-serif">{d.n}</text>)}
      <text x={ex} y={y + 76} fontSize={15} fontWeight={800} fill="#B2352C" textAnchor="middle" fontFamily="'Stem4Life Source Sans 3', sans-serif">to: 35</text>
      <Txt x={x + 16} y={y + 226} size={15} weight={700} fill={C.muted} italic>handle: an aid to memory, not an exam answer</Txt>
    </g>
  );
}

/** Beat 5 · Stage three, binding: the scene zooms onto a muscle-cell receptor and cross-fades into the membrane
 * close-up; receptor, glycoprotein chain, binding site; ligand B fails; insulin seats; the envelope handle; the
 * sentence. */
export default function Beat05(s: any) {
  const t = gt(s), a = s.a;
  const R = receptorSites().muscle[0];
  const zk = fe(a('open') - 0.3, 1.4), z = 1 + 2.4 * zk;
  const sceneO = 1 - fe(a('open') - 0.9, 0.7), closeO = fe(a('open') - 0.9, 0.7);
  const M = closeM(t, {highlight: 'receptor-glycoprotein', hl: fi(a('rec'), 0.5)}), Lf = fmmLayout(M);
  const A = seatedA(M, a('seat'));
  const rx = A.r.x, top = A.site.y;
  // ligand B: descends from `wrong`, touches at `touch`, rocks, holds, drifts away at `away`
  const wb = a('wrong');
  let bpos: any = null;
  if (wb >= 0 && a('away') < 2.2) {
    const tt = a('touch');
    if (tt < -0.55) { const k = ez(wb / Math.max(0.1, (CLtouch(s) - 0.55))); bpos = {dx: 0, dy: -4.0 + (4.0 - 2.4) * k, rot: 0}; }
    else if (a('away') < 0) { const fm = failMotion(Math.min(tt + 0.55, 1.0) + (tt + 0.55 > 1.0 ? 0 : 0)); bpos = {...fm, rot: tt + 0.55 > 1.0 ? 3 * Math.sin((tt + 0.55) * 4) : fm.rot}; }
    else { const fm = failMotion(1.0 + Math.min(a('away'), 0.5)); const k = clamp01((a('away') - 0.5) / 1.7); bpos = {dx: fm.dx + 1.2 * k, dy: fm.dy - 5 * k, rot: fm.rot}; }
  }
  const aDesc = a('insulin'), aSeat = a('seat');
  const aY = aSeat >= 0 ? A.y : aDesc >= 0 ? top - 2.6 * M.u - (1 - ez(aDesc / 1.4)) * 1.6 * M.u : -999;
  return (
    <g>
      {sceneO > 0 && <g opacity={sceneO}><Scene z={z} zx={R[0]} zy={R[1]} t={t} {...sceneAges(t)} stage={{secretion: 0.4, transport: 0.4, binding: fi(a('open'), 0.4)}} labels={{beta: 1, capillary: 1}} /></g>}
      {closeO > 0 && <g opacity={closeO}>
        <Stage s={s} cx={CL.cx} cy={CL.cy} u={CL.u} xw={[Lf.x0, Lf.x1]} mem={{show: FULL, highlight: 'receptor-glycoprotein', hl: fi(a('rec'), 0.5)}} />
        <RegionLabels cy={CL.cy} u={CL.u} x={Lf.x0} />
        <Lbl x={Lf.x0} y={228} text="muscle cell surface: close-up" size={20} fill={C.muted} />
        <Cite x={Lf.x1} y={936} text={SCHEM} anchor="end" />
      </g>}
      {bpos && <LigandB x={rx + bpos.dx * M.u} y={top + bpos.dy * M.u} u={M.u} rot={bpos.rot} opacity={fi(wb, 0.5) * (1 - fe(a('away') - 1.4, 0.6))} />}
      <Lbl x={rx + 1.3 * M.u} y={top - 3.2 * M.u} text="a different signalling molecule" o={fi(wb, 0.4) * (1 - fe(a('away') - 0.6, 0.5))} size={21} fill="#7D1F5A" />
      <Pill x={rx + 1.4 * M.u} y={top - 1.2 * M.u} text="not complementary" o={fi(a('nofit'), 0.4) * (1 - fe(a('insulin'), 0.5))} fill={C.primary} />
      {aY > -900 && <LigandA x={rx} y={aY} u={M.u} opacity={fi(aDesc, 0.5)} />}
      <Lbl x={rx + 1.3 * M.u} y={top - 3.2 * M.u} text="insulin (ligand)" o={fi(aDesc, 0.4)} size={22} fill="#7D1F5A" lx={rx + 0.8 * M.u} ly={aY - 0.3 * M.u} />
      <Lbl x={rx - 1.6 * M.u} y={top - 3.6 * M.u} text="cell surface receptor" anchor="end" o={fi(a('rec'), 0.4) * closeO} size={22} lx={rx - 0.9 * M.u} ly={top + 0.6 * M.u} />
      <InkRing cx={rx + 1.25 * M.u} cy={top - 0.9 * M.u} rx={0.55 * M.u} ry={1.1 * M.u} p={fe(a('gp'), 0.5)} opacity={1 - fe(a('site'), 0.5)} color={C.teal} />
      <Pill x={rx + 1.9 * M.u} y={top - 1.6 * M.u} text="glycoprotein (recall 4.1.3)" o={fi(a('gp'), 0.4) * (1 - fe(a('wrong'), 0.5))} fill={C.teal} size={16} />
      <InkRing cx={rx} cy={top + 0.3 * M.u} rx={0.75 * M.u} ry={0.55 * M.u} p={fe(a('site'), 0.5)} opacity={1 - fe(a('wrong'), 0.5)} />
      <Lbl x={rx - 1.6 * M.u} y={top + 1.4 * M.u} text="binding site" anchor="end" o={fi(a('site'), 0.4) * closeO} size={21} lx={rx - 0.5 * M.u} ly={top + 0.35 * M.u} />
      {aSeat >= 0.8 && <path data-role="decor" d={`M${rx - 0.46 * M.u} ${top}L${rx} ${top + 0.56 * M.u}L${rx + 0.46 * M.u} ${top}`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={pulse(aSeat - 0.8, 1.8)} />}
      <Pill x={rx + 1.4 * M.u} y={top - 1.0 * M.u} text="complementary shape" o={fi(aSeat - 0.8, 0.4)} fill={C.teal} />
      <Pill x={rx + 1.4 * M.u} y={top - 0.1 * M.u} text="bound" o={fi(a('bound'), 0.4)} fill={C.primary} />
      <EnvelopeInset x={1330} y={250} a0={a('env')} am={a('match')} o={fi(a('env'), 0.5) * (1 - 0.6 * fe(a('written'), 0.5))} />
      {a('written') >= 0 && <Sentence x={Lf.x0 + 30} y={770} w={1100} size={27} o={fi(a('written'), 0.4)} lines={[{text: 'The ligand binds to a specific receptor', o: fi(a('sent'), 0.4)}, {text: 'because their shapes are complementary.', o: fi(a('sent') - 1.6, 0.4)}]} />}
    </g>
  );
}
function CLtouch(s: any) { return s.at.touch - s.at.wrong; }
