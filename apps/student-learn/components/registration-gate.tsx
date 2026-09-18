'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConvexAuth, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

/**
 * The client half of route guarding. Middleware establishes *that* someone is
 * signed in; this establishes whether they finished registering, by asking
 * Convex — which is the only place that knows, because the `users` row is the
 * answer and Clerk has never heard of it.
 *
 * No role logic lives here or in middleware. This is a redirect, not a gate: the
 * Convex function behind every page refuses independently (convex/lib/auth.ts),
 * so a hand-rolled fetch past this component gets nothing.
 */
export function RegistrationGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const status = useQuery(api.session.status, isAuthenticated ? {} : 'skip');

  const needsOnboarding = status?.signedIn && !status.registered;
  // `/study` is not in middleware's protected list, and it should not be —
  // studying is free and the syllabus is public. But the study HOME is a reading
  // of one person's enrolment, so an anonymous visitor who lands on it has to be
  // sent to sign in rather than left on "One moment…" forever, which is what the
  // waiting state used to do for every unauthenticated caller.
  const needsSignIn = !isLoading && !isAuthenticated;

  useEffect(() => {
    if (needsSignIn) router.replace('/sign-in');
    else if (needsOnboarding) router.replace('/onboarding');
  }, [needsSignIn, needsOnboarding, router]);

  if (isLoading || !isAuthenticated || status === undefined || needsOnboarding) {
    return <GateWaiting />;
  }

  return <>{children}</>;
}

export function GateWaiting() {
  return (
    <div
      className="flex min-h-screen items-center justify-center text-sm text-ink-muted"
      role="status"
      aria-live="polite"
    >
      One moment…
    </div>
  );
}
