/**
 * The qualifications catalogue: public reads, admin writes, seed and export.
 *
 * SOURCE OF TRUTH. `content/catalogue/exam-catalogue.json` bootstraps these tables
 * once. After that the TABLES are authoritative — they are what registration reads
 * and what an admin edits — and the JSON is kept in step by
 * `scripts/export-exam-catalogue.mjs`, so a wrong subject code (4024 is Mathematics
 * at Cambridge and Chemistry at ZIMSEC) is still caught in a git diff rather than
 * discovered by a student on results day. `seed` therefore never retires: it only
 * fills in rows that are missing, so re-running it cannot undo a runtime edit.
 *
 * AVAILABILITY IS NOT WRITABLE. No mutation here takes an `availability` argument.
 * It is derived from `lib/syllabus.ts` on every read. The one way to say otherwise
 * is `setAvailabilityOverride`, which is a different field, refuses a thin reason,
 * stamps who did it, and writes an audit row.
 */

import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { MutationCtx, QueryCtx } from './_generated/server';
import { AuthError, audit, requireAdmin, requireUser } from './lib/auth';
import { availabilityValidator, catalogueStateValidator } from './schema';
import {
  bodiesForCountry,
  activeCountries,
  levelsFor,
  seriesFor,
  sessionsFor,
  subjectsFor,
} from './lib/catalogue';
import { resolveAvailability } from '../lib/exam-catalogue';

// ---------------------------------------------------------------------------
// Public reads — the registration picker, country first
// ---------------------------------------------------------------------------
// Open to anyone: the list of exam boards in Zimbabwe is not a secret, and the
// picker runs before a `users` row exists. Nothing here reads or returns a person.

export const countries = query({
  args: {},
  handler: async (ctx) =>
    (await activeCountries(ctx)).map((c) => ({
      code: c.code,
      title: c.title,
      note: c.note,
    })),
});

export const bodies = query({
  args: { countryCode: v.string() },
  handler: async (ctx, { countryCode }) => bodiesForCountry(ctx, countryCode),
});

export const levels = query({
  args: { countryCode: v.string(), bodyId: v.string() },
  handler: async (ctx, { countryCode, bodyId }) => levelsFor(ctx, countryCode, bodyId),
});

export const sessions = query({
  args: { bodyId: v.string(), levelId: v.string() },
  handler: async (ctx, { bodyId, levelId }) => ({
    series: await seriesFor(ctx, bodyId, levelId),
    sessions: await sessionsFor(ctx, bodyId, levelId),
  }),
});

export const subjects = query({
  args: { bodyId: v.string(), levelId: v.string() },
  handler: async (ctx, { bodyId, levelId }) => subjectsFor(ctx, bodyId, levelId),
});

// ---------------------------------------------------------------------------
// Admin read — everything, retired rows included
// ---------------------------------------------------------------------------

/**
 * The whole catalogue for the admin screen. Retired rows are included and
 * labelled: an admin managing a catalogue has to be able to see what they retired,
 * or "retire" is indistinguishable from "delete" at the only place it matters.
 *
 * Admin-gated like every write below — role is re-derived here, server-side, from
 * the `users` row. There is no middleware check standing in for this one.
 *
 * It returns `null` rather than throwing for a non-admin, because a throwing query
 * turns "you are not an admin" into a client-side error boundary. The refusal is
 * the same refusal: no catalogue data leaves the server. Every MUTATION below
 * throws, independently, so nothing here is load-bearing for permission.
 */
export const adminTree = query({
  args: {},
  handler: async (ctx) => {
    const caller = await requireUser(ctx).catch(() => null);
    if (!caller || caller.role !== 'admin') return null;
    const [countryRows, bodyRows, joinRows, levelRows, seriesRows, subjectRows] =
      await Promise.all([
        ctx.db.query('catalogueCountries').collect(),
        ctx.db.query('catalogueBodies').collect(),
        ctx.db.query('catalogueCountryBodies').collect(),
        ctx.db.query('catalogueLevels').collect(),
        ctx.db.query('catalogueSeries').collect(),
        ctx.db.query('catalogueSubjects').collect(),
      ]);
    const sort = <T extends { sortOrder: number; title: string }>(rows: T[]) =>
      rows.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));

    return {
      countries: sort(countryRows).map((c) => ({
        code: c.code,
        title: c.title,
        note: c.note,
        sortOrder: c.sortOrder,
        state: c.state,
      })),
      bodies: sort(bodyRows).map((b) => ({
        bodyId: b.bodyId,
        title: b.title,
        shortTitle: b.shortTitle,
        hint: b.hint,
        sortOrder: b.sortOrder,
        state: b.state,
      })),
      countryBodies: joinRows
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((j) => ({
          countryCode: j.countryCode,
          bodyId: j.bodyId,
          levelIds: j.levelIds,
          note: j.note,
          sortOrder: j.sortOrder,
          state: j.state,
        })),
      levels: sort(levelRows).map((l) => ({
        bodyId: l.bodyId,
        levelId: l.levelId,
        title: l.title,
        hint: l.hint,
        sortOrder: l.sortOrder,
        state: l.state,
      })),
      series: sort(seriesRows).map((s) => ({
        bodyId: s.bodyId,
        levelId: s.levelId,
        seriesId: s.seriesId,
        title: s.title,
        examMonth: s.examMonth,
        note: s.note,
        sortOrder: s.sortOrder,
        state: s.state,
      })),
      subjects: sort(subjectRows).map((s) => ({
        bodyId: s.bodyId,
        levelId: s.levelId,
        subjectId: s.subjectId,
        code: s.code,
        title: s.title,
        sortOrder: s.sortOrder,
        state: s.state,
        availabilityOverride: s.availabilityOverride,
        overrideReason: s.overrideReason,
        overrideAt: s.overrideAt,
        // What the library actually says, shown next to any override so the two
        // are never confused for one another.
        ...resolveAvailability(s.bodyId, s.levelId, s.subjectId, s.availabilityOverride),
      })),
    };
  },
});

