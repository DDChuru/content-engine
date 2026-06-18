import React from 'react';
import {
	AbsoluteFill,
	Easing,
	interpolate,
	useCurrentFrame,
} from 'remotion';

export const TEAL = '20,184,166';
export const TEAL_DARK = '#0F766E';
export const INK = '#0F172A';
export const MUTED = '#64748B';
export const AMBER = '#F59E0B';
export const RED = '#E11D48';
export const EMERALD = '#10B981';
export const FONT = 'Helvetica Neue, Helvetica, Arial, sans-serif';
export const FPS = 30;
export const clamp = {
	extrapolateLeft: 'clamp',
	extrapolateRight: 'clamp',
} as const;

const easeOutExpoCurve = Easing.bezier(0.16, 1, 0.3, 1);

export const easeOutExpo = (value: number) => easeOutExpoCurve(value);

const tiers = [
	'Site Manager',
	'Area Manager',
	'SHEQ Officer',
	'GM',
] as const;

const jumpItems = ['Capture', 'Verify', 'Close', 'Oversee'] as const;

type Tier = (typeof tiers)[number];
type JumpItem = (typeof jumpItems)[number];

const cardShadow = '0 28px 70px rgba(15,23,42,0.18)';
const lightShadow = '0 16px 36px rgba(15,23,42,0.12)';

export const PyramidYouAreHere: React.FC<{ tier?: string | null }> = ({
	tier,
}) => {
	const frame = useCurrentFrame();
	const activeIndex = tiers.findIndex((item) => item === tier);
	const cardIn = easeOutExpo(interpolate(frame, [0, 34], [0, 1], clamp));

	const viewBoxWidth = 900;
	const centerX = viewBoxWidth / 2;
	const tierHeight = 78;
	const gap = 12;
	const topY = 36;
	const widths = [720, 570, 420, 270];

	return (
		<div
			style={{
				position: 'relative',
				width: 900,
				height: 510,
				borderRadius: 18,
				background: '#FFFFFF',
				boxShadow: cardShadow,
				border: '1px solid #E2E8F0',
				overflow: 'hidden',
				opacity: cardIn,
				transform: `translateY(${(1 - cardIn) * 18}px)`,
			}}
		>
			<div
				style={{
					position: 'absolute',
					top: 24,
					left: 34,
					color: TEAL_DARK,
					fontSize: 18,
					fontWeight: 800,
					letterSpacing: 1.8,
					textTransform: 'uppercase',
				}}
			>
				IINM access path
			</div>
			<svg
				width="900"
				height="430"
				viewBox="0 0 900 430"
				style={{ position: 'absolute', left: 0, top: 62 }}
			>
				<defs>
					<filter
						id="iinm-teal-glow"
						x="-30%"
						y="-40%"
						width="160%"
						height="180%"
					>
						<feGaussianBlur stdDeviation="10" result="blur" />
						<feColorMatrix
							in="blur"
							type="matrix"
							values="0 0 0 0 0.078 0 0 0 0 0.722 0 0 0 0 0.651 0 0 0 0.72 0"
							result="glow"
						/>
						<feMerge>
							<feMergeNode in="glow" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				{tiers.map((label, index) => {
					const y = topY + (tiers.length - 1 - index) * (tierHeight + gap);
					const width = widths[index];
					const nextWidth = Math.max(width - 70, 150);
					const isActive = label === tier;
					const stepIn = easeOutExpo(
						interpolate(frame, [index * 5, index * 5 + 26], [0, 1], clamp),
					);
					const shift = (1 - stepIn) * 22;
					const leftTop = centerX - nextWidth / 2;
					const rightTop = centerX + nextWidth / 2;
					const leftBottom = centerX - width / 2;
					const rightBottom = centerX + width / 2;

					return (
						<g
							key={label}
							filter={isActive ? 'url(#iinm-teal-glow)' : undefined}
							opacity={stepIn}
							transform={`translate(0 ${shift})`}
						>
							<polygon
								points={`${leftTop},${y} ${rightTop},${y} ${rightBottom},${y + tierHeight} ${leftBottom},${y + tierHeight}`}
								fill={isActive ? `rgb(${TEAL})` : '#E2E8F0'}
								stroke={isActive ? TEAL_DARK : '#CBD5E1'}
								strokeWidth="2"
							/>
							<text
								x={centerX}
								y={y + tierHeight / 2 + 8}
								textAnchor="middle"
								fontFamily={FONT}
								fontSize={index === 0 ? 23 : 25}
								fontWeight="800"
								fill={isActive ? '#FFFFFF' : INK}
							>
								{label}
							</text>
						</g>
					);
				})}
			</svg>
			{activeIndex >= 0 ? (
				<div
					style={{
						position: 'absolute',
						right: 40,
						top: 62 + topY + (tiers.length - 1 - activeIndex) * (tierHeight + gap) + 20,
						display: 'flex',
						alignItems: 'center',
						gap: 12,
						transform: `translateX(${(1 - cardIn) * 22}px)`,
					}}
				>
					<div
						style={{
							width: 42,
							height: 3,
							background: `rgb(${TEAL})`,
						}}
					/>
					<div
						style={{
							background: INK,
							color: '#FFFFFF',
							borderRadius: 999,
							padding: '11px 16px',
							fontSize: 16,
							fontWeight: 900,
							letterSpacing: 1.2,
						}}
					>
						YOU ARE HERE
					</div>
				</div>
			) : null}
		</div>
	);
};

