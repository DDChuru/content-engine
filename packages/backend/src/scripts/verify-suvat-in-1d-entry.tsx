import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsSuvatIn1D,getMechanicsSuvatIn1DDuration} from '../remotion/compositions/MechanicsSuvatIn1D';
registerRoot(()=><Composition id="MechanicsSuvatIn1D" component={MechanicsSuvatIn1D} width={1920} height={1080} fps={30} durationInFrames={getMechanicsSuvatIn1DDuration(30)}/>);
