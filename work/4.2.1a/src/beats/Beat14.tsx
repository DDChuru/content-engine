import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, Card, clamp01, ATPTag, Magnifier, BSTART, MemScene, memM, memGeo, MX, fmmLayout, compPos} from '../kit';
import {mixedFields} from './Beat07';
import {ionField} from './Beat08';
import {b9} from './Beat09';
import {WPM, WPMFrame, WPMClip, sucrosePts, SucroseTokens} from '../WaterPotentialModel';
import {wpmWater, spawns} from './Beat11';
import {FieldTokens, fieldState} from '../DiffusionField';
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
/** 008f: the right-hand model panel, ONE model at a time, drawn as label-free scaled drawings with every label at
 * full size outside/beside them: the membrane (the bilayer core, the channel, the carrier) or the water model
 * (equal water potentials, crossings continuing). */
const PS = 0.5, PX = 1000 - MX.x0 * PS, PY = 206 - MX.y0 * PS;
const ps = (x: number, y: number) => [PX + x * PS, PY + y * PS];
function MemPanel({s, t, hi, o}: any) {
  if (o <= 0) return null;
  const M0 = memM(t), G = memGeo(M0), Lf = fmmLayout(M0), ch = compPos(M0, 'channel'), ca = compPos(M0, 'carrier');
  const F = mixedFields(t, G, BSTART(7)), ions = ionField(t, {...G, gates: [ch.x]});
  const B = b9(M0), glu = fieldState({G, nA: 15, nB: 5, evs: B.plan.evs, t, origin: B.c, seed: 92, speed: 0.7});
  const [chx, chy] = ps(ch.x, M0.cy - 2.4 * M0.u), [cax, cay] = ps(ca.x, M0.cy - 2.4 * M0.u), [cx0, cyc] = ps(Lf.x0 + Lf.width, M0.cy);
  const LX = PX + MX.x1 * PS + 24;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <g transform={`translate(${PX} ${PY}) scale(${PS})`}>
        <MemScene s={s} t={t} labels={0} core={0} mem={{highlight: hi.chanP > 0 ? 'intrinsic-channel' : hi.carr > 0 ? 'intrinsic-carrier' : null, hl: Math.max(hi.chanP ?? 0, hi.carr ?? 0)}} />
        {(hi.core ?? 0) > 0 && <rect data-role="decor" x={Lf.x0} y={M0.cy - 1.5 * M0.u} width={Lf.width} height={3 * M0.u} fill="#F2C45A" opacity={0.45 * hi.core} />}
        <FieldTokens st={F.o2} k="o2" t={t} />
        <FieldTokens st={ions} k="ion" t={t} />
        <FieldTokens st={glu} k="glucose" t={t} s={0.85} />
      </g>
      <Lbl x={LX} y={cyc + 8} text="hydrophobic core" size={22} fill="#8A6414" o={0.35 + 0.65 * (hi.core ?? 0)} lx={cx0 - 6} ly={cyc} />
      <Lbl x={LX} y={PY + 250 * PS + 40} text="channel protein" size={22} fill="#1E6B66" o={hi.chanP ?? 0} lx={chx} ly={chy} />
      <Lbl x={LX} y={PY + 250 * PS + 80} text="carrier protein" size={22} fill="#1E6B66" o={hi.carr ?? 0} lx={cax} ly={cay} />
    </g>
  );
}
function WaterPanel({t, o}: any) {
  if (o <= 0) return null;
  const S = 0.42, X = 1000 - WPM.x * S, Y = 230 - WPM.y * S;
  const water = wpmWater(t), sucr = sucrosePts({M: WPM, spawns: spawns(), t});
  return (
    <g opacity={o < 1 ? o : undefined}>
      <g transform={`translate(${X} ${Y}) scale(${S})`}>
        <WPMFrame t={t} openEnds />
        <WPMClip id="wpm-water-14"><FieldTokens st={water} k="water" t={t} /></WPMClip>
        <SucroseTokens pts={sucr} t={t} />
      </g>
      <Txt x={1000 + WPM.w * S + 24} y={300} size={22} weight={800} fill={C.teal}>equal water potentials:</Txt>
      <Txt x={1000 + WPM.w * S + 24} y={330} size={22} weight={700} fill={C.ink}>no net movement;</Txt>
      <Txt x={1000 + WPM.w * S + 24} y={360} size={22} weight={700} fill={C.ink}>water still crosses</Txt>
      <Txt x={1000 + WPM.w * S + 24} y={390} size={22} weight={700} fill={C.ink}>both ways</Txt>
    </g>
  );
}
/** Beat 14 · How it is asked: the forms surface (row 3 unnarrated from the first cue; rows 1 and 2 at their cues)
 * beside ONE model at a time (membrane; water at the reject card; membrane again for the sugar); the reject card
 * (our wording contrast); the hook returns; the carrier carries a glucose into the cytoplasm in a separate callout
 * (not counted). Final frame held 2 s. */