// ---------------------------------------------------------------------------
// Admin writes
// ---------------------------------------------------------------------------

const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

function requireSlug(value: string, field: string): string {
  const slug = value.trim();
  if (!SLUG.test(slug)) {
    throw new AuthError(
      `${field} must be a lower-case slug (letters, digits and hyphens).`
    );
  }
  return slug;
}

function requireText(value: string, field: string, min = 1, max = 400): string {
  const text = value.trim();
  if (text.length < min) throw new AuthError(`${field} is required.`);
  return text.slice(0, max);
}

const optionalText = (value: string | undefined, max = 400) => {
  const text = value?.trim();
  return text ? text.slice(0, max) : undefined;
};

/** Every write lands here, so nothing can be edited without an audit row. */
async function auditCatalogue(
  ctx: MutationCtx,
  admin: Awaited<ReturnType<typeof requireAdmin>>,
  action: string,
  targetTable: string,
  targetId: string,
  metadata: Record<string, unknown>
) {
  await audit(ctx, { action, actor: admin, targetTable, targetId, metadata });
}

export const upsertCountry = mutation({
  args: {
    code: v.string(),
    title: v.string(),
    note: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    // ISO-3166-1 alpha-2, upper case, plus the 'OTHER' sentinel.
    const code = args.code.trim().toUpperCase();
    if (!/^([A-Z]{2}|OTHER)$/.test(code)) {
      throw new AuthError('Country code must be two letters (ISO-3166) or OTHER.');
    }
    const title = requireText(args.title, 'Country name');
    const existing = await ctx.db
      .query('catalogueCountries')
      .withIndex('by_code', (q) => q.eq('code', code))
      .unique();

    const fields = {
      title,
      note: optionalText(args.note),
      sortOrder: args.sortOrder ?? existing?.sortOrder ?? 500,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      await auditCatalogue(ctx, admin, 'catalogue.country.update', 'catalogueCountries', existing._id, { code, ...fields });
      return existing._id;
    }
    const id = await ctx.db.insert('catalogueCountries', {
      code,
      ...fields,
      state: 'active' as const,
      createdAt: Date.now(),
    });
    await auditCatalogue(ctx, admin, 'catalogue.country.create', 'catalogueCountries', id, { code, ...fields });
    return id;
  },
});

export const upsertBody = mutation({
  args: {
    bodyId: v.string(),
    title: v.string(),
    shortTitle: v.string(),
    hint: v.string(),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    // The slug is stored on every enrolment ever written, so it is fixed at
    // creation: renaming it would orphan the history, not rename it.
    const bodyId = requireSlug(args.bodyId, 'Board id');
    const existing = await ctx.db
      .query('catalogueBodies')
      .withIndex('by_body', (q) => q.eq('bodyId', bodyId))
      .unique();
    const fields = {
      title: requireText(args.title, 'Board name'),
      shortTitle: requireText(args.shortTitle, 'Short name', 1, 60),
      hint: requireText(args.hint, 'Hint'),
      sortOrder: args.sortOrder ?? existing?.sortOrder ?? 500,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      await auditCatalogue(ctx, admin, 'catalogue.body.update', 'catalogueBodies', existing._id, { bodyId, ...fields });
      return existing._id;
    }
    const id = await ctx.db.insert('catalogueBodies', {
      bodyId,
      ...fields,
      state: 'active' as const,
      createdAt: Date.now(),
    });
    await auditCatalogue(ctx, admin, 'catalogue.body.create', 'catalogueBodies', id, { bodyId, ...fields });
    return id;
  },
});

