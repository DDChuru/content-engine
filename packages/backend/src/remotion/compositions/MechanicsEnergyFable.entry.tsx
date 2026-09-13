import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsEnergyFable,getMechanicsEnergyFableDuration} from './MechanicsEnergyFable';
registerRoot(()=> <Composition id="MechanicsEnergyFable" component={MechanicsEnergyFable} durationInFrames={getMechanicsEnergyFableDuration(30)} fps={30} width={1920} height={1080}/>);