export const JumpStrip: React.FC<{ active?: string | null }> = ({ active }) => {
	const frame = useCurrentFrame();
	const stripIn = easeOutExpo(interpolate(frame, [0, 28], [0, 1], clamp));

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: 18,
				padding: '18px 22px',
				borderRadius: 20,
				background: '#FFFFFF',
				border: '1px solid #E2E8F0',
				boxShadow: lightShadow,
				opacity: stripIn,
				transform: `translateY(${(1 - stripIn) * 16}px)`,
			}}
		>
			{jumpItems.map((item, index) => {
				const isActive = item === active;
				const chipIn = easeOutExpo(
					interpolate(frame, [index * 6, index * 6 + 22], [0, 1], clamp),
				);

				return (
					<div
						key={item}
						style={{
							minWidth: 190,
							textAlign: 'center',
							borderRadius: 999,
							padding: '18px 26px',
							background: isActive ? `rgb(${TEAL})` : '#FFFFFF',
							color: isActive ? '#FFFFFF' : MUTED,
							border: isActive ? `2px solid rgb(${TEAL})` : '2px solid #CBD5E1',
							fontSize: 27,
							fontWeight: 900,
							boxShadow: isActive
								? '0 18px 34px rgba(20,184,166,0.28)'
								: 'none',
							opacity: chipIn,
							transform: `translateY(${(1 - chipIn) * 12}px) scale(${0.96 + chipIn * 0.04})`,
						}}
					>
						{item}
					</div>
				);
			})}
		</div>
	);
};