/** Create or edit one country↔board offering. The join, written directly. */
export const upsertCountryBody = mutation({
  args: {
    countryCode: v.string(),
    bodyId: v.string(),
    /** Absent = every active level. Present = only these levels in this country. */
    levelIds: v.optional(v.array(v.string())),
    note: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const countryCode = args.countryCode.trim().toUpperCase();
    const bodyId = requireSlug(args.bodyId, 'Board id');

    // Both sides must exist. A join to a board that is not in the catalogue is a
    // country that offers nothing and looks like a bug to the student, not to us.
    const country = await ctx.db
      .query('catalogueCountries')
      .withIndex('by_code', (q) => q.eq('code', countryCode))
      .unique();
    if (!country) throw new AuthError('Add the country first.');
    const body = await ctx.db
      .query('catalogueBodies')
      .withIndex('by_body', (q) => q.eq('bodyId', bodyId))
      .unique();
    if (!body) throw new AuthError('Add the exam board first.');

    const levelIds = args.levelIds?.length ? args.levelIds : undefined;
    if (levelIds) {
      for (const levelId of levelIds) {
        const level = await ctx.db
          .query('catalogueLevels')
          .withIndex('by_body_level', (q) =>
            q.eq('bodyId', bodyId).eq('levelId', levelId)
          )
          .unique();
        if (!level) throw new AuthError(`${body.shortTitle} has no level "${levelId}".`);
      }
    }

    const existing = await ctx.db
      .query('catalogueCountryBodies')
      .withIndex('by_country_body', (q) =>
        q.eq('countryCode', countryCode).eq('bodyId', bodyId)
      )
      .unique();
    const fields = {
      levelIds,
      note: optionalText(args.note),
      sortOrder: args.sortOrder ?? existing?.sortOrder ?? 500,
    };
    if (existing) {
      // NOT `state: 'active'`. An edit changes what a row SAYS, never whether it
      // is offered: forcing active here silently un-retired an offering (the
      // admin screen lets you edit a retired row), and left `retiredAt` /
      // `retiredBy` behind on a row claiming to be active — an audit trail
      // contradicting itself. `unretire` is the one way back, and it is explicit,
      // clears both stamps and writes its own audit row.
      await ctx.db.patch(existing._id, fields);
      await auditCatalogue(ctx, admin, 'catalogue.countryBody.update', 'catalogueCountryBodies', existing._id, { countryCode, bodyId, ...fields, state: existing.state });
      return existing._id;
    }
    const id = await ctx.db.insert('catalogueCountryBodies', {
      countryCode,
      bodyId,
      ...fields,
      state: 'active' as const,
      createdAt: Date.now(),
    });
    await auditCatalogue(ctx, admin, 'catalogue.countryBody.create', 'catalogueCountryBodies', id, { countryCode, bodyId, ...fields });
    return id;
  },
});

export const upsertLevel = mutation({
  args: {
    bodyId: v.string(),
    levelId: v.string(),
    title: v.string(),
    hint: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const bodyId = requireSlug(args.bodyId, 'Board id');
    const levelId = requireSlug(args.levelId, 'Level id');
    const body = await ctx.db
      .query('catalogueBodies')
      .withIndex('by_body', (q) => q.eq('bodyId', bodyId))
      .unique();
    if (!body) throw new AuthError('Add the exam board first.');

    const existing = await ctx.db
      .query('catalogueLevels')
      .withIndex('by_body_level', (q) => q.eq('bodyId', bodyId).eq('levelId', levelId))
      .unique();
    const fields = {
      title: requireText(args.title, 'Level name'),
      hint: optionalText(args.hint),
      sortOrder: args.sortOrder ?? existing?.sortOrder ?? 500,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      await auditCatalogue(ctx, admin, 'catalogue.level.update', 'catalogueLevels', existing._id, { bodyId, levelId, ...fields });
      return existing._id;
    }
    const id = await ctx.db.insert('catalogueLevels', {
      bodyId,
      levelId,
      ...fields,
      state: 'active' as const,
      createdAt: Date.now(),
    });
    await auditCatalogue(ctx, admin, 'catalogue.level.create', 'catalogueLevels', id, { bodyId, levelId, ...fields });
    return id;
  },
});

export const upsertSeries = mutation({
  args: {
    bodyId: v.string(),
    /** Absent = the board's default series. Present = this level only. */
    levelId: v.optional(v.string()),
    seriesId: v.string(),
    title: v.string(),
    examMonth: v.number(),
    note: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const bodyId = requireSlug(args.bodyId, 'Board id');
    const seriesId = requireSlug(args.seriesId, 'Series id');
    const levelId = args.levelId ? requireSlug(args.levelId, 'Level id') : undefined;
    if (!Number.isInteger(args.examMonth) || args.examMonth < 1 || args.examMonth > 12) {
      throw new AuthError('Exam month must be 1-12.');
    }
    // Both parents must exist, like every other upsert here. A series hanging off
    // a board or level that is not in the catalogue is a row nothing can ever
    // read — it reaches no picker, and it is only found when someone wonders why
    // a sitting they typed in never appeared.
    const body = await ctx.db
      .query('catalogueBodies')
      .withIndex('by_body', (q) => q.eq('bodyId', bodyId))
      .unique();
    if (!body) throw new AuthError('Add the exam board first.');
    if (levelId) {
      const level = await ctx.db
        .query('catalogueLevels')
        .withIndex('by_body_level', (q) => q.eq('bodyId', bodyId).eq('levelId', levelId))
        .unique();
      if (!level) throw new AuthError(`${body.shortTitle} has no level "${levelId}".`);
    }

    const existing = await ctx.db
      .query('catalogueSeries')
      .withIndex('by_body_level', (q) =>
        q.eq('bodyId', bodyId).eq('levelId', levelId).eq('seriesId', seriesId)
      )
      .unique();
    const fields = {
      title: requireText(args.title, 'Series name', 1, 60),
      examMonth: args.examMonth,
      note: optionalText(args.note),
      sortOrder: args.sortOrder ?? existing?.sortOrder ?? 500,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      await auditCatalogue(ctx, admin, 'catalogue.series.update', 'catalogueSeries', existing._id, { bodyId, levelId, seriesId, ...fields });
      return existing._id;
    }
    const id = await ctx.db.insert('catalogueSeries', {
      bodyId,
      levelId,
      seriesId,
      ...fields,
      state: 'active' as const,
      createdAt: Date.now(),
    });
    await auditCatalogue(ctx, admin, 'catalogue.series.create', 'catalogueSeries', id, { bodyId, levelId, seriesId, ...fields });
    return id;
  },
});

