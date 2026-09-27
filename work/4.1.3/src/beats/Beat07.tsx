import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Wash, Stage3, L3, C, Txt, Lines, Card, Cite, SCHEM, clamp01, textW} from '../kit';
import {fmmLayout, compPos, FULL} from '../FluidMosaicMembrane';
import {PROT, channelPass} from '../TransportProteinSet';
import {IonTok} from '../T4Tokens';
import {Written, Strike, SideNote, QuoteTab, span, PEN, GOOD} from '../Panels';
import {InkRing, Underline, Arrow} from '../../shared/src/Type';

/** Beat 7 · E43, EXAM CONTRAST (five moves): announce → the written wrong answer → 4 s silent read (digital silence;
 * the frame is held: the clock pauses) → talk-through with cue-synced underline/rings/arrows → corrected IN PLACE;
 * the marker clears on the completed correct frame (END of "through channel or carrier proteins"). The wrong claim is
 * WRITTEN only; the narration names "the word membrane" and never asserts it. */
export default function Beat07(s: any) {
  const a = s.a, hold = s.sc.holds?.[0], h0 = hold ? hold.atSample / 48000 : 1e9, hd = hold ? hold.seconds : 0;
  const t = gt(s) - clamp01((s.local - h0) / Math.max(hd, 1e-6)) * hd;       // clock paused through the silent read
  const {cx, cy, u} = L3;
  const done = fe(a('exit'), 0.15), lift = fe(a('exit') - 0.2, 0.8);
  const pr = fi(a('proteins'), 0.5);
  const dim = 0.55 * (1 - lift);
  const M = {cx, cy, u, t, show: FULL, carrierPhase: 1};
  const Lf = fmmLayout(M), ch = compPos(M, 'channel'), ca = compPos(M, 'carrier');
  const mem = {t, dimLipids: dim, compDim: {glycolipid: dim, cholesterol: dim, 'receptor-glycoprotein': dim, glycoprotein: dim, extrinsic: dim, 'intrinsic-channel': dim * (1 - pr), 'intrinsic-carrier': dim * (1 - pr)}};
  const na = a('proteins') >= 0 ? channelPass(a('proteins') - 0.3, 1.4, -3.6, 3.8) : null;
  // the card
  const X = 870, W = 980, sz = 29;
  const L1 = 'The ions are charged, so they cannot pass', L2w = 'through the membrane.';
  const yA = 520, step = 42;
  const [mx0, mx1] = span(X + 20, L2w, 12, 20, sz);
  const strike = fe(a('fix'), 0.5);
  const c1 = fi(a('c1'), 0.4) * (1 - done), c2 = fi(a('c2'), 0.4) * (1 - done);
  const final = ['The ions are charged, so they cannot pass', 'through the hydrophobic core of the phospholipid', 'bilayer; they cross the membrane through', 'channel proteins or carrier proteins.'];
  const iX = X + 20 + 18 + textW('W22/23 Q6(a), MS p.19:  ', 20, 600);
  return (
    <g>
      <Wash x={Lf.x0 - 10} y={cy - 1.5 * u} w={Lf.width + 20} h={3 * u} o={0.9 * fi(a('bilayer'), 0.5) * (1 - fe(a('proteins'), 0.5))} fill="#FFF3C4" />
      <Stage3 s={s} mem={mem} n={[22, 18]} />
      {dim > 0 && <rect data-role="decor" x={70} y={200} width={786} height={740} fill="#9A9A9A" opacity={0.12 * (1 - lift)} />}
      <Lbl x={ch.x - 20} y={cy - PROT.H * u - 56} text="channel protein" size={20} lx={ch.x - 0.5 * u} ly={cy - PROT.H * u + 6} />
      <Lbl x={ca.x + 90} y={cy - PROT.H * u - 56} text="carrier protein" size={20} lx={ca.x + 0.6 * u} ly={cy - PROT.H * u + 6} />
      <Pill x={cx} y={Lf.bottom + 80} text="bilayer core: yes, a barrier" anchor="middle" o={fi(a('bilayer'), 0.5) * (1 - lift)} fill={C.primary} />
      {na && na.tok && <IonTok x={ch.x} y={cy + na.ty * u} r={9} />}
      <Cite x={90} y={936} text={SCHEM} />
      {/* EXAM CONTRAST panel */}
      <Card x={X} y={206} w={W} h={724} fill="#FFFFFF" stroke={done >= 1 ? C.line : C.primary} active={done < 1}>
        <Lines x={X + 20} y={236} text={'basis: mark-scheme ignore line, W22/23 Q6(a), MS p.19; an ignore line,\nnot evidence of how often candidates write this'} size={16} weight={600} fill={C.muted} italic />
      </Card>
      {fi(a('header'), 0.5) > 0 && <g opacity={fi(a('header'), 0.5)}>
        <Txt x={X + 20} y={306} size={16} weight={800} fill={C.primary}>THE QUESTION</Txt>
        <Txt x={X + 20} y={340} size={27} weight={700}>How do the ions cross the cell surface membrane?</Txt>
        <Lines x={X + 20} y={368} size={15} weight={600} fill={C.muted} italic text={'Our framing of W22/23 Q6(a); constructed answer, not a transcript. Source context:\nhydrogencarbonate and chloride ions crossing a red blood cell membrane (QP p.15;\nMS p.19). The sodium-channel drawing is our generic illustration of a protein route.'} />
      </g>}
      {/* the written answer: wrong, then corrected in place */}
      {fi(a('card'), 0.4) > 0 && done < 1 && <g opacity={fi(a('card'), 0.4) * (1 - done)}>
        <Written x={X + 20} y={yA} text={L1} size={sz} />
        <Txt x={X + 20 + sz * 1.05} y={yA + step} size={sz} weight={600} fill={PEN} italic>{L2w}</Txt>
        <Underline x1={mx0 - sz * 1.05 + sz * 1.05} x2={mx1} y={yA + step + 8} p={fe(a('word'), 0.5)} />
        <Strike x1={mx0} x2={mx1} y={yA + step - 9} p={strike} />
        {c1 > 0 && <g opacity={c1}>
          <Txt x={mx0 - 4} y={yA + 2 * step} size={sz} weight={600} fill={GOOD} italic>↳ the hydrophobic core of the phospholipid</Txt>
          <Txt x={mx0 + 28} y={yA + 3 * step} size={sz} weight={600} fill={GOOD} italic>bilayer;</Txt>
        </g>}
        {c2 > 0 && <Txt x={mx0 + 28 + textW('bilayer; ', sz, 600)} y={yA + 3 * step} size={sz} weight={600} fill={GOOD} italic opacity={c2}>they cross the membrane</Txt>}
        {c2 > 0 && <Txt x={X + 20 + sz * 1.05} y={yA + 4 * step} size={sz} weight={600} fill={GOOD} italic opacity={c2}>through channel proteins or carrier proteins.</Txt>}
      </g>}
      {done > 0 && <g opacity={done}>
        <Written x={X + 20} y={yA} text={final[0]} size={sz} ok />
        {final.slice(1).map((l, i) => <Txt key={i} x={X + 20 + sz * 1.05} y={yA + (i + 1) * step} size={sz} weight={600} fill={GOOD} italic>{l}</Txt>)}
      </g>}
      <SideNote x={X + W - 20} y={yA + step} text="membrane ≠ bilayer alone" anchor="end" size={20} opacity={fi(a('picture'), 0.4) * (1 - fe(a('fix'), 0.4))} />
      {fi(a('route'), 0.4) > 0 && <g opacity={fi(a('route'), 0.4) * (1 - fe(a('fix'), 0.4))}>
        <Arrow x1={mx0 - 10} y1={yA + step + 14} x2={ch.x + 0.9 * u} y2={cy + 0.4 * u} color={C.primary} width={3} bend={-60} />
        <SideNote x={(mx0 + ch.x) / 2} y={Lf.bottom + 116} text="the protein route" size={20} anchor="middle" />
      </g>}
      {fi(a('ms'), 0.4) > 0 && <QuoteTab x={X + 20} y={yA + 4 * step + 34} w={W - 40} opacity={fi(a('ms'), 0.4)} size={20}
        quote={'W22/23 Q6(a), MS p.19:  I ‘ions cannot pass through the membrane’'} source="PDF-CHECKED (plan check)" />}
      <Txt x={X + 38} y={yA + 4 * step + 150} size={20} weight={600} fill={C.muted} italic opacity={fi(a('ms'), 0.4)}>credited at that part: ion transport through a membrane protein, any one point (our paraphrase)</Txt>
      <InkRing cx={iX + 6} cy={yA + 4 * step + 34 + 24} rx={16} ry={18} p={fe(a('nothing'), 0.5)} />
      <Txt x={X + 38} y={yA + 4 * step + 176} size={20} weight={700} fill={C.primary} opacity={fi(a('nothing'), 0.4)}>I = ignore: earns nothing at that point</Txt>
      {fi(a('local'), 0.4) > 0 && <g opacity={fi(a('local'), 0.4)}>
        <rect data-role="decor" x={X + 20} y={yA + 4 * step + 190} width={W - 40} height={40} rx={10} fill="#F2FAFA" stroke={C.teal} strokeWidth={2} />
        <Txt x={X + 36} y={yA + 4 * step + 217} size={20} weight={700} fill={C.teal}>local ruling: W22/23 Q6(a); not a global word ban, not evidence of how common it is</Txt>
      </g>}
    </g>
  );
}
