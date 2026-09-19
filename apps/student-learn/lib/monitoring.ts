/**
 * Error monitoring — Sentry, loaded only by a session that actually breaks.
 *
 * WHY NOT THE ORDINARY `@sentry/nextjs` INSTALL
 * ---------------------------------------------
 * `@sentry/nextjs`'s client bundle is ~51 KB gzipped errors-only, and ~93 KB
 * with tracing and replay. That is 40× the entire analytics budget, shipped to
 * every student on every page, to catch a fault that the overwhelming majority
 * of them will never hit. "Low data" is a stated promise of this product — the
 * video player already refuses to fetch a byte until play is pressed, and
 * `components/video-player.tsx` `import()`s hls.js for exactly this reason —
 * so error monitoring gets held to the same rule the player is held to.
 *
 * So: a ~0 KB listener is installed at boot, and the SDK is `import()`ed the
 * first time something actually throws. A student whose session is fine pays
 * nothing. A student whose session breaks pays ~45 KB, once, at the moment we
 * have something worth knowing — and by then the page is already broken, so the
 * bytes are not competing with anything they came for.
 *
 * WHAT THAT COSTS, HONESTLY
 * -------------------------
 *  - **No breadcrumbs before the first error.** Sentry was not running, so
 *    there is no trail of clicks and fetches leading up to it. The route,
 *    message and stack are captured; the story is not.
 *  - **No server-side capture.** Every page in this app is a client component
 *    talking to Convex, so there is very little server to instrument — but a
 *    Next route handler or a server component added later would NOT be covered
 *    by this file.
 *  - **Minified stack traces**, until someone wires source-map upload (which
 *    needs `withSentryConfig`, an org, a project and an auth token — a build
 *    change, and this task was told not to deploy).
 *
 * PRIVACY — CONFIGURED, NOT ASSUMED
 * ---------------------------------
 * The audience is 16-18. `sendDefaultPii` is set to `false` explicitly rather
 * than relied on as a default, because the Sentry Next.js wizard scaffolds it
 * as `true`, and because Sentry v11 deprecates it in favour of a `dataCollection`
 * object whose defaults are *more* permissive. On top of that:
 *
 *  - `beforeSend` deletes `event.user` and `event.request.headers` outright and
 *    strips the query string and any path segment that could be an id from
 *    every URL it can reach — the event's own url, its breadcrumbs, and each
 *    stack frame's filename.
 *  - Session Replay is **not** installed and must not be. It records the DOM,
 *    which here means a minor's first name, their age band and their exam
 *    enrolment. Sentry's own documentation says Replay requires consent.
 *  - `integrations` is given explicitly with `defaultIntegrations: false`, which
 *    both drops the ~45 KB of replay/tracing machinery and removes the
 *    `Breadcrumbs` integration's default console and fetch capture — console
 *    lines in this app carry Convex error strings with function names and
 *    argument values (see `components/error-boundary.tsx`).
 *  - `sendClientReports: false` — no extra background beacons on metered data.
 *
 * Durai must still tick **Security & Privacy → Prevent Storing of IP Addresses**
 * in the Sentry project: an IP is inferred server-side from the ingest request
 * and no client flag can stop that.
 */

type SentryLike = {
  captureException: (error: unknown, hint?: Record<string, unknown>) => void;
};

let loading: Promise<SentryLike | null> | null = null;

/** Strip everything from a URL except origin + path, and ids out of the path. */
function scrubUrl(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  try {
    const url = new URL(value, 'https://stem4life.com');
    // A Convex id, a Clerk id and a submission id are all long opaque tokens in
    // a path segment. Anything that looks like one becomes a placeholder, so a
    // grouped issue still reads as `/topic/:id` rather than leaking the value.
    const path = url.pathname
      .split('/')
      .map((seg) => (/^[A-Za-z0-9_-]{16,}$/.test(seg) ? ':id' : seg))
      .join('/');
    return `${url.origin}${path}`; // query string and hash discarded
  } catch {
    return value;
  }
}

/**
 * Redact identifiers out of an error MESSAGE.
 *
 * The structured fields are handled by `beforeSend` below, but a message is
 * free text and Sentry cannot scrub what a throw site chose to write into it.
 * This is not hypothetical here: a Convex error string carries the function
 * name and sometimes its arguments — which is the whole reason
 * `components/error-boundary.tsx` refuses to render error text to a student —
 * and `registerSelf` is called with a first name, an age band, a country and an
 * exam enrolment. So the same suspicion is applied on the way out to Sentry.
 */
function scrubText(value: unknown): unknown {
  if (typeof value !== 'string') return value;
  return value
    .replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[email]')
    .replace(/\b(?:user|org|sess|client|sk|pk)_[A-Za-z0-9_-]{8,}\b/g, '[id]')
    .replace(/\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_.-]+/g, '[jwt]')
    .replace(/\+?[0-9][0-9\s()-]{8,}[0-9]/g, '[number]');
}

function dsn(): string | undefined {
  return process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;
}

export function monitoringEnabled(): boolean {
  return Boolean(dsn());
}

