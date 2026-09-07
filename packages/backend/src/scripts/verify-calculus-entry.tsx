import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsUsingCalculusIn1D,getMechanicsUsingCalculusIn1DDuration} from '../remotion/compositions/MechanicsUsingCalculusIn1D';
registerRoot(()=> <Composition id="MechanicsUsingCalculusIn1D" component={MechanicsUsingCalculusIn1D} width={1920} height={1080} fps={30} durationInFrames={getMechanicsUsingCalculusIn1DDuration(30)}/>);
