import React, { useEffect } from 'react';
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
import { LogoLockup } from '../brand/EcowizeBookends';
import timing from './timing.json';
import measured from './boxes.json';

export const BOH_ALT_FPS = timing.fps;
export const BOH_ALT_FRAMES = timing.total_frames;
export const BOH_ALT_INTRO_FRAMES = 150;
export const BOH_ALT_OUTRO_FRAMES = 180;
export const BOH_ALT_BRANDED_FRAMES = BOH_ALT_INTRO_FRAMES + BOH_ALT_FRAMES + BOH_ALT_OUTRO_FRAMES;

const FPS = BOH_ALT_FPS;
const BODY = '"DM Sans", sans-serif';
const DISPLAY = '"Barlow Condensed", sans-serif';
const C = {
  sky: '#3CB6E0', skyDeep: '#1582AB', emerald: '#1F9C5A', amber: '#E89A30', coral: '#D6432F',
  ink: '#141A21', muted: '#505B69', paper: '#F1F4F8', navy: '#0B1219',
};
type Beat = (typeof timing.beats)[number];
type BoxName = keyof typeof measured.boxes;
type Box = (typeof measured.boxes)[BoxName];
type Rect = { nx: number; ny: number; nw: number; nh: number };
const BOXES = measured.boxes;
const W = measured.sourceSize.width;
const H = measured.sourceSize.height;
const PHONE_SCALE = 0.53;
const COLUMN_X = 640;
const COLUMN_W = 1156; // right edge 1796: 124px inside the frame
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = (n: number) => 1 - (1 - clamp(n)) ** 3;
const mix = (frame: number, frames: number[], values: number[]) => interpolate(frame, frames, values, {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
const colorOf = (box: Box) => C[box.color as keyof typeof C];
const sceneStarts = timing.beats.map((beat, i) => i === 0 ? 0 : Math.round((beat.voStart - 0.6) * FPS));
const sceneEnd = (i: number) => sceneStarts[i + 1] ?? BOH_ALT_FRAMES;

// Font gates belong to an effect mount, never to module evaluation or a render.
// Every resolve, rejection, synchronous error, timeout and unmount releases it.
const FACES = [
  ['Barlow Condensed', 'BarlowCondensed_600SemiBold.ttf', '600'],
  ['Barlow Condensed', 'BarlowCondensed_700Bold.ttf', '700'],
  ['DM Sans', 'DMSans_400Regular.ttf', '400'],
  ['DM Sans', 'DMSans_500Medium.ttf', '500'],
  ['DM Sans', 'DMSans_700Bold.ttf', '700'],
] as const;
const useAltFonts = () => {
  useEffect(() => {
    const handle = delayRender('boh-alt fonts: this mount', { timeoutInMilliseconds: 30000 });
    let finished = false;
    let cutoff: ReturnType<typeof setTimeout> | undefined;
    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(cutoff);
      continueRender(handle);
    };
    cutoff = setTimeout(finish, 15000);
    try {
      if (typeof document === 'undefined' || typeof FontFace === 'undefined') {
        finish();
      } else {
        const fonts = document.fonts as FontFaceSet & { add: (face: FontFace) => void };
        const present = new Map<string, FontFace>();
        fonts.forEach((face) => present.set(`${face.family}|${face.weight}`, face));
        const loads = FACES.map(([family, file, weight]) => {
          let face = present.get(`${family}|${weight}`);
          if (!face) {
            face = new FontFace(family, `url(${staticFile(`ccv-tutorial/fonts/${file}`)})`, { weight });
            fonts.add(face);
          }
          return face.load(); // await existing faces even if another mount started loading them
        });
        void Promise.allSettled(loads).then(finish, finish);
      }
    } catch {
      finish();
    }
    return finish;
  }, []);
};

// Phrase cues are proportional estimates from the FINAL recording's script and duration.
// Scene timing and audio use the real timing JSON; no word alignment is implied.
const cueFrame = (beat: Beat, phrase: string) => {
  const index = beat.text.indexOf(phrase);
  return Math.round((beat.voStart + Math.max(0, index) / beat.text.length * beat.duration) * FPS);
};
const onCue = (beat: Beat, frame: number, phrase: string) => ease((frame - cueFrame(beat, phrase)) / 18);

type RingCue = { box: BoxName; cue?: string };
const RINGS: Partial<Record<string, RingCue[]>> = {
  '01-open': [{ box: 'homeTile' }, { box: 'homeBadge', cue: 'This is where you see' }],
  '02-ledger': [{ box: 'dailyBand' }, { box: 'carryDivider', cue: 'The three below' }],
  '03-row': [{ box: 'clnRow' }, { box: 'clnCount', cue: 'one hundred and thirty-five' }],
  '04-drilldown': [{ box: 'todoDivider' }],
  '05-section': [{ box: 'sectionRow' }, { box: 'sectionEyebrow', cue: 'The area above' }],
  '06-remedial': [{ box: 'remedialRow' }, { box: 'remedialCount', cue: 'the day is not complete' }],
  '07-carryover': [{ box: 'carryRows' }],
  '08-lookback': [{ box: 'dayLabel' }, { box: 'gapRow', cue: 'Sixty-six checks' }],
  '11-routine': [{ box: 'amberRowOne', cue: 'Anything amber' }],
};
const activeRings = (beat: Beat, frame: number) => (RINGS[beat.id] ?? []).map((step, i, plan) => {
  const next = plan[i + 1];
  const appear = step.cue ? onCue(beat, frame, step.cue) : 1;
  const handoff = next?.cue ? 1 - onCue(beat, frame, next.cue) : 1;
  return { box: BOXES[step.box], opacity: appear * handoff };
});

const Ring: React.FC<{ box: Box; scale: number; crop?: Rect; opacity?: number }> = ({ box, scale, crop, opacity = 1 }) => (
  <div style={{
    position: 'absolute', boxSizing: 'border-box',
    left: (box.nx - (crop?.nx ?? 0)) * W * scale,
    top: (box.ny - (crop?.ny ?? 0)) * H * scale,
    width: box.nw * W * scale, height: box.nh * H * scale,
    border: `3px ${box.provisional ? 'dashed' : 'solid'} ${colorOf(box)}`,
    borderRadius: Math.min(12, box.nh * H * scale / 4), opacity,
  }} />
);

const COPY: Record<string, { eyebrow: string; headline: string; body: string }> = {
  '01-open': { eyebrow: 'One site. One day. One record.', headline: 'Bill of Health', body: 'A certificate the shift writes, line by line, as the work gets done.' },
  '02-ledger': { eyebrow: 'The ledger', headline: 'Seven today. Three carry over.', body: 'Ten rows. Two different responsibilities.' },
  '03-row': { eyebrow: 'Reading one row', headline: 'Done. Outstanding. Colour.', body: 'Read the work and the status together.' },
  '04-drilldown': { eyebrow: 'The honest list', headline: 'What still needs doing?', body: 'Tap Cleaning Verification to see the sections still to do, then what is done today.' },
  '05-section': { eyebrow: 'Down to the section', headline: 'Give the floor a location.', body: 'The area, the section and the open checks belong together.' },
  '06-remedial': { eyebrow: 'Remedial · sign-off owed', headline: 'A fail is not finished.', body: 'The day is not complete until the supervisor has signed off the fix.' },
  '07-carryover': { eyebrow: 'Below the line', headline: 'Visible until resolved.', body: 'Inspection findings, non-conformances and incidents stay with the site.' },
  '08-lookback': { eyebrow: 'Yesterday’s certificate', headline: 'Look back. Not write back.', body: 'The record stays exactly as the day ended.' },
  '11-routine': { eyebrow: 'The supervisor’s routine', headline: 'Open it three times a day.', body: 'Tap the amber. Read the list. Send people where it says.' },
};
const PROVISIONAL: Record<string, string> = {
  '03-row': 'Current still: 536 / 536, Cleared. VO: 542 / 677, 135 due. Numbers do not match yet.',
  '05-section': 'Current still: follow-up rows; area below section. Toilets pair and open counts are pending.',
  '08-lookback': 'Current still: Remedial, 116 pending. The narrated 66 missed cleaning checks are not shown.',
  '11-routine': 'Current still: one amber Remedial row. The two-row mid-shift capture is pending.',
};

const Heading: React.FC<{ index: number; frame: number; eyebrow: string; headline: string; dark?: boolean }> = ({ index, frame, eyebrow, headline, dark = false }) => {
  const rise = ease((frame - sceneStarts[index] + 1) / 18);
  return (
    <div style={{ opacity: 0.82 + rise * 0.18, transform: `translateY(${(1 - rise) * 16}px)` }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', color: dark ? C.sky : C.skyDeep, fontSize: 22, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase' }}>
        <span style={{ border: `1px solid ${dark ? '#4C6170' : '#BDC9D2'}`, borderRadius: 6, padding: '7px 12px', whiteSpace: 'nowrap' }}>STEP {String(index + 1).padStart(2, '0')}</span>
        <span>{eyebrow}</span>
      </div>
      <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 90, lineHeight: 1.02, whiteSpace: 'pre-line', marginTop: 24, color: dark ? '#F4F7FA' : C.ink }}>
        {headline}
      </div>
    </div>
  );
};

