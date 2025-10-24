import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { EducationalLesson } from './compositions/EducationalLesson';

export const RemotionRoot: React.FC = () => {
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
    </>
  );
};

registerRoot(RemotionRoot);
