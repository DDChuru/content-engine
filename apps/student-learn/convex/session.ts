/**
 * Session-shaped reads for the registration flow.
 *
 * `identity.me` throws (`AuthError`) when there is no `users` row, which is the
 * right shape for a mutation guard and the wrong shape for a route guard: the
 * *absence* of a row is the normal, expected state of someone who just signed up
 * and has not finished onboarding. A throwing query turns that into a client-side
 * error boundary. So these queries answer the same question without throwing.
 *
 * They read identity the same way everything else does — `ctx.auth.getUserIdentity()`
 * for the verified `subject` claim only, then the `users` row for role. Nothing here
 * accepts a role, a `userId` or any other identity assertion from the client.
 */

import { query } from './_generated/server';
import { describeEnrolment } from './lib/catalogue';

/**
 * Who is calling, and how far through registration are they.
 *
 * `signedIn:false`  → no verified Clerk token reached Convex.
 * `registered:false` → signed in, but no `users` row yet: send them to onboarding.
 */
export const status = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { signedIn: false as const, registered: false as const, user: null };
    }

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
      .unique();

    if (!user || user.erasedAt) {
      return { signedIn: true as const, registered: false as const, user: null };
    }

    // The active sitting, if any. A guardian has none; a student always has one
    // after `registerSelf`, and may have superseded rows behind it.
    const enrolment =
      user.role === 'student'
        ? await ctx.db
            .query('enrolments')
            .withIndex('by_student_status', (q) =>
              q.eq('studentId', user._id).eq('status', 'active')
            )
            .first()
        : null;

    return {
      signedIn: true as const,
      registered: true as const,
      user: {
        role: user.role,
        firstName: user.firstName,
        enrolment: enrolment
          ? {
              countryCode: enrolment.countryCode ?? null,
              // Built here, from the catalogue tables, rather than in the client:
              // the board and level titles are Convex data now, and a page that
              // rebuilt the label locally would need the whole catalogue to do it.
              label: await describeEnrolment(ctx, enrolment),
              bodyId: enrolment.bodyId,
              levelId: enrolment.levelId,
              sessionId: enrolment.sessionId,
              sessionYear: enrolment.sessionYear,
              sessionSeries: enrolment.sessionSeries,
              subjects: enrolment.subjects,
            }
          : null,
        ageBand: user.ageBand ?? null,
        country: user.country ?? null,
        // A minor is anyone who has not declared 18plus. Undefined is treated as
        // a minor deliberately: the cautious branch is the safe one.
        isMinor: user.ageBand !== '18plus',
        createdAt: user.createdAt,
      },
    };
  },
});

/**
 * The guardian-link state of the caller, from whichever side they stand on.
 *
 * A student sees their own codes in full — they generated them and have to read
 * one out. A guardian sees only the first name of a student they have already
 * linked to, which is exactly what `redeemGuardianLinkCode` told them at the time
 * (REGISTRATION-AND-ROLES.md §1). Neither side can ask about anybody else.
 */
export const guardianState = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
      .unique();
    if (!user || user.erasedAt) return null;

    const now = Date.now();

    if (user.role === 'student') {
      const links = await ctx.db
        .query('guardianLinks')
        .withIndex('by_student', (q) => q.eq('studentId', user._id))
        .collect();

      const codes = [];
      for (const l of links.slice().sort((a, b) => b.createdAt - a.createdAt)) {
        // WHO redeemed it. The student could previously see only that *someone*
        // had, which makes a mistakenly-shared code neither identifiable nor
        // — now that `revokeGuardianLink` exists — targetable. First name and
        // nothing else: it is what the guardian already gave, it is what the
        // student needs to recognise their own parent, and a contact address
        // would hand a route from the platform to an adult that §11.1 refuses.
        const guardian = l.guardianId ? await ctx.db.get(l.guardianId) : null;
        codes.push({
          // The id is needed to revoke. It is an opaque handle to a row this
          // student owns; `revokeGuardianLink` re-checks that they are a party
          // to it rather than trusting the argument.
          linkId: l._id,
          code: l.linkCode,
          createdAt: l.createdAt,
          expiresAt: l.expiresAt,
          redeemedAt: l.redeemedAt ?? null,
          revokedAt: l.revokedAt ?? null,
          guardianFirstName: guardian ? (guardian.firstName ?? null) : null,
          /** null until redeemed. `self_declared` is the honest answer, shown. */
          assuranceLevel: l.assuranceLevel ?? null,
          attestedAt: l.guardianAttestedAt ?? null,
          state: l.revokedAt
            ? ('revoked' as const)
            : l.redeemedAt
              ? ('redeemed' as const)
              : l.expiresAt < now
                ? ('expired' as const)
                : ('open' as const),
        });
      }

      return {
        side: 'student' as const,
        linked: links.some((l) => l.redeemedAt && !l.revokedAt),
        codes,
      };
    }

    if (user.role === 'guardian') {
      const links = await ctx.db
        .query('guardianLinks')
        .withIndex('by_guardian', (q) => q.eq('guardianId', user._id))
        .collect();

      const students = [];
      for (const l of links) {
        if (l.revokedAt) continue;
        const student = await ctx.db.get(l.studentId);
        students.push({
          linkId: l._id,
          firstName: student?.firstName ?? '[erased]',
          redeemedAt: l.redeemedAt ?? null,
          mirrorDisclosedAt: l.mirrorDisclosedAt ?? null,
          assuranceLevel: l.assuranceLevel ?? null,
          attestedAt: l.guardianAttestedAt ?? null,
        });
      }
      return { side: 'guardian' as const, linked: students.length > 0, students };
    }

    return { side: 'other' as const, linked: false };
  },
});

/**
 * §11 — "student and guardian told within 24 hours naming the trigger".
 *
 * This is the reading end of that. The notice names the trigger and the date and
 * nothing else: not the admin, not the reason text, not the submission. The
 * student is entitled to know their identity was looked at and why in the
 * enumerated sense; the free-text reason can name a third party in a
 * safeguarding case and is not theirs to read.
 */
export const revealNotices = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
      .unique();
    if (!user || user.erasedAt) return [];

    const notices = await ctx.db
      .query('revealNotices')
      .withIndex('by_recipient', (q) => q.eq('recipientId', user._id))
      .order('desc')
      .take(20);

    return notices.map((n) => ({
      id: n._id,
      trigger: n.trigger,
      grantedAt: n.grantedAt,
      createdAt: n.createdAt,
      about: n.recipientRole === 'student' ? ('you' as const) : ('student' as const),
    }));
  },
});
