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
};

module.exports = nextConfig;
