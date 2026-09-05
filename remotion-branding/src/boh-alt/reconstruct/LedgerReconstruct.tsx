import React from 'react';
import { AbsoluteFill, Audio, Img, staticFile, useCurrentFrame } from 'remotion';
import narration from '../../boh/narration.json';
import timing from '../../boh/timing.json';
import manifest from './slices.json';
import { useReconstructFonts } from './composeRow';

const beat = timing.beats.find((entry) => entry.id === '02-ledger')!;
const script = narration.beats.find((entry) => entry.id === beat.id)!.script;
export const LEDGER_FPS = timing.fps;
export const LEDGER_FRAMES = Math.ceil(beat.duration * LEDGER_FPS);
const words = (text: string) => text.toLowerCase().match(/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu) ?? [];
const scriptWords = words(script);

/** Script-word proportional estimates, not forced alignment; local mp3 starts at frame zero. */
export const cueFrame = (phrase: string) => {
  const phraseWords = words(phrase);
  const index = scriptWords.findIndex((_, i) => phraseWords.every((word, j) => scriptWords[i + j] === word));
  if (index < 0) throw new Error(`Missing ledger cue: ${phrase}`);
  return Math.round(index / scriptWords.length * beat.duration * LEDGER_FPS);
};
const easeOut = (value: number) => 1 - (1 - Math.max(0, Math.min(1, value))) ** 3;
const appear = (frame: number, start: number) => easeOut((frame - start) / 12);
export const LEDGER_CUES = {
  daily: ['handover', 'cleaning verification', 'chemical verification', 'remedials', 'hygiene', 'equipment', 'PPE'].map(cueFrame),
  divider: cueFrame('The three below'),
  scroll: cueFrame('carry over'),
  scrollEnd: cueFrame('incidents') + 12,
  carry: ['inspection remedials', 'non-conformances', 'incidents'].map(cueFrame),
};

type Slice = { src: string; x: number; y: number; width: number; height: number };
const slices: Record<string, Slice> = manifest.slices;
const Picture: React.FC<{ slice: Slice; opacity?: number; offsetY?: number }> = ({ slice, opacity = 1, offsetY = 0 }) => (
  <Img src={staticFile(slice.src)} style={{ position: 'absolute', left: slice.x, top: slice.y + offsetY,
    width: slice.width, height: slice.height, opacity }} />
);

/** Native 720×1600 coordinate space shared by the video and numerical proof renders. */
export const LedgerPhone: React.FC = () => {
  const frame = useCurrentFrame();
  const scroll = easeOut((frame - LEDGER_CUES.scroll) / (LEDGER_CUES.scrollEnd - LEDGER_CUES.scroll));
  const header = appear(frame, 0);
  const divider = appear(frame, LEDGER_CUES.divider);
  const footer = divider;
  return (
    <div style={{ position: 'relative', width: manifest.width, height: manifest.height, background: manifest.canvas, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, right: 0, top: manifest.viewportTop, bottom: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: -manifest.viewportTop, width: manifest.width, height: 2043,
          transform: `translateY(${-manifest.scrollPx * scroll}px)` }}>
          {LEDGER_CUES.daily.map((start, i) => {
            const key = `row-${String(i + 1).padStart(2, '0')}`;
            const p = appear(frame, start);
            const alternate = slices[`${key}-scrolled`];
            return <React.Fragment key={key}>
              <Picture slice={slices[key]} opacity={p * (alternate ? 1 - scroll : 1)} offsetY={(1 - p) * 24} />
              {alternate && <Picture slice={alternate} opacity={p * scroll} offsetY={(1 - p) * 24} />}
            </React.Fragment>;
          })}
          <div style={{ position: 'absolute', left: 0, top: 1328, width: 720, height: 82,
            clipPath: `inset(0 ${(1 - divider) * 50}% 0 ${(1 - divider) * 50}%)` }}>
            <Picture slice={{ ...slices.divider, y: 0 }} opacity={1 - scroll} />
            <Picture slice={{ ...slices['divider-scrolled'], y: 0 }} opacity={scroll} />
          </div>
          {LEDGER_CUES.carry.map((start, i) => {
            const p = appear(frame, start);
            return <Picture key={start} slice={slices[`row-${String(i + 8).padStart(2, '0')}`]} opacity={p} offsetY={(1 - p) * 24} />;
          })}
        </div>
      </div>
      <Picture slice={slices.header} opacity={header} />
      <Picture slice={slices['header-scrolled']} opacity={header * scroll} />
      {/* Fixed, already-composited navigation crops include the small offscreen content preview. */}
      <Picture slice={slices.footer} opacity={footer} />
      <Picture slice={slices['footer-scrolled']} opacity={footer * scroll} />
    </div>
  );
};

export const LedgerReconstruct: React.FC = () => {
  useReconstructFonts();
  const frame = useCurrentFrame();
  const carry = frame >= LEDGER_CUES.scroll;
  return (
    <AbsoluteFill style={{ background: manifest.canvas, color: '#141A21', fontFamily: 'DM Sans' }}>
      <Audio src={staticFile(beat.audio)} />
      <div style={{ position: 'absolute', left: 168, top: 60, width: 432, height: 960,
        boxShadow: '0 16px 48px #141A2120', outline: '8px solid #141A21', borderRadius: 4 }}>
        <div style={{ transform: 'scale(0.6)', transformOrigin: 'top left' }}><LedgerPhone /></div>
      </div>
      <div style={{ position: 'absolute', left: 740, top: 246, width: 1020 }}>
        <div style={{ color: '#1582AB', fontSize: 24, fontWeight: 700, letterSpacing: 3 }}>BILL OF HEALTH · TODAY</div>
        <div style={{ fontFamily: 'Barlow Condensed', fontWeight: 700, fontSize: 108, lineHeight: 1.02, marginTop: 28 }}>
          Seven today.<br />Three carry over.
        </div>
        <div style={{ height: 5, width: 96, background: carry ? '#E89A30' : '#3CB6E0', margin: '42px 0' }} />
        <div style={{ fontSize: 34, lineHeight: 1.45, maxWidth: 820 }}>
          {carry ? 'The three below the line follow the site until somebody closes them.' : 'The seven above the line are owed by this shift. They start again every day.'}
        </div>
      </div>
      <div style={{ position: 'absolute', left: 740, bottom: 92, color: '#505B69', fontSize: 20, letterSpacing: 2 }}>ECOWIZE ACADEMY · 02 / 12</div>
    </AbsoluteFill>
  );
};
