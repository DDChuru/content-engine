import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  MechanicsDirectCollisions, MechanicsDirectCollisionsProps, getMechanicsDirectCollisionsDuration,
} from './MechanicsDirectCollisions';

const Root: React.FC = () => <Composition
  id="MechanicsDirectCollisions"
  component={MechanicsDirectCollisions}
  width={1920}
  height={1080}
  fps={30}
  durationInFrames={getMechanicsDirectCollisionsDuration(30)}
  defaultProps={{audioEnabled: true, audit: false} satisfies MechanicsDirectCollisionsProps}
/>;
registerRoot(Root);
