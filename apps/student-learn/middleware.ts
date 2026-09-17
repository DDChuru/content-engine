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
  '/onboarding(.*)',
  '/guardian(.*)',
]);

export default clerkMiddleware(
  async (auth, req) => {
    // Redirect to our own sign-in page. Without an explicit signInUrl the
    // middleware has nowhere to send an anonymous visitor and answers 404, which
    // reads as a broken link rather than as "you need an account".
    if (isProtected(req)) {
      await auth.protect({
        unauthenticatedUrl: new URL('/sign-in', req.url).toString(),
      });
    }
  },
  { signInUrl: '/sign-in', signUpUrl: '/sign-up' }
);

export const config = {
  matcher: [
    // Skip static files and Next internals, run on everything else.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4)).*)',
    '/(api|trpc)(.*)',
  ],
};
