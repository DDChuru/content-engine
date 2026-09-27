/** Beat 1 · Hook and context. Skin's deepest layer (schematic): one basal cell grows and pinches into two, each with a
 * nucleus; the column above shuffles up and the flattest top cell detaches; copy · share · split icons bend into a loop. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Glow} from '../T5Annot';
import {fi, fe, lerp, pulse} from '../util';
import {Caption, INK} from './kit';

const f1 = (v: number) => v.toFixed(1);
const X0 = 160, CW = 148, NC = 8, BASE = 850;
const H = [110, 80, 55, 32];
export default function Beat01(s: any) {
  const a = s.a;
  const grow = fe(a('split'), 1.4), pinch = fe(a('split') - 1.4, 1.6), shuffle = fe(a('replace'), 1.8), drift = fe(a('replace') - 0.4, 2.6);
  const cells: any[] = [];
  const cell = (x: number, y: number, w: number, h: number, key: string, op = 1, waist = 0) => {
    if (waist <= 0) return <rect key={key} x={f1(x + 3)} y={f1(y)} width={f1(w - 6)} height={f1(h)} rx={10} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2.5} opacity={op < 1 ? op : undefined} />;
    const cx = x + w / 2, ym = y + h / 2, hw = (w - 6) / 2, ww = hw * (1 - 0.92 * waist);
    const d = `M${f1(cx - hw)} ${f1(y + 10)}Q${f1(cx - hw)} ${f1(y)} ${f1(cx - hw + 10)} ${f1(y)}L${f1(cx + hw - 10)} ${f1(y)}Q${f1(cx + hw)} ${f1(y)} ${f1(cx + hw)} ${f1(y + 10)}L${f1(cx + hw)} ${f1(ym - 20)}Q${f1(cx + ww)} ${f1(ym)} ${f1(cx + hw)} ${f1(ym + 20)}L${f1(cx + hw)} ${f1(y + h - 10)}Q${f1(cx + hw)} ${f1(y + h)} ${f1(cx + hw - 10)} ${f1(y + h)}L${f1(cx - hw + 10)} ${f1(y + h)}Q${f1(cx - hw)} ${f1(y + h)} ${f1(cx - hw)} ${f1(y + h - 10)}L${f1(cx - hw)} ${f1(ym + 20)}Q${f1(cx - ww)} ${f1(ym)} ${f1(cx - hw)} ${f1(ym - 20)}Z`;
    return <path key={key} d={d} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2.5} />;
  };
  for (let j = 0; j < NC; j++) {
    const x = X0 + j * CW;
    if (j !== 3) { let y = BASE; H.forEach((h, i) => { y -= h; cells.push(cell(x, y, CW, h, `c${j}${i}`)); }); continue; }
  }
  // the dividing column
  const x3 = X0 + 3 * CW;
  const basalH = 110 + 80 * grow;                       // grows upward, pushing the column up
  const split = pinch >= 1;
  const col: any[] = [];
  let y = BASE;
  const nuclei: number[][] = [];
  if (!split) { y -= basalH; col.push(cell(x3, y, CW, basalH, 'div', 1, pinch)); nuclei.push([x3 + CW / 2, y + basalH * (pinch > 0.5 ? 0.72 : 0.5)]); if (pinch > 0.5) nuclei.push([x3 + CW / 2, y + basalH * 0.28]); }
  else { y -= 110; col.push(cell(x3, y, CW, 110, 'd1')); nuclei.push([x3 + CW / 2, y + 55]); y -= 80; col.push(cell(x3, y, CW, 80, 'd2')); nuclei.push([x3 + CW / 2, y + 40]); }
  const above = [lerp(80, 55, shuffle), lerp(55, 32, shuffle)];
  above.forEach((h, i) => { y -= h; col.push(cell(x3, y, CW, h, 'a' + i)); });
  const topH = 32;
  const ty = y - topH - drift * 90, tx = x3 + drift * 160;
  col.push(cell(tx, ty, CW, topH, 'top', 1 - drift));
  const nucOp = 1;
  const newTop = split ? nuclei : [];
  return (
    <g>
      <Caption x={70} y={236} size={30} maxW={1760} text="Ever wondered how one of your cells can split into two, without either new cell ending up with half the instructions?" />
      <g data-role="drawing">
        <path d={'M' + Array.from({length: 61}, (_, i) => `${f1(X0 + i * (NC * CW) / 60)} ${f1(BASE + 6 + 5 * Math.sin(i * 0.9))}`).join('L')} fill="none" stroke={T5.envelope} strokeWidth={3} />
        {cells}{col}
        {nuclei.map((q, i) => <g key={'n' + i}><circle cx={f1(q[0])} cy={f1(q[1])} r={24} fill={T5.nucleoplasm} stroke={T5.envelope} strokeWidth={2.5} /><circle cx={f1(q[0] + 8)} cy={f1(q[1] - 7)} r={6} fill={T5.nucleolus} /></g>)}
      </g>
      {newTop.map((q, i) => <Glow key={'g' + i} cx={q[0]} cy={q[1]} r={40} a={fi(a('full'), 0.5) * (0.6 + 0.4 * pulse(a('full') - 0.2, 1))} />)}
      <Tag x={x3 + CW / 2} y={560} text="full copy in each?" size={22} anchor="middle" opacity={fi(a('half'), 0.4) * (1 - fi(a('full'), 0.4))} />
      <Tag x={x3 + CW / 2} y={560} text="same genetic information" size={22} anchor="middle" opacity={fi(a('full'), 0.4)} />
      <Tag x={X0} y={900} text="deepest layer of the skin" size={21} opacity={fi(a('skin'), 0.4)} />
      <Txt x={X0 + NC * CW} y={470} size={18} weight={700} fill={INK} anchor="end" opacity={fi(a('skin'), 0.4)}>surface ↑</Txt>
      <Txt x={X0} y={470} size={16} weight={600} fill={C.muted} italic>schematic; not to scale</Txt>
      <Icons a={a} />
      <Txt x={70} y={940} size={15} weight={600} fill={C.muted} italic>syllabus p.23: body cells divide; nuclear division first, then division of the cytoplasm (our paraphrase of the topic introduction)</Txt>
    </g>
  );
}
function Icons({a}: any) {
  const loop = fe(a('title'), 1.4);
  const cx = 1640, cy = 600, R = 150;
  const pos = (k: number) => { const line = [cx, 420 + k * 150]; const ang = -Math.PI / 2 + k * (2 * Math.PI / 3); const circ = [cx + R * Math.cos(ang), cy + R * Math.sin(ang)]; return [lerp(line[0], circ[0], loop), lerp(line[1], circ[1], loop)]; };
  const ic = [a('copy'), a('share'), a('splitI')];
  const lab = ['copy', 'share', 'split'];
  const W5 = INK;
  const draw = (k: number, x: number, y: number) => k === 0 ? <g><rect x={x - 34} y={y - 26} width={46} height={56} rx={4} fill="#FFFFFF" stroke={W5} strokeWidth={3} /><rect x={x - 14} y={y - 16} width={46} height={56} rx={4} fill="#FFFFFF" stroke={W5} strokeWidth={3} /></g>
    : k === 1 ? <path d={`M${x - 36} ${y}H${x - 6}M${x - 6} ${y}L${x + 26} ${y - 24}M${x - 6} ${y}L${x + 26} ${y + 24}M${x + 16} ${y - 28}L${x + 28} ${y - 25}L${x + 22} ${y - 13}M${x + 16} ${y + 28}L${x + 28} ${y + 25}L${x + 22} ${y + 13}`} fill="none" stroke={W5} strokeWidth={3.5} strokeLinecap="round" />
    : <g><circle cx={x - 18} cy={y} r={22} fill="none" stroke={W5} strokeWidth={3} /><circle cx={x + 22} cy={y} r={22} fill="none" stroke={W5} strokeWidth={3} /></g>;
  return (
    <g>
      {loop > 0 && <g data-role="decor"><circle cx={cx} cy={cy} r={R} fill="none" stroke={T5.ring} strokeWidth={5} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - loop} /></g>}
      {[0, 1, 2].map((k) => { const o = fi(ic[k], 0.4); if (o <= 0) return null; const [x, y] = pos(k); return <g key={k} opacity={o < 1 ? o : undefined}><g data-role="drawing">{draw(k, x, y)}</g><Txt x={x} y={y + 60} size={20} weight={800} fill={INK} anchor="middle">{lab[k]}</Txt></g>; })}
      <Txt x={cx} y={cy + 8} size={24} weight={800} fill={INK} anchor="middle" opacity={fi(a('title') - 0.8, 0.5)}>the mitotic</Txt>
      <Txt x={cx} y={cy + 36} size={24} weight={800} fill={INK} anchor="middle" opacity={fi(a('title') - 0.8, 0.5)}>cell cycle</Txt>
    </g>
  );
}
