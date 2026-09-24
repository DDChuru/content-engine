/** Beat 12 · Non-competitive (simplified model). The caption "simplified non-competitive model" runs from the start
 * of the beat over the molecular model and continues over the graph (CHECK M1). Motions only: the round inhibitor
 * seats at the second site; the cleft CHANGES SHAPE over 0.6 s (not `denatured`: silhouette tight); substrates reach
 * the cleft, rock and slide away; on departure the cleft returns over 0.6 s and a substrate seats. Graph: lower
 * plateau with its OWN vmax-line; each curve's own half-line; both drops at the same concentration. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag, Card, Cross} from '../shared/Type';
import {fi, fe, between, move, wobble} from '../util';
import {Enzyme, Mol, MolAt, ActivityArrow, BoundTicks, SITE} from '../Enzyme';
import {VmaxLine, HalfLine, KmDrop, gx, gy} from '../RateGraph';
import {NONE, NONC, inhG, InhAxes, CurvePath} from './inhib';
import {Small} from './common';

const EX = 610, EY = 560, ES = 0.95;
const g = inhG(1190, 300, 600, 400);
export default function Beat12(s: any) {
  const {a} = s;
  const iOff = a('leave') > 0 ? move(a('leave'), 1.0, 0, 260) : a('iseat') > 0 ? move(a('iseat'), 1.0, 200, 0) : 200;
  const iOn = a('nc') > 0 && a('leave') < 1.0;
  const distort = a('leave') > 0 ? 1 - clamp01((a('leave') - 0.4) / 0.6) : clamp01(a('distort') / 0.6);
  // first failed arrival
  const f = a('fail');
  const s1 = f > 0 && f < 4.2;
  const s1Off = f < 1.1 ? move(f, 1.1, 330, 46) : f < 2.6 ? 46 : move(f - 2.6, 1.4, 46, 300);
  const s1Slide = f > 2.6 ? move(f - 2.6, 1.4, 0, -140) : 0;
  // crowd: four more, each rocks off in turn
  const crowd = [0, 1, 2, 3].map((i) => {
    const t = a('crowd') - i * 1.0;
    if (t < 0 || t > 2.6) return null;
    const off = t < 0.8 ? move(t, 0.8, 330, 50) : t < 1.5 ? 50 : move(t - 1.5, 1.1, 50, 320);
    const sl = (i - 1.5) * 40 + (t > 1.5 ? move(t - 1.5, 1.1, 0, (i % 2 ? 1 : -1) * 150) : 0);
    return <Mol key={i} x={EX} y={EY} s={ES} kind="substrate" off={off} slide={sl} rot={t > 0.8 ? wobble(t - 0.8, 8) : 0} />;
  });
  const s2 = a('back') > 0;
  const level = s2 ? 0.25 + 0.75 * fe(a('back') - 0.8, 0.8) : a('iseat') > 1.5 ? 0.25 : 1;
  const [bx, by] = SITE.second;
  return (
    <g>
      <Tag x={90} y={236} text="SIMPLIFIED NON-COMPETITIVE MODEL" size={22} fill={NONC.color} stroke={NONC.color} bg="#F3EDF8" opacity={fi(a('nc'))} />
      <Small x={92} y={284} text="enzyme: MODEL · schematic; not a real protein shape" />
      <Enzyme x={EX} y={EY} s={ES} distort={distort} labActive={fi(a('shape'))} labActiveHi={between(a('shape'), a('shape') - 3)}
        labSecond={fi(a('site'))} ringSecond={between(a('site'), a('site') - 2.2) + between(a('nocomp'), a('nocomp') - 3)} />
      {iOn && <Mol x={EX} y={EY} s={ES} kind="noncomp" off={iOff} />}
      {iOn && <Txt x={EX - 60} y={EY + 290} size={21} weight={800} fill={C.primary} anchor="middle" opacity={fi(a('nc'))}>non-competitive inhibitor</Txt>}
      {iOn && <path d={`M${EX - 120} ${EY + 268}L${EX + (SITE.second[0] + (a('iseat') > 0.8 ? 0 : -120)) * ES} ${EY + (SITE.second[1] + (a('iseat') > 0.8 ? 30 : 150)) * ES}`} stroke={C.primary} strokeWidth={2} opacity={fi(a('nc'))} />}
      <Small x={EX + 170} y={EY - 330} text="no longer complementary to the substrate" opacity={between(a('shape') + 0.2 - 3.2, a('iseat'), 0.4) + fi(a('fail') - 1.2) * (1 - fi(a('graph')))} fill={C.primary} />
      {s1 && <Mol x={EX} y={EY} s={ES} kind="substrate" off={s1Off} slide={s1Slide} rot={f > 1.1 && f < 2.6 ? wobble(f - 1.1, 9) : 0} />}
      {crowd}
      {/* substrate does not compete for that site */}
      <g opacity={between(a('nocomp'), a('graph') + 0.6, 0.3)}>
        <MolAt px={EX + bx * ES - 150} py={EY + by * ES + 60} kind="substrate" s={0.6} dash="6 5" />
        <Cross x={EX + bx * ES - 150} y={EY + by * ES + 10} s={12} />
        <Small x={EX + bx * ES - 150} y={EY + by * ES + 130} text="the substrate does not bind here" anchor="middle" />
      </g>
      {s2 && <Mol x={EX} y={EY} s={ES} kind="substrate" off={move(a('back'), 0.9, 330, 0)} />}
      {s2 && a('back') > 0.9 && <BoundTicks x={EX} y={EY} s={ES} />}
      <ActivityArrow x={EX + 170} y={EY + 170} w={170} level={level} opacity={fi(a('iseat') - 1)} />
      <Tag x={EX - 380} y={EY + 250} text="reversible" size={24} fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={fi(a('back'))} />
      <Small x={EX - 380} y={EY + 286} text="the shape returns when the inhibitor leaves" opacity={fi(a('back') + 0.3)} />
      {/* the graph */}
      <g opacity={fi(a('graph'))}>
        <Card x={1060} y={200} w={790} h={720} />
        <Txt x={1085} y={240} size={24} weight={800}>non-competitive</Txt>
        <Tag x={1830} y={240} text="simplified non-competitive model" size={18} anchor="end" fill={NONC.color} stroke={NONC.color} bg="#F3EDF8" />
        <InhAxes g={g} />
        <CurvePath g={g} c={NONE} p={clamp01(a('graph') / 1)} color={NONE.color} width={4.5} />
        <CurvePath g={g} c={NONC} p={clamp01((a('graph') - 1) / 1.4)} color={NONC.color} width={4.5} />
        <Txt x={gx(g, 70)} y={gy(g, 6.6)} size={20} weight={800} fill={NONE.color}>no inhibitor</Txt>
        <Txt x={gx(g, 105)} y={gy(g, 3.6)} size={20} weight={800} fill={NONC.color} opacity={fi(a('graph') - 1.6)}>with non-competitive inhibitor</Txt>
        <VmaxLine g={g} c={NONE} p={clamp01(a('vdec') / 0.8)} noLabel color={C.ink} />
        <VmaxLine g={g} c={NONC} p={clamp01(a('vdec') / 0.8)} noLabel color={NONC.color} />
        <Tag x={g.x + 14} y={gy(g, NONC.vmax) - 16} text="Vmax decreased" size={20} fill={NONC.color} stroke={NONC.color} bg="#F3EDF8" opacity={fi(a('vdec') - 0.6)} />
        <g opacity={fi(a('bracket'))}>
          <path d={`M${gx(g, 228)} ${gy(g, 8)}h14V${gy(g, NONC.vmax)}h-14`} fill="none" stroke={C.primary} strokeWidth={3.5} />
          <Txt x={gx(g, 232)} y={gy(g, 6.2)} size={18} weight={800} fill={C.primary} anchor="end">stays apart</Txt>
        </g>
        <HalfLine g={g} c={NONE} p={clamp01(a('km') / 0.6)} noLabel color={C.ink} />
        <HalfLine g={g} c={NONC} p={clamp01((a('km') - 0.3) / 0.6)} noLabel color={NONC.color} />
        <KmDrop g={g} c={NONE} p={clamp01((a('km') - 0.8) / 0.6)} color={C.ink} />
        <KmDrop g={g} c={NONC} p={clamp01((a('km') - 1.2) / 0.6)} color={NONC.color} label="Km unchanged" size={20} anchor="start" labelDx={-20} />
        <InkRing cx={gx(g, 20)} cy={g.y + g.h + 2} rx={26} ry={22} p={fe(a('same'), 0.6)} color={C.teal} />
        <Txt x={gx(g, 20) + 36} y={g.y + g.h - 12} size={18} weight={800} fill={C.teal} opacity={fi(a('same'))}>same concentration</Txt>
        <Small x={1085} y={890} text="s24_23 Q5(b), MS p.9 · s24_12 Q10, key A (contrast) · our schematic; no values" opacity={fi(a('same'))} />
      </g>
    </g>
  );
}
