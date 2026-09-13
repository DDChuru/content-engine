import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsWork,getMechanicsWorkDuration} from './MechanicsWork';
registerRoot(()=> <Composition id="MechanicsWork" component={MechanicsWork} durationInFrames={getMechanicsWorkDuration(30)} fps={30} width={1920} height={1080}/>);
