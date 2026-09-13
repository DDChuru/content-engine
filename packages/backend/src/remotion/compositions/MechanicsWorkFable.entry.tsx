import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsWorkFable,getMechanicsWorkFableDuration} from './MechanicsWorkFable';
registerRoot(()=> <Composition id="MechanicsWorkFable" component={MechanicsWorkFable} durationInFrames={getMechanicsWorkFableDuration(30)} fps={30} width={1920} height={1080}/>);