const Footer: React.FC<{ index: number; dark?: boolean }> = ({ index, dark = false }) => (
  <div style={{ position: 'absolute', left: COLUMN_X, right: 124, bottom: 96, display: 'flex', alignItems: 'center', gap: 24 }}>
    <div style={{ color: dark ? '#9AA7B6' : C.muted, fontSize: 18, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Ecowize Academy · Bill of Health</div>
    <div style={{ display: 'flex', gap: 6, flex: 1 }}>
      {timing.beats.map((beat, i) => <div key={beat.id} style={{ height: 4, flex: 1, background: i <= index ? C.sky : dark ? '#30404C' : '#D7DEE5' }} />)}
    </div>
    <div style={{ color: dark ? '#9AA7B6' : C.muted, fontSize: 18 }}>{String(index + 1).padStart(2, '0')} / 12</div>
  </div>
);

const Phone: React.FC<{ beat: Beat; frame: number }> = ({ beat, frame }) => (
  <div style={{ position: 'absolute', left: 146, top: 104, padding: 14, borderRadius: 44, background: 'linear-gradient(130deg, #FFFFFF, #A9B6BF 52%, #E6ECF0)', boxShadow: '0 24px 58px #23374B24, 0 0 0 1px #BAC5CD' }}>
    <div style={{ position: 'relative', width: W * PHONE_SCALE, height: H * PHONE_SCALE, overflow: 'hidden', borderRadius: 30, background: C.paper, boxShadow: '0 0 0 5px #17212A' }}>
      <Img src={staticFile(`boh/shots/${beat.shot}.png`)} style={{ width: '100%', height: '100%' }} />
      {activeRings(beat, frame).map(({ box, opacity }, i) => <Ring key={i} box={box} scale={PHONE_SCALE} opacity={opacity} />)}
    </div>
  </div>
);

const ZOOMS: Record<string, Rect> = {
  '03-row': { nx: 16 / W, ny: 641 / H, nw: 688 / W, nh: 193 / H },
  '05-section': { nx: 36 / W, ny: 1035 / H, nw: 640 / W, nh: 104 / H },
};
const Zoom: React.FC<{ beat: Beat; frame: number }> = ({ beat, frame }) => {
  const crop = ZOOMS[beat.id];
  const scale = PHONE_SCALE * 2.4;
  const reveal = ease((frame - sceneStarts[timing.beats.indexOf(beat)] - 8) / 20);
  return (
    <div style={{ opacity: reveal, transform: `translateY(${(1 - reveal) * 12}px)` }}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 18, fontSize: 21, fontWeight: 700, letterSpacing: 2, color: C.skyDeep }}>
        <span style={{ width: 48, height: 2, background: C.sky }} />2.4× DETAIL · PROVISIONAL
      </div>
      <div style={{ position: 'relative', width: crop.nw * W * scale, height: crop.nh * H * scale, borderRadius: 16, overflow: 'hidden', boxShadow: '0 12px 32px #23374B16, 0 0 0 1px #CBD5DD', background: C.paper }}>
        <Img src={staticFile(`boh/shots/${beat.shot}.png`)} style={{ position: 'absolute', left: -crop.nx * W * scale, top: -crop.ny * H * scale, width: W * scale, height: H * scale }} />
        {activeRings(beat, frame).map(({ box, opacity }, i) => <Ring key={i} box={box} scale={scale} crop={crop} opacity={opacity} />)}
      </div>
    </div>
  );
};

