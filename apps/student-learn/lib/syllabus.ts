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
      { code: 'M4.1', title: 'Forces and equilibrium', live: false },
      { code: 'M4.2', title: 'Kinematics of motion in a straight line', live: false },
      { code: 'M4.3', title: 'Momentum', live: false },
      { code: 'M4.4', title: "Newton's laws of motion", live: false },
      { code: 'M4.5', title: 'Energy, work and power', live: false },
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
      { code: 'P1.7', title: 'Differentiation', live: false },
      { code: 'P1.8', title: 'Integration', live: false },
    ],
  },
];

export const FUTURE_UNITS = [
  { code: 'P3', title: 'Pure Mathematics 3', paper: 'Paper 3' },
  { code: 'S1', title: 'Probability & Statistics 1', paper: 'Paper 5' },
];

export const liveTopics = () => UNITS.flatMap((u) => u.topics.filter((t) => t.live));
