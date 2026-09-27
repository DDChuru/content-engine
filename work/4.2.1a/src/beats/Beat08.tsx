import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, CUE, BSTART, RouteSlots, MemScene, memM, memGeo, MX, fmmLayout, compPos, Sentence, Magnifier} from '../kit';
import {mixedFields, SLOT, FDBracket} from './Beat07';
import {MemCounters, MemNet, CoreLabel} from './Beat05';
import {fieldState, FieldTokens, SideTag, windowEvents, countIn} from '../DiffusionField';
import {IonTok} from '../T4Tokens';
import {ChannelProtein, channelPass, PROT} from '../TransportProteinSet';
import {InkRing} from '../../shared/src/Type';

/** Dataset 2, Beat 8: ions 20 / 5 (new illustrative setup from the beat's first frame); the 5 s counted sequence
 * from `count` through the channel's pore (8 in, 2 out → 14 / 11). */
export const b8 = () => ({origin: BSTART(8), w0: CUE(8, 'count'), evs: windowEvents(CUE(8, 'count'), 8, 2, 5, 81)});
export function ionField(t: number, G: any) { const B = b8(); return fieldState({G, nA: 20, nB: 5, evs: B.evs, t, origin: B.origin, seed: 82, speed: 0.8}); }
/** 008f memory hook: a doorway-in-a-wall pictogram (an OPEN doorway: no door leaf, nothing that swings or gates),
 * drawn at full size in a panel, with the two spoken links as tags. `lw` = wall lit (0..1), `ld` = doorway lit. */
