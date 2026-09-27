import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, SS, C, Txt, Card, Cite, SCHEM, Stage, sceneAges, clamp01, textW} from '../kit';
import {fmmLayout, FULL} from '../FluidMosaicMembrane';
import {LigandA} from '../ReceptorLigand';
import {CL, closeM, seatedA} from './Beat05';
import {Written, Strike, SideNote, QuoteTab, QHeader, span, PEN, GOOD} from '../Panels';
import {InkRing, Underline, Arrow} from '../../shared/src/Type';
import {T4} from '../t4-palette';

/** Beat 7 · E44, COMMON MISTAKE (five moves): announce → the written wrong answer → 4 s silent read (the clock
 * pauses) → cue-synced talk-through (ring, enzyme recall, the MS reject tab, binding site, shared receptor) →
 * corrected IN PLACE; the marker clears at the END of "complementary to" + 44 frames (the measured end of
 * "LL-37"). The wrong claim is WRITTEN only. */
export default function Beat07(s: any) {
  const a = s.a, hold = s.sc.holds?.[0], h0 = hold ? hold.atSample / 48000 : 1e9, hd = hold ? hold.seconds : 0;
  const t = gt(s) - clamp01((s.local - h0) / Math.max(hd, 1e-6)) * hd;
  const clearT = 44 / 30;
  const done = fe(a('exit') - (clearT - 0.25), 0.25), lift = fe(a('exit') - clearT - 0.1, 0.8);
  const recHi = fi(a('receptor'), 0.4) * (1 - fe(a('ms'), 0.6));
  const dim = 0.6 * (1 - lift) * (1 - 0.8 * recHi);
  const M = closeM(t), Lf = fmmLayout(M), A = seatedA(M, 99);
  // left: the close-up (scaled) and the scene thumbnail
  const sc = 0.6, tx = 70 - Lf.x0 * sc, ty = 330 - 250 * sc;
  const X = 1060, W = 790, sz = 25, yA = 460, step = 38;
  const L1 = 'All of these cell types have an active site', L2 = 'that is complementary to LL-37, so LL-37', L3 = 'binds to it.';
  const [r0, r1] = span(X + 20, L1, 29, 43, sz);
  const strike = fe(a('fix'), 0.6);
  const c1 = fi(a('fix') - 0.8, 0.4) * (1 - done), c2 = fi(a('c2'), 0.4) * (1 - done);
  const final = ['All of these cell types have the same receptor', 'in their cell surface membranes, with a binding', 'site that is complementary to LL-37, so LL-37', 'binds to it.'];
  const hx = X + 38, hy = 244 + 44 + 23;
  const [m0, m1] = [hx + textW('Suggest why ', 23, 700), hx + textW('Suggest why many different types of cell', 23, 700)];
  return (
    <g>
      <g transform={`translate(${tx} ${ty}) scale(${sc})`}>
        <Stage s={s} cx={CL.cx} cy={CL.cy} u={CL.u} xw={[Lf.x0, Lf.x1]} mem={{t, show: FULL, dimLipids: dim, highlight: recHi > 0 ? 'receptor-glycoprotein' : null, hl: recHi}} n={[20, 14]} />
        <LigandA x={A.x} y={A.y} u={M.u} opacity={1 - 0.5 * dim} />
        <Lbl x={A.x - 1.6 * M.u} y={A.site.y + 1.4 * M.u} text="binding site" anchor="end" size={32 + 6 * pulse(a('receptor'), 1.6)} fill={recHi > 0 ? C.primary : C.ink} lx={A.x - 0.5 * M.u} ly={A.site.y + 0.35 * M.u} />
        <Lbl x={A.x - 1.6 * M.u} y={A.site.y - 2.4 * M.u} text="receptor" anchor="end" size={32} lx={A.x - 0.9 * M.u} ly={A.site.y + 0.6 * M.u} />
      </g>
      <g transform={`translate(${70 - 92 * 0.36} ${660 - 252 * 0.36}) scale(0.36)`} opacity={1 - 0.6 * (1 - lift)}><Scene t={t} {...sceneAges(t)} bindMuscle={99} bind={99} fail={99} stage={{secretion: 1, transport: 1, binding: 1, response: 1}} labels={{beta: 1, capillary: 1, muscle: 1, liver: 1, other: 1, gtp: 1}} respond={1} /></g>
      {dim > 0 && <rect data-role="decor" x={60} y={196} width={980} height={740} fill="#9A9A9A" opacity={0.12 * (1 - lift)} />}
      <Cite x={1040} y={944} text={SCHEM} anchor="end" />
      {/* the COMMON MISTAKE panel */}
      <Card x={X} y={196} w={W} h={740} fill="#FFFFFF" stroke={done >= 1 ? C.line : C.primary} active={done < 1}>
        <Txt x={X + 20} y={226} size={16} weight={600} fill={C.muted} italic>basis: mark-scheme reject line, W22/23 Q5(a)(i), MS p.17</Txt>
      </Card>
      <QHeader x={X + 16} y={244} w={W - 32} size={23} opacity={fi(a('header'), 0.5)} text={'Suggest why many different types of cell can\nrespond to LL-37.'} src={'our framing of W22/23 Q5(a)(i) (the LL-37 context), our paraphrase.\nConstructed answer, not a transcript.'} />
      <Underline x1={m0} x2={m1} y={hy + 8} p={fe(a('many'), 0.5)} color={C.teal} />
      {a('ll37') >= 0 && <g opacity={fi(a('ll37'), 0.4)}><circle data-role="drawing" cx={X + W - 60} cy={300} r={16} fill={T4.ligand} stroke={T4.ligandEdge} strokeWidth={2} /><Txt x={X + W - 30} y={344} size={14} weight={700} fill="#7D1F5A" anchor="end">LL-37 (a signalling molecule)</Txt></g>}
      {fi(a('card'), 0.4) > 0 && done < 1 && <g opacity={fi(a('card'), 0.4) * (1 - done)}>
        <Written x={X + 20} y={yA} text={L1} size={sz} />
        <Txt x={X + 20 + sz * 1.05} y={yA + step} size={sz} weight={600} fill={PEN} italic>{L2}</Txt>
        <Txt x={X + 20 + sz * 1.05} y={yA + 2 * step} size={sz} weight={600} fill={PEN} italic>{L3}</Txt>
        <InkRing cx={(r0 + r1) / 2} cy={yA - 8} rx={(r1 - r0) / 2 + 12} ry={22} p={fe(a('ring'), 0.5)} />
        <Strike x1={r0} x2={r1} y={yA - 9} p={strike} />
        {c1 > 0 && <g opacity={c1}>
          <Txt x={r0 - 30} y={yA + 3 * step} size={sz} weight={600} fill={GOOD} italic>↳ the same receptor in their cell surface</Txt>
          <Txt x={r0 - 2} y={yA + 4 * step} size={sz} weight={600} fill={GOOD} italic>membranes, with a binding site</Txt>
        </g>}
              </g>}
      {done > 0 && <g opacity={done}>
        <Written x={X + 20} y={yA} text={final[0]} size={sz} ok />
        {final.slice(1).map((l, i) => <Txt key={i} x={X + 20 + sz * 1.05} y={yA + (i + 1) * step} size={sz} weight={600} fill={GOOD} italic>{l}</Txt>)}
      </g>}
      {/* enzyme recall thumbnail */}
      {a('enzyme') >= 0 && <g opacity={fi(a('enzyme'), 0.4) * (1 - fe(a('term') + 2.0, 0.6))}>
        <rect data-role="decor" x={X + 20} y={630} width={230} height={140} rx={10} fill="#FBF8F1" stroke={C.line} strokeWidth={1.5} />
        <g data-role="drawing">
          <path d={`M${X + 50} 730Q${X + 50} 690 ${X + 90} 690L${X + 110} 690L${X + 125} 712L${X + 140} 690L${X + 160} 690Q${X + 200} 690 ${X + 200} 730Z`} fill="#9FC7E0" stroke="#2F6B8F" strokeWidth={2} />
          <path d={`M${X + 210} 668l14 -14l14 14l-14 14Z M${X + 218} 700l12 -12l12 12l-12 12Z`} fill="none" stroke="#A4561A" strokeWidth={2} strokeDasharray="4 3" />
        </g>
        <Txt x={X + 34} y={654} size={15} weight={800} fill="#2F6B8F">enzyme · active site</Txt>
        <Txt x={X + 34} y={760} size={13} weight={700} fill={C.muted}>recall: 3.1.1-2</Txt>
        {fi(a('noprod'), 0.4) > 0 && <g opacity={fi(a('noprod'), 0.4)}><path data-role="decor" d={`M${X + 204} 648L${X + 246} 720`} stroke={C.primary} strokeWidth={3} /><Txt x={X + 176} y={760} size={13} weight={800} fill={C.primary}>no products</Txt></g>}
        <Arrow x1={X + 140} y1={630} x2={(r0 + r1) / 2} y2={yA + 16} color={C.primary} width={2.5} bend={-40} />
        <SideNote x={X + 150} y={604} text="the enzyme word" size={17} />
      </g>}
      <SideNote x={X + 280} y={660} text="receptor → binding site" size={20} opacity={fi(a('term'), 0.4) * (1 - fe(a('fix'), 0.4))} />
      <SideNote x={X + 280} y={694} text="specific ≠ one cell type" size={20} opacity={fi(a('specific'), 0.4) * (1 - fe(a('fix'), 0.4))} />
      {a('share') >= 0 && <g opacity={fi(a('share'), 0.5)}>
        <g data-role="drawing">
          {[0, 1].map((i) => { const cx = X + 560 + i * 110, cy = 690; return <g key={i}>{i === 0 ? <ellipse cx={cx} cy={cy} rx={44} ry={30} fill="#F4F0E4" stroke="#6B5B7B" strokeWidth={2.5} /> : <rect x={cx - 42} y={cy - 30} width={84} height={60} rx={14} fill="#F4F0E4" stroke="#6B5B7B" strokeWidth={2.5} />}<path d={`M${cx - 9} ${cy - 30}L${cx - 9} ${cy - 44}L${cx - 4} ${cy - 44}L${cx} ${cy - 38}L${cx + 4} ${cy - 44}L${cx + 9} ${cy - 44}L${cx + 9} ${cy - 30}Z`} fill={T4.protein} stroke={T4.proteinEdge} strokeWidth={1.5} /></g>; })}
        </g>
        <Txt x={X + 490} y={744} size={13} weight={700} fill={C.muted}>shared receptor, schematic explanation of the</Txt>
        <Txt x={X + 490} y={761} size={13} weight={700} fill={C.muted}>credited point; LL-37 receptor identity not specified</Txt>
      </g>}
      <QuoteTab x={X + 20} y={782} w={W - 40} quote={'W22/23 Q5(a)(i), MS p.17:  R active site'} source="PDF-CHECKED (plan check)" size={20} opacity={fi(a('ms'), 0.4)} />
      <Underline x1={X + 38 + textW('W22/23 Q5(a)(i), MS p.17:  ', 20, 600)} x2={X + 38 + textW('W22/23 Q5(a)(i), MS p.17:  R', 20, 600)} y={818} p={fe(a('ms') - 0.4, 0.4)} />
      <Txt x={X + 38} y={884} size={15} weight={700} fill={C.primary} opacity={fi(a('nothing'), 0.4)}>R = rejected for that marking point in that question</Txt>
      <Txt x={X + 38} y={912} size={14} weight={700} fill={GOOD} opacity={fi(a('c2'), 0.4)}>credited ideas: receptor identity, location, complementary shape; any two (W22/23 MS p.17, our paraphrase)</Txt>
    </g>
  );
}
