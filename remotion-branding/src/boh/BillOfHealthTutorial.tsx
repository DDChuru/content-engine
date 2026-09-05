/**
 * e-wizer "Bill of Health" — Ecowize Academy series, video 07 (12 beats, ~4:40).
 *
 * Spec: docs/bill-of-health-storyboard.html (the entire brief — beats, rings,
 * zooms, chips, Daniel's VO). Pattern: src/hygiene/DailyHygieneTutorial.tsx
 * (device-framed phone still + ring + zoom crop + right-hand explainer) with the
 * full-frame card beats (9, 10, 12) and audio mix from src/ccv/CcvTutorial.tsx.
 *
 * Data spine:
 *   src/boh/narration.json  — scripts + chips (source for the ElevenLabs run)
 *   src/boh/timing.json     — voStart/duration per beat (PLACEHOLDER until
 *                             generate-boh-tutorial-audio.ts rewrites it)
 *   src/boh/boxes.json      — normalized 0..1 ring rects (FIRST PASS — re-measure
 *                             every box against the real still)
 *   public/boh/shots/boh-NN.png — 720×1600 portrait stills from the B emulator
 *   public/boh/audio/NN-id.mp3  — per-beat VO
 *
 * Missing assets never break a render: a still that isn't there yet renders as
 * a neutral #F1F4F8 frame carrying the beat id, and a missing MP3 is skipped.
 * Scene windows are derived from voStart − LEAD, so with the placeholder timing
 * every beat starts exactly on its storyboard timecode (beat 2 = frame 660).
 */
