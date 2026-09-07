import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {MechanicsDrawingTravelGraphs,getMechanicsDrawingTravelGraphsDuration} from '../remotion/compositions/MechanicsDrawingTravelGraphs';
registerRoot(()=> <Composition id="MechanicsDrawingTravelGraphs" component={MechanicsDrawingTravelGraphs} width={1920} height={1080} fps={30} durationInFrames={getMechanicsDrawingTravelGraphsDuration(30)}/>);
