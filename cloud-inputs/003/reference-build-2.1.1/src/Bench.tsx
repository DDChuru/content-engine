/** The Paper 3 bench, one fixed geography for the whole lesson (Beat 5 builds it, Beats 1, 2, 19
 * and 20 reuse it): rack front centre · water bath back right · reagents back left ·
 * white tile front left · waste far right. `show[key]` 0..1 reveals an object; `glow` highlights one. */
import React from 'react';
import {BRAND as C, clamp01} from '../../shared/src/theme';
import {Txt, Tag} from '../../shared/src/Type';
import {Tube, Rack, Bottle, Dropper, Syringe, Cylinder, BeakerBath, ElectricBath, Holder, Tile, Goggles, MarkerPen, Waste, Hazard} from './Apparatus';

export const REAGENTS = [
  {key: 'benedicts', name: "Benedict's", full: "Benedict's solution", k: 'blue', hazard: 'harmful', hz: 'harmful / irritant'},
  {key: 'iodine', name: 'iodine\nin KI', full: 'iodine in potassium iodide solution', k: 'orangebrown', hazard: 'irritant', hz: 'irritant'},
  {key: 'ethanol', name: 'ethanol', full: 'ethanol', k: 'clear', hazard: 'flammable', hz: 'flammable'},
  {key: 'biuret', name: 'biuret\nreagent', full: 'biuret reagent  (or KOH + dilute copper(II) sulfate)', k: 'blue', hazard: 'irritant', hz: 'KOH: harmful / irritant'},
  {key: 'water', name: 'distilled\nwater', full: 'distilled water', k: 'clear', hazard: undefined, hz: ''},
] as const;
export const BOTTLE_X = [262, 370, 478, 586, 694];

export type BenchProps = {
  show?: Record<string, number>; glow?: string; labels?: Record<string, number>; tubes?: any[];
  flame?: number; bathTubes?: any; reagentGlow?: string; legend?: number; dim?: number; tileContent?: any; extra?: any;
};

