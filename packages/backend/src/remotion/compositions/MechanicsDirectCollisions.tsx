/** Direct collisions: one question, two explicitly independent impact trials. */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import transcript from '../public/transcripts/mechanics/direct-collisions.json';
import {
  T, Scene, Lesson, Paper, Figure, Caption, at, currentBeat, duration,
} from './mechanics-m42/Presentation';
import {collisionPositions, motionClock, RADIUS, Trial} from './mechanics-direct-collisions/Motion';

const SCENES = transcript.scenes as unknown as Scene[];
const OUTCOMES = [
  'Choose signed velocities.',
  "Conserve the pair's momentum.",
  'Solve separate and sticking outcomes.',
];
export interface MechanicsDirectCollisionsProps {audioEnabled?: boolean; audit?: boolean}
export const getMechanicsDirectCollisionsDuration = (fps: number) => duration(SCENES, fps);

/** The actual Whisper word, rounded to its first visible frame, controls each reveal. */
function useCue(s: Scene, id: string) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame >= Math.ceil(at(s, id) * fps);
}
const Diagram: React.FC<{children: React.ReactNode}> = ({children}) =>
  <svg data-region="diagram" data-visual="collision-diagram" width={900} height={800}
    style={{position: 'absolute', left: 80, top: 190}}>{children}</svg>;
const Label: React.FC<{x: number; y: number; children: React.ReactNode; size?: number; muted?: boolean}> =
  ({x, y, children, size = 27, muted = false}) =>
    <text data-label="true" x={x} y={y} fontSize={size} fill={muted ? T.muted : T.text}>{children}</text>;
const Particle: React.FC<{name: string; x: number; y: number; tentative?: boolean}> =
  ({name, x, y, tentative = false}) =>
    <g data-particle={name} data-centre-x={x} data-centre-y={y} data-radius={RADIUS}
      transform={`translate(${x} ${y})`}>
      <circle r={RADIUS} fill={name === 'A' ? T.accent : '#66716f'} stroke={T.text}
        strokeWidth={2} strokeDasharray={tentative ? '8 6' : undefined}/>
      <Label x={-11} y={10} size={29}>{name}</Label>
    </g>;
const Arrow: React.FC<{x: number; y: number; velocity: number; tentative?: boolean; length?: number}> =
  ({x, y, velocity, tentative = false, length}) => {
    const sign = Math.sign(velocity);
    const half = (length ?? Math.abs(velocity) * 32) / 2;
    const start = x - sign * half, end = x + sign * half;
    return <g data-velocity={velocity} data-tentative={tentative ? 'true' : undefined}>
      <path d={`M${start} ${y} H${end}`} fill="none" stroke={T.text} strokeWidth={3.5}
        strokeDasharray={tentative ? '9 7' : undefined}/>
      <path d={`M${end - sign * 10} ${y - 8} L${end} ${y} L${end - sign * 10} ${y + 8}`}
        fill="none" stroke={T.text} strokeWidth={3.5}/>
    </g>;
  };
const Track: React.FC<{y: number}> = ({y}) =>
  <path data-surface-y={y} d={`M55 ${y} H845`} stroke={T.muted} strokeWidth={3}/>;
const Conditions: React.FC<{externalPush?: boolean}> = ({externalPush = false}) => <g>
  <Label x={30} y={25} size={28}>Smooth horizontal surface</Label>
  <Label x={30} y={67} size={25}>{externalPush
    ? 'What if an external horizontal push matters during impact?'
    : 'External horizontal force negligible during impact'}</Label>
  <Label x={30} y={113} size={26}>← Negative</Label>
  <Label x={550} y={113} size={26}>Right is positive →</Label>
</g>;
const Before: React.FC = () => <g data-state="before">
  <Label x={30} y={155} size={27} muted>Before either trial — snapshot</Label>
  <Figure id="A.before" x={136} y={195}>uA = +4 m s⁻¹</Figure>
  <Figure id="B.before" x={516} y={195}>uB = −1 m s⁻¹</Figure>
  <Arrow x={240} y={225} velocity={4}/><Arrow x={620} y={225} velocity={-1}/>
  <Track y={317}/><Particle name="A" x={240} y={277}/><Particle name="B" x={620} y={277}/>
  <Figure id="A.mass" x={158} y={365}>mA = 2 kg</Figure>
  <Figure id="B.mass" x={538} y={365}>mB = 3 kg</Figure>
