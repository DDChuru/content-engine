/**
 * e-wizer "Chemical Concentration Verification" — Ecowize Academy video 03 refresh (13 beats, ~4:30).
 *
 * Spec: docs/ccv-refresh-storyboard.html. Engine: the Bill of Health pattern re-implemented
 * here (device-framed phone still + rings + zoom crop + right-hand explainer; full-frame scenes
 * for the kept July beats; composed states over real stills; asset guards; music under the
 * bookends only). Palette, fonts and the July primitives come from src/ccv/ccvShared.tsx.
 *
 * Data spine:
 *   src/ccv2/narration.json — scripts + chips (source for the ElevenLabs run)
 *   src/ccv2/timing.json    — voStart/duration per beat (PLACEHOLDER until the audio script rewrites it)
 *   src/ccv2/boxes.json     — normalized ring rects measured on the stills
 *   public/ccv2/shots/ccv-NN.png — 720×1600 captures (I&J Blockbusters + Brito's)
 *   public/ccv2/audio/NN-id.mp3  — per-beat VO
 */
import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from 'remotion';
import timing from './timing.json';
import boxes from './boxes.json';
import {
  AMBER,
  APP_BORDER,
  AppBadge,
  BODY,
  CANVAS as APP_CANVAS,
  ChipLabel,
  CORAL,
  clamp01,
  DISPLAY,
  EMERALD,
  easeInOut,
  FG,
  FG2,
  Headline as CcvHeadline,
  hexToRgb,
  INK,
  Iris,
  MUTED,
  ProofChip,
  SceneBackdrop,
  seg,
  SKY,
  SKY_DEEP,
  SURFACE,
  useCcvFonts,
} from '../ccv/ccvShared';
import { resolveColor } from '../kit/palette';
import { BodyText, Chip, Headline } from '../kit/CaptionPanel';
import { PhoneFrame, type StillMapper } from '../kit/PhoneFrame';
import { BOOKEND_INTRO_FRAMES, BOOKEND_OUTRO_FRAMES, BrandIntro, BrandOutro, fadeInOut } from '../brand/EcowizeBookends';

// ─── Types + data ──────────────────────────────────────
type Beat = { id: string; shot: string | null; chip: string; ring: string | null; audio: string; voStart: number; duration: number; text: string };
type TimingData = { fps: number; total_seconds: number; total_frames: number; beats: Beat[] };
type Box = { nx: number; ny: number; nw: number; nh: number; color: string; still?: string };
type NormRect = { nx: number; ny: number; nw: number; nh: number };

const { _readme: _boxesReadme, ...boxEntries } = boxes;
type BoxName = keyof typeof boxEntries;
const BOXES = boxEntries as Record<BoxName, Box>;

const T = timing as TimingData;
const FPS = T.fps;
export const CCV2_FPS = FPS;
export const CCV2_TUTORIAL_FRAMES = T.total_frames;
export const CCV2_BRANDED_FRAMES = BOOKEND_INTRO_FRAMES + CCV2_TUTORIAL_FRAMES + BOOKEND_OUTRO_FRAMES;

// Register C stage palette (hero gradient for the stage and cards; app tokens for anything composed)
const CANVAS = '#F1F4F8';
const HERO_A = '#1A2330';
const HERO_B = '#0B1219';

const ASSET_BASE = 'ccv2';
const STILL_W = 720;
const STILL_H = 1600;
const CROP_TOP = 120; // status bar on the 720×1600 emulator capture (clock centred at y≈64; toolbar starts at 120)
const PHONE_X = 112;
const PHONE_Y = 34;
const PHONE_H = 1010;
const STAGE_X = 675; // right-hand explainer column
const STAGE_W = 1148; // right edge 1823 — title-safe (≥ 96px from the frame edge); the zoom panel shares it

const LEAD = 0.6; // scene opens this far before its VO (matches the generator's lead-in)
const NARRATION_VOLUME = 1.5;
const MUSIC = 'cln-tutorial/audio/tutorial.mp3';
const BOOKEND_MUSIC_VOLUME = 0.88;
const SEAM_FRAMES = 18; // bookend beds overlap the tutorial's first/last frames so no seam passes through zero
const RING_IN_FRAMES = 14;
const ZOOM_IN_FRAMES = 20;
const ringRadius = (h: number) => Math.min(14, h / 4);

// Scene windows (absolute frames). Scene i = [sceneStart[i], sceneStart[i+1]).
const sceneStart = T.beats.map((b, i) => (i === 0 ? 0 : Math.round((b.voStart - LEAD) * FPS)));
const sceneEnd = T.beats.map((_, i) => (i + 1 < T.beats.length ? sceneStart[i + 1] : T.total_frames));
const beatStart = (beat: Beat) => sceneStart[T.beats.indexOf(beat)] / FPS;

/** Absolute second at which `phrase` is spoken — estimate from its character position in the
 * script, so cues re-time themselves when real VO durations land. No phrase = scene start. */
const cueAt = (beat: Beat, phrase: string | undefined) => {
  if (!phrase) return beatStart(beat);
  const idx = beat.text.indexOf(phrase);
  if (idx < 0) return beatStart(beat);
  return beat.voStart + (idx / beat.text.length) * beat.duration;
};
const easeOut = (t: number) => 1 - (1 - clamp01(t)) ** 3;
const rise = (sec: number, at: number, frames: number) => easeOut(seg(sec, at, at + frames / FPS));
/** Entrance fully landed ON the scene's first frame (rises over the previous beat's tail). */
const riseBy = (sec: number, at: number, frames: number) => rise(sec, at - frames / FPS, frames);

// ─── Per-beat choreography (storyboard "Ring / zoom" column) ──
type RingStep = { box: BoxName; cue?: string; delay?: number };
const RING_PLAN: Record<string, RingStep[]> = {
  '02-strip': [{ box: 'strip' }],
  '03-hub': [{ box: 'hubTiles', cue: 'Three numbers first' }, { box: 'dueBand', cue: 'Then the band that matters' }, { box: 'todayStats', cue: 'Below that' }],
  '04-issue': [{ box: 'pickerRow', cue: 'Pick the station' }, { box: 'batchField', cue: 'The batch or lot number' }, { box: 'scopeSeg', cue: 'The scope' }, { box: 'quantities', cue: 'you enter both' }], // the computed value is under the nav pill in the capture — the column's ComputedPanel carries it
  '05-standard': [{ box: 'rangeCard', cue: 'The approved range' }, { box: 'calcLine', cue: 'The calculation' }],
  '06-lock': [{ box: 'lockCard', cue: 'No range, no method' }, { box: 'lockBanner', cue: 'It locks the reading' }],
  '07-baseline': [{ box: 'baselineCard', cue: 'So once a shift' }, { box: 'baselineButton', cue: 'One measurement, once' }],
  '08-inspec': [{ box: 'verdictPass', cue: 'Captured. In spec' }],
  '09-outofspec': [{ box: 'verdictFail', cue: 'Out of spec.' }, { box: 'retestBlock', cue: 'Two things appear' }],
  '10-escalate': [{ box: 'retestFailedPill' }, { box: 'escalationCard', cue: 'names the site manager' }],
  '11-record': [{ box: 'verifiedCard', cue: 'Every issue on the hub' }, { box: 'verificationLine', cue: 'Under it, the verification' }, { box: 'outOfSpecTile', cue: 'Back on the hub' }],
};

