/** Beat 1 · Hook and context. Human-scale nucleus → separately ended threads pay out, lie end to end (gaps, never
 * joined), rewind into orderly loops; dividing-cell inset; dissolve to the simplified model cell (2n = 4). */
import React from 'react';
import {BRAND as C, clamp01, easeInOut} from '../../shared/src/theme';
import {Txt, Tag, TextScale} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {Chromosome, ModelCell} from '../ChromosomeModel';
import {Glow} from '../T5Annot';
import {fi, fe, lerp, pulse, between, ramp} from '../util';
import {Caption, HookNucleus, ScaleBar, INK} from './kit';

const NT = 10, L = 1500, GAP = 120, X0 = 260;
const f1 = (v: number) => v.toFixed(1);

function threadPath(k: number, e: number, st: number) {
  const n = 60, pts: string[] = [];
  const ang0 = (k / NT) * Math.PI * 2, pk = [Math.cos(ang0) * 72, Math.sin(ang0) * 66];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    // inside: a small two-turn loop with two free ends (orderly, not a knot)
    const r = 8 + 20 * u, th = ang0 + u * Math.PI * 4;
    const ix = pk[0] + r * Math.cos(th), iy = pk[1] + r * Math.sin(th);
    // outside: its own place in the row, fanned and wavy until straightened
    const ox = X0 + k * (L + GAP) + u * L;
    const oy = (k - (NT - 1) / 2) * 170 * (1 - st) + 60 * (1 - st) * Math.sin(2 * Math.PI * 3 * u + k * 1.7);
    const eu = clamp01(e * 1.7 - (1 - u) * 0.7);    // the leading end pays out first; the tail leaves the nucleus last
    const x = lerp(ix, ox, eu), y = lerp(iy, oy, eu);
    pts.push(f1(x) + ' ' + f1(y));
  }
  return 'M' + pts.join('L');
}

