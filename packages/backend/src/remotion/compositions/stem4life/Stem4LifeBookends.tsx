import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {InstrumentIntroLockup, Lockup, Wordmark} from './Artwork';
import {BODY, DISPLAY, useBrandFonts} from './fonts';
import {BRAND} from './palette';
import {progress, settle} from './timing';

export {INTRO_FRAMES, OUTRO_FRAMES, FPS, URL_SETTLED_FRAME} from './timing';
export type BookendAesthetic = 'A' | 'B' | 'C';
export type BookendProps = {title: string; subtitle?: string; accentA?: string; accentB?: string};
export type IntroBProps = BookendProps & {heroHeight?: number};
export type Stem4LifeBookendProps = BookendProps & {aesthetic?: BookendAesthetic};

const palette = (aesthetic: BookendAesthetic, accentA?: string, accentB?: string) => ({
  background: aesthetic === 'B' ? BRAND['surface-dark'] : aesthetic === 'C' ? BRAND['surface-warm'] : BRAND.surface,
  ink: aesthetic === 'B' ? BRAND['surface-warm'] : BRAND.ink,
  accent: aesthetic === 'B' ? accentB ?? BRAND.accent : accentA ?? BRAND.primary,
});

const GraphPaper: React.FC<{frame: number; fps: number; accent: string}> = ({frame, fps, accent}) => (
  <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} aria-hidden="true">
    {/* The app uses an 8px grid: 48px is a sixfold video-scale interpretation. */}
    {Array.from({length: 41}, (_, i) => <path key={`v${i}`} d={`M${i * 48} 0V1080`} stroke={BRAND.ink} strokeOpacity="0.055" strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress(frame, fps, 0.18 + i * 0.012, 0.8)}/>)}
    {Array.from({length: 24}, (_, i) => <path key={`h${i}`} d={`M0 ${i * 48}H1920`} stroke={BRAND.ink} strokeOpacity="0.055" strokeWidth="1" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress(frame, fps, i * 0.014, 0.75)}/>)}
    <path d="M168 168V930" fill="none" stroke={accent} strokeOpacity="0.22" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress(frame, fps, 0.5, 0.7)}/>
  </svg>
);

// Measure only after the local fonts are ready. Fit complete titles to two lines;
// never truncate a lesson name to make a preview look better.
const fitTitle = (text: string, width: number, max: number, maxLines = 2) => {
  if (typeof document === 'undefined') return max;
  const context = document.createElement('canvas').getContext('2d');
  if (!context) return max;
  for (let size = max; size >= 28; size -= 2) {
    context.font = `600 ${size}px "${DISPLAY}"`;
    let line = ''; let lines = 1; let fits = true;
    for (const word of text.split(/\s+/)) {
      if (context.measureText(word).width > width) {fits = false; break;}
      const next = line ? `${line} ${word}` : word;
      if (context.measureText(next).width > width) {lines++; line = word;} else {line = next;}
    }
    if (fits && lines <= maxLines) return size;
  }
  return 28;
};

const focusGuidePath = (heroHeight: number) => {
  const left = Math.round(960 - heroHeight / 2);
  const right = Math.round(960 + heroHeight / 2);
  const top = Math.round(540 - heroHeight * 0.825 / 2);
  const bottom = Math.round(540 + heroHeight * 0.825 / 2);
  const corner = Math.round(Math.max(36, heroHeight * 0.0625));
  return `M${left + corner} ${top}H${left}V${top + corner} M${right - corner} ${top}H${right}V${top + corner} M${left} ${bottom - corner}V${bottom}H${left + corner} M${right - corner} ${bottom}H${right}V${bottom - corner}`;
};