import React, { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import timing from './timing.json';
import boxes from './boxes.json';
import {
  BODY,
  clamp01,
  CORAL,
  DISPLAY,
  easeInOut,
  hexToRgb,
  resolveColor,
  seg,
  SKY,
  SKY_DEEP,
} from '../kit/palette';
import { BodyText, Chip, Headline } from '../kit/CaptionPanel';
import { PhoneFrame, type StillMapper } from '../kit/PhoneFrame';
import {
  BOOKEND_INTRO_FRAMES,
  BOOKEND_OUTRO_FRAMES,
  BrandIntro,
  BrandOutro,
  fadeInOut,
} from '../brand/EcowizeBookends';
import { useBohFonts } from './fonts';

// ─── Types + data ──────────────────────────────────────
type Beat = {
  id: string;
  shot: string | null;
  chip: string;
  ring: string | null;
  audio: string;
  voStart: number;
  duration: number;
  text: string;
};
type TimingData = { fps: number; total_seconds: number; total_frames: number; beats: Beat[] };
type Box = { nx: number; ny: number; nw: number; nh: number; color: string; still?: string; alsoIn?: Record<string, { ny: number }>; provisional?: boolean };
type NormRect = { nx: number; ny: number; nw: number; nh: number };

const { _readme: _boxesReadme, ...boxEntries } = boxes;
type BoxName = keyof typeof boxEntries;
const BOXES = boxEntries as Record<BoxName, Box>;

const T = timing as TimingData;
const FPS = T.fps;
export const BOH_FPS = FPS;
export const BOH_TUTORIAL_FRAMES = T.total_frames;
export const BOH_BRANDED_FRAMES = BOOKEND_INTRO_FRAMES + BOH_TUTORIAL_FRAMES + BOOKEND_OUTRO_FRAMES;

// Register C palette (video ink for the stage, Ecowize tokens for everything drawn)
const CANVAS = '#F1F4F8';
const HERO_A = '#1A2330';
const HERO_B = '#0B1219';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const FG2 = '#4A5563';

const ASSET_BASE = 'boh';
const STILL_W = 720;
const STILL_H = 1600;
const CROP_TOP = 120; // status bar on the 720×1600 emulator capture (clock centred at y≈64; toolbar starts at 120)
/** Per-still crop override: the home capture's status bar overlays the canvas gap between the
 * hero banner (ends y 40) and the stat cards (start y 82), so a 120px crop would slice the cards. */
const STILL_CROP_TOP: Record<string, number> = { 'boh-01': 78 };
const cropTopFor = (shot: string | null) => (shot ? STILL_CROP_TOP[shot] ?? CROP_TOP : CROP_TOP);
const PHONE_X = 112;
const PHONE_Y = 34;
const PHONE_H = 1010;
const STAGE_X = 675; // right-hand explainer column
const STAGE_W = 1148; // column right edge 1823 — title-safe (≥ 96px from the frame edge); the zoom panel shares it

const LEAD = 0.6; // scene opens this far before its VO (matches the generator's lead-in)
const NARRATION_VOLUME = 1.5; // voice leads (CCV mix)
const MUSIC = 'cln-tutorial/audio/tutorial.mp3';
const BOOKEND_MUSIC_VOLUME = 0.88;
const RING_IN_FRAMES = 14; // one orchestrated ring-in per beat, ease-out
/** Review cuts: rings whose figures await Monday's re-capture (boxes.json `provisional`) render
 * dashed with a coral callout at the column foot. Flip off for the final cut. */
const SHOW_PROVISIONAL = false; // client cut: solid rings, no callouts
const isProvisional = (box: Box) => SHOW_PROVISIONAL && Boolean(box.provisional);
const ringRadius = (h: number) => Math.min(14, h / 4); // small targets (chips, labels) get a tighter corner
const ZOOM_IN_FRAMES = 20;

// Scene windows (absolute frames). Scene i = [sceneStart[i], sceneStart[i+1]).
const sceneStart = T.beats.map((b, i) => (i === 0 ? 0 : Math.round((b.voStart - LEAD) * FPS)));
const sceneEnd = T.beats.map((_, i) => (i + 1 < T.beats.length ? sceneStart[i + 1] : T.total_frames));

/** Absolute second this beat's scene opens (LEAD before its VO). */
const beatStart = (beat: Beat) => sceneStart[T.beats.indexOf(beat)] / FPS;

/** Absolute second at which `phrase` is spoken — placeholder estimate from its
 * character position in the script, so cues re-time themselves when the real
 * VO durations land. (Word-level Whisper timings can replace this later.)
 * No phrase = "at scene start". */
const cueAt = (beat: Beat, phrase: string | undefined) => {
  if (!phrase) return beatStart(beat);
  const idx = beat.text.indexOf(phrase);
  if (idx < 0) return beatStart(beat);
  return beat.voStart + (idx / beat.text.length) * beat.duration;
};

const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 3;
const rise = (sec: number, at: number, frames: number) => easeOut(seg(sec, at, at + frames / FPS));
/** Entrance that is fully landed ON the scene's first frame (rises over the previous beat's tail). */
const riseBy = (sec: number, at: number, frames: number) => rise(sec, at - frames / FPS, frames);

// ─── Per-beat choreography (from the storyboard "Ring / zoom" column) ──
type RingStep = { box: BoxName; cue?: string; delay?: number }; // delay: seconds after the cue (e.g. wait for a scroll to settle)
const RING_PLAN: Record<string, RingStep[]> = {
  '01-open': [{ box: 'homeTile' }, { box: 'homeBadge', cue: 'This is where you see' }],
  '02-ledger': [{ box: 'dailyBand', cue: 'The seven above' }, { box: 'carryBand', cue: 'The three below', delay: 0.85 }], // the phone scrolls boh-02 → boh-07 on the cue; the ring lands once the scroll settles
  '03-row': [{ box: 'clnRow' }, { box: 'clnCount', cue: 'one hundred and thirty-five' }],
  '04-drilldown': [{ box: 'todoDivider', cue: 'the honest list' }],
  '05-section': [{ box: 'sectionRow' }],
  '06-remedial': [{ box: 'remedialRow', cue: 'It moves to Remedial' }, { box: 'remedialCount', cue: 'the day is not complete' }],
  '07-carryover': [{ box: 'carryRows' }],
  '08-lookback': [{ box: 'dayLabel' }, { box: 'gapRow', cue: 'Sixty-six checks' }],
  '11-routine': [{ box: 'amberRowOne', cue: 'Anything amber' }, { box: 'amberRowTwo', cue: 'Tap it, read the list' }], // composed mid-shift state on boh-02: Cleaning 65 due, PPE open
};

/** `mirrorRings`: draw the beat's RING_PLAN steps (with their handoff) inside the crop
 * instead of a static highlight on `box` — the row rings, then tightens to the count chip. */
/** Animated scroll between two captures of the same screen: `from` (top) scrolls up to `to`
 * (bottom), aligned on `alignBy` (a box measured on `from` with an `alsoIn[to]` ny). The
 * phone's content offset eases over `frames` at the cue; the two stills cross-fade over
 * their shared band so the seam is invisible; rings measured on either still travel with it.
 * Guard: if the `to` still is missing, the `from` still holds (logged once). */
type ScrollPair = { from: string; to: string; alignBy: BoxName; cue?: string; frames?: number };
const SCROLL_PLAN: Record<string, ScrollPair> = {
  '02-ledger': { from: 'boh-02', to: 'boh-07', alignBy: 'carryDivider', cue: 'The three below' },
};
const SCROLL_FRAMES = 24;
// Fixed app chrome on the ledger screens (still px): toolbar + date strip above, nav bar below.
// Both captures carry the floating pill baked into their pixels, so the band under it cannot
// scroll (letting either still's pixels travel there drags a second pill up the screen). The
// band is held from the `from` still during the scroll and dissolves to the `to` still's band
// once the scroll has settled — the pill is identical in both, only what sits beside it changes.
const SCROLL_HEADER_BOTTOM = 320;
const SCROLL_NAV_TOP = 1406;
const NAV_SETTLE_FRAMES = 12;

/** Scroll state for a beat at `sec`: pan (still px, in `from` coordinates), progress 0..1, delta. */
const scrollState = (beat: Beat, sec: number, toExists: boolean) => {
  const pair = SCROLL_PLAN[beat.id];
  if (!pair) return null;
  const anchor = BOXES[pair.alignBy];
  const other = anchor.alsoIn?.[pair.to];
  if (!other) return null;
  const delta = (anchor.ny - other.ny) * STILL_H;
  const frames = pair.frames ?? SCROLL_FRAMES;
  const progress = toExists ? easeInOut(seg(sec, cueAt(beat, pair.cue), cueAt(beat, pair.cue) + frames / FPS)) : 0;
  return { pair, delta, progress, pan: delta * progress };
};

/** Vertical shift (still px) a box measured on `still` gets from the beat's scroll. */
const scrollShift = (state: ReturnType<typeof scrollState>, still: string | undefined) => {
  if (!state || !still) return 0;
  if (still === state.pair.from) return -state.pan;
  if (still === state.pair.to) return -(state.pan - state.delta);
  return 0;
};

type ZoomStep = { box: BoxName; crop: NormRect; cue?: string; mirrorRings?: boolean };
const ZOOM_PLAN: Record<string, ZoomStep> = {
  // crops measured against the captures (still px → /720, /1600)
  '02-ledger': { box: 'carryDivider', crop: { nx: 0, ny: 0.8156, nw: 1, nh: 0.0594 }, cue: 'Those do not reset' }, // y 1305..1400: row 07 foot + the divider, above the nav bar
  // storyboard asks 2.4× on the row; the full-width row at the 1148px title-safe column is 1.66× (the 1080p canvas caps it)
  '03-row': { box: 'clnRow', crop: { nx: 0.02, ny: 0.399, nw: 0.96, nh: 0.1225 }, mirrorRings: true }, // y 638..834 around the CV row card
  '05-section': { box: 'sectionEyebrow', crop: { nx: 0.03, ny: 0.644, nw: 0.94, nh: 0.069 }, cue: 'The area above the section' }, // y 1030..1140: the Tables / Benches row
};

/** Headline = storyboard beat title; body = a line lifted from that beat's script or on-screen note. */
const COPY: Record<string, { headline: string; body?: string }> = {
  '01-open': { headline: 'One bill of health per day', body: 'A certificate the shift writes, line by line, as the work gets done.' },
  '02-ledger': { headline: 'The ledger: seven above the line, three below', body: 'The seven start again every day. The three carry over until somebody closes them.' },
  '03-row': { headline: 'Reading one row', body: 'What was done, what is still outstanding, and a colour.' },
  '04-drilldown': { headline: 'What is due, what is not done', body: 'Not a percentage — still to do at the top, then what is done today: passed, and the failed checks still owed a follow-up.' },
  '05-section': { headline: 'Down to the section', body: 'The area and the section on every line, so two rooms with the same name are never confused.' },
  '06-remedial': { headline: 'A fail is not the end of the row', body: 'A failed check is not finished. It stays open until a supervisor looks at the fix and signs it off.' },
  '07-carryover': { headline: 'Below the line', body: 'These do not reset at midnight.' },
  '08-lookback': { headline: 'You can look back', body: 'Sixty-six checks that were never done are still sixty-six checks never done.' },
  '11-routine': { headline: 'The routine', body: 'Open it three times a day. Chase amber. Send people where the drill-down says.' },
};

// ─── Composed rows: narrated figures set into real ledger rows ──
// Metrics measured on the captures (still px, relative to the row card's top edge):
//   index  Barlow Condensed 600 20px #939CA8 at x 57, baseline +72
//   title  DM Sans 700 23px #141A21 at x 114, baseline +44
//   subtitle DM Sans 400 21px #939CA8 at x 113, baselines +76 (+28 per line)
//   chip   44px pill right-aligned at x 611, radius 22, 20px side padding,
//          Barlow Condensed 700 21px, text baseline chipTop+30; tones = the app's own tints/inks
// Only the listed regions are masked (with the card's white) and re-set; the card, the number,
// the arrow and everything else stay photographed.
type ChipTone = 'amber' | 'coral' | 'emerald' | 'sky';
const CHIP_TONES: Record<ChipTone, { tint: string; ink: string }> = {
  amber: { tint: '#FBEEDB', ink: '#A5690F' }, // sampled: '116 pending' chip on boh-06/boh-08 → (165,105,15)
  coral: { tint: '#F8DDD8', ink: '#D6432F' }, // sampled: '8 open' chip on boh-02 row 01 → (214,67,47) — the app's coral ink is the brand coral
  emerald: { tint: '#DCEFE3', ink: '#1F9C5A' },
  sky: { tint: '#E0F3FA', ink: '#1582AB' },
};
type ComposedRow = {
  /** Card top edge + card height in still px (128 for two-line rows, 100 for one-line rows). */
  top: number;
  height: number;
  index?: string; // re-set the grey row number (only when a row is re-purposed)
  title?: string; // re-set the title (only when a row is re-purposed)
  subtitle: string[]; // one entry per line
  chip: { text: string; tone: ChipTone };
};
/** A single re-set text run anywhere on the still: mask the measured glyph region with the card's
 * white, then draw `text` in the app's font at the measured size/colour (used for the hero's pillar count). */
type TextPatch = { mask: [number, number, number, number]; x: number; baseline: number; text: string; fontSize: number; color: string; family?: string; weight?: number };
/** Per beat: which real still to draw and which rows to compose onto it. `base` overrides beat.shot. */
type ComposePlan = { base: string; rows: ComposedRow[]; patches?: TextPatch[] };
/** Hero "N of 10 pillars clear": the count digit only (DM Sans 22px #939CA8, glyph x 65, "of" starts at 84). */
const heroCount = (digit: string, baseline: number): TextPatch => ({
  mask: [62, baseline - 19, 16, 26],
  x: 64,
  baseline,
  text: digit,
  fontSize: 22,
  color: '#939CA8',
});
const COMPOSE_PLAN: Record<string, ComposePlan> = {
  '03-row': {
    base: 'boh-03',
    rows: [{ top: 673, height: 128, subtitle: ['542 of 677 checks done', '· 135 still due this shift'], chip: { text: '135', tone: 'amber' } }],
    patches: [heroCount('2', 475)], // raw hero reads "3 of 10 pillars clear"; CV composed from Cleared to 135 due → 2
  },
  // Yesterday's ledger from the top (re-captured 07:55): the past-day header is taller, so row 02's
  // card sits at 674..802 (measured: index +57, title +26, subtitle baselines +76/+104, chip +43).
  '08-lookback': {
    base: 'boh-08',
    rows: [{ top: 674, height: 128, subtitle: ['611 of 677 · 66 never done', '· no correction possible'], chip: { text: '66', tone: 'coral' } }],
    patches: [heroCount('5', 476)], // raw hero reads "6 of 10 pillars clear" → 5
  },
  // Mid-shift state on the re-captured top-of-ledger frame (boh-02): both rows are fully visible there;
  // on boh-06 the PPE row sits under the nav pill. Header untouched. boh-02 has no site/hero card in
  // frame (it starts at row 01), so there is no pillar count to reconcile on this beat.
  '11-routine': {
    base: 'boh-02',
    rows: [
      { top: 473, height: 128, subtitle: ['612 of 677 · 65 due', '· afternoon round in progress'], chip: { text: '65', tone: 'amber' } },
      { top: 1204, height: 100, subtitle: ['afternoon session open'], chip: { text: 'open', tone: 'amber' } },
    ],
  },
};
/** The still a beat actually draws (the compose base, else its captured shot). */
const effectiveShot = (beat: Beat) => COMPOSE_PLAN[beat.id]?.base ?? beat.shot;

const CHIP_RIGHT = 611;
const CHIP_H = 44;
const CHIP_PAD = 20;
/** Barlow Condensed 700 21px advance widths (approx.) — enough to size the pill like the app does. */
const chipTextWidth = (text: string) =>
  Array.from(text).reduce((w, ch) => w + (/[0-9]/.test(ch) ? 10.4 : ch === ' ' ? 4.6 : /[A-Z]/.test(ch) ? 11 : 9.3), 0) + 0.3 * text.length;

const ComposedRowOverlay: React.FC<{ row: ComposedRow }> = ({ row }) => {
  const tone = CHIP_TONES[row.chip.tone];
  const chipW = Math.round(chipTextWidth(row.chip.text) + CHIP_PAD * 2);
  const chipX = CHIP_RIGHT - chipW;
  const chipY = row.top + (row.height - CHIP_H) / 2;
  return (
    <g>
      {row.index ? (
        <>
          <rect x={50} y={row.top + 52} width={40} height={26} fill="#FFFFFF" />
          <text x={57} y={row.top + 72} fill="#939CA8" fontFamily="Barlow Condensed" fontSize={20} fontWeight={600}>
            {row.index}
          </text>
        </>
      ) : null}
      {row.title ? (
        <>
          <rect x={108} y={row.top + 22} width={334} height={30} fill="#FFFFFF" />
          <text x={114} y={row.top + 44} fill="#141A21" fontFamily="DM Sans" fontSize={23} fontWeight={700}>
            {row.title}
          </text>
        </>
      ) : null}
      <rect x={108} y={row.top + 56} width={362} height={row.height - 68} fill="#FFFFFF" />
      <text fill="#939CA8" fontFamily="DM Sans" fontSize={21} fontWeight={400}>
        {row.subtitle.map((line, i) => (
          <tspan key={i} x={113} y={row.top + 76 + i * 28}>
            {line}
          </tspan>
        ))}
      </text>
      <rect x={466} y={chipY - 3} width={152} height={CHIP_H + 6} fill="#FFFFFF" />
      <rect x={chipX} y={chipY} width={chipW} height={CHIP_H} rx={CHIP_H / 2} fill={tone.tint} />
      <text
        x={chipX + chipW / 2}
        y={chipY + 30}
        textAnchor="middle"
        fill={tone.ink}
        fontFamily="Barlow Condensed"
        fontSize={21}
        fontWeight={700}
        letterSpacing={0.3}
      >
        {row.chip.text}
      </text>
    </g>
  );
};

/**
 * ComposedStill — a real still drawn at still resolution (720×1600) and scaled into place,
 * with the listed rows re-set on top. `left`/`top` position the still's origin in the parent's
 * pixel space; `scale` is the still→screen factor. No rows = the plain still.
 */
const ComposedStill: React.FC<{ still: string; left: number; top: number; scale: number; rows?: ComposedRow[]; patches?: TextPatch[]; opacity?: number }> = ({
  still,
  left,
  top,
  scale,
  rows = [],
  patches = [],
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left,
      top,
      width: STILL_W,
      height: STILL_H,
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      opacity,
    }}
  >
    <Img src={staticFile(`${ASSET_BASE}/shots/${still}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: STILL_W, height: STILL_H }} />
    {rows.length || patches.length ? (
      <svg width={STILL_W} height={STILL_H} viewBox={`0 0 ${STILL_W} ${STILL_H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        {rows.map((row) => (
          <ComposedRowOverlay key={row.top} row={row} />
        ))}
        {patches.map((t) => (
          <g key={`${t.x}-${t.baseline}`}>
            <rect x={t.mask[0]} y={t.mask[1]} width={t.mask[2]} height={t.mask[3]} fill="#FFFFFF" />
            <text x={t.x} y={t.baseline} fill={t.color} fontFamily={t.family ?? 'DM Sans'} fontSize={t.fontSize} fontWeight={t.weight ?? 400}>
              {t.text}
            </text>
          </g>
        ))}
      </svg>
    ) : null}
  </div>
);

// ─── Asset guard: a missing still / MP3 never breaks the render ──
const assetCache = new Map<string, boolean>();
const useAssetExists = (path: string | null): boolean | null => {
  const url = path ? staticFile(path) : null;
  const [state, setState] = useState<boolean | null>(() => (url ? assetCache.get(url) ?? null : false));
  useEffect(() => {
    if (!url) return;
    if (assetCache.has(url)) {
      setState(assetCache.get(url) as boolean);
      return;
    }
    const handle = delayRender(`boh asset probe ${url}`);
    let alive = true;
    fetch(url, { method: 'HEAD' })
      .then((r) => r.ok && !(r.headers.get('content-type') ?? '').includes('text/html'))
      .catch(() => false)
      .then((ok) => {
        assetCache.set(url, ok);
        if (alive) setState(ok);
        continueRender(handle);
      });
    return () => {
      alive = false;
    };
  }, [url]);
  return state;
};

const GuardedAudio: React.FC<{ src: string; volume: number }> = ({ src, volume }) => {
  const exists = useAssetExists(src);
  if (!exists) return null;
  return <Audio src={staticFile(src)} volume={volume} />;
};

const shotPath = (shot: string | null) => (shot ? `${ASSET_BASE}/shots/${shot}.png` : null);

/** Neutral stand-in for a still that hasn't been captured yet. */
const StillPlaceholder: React.FC<{ label: string; opacity?: number }> = ({ label, opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: CANVAS,
      opacity,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      color: FG2,
      fontFamily: DISPLAY,
    }}
  >
    <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: 0.4 }}>{label}</div>
    <div style={{ fontFamily: BODY, fontSize: 16, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7 }}>
      still pending
    </div>
  </div>
);

