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

import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import type { Doc, Id } from './_generated/dataModel';
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
 *
 * WHY THIS IS PAGINATED RATHER THAN `.take(20)`. A fixed newest-20 window with
 * no way to reach page two is not a history, it is a buffer — and it is a buffer
 * an admin can flush. Reveal the submission you actually wanted, grant twenty
 * more, and the notice that mattered falls off the end of the only page the
 * student can see, while the page goes on telling them "every such look-up" is
 * listed. That defeats the control: §11 says notification is what makes the
 * audit log a control rather than a record nobody reads, and a notice nobody can
 * reach is not a notification. The history is now complete and reachable.
 */
type RevealNoticeView = {
  id: Id<'revealNotices'>;
  trigger: Doc<'revealNotices'>['trigger'];
  grantedAt: number;
  createdAt: number;
  seenAt: number | null;
  about: 'you' | 'student';
};

export const revealNotices = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const empty: {
      page: RevealNoticeView[];
      isDone: boolean;
      continueCursor: string;
    } = { page: [], isDone: true, continueCursor: '' };

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return empty;

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
      .unique();
    if (!user || user.erasedAt) return empty;

    const result = await ctx.db
      .query('revealNotices')
      .withIndex('by_recipient', (q) => q.eq('recipientId', user._id))
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      ...result,
      page: result.page.map((n) => ({
        id: n._id,
        trigger: n.trigger,
        grantedAt: n.grantedAt,
        createdAt: n.createdAt,
        seenAt: n.seenAt ?? null,
        about: n.recipientRole === 'student' ? ('you' as const) : ('student' as const),
      })),
    };
  },
});

/**
 * Stamp `seenAt` on notices the recipient has actually had rendered to them.
 *
 * The field was declared as "stamped when the recipient opens their account page
 * and sees it" and nothing ever wrote it, which is worse than not having it: a
 * reader of the schema — or of a subject access request built from it — would
 * take a blank `seenAt` to mean the notice went unread, when it only ever meant
 * nobody was recording. Either write it or drop it. It is worth writing: "told"
 * and "read it" are two different facts about the same §11 obligation.
 *
 * Only the recipient can stamp their own, only from unset to set, and the
 * timestamp is the server's.
 */
export const markRevealNoticesSeen = mutation({
  args: { ids: v.array(v.id('revealNotices')) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query('users')
      .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
      .unique();
    if (!user || user.erasedAt) return 0;

    const now = Date.now();
    let stamped = 0;
    for (const id of args.ids.slice(0, 100)) {
      const notice = await ctx.db.get(id);
      // Somebody else's notice, or one already stamped: silently skipped. The
      // first is not the caller's to read, the second is not theirs to re-date.
      if (!notice || notice.recipientId !== user._id || notice.seenAt) continue;
      await ctx.db.patch(id, { seenAt: now });
      stamped++;
    }
    return stamped;
  },
});
