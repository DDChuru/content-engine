import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import {
	BOOKEND_INTRO_FRAMES,
	BOOKEND_OUTRO_FRAMES,
	BrandIntro,
	BrandOutro,
	fadeInOut,
} from '../brand/EcowizeBookends';
import { PhoneJourney, type BeatCopy, type JourneyTiming, type RingBox } from '../journeys/PhoneJourney';
import TIMING from './timing.json';
import BOXES from './boxes.json';

/**
 * Equipment Issue & Returns — e-wizer field guide journey (teal).
 * Stills + boxes.json arrive from the capture agent (720×1600 raw px);
 * timing.json + per-beat MP3s from the narration agent. Placeholders in
 * place until then — swap the files, no code changes.
 */

const ACCENT = '#14B8A6';
const ACCENT_B = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const MUSIC = 'equipment-tutorial/audio/tutorial.mp3';

const COPY: Record<string, BeatCopy> = {
	'eq-01-landing': {
		headline: 'Issue & Returns',
		body: 'Cleaning equipment, out and back — in 30 seconds.',
		proof: 'One register, out and back.',
	},
	'eq-02-issue-list': {
		headline: 'One list, by colour',
		body: 'Every item, by colour code, laid out for your site.',
		proof: 'Colour-coded to your site.',
	},
	'eq-03-qty-all': {
		headline: 'Type it, or tap All',
		body: "Set the quantity out — or 'All' for full stock.",
		proof: 'Full stock is one tap.',
	},
	'eq-04-condition': {
		headline: 'Clean & intact by default',
		body: 'Only stop to flag a real problem.',
		proof: 'Good condition assumed, exceptions flagged.',
	},
	'eq-05-signature': {
		headline: 'One signature',
		body: 'Signs the whole issue, carries to every row.',
		proof: 'One signature covers the issue.',
	},
	'eq-06-issued': {
		headline: 'On the record',
		body: 'Out, logged, against your name.',
		proof: 'Issued and accountable.',
	},
	'eq-07-return-list': {
		headline: 'The list comes back',
		body: 'Every outstanding item, quantity pre-filled.',
		proof: 'Nothing outstanding is forgotten.',
	},
	'eq-08-exception': {
		headline: 'Damaged? Dive in',
		body: 'Log damaged qty, a note, a photo — your evidence.',
		proof: 'Damage recorded with evidence.',
	},
	'eq-09-all-clear': {
		headline: 'One tap reconciles',
		body: "Everything back clean? 'All clear' does the rest.",
		proof: 'The clear remainder closes fast.',
	},
	'eq-10-reconciled': {
		headline: 'Fully reconciled',
		body: 'Ready for the CLN-RIL-01 reconciliation report.',
		proof: 'Equipment, accounted for.',
	},
};

export const EQUIPMENT_FPS = (TIMING as JourneyTiming).fps;
export const EQUIPMENT_JOURNEY_FRAMES = (TIMING as JourneyTiming).total_frames;
export const EQUIPMENT_BRANDED_FRAMES =
	BOOKEND_INTRO_FRAMES + EQUIPMENT_JOURNEY_FRAMES + BOOKEND_OUTRO_FRAMES;

export const EquipmentIssueTutorial: React.FC = () => (
	<PhoneJourney
		timing={TIMING as JourneyTiming}
		boxes={BOXES as Record<string, RingBox>}
		copy={COPY}
		stillDir="equipment-tutorial/shots/raw"
		stillW={720}
		stillH={1600}
		cropTop={60}
		footerLabel="e-wizer field guide - equipment issue & returns"
		accent={ACCENT}
		titleCard={{
			kicker: 'e-wizer field guide',
			title: 'Equipment Issue & Returns',
			tagline: 'Issue. Check. Return. Reconcile.',
		}}
	/>
);

export const EquipmentIssueTutorialBranded: React.FC = () => {
	const outroStart = BOOKEND_INTRO_FRAMES + EQUIPMENT_JOURNEY_FRAMES;

	return (
		<AbsoluteFill style={{ background: '#0E1822' }}>
			<Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES} premountFor={EQUIPMENT_FPS}>
				<Audio src={staticFile(MUSIC)} volume={(f) => 0.88 * fadeInOut(f, BOOKEND_INTRO_FRAMES, 24)} />
			</Sequence>
			<Sequence from={outroStart} durationInFrames={BOOKEND_OUTRO_FRAMES} premountFor={EQUIPMENT_FPS}>
				<Audio src={staticFile(MUSIC)} volume={(f) => 0.88 * fadeInOut(f, BOOKEND_OUTRO_FRAMES, 28)} />
			</Sequence>
			<Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES} premountFor={EQUIPMENT_FPS}>
				<BrandIntro
					title="Equipment Issue & Returns"
					tagline="Issue. Check. Return. Reconcile."
					accentA={ACCENT}
					accentB={ACCENT_B}
				/>
			</Sequence>
			<Sequence from={BOOKEND_INTRO_FRAMES} durationInFrames={EQUIPMENT_JOURNEY_FRAMES} premountFor={EQUIPMENT_FPS}>
				<EquipmentIssueTutorial />
			</Sequence>
			<Sequence from={outroStart} durationInFrames={BOOKEND_OUTRO_FRAMES} premountFor={EQUIPMENT_FPS}>
				<BrandOutro
					outroKicker="register closed"
					outroHeadline="Equipment, accounted for."
					outroBody="Out, back, and reconciled — every item on the record."
					outroCards={[
						{ label: 'Issued', color: ACCENT },
						{ label: 'Returned', color: AMBER },
						{ label: 'Reconciled', color: EMERALD },
					]}
					accentA={ACCENT}
					accentB={ACCENT_B}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
