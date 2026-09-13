import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsConnectedBodiesPulleys, getMechanicsConnectedBodiesPulleysDuration} from './MechanicsConnectedBodiesPulleys';
registerRoot(()=> <Composition id="MechanicsConnectedBodiesPulleys" component={MechanicsConnectedBodiesPulleys} durationInFrames={getMechanicsConnectedBodiesPulleysDuration(30)} fps={30} width={1920} height={1080}/>);