export function Bench({show = {}, glow = '', labels = {}, tubes, flame = 1, bathTubes, reagentGlow = '', legend = 0, dim = 1, tileContent, extra, bare = false}: BenchProps & {bare?: boolean}) {
  const o = (k: string) => clamp01(show[k] ?? 0);
  const L = (k: string) => clamp01(labels[k] ?? 0);
  const tubeList = tubes ?? [0, 1, 2, 3].map((i) => ({id: 'b' + i, k: 'clear', label: String(i + 1)}));
  const nT = tubeList.length, sp = nT <= 4 ? 90 : 78;
  return (
    <g opacity={dim} data-scene="bench">
      {/* bench top: back edge y 600, front edge y 915 */}
      {!bare && <>
        <path d="M250 600H1680L1850 915H70Z" fill="#E6DAC2" stroke="#C4B394" strokeWidth={3} />
        <path d="M70 915H1850V932H70Z" fill="#CDBD9C" />
        <Txt x={1122} y={626} size={17} weight={700} fill="#A8987A">BACK</Txt>
        <Txt x={96} y={902} size={17} weight={700} fill="#A8987A">FRONT</Txt>
      </>}

      {/* back left: labelled reagents, each with its own dropper pipette in front */}
      <g opacity={o('reagents')}>
        {REAGENTS.map((r, i) => (
          <Bottle key={r.key} x={BOTTLE_X[i]} y={640} s={0.68} name={r.name} k={r.k} hazard={r.hazard} glow={reagentGlow === r.key} />
        ))}
      </g>
      <g opacity={o('dropper')}>
        {REAGENTS.map((r, i) => <Dropper key={r.key} x={BOTTLE_X[i] + 46} y={748} s={0.5} rot={-84} glow={glow === 'dropper'} />)}
      </g>

      {/* back right: water bath (beaker, tripod, gauze, Bunsen) + thermometer; electric bath beside */}
      <g opacity={o('bath')}>
        <BeakerBath x={1300} y={655} s={0.66} flame={flame} glow={glow === 'bath'} reading="">{bathTubes}</BeakerBath>
      </g>
      <g opacity={o('electric')}><ElectricBath x={1560} y={650} s={0.62} glow={glow === 'electric'} /></g>
      <g opacity={o('holder')}><Holder x={1500} y={745} s={0.62} rot={-8} glow={glow === 'holder'} /></g>

      {/* front: tile left, marker, rack centre, syringe + cylinder, goggles, waste far right */}
      <g opacity={o('tile')}><Tile x={190} y={812} w={240} h={56} glow={glow === 'tile'} />{tileContent}</g>
      <g opacity={o('label')}><MarkerPen x={610} y={872} s={0.75} glow={glow === 'label'} /></g>
      <g opacity={o('rack')}>
        <Rack x={930} y={720} w={nT <= 4 ? 360 : nT * 78 + 50} slots={nT}>
          {tubeList.map((t: any, i: number) => (
            <Tube key={t.id} id={t.id} x={930 - ((nT - 1) * sp) / 2 + i * sp} y={t.y ?? 640} h={210} w={46} level={t.level ?? 0.42} k={t.k} to={t.to} t={t.t} label={t.label} pill={t.pill ?? false} rot={t.rot ?? 0} glow={t.glow} ppt={t.ppt} settle={t.settle} opacity={t.op ?? 1} />
          ))}
        </Rack>
      </g>
      <g opacity={o('syringe')}>
        <Syringe x={1175} y={905} s={0.62} fill={0} glow={glow === 'syringe'} />
        <Cylinder x={1250} y={905} s={0.72} glow={glow === 'syringe'} />
      </g>
      <g opacity={o('goggles')}><Goggles x={1430} y={870} s={0.72} glow={glow === 'goggles'} /></g>
      <g opacity={o('waste')}><Waste x={1745} y={905} s={0.85} glow={glow === 'waste'} /></g>
      {extra}

      {/* labels */}
      <Tag x={930} y={952} text="test-tube rack" size={19} anchor="middle" opacity={L('rack')} />
      <Tag x={610} y={952} text="marker" size={19} anchor="middle" opacity={L('label')} />
      <Tag x={1285} y={735} text="syringe · measuring cylinder" size={19} anchor="middle" opacity={L('syringe')} />
      <Tag x={478} y={790} text="dropper pipettes: one per reagent" size={19} anchor="middle" opacity={L('dropper')} />
      <Tag x={1300} y={235} text="water bath + thermometer" size={19} anchor="middle" opacity={L('bath')} />
      <Tag x={1560} y={515} text="or electric water bath" size={19} anchor="middle" opacity={L('electric')} />
      <Tag x={1600} y={800} text="test-tube holder" size={19} anchor="middle" opacity={L('holder')} />
      <Tag x={310} y={952} text="white tile" size={19} anchor="middle" opacity={L('tile')} />
      <Tag x={1430} y={952} text="eye protection" size={19} anchor="middle" opacity={L('goggles')} />
      <Tag x={1745} y={952} text="waste" size={19} anchor="middle" opacity={L('waste')} />
      <Tag x={478} y={450} text="labelled reagents" size={19} anchor="middle" opacity={L('reagents')} />
      {legend > 0 && <ReagentLegend opacity={legend} />}
    </g>
  );
}

/** The bottle names in full, with hazard pictograms as drawn in the paper's table. */
export function ReagentLegend({x = 86, y = 214, opacity = 1}: any) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={980} height={200} rx={14} fill={C.white} stroke={C.line} strokeWidth={2} />
      {REAGENTS.map((r, i) => (
        <g key={r.key}>
          {r.hazard && <Hazard x={x + 30} y={y + 32 + i * 36} s={0.55} kind={r.hazard} />}
          <Txt x={x + 60} y={y + 40 + i * 36} size={20} weight={700}>{r.full}</Txt>
          {r.hz && <Txt x={x + 960} y={y + 40 + i * 36} size={17} anchor="end" weight={700} fill="#C8261E">{r.hz}</Txt>}
        </g>
      ))}
    </g>
  );
}
