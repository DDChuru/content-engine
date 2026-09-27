/**
 * Cambridge International AS & A Level Mathematics 9709, Biology 9700 and Chemistry 9701 — the app's syllabus map.
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
  /**
   * The key of this topic's row in `public/notes/index.json`.
   *
   * Historically the slug was derived from an `href` of the form `/notes/<slug>`, because every
   * topic had notes. A Biology topic has a recorded video and no notes page yet, so it carries a
   * slug and NO href — writing `/notes/…` for it would put a lie in the data about a page that
   * does not exist. Where both are absent the topic keeps its own `href`.
   */
  slug?: string;
  /** Short lead-in for the map row, optional. */
  hint?: string;
  /**
   * This topic is an ALTERNATE RECORDING of the topic with this code, not a
   * syllabus point of its own.
   *
   * Six `-fable` pages are a deliberate model-comparison track (Fable vs Astra):
   * the same six syllabus points, taught again by a different builder, kept so the
   * two can be watched side by side. They were sitting in the student-facing list
   * next to their originals, which did two bad things — it showed a student two
   * near-identical rows with no way to tell which to read, and it made the library
   * look six topics bigger than it is.
   *
   * A variant is therefore excluded from the syllabus map, from every topic COUNT
   * and from any coverage computation, while staying fully reachable by its own
   * URL. Nothing is deleted: the recordings exist and the comparison is the point
   * of them.
   */
  variantOf?: string;
}

export interface SyllabusUnit {
  code: string;
  title: string;
  paper: string;
  topics: SyllabusTopic[];
}

export interface Course {
  code: string;
  title: string;
  /** The course's one-line promise; it must stay true of what is actually published. */
  blurb?: string;
  /** SyllabusUnit codes taught under this course, in display order. */
  unitCodes: string[];
}