/**
 * Create or edit a subject. NOTE THE ARGUMENT LIST: there is no `availability`.
 * The only writable thing about what we have is `setAvailabilityOverride`, below.
 */
export const upsertSubject = mutation({
  args: {
    bodyId: v.string(),
    levelId: v.string(),
    subjectId: v.string(),
    code: v.optional(v.string()),
    title: v.string(),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const bodyId = requireSlug(args.bodyId, 'Board id');
    const levelId = requireSlug(args.levelId, 'Level id');
    const subjectId = requireSlug(args.subjectId, 'Subject id');
    const level = await ctx.db
      .query('catalogueLevels')
      .withIndex('by_body_level', (q) => q.eq('bodyId', bodyId).eq('levelId', levelId))
      .unique();
    if (!level) throw new AuthError('Add the level first.');

    const existing = await ctx.db
      .query('catalogueSubjects')
      .withIndex('by_body_level_subject', (q) =>
        q.eq('bodyId', bodyId).eq('levelId', levelId).eq('subjectId', subjectId)
      )
      .unique();
    const fields = {
      // A missing code is fine and an invented one is not: a student who checks a
      // code against their entry slip and finds it wrong stops believing the page.
      code: optionalText(args.code, 16),
      title: requireText(args.title, 'Subject name', 1, 120),
      sortOrder: args.sortOrder ?? existing?.sortOrder ?? 500,
    };
    if (existing) {
      await ctx.db.patch(existing._id, fields);
      await auditCatalogue(ctx, admin, 'catalogue.subject.update', 'catalogueSubjects', existing._id, { bodyId, levelId, subjectId, ...fields });
      return existing._id;
    }
    const id = await ctx.db.insert('catalogueSubjects', {
      bodyId,
      levelId,
      subjectId,
      ...fields,
      state: 'active' as const,
      createdAt: Date.now(),
    });
    await auditCatalogue(ctx, admin, 'catalogue.subject.create', 'catalogueSubjects', id, { bodyId, levelId, subjectId, ...fields });
    return id;
  },
});

/**
 * The explicit, separate, auditable override.
 *
 * Kept apart from everything else on purpose. `upsertSubject` cannot reach this
 * field; this function does nothing else; it refuses a thin reason; it names the
 * admin in the row and in the audit log; and the picker renders an overridden row
 * as overridden. Passing `availability: null` clears it and hands the subject back
 * to the library.
 */
export const setAvailabilityOverride = mutation({
  args: {
    bodyId: v.string(),
    levelId: v.string(),
    subjectId: v.string(),
    availability: v.union(availabilityValidator, v.null()),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const reason = args.reason.trim();
    if (reason.length < 20) {
      throw new AuthError(
        'Write what content exists (or does not) before overriding availability.'
      );
    }
    const row = await ctx.db
      .query('catalogueSubjects')
      .withIndex('by_body_level_subject', (q) =>
        q
          .eq('bodyId', args.bodyId)
          .eq('levelId', args.levelId)
          .eq('subjectId', args.subjectId)
      )
      .unique();
    if (!row) throw new AuthError('No such subject.');

    await ctx.db.patch(row._id, {
      availabilityOverride: args.availability ?? undefined,
      overrideReason: args.availability ? reason : undefined,
      overrideBy: args.availability ? admin._id : undefined,
      overrideAt: args.availability ? Date.now() : undefined,
    });
    await auditCatalogue(
      ctx,
      admin,
      args.availability
        ? 'catalogue.subject.availability_override'
        : 'catalogue.subject.availability_override_cleared',
      'catalogueSubjects',
      row._id,
      {
        bodyId: args.bodyId,
        levelId: args.levelId,
        subjectId: args.subjectId,
        availability: args.availability,
        derived: resolveAvailability(args.bodyId, args.levelId, args.subjectId).availability,
        reason,
      }
    );
  },
});
// ---------------------------------------------------------------------------
// Retiring — the only way a row leaves the picker. THERE IS NO DELETE
// ---------------------------------------------------------------------------
//
// Read the exports of this file: there is no `delete`, `remove`, `destroy` or
// `purge` mutation for any catalogue entity — not for countries, boards, levels,
// series, subjects or the country↔board join, and not behind an admin gate either.
// A row cannot be removed by a bug, a fat-fingered admin or a stolen admin session,
// because no code path exists that removes one.
//
// Retirement is a state change: `state: 'retired'` plus `retiredAt` / `retiredBy`.
// The row stays, so an enrolment that references it still renders its real title
// and code instead of a blank, and a student sitting a retired subject keeps seeing
// what they registered for.

const entityValidator = v.union(
  v.literal('country'),
  v.literal('body'),
  v.literal('countryBody'),
  v.literal('level'),
  v.literal('series'),
  v.literal('subject')
);

type EntityArgs = {
  entity:
    | 'country'
    | 'body'
    | 'countryBody'
    | 'level'
    | 'series'
    | 'subject';
  countryCode?: string;
  bodyId?: string;
  levelId?: string;
  seriesId?: string;
  subjectId?: string;
};

