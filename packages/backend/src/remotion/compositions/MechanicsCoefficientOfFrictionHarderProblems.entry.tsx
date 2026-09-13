import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionHarderProblems,getMechanicsCoefficientOfFrictionHarderProblemsDuration} from './MechanicsCoefficientOfFrictionHarderProblems';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionHarderProblems" component={MechanicsCoefficientOfFrictionHarderProblems} durationInFrames={getMechanicsCoefficientOfFrictionHarderProblemsDuration(30)} fps={30} width={1920} height={1080}/>);
