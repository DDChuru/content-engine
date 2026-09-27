/** Beat 1 · Hook and context. C1 rod (unreplicated-condensed); two tissue strips (gut lining, skin base layer) with a
 * top cell lost and a base cell dividing (motion); a small wheel whose marker runs once (S glows); the hook magnifier on
 * one grey tip: a copy grows and stops just short (the telomere model's motion contract in miniature). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, chromGeom} from '../ChromosomeModel';
import {CellCycleWheel, ARCS} from '../CellCycleWheel';
import {TelomereEndModel} from '../TelomereEndModel';
import {Ring} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {Caption, INK} from './kit';
import {Captions} from './tel';

const f1 = (v: number) => v.toFixed(1);
function Strip({x, y, a, label, lab}: any) {
  const pinch = fe(a - 0.2, 1.3), up = fe(a - 1.6, 1.2), drift = fe(a, 2.2);
  const cells: any[] = [];
  for (let j = 0; j < 5; j++) {
    cells.push(<rect key={'b' + j} x={f1(x + j * 92)} y={f1(y + 70)} width={88} height={64} rx={8} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />);
    if (j !== 2) cells.push(<rect key={'t' + j} x={f1(x + j * 92)} y={f1(y)} width={88} height={64} rx={8} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />);
  }
  // the top cell of column 2 detaches and drifts off; the base cell below divides by a simple pinch-in; the new cell moves up
  cells.push(<rect key="top" x={f1(x + 2 * 92 + drift * 40)} y={f1(y - drift * 70)} width={88} height={64} rx={8} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} opacity={1 - drift} />);
  if (pinch > 0 && pinch < 1) cells.push(<path key="w" d={`M${f1(x + 184)} ${f1(y + 102)}h${f1(22 * pinch)}M${f1(x + 272)} ${f1(y + 102)}h${f1(-22 * pinch)}`} stroke={T5.membrane} strokeWidth={3} />);
  if (pinch >= 1) cells.push(<rect key="new" x={f1(x + 184)} y={f1(lerp(y + 70, y, up))} width={88} height={64} rx={8} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2} />);
  return (
    <g>
      <g data-role="drawing">{cells}</g>
      <Txt x={x} y={y + 164} size={20} weight={800} fill={INK} opacity={lab}>{label}</Txt>
    </g>
  );
}
export default function Beat01(s: any) {
  const a = s.a;
  const toCorner = fe(a('strips'), 1.0) * (1 - fe(a('mag'), 1.0));
  const R: any = {x: lerp(960, 230, toCorner), y: lerp(580, 420, toCorner), id: 'C1', cond: 1, rep: -1, scale: lerp(2.0, 0.9, toCorner), hiGene: pulse(a('ends'), 1.4)};
  const G = chromGeom(R).sides[0];
  const stripsO = fi(a('strips'), 0.5) * (1 - fi(a('mag'), 0.5));
  const wheelA = a('copied'), pos = wheelA < 0 ? 0 : fe(wheelA, 2.2);
  const magO = fi(a('mag') - 0.4, 0.5);
  const tip = G.top;                                         // the upper grey tip
  const MX = 1380, MY = 560, MR = 190;
  const grow = fe(a('short'), 1.4);
  return (
    <g>
      <Caption x={70} y={236} size={30} maxW={1760} text="Ever wondered how a chromosome can be copied again and again without losing the genes near its ends?" opacity={fi(a('open') + 0.5, 0.5)} />
      <Chromosome {...R} />
      <Txt x={R.x} y={R.y + 250 * R.scale / 2 + 40} size={20} weight={600} fill={C.muted} italic anchor="middle">schematic</Txt>
      {toCorner < 0.2 && <><Ring cx={G.top[0]} cy={G.top[1] + 6} rx={34} ry={30} p={fe(a('ends'), 0.6)} opacity={1 - fi(a('strips'), 0.3)} />
        <Ring cx={G.bottom[0]} cy={G.bottom[1] - 6} rx={34} ry={30} p={fe(a('ends') - 0.3, 0.6)} opacity={1 - fi(a('strips'), 0.3)} /></>}
      {stripsO > 0 && <g opacity={stripsO < 1 ? stripsO : undefined}>
        <Strip x={420} y={560} a={a('replace')} label="gut lining" lab={fi(a('gut'), 0.4)} />
        <Strip x={960} y={560} a={a('replace') - 0.3} label="skin: base layer" lab={fi(a('skin'), 0.4)} />
        <Txt x={420} y={520} size={16} weight={600} fill={C.muted} italic>schematic</Txt>
        <g opacity={fi(a('copied'), 0.4)}>
          <CellCycleWheel cx={1640} cy={560} R={95} thick={30} small labels={{g1: 1, s: 1, g2: 1, m: 1, c: 1}} marker={1} pos={pos} lit={{s: pos > ARCS.s[0] ? 1 : 0}} />
          <Tag x={1640} y={720} text="DNA copied" size={18} anchor="middle" opacity={fi(a('copied') - 0.8, 0.4)} />
        </g>
      </g>}
      {magO > 0 && <g opacity={magO < 1 ? magO : undefined}>
        <line data-role="decor" x1={tip[0] + 16} y1={tip[1]} x2={MX - MR * 0.7} y2={MY - MR * 0.7} stroke={T5.ringHalo} strokeWidth={2} />
        <defs><clipPath id="magclip"><circle cx={MX} cy={MY} r={MR - 4} /></clipPath></defs>
        <g data-role="drawing"><circle cx={MX} cy={MY} r={MR} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={4} /></g>
        <g clipPath="url(#magclip)">
          <TelomereEndModel x={MX - 700} y={MY - 30} len={860} amp={10} copyGap={56} grow={grow} stop={0.93} />
        </g>
        <Tag x={MX} y={MY - MR - 22} text="typical dividing body cells" size={18} anchor="middle" />
        <Tag x={MX + MR - 30} y={MY + 60} text="round 1" size={17} opacity={fi(a('short'), 0.3)} />
        {/* run 009f: the model's persistent notes (shortening caption, endpoint comparison while copying, grey-block note) */}
        <Captions x={1040} y={MY + MR + 34} w={800} opacity={fi(a('short'), 0.4)} />
        <Tag x={560} y={800} text="so what protects the genes?" size={26} opacity={fi(a('q'), 0.4)} />
      </g>}
    </g>
  );
}
