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

const fps = 30;

export const RemotionRoot: React.FC = () => {
  const setsLessonDuration = getSetsLessonDuration(fps);
  const placardVideoDuration = getPlacardVideoDuration(fps);
  const semicircleTheoremDuration = getSemicircleTheoremDuration(fps);

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
    </>
  );
};

registerRoot(RemotionRoot);
