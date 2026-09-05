// Render entry for the Bill of Health video only: npx remotion render src/index-boh.ts BillOfHealthTutorialBranded …
import { registerRoot } from 'remotion';
import { RootBoh } from './boh/RootBoh';

registerRoot(RootBoh);
