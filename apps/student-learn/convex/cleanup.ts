/**
 * Erasing test accounts from a deployment before real students arrive.
 *
 * This is deliberately NOT in `migrations.ts`: a migration reshapes data that is
 * meant to survive, this destroys rows. Keeping the destructive verb in its own
 * file is what makes `grep -rln "ctx.db.delete" convex/` a short, readable list.
 *
 * Every function here is `internalQuery`/`internalMutation` — there is no client
 * path to any of it, and there must never be one. The product's position on
 * deletion is the opposite of this file (see schema.ts: catalogue rows are
 * retired, marks and audit rows are append-only, a §11.5 erasure SCRUBS a user in
 * place so the audit trail survives). That position is about real people's real
 * work. It does not apply to seed rows from a build that never had a person
 * behind it, and pretending it does just means launching with fake students in
 * the table.
 *
 * Every join is spelled out by hand rather than looped over a table name. A
 * generic helper here does not typecheck against Convex's index builders without
 * casting the argument away — and a cast is exactly the wrong thing to reach for
 * in the one file that deletes rows, because the compiler checking that
 * `studentProgress` really is indexed by `studentId` is most of the safety there
 * is. Adding a table to this list should be a visible edit.
 *
 * Dry-run first, always:
 *   npx convex run cleanup:auditUsers '{}'
 *   npx convex run cleanup:eraseTestStudents '{"authSubjects":["..."],"confirm":"ERASE","dryRun":true}'
 */

import { internalMutation, internalQuery } from './_generated/server';
import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

/** Everything that joins back to one user, counted. Reads only. */
async function countFor(ctx: QueryCtx, studentId: Id<'users'>) {
  const n = (rows: { length: number }) => rows.length;
  return {
    enrolments: n(
      await ctx.db
        .query('enrolments')
        .withIndex('by_student_created', (q) => q.eq('studentId', studentId))
        .collect()
    ),
    studentProgress: n(
      await ctx.db
        .query('studentProgress')
        .withIndex('by_student', (q) => q.eq('studentId', studentId))
        .collect()
    ),
    subjectDemand: n(
      await ctx.db
        .query('subjectDemand')
        .withIndex('by_student', (q) => q.eq('studentId', studentId))
        .collect()
    ),
    guardianLinks: n(
      await ctx.db
        .query('guardianLinks')
        .withIndex('by_student', (q) => q.eq('studentId', studentId))
        .collect()
    ),
    submissions: n(
      await ctx.db
        .query('submissions')
        .withIndex('by_student', (q) => q.eq('studentId', studentId))
        .collect()
    ),
    prescriptions: n(
      await ctx.db
        .query('prescriptions')
        .withIndex('by_student_created', (q) => q.eq('studentId', studentId))
        .collect()
    ),
    // The ledger keys on who HOLDS the credit and who it is spent on, not on a
    // `studentId` — a guardian buys, a student burns. Both sides are checked,
    // because either one means money touched this account.
    creditLedgerHeld: n(
      await ctx.db
        .query('creditLedger')
        .withIndex('by_holder_created', (q) => q.eq('holderId', studentId))
        .collect()
    ),
    creditLedgerBeneficiary: n(
      await ctx.db
        .query('creditLedger')
        .withIndex('by_beneficiary_created', (q) => q.eq('beneficiaryId', studentId))
        .collect()
    ),
  };
}

/**
 * Who is in `users`, and what hangs off each of them. Read this before erasing.
 *
 * It reports a first name, the role, the creation time and the row counts. That
 * is the minimum needed to tell a seed row from a person, and deliberately not
 * the contact details, which would put real students' emails into a terminal log
 * for no gain.
 */
export const auditUsers = internalQuery({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    const rows = [];
    for (const u of users) {
      rows.push({
        id: u._id,
        firstName: u.firstName,
        role: u.role,
        /** The handle `eraseTestStudents` takes. Opaque, and not a credential. */
        authSubject: u.authSubject,
        createdAt: new Date(u.createdAt).toISOString(),
        erasedAt: u.erasedAt ? new Date(u.erasedAt).toISOString() : null,
        counts: await countFor(ctx, u._id),
      });
    }
    return { total: users.length, users: rows };
  },
});