/** Locate the one row an entity reference names, or throw. */
async function locate(ctx: MutationCtx, args: EntityArgs) {
  const need = <T>(value: T | undefined, field: string): T => {
    if (value === undefined) throw new AuthError(`${field} is required.`);
    return value;
  };

  switch (args.entity) {
    case 'country': {
      const row = await ctx.db
        .query('catalogueCountries')
        .withIndex('by_code', (q) =>
          q.eq('code', need(args.countryCode, 'countryCode').toUpperCase())
        )
        .unique();
      if (!row) throw new AuthError('No such country.');
      return { table: 'catalogueCountries', row };
    }
    case 'body': {
      const row = await ctx.db
        .query('catalogueBodies')
        .withIndex('by_body', (q) => q.eq('bodyId', need(args.bodyId, 'bodyId')))
        .unique();
      if (!row) throw new AuthError('No such exam board.');
      return { table: 'catalogueBodies', row };
    }
    case 'countryBody': {
      const row = await ctx.db
        .query('catalogueCountryBodies')
        .withIndex('by_country_body', (q) =>
          q
            .eq('countryCode', need(args.countryCode, 'countryCode').toUpperCase())
            .eq('bodyId', need(args.bodyId, 'bodyId'))
        )
        .unique();
      if (!row) throw new AuthError('That board is not offered in that country.');
      return { table: 'catalogueCountryBodies', row };
    }
    case 'level': {
      const row = await ctx.db
        .query('catalogueLevels')
        .withIndex('by_body_level', (q) =>
          q
            .eq('bodyId', need(args.bodyId, 'bodyId'))
            .eq('levelId', need(args.levelId, 'levelId'))
        )
        .unique();
      if (!row) throw new AuthError('No such level.');
      return { table: 'catalogueLevels', row };
    }
    case 'series': {
      const row = await ctx.db
        .query('catalogueSeries')
        .withIndex('by_body_level', (q) =>
          q
            .eq('bodyId', need(args.bodyId, 'bodyId'))
            .eq('levelId', args.levelId)
            .eq('seriesId', need(args.seriesId, 'seriesId'))
        )
        .unique();
      if (!row) throw new AuthError('No such series.');
      return { table: 'catalogueSeries', row };
    }
    case 'subject': {
      const row = await ctx.db
        .query('catalogueSubjects')
        .withIndex('by_body_level_subject', (q) =>
          q
            .eq('bodyId', need(args.bodyId, 'bodyId'))
            .eq('levelId', need(args.levelId, 'levelId'))
            .eq('subjectId', need(args.subjectId, 'subjectId'))
        )
        .unique();
      if (!row) throw new AuthError('No such subject.');
      return { table: 'catalogueSubjects', row };
    }
  }
}

/**
 * How many students are sitting this right now.
 *
 * WHY THIS IS NOT `.collect()` ON THE WHOLE TABLE. Retirement used to count by
 * reading every enrolment ever written. That is a control that gets SLOWER as the
 * thing it protects gets more important, and past the Convex transaction read
 * limit it stops working altogether — retiring a mis-typed subject would throw,
 * for everyone, permanently, with no way to tidy the catalogue at all. A safety
 * check that fails closed under load is worse than the risk it covers.
 *
 * WHY IT IS NO LONGER A CAPPED SCAN OF CANDIDATES EITHER. The version before
 * this one read a page of rows that merely shared a board and level, then kept
 * the `active` ones. Two things followed from filtering after the cap. The count
 * was a floor rather than a total whenever the board was busy — and, far worse,
 * a page filled by OTHER subjects' rows returned zero while the real enrolments
 * sat just past the cap. `retire` refused only on a non-zero count, so a subject
 * a cohort was mid-way through could be retired in silence. Truncation was being
 * read as "nobody", when all it ever meant was "not known".
 *
 * Both halves are fixed here:
 *
 *  1. `status` leads every index used below (schema.ts, `enrolments`), so the
 *     cap applies to MATCHING ACTIVE ROWS, not to candidates. For a country, a
 *     country/board pair, a board, a level or a series the index prefix decides
 *     the whole predicate and the count is EXACT.
 *  2. `subject` is the one entity that cannot be index-exact, because `subjects`
 *     is an array and Convex does not index array membership. It narrows on
 *     status + board + level and filters the array in memory, so it alone can
 *     still truncate — and truncation is now reported as `atLeast` on a count the
 *     caller must treat as UNKNOWN, never as safe. See `retire`.
 *
 * ACTIVE enrolments only — a superseded or withdrawn row is history, and history
 * is precisely what retirement must not disturb.
 */
const SCAN_CAP = 1000;