/** In-beat still switches: the phone crossfades to the next still on its cue (14f). */
type ShotStep = { shot: string; cue?: string };
const SHOT_PLAN: Record<string, ShotStep[]> = {
  '04-issue': [{ shot: 'ccv-04a-picker' }, { shot: 'ccv-04', cue: 'Then four things' }],
  '05-standard': [{ shot: 'ccv-05' }, { shot: 'ccv-05b-sheet', cue: 'How to test.' }],
  '09-outofspec': [{ shot: 'ccv-09' }, { shot: 'ccv-09b-retest', cue: 'Two things appear' }],
  '11-record': [{ shot: 'ccv-11' }, { shot: 'ccv-03', cue: 'Back on the hub' }], // the detail-modal capture is mostly empty canvas; the history lines are zoomed in the column instead
};
const shotSteps = (beat: Beat, sec: number) => {
  const plan = SHOT_PLAN[beat.id] ?? (beat.shot ? [{ shot: beat.shot }] : []);
  return plan.map((step, i) => {
    const at = i === 0 ? beatStart(beat) : cueAt(beat, step.cue);
    const next = i + 1 < plan.length ? cueAt(beat, plan[i + 1].cue) : Infinity;
    const appear = i === 0 ? 1 : rise(sec, at, RING_IN_FRAMES);
    const handoff = i + 1 < plan.length ? 1 - rise(sec, next, RING_IN_FRAMES) : 1;
    return { shot: step.shot, opacity: appear * handoff };
  });
};
/** The still currently on top for a beat (for rings' per-still offsets and the zoom). */
const activeShot = (beat: Beat, sec: number) => {
  const steps = shotSteps(beat, sec);
  return steps.reduce((best, s) => (s.opacity >= best.opacity ? s : best), steps[0] ?? { shot: beat.shot ?? '', opacity: 0 }).shot;
};

type ZoomStep = { box?: BoxName; crop?: NormRect; cue?: string; still?: string; clear?: boolean }; // clear: an empty step that fades the previous zoom out on its cue
/** Sequential zoom crops per beat; each eases in on its cue (20f) and hands off to the next. */
const ZOOM_PLAN: Record<string, ZoomStep[]> = {
  '02-strip': [{ box: 'strip', crop: { nx: 0.03, ny: 0.345, nw: 0.94, nh: 0.11 }, cue: 'and it names them' }], // y 552..728: the three lines
  '03-hub': [{ box: 'dueBand', crop: { nx: 0.03, ny: 0.365, nw: 0.94, nh: 0.3 }, cue: 'The same three dosing points' }], // y 584..1064: the three OVERDUE rows
  '05-standard': [{ box: 'calcLine', crop: { nx: 0.03, ny: 0.65, nw: 0.94, nh: 0.17 }, cue: 'The procedure', still: 'ccv-05b-sheet' }], // y 1040..1312: the three steps
  '06-lock': [{ box: 'lockBanner', crop: { nx: 0.03, ny: 0.711, nw: 0.94, nh: 0.08 }, cue: 'It locks the reading' }], // y 1138..1266: the composed no-spec banner (re-flowed up 88)
  '07-baseline': [{ box: 'baselineButton', crop: { nx: 0.03, ny: 0.65, nw: 0.94, nh: 0.225 }, cue: 'set the baseline' }], // y 1040..1400: tap-water field + SET BASELINE
  '08-inspec': [{ box: 'verdictPass', crop: { nx: 0.03, ny: 0.68, nw: 0.94, nh: 0.145 }, cue: 'Enter the reading' }], // y 1088..1320: reading field + verdict
  '09-outofspec': [{ box: 'retestBlock', crop: { nx: 0.03, ny: 0.385, nw: 0.94, nh: 0.155 }, cue: 'What you did', still: 'ccv-09b-retest' }], // y 616..864: CORRECTIVE ACTION · REQUIRED label + placeholder
  '11-record': [
    { box: 'verifiedCard', crop: { nx: 0.03, ny: 0.213, nw: 0.94, nh: 0.14 }, cue: 'who issued it' }, // y 341..565: station · plant · dosing point · time, department, litres, issuer
    { box: 'verificationLine', crop: { nx: 0.03, ny: 0.347, nw: 0.94, nh: 0.044 }, cue: 'Under it, the verification' }, // y 555..625: time · method · reading · PASS · name
    { clear: true, cue: 'Back on the hub' }, // the phone cuts to the hub here — the column clears with it
  ],
};
const zoomSteps = (beat: Beat, sec: number, out: number) => {
  const plan = ZOOM_PLAN[beat.id] ?? [];
  return plan.map((step, i) => {
    const at = cueAt(beat, step.cue) + (step.cue ? 0 : 0.4);
    const handoff = i + 1 < plan.length ? 1 - rise(sec, cueAt(beat, plan[i + 1].cue), ZOOM_IN_FRAMES) : 1;
    return { step, appear: rise(sec, at, ZOOM_IN_FRAMES) * handoff * out };
  });
};

/** Headline = storyboard beat title; body = one line lifted from the storyboard or the app's own copy. */
const COPY: Record<string, { headline: string; body?: string }> = {
  '02-strip': { headline: 'The certificate tells you first', body: 'A coral strip at the top of the Bill of Health names the dosing points past their window.' },
  '03-hub': { headline: 'The hub: due, done, out of spec', body: 'Activity first. The strip is the exception.' },
  '04-issue': { headline: 'Issue: batch, scope, chemical and water', body: 'You enter both. The app computes the percentage against the approved range.' },
  '05-standard': { headline: 'The standard is already set', body: 'The approved range and the method are waiting at the station. How to test is one tap.' },
  '06-lock': { headline: 'No spec, no reading', body: 'The app does not guess. A reading against no standard is not verification.' },
  '07-baseline': { headline: 'Conductivity: the baseline, once a shift', body: 'Set once, before the first check. Every reading that shift is corrected against it.' },
  '08-inspec': { headline: 'In spec', body: 'The verdict is the reading against the range, not an opinion.' },
  '09-outofspec': { headline: 'Out of spec: fix it, test again', body: 'Corrective action and a re-test reading — both required before the button unlocks.' },
  '11-record': { headline: 'The record, at the time', body: 'Who issued it, the method, the reading, pass or fail, the name — and the time it was made.' },
};

// ─── Composed states: narrated figures set into real stills ──
// Same discipline as Bill of Health: mask only the changed region with the card's own colour and
// re-set the text in the app's fonts at the measured size, ink sampled from the still.
type TextPatch = {
  mask: [number, number, number, number];
  maskFill?: string;
  x: number;
  baseline: number;
  lines: string[];
  lineHeight?: number;
  fontSize: number;
  color: string;
  family?: string;
  weight?: number;
  letterSpacing?: number;
  anchor?: 'start' | 'middle';
};
type PanelPatch = { x: number; y: number; w: number; h: number; fill: string; stroke?: string; rx?: number };
/** Re-flow: the captured band [from, to) is translated by dy (still px); the strip it exposes at
 * its old foot is masked with the canvas colour. Patches/panels below `from` must be written at
 * their shifted positions. */