// ─── Ring: border only, radius 14, one ease-out entrance, no pulse ──
const Ring: React.FC<{ box: Box; appear: number; mapper: StillMapper; yShift?: number }> = ({ box, appear, mapper, yShift = 0 }) => {
  if (appear <= 0.004) return null;
  const color = resolveColor(box.color);
  const rgb = hexToRgb(color);
  return (
    <div
      style={{
        position: 'absolute',
        left: mapper.sx(box.nx * STILL_W) - 6,
        top: mapper.sy(box.ny * STILL_H + yShift) - 6,
        width: mapper.s(box.nw * STILL_W) + 12,
        height: mapper.s(box.nh * STILL_H) + 12,
        borderRadius: ringRadius(mapper.s(box.nh * STILL_H) + 12),
        border: `4px ${isProvisional(box) ? 'dashed' : 'solid'} ${color}`,
        background: `rgba(${rgb},0.03)`,
        opacity: appear,
        transform: `scale(${1.1 - appear * 0.1})`,
        pointerEvents: 'none',
      }}
    />
  );
};

/** Ring choreography for one beat: each step eases in on its cue; the previous
 * step eases out as the next lands (sequential rings, never two competing). */
const ringSteps = (beat: Beat, sec: number) => {
  const plan = RING_PLAN[beat.id] ?? [];
  return plan.map((step, i) => {
    const at = cueAt(beat, step.cue) + (step.delay ?? 0) + (i === 0 ? 0.28 : 0);
    const handoff = i + 1 < plan.length ? 1 - rise(sec, cueAt(beat, plan[i + 1].cue), RING_IN_FRAMES) : 1;
    return { box: step.box, appear: rise(sec, at, RING_IN_FRAMES) * handoff };
  });
};