export const COURSES: Course[] = [
  {
    code: '9709',
    title: 'Cambridge International A Level Mathematics 9709',
    blurb: 'A short explainer, tight notes, and the working done by hand, the way the exam asks it.',
    unitCodes: ['M', 'P1'],
  },
  {
    code: '9700',
    title: 'Cambridge International A Level Biology 9700',
    blurb: 'A video lesson for every syllabus point, written from the syllabus and checked against the mark schemes.',
    unitCodes: ['B1', 'B2', 'B3'],
  },
  {
    code: '9701',
    title: 'Cambridge International A Level Chemistry 9701',
    blurb: 'Video lessons written from the syllabus and checked against the mark schemes.',
    unitCodes: ['C13'],
  },
];

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
      { code: 'M4.4b', title: 'Connected bodies (ropes & tow bars)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-ropes-and-tow-bars', hint: 'newton\'s laws' },
      { code: 'M4.4c', title: 'Connected bodies (lifts)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-lifts', hint: 'newton\'s laws' },
      { code: 'M4.4d', title: 'Connected bodies (pulleys)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-pulleys', hint: 'newton\'s laws' },
      { code: 'M4.1d', title: 'Resolving forces & inclined planes', live: true, kind: 'notes', href: '/notes/mechanics-resolving-forces-and-inclined-planes', hint: 'forces and equilibrium' },
      { code: 'M4.1e', title: 'Coefficient of friction', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction', hint: 'forces and equilibrium' },
      { code: 'M4.4e', title: 'Coefficient of friction — F = ma', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-f-equals-ma', hint: 'newton\'s laws' },
      { code: 'M4.4d-fable', title: 'Connected Bodies (Pulleys)', live: true, kind: 'notes', href: '/notes/mechanics-connected-bodies-pulleys-fable', hint: 'newton\'s laws', variantOf: 'M4.4d' },
      { code: 'M4.1d-fable', title: 'Resolving Forces & Inclined Planes', live: true, kind: 'notes', href: '/notes/mechanics-resolving-forces-and-inclined-planes-fable', hint: 'forces and equilibrium', variantOf: 'M4.1d' },
      { code: 'M4.1e-fable', title: 'Coefficient of Friction', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-fable', hint: 'forces and equilibrium', variantOf: 'M4.1e' },
      { code: 'M4.4e-fable', title: 'Coefficient of Friction — F = ma', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-f-equals-ma-fable', hint: 'newton\'s laws', variantOf: 'M4.4e' },
      { code: 'M4.1f', title: 'Coefficient of friction & inclined planes', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-and-inclined-planes', hint: 'forces and equilibrium' },
      { code: 'M4.1g', title: 'Coefficient of friction (harder problems)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-harder-problems', hint: 'forces and equilibrium' },
      { code: 'M4.5a', title: 'Work', live: true, kind: 'notes', href: '/notes/mechanics-work', hint: 'energy, work and power' },
      { code: 'M4.5b', title: 'Energy', live: true, kind: 'notes', href: '/notes/mechanics-energy', hint: 'energy, work and power' },
      { code: 'M4.5c', title: 'Energy principles', live: true, kind: 'notes', href: '/notes/mechanics-energy-principles', hint: 'energy, work and power' },
      { code: 'M4.5d', title: 'Power', live: true, kind: 'notes', href: '/notes/mechanics-power', hint: 'energy, work and power' },
      { code: 'M4.1f-fable', title: 'Coefficient of Friction & Inclined Planes', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-and-inclined-planes-fable', hint: 'forces and equilibrium', variantOf: 'M4.1f' },
      { code: 'M4.1g-fable', title: 'Coefficient of Friction (Harder Problems)', live: true, kind: 'notes', href: '/notes/mechanics-coefficient-of-friction-harder-problems-fable', hint: 'forces and equilibrium', variantOf: 'M4.1g' },
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
  {
    code: 'B1',
    title: 'Cell structure',
    paper: 'AS Level · Topic 1',
    topics: [
      { code: 'B1.1.1', title: 'Making temporary preparations', live: true, slug: 'biology-making-temporary-preparations', hint: 'microscopy' },
      { code: 'B1.1.2', title: 'Drawing cells', live: true, slug: 'biology-drawing-cells', hint: 'microscopy' },
      { code: 'B1.1.3', title: 'Magnification and actual size', live: true, slug: 'biology-magnification-and-actual-size', hint: 'microscopy' },
      { code: 'B1.1.4', title: 'Measuring with the eyepiece graticule', live: true, slug: 'biology-measuring-with-the-eyepiece-graticule', hint: 'microscopy' },
      { code: 'B1.1.5', title: 'Resolution and magnification', live: true, slug: 'biology-resolution-and-magnification', hint: 'microscopy' },
      { code: 'B1.2.1', title: 'Cell structures and their functions', live: true, slug: 'biology-cell-structures-and-their-functions', hint: 'cells' },
      { code: 'B1.2.2', title: 'Interpreting cell images', live: true, slug: 'biology-interpreting-cell-images', hint: 'cells' },
      { code: 'B1.2.3', title: 'Plant and animal cells compared', live: true, slug: 'biology-plant-and-animal-cells-compared', hint: 'cells' },
      { code: 'B1.2.4', title: 'ATP for cellular work', live: true, slug: 'biology-atp-for-cellular-work', hint: 'cells' },
      { code: 'B1.2.5', title: 'A typical bacterium', live: true, slug: 'biology-a-typical-bacterium', hint: 'cells' },
      { code: 'B1.2.6', title: 'Prokaryotes and eukaryotes compared', live: true, slug: 'biology-prokaryotes-and-eukaryotes-compared', hint: 'cells' },
      { code: 'B1.2.7', title: 'Viruses', live: true, slug: 'biology-viruses', hint: 'cells' },
    ],
  },
  {
    code: 'B2',
    title: 'Biological molecules',
    paper: 'AS Level · Topic 2',
    topics: [
      { code: 'B2.1.1', title: 'Food tests', live: true, slug: 'biology-food-tests', hint: 'food tests' },
      { code: 'B2.1.2', title: 'The semi-quantitative Benedict test', live: true, slug: 'biology-the-semi-quantitative-benedict-test', hint: 'food tests' },
      { code: 'B2.1.3', title: 'The non-reducing sugar test', live: true, slug: 'biology-the-non-reducing-sugar-test', hint: 'food tests' },
      { code: 'B2.2.1', title: 'Alpha and beta glucose', live: true, slug: 'biology-alpha-and-beta-glucose', hint: 'carbohydrates' },
      { code: 'B2.2.2', title: 'Monomers, polymers and sugars', live: true, slug: 'biology-monomers-polymers-and-sugars', hint: 'carbohydrates' },
      { code: 'B2.2.3', title: 'Covalent bonds in polymers', live: true, slug: 'biology-covalent-bonds-in-polymers', hint: 'carbohydrates' },
      { code: 'B2.2.4', title: 'Reducing and non-reducing sugars', live: true, slug: 'biology-reducing-and-non-reducing-sugars', hint: 'carbohydrates' },
      { code: 'B2.2.5', title: 'The glycosidic bond', live: true, slug: 'biology-the-glycosidic-bond', hint: 'carbohydrates' },
      { code: 'B2.2.6', title: 'Hydrolysis and non-reducing sugars', live: true, slug: 'biology-hydrolysis-and-non-reducing-sugars', hint: 'carbohydrates' },
      { code: 'B2.2.7', title: 'Starch and glycogen', live: true, slug: 'biology-starch-and-glycogen', hint: 'carbohydrates' },
      { code: 'B2.2.8', title: 'Cellulose', live: true, slug: 'biology-cellulose', hint: 'carbohydrates' },
      { code: 'B2.2.9', title: 'Triglycerides and the ester bond', live: true, slug: 'biology-triglycerides-and-the-ester-bond', hint: 'lipids' },
      { code: 'B2.2.10', title: 'Triglycerides: structure to function', live: true, slug: 'biology-triglycerides-structure-to-function', hint: 'lipids' },
      { code: 'B2.2.11', title: 'Phospholipids: head and tails', live: true, slug: 'biology-phospholipids-head-and-tails', hint: 'lipids' },
      { code: 'B2.3.1', title: 'Amino acids and the peptide bond', live: true, slug: 'biology-amino-acids-and-the-peptide-bond', hint: 'proteins' },
      { code: 'B2.3.2', title: 'From sequence to protein structure', live: true, slug: 'biology-from-sequence-to-protein-structure', hint: 'proteins' },
      { code: 'B2.3.3', title: 'What holds a protein in shape', live: true, slug: 'biology-what-holds-a-protein-in-shape', hint: 'proteins' },
      { code: 'B2.3.4', title: 'Globular and fibrous proteins', live: true, slug: 'biology-globular-and-fibrous-proteins', hint: 'proteins' },
      { code: 'B2.3.5-6', title: 'Haemoglobin', live: true, slug: 'biology-haemoglobin', hint: 'proteins' },
      { code: 'B2.3.7-8', title: 'Collagen', live: true, slug: 'biology-collagen', hint: 'proteins' },
      { code: 'B2.4.1', title: 'Water', live: true, slug: 'biology-water', hint: 'water' },
    ],
  },
  {
    code: 'B3',
    title: 'Enzymes',
    paper: 'AS Level · Topic 3',
    topics: [
      { code: 'B3.1.1-2', title: 'Enzymes: where and how they act', live: true, slug: 'biology-enzymes-where-and-how-they-act', hint: 'enzymes' },
      { code: 'B3.1.4', title: 'Following a colour change: the colorimeter', live: true, slug: 'biology-following-a-colour-change-the-colorimeter', hint: 'enzymes' },
      { code: 'B3.2.2-3', title: 'Vmax, Km and inhibitors on the graph', live: true, slug: 'biology-vmax-km-and-inhibitors-on-the-graph', hint: 'enzymes' },
    ],
  },
  {
    code: 'C13',
    title: 'Organic chemistry: stereoisomerism',
    paper: 'AS Level · Topic 13',
    topics: [
      { code: 'C13.4.2-3', title: 'Geometrical (cis/trans) isomerism: why a C=C locks the shape', live: true, slug: 'chemistry-geometrical-cis-trans-isomerism-why-a-c-c-locks-the-shape', hint: 'stereoisomerism' },
      { code: 'C13.4.4-5', title: 'Optical isomerism: chiral centres, mirror images and spotting stereoisomers', live: true, slug: 'chemistry-optical-isomerism-chiral-centres-mirror-images-and-spotting-stereoisomers', hint: 'stereoisomerism' },
    ],
  },
];

export const FUTURE_UNITS = [
  { code: 'P3', title: 'Pure Mathematics 3', paper: 'Paper 3', course: '9709' },
  { code: 'S1', title: 'Probability & Statistics 1', paper: 'Paper 5', course: '9709' },
];

/**
 * A topic a student is meant to be offered: live, and not an alternate recording
 * of something already in the list. Every count, map and "what next" reads this.
 */
export const isStudentFacing = (t: SyllabusTopic) => t.live && !t.variantOf;

export const liveTopics = () => UNITS.flatMap((u) => u.topics.filter(isStudentFacing));

/** Alternate recordings, excluded from the map but still served at their own URL. */
export const variantTopics = () =>
  UNITS.flatMap((u) => u.topics.filter((t) => t.live && Boolean(t.variantOf)));
