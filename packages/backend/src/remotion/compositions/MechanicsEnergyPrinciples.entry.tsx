import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsEnergyPrinciples,getMechanicsEnergyPrinciplesDuration} from './MechanicsEnergyPrinciples';
registerRoot(()=> <Composition id="MechanicsEnergyPrinciples" component={MechanicsEnergyPrinciples} durationInFrames={getMechanicsEnergyPrinciplesDuration(30)} fps={30} width={1920} height={1080}/>);
