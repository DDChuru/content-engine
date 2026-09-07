import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MechanicsDisplacementTimeGraphs, getMechanicsDisplacementTimeGraphsDuration} from '../remotion/compositions/MechanicsDisplacementTimeGraphs';
registerRoot(() => <Composition id="MechanicsDisplacementTimeGraphs" component={MechanicsDisplacementTimeGraphs} width={1920} height={1080} fps={30} durationInFrames={getMechanicsDisplacementTimeGraphsDuration(30)}/>);
