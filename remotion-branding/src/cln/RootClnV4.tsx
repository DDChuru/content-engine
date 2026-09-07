import React from 'react';
import { Composition, type CalculateMetadataFunction } from 'remotion';
import {
	CleaningVerificationTutorialV4,
	CleaningVerificationTutorialV4InternalPreview,
	CLN_V4_CAPTURES,
	CLN_V4_NARRATION,
	CLN_V4_FPS,
	CLN_V4_FRAMES,
	CLN_V4_ID,
	CLN_V4_PREVIEW_ID,
	verifyV4BrowserAssets,
} from './CleaningVerificationTutorialV4';
import { assertFinalReady } from './v4-contract';

const previewMetadata: CalculateMetadataFunction<Record<string, unknown>> = async () => {
	await verifyV4BrowserAssets();
	return { durationInFrames: CLN_V4_FRAMES, defaultOutName: 'cln-verification-v4-INTERNAL-PREVIEW' };
};

const finalMetadata: CalculateMetadataFunction<Record<string, unknown>> = async ({ isRendering }) => {
	if (isRendering) {
		assertFinalReady(CLN_V4_CAPTURES, CLN_V4_NARRATION);
		await verifyV4BrowserAssets();
	}
	return { durationInFrames: CLN_V4_FRAMES, defaultOutName: 'cln-verification-v4' };
};

export const RootClnV4: React.FC = () => (
	<>
		<Composition id={CLN_V4_PREVIEW_ID} component={CleaningVerificationTutorialV4InternalPreview} durationInFrames={CLN_V4_FRAMES} fps={CLN_V4_FPS} width={1920} height={1080} calculateMetadata={previewMetadata} />
		<Composition id={CLN_V4_ID} component={CleaningVerificationTutorialV4} durationInFrames={CLN_V4_FRAMES} fps={CLN_V4_FPS} width={1920} height={1080} calculateMetadata={finalMetadata} />
	</>
);
