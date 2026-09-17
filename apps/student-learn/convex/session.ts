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

    return {
      signedIn: true as const,
      registered: true as const,
      user: {
        role: user.role,
        firstName: user.firstName,
        yearGroup: user.yearGroup ?? null,
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

      return {
        side: 'student' as const,
        linked: links.some((l) => l.redeemedAt && !l.revokedAt),
        codes: links
          .slice()
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((l) => ({
            code: l.linkCode,
            createdAt: l.createdAt,
            expiresAt: l.expiresAt,
            redeemedAt: l.redeemedAt ?? null,
            revokedAt: l.revokedAt ?? null,
            state: l.revokedAt
              ? ('revoked' as const)
              : l.redeemedAt
                ? ('redeemed' as const)
                : l.expiresAt < now
                  ? ('expired' as const)
                  : ('open' as const),
          })),
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
          firstName: student?.firstName ?? '[erased]',
          redeemedAt: l.redeemedAt ?? null,
          mirrorDisclosedAt: l.mirrorDisclosedAt ?? null,
        });
      }
      return { side: 'guardian' as const, linked: students.length > 0, students };
    }

    return { side: 'other' as const, linked: false };
  },
});