const LedgerBands: React.FC<{ beat: Beat; frame: number }> = ({ beat, frame }) => {
  const below = onCue(beat, frame, 'The three below');
  return (
    <div style={{ width: 1060 }}>
      {[
        { number: '07', title: 'OWED BY THIS SHIFT', body: 'Start again every day', color: C.skyDeep, count: 7, active: 1 - below * 0.3 },
        { number: '03', title: 'CARRIES OVER', body: 'Stay open until resolved', color: '#AB6911', count: 3, active: 0.65 + below * 0.35 },
      ].map((band, i) => (
        <React.Fragment key={band.title}>
          {i === 1 && <div style={{ display: 'flex', alignItems: 'center', gap: 18, margin: '20px 0', color: C.muted, fontSize: 18, letterSpacing: 2 }}><div style={{ height: 1, background: '#CBD5DD', flex: 1 }} />THE LINE<div style={{ height: 1, background: '#CBD5DD', flex: 1 }} /></div>}
          <div style={{ display: 'flex', alignItems: 'center', gap: 30, padding: '24px 30px', borderRadius: 14, background: i ? '#FBEEDB' : '#E5F4FB', opacity: band.active, borderLeft: `6px solid ${band.color}` }}>
            <div style={{ color: band.color, fontFamily: DISPLAY, fontWeight: 700, fontSize: 94, lineHeight: 1 }}>{band.number}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 23, letterSpacing: 2, color: band.color }}>{band.title}</div>
              <div style={{ marginTop: 6, fontSize: 30, color: C.ink }}>{band.body}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>{Array.from({ length: band.count }, (_, j) => <div key={j} style={{ width: 68, height: 10, borderRadius: 3, background: band.color }} />)}</div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

const NoteRows: React.FC<{ rows: Array<[string, string]>; color?: string }> = ({ rows, color = C.skyDeep }) => (
  <div style={{ width: 1060 }}>
    {rows.map(([title, body], i) => (
      <div key={title} style={{ display: 'flex', gap: 24, padding: '22px 0', borderBottom: '1px solid #D8E0E7' }}>
        <div style={{ fontFamily: DISPLAY, fontSize: 38, fontWeight: 600, color, width: 36 }}>{String(i + 1).padStart(2, '0')}</div>
        <div><div style={{ fontSize: 32, fontWeight: 700, color: C.ink }}>{title}</div><div style={{ fontSize: 26, color: C.muted, marginTop: 5 }}>{body}</div></div>
      </div>
    ))}
  </div>
);

const PhoneDetails: React.FC<{ beat: Beat; frame: number }> = ({ beat, frame }) => {
  if (ZOOMS[beat.id]) return (
    <>
      <Zoom beat={beat} frame={frame} />
      {beat.id === '03-row' && <div style={{ display: 'flex', gap: 28, marginTop: 28 }}>{[[C.emerald, 'Closed'], [C.amber, 'Still open'], [C.coral, 'Overdue / decision']].map(([color, text]) => <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 23, color: C.muted }}><span style={{ width: 13, height: 13, borderRadius: 7, background: color }} />{text}</div>)}</div>}
    </>
  );
  if (beat.id === '02-ledger') return <LedgerBands beat={beat} frame={frame} />;
  if (beat.id === '01-open') return <NoteRows rows={[
    ['What is due', 'The work owed by the shift.'], ['What is done', 'The record made by the person doing it.'], ['What is not', 'The work that still needs attention.'],
  ]} />;
  if (beat.id === '04-drilldown') return <NoteRows rows={[
    ['Still to do', 'The actual sections outstanding today.'], ['Done today · Passed', 'Checks already captured and passed.'], ['Done today · Follow-up owed', 'Failed checks awaiting the next step.'],
  ]} />;
  if (beat.id === '06-remedial') return <NoteRows color={C.amber} rows={[
    ['The operative’s fail', 'Record one: the check that failed.'], ['The fix', 'Record two: the work to put it right.'], ['The supervisor’s signature', 'Record three: review the fix and sign it off.'],
  ]} />;
  if (beat.id === '07-carryover') return <NoteRows color={C.amber} rows={[
    ['Inspection Remedials', 'A finding may need a planned shutdown.'], ['Non-conformances', 'A resolution may need capital.'], ['Incidents', 'An investigation follows its own course.'],
  ]} />;
  if (beat.id === '08-lookback') return <div style={{ padding: 38, width: 982, borderRadius: 16, background: C.navy, color: '#F4F7FA' }}>
    <div style={{ color: C.sky, fontSize: 22, letterSpacing: 3 }}>THE DAY IS CLOSED</div>
    <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 66, marginTop: 18 }}>You can look back.</div>
    <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 66, color: '#F18D7F', marginTop: 8, opacity: 0.65 + 0.35 * onCue(beat, frame, 'you cannot write back') }}>You cannot write back.</div>
  </div>;
  return <NoteRows color={C.emerald} rows={[
    ['Start of shift', 'See what is owed.'], ['Mid-shift', 'Chase the work still open.'], ['Before handover', 'Seven rows to green before the day ends.'],
  ]} />;
};

