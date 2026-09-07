import React from 'react';
import { Composition, staticFile } from 'remotion';
import data from './candidate.json';
import timing from './candidate-narration.json';
import { Timeline, VerifiedAssets } from './RemedialActionTutorial';
import { CANDIDATE_ID, assertCandidateReady, candidateCaptures, verifyCandidateAssets, type Candidate } from './candidate-contract';
import type { NarrationManifest } from './contract';

const candidate = data as unknown as Candidate;
const narration = timing as NarrationManifest;
const verify = () => verifyCandidateAssets(candidate, narration, async (path) => {
	const response = await fetch(staticFile(path));
	if (!response.ok) throw new Error(`Missing candidate asset: ${path}`);
	return new Uint8Array(await response.arrayBuffer());
}, async (bytes) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new Uint8Array(bytes))), (v) => v.toString(16).padStart(2, '0')).join(''));
const RemedialReviewCandidate: React.FC = () => {
	assertCandidateReady(candidate, narration);
	return <VerifiedAssets verify={verify}><Timeline captures={candidateCaptures(candidate)} narration={narration} candidate music={candidate.music} /></VerifiedAssets>;
};
export const RootRemedialCandidate: React.FC = () => <Composition id={CANDIDATE_ID} component={RemedialReviewCandidate} durationInFrames={narration.totalFrames} fps={30} width={1920} height={1080} calculateMetadata={async () => {
	await verify();
	return { durationInFrames: narration.totalFrames, defaultOutName: 'remedial-action-review-candidate-v1' };
}} />;
