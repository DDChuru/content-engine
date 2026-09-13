import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsPower,getMechanicsPowerDuration} from './MechanicsPower';
registerRoot(()=> <Composition id="MechanicsPower" component={MechanicsPower} durationInFrames={getMechanicsPowerDuration(30)} fps={30} width={1920} height={1080}/>);