const BeatRings: React.FC<{ beat: Beat; sec: number; mapper: StillMapper }> = ({ beat, sec, mapper }) => {
  const pair = SCROLL_PLAN[beat.id];
  const toExists = useAssetExists(pair ? shotPath(pair.to) : null);
  const scroll = scrollState(beat, sec, Boolean(toExists));
  const cropShift = CROP_TOP - cropTopFor(effectiveShot(beat));
  return (
    <>
      {ringSteps(beat, sec).map(({ box, appear }) => (
        <Ring key={box} box={BOXES[box]} appear={appear} mapper={mapper} yShift={cropShift + scrollShift(scroll, BOXES[box].still)} />
      ))}
    </>
  );
};

// ─── Zoom crop card (right column) ──
const ZOOM_MAX_W = STAGE_W;
const ZOOM_MAX_H = 400;

const ZoomPanel: React.FC<{ beat: Beat; zoom: ZoomStep; appear: number; sec: number }> = ({ beat, zoom, appear, sec }) => {
  const shot = effectiveShot(beat);
  const exists = useAssetExists(shotPath(shot));
  if (appear <= 0.004) return null;

  const box = BOXES[zoom.box];
  const cropX = zoom.crop.nx * STILL_W;
  const cropY = zoom.crop.ny * STILL_H;
  const cropW = zoom.crop.nw * STILL_W;
  const cropH = zoom.crop.nh * STILL_H;
  const aspect = cropW / cropH;
  let panelW = ZOOM_MAX_W;
  let panelH = ZOOM_MAX_W / aspect;
  if (panelH > ZOOM_MAX_H) {
    panelH = ZOOM_MAX_H;
    panelW = ZOOM_MAX_H * aspect;
  }
  const scale = panelW / cropW;
  const color = resolveColor(box.color);
  const rgb = hexToRgb(color);

  return (
    <div
      style={{
        position: 'relative',
        width: panelW,
        height: panelH,
        borderRadius: 18,
        overflow: 'hidden',
        background: CANVAS,
        border: `2px solid rgba(${rgb},0.85)`,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 16}px) scale(${0.97 + appear * 0.03})`,
      }}
    >
      {exists && shot ? (
        <ComposedStill still={shot} left={-cropX * scale} top={-cropY * scale} scale={scale} rows={COMPOSE_PLAN[beat.id]?.rows} patches={COMPOSE_PLAN[beat.id]?.patches} />
      ) : (
        <StillPlaceholder label={beat.shot ?? beat.id} />
      )}
      {(zoom.mirrorRings ? ringSteps(beat, sec) : [{ box: zoom.box, appear: 1 }]).map((step) => {
        const b = BOXES[step.box];
        const c = resolveColor(b.color);
        if (step.appear <= 0.004) return null;
        return (
          <div
            key={step.box}
            style={{
              position: 'absolute',
              left: (b.nx * STILL_W - cropX) * scale - 5,
              top: (b.ny * STILL_H - cropY) * scale - 5,
              width: b.nw * STILL_W * scale + 10,
              height: b.nh * STILL_H * scale + 10,
              borderRadius: ringRadius(b.nh * STILL_H * scale + 10),
              border: `4px ${isProvisional(b) ? 'dashed' : 'solid'} ${c}`,
              background: `rgba(${hexToRgb(c)},0.03)`,
              opacity: step.appear,
              transform: `scale(${1.1 - step.appear * 0.1})`,
            }}
          />
        );
      })}
    </div>
  );
};

// ─── Staged idea panels in the caption column (never touch the phone) ──
const SEVEN_CUES = ['handover', 'cleaning verification', 'chemical verification', 'remedials,', 'hygiene', 'equipment', 'PPE'];
const THREE_CUES = ['inspection remedials', 'non-conformances', 'incidents'];

/** Beat 2: a 07 panel and a 03 panel either side of THE LINE; each tally bar lights as the voice names its row. */
const LedgerBands: React.FC<{ beat: Beat; sec: number; appear: number }> = ({ beat, sec, appear }) => {
  const below = rise(sec, cueAt(beat, 'The three below'), RING_IN_FRAMES);
  const panels = [
    { n: '07', title: 'Owed by this shift', body: 'Start again every day', color: SKY, cues: SEVEN_CUES, active: 1 - below * 0.35 },
    { n: '03', title: 'Carries over', body: 'Stay open until resolved', color: AMBER, cues: THREE_CUES, active: 0.6 + below * 0.4 },
  ];
  return (
    <div style={{ marginTop: 30, opacity: appear, transform: `translateY(${(1 - appear) * 16}px)` }}>
      {panels.map((p, i) => (
        <React.Fragment key={p.n}>
          {i === 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '16px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }} />
              <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>The line</div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.18)' }} />
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              padding: '16px 26px',
              borderRadius: 14,
              background: `rgba(${hexToRgb(p.color)},0.10)`,
              borderLeft: `6px solid ${p.color}`,
              opacity: p.active,
            }}
          >
            <div style={{ color: p.color, fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{p.n}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: p.color, fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>{p.title}</div>
              <div style={{ marginTop: 4, color: 'rgba(255,255,255,0.82)', fontFamily: BODY, fontSize: 27, fontWeight: 500 }}>{p.body}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {p.cues.map((cue) => (
                  <div key={cue} style={{ width: 64, height: 8, borderRadius: 999, background: p.color, opacity: 0.22 + 0.78 * rise(sec, cueAt(beat, cue), 10) }} />
                ))}
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

/** Beat 8: the navy slab — "You can look back." then "You cannot write back." in coral, on their cues. */
const LookBackSlab: React.FC<{ beat: Beat; sec: number; appear: number }> = ({ beat, sec, appear }) => {
  const a = appear; // gated on the scene start — rises with the column, not on a late cue
  const b = rise(sec, cueAt(beat, 'you cannot write back'), 18);
  return (
    <div
      style={{
        marginTop: 34,
        padding: '30px 38px',
        borderRadius: 18,
        background: HERO_A,
        opacity: a,
        transform: `translateY(${(1 - a) * 16}px)`,
      }}
    >
      <Eyebrow text="The day is closed" appear={1} />
      <div style={{ marginTop: 14, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1 }}>You can look back.</div>
      <div style={{ marginTop: 8, color: CORAL, fontFamily: DISPLAY, fontWeight: 700, fontSize: 60, lineHeight: 1, opacity: 0.65 + 0.35 * b }}>You cannot write back.</div>
    </div>
  );
};

/** Beat 3: the colour legend, one dot per cue ("Green means…", "Amber means…", "Coral means…"). */
const ColourLegend: React.FC<{ beat: Beat; sec: number }> = ({ beat, sec }) => (
  <div style={{ display: 'flex', gap: 30, marginTop: 24 }}>
    {[
      [EMERALD, 'Green = closed', 'Green means'],
      [AMBER, 'Amber = open', 'Amber means'],
      [CORAL, 'Coral = overdue', 'Coral means'],
    ].map(([color, text, cue]) => {
      const a = rise(sec, cueAt(beat, cue), 12);
      return (
        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: a, transform: `translateY(${(1 - a) * 10}px)` }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: color }} />
          <span style={{ color: 'rgba(255,255,255,0.8)', fontFamily: BODY, fontSize: 24, fontWeight: 500 }}>{text}</span>
        </div>
      );
    })}
  </div>
);

const beatHasProvisional = (beat: Beat) => (RING_PLAN[beat.id] ?? []).some((step) => isProvisional(BOXES[step.box]));

const ProvisionalCallout: React.FC<{ appear: number; text?: string }> = ({ appear, text = 'Provisional · figures to be re-captured' }) => (
  <div style={{ marginTop: 22, display: 'flex', alignItems: 'center', gap: 12, opacity: appear }}>
    <span style={{ width: 34, height: 14, borderRadius: 10, border: `2px dashed ${CORAL}` }} />
    <span style={{ color: CORAL, fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>{text}</span>
  </div>
);

// ─── Full-frame cards (beats 9, 10, 12 — the phone leaves the frame) ──
const Eyebrow: React.FC<{ text: string; appear: number; color?: string }> = ({ text, appear, color = SKY }) => (
  <div
    style={{
      color,
      fontFamily: BODY,
      fontWeight: 700,
      fontSize: 26, // Register C eyebrow (11px / 1.5 tracking) scaled for 1080p
      letterSpacing: 3.5,
      textTransform: 'uppercase',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 10}px)`,
    }}
  >
    {text}
  </div>
);

