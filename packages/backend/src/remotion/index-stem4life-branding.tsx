import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {LessonFrameIntro, LessonFrameOutro} from './compositions/stem4life/LessonFrameBookends';
import {FPS, INTRO_FRAMES, OUTRO_FRAMES} from './compositions/stem4life/timing';

const size = {width: 1920, height: 1080, fps: FPS};
const defaultProps = {title: 'S.I. units for mechanics', subtitle: 'Cambridge A Level · Mechanics'};
const BrandingSample = () => <>
  <Composition id="LessonFrameIntro" component={LessonFrameIntro} durationInFrames={INTRO_FRAMES} {...size} defaultProps={defaultProps}/>
  <Composition id="LessonFrameOutro" component={LessonFrameOutro} durationInFrames={OUTRO_FRAMES} {...size} defaultProps={defaultProps}/>
</>;

registerRoot(BrandingSample);
