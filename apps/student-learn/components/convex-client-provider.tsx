'use client';

import { ReactNode } from 'react';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { useAuth } from '@clerk/nextjs';
import { ErrorBoundary } from '@/components/error-boundary';

// One client for the browser session. Convex asks Clerk for a token from the
// JWT template named `convex`; see convex/auth.config.ts.
//
// Constructed defensively rather than with `!`. A missing or malformed
// NEXT_PUBLIC_CONVEX_URL — the single easiest Vercel misconfiguration, because it
// is inlined at BUILD time and a preview deployment built without it is silently
// broken — used to throw here, at module scope, where no boundary can catch it:
// the entire app, notes and videos included, became a blank page.
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

let convex: ConvexReactClient | null = null;
try {
  if (convexUrl) convex = new ConvexReactClient(convexUrl);
} catch (err) {
  console.error('[convex] client could not be created', err);
  convex = null;
}

if (!convexUrl) {
  console.error(
    '[convex] NEXT_PUBLIC_CONVEX_URL is not set. Signed-in features are disabled; notes and videos still work.'
  );
}

/**
 * Wraps the tree in Convex — and, if Convex cannot be reached at all, does not.
 *
 * The degradation is deliberate and it has a shape: everything that is FREE in
 * this product (notes, videos, the interactive artifacts, the syllabus map) is
 * rendered from files in `public/` and from `lib/syllabus.ts`, and none of it
 * calls Convex. So a Convex outage has to cost the student the signed-in half and
 * nothing more. Without the provider a `useQuery` throws, and the boundary around
 * it — or the route's `error.tsx` — turns that into one broken panel instead of a
 * broken app.
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) return <>{children}</>;
  return (
    <ErrorBoundary label="convex-provider" fallback={<>{children}</>}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ErrorBoundary>
  );
}