/**
 * Hard-delete a named set of test students and everything that joins to them.
 *
 * Addressed by `authSubject`, never by first name and never by "everyone except
 * these three". Both of those are the same bug — a fuzzy predicate run against a
 * live table, where a rename or a signup between the audit and the run silently
 * changes which rows match. An explicit list of opaque identifiers can only ever
 * delete what the operator read in the audit a moment earlier.
 *
 * REFUSES a user who is not a student, and any user carrying a `submissions` or
 * `creditLedger` row: those mean money, or a real piece of a child's work, passed
 * through this account, and such an account is not test data whatever it is
 * called. The refusal is reported, not thrown, so one bad id does not strand a
 * batch half-done.
 */
export const eraseTestStudents = internalMutation({
  args: {
    authSubjects: v.array(v.string()),
    /** Must be the literal string "ERASE". A mistyped argument should do nothing. */
    confirm: v.string(),
    /** Report what would go; delete nothing. */
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, { authSubjects, confirm, dryRun }) => {
    if (confirm !== 'ERASE') {
      throw new Error('Refusing: pass confirm:"ERASE" to actually delete rows.');
    }

    const erased: Array<{
      authSubject: string;
      firstName: string;
      deleted: Record<string, number>;
    }> = [];
    const skipped: Array<{ authSubject: string; reason: string }> = [];

    for (const authSubject of authSubjects) {
      const user = await ctx.db
        .query('users')
        .withIndex('by_auth_subject', (q) => q.eq('authSubject', authSubject))
        .unique();

      if (!user) {
        skipped.push({ authSubject, reason: 'no such user' });
        continue;
      }
      if (user.role !== 'student') {
        skipped.push({ authSubject, reason: `role is ${user.role}, not student` });
        continue;
      }

      const counts = await countFor(ctx, user._id);
      if (
        counts.submissions > 0 ||
        counts.creditLedgerHeld > 0 ||
        counts.creditLedgerBeneficiary > 0
      ) {
        skipped.push({
          authSubject,
          reason: 'has submissions or a credit ledger — this is not test data',
        });
        continue;
      }

      const deleted = await purgeJoins(ctx, user._id, Boolean(dryRun));
      deleted.users = 1;
      if (!dryRun) await ctx.db.delete(user._id);

      erased.push({ authSubject, firstName: user.firstName, deleted });
    }

    return { dryRun: Boolean(dryRun), erased, skipped };
  },
});

/** The joins, deleted child-first so nothing is left pointing at a missing user. */
async function purgeJoins(
  ctx: MutationCtx,
  studentId: Id<'users'>,
  dryRun: boolean
): Promise<Record<string, number>> {
  const enrolments = await ctx.db
    .query('enrolments')
    .withIndex('by_student_created', (q) => q.eq('studentId', studentId))
    .collect();
  const progress = await ctx.db
    .query('studentProgress')
    .withIndex('by_student', (q) => q.eq('studentId', studentId))
    .collect();
  const demand = await ctx.db
    .query('subjectDemand')
    .withIndex('by_student', (q) => q.eq('studentId', studentId))
    .collect();
  const links = await ctx.db
    .query('guardianLinks')
    .withIndex('by_student', (q) => q.eq('studentId', studentId))
    .collect();
  const prescriptions = await ctx.db
    .query('prescriptions')
    .withIndex('by_student_created', (q) => q.eq('studentId', studentId))
    .collect();

  if (!dryRun) {
    for (const r of [...enrolments, ...progress, ...demand, ...links, ...prescriptions]) {
      await ctx.db.delete(r._id);
    }
  }

  return {
    enrolments: enrolments.length,
    studentProgress: progress.length,
    subjectDemand: demand.length,
    guardianLinks: links.length,
    prescriptions: prescriptions.length,
  };
}
