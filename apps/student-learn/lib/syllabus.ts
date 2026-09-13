/**
 * Cambridge International AS & A Level Mathematics 9709 — the app's syllabus map.
 * Topic codes follow the syllabus numbering (Paper 1 = Pure 1, Paper 4 = Mechanics).
 * A topic is `live` when it links somewhere real: a lesson (/lesson/<code>) or a notes page.
 */

export type TopicKind = 'lesson' | 'notes';

export interface SyllabusTopic {
  code: string;
  title: string;
  live: boolean;
  kind?: TopicKind;
  href?: string;
  /** Short lead-in for the map row, optional. */
  hint?: string;
}

export interface SyllabusUnit {
  code: string;
  title: string;
  paper: string;
  topics: SyllabusTopic[];
}

export const COURSE = {
  code: '9709',
  title: 'Cambridge International A Level Mathematics 9709',
};

export const UNITS: SyllabusUnit[] = [
  {
    code: 'M',
    title: 'Mechanics',
    paper: 'Paper 4',
    topics: [
      { code: 'M0.1', title: 'S.I. units for mechanics', live: true, kind: 'notes', href: '/notes/mechanics-si-units', hint: 'foundation' },
      { code: 'M0.2', title: 'Scalars and vectors', live: true, kind: 'notes', href: '/notes/mechanics-scalars-vectors', hint: 'foundation' },
      { code: 'M0.3', title: 'Derived units', live: true, kind: 'notes', href: '/notes/mechanics-derived-units', hint: 'foundation' },
      { code: 'M0.4', title: 'Modelling assumptions', live: true, kind: 'notes', href: '/notes/mechanics-modelling-assumptions', hint: 'foundation' },
      { code: 'M4.1', title: 'Forces and equilibrium', live: true, kind: 'notes', href: '/notes/mechanics-types-of-forces', hint: 'types of force' },
      { code: 'M4.2a', title: 'Displacement-time graphs', live: true, kind: 'notes', href: '/notes/mechanics-displacement-time-graphs', hint: 'kinematics' },
      { code: 'M4.2b', title: 'Velocity-time graphs', live: true, kind: 'notes', href: '/notes/mechanics-velocity-time-graphs', hint: 'kinematics' },
      { code: 'M4.2c', title: 'Drawing travel graphs', live: true, kind: 'notes', href: '/notes/mechanics-drawing-travel-graphs', hint: 'kinematics' },
      { code: 'M4.2d', title: 'Deriving the suvat formulae', live: true, kind: 'notes', href: '/notes/mechanics-deriving-suvat', hint: 'kinematics' },
      { code: 'M4.2e', title: 'Using calculus in 1D', live: true, kind: 'notes', href: '/notes/mechanics-using-calculus-in-1d', hint: 'kinematics' },
      { code: 'M4.1b', title: 'Equilibrium in 1D', live: true, kind: 'notes', href: '/notes/mechanics-equilibrium-in-1d', hint: 'forces' },
      { code: 'M4.2f', title: 'Acceleration due to gravity', live: true, kind: 'notes', href: '/notes/mechanics-acceleration-due-to-gravity', hint: 'kinematics' },
      { code: 'M4.2g', title: 'suvat in 1D', live: true, kind: 'notes', href: '/notes/mechanics-suvat-in-1d', hint: 'kinematics' },
      { code: 'M4.1a', title: 'Force diagrams', live: true, kind: 'notes', href: '/notes/mechanics-force-diagrams', hint: 'forces' },
      { code: 'M4.3a', title: 'Momentum', live: true, kind: 'notes', href: '/notes/mechanics-momentum', hint: 'momentum' },
      { code: 'M4.3b', title: 'Direct collisions', live: true, kind: 'notes', href: '/notes/mechanics-direct-collisions', hint: 'momentum' },
      { code: 'M4.3c', title: 'Multiple collisions', live: true, kind: 'notes', href: '/notes/mechanics-multiple-collisions', hint: 'momentum' },
      { code: 'M4.1c', title: 'Equilibrium in 2D', live: true, kind: 'notes', href: '/notes/mechanics-equilibrium-in-2d', hint: 'forces and equilibrium' },
      { code: 'M4.4a', title: 'F = ma', live: true, kind: 'notes', href: '/notes/mechanics-f-equals-ma', hint: 'newton’s laws' },
      { code: 'M4.4b', title: 'Connected Bodies (Ropes & Tow Bars)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-ropes-and-tow-bars', hint: 'newton\'s laws' },
      { code: 'M4.4c', title: 'Connected Bodies (Lifts)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-lifts', hint: 'newton\'s laws' },
      { code: 'M4.4d', title: 'Connected Bodies (Pulleys)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-pulleys', hint: 'newton\'s laws' },
      { code: 'M4.1d', title: 'Resolving Forces & Inclined Planes', live: true, kind: 'notes', href: '/notes/mechanics-resolving-forces-and-inclined-planes', hint: 'forces and equilibrium' },
      { code: 'M4.1e', title: 'Coefficient of Friction', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction', hint: 'forces and equilibrium' },
      { code: 'M4.4e', title: 'Coefficient of Friction - F = ma', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-f-equals-ma', hint: 'newton\'s laws' },
      { code: 'M4.4d-fable', title: 'Connected Bodies (Pulleys) (Fable)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-pulleys-fable', hint: 'newton\'s laws' },
      { code: 'M4.1d-fable', title: 'Resolving Forces & Inclined Planes (Fable)', live: true, kind: 'notes', href: '/notes/mechanics-resolving-forces-and-inclined-planes-fable', hint: 'forces and equilibrium' },
      { code: 'M4.1e-fable', title: 'Coefficient of Friction (Fable)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-fable', hint: 'forces and equilibrium' },
      { code: 'M4.4e-fable', title: 'Coefficient of Friction - F = ma (Fable)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-f-equals-ma-fable', hint: 'newton\'s laws' },
      { code: 'M4.1f', title: 'Coefficient of Friction & Inclined Planes', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-and-inclined-planes', hint: 'forces and equilibrium' },
      { code: 'M4.1g', title: 'Coefficient of Friction (Harder Problems)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-harder-problems', hint: 'forces and equilibrium' },
      { code: 'M4.5a', title: 'Work', live: true, kind: 'notes', href: '/notes/mechanics-work', hint: 'energy, work and power' },
      { code: 'M4.5b', title: 'Energy', live: true, kind: 'notes', href: '/notes/mechanics-energy', hint: 'energy, work and power' },
      { code: 'M4.5c', title: 'Energy Principles', live: true, kind: 'notes', href: '/notes/mechanics-energy-principles', hint: 'energy, work and power' },
      { code: 'M4.5d', title: 'Power', live: true, kind: 'notes', href: '/notes/mechanics-power', hint: 'energy, work and power' },
      { code: 'M4.1f-fable', title: 'Coefficient of Friction & Inclined Planes (Fable)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-and-inclined-planes-fable', hint: 'forces and equilibrium' },
      { code: 'M4.1g-fable', title: 'Coefficient of Friction (Harder Problems) (Fable)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-harder-problems-fable', hint: 'forces and equilibrium' },
    ],
  },
  {
    code: 'P1',
    title: 'Pure Mathematics 1',
    paper: 'Paper 1',
    topics: [
      { code: 'P1.1', title: 'Quadratics', live: false },
      { code: 'P1.2', title: 'Functions', live: false },
      { code: 'P1.3', title: 'Coordinate geometry', live: false },
      { code: 'P1.4', title: 'Circular measure', live: false },
      { code: 'P1.5', title: 'Trigonometry', live: false },
      { code: 'P1.6', title: 'Series', live: false },
      { code: 'P1.7', title: 'Differentiation', live: true, kind: 'notes', href: '/ink', hint: 'worked by hand' },
      { code: 'P1.8', title: 'Integration', live: false },
    ],
  },
];

export const FUTURE_UNITS = [
  { code: 'P3', title: 'Pure Mathematics 3', paper: 'Paper 3' },
  { code: 'S1', title: 'Probability & Statistics 1', paper: 'Paper 5' },
];

export const liveTopics = () => UNITS.flatMap((u) => u.topics.filter((t) => t.live));
