/**
 * The qualifications catalogue — TYPES AND DERIVED AVAILABILITY. No data.
 *
 * The catalogue itself (countries, boards, levels, series, subjects and the
 * country↔board join) now lives in Convex, in the six `catalogue*` tables, so a
 * board or a subject can be added without a deploy. It is seeded from
 * `content/catalogue/exam-catalogue.json` and exported back to that file by
 * `scripts/export-exam-catalogue.mjs`, which is how a wrong subject code stays
 * catchable in a git diff. After the first seed the TABLES are the source of
 * truth and the JSON is their reviewable mirror.
 *
 * WHAT STAYED IN CODE, AND WHY
 *
 * `availability` is not a column and is not editable. It is computed here, at read
 * time, against `lib/syllabus.ts` — the same array the study pages render from. One
 * subject in the whole catalogue resolves above `planned`: Cambridge A Level
 * Mathematics 9709, and only its Mechanics unit. If the syllabus map goes empty, so
 * does this, automatically, and no admin action can say otherwise. (An admin who
 * genuinely needs to say otherwise uses `catalogueSubjects.availabilityOverride`,
 * which is a different field, needs a written reason, names its author, and shows
 * on the row as an override.)
 *
 * Registering for a subject we do not have remains allowed and remains the point:
 * the pick is written to `subjectDemand` and is the roadmap (PLAN §8). What must
 * never happen is the UI implying the material is there.
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
  /** Syllabus code where the body publishes one. ZIMSEC A Level and the NSC differ. */
  code?: string;
  title: string;
  availability: SubjectAvailability;
  /** One plain sentence under the row when it is not simply available. */
  note?: string;
  /** True when `availability` came from an admin override, not from the library. */
  availabilityOverridden?: boolean;
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

export interface ExamSession {
  /** `${year}-${seriesId}`, e.g. "2027-november". Stored on the enrolment. */
  id: string;
  year: number;
  seriesId: string;
  /** "November 2027" */
  title: string;
  note?: string;
}

/** Max subjects per sitting. Four is a normal A Level load; eight is a typo. */
export const MAX_SUBJECTS = 8;

/** Copy for a subject row. One short phrase; never buried in a tooltip. */
export const AVAILABILITY_LABEL: Record<SubjectAvailability, string> = {
  available: 'Ready to study',
  in_progress: 'Partly written',
  planned: 'Not yet — we will tell you when it is ready',
};

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

/**
 * What the library actually holds for a subject. Every subject that is not named
 * in the map above is `planned`, which is the honest default: absence of content
 * is the normal case and has to be the one you get for free.
 */
export function derivedAvailability(
  bodyId: string,
  levelId: string,
  subjectId: string
): { availability: SubjectAvailability; note?: string } {
  const source = AVAILABILITY_SOURCES[`${bodyId}/${levelId}/${subjectId}`];
  return source ? source() : { availability: 'planned' };
}

/**
 * Derived availability, with an admin override applied if one is set.
 *
 * The two are kept distinguishable all the way to the UI: `availabilityOverridden`
 * is what stops an override reading as a fact about the library.
 */
export function resolveAvailability(
  bodyId: string,
  levelId: string,
  subjectId: string,
  override?: SubjectAvailability | null
): { availability: SubjectAvailability; note?: string; availabilityOverridden: boolean } {
  const derived = derivedAvailability(bodyId, levelId, subjectId);
  if (!override) return { ...derived, availabilityOverridden: false };
  return { availability: override, note: derived.note, availabilityOverridden: true };
}

// ---------------------------------------------------------------------------
// Sessions — generated forward from the series, never stored
// ---------------------------------------------------------------------------

/**
 * The next few sittings for a list of series, in time order.
 *
 * A session you cannot enter is not an option, so a series is dropped once its
 * papers are past. Someone registering during the exam month is sitting *this*
 * series, so the current month still counts as ahead.
 *
 * Ordering is by exam month, NOT by the catalogue's `sortOrder`.
 */
export function sessionsFromSeries(
  seriesList: ExamSeries[],
  now: Date = new Date(),
  count = 5
): ExamSession[] {
  const cursor = now.getFullYear() * 12 + now.getMonth(); // months since year 0
  // CHRONOLOGICAL, not catalogue order. `seriesList` arrives sorted by the
  // catalogue's `sortOrder`, which is a display preference and says nothing about
  // when the papers are sat — the NSC lists November before May/June, so the
  // unsorted loop offered "November 2027" above "May/June 2027". A student
  // picking their sitting reads the list as a timeline; the first entry has to be
  // the next one they can actually enter for.
  const byMonth = [...seriesList].sort((a, b) => a.examMonth - b.examMonth);
  const out: ExamSession[] = [];
  for (let yearOffset = 0; yearOffset <= 3 && out.length < count; yearOffset++) {
    const year = now.getFullYear() + yearOffset;
    for (const series of byMonth) {
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

// ---------------------------------------------------------------------------
// Enrolment shapes
// ---------------------------------------------------------------------------

export interface EnrolmentInput {
  countryCode: string;
  bodyId: string;
  levelId: string;
  sessionId: string;
  subjectIds: string[];
}

export interface ResolvedEnrolment {
  countryCode: string;
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

/**
 * What the pre-enrolment `yearGroup` rows are migrated onto. See
 * `convex/migrations.ts` — this is the only combination the app has content for,
 * and the only one those rows could have meant.
 */
export const DEFAULT_MIGRATION_TARGET = {
  countryCode: 'ZW',
  bodyId: 'cambridge',
  levelId: 'a-level',
  series: 'november',
  subjectIds: ['cie-al-9709'],
} as const;
