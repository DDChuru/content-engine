/**
 * Reading the catalogue tables, server-side.
 *
 * Everything the client is allowed to send is an id. Titles, codes, availability
 * and session validity are rebuilt here from the tables and from
 * `lib/exam-catalogue.ts`, so a hand-rolled request cannot write "Rocket Science —
 * available" into a student's record or into the demand counts.
 */

import type { Doc } from '../_generated/dataModel';
import type { QueryCtx, MutationCtx } from '../_generated/server';
import {
  EnrolmentError,
  MAX_SUBJECTS,
  resolveAvailability,
  sessionsFromSeries,
  type EnrolmentInput,
  type ExamSeries,
  type ExamSession,
  type ResolvedEnrolment,
} from '../../lib/exam-catalogue';

type Ctx = QueryCtx | MutationCtx;

const bySort = <T extends { sortOrder: number; title: string }>(a: T, b: T) =>
  a.sortOrder - b.sortOrder || a.title.localeCompare(b.title);

// ---------------------------------------------------------------------------
// Row reads
// ---------------------------------------------------------------------------

export async function activeCountries(ctx: Ctx): Promise<Doc<'catalogueCountries'>[]> {
  const rows = await ctx.db
    .query('catalogueCountries')
    .withIndex('by_state', (q) => q.eq('state', 'active'))
    .collect();
  return rows.sort(bySort);
}

export async function getCountry(ctx: Ctx, code: string) {
  return ctx.db
    .query('catalogueCountries')
    .withIndex('by_code', (q) => q.eq('code', code))
    .unique();
}

export async function getBody(ctx: Ctx, bodyId: string) {
  return ctx.db
    .query('catalogueBodies')
    .withIndex('by_body', (q) => q.eq('bodyId', bodyId))
    .unique();
}

export async function getLevel(ctx: Ctx, bodyId: string, levelId: string) {
  return ctx.db
    .query('catalogueLevels')
    .withIndex('by_body_level', (q) => q.eq('bodyId', bodyId).eq('levelId', levelId))
    .unique();
}

export async function getCountryBody(ctx: Ctx, countryCode: string, bodyId: string) {
  return ctx.db
    .query('catalogueCountryBodies')
    .withIndex('by_country_body', (q) =>
      q.eq('countryCode', countryCode).eq('bodyId', bodyId)
    )
    .unique();
}

/**
 * The boards a candidate in this country can actually enter for, with the level
 * restriction (if any) attached. THE join query — this is the whole point of
 * country being a layer rather than a field on the user we never read.
 */