type ShiftPatch = { from: number; to: number; dy: number; canvas: string };
type ComposePlan = { base: string; patches: TextPatch[]; panels?: PanelPatch[]; shifts?: ShiftPatch[] };
const APP_INK = '#141A21';
const APP_MUTED = '#939CA8';
const APP_META = '#596371'; // station meta / spec method line, sampled (89,99,113) / (80,91,105)
const COMPOSE_PLAN: Record<string, ComposePlan> = {
  // The captured form is blank: batch/lot, chemical and water are set. The COMPUTED DILUTION value
  // sits under the nav pill in this capture, so the column carries it (ComputedPanel).
  '04-issue': {
    base: 'ccv-04',
    patches: [
      { mask: [50, 545, 560, 52], x: 59, baseline: 584, lines: ['LOT-20250905'], fontSize: 26, color: APP_INK }, // placeholder glyphs 59..317 × 561..588
      { mask: [50, 1195, 120, 52], x: 59, baseline: 1231, lines: ['1'], fontSize: 27, color: APP_INK, weight: 500 }, // "0" glyph 59..76 × 1211..1231
      { mask: [390, 1195, 140, 52], x: 399, baseline: 1231, lines: ['50'], fontSize: 27, color: APP_INK, weight: 500 },
    ],
  },
  // The app's real no-spec state (app/(app)/chemical/verify/[stationId].tsx): the spec hero reads
  // "No range configured" and the CAPTURE READING button is replaced by the noSpecBanner. The
  // reading inputs stay as they are. Station re-set to an unspecced dosing point from the strip.
  '06-lock': {
    base: 'ccv-06',
    panels: [
      { x: 33, y: 508, w: 654, h: 162, fill: '#DEEEF6', stroke: '#BFEBF7', rx: 16 }, // the shortened spec hero (fill + 2px border sampled from the native card)
      { x: 32, y: 1158, w: 656, h: 88, fill: '#FBEEDB', stroke: AMBER, rx: 14 }, // the banner sits in the CAPTURE READING slot — moved up with the band (1246 − 88)
    ],
    // The shortened card left a 130px canvas gap under it; the app renders 42 (card bottom 758 → How-to-test
    // row 800 on the native capture). Everything from the How-to-test row down to the nav band moves up 88px.
    shifts: [{ from: 760, to: 1406, dy: -88, canvas: '#F1F4F8' }],
    patches: [
      { mask: [160, 336, 420, 40], x: 170, baseline: 368, lines: ['Argonox'], fontSize: 32, color: APP_INK, family: 'Barlow Condensed', weight: 700 },
      { mask: [160, 382, 430, 60], x: 169, baseline: 407, lines: ['Site Operations · Argonox · Satellite 7'], fontSize: 23, color: APP_META },
      // The spec hero is redrawn as the app would size it with no range and no method line: label + "No range
      // configured" only (card 507..670, 163px, vs the native 251px card that holds the big value + method).
      { mask: [28, 503, 664, 169], maskFill: '#F1F4F8', x: 360, baseline: 571, lines: ['APPROVED RANGE'], fontSize: 19, letterSpacing: 3, color: '#48BAE2', family: 'Barlow Condensed', weight: 600, anchor: 'middle' },
      { mask: [0, 0, 0, 0], x: 360, baseline: 616, lines: ['No range configured'], fontSize: 28, color: APP_META, anchor: 'middle' },
      { mask: [32, 1152, 656, 100], x: 360, baseline: 1194, lines: ['No verification spec configured for this', 'station — contact your site manager.'], lineHeight: 34, fontSize: 25, color: '#A5690F', weight: 500, anchor: 'middle' }, // 1240/1282 − 88
    ],
  },
};
const effectiveShot = (shot: string | null, beat: Beat) => (shot && COMPOSE_PLAN[beat.id]?.base === shot ? COMPOSE_PLAN[beat.id] : null);