const PhoneScene: React.FC<{ beat: Beat; index: number; frame: number }> = ({ beat, index, frame }) => {
  const copy = COPY[beat.id];
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(115deg, #E2EAF0, #F8FAFC 40%, #F1F4F8)' }}>
      <div style={{ position: 'absolute', left: 112, top: 96, width: 3, height: 888, background: '#C8D6E0' }} />
      <Phone beat={beat} frame={frame} />
      <div style={{ position: 'absolute', left: COLUMN_X, top: 104, width: COLUMN_W }}>
        <Heading index={index} frame={frame} eyebrow={copy.eyebrow} headline={copy.headline} />
        <div style={{ fontSize: 32, lineHeight: 1.35, color: C.muted, marginTop: 24, maxWidth: 1080 }}>{copy.body}</div>
      </div>
      <div style={{ position: 'absolute', left: COLUMN_X, top: 444, width: COLUMN_W }}><PhoneDetails beat={beat} frame={frame} /></div>
      {PROVISIONAL[beat.id] && <div style={{ position: 'absolute', left: COLUMN_X, top: 832, width: COLUMN_W, boxSizing: 'border-box', padding: '16px 22px', border: `2px dashed ${C.amber}`, background: '#FFF5E5', borderRadius: 10 }}>
        <div style={{ fontSize: 18, letterSpacing: 2, fontWeight: 700, color: '#8A5208' }}>PROVISIONAL RINGS · MONDAY RECAPTURE</div>
        <div style={{ fontSize: 22, lineHeight: 1.25, color: '#684D28', marginTop: 5 }}>{PROVISIONAL[beat.id]}</div>
      </div>}
      <Footer index={index} />
    </AbsoluteFill>
  );
};