export default function Beat14(s: any) {
  const t = gt(s), a = s.a;
  const hi = {core: fi(a('gp'), 0.4) * (1 - fe(a('first') + 1.5, 0.5)), chanP: fi(a('na'), 0.4) * (1 - fe(a('reject'), 0.5)), carr: fi(a('carrier'), 0.4)};
  const r1 = fi(a('row1'), 0.4), r2 = fi(a('row2'), 0.4), r3 = fi(a('open'), 0.4);
  const cyc = a('carrier') >= 0 ? carrierCycle(Math.min(a('carrier'), 2.69)) : null;
  const watO = fe(a('reject') - 0.15, 0.3) * (1 - fe(a('sugar') + 0.2, 0.3)), memO = (1 - fe(a('reject') + 0.2, 0.3)) + fe(a('sugar') - 0.15, 0.3);
  const cx = 1180, cy = 850;
  return (
    <g>
      <MemPanel s={s} t={t} hi={hi} o={memO} />
      <WaterPanel t={t} o={watO} />
      <Txt x={70} y={222} size={24} weight={800} fill={C.ink} opacity={fi(a('open'), 0.4)}>How it is asked</Txt>
      {/* row 1 */}
      {r1 > 0 && <Card x={70} y={236} w={880} h={184} opacity={r1} stroke={C.teal} fill="#FFFFFF">
        <Txt x={90} y={268} size={23} weight={800}>why glucose needs a transport protein</Txt>
        <Txt x={90} y={296} size={20} weight={700} fill={C.muted}>S23/21 Q3(a), 1 mark, MS p.11</Txt>
        <Txt x={90} y={324} size={20} weight={600}>credited: polar / water-soluble / hydrophilic and the hydrophobic</Txt>
        <Txt x={90} y={350} size={20} weight={600}>bilayer core; size-only, active transport, facilitated diffusion ignored</Txt>
        <Txt x={90} y={376} size={20} weight={600}>at that point (our paraphrase)</Txt>
        <Pill x={410} y={384} text="state polarity and the hydrophobic bilayer first" o={fi(a('first'), 0.4)} fill={C.primary} size={20} />
        <g data-role="drawing"><GlucoseTok x={910} y={272} r={16} /></g>
      </Card>}
      {/* row 2 */}
      {r2 > 0 && <Card x={70} y={432} w={880} h={138} opacity={r2} stroke={C.teal} fill="#FFFFFF">
        <Txt x={90} y={464} size={23} weight={800}>why sodium ions need a protein route</Txt>
        <Txt x={90} y={492} size={20} weight={700} fill={C.muted}>M24/22 Q1(b)(i), 1 mark, MS p.5</Txt>
        <Txt x={90} y={520} size={20} weight={600}>sodium ions' charge and the hydrophobic / non-polar bilayer</Txt>
        <Txt x={90} y={546} size={20} weight={600}>(paraphrase); a sodium-ion question, not a glucose question</Txt>
        {fi(a('na'), 0.4) > 0 && <g opacity={fi(a('na'), 0.4)}><g data-role="drawing"><IonTok x={880} y={470} r={14} /></g><Txt x={910} y={506} size={20} weight={800} fill="#6A3D9A" anchor="end">Na⁺</Txt></g>}
      </Card>}
      {/* row 3 (unnarrated, from the first cue) */}
      {r3 > 0 && <Card x={70} y={582} w={880} h={346} opacity={r3} stroke={C.line} fill="#FFFFFF">
        <Txt x={90} y={614} size={23} weight={800}>a steroid hormone crossing the bilayer</Txt>
        <Txt x={90} y={642} size={20} weight={700} fill={C.muted}>S21/22 Q3(b), QP p.6 / MS p.12 — 2 marks, any two of three points</Txt>
        <Txt x={90} y={672} size={20} weight={600}>Example two-point answer: hormone S is non-polar</Txt>
        <Txt x={90} y={698} size={20} weight={600}>(lipid-soluble), so it can cross the phospholipid</Txt>
        <Txt x={90} y={724} size={20} weight={600}>bilayer's hydrophobic core.</Txt>
        <Txt x={90} y={752} size={20} weight={600}>“Non-polar” and “lipid-soluble” are alternatives for</Txt>
        <Txt x={90} y={778} size={20} weight={600}>one property point. Small size is a further accepted</Txt>
        <Txt x={90} y={804} size={20} weight={600}>point in this particular question.</Txt>
        <Txt x={90} y={834} size={20} weight={700} fill={C.muted} italic>Our paraphrase.</Txt>
        <SteroidIcon x={840} y={720} t={t} />
        <Txt x={930} y={800} size={20} weight={700} fill="#7D1F5A" anchor="end">steroid hormone S</Txt>
        <Txt x={930} y={826} size={20} weight={700} fill="#7D1F5A" anchor="end">(exam context)</Txt>
      </Card>}
      {/* the reject card */}
      {a('reject') >= 0 && <Card x={970} y={588} w={880} h={172} opacity={fi(a('reject'), 0.4)} stroke={C.primary} fill="#FFFFFF">
        <Written x={990} y={630} text="At equal water potentials, water stops moving." size={23} />
        <path data-role="decor" d={`M${1014} ${622}H${1014 + (560) * fe(a('reject') - 0.6, 0.6)}`} stroke={C.primary} strokeWidth={4} />
        <Txt x={990} y={670} size={23} weight={800} fill={GOOD} opacity={fi(a('reject') - 1.0, 0.4)}>✓</Txt>
        <Txt x={1014} y={670} size={22} weight={600} fill={GOOD} italic opacity={fi(a('reject') - 1.0, 0.4)}>At equal water potentials there is no net movement of water;</Txt>
        <Txt x={1014} y={698} size={22} weight={600} fill={GOOD} italic opacity={fi(a('reject') - 1.0, 0.4)}>water molecules still cross both ways.</Txt>
        <Txt x={990} y={738} size={20} weight={600} fill={C.muted} italic>our wording contrast; not a mark-scheme reject line</Txt>
      </Card>}
      {/* the hook returns; the carrier replay */}
      {a('sugar') >= 0 && <g opacity={fi(a('sugar'), 0.4)}>
        <Pill x={1330} y={806} text="How does sugar get into a cell?" size={20} />
        <g data-role="drawing"><GlucoseTok x={1308} y={800} r={13} /></g>
      </g>}
      {cyc && <Magnifier x={cx} y={cy} r={76} lx={cx} ly={cy} o={fi(a('carrier'), 0.4)}>
        <CarrierProtein x={cx} y={cy} u={20} phase={cyc.phase} />
        {cyc.tok && <GlucoseTok x={cx} y={cy + cyc.ty * 20} r={10} />}
      </Magnifier>}
      {a('carrier') >= 0 && <g opacity={fi(a('carrier'), 0.4)}>
        <Txt x={cx - 90} y={cy + 4} size={20} weight={700} fill={C.muted} anchor="end">mechanism</Txt>
        <Txt x={cx - 90} y={cy + 28} size={20} weight={700} fill={C.muted} anchor="end">replay;</Txt>
        <Txt x={cx - 90} y={cy + 52} size={20} weight={700} fill={C.muted} anchor="end">not counted</Txt>
        <Pill x={1330} y={864} text="down its gradient" size={20} fill={C.teal} />
        <ATPTag x={1372} y={912} w={60} h={34} struck /><Pill x={1424} y={918} text="no ATP used" size={20} />
      </g>}
      <Cite x={1850} y={948} text="exam references: our paraphrases of the cited mark schemes" anchor="end" />
    </g>
  );
}
