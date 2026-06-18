import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
} from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { ecowizeCorporateTheme as theme } from '../components/webslides/themes';

// ─── Theme aliases ───────────────────────────────────────
const C = {
  bg: theme.colors.background,
  text: theme.colors.text,
  accent: theme.colors.accent,
  highlight: theme.colors.highlight,
  primary: theme.colors.primary,
  secondary: theme.colors.secondary,
};
const FONT = theme.typography.fontFamily;

function withOpacity(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Timing ──────────────────────────────────────────────
const FPS = 30;
const TRANSITION_FRAMES = 12;

// Slide durations per voice version (audio duration + ~2s breathing room)
const SLIDE_DURATIONS_DEFAULT = [
  9, 14, 11, 15, 12, 11, 11, 12, 13, 8,  // default voice (90s audio)
];
const SLIDE_DURATIONS_DANIEL = [
  14, 18, 14, 26, 21, 18, 19, 19, 19, 8,  // daniel clone (~1s buffer)
];
const SLIDE_DURATIONS_DANIEL_EXPRESSIVE = [
  11, 16, 13, 21, 18, 17, 15, 19, 19, 8,  // daniel expressive (~1s buffer)
];

const SLIDE_DURATION_MAP: Record<string, number[]> = {
  'audio/ecowize-signage': SLIDE_DURATIONS_DEFAULT,
  'audio/ecowize-signage-daniel': SLIDE_DURATIONS_DANIEL,
  'audio/ecowize-signage-daniel-expressive': SLIDE_DURATIONS_DANIEL_EXPRESSIVE,
};

// ─── Cues (from Whisper word-level timestamps) ───────────
const CUES = {
  slide01: { threeMorning: 0.0, listeria: 3.0, prove: 6.1 },
  slide02: { audit: 0.5, betweenAudits: 1.96, fssc: 7.42, zero: 11.5 },
  slide03: { wallsTalk: 0.54, fiftyRand: 4.18, magnet: 6.04, whoWhenWhat: 6.98 },
  slide04: { qrLeast: 0.3, signProduct: 3.16, zoneSpecific: 4.6, operativesLearn: 6.98, auditorEvidence: 9.86 },
  slide05: { scansQr: 0.66, timestamped: 1.28, threeTwelve: 3.3, photoPrompt: 4.82, bonus: 9.46 },
  slide06: { notSeparate: 0.52, accumulates: 2.24, handThemThis: 8.06 },
  slide07: { standardFloor: 1.14, standardWall: 3.0, noPath: 5.82, pathEmpty: 8.44 },
  slide08: { oneSign: 0.0, eight: 0.9, thoughtLeadership: 1.82, moat: 5.16, revenue: 5.98, magnetWall: 8.58 },
  slide09: { platformBuilt: 0.5, pickASite: 3.36, anySite: 4.04, twoWeeks: 6.5, wallsTalking: 9.3 },
  slide10: { proveIt: 0.0, worthy: 4.0 },
};

// ─── Image paths ─────────────────────────────────────────
const IMG = {
  heroScan: 'images/ecowize-signage/pitch-01-hero-operative-scan.png',
  beforeWall: 'images/ecowize-signage/pitch-02-before-bare-wall.png',
  afterWall: 'images/ecowize-signage/pitch-03-after-branded-wall.png',
  phoneTask: 'images/ecowize-signage/pitch-04-phone-task-list.png',
  dashboard: 'images/ecowize-signage/pitch-05-dashboard-evidence.png',
  auditor: 'images/ecowize-signage/pitch-06-auditor-impressed.png',
  competitive: 'images/ecowize-signage/pitch-07-competitive-moat.png',
  scale: 'images/ecowize-signage/pitch-08-scale-300-sites.png',
  costCompare: 'images/ecowize-signage/pitch-09-cost-comparison.png',
  operativeLearning: 'images/ecowize-signage/pitch-10-operative-learning.png',
  posterListeria: 'images/ecowize-signage/poster-1-listeria-zones.png',
  posterBootWash: 'images/ecowize-signage/poster-2-boot-wash.png',
  posterHygiene: 'images/ecowize-signage/poster-3-hand-hygiene.png',
  posterColorCode: 'images/ecowize-signage/poster-4-color-coding.png',
  // Reuse existing ecowize assets
  factoryFloor: 'images/ecowize/02-factory-floor.jpg',
  painAudit: 'images/ecowize/pain-03-audit.jpg',
};

// ─── Hooks ───────────────────────────────────────────────
function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(
    frame,
    [cueFrame, cueFrame + fadeDuration * fps],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return { opacity, isActive: frame >= cueFrame };
}

function useCueSpring(cueTimeSeconds: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame, fps, delay: cueTimeSeconds * fps, config: { damping: 20, stiffness: 180 } });
}

