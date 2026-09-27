import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, Card, clamp01, ATPTag, Magnifier} from '../kit';
import {RecapLayout} from './Beat13';
import {GlucoseTok, IonTok} from '../T4Tokens';
import {CarrierProtein, carrierCycle} from '../TransportProteinSet';
import {Written, GOOD} from '../Panels';

/** Small bilayer icon with a magenta steroid-hormone token passing through it (exam context, looped). */
function SteroidIcon({x, y, t}: any) {
  const k = (t * 0.4) % 1, ty = y - 44 + 88 * k;
  return (
    <g data-role="drawing">
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><circle cx={x - 50 + i * 20} cy={y - 16} r={7} fill="#E8A94A" /><circle cx={x - 50 + i * 20} cy={y + 16} r={7} fill="#E8A94A" /><path d={`M${x - 52 + i * 20} ${y - 9}V${y + 9}M${x - 48 + i * 20} ${y - 9}V${y + 9}`} stroke="#9A9A9A" strokeWidth={2} /></g>)}
      <path d={`M${x - 20} ${ty - 9}L${x - 8} ${ty - 14}L${x + 6} ${ty - 9}L${x + 6} ${ty + 5}L${x - 8} ${ty + 10}L${x - 20} ${ty + 5}Z`} fill="#C2378E" stroke="#7D1F5A" strokeWidth={1.5} />
    </g>
  );
}
/** Beat 14 · How it is asked: the forms surface (row 3 unnarrated from the first cue; rows 1 and 2 at their cues)
 * beside the reduced lesson layout; the reject card (our wording contrast); the hook returns; the carrier carries a
 * glucose into the cytoplasm in a separate callout (not counted). Final frame held 2 s. */