export const ColdOpen: React.FC<{
	tier?: string | null;
	title: string;
	subtitle: string;
}> = ({ tier, title, subtitle }) => {
	const frame = useCurrentFrame();
	// compressed so the whole reveal resolves inside a short (~3.6s) VO-driven segment
	const flash = interpolate(frame, [0, 5, 16], [1, 0.45, 0], clamp);
	const markIn = easeOutExpo(interpolate(frame, [6, 32], [0, 1], clamp));
	const pyramidIn = easeOutExpo(interpolate(frame, [20, 56], [0, 1], clamp));
	const titleIn = easeOutExpo(interpolate(frame, [28, 60], [0, 1], clamp));

	return (
		<AbsoluteFill
			style={{
				background: INK,
				fontFamily: FONT,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(180deg, rgba(15,23,42,1) 0%, rgba(30,41,59,1) 100%)',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: '#020617',
					opacity: flash,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					top: 76,
					left: 96,
					display: 'flex',
					alignItems: 'center',
					gap: 18,
					opacity: markIn,
					transform: `translateY(${(1 - markIn) * 16}px)`,
				}}
			>
				<div
					style={{
						width: 30,
						height: 30,
						borderRadius: 9,
						background: `rgb(${TEAL})`,
						boxShadow: '0 0 34px rgba(20,184,166,0.45)',
					}}
				/>
				<div
					style={{
						color: '#FFFFFF',
						fontSize: 58,
						fontWeight: 900,
						letterSpacing: -0.4,
					}}
				>
					e-wizer
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 198,
					left: 96,
					clipPath: `inset(0 ${100 - pyramidIn * 100}% 0 0)`,
				}}
			>
				<PyramidYouAreHere tier={tier} />
			</div>
			<div
				style={{
					position: 'absolute',
					left: 1060,
					top: 312,
					width: 660,
					color: '#FFFFFF',
					opacity: titleIn,
					transform: `translateX(${(1 - titleIn) * 28}px)`,
				}}
			>
				<div
					style={{
						color: `rgb(${TEAL})`,
						textTransform: 'uppercase',
						letterSpacing: 2.8,
						fontSize: 24,
						fontWeight: 900,
						marginBottom: 20,
					}}
				>
					Incidents, Injuries & Near-Misses
				</div>
				<div
					style={{
						fontSize: 78,
						lineHeight: 1.03,
						fontWeight: 900,
						letterSpacing: -0.8,
					}}
				>
					{title}
				</div>
				<div
					style={{
						marginTop: 24,
						color: '#CBD5E1',
						fontSize: 34,
						fontWeight: 800,
					}}
				>
					{subtitle}
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const AvatarIntro = ({
	line,
	chapterNo,
	chapterTitle,
}: {
	line: string;
	chapterNo: number;
	chapterTitle: string;
}) => {
	const frame = useCurrentFrame();

	const logoIn = interpolate(frame, [0, 30], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const metaIn = interpolate(frame, [12, 44], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const headlineIn = interpolate(frame, [24, 64], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});
	const ruleIn = interpolate(frame, [46, 82], [0, 1], {
		...clamp,
		easing: easeOutExpo,
	});

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(160deg,#FFFFFF,#F2F6FA)',
				fontFamily: FONT,
				padding: 118,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: '70px 76px',
					border: '1px solid rgba(226,232,240,0.9)',
					borderRadius: 24,
					boxShadow: '0 36px 90px rgba(15,23,42,0.10)',
				}}
			/>

			<div
				style={{
					position: 'relative',
					zIndex: 1,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'flex-start',
					maxWidth: 1340,
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 18,
						opacity: logoIn,
						transform: `translateY(${interpolate(logoIn, [0, 1], [22, 0], clamp)}px) scale(${interpolate(
							logoIn,
							[0, 1],
							[0.96, 1],
							clamp,
						)})`,
						transformOrigin: 'left center',
					}}
				>
					<div
						style={{
							width: 38,
							height: 38,
							borderRadius: 11,
							background: `rgb(${TEAL})`,
							boxShadow: '0 0 34px rgba(20,184,166,0.45)',
						}}
					/>
					<div
						style={{
							color: INK,
							fontSize: 66,
							fontWeight: 900,
							letterSpacing: -0.4,
						}}
					>
						e-wizer
					</div>
				</div>

				<div
					style={{
						marginTop: 52,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 14,
						borderRadius: 999,
						background: INK,
						color: '#FFFFFF',
						padding: '7px 24px 7px 7px',
						boxShadow: '0 24px 60px rgba(15,23,42,0.20)',
						opacity: metaIn,
						transform: `translateY(${interpolate(metaIn, [0, 1], [20, 0], clamp)}px)`,
					}}
				>
					<div
						style={{
							borderRadius: 999,
							background: `rgb(${TEAL})`,
							padding: '11px 18px',
							fontSize: 23,
							fontWeight: 900,
							letterSpacing: 1.2,
						}}
					>
						CH {chapterNo}
					</div>
					<div
						style={{
							fontSize: 26,
							fontWeight: 850,
							letterSpacing: -0.2,
						}}
					>
						{chapterTitle}
					</div>
				</div>

				<div
					style={{
						marginTop: 42,
						color: INK,
						fontSize: 76,
						fontWeight: 900,
						lineHeight: 1.08,
						letterSpacing: -0.5,
						maxWidth: 1280,
						opacity: headlineIn,
						transform: `translateY(${interpolate(headlineIn, [0, 1], [34, 0], clamp)}px)`,
					}}
				>
					{line}
				</div>

				<div
					style={{
						marginTop: 38,
						width: 340,
						height: 9,
						borderRadius: 999,
						background: `rgb(${TEAL})`,
						boxShadow: '0 14px 34px rgba(20,184,166,0.26)',
						transform: `scaleX(${ruleIn})`,
						transformOrigin: 'left center',
					}}
				/>
			</div>
		</AbsoluteFill>
	);
};

