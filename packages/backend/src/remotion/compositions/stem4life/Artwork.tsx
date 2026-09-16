import React, {useId} from 'react';
import {MICROSCOPE_PATHS, WORDMARK_PATHS} from './paths';
import {progress, settle} from './timing';

type ArtworkProps = {frame: number; fps: number; ink: string; accent: string};

const WordPaths: React.FC<ArtworkProps & {assemble?: boolean}> = ({frame, fps, ink, accent, assemble}) => (
  <g fillRule="evenodd">
    {WORDMARK_PATHS.map((glyph, i) => {
      const order = i > 4 ? i - 1 : i;
      const p = assemble ? settle(frame, fps, glyph.four ? 1.22 : 0.14 + order * 0.055, 0.66) : 1;
      return <g key={i} transform={`translate(${glyph.x} ${glyph.four ? -26 * (1 - p) : 13 * (1 - p)})`} opacity={p}>
        <path d={glyph.d} fill={glyph.four ? accent : ink}/>
      </g>;
    })}
  </g>
);

export const Wordmark: React.FC<ArtworkProps & {assemble?: boolean}> = (props) => (
  <svg viewBox="0 0 560 118" role="img" aria-label="Stem 4 Life" style={{display: 'block', width: '100%', overflow: 'visible'}}>
    <g transform="translate(22 24)"><WordPaths {...props}/></g>
  </svg>
);

// Centre-line reveal masks expose the approved filled outlines; they do not
// replace the artwork with stroked approximations. Masks disappear at completion.
const revealPaths = [
  'M49 38 C73 38 88 49 88 65 C88 84 75 97.5 58 97.5 H25 H89',
  'M21.3 30.4 L43.7 13.6 M34.6 27.3 L53.8 52.9',
  'M27 73.5 H62',
];

const Microscope: React.FC<{frame: number; fps: number; accent: string; draw?: boolean; heroDraw?: boolean}> = ({frame, fps, accent, draw, heroDraw}) => {
  const id = useId().replace(/:/g, '');
  return <g>
    {MICROSCOPE_PATHS.map((d, i) => {
      const start = heroDraw ? [24 / fps, 12 / fps, 52 / fps][i] : [0.25, 0.05, 0.72][i];
      const duration = heroDraw ? [44 / fps, 30 / fps, 20 / fps][i] : [0.86, 0.58, 0.42][i];
      const p = draw ? progress(frame, fps, start, duration) : 1;
      return <g key={i}>
        {p < 1 && <defs><mask id={`${id}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="112" height="112">
          <path d={revealPaths[i]} fill="none" stroke="white" strokeWidth="20" strokeLinecap="square" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - p}/>
        </mask></defs>}
        <path d={d} fill={accent} opacity={p === 0 ? 0 : 1} mask={p < 1 ? `url(#${id}-${i})` : undefined}/>
      </g>;
    })}
  </g>;
};

export const Lockup: React.FC<ArtworkProps & {instrument?: boolean}> = ({frame, fps, ink, accent, instrument}) => {
  const dock = instrument ? settle(frame, fps, 1.12, 0.95) : 1;
  const words = instrument ? settle(frame, fps, 1.38, 0.8) : 1;
  return <svg viewBox="0 0 660.164 128" role="img" aria-label="Stem 4 Life" style={{display: 'block', width: '100%', overflow: 'visible'}}>
    <g transform={`translate(${274 * (1 - dock)} 0) translate(55.58 64) scale(${1 + 0.45 * (1 - dock)}) translate(-55.58 -64)`}>
      <g transform="translate(5.881 13.761) scale(0.895522388)"><Microscope frame={frame} fps={fps} accent={accent} draw={instrument}/></g>
    </g>
    <g transform={`translate(${122.164 + 16 * (1 - words)} 29)`} opacity={words}>
      <WordPaths frame={frame} fps={fps} ink={ink} accent={accent}/>
    </g>
  </svg>;
};

// Intro B gets a dedicated hero choreography so the shared/static lockup used
// by Intro C and every outro remains untouched. In the 1320px-wide placement,
// the approved microscope is 84 SVG units tall. The exact fitted scale below
// makes its visible hero height 800px before it docks at the canonical scale.
// Its visible artwork is filled path geometry, so there is no display stroke
// to compensate during the scale change; the reveal-mask stroke is gone by f72.
export const InstrumentIntroLockup: React.FC<ArtworkProps> = ({frame, fps, ink, accent}) => {
  const dock = settle(frame, fps, 88 / fps, 30 / fps);
  const words = settle(frame, fps, 100 / fps, 18 / fps);
  const heroScale = 800 / (84 * (1320 / 660.164));
  const centerX = 330 + (55.58 - 330) * dock;
  const centerY = 118 + (64 - 118) * dock;
  const scale = heroScale + (1 - heroScale) * dock;
  return <svg viewBox="0 0 660.164 128" role="img" aria-label="Stem 4 Life" style={{display: 'block', width: '100%', overflow: 'visible'}}>
    <g transform={`translate(${centerX} ${centerY}) scale(${scale}) translate(-55.58 -64)`}>
      <g transform="translate(5.881 13.761) scale(0.895522388)">
        <Microscope frame={frame} fps={fps} accent={accent} draw heroDraw/>
      </g>
    </g>
    <g transform={`translate(${122.164 + 16 * (1 - words)} 29)`} opacity={words}>
      <WordPaths frame={frame} fps={fps} ink={ink} accent={accent}/>
    </g>
  </svg>;
};