/** Load and initialise the SDK. Idempotent; resolves null if unavailable. */
async function load(): Promise<SentryLike | null> {
  if (loading) return loading;
  const key = dsn();
  if (!key) return null;

  // NAMED destructuring, not `import * as Sentry`. A namespace object has to be
  // built whole, so a star import pins every export of the barrel — including
  // Session Replay's rrweb recorder and the user-feedback widget, neither of
  // which this file uses and one of which we have a safeguarding reason never
  // to ship. Naming the four symbols lets webpack drop the rest: it is worth
  // ~70 KB gzipped off the chunk a broken session has to download.
  loading = import('@sentry/browser')
    .then(({ init, captureException, dedupeIntegration, functionToStringIntegration }) => {
      init({
        dsn: key,
        environment: process.env.NEXT_PUBLIC_SENTRY_ENV || 'production',
        release: process.env.NEXT_PUBLIC_COMMIT_SHA || undefined,

        // Explicit, not inherited. See the header comment.
        sendDefaultPii: false,
        // `sendDefaultPii` is being superseded by `dataCollection`, whose own
        // defaults are PERMISSIVE — cookies, request and response headers, URL
        // query params and local stack-frame variables are all collected unless
        // switched off. Every one of them is turned off by name here, so the
        // posture survives both the rename and a future default flip rather
        // than depending on which flag the installed version happens to read.
        dataCollection: {
          userInfo: false,
          cookies: false,
          httpHeaders: false,
          httpBodies: [],
          urlQueryParams: false,
          // A student's first name, age band and country are local variables in
          // the onboarding form at the moment it could throw.
          stackFrameVariables: false,
          frameContextLines: 0,
          databaseQueryData: false,
          graphQL: { document: false, variables: false },
          genAI: { inputs: false, outputs: false },
        },

        // No tracing, no profiling, no replay. Errors only.
        tracesSampleRate: 0,
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
        sendClientReports: false,

        // Drops Breadcrumbs (console + fetch capture), Replay and BrowserTracing
        // along with their weight. Dedupe stops one broken render filling the
        // 50k/month free quota from a single student's re-render loop.
        defaultIntegrations: false,
        integrations: [dedupeIntegration(), functionToStringIntegration()],

        // Browser extensions and injected third-party scripts throw constantly
        // and none of it is ours.
        ignoreErrors: [
          'ResizeObserver loop limit exceeded',
          'ResizeObserver loop completed with undelivered notifications',
          'Non-Error promise rejection captured',
          /^Loading chunk \d+ failed/,
          /^Failed to fetch dynamically imported module/,
        ],
        denyUrls: [/extensions\//i, /^chrome:\/\//i, /^moz-extension:\/\//i],

        /**
         * Last gate before the network. Everything above is configuration that
         * a future SDK upgrade could reinterpret; this runs regardless.
         */
        beforeSend(rawEvent) {
          const event = rawEvent as unknown as Record<string, any>;
          // Identity: never. Not even an opaque id — we have no use for a
          // per-student error history that would justify minting one.
          delete event.user;
          delete event.server_name;

          if (event.request) {
            // Headers carry cookies, the Clerk session JWT and the user agent.
            delete event.request.headers;
            delete event.request.cookies;
            delete event.request.data;
            delete event.request.query_string;
            event.request.url = scrubUrl(event.request.url);
          }

          for (const crumb of event.breadcrumbs ?? []) {
            if (crumb?.data?.url) crumb.data.url = scrubUrl(crumb.data.url);
            if (crumb?.message) crumb.message = scrubText(crumb.message);
            delete crumb?.data?.arguments;
          }

          if (event.message) event.message = scrubText(event.message);

          for (const value of event.exception?.values ?? []) {
            // The message is free text written by whatever threw. See scrubText.
            value.value = scrubText(value.value);
            for (const frame of value?.stacktrace?.frames ?? []) {
              frame.filename = scrubUrl(frame.filename);
              // Local variables at the throw site are the single richest source
              // of accidental PII in a Sentry payload.
              delete frame.vars;
            }
          }

          return rawEvent;
        },
      });
      return { captureException };
    })
    .catch(() => null);

  return loading;
}

/**
 * Report one error.
 *
 * `where` is a short slug naming the boundary or route group — the same value
 * that goes to analytics as `app_error`, so the count in Plausible and the
 * detail in Sentry can be lined up without joining on anything about a person.
 */
export function captureError(error: unknown, where: string): void {
  if (typeof window === 'undefined' || !monitoringEnabled()) return;
  void load()
    .then((sdk) => sdk?.captureException(error, { tags: { where } }))
    .catch(() => {
      /* monitoring must never be able to break a page */
    });
}

/**
 * Catch what never reaches a React boundary: async throws, rejected promises,
 * and errors from event handlers. Installed once, from `components/analytics.tsx`.
 *
 * This is the whole always-on cost of error monitoring in this app — two event
 * listeners and this closure.
 */
export function installGlobalErrorHandlers(): () => void {
  if (typeof window === 'undefined' || !monitoringEnabled()) return () => {};

  const onError = (e: ErrorEvent) => captureError(e.error ?? e.message, 'window');
  const onRejection = (e: PromiseRejectionEvent) => captureError(e.reason, 'unhandled-rejection');

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}