// ─── Reusable Components ─────────────────────────────────
const KenBurns: React.FC<{
  src: string; opacity?: number; zoomFrom?: number; zoomTo?: number; panX?: number; panY?: number;
}> = ({ src, opacity = 0.5, zoomFrom = 1.0, zoomTo = 1.08, panX = 0, panY = 0 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const tx = interpolate(frame, [0, durationInFrames], [0, panX]);
  const ty = interpolate(frame, [0, durationInFrames], [0, panY]);

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        opacity, transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
      }}
    />
  );
};

const NarratedInner: React.FC<{ slideNum: number; audio: boolean; audioFolder: string; children: React.ReactNode }> = ({ slideNum, audio, audioFolder, children }) => (
  <AbsoluteFill>
    {children}
    {audio && slideNum <= 9 && (
      <Audio src={staticFile(`${audioFolder}/slide-${String(slideNum).padStart(2, '0')}.wav`)} volume={0.9} />
    )}
  </AbsoluteFill>
);

const GradientOverlay: React.FC<{ direction?: string; from?: number; to?: number }> = ({
  direction = '90deg', from = 0.9, to = 0.2,
}) => (
  <div style={{
    position: 'absolute', inset: 0,
    background: `linear-gradient(${direction}, ${withOpacity(C.bg, from)} 0%, ${withOpacity(C.bg, (from + to) / 2)} 50%, ${withOpacity(C.bg, to)} 100%)`,
  }} />
);

// ─── Slide Components ────────────────────────────────────

