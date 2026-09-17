/**
 * The qualifications catalogue — exam body → level → session → subjects.
 *
 * Data, in the same spirit as `lib/syllabus.ts`: the course is not code, and
 * neither is the list of courses. Adding ZIMSEC A Level Chemistry is an edit to
 * an array in this file and nothing else.
 *
 * TWO THINGS THIS FILE IS CAREFUL ABOUT
 *
 * 1. **Availability is derived, not declared.** `availability` on a subject is
 *    computed at the bottom of this file against `lib/syllabus.ts` — the same
 *    array the study pages render from. There is exactly one subject in the whole
 *    catalogue that resolves to `available`: Cambridge A Level Mathematics 9709,
 *    and only its Mechanics unit. If the syllabus map goes empty, so does this,
 *    automatically. Nothing here can claim content that is not there.
 *
 * 2. **Registering for a subject we do not have is allowed and is the point.**
 *    A student who picks ZIMSEC A Level Physics is telling us what to build next
 *    (PLAN §8, one step earlier in the funnel — before any mark exists). Those
 *    picks are written to `subjectDemand`. What must never happen is the UI
 *    implying the material is there; every subject carries its state and the
 *    picker shows it on the row, not in a footnote.
 *
 * Server-side use: `convex/identity.ts` imports `resolveEnrolment` and rebuilds
 * every title, code and availability flag from this file. The client sends ids.
 */

import { UNITS } from './syllabus';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SubjectAvailability =
  /** Real lessons or notes a student can open today. */
  | 'available'
  /** Being written now — some material exists but the unit is incomplete. */
  | 'in_progress'
  /** Nothing yet. Choosing it is a request, and we say so. */
  | 'planned';

export interface ExamSubject {
  /** Unique within body+level. Stored on the enrolment. */
  id: string;
  /** Syllabus code where the body publishes one. ZIMSEC and the NSC do not. */
  code?: string;
  title: string;
  availability: SubjectAvailability;
  /** One plain sentence under the row when it is not simply available. */
  note?: string;
}

export interface ExamLevel {
  id: string;
  title: string;
  /** Who it is for, in the student's own terms. Shown under the option. */
  hint?: string;
  /**
   * Overrides the body's series where a level does not sit them all. Pearson
   * retired the January series for International GCSE after 2023 while keeping
   * it for the IAL, so series cannot live on the body alone.
   */
  series?: ExamSeries[];
  subjects: ExamSubject[];
}

export interface ExamSeries {
  id: string;
  title: string;
  /**
   * The month the written papers fall in (1-12). Used only to decide which
   * upcoming sessions to offer — a session whose papers have been sat is not a
   * session you can register for.
   */
  examMonth: number;
  note?: string;
}

export interface ExamBody {
  id: string;
  /** Full legal-ish name, for the option row. */
  title: string;
  /** What students actually call it. */
  shortTitle: string;
  /** One line under the option: who sits this. */
  hint: string;
  series: ExamSeries[];
  levels: ExamLevel[];
}

export interface ExamSession {
  /** `${year}-${seriesId}`, e.g. "2027-oct-nov". Stored on the enrolment. */
  id: string;
  year: number;
  seriesId: string;
  /** "October/November 2027" */
  title: string;
  note?: string;
}

// ---------------------------------------------------------------------------
// Series
// ---------------------------------------------------------------------------
// Series hang off the body, and off a level where the level differs (Edexcel).
// Getting the names right matters: Cambridge's own word is "June series", the
// DBE's is "October/November", and a catalogue that offers a bare year makes
// every one of those students guess which we meant.

const CAMBRIDGE_SERIES: ExamSeries[] = [
  // Cambridge's own current naming is "June series" / "November series" — the
  // "May/June" and "October/November" long forms are a past-paper filename
  // convention, not what the syllabus or the timetable calls them.
  //
  // There is also a March series, administered only in India (and Romania). It
  // is deliberately absent: nobody in our countries can enter it, and an option
  // nobody can pick is a line every student has to read past.
  { id: 'june', title: 'June', examMonth: 6 },
  { id: 'november', title: 'November', examMonth: 11 },
];

