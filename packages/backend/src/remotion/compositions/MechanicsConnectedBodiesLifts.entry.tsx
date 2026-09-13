import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsConnectedBodiesLifts,getMechanicsConnectedBodiesLiftsDuration} from './MechanicsConnectedBodiesLifts';
registerRoot(()=> <Composition id="MechanicsConnectedBodiesLifts" component={MechanicsConnectedBodiesLifts} durationInFrames={getMechanicsConnectedBodiesLiftsDuration(30)} fps={30} width={1920} height={1080}/>);
