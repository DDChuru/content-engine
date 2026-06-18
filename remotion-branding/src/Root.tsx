import React from 'react';
import { Composition } from 'remotion';
import { Intro } from './Intro';
import { Outro } from './Outro';
import { IntroWithImage } from './IntroWithImage';
import { PipelineDiagram } from './PipelineDiagram';
import { DigitisationIntro } from './DigitisationIntro';
import { IinmModuleScene } from './IinmModuleScene';
import { IinmLifecycleScene } from './IinmLifecycleScene';
import { IinmComplianceScene } from './IinmComplianceScene';
import { IinmOversightScene } from './IinmOversightScene';
import { IinmSummaryScene } from './IinmSummaryScene';
import { IinmCh0Intro } from './IinmCh0Intro';
import ch0Timing from './iinm/ch0-timing.json';
import { IinmCh1 } from './IinmCh1';
import ch1Timing from './iinm/ch1-timing.json';
import { IinmCh2 } from './IinmCh2';
import ch2Timing from './iinm/ch2-timing.json';
import { IinmCh3 } from './IinmCh3';
import ch3Timing from './iinm/ch3-timing.json';
import { IinmCh4 } from './IinmCh4';
import ch4Timing from './iinm/ch4-timing.json';
import { IinmCh5 } from './IinmCh5';
import ch5Timing from './iinm/ch5-timing.json';
import {
  CleaningVerificationTutorial,
  CLN_TUTORIAL_FRAMES,
  CLN_TUTORIAL_FPS,
} from './cln/CleaningVerificationTutorial';
import {
  CleaningVerificationTutorialV2,
  CleaningVerificationTutorialV3,
  CLN_TUTORIAL_V2_FRAMES,
  CLN_TUTORIAL_V2_FPS,
  CLN_TUTORIAL_V3_FRAMES,
  CLN_TUTORIAL_V3_FPS,
} from './cln/CleaningVerificationTutorialV2';
import {
  CleaningVerificationTutorialV3Branded,
  CLN_BRANDED_FPS,
  CLN_BRANDED_FRAMES,
} from './cln/CleaningVerificationBranded';
import {
  DailyHygieneTutorial,
  DailyHygieneTutorialBranded,
  DAILY_HYGIENE_BRANDED_FRAMES,
  DAILY_HYGIENE_FPS,
  DAILY_HYGIENE_TUTORIAL_FRAMES,
} from './hygiene/DailyHygieneTutorial';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* IINM User Guide — Chapter 0: Welcome / orientation (pyramid + §24 teaser).
          Built on the Codex conventions kit; duration + VO + caption sync all driven
          by ch0-timing.json (emitted from the measured ElevenLabs VO). */}
      <Composition
        id="IinmCh0Intro"
        component={IinmCh0Intro}
        durationInFrames={ch0Timing.total_frames}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ audioSrc: ch0Timing.audio }}
      />
      {/* IINM User Guide — Chapter 1: Capture the first report (real screencast + §24). */}
      <Composition
        id="IinmCh1"
        component={IinmCh1}
        durationInFrames={ch1Timing.total_frames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* IINM User Guide — Chapter 2: dangerous occurrence (§24 with no injury). */}
      <Composition
        id="IinmCh2"
        component={IinmCh2}
        durationInFrames={ch2Timing.total_frames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* IINM User Guide — Chapter 3: investigate & root cause. */}
      <Composition
        id="IinmCh3"
        component={IinmCh3}
        durationInFrames={ch3Timing.total_frames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* IINM User Guide — Chapter 4: SHEQ verify, close & Annexure 1. */}
      <Composition
        id="IinmCh4"
        component={IinmCh4}
        durationInFrames={ch4Timing.total_frames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* IINM User Guide — Chapter 5: oversight + your in-app e-wizer guide. */}
      <Composition
        id="IinmCh5"
        component={IinmCh5}
        durationInFrames={ch5Timing.total_frames}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Scene 2 — Meet e-wizer: walk all 4 categories + lifecycle (real stills) — ~89s @ 30fps */}
      <Composition
        id="IinmModuleScene"
        component={IinmModuleScene}
        durationInFrames={2670}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Scene 3 — The right person, every step (role-gated lifecycle) — ~40s @ 30fps */}
      <Composition
        id="IinmLifecycleScene"
        component={IinmLifecycleScene}
        durationInFrames={1230}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Scene 1 — Paper → Digital cold open (IINM video) — ~41s @ 30fps (matches 39.4s VO + hold) */}
      <Composition
        id="DigitisationIntro"
        component={DigitisationIntro}
        durationInFrames={1230}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Scene 4 — Compliance you can prove (§24 clock → one-click Annexure 1) — ~37s @ 30fps */}
      <Composition
        id="IinmComplianceScene"
        component={IinmComplianceScene}
        durationInFrames={1110}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Scene 5 — Nothing slips (oversight from the real register) — ~26s @ 30fps */}
      <Composition
        id="IinmOversightScene"
        component={IinmOversightScene}
        durationInFrames={780}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Scene 6 — Summary (captured · guided · routed · proven) — ~20s @ 30fps */}
      <Composition
        id="IinmSummaryScene"
        component={IinmSummaryScene}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      {/* Intro Composition - 3 seconds at 30fps = 90 frames */}
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Content Engine',
          subtitle: 'Professional Training Content',
          brandColor: '#4f46e5',
        }}
      />

      {/* Outro Composition - 5 seconds at 30fps = 150 frames */}
      <Composition
        id="Outro"
        component={Outro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Thanks for Watching!',
          callToAction: 'Subscribe for More Training Videos',
          socialHandles: {
            youtube: '@ContentEngine',
            twitter: '@ContentEngine',
            website: 'contentengine.com',
          },
          contactInfo: 'questions@contentengine.com',
          brandColor: '#4f46e5',
        }}
      />

      {/* Example: SOP Intro */}
      <Composition
        id="SOPIntro"
        component={Intro}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Temperature Monitoring',
          subtitle: 'Standard Operating Procedure',
          brandColor: '#0ea5e9',
        }}
      />

      {/* Example: Training Outro */}
      <Composition
        id="TrainingOutro"
        component={Outro}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Great Job!',
          callToAction: 'Complete the Quiz to Finish',
          contactInfo: 'Need help? Contact training@company.com',
          brandColor: '#0ea5e9',
        }}
      />

      {/* Example: Intro with Custom Images */}
      <Composition
        id="IntroWithImage"
        component={IntroWithImage}
        durationInFrames={90}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Content Engine',
          subtitle: 'Professional Training Content',
          brandColor: '#4f46e5',
          logoPath: 'images/logo.png',  // Your logo goes here
          backgroundImage: 'images/background.jpg',  // Optional background
        }}
      />

      {/* e-wizer mobile — Cleaning Verification step-by-step (Bakery Demo stills) */}
      <Composition
        id="CleaningVerificationTutorial"
        component={CleaningVerificationTutorial}
        durationInFrames={CLN_TUTORIAL_FRAMES}
        fps={CLN_TUTORIAL_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — V2 training cut with enlarged action focus + zoom callouts */}
      <Composition
        id="CleaningVerificationTutorialV2"
        component={CleaningVerificationTutorialV2}
        durationInFrames={CLN_TUTORIAL_V2_FRAMES}
        fps={CLN_TUTORIAL_V2_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — V3 with explicit scan entry points + off-schedule workflow */}
      <Composition
        id="CleaningVerificationTutorialV3"
        component={CleaningVerificationTutorialV3}
        durationInFrames={CLN_TUTORIAL_V3_FRAMES}
        fps={CLN_TUTORIAL_V3_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — V3 with Ecowize/e-wizer animated intro and outro */}
      <Composition
        id="CleaningVerificationTutorialV3Branded"
        component={CleaningVerificationTutorialV3Branded}
        durationInFrames={CLN_BRANDED_FRAMES}
        fps={CLN_BRANDED_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - Daily Hygiene Checklist step-by-step roster workflow */}
      <Composition
        id="DailyHygieneTutorial"
        component={DailyHygieneTutorial}
        durationInFrames={DAILY_HYGIENE_TUTORIAL_FRAMES}
        fps={DAILY_HYGIENE_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - Daily Hygiene Checklist with Ecowize/e-wizer branded bookends */}
      <Composition
        id="DailyHygieneTutorialBranded"
        component={DailyHygieneTutorialBranded}
        durationInFrames={DAILY_HYGIENE_BRANDED_FRAMES}
        fps={DAILY_HYGIENE_FPS}
        width={1920}
        height={1080}
      />

      {/* Pipeline Diagram - Educational Video Production Flow */}
      <Composition
        id="PipelineDiagram"
        component={PipelineDiagram}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
