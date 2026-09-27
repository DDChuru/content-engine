/** Beat 9 · How it is asked, and the reject card. Forms at left, each with its labelled sufficient answer shown first;
 * the familiar tissue layout at right from the first frame; ONE authored reject card; the healthy skin and level pans on a
 * panel labelled "beyond the mark scheme"; final 2 s hold. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Pile, Balance} from '../TissueGrowthModel';
import {fi, fe, pulse} from '../util';
import {FormRow, formRowH, RejectCard, wrap} from './kit';

export default function Beat09(s: any) {
  const a = s.a, L = s.local;
  const FX = 70, FW = 820;
  const T1 = 'explain the consequences of a supplied mutation', c1 = 'w20_21 Q6(a)(i), QP p15 / MS p12, 2 marks, any two credited points; our framing of the question; PDF-VERIFIED (round-1 check)';
  const T2 = 'why supplied CDK inhibitors can treat a cancerous tumour', c2 = 's24_23 Q5(d), QP p13 / MS p10, 2 marks; our framing; PDF-VERIFIED (round-1 check)';
  const A1 = 'Loss of cell-cycle control allows uncontrolled division, producing a mass of abnormal cells.';
  const A2 = 'The inhibitor stops the cell cycle before cell division, preventing uncontrolled division from increasing tumour size.';
  const y1 = 214, h1 = formRowH(c1, FW, T1), a1h = 40 + wrap(A1, 20, FW - 40, 700).length * 26;
  const y2 = y1 + h1 + a1h + 30, h2 = formRowH(c2, FW, T2);
  const ans = (y: number, lbl: string, t: string, k: string) => a(k) >= 0 ? <g opacity={fi(a(k) - 0.4, 0.4)}>
    <rect data-role="decor" x={FX} y={y} width={FW} height={30 + wrap(t, 20, FW - 40, 700).length * 26} rx={10} fill="#F2FAF5" stroke={C.greenDark} strokeWidth={1.5} />
    <Txt x={FX + 16} y={y + 22} size={14} weight={700} fill={C.greenDark} italic>{lbl}, sufficient answer · two marks{k === 'r1' ? ', any two credited points' : ''}</Txt>
    {wrap(t, 20, FW - 40, 700).map((l, i) => <Txt key={i} x={FX + 16} y={y + 46 + i * 26} size={20} weight={700} fill={C.greenDark}>{l}</Txt>)}
  </g> : null;
  const TR = {x: 960, y: 230, w: 880, h: 200, cols: 9, hc: 150};
  const G = tGeom(TR as any);
  const bm = a('beyond') >= 0;
  return (
    <g>
      <Tissue {...TR} t={L * 0.16} shed={1} vesselT={L} />
      <Pile cx={G.colX(4)} bm={G.bm} n={14} r={17} invade={0.4} />
      {pulse(a('r1'), 1.6) > 0 && <rect data-role="decor" x={TR.x - 6} y={TR.y - 6} width={TR.w + 12} height={TR.h + 12} rx={12} fill="none" stroke={T5.ring} strokeWidth={4} opacity={pulse(a('r1'), 1.6)} />}
      <FormRow x={FX} y={y1} w={FW} title={T1} cite={c1} a={a('r1')} />
      {ans(y1 + h1 + 8, 'W20/21 Q6(a)(i)', A1, 'r1')}
      <FormRow x={FX} y={y2} w={FW} title={T2} cite={c2} a={a('r2')} />
      {ans(y2 + h2 + 8, 'S24/23 Q5(d)', A2, 'r2')}
      {a('work') >= 0 && <Txt x={FX} y={y2 + h2 + 120} size={16} weight={600} fill={C.muted} italic opacity={fi(a('work'), 0.4)}>the supplied information is the context; inhibitor names are not recall</Txt>}
      <RejectCard x={960} y={620} w={880} wrong="A tumour is a cancer." right="A tumour may be benign or malignant; a malignant tumour is a cancer." a={a('reject')} strikeAt={0.6} rightAt={1.2} />
      {bm && <g opacity={fi(a('beyond'), 0.4)}>
        <rect data-role="decor" x={62} y={760} width={836} height={180} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="8 6" />
        <Tag x={74} y={762} text="beyond the mark scheme" size={17} />
        <Tissue x={90} y={790} w={480} h={100} cols={6} hc={40} t={L * 0.2} shed={1} />
        <Balance x={740} y={800} tilt={0} s={0.55} hi={a('end') >= 0 ? Math.max(0.5, pulse(a('end'), 1.4)) : 0} />
        <Txt x={90} y={932} size={14} weight={600} fill={C.muted} italic>healthy adult skin: cell production balances cell loss</Txt>
      </g>}
    </g>
  );
}
