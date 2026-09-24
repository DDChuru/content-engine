/** Beat 11 · Competitive: in the active site, overcome by substrate. Motions only (non-covalent): the wedge seats,
 * a substrate arrives, rocks and slides away; the wedge leaves; a substrate seats (bound) and the schematic
 * products state switches in ONE frame (no cross-fade; symbolic outlines, no bonds drawn). Graph: competitive
 * curve to the right, shared vmax-line (plateaux coincide), each curve's own half-line/km-drop; merge ringed. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag, Card} from '../shared/Type';
import {fi, fe, between, move, wobble} from '../util';
import {Enzyme, Mol, MolAt, Products, BoundTicks} from '../Enzyme';
import {VmaxLine, HalfLine, KmDrop, gx, gy} from '../RateGraph';
import {NONE, COMP, inhG, InhAxes, CurveLabel, CurvePath} from './inhib';
import {Small} from './common';

const EX = 470, EY = 620, ES = 0.95;
const g = inhG(1190, 300, 600, 400);
export default function Beat11(s: any) {
  const {a, k} = s;
  // inhibitor wedge
  const iOff = a('ileave') > 0 ? move(a('ileave'), 1.2, 0, 330) : move(a('iseat'), 1.0, 330, 0);
  const iOn = a('iseat') > 0 && a('ileave') < 1.2;
  // first substrate: arrives, blocked, rocks, slides away
  const s1Off = a('slide') > 0 ? move(a('slide'), 1.4, 104, 330) : move(a('sarr'), 1.2, 360, 104);
  const s1Slide = a('slide') > 0 ? move(a('slide'), 1.4, 0, 160) : 0;
  const s1Rot = a('sarr') > 1.2 && a('slide') <= 0 ? wobble(a('sarr') - 1.2, 9) : a('slide') > 0 ? wobble(a('slide'), 6) : 0;
  const s1On = a('sarr') > 0 && a('slide') < 1.4;
  // second substrate: seats, reacts (one-frame switch to products), products drift out
  const reactAt = 2.2;
  const s2Off = move(a('sseat'), 1.0, 360, 0);
  const s2On = a('sseat') > 0 && a('sseat') < reactAt;
  const prod = a('sseat') >= reactAt ? clamp01((a('sseat') - reactAt) / 2.2) : -1;
  const compete = between(a('compete'), a('wins'), 0.4);
  const crowd = fi(a('wins'), 0.6) * (1 - fi(a('graph') - 0.5));
  const nS = Math.min(7, Math.floor(clamp01(a('wins') / 4) * 7.99)), nI = Math.min(2, Math.floor(clamp01((a('wins') - 0.8) / 3) * 2.99));
  const cmp = between(a('similar'), a('iseat') - 0.2, 0.4);
  const overlay = clamp01((a('similar') - 2.4) / 0.8) * (1 - clamp01((a('similar') - 5.4) / 0.5));
  return (
    <g>
      {/* similar, not identical */}
      <g opacity={cmp}>
        <Card x={110} y={200} w={760} h={230} />
        <MolAt px={250} py={315} kind="substrate" s={1.1} />
        <Txt x={250} y={408} size={20} weight={800} anchor="middle">substrate</Txt>
        <MolAt px={250 + 200 * (1 - overlay)} py={315} kind="comp" s={1.1} opacity={1 - 0.45 * overlay} />
        <Txt x={450} y={408} size={20} weight={800} anchor="middle" fill={C.primary} opacity={1 - overlay}>competitive inhibitor</Txt>
        <Txt x={560} y={300} size={26} weight={800} fill={C.ink}>similar shape,</Txt>
        <Txt x={560} y={336} size={26} weight={800} fill={C.ink}>not identical</Txt>
        <Small x={560} y={368} text="(one corner clipped)" opacity={overlay} />
      </g>
      <Enzyme x={EX} y={EY} s={ES} labEnzyme={1} labActive={fi(a('iseat'))} caption={1} ringActive={compete} ringColor={C.teal} />
      {iOn && <Mol x={EX} y={EY} s={ES} kind="comp" off={iOff} />}
      {iOn && <Txt x={EX + 250} y={EY - 150} size={21} weight={800} fill={C.primary} opacity={fi(a('iseat'))}>competitive inhibitor</Txt>}
      {s1On && <Mol x={EX} y={EY} s={ES} kind="substrate" off={s1Off} slide={s1Slide} rot={s1Rot} />}
      {s1On && a('sarr') > 1.2 && <Small x={EX + 200} y={EY - 330} text="occupied: nowhere to go" fill={C.primary} />}
      {s2On && <Mol x={EX} y={EY} s={ES} kind="substrate" off={s2Off} />}
      {s2On && a('sseat') > 1 && <BoundTicks x={EX} y={EY} s={ES} />}
      {prod >= 0 && prod < 1 && <Products x={EX} y={EY} s={ES} p={prod} />}
      {prod >= 0 && prod < 1 && <Txt x={EX + 250} y={EY - 250} size={20} weight={800} opacity={1 - clamp01((prod - 0.8) / 0.2)}>products</Txt>}
      {/* competing for the same site */}
      <g opacity={compete}>
        <MolAt px={EX + 260} py={EY - 330} kind="substrate" s={0.8} />
        <MolAt px={EX + 420} py={EY - 160} kind="comp" s={0.8} />
        <Txt x={EX + 300} y={EY - 250} size={22} weight={800} fill={C.teal}>one site, two shapes</Txt>
      </g>
      <g opacity={crowd}>
        {[[230, -360], [340, -300], [420, -380], [520, -250], [300, -210], [560, -360], [450, -180]].map(([dx, dy], i) => (
          <MolAt key={i} px={EX + dx} py={EY + dy} kind={i === 3 ? 'comp' : 'substrate'} s={0.55} rot={i * 23} opacity={fi(a('wins') - i * 0.3)} />
        ))}
        <Card x={740} y={690} w={330} h={120} />
        <Txt x={760} y={726} size={18} weight={800} fill={C.muted}>SEATINGS IN THE ACTIVE SITE</Txt>
        <Txt x={760} y={770} size={26} weight={800} fill={C.ink}>substrate {nS}</Txt>
        <Txt x={930} y={770} size={26} weight={800} fill={C.primary}>inhibitor {nI}</Txt>
        <Small x={760} y={798} text="more substrate: substrate wins more often" />
      </g>
      {/* the graph */}
      <g opacity={fi(a('graph'))}>
        <Card x={1060} y={200} w={790} h={720} />
        <Txt x={1085} y={240} size={24} weight={800}>competitive</Txt>
        <InhAxes g={g} />
        <CurvePath g={g} c={NONE} p={clamp01(a('graph') / 1)} color={NONE.color} width={4.5} />
        <CurvePath g={g} c={COMP} p={clamp01((a('graph') - 1) / 1.4)} color={COMP.color} width={4.5} />
        <Txt x={gx(g, 70)} y={gy(g, 6.6)} size={20} weight={800} fill={NONE.color}>no inhibitor</Txt>
        <Txt x={gx(g, 105)} y={gy(g, 5.0)} size={20} weight={800} fill={COMP.color} opacity={fi(a('graph') - 1.6)}>with competitive inhibitor</Txt>
        <VmaxLine g={g} c={NONE} p={clamp01(a('vmax') / 0.8)} label="" noLabel />
         <Tag x={g.x + 14} y={gy(g, 8) - 18} text="Vmax unchanged" size={20} fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={fi(a('vmax') - 0.6)} />
        <Small x={g.x + 14} y={gy(g, 8) - 58} text="one line because the plateaux coincide" opacity={fi(a('vmax') - 0.9)} />
        <HalfLine g={g} c={COMP} p={clamp01(a('km') / 0.7)} noLabel color={C.teal} />
        <KmDrop g={g} c={NONE} p={clamp01((a('km') - 0.5) / 0.6)} color={C.teal} label="Km" size={20} anchor="end" labelDx={-8} />
        <KmDrop g={g} c={COMP} p={clamp01((a('km') - 1.0) / 0.6)} color={COMP.color} label="Km increased" size={20} anchor="start" labelDx={8} />
        <Small x={g.x} y={g.y + g.h + 106} text="Km measured with the inhibitor present: apparent Km" opacity={fi(a('km') - 1.4)} />
        <InkRing cx={gx(g, 190)} cy={gy(g, 7.95)} rx={70} ry={26} p={fe(a('merge'), 0.6)} color={C.teal} />
        <Txt x={gx(g, 190)} y={gy(g, 8) - 40} size={20} weight={800} fill={C.teal} anchor="middle" opacity={fi(a('merge'))}>merges at the plateau</Txt>
        <Small x={1085} y={890} text="s21_51 Q1(c)(ii), (iv), MS p.7 · s24_12 Q10, key A · our schematic; no values" opacity={fi(a('merge'))} />
      </g>
    </g>
  );
}