</g>;
const AfterSeparate: React.FC<{solved?: boolean; moving?: {a: number; b: number}; resultCue?: string}> =
  ({solved = false, moving, resultCue}) => {
    const a = moving?.a ?? 240, b = moving?.b ?? 620;
    return <g data-state="after-separate" data-result={solved && resultCue ? 'B.after' : undefined}
      data-result-cue={solved ? resultCue : undefined}>
      <Label x={30} y={420} size={27} muted>{moving ? 'After trial 1 — moving apart' : 'After trial 1 — snapshot'}</Label>
      <Figure id="A.after" x={a - 104} y={468}>vA = −2 m s⁻¹</Figure>
      <Figure id="B.after" x={b - 104} y={468}>{solved ? 'vB = +3 m s⁻¹' : 'vB = ?'}</Figure>
      <Arrow x={a} y={500} velocity={-2}/>
      <Arrow x={b} y={500} velocity={solved ? 3 : 1} tentative={!solved} length={solved ? undefined : 96}/>
      <Track y={592}/><Particle name="A" x={a} y={552}/><Particle name="B" x={b} y={552}/>
      {!solved && <Label x={480} y={650} size={24} muted>Dashed: assume right for vB</Label>}
    </g>;
  };
const AfterTogether: React.FC<{solved?: boolean; massKnown?: boolean; moving?: {a: number; b: number}}> =
  ({solved = false, massKnown = false, moving}) => {
    const a = moving?.a ?? 400, b = moving?.b ?? 480;
    return <g data-state="after-together" data-result={solved ? 'pair.after' : undefined}
      data-result-cue={solved ? 'result-value' : undefined}>
      <Label x={30} y={420} size={27} muted>{moving ? 'After trial 2 — one common velocity' : 'After trial 2 — stuck together, snapshot'}</Label>
      <Figure id="pair.after" x={(a + b) / 2 - 115} y={468}>{solved ? 'v = +1 m s⁻¹' : 'v = ?'}</Figure>
      <Arrow x={(a + b) / 2} y={500} velocity={1} tentative={!solved} length={solved ? undefined : 96}/>
      <Track y={592}/><Particle name="A" x={a} y={552}/><Particle name="B" x={b} y={552}/>
      <path d={`M${a - 40} 625 V637 H${b + 40} V625`} fill="none" stroke={T.muted} strokeWidth={2}/>
      <Figure id="pair.mass" x={(a + b) / 2 - 125} y={688}>{massKnown ? 'mA + mB = 5 kg' : 'Mass: mA + mB'}</Figure>
    </g>;
  };
const Motif: React.FC = () => <g>
  <Track y={447}/><Particle name="A" x={350} y={407}/><Particle name="B" x={550} y={407}/>
  <Arrow x={350} y={310} velocity={4}/><Arrow x={550} y={310} velocity={-1}/>
  <Label x={170} y={530} size={29}>Two particles. One straight line.</Label>
</g>;
const OutcomeCard: React.FC<{s: Scene; t: number; closing?: boolean}> = ({s, t, closing = false}) => {
  const beat = currentBeat(s, t);
  const outcomes = closing || !!beat?.id.startsWith('outcome');
  const first = !beat || beat.id === 'quote1';
  const lines = first
    ? ['use conservation of linear momentum', 'to solve problems']
    : ['that may be modelled as the direct', 'impact of two bodies.'];
  return <svg data-region="card" width={790} height={650} style={{position: 'absolute', left: 1050, top: 270}}>
    {outcomes ? OUTCOMES.map((text, i) => t >= at(s, `outcome${i + 1}`) && <g key={text}>
      <rect x={0} y={90 + i * 125} width={775} height={86} rx={9} fill="#b9bcb2"/>
      <text data-label="true" x={closing ? 70 : 30} y={144 + i * 125} fontSize={31} fill={T.ink}>{text}</text>
      {closing && <path d={`M22 ${130 + i * 125} l13 15 l20 -30`} fill="none" stroke={T.accent} strokeWidth={5}/>}
    </g>) : <g>
      <Label x={0} y={55} size={25} muted>Cambridge 9709 · page 32 · excerpt</Label>
      <rect x={0} y={100} width={780} height={210} rx={10} fill="#b9bcb2"/>
      {lines.map((line, i) => <text data-label="true" key={line} x={30} y={179 + 64 * i}
        fontSize={33} fill={T.ink}>{line}</text>)}
    </g>}
  </svg>;
};
const Opening: React.FC<{s: Scene; t: number}> = ({s, t}) => <>
  <Diagram><Motif/></Diagram><OutcomeCard s={s} t={t}/>
