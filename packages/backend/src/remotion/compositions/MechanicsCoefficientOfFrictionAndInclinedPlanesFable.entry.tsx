import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionAndInclinedPlanesFable,getMechanicsCoefficientOfFrictionAndInclinedPlanesFableDuration} from './MechanicsCoefficientOfFrictionAndInclinedPlanesFable';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionAndInclinedPlanesFable" component={MechanicsCoefficientOfFrictionAndInclinedPlanesFable} durationInFrames={getMechanicsCoefficientOfFrictionAndInclinedPlanesFableDuration(30)} fps={30} width={1920} height={1080}/>);
