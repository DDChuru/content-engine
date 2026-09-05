import React from 'react';
import { Composition } from 'remotion';
import { HandwrittenMath, type MathScene } from './kit/HandwrittenMath';
import mathDemo from './math/demo.json';
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
import { IinmExpertChA } from './IinmExpertChA';
import ch1Timing from './iinm/ch1-timing.json';
import chATiming from './iinm/chA-timing.json';
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
import {
  EquipmentIssueTutorial,
  EquipmentIssueTutorialBranded,
  EQUIPMENT_BRANDED_FRAMES,
  EQUIPMENT_FPS,
  EQUIPMENT_JOURNEY_FRAMES,
} from './equipment/EquipmentIssueTutorial';
import {
  PpeIssueTutorial,
  PpeIssueTutorialBranded,
  PPE_BRANDED_FRAMES,
  PPE_FPS,
  PPE_JOURNEY_FRAMES,
} from './ppe/PpeIssueTutorial';
import {
  SchedulePreviewTutorial,
  SchedulePreviewTutorialBranded,
  SCHEDULE_BRANDED_FRAMES,
  SCHEDULE_FPS,
  SCHEDULE_TUTORIAL_FRAMES,
} from './schedule/SchedulePreviewTutorial';
import { CcvTutorial, CCV_TUTORIAL_FPS, CCV_TUTORIAL_FRAMES } from './ccv/CcvTutorial';
import {
  BillOfHealthTutorial,
  BillOfHealthTutorialBranded,
  BOH_BRANDED_FRAMES,
  BOH_FPS,
  BOH_TUTORIAL_FRAMES,
} from './boh/BillOfHealthTutorial';
import { TapDemo, TAPDEMO_FPS, TAPDEMO_FRAMES } from './tapdemo/TapDemo';
import { AnnotatedWalkthrough, WALK_FPS, WALK_FRAMES } from './tapdemo/AnnotatedWalkthrough';
import { AnnotatedVideo, projectFrames } from './tapdemo/AnnotatedVideo';
import activeProject from './tapdemo/active-project.json';
import { TutorialKit, kitDurationInFrames } from './kit/TutorialKit';
import type { BeatsDoc } from './kit/types';
import ccvBeats from './ccv/beats.json';
import icleanBeats from './iclean/beats.json';

