/** Hook: four identical colourless tubes; nothing distinguishes them; a Paper 3 bench; a dropper
 * gives tube 2 the conditions and a MODEL swatch flashes blue → brick-red, then hides. */
import React from 'react';
import {BRAND as C, clamp01} from '../../../shared/src/theme';
import {Txt, Tag} from '../../../shared/src/Type';
import {Swatch} from '../../../shared/src/Swatch';
import {Tube, Rack, Bottle, Dropper, BeakerBath} from '../Apparatus';
import {fi, fe, wobble, move} from '../util';

const TX = [735, 885, 1035, 1185];
export default function Beat01(s: any) {
  const {a, local, sc} = s;
  const wob = [a('w1'), a('w2'), a('w3'), a('w4')].map((x) => wobble(x, 8));
  const bench = fi(a('bench'), 0.8);
  const dropX = TX[1];
  const dropY = move(a('dropper'), 1.4, 230, 398); // tip stays above the rim (430)
  const flash = a('flash');
  const end = sc.duration;
  const hideSw = clamp01((end - 0.35 - local) / 0.35);
  return (
    <g>
      {/* bench strip */}
      <path d="M90 822H1830L1880 900H40Z" fill="#E6DAC2" stroke="#C4B394" strokeWidth={3} />
      {/* Paper 3 bench context behind */}
      <g opacity={bench}>
        <Bottle x={200} y={826} s={0.8} name="reagent" k="clear" />
        <Bottle x={320} y={826} s={0.8} name="reagent" k="clear" />
        <Bottle x={440} y={826} s={0.8} name="reagent" k="clear" />
        <BeakerBath x={1630} y={826} s={0.78} flame={1} reading="" />
        <Tag x={1630} y={872} text="Paper 3 bench" size={24} anchor="middle" fill={C.primary} />
        <Tag x={320} y={600} text="labelled bottles" size={20} anchor="middle" />
        <Tag x={1470} y={560} text="water bath" size={20} anchor="middle" />
      </g>
      <Rack x={960} y={540} w={620} h={262}>
        {TX.map((x, i) => (
          <Tube key={i} id={'h' + i} x={x} y={430} h={330} w={74} level={0.46} k="colourless" rot={wob[i]}
            label={fi(a('rack')) > 0.5 ? String(i + 1) : undefined} pill={false} />
        ))}
      </Rack>
      <g opacity={fi(a('rack'))}>
        {TX.map((x, i) => <Tag key={i} x={x} y={872} text="colourless" size={17} anchor="middle" />)}
        <Txt x={960} y={930} size={17} anchor="middle" weight={700} fill={C.muted}>MODEL · empty outline = clear / colourless</Txt>
      </g>
      {/* what they are said to contain, never which is which */}
      {[['w1', 'water'], ['w2', 'sugar'], ['w3', 'protein'], ['w4', 'starch']].map(([k, t], i) => (
        <Tag key={k} x={110 + i * 160} y={262} text={t} size={24} opacity={fi(a(k))} />
      ))}
      <Txt x={110} y={316} size={22} weight={700} fill={C.muted} opacity={fi(a('w4'))}>one in each tube — but which is which?</Txt>
      {/* eye + question */}
      <g opacity={fi(a('eye'))} transform="translate(1560 300)">
        <path d="M-80 0Q0-62 80 0Q0 62-80 0Z" fill="#FFFFFF" stroke={C.ink} strokeWidth={5} />
        <circle r={26} fill={C.ink} /><circle cx={8} cy={-8} r={7} fill="#FFFFFF" />
        <Txt x={112} y={22} size={78} weight={800} fill={C.primary}>?</Txt>
        <Txt x={0} y={100} size={22} anchor="middle" weight={700} fill={C.muted}>looking cannot tell them apart</Txt>
      </g>
      {/* conditions: dropper to tube 2, then a MODEL swatch flash */}
      <g opacity={fi(a('dropper'))}>
        <Dropper x={dropX} y={dropY} s={0.9} squeeze={flash > 0 ? clamp01(flash / 0.3) : 0} drop={flash > 0 ? clamp01(flash / 0.5) : 0} dropK="blue" fall={(611 - 398) / 0.9 - 6} />
        <Tag x={dropX + 36} y={dropY - 120} text="conditions" size={21} fill={C.primary} />
      </g>
      {flash > 0 && (
        <g opacity={hideSw}>
          <Swatch x={250} y={400} w={300} h={86} k="blue" to="brickred" t={flash >= 0.7 ? 1 : 0} />
          <Txt x={400} y={384} size={21} anchor="middle" weight={700} fill={C.muted}>a visible change (model)</Txt>
          <path d="M555 443Q700 443 840 470" fill="none" stroke={C.primary} strokeWidth={4} />
        </g>
      )}
    </g>
  );
}
