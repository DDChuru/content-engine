/**
 * hls.js ships a "light" build — no alternate audio tracks, no subtitle rendering,
 * no EME — which is 119 KB gzipped against 189 KB for the full one. Our lessons are
 * a single audio track with burnt-in visuals, so the 70 KB the full build would add
 * buys nothing, and these students pay for their bytes.
 *
 * Its `./light` export has no `types` condition, so TypeScript cannot resolve it on
 * its own. The runtime API is identical to the main entry, so we say so.
 */
declare module 'hls.js/light' {
  export * from 'hls.js';
  export { default } from 'hls.js';
}
