'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { track } from '@/lib/analytics';
import { installGlobalErrorHandlers } from '@/lib/monitoring';

/**
 * The analytics transport: Plausible, self-describing, cookieless.
 *
 * WHY THIS ONE, AND NOT POSTHOG
 * ------------------------------
 * PostHog has the better funnel UI and a free tier that would cost nothing at
 * this traffic. It was rejected on two grounds, and only the second is decisive:
 *
 *  - Weight. `posthog-js` is ~60 KB gzipped against Plausible's 1.3 KB
 *    (measured: `script.js` is 2,841 B raw / 1,291 B gzipped). "Low data" is a
 *    stated product promise on this app — the video player deliberately fetches
 *    nothing until play is pressed — and spending 45× the player's own restraint
 *    on measuring it is the wrong trade on a Zimbabwean prepaid bundle.
 *  - Consent. PostHog identifies visitors with a cookie by default. It can be
 *    put in a cookieless mode, but the moment the tool *is capable of*
 *    persistent identification, "do we need a banner for minors?" becomes a
 *    judgement call a lawyer has to make rather than a question with no subject.
 *    Plausible stores nothing on the device at all (verified: the script touches
 *    `document.cookie` never, and `localStorage` only to read a developer
 *    opt-out flag). There is nothing to consent to. Paid TikTok traffic lands on
 *    a page with no modal in front of it.
 *
 * The cost of that is real and worth stating plainly: Plausible has no free
 * tier. It is $9/mo (Starter) at 10k pageviews, and **funnels are a
 * Business-plan feature, $19/mo** — with a 15% education discount this product
 * plausibly qualifies for. Below Business the events are still all recorded as
 * ordinary goals, so the *rates* are readable (views ÷ predictions, landings ÷
 * registrations) even though the step-to-step drop-off chart is not. That is a
 * reporting limitation, not a data-collection one: upgrading later is a billing
 * change, not a re-instrumentation.
 *
 * The $0 alternative, if that ever matters more than the hosting: Umami is MIT
 * and self-hostable with the same cookieless + funnels + UTM feature set at
 * ~2.3 KB gzipped. It was not chosen because a server to babysit is a worse
 * tax on a one-person team than $19/mo, and because Plausible's "no cookie
 * banner required" is a published legal position we can point at, which matters
 * more than usual when the data subjects are minors.
 *
 * WHAT IT COSTS THE STUDENT
 * -------------------------
 * One 2.8 KB script (1.3 KB over the wire), loaded `afterInteractive` so it is
 * never on the critical rendering path, plus one ~200-byte POST per event.
 *
 * WHAT IT SENDS
 * -------------
 * URL, referrer, UTM parameters, screen size, and the event names in
 * `lib/analytics.ts`. No cookie, no device id, no fingerprint, no user id.
 * Plausible derives a daily visitor hash server-side from IP + user agent and
 * discards it; the raw IP is never stored. Nothing this app knows about a
 * student — not their first name, not their age band, not their Clerk id —
 * is passed to it, and `lib/analytics.ts` makes that structural rather than
 * a habit.
 */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;

  return (
    <Script
      // `afterInteractive`, not `beforeInteractive`: measuring the page must
      // never be a reason the page is slower to read.
      strategy="afterInteractive"
      // Both first-party, rewritten in next.config.js — see the comment there
      // for why (ad-blockers eat `plausible.io` and would under-report exactly
      // the paid traffic this exists to measure).
      src="/pa/js/script.js"
      data-domain={domain}
      data-api="/pa/event"
    />
  );
}

/**
 * The queue stub, inlined so it exists from the first byte of the document.
 *
 * Plausible's own documented one-liner. It is here rather than in
 * `lib/analytics.ts` because it has to run before React hydrates.
 */
export function AnalyticsQueue() {
  if (!process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) return null;
  return (
    <Script id="plausible-queue" strategy="beforeInteractive">
      {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`}
    </Script>
  );
}

/**
 * Everything telemetry, as one tag for `app/layout.tsx`.
 *
 * Renders nothing. Adds no element, no banner and no badge to the page — the
 * only visible consequence of this whole feature is meant to be none.
 */
export function Telemetry() {
  // Catches what React boundaries structurally cannot: async throws, rejected
  // promises, errors out of event handlers. ~0 KB until something breaks.
  useEffect(() => installGlobalErrorHandlers(), []);

  return (
    <>
      <AnalyticsQueue />
      <Analytics />
    </>
  );
}

/** Re-exported so a component needs one import, not two. */
export { track };