const Intro: React.FC<BookendProps & {aesthetic: BookendAesthetic; heroHeight?: number}> = ({title, subtitle, accentA, accentB, aesthetic, heroHeight = 800}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const fontsReady = useBrandFonts();
  if (!fontsReady) return null;
  const color = palette(aesthetic, accentA, accentB);
  const paper = aesthetic === 'C';
  const titleReveal = settle(frame, fps, aesthetic === 'B' ? 100 / fps : 2.0, aesthetic === 'B' ? 18 / fps : 0.72);
  const footer = settle(frame, fps, aesthetic === 'B' ? 104 / fps : 2.5, aesthetic === 'B' ? 14 / fps : 0.65);
  const paperLogo = paper ? settle(frame, fps, 0.68, 0.9) : 1;
  const guide = aesthetic === 'B' ? progress(frame, fps, 0.2, 0.35) * (1 - progress(frame, fps, 72 / fps, 16 / fps)) : 0;
  const rule = progress(frame, fps, aesthetic === 'B' ? 100 / fps : 1.6, aesthetic === 'B' ? 18 / fps : 0.72);
  const titleSize = fitTitle(title, 1480, 68);
  return <AbsoluteFill style={{backgroundColor: color.background, color: color.ink, fontFamily: BODY, fontSynthesis: 'none'}}>
    {paper && <GraphPaper frame={frame} fps={fps} accent={color.accent}/>}
    <div style={{position: 'absolute', left: 168, top: 115, fontSize: 24, fontWeight: 600, letterSpacing: 3, opacity: progress(frame, fps, 0.15, 0.6)}}>
      {aesthetic === 'A' ? 'STEM THAT STAYS WITH YOU' : aesthetic === 'B' ? 'LOOK CLOSELY. UNDERSTAND MORE.' : 'UNDERSTAND IT. WORK IT THROUGH.'}
    </div>
    {aesthetic === 'B' && <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: guide * 0.45}} aria-hidden="true">
      <path d={focusGuidePath(heroHeight)} fill="none" stroke={color.accent} strokeWidth="2"/>
    </svg>}
    <div style={{position: 'absolute', left: aesthetic === 'A' ? 310 : 300, top: 304,
      width: aesthetic === 'A' ? 1300 : 1320, opacity: paperLogo,
      transform: `translateY(${paper ? 24 * (1 - paperLogo) : 0}px)`}}>
      {aesthetic === 'A' ? <Wordmark frame={frame} fps={fps} ink={color.ink} accent={color.accent} assemble/>
        : aesthetic === 'B' ? <InstrumentIntroLockup frame={frame} fps={fps} ink={color.ink} accent={color.accent} heroHeight={heroHeight}/>
          : <Lockup frame={frame} fps={fps} ink={color.ink} accent={color.accent}/>}
    </div>
    <div style={{position: 'absolute', left: 960 - 68 * rule, top: 607, width: 136 * rule, height: 3, backgroundColor: color.accent}}/>
    <div style={{position: 'absolute', left: 220, top: 657, width: 1480, textAlign: 'center', opacity: titleReveal,
      transform: `translateY(${18 * (1 - titleReveal)}px)`}}>
      <div data-title style={{fontFamily: DISPLAY, fontSize: titleSize, fontWeight: 600, lineHeight: 1.17, letterSpacing: -1.4, overflowWrap: 'anywhere'}}>{title}</div>
      {subtitle && <div style={{marginTop: 22, fontSize: 32, fontWeight: 400, lineHeight: 1.25, opacity: 0.78}}>{subtitle}</div>}
    </div>
    <div style={{position: 'absolute', bottom: 100, left: 0, width: '100%', textAlign: 'center', fontSize: 34, fontWeight: 600, opacity: footer}}>stem4life.com</div>
    {aesthetic === 'B' && <div aria-hidden="true" style={{position: 'absolute', inset: 0, backgroundColor: '#000000', opacity: 1 - progress(frame, fps, 0, 12 / fps)}}/>}
  </AbsoluteFill>;
};

export const IntroA: React.FC<BookendProps> = (props) => <Intro {...props} aesthetic="A"/>;
export const IntroB: React.FC<IntroBProps> = (props) => <Intro {...props} aesthetic="B"/>;
export const IntroC: React.FC<BookendProps> = (props) => <Intro {...props} aesthetic="C"/>;

/** Recommended default is the app's paper aesthetic; each variant is also exported. */
export const Stem4LifeIntro: React.FC<Stem4LifeBookendProps> = ({aesthetic = 'C', ...props}) => <Intro {...props} aesthetic={aesthetic}/>;

export const Stem4LifeOutro: React.FC<Stem4LifeBookendProps> = ({title, subtitle, accentA, accentB, aesthetic = 'C'}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const fontsReady = useBrandFonts();
  if (!fontsReady) return null;
  const color = palette(aesthetic, accentA, accentB);
  const logo = settle(frame, fps, 0.08, 0.75);
  const cta = settle(frame, fps, 0.45, 0.7);
  const url = settle(frame, fps, 0.85, 0.95);
  const lesson = settle(frame, fps, 1.1, 0.8);
  const underline = progress(frame, fps, 1.2, 0.6);
  return <AbsoluteFill style={{backgroundColor: color.background, color: color.ink, fontFamily: BODY, fontSynthesis: 'none'}}>
    {aesthetic === 'C' && <GraphPaper frame={frame} fps={fps} accent={color.accent}/>}
    <div style={{position: 'absolute', left: aesthetic === 'A' ? 485 : 435, top: 157,
      width: aesthetic === 'A' ? 950 : 1050, opacity: logo, transform: `translateY(${18 * (1 - logo)}px)`}}>
      {aesthetic === 'A' ? <Wordmark frame={frame} fps={fps} ink={color.ink} accent={color.accent}/>
        : <Lockup frame={frame} fps={fps} ink={color.ink} accent={color.accent}/>}
    </div>
    <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', fontFamily: DISPLAY,
      fontSize: 42, fontWeight: 500, opacity: cta, transform: `translateY(${12 * (1 - cta)}px)`}}>Keep learning. Put it into practice.</div>
    <div data-url style={{position: 'absolute', top: 561, width: '100%', textAlign: 'center', fontFamily: DISPLAY,
      fontSize: 108, fontWeight: 700, letterSpacing: -3, lineHeight: 1.2, opacity: url,
      transform: `translateY(${22 * (1 - url)}px)`}}>stem4life.com</div>
    <div style={{position: 'absolute', left: 960 - 360 * underline, top: 708, width: 720 * underline, height: 3, backgroundColor: color.accent}}/>
    <div style={{position: 'absolute', top: 800, left: 220, width: 1480, textAlign: 'center', opacity: lesson}}>
      <div style={{fontSize: 22, fontWeight: 600, letterSpacing: 2.5, marginBottom: 17}}>YOU JUST STUDIED</div>
      <div data-title style={{fontFamily: DISPLAY, fontSize: fitTitle(title, 1480, 46), fontWeight: 600, lineHeight: 1.2, overflowWrap: 'anywhere'}}>{title}</div>
      {subtitle && <div style={{fontSize: 28, lineHeight: 1.25, marginTop: 12, opacity: 0.75}}>{subtitle}</div>}
    </div>
  </AbsoluteFill>;
};
