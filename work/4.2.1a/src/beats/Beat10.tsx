import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Lines, Card, Cite, SCHEM, PARTS, clamp01, textW, MemScene, memM, memGeo, MX, fmmLayout, compPos, lanes, BSTART, Magnifier} from '../kit';
import {mixedFields} from './Beat07';
import {ionField} from './Beat08';
import {b9} from './Beat09';
import {fieldState, FieldTokens, SideTag} from '../DiffusionField';
import {GlucoseTok, O2Tok} from '../T4Tokens';
import {CarrierProtein, carrierCycle} from '../TransportProteinSet';
import {Written, Strike, SideNote, QuoteTab, QHeader, span, quoteSpan, PEN, GOOD} from '../Panels';
import {Underline} from '../../shared/src/Type';
import {HY} from '../FluidMosaicMembrane';

/** Beat 10 · E45, COMMON MISTAKE (five moves): announce → the written wrong answer → 4 s silent read (the frame is
 * held: the clock pauses) → cue-synced talk-through (underline, size side-note, the examiner-report tab, the MS
 * paraphrase tab, property → barrier → protein) → corrected IN PLACE; the marker clears on the completed correct
 * frame (END of "such as a carrier"). The wrong claim is WRITTEN only. */
export default function Beat10(s: any) {
  const a = s.a, hold = s.sc.holds?.[0], h0 = hold ? hold.atSample / 48000 : 1e9, hd = hold ? hold.seconds : 0;
  const t = gt(s) - clamp01((s.local - h0) / Math.max(hd, 1e-6)) * hd;
  const M0 = memM(t), G = memGeo(M0), Lf = fmmLayout(M0), ca = compPos(M0, 'carrier');
  const done = fe(a('exit'), 0.15), lift = fe(a('exit') - 0.2, 0.8);
  const dim = 0.55 * (1 - lift);
  const F = mixedFields(t, G, BSTART(7)), ions = ionField(t, {...G, gates: [compPos(M0, 'channel').x]});
  const B = b9(M0), glu = fieldState({G, nA: 15, nB: 5, evs: B.plan.evs, t, origin: B.c, seed: 92, speed: 0.7});
  const gx = lanes(M0)[2][0], gy = Lf.outerHead + 0.55 * M0.u;
  const coreHi = fi(a('coreh'), 0.4) * (1 - fe(a('nothing'), 0.5));
  // the card
  const X = 1060, W = 790, sz = 27, yA = 470, step = 40;
  const L1 = 'Glucose molecules are too large to pass', L2 = 'through the phospholipid bilayer.';
  const [u0, u1] = span(X + 20, L1, 22, 31, sz);
  const [k0] = span(X + 20, L1, 8, 9, sz), kEnd = span(X + 20, L1, 8, L1.length, sz)[1];
  const strike = fe(a('fix'), 0.6);
  const c1 = fi(a('fix') - 0.8, 0.4) * (1 - done), c2 = fi(a('last'), 0.4) * (1 - done);
  const final = ['Glucose is polar (hydrophilic), so it does not', 'cross the hydrophobic core of the phospholipid', 'bilayer readily; it needs a transport protein,', 'such as a carrier protein.'];
  const Q = 'R23 p.12, June 2023 P21 Q3(a):\n“Most incorrect answers stated that glucose was too large.”';
  const qy = 668, qs = quoteSpan(X + 20, qy, Q, 1, 6, 23, 19);
  const replay = a('exit') - 0.6;
  const cyc = replay >= 0 ? carrierCycle(replay % 3.2) : null;
  const mxy = [860, 330];
  return (
    <g>
      <MemScene s={s} t={t} mem={{t, carrierPhase: 0, dimLipids: dim}} />
      <FieldTokens st={F.o2} k="o2" t={t} opacity={0.3} />
      <FieldTokens st={ions} k="ion" t={t} opacity={0.3} />
      <FieldTokens st={glu} k="glucose" t={t} s={0.85} />
      {dim > 0 && <rect data-role="decor" x={MX.x0} y={MX.y0} width={MX.x1 - MX.x0} height={MX.y1 - MX.y0} rx={16} fill="#9A9A9A" opacity={0.3 * (1 - lift)} />}
      {coreHi > 0 && <rect data-role="decor" x={Lf.x0} y={M0.cy - (HY - 0.35) * M0.u} width={Lf.width} height={2 * (HY - 0.35) * M0.u} fill="#F2C45A" opacity={0.35 * coreHi} />}
      <g data-role="drawing"><GlucoseTok x={gx} y={gy} r={15} rot={10} /></g>
      {coreHi > 0 && <circle data-role="decor" cx={gx} cy={gy} r={22} fill="none" stroke="#E0892B" strokeWidth={4} opacity={coreHi} />}
      <Pill x={gx + 30} y={gy - 30} text="polar" o={coreHi} size={17} fill="#A4561A" />
      <Pill x={Lf.x0 + 10} y={M0.cy + 8} text="hydrophobic core" o={coreHi} size={17} />
      <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={glu.a} /><SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={glu.b} />
      {cyc && <Magnifier x={mxy[0]} y={mxy[1]} r={96} lx={ca.x} ly={M0.cy - 2.6 * M0.u} o={fi(replay, 0.5)}>
        <CarrierProtein x={mxy[0]} y={mxy[1]} u={26} phase={cyc.phase} />
        {cyc.tok && <GlucoseTok x={mxy[0]} y={mxy[1] + cyc.ty * 26} r={11} />}
      </Magnifier>}
      <Pill x={mxy[0]} y={mxy[1] + 128} text="mechanism replay; not counted" anchor="middle" o={fi(replay, 0.5)} size={15} />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
      {/* the COMMON MISTAKE panel */}
      <Card x={X} y={196} w={W} h={740} fill="#FFFFFF" stroke={done >= 1 ? C.line : C.primary} active={done < 1}>
        <Txt x={X + 20} y={226} size={16} weight={600} fill={C.muted} italic>basis: examiner-report diagnosis, June 2023 report p.12, Paper 21 Q3(a)</Txt>
      </Card>
      <QHeader x={X + 16} y={244} w={W - 32} size={24} opacity={fi(a('header'), 0.5)} text={'Explain why glucose needs a transport protein to\ncross a cell surface membrane.'} src={'our framing of S23/21 Q3(a), QP p.8; constructed answer, not a transcript'} />
      {fi(a('card'), 0.4) > 0 && done < 1 && <g opacity={fi(a('card'), 0.4) * (1 - done)}>
        <Written x={X + 20} y={yA} text={L1} size={sz} />
        <Txt x={X + 20 + sz * 1.05} y={yA + step} size={sz} weight={600} fill={PEN} italic>{L2}</Txt>
        <Underline x1={u0} x2={u1} y={yA + 8} p={fe(a('ring'), 0.5)} />
        {pulse(a('nothing'), 1.4) > 0 && <path data-role="decor" d={`M${u0} ${yA + 12}H${u1}`} stroke={C.primary} strokeWidth={8} opacity={0.5 * pulse(a('nothing'), 1.4)} />}
        <Strike x1={k0} x2={kEnd} y={yA - 9} p={strike} />
        <Strike x1={X + 20 + sz * 1.05} x2={X + 20 + sz * 1.05 + textW(L2, sz, 600)} y={yA + step - 9} p={fe(a('fix') - 0.4, 0.6)} />
        {c1 > 0 && <g opacity={c1}>
          <Txt x={k0} y={yA + 2 * step} size={sz} weight={600} fill={GOOD} italic>↳ is polar (hydrophilic), so it does not cross</Txt>
          <Txt x={X + 20 + sz * 1.05} y={yA + 3 * step} size={sz} weight={600} fill={GOOD} italic>the hydrophobic core of the phospholipid bilayer</Txt>
          <Txt x={X + 20 + sz * 1.05} y={yA + 4 * step} size={sz} weight={600} fill={GOOD} italic>readily;</Txt>
        </g>}
        {c2 > 0 && <Txt x={X + 20 + sz * 1.05 + textW('readily; ', sz, 600)} y={yA + 4 * step} size={sz} weight={600} fill={GOOD} italic opacity={c2}>it needs a transport protein,</Txt>}
        {c2 > 0 && <Txt x={X + 20 + sz * 1.05} y={yA + 5 * step} size={sz} weight={600} fill={GOOD} italic opacity={fi(a('last') - 0.8, 0.4)}>such as a carrier protein.</Txt>}
      </g>}
      {done > 0 && <g opacity={done}>
        <Written x={X + 20} y={yA} text={final[0]} size={sz} ok />
        {final.slice(1).map((l, i) => <Txt key={i} x={X + 20 + sz * 1.05} y={yA + (i + 1) * step} size={sz} weight={600} fill={GOOD} italic>{l}</Txt>)}
      </g>}
      {/* size side-note */}
      {fi(a('size'), 0.4) > 0 && <g opacity={fi(a('size'), 0.4) * (1 - fe(a('fix'), 0.4))}>
        <g data-role="drawing"><O2Tok x={1440} y={yA + step + 52} r={10} /><GlucoseTok x={1490} y={yA + step + 52} r={16} /></g>
        <Txt x={1520} y={yA + step + 48} size={15} weight={700} fill={C.primary}>sizes differ; size alone is not</Txt>
        <Txt x={1520} y={yA + step + 66} size={15} weight={700} fill={C.primary}>the credited reason here</Txt>
        
      </g>}
      <SideNote x={X + 36} y={yA + step + 70} text="property → barrier → protein" size={21} opacity={fi(a('first'), 0.4) * (1 - fe(a('fix'), 0.4))} />
      {/* the examiner-report tab (exact) and the MS paraphrase tab */}
      <QuoteTab x={X + 20} y={qy} w={W - 40} quote={Q} source="PDF-CHECKED (plan check)" size={19} opacity={fi(a('report'), 0.4)} />
      <Underline x1={qs.x0} x2={qs.x1} y={qs.y} p={fe(a('most'), 0.5)} />
      <Txt x={X + W - 24} y={qy + 124} size={15} weight={700} fill={C.primary} anchor="end" opacity={fi(a('most'), 0.4)}>of the incorrect answers; not of all candidates</Txt>
      {fi(a('prop'), 0.4) > 0 && <g opacity={fi(a('prop'), 0.4)}>
        <rect data-role="decor" x={X + 20} y={qy + 136} width={W - 40} height={74} rx={12} fill="#F2FAFA" stroke={C.teal} strokeWidth={2} />
        <Txt x={X + 36} y={qy + 162} size={16} weight={700} fill={C.ink}>S23/21 Q3(a), 1 mark, MS p.11: credited polar / water-soluble /</Txt>
        <Txt x={X + 36} y={qy + 184} size={16} weight={700} fill={C.ink}>hydrophilic and the hydrophobic bilayer core (our paraphrase)</Txt>
        <Txt x={X + 36} y={qy + 204} size={15} weight={700} fill={C.primary} opacity={fi(a('nothing'), 0.4)}>ignored at that point: size-only; active transport; facilitated diffusion (paraphrase)</Txt>
      </g>}
    </g>
  );
}