const ccvBeatsDoc = ccvBeats as BeatsDoc;
const icleanBeatsDoc = icleanBeats as BeatsDoc;

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
      <Composition
        id="IinmExpertChA"
        component={IinmExpertChA}
        durationInFrames={chATiming.total_frames}
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

      {/* e-wizer mobile - Equipment Issue & Returns journey (teal, PhoneJourney pattern) */}
      <Composition
        id="EquipmentIssueTutorial"
        component={EquipmentIssueTutorial}
        durationInFrames={EQUIPMENT_JOURNEY_FRAMES}
        fps={EQUIPMENT_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - Equipment Issue & Returns with Ecowize/e-wizer branded bookends */}
      <Composition
        id="EquipmentIssueTutorialBranded"
        component={EquipmentIssueTutorialBranded}
        durationInFrames={EQUIPMENT_BRANDED_FRAMES}
        fps={EQUIPMENT_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - PPE Issue & Returns journey (amber, PhoneJourney pattern) */}
      <Composition
        id="PpeIssueTutorial"
        component={PpeIssueTutorial}
        durationInFrames={PPE_JOURNEY_FRAMES}
        fps={PPE_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - PPE Issue & Returns with Ecowize/e-wizer branded bookends */}
      <Composition
        id="PpeIssueTutorialBranded"
        component={PpeIssueTutorialBranded}
        durationInFrames={PPE_BRANDED_FRAMES}
        fps={PPE_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - Schedule Preview (what's due today vs any date) step-by-step */}
      <Composition
        id="SchedulePreviewTutorial"
        component={SchedulePreviewTutorial}
        durationInFrames={SCHEDULE_TUTORIAL_FRAMES}
        fps={SCHEDULE_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile - Schedule Preview with Ecowize/e-wizer branded bookends */}
      <Composition
        id="SchedulePreviewTutorialBranded"
        component={SchedulePreviewTutorialBranded}
        durationInFrames={SCHEDULE_BRANDED_FRAMES}
        fps={SCHEDULE_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — CCV "The Second Pair of Eyes" (12 narration beats, ~4:46) */}
      <Composition
        id="CcvSecondPairOfEyes"
        component={CcvTutorial}
        durationInFrames={CCV_TUTORIAL_FRAMES}
        fps={CCV_TUTORIAL_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — Bill of Health (Ecowize Academy video 07, 12 beats, ~4:40) */}
      <Composition
        id="BillOfHealthTutorial"
        component={BillOfHealthTutorial}
        durationInFrames={BOH_TUTORIAL_FRAMES}
        fps={BOH_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — Bill of Health with Ecowize/e-wizer branded bookends */}
      <Composition
        id="BillOfHealthTutorialBranded"
        component={BillOfHealthTutorialBranded}
        durationInFrames={BOH_BRANDED_FRAMES}
        fps={BOH_FPS}
        width={1920}
        height={1080}
      />

      {/* TutorialKit — ONE data-driven field-guide composition (beatsmith Phase 0),
          rendering the CCV beats.json end-to-end from the shared src/kit primitives. */}
      <Composition
        id="TutorialKit"
        component={TutorialKit}
        durationInFrames={kitDurationInFrames(ccvBeatsDoc)}
        fps={ccvBeatsDoc.fps}
        width={1920}
        height={1080}
        defaultProps={{ beats: ccvBeatsDoc, assetBase: 'ccv-tutorial' }}
      />

      {/* iClean 2.0 — "Your First Inspection" (12 narration beats via TutorialKit;
          stills pending, beat 7 uses the captured wash-bay finding shot) */}
      <Composition
        id="IcleanFirstInspection"
        component={TutorialKit}
        durationInFrames={kitDurationInFrames(icleanBeatsDoc)}
        fps={icleanBeatsDoc.fps}
        width={1920}
        height={1080}
        defaultProps={{ beats: icleanBeatsDoc, assetBase: 'iclean-tutorial' }}
      />

      {/* e-wizer mobile — TapDemo PROOF: annotated in-app recording (tap ripples)
          wrapped in the Ecowize bookends. intro → recording+taps → outro. */}
      <Composition
        id="TapDemo"
        component={TapDemo}
        durationInFrames={TAPDEMO_FRAMES}
        fps={TAPDEMO_FPS}
        width={1920}
        height={1080}
      />

      {/* e-wizer mobile — Daily Hygiene FULL walkthrough: real recording + the
          29-mark annotation storyboard (tools/annotate.html export), bookended. */}
      <Composition
        id="DailyHygieneWalkthrough"
        component={AnnotatedWalkthrough}
        durationInFrames={WALK_FRAMES}
        fps={WALK_FPS}
        width={1920}
        height={1080}
      />

      {/* VidStud — GENERIC annotated-video stitcher. Point it at any recording +
          marks JSON via props (defaults to the hygiene project). Duration is
          derived from the project (clip length + optional bookends). */}
      <Composition
        id="AnnotatedVideo"
        component={AnnotatedVideo}
        defaultProps={activeProject as any}
        fps={(activeProject as any).fps}
        width={1920}
        height={1080}
        calculateMetadata={({ props }) => ({
          durationInFrames: projectFrames(props),
          fps: props.fps,
        })}
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
        <Composition
      id="HandwrittenMath"
      component={HandwrittenMath}
      durationInFrames={(mathDemo as MathScene).durationInFrames}
      fps={(mathDemo as MathScene).fps}
      width={(mathDemo as MathScene).w}
      height={(mathDemo as MathScene).h}
      defaultProps={{ scene: mathDemo as MathScene, title: 'Solving for x' }}
    />
</>
  );
};
