import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsDerivingSuvat,getMechanicsDerivingSuvatDuration} from '../remotion/compositions/MechanicsDerivingSuvat';
registerRoot(()=> <Composition id="MechanicsDerivingSuvat" component={MechanicsDerivingSuvat} width={1920} height={1080} fps={30} durationInFrames={getMechanicsDerivingSuvatDuration(30)}/>);
