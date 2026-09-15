import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { BrandIntro, LogoLockup } from '../brand/EcowizeBookends';
import timing from './timing.json';
import boxesRaw from './boxes.json';

const SKY = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const CORAL = '#D6432F';
const INK = '#071018';
const PANEL = '#0E1822';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

const STILL_W = 1344;
const STILL_H = 2992;
const CROP_TOP = 108;
const VISIBLE_H = STILL_H - CROP_TOP;
const PHONE_H = 1010;
const SCALE = PHONE_H / VISIBLE_H;
const PHONE_W = STILL_W * SCALE;
const PHONE_X = 112;
const PHONE_Y = 34;

export const SCHEDULE_INTRO_FRAMES = 150;
export const SCHEDULE_OUTRO_FRAMES = 180;
const MUSIC = 'cln-tutorial/audio/tutorial.mp3';
const NARRATION_VOLUME = 1.22;
const BOOKEND_MUSIC_VOLUME = 0.88;

type RingBox = { x: number; y: number; w: number; h: number; color?: string };
type CropRect = { x: number; y: number; w: number; h: number; panelH?: number };
type Beat = {
  id: string;
  shot: string;
  chip: string;
  ring: keyof typeof BOXES | null;
  audio: string;
  voStart: number;
  duration: number;
  text: string;
};
type TimingData = {
  fps: number;
  total_seconds: number;
  total_frames: number;
  beats: Beat[];
};

// boxes.json ships NORMALIZED (0..1) over the 1344x2992 still. Denormalize once
// here so the rest of the phone-still pipeline (PhoneRing / ZoomPanel) keeps the
// same still-pixel math the hygiene template uses.
type NormBox = { x: number; y: number; w: number; h: number; color?: string };
const BOXES = Object.fromEntries(
  Object.entries(boxesRaw as Record<string, NormBox | string>)
    .filter(([key]) => key !== '_comment')
    .map(([key, b]) => {
      const box = b as NormBox;
      return [
        key,
        {
          x: box.x * STILL_W,
          y: box.y * STILL_H,
          w: box.w * STILL_W,
          h: box.h * STILL_H,
          color: box.color ?? SKY,
        },
      ];
    }),
) as Record<string, RingBox>;

const COPY: Record<string, { headline: string; body: string; proof: string }> = {
  context: {
    headline: 'Today is a rest day',
    body: 'No tasks scheduled — every area reads 0 of 0 due.',
    proof: 'I&J · Sun 21 Jun',
  },
  areasButton: {
    headline: 'Open Areas',
    body: 'Second nav button. The centre Scan button is for the day itself.',
    proof: 'Tap Areas',
  },
  areasToday: {
    headline: 'Live — what’s due today',
    body: 'Every area, and what each owes. Today: 0/0 across the site.',
    proof: 'LIVE',
  },
  openZone: {
    headline: 'No tasks due',
    body: 'Called in on a rest day? The work isn’t gone — it’s just off today’s schedule.',
    proof: 'Sun 21 Jun',
  },
  offSchedule: {
    headline: 'Off-schedule = full catalogue',
    body: 'Everything this area can be checked on. Record only what you actually did.',
    proof: 'Nothing here is required',
  },
  dateStrip: {
    headline: 'Pick any day',
    body: 'Slide the schedule date forward to preview what’s coming.',
    proof: 'Schedule date',
  },
  monday: {
    headline: 'Monday preview',
    body: 'Tag flips to READ ONLY. Site Operations wakes up: 69 due.',
    proof: '0/69 due',
  },
  friday: {
    headline: 'Friday is different',
    body: '72 for Site Operations; canteen 9 → 12 — weekly & monthly checks land Friday.',
    proof: '0/72 due',
  },
  fridayZone: {
    headline: 'What Friday holds',
    body: '26 checks due — 23 every shift + 3 periodic — days ahead.',
    proof: 'DUE (26)',
  },
  guardrail: {
    headline: 'A preview never records',
    body: 'Due & off-schedule are view-only. Scan on the day to record work.',
    proof: 'Read-only',
  },
};

// Nice-to-have: spring-eased count-up on the preview beats. template renders the
// animated integer inside the proof chip.
const COUNTUPS: Record<string, { to: number; template: (n: number) => string }> = {
  monday: { to: 69, template: (n) => `0/${n} due` },
  friday: { to: 72, template: (n) => `0/${n} due` },
  fridayZone: { to: 26, template: (n) => `DUE (${n})` },
};

