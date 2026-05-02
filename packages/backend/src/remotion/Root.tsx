import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { EducationalLesson } from './compositions/EducationalLesson';
import { SetsLesson, getSetsLessonDuration } from './compositions/SetsLesson';
import { EconetComplaintVideo } from './compositions/ConsumerComplaint';
import { PlacardProtestVideo, getPlacardVideoDuration } from './compositions/PlacardProtest';
import { SemicircleTheorem, getSemicircleTheoremDuration } from './compositions/SemicircleTheorem';
import { Documentary } from './compositions/Documentary';
import {
  TikTokScene,
  YouTubeVideo,
  getTikTokDuration,
  getYouTubeDuration,
  YouTubeSceneData,
} from './compositions/AIChangesEverything';
import {
  TikTok01Hook,
  TikTok02OldWorld,
  TikTok03NewWorld,
  TikTok04Timeline,
  TikTok05Proof,
  TikTok06Twist,
} from './compositions/AIChangesTikTok';
import { TikTok03Enhanced } from './compositions/TikTok03Enhanced';
import { VideoEditor, VideoEditorDemo, SceneConfig } from './compositions/VideoEditor';
import { SpicegroIntroduction, getSpicegroIntroDuration } from './compositions/SpicegroIntroduction';
import { EcowizePitch, getEcowizePitchDuration, EcowizePitchProps } from './compositions/EcowizePitch';
import { EcowizePitchWithCaptions, EcowizePitchWithCaptionsProps } from './compositions/EcowizePitchWithCaptions';
import { EcowizePitchSyncedDemo, getEcowizePitchSyncedDuration } from './compositions/EcowizePitchSynced';
import { EcowizePitchFull, getEcowizePitchFullDuration, EcowizePitchFullProps } from './compositions/EcowizePitchFull';
import { EcowizeSignagePitch, getEcowizeSignagePitchDuration, EcowizeSignagePitchProps } from './compositions/EcowizeSignagePitch';
import { ProjectComposition, ProjectCompositionProps, calculateProjectMetadata } from './compositions/ProjectComposition';
import { BiologyBiomolecules, BiologyBiomoleculesProps, getBiologyBiomoleculesDuration } from './compositions/BiologyBiomolecules';
import { BiologyFoodTestsTikTok, BiologyFoodTestsTikTokProps, getBiologyFoodTestsDuration, BiologyFoodTestsCover } from './compositions/BiologyFoodTestsTikTok';
import { BiologyCellFractionationTikTok, BiologyCellFractionationTikTokProps, getBiologyCellFractionationDuration, BiologyCellFractionationCover } from './compositions/BiologyCellFractionationTikTok';
import { MathsProofTikTok, MathsProofTikTokProps, getMathsProofDuration, MathsProofCover } from './compositions/MathsProofTikTok';
import { MathsProofNotationTikTok, MathsProofNotationTikTokProps, getMathsProofNotationDuration, MathsProofNotationCover } from './compositions/MathsProofNotationTikTok';
import { BiologyEnzymesTikTok, BiologyEnzymesTikTokProps, getBiologyEnzymesDuration, BiologyEnzymesCover } from './compositions/BiologyEnzymesTikTok';
import { BiologyOsmosisTikTok, BiologyOsmosisTikTokProps, getBiologyOsmosisDuration, BiologyOsmosisCover } from './compositions/BiologyOsmosisTikTok';
import { BiologyActiveTransportTikTok, BiologyActiveTransportTikTokProps, getBiologyActiveTransportDuration, BiologyActiveTransportCover } from './compositions/BiologyActiveTransportTikTok';
import { BiologyEndocytosisTikTok, BiologyEndocytosisTikTokProps, getBiologyEndocytosisDuration, BiologyEndocytosisCover } from './compositions/BiologyEndocytosisTikTok';
import { BiologyPhagocytosisTikTok, BiologyPhagocytosisTikTokProps, getBiologyPhagocytosisDuration, BiologyPhagocytosisCover } from './compositions/BiologyPhagocytosisTikTok';
import { BiologyAutophagyTikTok, BiologyAutophagyTikTokProps, getBiologyAutophagyDuration, BiologyAutophagyCover } from './compositions/BiologyAutophagyTikTok';
import { Esther18Birthday, Esther18Props, getEsther18Duration } from './compositions/Esther18Birthday';
import { BirthdayTribute, BirthdayTributeProps, getBirthdayTributeDuration } from './compositions/BirthdayTribute';
import { ListeriaSATikTok, ListeriaSATikTokProps, ListeriaSACover, getListeriaSADuration } from './compositions/ListeriaSATikTok';
import { BiologyMicroscopesTikTok, BiologyMicroscopesTikTokProps, getBiologyMicroscopesDuration, BiologyMicroscopesCover } from './compositions/BiologyMicroscopesTikTok';
import { UCLPredictionsTikTok, UCLPredictionsTikTokProps, getUCLPredictionsDuration, UCLPredictionsCover } from './compositions/UCLPredictionsTikTok';
import { ClaudeCodeContinueTikTok, ClaudeCodeContinueTikTokProps, getClaudeCodeContinueDuration } from './compositions/ClaudeCodeContinueTikTok';
import { NanoBananaComparisonTikTok, NanoBananaComparisonTikTokProps, getNanoBananaComparisonDuration } from './compositions/NanoBananaComparisonTikTok';
import { DifferentiationTikTok, DifferentiationTikTokProps, getDifferentiationDuration } from './compositions/DifferentiationTikTok';
import { BakeryTrainingScene, BakeryTrainingProps, Scene as BakeryScene } from './compositions/BakeryTrainingScene';
import { StoichiometryMoleTikTok, StoichiometryMoleTikTokProps, getStoichiometryMoleDuration, StoichiometryMoleCover } from './compositions/StoichiometryMoleTikTok';
import { StoichiometryMolarMassTikTok, StoichiometryMolarMassTikTokProps, getStoichiometryMolarMassDuration, StoichiometryMolarMassCover } from './compositions/StoichiometryMolarMassTikTok';
import { StoichiometryTriangleTikTok, StoichiometryTriangleTikTokProps, getStoichiometryTriangleDuration, StoichiometryTriangleCover } from './compositions/StoichiometryTriangleTikTok';
import { StoichiometryBalancingTikTok, StoichiometryBalancingTikTokProps, getStoichiometryBalancingDuration, StoichiometryBalancingCover } from './compositions/StoichiometryBalancingTikTok';
import { StoichiometryReactingMassesTikTok, StoichiometryReactingMassesTikTokProps, getStoichiometryReactingMassesDuration, StoichiometryReactingMassesCover } from './compositions/StoichiometryReactingMassesTikTok';
import { StoichiometrySolutionsTikTok, StoichiometrySolutionsTikTokProps, getStoichiometrySolutionsDuration, StoichiometrySolutionsCover } from './compositions/StoichiometrySolutionsTikTok';
import { StoichiometryLimitingTikTok, StoichiometryLimitingTikTokProps, getStoichiometryLimitingDuration, StoichiometryLimitingCover } from './compositions/StoichiometryLimitingTikTok';
import { StoichiometryGasVolumesTikTok, StoichiometryGasVolumesTikTokProps, getStoichiometryGasVolumesDuration, StoichiometryGasVolumesCover } from './compositions/StoichiometryGasVolumesTikTok';

