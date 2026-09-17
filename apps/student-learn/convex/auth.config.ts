/**
 * Which token issuers Convex will trust.
 *
 * `applicationID` must match the `aud` claim of the Clerk JWT template named
 * `convex` — see §4 of briefs/PLAN-marking-platform.md. Convex verifies the
 * token against the issuer's public keys; `convex/lib/auth.ts` then re-derives
 * the user's role from the `users` table, never from the token's metadata.
 *
 * CLERK_JWT_ISSUER_DOMAIN is set per-deployment (`npx convex env set`), so the
 * production deployment points at the production Clerk instance without a code
 * change.
 */
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: 'convex',
    },
  ],
};
