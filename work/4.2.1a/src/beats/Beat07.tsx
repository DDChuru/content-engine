import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, C, Txt, Cite, PARTS, SCHEM, clamp01, CUE, BSTART, RouteSlots, MemScene, memM, memGeo, MX, Card, lanes, fmmLayout, compPos, Halo, turnBack, Bracket, Sentence, Wash} from '../kit';
import {fieldState, FieldTokens, SideTag, CounterCard} from '../DiffusionField';
import {GlucoseTok, IonTok} from '../T4Tokens';
import {HY} from '../FluidMosaicMembrane';
import {PROT} from '../TransportProteinSet';

/** Ion and glucose populations on the membrane scene (Beats 7–10): ions 20 / 5, glucose 15 / 5 (one of each
 * outside is the labelled token, drawn separately), O₂ held at the retained 26 / 14 (dimmed). */
export function mixedFields(t: number, G: any, origin: number) {
  return {
    o2: fieldState({G, nA: 26, nB: 14, evs: [], t, origin: CUE(6, 'noeq'), seed: 10}),
    ion: fieldState({G, nA: 19, nB: 5, evs: [], t, origin, seed: 71, speed: 0.8}),
    glu: fieldState({G, nA: 14, nB: 5, evs: [], t, origin, seed: 72, speed: 0.7}),
  };
}
/** Slot geometry of the route slots as laid out from Beat 5 on. */
export const SLOT = {x: 1370, y: 600, w: 480, h: 70, gap: 12};
export const slotY = (i: number) => SLOT.y + i * (SLOT.h + SLOT.gap);
/** The facilitated-diffusion bracket spanning route slots 2 and 3, with its label and tags. */
export function FDBracket({p = 1, lab = 1, tags = 1, o = 1}: any) {
  if (o <= 0) return null;
  return (
    <g opacity={o < 1 ? o : undefined}>
      <Bracket x={SLOT.x - 14} y0={slotY(1)} y1={slotY(2) + SLOT.h} side={1} p={p} color={C.teal} />
      <Lbl x={SLOT.x - 30} y={slotY(1) + 70} text="facilitated diffusion" anchor="end" o={lab} size={23} fill={C.teal} />
      <Txt x={SLOT.x - 30} y={slotY(1) + 100} size={15} weight={700} fill={C.ink} anchor="end" opacity={tags}>net movement down the gradient</Txt>
      <Txt x={SLOT.x - 30} y={slotY(1) + 122} size={15} weight={700} fill={C.ink} anchor="end" opacity={tags}>no ATP · through a protein</Txt>
    </g>
  );
}

/** Beat 7 · Turned back at the core: ions (charged) and glucose (polar) interact well with water and poorly with
 * the hydrophobic core; turn-back motion; the MF2 sentence; the channel and carrier; facilitated diffusion. */