const ZIMSEC_SERIES: ExamSeries[] = [
  { id: 'june', title: 'June', examMonth: 6 },
  { id: 'november', title: 'November', examMonth: 11 },
];

/** Pearson IAL: January, Summer (May/June) and October. */
const EDEXCEL_IAL_SERIES: ExamSeries[] = [
  { id: 'january', title: 'January', examMonth: 1 },
  { id: 'may-june', title: 'May/June', examMonth: 6 },
  { id: 'october', title: 'October', examMonth: 10 },
];

/** International GCSE: the January 2023 series was the last one. */
const EDEXCEL_IGCSE_SERIES: ExamSeries[] = [
  { id: 'may-june', title: 'May/June', examMonth: 6 },
  { id: 'november', title: 'November', examMonth: 11 },
];

const NSC_SERIES: ExamSeries[] = [
  {
    id: 'oct-nov',
    title: 'October/November',
    examMonth: 11,
    note: 'the main matric sitting',
  },
  {
    id: 'may-june',
    title: 'May/June',
    examMonth: 5,
    // NOT "supplementary" — the February/March supplementary is gone, and the
    // DBE timetable for this sitting is headed "SC/NSC", not "supplementary".
    note: 'the mid-year SC/NSC sitting — rewrites and part-time candidates',
  },
];

// ---------------------------------------------------------------------------
// Subjects
// ---------------------------------------------------------------------------
// Everything below is authored as `planned`; `resolveAvailability` at the foot
// of this file promotes the ones that have real content. Do NOT hand-write
// 'available' here — that is exactly the lie this file is arranged to prevent.
//
// Codes are the boards' own published codes and nothing else. Where a board does
// not publish one (ZIMSEC Grade 7, every NSC subject) the row simply has none.
// A plausible-looking invented code is worse than a missing one: a student who
// checks it against their entry slip and finds it wrong stops believing the page.

const planned = (
  id: string,
  title: string,
  code?: string
): ExamSubject => ({ id, title, code, availability: 'planned' });

/** Cambridge International AS & A Level. AS and A Level share one syllabus code. */
const CAMBRIDGE_A_LEVEL: ExamSubject[] = [
  planned('cie-al-9709', 'Mathematics', '9709'),
  planned('cie-al-9231', 'Mathematics – Further', '9231'),
  planned('cie-al-9702', 'Physics', '9702'),
  planned('cie-al-9701', 'Chemistry', '9701'),
  planned('cie-al-9700', 'Biology', '9700'),
  planned('cie-al-9708', 'Economics', '9708'),
  planned('cie-al-9706', 'Accounting', '9706'),
  planned('cie-al-9609', 'Business', '9609'),
  planned('cie-al-9618', 'Computer Science', '9618'),
  planned('cie-al-9626', 'Information Technology', '9626'),
  planned('cie-al-9093', 'English Language', '9093'),
  planned('cie-al-9695', 'English – Literature', '9695'),
  planned('cie-al-8021', 'English General Paper (AS only)', '8021'),
];

/** Cambridge IGCSE. Note there is no subject called "English Language" here. */
const CAMBRIDGE_IGCSE: ExamSubject[] = [
  planned('cie-igcse-0580', 'Mathematics', '0580'),
  planned('cie-igcse-0606', 'Mathematics – Additional', '0606'),
  planned('cie-igcse-0607', 'Mathematics – International', '0607'),
  planned('cie-igcse-0625', 'Physics', '0625'),
  planned('cie-igcse-0620', 'Chemistry', '0620'),
  planned('cie-igcse-0610', 'Biology', '0610'),
  planned('cie-igcse-0654', 'Sciences – Co-ordinated (Double Award)', '0654'),
  planned('cie-igcse-0653', 'Science – Combined', '0653'),
  planned('cie-igcse-0455', 'Economics', '0455'),
  planned('cie-igcse-0452', 'Accounting', '0452'),
  planned('cie-igcse-0450', 'Business Studies', '0450'),
  planned('cie-igcse-0478', 'Computer Science', '0478'),
  planned('cie-igcse-0500', 'English – First Language', '0500'),
  planned('cie-igcse-0510', 'English as a Second Language', '0510'),
];