const fps = 30;

export const RemotionRoot: React.FC = () => {
  const setsLessonDuration = getSetsLessonDuration(fps);
  const placardVideoDuration = getPlacardVideoDuration(fps);
  const semicircleTheoremDuration = getSemicircleTheoremDuration(fps);
  const spicegroIntroDuration = getSpicegroIntroDuration(fps);
  const ecowizePitchNarrated = getEcowizePitchDuration(fps, true);
  const ecowizePitchSilent = getEcowizePitchDuration(fps, false);
  const ecowizePitchSynced = getEcowizePitchSyncedDuration(fps);
  const ecowizePitchFull = getEcowizePitchFullDuration(fps);
  const ecowizeSignagePitch = getEcowizeSignagePitchDuration(fps);
  const ecowizeSignageDaniel = getEcowizeSignagePitchDuration(fps, 'audio/ecowize-signage-daniel');
  const ecowizeSignageDanielExpressive = getEcowizeSignagePitchDuration(fps, 'audio/ecowize-signage-daniel-expressive');
  const biologyBiomoleculesDuration = getBiologyBiomoleculesDuration(fps);
  const biologyFoodTestsDuration = getBiologyFoodTestsDuration(fps);
  const biologyCellFractionationDuration = getBiologyCellFractionationDuration(fps);
  const mathsProofDuration = getMathsProofDuration(fps);
  const mathsProofNotationDuration = getMathsProofNotationDuration(fps);
  const biologyEnzymesDuration = getBiologyEnzymesDuration(fps);
  const biologyOsmosisDuration = getBiologyOsmosisDuration(fps);
  const biologyActiveTransportDuration = getBiologyActiveTransportDuration(fps);
  const biologyEndocytosisDuration = getBiologyEndocytosisDuration(fps);
  const biologyPhagocytosisDuration = getBiologyPhagocytosisDuration(fps);
  const biologyAutophagyDuration = getBiologyAutophagyDuration(fps);
  const esther18Duration = getEsther18Duration(fps);
  const birthdayTributeDuration = getBirthdayTributeDuration(fps);
  const listeriaSADuration = getListeriaSADuration(fps);
  const biologyMicroscopesDuration = getBiologyMicroscopesDuration(fps);
  const uclPredictionsDuration = getUCLPredictionsDuration(fps);
  const claudeCodeContinueDuration = getClaudeCodeContinueDuration(fps);
  const nanoBananaComparisonDuration = getNanoBananaComparisonDuration(fps);
  const differentiationDuration = getDifferentiationDuration(fps);
  const stoichiometryMoleDuration = getStoichiometryMoleDuration(fps);
  const stoichiometryMolarMassDuration = getStoichiometryMolarMassDuration(fps);
  const stoichiometryTriangleDuration = getStoichiometryTriangleDuration(fps);
  const stoichiometryBalancingDuration = getStoichiometryBalancingDuration(fps);
  const stoichiometryReactingMassesDuration = getStoichiometryReactingMassesDuration(fps);
  const stoichiometrySolutionsDuration = getStoichiometrySolutionsDuration(fps);
  const stoichiometryLimitingDuration = getStoichiometryLimitingDuration(fps);
  const stoichiometryGasVolumesDuration = getStoichiometryGasVolumesDuration(fps);

  return (
    <>
      <Composition
        id="EducationalLesson"
        component={EducationalLesson}
        durationInFrames={1650} // 55 seconds @ 30fps
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: []
        }}
      />

      <Composition
        id="SetsLesson"
        component={SetsLesson}
        durationInFrames={setsLessonDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          includeIntro: true,
          includeManimScenes: true,
          audioNarration: false,
        }}
      />

      <Composition
        id="EconetComplaint"
        component={EconetComplaintVideo}
        durationInFrames={35 * 30} // 35 seconds @ 30fps
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="PlacardProtest"
        component={PlacardProtestVideo}
        durationInFrames={placardVideoDuration}
        fps={fps}
        width={1920}
        height={1080}
      />

      <Composition
        id="SemicircleTheorem"
        component={SemicircleTheorem}
        durationInFrames={semicircleTheoremDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          includeAudio: true,
        }}
      />

      <Composition
        id="Documentary"
        component={Documentary}
        durationInFrames={120 * fps} // 2 minutes default, will be calculated dynamically
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'Documentary',
          subtitle: '',
          scenes: [],
        }}
      />

      {/* AI Changes Everything - TikTok Videos (6 x ~45s each) */}
      <Composition
        id="AIChanges-TikTok-01"
        component={TikTok01Hook}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="AIChanges-TikTok-02"
        component={TikTok02OldWorld}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="AIChanges-TikTok-03"
        component={TikTok03NewWorld}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="TikTok-03-Enhanced"
        component={TikTok03Enhanced}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="AIChanges-TikTok-04"
        component={TikTok04Timeline}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="AIChanges-TikTok-05"
        component={TikTok05Proof}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />
      <Composition
        id="AIChanges-TikTok-06"
        component={TikTok06Twist}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Legacy AI Changes TikTok (for backward compat) */}
      <Composition
        id="AIChanges-TikTok"
        component={TikTokScene}
        durationInFrames={getTikTokDuration(fps)}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          id: 'tiktok_01',
          title: 'The Framework Trap',
          script: 'AI changed everything about how we learn to code.',
          hook: 'What if your framework knowledge is optional?',
          audioSrc: '',
          durationFrames: getTikTokDuration(fps),
        }}
      />

      {/* AI Changes Everything - YouTube Full Video */}
      <Composition
        id="AIChanges-YouTube"
        component={YouTubeVideo}
        durationInFrames={10 * 60 * fps} // 10 minutes
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          title: 'AI Changes Everything: A Developer\'s New Reality',
          scenes: [] as YouTubeSceneData[],
        }}
      />

      {/* Video Editor - Transitions Demo */}
      <Composition
        id="VideoEditor-Demo"
        component={VideoEditorDemo}
        durationInFrames={480} // 16 seconds @ 30fps (7 scenes)
        fps={fps}
        width={1920}
        height={1080}
      />

      {/* Video Editor - Configurable */}
      <Composition
        id="VideoEditor"
        component={VideoEditor}
        durationInFrames={300} // Default 10 seconds, adjust based on scenes
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          scenes: [] as SceneConfig[],
          showProgress: true,
          theme: 'dark' as const,
        }}
      />

      {/* Spicegro Introduction Slide Deck */}
      <Composition
        id="SpicegroIntroduction"
        component={SpicegroIntroduction}
        durationInFrames={spicegroIntroDuration}
        fps={fps}
        width={1920}
        height={1080}
      />

      {/* Ecowize Digital Platform Pitch — with narration */}
      <Composition
        id="EcowizePitch"
        component={EcowizePitch}
        durationInFrames={ecowizePitchNarrated}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
        } satisfies EcowizePitchProps}
      />

      {/* Ecowize Digital Platform Pitch — silent (no narration) */}
      <Composition
        id="EcowizePitch-Silent"
        component={EcowizePitch}
        durationInFrames={ecowizePitchSilent}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: false,
        } satisfies EcowizePitchProps}
      />

      {/* Ecowize Pitch with Animated Captions (Karaoke style) */}
      <Composition
        id="EcowizePitch-Captions"
        component={EcowizePitchWithCaptions}
        durationInFrames={ecowizePitchNarrated}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          captionStyle: 'karaoke',
          showCaptions: true,
        } satisfies EcowizePitchWithCaptionsProps}
      />

      {/* Ecowize Pitch with Subtitle Captions */}
      <Composition
        id="EcowizePitch-Subtitles"
        component={EcowizePitchWithCaptions}
        durationInFrames={ecowizePitchNarrated}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          captionStyle: 'subtitle',
          showCaptions: true,
        } satisfies EcowizePitchWithCaptionsProps}
      />

      {/* Ecowize Pitch with Highlight Captions */}
      <Composition
        id="EcowizePitch-Highlight"
        component={EcowizePitchWithCaptions}
        durationInFrames={ecowizePitchNarrated}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          captionStyle: 'highlight',
          showCaptions: true,
        } satisfies EcowizePitchWithCaptionsProps}
      />

      {/* Ecowize Pitch - Narration Synced Demo (Slides 6-7 only) */}
      <Composition
        id="EcowizePitch-Synced"
        component={EcowizePitchSyncedDemo}
        durationInFrames={ecowizePitchSynced}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
        }}
      />

      {/* Ecowize Pitch - FULL Narration Synced (All 15 Slides) */}
      <Composition
        id="EcowizePitch-Full"
        component={EcowizePitchFull}
        durationInFrames={ecowizePitchFull}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
        } satisfies EcowizePitchFullProps}
      />

      {/* Ecowize Signage Pitch - Default Voice */}
      <Composition
        id="EcowizeSignagePitch"
        component={EcowizeSignagePitch}
        durationInFrames={ecowizeSignagePitch}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          audioFolder: 'audio/ecowize-signage',
        } satisfies EcowizeSignagePitchProps}
      />

      {/* Ecowize Signage Pitch - Daniel Voice */}
      <Composition
        id="EcowizeSignagePitch-Daniel"
        component={EcowizeSignagePitch}
        durationInFrames={ecowizeSignageDaniel}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          audioFolder: 'audio/ecowize-signage-daniel',
        } satisfies EcowizeSignagePitchProps}
      />

      {/* Ecowize Signage Pitch - Daniel Expressive Voice */}
      <Composition
        id="EcowizeSignagePitch-DanielExpressive"
        component={EcowizeSignagePitch}
        durationInFrames={ecowizeSignageDanielExpressive}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          audioFolder: 'audio/ecowize-signage-daniel-expressive',
        } satisfies EcowizeSignagePitchProps}
      />

      {/* Video Editor - TikTok Format */}
      <Composition
        id="VideoEditor-TikTok"
        component={VideoEditor}
        durationInFrames={45 * fps}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [] as SceneConfig[],
          showProgress: true,
          theme: 'cinematic' as const,
        }}
      />

      {/* Biology Biomolecules — Cambridge 9700 Topic 2 */}
      <Composition
        id="BiologyBiomolecules"
        component={BiologyBiomolecules}
        durationInFrames={biologyBiomoleculesDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioNarration: true,
          manifestData: undefined,
        } satisfies BiologyBiomoleculesProps}
      />

      {/* Biology Food Tests TikTok — Cambridge 9700 Section 2.1 (9:16) */}
      <Composition
        id="BiologyFoodTests-TikTok"
        component={BiologyFoodTestsTikTok}
        durationInFrames={biologyFoodTestsDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyFoodTestsTikTokProps}
      />

      {/* Biology Food Tests — Cover Image (1 frame still for TikTok) */}
      <Composition
        id="BiologyFoodTests-Cover"
        component={BiologyFoodTestsCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Content Studio - Manifest-Driven Project Composition */}
      <Composition
        id="ProjectComposition"
        component={ProjectComposition}
        durationInFrames={30 * fps}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          projectId: '',
          manifest: undefined,
          audioEnabled: true,
        } satisfies ProjectCompositionProps}
        calculateMetadata={calculateProjectMetadata}
      />

      {/* Biology Cell Fractionation TikTok — Cambridge 9700 Topic 1.2 (9:16) */}
      <Composition
        id="BiologyCellFractionation-TikTok"
        component={BiologyCellFractionationTikTok}
        durationInFrames={biologyCellFractionationDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyCellFractionationTikTokProps}
      />

      {/* Biology Cell Fractionation — Cover Image (1 frame still for TikTok) */}
      <Composition
        id="BiologyCellFractionation-Cover"
        component={BiologyCellFractionationCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Maths Proof TikTok — Cambridge 9709 Pure Maths (9:16) */}
      <Composition
        id="MathsProof-TikTok"
        component={MathsProofTikTok}
        durationInFrames={mathsProofDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies MathsProofTikTokProps}
      />

      {/* Maths Proof — Cover Image (1 frame still for TikTok) */}
      <Composition
        id="MathsProof-Cover"
        component={MathsProofCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Maths Proof Notation TikTok — Companion (9:16) */}
      <Composition
        id="MathsProofNotation-TikTok"
        component={MathsProofNotationTikTok}
        durationInFrames={mathsProofNotationDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies MathsProofNotationTikTokProps}
      />

      {/* Maths Proof Notation — Cover Image */}
      <Composition
        id="MathsProofNotation-Cover"
        component={MathsProofNotationCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Enzymes TikTok — Cambridge 9700 Topic 3.1 (9:16) */}
      <Composition
        id="BiologyEnzymes-TikTok"
        component={BiologyEnzymesTikTok}
        durationInFrames={biologyEnzymesDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyEnzymesTikTokProps}
      />
      <Composition
        id="BiologyEnzymes-Cover"
        component={BiologyEnzymesCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Osmosis TikTok — Cambridge 9700 Topic 4.2 (9:16) */}
      <Composition
        id="BiologyOsmosis-TikTok"
        component={BiologyOsmosisTikTok}
        durationInFrames={biologyOsmosisDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyOsmosisTikTokProps}
      />
      <Composition
        id="BiologyOsmosis-Cover"
        component={BiologyOsmosisCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Active Transport TikTok — Cambridge 9700 Topic 4.3 (9:16) */}
      <Composition
        id="BiologyActiveTransport-TikTok"
        component={BiologyActiveTransportTikTok}
        durationInFrames={biologyActiveTransportDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyActiveTransportTikTokProps}
      />
      <Composition
        id="BiologyActiveTransport-Cover"
        component={BiologyActiveTransportCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Endocytosis TikTok — Cambridge 9700 Chapter 1 (9:16) */}
      <Composition
        id="BiologyEndocytosis-TikTok"
        component={BiologyEndocytosisTikTok}
        durationInFrames={biologyEndocytosisDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyEndocytosisTikTokProps}
      />
      <Composition
        id="BiologyEndocytosis-Cover"
        component={BiologyEndocytosisCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Phagocytosis TikTok — Cambridge 9700 Chapter 1 (9:16) */}
      <Composition
        id="BiologyPhagocytosis-TikTok"
        component={BiologyPhagocytosisTikTok}
        durationInFrames={biologyPhagocytosisDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyPhagocytosisTikTokProps}
      />
      <Composition
        id="BiologyPhagocytosis-Cover"
        component={BiologyPhagocytosisCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Autophagy TikTok — Cambridge 9700 Chapter 1 (9:16) */}
      <Composition
        id="BiologyAutophagy-TikTok"
        component={BiologyAutophagyTikTok}
        durationInFrames={biologyAutophagyDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyAutophagyTikTokProps}
      />
      <Composition
        id="BiologyAutophagy-Cover"
        component={BiologyAutophagyCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Biology Microscopes TikTok — Cambridge 9700 Chapter 1 (9:16) — Chatterbox voice */}
      <Composition
        id="BiologyMicroscopes-TikTok"
        component={BiologyMicroscopesTikTok}
        durationInFrames={biologyMicroscopesDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies BiologyMicroscopesTikTokProps}
      />
      <Composition
        id="BiologyMicroscopes-Cover"
        component={BiologyMicroscopesCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Listeria SA Timeline TikTok */}
      <Composition
        id="ListeriaSA-TikTok"
        component={ListeriaSATikTok}
        durationInFrames={listeriaSADuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
        } satisfies ListeriaSATikTokProps}
      />
      <Composition
        id="ListeriaSA-Cover"
        component={ListeriaSACover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Esther's 18th Birthday Video */}
      <Composition
        id="Esther18Birthday"
        component={Esther18Birthday}
        durationInFrames={esther18Duration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          audioEnabled: true,
        } satisfies Esther18Props}
      />

      {/* Birthday Tribute — Durai's tribute to the 6 who stood by him (1:50) */}
      <Composition
        id="BirthdayTribute"
        component={BirthdayTribute}
        durationInFrames={birthdayTributeDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          orientation: 'vertical',
        } satisfies BirthdayTributeProps}
      />
      <Composition
        id="BirthdayTributeHorizontal"
        component={BirthdayTribute}
        durationInFrames={birthdayTributeDuration}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          orientation: 'horizontal',
        } satisfies BirthdayTributeProps}
      />

      {/* UCL Predictions TikTok - 3 AIs predict the Champions League */}
      <Composition
        id="UCLPredictions-TikTok"
        component={UCLPredictionsTikTok}
        durationInFrames={uclPredictionsDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: false,
          cueOverrides: {},
        } satisfies UCLPredictionsTikTokProps}
      />

      <Composition
        id="UCLPredictions-Cover"
        component={UCLPredictionsCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      <Composition
        id="ClaudeCode-Continue-TikTok"
        component={ClaudeCodeContinueTikTok}
        durationInFrames={claudeCodeContinueDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
        } satisfies ClaudeCodeContinueTikTokProps}
      />

      <Composition
        id="Differentiation-TikTok"
        component={DifferentiationTikTok}
        durationInFrames={differentiationDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
        } satisfies DifferentiationTikTokProps}
      />

      <Composition
        id="NanoBanana-Comparison-TikTok"
        component={NanoBananaComparisonTikTok}
        durationInFrames={nanoBananaComparisonDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
        } satisfies NanoBananaComparisonTikTokProps}
      />

      {/* Bakery Training Course — Narration-cue-driven, reusable for all 15 sections */}
      <Composition
        id="BakeryTraining"
        component={BakeryTrainingScene}
        durationInFrames={5721}
        calculateMetadata={async ({ props }) => ({
          durationInFrames: props.durationInFrames || 5721,
        })}
        fps={fps}
        width={1920}
        height={1080}
        defaultProps={{
          sectionId: 's1_1',
          chapterNumber: 1,
          sectionNumber: 1,
          chapterTitle: 'Bakery Hazard Landscape & Sanitation Leadership',
          sectionTitle: "The Sanitation Manager's Role",
          scenes: [
            {
              id: 'opening',
              startCue: 0,
              endCue: 1.2,
              images: ['images/bakery-course/s1_1_01_objectives.png'],
              textLayers: [
                { text: 'Chapter 1.1', style: 'badge', enterAt: 0.3, exitAt: 1.0 },
                { text: "The Sanitation Manager's Role", style: 'title', enterAt: 0.6, exitAt: 1.0 },
                { text: 'Own the system \u00b7 Read the floor \u00b7 Use data \u00b7 Lead', style: 'subtitle', enterAt: 1.0, exitAt: 1.2 },
              ],
            },
            {
              id: 'own_the_system',
              startCue: 1.2,
              endCue: 23.0,
              images: ['images/bakery-course/s1_1_02_ownership.png', 'images/bakery-course/s1_1_bakery_floor.png'],
              textLayers: [
                { text: 'YOU OWN THE SYSTEM', style: 'headline', enterAt: 1.42, exitAt: 8.0 },
                { text: 'Planning \u00b7 Staffing \u00b7 Verification \u00b7 Release', style: 'body', enterAt: 3.5, exitAt: 8.0 },
                { text: 'It runs because you said it was safe to run', style: 'quote', enterAt: 9.0, exitAt: 17.0 },
                { text: 'If that system fails, the brand fails.', style: 'accent', enterAt: 18.5, exitAt: 23.0 },
              ],
            },
            {
              id: 'floor_walk_intro',
              startCue: 23.0,
              endCue: 34.5,
              images: ['images/bakery-course/s1_1_leadership_floor.png'],
              textLayers: [
                { text: 'WALK THE FLOOR', style: 'headline', enterAt: 24.76, exitAt: 34.0 },
                { text: 'A trained eye that most people don\'t have', style: 'body', enterAt: 27.0, exitAt: 34.0 },
                { text: 'Hunting for the red flags production teams miss', style: 'subtitle', enterAt: 30.0, exitAt: 34.0 },
              ],
            },
            {
              id: 'rodent_droppings',
              startCue: 34.5,
              endCue: 40.5,
              images: ['images/bakery-course/s1_1_rodent_droppings.png'],
              textLayers: [
                { text: 'RODENT ACTIVITY', style: 'warning', enterAt: 35.28, exitAt: 40.0 },
                { text: 'Behind a flour silo', style: 'subtitle', enterAt: 37.0, exitAt: 40.0 },
              ],
            },
            {
              id: 'flaking_paint',
              startCue: 40.5,
              endCue: 45.0,
              images: ['images/bakery-course/s1_1_flaking_paint.png'],
              textLayers: [
                { text: 'PHYSICAL CONTAMINATION', style: 'warning', enterAt: 41.48, exitAt: 44.5 },
                { text: 'Above an open production line', style: 'subtitle', enterAt: 43.0, exitAt: 44.5 },
              ],
            },
            {
              id: 'missing_bolt',
              startCue: 45.0,
              endCue: 57.0,
              images: ['images/bakery-course/s1_1_missing_bolt_closeup.png', 'images/bakery-course/s5_2_conveyor_inspection.png'],
              textLayers: [
                { text: 'FOREIGN BODY RISK', style: 'warning', enterAt: 45.76, exitAt: 56.0 },
                { text: 'Metal-to-metal contact', style: 'body', enterAt: 49.0, exitAt: 56.0 },
                { text: 'A physical hazard in someone\'s dough', style: 'accent', enterAt: 52.0, exitAt: 56.0 },
              ],
            },
            {
              id: 'mould_condensation',
              startCue: 57.0,
              endCue: 67.0,
              images: ['images/bakery-course/s1_1_mould_cooling_drum.png', 'images/bakery-course/s1_1_condensation_pipe.png'],
              textLayers: [
                { text: 'MOULD & CONDENSATION', style: 'warning', enterAt: 59.20, exitAt: 66.0 },
                { text: 'Cooling drums \u00b7 Ceiling pipes', style: 'body', enterAt: 62.0, exitAt: 66.0 },
              ],
            },
            {
              id: 'tuesday_morning',
              startCue: 67.0,
              endCue: 76.0,
              images: ['images/bakery-course/s1_1_02_ownership.png'],
              textLayers: [
                { text: "THESE AREN'T HYPOTHETICALS", style: 'headline', enterAt: 67.04, exitAt: 75.0 },
                { text: 'These are Tuesday morning.', style: 'accent_large', enterAt: 68.78, exitAt: 75.0 },
                { text: 'Every one lands on your desk', style: 'subtitle', enterAt: 72.0, exitAt: 75.0 },
              ],
            },
            {
              id: 'coordination',
              startCue: 76.0,
              endCue: 100.0,
              images: [
                'images/bakery-course/s1_1_04_coordination.png',
                'images/bakery-course/s1_1_qa_swab.png',
                'images/bakery-course/s1_1_production_meeting.png',
                'images/bakery-course/s1_1_maintenance_gasket.png',
                'images/bakery-course/s1_1_pest_bait_station.png',
              ],
              imageTimings: [76.0, 80.54, 85.0, 88.84, 92.28],
              textLayers: [
                { text: 'YOU ARE THE BRIDGE', style: 'headline', enterAt: 78.50, exitAt: 98.0 },
                { text: 'QA', style: 'partner_badge', enterAt: 80.54, exitAt: 98.0 },
                { text: 'Production', style: 'partner_badge', enterAt: 85.0, exitAt: 98.0 },
                { text: 'Maintenance', style: 'partner_badge', enterAt: 88.84, exitAt: 98.0 },
                { text: 'Pest Control', style: 'partner_badge', enterAt: 92.28, exitAt: 98.0 },
                { text: 'If any one breaks down, the system breaks down.', style: 'accent', enterAt: 96.0, exitAt: 100.0 },
              ],
            },
            {
              id: 'data_trending',
              startCue: 100.0,
              endCue: 117.0,
              images: ['images/bakery-course/s1_1_05_data_dashboard.png', 'images/bakery-course/s1_1_data_science.png'],
              textLayers: [
                { text: 'DATA-DRIVEN DECISIONS', style: 'headline', enterAt: 102.32, exitAt: 116.0 },
                { text: 'Not collecting \u2014 trending', style: 'body', enterAt: 108.92, exitAt: 116.0 },
                { text: 'Reactive \u2192 Proactive', style: 'accent_large', enterAt: 112.72, exitAt: 116.0 },
              ],
            },
            {
              id: 'atp_example',
              startCue: 117.0,
              endCue: 142.0,
              images: ['images/bakery-course/s1_1_atp_fail_mixer.png', 'images/bakery-course/s1_1_06_atp_trending.png'],
              textLayers: [
                { text: 'SAME MIXER. THREE MONDAYS.', style: 'headline', enterAt: 118.0, exitAt: 138.0 },
                { text: "That's not a bad clean. That's a signal.", style: 'accent', enterAt: 123.66, exitAt: 138.0 },
                { text: 'Design flaw?', style: 'rootcause', enterAt: 125.74, exitAt: 138.0 },
                { text: 'Training gap?', style: 'rootcause', enterAt: 127.86, exitAt: 138.0 },
                { text: 'Wrong chemical?', style: 'rootcause', enterAt: 130.0, exitAt: 138.0 },
                { text: 'Using science to solve the WHY', style: 'accent_large', enterAt: 137.24, exitAt: 142.0 },
              ],
            },
            {
              id: 'change_the_system',
              startCue: 142.0,
              endCue: 147.0,
              images: ['images/bakery-course/s1_1_07_system_change.png'],
              textLayers: [
                { text: 'SEE A PATTERN?', style: 'headline', enterAt: 142.10, exitAt: 146.5 },
                { text: 'CHANGE THE SYSTEM.', style: 'accent_large', enterAt: 144.0, exitAt: 146.5 },
              ],
            },
            {
              id: 'chapter_tease',
              startCue: 147.0,
              endCue: 167.0,
              images: ['images/bakery-course/s1_1_course_roadmap.png'],
              textLayers: [
                { text: 'COMING UP', style: 'headline', enterAt: 147.60, exitAt: 166.0 },
                { text: 'Flour Dust Control', style: 'roadmap_item', enterAt: 151.78, exitAt: 166.0 },
                { text: 'Allergen Management', style: 'roadmap_item', enterAt: 153.0, exitAt: 166.0 },
                { text: 'Cleaning Validation', style: 'roadmap_item', enterAt: 155.0, exitAt: 166.0 },
                { text: 'Environmental Monitoring', style: 'roadmap_item', enterAt: 157.0, exitAt: 166.0 },
                { text: 'Pest Control \u00b7 Chemical Safety', style: 'roadmap_item', enterAt: 159.0, exitAt: 166.0 },
                { text: 'Audit Readiness', style: 'roadmap_item', enterAt: 161.18, exitAt: 166.0 },
                { text: 'The Real Risk Profile', style: 'roadmap_item', enterAt: 163.0, exitAt: 166.0 },
              ],
            },
            {
              id: 'leadership_close',
              startCue: 167.0,
              endCue: 190.7,
              images: ['images/bakery-course/s1_1_leadership_floor.png', 'images/bakery-course/s1_1_team_standard.png'],
              textLayers: [
                { text: 'IT ALL STARTS WITH YOU', style: 'headline', enterAt: 168.0, exitAt: 178.0 },
                { text: 'Owning the system \u00b7 Reading the floor \u00b7 Using data \u00b7 Leading', style: 'body', enterAt: 170.0, exitAt: 178.0 },
                { text: "Leadership isn't about holding a mop.", style: 'accent', enterAt: 178.60, exitAt: 185.0 },
                { text: "It's not a poster on the wall.", style: 'accent', enterAt: 182.84, exitAt: 185.0 },
                { text: "It's the uncompromising standard you set,\nand the integrity you bring to the floor,\nevery single day.", style: 'closing', enterAt: 185.44, exitAt: 190.7 },
              ],
            },
          ] as BakeryScene[],
          audioFile: 'audio/bakery-course/s1_1_final.mp3',
          durationInFrames: 5721,
        } satisfies BakeryTrainingProps}
      />

      {/* Stoichiometry #1 — What Even IS a Mole? (9:16) */}
      <Composition
        id="StoichiometryMole-TikTok"
        component={StoichiometryMoleTikTok}
        durationInFrames={stoichiometryMoleDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryMoleTikTokProps}
      />
      <Composition
        id="StoichiometryMole-Cover"
        component={StoichiometryMoleCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Stoichiometry #2 — Molar Mass in 60 Seconds (9:16) */}
      <Composition
        id="StoichiometryMolarMass-TikTok"
        component={StoichiometryMolarMassTikTok}
        durationInFrames={stoichiometryMolarMassDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryMolarMassTikTokProps}
      />
      <Composition
        id="StoichiometryMolarMass-Cover"
        component={StoichiometryMolarMassCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Stoichiometry #3 — The Mole Triangle (9:16) */}
      <Composition
        id="StoichiometryTriangle-TikTok"
        component={StoichiometryTriangleTikTok}
        durationInFrames={stoichiometryTriangleDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryTriangleTikTokProps}
      />
      <Composition
        id="StoichiometryTriangle-Cover"
        component={StoichiometryTriangleCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Stoichiometry #4 — Balancing Equations Like a Pro (9:16) */}
      <Composition
        id="StoichiometryBalancing-TikTok"
        component={StoichiometryBalancingTikTok}
        durationInFrames={stoichiometryBalancingDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryBalancingTikTokProps}
      />
      <Composition
        id="StoichiometryBalancing-Cover"
        component={StoichiometryBalancingCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Stoichiometry #5 — Reacting Masses (9:16) */}
      <Composition
        id="StoichiometryReactingMasses-TikTok"
        component={StoichiometryReactingMassesTikTok}
        durationInFrames={stoichiometryReactingMassesDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryReactingMassesTikTokProps}
      />
      <Composition
        id="StoichiometryReactingMasses-Cover"
        component={StoichiometryReactingMassesCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Stoichiometry #6 — Solutions & Concentration (9:16) */}
      <Composition
        id="StoichiometrySolutions-TikTok"
        component={StoichiometrySolutionsTikTok}
        durationInFrames={stoichiometrySolutionsDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometrySolutionsTikTokProps}
      />
      <Composition
        id="StoichiometrySolutions-Cover"
        component={StoichiometrySolutionsCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />

      {/* Stoichiometry #8 — Limiting Reagent & Yield (9:16) */}
      <Composition
        id="StoichiometryLimiting-TikTok"
        component={StoichiometryLimitingTikTok}
        durationInFrames={stoichiometryLimitingDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryLimitingTikTokProps}
      />
      <Composition
        id="StoichiometryLimiting-Cover"
        component={StoichiometryLimitingCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />
      {/* Stoichiometry #7 — Gas Volumes & Avogadro (9:16) */}
      <Composition
        id="StoichiometryGasVolumes-TikTok"
        component={StoichiometryGasVolumesTikTok}
        durationInFrames={stoichiometryGasVolumesDuration}
        fps={fps}
        width={1080}
        height={1920}
        defaultProps={{
          audioEnabled: true,
          cueOverrides: undefined,
        } satisfies StoichiometryGasVolumesTikTokProps}
      />
      <Composition
        id="StoichiometryGasVolumes-Cover"
        component={StoichiometryGasVolumesCover}
        durationInFrames={1}
        fps={fps}
        width={1080}
        height={1920}
      />
    </>
  );
};

registerRoot(RemotionRoot);