const CardLine: React.FC<{
  text: string;
  appear: number;
  size?: number;
  weight?: number;
  color?: string;
  family?: string;
  width?: number;
  marginTop?: number;
}> = ({ text, appear, size = 40, weight = 500, color = 'rgba(255,255,255,0.8)', family = BODY, width = 1360, marginTop = 26 }) => (
  <div
    style={{
      marginTop,
      width,
      color,
      fontFamily: family,
      fontWeight: weight,
      fontSize: size,
      lineHeight: family === DISPLAY ? 1.0 : 1.32,
      whiteSpace: 'pre-line',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 18}px)`,
    }}
  >
    {text}
  </div>
);

const Pill: React.FC<{ text: string; appear: number }> = ({ text, appear }) => (
  <div
    style={{
      height: 64,
      padding: '0 28px',
      borderRadius: 14,
      border: `1px solid rgba(${hexToRgb(SKY)},0.55)`,
      color: '#fff',
      fontFamily: DISPLAY,
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: 0.6,
      display: 'inline-flex',
      alignItems: 'center',
      opacity: appear,
      transform: `translateY(${(1 - appear) * 14}px)`,
    }}
  >
    {text}
  </div>
);

const CardShell: React.FC<{ opacity: number; children: React.ReactNode }> = ({ opacity, children }) => (
  <AbsoluteFill style={{ background: `linear-gradient(160deg, ${HERO_A}, ${HERO_B})`, opacity }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: `radial-gradient(circle at 78% 22%, rgba(${hexToRgb(SKY)},0.16), transparent 34%)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        left: 150,
        top: 0,
        width: 1620,
        height: 1080,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  </AbsoluteFill>
);

type CardProps = { beat: Beat; sec: number; start: number; opacity: number };
/** Eyebrow + headline (no cue) are fully up on the card's first frame; supporting lines rise on their spoken cue. */
const cardRise = (sec: number, beat: Beat, start: number, cue?: string, delay = 0) =>
  cue ? rise(sec, cueAt(beat, cue) + delay, 18) : riseBy(sec, start, RING_IN_FRAMES);

const RuleCard: React.FC<CardProps> = ({ beat, sec, start, opacity }) => {
  const s = (cue?: string) => cardRise(sec, beat, start, cue);
  return (
    <CardShell opacity={opacity}>
      <Eyebrow text="The rule" appear={s()} />
      <CardLine text="One opportunity." appear={s()} size={124} weight={700} color="#fff" family={DISPLAY} marginTop={22} />
      <CardLine
        text="The record is made in the moment, by the person doing the work. Once the shift closes, it stays exactly as it was."
        appear={s('The check is recorded')}
        marginTop={34}
      />
      <div
        style={{
          marginTop: 48,
          width: 1360,
          padding: '26px 32px',
          borderRadius: 18,
          border: `1px solid rgba(${hexToRgb(AMBER)},0.6)`,
          opacity: s('If you spot a mistake'),
          transform: `translateY(${(1 - s('If you spot a mistake')) * 16}px)`,
        }}
      >
        <div style={{ color: '#fff', fontFamily: BODY, fontWeight: 500, fontSize: 34, lineHeight: 1.32 }}>
          A mistake noticed during the shift can be corrected during the shift. Yesterday cannot.
        </div>
      </div>
    </CardShell>
  );
};

