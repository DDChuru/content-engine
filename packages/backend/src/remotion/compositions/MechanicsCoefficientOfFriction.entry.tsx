import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsCoefficientOfFriction,getMechanicsCoefficientOfFrictionDuration} from './MechanicsCoefficientOfFriction';
registerRoot(()=> <Composition id="MechanicsCoefficientOfFriction" component={MechanicsCoefficientOfFriction} durationInFrames={getMechanicsCoefficientOfFrictionDuration(30)} fps={30} width={1920} height={1080}/>);
