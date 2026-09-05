import React, { useEffect } from 'react';
import { AbsoluteFill, Img, cancelRender, continueRender, delayRender, staticFile } from 'remotion';
import manifest from './slices.json';

export type RowSlice = { src: string; width: number; height: number };
export type ChipTone = keyof typeof manifest.compose.tones;
export type RowValues = { subtitle: string; chipText: string; chipTone: ChipTone };
const measured = manifest.compose;
export const cleaningSlice = manifest.slices['cleaning-compose'];

export const useReconstructFonts = () => {
  useEffect(() => {
    const handle = delayRender('reconstruction app fonts');
    let mounted = true;
    const fonts = document.fonts as FontFaceSet & { add: (font: FontFace) => void };
    const faces = [
      ['DM Sans', 'DMSans_400Regular.ttf', '400'],
      ['DM Sans', 'DMSans_700Bold.ttf', '700'],
      ['Barlow Condensed', 'BarlowCondensed_700Bold.ttf', '700'],
    ];
    const load = async () => {
      await Promise.all(faces.map(async ([family, file, weight]) => {
        let face: FontFace | undefined;
        fonts.forEach((candidate) => {
          if (candidate.family === family && candidate.weight === weight) face = candidate;
        });
        if (!face) {
          face = new FontFace(family, `url(${staticFile(`ccv-tutorial/fonts/${file}`)})`, { weight });
          fonts.add(face);
        }
        await face.load();
      }));
      if (mounted) continueRender(handle);
    };
    void load().catch((error: Error) => { if (mounted) cancelRender(error); });
    return () => { mounted = false; continueRender(handle); };
  }, []);
};

/** Replaces the measured subtitle and chip only; title, number, arrow and card stay photographed. */
export const composeRow = (slice: RowSlice, values: RowValues): React.ReactElement => (
  <ComposedRow slice={slice} {...values} />
);

const ComposedRow: React.FC<RowValues & { slice: RowSlice }> = ({ slice, subtitle, chipText, chipTone }) => {
  useReconstructFonts();
  const tone = measured.tones[chipTone];
  const text = measured.subtitle;
  const chip = measured.chip;
  // The captured primary subtitle has a separate detail continuation. New values own both lines.
  const lines = subtitle === measured.originalSubtitle
    ? [subtitle, measured.originalContinuation]
    : subtitle === '542 of 677 checks done · 135 still due this shift'
      ? ['542 of 677 checks done', '· 135 still due this shift']
      : [subtitle];
  return (
    <div style={{ position: 'relative', width: slice.width, height: slice.height }}>
      <Img src={staticFile(slice.src)} style={{ position: 'absolute', width: slice.width, height: slice.height }} />
      <svg width={slice.width} height={slice.height} style={{ position: 'absolute', inset: 0 }}>
        <defs><clipPath id={`subtitle-${chipTone}`}><rect x={text.x} y={text.y} width={text.width} height={text.height} /></clipPath></defs>
        <rect x={text.x} y={text.y} width={text.width} height={text.height} fill={measured.background} />
        <text fill={text.color} fontFamily={text.fontFamily} fontSize={text.fontSize} fontWeight={text.fontWeight}
          letterSpacing={text.letterSpacing} clipPath={`url(#subtitle-${chipTone})`}>
          {lines.map((line, i) => <tspan key={i} x={text.x} y={text.baseline + i * text.lineHeight}>{line}</tspan>)}
        </text>
        <rect x={chip.x - 1} y={chip.y - 1} width={chip.width + 2} height={chip.height + 2} fill={measured.background} />
        <rect x={chip.x} y={chip.y} width={chip.width} height={chip.height} rx={chip.height / 2} fill={tone.tint} />
        <text x={chip.x + chip.width / 2} y={chip.baseline} textAnchor="middle" fill={tone.ink}
          fontFamily={chip.fontFamily} fontSize={chip.fontSize} fontWeight={chip.fontWeight} letterSpacing={chip.letterSpacing}>{chipText}</text>
      </svg>
    </div>
  );
};

export const ComposeRowFidelity: React.FC = () => composeRow(cleaningSlice, {
  subtitle: measured.originalSubtitle, chipText: measured.originalChip, chipTone: 'emerald',
});

export const ComposeRowDemo: React.FC = () => {
  useReconstructFonts();
  const examples = [
    { label: 'Original capture', row: <Img src={staticFile(cleaningSlice.src)} style={{ width: 660, height: 148 }} /> },
    { label: 'Today · 135 still due', row: composeRow(cleaningSlice, { subtitle: '542 of 677 checks done · 135 still due this shift', chipText: '135', chipTone: 'amber' }) },
    { label: 'Past day · 66 never done', row: composeRow(cleaningSlice, { subtitle: '611 of 677 · 66 never done', chipText: '66', chipTone: 'coral' }) },
  ];
  return (
    <AbsoluteFill style={{ background: manifest.canvas, fontFamily: 'DM Sans', color: '#141A21' }}>
      {examples.map(({ label, row }, i) => (
        <div key={label} style={{ position: 'absolute', left: 32 + i * 1352, top: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>{label}</div>
          <div style={{ width: 660, height: 148, transform: 'scale(2)', transformOrigin: 'top left' }}>{row}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
