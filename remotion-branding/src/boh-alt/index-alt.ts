import React from 'react';
import { Composition, registerRoot } from 'remotion';
import {
  BillOfHealthAlt,
  BillOfHealthAltBranded,
  BOH_ALT_BRANDED_FRAMES,
  BOH_ALT_FPS,
  BOH_ALT_FRAMES,
} from './BillOfHealthAlt';

// Standalone entry: imports neither src/Root.tsx nor any other tutorial root.
const AltRoot: React.FC = () => React.createElement(React.Fragment, null,
  React.createElement(Composition, {
    id: 'BillOfHealthAlt', component: BillOfHealthAlt,
    durationInFrames: BOH_ALT_FRAMES, fps: BOH_ALT_FPS, width: 1920, height: 1080,
  }),
  React.createElement(Composition, {
    id: 'BillOfHealthAltBranded', component: BillOfHealthAltBranded,
    durationInFrames: BOH_ALT_BRANDED_FRAMES, fps: BOH_ALT_FPS, width: 1920, height: 1080,
  }),
);

registerRoot(AltRoot);