/**
 * Cambridge O Level — still examined, and still available in Zimbabwe
 * (administrative zone 3). Cambridge begins moving zones 3 and 5 onto IGCSE from
 * June 2028, so this level has a known end date and the list will need revisiting.
 * Further Mathematics is not offered at O Level.
 */
const CAMBRIDGE_O_LEVEL: ExamSubject[] = [
  planned('cie-ol-4024', 'Mathematics (Syllabus D)', '4024'),
  planned('cie-ol-4037', 'Mathematics – Additional', '4037'),
  planned('cie-ol-4040', 'Statistics', '4040'),
  planned('cie-ol-5054', 'Physics', '5054'),
  planned('cie-ol-5070', 'Chemistry', '5070'),
  planned('cie-ol-5090', 'Biology', '5090'),
  planned('cie-ol-5129', 'Science – Combined', '5129'),
  planned('cie-ol-5014', 'Environmental Management', '5014'),
  planned('cie-ol-2281', 'Economics', '2281'),
  planned('cie-ol-7707', 'Accounting', '7707'),
  planned('cie-ol-7081', 'Business', '7081'),
  planned('cie-ol-7115', 'Business Studies', '7115'),
  planned('cie-ol-2210', 'Computer Science', '2210'),
  planned('cie-ol-1123', 'English Language', '1123'),
  planned('cie-ol-2010', 'Literature in English', '2010'),
];

/**
 * ZIMSEC. Codes are ZIMSEC's own `NNNN` subject numbers from the published
 * timetables — O Level 4xxx, A Level 6xxx. They are NOT the Cambridge codes;
 * ZIMSEC Mathematics is 4004, not 4024 (which at ZIMSEC is Chemistry).
 *
 * Two traps encoded below rather than smoothed over:
 *  - ZIMSEC A Level has no subject called "Mathematics". It is sat as Pure
 *    Mathematics, Mechanical Mathematics, Statistics or Additional Mathematics.
 *  - O Level says "Principles of Accounting"; A Level says "Accounting".
 */
const ZIMSEC_A_LEVEL: ExamSubject[] = [
  planned('zimsec-al-6042', 'Pure Mathematics', '6042'),
  planned('zimsec-al-6021', 'Mechanical Mathematics', '6021'),
  planned('zimsec-al-6046', 'Statistics', '6046'),
  planned('zimsec-al-6002', 'Additional Mathematics', '6002'),
  planned('zimsec-al-6032', 'Physics', '6032'),
  planned('zimsec-al-6031', 'Chemistry', '6031'),
  planned('zimsec-al-6030', 'Biology', '6030'),
  planned('zimsec-al-6073', 'Economics', '6073'),
  planned('zimsec-al-6001', 'Accounting', '6001'),
  planned('zimsec-al-6023', 'Computer Science', '6023'),
  planned('zimsec-al-6037', 'Geography', '6037'),
  planned('zimsec-al-6006', 'History', '6006'),
  planned('zimsec-al-6039', 'Literature in English', '6039'),
  planned('zimsec-al-6043', 'Sociology', '6043'),
];