/** A real still drawn at still resolution and scaled into place, with any composed regions on top. */
const ComposedStill: React.FC<{ still: string; left: number; top: number; scale: number; plan?: ComposePlan | null; opacity?: number }> = ({ still, left, top, scale, plan, opacity = 1 }) => (
  <div style={{ position: 'absolute', left, top, width: STILL_W, height: STILL_H, transform: `scale(${scale})`, transformOrigin: 'top left', opacity }}>
    <Img src={staticFile(`${ASSET_BASE}/shots/${still}.png`)} style={{ position: 'absolute', left: 0, top: 0, width: STILL_W, height: STILL_H }} />
    {plan?.shifts?.map((sh, i) => (
      <div key={`s${i}`} style={{ position: 'absolute', left: 0, top: sh.from + sh.dy, width: STILL_W, height: sh.to - sh.from, overflow: 'hidden' }}>
        <Img src={staticFile(`${ASSET_BASE}/shots/${still}.png`)} style={{ position: 'absolute', left: 0, top: -sh.from, width: STILL_W, height: STILL_H }} />
      </div>
    ))}
    {plan ? (
      <svg width={STILL_W} height={STILL_H} viewBox={`0 0 ${STILL_W} ${STILL_H}`} style={{ position: 'absolute', left: 0, top: 0 }}>
        {plan.shifts?.map((sh, i) => (
          <rect key={`x${i}`} x={0} y={sh.to + Math.min(sh.dy, 0) - 10} width={STILL_W} height={Math.abs(sh.dy) + 10} fill={sh.canvas} />
        ))}
        {plan.patches.map((t, i) => (
          <rect key={`m${i}`} x={t.mask[0]} y={t.mask[1]} width={t.mask[2]} height={t.mask[3]} fill={t.maskFill ?? '#FFFFFF'} />
        ))}
        {plan.panels?.map((p, i) => (
          <rect key={`p${i}`} x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx ?? 0} fill={p.fill} stroke={p.stroke} strokeWidth={p.stroke ? 2 : 0} />
        ))}
        {plan.patches.map((t, i) => (
          <text key={`t${i}`} fill={t.color} fontFamily={t.family ?? 'DM Sans'} fontSize={t.fontSize} fontWeight={t.weight ?? 400} letterSpacing={t.letterSpacing ?? 0} textAnchor={t.anchor ?? 'start'}>
            {t.lines.map((line, j) => (
              <tspan key={j} x={t.x} y={t.baseline + j * (t.lineHeight ?? t.fontSize * 1.3)}>
                {line}
              </tspan>
            ))}
          </text>
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
    const handle = delayRender(`ccv2 asset probe ${url}`);
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
/** A July still (public/ccv-tutorial/shots) drawn only if it exists. */
const GuardedImg: React.FC<{ path: string; style: React.CSSProperties }> = ({ path, style }) => {
  const exists = useAssetExists(path);
  if (!exists) return null;
  return <Img src={staticFile(path)} style={style} />;
};

const StillPlaceholder: React.FC<{ label: string; opacity?: number }> = ({ label, opacity = 1 }) => (
  <div style={{ position: 'absolute', inset: 0, background: CANVAS, opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, color: FG2, fontFamily: DISPLAY }}>
    <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: 0.4 }}>{label}</div>
    <div style={{ fontFamily: BODY, fontSize: 16, fontWeight: 500, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.7 }}>still pending</div>
  </div>
);

// ─── Ring: border only, radius ≤ 14, one ease-out entrance, no pulse ──
const Ring: React.FC<{ box: Box; appear: number; mapper: StillMapper }> = ({ box, appear, mapper }) => {
  if (appear <= 0.004) return null;
  const color = resolveColor(box.color);
  const h = mapper.s(box.nh * STILL_H) + 12;
  return (
    <div
      style={{
        position: 'absolute',
        left: mapper.sx(box.nx * STILL_W) - 6,
        top: mapper.sy(box.ny * STILL_H) - 6,
        width: mapper.s(box.nw * STILL_W) + 12,
        height: h,
        borderRadius: ringRadius(h),
        border: `4px solid ${color}`,
        background: `rgba(${hexToRgb(color)},0.03)`,
        opacity: appear,
        transform: `scale(${1.1 - appear * 0.1})`,
        pointerEvents: 'none',
      }}
    />
  );
};
const ringSteps = (beat: Beat, sec: number) => {
  const plan = RING_PLAN[beat.id] ?? [];
  return plan.map((step, i) => {
    const at = cueAt(beat, step.cue) + (step.delay ?? 0) + (i === 0 ? 0.28 : 0);
    const handoff = i + 1 < plan.length ? 1 - rise(sec, cueAt(beat, plan[i + 1].cue), RING_IN_FRAMES) : 1;
    return { box: step.box, appear: rise(sec, at, RING_IN_FRAMES) * handoff };
  });
};
/** Rings only draw on the still they were measured on (SHOT_PLAN beats switch stills mid-beat). */
const BeatRings: React.FC<{ beat: Beat; sec: number; mapper: StillMapper }> = ({ beat, sec, mapper }) => {
  const current = activeShot(beat, sec);
  return (
    <>
      {ringSteps(beat, sec).map(({ box, appear }) =>
        BOXES[box].still && BOXES[box].still !== current ? null : <Ring key={box} box={BOXES[box]} appear={appear} mapper={mapper} />,
      )}
    </>
  );
};

// ─── Zoom crop card (right column) ──
const ZOOM_MAX_W = STAGE_W;
const ZOOM_MAX_H = 400;
const ZoomPanel: React.FC<{ beat: Beat; zoom: ZoomStep; appear: number }> = ({ beat, zoom, appear }) => {
  const boxName = zoom.box;
  const still = zoom.still ?? (boxName ? BOXES[boxName].still : undefined) ?? beat.shot ?? '';
  const exists = useAssetExists(shotPath(still));
  if (appear <= 0.004 || zoom.clear || !boxName || !zoom.crop) return null;
  const box = BOXES[boxName];
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
  // highlight the box inside the crop only when the crop is wider than the box itself (a crop that IS the box already has the panel border)
  const inCrop = box.ny * STILL_H >= cropY - 4 && (box.ny + box.nh) * STILL_H <= cropY + cropH + 4 && box.nh * STILL_H < cropH * 0.6;
  return (
    <div style={{ position: 'relative', width: panelW, height: panelH, borderRadius: 18, overflow: 'hidden', background: CANVAS, border: `2px solid rgba(${hexToRgb(color)},0.85)`, opacity: appear, transform: `translateY(${(1 - appear) * 16}px) scale(${0.97 + appear * 0.03})` }}>
      {exists ? <ComposedStill still={still} left={-cropX * scale} top={-cropY * scale} scale={scale} plan={effectiveShot(still, beat)} /> : <StillPlaceholder label={still} />}
      {inCrop ? (
        <div style={{ position: 'absolute', left: (box.nx * STILL_W - cropX) * scale - 5, top: (box.ny * STILL_H - cropY) * scale - 5, width: box.nw * STILL_W * scale + 10, height: box.nh * STILL_H * scale + 10, borderRadius: ringRadius(box.nh * STILL_H * scale + 10), border: `4px solid ${color}`, background: `rgba(${hexToRgb(color)},0.03)` }} />
      ) : null}
    </div>
  );
};

// ─── Column panels ──
const Eyebrow: React.FC<{ text: string; appear: number; color?: string }> = ({ text, appear, color = SKY }) => (
  <div style={{ color, fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 3.5, textTransform: 'uppercase', opacity: appear, transform: `translateY(${(1 - appear) * 10}px)` }}>{text}</div>
);
/** Beat 4, first panel: the three things the rings walk, each lighting on its cue; hands off to the ComputedPanel. */
const IssueWalkPanel: React.FC<{ beat: Beat; sec: number; appear: number }> = ({ beat, sec, appear }) => {
  const items = [
    ['Batch / lot', 'the traceability line', 'The batch or lot number'],
    ['Scope', 'entire factory or one department', 'The scope'],
    ['Chemical + water', 'you enter both', 'you enter both'],
  ];
  const out = 1 - rise(sec, cueAt(beat, 'The app does, live'), 18);
  return (
    <div style={{ display: 'flex', gap: 16, opacity: appear * out, transform: `translateY(${(1 - appear) * 16}px)` }}>
      {items.map(([title, body, cue], i) => {
        const lit = rise(sec, cueAt(beat, cue), 12);
        return (
          <div key={title} style={{ flex: 1, padding: '18px 22px', borderRadius: 14, border: `2px solid rgba(${hexToRgb(SKY)},${0.25 + lit * 0.6})`, background: `rgba(${hexToRgb(SKY)},${lit * 0.1})` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 999, background: lit > 0.5 ? SKY : 'rgba(255,255,255,0.12)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: 20, fontVariantNumeric: 'tabular-nums' }}>{i + 1}</div>
              <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 32, lineHeight: 1 }}>{title}</div>
            </div>
            <div style={{ marginTop: 10, color: `rgba(255,255,255,${0.5 + lit * 0.35})`, fontFamily: BODY, fontSize: 24, fontWeight: 500 }}>{body}</div>
          </div>
        );
      })}
    </div>
  );
};

/** Beat 4: the computed dilution the capture hides under its nav pill, drawn in the column as the app draws it. */
const ComputedPanel: React.FC<{ beat: Beat; sec: number; appear: number }> = ({ beat, sec, appear }) => {
  const a = rise(sec, cueAt(beat, 'The app does, live'), 18) * appear;
  const ok = rise(sec, cueAt(beat, 'Green, you carry on'), 12);
  const color = ok > 0.5 ? EMERALD : SKY;
  return (
    <div style={{ padding: '22px 28px', borderRadius: 18, border: `2px solid rgba(${hexToRgb(color)},0.7)`, opacity: a, transform: `translateY(${(1 - a) * 16}px)`, display: 'flex', alignItems: 'center', gap: 34 }}>
      <div>
        <div style={{ color, fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Computed dilution</div>
        <div style={{ marginTop: 6, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 72, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>2.0 %</div>
      </div>
      <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: BODY, fontSize: 26, lineHeight: 1.35 }}>
        1 L chemical · 50 L water
        <br />
        Approved 0.5–5.0 % · <span style={{ color, fontWeight: 700 }}>{ok > 0.5 ? 'in range' : 'checking'}</span>
      </div>
    </div>
  );
};

// ─── Full-frame scenes: kept July beats + the close ──
type SceneProps = { beat: Beat; sec: number; start: number; opacity: number };
/** Scene-local clock the July code was written against: seconds since this beat's VO start. */
const voSec = (beat: Beat, sec: number) => sec - beat.voStart;

const TypeOnLine: React.FC<{ text: string; accent: string; progress: number; dim: number }> = ({ text, accent, progress, dim }) => {
  const reveal = easeInOut(progress);
  const [head, tail] = text.split('—');
  return (
    <div style={{ overflow: 'hidden', marginTop: 34, opacity: progress > 0 ? dim : 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 22, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <span style={{ color: accent, fontFamily: DISPLAY, fontWeight: 700, fontSize: 84, letterSpacing: 1.5, textShadow: `0 0 44px rgba(${hexToRgb(accent)},0.45)` }}>{head.trim()}</span>
        {tail && <span style={{ color: 'rgba(255,255,255,0.82)', fontFamily: BODY, fontWeight: 500, fontSize: 37 }}>— {tail.trim()}</span>}
      </div>
      <div style={{ marginTop: 12, width: `${reveal * 46}%`, height: 4, borderRadius: 999, background: `rgba(${hexToRgb(accent)},0.65)` }} />
    </div>
  );
};
/** Beat 1 — the July hook, re-implemented frame for frame (composed grey drum, three typed lines, the iris that fails). */
const HookScene: React.FC<SceneProps> = ({ beat, sec: abs, opacity }) => {
  const sec = voSec(beat, abs);
  const frame = useCurrentFrame();
  const zoom = 1.06 + (frame / FPS) * 0.004;
  const enter = seg(sec, -0.4, 1.2);
  const irisTry = seg(sec, 13.4, 15.2);
  const irisFail = seg(sec, 17.2, 18.6);
  const openness = clamp01(irisTry * 0.66 - irisFail * 0.66);
  const dip = seg(sec, 18.2, 19.6);
  return (
    <AbsoluteFill style={{ background: '#000', opacity }}>
      <GuardedImg path="ccv-tutorial/shots/drum-grey.png" style={{ position: 'absolute', left: '50%', top: '50%', width: 1920, height: 1080, transform: `translate(-50%, -50%) scale(${zoom})`, opacity: enter * (1 - dip * 0.72), filter: 'saturate(0.32) brightness(0.8)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 46%, transparent 30%, rgba(0,0,0,0.78) 88%)' }} />
      <div style={{ position: 'absolute', left: 120, top: 210, width: 1500 }}>
        <TypeOnLine text="TOO STRONG — corrodes the line, burns skin." accent={CORAL} progress={seg(sec, 0.7, 3.0)} dim={1 - dip * 0.7} />
        <TypeOnLine text="TOO WEAK — bacteria survive the clean." accent={CORAL} progress={seg(sec, 5.1, 7.4)} dim={1 - dip * 0.7} />
        <TypeOnLine text="NOBODY MEASURED — so nobody knew." accent="#B9C4CE" progress={seg(sec, 10.9, 13.2)} dim={1 - dip * 0.55} />
      </div>
      <Iris cx={962} cy={585} r={205} openness={openness} flicker={irisTry > 0.2 ? 0.55 + irisFail * 0.4 : 0} glow={0.7} />
      {irisFail >= 1 && (
        <div style={{ position: 'absolute', left: 690, top: 812, color: 'rgba(255,255,255,0.5)', fontFamily: BODY, fontSize: 26, letterSpacing: 3.5, textTransform: 'uppercase', opacity: seg(sec, 18.4, 19.2) * (1 - seg(sec, 19.9, 20.4)) }}>
          nobody was watching
        </div>
      )}
      <div style={{ position: 'absolute', right: 84, bottom: 44, background: '#F7FAFC', borderRadius: 14, padding: '10px 18px', display: 'flex', alignItems: 'center', opacity: seg(sec, 0.9, 2.0) * (1 - dip * 0.75) * 0.92 }}>
        <GuardedImg path="images/ecowize-logo.webp" style={{ width: 148, height: 54, objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  );
};

/** Beat 10 — the new still 16 on the operator device, the July composed SM device on the right. */
const EscalationScene: React.FC<SceneProps> = ({ beat, sec: abs, opacity }) => {
  const sec = voSec(beat, abs);
  const shot = 'ccv-10';
  const exists = useAssetExists(shotPath(shot));
  const textIn = riseBy(abs, beatStart(beat), RING_IN_FRAMES);
  const smDeviceIn = easeInOut(seg(sec, 10.6, 11.8));
  const thread = easeInOut(seg(sec, 11.2, 13.4));
  const pulseT = seg(sec, 13.6, 14.6);
  const ackIn = seg(sec, 14.6, 15.4);
  const signP = easeInOut(seg(sec, 16.2, 18.6));
  const pathD = 'M 560 700 C 760 700, 900 470, 1180 452';
  const scale = 700 / (STILL_H - CROP_TOP);
  return (
    <AbsoluteFill style={{ background: INK, opacity }}>
      <SceneBackdrop variant="deep" />
      <div style={{ position: 'absolute', left: 120, top: 66, width: 1700 }}>
        <ChipLabel text="Still failing after the re-test" appear={textIn} color={CORAL} />
        <CcvHeadline text="One operator shouldn't carry that alone." appear={textIn} size={64} width={1300} />
      </div>
      <PhoneFrame
        x={130}
        y={300}
        height={700}
        assetBase={ASSET_BASE}
        shots={[]}
        stillWidth={STILL_W}
        stillHeight={STILL_H}
        cropTop={CROP_TOP}
        entrance={easeInOut(seg(sec, -0.4, 0.4))}
        overlay={(m) => (
          <>
            {exists ? <ComposedStill still={shot} left={0} top={-CROP_TOP * scale} scale={scale} /> : <StillPlaceholder label={shot} />}
            <BeatRings beat={beat} sec={abs} mapper={m} />
          </>
        )}
      />
      <div style={{ position: 'absolute', left: 150, top: 252, color: 'rgba(255,255,255,0.6)', fontFamily: DISPLAY, fontSize: 26, fontWeight: 600, letterSpacing: 3.5, opacity: seg(sec, 1.0, 1.6) }}>OPERATOR — RECORD AND ESCALATE</div>
      <svg width={1920} height={1080} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <path d={pathD} fill="none" stroke={`rgba(${hexToRgb(SKY)},0.85)`} strokeWidth={5} strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 - thread * 900} style={{ filter: `drop-shadow(0 0 12px rgba(${hexToRgb(SKY)},0.7))` }} />
        {pulseT > 0 && pulseT < 1 && <circle cx={560 + (1180 - 560) * pulseT} cy={700 - Math.sin(pulseT * Math.PI) * 250} r={13} fill={SKY} style={{ filter: `drop-shadow(0 0 16px ${SKY})` }} />}
      </svg>
      <div style={{ position: 'absolute', left: 1180, top: 260, width: 610, opacity: smDeviceIn, transform: `translateY(${(1 - smDeviceIn) * 44}px)` }}>
        <div style={{ borderRadius: 40, background: 'linear-gradient(145deg, #2b3846, #0b1016)', padding: 14, boxShadow: '0 42px 120px rgba(0,0,0,0.6)' }}>
          <div style={{ borderRadius: 30, background: APP_CANVAS, overflow: 'hidden', padding: '30px 26px 34px' }}>
            <div style={{ color: MUTED, fontFamily: DISPLAY, fontSize: 22, letterSpacing: 3, fontWeight: 600 }}>SITE MANAGER · SIPHO NKOSI</div>
            <div style={{ marginTop: 18, borderRadius: 18, border: `2px solid rgba(${hexToRgb(CORAL)},0.4)`, background: `rgba(${hexToRgb(CORAL)},0.08)`, padding: 22 }}>
              <AppBadge text="NCR · CCV ESCALATION" color={CORAL} size={22} />
              <div style={{ marginTop: 14, color: FG, fontFamily: DISPLAY, fontWeight: 700, fontSize: 32 }}>Sandrox PA · Crate washers 1</div>
              <div style={{ marginTop: 10, color: FG2, fontFamily: BODY, fontSize: 21, lineHeight: 1.45 }}>
                First reading 3.0 % · re-test 3.5 % — both out of 0.3–2.0 %.
                <br />
                Corrective: re-mixed the dilution. Pump suspect.
              </div>
            </div>
            <div style={{ marginTop: 20, borderRadius: 14, border: `1px solid ${APP_BORDER}`, background: SURFACE, padding: '16px 20px', opacity: 0.4 + ackIn * 0.6 }}>
              <div style={{ color: MUTED, fontFamily: DISPLAY, fontSize: 22, letterSpacing: 3, fontWeight: 600 }}>ACKNOWLEDGE + SIGN</div>
              <svg width={520} height={92} style={{ marginTop: 6 }}>
                <path d="M 20 62 C 60 18, 90 78, 130 48 C 168 20, 190 66, 232 50 C 274 34, 300 64, 350 42 C 392 24, 420 58, 470 40" fill="none" stroke={FG} strokeWidth={3.4} strokeLinecap="round" strokeDasharray={700} strokeDashoffset={700 - signP * 700} />
                <line x1={20} y1={80} x2={500} y2={80} stroke={APP_BORDER} strokeWidth={2} />
              </svg>
            </div>
            <div style={{ marginTop: 18, opacity: signP >= 1 ? 1 : 0 }}>
              <AppBadge text="ACKNOWLEDGED · SIGNED" color={EMERALD} size={23} appear={signP >= 1 ? 1 : 0} />
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, color: 'rgba(255,255,255,0.6)', fontFamily: DISPLAY, fontSize: 26, fontWeight: 600, letterSpacing: 3.5, textAlign: 'center' }}>SITE MANAGER — THEIR OWN DEVICE</div>
      </div>
      <div style={{ position: 'absolute', left: 640, right: 0, bottom: 88, display: 'flex', justifyContent: 'center' }}>
        <ProofChip text="Accountability travels up the chain — automatically." appear={seg(sec, 19.4, 20.3)} />
      </div>
    </AbsoluteFill>
  );
};

/** Beat 12 — the July offline relay, re-implemented (queue, buzz, strict-order relay, duplicate turned away). */
const BATONS = [
  { n: 1, label: 'ISSUE', color: SKY, localId: 'local_9ce' },
  { n: 2, label: 'VERIFY', color: EMERALD, localId: 'local_f07' },
  { n: 3, label: 'RE-CHECK', color: AMBER, localId: 'local_b12' },
];
const Baton: React.FC<{ b: (typeof BATONS)[number]; x: number; y: number; synced: number; ghost?: boolean; opacity?: number; scale?: number }> = ({ b, x, y, synced, ghost = false, opacity = 1, scale = 1 }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: 250, borderRadius: 18, border: ghost ? `2px dashed rgba(${hexToRgb(b.color)},0.8)` : undefined, background: ghost ? 'rgba(255,255,255,0.03)' : `rgba(${hexToRgb(b.color)},0.13)`, padding: '14px 18px', opacity, transform: `scale(${scale})`, boxShadow: ghost ? undefined : `0 12px 34px rgba(0,0,0,0.4), 0 0 22px rgba(${hexToRgb(b.color)},0.25)` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: b.color, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontWeight: 700, fontSize: 22 }}>{b.n}</div>
      <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 1.6 }}>{b.label}</div>
    </div>
    <div style={{ marginTop: 10, fontFamily: 'monospace', fontSize: 19, color: synced > 0.5 ? EMERALD : 'rgba(255,255,255,0.55)' }}>{synced > 0.5 ? '✓ real id · server' : b.localId}</div>
  </div>
);
const OfflineScene: React.FC<SceneProps> = ({ beat, sec: abs, opacity }) => {
  const sec = voSec(beat, abs);
  const textIn = riseBy(abs, beatStart(beat), RING_IN_FRAMES);
  const offline = seg(sec, 1.6, 2.1);
  const online = seg(sec, 12.9, 13.4);
  const fireAt = [3.8, 5.9, 8.0];
  const railY = 700;
  const queueX = (i: number) => 210 + i * 300;
  const runAt = [14.0, 15.1, 16.2];
  const dupP = easeInOut(seg(sec, 19.4, 20.9));
  const dupBounce = easeInOut(seg(sec, 20.9, 22.0));
  const gateX = 1290;
  return (
    <AbsoluteFill style={{ background: INK, opacity }}>
      <SceneBackdrop variant="deep" />
      <div style={{ position: 'absolute', left: 120, top: 66, width: 1700 }}>
        <ChipLabel text="Factory floors have dead spots" appear={textIn} />
        <CcvHeadline text="Offline is a relay, not a risk." appear={textIn} size={70} width={1300} />
      </div>
      <div style={{ position: 'absolute', right: 140, top: 96, display: 'flex', alignItems: 'center', gap: 14, borderRadius: 999, border: `2px solid ${online > 0.5 ? EMERALD : offline > 0.5 ? CORAL : 'rgba(255,255,255,0.3)'}`, background: 'rgba(255,255,255,0.05)', padding: '12px 24px', opacity: seg(sec, 0.6, 1.2) }}>
        <div style={{ width: 16, height: 16, borderRadius: 8, background: online > 0.5 ? EMERALD : offline > 0.5 ? CORAL : 'rgba(255,255,255,0.4)', boxShadow: `0 0 16px ${online > 0.5 ? EMERALD : CORAL}` }} />
        <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 600, fontSize: 27, letterSpacing: 2 }}>{online > 0.5 ? 'SIGNAL RESTORED' : offline > 0.5 ? 'AIRPLANE MODE — NO SIGNAL' : 'CONNECTED'}</div>
      </div>
      <div style={{ position: 'absolute', left: 150, top: 300, display: 'flex', gap: 34 }}>
        {BATONS.map((b, i) => {
          const fired = seg(sec, fireAt[i], fireAt[i] + 0.45);
          const hapt = seg(sec, fireAt[i], fireAt[i] + 0.8);
          return (
            <div key={b.label} style={{ position: 'relative', opacity: seg(sec, 2.4, 3.0) }}>
              <div style={{ width: 320, borderRadius: 18, border: `2px solid rgba(255,255,255,${0.14 + fired * 0.3})`, background: 'rgba(255,255,255,0.05)', padding: '20px 24px', transform: `scale(${1 + Math.sin(clamp01(hapt) * Math.PI) * 0.05})` }}>
                <div style={{ color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 1.6 }}>{b.label === 'ISSUE' ? 'RECORD ISSUE' : b.label === 'VERIFY' ? 'VERIFY READING' : 'VERIFY AGAIN'}</div>
                <div style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 10, color: EMERALD, fontFamily: BODY, fontWeight: 700, fontSize: 22, opacity: fired }}>
                  <span style={{ fontSize: 24 }}>✓</span> SAVED LOCALLY · buzz
                </div>
              </div>
              {hapt > 0 && hapt < 1 && <div style={{ position: 'absolute', inset: -14 - hapt * 22, borderRadius: 18, border: `2px solid rgba(${hexToRgb(b.color)},${(1 - hapt) * 0.7})` }} />}
            </div>
          );
        })}
      </div>
      <div style={{ position: 'absolute', left: 150, top: railY - 40, color: 'rgba(255,255,255,0.5)', fontFamily: DISPLAY, fontSize: 22, letterSpacing: 3, fontWeight: 600, opacity: seg(sec, 3.4, 4.0) }}>OFFLINE QUEUE — STRICT ORDER: ISSUES → VERIFICATIONS → ESCALATION ACKS</div>
      <div style={{ position: 'absolute', left: 140, top: railY + 116, width: 1640, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.12)', opacity: seg(sec, 3.4, 4.0) }} />
      <div style={{ position: 'absolute', left: gateX, top: railY - 34, width: 190, height: 218, borderRadius: 18, border: `3px solid rgba(${hexToRgb(dupBounce > 0 && dupBounce < 1 ? CORAL : SKY)},${0.5 + 0.3 * Math.sin(sec * 4)})`, background: `rgba(${hexToRgb(SKY)},0.06)`, opacity: seg(sec, 12.4, 13.2), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ color: SKY, fontFamily: DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 2 }}>SYNC</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', fontSize: 17 }}>clientOpId</div>
        <div style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', fontSize: 17 }}>gate</div>
      </div>
      {BATONS.map((b, i) => {
        const dropped = easeInOut(seg(sec, fireAt[i] + 0.3, fireAt[i] + 0.9));
        if (dropped <= 0) return null;
        const run = easeInOut(seg(sec, runAt[i], runAt[i] + 1.0));
        const x = interpolate(run, [0, 1], [queueX(i), gateX + 150]);
        const dropY = interpolate(dropped, [0, 1], [430, railY]);
        const gone = 1 - easeInOut(seg(sec, runAt[i] + 1.0, runAt[i] + 1.45));
        return <Baton key={b.n} b={b} x={x} y={run > 0 ? railY : dropY} synced={run} opacity={dropped * gone} />;
      })}
      <div style={{ position: 'absolute', right: 140, top: railY - 12, width: 240 }}>
        {BATONS.map((b, i) => {
          const done = seg(sec, runAt[i] + 1.3, runAt[i] + 1.7);
          return (
            <div key={b.n} style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, opacity: done }}>
              <div style={{ color: EMERALD, fontSize: 26, fontWeight: 800 }}>✓</div>
              <div style={{ color: 'rgba(255,255,255,0.75)', fontFamily: BODY, fontSize: 24 }}>{b.label.toLowerCase()} → real id</div>
            </div>
          );
        })}
      </div>
      {dupP > 0 && <Baton b={{ ...BATONS[1], localId: 'local_9ce (retry)' }} x={interpolate(dupP, [0, 1], [420, gateX - 240]) - dupBounce * 300} y={railY + interpolate(dupBounce, [0, 0.5, 1], [0, -60, 26])} synced={0} ghost opacity={dupP * (1 - seg(sec, 22.6, 23.6))} scale={1 - dupBounce * 0.12} />}
      {dupBounce > 0.15 && (
        <div style={{ position: 'absolute', left: gateX - 130, top: railY - 90, color: CORAL, fontFamily: DISPLAY, fontWeight: 700, fontSize: 30, letterSpacing: 2, opacity: dupBounce * (1 - seg(sec, 23.4, 24.2)), textShadow: `0 0 24px rgba(${hexToRgb(CORAL)},0.5)` }}>DUPLICATE — TURNED AWAY</div>
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', gap: 26 }}>
        {['Nothing lost.', 'Nothing doubled.'].map((t, i) => {
          const a = seg(sec, 23.8 + i * 0.7, 24.5 + i * 0.7);
          return (
            <div key={t} style={{ borderRadius: 999, border: `2px solid rgba(${hexToRgb(i === 0 ? EMERALD : SKY)},0.6)`, background: `rgba(${hexToRgb(i === 0 ? EMERALD : SKY)},0.12)`, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 1.6, padding: '16px 36px', opacity: a, transform: `scale(${0.8 + a * 0.2})` }}>
              {t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Beat 13 — the close card (eyebrow + headline land on the first frame; the rest on their cues). */
const CloseScene: React.FC<SceneProps> = ({ beat, sec, start, opacity }) => {
  const s = (cue?: string) => (cue ? rise(sec, cueAt(beat, cue), 18) : riseBy(sec, start, RING_IN_FRAMES));
  const line = (text: string, appear: number, size: number, color: string, family: string, marginTop: number) => (
    <div style={{ marginTop, color, fontFamily: family, fontWeight: family === DISPLAY ? 700 : 500, fontSize: size, lineHeight: family === DISPLAY ? 1 : 1.32, opacity: appear, transform: `translateY(${(1 - appear) * 18}px)` }}>{text}</div>
  );
  return (
    <AbsoluteFill style={{ background: `linear-gradient(160deg, ${HERO_A}, ${HERO_B})`, opacity }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 78% 22%, rgba(${hexToRgb(SKY)},0.16), transparent 34%)` }} />
      <div style={{ position: 'absolute', left: 150, top: 0, width: 1620, height: 1080, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Eyebrow text="Close" appear={s()} />
        {line('Measured, not assumed.', s(), 124, '#fff', DISPLAY, 22)}
        {line('Recorded at the time.', s('recorded at the time'), 124, EMERALD, DISPLAY, 8)}
        {line('The certificate tells you first. The standard is already set. Fail, and it walks you through re-test and escalation.', s('Fail, and the app'), 36, 'rgba(255,255,255,0.8)', BODY, 40)}
        <div style={{ marginTop: 56 }}>
          <Eyebrow text="e-wizer · Ecowize" appear={s('One that never blinks')} color="rgba(255,255,255,0.6)" />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SCENES: Record<string, React.FC<SceneProps>> = {
  '01-hook': HookScene,
  '10-escalate': EscalationScene,
  '12-offline': OfflineScene,
  '13-close': CloseScene,
};

// ─── Phone stage ──
const PhoneShot: React.FC<{ beat: Beat; shot: string; opacity: number }> = ({ beat, shot, opacity }) => {
  const exists = useAssetExists(shotPath(shot));
  if (opacity <= 0.004) return null;
  const scale = PHONE_H / (STILL_H - CROP_TOP);
  return exists ? <ComposedStill still={shot} left={0} top={-CROP_TOP * scale} scale={scale} plan={effectiveShot(shot, beat)} opacity={opacity} /> : <StillPlaceholder label={shot} opacity={opacity} />;
};

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const sec = frame / FPS;
  const beats = T.beats;
  const active = Math.max(0, beats.findIndex((_, i) => frame >= sceneStart[i] && frame < sceneEnd[i]));
  const beat = beats[active];
  const isScene = Boolean(SCENES[beat.id]);
  const local = sec - beat.voStart;
  const bar = interpolate(active + clamp01(local / Math.max(beat.duration, 1)), [0, beats.length], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Phone stills: each phone beat's stills crossfade in at its scene start (with the caption) and
  // hold until the next phone beat's scene start; in-beat switches follow SHOT_PLAN cues.
  const phoneBeats = beats.filter((b) => !SCENES[b.id] && (b.shot || SHOT_PLAN[b.id]));
  const shots = phoneBeats.flatMap((b, i) => {
    const start = beatStart(b);
    const nextStart = i + 1 < phoneBeats.length ? beatStart(phoneBeats[i + 1]) : T.total_seconds + 1;
    const beatOpacity = riseBy(sec, start, RING_IN_FRAMES) * (1 - riseBy(sec, nextStart, RING_IN_FRAMES));
    if (beatOpacity <= 0.004) return [];
    return shotSteps(b, sec).map((s) => ({ key: `${b.id}-${s.shot}`, beat: b, shot: s.shot, opacity: beatOpacity * s.opacity }));
  });

  // Right-hand explainer per phone beat: chip + headline fully up on the beat's first frame.
  const columns = beats.map((b, i) => {
    if (SCENES[b.id]) return null;
    const start = sceneStart[i] / FPS;
    const end = sceneEnd[i] / FPS;
    const textIn = riseBy(sec, start, RING_IN_FRAMES) * (1 - seg(sec, end - 0.8, end - 0.5));
    if (textIn <= 0.004) return null;
    const zooms = zoomSteps(b, sec, 1 - seg(sec, end - 0.8, end - 0.5));
    return { beat: b, index: i, textIn, zooms };
  });

  return (
    <AbsoluteFill style={{ background: HERO_B, fontFamily: BODY }}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 24% 18%, rgba(${hexToRgb(SKY)},0.14), transparent 26%), linear-gradient(135deg, ${HERO_A}, ${HERO_B} 62%)` }} />
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
            {shots.map((s) => (
              <PhoneShot key={s.key} beat={s.beat} shot={s.shot} opacity={s.opacity} />
            ))}
            {!isScene && <BeatRings beat={beat} sec={sec} mapper={mapper} />}
          </>
        )}
      />

      {columns.map((col) => {
        if (!col) return null;
        const copy = COPY[col.beat.id] ?? { headline: col.beat.chip };
        return (
          <div key={col.beat.id} style={{ position: 'absolute', left: STAGE_X, top: 40, width: STAGE_W }}>
            <div style={{ display: 'inline-block', marginBottom: 14, background: 'rgba(11,18,25,0.78)', borderRadius: 999, padding: '6px 12px', color: 'rgba(255,255,255,0.86)', fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', fontVariantNumeric: 'tabular-nums', opacity: col.textIn }}>
              Step {String(col.index + 1).padStart(2, '0')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <Chip n={col.index + 1} label={col.beat.chip} appear={col.textIn} />
              <div style={{ color: 'rgba(255,255,255,0.58)', fontFamily: BODY, fontSize: 26, fontWeight: 700, fontVariantNumeric: 'tabular-nums', opacity: col.textIn }}>
                {col.index + 1} / {beats.length}
              </div>
            </div>
            <Headline text={copy.headline} appear={col.textIn} size={64} width={STAGE_W} />
            {copy.body ? <BodyText text={copy.body} appear={col.textIn} width={STAGE_W - 80} /> : null}
            {col.beat.id === '04-issue' ? (
              <div style={{ position: 'relative', marginTop: 30, height: 200 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W }}>
                  <IssueWalkPanel beat={col.beat} sec={sec} appear={col.textIn} />
                </div>
                <div style={{ position: 'absolute', left: 0, top: 0, width: STAGE_W }}>
                  <ComputedPanel beat={col.beat} sec={sec} appear={col.textIn} />
                </div>
              </div>
            ) : null}
            {col.zooms.length ? (
              <div style={{ position: 'relative', marginTop: 28, height: ZOOM_MAX_H }}>
                {col.zooms.map(({ step, appear }) => (
                  <div key={step.box ?? step.cue} style={{ position: 'absolute', left: 0, top: 0 }}>
                    <ZoomPanel beat={col.beat} zoom={step} appear={appear} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}

      {/* progress + series footer */}
      <div style={{ position: 'absolute', left: STAGE_X, bottom: 54, width: STAGE_W, height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
        <div style={{ width: `${bar * 100}%`, height: '100%', borderRadius: 999, background: `linear-gradient(90deg, ${SKY}, ${EMERALD})` }} />
      </div>
      <div style={{ position: 'absolute', left: STAGE_X, bottom: 74, color: 'rgba(255,255,255,0.45)', fontFamily: BODY, fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' }}>Ecowize Academy · Chemical Concentration Verification</div>

      {/* full-frame scenes crossfade over the stage during the previous beat's tail; a scene followed
          by another scene stays up underneath it; the last beat holds to the end (BrandOutro follows) */}
      {beats.map((b, i) => {
        const Scene = SCENES[b.id];
        if (!Scene) return null;
        const start = sceneStart[i] / FPS;
        const end = sceneEnd[i] / FPS;
        const holds = i === beats.length - 1 || Boolean(SCENES[beats[i + 1].id]);
        const op = seg(sec, start - 0.4, start) * (holds ? 1 : 1 - seg(sec, end - 0.4, end));
        if (op <= 0.004 || sec >= end + 0.5) return null;
        return <Scene key={b.id} beat={b} sec={sec} start={start} opacity={op} />;
      })}
    </AbsoluteFill>
  );
};

// ─── Audio: VO spine only — the music bed lives under the bookends ──
const TutorialAudio: React.FC = () => (
  <>
    {T.beats.map((b) => (
      <Sequence key={`vo-${b.id}`} from={Math.round(b.voStart * FPS)} durationInFrames={Math.ceil(b.duration * FPS) + 4} premountFor={FPS}>
        <GuardedAudio src={b.audio} volume={NARRATION_VOLUME} />
      </Sequence>
    ))}
  </>
);

export const CcvRefresh: React.FC = () => {
  useCcvFonts();
  return (
    <AbsoluteFill style={{ background: HERO_B }}>
      <Stage />
      <TutorialAudio />
    </AbsoluteFill>
  );
};

// ─── Proofs (still only): composed regions at 2× beside their raw ──
export const Ccv2ComposeProof: React.FC = () => {
  useCcvFonts();
  type Crop = { id: string; label: string; x: number; y: number; w: number; h: number; s: number };
  const cell = (c: Crop, composed: boolean) => (
    <div style={{ position: 'relative', width: c.w * c.s, height: c.h * c.s, overflow: 'hidden', borderRadius: 10 }}>
      <ComposedStill still={COMPOSE_PLAN[c.id].base} left={-c.x * c.s} top={-c.y * c.s} scale={c.s} plan={composed ? COMPOSE_PLAN[c.id] : null} />
    </div>
  );
  const label = (text: string) => <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: SKY_DEEP, margin: '0 0 6px' }}>{text}</div>;
  const form: Crop[] = [
    { id: '04-issue', label: '04 · batch / lot — raw, composed', x: 32, y: 480, w: 656, h: 160, s: 1.4 },
    { id: '04-issue', label: '04 · chemical + water — raw, composed', x: 32, y: 1120, w: 656, h: 160, s: 1.4 },
  ];
  const lock: Crop = { id: '06-lock', label: '06 · station, range hero, no-spec banner — raw | composed', x: 32, y: 320, w: 656, h: 1040, s: 0.66 };
  return (
    <AbsoluteFill style={{ background: CANVAS, fontFamily: BODY, color: APP_INK }}>
      {form.map((c, i) => (
        <div key={c.label} style={{ position: 'absolute', left: 40, top: 12 + i * 540 }}>
          {label(c.label)}
          {cell(c, false)}
          <div style={{ height: 12 }} />
          {cell(c, true)}
        </div>
      ))}
      <div style={{ position: 'absolute', left: 1000, top: 12 }}>
        {label(lock.label)}
        <div style={{ display: 'flex', gap: 20 }}>
          {cell(lock, false)}
          {cell(lock, true)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Branded cut: BrandIntro 150f + tutorial + BrandOutro 180f; bed under the bookends only ──
const BookendAudio: React.FC = () => {
  const outroStart = BOOKEND_INTRO_FRAMES + CCV2_TUTORIAL_FRAMES;
  return (
    <>
      <Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES + SEAM_FRAMES} premountFor={FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, BOOKEND_INTRO_FRAMES + SEAM_FRAMES, 24)} />
      </Sequence>
      <Sequence from={outroStart - SEAM_FRAMES} durationInFrames={BOOKEND_OUTRO_FRAMES + SEAM_FRAMES} premountFor={FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, BOOKEND_OUTRO_FRAMES + SEAM_FRAMES, 28)} />
      </Sequence>
    </>
  );
};

export const CcvRefreshBranded: React.FC = () => {
  useCcvFonts();
  const outroStart = BOOKEND_INTRO_FRAMES + CCV2_TUTORIAL_FRAMES;
  return (
    <AbsoluteFill style={{ background: HERO_B }}>
      <BookendAudio />
      <Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES} premountFor={FPS}>
        <BrandIntro kicker="Ecowize Academy · video 03" title="Chemical Concentration Verification" tagline="The second pair of eyes on every drum, every satellite, every dilution point." accentA={SKY} accentB={EMERALD} />
      </Sequence>
      <Sequence from={BOOKEND_INTRO_FRAMES} durationInFrames={CCV2_TUTORIAL_FRAMES} premountFor={FPS}>
        <CcvRefresh />
      </Sequence>
      <Sequence from={outroStart} durationInFrames={BOOKEND_OUTRO_FRAMES} premountFor={FPS}>
        <BrandOutro
          outroKicker="Chemical Concentration Verification"
          outroHeadline="Measured, not assumed."
          outroBody="The certificate tells you first. The standard is already set. Recorded at the time."
          outroCards={[
            { label: 'Issue', color: SKY },
            { label: 'Verify', color: AMBER },
            { label: 'Record', color: EMERALD },
          ]}
          accentA={SKY}
          accentB={EMERALD}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
