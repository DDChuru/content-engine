import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { LedgerReconstruct, LedgerPhone, LEDGER_FPS, LEDGER_FRAMES } from './LedgerReconstruct';
import { ComposeRowDemo, ComposeRowFidelity } from './composeRow';

const RootReconstruct: React.FC = () => React.createElement(React.Fragment, null,
  React.createElement(Composition, { id: 'LedgerReconstructDemo', component: LedgerReconstruct,
    durationInFrames: LEDGER_FRAMES, fps: LEDGER_FPS, width: 1920, height: 1080 }),
  React.createElement(Composition, { id: 'ComposeRowDemo', component: ComposeRowDemo,
    durationInFrames: 90, fps: 30, width: 4088, height: 420 }),
  // Native-size proof compositions use the exact same components as the demos.
  React.createElement(Composition, { id: 'LedgerReconstructPhone', component: LedgerPhone,
    durationInFrames: LEDGER_FRAMES, fps: LEDGER_FPS, width: 720, height: 1600 }),
  React.createElement(Composition, { id: 'ComposeRowFidelity', component: ComposeRowFidelity,
    durationInFrames: 1, fps: 30, width: 660, height: 148 }),
);

registerRoot(RootReconstruct);
