import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MechanicsAccelerationDueToGravity, getMechanicsAccelerationDueToGravityDuration} from '../remotion/compositions/MechanicsAccelerationDueToGravity';
registerRoot(() => <Composition id="MechanicsAccelerationDueToGravity" component={MechanicsAccelerationDueToGravity} width={1920} height={1080} fps={30} durationInFrames={getMechanicsAccelerationDueToGravityDuration(30)}/>);
