import React from 'react';
import {fi, fe, pulse} from '../util';
import {gt, Lbl, Pill, Scene, exoAge, SS, C, Txt, Cite, SCHEM} from '../kit';
import {ExocytosisInset} from '../VesicleTransport';
import {InkRing} from '../../shared/src/Type';

/** Beat 3 · Stage one, secretion: insulin (our example) in vesicles in a pancreatic beta cell; one vesicle performs
 * exocytosis (membrane-scale inset and whole-cell scale together; continuous leaflets; energy from ATP tag). */
export default function Beat03(s: any) {
  const t = gt(s), a = s.a, z = 1 + 0.3 * fe(a('open'), 1.2);
  const age = exoAge(a);
  const inset = fe(a('vesicles') - 0.6, 0.6);
  const B = SS.beta, zx = 380, zy = 232, Z = (x: number, y: number) => [zx + (x - zx) * z, zy + (y - zy) * z];
  const ves = [[470, 370], [430, 500], [260, 360], [230, 460], [485, 440], [330, 318], [385, 522], [292, 522]].map(([x, y]) => Z(x, y));
  const edge = Z(B.x + B.rx - 2, B.y - 20);
  return (
    <g>
      <Scene z={z} zx={zx} zy={zy} t={t} secrete={age} stage={{secretion: fi(a('open'), 0.4)}} labels={{beta: fi(a('beta'), 0.4)}} labelOf={{response: 1 - fi(a('open'), 0.2), schematic: 1 - fi(a('open'), 0.2)}} />
      <InkRing cx={ves[1][0]} cy={ves[1][1]} rx={40} ry={36} p={fe(a('ligand'), 0.5)} opacity={1 - fe(a('beta'), 0.5)} />
      <Lbl x={90} y={Z(0, B.y + B.ry)[1] + 24} text="ligand: a specific chemical released as a signal" o={fi(a('ligand'), 0.4) * (1 - fe(a('vesicles'), 0.5))} size={21} fill="#7D1F5A" lx={ves[1][0]} ly={ves[1][1] + 30} />
      <Txt x={Z(B.x, 0)[0]} y={Z(0, B.y + B.ry)[1] + 81} size={20} weight={600} fill={C.muted} anchor="middle" italic opacity={fi(a('beta'), 0.4)}>our example: insulin, a peptide hormone</Txt>
      {[0, 2, 3, 4, 5, 6, 7].map((i, k) => <InkRing key={i} cx={ves[i][0]} cy={ves[i][1]} rx={38} ry={38} p={fe(a('vesicles') - k * 0.12, 0.4)} opacity={1 - fe(a('vesicles') - 2.0, 0.5)} color={C.teal} />)}
      <Lbl x={Z(B.x, 0)[0]} y={Z(0, B.y + B.ry)[1] + 113} text="vesicles containing insulin" anchor="middle" o={fi(a('vesicles'), 0.4)} size={22} fill={C.teal} />
      {/* membrane-scale close-up of the same event */}
      {inset > 0 && <g opacity={inset}>
        <ExocytosisInset x={1150} y={330} w={660} h={420} age={age} t={t} />
        <g opacity={fi(a('vesicles') - 1.2, 0.3)}>
          <Txt x={1170} y={372} size={20} weight={700} fill={C.teal}>outside the cell: tissue fluid</Txt>
          <Txt x={1170} y={732} size={20} weight={700} fill={C.teal}>cytoplasm</Txt>
          <Txt x={1790} y={400} size={20} weight={600} fill={C.muted} anchor="end" italic>close-up: vesicle and cell surface membrane</Txt>
        </g>
        <path data-role="decor" d={`M${edge[0] + 10} ${edge[1]}L1150 540`} stroke={C.muted} strokeWidth={1.5} strokeDasharray="6 5" />
      </g>}
      {inset > 0 && <rect data-role="decor" x={1150} y={756} width={660} height={176} rx={12} fill="#F6EFE0" opacity={inset} />}
      <Cite x={1796} y={782} text={SCHEM} anchor="end" opacity={fi(a('vesicles') - 1.2, 0.3)} />
      <Pill x={1480} y={814} text="membranes fuse" anchor="middle" o={fi(a('fuse'), 0.4)} fill="#7A5C8E" />
      <Lbl x={edge[0] + 30} y={edge[1] - 70} text="tissue fluid" o={fi(a('release'), 0.4)} size={22} fill="#8A6414" />
      <Lbl x={1480} y={860} text="exocytosis" anchor="middle" o={fi(a('exo'), 0.4)} size={30} fill={C.primary} />
      <Pill x={1640} y={858} text="energy from ATP" o={fi(a('exo') - 0.3, 0.4)} bg="#FCEFC4" stroke="#8A6414" fill="#4A3608" />
      <Txt x={1480} y={912} size={20} weight={600} fill={C.muted} italic anchor="middle" opacity={fi(a('bound'), 0.4)}>this example's secretion mechanism; not how every ligand is released</Txt>
    </g>
  );
}
