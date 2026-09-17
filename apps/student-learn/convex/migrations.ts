/**
 * One-shot data migrations. Internal only — nothing here is client-reachable.
 *
 * Run with: `npx convex run migrations:backfillEnrolments '{}'`
 */

import { internalMutation } from './_generated/server';
import { v } from 'convex/values';
import { DEFAULT_MIGRATION_TARGET, findSubject } from '../lib/exam-catalogue';

/**
 * `users.yearGroup` held a bare year string ("2027") and nothing else — no body,
 * no level, no series, no subjects. There is not enough information in it to
 * reconstruct a real enrolment, so this does the only honest thing available:
 *
 *  - keeps the year the student actually gave,
 *  - fills body/level/series from the one combination the app has content for
 *    (Cambridge A Level, October/November), which is also the only combination
 *    these two seeded test rows could have meant,
 *  - enrols them in the one subject that exists (9709 Mathematics),
 *  - clears `yearGroup` so no second, contradictory copy of the answer survives.
 *
 * It is a backfill of two hand-made rows, not a general inference rule. If this
 * ever has to run against real users, ask them instead of guessing for them.
 */
export const backfillEnrolments = internalMutation({
  args: {
    dryRun: v.optional(v.boolean()),
    /**
     * Delete and rewrite enrolments this migration created. Needed because the
     * first run wrote a session series that the catalogue no longer has —
     * Cambridge's series is "November", not "October/November". Safe only while
     * every enrolment in the table came from this script.
     */
    redo: v.optional(v.boolean()),
  },
  handler: async (ctx, { dryRun, redo }) => {
    const students = await ctx.db
      .query('users')
      .withIndex('by_role', (q) => q.eq('role', 'student'))
      .collect();

    const report: {
      userId: string;
      firstName: string;
      from: string | null;
      to: string | null;
      action: string;
    }[] = [];

    for (const user of students) {
      // The column is gone from the schema; a row restored from a pre-migration
      // snapshot may still carry it, so read it defensively rather than typed.
      const legacyYear = (user as unknown as { yearGroup?: string }).yearGroup;
      if (redo && !dryRun) {
        for (const row of await ctx.db
          .query('subjectDemand')
          .withIndex('by_student', (q) => q.eq('studentId', user._id))
          .collect()) {
          await ctx.db.delete(row._id);
        }
        for (const row of await ctx.db
          .query('enrolments')
          .withIndex('by_student_created', (q) => q.eq('studentId', user._id))
          .collect()) {
          await ctx.db.delete(row._id);
        }
      }

      const existing = await ctx.db
        .query('enrolments')
        .withIndex('by_student_status', (q) =>
          q.eq('studentId', user._id).eq('status', 'active')
        )
        .first();
      if (existing) {
        report.push({
          userId: user._id,
          firstName: user.firstName,
          from: legacyYear ?? null,
          to: existing.sessionId,
          action: 'skipped — already enrolled',
        });
        continue;
      }

      const year = Number(legacyYear);
      const sessionYear = Number.isFinite(year) && year > 2000
        ? year
        : new Date().getFullYear() + 1;
      const { bodyId, levelId, series, subjectIds } = DEFAULT_MIGRATION_TARGET;
      const sessionId = `${sessionYear}-${series}`;

      const subjects = subjectIds.map((subjectId) => {
        const found = findSubject(bodyId, levelId, subjectId);
        if (!found) throw new Error(`Migration target subject missing: ${subjectId}`);
        return {
          subjectId: found.id,
          code: found.code,
          title: found.title,
          availability: found.availability,
        };
      });

      const now = Date.now();
      if (!dryRun) {
        const enrolmentId = await ctx.db.insert('enrolments', {
          studentId: user._id,
          bodyId,
          levelId,
          sessionId,
          sessionYear,
          sessionSeries: series,
          subjects,
          status: 'active',
          createdAt: now,
        });
        for (const s of subjects) {
          await ctx.db.insert('subjectDemand', {
            studentId: user._id,
            enrolmentId,
            bodyId,
            levelId,
            sessionId,
            subjectId: s.subjectId,
            subjectCode: s.code,
            subjectTitle: s.title,
            wasAvailable: s.availability === 'available',
            availability: s.availability,
            createdAt: now,
          });
        }
        // Clear the old field rather than leave two answers to one question.
        await ctx.db.patch(user._id, {
          yearGroup: undefined,
        } as unknown as Record<string, never>);
      }

      report.push({
        userId: user._id,
        firstName: user.firstName,
        from: legacyYear ?? null,
        to: sessionId,
        action: dryRun ? 'would migrate' : 'migrated',
      });
    }

    return report;
  },
});
