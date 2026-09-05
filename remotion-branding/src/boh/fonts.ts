/**
 * BoH font loading — Barlow Condensed + DM Sans from public/ccv-tutorial/fonts.
 *
 * Nothing render-blocking lives at module scope. A module-level delayRender leaves a
 * stale timeout behind once Remotion clears its handles between frames, and that stale
 * timer cancels multi-frame renders ~28s later even though the fonts are loaded.
 * So: a fire-and-forget pre-warm at module level (document.fonts.add + load, no
 * delayRender), and a `useBohFonts()` hook that owns one delayRender handle per mount
 * and clears it on EVERY path — resolve, reject, 15s cutoff, and early unmount.
 */
import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';

const FONTS_BASE = 'ccv-tutorial/fonts';
const CUTOFF_MS = 15000;
const HANDLE_TIMEOUT_MS = 30000;
const FACES: Array<[string, string, string]> = [
  ['Barlow Condensed', 'BarlowCondensed_500Medium.ttf', '500'],
  ['Barlow Condensed', 'BarlowCondensed_600SemiBold.ttf', '600'],
  ['Barlow Condensed', 'BarlowCondensed_700Bold.ttf', '700'],
  ['DM Sans', 'DMSans_400Regular.ttf', '400'],
  ['DM Sans', 'DMSans_500Medium.ttf', '500'],
  ['DM Sans', 'DMSans_700Bold.ttf', '700'],
];

const canLoad = () => typeof document !== 'undefined' && typeof FontFace !== 'undefined';

/** Add the six faces to document.fonts (idempotent) and return their load promises. */
const loadFaces = (): Promise<unknown>[] => {
  const fonts = document.fonts as unknown as {
    add: (f: FontFace) => void;
    forEach: (cb: (f: FontFace) => void) => void;
  };
  const present = new Set<string>();
  fonts.forEach((f) => present.add(`${f.family}|${f.weight}`));
  return FACES.map(([family, file, weight]) => {
    const key = `${family}|${weight}`;
    if (present.has(key)) return Promise.resolve();
    const face = new FontFace(family, `url(${staticFile(`${FONTS_BASE}/${file}`)})`, { weight });
    fonts.add(face);
    present.add(key);
    return face.load();
  });
};

// Fire-and-forget pre-warm so the first frames already have the faces — no delayRender here.
if (canLoad()) {
  try {
    void Promise.allSettled(loadFaces());
  } catch {
    /* pre-warm is best-effort */
  }
}

/** Holds one delayRender handle while the faces load; always continues. */
export const useBohFonts = () => {
  const [handle] = useState(() => delayRender('boh fonts', { timeoutInMilliseconds: HANDLE_TIMEOUT_MS }));
  useEffect(() => {
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      continueRender(handle);
    };
    if (!canLoad()) {
      finish();
      return finish;
    }
    const cutoff = setTimeout(finish, CUTOFF_MS);
    let loads: Promise<unknown>[];
    try {
      loads = loadFaces();
    } catch {
      loads = [];
    }
    Promise.allSettled(loads).then(finish, finish);
    return () => {
      clearTimeout(cutoff);
      finish(); // unmounted early — never leave the handle open
    };
  }, [handle]);
};