const EVIDENCE_ROWS: Array<[string, string, string]> = [
  ['Who', 'The person who did the work', 'the question is not'],
  ['What', 'The check, the photo, the sign-off', 'exercised due diligence'],
  ['When', 'Recorded at the time, on the day', 'taken at the time'],
];

/** Beat 10: the evidence-document treatment — the headline and the storyboard's two lines on the
 * left, a white "evidence" document on the right (navy header, WHO / WHAT / WHEN, the emerald
 * stamp), everything composed by the end of the second sentence. */
const DiligenceCard: React.FC<CardProps> = ({ beat, sec, start, opacity }) => {
  const s = (cue?: string, delay = 0) => cardRise(sec, beat, start, cue, delay);
  const contexts = ['FSSC 22000', 'Retailer audits', 'Regulation R638'];
  const docIn = s('In food safety');
  const stamp = s('recorded at the time');
  return (
    <CardShell opacity={opacity}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
        <div style={{ width: 760, flex: '0 0 760px' }}>
          <Eyebrow text="Due diligence" appear={s()} />
          <CardLine text={'“Show me”\nbeats “tell me.”'} appear={s()} size={96} weight={700} color="#fff" family={DISPLAY} width={760} marginTop={22} />
          <CardLine
            text="The defence is that you took all reasonable steps — and the proof is the record made at the time."
            appear={s('all reasonable steps')}
            size={32}
            width={720}
            marginTop={30}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
            {contexts.map((c, i) => (
              <Pill key={c} text={c} appear={s('In food safety', i * 0.3)} />
            ))}
          </div>
          <CardLine
            text="A record that can be edited later is worth less than one that cannot."
            appear={s('recorded at the time', 0.3)}
            size={28}
            color="rgba(255,255,255,0.7)"
            width={720}
            marginTop={30}
          />
        </div>
        <div
          style={{
            width: 800,
            borderRadius: 18,
            overflow: 'hidden',
            background: '#FFFFFF',
            boxShadow: '0 24px 60px rgba(0,0,0,0.35)',
            opacity: docIn,
            transform: `translateY(${(1 - docIn) * 20}px)`,
          }}
        >
          <div style={{ background: HERO_A, padding: '26px 36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Eyebrow text="The evidence" appear={1} />
              <div style={{ marginTop: 6, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 46, lineHeight: 1 }}>Bill of Health</div>
            </div>
            <div style={{ textAlign: 'right', color: 'rgba(255,255,255,0.6)', fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', lineHeight: 1.4 }}>
              One site
              <br />
              One day
            </div>
          </div>
          <div style={{ padding: '6px 36px 30px' }}>
            {EVIDENCE_ROWS.map(([label, text, cue]) => {
              const a = s(cue);
              return (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 26,
                    padding: '24px 0',
                    borderBottom: '1px solid #E1E6EC',
                    opacity: a,
                    transform: `translateY(${(1 - a) * 10}px)`,
                  }}
                >
                  <div style={{ width: 104, color: SKY_DEEP, fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>{label}</div>
                  <div style={{ color: '#181F26', fontFamily: BODY, fontSize: 28, fontWeight: 500 }}>{text}</div>
                </div>
              );
            })}
            <div
              style={{
                marginTop: 28,
                padding: '16px 20px',
                borderRadius: 10,
                border: `3px solid ${EMERALD}`,
                color: EMERALD,
                fontFamily: BODY,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                textAlign: 'center',
                opacity: stamp,
                transform: `rotate(${(1 - stamp) * -4}deg) scale(${1.15 - stamp * 0.15})`,
              }}
            >
              Recorded at the time
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  );
};

const CloseCard: React.FC<CardProps> = ({ beat, sec, start, opacity }) => {
  const s = (cue?: string) => cardRise(sec, beat, start, cue);
  return (
    <CardShell opacity={opacity}>
      <Eyebrow text="Close" appear={s()} />
      <CardLine text="Seven rows to green." appear={s()} size={132} weight={700} color="#fff" family={DISPLAY} marginTop={22} />
      <CardLine text="Before the day ends." appear={s('before the day ends')} size={132} weight={700} color={EMERALD} family={DISPLAY} marginTop={8} />
      <CardLine text="That is the heartbeat of the site." appear={s('heartbeat')} size={44} color="rgba(255,255,255,0.8)" marginTop={40} />
      <div style={{ marginTop: 56 }}>
        <Eyebrow text="e-wizer · Ecowize" appear={s('That is the Bill of Health')} color="rgba(255,255,255,0.6)" />
      </div>
    </CardShell>
  );
};

const CARDS: Record<string, React.FC<CardProps>> = {
  '09-rule': RuleCard,
  '10-diligence': DiligenceCard,
  '12-close': CloseCard,
};

// ─── Phone stage ──
const warnedMissingScrollTarget = new Set<string>();

/** The scroll transition: fixed header + nav bands, and a viewport in which the two stills'
 * scrollable bands move together (aligned on the anchor) while the `to` still fades in. */
const ScrollShot: React.FC<{ beat: Beat; pair: ScrollPair; opacity: number; sec: number }> = ({ beat, pair, opacity, sec }) => {
  const fromPath = shotPath(pair.from);
  const toPath = shotPath(pair.to);
  const fromExists = useAssetExists(fromPath);
  const toExists = useAssetExists(toPath);
  const scale = PHONE_H / (STILL_H - CROP_TOP);
  const crop = cropTopFor(pair.from);
  if (opacity <= 0.004) return null;
  if (!fromExists || !fromPath) return <StillPlaceholder label={pair.from} opacity={opacity} />;
  if (toExists === false && !warnedMissingScrollTarget.has(pair.to)) {
    warnedMissingScrollTarget.add(pair.to);
    console.warn(`[boh] scroll target ${pair.to} is missing — holding ${pair.from} for beat ${beat.id}`);
  }
  const state = scrollState(beat, sec, Boolean(toExists));
  const pan = state?.pan ?? 0;
  const delta = state?.delta ?? 0;
  const fade = state?.progress ?? 0;
  const scrollEnd = state ? cueAt(beat, state.pair.cue) + (state.pair.frames ?? SCROLL_FRAMES) / FPS : 0;
  const settled = state && toExists ? rise(sec, scrollEnd, NAV_SETTLE_FRAMES) : 0;
  const stillImg = (path: string, top: number, imgOpacity = 1) => (
    <Img src={staticFile(path)} style={{ position: 'absolute', left: 0, top, width: '100%', height: STILL_H * scale, opacity: imgOpacity }} />
  );
  // One still's scrollable band (its own y in [HEADER_BOTTOM, NAV_TOP)), shifted by its local pan.
  const band = (path: string, localPan: number, imgOpacity: number) => (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: -localPan * scale,
        width: '100%',
        height: (SCROLL_NAV_TOP - SCROLL_HEADER_BOTTOM) * scale,
        overflow: 'hidden',
        opacity: imgOpacity,
      }}
    >
      {stillImg(path, -SCROLL_HEADER_BOTTOM * scale)}
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0, opacity }}>
      {/* viewport: the region that scrolls */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: (SCROLL_HEADER_BOTTOM - crop) * scale,
          width: '100%',
          height: (SCROLL_NAV_TOP - SCROLL_HEADER_BOTTOM) * scale,
          overflow: 'hidden',
        }}
      >
        {band(fromPath, pan, 1)}
        {toExists && toPath ? band(toPath, pan - delta, fade) : null}
      </div>
      {/* fixed header (identical on both captures) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: (SCROLL_HEADER_BOTTOM - crop) * scale, overflow: 'hidden' }}>
        {stillImg(fromPath, -crop * scale)}
      </div>
      {/* nav band: `from` during the scroll, dissolving to `to` once settled (pill identical in both) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: (SCROLL_NAV_TOP - crop) * scale,
          width: '100%',
          height: (STILL_H - SCROLL_NAV_TOP) * scale,
          overflow: 'hidden',
        }}
      >
        {stillImg(fromPath, -SCROLL_NAV_TOP * scale)}
        {toExists && toPath ? stillImg(toPath, -SCROLL_NAV_TOP * scale, settled) : null}
      </div>
    </div>
  );
};

const PhoneShot: React.FC<{ beat: Beat; opacity: number; sec: number }> = ({ beat, opacity, sec }) => {
  const shot = effectiveShot(beat);
  const path = shotPath(shot);
  const exists = useAssetExists(path);
  const pair = SCROLL_PLAN[beat.id];
  if (opacity <= 0.004) return null;
  if (pair) return <ScrollShot beat={beat} pair={pair} opacity={opacity} sec={sec} />;
  const scale = PHONE_H / (STILL_H - CROP_TOP);
  return exists && shot ? (
    <ComposedStill still={shot} left={0} top={-cropTopFor(shot) * scale} scale={scale} rows={COMPOSE_PLAN[beat.id]?.rows} patches={COMPOSE_PLAN[beat.id]?.patches} opacity={opacity} />
  ) : (
    <StillPlaceholder label={beat.shot ?? beat.id} opacity={opacity} />
  );
};

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const beats = T.beats;
  const active = Math.max(
    0,
    beats.findIndex((_, i) => frame >= sceneStart[i] && frame < sceneEnd[i]),
  );
  const beat = beats[active];
  const isCard = Boolean(CARDS[beat.id]);
  const local = sec - beat.voStart;
  const bar = interpolate(active + clamp01(local / Math.max(beat.duration, 1)), [0, beats.length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Which stills are on screen. The crossfade is anchored to the scene start — the same
  // 14 frames the caption column rises over — so image and caption change together.
  // Card beats have no shot: they are skipped and the previous shot holds underneath the card.
  const phoneBeats = beats.filter((b) => b.shot !== null);
  const shots = phoneBeats.map((b, i) => {
    const start = beatStart(b);
    const nextStart = i + 1 < phoneBeats.length ? beatStart(phoneBeats[i + 1]) : T.total_seconds + 1;
    const opacity = riseBy(sec, start, RING_IN_FRAMES) * (1 - riseBy(sec, nextStart, RING_IN_FRAMES));
    return { beat: b, opacity };
  });

  // Right-hand explainer per phone beat: chip + headline are fully up on the beat's first
  // frame (they rise over the previous beat's tail); the zoom crop stays cue-gated.
  const columns = beats.map((b, i) => {
    if (CARDS[b.id]) return null;
    const start = sceneStart[i] / FPS;
    const end = sceneEnd[i] / FPS;
    const textIn = riseBy(sec, start, RING_IN_FRAMES) * (1 - seg(sec, end - 0.8, end - 0.5));
    if (textIn <= 0.004) return null;
    const zoom = ZOOM_PLAN[b.id];
    const zoomAppear = zoom ? rise(sec, cueAt(b, zoom.cue) + (zoom.cue ? 0 : 0.4), ZOOM_IN_FRAMES) * (1 - seg(sec, end - 0.8, end - 0.5)) : 0;
    return { beat: b, index: i, textIn, zoom, zoomAppear };
  });

  return (
    <AbsoluteFill style={{ background: HERO_B, fontFamily: BODY }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 24% 18%, rgba(${hexToRgb(SKY)},0.14), transparent 26%), linear-gradient(135deg, ${HERO_A}, ${HERO_B} 62%)`,
        }}
      />
      <PhoneFrame
        x={PHONE_X}
        y={PHONE_Y}
        height={PHONE_H}
        assetBase={ASSET_BASE}
        shots={[]}
        stillWidth={STILL_W}
        stillHeight={STILL_H}
        cropTop={CROP_TOP}
        overlay={(mapper) => (
          <>
            {shots.map(({ beat: b, opacity }) => (
              <PhoneShot key={b.id} beat={b} opacity={opacity} sec={sec} />
            ))}
            {!isCard && <BeatRings beat={beat} sec={sec} mapper={mapper} />}
          </>
        )}
      />

      {columns.map((col) => {
        if (!col) return null;
        const copy = COPY[col.beat.id] ?? { headline: col.beat.chip };
        return (
          <div key={col.beat.id} style={{ position: 'absolute', left: STAGE_X, top: 40, width: STAGE_W }}>
            <div
              style={{
                display: 'inline-block',
                marginBottom: 14,
                background: 'rgba(11,18,25,0.78)',
                borderRadius: 999,
                padding: '6px 12px',
                color: 'rgba(255,255,255,0.86)',
                fontFamily: BODY,
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: 'uppercase',
                fontVariantNumeric: 'tabular-nums',
                opacity: col.textIn,
              }}
            >
              Step {String(col.index + 1).padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Chip n={col.index + 1} label={col.beat.chip} appear={col.textIn} />
              <div
                style={{
                  color: 'rgba(255,255,255,0.58)',
                  fontFamily: BODY,
                  fontSize: 26,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  opacity: col.textIn,
                }}
              >
                {col.index + 1} / {beats.length}
              </div>
            </div>
            <Headline text={copy.headline} appear={col.textIn} size={64} width={STAGE_W} />
            {copy.body ? <BodyText text={copy.body} appear={col.textIn} width={STAGE_W - 80} /> : null}
            {col.beat.id === '02-ledger' ? <LedgerBands beat={col.beat} sec={sec} appear={col.textIn} /> : null}
            {col.beat.id === '08-lookback' ? <LookBackSlab beat={col.beat} sec={sec} appear={col.textIn} /> : null}
            {col.zoom ? (
              <div style={{ marginTop: 28 }}>
                <ZoomPanel beat={col.beat} zoom={col.zoom} appear={col.zoomAppear} sec={sec} />
              </div>
            ) : null}
            {col.beat.id === '03-row' ? <ColourLegend beat={col.beat} sec={sec} /> : null}
            {SHOW_PROVISIONAL && COMPOSE_PLAN[col.beat.id] ? <ProvisionalCallout appear={col.textIn} text="Illustrative figures on real screens" /> : null}
            {beatHasProvisional(col.beat) ? <ProvisionalCallout appear={col.textIn} /> : null}
          </div>
        );
      })}

      {/* progress + series footer */}
      <div
        style={{
          position: 'absolute',
          left: STAGE_X,
          bottom: 54,
          width: STAGE_W,
          height: 8,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div style={{ width: `${bar * 100}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${SKY}, ${EMERALD})` }} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: STAGE_X,
          bottom: 74,
          color: 'rgba(255,255,255,0.45)',
          fontFamily: BODY,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}
      >
        Ecowize Academy · Bill of Health
      </div>

      {/* full-frame cards crossfade over the stage during the previous beat's tail;
          a card followed by another card stays up underneath it (no see-through);
          the last beat holds at full opacity to the end (the branded cut goes straight to BrandOutro) */}
      {beats.map((b, i) => {
        const Card = CARDS[b.id];
        if (!Card) return null;
        const start = sceneStart[i] / FPS;
        const end = sceneEnd[i] / FPS;
        const holds = i === beats.length - 1 || Boolean(CARDS[beats[i + 1].id]);
        const op = seg(sec, start - 0.4, start) * (holds ? 1 : 1 - seg(sec, end - 0.4, end));
        if (op <= 0.004 || sec >= end + 0.5) return null;
        return <Card key={b.id} beat={b} sec={sec} start={start} opacity={op} />;
      })}
    </AbsoluteFill>
  );
};

