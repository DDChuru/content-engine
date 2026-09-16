import React from 'react';
import { Composition, registerRoot } from 'remotion';
import {
  SchedulePreviewTutorialBranded,
  SCHEDULE_BRANDED_FRAMES,
  SCHEDULE_FPS,
} from './schedule/SchedulePreviewTutorial';

// Standalone entry: imports neither src/Root.tsx nor any other tutorial root.
export const RootSchedule: React.FC = () => React.createElement(Composition, {
  id: 'SchedulePreviewTutorialBranded',
  component: SchedulePreviewTutorialBranded,
  durationInFrames: SCHEDULE_BRANDED_FRAMES,
  fps: SCHEDULE_FPS,
  width: 1920,
  height: 1080,
});

registerRoot(RootSchedule);
