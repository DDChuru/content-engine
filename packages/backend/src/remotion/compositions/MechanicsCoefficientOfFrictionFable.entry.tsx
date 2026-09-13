import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionFable,getMechanicsCoefficientOfFrictionFableDuration} from './MechanicsCoefficientOfFrictionFable';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionFable" component={MechanicsCoefficientOfFrictionFable} durationInFrames={getMechanicsCoefficientOfFrictionFableDuration(30)} fps={30} width={1920} height={1080}/>);