const RuleCard: React.FC<{ beat: Beat; frame: number }> = ({ beat, frame }) => {
  const closed = onCue(beat, frame, 'Once that day closes');
  return (
    <AbsoluteFill style={{ background: C.navy, color: '#F4F7FA' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 85% 0%, #203B4C, transparent 60%)' }} />
      <div style={{ position: 'absolute', left: 128, top: 128, width: 1668 }}>
        <Heading index={8} frame={frame} eyebrow="The rule" headline="One opportunity." dark />
        <div style={{ fontSize: 36, lineHeight: 1.35, color: '#B9C6D0', width: 1450, marginTop: 28 }}>The person who did the work. The photo taken then. The record made in the moment.</div>
        <div style={{ display: 'flex', gap: 42, marginTop: 70 }}>
          <div style={{ width: 730, padding: 32, background: '#152630', borderTop: `5px solid ${C.sky}`, borderRadius: 12 }}>
            <div style={{ fontSize: 22, letterSpacing: 3, color: C.sky }}>DURING THE SHIFT</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 66, fontWeight: 600, marginTop: 16 }}>Record it. Check it.</div>
            <div style={{ fontSize: 30, lineHeight: 1.35, marginTop: 18, color: '#BCC9D3' }}>A mistake noticed during the shift can be corrected during the shift.</div>
          </div>
          <div style={{ width: 730, padding: 32, background: '#261F23', borderTop: `5px solid ${C.coral}`, borderRadius: 12 }}>
            <div style={{ fontSize: 22, letterSpacing: 3, color: '#F18D7F' }}>ONCE THE DAY CLOSES</div>
            <div style={{ fontFamily: DISPLAY, fontSize: 66, fontWeight: 600, marginTop: 16 }}>It stays as it was.</div>
            <div style={{ fontSize: 30, lineHeight: 1.35, marginTop: 18, color: '#D4BFC3' }}>Yesterday cannot be tidied up later.</div>
            <div style={{ color: '#F18D7F', fontSize: 20, fontWeight: 700, letterSpacing: 3, marginTop: 22, opacity: 0.7 + closed * 0.3 }}>CLOSED DAY · LOOK BACK ONLY</div>
          </div>
        </div>
      </div>
      <Footer index={8} dark />
    </AbsoluteFill>
  );
};