// SLIDE 1: THE CRIME SCENE
const Slide01CrimeScene: React.FC = () => {
  const c = CUES.slide01;
  const listeria = useCue(c.listeria);
  const prove = useCue(c.prove);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Red forensic markers fade in
  const markerOpacity = interpolate(frame, [1.5 * fps, 2.5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0a' }}>
      <KenBurns src={IMG.factoryFloor} opacity={0.35} panX={-15} panY={-5} zoomTo={1.06} />
      <GradientOverlay direction="180deg" from={0.3} to={0.85} />

      {/* Time indicator */}
      <div style={{
        position: 'absolute', top: 60, left: 80,
        fontFamily: 'monospace', fontSize: 28, color: withOpacity(C.accent, 0.6),
        letterSpacing: 4,
      }}>
        03:00 AM
      </div>

      {/* Red forensic markers */}
      <div style={{ position: 'absolute', inset: 0, opacity: markerOpacity }}>
        {[
          { x: '15%', y: '70%', label: 'Drain' },
          { x: '40%', y: '45%', label: 'Door Handle' },
          { x: '65%', y: '75%', label: 'Boot Scraper' },
          { x: '80%', y: '55%', label: 'Mop Bucket' },
        ].map((m, i) => (
          <div key={i} style={{
            position: 'absolute', left: m.x, top: m.y,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            opacity: interpolate(frame, [(1.5 + i * 0.3) * fps, (2 + i * 0.3) * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 4, backgroundColor: '#cc2222',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: 'white', fontFamily: 'monospace',
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 11, color: '#ff6666', fontFamily: 'monospace', letterSpacing: 1 }}>
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Main text */}
      <div style={{
        position: 'absolute', bottom: 100, left: 80, right: 80,
      }}>
        <div style={{
          fontSize: 54, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: listeria.opacity,
          lineHeight: 1.3,
        }}>
          Listeria doesn't clock in.
        </div>
        <div style={{
          fontSize: 32, color: withOpacity('#ff4444', prove.opacity), fontFamily: FONT,
          marginTop: 16, fontWeight: 600,
        }}>
          Nobody can prove they stopped it.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 2: THE INVISIBLE GAP
const Slide02InvisibleGap: React.FC = () => {
  const c = CUES.slide02;
  const audit = useCue(c.audit);
  const between = useCue(c.betweenAudits);
  const fssc = useCue(c.fssc);
  const zero = useCue(c.zero);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dissolve: audit report fades, reality fades in
  const dissolve = interpolate(frame, [3 * fps, 5 * fps], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Left: Audit report */}
      <div style={{
        position: 'absolute', left: 0, top: 0, width: '50%', height: '100%',
        opacity: 1 - dissolve * 0.7,
      }}>
        <KenBurns src={IMG.painAudit} opacity={0.6} />
        <GradientOverlay direction="0deg" from={0.8} to={0.4} />
        <div style={{
          position: 'absolute', top: '40%', left: 80,
          fontSize: 72, fontWeight: 800, color: '#22c55e',
          opacity: audit.opacity, fontFamily: FONT,
        }}>
          98%
        </div>
        <div style={{
          position: 'absolute', top: '55%', left: 80,
          fontSize: 20, color: withOpacity(C.text, 0.7), fontFamily: FONT,
        }}>
          Audit Score
        </div>
      </div>

      {/* Right: Reality */}
      <div style={{
        position: 'absolute', right: 0, top: 0, width: '50%', height: '100%',
        opacity: between.opacity,
      }}>
        <KenBurns src={IMG.beforeWall} opacity={0.6} panX={10} />
        <GradientOverlay direction="180deg" from={0.4} to={0.8} />
        <div style={{
          position: 'absolute', top: '40%', right: 80,
          fontSize: 20, color: withOpacity(C.text, 0.5), fontFamily: FONT, textAlign: 'right',
        }}>
          Between Audits
        </div>
      </div>

      {/* Counter at bottom */}
      <div style={{
        position: 'absolute', bottom: 60, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 60,
        opacity: zero.opacity,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: C.highlight, fontFamily: 'monospace' }}>147</div>
          <div style={{ fontSize: 14, color: withOpacity(C.text, 0.5), letterSpacing: 2, textTransform: 'uppercase' }}>Days Since Audit</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 800, color: '#ff4444', fontFamily: 'monospace' }}>0</div>
          <div style={{ fontSize: 14, color: withOpacity(C.text, 0.5), letterSpacing: 2, textTransform: 'uppercase' }}>Days Verified</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 3: WHAT IF THE WALLS COULD TALK
const Slide03WallsTalk: React.FC = () => {
  const c = CUES.slide03;
  const walls = useCue(c.wallsTalk);
  const fiftyRand = useCue(c.fiftyRand, 0.8);
  const magnet = useCue(c.magnet);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Before: bare wall */}
      <KenBurns src={IMG.beforeWall} opacity={0.4 * (1 - fiftyRand.opacity)} panX={-10} />
      {/* After: branded wall fades in */}
      <Img src={staticFile(IMG.afterWall)} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        opacity: fiftyRand.opacity * 0.65,
      }} />
      <GradientOverlay direction="90deg" from={0.9} to={0.3} />

      <div style={{
        position: 'absolute', left: 80, top: '30%', maxWidth: 700,
      }}>
        <div style={{
          fontSize: 56, fontWeight: 700, color: C.accent, fontFamily: FONT,
          opacity: walls.opacity, lineHeight: 1.2,
        }}>
          What if the walls<br />could talk?
        </div>
        <div style={{
          fontSize: 28, color: withOpacity(C.text, 0.8), fontFamily: FONT,
          marginTop: 24, opacity: fiftyRand.opacity, lineHeight: 1.5,
        }}>
          R50 foamex. Magnetic mount. No drilling.
        </div>
        <div style={{
          fontSize: 22, color: withOpacity(C.accent, magnet.opacity), fontFamily: FONT,
          marginTop: 12,
        }}>
          Who was here. When. And what they did.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 4: THE SIGN IS THE PRODUCT
const Slide04SignProduct: React.FC = () => {
  const c = CUES.slide04;
  const qr = useCue(c.qrLeast);
  const sign = useCue(c.signProduct, 0.6);
  const zone = useCue(c.zoneSpecific);
  const operatives = useCue(c.operativesLearn);
  const auditor = useCue(c.auditorEvidence);

  // Poster montage — cycle through 4 posters
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const posters = [IMG.posterListeria, IMG.posterBootWash, IMG.posterHygiene, IMG.posterColorCode];
  const posterIdx = Math.min(Math.floor(frame / (3 * fps)), 3);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Background poster montage */}
      <div style={{ position: 'absolute', right: 0, top: 0, width: '45%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {posters.map((src, i) => (
          <Img key={i} src={staticFile(src)} style={{
            position: 'absolute', maxHeight: '85%', maxWidth: '85%', objectFit: 'contain',
            borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            opacity: i === posterIdx ? sign.opacity : 0,
            transform: `scale(${i === posterIdx ? 1 : 0.95})`,
            transition: 'opacity 0.3s',
          }} />
        ))}
      </div>

      <GradientOverlay direction="90deg" from={0.95} to={0.0} />

      {/* Text */}
      <div style={{ position: 'absolute', left: 80, top: '18%', maxWidth: 650 }}>
        <div style={{
          fontSize: 38, fontWeight: 700, color: C.highlight, fontFamily: FONT,
          opacity: qr.opacity, marginBottom: 16,
        }}>
          "The QR code is the least<br />interesting thing on this sign."
        </div>
        <div style={{
          fontSize: 48, fontWeight: 800, color: C.text, fontFamily: FONT,
          opacity: sign.opacity, marginBottom: 32,
        }}>
          The sign is the product.
        </div>

        {/* Three outcomes */}
        {[
          { cue: zone, label: 'Professional culture messaging — per zone', icon: '📋' },
          { cue: operatives, label: 'Operatives learn at point of action', icon: '👷' },
          { cue: auditor, label: 'Auditors see evidence on walls, not in binders', icon: '✅' },
        ].map((item, i) => (
          <div key={i} style={{
            opacity: item.cue.opacity,
            transform: `translateX(${(1 - item.cue.opacity) * 30}px)`,
            display: 'flex', alignItems: 'center', gap: 16,
            marginBottom: 16, fontSize: 22, color: withOpacity(C.text, 0.85), fontFamily: FONT,
          }}>
            <span style={{ fontSize: 28 }}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 5: THE QUIET GENIUS
const Slide05QuietGenius: React.FC = () => {
  const c = CUES.slide05;
  const scans = useCue(c.scansQr);
  const ts = useCue(c.timestamped);
  const zone = useCue(c.threeTwelve);
  const photo = useCue(c.photoPrompt);
  const bonus = useCue(c.bonus);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.heroScan} opacity={0.35} panX={-10} panY={-5} />
      <GradientOverlay direction="90deg" from={0.9} to={0.4} />

      {/* Phone mockup area */}
      <div style={{
        position: 'absolute', right: 100, top: '15%', width: 320,
        opacity: scans.opacity,
      }}>
        <Img src={staticFile(IMG.phoneTask)} style={{
          width: '100%', borderRadius: 20, boxShadow: '0 12px 40px rgba(0,0,0,0.6)',
        }} />
      </div>

      {/* Left text */}
      <div style={{ position: 'absolute', left: 80, top: '25%', maxWidth: 600 }}>
        <div style={{
          fontSize: 22, color: C.accent, fontFamily: 'monospace', opacity: ts.opacity,
          letterSpacing: 2, marginBottom: 8,
        }}>
          TIMESTAMPED • LOCATION-VERIFIED
        </div>
        <div style={{
          fontSize: 52, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: zone.opacity, lineHeight: 1.2,
        }}>
          Zone 4<br />
          <span style={{ color: C.highlight }}>03:12 AM</span>
        </div>
        <div style={{
          fontSize: 22, color: withOpacity(C.text, 0.7), fontFamily: FONT,
          marginTop: 20, opacity: photo.opacity,
        }}>
          High-risk zones trigger random photo prompts
        </div>
        <div style={{
          fontSize: 28, fontWeight: 600, color: C.accent, fontFamily: FONT,
          marginTop: 24, opacity: bonus.opacity,
          fontStyle: 'italic',
        }}>
          The digital proof? Just a bonus.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 6: AUDIT EVIDENCE BUILDS ITSELF
const Slide06AuditEvidence: React.FC = () => {
  const c = CUES.slide06;
  const notSep = useCue(c.notSeparate);
  const acc = useCue(c.accumulates, 0.6);
  const hand = useCue(c.handThemThis);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <Img src={staticFile(IMG.dashboard)} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        opacity: acc.opacity * 0.5,
      }} />
      <GradientOverlay direction="180deg" from={0.85} to={0.6} />

      <div style={{ position: 'absolute', left: 80, top: '30%', maxWidth: 700 }}>
        <div style={{
          fontSize: 44, fontWeight: 700, color: C.text, fontFamily: FONT,
          opacity: notSep.opacity, lineHeight: 1.3,
        }}>
          Evidence that<br />builds itself.
        </div>

        {/* Stacking items */}
        <div style={{ marginTop: 32, display: 'flex', gap: 20, opacity: acc.opacity }}>
          {['Scans', 'Photos', 'Coverage Maps'].map((item, i) => (
            <div key={i} style={{
              background: withOpacity(C.primary, 0.3), border: `1px solid ${withOpacity(C.accent, 0.3)}`,
              padding: '10px 20px', borderRadius: 8, fontSize: 18, fontWeight: 600,
              color: C.accent, fontFamily: FONT,
            }}>
              {item}
            </div>
          ))}
        </div>

        <div style={{
          fontSize: 32, fontWeight: 600, color: C.highlight, fontFamily: FONT,
          marginTop: 40, opacity: hand.opacity,
        }}>
          When the auditor asks — you hand them this.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 7: A SYSTEM WORTHY OF THE NAME
const Slide07Worthy: React.FC = () => {
  const c = CUES.slide07;
  const floor = useCue(c.standardFloor);
  const wall = useCue(c.standardWall);
  const noPath = useCue(c.noPath);
  const empty = useCue(c.pathEmpty);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.competitive} opacity={0.3} panX={10} />
      <GradientOverlay direction="90deg" from={0.92} to={0.4} />

      <div style={{ position: 'absolute', left: 80, top: '22%', maxWidth: 700 }}>
        <div style={{
          fontSize: 26, color: withOpacity(C.text, 0.6), fontFamily: FONT,
          opacity: floor.opacity, marginBottom: 8,
        }}>
          Ecowize already sets the standard on the floor.
        </div>
        <div style={{
          fontSize: 52, fontWeight: 800, color: C.text, fontFamily: FONT,
          opacity: wall.opacity, lineHeight: 1.2,
        }}>
          This puts that standard<br />
          <span style={{ color: C.accent }}>on the wall.</span>
        </div>

        <div style={{ marginTop: 24, display: 'flex', gap: 16, opacity: wall.opacity }}>
          {['Visible', 'Branded', 'Undeniable'].map((w, i) => (
            <span key={i} style={{
              fontSize: 20, fontWeight: 700, color: C.highlight,
              padding: '6px 16px', border: `1px solid ${withOpacity(C.highlight, 0.4)}`,
              borderRadius: 6, fontFamily: FONT,
            }}>
              {w}
            </span>
          ))}
        </div>

        <div style={{
          fontSize: 28, color: withOpacity(C.text, 0.7), fontFamily: FONT,
          marginTop: 40, opacity: noPath.opacity, lineHeight: 1.5,
        }}>
          No competitor can follow where there's no path.
        </div>
        <div style={{
          fontSize: 32, fontWeight: 700, color: '#ff6b6b', fontFamily: FONT,
          marginTop: 8, opacity: empty.opacity,
        }}>
          Right now, the path is empty.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 8: ONE SIGN, EIGHT OUTCOMES
const Slide08EightOutcomes: React.FC = () => {
  const c = CUES.slide08;
  const oneSign = useCue(c.oneSign);
  const eight = useCue(c.eight);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const outcomes = [
    { label: 'Thought Leadership', cueTime: c.thoughtLeadership, color: C.accent },
    { label: 'Client Value', cueTime: c.thoughtLeadership + 0.5, color: C.accent },
    { label: 'Proof of Presence', cueTime: c.thoughtLeadership + 1.0, color: C.accent },
    { label: 'Audit Evidence', cueTime: c.thoughtLeadership + 1.5, color: C.accent },
    { label: 'Competitive Moat', cueTime: c.moat, color: C.highlight },
    { label: 'Revenue', cueTime: c.revenue, color: C.highlight },
    { label: 'Engagement', cueTime: c.revenue + 0.4, color: C.highlight },
    { label: 'Zero Infrastructure', cueTime: c.magnetWall - 0.8, color: '#22c55e' },
  ];

  const magnetWall = useCue(c.magnetWall);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      {/* Central poster */}
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <Img src={staticFile(IMG.posterListeria)} style={{
          height: 400, borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          opacity: oneSign.opacity * 0.8,
        }} />
      </div>

      {/* Radiating outcomes */}
      {outcomes.map((o, i) => {
        const angle = (i / outcomes.length) * Math.PI * 2 - Math.PI / 2;
        const radius = 380;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const cue = useCue(o.cueTime, 0.4);

        return (
          <div key={i} style={{
            position: 'absolute',
            left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`,
            transform: 'translate(-50%, -50%)',
            opacity: cue.opacity,
            background: withOpacity(o.color, 0.15),
            border: `1px solid ${withOpacity(o.color, 0.4)}`,
            padding: '8px 18px', borderRadius: 8,
            fontSize: 16, fontWeight: 600, color: o.color,
            fontFamily: FONT, whiteSpace: 'nowrap',
          }}>
            {o.label}
          </div>
        );
      })}

      {/* Title */}
      <div style={{
        position: 'absolute', top: 40, left: 0, right: 0, textAlign: 'center',
      }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: C.text, fontFamily: FONT, opacity: oneSign.opacity }}>
          One Sign.{' '}
        </span>
        <span style={{ fontSize: 44, fontWeight: 800, color: C.highlight, fontFamily: FONT, opacity: eight.opacity }}>
          Eight Outcomes.
        </span>
      </div>

      {/* Bottom tagline */}
      <div style={{
        position: 'absolute', bottom: 50, left: 0, right: 0, textAlign: 'center',
        fontSize: 28, fontWeight: 600, color: withOpacity(C.text, 0.6), fontFamily: FONT,
        opacity: magnetWall.opacity, fontStyle: 'italic',
      }}>
        A magnet and a wall.
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 9: THE IRON IS HOT
const Slide09IronHot: React.FC = () => {
  const c = CUES.slide09;
  const platform = useCue(c.platformBuilt);
  const pick = useCue(c.pickASite);
  const any = useCue(c.anySite);
  const weeks = useCue(c.twoWeeks);
  const walls = useCue(c.wallsTalking);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <KenBurns src={IMG.scale} opacity={0.25} panX={15} zoomTo={1.1} />
      <GradientOverlay direction="180deg" from={0.7} to={0.9} />

      <div style={{ position: 'absolute', left: 80, top: '20%', maxWidth: 800 }}>
        {/* Ready status */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, opacity: platform.opacity }}>
          {['Platform Built', 'Zones Mapped', 'Signage Designed'].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 18, color: '#22c55e', fontFamily: FONT, fontWeight: 600,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'white' }}>✓</div>
              {s}
            </div>
          ))}
        </div>

        <div style={{
          fontSize: 56, fontWeight: 800, color: C.highlight, fontFamily: FONT,
          opacity: pick.opacity, lineHeight: 1.2,
        }}>
          Pick a site.
        </div>
        <div style={{
          fontSize: 56, fontWeight: 800, color: C.text, fontFamily: FONT,
          opacity: any.opacity,
        }}>
          Any site.
        </div>

        <div style={{
          fontSize: 36, fontWeight: 700, color: C.accent, fontFamily: FONT,
          marginTop: 24, opacity: weeks.opacity,
        }}>
          Two weeks.
        </div>

        <div style={{
          fontSize: 24, color: withOpacity(C.text, 0.7), fontFamily: FONT,
          marginTop: 32, opacity: walls.opacity, lineHeight: 1.6, maxWidth: 700,
          fontStyle: 'italic',
        }}>
          While your competitors are still debating spreadsheets,<br />
          your walls will already be talking.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// SLIDE 10: THE LINE (SILENT)
const Slide10TheLine: React.FC = () => {
  const c = CUES.slide10;
  const prove = useCue(c.proveIt, 1.0);
  const worthy = useCue(c.worthy, 1.2);

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 24,
      }}>
        <div style={{
          fontSize: 52, fontWeight: 700, color: '#ffffff', fontFamily: FONT,
          opacity: prove.opacity, textAlign: 'center', lineHeight: 1.4,
        }}>
          We don't just clean your plant.<br />We prove it.
        </div>
        <div style={{
          fontSize: 24, color: withOpacity('#ffffff', 0.6), fontFamily: FONT,
          opacity: worthy.opacity, textAlign: 'center', marginTop: 8,
        }}>
          A food safety culture system worthy of the Ecowize name.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Main Composition ────────────────────────────────────
export interface EcowizeSignagePitchProps {
  audioNarration?: boolean;
  audioFolder?: string;
}

export function getEcowizeSignagePitchDuration(fps: number, audioFolder = 'audio/ecowize-signage'): number {
  const durations = SLIDE_DURATION_MAP[audioFolder] || SLIDE_DURATIONS_DEFAULT;
  const totalSeconds = durations.reduce((sum, d) => sum + d, 0);
  return totalSeconds * fps - (durations.length - 1) * TRANSITION_FRAMES;
}

const fadeT = <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })} />;

const SLIDES = [
  Slide01CrimeScene,
  Slide02InvisibleGap,
  Slide03WallsTalk,
  Slide04SignProduct,
  Slide05QuietGenius,
  Slide06AuditEvidence,
  Slide07Worthy,
  Slide08EightOutcomes,
  Slide09IronHot,
  Slide10TheLine,
];

export const EcowizeSignagePitch: React.FC<EcowizeSignagePitchProps> = ({ audioNarration = true, audioFolder = 'audio/ecowize-signage' }) => {
  const slideDurations = SLIDE_DURATION_MAP[audioFolder] || SLIDE_DURATIONS_DEFAULT;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <TransitionSeries>
        {SLIDES.map((SlideComponent, i) => (
          <React.Fragment key={i}>
            {i > 0 && fadeT}
            <TransitionSeries.Sequence durationInFrames={slideDurations[i] * FPS}>
              <NarratedInner slideNum={i + 1} audio={audioNarration} audioFolder={audioFolder}>
                <SlideComponent />
              </NarratedInner>
            </TransitionSeries.Sequence>
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
