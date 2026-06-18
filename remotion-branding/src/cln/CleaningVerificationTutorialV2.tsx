import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Img,
	Sequence,
	interpolate,
	spring,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import timing from './timing.json';
import timingV3 from './timing-v3.json';

const SKY = '#3CB6E0';
const EMERALD = '#1F9C5A';
const AMBER = '#E89A30';
const CORAL = '#D6432F';
const INK = '#071018';
const PANEL = '#0E1822';
const FONT = 'Inter, "DM Sans", system-ui, sans-serif';

const STILL_W = 720;
const STILL_H = 1604;
const CROP_TOP = 62;
const VISIBLE_H = STILL_H - CROP_TOP;
const PHONE_H = 1010;
const SCALE = PHONE_H / VISIBLE_H;
const PHONE_W = STILL_W * SCALE;
const PHONE_X = 108;
const PHONE_Y = 34;

type RingBox = { x: number; y: number; w: number; h: number; color?: string };
type CropRect = { x: number; y: number; w: number; h: number };
type Beat = {
	id: string;
	shot: string;
	chip: string;
	ring: keyof typeof BOXES | null;
	audio: string;
	voStart: number;
	duration: number;
	text: string;
};
type TimingData = {
	fps: number;
	total_seconds: number;
	total_frames: number;
	beats: Beat[];
};

const BOXES = {
	homeHeroScan: { x: 58, y: 484, w: 214, h: 76, color: SKY },
	controlScan: { x: 366, y: 1452, w: 108, h: 108, color: SKY },
	scanFrameV3: { x: 106, y: 555, w: 508, h: 504, color: SKY },
	dueTasks: { x: 32, y: 374, w: 656, h: 532, color: SKY },
	noDueState: { x: 32, y: 804, w: 656, h: 144, color: AMBER },
	offScheduleList: { x: 32, y: 374, w: 656, h: 554, color: EMERALD },
	scanFrame: { x: 103, y: 517, w: 515, h: 515, color: SKY },
	progressCard: { x: 43, y: 382, w: 634, h: 198, color: EMERALD },
	greenTick: { x: 72, y: 405, w: 90, h: 85, color: EMERALD },
	remedialBanner: { x: 40, y: 410, w: 640, h: 184, color: CORAL },
	photoArea: { x: 20, y: 415, w: 680, h: 535, color: CORAL },
	majorChip: { x: 270, y: 972, w: 180, h: 94, color: AMBER },
	actionBox: { x: 72, y: 540, w: 576, h: 117, color: AMBER },
	dialog: { x: 50, y: 670, w: 620, h: 310, color: SKY },
	passRemaining: { x: 36, y: 1217, w: 648, h: 103, color: SKY },
	followBanner: { x: 22, y: 711, w: 676, h: 108, color: AMBER },
	confirmFollowedUp: { x: 58, y: 1044, w: 604, h: 86, color: EMERALD },
	confirmBtn: { x: 369, y: 1148, w: 292, h: 85, color: EMERALD },
} satisfies Record<string, RingBox>;

