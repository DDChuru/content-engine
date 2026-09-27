import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, CUE, BSTART, RouteSlots, MemScene, memM, memGeo, MX, fmmLayout, compPos, Sentence, Magnifier} from '../kit';
import {mixedFields, SLOT, FDBracket} from './Beat07';
import {MemCounters, MemNet} from './Beat05';
import {fieldState, FieldTokens, SideTag, windowEvents, countIn} from '../DiffusionField';
import {IonTok} from '../T4Tokens';
import {ChannelProtein, channelPass, PROT} from '../TransportProteinSet';
import {InkRing} from '../../shared/src/Type';

/** Dataset 2, Beat 8: ions 20 / 5 (new illustrative setup from the beat's first frame); the 5 s counted sequence
 * from `count` through the channel's pore (8 in, 2 out → 14 / 11). */
export const b8 = () => ({origin: BSTART(8), w0: CUE(8, 'count'), evs: windowEvents(CUE(8, 'count'), 8, 2, 5, 81)});
export function ionField(t: number, G: any) { const B = b8(); return fieldState({G, nA: 20, nB: 5, evs: B.evs, t, origin: B.origin, seed: 82, speed: 0.8}); }
/** Door-in-wall pictogram (the handle). */
export function DoorWall({x, y, o = 1}: any) {
  if (o <= 0) return null;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <g data-role="drawing">
        {[0, 1, 2].map((r) => [0, 1, 2, 3].map((c) => (c === 1 || c === 2) && r > 0 ? null : <rect key={`${r}${c}`} x={x + c * 34 + (r % 2) * 10} y={y + r * 22} width={32} height={20} fill="#C9A98A" stroke="#8C6C4E" strokeWidth={1.5} />))}
        <rect x={x + 38} y={y + 22} width={56} height={44} fill={'#7FC3BE'} stroke="#2F7F7A" strokeWidth={2} />
      </g>
      <Pill x={x + 160} y={y + 42} text="handle, not an exam answer" size={16} fill={C.primary} />
    </g>
  );
}
/** Beat 8 · A channel protein: the handle and the written sentence; mechanism view in a magnified pore; the 5 s
 * counted sequence (8 · 2 → 14 / 11); shape unchanged; pore open in our model; different channels, particular ions. */
