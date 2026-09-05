/**
 * Standalone Remotion root for the CCV refresh — registers ONLY the two ccv2 compositions
 * (plus a still-only proof sheet) so the render entry (src/index-ccv2.ts) never pulls in src/Root.tsx.
 */
import React from 'react';
import { Composition } from 'remotion';
import { CcvRefresh, CcvRefreshBranded, Ccv2ComposeProof, CCV2_BRANDED_FRAMES, CCV2_FPS, CCV2_TUTORIAL_FRAMES } from './CcvRefresh';

export const RootCcv2: React.FC = () => (
  <>
    <Composition id="CcvRefresh" component={CcvRefresh} durationInFrames={CCV2_TUTORIAL_FRAMES} fps={CCV2_FPS} width={1920} height={1080} />
    <Composition id="CcvRefreshBranded" component={CcvRefreshBranded} durationInFrames={CCV2_BRANDED_FRAMES} fps={CCV2_FPS} width={1920} height={1080} />
    {/* still-only proof sheet: composed regions at 1.6× beside their raw */}
    <Composition id="Ccv2ComposeProof" component={Ccv2ComposeProof} durationInFrames={1} fps={30} width={1920} height={1080} />
  </>
);