</>;

const Story: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  const reset = useCue(s, 'reset');
  const trial: Trial = reset ? 'together' : 'separate';
  const start = at(s, reset ? 'reset' : 'approach');
  const impact = at(s, reset ? 'impact2' : 'impact1');
  const end = reset ? s.duration : at(s, 'reset');
  const clock = (time: number) => motionClock(time, s.holds);
  // One physical scale on both sides of each impact. No clamping at the track edge.
  const scale = 3 / Math.max(clock(impact) - clock(start), clock(end) - clock(impact));
  const tau = (clock(Math.max(t, start)) - clock(impact)) * scale;
  const positions = collisionPositions(trial, tau);
  return <Diagram>
    <Label x={30} y={45} size={30}>{reset ? 'Separate trial: original approach again' : 'Trial 1: approach, impact, separation'}</Label>
    <Label x={30} y={105} size={27} muted>Smooth horizontal surface · schematic motion</Label>
    <Track y={487}/>
    <Particle name="A" x={positions.a} y={447}/><Particle name="B" x={positions.b} y={447} tentative={tau >= 0}/>
    {trial === 'together' && tau >= 0
      ? <Arrow x={(positions.a + positions.b) / 2} y={347} velocity={1} tentative length={96}/>
      : <><Arrow x={positions.a} y={347} velocity={positions.velocityA}/>
          <Arrow x={positions.b} y={347} velocity={positions.velocityB} tentative={tau >= 0}/></>}
    {tau >= 0 && <Label x={220} y={585} size={26} muted>Dashed after motion: assumed direction</Label>}
    <Caption text={currentBeat(s, t)?.caption} x={40} y={730}/>
  </Diagram>;
};
const Question: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  const beat = currentBeat(s, t);
  const line = beat?.id === 'together' ? 2 : beat?.id === 'after-a' ? 0 : -1;
  const active = beat ? at(s, beat.id) : 0;
  const words = [
    'Trial 1: A rebounds at 2 m/s left.',
    "Find B's final speed and direction.",
    'Trial 2: repeat; stick. Find common velocity.',
  ];
  return <svg data-region="problem" data-visual="question-and-sticking-diagram" width={790} height={730}
    style={{position: 'absolute', left: 1050, top: 230}}>
    <rect x={0} y={25} width={790} height={260} rx={10} fill="#b9bcb2"/>
    {words.map((text, i) => <g key={text}>
      <text data-label="true" x={25} y={90 + 74 * i} fontSize={30} fill={T.ink}>{text}</text>
      {(line === i || line === 0 && i === 1) && <path d={`M25 ${104 + 74 * i} H750`}
        stroke={T.accent} strokeWidth={3} pathLength={1} strokeDasharray={1}
        strokeDashoffset={1 - Math.max(0, Math.min(1, (t - active) / .7))}/>}
    </g>)}
    <Label x={30} y={345} size={28}>Both trials start from the same before state.</Label>
    <Label x={30} y={410} size={28} muted>After trial 2 — snapshot</Label>
    <Figure id="setup-pair.after" x={280} y={465}>Common v = ?</Figure>
    <Arrow x={390} y={500} velocity={1} tentative length={96}/>
    <path d="M140 615 H640" stroke={T.muted} strokeWidth={3}/>
    <Particle name="A" x={350} y={575}/><Particle name="B" x={430} y={575}/>
    <Label x={275} y={680} size={28}>Combined mass: mA + mB</Label>
  </svg>;
};
const Setup: React.FC<{s: Scene; t: number}> = ({s, t}) => <>
  <Diagram><Conditions/><Before/><AfterSeparate/></Diagram><Question s={s} t={t}/>
</>;

