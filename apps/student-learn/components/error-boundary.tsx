'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { track } from '@/lib/analytics';
import { captureError } from '@/lib/monitoring';

interface Props {
  children: ReactNode;
  /**
   * What to show instead of the subtree. A function gets the error and a reset
   * that re-mounts the subtree — the useful shape when the failure is a Convex
   * query that may simply not be deployed yet.
   */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** For labelling the console line. Never shown to a student. */
  label?: string;
}

interface State {
  error: Error | null;
}

/**
 * The thing this app did not have, and the reason the shell build lost onboarding
 * entirely: a `useQuery` for a function that was not deployed yet threw, and with
 * no boundary above it React unmounted the whole tree. A blank page.
 *
 * React only catches render-phase errors with a class component — there is no hook
 * form — so this stays a class. It is deliberately the smallest possible one.
 *
 * `app/error.tsx` catches a whole route; this catches a *part* of one, which is
 * what "a student whose progress query fails can still read the notes" requires.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Visible to us, never to the student. No error text reaches the UI: a Convex
    // error string can carry function names and argument values.
    const where = this.props.label ?? 'boundary';
    console.error(`[boundary ${where}]`, error, info.componentStack);
    // Two destinations, on purpose. Plausible gets a COUNT keyed on the
    // boundary's label — enough to see "the video boundary caught 400 of these
    // yesterday" next to the traffic that caused it. Sentry gets the exception
    // itself, scrubbed, and is the only place a stack trace exists.
    track('app_error', { where });
    captureError(error, where);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const { fallback } = this.props;
    if (typeof fallback === 'function') return fallback(error, this.reset);
    return fallback ?? null;
  }
}

/**
 * A boundary whose fallback is nothing at all.
 *
 * For a subtree that is an *enhancement*: progress sync, a mastery badge, a
 * saved-state chip. If it fails the page is still the page, minus one ornament.
 * Anything a student came for — notes, a video, an explainer — must NOT be
 * wrapped in this; it belongs in one with a visible fallback.
 */
export function SilentBoundary({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <ErrorBoundary label={label} fallback={null}>
      {children}
    </ErrorBoundary>
  );
}
