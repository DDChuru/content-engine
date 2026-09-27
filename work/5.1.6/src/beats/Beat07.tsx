/** Beat 7 · E5-07 (EXAM CONTRAST). Five moves: announce (badge; basis line) → the written answer (our composite) → 4 s
 * silent read → talk-through (underline on "mitosis"; credited-answer summary beside the header; a beyond-the-mark-scheme
 * panel with the healthy tissue; ring on "because" and "no cause given"; a caret "loss of control?"; "has mutated"
 * underlined as supplied context; the three consequences ticked as spoken; the MS tab; the not-required tab and G05's
 * check) → the card struck and rewritten in place; the marker clears on the completed correct frame (clearKey 'done'). */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt, Tag, InkRing, Underline, textW} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Tissue, tGeom, Pile, Balance} from '../TissueGrowthModel';
import {Tick} from '../T5Annot';
import {fi, fe, pulse} from '../util';
import {QHeader, qHeaderH, Written, span, SideNote, QuoteTab, quoteH, Strike, GOOD} from '../Panels';
import {Caption, typed, wrap} from './kit';

const WRONG = 'A tumour forms because the cells divide by mitosis.';
const RIGHT = 'The mutation causes loss of control of the cell cycle, so the cell divides repeatedly by mitosis without control, producing a mass of abnormal cells — a tumour.';
const HEADER = 'A gene that controls cell division has mutated in a cell.\nExplain how this can lead to the formation of a tumour.';
const HSRC = 'our framing of W20/21 Q6(a)(i); the paper’s own stem asks candidates to outline (QP p15, PDF-VERIFIED (round-1 check))';
export default function Beat07(s: any) {
  const a = s.a, L = s.local;
  const PX = 800, PW = 1050;
  const hy = 262, hh = qHeaderH(HEADER, HSRC, 25);
  const cy = hy + hh + 60, WS = 30, cx0 = PX + 22, ly = cy + 44;
  const fix = a('fix') >= 0, done = a('done') >= 0;
  const TBL = {x: 70, y: 300, w: 690, h: 210, cols: 8, hc: 170};
  const G = tGeom(TBL as any);
  const [m0, m1] = span(cx0, WRONG, WRONG.indexOf('mitosis'), WRONG.indexOf('mitosis') + 7, WS);
  const [b0, b1] = span(cx0, WRONG, WRONG.indexOf('because'), WRONG.indexOf('because') + 7, WS);
  const [c0] = span(cx0, WRONG, WRONG.indexOf('the cells'), WRONG.indexOf('the cells') + 3, WS);
  const rl = wrap(RIGHT, 24, PW - 70, 600);
  const rTyped = fix ? (done ? RIGHT : typed(RIGHT, a('fix') - 0.6, RIGHT.length / 13.5)) : '';
  let left = rTyped.length;
  const cardH = fix ? 90 + rl.length * 31 : 80;
  const hmx = PX + 22 + textW('A gene that controls cell division ', 25, 700);
  const zb = cy + (fix ? cardH : 80) + 26;
  return (
    <g>
      {/* left: the tumour model, dimmed; the beyond-the-mark-scheme healthy panel below it */}
      <g opacity={0.45 + 0.4 * pulse(a('k1'), 1.2) + 0.4 * pulse(a('k3'), 1.2)}>
        <Tissue {...TBL} t={L * 0.16} shed={1} vesselT={L} />
        <Pile cx={G.colX(3)} bm={G.bm} n={14} r={18} />
        <Txt x={TBL.x} y={TBL.y - 14} size={16} weight={700} fill={T5.ringHalo}>the tumour model (Beat 5)</Txt>
      </g>
      {a('beyond') >= 0 && <g opacity={fi(a('beyond'), 0.4)}>
        <rect data-role="decor" x={62} y={740} width={706} height={200} rx={14} fill="#FFFFFF" stroke={T5.ringHalo} strokeWidth={2} strokeDasharray="8 6" />
        <Tag x={74} y={742} text="beyond the mark scheme" size={17} />
        <Tissue x={90} y={770} w={440} h={110} cols={6} hc={44} t={a('heal') >= 0 ? a('heal') * 0.25 : 0} shed={1} divAt={a('heal') >= 0 && a('heal') < 2 ? 2 : -1} divU={a('heal') >= 0 ? (a('heal') / 2) % 1 : 0} />
        <Balance x={660} y={800} tilt={0} op={1} s={0.5} />
        <Txt x={90} y={932} size={14} weight={600} fill={C.muted} italic>healthy tissue: mitosis also replaces and repairs</Txt>
      </g>}
      {/* right: the panel */}
      <Caption x={PX} y={214} size={15} maxW={PW} weight={600} fill={C.muted} text="basis: a real question; no examiner report on how often — w20_21 Q6(a)(i), QP p15 / MS p12, 2 marks, any two credited consequences; PDF-VERIFIED (plan check) summary" />
      <QHeader x={PX} y={hy} w={PW} label="OUR FRAMING" text={HEADER} src={HSRC} size={25} opacity={fi(a('q'), 0.4)}
        hi={a('sup') >= 0 ? <Underline x1={hmx} x2={hmx + textW('has mutated', 25, 700)} y={hy + 44 + 25 + 8} p={fe(a('sup'), 0.5)} color={T5.ring} /> : null} />
      {a('sup') >= 0 && <Tag x={hmx + textW('has mutated', 25, 700) + 16} y={hy + 30} text="supplied context" size={16} opacity={fi(a('sup'), 0.4)} />}
      {a('true') >= 0 && <g opacity={fi(a('true'), 0.4)}>
        <rect data-role="decor" x={PX} y={cy - 46} width={PW} height={36} rx={8} fill="#F2FAF5" stroke={C.greenDark} strokeWidth={1.5} />
        <Txt x={PX + 12} y={cy - 22} size={17} weight={700} fill={C.greenDark}>credited answer (our summary): loss of cell-cycle control → repeated uncontrolled division → mass of abnormal cells</Txt>
      </g>}
      <g opacity={fi(a('card'), 0.4)}>
        <rect data-role="decor" x={PX} y={cy} width={PW} height={cardH} rx={12} fill="#FFFFFF" stroke="#C9BFA8" strokeWidth={2} />
        <Written x={cx0} y={ly} text={WRONG} size={WS} />
        <Txt x={PX + PW - 14} y={cy + cardH + 18} size={15} weight={600} fill={C.muted} anchor="end" italic>our composite; not a transcript</Txt>
      </g>
      {a('word') >= 0 && !fix && <Underline x1={m0} x2={m1} y={ly + 8} p={fe(a('word'), 0.5)} color={C.primary} />}
      {a('true') >= 0 && !fix && <SideNote x={PX + PW - 16} y={ly} text="true, but not enough" size={21} anchor="end" />}
      {a('nocause') >= 0 && !fix && <g>
        <InkRing cx={(b0 + b1) / 2} cy={ly - 10} rx={(b1 - b0) / 2 + 10} ry={24} p={fe(a('nocause'), 0.5)} />
        <SideNote x={(b0 + b1) / 2} y={ly + 44} text="no cause given" size={19} anchor="middle" />
      </g>}
      {a('gap') >= 0 && !fix && <g opacity={fi(a('gap'), 0.3)}>
        <path data-role="decor" d={`M${c0 - 8} ${ly + 6}L${c0 - 2} ${ly - 10}L${c0 + 4} ${ly + 6}`} stroke={C.primary} strokeWidth={3} fill="none" />
        <SideNote x={c0 + 120} y={ly + 44} text="loss of control?" size={19} />
      </g>}
      {fix && <>
        <Strike x1={cx0 + WS * 1.05} x2={cx0 + WS * 1.05 + textW(WRONG, WS, 600)} y={ly - 10} p={fe(a('fix'), 0.5)} />
        <Txt x={cx0} y={ly + 46} size={26} weight={800} fill={GOOD}>✓</Txt>
        {rl.map((l, i) => { const t = l.slice(0, Math.max(0, left)); left -= l.length + 1; return <Txt key={i} x={cx0 + 30} y={ly + 46 + i * 31} size={24} weight={600} fill={GOOD}>{t}</Txt>; })}
      </>}
      {/* zone B */}
      {a('k1') >= 0 && <g opacity={fi(a('k1'), 0.3)}>
        <Txt x={PX} y={zb + 18} size={16} weight={800} fill={T5.ringHalo}>its consequences</Txt>
        {[['k1', 'loss of cell-cycle control'], ['k2', 'repeated, uncontrolled division'], ['k3', 'mass of abnormal cells']].map(([k, t], i) => a(k) >= 0 ? <g key={k}>
          <Tick x={PX + 16} y={zb + 44 + i * 34} p={fe(a(k), 0.4)} />
          <Txt x={PX + 40} y={zb + 50 + i * 34} size={20} weight={700} fill={GOOD} opacity={fi(a(k), 0.3)}>{t}</Txt>
        </g> : null)}
      </g>}
      {a('marks') >= 0 && <QuoteTab x={PX + 470} y={zb} w={580} size={17} quote={'w20_21 Q6(a)(i), MS p12: 2 marks,\nany two credited points'} source="our summary; MS PDF-VERIFIED (round-1 check)" opacity={fi(a('marks'), 0.4)} />}
      {a('notreq') >= 0 && <g opacity={fi(a('notreq'), 0.4)}>
        <Tag x={PX} y={zb + 150} text="not required here: a named gene · a checkpoint protein · the mutation mechanism" size={18} />
        <Txt x={PX} y={zb + 190} size={14} weight={600} fill={C.muted} italic>G05 check (authored inference): "Connect mutation/altered control to inappropriate division rather than treating any mitosis as a tumour."</Txt>
      </g>}
    </g>
  );
}
