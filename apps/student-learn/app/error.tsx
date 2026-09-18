'use client';

import { useEffect } from 'react';
import Link from 'next/link';

/**
 * Route-level boundary. Next mounts this in place of the page that threw, inside
 * the root layout — so the page is lost but the app is not, and every other route
 * is one tap away. That last part is the point: the free half of this product is
 * notes and videos, and nothing about a broken account page should take those with
 * it.
 *
 * The error text is NOT rendered. A thrown Convex error carries the function name
 * and sometimes its arguments; a student gets a sentence and a way out.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[route error]', error);
  }, [error]);

  return (
    <main className="mx-auto max-w-lg px-4 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">Something broke</p>
      <h1 className="mt-2 font-heading text-3xl">This page did not load</h1>
      <p className="mt-3 text-sm text-ink-muted">
        It is our side, not yours, and nothing you have done has been lost. Try it
        again — if it keeps happening, the notes and videos are still open.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={reset}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-pressed"
        >
          Try again
        </button>
        <Link
          href="/notes"
          className="rounded-xl border border-grid-line bg-paper-raised px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent"
        >
          Go to the notes
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-grid-line bg-paper-raised px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent"
        >
          Home
        </Link>
      </div>
      {error.digest ? (
        <p className="mt-8 text-xs text-ink-muted">
          Reference <span className="font-mono">{error.digest}</span>
        </p>
      ) : null}
    </main>
  );
}
