import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsEnergy,getMechanicsEnergyDuration} from './MechanicsEnergy';
registerRoot(()=> <Composition id="MechanicsEnergy" component={MechanicsEnergy} durationInFrames={getMechanicsEnergyDuration(30)} fps={30} width={1920} height={1080}/>);
