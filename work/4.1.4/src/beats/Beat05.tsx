import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Cite, SCHEM, Stage, RegionLabels, Sentence, sceneAges, receptorSites, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {LigandA, LigandB, receptorSite, seatMotion, failMotion} from '../ReceptorLigand';
import {InkRing} from '../../shared/src/Type';

const ez = (k: number) => { k = clamp01(k); return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; };
/** The binding close-up used by Beats 5–7: FluidMosaicMembrane with the receptor glycoprotein near x = 760. */
export const CL = {cx: 806, cy: 560, u: 58};
/** 008f: the close-up is a WINDOW onto the section (x 360–1300; the receptor at x 700), so the region labels sit in
 * the clear space at its left and nothing is printed on the membrane. */
export const CW = {x0: 360, x1: 1300};
export function CloseStage({s, mem = {}, n = [26, 20], id = 'closewin'}: any) {
  return (
    <g>
      <defs><clipPath id={id}><rect x={CW.x0} y={196} width={CW.x1 - CW.x0} height={744} /></clipPath></defs>
      <g clipPath={`url(#${id})`}><Stage s={s} cx={CL.cx} cy={CL.cy} u={CL.u} xw={[CW.x0, CW.x1]} mem={{show: FULL, ...mem}} n={n} /></g>
    </g>
  );
}
export function closeM(t: number, extra: any = {}) { return {...CL, t, show: FULL, ...extra}; }
/** Ligand A's top-centre for the seated insulin at global t (seated from Beat 5's `seat` on). */
export function seatedA(M: any, age: number) {
  const r = compPos(M, 'receptor'), site = receptorSite(r.x, r.y, M.u), sm = seatMotion(age);
  return {x: r.x, y: site.y + sm.dy * M.u, r, site};
}
/** An envelope passing a row of three numbered doors; it stops and the matching door opens (the handle).
 * 008f: the address is written ON the envelope (part of the drawing, 20 px); `hl` = {letter, address, door} light the
 * hook's three links one at a time (RULE-MEMORY-HOOKS). */
export const ENV = {w: 480, h: 290};
export function EnvelopeInset({x, y, a0, am, o = 1, hl = {}}: any) {
  if (o <= 0) return null;
  const doors = [{n: '12', x: x + 90}, {n: '27', x: x + 240}, {n: '35', x: x + 390}];
  const ex = am < 0 ? x + 60 + 330 * clamp01(a0 / 5.4) : x + 390;
  const open = ez(am / 0.8), L = hl.letter ?? 0, A = hl.address ?? 0, D = hl.door ?? 0;
  const FONT = "'Stem4Life Source Sans 3', sans-serif";
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={ENV.w} height={ENV.h} rx={14} fill="#FFFFFF" stroke={C.line} strokeWidth={2} />
      {L > 0 && <rect data-role="decor" x={ex - 60} y={y + 16} width={120} height={78} rx={12} fill="#F6C6E0" opacity={L} />}
      {D > 0 && <rect data-role="decor" x={doors[2].x - 44} y={y + 98} width={88} height={102} rx={10} fill="#C9E8DA" opacity={D} />}
      <g data-role="drawing">
        <rect x={x + 16} y={y + 184} width={ENV.w - 32} height={14} fill="#C9A98A" />
        {doors.map((d, i) => <g key={i}>
          <rect x={d.x - 32} y={y + 104} width={64} height={80} fill="#8C6C4E" />
          <rect x={d.x - 32} y={y + 104} width={64 * (i === 2 ? 1 - 0.75 * open : 1)} height={80} fill="#B9936E" stroke="#6B4F36" strokeWidth={2} />
        </g>)}
        <rect x={ex - 52} y={y + 24} width={104} height={62} rx={5} fill="#FFFDF5" stroke="#5E6B75" strokeWidth={2} />
        <path d={`M${ex - 52} ${y + 24}L${ex} ${y + 50}L${ex + 52} ${y + 24}`} stroke="#5E6B75" strokeWidth={2} fill="none" />
        {A > 0 && <rect x={ex - 36} y={y + 58} width={72} height={24} rx={5} fill="#FCE3A8" opacity={A} />}
        <text x={ex} y={y + 77} fontSize={20} fontWeight={800} fill="#B2352C" textAnchor="middle" fontFamily={FONT}>to: 35</text>
      </g>
      {doors.map((d, i) => <text key={i} x={d.x} y={y + 224} fontSize={22} fontWeight={800} fill="#253247" textAnchor="middle" fontFamily={FONT}>{d.n}</text>)}
      <Txt x={x + 16} y={y + 270} size={20} weight={700} fill={C.muted} italic>handle: an aid to memory, not an exam answer</Txt>
    </g>
  );
}

/** Beat 5 · Stage three, binding: the scene zooms onto a muscle-cell receptor and cross-fades into the membrane
 * close-up; receptor, glycoprotein chain, binding site; ligand B fails; insulin seats; the envelope handle; the
 * sentence. */
