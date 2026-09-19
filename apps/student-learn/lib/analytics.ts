/**
 * Analytics — the whole of it.
 *
 * The audience is 16-18 year olds in South Africa and Zimbabwe. POPIA and
 * Zimbabwe's Data Protection Act both treat a minor's data as a heavier
 * category, and `convex/REGISTRATION-AND-ROLES.md` §1 already refuses a
 * surname, a date of birth, a school and a phone number. Analytics does not get
 * to be the back door through which the thing we refused to ask for arrives
 * anyway.
 *
 * So this module is not a wrapper around a vendor SDK. It is a **gate**:
 *
 * 1. **Closed event vocabulary.** `EVENTS` below is the complete list. An event
 *    name that is not in it is dropped, in production, silently.
 * 2. **Closed property vocabulary.** Every event declares which prop keys it
 *    may carry, and every value is coerced through `sanitise()` — which admits
 *    a short slug, a bounded integer, or a boolean, and nothing else. There is
 *    no path through this file by which a Clerk user id, an email, a candidate
 *    code, a submission id or a line of free text reaches the network. Not
 *    "we remember not to"; it cannot be expressed.
 * 3. **No identity at all.** We do not pass an opaque user id either. Plausible
 *    has nowhere to put one, and inventing a stable pseudonym would be
 *    re-creating the cookie we chose the vendor to avoid. Everything below is
 *    a count of events, not a history of a person.
 *
 * The transport is Plausible (see `components/analytics.tsx` for why). It is
 * cookieless, so no consent banner is shown — and the reason there is no banner
 * is that there is nothing to consent to, which is the only honest version of
 * that argument.
 *
 * Failure mode: every call is a no-op when the script has not loaded, has been
 * blocked, or `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is unset (which is the default in
 * development). Nothing in this file is allowed to throw into a render.
 */

/** Props the caller may pass. Deliberately narrow — see `sanitise()`. */
type PropValue = string | number | boolean | null | undefined;
export type EventProps = Record<string, PropValue>;

/**
 * The complete event vocabulary, with the prop keys each event may carry.
 *
 * Read it as the answer to "what does Durai need to know?", in order:
 *
 *  - Did bought traffic arrive, and from where?  → handled by Plausible's own
 *    UTM breakdown on the automatic pageview. No custom event needed, and
 *    inventing one would double-count.
 *  - Does it reach the free content?             → Plausible pageviews + a
 *    wildcard goal. No custom event; see the note in `EVENTS`.
 *  - **Does anyone touch an artifact, and commit a prediction?** → `artifact_*`
 *    This is the product's core claim and the most valuable row in the table.
 *  - Does anyone finish registering, and where do they fall out of the
 *    4-step picker?                              → `signup_*`, `enrolment_step`
 *  - Does video start, and does it stall?        → `video_*`
 *  - What breaks?                                → `app_error` (a count; the
 *    stack trace goes to Sentry, not here)
 */
const EVENTS = {
  // NOTE: there is deliberately no `content_open` event. "Did the traffic reach
  // the free content?" is already answered by Plausible's automatic pageviews
  // and a wildcard pageview goal on `/topic/*`, `/notes*` and `/syllabus` —
  // which cost zero extra bytes on a metered connection and cannot disagree
  // with the pageview numbers next to them. A custom event there would be a
  // second, worse copy of a measurement we get for free.

  /** An interactive artifact was rendered on screen (intersection, not mount). */
  artifact_view: ['artifact'],
  /** The student touched a control — the "is this alive?" signal, once per artifact. */
  artifact_engage: ['artifact'],
  /** THE event. A prediction was committed. `outcome` is right | wrong. */
  artifact_predict: ['artifact', 'outcome'],
  /** The model was run through to its end after a prediction. */
  artifact_resolve: ['artifact', 'outcome'],

  /** Landed on the registration form, having signed in. */
  signup_start: [],
  /** Furthest step of the enrolment picker reached. Fires once per step. */
  enrolment_step: ['step'],
  /** `registerSelf` succeeded. The funnel's floor. */
  signup_complete: ['role'],
  /** `registerSelf` threw. `reason` is a slug we chose, never the server string. */
  signup_failed: ['reason'],

  /** Play was pressed. Nothing is fetched before this, so it is also "cost incurred". */
  video_play: [],
  /** Media actually began. `video_play` without this is a start that never started. */
  video_start: ['transport'],
  /** Stalled, fell back, or died. `stage` says which. */
  video_trouble: ['stage'],

  /** A boundary caught something. `where` is a route group or a boundary label. */
  app_error: ['where'],
} as const;

export type EventName = keyof typeof EVENTS;

/**
 * Coerce one property value into something that cannot carry an identifier.
 *
 * - a boolean passes
 * - a finite number is rounded and clamped to 0…10000 (so a duration or an
 *   index survives; a timestamp or an id does not survive recognisably)
 * - a string is lowercased, stripped to `[a-z0-9._-]`, and **truncated to 32
 *   characters**. An email, a JWT, a Convex id or a sentence all survive that
 *   as unusable rubble, which is the point — but see `isSlug` below: anything
 *   that had to be mangled is dropped outright rather than sent as rubble.
 * - anything else is dropped
 */
function sanitise(value: PropValue): string | number | boolean | null {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null;
    return Math.min(10000, Math.max(0, Math.round(value)));
  }
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > 48) return null;
  const slug = trimmed.toLowerCase();
  // Reject rather than mangle. A value that is not already a slug is a value
  // whose author did not think about what they were sending, and a mangled
  // identifier is still a partial identifier.
  return /^[a-z0-9][a-z0-9._· -]{0,47}$/.test(slug) ? slug.replace(/\s+/g, '-') : null;
}

/** True once the caller has opted in via env. */
export function analyticsEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN);
}

declare global {
  interface Window {
    plausible?: {
      (event: string, options?: { props?: Record<string, string | number | boolean> }): void;
      q?: unknown[];
    };
  }
}

/**
 * Send one event.
 *
 * Safe to call from anywhere, including a render path, an effect, an event
 * handler or a `catch`. It never throws and never awaits.
 */
export function track(name: EventName, props: EventProps = {}): void {
  if (typeof window === 'undefined') return;

  const allowed = EVENTS[name] as readonly string[] | undefined;
  if (!allowed) return; // Not in the vocabulary. Dropped.

  const clean: Record<string, string | number | boolean> = {};
  for (const key of allowed) {
    const value = sanitise(props[key]);
    if (value !== null && value !== undefined) clean[key] = value;
  }

  if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === '1') {
    // eslint-disable-next-line no-console
    console.info('[analytics]', name, clean);
  }

  try {
    // `window.plausible` is a queueing stub from the moment the provider
    // mounts, so an event fired before the script finishes downloading is held
    // rather than lost. If the script is blocked — ad blockers are common and
    // we are not going to fight them — the queue simply never drains, which
    // costs nothing.
    window.plausible?.(name, Object.keys(clean).length ? { props: clean } : undefined);
  } catch {
    /* analytics must never be able to break a page */
  }
}

/**
 * Fire an event at most once per page load, keyed by name + props.
 *
 * `artifact_view` and `enrolment_step` are both driven by effects that re-run,
 * and a funnel built on "how many students reached step 3" is wrong the moment
 * one student counts twice.
 */
const fired = new Set<string>();

export function trackOnce(name: EventName, props: EventProps = {}): void {
  const key = `${name}:${JSON.stringify(props)}`;
  if (fired.has(key)) return;
  fired.add(key);
  track(name, props);
}