const DiligenceCard: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: '#F1F4F8' }}>
    <div style={{ position: 'absolute', left: 128, top: 128, width: 740 }}>
      <Heading index={9} frame={frame} eyebrow="Due diligence" headline={'“Show me”\nbeats “tell me.”'} />
      <div style={{ fontSize: 32, lineHeight: 1.4, color: C.muted, marginTop: 30 }}>All reasonable steps, taken at the time and recorded at the time.</div>
      <div style={{ marginTop: 46 }}>{['FSSC 22000', 'Retailer audits', 'Regulation R638'].map((label, i) => <div key={label} style={{ display: 'flex', gap: 18, alignItems: 'center', fontSize: 28, color: C.ink, padding: '17px 0', borderBottom: '1px solid #D1DBE3' }}><span style={{ color: C.skyDeep, fontFamily: DISPLAY, fontSize: 30 }}>0{i + 1}</span>{label}</div>)}</div>
    </div>
    <div style={{ position: 'absolute', left: 980, top: 192, width: 816, height: 636, borderRadius: 18, background: '#FFFFFF', boxShadow: '0 22px 54px #243A4B20', overflow: 'hidden' }}>
      <div style={{ background: C.navy, color: '#F4F7FA', padding: '28px 38px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><div style={{ fontSize: 18, letterSpacing: 3, color: C.sky }}>THE EVIDENCE</div><div style={{ fontFamily: DISPLAY, fontSize: 46, fontWeight: 600, marginTop: 6 }}>Bill of Health</div></div>
        <div style={{ fontSize: 18, letterSpacing: 2, color: '#A9B8C4' }}>ONE SITE<br />ONE DAY</div>
      </div>
      <div style={{ padding: '8px 38px' }}>
        {[
          ['WHO', 'The person doing the work'], ['WHAT', 'The check and the photo'], ['WHEN', 'At the time the work happened'],
        ].map(([label, text]) => <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 28, padding: '27px 0', borderBottom: '1px solid #DFE6EC' }}><div style={{ width: 78, fontSize: 19, color: C.skyDeep, letterSpacing: 2, fontWeight: 700 }}>{label}</div><div style={{ fontSize: 27, color: C.ink }}>{text}</div></div>)}
        <div style={{ marginTop: 30, border: `2px solid ${C.emerald}`, borderRadius: 6, color: C.emerald, padding: '17px 20px', textAlign: 'center', fontSize: 21, fontWeight: 700, letterSpacing: 2 }}>RECORDED AT THE TIME</div>
        <div style={{ fontSize: 23, color: C.muted, marginTop: 22, textAlign: 'center' }}>The record stays as the shift left it.</div>
      </div>
    </div>
    <Footer index={9} />
  </AbsoluteFill>
);