async function countActiveEnrolments(
  ctx: MutationCtx | QueryCtx,
  args: EntityArgs
): Promise<{ count: number; atLeast: boolean }> {
  const country = args.countryCode?.toUpperCase();

  /** Index-exact: the prefix IS the predicate, so the page size is the answer. */
  const exact = async (
    rows: Promise<{ _id: unknown }[]>
  ): Promise<{ count: number; atLeast: boolean }> => {
    const page = await rows;
    // A count past the cap is still a refusal — `retire` only ever asks whether
    // the number is zero — so reporting it as a floor costs nothing and keeps
    // the transaction bounded.
    return page.length > SCAN_CAP
      ? { count: SCAN_CAP, atLeast: true }
      : { count: page.length, atLeast: false };
  };

  switch (args.entity) {
    case 'country':
      return exact(
        ctx.db
          .query('enrolments')
          .withIndex('by_status_country_body', (q) =>
            q.eq('status', 'active').eq('countryCode', country)
          )
          .take(SCAN_CAP + 1)
      );

    case 'countryBody':
      return exact(
        ctx.db
          .query('enrolments')
          .withIndex('by_status_country_body', (q) =>
            q
              .eq('status', 'active')
              .eq('countryCode', country)
              .eq('bodyId', args.bodyId!)
          )
          .take(SCAN_CAP + 1)
      );

    case 'body':
      return exact(
        ctx.db
          .query('enrolments')
          .withIndex('by_status_body_level', (q) =>
            q.eq('status', 'active').eq('bodyId', args.bodyId!)
          )
          .take(SCAN_CAP + 1)
      );

    case 'level':
      return exact(
        ctx.db
          .query('enrolments')
          .withIndex('by_status_body_level', (q) =>
            q
              .eq('status', 'active')
              .eq('bodyId', args.bodyId!)
              .eq('levelId', args.levelId!)
          )
          .take(SCAN_CAP + 1)
      );

    case 'series':
      // `by_status_body_series` is [status, bodyId, sessionSeries, levelId]:
      // exact with or without a level, because levelId is the last component.
      return exact(
        args.levelId === undefined
          ? ctx.db
              .query('enrolments')
              .withIndex('by_status_body_series', (q) =>
                q
                  .eq('status', 'active')
                  .eq('bodyId', args.bodyId!)
                  .eq('sessionSeries', args.seriesId!)
              )
              .take(SCAN_CAP + 1)
          : ctx.db
              .query('enrolments')
              .withIndex('by_status_body_series', (q) =>
                q
                  .eq('status', 'active')
                  .eq('bodyId', args.bodyId!)
                  .eq('sessionSeries', args.seriesId!)
                  .eq('levelId', args.levelId!)
              )
              .take(SCAN_CAP + 1)
      );

    case 'subject': {
      // The inexact one. Every row read is already an ACTIVE enrolment for this
      // board and level, so the cap bites only on a genuinely large cohort — and
      // when it bites, `atLeast` is true and the count means nothing on its own.
      const page = await ctx.db
        .query('enrolments')
        .withIndex('by_status_body_level', (q) =>
          q
            .eq('status', 'active')
            .eq('bodyId', args.bodyId!)
            .eq('levelId', args.levelId!)
        )
        .take(SCAN_CAP + 1);
      const truncated = page.length > SCAN_CAP;
      const count = page
        .slice(0, SCAN_CAP)
        .filter((e) => e.subjects.some((s) => s.subjectId === args.subjectId))
        .length;
      return { count, atLeast: truncated };
    }
  }
}

const describeEntity = (args: EntityArgs) =>
  [args.countryCode, args.bodyId, args.levelId, args.seriesId, args.subjectId]
    .filter(Boolean)
    .join(' / ');

/**
 * Take an entry out of the picker.
 *
 * Refuses while students are sitting it unless the admin passes
 * `acknowledgeInUse`, and says how many they are. It refuses on the same terms
 * when the count could not be completed, because "we did not finish counting" is
 * not the same answer as "nobody". Tidying a list should not be able to quietly
 * pull a subject out from under a cohort halfway through a year.
 */
export const retire = mutation({
  args: {
    entity: entityValidator,
    countryCode: v.optional(v.string()),
    bodyId: v.optional(v.string()),
    levelId: v.optional(v.string()),
    seriesId: v.optional(v.string()),
    subjectId: v.optional(v.string()),
    /** Required to proceed when the count is non-zero. Recorded in the audit row. */
    acknowledgeInUse: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const { table, row } = await locate(ctx, args);
    const { count: inUseCount, atLeast } = await countActiveEnrolments(ctx, args);

    // TRUNCATION IS NOT ZERO. `atLeast` says the count stopped at the read cap,
    // so the true number is somewhere above it — and for the one entity that can
    // still truncate (`subject`, whose match lives inside an array Convex cannot
    // index) a truncated page can legitimately contain no match while matches
    // exist beyond it. Reading that as "nobody is sitting this" is exactly how a
    // live cohort loses its subject without anyone confirming anything. An
    // unknown count asks the human; it never answers for them.
    if ((inUseCount > 0 || atLeast) && !args.acknowledgeInUse) {
      throw new AuthError(
        inUseCount === 0
          ? `Whether anybody is sitting ${describeEntity(args)} could not be determined: ` +
            `there are more than ${SCAN_CAP} active enrolments to check and the count stopped there. ` +
            'Retiring it takes it out of the picker for everyone new; existing enrolments are kept and still render. ' +
            'Confirm to go ahead.'
          : `${atLeast ? 'At least ' : ''}${inUseCount} student${inUseCount === 1 && !atLeast ? ' is' : 's are'} sitting ${describeEntity(args)} right now. ` +
            'Retiring it takes it out of the picker for everyone new; their own enrolment is kept and still renders. ' +
            'Confirm to go ahead.'
      );
    }
    if (row.state === 'retired') return { alreadyRetired: true, inUseCount, atLeast };

    await ctx.db.patch(row._id, {
      state: 'retired' as const,
      retiredAt: Date.now(),
      retiredBy: admin._id,
    });
    await auditCatalogue(ctx, admin, 'catalogue.retire', table, row._id, {
      entity: args.entity,
      ref: describeEntity(args),
      countryCode: args.countryCode,
      bodyId: args.bodyId,
      levelId: args.levelId,
      seriesId: args.seriesId,
      subjectId: args.subjectId,
      inUseCount,
      inUseCountIsFloor: atLeast,
      acknowledgedInUse: Boolean(args.acknowledgeInUse),
    });
    return { alreadyRetired: false, inUseCount, atLeast };
  },
});

