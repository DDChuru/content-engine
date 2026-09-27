/** Beat 4 · G1: growth, one DNA molecule. Inset opens (unreplicated-extended); the cell outline grows; Z1 magnifier;
 * the graph slides in and the pen, linked to the marker, draws the flat G1 trace at 1; count strip (whole cell 4 · 4). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {HistoneFiber} from '../ChromosomeModel';
import {Label} from '../T5Annot';
import {fi, fe, lerp, between} from '../util';
import {Stage, W, ALL} from './stage';

export default function Beat04(s: any) {
  const a = s.a;
  const pen = a('flat1') < 0 ? 0 : 0.34 * fe(a('flat1'), 2.8);
  const pos = a('g1') < 0 ? 0 : Math.max(lerp(0, 0.03, fe(a('g1'), 1.5)), pen);
  const graphIn = fe(a('graph'), 0.8);
  const strip = a('flat1') >= 0;
  return (
    <Stage
      wheel={{labels: ALL, bracket: 1, caption: 1, marker: 1, pos, long: {g1: fi(a('g1'), 0.3)},
        inset: {on: fi(s.local, 0.5), nucleus: 1, cell: 1, cellGrow: fe(a('prot'), 3), rep: -1, cond: 0, ripple: a('thin') < 0 ? 0 : Math.min(2, a('thin') / 1.2)}}}
      graph={graphIn > 0 ? {pen, opacity: graphIn, y: lerp(310, 250, graphIn) as any} as any : null}   // run 009g: slides up into place (the old slide from x 1100 put its right-hand text off the frame)
      rows={strip ? [{chrom: 4, dna: 4, comp: 'whole cell'}] : undefined}
      human={strip ? 'typical diploid human somatic cell: whole cell 46 chromosomes · 46 DNA molecules' : undefined}
      stripOp={fi(a('flat1'), 0.4)}
      insetCount="this chromosome: 1 chromosome · 1 DNA molecule">
      <Label x={W.cx} y={W.cy + 118} text="chromosome" size={20} anchor="middle" opacity={fi(s.local - 0.4, 0.4)} />
      <Tag x={W.cx} y={W.cy - 128} text="recall: 5.1.1" size={20} anchor="middle" opacity={fi(s.local, 0.4)} bg="#FFF3EC" />
      <Tag x={690} y={430} text="proteins · organelles" size={20} opacity={fi(a('prot'), 0.4)} />
      {/* light-microscope silhouette icon with a blurred field */}
      <g opacity={fi(a('fine'), 0.4)}>
        <g data-role="drawing" transform="translate(40 180)">
          <path d="M700 640L730 580L748 588L720 648Z M708 652H770 M740 652V690 M715 690H780" fill="none" stroke={T5.ringHalo} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={800} cy={600} r={30} fill="#F2F2EC" stroke={T5.ringHalo} strokeWidth={3} />
          <circle cx={795} cy={598} r={18} fill="#6E7390" opacity={0.2} /><circle cx={806} cy={604} r={14} fill="#6E7390" opacity={0.2} />
        </g>
        <Tag x={800} y={915} text="not individually visible" size={20} anchor="middle" />
      </g>
      {/* Z1 magnifier opens on the thread, then closes */}
      {between(a('z1'), a('z1') - 4.2) > 0 && <g opacity={between(a('z1'), a('z1') - 4.2)}>
        {/* run 009f: the magnifier sits clear of the wheel (it covered the G1 label) with a leader to the thread */}
        <line data-role="decor" x1={958} y1={392} x2={W.cx + 8} y2={W.cy - 40} stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="6 5" />
        <rect data-role="decor" x={960} y={310} width={360} height={170} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} />
        <g transform="translate(980 395) scale(0.36)"><HistoneFiber x={0} y={0} beads={5} gap={165} r={36} lead={90} /></g>
        <Txt x={980} y={342} size={21} weight={800} fill={T5.ringHalo}>DNA</Txt>
        <Txt x={980} y={466} size={21} weight={800} fill={T5.ringHalo}>histone proteins</Txt>
      </g>}
    </Stage>
  );
}