const CloseCard: React.FC<{ frame: number; outro?: boolean }> = ({ frame, outro = false }) => {
  const beat = timing.beats[11];
  const local = outro ? 60 : frame - sceneStarts[11];
  return (
    <AbsoluteFill style={{ background: C.navy, color: '#F4F7FA' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 24% 40%, #183D42, transparent 58%)' }} />
      {/* The shared series logo lockup is already settled when this card mounts. */}
      <Sequence from={-72} layout="none"><LogoLockup intro={false} accentA={C.sky} accentB={C.emerald} /></Sequence>
      <div style={{ position: 'absolute', left: 186, top: 648, color: '#9AAFBA', fontSize: 24, letterSpacing: 3 }}>e-wizer · ECOWIZE ACADEMY</div>
      <div style={{ position: 'absolute', left: 980, top: 166, width: 816 }}>
        <Heading index={11} frame={outro ? BOH_ALT_FRAMES : frame} eyebrow="Every day. Written once." headline="Seven rows to green." dark />
        <div style={{ fontFamily: DISPLAY, fontSize: 90, fontWeight: 700, lineHeight: 1.02, color: '#55C48A', marginTop: 16 }}>Before the day ends.</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 48 }}>{Array.from({ length: 7 }, (_, i) => <div key={i} style={{ width: 74, height: 12, borderRadius: 3, background: C.emerald, opacity: 0.35 + 0.65 * ease((local - i * 4 + 1) / 12) }} />)}</div>
        <div style={{ fontSize: 34, lineHeight: 1.4, marginTop: 36, color: '#BCCBD5', opacity: outro ? 1 : 0.75 + 0.25 * onCue(beat, frame, 'heartbeat') }}>That is the heartbeat of the site.<br />That is the Bill of Health.</div>
      </div>
      <Footer index={11} dark />
    </AbsoluteFill>
  );
};

const Stage: React.FC = () => {
  const frame = useCurrentFrame();
  const index = timing.beats.findIndex((_, i) => frame >= sceneStarts[i] && frame < sceneEnd(i));
  const beat = timing.beats[Math.max(0, index)];
  // Exclusive scene branches: card beats cannot mount a phone or placeholder.
  if (beat.id === '09-rule') return <RuleCard beat={beat} frame={frame} />;
  if (beat.id === '10-diligence') return <DiligenceCard frame={frame} />;
  if (beat.id === '12-close') return <CloseCard frame={frame} />;
  return <PhoneScene beat={beat} index={index} frame={frame} />;
};