/**
 * Put it back. Two clicks, not a restore-from-backup: retiring the wrong subject
 * in the middle of an exam season has to be trivially reversible or nobody will
 * dare tidy the list at all.
 */
export const unretire = mutation({
  args: {
    entity: entityValidator,
    countryCode: v.optional(v.string()),
    bodyId: v.optional(v.string()),
    levelId: v.optional(v.string()),
    seriesId: v.optional(v.string()),
    subjectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);
    const { table, row } = await locate(ctx, args);
    const { count: inUseCount } = await countActiveEnrolments(ctx, args);

    await ctx.db.patch(row._id, {
      state: 'active' as const,
      retiredAt: undefined,
      retiredBy: undefined,
    });
    await auditCatalogue(ctx, admin, 'catalogue.unretire', table, row._id, {
      entity: args.entity,
      ref: describeEntity(args),
      countryCode: args.countryCode,
      bodyId: args.bodyId,
      levelId: args.levelId,
      seriesId: args.seriesId,
      subjectId: args.subjectId,
      inUseCount,
    });
    return { inUseCount };
  },
});

/** How many active enrolments an entry has, for the admin screen's confirm step. */
export const inUseCount = query({
  args: {
    entity: entityValidator,
    countryCode: v.optional(v.string()),
    bodyId: v.optional(v.string()),
    levelId: v.optional(v.string()),
    seriesId: v.optional(v.string()),
    subjectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    // Same bounded counting rule as the mutation, read-only. `atLeast` says the
    // read cap was hit and the number is a floor.
    return countActiveEnrolments(ctx, args);
  },
});

// ---------------------------------------------------------------------------
// Seed and export — the git-reviewable half
// ---------------------------------------------------------------------------

const seedDoc = v.object({
  countries: v.array(
    v.object({
      code: v.string(),
      title: v.string(),
      note: v.optional(v.string()),
      sortOrder: v.number(),
      state: v.optional(catalogueStateValidator),
    })
  ),
  bodies: v.array(
    v.object({
      bodyId: v.string(),
      title: v.string(),
      shortTitle: v.string(),
      hint: v.string(),
      sortOrder: v.number(),
      state: v.optional(catalogueStateValidator),
    })
  ),
  countryBodies: v.array(
    v.object({
      countryCode: v.string(),
      bodyId: v.string(),
      levelIds: v.optional(v.array(v.string())),
      note: v.optional(v.string()),
      sortOrder: v.number(),
      state: v.optional(catalogueStateValidator),
    })
  ),
  levels: v.array(
    v.object({
      bodyId: v.string(),
      levelId: v.string(),
      title: v.string(),
      hint: v.optional(v.string()),
      sortOrder: v.number(),
      state: v.optional(catalogueStateValidator),
    })
  ),
  series: v.array(
    v.object({
      bodyId: v.string(),
      levelId: v.optional(v.string()),
      seriesId: v.string(),
      title: v.string(),
      examMonth: v.number(),
      note: v.optional(v.string()),
      sortOrder: v.number(),
      state: v.optional(catalogueStateValidator),
    })
  ),
  subjects: v.array(
    v.object({
      bodyId: v.string(),
      levelId: v.string(),
      subjectId: v.string(),
      code: v.optional(v.string()),
      title: v.string(),
      sortOrder: v.number(),
      state: v.optional(catalogueStateValidator),
      availabilityOverride: v.optional(availabilityValidator),
      overrideReason: v.optional(v.string()),
    })
  ),
});

/**
 * Bootstrap the tables from the repo JSON.
 *
 * INSERT-ONLY BY DEFAULT. Re-running fills gaps and touches nothing that already
 * exists, because after the first seed the tables are the source of truth and a
 * seed that overwrote them would silently undo an admin's edit the next time
 * anyone ran it. `patchExisting: true` is the deliberate "the file wins" switch,
 * for restoring a deployment from the reviewed file.
 *
 * Nothing is ever retired here: a board added through the admin UI is absent from
 * the file by definition, and must not be read as deleted.
 *
 * Internal by design — run it with
 * `node scripts/seed-exam-catalogue.mjs`.
 */