const ZIMSEC_O_LEVEL: ExamSubject[] = [
  planned('zimsec-ol-4004', 'Mathematics', '4004'),
  planned('zimsec-ol-4026', 'Additional Mathematics', '4026'),
  planned('zimsec-ol-4027', 'Pure Mathematics', '4027'),
  planned('zimsec-ol-4003', 'Combined Science', '4003'),
  planned('zimsec-ol-4023', 'Physics', '4023'),
  planned('zimsec-ol-4024', 'Chemistry', '4024'),
  planned('zimsec-ol-4025', 'Biology', '4025'),
  planned('zimsec-ol-4005', 'English Language', '4005'),
  planned('zimsec-ol-4029', 'Literature in English', '4029'),
  planned('zimsec-ol-4051', 'Principles of Accounting', '4051'),
  planned('zimsec-ol-4049', 'Commerce', '4049'),
  planned('zimsec-ol-4050', 'Economics', '4050'),
  planned('zimsec-ol-4021', 'Computer Science', '4021'),
  planned('zimsec-ol-4073', 'Statistics', '4073'),
  planned('zimsec-ol-4022', 'Geography', '4022'),
  planned('zimsec-ol-4044', 'History', '4044'),
];

/**
 * Pearson Edexcel International Advanced Level. The code shown is the IAL
 * *cash-in* (`Y…`), which is what a certificate is issued against — unit codes
 * (`W…`) are an entry-level detail a student does not need at registration.
 * Sciences and Economics use the `11` suffix; Mathematics and English use `01`.
 */
const EDEXCEL_IAL: ExamSubject[] = [
  planned('edexcel-ial-YMA01', 'Mathematics', 'YMA01'),
  planned('edexcel-ial-YFM01', 'Further Mathematics', 'YFM01'),
  planned('edexcel-ial-YPM01', 'Pure Mathematics', 'YPM01'),
  planned('edexcel-ial-YPH11', 'Physics', 'YPH11'),
  planned('edexcel-ial-YCH11', 'Chemistry', 'YCH11'),
  planned('edexcel-ial-YBI11', 'Biology', 'YBI11'),
  planned('edexcel-ial-YEC11', 'Economics', 'YEC11'),
  planned('edexcel-ial-YEN01', 'English Language', 'YEN01'),
];

/** Pearson Edexcel International GCSE (9-1). */
const EDEXCEL_IGCSE: ExamSubject[] = [
  planned('edexcel-igcse-4MA1', 'Mathematics (Specification A)', '4MA1'),
  planned('edexcel-igcse-4MB1', 'Mathematics (Specification B)', '4MB1'),
  planned('edexcel-igcse-4PH1', 'Physics', '4PH1'),
  planned('edexcel-igcse-4CH1', 'Chemistry', '4CH1'),
  planned('edexcel-igcse-4BI1', 'Biology', '4BI1'),
  planned('edexcel-igcse-4EC1', 'Economics', '4EC1'),
  planned('edexcel-igcse-4EA1', 'English Language (Specification A)', '4EA1'),
  planned('edexcel-igcse-4EB1', 'English Language (Specification B)', '4EB1'),
];

/**
 * South African National Senior Certificate. One qualification, three assessment
 * bodies (DBE, IEB, SACAI), all certificated by Umalusi — so the subject list is
 * shared and the body is a level, not a separate catalogue.
 *
 * No codes: the DBE's public timetable identifies subjects by name and paper
 * number only, and there is no published national subject-code list.
 */
const NSC_SUBJECTS: ExamSubject[] = [
  planned('nsc-mathematics', 'Mathematics'),
  planned('nsc-mathematical-literacy', 'Mathematical Literacy'),
  planned('nsc-technical-mathematics', 'Technical Mathematics'),
  planned('nsc-physical-sciences', 'Physical Sciences'),
  planned('nsc-technical-sciences', 'Technical Sciences'),
  planned('nsc-life-sciences', 'Life Sciences'),
  planned('nsc-accounting', 'Accounting'),
  planned('nsc-economics', 'Economics'),
  planned('nsc-business-studies', 'Business Studies'),
  planned('nsc-geography', 'Geography'),
  planned('nsc-history', 'History'),
  planned('nsc-information-technology', 'Information Technology'),
  planned('nsc-cat', 'Computer Applications Technology'),
  planned('nsc-english-hl', 'English Home Language'),
  planned('nsc-english-fal', 'English First Additional Language'),
  planned('nsc-life-orientation', 'Life Orientation'),
];

