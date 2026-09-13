import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsResolvingForcesAndInclinedPlanes,getMechanicsResolvingForcesAndInclinedPlanesDuration} from './MechanicsResolvingForcesAndInclinedPlanes';
registerRoot(()=> <Composition id="MechanicsResolvingForcesAndInclinedPlanes" component={MechanicsResolvingForcesAndInclinedPlanes} durationInFrames={getMechanicsResolvingForcesAndInclinedPlanesDuration(30)} fps={30} width={1920} height={1080}/>);
