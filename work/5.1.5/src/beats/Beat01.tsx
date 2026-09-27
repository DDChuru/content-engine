/** Beat 1 · Hook and context. A blood vessel with red blood cells flowing; one lifted into a magnifier (no nucleus; a
 * struck division icon); a worn-out cell leaves and a new one arrives; a skin strip slides in: surface cells flake away
 * and a graze removes a notch; "where do the new cells come from?"; dim, dissolve. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Vessel, RBC} from '../StemCellLineage';
import {SkinStrip} from '../ContextStrip';
import {fi, fe, lerp} from '../util';
import {Caption} from './kit';

export default function Beat01(s: any) {
  const a = s.a, L = s.local;
  const skinIn = fe(a('skin'), 1.0);
  const VX1 = lerp(1840, 1000, skinIn);
  const worn = a('worn'), wornU = fe(worn, 3.0);
  const lost = a('lost') >= 0, graze = a('graze') >= 0;
  const dim = 1 - 0.45 * fi(a('q') - 1.2, 1.0);
  return (
    <g>
      <Caption x={90} y={250} size={30} maxW={1600} text="Ever wondered where your new red blood cells come from, when a mature human red blood cell has no nucleus and cannot divide?" />
      <g opacity={dim}>
        <Vessel x0={90} x1={VX1} y={590} h={170} t={L} n={9} skip={a('nonuc') >= 0 ? 4 : -1} />
        <Txt x={100} y={700} size={15} weight={600} fill={C.muted} italic>blood vessel, cut open lengthways (schematic)</Txt>
        {a('nonuc') >= 0 && <g opacity={fi(a('nonuc'), 0.5)}>
          <circle data-role="decor" cx={560} cy={400} r={78} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={3} />
          <RBC x={560} y={400} r={48} />
          <Tag x={440} y={512} text="mature human red blood cell: no nucleus" size={19} />
          <g data-role="decor">
            <circle cx={700} cy={400} r={20} fill="none" stroke={T5.ringHalo} strokeWidth={3} />
            <path d="M726 400H746M740 394L748 400L740 406" stroke={T5.ringHalo} strokeWidth={3} fill="none" />
            <circle cx={770} cy={388} r={12} fill="none" stroke={T5.ringHalo} strokeWidth={3} /><circle cx={770} cy={414} r={12} fill="none" stroke={T5.ringHalo} strokeWidth={3} />
            <path d="M684 430L786 370" stroke={T5.ringHalo} strokeWidth={5} />
          </g>
          <Tag x={690} y={452} text="cannot divide" size={19} />
        </g>}
        {worn >= 0 && <g>
          <g opacity={1 - wornU}><RBC x={lerp(760, 820, wornU)} y={lerp(620, 740, wornU)} r={34} pale={1} /></g>
          {wornU < 1 && <Tag x={790} y={782} text="worn out" size={18} opacity={fi(worn, 0.3) * (1 - fi(worn - 3.2, 0.4))} />}
          <RBC x={lerp(40, 260, fe(worn - 0.5, 2.5))} y={560} r={34} op={fi(worn - 0.5, 0.4)} />
          <Tag x={150} y={500} text="replacement" size={18} opacity={fi(worn - 0.6, 0.3) * (1 - fi(worn - 3.4, 0.4))} />
        </g>}
        {skinIn > 0 && <g opacity={skinIn} transform={`translate(${lerp(300, 0, skinIn)} 0)`}>
          <rect data-role="decor" x={1060} y={330} width={790} height={500} rx={16} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
          <Txt x={1080} y={366} size={22} weight={800} fill={T5.ringHalo}>outer layer of skin (schematic)</Txt>
          <SkinStrip x={1090} y={420} w={730} h={360} cols={10} t={lost ? (a('lost')) * 0.3 : 0} shed={lost ? 1 : 0} gap={graze ? [4, 6] : null} fill={graze ? 1 - fe(a('graze'), 0.8) : 1} diff={1} />
          {graze && <Tag x={1440} y={404} text="a graze" size={18} opacity={fi(a('graze'), 0.4)} />}
        </g>}
      </g>
      {a('q') >= 0 && <Tag x={700} y={880} text="where do the new cells come from?" size={30} opacity={fi(a('q'), 0.4)} />}
    </g>
  );
}