const COPY: Record<string, { headline: string; body: string; proof: string }> = {
	intro: {
		headline: 'Run the whole verification loop.',
		body: 'Start from the dashboard, complete the checks, and keep remedials visible until they are closed.',
		proof: 'The job is only complete when the follow-up is clear.',
	},
	scan: {
		headline: 'Scan the area QR.',
		body: 'The app records that the operator was physically in the zone before checks unlock.',
		proof: 'Presence proof before task completion.',
	},
	homeHero: {
		headline: 'Start from Home.',
		body: 'Use the Scan QR code button in the hero when you are ready to check into a zone.',
		proof: 'This is the primary route into the scanner.',
	},
	controlScan: {
		headline: 'The control panel works too.',
		body: 'The centre scan button is always available from the bottom control panel and opens the same scanner.',
		proof: 'Two entry points, one check-in workflow.',
	},
	scanFrameV3: {
		headline: 'Put the QR in the frame.',
		body: 'The area QR identifies the zone, proves where the operator is, and unlocks the correct work list.',
		proof: 'Scan first, then work the zone.',
	},
	zoneDue: {
		headline: 'Scheduled work appears under Due.',
		body: 'When tasks are due today, the operator starts here and works through the zone list.',
		proof: 'Due is the expected work for today.',
	},
	noDue: {
		headline: 'No Due tasks is still a valid scenario.',
		body: 'Holidays, ad-hoc cleans, extra booked shifts, and non-due weekly or monthly work can all land here.',
		proof: 'The schedule is a guide, not a blocker.',
	},
	offSchedule: {
		headline: 'Use Off-schedule for real work done.',
		body: 'Open the full zone catalogue and capture only what was actually cleaned outside today\'s schedule.',
		proof: 'Nothing is forced. The operator records the work performed.',
	},
	zone: {
		headline: 'Work from the area list.',
		body: 'Each surface check is tiered, visible, and tied to today\'s progress.',
		proof: 'No hidden checklist and no paper trail.',
	},
	pass: {
		headline: 'Clean item? Tap pass.',
		body: 'One green tick records the item as checked and moves the user on.',
		proof: 'Fast where the area is clean.',
	},
	fail: {
		headline: 'Problem found? Capture it.',
		body: 'The red cross opens the remedial record so the failure is not buried inside a pass list.',
		proof: 'This is where value is created.',
	},
	photo: {
		headline: 'Add visual evidence.',
		body: 'A marked-up photo removes debate about what was found and where it was found.',
		proof: 'Ten seconds now saves the argument later.',
	},
	grade: {
		headline: 'Grade the severity.',
		body: 'Minor, Major, and Critical give supervisors a clear priority signal.',
		proof: 'A dirty rounder frame is treated as Major.',
	},
	severityGuide: {
		headline: 'Use the same grading key.',
		body: 'This is a short break from the app journey: grade the finding by the real food-safety risk.',
		proof: 'Same PCV key: Minor 1, Major 2, Critical 3.',
	},
	action: {
		headline: 'Write the action and owner.',
		body: 'The finding needs a clear correction and a named person responsible for doing it.',
		proof: 'No owner means no action.',
	},
	submit: {
		headline: 'Submit to the record.',
		body: 'The remedial is timestamped and stored against the inspection.',
		proof: 'The finding is now auditable.',
	},
	passrem: {
		headline: 'Pass the clean remainder.',
		body: 'Once the issue is captured, clean items can be passed in one controlled action.',
		proof: 'Speed without hiding the failure.',
	},
	confirm: {
		headline: 'Confirm the shortcut.',
		body: 'Bulk pass still records against the operator and the area.',
		proof: 'A shortcut, not a blind bypass.',
	},
	complete: {
		headline: 'Area complete, honestly.',
		body: 'The area can hit 100 percent while keeping the failed item on record.',
		proof: 'Clean work and honest reporting can coexist.',
	},
	banner: {
		headline: 'Follow-up stays visible.',
		body: 'The home banner keeps remedials in view until someone closes them.',
		proof: 'Recording is not the finish line.',
	},
	queue: {
		headline: 'Manage the queue.',
		body: 'Each open remedial carries its grade, owner, and evidence into follow-up.',
		proof: 'Supervisors see what still needs action.',
	},
	close: {
		headline: 'Verify before closing.',
		body: 'Check the work, add the after-photo if needed, and confirm the remedial is done.',
		proof: 'Found, fixed, verified.',
	},
	allclear: {
		headline: 'Close the loop.',
		body: 'The final state is not a ticked checklist. It is proof that the problem was followed through.',
		proof: 'That is cleaning verification.',
	},
};

const ZOOM_CROPS: Partial<Record<keyof typeof BOXES, CropRect & { panelH?: number }>> = {
	homeHeroScan: { x: 24, y: 296, w: 672, h: 318, panelH: 380 },
	controlScan: { x: 102, y: 1310, w: 520, h: 294, panelH: 360 },
	scanFrameV3: { x: 70, y: 515, w: 580, h: 590, panelH: 405 },
	dueTasks: { x: 20, y: 355, w: 680, h: 570, panelH: 405 },
	noDueState: { x: 20, y: 735, w: 680, h: 260, panelH: 360 },
	offScheduleList: { x: 20, y: 355, w: 680, h: 600, panelH: 360 },
	scanFrame: { x: 72, y: 445, w: 576, h: 650, panelH: 380 },
	progressCard: { x: 18, y: 332, w: 684, h: 330 },
	greenTick: { x: 34, y: 360, w: 250, h: 180 },
	remedialBanner: { x: 18, y: 342, w: 684, h: 330 },
	photoArea: { x: 0, y: 338, w: 720, h: 720, panelH: 385 },
	majorChip: { x: 110, y: 850, w: 520, h: 290 },
	actionBox: { x: 40, y: 470, w: 640, h: 360 },
	dialog: { x: 28, y: 558, w: 664, h: 500, panelH: 380 },
	passRemaining: { x: 18, y: 1085, w: 684, h: 310 },
	followBanner: { x: 0, y: 620, w: 720, h: 285 },
	confirmFollowedUp: { x: 0, y: 790, w: 720, h: 455, panelH: 385 },
	confirmBtn: { x: 210, y: 930, w: 490, h: 380, panelH: 385 },
};