// ─── Audio: VO spine + bed under the open and the close (CCV mix) ──
// Music plays ONLY under the bookends (Daniel's decision). The intro bed runs this far into the
// tutorial and the outro bed starts this far before its end, so neither seam passes through zero.
const SEAM_FRAMES = 18;

const TutorialAudio: React.FC = () => {
  return (
    <>
      {/* no music bed under beats 1–12 — the VO spine only */}
      {T.beats.map((b) => (
        <Sequence key={`vo-${b.id}`} from={Math.round(b.voStart * FPS)} durationInFrames={Math.ceil(b.duration * FPS) + 4} premountFor={FPS}>
          <GuardedAudio src={b.audio} volume={NARRATION_VOLUME} />
        </Sequence>
      ))}
    </>
  );
};

export const BillOfHealthTutorial: React.FC = () => {
  useBohFonts();
  return (
    <AbsoluteFill style={{ background: HERO_B }}>
      <Stage />
      <TutorialAudio />
    </AbsoluteFill>
  );
};

// ─── Proof: every composed row at 2× beside the captured original (still only) ──
export const BohComposeProof: React.FC = () => {
  useBohFonts();
  const items = Object.entries(COMPOSE_PLAN).flatMap(([id, plan]) => plan.rows.map((row) => ({ id, base: plan.base, row })));
  const S = 1.25;
  const CTX = 130; // still px of untouched neighbours above and below the composed row
  return (
    <AbsoluteFill style={{ background: CANVAS, fontFamily: BODY, color: '#141A21' }}>
      {items.map(({ id, base, row }, i) => {
        const top = row.top - CTX;
        const h = row.height + CTX * 2;
        return (
          <div key={`${id}-${row.top}`} style={{ position: 'absolute', left: 40 + (i % 2) * 960, top: 8 + Math.floor(i / 2) * 527 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: CORAL, marginBottom: 6 }}>
              {id} · {base} · composed row @ {row.top} with neighbours
            </div>
            <div style={{ position: 'relative', width: 660 * S, height: h * S, overflow: 'hidden', borderRadius: 10 }}>
              <ComposedStill still={base} left={-32 * S} top={-top * S} scale={S} rows={[row]} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Proof: each composed hero line at 2× beside the raw one (still only). */
export const BohHeroProof: React.FC = () => {
  useBohFonts();
  const items = Object.entries(COMPOSE_PLAN).filter(([, plan]) => plan.patches?.length);
  const S = 2;
  const crop = { x: 40, y: 440, w: 400, h: 56 };
  const cell = (still: string, patches: TextPatch[]) => (
    <div style={{ position: 'relative', width: crop.w * S, height: crop.h * S, overflow: 'hidden', borderRadius: 10 }}>
      <ComposedStill still={still} left={-crop.x * S} top={-crop.y * S} scale={S} patches={patches} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: CANVAS, fontFamily: BODY, color: '#141A21' }}>
      {items.map(([id, plan], i) => (
        <div key={id} style={{ position: 'absolute', left: 40, top: 40 + i * 330 }}>
          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: SKY_DEEP, marginBottom: 8 }}>{id} · {plan.base} · raw hero</div>
              {cell(plan.base, [])}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: CORAL, marginBottom: 8 }}>composed</div>
              {cell(plan.base, plan.patches ?? [])}
            </div>
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ─── Branded cut: BrandIntro 150f + tutorial + BrandOutro 180f ──
const BookendAudio: React.FC = () => {
  const outroStart = BOOKEND_INTRO_FRAMES + BOH_TUTORIAL_FRAMES;
  return (
    <>
      {/* intro bed runs SEAM_FRAMES into the tutorial with its 24-frame fade-out */}
      <Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES + SEAM_FRAMES} premountFor={FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, BOOKEND_INTRO_FRAMES + SEAM_FRAMES, 24)} />
      </Sequence>
      {/* outro bed starts SEAM_FRAMES before the tutorial ends with its 28-frame fade-in */}
      <Sequence from={outroStart - SEAM_FRAMES} durationInFrames={BOOKEND_OUTRO_FRAMES + SEAM_FRAMES} premountFor={FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, BOOKEND_OUTRO_FRAMES + SEAM_FRAMES, 28)} />
      </Sequence>
    </>
  );
};

export const BillOfHealthTutorialBranded: React.FC = () => {
  useBohFonts(); // the bookends render DM Sans text before the tutorial mounts
  const outroStart = BOOKEND_INTRO_FRAMES + BOH_TUTORIAL_FRAMES;
  return (
    <AbsoluteFill style={{ background: HERO_B }}>
      <BookendAudio />
      <Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES} premountFor={FPS}>
        <BrandIntro
          kicker="Ecowize Academy · video 07"
          title="Bill of Health"
          tagline="Seven things every shift must close before the day ends. Three that carry over until someone resolves them."
          accentA={SKY}
          accentB={EMERALD}
        />
      </Sequence>
      <Sequence from={BOOKEND_INTRO_FRAMES} durationInFrames={BOH_TUTORIAL_FRAMES} premountFor={FPS}>
        <BillOfHealthTutorial />
      </Sequence>
      <Sequence from={outroStart} durationInFrames={BOOKEND_OUTRO_FRAMES} premountFor={FPS}>
        {/* BrandOutro's text column sits at left 990 — clear of the logo lockup */}
        <BrandOutro
          outroKicker="Bill of Health"
          outroHeadline="Seven rows to green."
          outroBody="Before the day ends. That is the heartbeat of the site. That is the Bill of Health."
          outroCards={[
            { label: 'Start of shift', color: SKY },
            { label: 'Mid-shift', color: AMBER },
            { label: 'Handover', color: EMERALD },
          ]}
          accentA={SKY}
          accentB={EMERALD}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