export const LegalScopeCard: React.FC = () => {
	const frame = useCurrentFrame();
	const cardIn = easeOutExpo(interpolate(frame, [0, 40], [0, 1], clamp));

	return (
		<AbsoluteFill
			style={{
				background: '#F8FAFC',
				fontFamily: FONT,
				alignItems: 'center',
				justifyContent: 'center',
				padding: 110,
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background:
						'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)',
				}}
			/>
			<div
				style={{
					position: 'relative',
					width: 1280,
					borderRadius: 18,
					background: '#FFFFFF',
					border: '1px solid #E2E8F0',
					boxShadow: cardShadow,
					padding: '78px 86px 84px',
					opacity: cardIn,
					transform: `translateY(${(1 - cardIn) * 28}px)`,
				}}
			>
				<div
					style={{
						color: TEAL_DARK,
						textTransform: 'uppercase',
						letterSpacing: 2.5,
						fontSize: 24,
						fontWeight: 900,
						marginBottom: 22,
					}}
				>
					The one rule
				</div>
				<div
					style={{
						color: INK,
						fontSize: 62,
						lineHeight: 1.15,
						fontWeight: 900,
						letterSpacing: -0.4,
					}}
				>
					Every incident is recorded. Only serious ones — or a dangerous
					occurrence — also go to the Department of Labour (Section 24).
				</div>
				<div
					style={{
						marginTop: 38,
						display: 'inline-flex',
						alignItems: 'center',
						gap: 14,
						borderRadius: 999,
						background: `rgba(${TEAL},0.14)`,
						color: TEAL_DARK,
						padding: '15px 22px',
						fontSize: 24,
						fontWeight: 900,
					}}
				>
					<span>Section 24</span>
					<span style={{ color: MUTED }}>appears only when it matters</span>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Baton: React.FC<{ verb: string; to: string }> = ({ verb, to }) => {
	const frame = useCurrentFrame();
	const progress = easeOutExpo(interpolate(frame, [8, 92], [0, 1], clamp));
	const settle = easeOutExpo(interpolate(frame, [92, 132], [0, 1], clamp));

	return (
		<div
			style={{
				position: 'relative',
				width: 780,
				height: 160,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 50,
					right: 70,
					top: 77,
					height: 4,
					background: '#CBD5E1',
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 38,
					borderRadius: 999,
					padding: '24px 38px',
					background: `rgb(${TEAL})`,
					color: INK,
					fontSize: 28,
					fontWeight: 950,
					letterSpacing: 1.4,
					boxShadow: '0 18px 34px rgba(20,184,166,0.28)',
					transform: `translateX(${progress * 210}px) scale(${1 + settle * 0.03})`,
				}}
			>
				{verb}
			</div>
			<div
				style={{
					position: 'absolute',
					right: 0,
					top: 26,
					width: 300,
					borderRadius: 18,
					background: '#FFFFFF',
					border: '1px solid #E2E8F0',
					boxShadow: lightShadow,
					padding: '22px 26px',
				}}
			>
				<div
					style={{
						color: MUTED,
						fontSize: 16,
						fontWeight: 900,
						letterSpacing: 1.3,
						textTransform: 'uppercase',
						marginBottom: 8,
					}}
				>
					to
				</div>
				<div
					style={{
						color: INK,
						fontSize: 27,
						fontWeight: 900,
						lineHeight: 1.12,
					}}
				>
					{to}
				</div>
			</div>
		</div>
	);
};

export const Outro: React.FC<{
	youCanNow: string;
	nextLabel: string;
	nextTier: string;
}> = ({ youCanNow, nextLabel, nextTier }) => {
	const frame = useCurrentFrame();
	const cardIn = easeOutExpo(interpolate(frame, [0, 42], [0, 1], clamp));
	const nextIn = easeOutExpo(interpolate(frame, [92, 142], [0, 1], clamp));

	return (
		<AbsoluteFill
			style={{
				background: 'linear-gradient(160deg, #FFFFFF 0%, #F2F6FA 100%)',
				fontFamily: FONT,
				padding: '104px 120px 112px',
			}}
		>
			<div
				style={{
					position: 'relative',
					height: '100%',
					display: 'grid',
					gridTemplateColumns: '1fr 600px',
					gap: 80,
					alignItems: 'center',
				}}
			>
				<div
					style={{
						opacity: cardIn,
						transform: `translateY(${(1 - cardIn) * 26}px)`,
					}}
				>
					<div
						style={{
							color: TEAL_DARK,
							textTransform: 'uppercase',
							letterSpacing: 2.6,
							fontSize: 24,
							fontWeight: 900,
							marginBottom: 22,
						}}
					>
						Chapter 0 complete
					</div>
					<div
						style={{
							color: INK,
							fontSize: 78,
							lineHeight: 1.08,
							fontWeight: 900,
							letterSpacing: -0.6,
							maxWidth: 980,
						}}
					>
						You can now {youCanNow}
					</div>
					<div style={{ marginTop: 54 }}>
						<Baton verb="HANDOFF" to={nextTier} />
					</div>
				</div>
				<div
					style={{
						borderRadius: 18,
						background: INK,
						color: '#FFFFFF',
						padding: '62px 56px',
						boxShadow: cardShadow,
						opacity: nextIn,
						transform: `translateX(${(1 - nextIn) * 28}px)`,
					}}
				>
					<div
						style={{
							color: `rgb(${TEAL})`,
							textTransform: 'uppercase',
							letterSpacing: 2.2,
							fontSize: 22,
							fontWeight: 900,
							marginBottom: 24,
						}}
					>
						Next
					</div>
					<div
						style={{
							fontSize: 62,
							lineHeight: 1.05,
							fontWeight: 900,
						}}
					>
						Next: {nextLabel} →
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export const Caption: React.FC<{ cues: Array<[number, number, string]> }> = ({
	cues,
}) => {
	const frame = useCurrentFrame();
	const cue = cues.find(([fromSec, toSec]) => {
		const fromFrame = Math.round(fromSec * FPS);
		const toFrame = Math.round(toSec * FPS);
		return frame >= fromFrame && frame <= toFrame;
	});

	if (!cue) {
		return null;
	}

	const [fromSec, toSec, text] = cue;
	const fromFrame = Math.round(fromSec * FPS);
	const toFrame = Math.round(toSec * FPS);
	const fadeFrames = Math.min(15, Math.max(1, Math.floor((toFrame - fromFrame) / 2)));
	const inOpacity = interpolate(
		frame,
		[fromFrame, fromFrame + fadeFrames],
		[0, 1],
		clamp,
	);
	const outOpacity = interpolate(
		frame,
		[toFrame - fadeFrames, toFrame],
		[1, 0],
		clamp,
	);
	const opacity = Math.min(inOpacity, outOpacity);

	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				alignItems: 'center',
				justifyContent: 'flex-end',
				paddingBottom: 46,
				fontFamily: FONT,
				zIndex: 20,
			}}
		>
			<div
				style={{
					background: 'rgba(11,18,32,0.92)',
					color: '#FFFFFF',
					fontSize: 30,
					fontWeight: 700,
					lineHeight: 1.25,
					padding: '16px 30px',
					borderRadius: 16,
					maxWidth: 1500,
					textAlign: 'center',
					opacity,
					boxShadow: '0 18px 36px rgba(15,23,42,0.22)',
				}}
			>
				{text}
			</div>
		</AbsoluteFill>
	);
};

export const StepChip: React.FC<{ n: number; label: string }> = ({
	n,
	label,
}) => (
	<div
		style={{
			position: 'absolute',
			top: 48,
			left: 66,
			display: 'inline-flex',
			alignItems: 'center',
			gap: 12,
			borderRadius: 999,
			background: '#FFFFFF',
			border: '1px solid #DDE6F0',
			boxShadow: lightShadow,
			padding: '12px 20px 12px 12px',
			fontFamily: FONT,
			color: INK,
			fontSize: 22,
			fontWeight: 900,
			zIndex: 4,
		}}
	>
		<span
			style={{
				width: 40,
				height: 40,
				borderRadius: 999,
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: `rgb(${TEAL})`,
				color: '#FFFFFF',
				fontSize: 21,
			}}
		>
			{n}
		</span>
		<span>{label}</span>
	</div>
);