export const seed = internalMutation({
  args: { doc: seedDoc, patchExisting: v.optional(v.boolean()) },
  handler: async (ctx, { doc, patchExisting }) => {
    const now = Date.now();
    const report = { inserted: 0, patched: 0, skipped: 0 };
    const put = async (
      existing: { _id: any } | null,
      table: any,
      fields: Record<string, unknown>
    ) => {
      if (existing) {
        if (patchExisting) {
          // `state` is NEVER patched onto an existing row. Retirement is a
          // decision with a confirmation step (`retire` refuses while students
          // are sitting it), an actor and an audit row; letting a file restore
          // flip it would route around all three and leave `retiredAt` /
          // `retiredBy` disagreeing with `state`. The file wins on what a row
          // SAYS; `retire` / `unretire` stay the only way to change whether it
          // is offered. `state` on a seed row still applies on INSERT, where
          // there is no decision to overwrite.
          const { state: _ignoredState, ...patchable } = fields;
          await ctx.db.patch(existing._id, patchable);
          report.patched++;
        } else {
          report.skipped++;
        }
        return;
      }
      await ctx.db.insert(table, { ...fields, createdAt: now });
      report.inserted++;
    };

    for (const c of doc.countries) {
      const existing = await ctx.db
        .query('catalogueCountries')
        .withIndex('by_code', (q) => q.eq('code', c.code))
        .unique();
      await put(existing, 'catalogueCountries', {
        code: c.code,
        title: c.title,
        note: c.note,
        sortOrder: c.sortOrder,
        state: c.state ?? 'active',
      });
    }
    for (const b of doc.bodies) {
      const existing = await ctx.db
        .query('catalogueBodies')
        .withIndex('by_body', (q) => q.eq('bodyId', b.bodyId))
        .unique();
      await put(existing, 'catalogueBodies', {
        bodyId: b.bodyId,
        title: b.title,
        shortTitle: b.shortTitle,
        hint: b.hint,
        sortOrder: b.sortOrder,
        state: b.state ?? 'active',
      });
    }
    for (const l of doc.levels) {
      const existing = await ctx.db
        .query('catalogueLevels')
        .withIndex('by_body_level', (q) =>
          q.eq('bodyId', l.bodyId).eq('levelId', l.levelId)
        )
        .unique();
      await put(existing, 'catalogueLevels', {
        bodyId: l.bodyId,
        levelId: l.levelId,
        title: l.title,
        hint: l.hint,
        sortOrder: l.sortOrder,
        state: l.state ?? 'active',
      });
    }
    for (const j of doc.countryBodies) {
      const existing = await ctx.db
        .query('catalogueCountryBodies')
        .withIndex('by_country_body', (q) =>
          q.eq('countryCode', j.countryCode).eq('bodyId', j.bodyId)
        )
        .unique();
      await put(existing, 'catalogueCountryBodies', {
        countryCode: j.countryCode,
        bodyId: j.bodyId,
        levelIds: j.levelIds,
        note: j.note,
        sortOrder: j.sortOrder,
        state: j.state ?? 'active',
      });
    }
    for (const s of doc.series) {
      const existing = await ctx.db
        .query('catalogueSeries')
        .withIndex('by_body_level', (q) =>
          q.eq('bodyId', s.bodyId).eq('levelId', s.levelId).eq('seriesId', s.seriesId)
        )
        .unique();
      await put(existing, 'catalogueSeries', {
        bodyId: s.bodyId,
        levelId: s.levelId,
        seriesId: s.seriesId,
        title: s.title,
        examMonth: s.examMonth,
        note: s.note,
        sortOrder: s.sortOrder,
        state: s.state ?? 'active',
      });
    }
    for (const s of doc.subjects) {
      const existing = await ctx.db
        .query('catalogueSubjects')
        .withIndex('by_body_level_subject', (q) =>
          q
            .eq('bodyId', s.bodyId)
            .eq('levelId', s.levelId)
            .eq('subjectId', s.subjectId)
        )
        .unique();
      await put(existing, 'catalogueSubjects', {
        bodyId: s.bodyId,
        levelId: s.levelId,
        subjectId: s.subjectId,
        code: s.code,
        title: s.title,
        sortOrder: s.sortOrder,
        state: s.state ?? 'active',
        availabilityOverride: s.availabilityOverride,
        overrideReason: s.overrideReason,
      });
    }
    return report;
  },
});

/**
 * The live catalogue, in the seed file's own shape, for
 * `scripts/export-exam-catalogue.mjs` to write back into the repo.
 *
 * This is what keeps a runtime-editable board list reviewable: the diff between
 * two exports is the diff between two catalogues, and a ZIMSEC subject code typed
 * wrong in the admin screen shows up in a pull request rather than on an entry slip.
 */
export const exportAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    const sortRows = <T extends { sortOrder: number; title: string }>(rows: T[]) =>
      rows.sort((a, b) => a.sortOrder - b.sortOrder || a.title.localeCompare(b.title));
    const strip = <T extends Record<string, unknown>>(row: T) => {
      const out: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(row)) {
        if (key.startsWith('_') || value === undefined) continue;
        out[key] = value;
      }
      delete out.createdAt;
      // WHO did something and WHEN are Convex and audit-log facts, not repo
      // facts: exporting a user id into a committed file puts an identifier in
      // git, and a timestamp would churn the diff without saying anything the
      // audit log does not. The reviewable part is WHAT the catalogue now says.
      // Dropping them also keeps the file round-trippable through `seed --patch`,
      // whose validator takes exactly the fields it can write.
      delete out.overrideBy;
      delete out.overrideAt;
      delete out.retiredBy;
      delete out.retiredAt;
      return out;
    };

    return {
      countries: sortRows(await ctx.db.query('catalogueCountries').collect()).map(strip),
      bodies: sortRows(await ctx.db.query('catalogueBodies').collect()).map(strip),
      countryBodies: (await ctx.db.query('catalogueCountryBodies').collect())
        .sort(
          (a, b) =>
            a.countryCode.localeCompare(b.countryCode) ||
            a.sortOrder - b.sortOrder ||
            a.bodyId.localeCompare(b.bodyId)
        )
        .map(strip),
      levels: sortRows(await ctx.db.query('catalogueLevels').collect()).map(strip),
      series: sortRows(await ctx.db.query('catalogueSeries').collect()).map(strip),
      subjects: sortRows(await ctx.db.query('catalogueSubjects').collect()).map(strip),
    };
  },
});