export async function bodiesForCountry(ctx: Ctx, countryCode: string) {
  const joins = (
    await ctx.db
      .query('catalogueCountryBodies')
      .withIndex('by_country', (q) =>
        q.eq('countryCode', countryCode).eq('state', 'active')
      )
      .collect()
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  const out = [];
  for (const join of joins) {
    const body = await getBody(ctx, join.bodyId);
    if (!body || body.state !== 'active') continue;
    out.push({
      bodyId: body.bodyId,
      title: body.title,
      shortTitle: body.shortTitle,
      hint: body.hint,
      /** Set when the country sits only part of this board's offer. */
      countryNote: join.note,
      levelIds: join.levelIds,
    });
  }
  return out;
}

/** Active levels of a body, narrowed by the country join where it narrows. */
export async function levelsFor(ctx: Ctx, countryCode: string, bodyId: string) {
  const join = await getCountryBody(ctx, countryCode, bodyId);
  if (!join || join.state !== 'active') return [];
  const rows = (
    await ctx.db
      .query('catalogueLevels')
      .withIndex('by_body', (q) => q.eq('bodyId', bodyId).eq('state', 'active'))
      .collect()
  ).sort(bySort);
  const allowed = join.levelIds;
  return rows
    .filter((l) => !allowed || allowed.includes(l.levelId))
    .map((l) => ({ levelId: l.levelId, title: l.title, hint: l.hint }));
}

/**
 * The series a (body, level) sits. Level rows REPLACE body rows rather than
 * adding to them: Pearson's International GCSE has no January sitting while the
 * IAL does, so a level that declares its own series declares all of them.
 */
export async function seriesFor(
  ctx: Ctx,
  bodyId: string,
  levelId: string
): Promise<ExamSeries[]> {
  const rows = (
    await ctx.db
      .query('catalogueSeries')
      .withIndex('by_body', (q) => q.eq('bodyId', bodyId).eq('state', 'active'))
      .collect()
  ).sort(bySort);
  const levelRows = rows.filter((r) => r.levelId === levelId);
  const chosen = levelRows.length > 0 ? levelRows : rows.filter((r) => !r.levelId);
  return chosen.map((r) => ({
    id: r.seriesId,
    title: r.title,
    examMonth: r.examMonth,
    note: r.note,
  }));
}

export async function sessionsFor(
  ctx: Ctx,
  bodyId: string,
  levelId: string,
  now: Date = new Date(),
  count = 5
): Promise<ExamSession[]> {
  return sessionsFromSeries(await seriesFor(ctx, bodyId, levelId), now, count);
}

/** Active subjects of a (body, level), with availability resolved. */
export async function subjectsFor(ctx: Ctx, bodyId: string, levelId: string) {
  const rows = (
    await ctx.db
      .query('catalogueSubjects')
      .withIndex('by_body_level', (q) =>
        q.eq('bodyId', bodyId).eq('levelId', levelId).eq('state', 'active')
      )
      .collect()
  ).sort(bySort);
  return rows.map((s) => ({
    id: s.subjectId,
    code: s.code,
    title: s.title,
    ...resolveAvailability(bodyId, levelId, s.subjectId, s.availabilityOverride),
  }));
}

// ---------------------------------------------------------------------------
// Enrolment resolution
// ---------------------------------------------------------------------------

/**
 * Turn ids from a client into a trusted enrolment, or throw.
 *
 * The country check is not decoration: it is what stops a UK candidate being
 * enrolled for a Cambridge O Level they cannot sit, and it is enforced here rather
 * than in the picker because the picker is the client.
 */
export async function resolveEnrolment(
  ctx: Ctx,
  input: EnrolmentInput,
  now: Date = new Date()
): Promise<ResolvedEnrolment> {
  const country = await getCountry(ctx, input.countryCode);
  if (!country || country.state !== 'active') {
    throw new EnrolmentError('Choose a country we recognise.');
  }

  const body = await getBody(ctx, input.bodyId);
  if (!body || body.state !== 'active') {
    throw new EnrolmentError('Choose an exam board we recognise.');
  }

  const join = await getCountryBody(ctx, country.code, body.bodyId);
  if (!join || join.state !== 'active') {
    throw new EnrolmentError(
      `${body.shortTitle} is not sat in ${country.title}.`
    );
  }

  const level = await getLevel(ctx, body.bodyId, input.levelId);
  if (!level || level.state !== 'active') {
    throw new EnrolmentError(`${body.shortTitle} does not offer that level.`);
  }
  if (join.levelIds && !join.levelIds.includes(level.levelId)) {
    throw new EnrolmentError(
      `${body.shortTitle} ${level.title} is not available in ${country.title}.`
    );
  }

  const session = (await sessionsFor(ctx, body.bodyId, level.levelId, now, 12)).find(
    (s) => s.id === input.sessionId
  );
  if (!session) throw new EnrolmentError('Choose an exam session that is still ahead.');

  if (input.subjectIds.length === 0) {
    throw new EnrolmentError('Choose at least one subject.');
  }
  if (input.subjectIds.length > MAX_SUBJECTS) {
    throw new EnrolmentError(`Choose at most ${MAX_SUBJECTS} subjects.`);
  }

  const offered = await subjectsFor(ctx, body.bodyId, level.levelId);
  const seen = new Set<string>();
  const subjects = input.subjectIds.map((subjectId) => {
    if (seen.has(subjectId)) throw new EnrolmentError('That subject is listed twice.');
    seen.add(subjectId);
    const subject = offered.find((s) => s.id === subjectId);
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
    countryCode: country.code,
    bodyId: body.bodyId,
    levelId: level.levelId,
    sessionId: session.id,
    sessionYear: session.year,
    sessionSeries: session.seriesId,
    subjects,
  };
}

/** "Cambridge International · AS & A Level · November 2027", built from the tables. */
export async function describeEnrolment(
  ctx: Ctx,
  e: { bodyId: string; levelId: string; sessionYear: number; sessionSeries: string }
): Promise<string> {
  const body = await getBody(ctx, e.bodyId);
  const level = await getLevel(ctx, e.bodyId, e.levelId);
  const series = (await seriesFor(ctx, e.bodyId, e.levelId)).find(
    (s) => s.id === e.sessionSeries
  );
  return [
    body?.shortTitle ?? e.bodyId,
    level?.title ?? e.levelId,
    `${series?.title ?? e.sessionSeries} ${e.sessionYear}`,
  ].join(' · ');
}