const MUSIC = 'cln-tutorial/audio/tutorial.mp3'; // existing 74.031s music asset, read-only
const MUSIC_FRAMES = 2220;
const MUSIC_OVERLAP = 120;
const LAST_VO_END = Math.ceil((timing.beats[11].voStart + timing.beats[11].duration) * FPS);
const MusicBed: React.FC<{ branded: boolean }> = ({ branded }) => {
  const offset = branded ? BOH_ALT_INTRO_FRAMES : 0;
  const total = branded ? BOH_ALT_BRANDED_FRAMES : BOH_ALT_FRAMES;
  const firstVo = offset + Math.round(timing.beats[0].voStart * FPS);
  const lastVoEnd = offset + LAST_VO_END;
  const starts = Array.from({ length: Math.ceil(total / (MUSIC_FRAMES - MUSIC_OVERLAP)) }, (_, i) => i * (MUSIC_FRAMES - MUSIC_OVERLAP));
  const envelope = (frame: number) => mix(frame, [0, firstVo - 12, firstVo, lastVoEnd, lastVoEnd + 30], [0.34, 0.34, 0.09, 0.09, 0.38])
    * mix(frame, [0, 3, total - 12, total], [0, 1, 1, 0]);
  return <>{starts.map((start, i) => {
    const duration = Math.min(MUSIC_FRAMES, total - start);
    const hasNext = i < starts.length - 1;
    return <Sequence key={start} from={start} durationInFrames={duration}>
      <Audio src={staticFile(MUSIC)} volume={(f) => {
        // Linear overlapping gains sum to one; the same global ducking envelope
        // covers all tutorial beats AND both branded seams without a bed restart.
        const fadeIn = i === 0 ? 1 : clamp(f / MUSIC_OVERLAP);
        const fadeOut = hasNext ? clamp((MUSIC_FRAMES - f) / MUSIC_OVERLAP) : 1;
        return envelope(start + f) * fadeIn * fadeOut;
      }} />
    </Sequence>;
  })}</>;
};

const Narration: React.FC = () => <>{timing.beats.map((beat) => (
  <Sequence key={beat.id} from={Math.round(beat.voStart * FPS)} durationInFrames={Math.ceil(beat.duration * FPS) + 1}>
    <Audio src={staticFile(beat.audio)} volume={1.5} />
  </Sequence>
))}</>;

const AltIntro: React.FC = () => (
  <AbsoluteFill style={{ background: C.navy, color: '#F4F7FA' }}>
    <Sequence from={-72} layout="none"><LogoLockup intro accentA={C.sky} accentB={C.emerald} /></Sequence>
    <div style={{ position: 'absolute', left: 980, top: 240, width: 816 }}>
      <div style={{ fontSize: 24, letterSpacing: 3, color: C.sky }}>ECOWIZE ACADEMY · VIDEO 07</div>
      <div style={{ fontFamily: DISPLAY, fontSize: 116, lineHeight: 1, fontWeight: 700, marginTop: 24 }}>Bill of Health</div>
      <div style={{ fontSize: 34, lineHeight: 1.4, color: '#BCCBD5', marginTop: 32 }}>Seven things every shift must close.<br />Three that carry over until resolved.</div>
      <div style={{ width: 580, height: 7, background: `linear-gradient(90deg, ${C.sky}, ${C.emerald})`, marginTop: 48 }} />
    </div>
  </AbsoluteFill>
);

export const BillOfHealthAlt: React.FC = () => {
  useAltFonts();
  return <AbsoluteFill style={{ fontFamily: BODY, background: C.navy }}><Stage /><MusicBed branded={false} /><Narration /></AbsoluteFill>;
};

export const BillOfHealthAltBranded: React.FC = () => {
  useAltFonts();
  const outroStart = BOH_ALT_INTRO_FRAMES + BOH_ALT_FRAMES;
  return <AbsoluteFill style={{ fontFamily: BODY, background: C.navy }}>
    <MusicBed branded />
    <Sequence durationInFrames={BOH_ALT_INTRO_FRAMES}><AltIntro /></Sequence>
    <Sequence from={BOH_ALT_INTRO_FRAMES} durationInFrames={BOH_ALT_FRAMES}><Stage /><Narration /></Sequence>
    <Sequence from={outroStart} durationInFrames={BOH_ALT_OUTRO_FRAMES}><CloseCard frame={BOH_ALT_FRAMES - 1} outro /></Sequence>
  </AbsoluteFill>;
};
