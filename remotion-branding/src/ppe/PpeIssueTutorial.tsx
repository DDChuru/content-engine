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
 * PPE Issue & Returns — e-wizer field guide journey (amber).
 * Stills + boxes.json arrive from the capture agent (720×1600 raw px);
 * timing.json + per-beat MP3s from the narration agent. Placeholders in
 * place until then — swap the files, no code changes.
 */

const ACCENT = '#E89A30';
const ACCENT_B = '#3CB6E0';
const EMERALD = '#1F9C5A';
const TEAL = '#14B8A6';
const MUSIC = 'ppe-tutorial/audio/tutorial.mp3';

const COPY: Record<string, BeatCopy> = {
	'ppe-01-landing': {
		headline: 'Issue & Returns',
		body: "See what's out and what's ready to sign off.",
		proof: 'Out and awaiting, at a glance.',
	},
	'ppe-02-new-issue': {
		headline: 'Start a shift',
		body: "One tap to issue this shift's PPE.",
		proof: 'A session per shift.',
	},
	'ppe-03-issue-capture': {
		headline: 'Issue & inspect',
		body: 'Pick the PPE, set quantities — in one pass.',
		proof: 'Issue and inspection, one pass.',
	},
	'ppe-04-awaiting': {
		headline: 'Awaiting return',
		body: "Drops in so nothing's re-issued by mistake.",
		proof: 'No double issue.',
	},
	'ppe-05-tap-return': {
		headline: 'Tap to return',
		body: 'Open the session at shift end.',
		proof: 'Same session, closed at shift end.',
	},
	'ppe-06-return-capture': {
		headline: 'Make the count balance',
		body: 'Intact, damaged, disposed — together they account for what went out.',
		proof: 'Every unit accounted for.',
	},
	'ppe-07-signoff': {
		headline: 'Manager signature',
		body: 'One signature closes the session — any shortfall raises a remedial.',
		proof: 'Signed by the manager.',
	},
	'ppe-08-done': {
		headline: 'Signed & recorded',
		body: 'A clean PPE record, every shift.',
		proof: 'PPE, under control.',
	},
};

export const PPE_FPS = (TIMING as JourneyTiming).fps;
export const PPE_JOURNEY_FRAMES = (TIMING as JourneyTiming).total_frames;
export const PPE_BRANDED_FRAMES =
	BOOKEND_INTRO_FRAMES + PPE_JOURNEY_FRAMES + BOOKEND_OUTRO_FRAMES;

export const PpeIssueTutorial: React.FC<{ showTitle?: boolean }> = ({ showTitle = true }) => (
	<PhoneJourney
		timing={TIMING as JourneyTiming}
		boxes={BOXES as Record<string, RingBox>}
		copy={COPY}
		stillDir="ppe-tutorial/shots/raw"
		stillW={720}
		stillH={1600}
		cropTop={60}
		footerLabel="e-wizer field guide - ppe issue & returns"
		accent={ACCENT}
		showTitleCard={showTitle}
		titleCard={{
			kicker: 'e-wizer field guide',
			title: 'PPE Issue & Returns',
			tagline: 'Issue. Inspect. Sign. Record.',
		}}
	/>
);

export const PpeIssueTutorialBranded: React.FC = () => {
	const outroStart = BOOKEND_INTRO_FRAMES + PPE_JOURNEY_FRAMES;

	return (
		<AbsoluteFill style={{ background: '#0E1822' }}>
			<Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES} premountFor={PPE_FPS}>
				<Audio src={staticFile(MUSIC)} volume={(f) => 0.88 * fadeInOut(f, BOOKEND_INTRO_FRAMES, 24)} />
			</Sequence>
			<Sequence from={outroStart} durationInFrames={BOOKEND_OUTRO_FRAMES} premountFor={PPE_FPS}>
				<Audio src={staticFile(MUSIC)} volume={(f) => 0.88 * fadeInOut(f, BOOKEND_OUTRO_FRAMES, 28)} />
			</Sequence>
			<Sequence from={0} durationInFrames={BOOKEND_INTRO_FRAMES} premountFor={PPE_FPS}>
				<BrandIntro
					title="PPE Issue & Returns"
					tagline="Issue. Inspect. Sign. Record."
					accentA={ACCENT}
					accentB={ACCENT_B}
				/>
			</Sequence>
			<Sequence from={BOOKEND_INTRO_FRAMES} durationInFrames={PPE_JOURNEY_FRAMES} premountFor={PPE_FPS}>
				<PpeIssueTutorial showTitle={false} />
			</Sequence>
			<Sequence from={outroStart} durationInFrames={BOOKEND_OUTRO_FRAMES} premountFor={PPE_FPS}>
				<BrandOutro
					outroKicker="session closed"
					outroHeadline="PPE, under control."
					outroBody="Issued, inspected and signed off — a clean record every shift."
					outroCards={[
						{ label: 'Issued', color: ACCENT },
						{ label: 'Inspected', color: TEAL },
						{ label: 'Recorded', color: EMERALD },
					]}
					accentA={ACCENT}
					accentB={ACCENT_B}
				/>
			</Sequence>
		</AbsoluteFill>
	);
};
