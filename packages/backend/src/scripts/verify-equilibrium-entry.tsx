import React from "react";
import { Composition, registerRoot } from "remotion";
import {
  MechanicsEquilibriumIn1D,
  getMechanicsEquilibriumIn1DDuration,
} from "../remotion/compositions/MechanicsEquilibriumIn1D";
registerRoot(() => (
  <Composition
    id="MechanicsEquilibriumIn1D"
    component={MechanicsEquilibriumIn1D}
    fps={30}
    width={1920}
    height={1080}
    durationInFrames={getMechanicsEquilibriumIn1DDuration(30)}
  />
));