export default function Beat01(s: any) {
  const t = s.local, a = s.a;
  const toModel = fe(a('model'), 0.7);            // dissolve to the NEW model panel
  const human = 1 - toModel;
  // camera: hold at z = 1, pull back as the threads lengthen, push back in for the rewind
  const pull = easeInOut(clamp01(ramp(t, [[1.0, 0], [5.4, 0.3], [12.2, 1]]))) * (1 - fe(a('rewind'), 3.4));
  const z = Math.exp(lerp(Math.log(1), Math.log(0.115), pull)), Wx = (960 - lerp(960, 190, pull)) / z;
  const cam = `translate(${f1(960 - Wx * z)} 560) scale(${z.toFixed(4)})`;
  const st = fe(a('row'), 1.6) * (1 - fe(a('rewind'), 1.2));
  const emerge = (k: number) => clamp01((a('pay') - k * 0.45) / 5.5) * (1 - clamp01((a('rewind') - (NT - 1 - k) * 0.22) / 2.4));
  const barP = pulse(a('bar'), 1.2);
  const zoomed = clamp01((z - 0.3) / 0.25);           // scale bar and nucleus caption only while the view is close
  // dividing-cell inset (corner)
  const d = a('divide'), dbl = fe(d, 1.2), pinch = fe(d - 1.3, 1.4);
  const insetOp = fi(d, 0.4) * human;
  const ix = 1640, iy = 390;
  const peanut = () => {
    const hw = lerp(62, 0, pinch), a0 = lerp(0, 58, pinch), rb = 62, pts: number[][] = [];
    for (let i = 0; i <= 60; i++) { const x = -(a0 + rb) + (2 * (a0 + rb)) * i / 60; const yl = Math.abs(x + a0) <= rb ? Math.sqrt(rb * rb - (x + a0) ** 2) : 0; const yr = Math.abs(x - a0) <= rb ? Math.sqrt(rb * rb - (x - a0) ** 2) : 0; const w = hw * Math.sqrt(Math.max(0, 1 - (x / (a0 + rb)) ** 2)); pts.push([x, Math.max(yl, yr, w) * 0.85]); }
    const sh = (x: number) => x + Math.sign(x) * (pinch >= 1 ? 5 : 0);
    return 'M' + pts.map((q) => f1(ix + sh(q[0])) + ' ' + f1(iy - q[1])).join('L') + 'L' + pts.slice().reverse().map((q) => f1(ix + sh(q[0])) + ' ' + f1(iy + q[1])).join('L') + 'Z';
  };
  // the model panel
  const mA = a('model') - 0.4, coil = fe(mA, 2.6);
  const lift = fe(a('lift'), 1.2);
  const cells: any[] = [
    {id: 'C1', x: -110, y: 8, rot: -8}, {id: 'C2', x: -35, y: -6, rot: 6}, {id: 'C3', x: 45, y: 12, rot: -10}, {id: 'C4', x: 112, y: -4, rot: 8},
  ];
  const mx = 960, my = 585;
  return (
    <g>
      <Caption x={70} y={236} size={30} maxW={1760} text="Ever wondered how about two metres of DNA fits inside a nucleus only a few micrometres across?" opacity={human} />
      {human > 0 && <g opacity={human < 1 ? human : undefined}>
        <g transform={cam}>
          <HookNucleus x={0} y={0} r={150} />
          <g data-role="drawing">
            {Array.from({length: NT}, (_, k) => <path key={k} d={threadPath(k, emerge(k), st)} fill="none" stroke={T5.dna} strokeWidth={(4.5 / z).toFixed(2)} strokeLinecap="round" />)}
          </g>
          <TextScale.Provider value={z}><g opacity={zoomed < 1 ? zoomed : undefined}><ScaleBar x={-62} y={200} len={125} pulse={barP} /></g></TextScale.Provider>
        </g>
        <Txt x={960} y={862} size={20} weight={600} fill={C.muted} anchor="middle" italic opacity={zoomed}>nucleus: a few µm across (typical); schematic</Txt>
        <Caption x={960} y={760} anchor="middle" size={24} maxW={1500} weight={700} text="Total nuclear DNA before replication: about 2 m, laid end to end; typical diploid human cell; schematic, not to scale." opacity={between(a('row') - 0.6, a('rewind') - 1.2)} />
      </g>}
      {insetOp > 0 && <g opacity={insetOp < 1 ? insetOp : undefined}>
        <rect data-role="decor" x={ix - 190} y={iy - 120} width={380} height={250} rx={14} fill="#FFFFFF" stroke="#D6CEBD" strokeWidth={2} />
        <g data-role="drawing">
          <path d={peanut()} fill={T5.cytoplasm} stroke={T5.membrane} strokeWidth={2.5} />
          {[-1, 1].map((sd) => { const off = sd === -1 ? 0 : 1; const show = sd === -1 ? 1 : dbl; const dx = sd * lerp(4, 60, pinch) - (sd === 1 ? 0 : 0); return show > 0 ? <path key={sd} d={`M${f1(ix + dx - 30)} ${f1(iy - 20 + off * 8)}C${f1(ix + dx - 10)} ${f1(iy - 50 + off * 8)} ${f1(ix + dx + 10)} ${f1(iy + 30 + off * 8)} ${f1(ix + dx + 30 * show)} ${f1(iy + off * 8)}`} fill="none" stroke={T5.dna} strokeWidth={4} strokeLinecap="round" /> : null; })}
        </g>
        <Txt x={ix} y={iy + 116} size={16} weight={600} fill={C.muted} anchor="middle" italic>schematic</Txt>
        <Txt x={ix - 176} y={iy - 94} size={18} weight={700} fill={INK}>a complete copy to each new cell</Txt>
      </g>}
      {toModel > 0 && <g opacity={toModel < 1 ? toModel : undefined}>
        <Txt x={mx} y={262} size={24} weight={700} fill={INK} anchor="middle">Simplified model cell: 2n = 4; schematic</Txt>
        <ModelCell x={mx} y={my} r={300} nr={200}>
          {cells.map((c, i) => {
            const isC1 = c.id === 'C1';
            const lx = isC1 ? lerp(mx + c.x, 470, lift) : mx + c.x, ly = isC1 ? lerp(my + c.y, 560, lift) : my + c.y;
            return <Chromosome key={c.id} x={lx} y={ly} id={c.id} cond={coil} rep={-1} rot={c.rot} scale={isC1 ? lerp(0.5, 0.95, lift) : 0.5} wave={0.7} opacity={isC1 ? 1 : lerp(1, 0.45, lift)} />;
          })}
        </ModelCell>
        {lift > 0 && <Glow cx={470} cy={560} r={130 * lift} a={0.6 * lift} />}
        <Tag x={mx + 330} y={420} text="chromosomes" size={24} opacity={fi(mA - 2.2, 0.5) * (1 - lift * 0.4)} />
        <Tag x={470} y={400} text="?" size={40} opacity={fi(a('lift') - 0.5, 0.4)} />
      </g>}
    </g>
  );
}
