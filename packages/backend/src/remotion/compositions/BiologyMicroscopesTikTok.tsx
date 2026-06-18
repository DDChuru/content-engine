/**
 * Microscopes — Magnification vs Resolution — TikTok (9:16)
 *
 * Cambridge 9700 Topic 1 — Cell Structure
 * Light vs electron microscopes, magnification formula, TEM vs SEM.
 *
 * Pure CSS motion graphics — 8 scenes, ~125 seconds, 1080×1920.
 * Voice: Chatterbox (daniel) — chunked generation.
 */

import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from 'remotion';

const FPS = 30;
const TOTAL_DURATION_S = 125;

const T = {
  bg: '#050510',
  surface: '#0e1225',
  text: '#f5f5ff',
  textMuted: '#94a3b8',
  primary: '#00d9ff',
  success: '#22c55e',
  accent: '#c084fc',
  danger: '#ef4444',
  gold: '#fbbf24',
  warning: '#f59e0b',
  lens: '#3b82f6',
  electron: '#a855f7',
  light: '#22d3ee',
  font: 'Inter, system-ui, sans-serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
};

// ── Cue Map — Whisper-resolved from chunked daniel narration ────────
const DEFAULT_CUES: Record<string, number> = {
  // Scene 1: Hook (0s–6.2s)
  'cell': 0.98,
  'two-things': 4.36,
  // Scene 2: Magnification vs Resolution (6.2s–12s)
  'magnification': 6.22,
  'resolution': 7.54,
  'exam-test': 9.76,
  // Scene 3: Formula (12s–30s)
  'how-many-times': 12.36,
  'formula': 18.66,
  'image-size': 20.20,
  'triangle': 24.90,
  // Scene 4: The Catch — Blurry (30s–53s)
  'blurry': 31.72,
  'still-blurry': 34.80,
  'resolution-def': 39.58,
  'minimum-distance': 43.42,
  'higher-resolution': 51.00,
  // Scene 5: Light Microscopes (53s–68s)
  'light-microscopes': 53.68,
  'mag-1500': 56.02,
  'res-200nm': 58.98,
  'organelles': 62.14,
  // Scene 6: Electron Microscopes (68s–90s)
  'electron-microscopes': 68.74,
  'mag-500k': 70.68,
  'res-1nm': 75.60,
  'ribosomes': 81.14,
  // Scene 7: TEM vs SEM (90s–113s)
  'tem': 91.36,
  'transmission': 93.10,
  'thin-slice': 96.00,
  'two-d': 99.00,
  'sem': 104.44,
  'scanning': 105.72,
  'three-d': 110.00,
  // Scene 8: CTA (113s–end)
  'bigger': 114.64,
  'clearer': 116.92,
  'know-formula': 121.82,
  'marks': 124.04,
};

export interface BiologyMicroscopesTikTokProps {
  audioEnabled?: boolean;
  cueOverrides?: Record<string, number>;
}

// ── Hooks ────────────────────────────────────────────────────────────

function useCue(cueTimeSeconds: number, fadeDuration = 0.5) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const opacity = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [cueFrame, cueFrame + fadeDuration * fps], [20, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return { opacity, translateY, isActive: frame >= cueFrame };
}

function useCueSpring(cueTimeSeconds: number) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cueFrame = cueTimeSeconds * fps;
  const progress = spring({ frame: frame - cueFrame, fps, config: { damping: 14, mass: 0.8 } });
  const opacity = frame >= cueFrame ? progress : 0;
  const scale = frame >= cueFrame ? interpolate(progress, [0, 1], [0.85, 1]) : 0;
  return { opacity, scale, isActive: frame >= cueFrame };
}

// ── Shared Components ────────────────────────────────────────────────

