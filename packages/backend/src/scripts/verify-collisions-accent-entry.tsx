import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MechanicsMultipleCollisions, getMechanicsMultipleCollisionsDuration} from '../remotion/compositions/MechanicsMultipleCollisions';
registerRoot(() => <Composition id="MechanicsMultipleCollisions" component={MechanicsMultipleCollisions} width={1920} height={1080} fps={30} durationInFrames={getMechanicsMultipleCollisionsDuration(30)}/>);
