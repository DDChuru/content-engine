import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

/**
 * Study is free and anonymous (§1 of briefs/PLAN-marking-platform.md): notes,
 * videos and the ink pages never require an account. Only the surfaces that
 * carry identity or money are gated here.
 *
 * Role is NOT checked here. Middleware only establishes *who* is asking; every
 * Convex function re-derives the caller's role server-side from the `users`
 * table (convex/lib/auth.ts), so a tampered client cannot promote itself.
 */
const isProtected = createRouteMatcher([
  '/submit(.*)',
  '/teacher(.*)',
  '/admin(.*)',
  '/account(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export const config = {
  matcher: [
    // Skip static files and Next internals, run on everything else.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)',
    '/(api|trpc)(.*)',
  ],
};