const GlowText: React.FC<{
  children: React.ReactNode; color?: string; fontSize?: number; style?: React.CSSProperties;
}> = ({ children, color = T.primary, fontSize = 48, style }) => (
  <div style={{
    fontFamily: T.font, fontWeight: 800, fontSize, color,
    textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`, textAlign: 'center', ...style,
  }}>{children}</div>
);

const Badge: React.FC<{
  label: string; color: string; opacity: number; scale?: number; fontSize?: number;
}> = ({ label, color, opacity, scale = 1, fontSize = 24 }) => (
  <div style={{
    opacity, transform: `scale(${scale})`,
    background: `${color}22`, border: `2px solid ${color}`,
    borderRadius: 12, padding: '8px 20px', fontFamily: T.font, fontWeight: 700,
    fontSize, color, textAlign: 'center', display: 'inline-block',
  }}>{label}</div>
);

const SubText: React.FC<{
  children: React.ReactNode; opacity: number; translateY?: number; fontSize?: number;
}> = ({ children, opacity, translateY = 0, fontSize = 28 }) => (
  <div style={{
    opacity, transform: `translateY(${translateY}px)`,
    fontFamily: T.font, fontWeight: 500, fontSize, color: T.textMuted,
    textAlign: 'center', lineHeight: 1.5, maxWidth: 900, margin: '0 auto',
  }}>{children}</div>
);

// ── Scene 1: Hook ────────────────────────────────────────────────────

const HookScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const cell = useCueSpring(ct('cell'));
  const twoThings = useCue(ct('two-things'));

  const hookScale = interpolate(frame, [0, 4 * FPS], [1.0, 1.08],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <Img src={staticFile('images/biology/microscopes/hook-lens.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        opacity: interpolate(frame, [0, 15], [0, 0.5], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        filter: 'brightness(0.35)', transform: `scale(${hookScale})`,
      }} />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ opacity: cell.opacity, transform: `scale(${cell.scale})` }}>
          <GlowText fontSize={72} color={T.primary}>CAN YOU SEE</GlowText>
          <GlowText fontSize={56} color={T.text} style={{ marginTop: 10 }}>what's inside a cell?</GlowText>
        </div>
        <SubText opacity={twoThings.opacity} translateY={twoThings.translateY} fontSize={32}>
          It depends on <span style={{ color: T.gold, fontWeight: 700 }}>two things</span>
        </SubText>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: Magnification vs Resolution ─────────────────────────────

const DefinitionScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const mag = useCueSpring(ct('magnification'));
  const res = useCueSpring(ct('resolution'));
  const exam = useCue(ct('exam-test'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
        <div style={{ opacity: mag.opacity, transform: `scale(${mag.scale})` }}>
          <Badge label="MAGNIFICATION" color={T.light} opacity={1} fontSize={36} />
        </div>
        <div style={{ opacity: res.opacity, transform: `scale(${res.scale})`, marginTop: 10 }}>
          <Badge label="RESOLUTION" color={T.electron} opacity={1} fontSize={36} />
        </div>
        <SubText opacity={exam.opacity} translateY={exam.translateY} fontSize={30}>
          They're <span style={{ color: T.danger, fontWeight: 700 }}>NOT</span> the same
        </SubText>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Formula ─────────────────────────────────────────────────

const FormulaScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const howMany = useCue(ct('how-many-times'));
  const formula = useCueSpring(ct('formula'));
  const imageSize = useCue(ct('image-size'));
  const triangle = useCueSpring(ct('triangle'));

  // Scene title fades in immediately
  const titleOpacity = interpolate(frame, [0, 10], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, padding: '0 60px' }}>
        {/* Scene title — appears immediately */}
        <div style={{ opacity: titleOpacity }}>
          <GlowText fontSize={48} color={T.light}>MAGNIFICATION</GlowText>
        </div>

        <div style={{ opacity: howMany.opacity, transform: `translateY(${howMany.translateY}px)` }}>
          <div style={{
            fontFamily: T.font, fontSize: 28, color: T.text, textAlign: 'center', lineHeight: 1.6,
          }}>
            How many times <span style={{ color: T.primary, fontWeight: 700 }}>larger</span> the image is
          </div>
        </div>

        {/* Formula card */}
        <div style={{ opacity: formula.opacity, transform: `scale(${formula.scale})` }}>
          <div style={{
            background: T.surface, border: `2px solid ${T.primary}50`,
            borderRadius: 20, padding: '35px 55px', textAlign: 'center',
            boxShadow: `0 0 40px ${T.primary}15`,
          }}>
            <div style={{ fontFamily: T.mono, fontSize: 44, color: T.primary, fontWeight: 800 }}>M = I ÷ A</div>
            <div style={{ fontFamily: T.mono, fontSize: 20, color: T.textMuted, marginTop: 15 }}>
              magnification = image size ÷ actual size
            </div>
          </div>
        </div>

        <div style={{ opacity: imageSize.opacity, transform: `translateY(${imageSize.translateY}px)` }}>
          <div style={{
            fontFamily: T.font, fontSize: 24, color: T.gold, textAlign: 'center',
            background: `${T.gold}10`, padding: '10px 25px', borderRadius: 12,
            border: `1px solid ${T.gold}30`,
          }}>
            Rearrange for any of the three
          </div>
        </div>

        {/* IAM Triangle */}
        <div style={{ opacity: triangle.opacity, transform: `scale(${triangle.scale})` }}>
          <svg width={220} height={200} viewBox="0 0 220 200">
            <polygon points="110,15 15,185 205,185" fill={`${T.primary}08`} stroke={T.primary} strokeWidth={3} />
            <line x1={15} y1={185} x2={205} y2={185} stroke={T.primary} strokeWidth={3} />
            <text x={110} y={80} textAnchor="middle" fill={T.gold} fontSize={38} fontWeight={800} fontFamily="Inter">I</text>
            <text x={65} y={165} textAnchor="middle" fill={T.light} fontSize={38} fontWeight={800} fontFamily="Inter">A</text>
            <text x={155} y={165} textAnchor="middle" fill={T.electron} fontSize={38} fontWeight={800} fontFamily="Inter">M</text>
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: The Catch — Resolution Definition ───────────────────────

const BlurryScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const blurry = useCue(ct('blurry'));
  const stillBlurry = useCue(ct('still-blurry'));
  const resDef = useCue(ct('resolution-def'));
  const minDist = useCue(ct('minimum-distance'));
  const higher = useCue(ct('higher-resolution'));

  // Scene title fades in immediately
  const titleOpacity = interpolate(frame, [0, 10], [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  const blurAmount = interpolate(
    frame,
    [ct('blurry') * fps, ct('still-blurry') * fps],
    [0, 12],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 25, padding: '0 60px' }}>
        {/* Scene title — immediate */}
        <div style={{ opacity: titleOpacity }}>
          <GlowText fontSize={48} color={T.warning}>HERE'S THE CATCH</GlowText>
        </div>

        <div style={{ opacity: blurry.opacity }}>
          <SubText opacity={1} fontSize={26}>A blurry image magnified...</SubText>
        </div>

        <div style={{ opacity: stillBlurry.opacity, filter: `blur(${blurAmount}px)` }}>
          <GlowText fontSize={72} color={T.danger}>1000×</GlowText>
          <SubText opacity={1} fontSize={28}>still blurry</SubText>
        </div>

        <div style={{ opacity: resDef.opacity, transform: `translateY(${resDef.translateY}px)`, marginTop: 15 }}>
          <GlowText fontSize={42} color={T.electron}>RESOLUTION</GlowText>
        </div>

        <div style={{ opacity: minDist.opacity }}>
          <div style={{
            fontFamily: T.font, fontSize: 26, color: T.text, textAlign: 'center',
            lineHeight: 1.6, maxWidth: 800,
            background: `${T.electron}10`, padding: '15px 25px', borderRadius: 16,
            border: `1px solid ${T.electron}30`,
          }}>
            The minimum distance between two points<br />
            that can still be <span style={{ color: T.electron, fontWeight: 700 }}>distinguished as separate</span>
          </div>
        </div>

        <div style={{ opacity: higher.opacity, display: 'flex', gap: 20, marginTop: 10 }}>
          <Badge label="↓ Distance" color={T.success} opacity={1} fontSize={24} />
          <Badge label="↑ Resolution" color={T.primary} opacity={1} fontSize={24} />
          <Badge label="↑ Detail" color={T.gold} opacity={1} fontSize={24} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: Light Microscopes ───────────────────────────────────────

const LightMicroscopeScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const light = useCueSpring(ct('light-microscopes'));
  const mag = useCue(ct('mag-1500'));
  const res = useCue(ct('res-200nm'));
  const org = useCue(ct('organelles'));

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Subtle hook image background */}
      <Img src={staticFile('images/biology/microscopes/hook-lens.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        opacity: 0.25, filter: 'brightness(0.4) saturate(0.8)',
      }} />
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: 'linear-gradient(180deg, rgba(5,5,16,0.8) 0%, rgba(5,5,16,0.3) 40%, rgba(5,5,16,0.8) 100%)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 35, padding: '0 60px' }}>
          <div style={{ opacity: light.opacity, transform: `scale(${light.scale})` }}>
            <GlowText fontSize={58} color={T.light}>LIGHT</GlowText>
            <GlowText fontSize={58} color={T.light}>MICROSCOPE</GlowText>
          </div>

          {/* Stats cards */}
          <div style={{ display: 'flex', gap: 25, opacity: mag.opacity }}>
            <div style={{
              background: `${T.light}15`, border: `2px solid ${T.light}60`,
              borderRadius: 16, padding: '20px 30px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 18, color: T.textMuted }}>Magnification</div>
              <div style={{ fontFamily: T.mono, fontSize: 42, color: T.light, fontWeight: 800, marginTop: 8 }}>×1,500</div>
            </div>
            <div style={{
              background: `${T.warning}15`, border: `2px solid ${T.warning}60`,
              borderRadius: 16, padding: '20px 30px', textAlign: 'center',
              opacity: res.opacity,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 18, color: T.textMuted }}>Resolution</div>
              <div style={{ fontFamily: T.mono, fontSize: 42, color: T.warning, fontWeight: 800, marginTop: 8 }}>200 nm</div>
            </div>
          </div>

          <div style={{ opacity: org.opacity, transform: `translateY(${org.translateY}px)` }}>
            <SubText opacity={1} fontSize={28}>Good enough for cells & large organelles</SubText>
            <div style={{ display: 'flex', gap: 18, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Badge label="Nucleus" color={T.primary} opacity={1} fontSize={24} />
              <Badge label="Mitochondria" color={T.warning} opacity={1} fontSize={24} />
              <Badge label="Chloroplasts" color={T.success} opacity={1} fontSize={24} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 6: Electron Microscopes ────────────────────────────────────

const ElectronMicroscopeScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const elec = useCueSpring(ct('electron-microscopes'));
  const mag = useCue(ct('mag-500k'));
  const res = useCue(ct('res-1nm'));
  const ribo = useCue(ct('ribosomes'));

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {/* Background image — visible enough to set mood */}
      <Img src={staticFile('images/biology/microscopes/cover-microscopes.jpg')} style={{
        position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
        opacity: 0.45, filter: 'brightness(0.5) saturate(1.2)',
      }} />
      {/* Dark gradient overlay for text readability */}
      <div style={{
        position: 'absolute', width: '100%', height: '100%',
        background: 'linear-gradient(180deg, rgba(5,5,16,0.7) 0%, rgba(5,5,16,0.4) 30%, rgba(5,5,16,0.6) 70%, rgba(5,5,16,0.85) 100%)',
      }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, padding: '0 60px' }}>
          <div style={{ opacity: elec.opacity, transform: `scale(${elec.scale})` }}>
            <GlowText fontSize={56} color={T.electron}>ELECTRON</GlowText>
            <GlowText fontSize={56} color={T.electron}>MICROSCOPE</GlowText>
          </div>

          {/* Stats cards side by side */}
          <div style={{ display: 'flex', gap: 25, opacity: mag.opacity }}>
            <div style={{
              background: `${T.electron}15`, border: `2px solid ${T.electron}60`,
              borderRadius: 16, padding: '20px 30px', textAlign: 'center',
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 18, color: T.textMuted }}>Magnification</div>
              <div style={{ fontFamily: T.mono, fontSize: 42, color: T.electron, fontWeight: 800, marginTop: 8 }}>×500,000</div>
            </div>
            <div style={{
              background: `${T.success}15`, border: `2px solid ${T.success}60`,
              borderRadius: 16, padding: '20px 30px', textAlign: 'center',
              opacity: res.opacity,
            }}>
              <div style={{ fontFamily: T.mono, fontSize: 18, color: T.textMuted }}>Resolution</div>
              <div style={{ fontFamily: T.mono, fontSize: 42, color: T.success, fontWeight: 800, marginTop: 8 }}>1 nm</div>
            </div>
          </div>

          <div style={{ opacity: ribo.opacity, transform: `translateY(${ribo.translateY}px)` }}>
            <SubText opacity={1} fontSize={28}>Now you can see the <span style={{ color: T.accent, fontWeight: 700 }}>ultrastructure</span></SubText>
            <div style={{ display: 'flex', gap: 18, marginTop: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Badge label="Ribosomes" color={T.accent} opacity={1} fontSize={24} />
              <Badge label="ER membranes" color={T.primary} opacity={1} fontSize={24} />
              <Badge label="Cristae" color={T.warning} opacity={1} fontSize={24} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Scene 7: TEM vs SEM ──────────────────────────────────────────────

const TEMvsSEMScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const tem = useCueSpring(ct('tem'));
  const trans = useCue(ct('transmission'));
  const thin = useCue(ct('thin-slice'));
  const twoD = useCue(ct('two-d'));
  const sem = useCueSpring(ct('sem'));
  const scan = useCue(ct('scanning'));
  const threeD = useCue(ct('three-d'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 25, padding: '0 50px' }}>
        <GlowText fontSize={44} color={T.text}>TWO TYPES</GlowText>

        {/* TEM */}
        <div style={{
          opacity: tem.opacity, transform: `scale(${tem.scale})`,
          background: `${T.light}12`, border: `2px solid ${T.light}50`,
          borderRadius: 24, padding: '30px 40px', width: 900, marginTop: 15,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 15 }}>
            <div style={{
              fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.light,
              textShadow: `0 0 30px ${T.light}60`,
            }}>TEM</div>
            <div style={{ opacity: trans.opacity }}>
              <div style={{ fontFamily: T.font, fontSize: 22, color: T.textMuted }}>Transmission Electron Microscope</div>
            </div>
          </div>
          <div style={{ opacity: thin.opacity, marginTop: 5 }}>
            <div style={{
              fontFamily: T.font, fontSize: 24, color: T.text, lineHeight: 1.5,
              borderLeft: `4px solid ${T.light}60`, paddingLeft: 15,
            }}>
              Beam passes through a <span style={{ color: T.light, fontWeight: 700 }}>thin slice</span>
            </div>
          </div>
          <div style={{ opacity: twoD.opacity, marginTop: 15 }}>
            <Badge label="2D — Detailed internal structure" color={T.light} opacity={1} fontSize={22} />
          </div>
        </div>

        {/* SEM */}
        <div style={{
          opacity: sem.opacity, transform: `scale(${sem.scale})`,
          background: `${T.electron}12`, border: `2px solid ${T.electron}50`,
          borderRadius: 24, padding: '30px 40px', width: 900,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 15 }}>
            <div style={{
              fontFamily: T.mono, fontSize: 48, fontWeight: 900, color: T.electron,
              textShadow: `0 0 30px ${T.electron}60`,
            }}>SEM</div>
            <div style={{ opacity: scan.opacity }}>
              <div style={{ fontFamily: T.font, fontSize: 22, color: T.textMuted }}>Scanning Electron Microscope</div>
            </div>
          </div>
          <div style={{ opacity: threeD.opacity, marginTop: 5 }}>
            <div style={{
              fontFamily: T.font, fontSize: 24, color: T.text, lineHeight: 1.5,
              borderLeft: `4px solid ${T.electron}60`, paddingLeft: 15,
            }}>
              Beam bounces off the <span style={{ color: T.electron, fontWeight: 700 }}>surface</span>
            </div>
            <div style={{ marginTop: 15 }}>
              <Badge label="3D — Surface topology" color={T.electron} opacity={1} fontSize={22} />
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 8: CTA ─────────────────────────────────────────────────────

const CTAScene: React.FC<{ ct: (id: string) => number }> = ({ ct }) => {
  const bigger = useCueSpring(ct('bigger'));
  const clearer = useCueSpring(ct('clearer'));
  const knowFormula = useCue(ct('know-formula'));
  const marks = useCueSpring(ct('marks'));

  return (
    <AbsoluteFill style={{ background: T.bg, justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ opacity: bigger.opacity, transform: `scale(${bigger.scale})` }}>
            <Badge label="Magnification → BIGGER" color={T.light} opacity={1} fontSize={26} />
          </div>
          <div style={{ opacity: clearer.opacity, transform: `scale(${clearer.scale})` }}>
            <Badge label="Resolution → CLEARER" color={T.electron} opacity={1} fontSize={26} />
          </div>
        </div>
        <SubText opacity={knowFormula.opacity} translateY={knowFormula.translateY} fontSize={28}>
          Know the difference. Know the formula.
        </SubText>
        <div style={{ opacity: marks.opacity, transform: `scale(${marks.scale})` }}>
          <GlowText fontSize={56} color={T.gold}>THAT'S YOUR MARKS</GlowText>
        </div>
        <div style={{
          opacity: marks.opacity, marginTop: 20,
          fontFamily: T.font, fontSize: 22, color: T.textMuted, textAlign: 'center',
        }}>
          Cambridge 9700 · Chapter 1
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scenes Array ─────────────────────────────────────────────────────

interface SceneTiming {
  id: string; startS: number; durationS: number;
  Component: React.FC<{ ct: (id: string) => number }>;
}

const SCENES: SceneTiming[] = [
  { id: 'hook',         startS: 0,      durationS: 6.22,  Component: HookScene },
  { id: 'definition',   startS: 6.22,   durationS: 5.78,  Component: DefinitionScene },
  { id: 'formula',      startS: 12.0,   durationS: 18.0,  Component: FormulaScene },
  { id: 'blurry',       startS: 30.0,   durationS: 23.68, Component: BlurryScene },
  { id: 'light',        startS: 53.68,  durationS: 15.06, Component: LightMicroscopeScene },
  { id: 'electron',     startS: 68.74,  durationS: 22.62, Component: ElectronMicroscopeScene },
  { id: 'tem-sem',      startS: 91.36,  durationS: 21.64, Component: TEMvsSEMScene },
  { id: 'cta',          startS: 113.0,  durationS: 12.0,  Component: CTAScene },
];

// ── Progress Bar ─────────────────────────────────────────────────────

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: `${T.text}10` }}>
      <div style={{ height: '100%', width: `${(frame / durationInFrames) * 100}%`,
        background: `linear-gradient(90deg, ${T.light}, ${T.electron})`, borderRadius: 2 }} />
    </div>
  );
};

// ── Main Composition ─────────────────────────────────────────────────

export const BiologyMicroscopesTikTok: React.FC<BiologyMicroscopesTikTokProps> = ({
  audioEnabled = true,
  cueOverrides,
}) => {
  const { fps } = useVideoConfig();
  const cues = { ...DEFAULT_CUES, ...cueOverrides };
  const ct = (id: string) => cues[id] ?? 0;

  return (
    <AbsoluteFill style={{ background: T.bg }}>
      {audioEnabled && (
        <Audio src={staticFile('audio/biology/microscopes-narration.mp3')} volume={1} />
      )}
      {SCENES.map((scene) => {
        const startFrame = Math.round(scene.startS * fps);
        const durationFrames = Math.round(scene.durationS * fps);
        return (
          <Sequence key={scene.id} from={startFrame} durationInFrames={durationFrames}>
            <scene.Component ct={(id: string) => ct(id) - scene.startS} />
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};

export function getBiologyMicroscopesDuration(fps: number): number {
  return Math.ceil(TOTAL_DURATION_S * fps);
}

export const BiologyMicroscopesCover: React.FC = () => (
  <AbsoluteFill style={{ background: T.bg }}>
    <Img src={staticFile('images/biology/microscopes/cover-microscopes.jpg')} style={{
      position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
      opacity: 0.4, filter: 'brightness(0.45)',
    }} />
    <div style={{
      position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', height: '100%', gap: 20,
    }}>
      <GlowText fontSize={64} color={T.primary}>MAGNIFICATION</GlowText>
      <GlowText fontSize={38} color={T.textMuted}>vs</GlowText>
      <GlowText fontSize={64} color={T.electron}>RESOLUTION</GlowText>
      <div style={{ display: 'flex', gap: 15, marginTop: 20 }}>
        <Badge label="Light" color={T.light} opacity={1} fontSize={22} />
        <Badge label="Electron" color={T.electron} opacity={1} fontSize={22} />
      </div>
      <div style={{
        fontFamily: T.font, fontSize: 20, color: T.textMuted,
        marginTop: 15, textAlign: 'center',
      }}>
        Cambridge 9700 · Chapter 1
      </div>
    </div>
  </AbsoluteFill>
);