export default function Beat05(s: any) {
  const t = gt(s), a = s.a;
  const R = receptorSites().muscle[0];
  const zk = fe(a('open') - 1.0, 1.4), z = 1 + 2.4 * zk, labelO = 1 - fi(a('open') - 0.6, 0.4);   // the scene's text fades before the zoom
  const sceneO = 1 - fe(a('open') - 1.6, 0.7), closeO = fe(a('open') - 1.6, 0.7);
  const M = closeM(t, {highlight: 'receptor-glycoprotein', hl: fi(a('rec'), 0.5)}), Lf = fmmLayout(M);
  const A = seatedA(M, a('seat'));
  const rx = A.r.x, top = A.site.y;
  // ligand B: descends from `wrong`, touches at `touch`, rocks, holds, drifts away at `away`
  const wb = a('wrong');
  let bpos: any = null;
  if (wb >= 0 && a('away') < 2.2) {
    const tt = a('touch');
    if (tt < -0.55) { const k = ez(wb / Math.max(0.1, (CLtouch(s) - 0.55))); bpos = {dx: 0, dy: -3.1 + (3.1 - 2.4) * k, rot: 0}; }
    else if (a('away') < 0) { const fm = failMotion(Math.min(tt + 0.55, 1.0) + (tt + 0.55 > 1.0 ? 0 : 0)); bpos = {...fm, rot: tt + 0.55 > 1.0 ? 3 * Math.sin((tt + 0.55) * 4) : fm.rot}; }
    else { const fm = failMotion(1.0 + Math.min(a('away'), 0.5)); const k = clamp01((a('away') - 0.5) / 1.7); bpos = {dx: fm.dx + 1.2 * k, dy: fm.dy - 5 * k, rot: fm.rot}; }
  }
  const aDesc = a('insulin'), aSeat = a('seat');
  const EX = 1360, EY = 236, off = fi(a('written') - 0.6, 0.6);
  const H1 = fi(a('l1'), 0.4) * (1 - off), H2 = fi(a('l2'), 0.4) * (1 - off), H3 = fi(a('l3'), 0.4) * (1 - off);
  const aY = aSeat >= 0 ? A.y : aDesc >= 0 ? top - 2.6 * M.u - (1 - ez(aDesc / 1.4)) * 0.5 * M.u : -999;
  return (
    <g>
      {sceneO > 0 && <g opacity={sceneO}><Scene z={z} zx={R[0]} zy={R[1]} t={t} {...sceneAges(t)} stage={{secretion: 0.4, transport: 0.4, binding: fi(a('open'), 0.4)}} labels={{beta: 1, capillary: 1}} labelO={labelO} /></g>}
      {closeO > 0 && <g opacity={closeO}>
        <CloseStage s={s} mem={{highlight: 'receptor-glycoprotein', hl: fi(a('rec'), 0.5)}} />
      </g>}
      {/* the close-up's text arrives once the zoomed scene has gone (no label over the outgoing drawing) */}
      {fi(a('open') - 2.3, 0.3) > 0 && <g opacity={fi(a('open') - 2.3, 0.3)}>
        <RegionLabels cy={CL.cy} u={CL.u} x={90} />
        <Lbl x={CW.x0} y={228} text="muscle cell surface: close-up" size={20} fill={C.muted} />
        <Cite x={CW.x1} y={936} text={SCHEM} anchor="end" />
      </g>}
      <g clipPath="url(#closewin)">{bpos && <LigandB x={rx + bpos.dx * M.u} y={top + bpos.dy * M.u} u={M.u} rot={bpos.rot} opacity={fi(wb, 0.5) * (1 - fe(a('away') - 1.4, 0.6))} />}
      </g>
      <Lbl x={rx + 1.1 * M.u} y={top - 2.6 * M.u} text="a different signalling molecule" o={fi(wb, 0.4) * (1 - fe(a('away'), 0.4))} size={21} fill="#7D1F5A" />
      <Pill x={rx - 1.2 * M.u} y={top - 0.8 * M.u} text="not complementary" anchor="end" o={fi(a('nofit'), 0.4) * (1 - fe(a('insulin'), 0.5))} fill={C.primary} />
      {H1 > 0 && <circle data-role="decor" cx={rx} cy={A.y + 0.35 * M.u} r={0.9 * M.u} fill="#F6C6E0" opacity={0.85 * H1} />}
      {aY > -900 && <LigandA x={rx} y={aY} u={M.u} opacity={fi(aDesc, 0.5)} />}
      <Lbl x={rx + 1.1 * M.u} y={top - 2.6 * M.u} text="insulin (ligand)" o={fi(aDesc, 0.4)} size={22} fill="#7D1F5A" lx={rx + 0.8 * M.u} ly={aY - 0.3 * M.u} />
      <Lbl x={rx - 1.6 * M.u} y={top - 2.6 * M.u} text="cell surface receptor" anchor="end" o={fi(a('rec'), 0.4) * closeO} size={22} lx={rx - 0.9 * M.u} ly={top + 0.6 * M.u} />
      <InkRing cx={rx + 1.25 * M.u} cy={top - 0.9 * M.u} rx={0.55 * M.u} ry={1.1 * M.u} p={fe(a('gp'), 0.5)} opacity={1 - fe(a('site'), 0.5)} color={C.teal} />
      <Pill x={rx + 1.9 * M.u} y={top - 1.9 * M.u} text="glycoprotein (recall 4.1.3)" o={fi(a('gp'), 0.4) * (1 - fe(a('wrong'), 0.5))} fill={C.teal} size={20} />
      <InkRing cx={rx} cy={top + 0.3 * M.u} rx={0.75 * M.u} ry={0.55 * M.u} p={fe(a('site'), 0.5)} opacity={1 - fe(a('wrong'), 0.5)} />
      <Lbl x={rx - 1.6 * M.u} y={top - 1.5 * M.u} text="binding site" anchor="end" o={fi(a('site'), 0.4) * closeO} size={21} lx={rx - 0.5 * M.u} ly={top + 0.35 * M.u} />
      {aSeat >= 0.8 && <path data-role="decor" d={`M${rx - 0.46 * M.u} ${top}L${rx} ${top + 0.56 * M.u}L${rx + 0.46 * M.u} ${top}`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={pulse(aSeat - 0.8, 1.8)} />}
      <Pill x={rx - 1.2 * M.u} y={top - 0.8 * M.u} text="complementary shape" anchor="end" o={fi(aSeat - 0.8, 0.4)} fill={C.teal} />
      <Pill x={rx - 1.2 * M.u} y={top - 0.2 * M.u} text="bound" anchor="end" o={fi(a('bound'), 0.4)} fill={C.primary} />
      {/* the hook, one link at a time: envelope ↔ insulin, address ↔ its shape, matching door ↔ the binding site; the
          completed mapping holds (2 s of silence) until the qualifier, then fades as the sentence builds */}
      {H2 > 0 && <path data-role="decor" d={`M${rx - 0.5 * M.u} ${A.y - 0.05 * M.u}L${rx} ${A.y + 0.62 * M.u}L${rx + 0.5 * M.u} ${A.y - 0.05 * M.u}Z`} fill="none" stroke="#E0A020" strokeWidth={5} strokeLinejoin="round" opacity={H2} />}
      {H3 > 0 && <InkRing cx={rx} cy={top + 0.3 * M.u} rx={0.95 * M.u} ry={0.7 * M.u} p={1} opacity={H3} color="#2E8A5E" />}
      <EnvelopeInset x={EX} y={EY} a0={a('env')} am={a('match')} o={fi(a('env'), 0.5) * (1 - 0.6 * fe(a('written'), 0.5))} hl={{letter: H1, address: H2, door: H3}} />
      {H1 > 0 && <path data-role="decor" d={`M${EX + 330} ${EY + 20}Q${(EX + rx) / 2 + 100} ${EY - 30} ${rx + 0.9 * M.u} ${A.y - 0.2 * M.u}`} stroke="#B0417A" strokeWidth={3} strokeDasharray="8 6" fill="none" opacity={H1} />}
      <g opacity={fi(a('l1'), 0.4) * (1 - off)}><Txt x={EX} y={EY + ENV.h + 38} size={21} weight={700} fill="#8E2F63">letter → insulin (the signalling molecule)</Txt></g>
      <g opacity={fi(a('l2'), 0.4) * (1 - off)}><Txt x={EX} y={EY + ENV.h + 68} size={21} weight={700} fill="#8A5F12">address → its shape</Txt></g>
      <g opacity={fi(a('l3'), 0.4) * (1 - off)}><Txt x={EX} y={EY + ENV.h + 98} size={21} weight={700} fill="#1F6B4A">matching door → the receptor with</Txt>
        <Txt x={EX} y={EY + ENV.h + 124} size={21} weight={700} fill="#1F6B4A">a complementary binding site</Txt></g>
      <g opacity={fi(a('surface'), 0.4) * (1 - off)}><Txt x={EX} y={EY + ENV.h + 164} size={20} weight={700} fill={C.primary} italic>binds at the surface; insulin is</Txt>
        <Txt x={EX} y={EY + ENV.h + 188} size={20} weight={700} fill={C.primary} italic>not taken in through a door</Txt></g>
      {a('written') >= 0 && <Sentence x={380} y={780} w={900} size={27} o={fi(a('written'), 0.4)} lines={[{text: 'The ligand binds to a specific receptor', o: fi(a('sent'), 0.4)}, {text: 'because their shapes are complementary.', o: fi(a('sent') - 1.6, 0.4)}]} />}
    </g>
  );
}
function CLtouch(s: any) { return s.at.touch - s.at.wrong; }