const GRADING_GUIDE = [
	{
		digit: '1',
		label: 'Minor',
		color: '#FDE68A',
		textColor: '#1F2937',
		image: 'cln-tutorial/severity-minor-bakery.png',
		scenario: 'Light flour on a non-contact frame.',
		hint: 'Traces on non food-contact surfaces; low contamination risk.',
	},
	{
		digit: '2',
		label: 'Major',
		color: AMBER,
		textColor: '#FFFFFF',
		image: 'cln-tutorial/severity-major-bakery.png',
		scenario: 'Dried dough on an equipment contact ring.',
		hint: 'Traces on equipment contact surfaces; high product-contamination risk.',
	},
	{
		digit: '3',
		label: 'Critical',
		color: '#DC2626',
		textColor: '#FFFFFF',
		image: 'cln-tutorial/severity-critical-bakery.png',
		scenario: 'Gross residue inside the mixer.',
		hint: 'Not cleaned; gross soiling. Not fit for production.',
	},
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const hexToRgb = (hex: string) => {
	const n = parseInt(hex.slice(1), 16);
	return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
};

const getActiveIndex = (beats: Beat[], sec: number) => {
	let active = 0;
	for (let i = 0; i < beats.length; i++) {
		if (sec >= beats[i].voStart - 0.18) active = i;
	}
	return active;
};

const PhoneStill: React.FC<{
	beats: Beat[];
	active: number;
	sec: number;
	totalSeconds: number;
}> = ({ beats, active, sec, totalSeconds }) => {
	return (
		<>
			{beats.map((beat, i) => {
				const next = i + 1 < beats.length ? beats[i + 1].voStart : totalSeconds + 1;
				const opacity = interpolate(
					sec,
					[beat.voStart - 0.42, beat.voStart - 0.08, next - 0.46, next - 0.1],
					[0, 1, 1, 0],
					{ extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
				);
				if (opacity <= 0) return null;
				return (
					<Img
						key={beat.id}
						src={staticFile(`cln-tutorial/shots/${beat.shot}.png`)}
						style={{
							position: 'absolute',
							left: 0,
							top: -CROP_TOP * SCALE,
							width: '100%',
							height: STILL_H * SCALE,
							opacity,
						}}
					/>
				);
			})}
			<div
				style={{
					position: 'absolute',
					left: 24,
					top: 40,
					background: 'rgba(7,16,24,0.72)',
					borderRadius: 999,
					padding: '7px 12px',
					color: 'rgba(255,255,255,0.82)',
					fontSize: 16,
					fontWeight: 800,
					letterSpacing: 1.6,
					textTransform: 'uppercase',
				}}
			>
				Step {String(active + 1).padStart(2, '0')}
			</div>
		</>
	);
};

const PhoneRing: React.FC<{
	box: RingBox | null;
	beatStart: number;
}> = ({ box, beatStart }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	if (!box) return null;

	const land = spring({
		frame: frame - Math.round((beatStart + 0.28) * fps),
		fps,
		durationInFrames: 18,
		config: { damping: 18, stiffness: 160 },
	});
	const pulse = 0.5 + 0.5 * Math.sin(frame / 9);
	const scale = interpolate(land, [0, 1], [1.55, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const rgb = hexToRgb(box.color ?? SKY);

	return (
		<div
			style={{
				position: 'absolute',
				left: box.x * SCALE - 10,
				top: (box.y - CROP_TOP) * SCALE - 10,
				width: box.w * SCALE + 20,
				height: box.h * SCALE + 20,
				borderRadius: 18,
				border: `5px solid rgba(${rgb},${0.62 + pulse * 0.35})`,
				background: `rgba(${rgb},${0.14 + pulse * 0.06})`,
				boxShadow: `0 0 ${22 + pulse * 24}px rgba(${rgb},0.68)`,
				opacity: land,
				transform: `scale(${scale})`,
				pointerEvents: 'none',
			}}
		/>
	);
};

const SeverityGuidePanel: React.FC<{
	beat: Beat;
	appear: number;
	lift: number;
}> = ({ beat, appear, lift }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - Math.round(beat.voStart * fps);
	const rowTop = 88;
	const rowH = 94;
	const rowGap = 12;
	const thumb = { x: 18, w: 154, h: 86 };
	const focus = { x: 108, y: 72, w: 684, h: 308 };

	return (
		<div
			style={{
				width: 900,
				height: 430,
				borderRadius: 28,
				background: `linear-gradient(135deg, rgba(232,154,48,0.18), rgba(214,67,47,0.10)), ${PANEL}`,
				border: '1px solid rgba(255,255,255,0.12)',
				boxShadow: '0 28px 70px rgba(0,0,0,0.3)',
				padding: 24,
				opacity: appear,
				transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
				position: 'relative',
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					color: 'rgba(255,255,255,0.7)',
					fontSize: 18,
					lineHeight: 1.2,
					fontWeight: 850,
					textTransform: 'uppercase',
					letterSpacing: 1.4,
				}}
			>
				Exactly the familiar PCV grading key
			</div>

			{GRADING_GUIDE.map((grade, index) => {
				const start = [1.0, 8.4, 16.4][index] * fps;
				const settle = interpolate(localFrame, [start + 1.35 * fps, start + 2.45 * fps], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const rowReveal = interpolate(localFrame, [start + 0.25 * fps, start + 0.85 * fps], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const contentReveal = interpolate(localFrame, [start + 2.1 * fps, start + 2.6 * fps], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const overlayOpacity = interpolate(localFrame, [start - 0.1 * fps, start + 0.35 * fps, start + 2.35 * fps, start + 2.65 * fps], [0, 1, 1, 0], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const rowY = rowTop + index * (rowH + rowGap);
				const final = { x: thumb.x, y: rowY + 4, w: thumb.w, h: thumb.h };
				const left = interpolate(settle, [0, 1], [focus.x, final.x], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const top = interpolate(settle, [0, 1], [focus.y, final.y], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const width = interpolate(settle, [0, 1], [focus.w, final.w], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const height = interpolate(settle, [0, 1], [focus.h, final.h], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const rgb = hexToRgb(grade.color);

				return (
					<React.Fragment key={grade.label}>
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: rowY,
								height: rowH,
								borderRadius: 20,
								background: `rgba(${rgb},0.12)`,
								border: `1px solid rgba(${rgb},${0.24 + rowReveal * 0.36})`,
								display: 'flex',
								alignItems: 'center',
								gap: 18,
								padding: '4px 18px',
								opacity: rowReveal,
								transform: `translateX(${interpolate(rowReveal, [0, 1], [18, 0])}px)`,
							}}
						>
							<div
								style={{
									width: thumb.w,
									height: thumb.h,
									borderRadius: 16,
									overflow: 'hidden',
									border: `1px solid rgba(${rgb},0.45)`,
									opacity: contentReveal,
									flex: '0 0 auto',
									background: '#101923',
								}}
							>
								<Img
									src={staticFile(grade.image)}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
							</div>
							<div
								style={{
									width: 52,
									height: 52,
									borderRadius: 26,
									background: grade.color,
									color: grade.textColor,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 26,
									fontWeight: 950,
									flex: '0 0 auto',
									opacity: contentReveal,
								}}
							>
								{grade.digit}
							</div>
							<div style={{ opacity: contentReveal }}>
								<div style={{ color: '#fff', fontSize: 27, fontWeight: 950 }}>{grade.label}</div>
								<div style={{ color: 'rgba(255,255,255,0.86)', fontSize: 16, lineHeight: 1.15, fontWeight: 840, marginTop: 1 }}>
									{grade.scenario}
								</div>
								<div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 14, lineHeight: 1.14, fontWeight: 720, marginTop: 4 }}>
									{grade.hint}
								</div>
							</div>
						</div>
						{overlayOpacity > 0 ? (
							<div
								style={{
									position: 'absolute',
									left,
									top,
									width,
									height,
									borderRadius: interpolate(settle, [0, 1], [26, 16], {
										extrapolateLeft: 'clamp',
										extrapolateRight: 'clamp',
									}),
									overflow: 'hidden',
									border: `2px solid rgba(${rgb},0.84)`,
									boxShadow: `0 22px 70px rgba(${rgb},0.25), 0 24px 70px rgba(0,0,0,0.42)`,
									opacity: overlayOpacity,
									zIndex: 8,
								}}
							>
								<Img
									src={staticFile(grade.image)}
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover',
									}}
								/>
								<div
									style={{
										position: 'absolute',
										inset: 0,
										background: `linear-gradient(180deg, rgba(7,16,24,0.03), rgba(7,16,24,${interpolate(settle, [0, 1], [0.62, 0], {
											extrapolateLeft: 'clamp',
											extrapolateRight: 'clamp',
										})}))`,
									}}
								/>
								<div
									style={{
										position: 'absolute',
										left: 22,
										bottom: 20,
										display: 'flex',
										alignItems: 'center',
										gap: 14,
										opacity: interpolate(settle, [0, 0.72], [1, 0], {
											extrapolateLeft: 'clamp',
											extrapolateRight: 'clamp',
										}),
									}}
								>
									<div
										style={{
											width: 62,
											height: 62,
											borderRadius: 31,
											background: grade.color,
											color: grade.textColor,
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											fontSize: 31,
											fontWeight: 950,
											boxShadow: '0 14px 28px rgba(0,0,0,0.35)',
										}}
									>
										{grade.digit}
									</div>
									<div>
										<div style={{ color: '#fff', fontSize: 34, fontWeight: 950, textShadow: '0 6px 16px rgba(0,0,0,0.46)' }}>
											{grade.label}
										</div>
										<div style={{ color: 'rgba(255,255,255,0.86)', fontSize: 20, fontWeight: 820, lineHeight: 1.1, marginTop: 2 }}>
											{grade.scenario}
										</div>
									</div>
								</div>
							</div>
						) : null}
					</React.Fragment>
				);
			})}
		</div>
	);
};

const AllClearSummaryPanel: React.FC<{
	beat: Beat;
	appear: number;
	lift: number;
}> = ({ beat, appear, lift }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const localFrame = frame - Math.round(beat.voStart * fps);
	const panelW = 900;
	const panelH = 430;
	const proofItems = [
			{
				label: 'Found',
				proof: 'QR scanned',
				color: SKY,
				image: (
					<Img
						src={staticFile('cln-tutorial/zone-qr.png')}
						style={{
							width: 246,
							height: 160,
							objectFit: 'contain',
							borderRadius: 18,
							background: '#fff',
							padding: 14,
						}}
					/>
				),
			},
		{
			label: 'Fixed',
			proof: 'Issue visible',
			color: AMBER,
			image: (
				<Img
					src={staticFile('cln-tutorial/dirty-rounder.png')}
					style={{ width: 246, height: 160, objectFit: 'cover', borderRadius: 18 }}
				/>
			),
		},
		{
			label: 'Verified',
			proof: 'Clean confirmed',
			color: EMERALD,
			image: (
				<Img
					src={staticFile('cln-tutorial/clean-rounder.png')}
					style={{ width: 246, height: 160, objectFit: 'cover', borderRadius: 18 }}
				/>
			),
		},
	];

	return (
		<div
			style={{
				width: panelW,
				height: panelH,
				borderRadius: 28,
				background: `linear-gradient(135deg, rgba(60,182,224,0.15), rgba(31,156,90,0.12)), ${PANEL}`,
				border: '1px solid rgba(255,255,255,0.12)',
				boxShadow: '0 28px 70px rgba(0,0,0,0.3)',
				padding: 28,
				opacity: appear,
				transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
			}}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				{proofItems.map((item, index) => {
					const fade = interpolate(localFrame, [(0.45 + index * 0.45) * fps, (0.9 + index * 0.45) * fps], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					return (
						<div
							key={item.label}
							style={{
								width: 260,
								height: 122,
								borderRadius: 24,
								background: 'rgba(255,255,255,0.07)',
								border: '1px solid rgba(255,255,255,0.12)',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								gap: 15,
								opacity: fade,
								transform: `translateY(${interpolate(fade, [0, 1], [12, 0])}px)`,
							}}
						>
							<div
								style={{
									width: 58,
									height: 58,
									borderRadius: 29,
									background: item.color,
									color: '#fff',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									fontSize: 27,
									fontWeight: 950,
								}}
							>
								{index + 1}
							</div>
							<div>
								<div style={{ color: '#fff', fontSize: 30, fontWeight: 950 }}>{item.label}</div>
								<div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 17, fontWeight: 800, marginTop: 4 }}>
									{item.proof}
								</div>
							</div>
						</div>
					);
				})}
			</div>

			<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
				{proofItems.map((item, index) => {
					const fade = interpolate(localFrame, [(1.05 + index * 0.55) * fps, (1.55 + index * 0.55) * fps], [0, 1], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					return (
						<div
							key={`${item.label}-image`}
							style={{
								width: 260,
								height: 208,
								borderRadius: 24,
								background: 'rgba(255,255,255,0.07)',
								border: `1px solid rgba(${hexToRgb(item.color)},0.48)`,
								padding: 7,
								opacity: fade,
								transform: `translateY(${interpolate(fade, [0, 1], [16, 0])}px) scale(${interpolate(fade, [0, 1], [0.96, 1])})`,
								boxShadow: `0 18px 40px rgba(${hexToRgb(item.color)},0.13)`,
							}}
						>
							{item.image}
							<div
								style={{
									marginTop: 10,
									color: '#fff',
									fontSize: 21,
									fontWeight: 900,
									textAlign: 'center',
								}}
							>
								{item.proof}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const ZoomPanel: React.FC<{
	beat: Beat;
	box: RingBox | null;
	appear: number;
}> = ({ beat, box, appear }) => {
	const panelW = 900;
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const lift = spring({ frame: frame - Math.round((beat.voStart + 0.35) * fps), fps, config: { damping: 200 } });

	if (!box) {
		if (beat.id === 'severityGuide') {
			return <SeverityGuidePanel beat={beat} appear={appear} lift={lift} />;
		}

		if (beat.id === 'allclear') {
			return <AllClearSummaryPanel beat={beat} appear={appear} lift={lift} />;
		}

		const panelH = 330;
		const items =
			['Scan', 'Check', 'Follow up'];
		return (
			<div
				style={{
					width: panelW,
					height: panelH,
					borderRadius: 28,
					background: `linear-gradient(135deg, rgba(60,182,224,0.15), rgba(31,156,90,0.10)), ${PANEL}`,
					border: '1px solid rgba(255,255,255,0.11)',
					boxShadow: '0 28px 70px rgba(0,0,0,0.28)',
					padding: 28,
					opacity: appear,
					transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				{items.map((item, index) => (
					<div
						key={item}
						style={{
							width: 240,
							height: 220,
							borderRadius: 24,
							background: 'rgba(255,255,255,0.07)',
							border: '1px solid rgba(255,255,255,0.12)',
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
							gap: 18,
						}}
					>
						<div
							style={{
								width: 76,
								height: 76,
								borderRadius: 38,
								background: index === 0 ? SKY : index === 1 ? AMBER : EMERALD,
								color: '#fff',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontSize: 34,
								fontWeight: 900,
							}}
						>
							{index + 1}
						</div>
						<div style={{ color: '#fff', fontSize: 34, fontWeight: 900 }}>{item}</div>
					</div>
				))}
			</div>
		);
	}

	const configuredCrop = beat.ring ? ZOOM_CROPS[beat.ring] : null;
	const padX = Math.max(100, box.w * 0.45);
	const padY = Math.max(100, box.h * 0.55);
	const cropW = configuredCrop ? configuredCrop.w : Math.min(STILL_W, box.w + padX * 2);
	const cropH = configuredCrop ? configuredCrop.h : Math.min(STILL_H, box.h + padY * 2);
	const cropX = configuredCrop ? configuredCrop.x : clamp(box.x + box.w / 2 - cropW / 2, 0, STILL_W - cropW);
	const cropY = configuredCrop ? configuredCrop.y : clamp(box.y + box.h / 2 - cropH / 2, 0, STILL_H - cropH);
	const panelH = configuredCrop?.panelH ?? 360;
	const inset = 18;
	const scale = Math.min((panelW - inset * 2) / cropW, (panelH - inset * 2) / cropH);
	const imageX = (panelW - cropW * scale) / 2;
	const imageY = (panelH - cropH * scale) / 2;
	const rgb = hexToRgb(box.color ?? SKY);

	return (
		<div
			style={{
				position: 'relative',
				width: panelW,
				height: panelH,
				borderRadius: 28,
				overflow: 'hidden',
				background: `linear-gradient(135deg, rgba(${rgb},0.08), rgba(255,255,255,0.03)), #0b1219`,
				border: `2px solid rgba(${rgb},0.8)`,
				boxShadow: `0 28px 80px rgba(0,0,0,0.34), 0 0 42px rgba(${rgb},0.25)`,
				opacity: appear,
				transform: `translateY(${interpolate(lift, [0, 1], [18, 0])}px)`,
			}}
		>
			<Img
				src={staticFile(`cln-tutorial/shots/${beat.shot}.png`)}
				style={{
					position: 'absolute',
					left: imageX - cropX * scale,
					top: imageY - cropY * scale,
					width: STILL_W * scale,
					height: STILL_H * scale,
					filter: 'drop-shadow(0 18px 34px rgba(0,0,0,0.24))',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: imageX + (box.x - cropX) * scale - 8,
					top: imageY + (box.y - cropY) * scale - 8,
					width: box.w * scale + 16,
					height: box.h * scale + 16,
					borderRadius: 18,
					border: `6px solid rgba(${rgb},0.9)`,
					boxShadow: `0 0 36px rgba(${rgb},0.62)`,
					background: `rgba(${rgb},0.14)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 22,
					bottom: 20,
					background: `rgba(${rgb},0.94)`,
					color: '#fff',
					fontWeight: 900,
					fontSize: 26,
					letterSpacing: 1.4,
					textTransform: 'uppercase',
					padding: '10px 16px',
					borderRadius: 14,
				}}
			>
				Focus here
			</div>
		</div>
	);
};

const CleaningVerificationTutorialScene: React.FC<{ timingData: TimingData }> = ({ timingData }) => {
	const frame = useCurrentFrame();
	const { fps } = useVideoConfig();
	const sec = frame / fps;
	const beats = timingData.beats as Beat[];
	const active = getActiveIndex(beats, sec);
	const beat = beats[active];
	const box = beat.ring ? BOXES[beat.ring] : null;
	const copy = COPY[beat.id] ?? { headline: beat.chip, body: beat.text, proof: 'Follow the highlighted step.' };
	const local = sec - beat.voStart;

	const textIn = interpolate(local, [-0.08, 0.36], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const titleOp = interpolate(sec, [0, 0.35, 2.25, 3.0], [1, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const bar = interpolate(active + clamp(local / Math.max(beat.duration, 1), 0, 1), [0, beats.length], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{ background: INK, fontFamily: FONT }}>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'radial-gradient(circle at 24% 18%, rgba(60,182,224,0.16), transparent 26%), radial-gradient(circle at 83% 78%, rgba(31,156,90,0.12), transparent 30%), linear-gradient(135deg, #111d28, #071018 58%, #05090d)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: PHONE_X - 26,
					top: PHONE_Y - 18,
					width: PHONE_W + 52,
					height: PHONE_H + 36,
					borderRadius: 48,
					background: 'linear-gradient(145deg, #293544, #0c1117)',
					boxShadow: '0 38px 110px rgba(0,0,0,0.56)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: PHONE_X,
					top: PHONE_Y,
					width: PHONE_W,
					height: PHONE_H,
					borderRadius: 36,
					overflow: 'hidden',
					background: '#fff',
					boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 0 0 12px #11161d',
				}}
			>
				<PhoneStill beats={beats} active={active} sec={sec} totalSeconds={timingData.total_seconds} />
				<PhoneRing box={box} beatStart={beat.voStart} />
			</div>

			<div style={{ position: 'absolute', left: 675, top: 72, width: 1110 }}>
				<div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: textIn }}>
					<div
						style={{
							height: 52,
							padding: '0 22px',
							borderRadius: 999,
							background: 'rgba(60,182,224,0.16)',
							border: '1px solid rgba(60,182,224,0.42)',
							color: SKY,
							display: 'flex',
							alignItems: 'center',
							fontSize: 24,
							fontWeight: 900,
							letterSpacing: 2,
							textTransform: 'uppercase',
						}}
					>
						{beat.chip}
					</div>
					<div style={{ color: 'rgba(255,255,255,0.58)', fontSize: 26, fontWeight: 800 }}>
						{active + 1} / {beats.length}
					</div>
				</div>

				<div
					style={{
						marginTop: 32,
						color: '#fff',
						fontSize: 72,
						lineHeight: 1.04,
						fontWeight: 950,
						letterSpacing: -0.6,
						opacity: textIn,
						transform: `translateY(${interpolate(textIn, [0, 1], [20, 0])}px)`,
						textShadow: '0 10px 32px rgba(0,0,0,0.36)',
					}}
				>
					{copy.headline}
				</div>

				<div
					style={{
						marginTop: 28,
						width: 900,
						color: 'rgba(255,255,255,0.76)',
						fontSize: 36,
						lineHeight: 1.32,
						fontWeight: 650,
						opacity: textIn,
					}}
				>
					{copy.body}
				</div>

				<div style={{ marginTop: 44 }}>
					<ZoomPanel beat={beat} box={box} appear={textIn} />
				</div>

				<div
					style={{
						marginTop: 30,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 12,
						background: 'rgba(255,255,255,0.08)',
						border: '1px solid rgba(255,255,255,0.12)',
						borderRadius: 18,
						padding: '14px 18px',
						color: '#fff',
						fontSize: 26,
						fontWeight: 850,
						opacity: textIn,
					}}
				>
					<div
						style={{
							width: 14,
							height: 14,
							borderRadius: 7,
							background: box?.color ?? SKY,
							boxShadow: `0 0 20px ${box?.color ?? SKY}`,
						}}
					/>
					{copy.proof}
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: 675,
					bottom: 54,
					width: 1110,
					height: 10,
					borderRadius: 999,
					background: 'rgba(255,255,255,0.12)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						width: `${bar * 100}%`,
						height: '100%',
						borderRadius: 999,
						background: `linear-gradient(90deg, ${SKY}, ${EMERALD})`,
						boxShadow: `0 0 26px rgba(60,182,224,0.46)`,
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					left: 675,
					bottom: 74,
					color: 'rgba(255,255,255,0.45)',
					fontSize: 22,
					fontWeight: 800,
					letterSpacing: 2.2,
					textTransform: 'uppercase',
				}}
			>
				e-wizer field guide - cleaning verification
			</div>

			{beats.map((item) => (
				<Sequence
					key={item.id}
					from={Math.round(item.voStart * fps)}
					durationInFrames={Math.ceil(item.duration * fps) + 4}
					premountFor={fps}
				>
					<Audio src={staticFile(item.audio)} />
				</Sequence>
			))}

			{titleOp > 0 && (
				<AbsoluteFill
					style={{
						background: 'linear-gradient(135deg, rgba(7,16,24,0.96), rgba(10,22,32,0.92))',
						opacity: titleOp,
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<div style={{ color: SKY, fontSize: 30, fontWeight: 900, letterSpacing: 5, textTransform: 'uppercase' }}>
						e-wizer field guide
					</div>
					<div style={{ color: '#fff', fontSize: 96, fontWeight: 950, marginTop: 20 }}>Cleaning Verification</div>
					<div style={{ color: 'rgba(255,255,255,0.62)', fontSize: 36, fontWeight: 760, marginTop: 20 }}>
						Scan. Check. Record. Follow up.
					</div>
				</AbsoluteFill>
			)}
		</AbsoluteFill>
	);
};

export const CleaningVerificationTutorialV2: React.FC = () => (
	<CleaningVerificationTutorialScene timingData={timing as TimingData} />
);

export const CleaningVerificationTutorialV3: React.FC = () => (
	<CleaningVerificationTutorialScene timingData={timingV3 as TimingData} />
);

export const CLN_TUTORIAL_V2_FRAMES = timing.total_frames;
export const CLN_TUTORIAL_V2_FPS = timing.fps;
export const CLN_TUTORIAL_V3_FRAMES = timingV3.total_frames;
export const CLN_TUTORIAL_V3_FPS = timingV3.fps;
