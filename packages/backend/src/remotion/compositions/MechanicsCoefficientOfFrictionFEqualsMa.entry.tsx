import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFrictionFEqualsMa,getMechanicsCoefficientOfFrictionFEqualsMaDuration} from './MechanicsCoefficientOfFrictionFEqualsMa';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFrictionFEqualsMa" component={MechanicsCoefficientOfFrictionFEqualsMa} durationInFrames={getMechanicsCoefficientOfFrictionFEqualsMaDuration(30)} fps={30} width={1920} height={1080}/>);