export default function Beat08(s: any) {
  const t = gt(s), a = s.a;
  const M0 = memM(t), Lf = fmmLayout(M0), ch = compPos(M0, 'channel');
  const G = {...memGeo(M0), gates: [ch.x]};
  const B = b8(), st = ionField(t, G), F = mixedFields(t, memGeo(M0), BSTART(7));
  const done = t >= B.w0 + 5;
  const live = a('count') >= 0 && !done ? countIn(B.evs, B.w0, B.w0 + 5, t) : null;
  const net = done ? 6 * fe(t - (B.w0 + 5), 0.8) : 0;
  const mem = {highlight: 'intrinsic-channel', hl: 1};
  // mechanism view: an ion passes the magnified pore (uncounted, loops every 2.2 s from `watch`)
  const mx = 1580, my = 400, mr = 110, wa = a('watch');
  const mp = wa >= 0 ? channelPass(wa % 2.2, 1.6, -3.4, 3.4) : null;
  const ghost = a('diff');
  const gp = ghost >= 0 ? channelPass((ghost - 0.5) % 2.4, 1.6, -3.0, 3.0) : null;
  return (
    <g>
      <MemScene s={s} t={t} mem={mem} />
      <FieldTokens st={F.o2} k="o2" t={t} opacity={0.3} />
      <FieldTokens st={F.glu} k="glucose" t={t} opacity={0.3} s={0.85} />
      <FieldTokens st={st} k="ion" t={t} hi={live ? st.pts.filter((p: any) => p.crossing).map((p: any) => p.i) : []} />
      <Lbl x={ch.x} y={Lf.protTop - 58} text="channel protein" anchor="middle" o={0.7 + 0.3 * fi(a('open'), 0.4)} size={22 + 2 * pulse(a('open'), 1.2)} fill="#1E6B66" lx={ch.x} ly={Lf.protTop - 4} />
      <InkRing cx={ch.x} cy={M0.cy} rx={0.5 * M0.u} ry={2.2 * M0.u} p={fe(a('pore'), 0.6)} opacity={1 - fe(a('watch'), 0.5)} />
      <Lbl x={ch.x + 40} y={M0.cy + 3.6 * M0.u} text="hydrophilic pore" o={fi(a('pore'), 0.4)} size={20} fill="#1E6B66" lx={ch.x + 6} ly={M0.cy + 2.4 * M0.u} />
      <InkRing cx={ch.x} cy={M0.cy} rx={1.3 * M0.u} ry={3.0 * M0.u} p={fe(a('shape'), 0.8)} opacity={1 - fe(a('shape') - 2.6, 0.5)} color={C.teal} />
      <Pill x={ch.x - 60} y={Lf.protTop - 96} text="shape unchanged" anchor="end" o={fi(a('shape') + 0.2, 0.4)} size={16} fill={C.teal} />
      <Pill x={ch.x + 60} y={Lf.protTop - 96} text="our model: pore open; gating not taught" o={fi(a('open2'), 0.4)} size={16} />
      <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={st.a} cap={a('count') < 0 ? 'set starting count' : ''} />
      <SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={st.b} cap={a('count') < 0 ? 'set starting count' : ''} />
      <Pill x={(MX.x0 + MX.x1) / 2} y={MX.y0 - 12} text="new illustrative setup: ions 20 / 5" anchor="middle" o={1 - fe(a('watch'), 0.5)} size={16} fill={C.primary} />
      <MemCounters live={live} last={done ? [8, 2] : null} hiLast={pulse(t - (B.w0 + 5), 1.2)} />
      <MemNet net={net} label="facilitated diffusion" />
      <DoorWall x={1380} y={210} o={fi(a('door'), 0.4)} />
      {a('written') >= 0 && <Sentence x={120} y={744} w={780} size={21} fill="rgba(255,255,255,0.86)" o={fi(a('written'), 0.4)} lines={[
        {text: 'A channel protein provides a hydrophilic pore through which', o: fi(a('pore'), 0.4)},
        {text: 'particular ions or polar molecules diffuse down their', o: fi(a('sent') - 0.2, 0.4)},
        {text: 'concentration gradient.', o: fi(a('sent') - 0.8, 0.4)}]} />}
      {wa >= 0 && <Magnifier x={mx} y={my} r={mr} lx={ch.x + 26} ly={M0.cy - 1.2 * M0.u} o={fi(wa, 0.5)}>
        <ChannelProtein x={mx} y={my} u={34} />
        {pulse(a('lined'), 2.0) > 0 && <g data-role="decor">{[-1.6, -0.8, 0, 0.8, 1.6].map((k) => [-1, 1].map((sd) => <circle key={`${k}${sd}`} cx={mx + sd * 0.23 * 34} cy={my + k * 34} r={7} fill="none" stroke="#E0892B" strokeWidth={3} opacity={pulse(a('lined'), 2.0)} />))}</g>}
        {mp && mp.tok && <IonTok x={mx} y={my + mp.ty * 34} r={11} />}
      </Magnifier>}
      <Txt x={mx} y={my + mr + 28} size={15} weight={700} fill={C.muted} italic anchor="middle" opacity={fi(wa, 0.5)}>mechanism view; not counted</Txt>
      <Lbl x={mx - mr - 10} y={my + 80} anchor="end" text="lined by" o={fi(a('lined'), 0.4)} size={18} fill="#A4561A" />
      <Lbl x={mx - mr - 10} y={my + 102} anchor="end" text="hydrophilic" o={fi(a('lined'), 0.4)} size={18} fill="#A4561A" />
      <Lbl x={mx - mr - 10} y={my + 124} anchor="end" text="R groups" o={fi(a('lined'), 0.4)} size={18} fill="#A4561A" />
      {ghost >= 0 && <g opacity={fi(ghost, 0.5)}>
        <g opacity={0.55}><ChannelProtein x={1790} y={360} u={24} /></g>
        {gp && gp.tok && <IonTok x={1790} y={360 + gp.ty * 24} r={9} sign="−" />}
        <Pill x={1850} y={470} text="each channel: particular ions" anchor="end" size={15} />
      </g>}
      <RouteSlots x={SLOT.x} y={SLOT.y} w={SLOT.w} h={SLOT.h} gap={SLOT.gap} fill={[1, fe(a('diff') - 0.8, 0.6), 0, 0]} hi={[0, pulse(a('diff') - 0.8, 1.4), 0, 0]} />
      <FDBracket />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