export default function Beat07(s: any) {
  const t = gt(s), a = s.a;
  const M0 = memM(t), G = memGeo(M0), Lf = fmmLayout(M0);
  const ch = compPos(M0, 'channel'), ca = compPos(M0, 'carrier');
  const hlCh = fe(a('prot'), 0.5) * (1 - fe(a('prot') - 1.8, 0.4));
  const hlCa = fe(a('prot') - 1.8, 0.5) * (1 - fe(a('names'), 0.4));
  const both = fe(a('names'), 0.5);
  const others = {glycolipid: 0.5, cholesterol: 0.5, 'receptor-glycoprotein': 0.5, glycoprotein: 0.5, extrinsic: 0.5};
  const mem = hlCh > 0 ? {highlight: 'intrinsic-channel', hl: hlCh} : hlCa > 0 ? {highlight: 'intrinsic-carrier', hl: hlCa} : both > 0 ? {compDim: Object.fromEntries(Object.entries(others).map(([k, v]) => [k, v * both]))} : {};
  const F = mixedFields(t, G, BSTART(7));
  const L = lanes(M0);
  const yTop = Lf.top - 1.6 * M0.u, yStall = Lf.outerHead + 0.55 * M0.u;
  const ionX = L[0][0], gluX = L[2][0];
  const ionP = a('turn') >= 0 ? turnBack(a('turn'), ionX, yTop, yStall) : [ionX + 6 * Math.sin(t * 0.9), yTop + 5 * Math.sin(t * 1.3)];
  const gluP = a('turn') >= 1.6 ? turnBack(a('turn') - 1.6, gluX, yTop, yStall) : [gluX + 6 * Math.sin(t * 0.8 + 1), yTop + 5 * Math.sin(t * 1.1 + 2)];
  const startFade = 1 - fe(a('open'), 0.6);
  const tailsHi = fi(a('tails'), 0.5) * (1 - fe(a('ion'), 0.5));
  return (
    <g>
      <MemScene s={s} t={t} mem={mem} />
      {tailsHi > 0 && <rect data-role="decor" x={Lf.x0} y={M0.cy - (HY - 0.35) * M0.u} width={Lf.width} height={2 * (HY - 0.35) * M0.u} fill="#F2C45A" opacity={0.3 * tailsHi} />}
      <FieldTokens st={F.o2} k="o2" t={t} opacity={1 - 0.7 * fe(a('open'), 0.6)} />
      <FieldTokens st={F.ion} k="ion" t={t} opacity={fi(a('open'), 0.6)} />
      <FieldTokens st={F.glu} k="glucose" t={t} opacity={fi(a('open'), 0.6)} s={0.85} />
      <Halo x={ionP[0]} y={ionP[1]} r={26} t={t} o={fi(a('water'), 0.5)} />
      <Halo x={gluP[0]} y={gluP[1]} r={30} t={t + 1} o={fi(a('water'), 0.5)} />
      <g data-role="drawing" opacity={fi(a('open'), 0.6)}><IonTok x={ionP[0]} y={ionP[1]} r={13} /><GlucoseTok x={gluP[0]} y={gluP[1]} r={15} rot={t * 10} /></g>
      <Lbl x={ionX - 30} y={yTop - 36} text="ion (charged)" anchor="end" o={fi(a('ion'), 0.4)} size={21} fill="#6A3D9A" lx={ionX - 10} ly={yTop - 14} />
      <Lbl x={gluX + 30} y={yTop - 36} text="glucose (polar)" o={fi(a('glu'), 0.4)} size={21} fill="#A4561A" lx={gluX + 10} ly={yTop - 16} />
      <Lbl x={MX.x1 + 16} y={M0.cy + 6} text="hydrophobic fatty-acid tails" o={fi(a('tails'), 0.4) * (1 - fe(a('prot'), 0.5))} size={20} fill="#6B6B6B" />
      <Pill x={(MX.x0 + MX.x1) / 2} y={MX.y0 - 12} text="does not cross the core readily (schematic)" anchor="middle" o={fi(a('turn'), 0.4)} size={16} fill={C.primary} />
      <Pill x={1610} y={250} text="How does sugar get into a cell?" anchor="middle" o={fi(a('open'), 0.5) * (1 - fe(a('turn'), 0.4))} size={17} />
      {a('sent') >= 0 && <Sentence x={120} y={742} w={870} size={23} o={fi(a('sent'), 0.4)} lines={[{text: 'Glucose is polar and does not cross the hydrophobic', o: 1}, {text: 'bilayer core readily; it needs a transport protein.', o: fi(a('sent') - 1.4, 0.5)}]} />}
      <Lbl x={ch.x} y={Lf.protTop - 58} text="channel protein" anchor="middle" o={fi(a('names'), 0.4)} size={21} fill="#1E6B66" lx={ch.x} ly={Lf.protTop - 4} />
      <Lbl x={ca.x} y={Lf.protTop - 58} text="carrier protein" anchor="middle" o={fi(a('names') - 0.5, 0.4)} size={21} fill="#1E6B66" lx={ca.x} ly={Lf.protTop - 4} />
      {startFade > 0 && <g opacity={startFade}>
        <SideTag x={MX.x1 - 50} y={MX.y0 + 44} n={26} /><SideTag x={MX.x1 - 50} y={MX.y1 - 56} n={14} />
        <CounterCard x={1030} y={340} w={306} la="outside → cytoplasm" lb="cytoplasm → outside" n={8} m={2} title="last completed demonstration" sub="illustrative counts" />
        <Card x={1370} y={196} w={480} h={366} stroke={C.teal} fill="#FFFFFF"><Txt x={1390} y={230} size={21} weight={800} fill={C.teal}>faster net diffusion</Txt><Txt x={1390} y={256} size={17} weight={700} fill={C.primary}>direction of each effect only</Txt></Card>
      </g>}
      <RouteSlots x={SLOT.x} y={SLOT.y} w={SLOT.w} h={SLOT.h} gap={SLOT.gap} fill={[1, 0, 0, 0]} hi={[0, pulse(a('bracket'), 1.4), pulse(a('bracket'), 1.4), 0]} />
      <FDBracket p={fe(a('bracket'), 0.6)} lab={fi(a('fd'), 0.4)} tags={fi(a('fd') - 0.8, 0.4)} o={fi(a('bracket'), 0.3)} />
      <Cite x={MX.x1} y={948} text={SCHEM + '; ' + PARTS} anchor="end" />
    </g>
  );
}
