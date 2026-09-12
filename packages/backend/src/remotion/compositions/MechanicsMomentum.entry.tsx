import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {MechanicsMomentum, MechanicsMomentumProps, getMechanicsMomentumDuration} from './MechanicsMomentum';

const MomentumRoot:React.FC=()=><Composition
 id="MechanicsMomentum"
 component={MechanicsMomentum}
 durationInFrames={getMechanicsMomentumDuration(30)}
 fps={30}
 width={1920}
 height={1080}
 defaultProps={{audioEnabled:true,audit:false} satisfies MechanicsMomentumProps}
/>;
registerRoot(MomentumRoot);
