import React from 'react';
import { Composition, type CalculateMetadataFunction } from 'remotion';
import { FINAL_ID, PREVIEW_ID, assertFinalReady } from './contract';
import {
	CAPTURES, NARRATION, FPS, FRAMES, RemedialActionInternalPreview,
	RemedialActionTutorial, verifyBrowserAssets,
} from './RemedialActionTutorial';

const previewMetadata: CalculateMetadataFunction<Record<string, unknown>> = async () => {
	await verifyBrowserAssets();
	return { durationInFrames: FRAMES, defaultOutName: 'remedial-action-INTERNAL-PREVIEW' };
};
const finalMetadata: CalculateMetadataFunction<Record<string, unknown>> = ({ isRendering }) => {
	if (isRendering) assertFinalReady(CAPTURES, NARRATION);
	return { durationInFrames: FRAMES, defaultOutName: 'remedial-action-FINAL-BLOCKED' };
};

export const RootRemedial: React.FC = () => (
	<>
		<Composition id={PREVIEW_ID} component={RemedialActionInternalPreview} durationInFrames={FRAMES} fps={FPS} width={1920} height={1080} calculateMetadata={previewMetadata} />
		<Composition id={FINAL_ID} component={RemedialActionTutorial} durationInFrames={FRAMES} fps={FPS} width={1920} height={1080} calculateMetadata={finalMetadata} />
	</>
);
