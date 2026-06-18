/**
 * Remotion Root - Showcase Compositions Registry
 */

import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { SkillShowcase, skillShowcaseConfig } from './SkillShowcase';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={skillShowcaseConfig.id}
        component={SkillShowcase}
        durationInFrames={skillShowcaseConfig.durationInFrames}
        fps={skillShowcaseConfig.fps}
        width={skillShowcaseConfig.width}
        height={skillShowcaseConfig.height}
      />
    </>
  );
};

registerRoot(RemotionRoot);