export default function Beat14(s: any) {
  const t = gt(s), a = s.a;
  const hi = {core: fi(a('gp'), 0.4) * (1 - fe(a('first') + 1.5, 0.5)), chanP: fi(a('na'), 0.4) * (1 - fe(a('reject'), 0.5)), eqTag: pulse(a('notno'), 1.8), carr: pulse(a('carrier'), 3.0)};
  const r1 = fi(a('row1'), 0.4), r2 = fi(a('row2'), 0.4), r3 = fi(a('open'), 0.4);
  const cyc = a('carrier') >= 0 ? carrierCycle(Math.min(a('carrier'), 2.69)) : null;
  const cx = 1250, cy = 850;
  return (
    <g>
      <g transform={`translate(${960 - 64 * 0.5} ${204 - 186 * 0.5}) scale(0.5)`}><RecapLayout s={s} t={t} hi={hi} /></g>
      <Txt x={70} y={216} size={24} weight={800} fill={C.ink} opacity={fi(a('open'), 0.4)}>How it is asked</Txt>
      {/* row 1 */}
      {r1 > 0 && <Card x={70} y={236} w={860} h={170} opacity={r1} stroke={C.teal} fill="#FFFFFF">
        <Txt x={90} y={270} size={23} weight={800}>why glucose needs a transport protein</Txt>
        <Txt x={90} y={298} size={17} weight={700} fill={C.muted}>S23/21 Q3(a), 1 mark, MS p.11</Txt>
        <Txt x={90} y={326} size={16} weight={600}>credited: polar / water-soluble / hydrophilic and the hydrophobic bilayer core;</Txt>
        <Txt x={90} y={348} size={16} weight={600}>size-only, active transport and facilitated diffusion ignored at that point (our paraphrase)</Txt>
        <Pill x={90} y={384} text="state polarity and the hydrophobic bilayer first" o={fi(a('first'), 0.4)} fill={C.primary} size={17} />
        <g data-role="drawing"><GlucoseTok x={890} y={276} r={16} /></g>
      </Card>}
      {/* row 2 */}
      {r2 > 0 && <Card x={70} y={420} w={860} h={130} opacity={r2} stroke={C.teal} fill="#FFFFFF">
        <Txt x={90} y={454} size={23} weight={800}>why sodium ions need a protein route</Txt>
        <Txt x={90} y={482} size={17} weight={700} fill={C.muted}>M24/22 Q1(b)(i), 1 mark, MS p.5</Txt>
        <Txt x={90} y={510} size={16} weight={600}>sodium ions' charge and the hydrophobic / non-polar bilayer (paraphrase);</Txt>
        <Txt x={90} y={532} size={16} weight={600}>a sodium-ion question, not a glucose question</Txt>
        {fi(a('na'), 0.4) > 0 && <g opacity={fi(a('na'), 0.4)}><g data-role="drawing"><IonTok x={880} y={462} r={14} /></g><Txt x={880} y={498} size={17} weight={800} fill="#6A3D9A" anchor="middle">Na⁺</Txt></g>}
      </Card>}
      {/* row 3 (unnarrated, from the first cue) */}
      {r3 > 0 && <Card x={70} y={564} w={860} h={250} opacity={r3} stroke={C.line} fill="#FFFFFF">
        <Txt x={90} y={598} size={23} weight={800}>a steroid hormone crossing the bilayer</Txt>
        <Txt x={90} y={626} size={17} weight={700} fill={C.muted}>S21/22 Q3(b), QP p.6 / MS p.12 — 2 marks, any two of three listed points</Txt>
        <Txt x={90} y={656} size={16} weight={600}>Example two-point answer: hormone S is non-polar (lipid-soluble), so it can</Txt>
        <Txt x={90} y={678} size={16} weight={600}>cross the phospholipid bilayer's hydrophobic core.</Txt>
        <Txt x={90} y={706} size={16} weight={600}>“Non-polar” and “lipid-soluble” are alternatives for one property point.</Txt>
        <Txt x={90} y={728} size={16} weight={600}>Small size is a further accepted point in this particular question.</Txt>
        <Txt x={90} y={754} size={15} weight={700} fill={C.muted} italic>Our paraphrase.</Txt>
        <SteroidIcon x={830} y={690} t={t} />
        <Txt x={830} y={790} size={14} weight={700} fill="#7D1F5A" anchor="middle">steroid hormone S (exam context)</Txt>
      </Card>}
      {/* the reject card */}
      {a('reject') >= 0 && <Card x={960} y={600} w={890} h={150} opacity={fi(a('reject'), 0.4)} stroke={C.primary} fill="#FFFFFF">
        <Written x={980} y={642} text="At equal water potentials, water stops moving." size={23} />
        <path data-role="decor" d={`M${1004} ${634}H${1004 + (560) * fe(a('reject') - 0.6, 0.6)}`} stroke={C.primary} strokeWidth={4} />
        <Txt x={980} y={682} size={23} weight={800} fill={GOOD} opacity={fi(a('reject') - 1.0, 0.4)}>✓</Txt>
        <Txt x={1004} y={682} size={22} weight={600} fill={GOOD} italic opacity={fi(a('reject') - 1.0, 0.4)}>At equal water potentials there is no net movement of water;</Txt>
        <Txt x={1004} y={710} size={22} weight={600} fill={GOOD} italic opacity={fi(a('reject') - 1.0, 0.4)}>water molecules still cross both ways.</Txt>
        <Txt x={980} y={738} size={14} weight={600} fill={C.muted} italic>our wording contrast; not a mark-scheme reject line</Txt>
      </Card>}
      {/* the hook returns; the carrier replay */}
      {a('sugar') >= 0 && <g opacity={fi(a('sugar'), 0.4)}>
        <Pill x={1450} y={800} text="How does sugar get into a cell?" size={17} />
        <g data-role="drawing"><GlucoseTok x={1430} y={794} r={13} /></g>
      </g>}
      {cyc && <Magnifier x={cx} y={cy} r={80} lx={cx} ly={cy} o={fi(a('carrier'), 0.4)}>
        <CarrierProtein x={cx} y={cy} u={20} phase={cyc.phase} />
        {cyc.tok && <GlucoseTok x={cx} y={cy + cyc.ty * 20} r={10} />}
      </Magnifier>}
      {a('carrier') >= 0 && <g opacity={fi(a('carrier'), 0.4)}>
        <Txt x={cx - 96} y={cy + 4} size={14} weight={700} fill={C.muted} anchor="end">mechanism replay;</Txt>
        <Txt x={cx - 96} y={cy + 22} size={14} weight={700} fill={C.muted} anchor="end">not counted</Txt>
        <Pill x={1450} y={860} text="down its gradient" size={16} fill={C.teal} />
        <ATPTag x={1482} y={906} w={52} h={24} struck /><Pill x={1518} y={911} text="no ATP used" size={15} />
      </g>}
      <Cite x={70} y={936} text="exam references: our paraphrases of the cited mark schemes" />
    </g>
  );
}
