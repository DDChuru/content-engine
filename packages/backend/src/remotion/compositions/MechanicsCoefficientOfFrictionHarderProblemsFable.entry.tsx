import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionHarderProblemsFable,getMechanicsCoefficientOfFrictionHarderProblemsFableDuration} from './MechanicsCoefficientOfFrictionHarderProblemsFable';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionHarderProblemsFable" component={MechanicsCoefficientOfFrictionHarderProblemsFable} durationInFrames={getMechanicsCoefficientOfFrictionHarderProblemsFableDuration(30)} fps={30} width={1920} height={1080}/>);
