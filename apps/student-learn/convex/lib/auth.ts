/**
 * Server-side role derivation. THE single entry point for "who is calling".
 *
 * PLAN §4: "Roles live in Convex, not only in Clerk metadata, and every function
 * re-derives role server-side. Never trust a client claim."
 *
 * Concretely that means:
 *  - We read `ctx.auth.getUserIdentity()`, which Convex validates against the Clerk
 *    JWKS. We use ONLY the `subject` claim from it. We deliberately ignore
 *    `identity.role`, `publicMetadata` and every other custom claim, because those
 *    are set in a dashboard/webhook path that is not this database.
 *  - We then look the `users` row up by `authSubject` and use ITS `role` field.
 *  - Capability checks are on state, not role: a teacher may claim work only if
 *    `verifiedAt` is set and `suspendedAt` is not. Role alone grants nothing.
 *
 * No mutation in this codebase may accept a `role`, `userId`, `studentId` or
 * `teacherId` argument from the client. If you find one, it is a bug.
 */

import type { QueryCtx, MutationCtx } from '../_generated/server';
import type { Doc, Id } from '../_generated/dataModel';

export type Ctx = QueryCtx | MutationCtx;
export type Role = Doc<'users'>['role'];

export class AuthError extends Error {}

/** The authenticated `users` row, or throws. Never returns a client-supplied shape. */
export async function requireUser(ctx: Ctx): Promise<Doc<'users'>> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new AuthError('Not signed in.');

  const user = await ctx.db
    .query('users')
    .withIndex('by_auth_subject', (q) => q.eq('authSubject', identity.subject))
    .unique();

  if (!user) throw new AuthError('No account for this identity.');
  if (user.erasedAt) throw new AuthError('Account closed.');
  return user;
}

export async function requireRole(
  ctx: Ctx,
  ...roles: Role[]
): Promise<Doc<'users'>> {
  const user = await requireUser(ctx);
  if (!roles.includes(user.role)) {
    // Deliberately uninformative: do not tell a caller what role would have worked.
    throw new AuthError('Not permitted.');
  }
  return user;
}

/** Teacher AND verified AND not suspended. The only gate the claim queue accepts. */
export async function requireVerifiedTeacher(ctx: Ctx): Promise<Doc<'users'>> {
  const user = await requireRole(ctx, 'teacher');
  if (!user.verifiedAt) throw new AuthError('Teacher account not yet verified.');
  if (user.suspendedAt) throw new AuthError('Teacher account suspended.');
  if (!user.teacherCode) throw new AuthError('Teacher account incomplete.');
  return user;
}

export async function requireAdmin(ctx: Ctx): Promise<Doc<'users'>> {
  return requireRole(ctx, 'admin');
}

/** Append-only audit write. Every privileged action calls this (§11). */
export async function audit(
  ctx: MutationCtx,
  entry: {
    action: string;
    actor: Doc<'users'>;
    targetTable: string;
    targetId: string;
    candidateCode?: string;
    metadata?: Record<string, unknown>;
  }
): Promise<Id<'auditLog'>> {
  return ctx.db.insert('auditLog', {
    action: entry.action,
    actorId: entry.actor._id,
    actorRole: entry.actor.role,
    targetTable: entry.targetTable,
    targetId: entry.targetId,
    candidateCode: entry.candidateCode,
    metadata: entry.metadata ? JSON.stringify(entry.metadata) : undefined,
    at: Date.now(),
  });
}