// ---------------------------------------------------------------------------
// Bodies
// ---------------------------------------------------------------------------

const BODIES_RAW: ExamBody[] = [
  {
    id: 'cambridge',
    title: 'Cambridge Assessment International Education',
    shortTitle: 'Cambridge International',
    hint: 'IGCSE, O Level and AS & A Level. Sat at most private and trust schools in Zimbabwe.',
    series: CAMBRIDGE_SERIES,
    levels: [
      {
        id: 'a-level',
        title: 'AS & A Level',
        hint: 'Lower and Upper Six. This is where our material is.',
        subjects: CAMBRIDGE_A_LEVEL,
      },
      {
        id: 'o-level',
        title: 'O Level',
        hint: 'Forms 3 and 4. Still examined in Zimbabwe; Cambridge starts moving these schools to IGCSE from June 2028.',
        subjects: CAMBRIDGE_O_LEVEL,
      },
      {
        id: 'igcse',
        title: 'IGCSE',
        hint: 'The international GCSE, taken instead of O Level at many schools.',
        subjects: CAMBRIDGE_IGCSE,
      },
    ],
  },
  {
    id: 'zimsec',
    title: 'Zimbabwe School Examinations Council',
    shortTitle: 'ZIMSEC',
    hint: 'The national Zimbabwean board. Ordinary and Advanced Level, sat in June and November.',
    series: ZIMSEC_SERIES,
    levels: [
      {
        id: 'a-level',
        title: 'Advanced Level',
        hint: 'Lower and Upper Six.',
        subjects: ZIMSEC_A_LEVEL,
      },
      {
        id: 'o-level',
        title: 'Ordinary Level',
        hint: 'Forms 3 and 4.',
        subjects: ZIMSEC_O_LEVEL,
      },
    ],
  },
  {
    id: 'edexcel',
    title: 'Pearson Edexcel International',
    shortTitle: 'Edexcel',
    hint: 'International GCSE and International A Level. Not available to candidates studying in the UK.',
    series: EDEXCEL_IAL_SERIES,
    levels: [
      {
        id: 'ial',
        title: 'International A Level',
        hint: 'Formally the International Advanced Level (IAL). January, May/June and October sittings.',
        series: EDEXCEL_IAL_SERIES,
        subjects: EDEXCEL_IAL,
      },
      {
        id: 'ias',
        title: 'International AS',
        hint: 'Formally the International Advanced Subsidiary — the first half of the IAL.',
        series: EDEXCEL_IAL_SERIES,
        subjects: EDEXCEL_IAL,
      },
      {
        id: 'igcse',
        title: 'International GCSE',
        hint: 'Pearson’s IGCSE (9–1). No January sitting — the last one was 2023.',
        series: EDEXCEL_IGCSE_SERIES,
        subjects: EDEXCEL_IGCSE,
      },
    ],
  },
  {
    id: 'nsc',
    title: 'National Senior Certificate (South Africa)',
    shortTitle: 'NSC — matric',
    hint: 'Grade 12 matric, set by the DBE or the IEB. Both are quality-assured by Umalusi.',
    series: NSC_SERIES,
    levels: [
      {
        id: 'nsc-dbe',
        title: 'NSC — DBE (public schools)',
        hint: 'Papers set and marked by the Department of Basic Education.',
        subjects: NSC_SUBJECTS,
      },
      {
        id: 'nsc-ieb',
        title: 'NSC — IEB (independent schools)',
        hint: 'The same certificate, papers set by the Independent Examinations Board.',
        subjects: NSC_SUBJECTS,
      },
      {
        id: 'nsc-sacai',
        title: 'NSC — SACAI (homeschool and distance)',
        hint: 'The same certificate, for homeschool and distance candidates.',
        subjects: NSC_SUBJECTS,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Availability — resolved against what actually exists
// ---------------------------------------------------------------------------

/**
 * The single source of truth for "do we have this". Keyed `bodyId/levelId/subjectId`.
 *
 * It is a map with ONE entry, and it should stay embarrassing to look at until
 * that changes. The value is a function so the answer is recomputed from
 * `lib/syllabus.ts` rather than asserted here.
 */
const AVAILABILITY_SOURCES: Record<
  string,
  () => { availability: SubjectAvailability; note?: string }
> = {
  'cambridge/a-level/cie-al-9709': () => {
    const mechanics = UNITS.find((u) => u.code === 'M');
    const liveMechanics = mechanics?.topics.filter((t) => t.live).length ?? 0;
    const liveElsewhere = UNITS.filter((u) => u.code !== 'M').reduce(
      (n, u) => n + u.topics.filter((t) => t.live).length,
      0
    );
    if (liveMechanics === 0) {
      return { availability: 'planned' };
    }
    return {
      availability: 'in_progress',
      note:
        `Mechanics (Paper 4) is written — ${liveMechanics} topics with notes and video. ` +
        (liveElsewhere > 0
          ? `Pure and Statistics are ${liveElsewhere} topics in and still being written.`
          : 'Pure Mathematics and Statistics are not written yet.'),
    };
  },
};

function withAvailability(
  bodyId: string,
  levelId: string,
  subject: ExamSubject
): ExamSubject {
  const source = AVAILABILITY_SOURCES[`${bodyId}/${levelId}/${subject.id}`];
  if (!source) return subject;
  const { availability, note } = source();
  return { ...subject, availability, note };
}

/** The catalogue, with availability resolved. This is what the UI renders. */
export const EXAM_BODIES: ExamBody[] = BODIES_RAW.map((body) => ({
  ...body,
  levels: body.levels.map((level) => ({
    ...level,
    subjects: level.subjects.map((s) => withAvailability(body.id, level.id, s)),
  })),
}));

/** Copy for a subject row. One short phrase; never buried in a tooltip. */
export const AVAILABILITY_LABEL: Record<SubjectAvailability, string> = {
  available: 'Ready to study',
  in_progress: 'Partly written',
  planned: 'Not yet — we will tell you when it is ready',
};

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export function findBody(bodyId: string): ExamBody | undefined {
  return EXAM_BODIES.find((b) => b.id === bodyId);
}

export function findLevel(bodyId: string, levelId: string): ExamLevel | undefined {
  return findBody(bodyId)?.levels.find((l) => l.id === levelId);
}

export function findSubject(
  bodyId: string,
  levelId: string,
  subjectId: string
): (ExamSubject & { id: string }) | undefined {
  return findLevel(bodyId, levelId)?.subjects.find((s) => s.id === subjectId);
}

/**
 * The next few sittings for a body, newest-first-in-time.
 *
 * A session you cannot enter is not an option, so a series is dropped once its
 * papers are past. `graceMonths` keeps the current series listed for a month
 * after it starts — someone registering mid-June is sitting *this* June.
 */
export function sessionsFor(
  bodyId: string,
  levelId: string,
  now: Date = new Date(),
  count = 5
): ExamSession[] {
  const body = findBody(bodyId);
  const level = findLevel(bodyId, levelId);
  if (!body || !level) return [];
  const seriesList = level.series ?? body.series;
  const cursor = now.getFullYear() * 12 + now.getMonth(); // months since year 0
  const out: ExamSession[] = [];
  for (let yearOffset = 0; yearOffset <= 3 && out.length < count; yearOffset++) {
    const year = now.getFullYear() + yearOffset;
    for (const series of seriesList) {
      if (out.length >= count) break;
      const seriesCursor = year * 12 + (series.examMonth - 1);
      if (seriesCursor < cursor) continue; // already sat
      out.push({
        id: `${year}-${series.id}`,
        year,
        seriesId: series.id,
        title: `${series.title} ${year}`,
        note: series.note,
      });
    }
  }
  return out;
}

export function findSession(
  bodyId: string,
  levelId: string,
  sessionId: string,
  now: Date = new Date()
): ExamSession | undefined {
  return sessionsFor(bodyId, levelId, now, 12).find((s) => s.id === sessionId);
}

// ---------------------------------------------------------------------------
// Server-side resolution
// ---------------------------------------------------------------------------

export interface EnrolmentInput {
  bodyId: string;
  levelId: string;
  sessionId: string;
  subjectIds: string[];
}

export interface ResolvedEnrolment {
  bodyId: string;
  levelId: string;
  sessionId: string;
  sessionYear: number;
  sessionSeries: string;
  subjects: {
    subjectId: string;
    code?: string;
    title: string;
    availability: SubjectAvailability;
  }[];
}

export class EnrolmentError extends Error {}

/** Max subjects per sitting. Four is a normal A Level load; eight is a typo. */
export const MAX_SUBJECTS = 8;

/**
 * Turn ids from a client into a trusted enrolment, or throw.
 *
 * Titles, codes and availability are read from the catalogue and never taken
 * from the caller, so a hand-rolled request cannot write "Rocket Science —
 * available" into a student's record or into the demand counts.
 */
export function resolveEnrolment(
  input: EnrolmentInput,
  now: Date = new Date()
): ResolvedEnrolment {
  const body = findBody(input.bodyId);
  if (!body) throw new EnrolmentError('Choose an exam board we recognise.');

  const level = findLevel(input.bodyId, input.levelId);
  if (!level) throw new EnrolmentError(`${body.shortTitle} does not offer that level.`);

  const session = findSession(input.bodyId, input.levelId, input.sessionId, now);
  if (!session) throw new EnrolmentError('Choose an exam session that is still ahead.');

  if (input.subjectIds.length === 0) {
    throw new EnrolmentError('Choose at least one subject.');
  }
  if (input.subjectIds.length > MAX_SUBJECTS) {
    throw new EnrolmentError(`Choose at most ${MAX_SUBJECTS} subjects.`);
  }

  const seen = new Set<string>();
  const subjects = input.subjectIds.map((subjectId) => {
    if (seen.has(subjectId)) throw new EnrolmentError('That subject is listed twice.');
    seen.add(subjectId);
    const subject = findSubject(input.bodyId, input.levelId, subjectId);
    if (!subject) {
      throw new EnrolmentError(`That subject is not on the ${level.title} list.`);
    }
    return {
      subjectId: subject.id,
      code: subject.code,
      title: subject.title,
      availability: subject.availability,
    };
  });

  return {
    bodyId: body.id,
    levelId: level.id,
    sessionId: session.id,
    sessionYear: session.year,
    sessionSeries: session.seriesId,
    subjects,
  };
}

/**
 * What the pre-enrolment `yearGroup` rows are migrated onto. See
 * `convex/migrations.ts` — this is the only combination the app has content for,
 * and the only one those rows could have meant.
 */
export const DEFAULT_MIGRATION_TARGET = {
  bodyId: 'cambridge',
  levelId: 'a-level',
  series: 'november',
  subjectIds: ['cie-al-9709'],
} as const;

/** Human label for a stored enrolment, e.g. "Cambridge International · AS & A Level · October/November 2027". */
export function describeEnrolment(e: {
  bodyId: string;
  levelId: string;
  sessionYear: number;
  sessionSeries: string;
}): string {
  const body = findBody(e.bodyId);
  const level = findLevel(e.bodyId, e.levelId);
  const series = (level?.series ?? body?.series ?? []).find(
    (s) => s.id === e.sessionSeries
  );
  return [
    body?.shortTitle ?? e.bodyId,
    level?.title ?? e.levelId,
    `${series?.title ?? e.sessionSeries} ${e.sessionYear}`,
  ].join(' · ');
}
