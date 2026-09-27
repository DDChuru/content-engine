/** Beat 7 · Replacement and repair. Panel 2: surface cells shed from the skin and the small-intestine lining while cells
 * made by division below move up; set cards beside the newly formed daughter cells in the lower layer (never in a shed
 * cell). Panel 3: a cut closes as edge cells divide and move in; some daughter cells flatten (differentiate); same genes,
 * different type; a specialised cell no longer divides; a SEPARATE inset of an already mature human red blood cell (no
 * nucleus from its first frame, no extrusion); which cells divide? → 5.1.5. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {SetCard, RBCInset, SET_NOTE, DivGlyph} from '../ContextStrip';
import {Ring, Leader, Label} from '../T5Annot';
import {fi, fe, pulse, lerp} from '../util';
import {Panel, rects, mixR, ChainThumb, EXCERPT, toPage} from './strip';

export default function Beat07(s: any) {
  const a = s.a, L = s.local;
  const f01 = mixR(rects('focus', 0, 540, 940), rects('focus', 1, 540, 940), fe(a('open'), 1.0));
  const R = a('repair') < 0 ? f01 : mixR(rects('focus', 1, 540, 940), rects('focus', 2, 540, 940), fe(a('repair'), 1.0));
  const tRep = a('lost') >= 0 ? (a('lost')) * 0.2 : 0;
  const fill = a('close') >= 0 ? fe(a('close'), 4.2) : 0;
  const diff = a('diff') >= 0 ? fe(a('diff'), 2.2) : 0;
  const st = [
    {elong: 1, div: 0, grow: 1}, {t: tRep, shed: a('lost') >= 0 ? 1 : 0, labels: fi(a('skin'), 0.4), divU: a('repl') >= 0 && a('repair') < 0 ? (a('repl') / 2.2) % 1 : 0},
    {t: a('repair') >= 0 ? 0.3 + (a('repair')) * 0.05 : 0.3, fill, diff, shed: 0, divU: a('close') >= 0 && fill < 1 ? (a('close') / 1.6) % 1 : 0}, {runner: 1, roots: 1, leaf: 1},
  ];
  const act = a('repair') >= 0 ? 2 : 1;
  const r2 = R[1], r3 = R[2];
  const rep = a('repair') < 0;
  // page points in panel 2 (skin strip: x 30, w 540, cols 8, basal row) and panel 3 (repair strip: 9 cols, gap 3–5)
  const baseP = toPage(r2, 30 + 67.5 * 3.5, 20 + 180 - 23), upP = toPage(r2, 30 + 67.5 * 3.5, 20 + 180 - 23 - 42 * 0.92 * 1.2);
  const g1 = toPage(r3, 30 + 60 * 4.5, 303 - 48.8 * 0.92 * 1), g2 = toPage(r3, 30 + 60 * 3.5, 303 - 48.8 * 0.92 * 2.6);
  const cardOp = rep ? fi(a('cards'), 0.5) : 0;
  const ring = (p: number[], age: number, k: string) => <Ring key={k} cx={p[0]} cy={p[1]} rx={34} ry={26} p={fe(age, 0.5)} />;
  return (
    <g>
      <ChainThumb x={70} y={196} sc={0.44} />
      {[0, 1, 2, 3].map((k) => <Panel key={k} k={k} r={R[k]} st={st[k]} lit={k === act ? 1 : 0} dim={k === act ? 0 : 0.35} note={(k === 1 && cardOp > 0) || (k === 2 && a('genes') >= 0) ? 1 : 0}>
        {k === 1 && a('repl') >= 0 && <Tag x={300} y={236} text="typical: continually replaced" size={20} opacity={fi(a('repl'), 0.4)} />}
        {k === 2 && a('diff') >= 0 && <Tag x={40} y={70} text="daughter cells differentiate where needed" size={20} opacity={fi(a('diff'), 0.4)} />}
      </Panel>)}
      {cardOp > 0 && <g opacity={cardOp}>
        <SetCard x={r2.x + 14} y={r2.y + 60} s={0.62} kind="rod" tag="dividing cell" glow={pulse(a('cards'), 1.4)} />
        <Leader x1={r2.x + 130} y1={r2.y + 150} x2={baseP[0]} y2={baseP[1]} />
        <SetCard x={r2.x + r2.w - 134} y={r2.y + 60} s={0.62} kind="rod" tag="new daughter cell" glow={pulse(a('cards'), 1.4)} />
        <Leader x1={r2.x + r2.w - 80} y1={r2.y + 150} x2={upP[0] + 14} y2={upP[1]} />
        <Txt x={r2.x + r2.w / 2} y={r2.y + 30} size={16} weight={700} fill={T5.ringHalo} anchor="middle">same set · same information when the daughter cells form</Txt>
      </g>}
      {a('genes') >= 0 && <g>
        {ring(g1, a('genes'), 'a')}{ring(g2, a('genes') - 0.3, 'b')}
        <SetCard x={r3.x + 14} y={r3.y + 60} s={0.55} kind="rod" op={fi(a('genes'), 0.4)} />
        <SetCard x={r3.x + r3.w - 120} y={r3.y + 60} s={0.55} kind="rod" op={fi(a('genes'), 0.4)} />
        <Leader x1={r3.x + 118} y1={r3.y + 110} x2={g2[0] - 30} y2={g2[1]} opacity={fi(a('genes'), 0.4)} />
        <Leader x1={r3.x + r3.w - 116} y1={r3.y + 110} x2={g1[0] + 30} y2={g1[1]} opacity={fi(a('genes'), 0.4)} />
        <Tag x={r3.x + r3.w / 2 - 170} y={r3.y + r3.h - 34} text="same genes, different specialised type" size={19} opacity={fi(a('genes'), 0.4)} />
      </g>}
      {a('stop') >= 0 && <g opacity={fi(a('stop'), 0.4)}>
        <g opacity={0.5}><DivGlyph x={g2[0] + 60} y={g2[1] - 40} size={0.06} u={0} /></g>
        <path data-role="decor" d={`M${g2[0] + 40} ${g2[1] - 60}L${g2[0] + 80} ${g2[1] - 20}`} stroke={T5.ringHalo} strokeWidth={4} />
        <Tag x={g2[0] + 92} y={g2[1] - 32} text="specialised: no longer dividing" size={18} />
      </g>}
      {a('rbc') >= 0 && <g opacity={fi(a('rbc'), 0.5)}>
        <RBCInset x={1480} y={330} r={92} />
        <Txt x={1480} y={450} size={19} weight={800} fill={T5.ringHalo} anchor="middle">mature human red blood cell: no nucleus; cannot divide</Txt>
        <Txt x={1480} y={474} size={15} weight={600} fill={C.muted} anchor="middle" italic>separate example; not part of the skin</Txt>
      </g>}
      {a('which') >= 0 && <g>
        {[1.5, 7.5].map((j, i) => { const p = toPage(r3, 30 + 60 * j, 303); return <Ring key={i} cx={p[0]} cy={p[1]} rx={34} ry={28} p={fe(a('which') - 0.2 * i, 0.5)} />; })}
        <Tag x={toPage(r3, 30, 303)[0]} y={toPage(r3, 30, 360)[1]} text="?" size={24} opacity={fi(a('which'), 0.3)} />
      </g>}
      {a('next') >= 0 && <Tag x={1480} y={520} text="next: 5.1.5 stem cells" size={22} opacity={fi(a('next'), 0.4)} />}
      {((a('repl') >= 0 && a('repair') < 0) || (a('close') >= 0 && fill < 1)) && <Txt x={70} y={950} size={15} weight={600} fill={C.muted} italic>{EXCERPT}</Txt>}
      {a('repair') >= 0 && a('which') < 0 && <Tag x={900} y={214} text="repair: replacement after damage" size={22} opacity={fi(a('repair'), 0.4)} />}
      {a('repair') < 0 && <Tag x={900} y={214} text="replacement" size={22} />}
    </g>
  );
}