const System: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  const internal = useCue(s, 'internal');
  const signs = useCue(s, 'signs');
  return <Diagram>
    <Conditions/>
    <rect x={210} y={180} width={550} height={430} rx={26} stroke={T.muted}
      fill="none" strokeWidth={2} strokeDasharray="12 8"/>
    <Label x={300} y={230} size={30}>System boundary: A + B</Label>
    <Track y={470}/><Particle name="A" x={440} y={430}/><Particle name="B" x={520} y={430}/>
    {[{x: 440, length: 70, labelX: 322, name: 'A'}, {x: 520, length: 105, labelX: 575, name: 'B'}].map(p => <g key={p.name}>
      <path d={`M${p.x} 390 V${390 - p.length} l-7 11 m7 -11 l7 11 M${p.x} 470 V${470 + p.length} l-7 -11 m7 11 l7 -11`}
        fill="none" stroke={T.text} strokeWidth={3}/>
      <Label x={p.labelX} y={380 - p.length} size={25}>{`R${p.name}`}</Label>
      <Label x={p.labelX} y={483 + p.length} size={25}>{`W${p.name}`}</Label>
    </g>)}
    {internal && <g data-internal-forces="equal-opposite">
      <Arrow x={340} y={430} velocity={-1} length={120}/>
      <Arrow x={620} y={430} velocity={1} length={120}/>
      <Label x={224} y={397} size={24}>Force on A</Label><Label x={620} y={397} size={24}>Force on B</Label>
    </g>}
    <Label x={185} y={665} size={27} muted>{signs ? 'Signed velocities describe direction; masses stay positive.' : 'Impact snapshot: vertical forces balance for each particle.'}</Label>
    <Caption text={currentBeat(s, t)?.caption} x={130} y={750}/>
  </Diagram>;
};
const Worked: React.FC<{s: Scene; t: number; trial: Trial}> = ({s, t, trial}) => {
  const solved = useCue(s, 'result-value');
  const moving = useCue(s, 'interpret');
  // The pair's combined mass is not asserted before its derivation.
  const massKnown = trial === 'together' && t >= at(s, 'combined-mass');
  const elapsed = motionClock(t, s.holds) - motionClock(at(s, 'interpret'), s.holds);
  const replay = collisionPositions(trial, Math.max(0, elapsed), 4);
  // Continue from the displayed after snapshot, with no position jump or edge clamp.
  const positions = moving ? (trial === 'separate'
    ? {a: replay.a - 200, b: replay.b + 100}
    : {a: replay.a - 40, b: replay.b - 40}) : undefined;
  return <>
    <Diagram>
      <Conditions/><Before/>
      {trial === 'separate' ? <AfterSeparate solved={solved} moving={positions} resultCue="result-value"/>
        : <AfterTogether solved={solved} massKnown={massKnown} moving={positions}/>}
      <Caption text={trial === 'separate' ? 'Use both signed after velocities' : 'Fresh trial: original incoming velocities'} x={40} y={770}/>
    </Diagram>
    <Paper s={s} t={t} problem={trial === 'separate'
      ? ["Find B's final velocity.", 'Use the signed values on the diagram.', 'Both particles form the system.']
      : ['Fresh trial: same initial conditions.', 'They stick. Find their common velocity.', 'Use both masses after impact.']}/>
  </>;
};
const Closing: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  const question = useCue(s, 'question');
  const outcomes = useCue(s, 'outcome1');
  return <>
    <Diagram>
      <Conditions externalPush={!question}/><Before/><AfterSeparate solved={question}/>
      {!question && <g data-external-push="true">
        <Arrow x={105} y={552} velocity={1} length={100}/>
        <Label x={35} y={688} size={26}>External push during impact</Label>
      </g>}
      {!outcomes && <Caption text={currentBeat(s, t)?.caption} x={30} y={770}/>}
    </Diagram>
    {outcomes && <OutcomeCard s={s} t={t} closing/>}
  </>;
};
const Content: React.FC<{s: Scene; t: number}> = ({s, t}) => {
  if (s.mode === 'opening') return <Opening s={s} t={t}/>;
  if (s.mode === 'story') return <Story s={s} t={t}/>;
  if (s.mode === 'setup') return <Setup s={s} t={t}/>;
  if (s.mode === 'system') return <System s={s} t={t}/>;
  if (s.mode === 'separate' || s.mode === 'together') return <Worked s={s} t={t} trial={s.mode}/>;
  return <Closing s={s} t={t}/>;
};
export const MechanicsDirectCollisions: React.FC<MechanicsDirectCollisionsProps> = props =>
  <Lesson scenes={SCENES} content={Content} {...props}/>;
