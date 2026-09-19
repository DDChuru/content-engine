import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Lockup} from './Artwork';
import {BODY, DISPLAY, useBrandFonts} from './fonts';
import {BRAND} from './palette';
import {progress, settle} from './timing';
import type {BookendProps} from './Stem4LifeBookends';

// An independent paper surface: never sample or cover a lesson's background.
// The same navy/paper relationship is used in the worked-question reference.
const LessonFrame: React.FC<BookendProps & {outro?: boolean}> = ({title, subtitle, outro = false}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const fontsReady = useBrandFonts();
  if (!fontsReady) return null;
  const reveal = settle(frame, fps, 0.08, 0.72);
  const heading = settle(frame, fps, 0.24, 0.8);
  const rule = progress(frame, fps, 0.3, 0.9);
  const footer = settle(frame, fps, 0.55, 0.75);
  const titleSize = title.length > 90 ? 64 : title.length > 55 ? 78 : 102;
  return <AbsoluteFill style={{background: `linear-gradient(145deg, ${BRAND['surface-dark']} 20%, ${BRAND.ink})`, color: BRAND['surface-warm'], fontFamily: BODY, fontSynthesis: 'none'}}>
    <div style={{position: 'absolute', left: 112, top: 88, width: 400}}>
      <Lockup frame={frame} fps={fps} ink={BRAND['surface-warm']} accent={BRAND.accent}/>
    </div>
    <div style={{position: 'absolute', right: 112, top: 110, fontSize: 27, letterSpacing: 1, color: '#C3CEDA'}}>{subtitle}</div>
    <div style={{position: 'absolute', left: 112, right: 112, top: 250, bottom: 182, borderRadius: 28,
      backgroundColor: BRAND['surface-warm'], color: BRAND.ink, overflow: 'hidden', opacity: reveal,
      transform: `translateY(${26 * (1 - reveal)}px)`}}>
      <svg viewBox="0 0 1696 648" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}} aria-hidden="true">
        {Array.from({length: 12}, (_, i) => <path key={i} d={`M0 ${58 + i * 54}H1696`} stroke={BRAND.ink} strokeOpacity="0.065"/>)}
        <path d="M64 0V648" stroke={BRAND.primary} strokeOpacity="0.22"/>
        <path d="M1300 120h244v244 M1380 444h164V280" fill="none" stroke={BRAND.primary} strokeOpacity="0.12" strokeWidth="2"/>
        <circle cx="1422" cy="282" r="82" fill="none" stroke={BRAND.primary} strokeOpacity="0.16" strokeWidth="2"/>
        <path d="M1340 282h164 M1422 200v164" stroke={BRAND.primary} strokeOpacity="0.16" strokeWidth="2"/>
      </svg>
      <div style={{position: 'absolute', left: 104, top: 66, fontSize: 25, fontWeight: 700, letterSpacing: 4, color: BRAND.primary}}>{outro ? 'PUT IT INTO PRACTICE' : 'THE MECHANICS COLLECTION'}</div>
      <div style={{position: 'absolute', left: 104, top: 146, width: 1220, opacity: heading, transform: `translateY(${16 * (1 - heading)}px)`}}>
        <div data-title style={{fontFamily: DISPLAY, fontSize: outro ? 86 : titleSize, fontWeight: 600, lineHeight: 1.16, letterSpacing: -2.5, overflowWrap: 'anywhere'}}>
          {outro ? 'Understanding is the start.' : title}
        </div>
        {outro && <div style={{fontSize: 38, marginTop: 30, color: '#536074'}}>Now work it through.</div>}
      </div>
      <div style={{position: 'absolute', left: 104, bottom: 116, height: 3, width: 128 * rule, backgroundColor: BRAND.primary}}/>
      <div style={{position: 'absolute', left: 104, bottom: 51, fontSize: outro ? 29 : 30, opacity: footer, width: 1460}}>
        {outro ? `YOU JUST STUDIED  ·  ${title}` : 'Understand it. Work it through.'}
      </div>
    </div>
    <div style={{position: 'absolute', left: 112, bottom: 65, fontFamily: DISPLAY, fontSize: outro ? 54 : 32, fontWeight: 600, opacity: footer}}>stem4life.com</div>
    <div style={{position: 'absolute', right: 112, bottom: 75, fontSize: 24, letterSpacing: 3, color: BRAND.accent, opacity: footer}}>{outro ? 'KEEP LEARNING' : 'LESSON FILM'}</div>
  </AbsoluteFill>;
};

export const LessonFrameIntro: React.FC<BookendProps> = (props) => <LessonFrame {...props}/>;
export const LessonFrameOutro: React.FC<BookendProps> = (props) => <LessonFrame {...props} outro/>;
