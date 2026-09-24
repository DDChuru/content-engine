/** Beat 15 · Recap IN PLACE (no new slide): the one RateGraph with no-inhibitor, competitive and non-competitive
 * curves, each with its own construction; the EnzymeActiveSiteModel with both inhibitor shapes beside their sites;
 * the three-enzyme order strip. Static; key points brighten and fade in in place, on their cues. */
import React from 'react';
import {BRAND as C, clamp01} from '../shared/theme';
import {Txt, InkRing, Tag, Card} from '../shared/Type';
import {fi, fe} from '../util';
import {Axes, VmaxLine, HalfLine, KmDrop, G, gx, gy} from '../RateGraph';
import {Enzyme, Mol} from '../Enzyme';
import {NONE, COMP, NONC, CurvePath} from './inhib';
import {X, Y, Z} from './three';

const g: G = {x: 270, y: 240, w: 820, h: 500, xmax: 240, ymax: 10};
const EX = 1480, EY = 470;
const dim = (on: number) => 0.4 + 0.6 * clamp01(on);
export default function Beat15(s: any) {
  const {a} = s;
  const V = fi(a('v')), H = fi(a('hk')), XL = fi(a('x')), ST = fi(a('strip')), CP = fi(a('comp')), MG = fi(a('merge')), NC = fi(a('nc')), NL = fi(a('nclab')), RV = fi(a('rev'));
  return (
    <g>
      <Axes g={g} xLabel="substrate concentration / mmol dm⁻³" yLabel="initial rate / arbitrary units" hiX={XL} size={21} xLabelDy={30} />
      <CurvePath g={g} c={NONE} color={NONE.color} width={4.5} />
      <CurvePath g={g} c={COMP} color={COMP.color} width={4.5} opacity={dim(CP + MG)} />
      <CurvePath g={g} c={NONC} color={NONC.color} width={4.5} opacity={dim(NC + NL)} />
      <g opacity={dim(V)}>
        <VmaxLine g={g} c={NONE} noLabel color={C.teal} />
        <VmaxLine g={g} c={NONC} noLabel color={NONC.color} />
      </g>
      <g opacity={dim(H)}>
        <HalfLine g={g} c={COMP} noLabel color={C.teal} />
        <HalfLine g={g} c={NONC} noLabel color={NONC.color} />
        <KmDrop g={g} c={NONE} color={C.teal} />
        <KmDrop g={g} c={COMP} color={COMP.color} />
      </g>
      <Txt x={g.x + 14} y={gy(g, 8) - 14} size={21} weight={800} fill={C.teal} opacity={V}>Vmax from the plateau</Txt>
      <Txt x={gx(g, 52)} y={gy(g, 4) + 30} size={20} weight={800} fill={C.teal} opacity={H}>half it, across, down</Txt>
      <Tag x={g.x + g.w} y={g.y + g.h + 106} text="Km: a concentration" size={19} anchor="end" fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={XL} />
      <Txt x={gx(g, 70)} y={gy(g, 6.8)} size={19} weight={800} fill={NONE.color}>no inhibitor</Txt>
      <g opacity={MG}>
        <InkRing cx={gx(g, 190)} cy={gy(g, 7.95)} rx={66} ry={24} p={fe(a('merge'), 0.6)} color={COMP.color} />
        <Txt x={gx(g, 150)} y={gy(g, 6.4)} size={19} weight={800} fill={COMP.color}>competitive: merges at the plateau</Txt>
        <Txt x={gx(g, 150)} y={gy(g, 6.4) + 26} size={18} weight={700} fill={COMP.color}>Vmax unchanged, Km increased</Txt>
      </g>
      <g opacity={NL}>
        <Txt x={gx(g, 130)} y={gy(g, NONC.vmax) + 34} size={19} weight={800} fill={NONC.color}>non-competitive: Vmax decreased,</Txt>
        <Txt x={gx(g, 130)} y={gy(g, NONC.vmax) + 60} size={18} weight={700} fill={NONC.color}>Km unchanged (in this model)</Txt>
      </g>
      {/* the model, both inhibitors beside their sites */}
      <Enzyme x={EX} y={EY} s={0.95} labActive={1} labActiveHi={CP} labSecond={1} secondSmall={false} ringActive={CP * (1 - fi(a('nc')))} ringColor={COMP.color} ringSecond={NC * (1 - fi(a('rev')))} />
      <g opacity={dim(CP)}><Mol x={EX} y={EY} s={0.95} kind="comp" off={80} /></g>
      <g opacity={dim(NC)}><Mol x={EX} y={EY} s={0.95} kind="noncomp" off={60} /></g>
      <Txt x={1850} y={EY - 285} size={19} weight={800} fill={C.primary} anchor="end" opacity={dim(CP)}>competitive inhibitor</Txt>
      <Txt x={1850} y={EY - 259} size={17} weight={700} fill={C.ink} anchor="end" opacity={CP}>in the active site; overcome by substrate</Txt>
      <Txt x={EX - 110} y={EY + 205} size={19} weight={800} fill={C.primary} anchor="middle" opacity={dim(NC)}>non-competitive inhibitor</Txt>
      <Txt x={EX - 110} y={EY + 231} size={17} weight={700} fill={C.ink} anchor="middle" opacity={NC}>another site; the active site changes shape</Txt>
      <Tag x={EX} y={EY + 310} text="both reversible: activity returns when the inhibitor leaves" size={20} anchor="middle" fill={C.teal} stroke={C.teal} bg="#E7F1F5" opacity={dim(RV) * (RV > 0 ? 1 : 0.5)} />
      <Txt x={EX} y={EY - 330} size={16} weight={700} fill={C.muted} anchor="middle">MODEL · schematic; not a real protein shape</Txt>
      {/* the order strip */}
      <g opacity={dim(ST)}>
        <Card x={270} y={870} w={820} h={62} fill={ST > 0 ? '#E7F1F5' : C.white} stroke={ST > 0 ? C.teal : C.line} />
        <Txt x={290} y={910} size={22} weight={800}><tspan fill={X.color}>X (100)</tspan> → <tspan fill={Z.color}>Z (200)</tspan> → <tspan fill={Y.color}>Y (400)</tspan></Txt>
        <Txt x={1070} y={910} size={18} weight={700} fill={C.muted} anchor="end">each Km from its own ½Vmax · highest affinity first</Txt>
      </g>
    </g>
  );
}
