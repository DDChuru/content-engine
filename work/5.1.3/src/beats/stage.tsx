/** 5.1.3 stage: the CellCycleWheel (left), the per-cell DNAContentGraph (right), the count strip (whole model cell,
 * 2n = 4) with the typical-human line, and the inset counter + persistent inset caption. Every value is passed in by
 * the beat, which changes it ON the event frame. */
import React from 'react';
import {BRAND as C} from '../../shared/src/theme';
import {Txt} from '../../shared/src/Type';
import {T5} from '../t5-palette';
import {CellCycleWheel, WheelProps} from '../CellCycleWheel';
import {DNAContentGraph, GraphProps} from '../DNAContentGraph';
import {CountStrip, countStripH} from '../ChromosomeModel';

export const W = {cx: 430, cy: 555, R: 200, thick: 58};
export const GR = {x: 890, y: 250, w: 950, h: 350};
export const LONGPOS: any = {g1: [75, 290, 'start'], s: [75, 290, 'start'], g2: [75, 290, 'start'], m: [75, 290, 'start'], c: [75, 290, 'start']};
export const ALL = {g1: 1, s: 1, g2: 1, m: 1, c: 1};
export const INSET_CAPTION = 'one original chromosome and its descendants followed; whole model cell 2n = 4';

export function Stage({wheel, graph, rows, human, insetCount, insetCap = 1, stripOp = 1, dim = 0, hiRow = -1, hiA = 0, children}: {wheel: Partial<WheelProps>; graph?: Partial<GraphProps> | null; rows?: any[]; human?: string; insetCount?: string; insetCap?: number; stripOp?: number; dim?: number; hiRow?: number; hiA?: number; children?: any}) {
  return (
    <g>
      <g opacity={dim > 0 ? 1 - 0.55 * dim : undefined}>
        <CellCycleWheel {...W} longPos={LONGPOS} {...(wheel as any)} />
        {insetCap > 0 && wheel.inset && <Txt x={W.cx} y={234} size={20} weight={600} fill={C.muted} anchor="middle" italic opacity={insetCap}>{INSET_CAPTION}</Txt>}
        {insetCount && <Txt x={W.cx} y={912} size={20} weight={800} fill={T5.ringHalo} anchor="middle">{insetCount}</Txt>}
        {graph && <DNAContentGraph {...GR} caption={1} unitKey={1} {...(graph as any)} />}
        {rows && stripOp > 0 && <CountStrip x={890} y={650} w={950} size={28} rows={rows} opacity={stripOp} hiRow={hiRow} hiCol={-1} hiA={hiA} />}
        {human && stripOp > 0 && <Txt x={900} y={650 + countStripH(rows?.length ?? 1, 28) + 30} size={20} weight={700} fill={T5.ringHalo} opacity={stripOp}>{human}</Txt>}
      </g>
      {children}
    </g>
  );
}
