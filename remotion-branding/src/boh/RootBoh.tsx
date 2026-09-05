/**
 * Standalone Remotion root for the Bill of Health video — registers ONLY the two
 * BoH compositions so the render entry (src/index-boh.ts) never pulls in the rest of
 * src/Root.tsx (in particular the CCV shared module's module-level "ccv fonts"
 * delayRender, which never clears in machine B's headless Chrome).
 */
import React from 'react';
import { Composition } from 'remotion';
import {
  BillOfHealthTutorial,
  BillOfHealthTutorialBranded,
  BohComposeProof,
  BohHeroProof,
  BOH_BRANDED_FRAMES,
  BOH_FPS,
  BOH_TUTORIAL_FRAMES,
} from './BillOfHealthTutorial';

export const RootBoh: React.FC = () => (
  <>
    {/* still-only proof sheet: composed rows at 2× beside their captured originals */}
    <Composition id="BohComposeProof" component={BohComposeProof} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition id="BohHeroProof" component={BohHeroProof} durationInFrames={1} fps={30} width={1920} height={1080} />
    <Composition
      id="BillOfHealthTutorial"
      component={BillOfHealthTutorial}
      durationInFrames={BOH_TUTORIAL_FRAMES}
      fps={BOH_FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="BillOfHealthTutorialBranded"
      component={BillOfHealthTutorialBranded}
      durationInFrames={BOH_BRANDED_FRAMES}
      fps={BOH_FPS}
      width={1920}
      height={1080}
    />
  </>
);
