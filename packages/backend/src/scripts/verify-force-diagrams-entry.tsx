import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MechanicsForceDiagrams, getMechanicsForceDiagramsDuration} from '../remotion/compositions/MechanicsForceDiagrams';
registerRoot(()=><Composition id="MechanicsForceDiagrams" component={MechanicsForceDiagrams} width={1920} height={1080} fps={30} durationInFrames={getMechanicsForceDiagramsDuration(30)}/>);