export const HOOK = {x: 1050, y: 204, w: 800, h: 330};
export function DoorWall({o = 1, lw = 0, ld = 0, tagW = 1, tagD = 1}: any) {
  if (o <= 0) return null;
  const {x, y, w, h} = HOOK, bx = x + 40, by = y + 40, bw = 44, bh = 26, cols = 7, rows = 9;
  const dc0 = 2.6, dc1 = 4.4, dr0 = 2;                 // doorway: columns 2.6..4.4 (in brick widths), rows 2..end
  const bricks: any[] = [];
  for (let r = 0; r < rows; r++) for (let c = -1; c < cols; c++) {
    const x0 = bx + c * bw + (r % 2) * (bw / 2), x1 = x0 + bw - 3;
    const cx0 = Math.max(x0, bx), cx1 = Math.min(x1, bx + cols * bw - 3);
    if (cx1 - cx0 < 6) continue;
    if (r >= dr0 && cx1 > bx + dc0 * bw && cx0 < bx + dc1 * bw) {
      const L = [cx0, Math.min(cx1, bx + dc0 * bw - 3)], R = [Math.max(cx0, bx + dc1 * bw + 3), cx1];
      for (const [p0, p1] of [L, R]) if (p1 - p0 >= 6) bricks.push([p0, by + r * bh, p1 - p0]);
      continue;
    }
    bricks.push([cx0, by + r * bh, cx1 - cx0]);
  }
  const doorX = bx + dc0 * bw, doorW = (dc1 - dc0) * bw, doorY = by + dr0 * bh, doorH = (rows - dr0) * bh - 3;
  const tx = x + 400;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <rect data-role="decor" x={x} y={y} width={w} height={h} rx={16} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
      <g data-role="drawing">
        {bricks.map(([bx0, by0, ww]: any, i: number) => <rect key={i} x={bx0} y={by0} width={ww} height={bh - 3} fill={lw > 0 ? mix('#C9A98A', '#F2B233', lw) : '#C9A98A'} stroke={lw > 0 ? mix('#8C6C4E', '#B0701A', lw) : '#8C6C4E'} strokeWidth={1.5} />)}
        <rect x={doorX} y={doorY} width={doorW} height={doorH} fill={ld > 0 ? mix('#DDEFF0', '#9FE0DA', ld) : '#DDEFF0'} stroke={ld > 0 ? '#1E6B66' : '#8C6C4E'} strokeWidth={2 + 2 * ld} />
      </g>
      {ld > 0 && <rect data-role="decor" x={doorX - 8} y={doorY - 8} width={doorW + 16} height={doorH + 12} rx={8} fill="none" stroke="#E0892B" strokeWidth={4} opacity={ld} />}
      {lw > 0 && <rect data-role="decor" x={bx - 8} y={by - 8} width={cols * bw + 13} height={rows * bh + 13} rx={8} fill="none" stroke="#E0892B" strokeWidth={4} opacity={lw * (1 - 0.6 * ld)} />}
      <Txt x={tx} y={y + 52} size={22} weight={800} fill={C.ink}>a doorway in a wall</Txt>
      <g opacity={tagW}><Txt x={tx} y={y + 116} size={24} weight={800} fill="#B0701A">wall</Txt><Txt x={tx + 64} y={y + 116} size={24} weight={700} fill={C.ink}>→ phospholipid bilayer</Txt></g>
      <g opacity={tagD}><Txt x={tx} y={y + 176} size={24} weight={800} fill="#1E6B66">doorway</Txt><Txt x={tx + 108} y={y + 176} size={24} weight={700} fill={C.ink}>→ hydrophilic pore</Txt></g>
      <Txt x={tx} y={y + 226} size={20} weight={600} fill={C.muted} italic>an opening: nothing swings shut</Txt>
      <Pill x={tx} y={y + 290} text="handle, not an exam answer" size={20} fill={C.primary} />
    </g>
  );
}
const mix = (c0: string, c1: string, k: number) => {
  const p = (c: string, i: number) => parseInt(c.slice(1 + 2 * i, 3 + 2 * i), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(p(c0, i) + (p(c1, i) - p(c0, i)) * Math.max(0, Math.min(1, k))).toString(16).padStart(2, '0')).join('');
};
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
  // 008f memory hook: wall ↔ bilayer (l1), doorway ↔ pore (l2), both held from `map` (2 s silent hold) to `written`
  const lw = fi(a('l1'), 0.5) * (1 - 0.5 * fe(a('written') + 0.2, 0.6)), ld = fi(a('l2'), 0.5) * (1 - 0.5 * fe(a('written') + 0.2, 0.6));
  const hookO = fi(a('door'), 0.5) * (1 - fe(a('watch') + 0.45, 0.4));
  const poreHl = a('l2') >= 0 ? ld : 0;
  const mem = a('l2') >= 0 || a('l1') < 0 ? {highlight: 'intrinsic-channel', hl: a('l1') < 0 ? 1 : 0.4 + 0.6 * poreHl} : {compDim: {'intrinsic-channel': 0.45 * lw, 'intrinsic-carrier': 0.45 * lw, glycoprotein: 0.45 * lw, 'receptor-glycoprotein': 0.45 * lw, glycolipid: 0.45 * lw, cholesterol: 0.45 * lw}};
  // mechanism view: an ion passes the magnified pore (uncounted, loops every 2.2 s from `watch`)
  const mx = 1250, my = 390, mr = 115, wa = a('watch'), magO = fi(wa, 0.5) * (1 - fe(a('diff'), 0.4));
  const mp = wa >= 0 ? channelPass(wa % 2.2, 1.6, -3.4, 3.4) : null;
  const ghost = a('diff');
  const gp = ghost >= 0 ? channelPass((ghost - 0.5) % 2.4, 1.6, -3.0, 3.0) : null;
  return (
    <g>
      <MemScene s={s} t={t} mem={mem} core={0} />
      <CoreLabel />
      {lw > 0 && <rect data-role="decor" x={Lf.x0} y={M0.cy - 1.5 * M0.u} width={Lf.width} height={3 * M0.u} rx={10} fill="#F2B233" opacity={0.28 * lw} />}
      <FieldTokens st={F.o2} k="o2" t={t} opacity={0.3} />
      <FieldTokens st={F.glu} k="glucose" t={t} opacity={0.3} s={0.85} />
      <FieldTokens st={st} k="ion" t={t} hi={live ? st.pts.filter((p: any) => p.crossing).map((p: any) => p.i) : []} />
      <Lbl x={ch.x} y={Lf.protTop - 58} text="channel protein" anchor="middle" o={0.7 + 0.3 * fi(a('open'), 0.4)} size={22 + 2 * pulse(a('open'), 1.2)} fill="#1E6B66" lx={ch.x} ly={Lf.protTop - 4} />
      {poreHl > 0 && <InkRing cx={ch.x} cy={M0.cy} rx={0.55 * M0.u} ry={2.3 * M0.u} p={fe(a('l2'), 0.6)} opacity={poreHl * (1 - fe(a('pore'), 0.4))} color="#E0892B" />}
      <InkRing cx={ch.x} cy={M0.cy} rx={0.5 * M0.u} ry={2.2 * M0.u} p={fe(a('pore'), 0.6)} opacity={1 - fe(a('watch'), 0.5)} />
      <Lbl x={ch.x + 40} y={M0.cy + 3.6 * M0.u} text="hydrophilic pore" o={Math.max(fi(a('pore'), 0.4), poreHl)} size={20} fill="#1E6B66" lx={ch.x + 6} ly={M0.cy + 2.4 * M0.u} />
      {lw > 0 && <Lbl x={Lf.x0 + Lf.width - 10} y={Lf.bottom + 34} text="phospholipid bilayer" anchor="end" o={lw * (1 - fe(a('written'), 0.5))} size={22} fill="#B0701A" />}
      <InkRing cx={ch.x} cy={M0.cy} rx={1.3 * M0.u} ry={3.0 * M0.u} p={fe(a('shape'), 0.8)} opacity={1 - fe(a('shape') - 2.6, 0.5)} color={C.teal} />
      <Pill x={ch.x - 60} y={Lf.protTop - 96} text="shape unchanged" anchor="end" o={fi(a('shape') + 0.2, 0.4)} size={20} fill={C.teal} />
      <Pill x={ch.x + 60} y={Lf.protTop - 96} text="our model: pore open; gating not taught" o={fi(a('open2'), 0.4)} size={20} />
      <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={st.a} cap="" />
      <SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={st.b} cap="" />
      <Pill x={(MX.x0 + MX.x1) / 2} y={MX.y0 - 12} text="new illustrative setup: ions 20 / 5 (set starting counts)" anchor="middle" o={1 - fe(a('watch'), 0.5)} size={20} fill={C.primary} />
      <MemCounters live={live} last={done ? [8, 2] : null} hiLast={pulse(t - (B.w0 + 5), 1.2)} x={1544} />
      <MemNet net={net} label="facilitated diffusion" />
      <DoorWall o={hookO} lw={lw} ld={ld} tagW={fi(a('l1'), 0.4)} tagD={fi(a('l2'), 0.4)} />
      {a('written') >= 0 && <Sentence x={120} y={744} w={780} size={21} fill="rgba(255,255,255,0.86)" o={fi(a('written'), 0.4)} lines={[
        {text: 'A channel protein provides a hydrophilic pore through which', o: fi(a('pore'), 0.4)},
        {text: 'particular ions or polar molecules diffuse down their', o: fi(a('sent') - 0.2, 0.4)},
        {text: 'concentration gradient.', o: fi(a('sent') - 0.8, 0.4)}]} />}
      {wa >= 0 && magO > 0 && <Magnifier x={mx} y={my} r={mr} lx={ch.x + 26} ly={M0.cy - 1.2 * M0.u} o={magO}>
        <ChannelProtein x={mx} y={my} u={36} />
        {pulse(a('lined'), 2.0) > 0 && <g data-role="decor">{[-1.6, -0.8, 0, 0.8, 1.6].map((k) => [-1, 1].map((sd) => <circle key={`${k}${sd}`} cx={mx + sd * 0.23 * 36} cy={my + k * 36} r={7} fill="none" stroke="#E0892B" strokeWidth={3} opacity={pulse(a('lined'), 2.0)} />))}</g>}
        {mp && mp.tok && <IonTok x={mx} y={my + mp.ty * 36} r={11} />}
      </Magnifier>}
      <Txt x={mx} y={my + mr + 32} size={20} weight={700} fill={C.muted} italic anchor="middle" opacity={magO}>mechanism view; not counted</Txt>
      <Lbl x={mx} y={my + mr + 60} anchor="middle" text="lined by hydrophilic" o={fi(a('lined'), 0.4) * (1 - fe(a('diff'), 0.4))} size={20} fill="#A4561A" />
      <Lbl x={mx} y={my + mr + 86} anchor="middle" text="R groups" o={fi(a('lined'), 0.4) * (1 - fe(a('diff'), 0.4))} size={20} fill="#A4561A" />
      {ghost >= 0.4 && <g opacity={fi(ghost - 0.4, 0.4)}>
        <g opacity={0.7}><ChannelProtein x={mx} y={my} u={34} /></g>
        {gp && gp.tok && <IonTok x={mx} y={my + gp.ty * 34} r={11} sign="−" />}
        <Pill x={mx} y={my + mr + 32} text="each channel: particular ions" anchor="middle" size={20} />
      </g>}
      <RouteSlots x={SLOT.x} y={SLOT.y} w={SLOT.w} h={SLOT.h} gap={SLOT.gap} fill={[1, a('diff') >= 0.8 ? 1 : 0, 0, 0]} hi={[0, pulse(a('diff') - 0.8, 1.4), 0, 0]} />
      <FDBracket />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
