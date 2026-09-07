// Isolated entry: does not import or modify the shared dirty Root.tsx.
import { registerRoot } from 'remotion';
import { RootRemedial } from './remedial/RootRemedial';

registerRoot(RootRemedial);
