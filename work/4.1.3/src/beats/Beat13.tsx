import React from 'react';
import {fi, fe, pulse, path} from '../util';
import {gt, Lbl, Pill, Stage, RoleGrid, gridFill, C, Txt, Lines, Card, Cite, SCHEM, textW, clamp01} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {PROT, channelPass} from '../TransportProteinSet';
import {LigandA} from '../ReceptorLigand';
import {IonTok} from '../T4Tokens';
import {Written, Strike} from '../Panels';

/** Beat 13 · How it is asked (the two narrated forms, cited; paraphrases labelled), our wording-contrast reject card
 * (not the scheme's wording), and the callback: the sodium ion is turned back by the core and passes through a
 * channel protein. Final frame held 2 s. */
export default function Beat13(s: any) {
  const t = gt(s), a = s.a, u = 20, cx = 1620, cy = 350;
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), ch = compPos(M, 'channel'), rc = compPos(M, 'receptor');
  const H = PROT.H * u;
  const coreGlow = pulse(a('credit'), 2.0);
  // callback: Na⁺ turned back at the core, then through the channel
  const nx = ch.x + 2.4 * u;
  let na: number[] | null = null;
  if (a('back') >= 0 && a('through') < 0) { const k = a('back'); na = k < 0.6 ? [nx, Lf.top - 2 * u + (Lf.outerHead + 0.6 * u - (Lf.top - 2 * u)) * (k / 0.6)] : k < 0.9 ? [nx, Lf.outerHead + 0.6 * u] : [nx, Lf.outerHead + 0.6 * u + (Lf.top - 2 * u - Lf.outerHead - 0.6 * u) * clamp01((k - 0.9) / 0.6)]; }
  if (a('through') >= 0) { const p = path(a('through'), [[0, nx, Lf.top - 2 * u], [0.6, ch.x, cy - H - 12]]); na = a('through') < 0.6 ? p : [ch.x, cy - H - 12 + (cy + H + 3 * u - (cy - H - 12)) * clamp01((a('through') - 0.6) / 1.2)]; }
  const hi: Record<string, number> = {};
  const cholOn = fe(a('row2'), 0.5) * (1 - fe(a('reject'), 0.5));
  ['cholesterol|fluidity', 'cholesterol|stability', 'cholesterol|permeability'].forEach((k) => { hi[k] = cholOn; });
  const rj = fe(a('reject'), 0.6);
  const wrong = 'Glucose needs a transport protein because it moves by facilitated diffusion.';
  return (
    <g>
      {/* forms surface */}
      <Card x={70} y={206} w={1270} h={500} fill="#FBF8F1" />
      <Txt x={100} y={254} size={30} weight={800} fill={C.primary} opacity={fi(a('open'), 0.4)}>How it is asked</Txt>
      {fi(a('row1'), 0.4) > 0 && <g opacity={fi(a('row1'), 0.4)}>
        <IonTok x={116} y={300} r={13} />
        <Txt x={144} y={308} size={27} weight={700}>explain why this substance needs a transport protein</Txt>
      </g>}
      <Txt x={144} y={342} size={19} weight={600} fill={C.muted} opacity={fi(a('s23'), 0.4)}>S23/21 Q3(a), 1 mark, MS p.11</Txt>
      <Txt x={450} y={342} size={19} weight={600} fill={C.muted} opacity={fi(a('m24'), 0.4)}>·  M24/22 Q1(b)(i), 1 mark, MS p.5 (sodium ions)</Txt>
      <Lines x={144} y={374} size={17} weight={600} fill={C.muted} italic opacity={fi(a('credit'), 0.4)} text={'Our paraphrase, checked against the PDFs: S23/21 Q3(a), MS p.11, links polar/water-soluble/hydrophilic substances to the\nphospholipid bilayer or hydrophobic core. M24/22 Q1(b)(i), MS p.5, links sodium\'s charge to the hydrophobic/non-polar core.\nThese are separate one-mark contexts.'} />
      <Txt x={144} y={452} size={17} weight={700} fill={C.primary} italic opacity={fi(a('ignored'), 0.4)}>S23/21 Q3(a): size-only, active transport and facilitated diffusion ignored at that point (our paraphrase of the plan-check description)</Txt>
      {fi(a('row2'), 0.4) > 0 && <g opacity={fi(a('row2'), 0.4)}>
        <path data-role="decor" d="M100 486H1310" stroke={C.line} strokeWidth={2} />
        <Txt x={144} y={530} size={27} weight={700}>state one role of cholesterol</Txt>
        <Txt x={144} y={562} size={19} weight={600} fill={C.muted}>M24/22 Q1(a)(iii), 1 mark, MS p.5</Txt>
        <Lines x={144} y={596} size={17} weight={600} fill={C.muted} italic text={'M24/22 Q1(a)(iii), MS p.5: one mark for any one accepted role — regulation of fluidity, maintenance of mechanical stability,\nor limiting entry of hydrophilic/polar substances or ions (our paraphrase).'} />
      </g>}
      {/* reject card: our wording contrast */}
      {rj > 0 && <Card x={70} y={726} w={1270} h={200} opacity={rj} fill="#FFFFFF">
        <Written x={96} y={774} text={wrong} size={26} />
        <Strike x1={96 + 28} x2={96 + 28 + textW(wrong, 26, 600)} y={766} p={fe(a('reject') - 0.8, 0.6)} />
        <Written x={96} y={818} ok text="Glucose is polar, so it does not cross the hydrophobic core of the phospholipid bilayer" size={26} />
        <Txt x={96 + 28} y={852} size={26} weight={600} fill="#1D6B40" italic>readily; it needs a transport protein.</Txt>
        <Cite x={1320} y={910} text="our wording contrast, based on the plan-check description of S23/21 Q3(a), MS p.11; not the scheme's wording" anchor="end" size={15} />
      </Card>}
      {/* the familiar layout, reduced, at right */}
      {coreGlow > 0 && <rect data-role="decor" x={Lf.x0 - 6} y={cy - 1.5 * u} width={Lf.width + 12} height={3 * u} rx={6} fill="#FFF3C4" opacity={coreGlow} />}
      <Stage s={s} cx={cx} cy={cy} u={u} xw={[Lf.x0 - 20, Lf.x1 + 20]} waterTop={214} waterBottom={500} n={[12, 10]} mem={M} />
      <LigandA x={rc.x} y={rc.y - H} u={u} />
      {na && <IonTok x={na[0]} y={na[1]} r={7} />}
      <Txt x={Lf.x0} y={cy + 4.4 * u} size={15} weight={700} fill={C.teal}>cytoplasm</Txt>
      <Txt x={cx} y={228} size={17} weight={700} anchor="middle" opacity={fi(a('na'), 0.4)}>oxygen slips through; a sodium ion is turned back — why?</Txt>
      <g transform="translate(827 427) scale(0.55)"><RoleGrid t={t} fill={gridFill(s)} hi={hi} /></g>
      <Cite x={1850} y={512} text={SCHEM} anchor="end" />
    </g>
  );
}
