/**
 * DailyHygieneWalkthrough — the Daily Hygiene tutorial, now expressed as a
 * `VideoProject` fed into the generic AnnotatedVideo stitcher. All the render
 * logic lives in ./AnnotatedVideo; this file is just the hygiene data +
 * bookends. To make a NEW annotated video, define another VideoProject like
 * this one (or pass props to the AnnotatedVideo composition from VidStud).
 */
import React from 'react';
import { SKY, SKY_DEEP, EMERALD } from '../kit/palette';
import { AnnotatedVideo, projectFrames, type VideoProject, type Mark } from './AnnotatedVideo';
import doc from './hygiene-walkthrough.json';

export const hygieneProject: VideoProject = {
  video: 'tapdemo/hygiene-full.mp4',
  audio: 'tapdemo/hygiene-audio.m4a', // the operator's live voice
  fps: 30,
  clipSeconds: 240.47,                // 7214 frames @ 30fps
  srcW: 660,
  srcH: 1434,
  layout: 'phone',
  holdMode: 'asDrawn',
  marks: doc.annotations as Mark[],
  bookend: {
    accentA: SKY,
    accentB: SKY_DEEP,
    intro: {
      title: 'Daily Hygiene Checks',
      tagline: 'How to run the shift hygiene check, step by step — on the real app.',
    },
    outro: {
      kicker: 'e-wizer field guide',
      headline: "That's a Daily Hygiene check",
      body: "Confirm who's present, clear or flag each operative, then complete the session.",
      cards: [
        { label: 'Present', color: SKY },
        { label: 'Clear / flag', color: EMERALD },
        { label: 'Complete', color: SKY_DEEP },
      ],
    },
  },
};

export const WALK_FPS = hygieneProject.fps;
export const WALK_FRAMES = projectFrames(hygieneProject);

export const AnnotatedWalkthrough: React.FC = () => <AnnotatedVideo {...hygieneProject} />;
