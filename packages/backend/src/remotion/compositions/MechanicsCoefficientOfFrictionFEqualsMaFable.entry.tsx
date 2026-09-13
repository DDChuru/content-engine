import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionFEqualsMaFable,getMechanicsCoefficientOfFrictionFEqualsMaFableDuration} from './MechanicsCoefficientOfFrictionFEqualsMaFable';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionFEqualsMaFable" component={MechanicsCoefficientOfFrictionFEqualsMaFable} durationInFrames={getMechanicsCoefficientOfFrictionFEqualsMaFableDuration(30)} fps={30} width={1920} height={1080}/>);
