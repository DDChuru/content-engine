/** @type {import('next').NextConfig} */
const nextConfig = {
  // A production build writes to `.next` by default, which is the same directory
  // the running dev server serves from — running one while the other is up leaves
  // the dev server serving half-built production chunks. `NEXT_DIST_DIR` lets a
  // verification build go somewhere else.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },

  env: {
    // Stack traces from a lazily-loaded Sentry are minified until someone wires
    // source-map upload, so the build they came from is the only thing that
    // makes them attributable. Vercel exposes the SHA at BUILD time, which is
    // when a NEXT_PUBLIC_ value is inlined — there is no runtime read of this.
    NEXT_PUBLIC_COMMIT_SHA:
      process.env.NEXT_PUBLIC_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '',
  },

  /**
   * Serve Plausible from our own origin.
   *
   * `plausible.io` is on the default block lists of uBlock Origin, Brave and
   * most mobile ad-blocking browsers. Durai is about to *pay* musicians and
   * comedians to send people here, and an analytics endpoint that a fifth of
   * that traffic silently drops is worse than no analytics — it reports the
   * campaign as having failed. Proxying through a first-party path is
   * Plausible's own documented remedy and changes nothing about what is sent.
   *
   * Two paths, because `middleware.ts` (Clerk) is out of scope for this change
   * and its matcher skips anything ending `.js`:
   *   /pa/js/script.js → skipped by the matcher, so the script is one plain CDN
   *                      hit with no edge function in front of it.
   *   /pa/event        → matches, so each beacon does wake clerkMiddleware. It
   *                      is not a protected route so it passes straight through;
   *                      the cost is one edge invocation per event, paid to keep
   *                      middleware.ts untouched.
   */
  /**
   * Shrink the lazily-loaded Sentry chunk.
   *
   * Sentry's own documented build-time flags: `__SENTRY_DEBUG__` strips its
   * verbose logging and `__SENTRY_TRACING__` strips the performance machinery,
   * neither of which this install uses — `lib/monitoring.ts` sets
   * `tracesSampleRate: 0` and passes an explicit two-item `integrations` array.
   * The chunk is only ever fetched by a session that has already thrown, but
   * that session is a student on a metered connection whose page just broke,
   * which is the worst possible moment to hand them a large download.
   *
   * Webpack only — these are not applied under a Turbopack build.
   */
  webpack(config, { webpack }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
        __RRWEB_EXCLUDE_IFRAME__: true,
        __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      })
    );
    return config;
  },

  async rewrites() {
    const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || 'https://plausible.io';
    return [
      { source: '/pa/js/script.js', destination: `${host}/js/script.js` },
      { source: '/pa/event', destination: `${host}/api/event` },
    ];
  },
};

module.exports = nextConfig;
