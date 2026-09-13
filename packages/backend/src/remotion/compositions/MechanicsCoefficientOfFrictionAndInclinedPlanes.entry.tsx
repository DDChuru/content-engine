import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionAndInclinedPlanes,getMechanicsCoefficientOfFrictionAndInclinedPlanesDuration} from './MechanicsCoefficientOfFrictionAndInclinedPlanes';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionAndInclinedPlanes" component={MechanicsCoefficientOfFrictionAndInclinedPlanes} durationInFrames={getMechanicsCoefficientOfFrictionAndInclinedPlanesDuration(30)} fps={30} width={1920} height={1080}/>);