const ZOOM_CROPS: Partial<Record<keyof typeof BOXES, CropRect>> = {};

const fadeInOut = (frame: number, duration: number, fade = 18) =>
  interpolate(frame, [0, fade, duration - fade, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const getActiveIndex = (beats: Beat[], sec: number) => {
  let active = 0;
  for (let i = 0; i < beats.length; i++) {
    if (sec >= beats[i].voStart - 0.18) active = i;
  }
  return active;
};

const MovingGrid: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const drift = frame * 1.5;

  return (
    <div
      style={{
        position: 'absolute',
        inset: -140,
        opacity,
        backgroundImage:
          'linear-gradient(rgba(60,182,224,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(60,182,224,0.18) 1px, transparent 1px)',
        backgroundSize: '72px 72px',
        transform: `translate(${drift % 72}px, ${-(drift % 72)}px) rotate(-8deg)`,
        maskImage: 'radial-gradient(circle at 50% 50%, black 0%, transparent 72%)',
      }}
    />
  );
};


const BrandOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({ frame: frame - 6, fps, durationInFrames: 34, config: { damping: 180 } });
  const fade = fadeInOut(frame, SCHEDULE_OUTRO_FRAMES, 22);
  const cards = [
    { label: 'Today', color: EMERALD },
    { label: 'Preview', color: SKY },
    { label: 'Scan to record', color: AMBER },
  ];

  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT, opacity: fade }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 70% 26%, rgba(60,182,224,0.22), transparent 31%), radial-gradient(circle at 24% 78%, rgba(31,156,90,0.14), transparent 28%), linear-gradient(135deg, #071018, #0D1B28 56%, #04080c)',
        }}
      />
      <MovingGrid opacity={0.22} />
      <div
        style={{
          position: 'absolute',
          left: 150,
          top: 154,
          width: 650,
          height: 690,
          borderRadius: 44,
          background: 'rgba(255,255,255,0.045)',
          border: '1px solid rgba(255,255,255,0.12)',
          boxShadow: '0 30px 90px rgba(0,0,0,0.3)',
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [28, 0])}px)`,
        }}
      >
        <LogoLockup intro={false} accentA={SKY} accentB={EMERALD} left={20} />
      </div>

      <div
        style={{
          position: 'absolute',
          left: 980,
          top: 180,
          width: 720,
          opacity: reveal,
          transform: `translateY(${interpolate(reveal, [0, 1], [26, 0])}px)`,
        }}
      >
        <div style={{ color: SKY, fontSize: 26, fontWeight: 950, letterSpacing: 4, textTransform: 'uppercase' }}>
          plan ahead
        </div>
        <div style={{ marginTop: 18, color: '#fff', fontSize: 82, lineHeight: 0.98, fontWeight: 950 }}>
          See it before the day.
        </div>
        <div style={{ marginTop: 30, color: 'rgba(255,255,255,0.72)', fontSize: 34, lineHeight: 1.28, fontWeight: 760 }}>
          Due today, or any date — read-only preview, then scan on the day.
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 54 }}>
          {cards.map((card, index) => {
            const cardReveal = spring({
              frame: frame - (42 + index * 12),
              fps,
              durationInFrames: 22,
              config: { damping: 160 },
            });
            return (
              <div
                key={card.label}
                style={{
                  width: 214,
                  height: 154,
                  borderRadius: 26,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.14)',
                  boxShadow: `0 18px 42px rgba(0,0,0,0.22), 0 0 30px rgba(${hexToRgb(card.color)},0.18)`,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: cardReveal,
                  transform: `translateY(${interpolate(cardReveal, [0, 1], [20, 0])}px)`,
                }}
              >
                <div
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 29,
                    background: card.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    fontWeight: 950,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ marginTop: 18, color: '#fff', fontSize: 24, fontWeight: 900, textAlign: 'center' }}>
                  {card.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const PhoneStill: React.FC<{
  beats: Beat[];
  active: number;
  sec: number;
  totalSeconds: number;
}> = ({ beats, active, sec, totalSeconds }) => {
  return (
    <>
      {beats.map((beat, i) => {
        const next = i + 1 < beats.length ? beats[i + 1].voStart : totalSeconds + 1;
        const opacity = interpolate(
          sec,
          [beat.voStart - 0.42, beat.voStart - 0.08, next - 0.46, next - 0.1],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        if (opacity <= 0) return null;

        return (
          <Img
            key={beat.id}
            src={staticFile(`schedule-preview/shots/${beat.shot}.png`)}
            style={{
              position: 'absolute',
              left: 0,
              top: -CROP_TOP * SCALE,
              width: '100%',
              height: STILL_H * SCALE,
              opacity,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 40,
          background: 'rgba(7,16,24,0.72)',
          borderRadius: 999,
          padding: '7px 12px',
          color: 'rgba(255,255,255,0.82)',
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 1.6,
          textTransform: 'uppercase',
        }}
      >
        Step {String(active + 1).padStart(2, '0')}
      </div>
    </>
  );
};

const PhoneRing: React.FC<{
  box: RingBox | null;
  beatStart: number;
}> = ({ box, beatStart }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!box) return null;

  const land = spring({
    frame: frame - Math.round((beatStart + 0.28) * fps),
    fps,
    durationInFrames: 18,
    config: { damping: 18, stiffness: 160 },
  });
  const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
  const scale = interpolate(land, [0, 1], [1.55, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const rgb = hexToRgb(box.color ?? SKY);

  return (
    <div
      style={{
        position: 'absolute',
        left: box.x * SCALE - 10,
        top: (box.y - CROP_TOP) * SCALE - 10,
        width: box.w * SCALE + 20,
        height: box.h * SCALE + 20,
        borderRadius: 18,
        border: `5px solid rgba(${rgb},${0.62 + pulse * 0.35})`,
        background: `rgba(${rgb},${0.14 + pulse * 0.06})`,
        boxShadow: `0 0 ${22 + pulse * 24}px rgba(${rgb},0.68)`,
        opacity: land,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    />
  );
};

const ZoomPanel: React.FC<{
  beat: Beat;
  box: RingBox | null;
  appear: number;
}> = ({ beat, box, appear }) => {
  const panelW = 900;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lift = spring({ frame: frame - Math.round((beat.voStart + 0.35) * fps), fps, config: { damping: 200 } });

  if (!box) {
    const items = ['Today', 'Preview', 'Scan'];
    return (
      <div
        style={{
          width: panelW,
          height: 330,
          borderRadius: 28,
          background: `linear-gradient(135deg, rgba(60,182,224,0.15), rgba(31,156,90,0.10)), ${PANEL}`,
          border: '1px solid rgba(255,255,255,0.11)',
          boxShadow: '0 28px 70px rgba(0,0,0,0.28)',
          padding: 28,
          opacity: appear,
          transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item}
            style={{
              width: 240,
              height: 220,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                background: index === 0 ? EMERALD : index === 1 ? SKY : AMBER,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 34,
                fontWeight: 900,
              }}
            >
              {index + 1}
            </div>
            <div style={{ color: '#fff', fontSize: 34, fontWeight: 900 }}>{item}</div>
          </div>
        ))}
      </div>
    );
  }

  const configuredCrop = beat.ring ? ZOOM_CROPS[beat.ring] : null;
  const padX = Math.max(180, box.w * 0.45);
  const padY = Math.max(180, box.h * 0.55);
  const cropW = configuredCrop ? configuredCrop.w : Math.min(STILL_W, box.w + padX * 2);
  const cropH = configuredCrop ? configuredCrop.h : Math.min(STILL_H, box.h + padY * 2);
  const cropX = configuredCrop ? configuredCrop.x : clamp(box.x + box.w / 2 - cropW / 2, 0, STILL_W - cropW);
  const cropY = configuredCrop ? configuredCrop.y : clamp(box.y + box.h / 2 - cropH / 2, 0, STILL_H - cropH);
  const panelH = configuredCrop?.panelH ?? 360;
  const inset = 18;
  const scale = Math.min((panelW - inset * 2) / cropW, (panelH - inset * 2) / cropH);
  const imageX = (panelW - cropW * scale) / 2;
  const imageY = (panelH - cropH * scale) / 2;
  const rgb = hexToRgb(box.color ?? SKY);

  return (
    <div
      style={{
        position: 'relative',
        width: panelW,
        height: panelH,
        borderRadius: 28,
        overflow: 'hidden',
        background: `linear-gradient(135deg, rgba(${rgb},0.08), rgba(255,255,255,0.03)), #0b1219`,
        border: `2px solid rgba(${rgb},0.8)`,
        boxShadow: `0 28px 80px rgba(0,0,0,0.34), 0 0 42px rgba(${rgb},0.25)`,
        opacity: appear,
        transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
      }}
    >
      <Img
        src={staticFile(`schedule-preview/shots/${beat.shot}.png`)}
        style={{
          position: 'absolute',
          left: imageX - cropX * scale,
          top: imageY - cropY * scale,
          width: STILL_W * scale,
          height: STILL_H * scale,
          filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.24))',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: imageX + (box.x - cropX) * scale - 8,
          top: imageY + (box.y - cropY) * scale - 8,
          width: box.w * scale + 16,
          height: box.h * scale + 16,
          borderRadius: 18,
          border: `6px solid rgba(${rgb},0.9)`,
          boxShadow: `0 0 36px rgba(${rgb},0.62)`,
          background: `rgba(${rgb},0.14)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 22,
          bottom: 20,
          background: `rgba(${rgb},0.94)`,
          color: '#fff',
          fontWeight: 900,
          fontSize: 26,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          padding: '10px 16px',
          borderRadius: 14,
        }}
      >
        Focus here
      </div>
    </div>
  );
};

const SchedulePreviewScene: React.FC<{ timingData: TimingData }> = ({ timingData }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sec = frame / fps;
  const beats = timingData.beats as Beat[];

  if (beats.length === 0) {
    return (
      <AbsoluteFill style={{ background: INK, color: '#fff', fontFamily: FONT, alignItems: 'center', justifyContent: 'center' }}>
        Generate Schedule Preview timing first.
      </AbsoluteFill>
    );
  }

  const active = getActiveIndex(beats, sec);
  const beat = beats[active];
  const box = beat.ring ? BOXES[beat.ring] : null;
  const copy = COPY[beat.id] ?? { headline: beat.chip, body: beat.text, proof: 'Follow the highlighted step.' };
  const local = sec - beat.voStart;

  // Spring-eased count-up for the preview beats, rendered in the proof chip.
  const countup = COUNTUPS[beat.id];
  let proofText = copy.proof;
  if (countup) {
    const grow = spring({
      frame: frame - Math.round((beat.voStart + 0.5) * fps),
      fps,
      durationInFrames: 34,
      config: { damping: 200 },
    });
    proofText = countup.template(Math.round(grow * countup.to));
  }

  const textIn = interpolate(local, [-0.08, 0.36], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOp = interpolate(sec, [0, 0.35, 2.25, 3.0], [1, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bar = interpolate(active + clamp(local / Math.max(beat.duration, 1), 0, 1), [0, beats.length], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ background: INK, fontFamily: FONT }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 24% 18%, rgba(60,182,224,0.16), transparent 26%), radial-gradient(circle at 83% 78%, rgba(31,156,90,0.12), transparent 30%), linear-gradient(135deg, #111d28, #071018 58%, #05090d)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PHONE_X - 26,
          top: PHONE_Y - 18,
          width: PHONE_W + 52,
          height: PHONE_H + 36,
          borderRadius: 48,
          background: 'linear-gradient(145deg, #293544, #0c1117)',
          boxShadow: '0 38px 110px rgba(0,0,0,0.56)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PHONE_X,
          top: PHONE_Y,
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 36,
          overflow: 'hidden',
          background: '#fff',
          boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 0 0 12px #11161d',
        }}
      >
        <PhoneStill beats={beats} active={active} sec={sec} totalSeconds={timingData.total_seconds} />
        <PhoneRing box={box} beatStart={beat.voStart} />
      </div>

      <div style={{ position: 'absolute', left: 675, top: 72, width: 1110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: textIn }}>
          <div
            style={{
              height: 52,
              padding: '0 22px',
              borderRadius: 999,
              background: 'rgba(60,182,224,0.16)',
              border: '1px solid rgba(60,182,224,0.42)',
              color: SKY,
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            {beat.chip}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 26, fontWeight: 800 }}>
            {active + 1} / {beats.length}
          </div>
        </div>

        <div
          style={{
            marginTop: 32,
            color: '#fff',
            fontSize: 70,
            lineHeight: 1.04,
            fontWeight: 950,
            letterSpacing: 0,
            opacity: textIn,
            transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
            textShadow: '0 10px 32px rgba(0,0,0,0.36)',
          }}
        >
          {copy.headline}
        </div>

        <div
          style={{
            marginTop: 28,
            width: 900,
            color: 'rgba(255,255,255,0.76)',
            fontSize: 35,
            lineHeight: 1.32,
            fontWeight: 650,
            opacity: textIn,
          }}
        >
          {copy.body}
        </div>

        <div style={{ marginTop: 44 }}>
          <ZoomPanel beat={beat} box={box} appear={textIn} />
        </div>

        <div
          style={{
            marginTop: 30,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 18,
            padding: '14px 18px',
            color: '#fff',
            fontSize: 26,
            fontWeight: 850,
            opacity: textIn,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: box?.color ?? SKY,
              boxShadow: `0 0 20px ${box?.color ?? SKY}`,
            }}
          />
          {proofText}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 675,
          bottom: 54,
          width: 1110,
          height: 10,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${bar * 100}%`,
            height: '100%',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${SKY}, ${EMERALD})`,
            boxShadow: '0 0 26px rgba(60,182,224,0.46)',
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 675,
          bottom: 74,
          color: 'rgba(255,255,255,0.45)',
          fontSize: 22,
          fontWeight: 800,
          letterSpacing: 2.2,
          textTransform: 'uppercase',
        }}
      >
        e-wizer field guide - schedule &amp; preview
      </div>

      {beats.map((item) => (
        <Sequence key={item.id} from={Math.round(item.voStart * fps)} durationInFrames={Math.ceil(item.duration * fps) + 4} premountFor={fps}>
          <Audio src={staticFile(item.audio)} volume={NARRATION_VOLUME} />
        </Sequence>
      ))}

      {titleOp > 0 && (
        <AbsoluteFill
          style={{
            background: 'linear-gradient(135deg, rgba(7,16,24,0.96), rgba(10,22,32,0.92))',
            opacity: titleOp,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: SKY, fontSize: 30, fontWeight: 900, letterSpacing: 5, textTransform: 'uppercase' }}>
            e-wizer field guide
          </div>
          <div style={{ color: '#fff', fontSize: 92, fontWeight: 950, marginTop: 20 }}>Schedule &amp; Preview</div>
          <div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 36, fontWeight: 760, marginTop: 20 }}>
            Due today, or any date — preview, then scan.
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const BookendAudio: React.FC = () => {
  const outroStart = SCHEDULE_INTRO_FRAMES + SCHEDULE_TUTORIAL_FRAMES;

  return (
    <>
      <Sequence from={0} durationInFrames={SCHEDULE_INTRO_FRAMES} premountFor={SCHEDULE_FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, SCHEDULE_INTRO_FRAMES, 24)} />
      </Sequence>
      <Sequence from={outroStart} durationInFrames={SCHEDULE_OUTRO_FRAMES} premountFor={SCHEDULE_FPS}>
        <Audio src={staticFile(MUSIC)} volume={(f) => BOOKEND_MUSIC_VOLUME * fadeInOut(f, SCHEDULE_OUTRO_FRAMES, 28)} />
      </Sequence>
    </>
  );
};

export const SchedulePreviewTutorial: React.FC = () => <SchedulePreviewScene timingData={timing as TimingData} />;

export const SchedulePreviewTutorialBranded: React.FC = () => {
  const outroStart = SCHEDULE_INTRO_FRAMES + SCHEDULE_TUTORIAL_FRAMES;

  return (
    <AbsoluteFill style={{ background: PANEL }}>
      <BookendAudio />
      <Sequence from={0} durationInFrames={SCHEDULE_INTRO_FRAMES} premountFor={SCHEDULE_FPS}>
        <BrandIntro
          kicker="e-wizer field guide"
          title="Schedule & Preview"
          tagline="Know what’s due — any day, before you walk in."
          accentA={SKY}
          accentB={EMERALD}
        />
      </Sequence>
      <Sequence from={SCHEDULE_INTRO_FRAMES} durationInFrames={SCHEDULE_TUTORIAL_FRAMES} premountFor={SCHEDULE_FPS}>
        <SchedulePreviewTutorial />
      </Sequence>
      <Sequence from={outroStart} durationInFrames={SCHEDULE_OUTRO_FRAMES} premountFor={SCHEDULE_FPS}>
        <BrandOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

export const SCHEDULE_FPS = (timing as TimingData).fps;
export const SCHEDULE_TUTORIAL_FRAMES = (timing as TimingData).total_frames;
export const SCHEDULE_BRANDED_FRAMES =
  SCHEDULE_INTRO_FRAMES + SCHEDULE_TUTORIAL_FRAMES + SCHEDULE_OUTRO_FRAMES;
