import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsConnectedBodiesPulleysFable,getMechanicsConnectedBodiesPulleysFableDuration} from './MechanicsConnectedBodiesPulleysFable';
registerRoot(()=> <Composition id="MechanicsConnectedBodiesPulleysFable" component={MechanicsConnectedBodiesPulleysFable} durationInFrames={getMechanicsConnectedBodiesPulleysFableDuration(30)} fps={30} width={1920} height={1080}/>);
