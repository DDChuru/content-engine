import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsResolvingForcesAndInclinedPlanesFable,getMechanicsResolvingForcesAndInclinedPlanesFableDuration} from './MechanicsResolvingForcesAndInclinedPlanesFable';
registerRoot(()=> <Composition id="MechanicsResolvingForcesAndInclinedPlanesFable" component={MechanicsResolvingForcesAndInclinedPlanesFable} durationInFrames={getMechanicsResolvingForcesAndInclinedPlanesFableDuration(30)} fps={30} width={1920} height={1080}/>);
