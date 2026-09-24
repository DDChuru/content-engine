import {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

export const DISPLAY = 'Stem4Life Manrope';
// Quote the numeric family name in CSS; an unquoted trailing 3 is invalid CSS.
export const BODY = '"Stem4Life Source Sans 3"';
const ranges = {
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  'latin-ext': 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF',
};
let ready: Promise<void> | undefined;

const loadFonts = () => ready ??= Promise.all(
  ([['manrope', DISPLAY, '500 700', '500-700'], ['source-sans-3', BODY, '400 700', '400-700']] as const)
    .flatMap(([file, family, weight, range]) => (['latin', 'latin-ext'] as const).map(async (subset) => {
      // FontFace takes the raw name; CSS takes the quoted family declaration.
      const face = new FontFace(family.replaceAll('"', ''), `url("${staticFile(`stem4life/fonts/${file}-normal-${range}-${subset}.woff2`)}")`, {
        weight, style: 'normal', unicodeRange: ranges[subset],
      });
      await face.load();
      document.fonts.add(face);
      if (face.status !== 'loaded') throw new Error(`Brand font failed: ${family}/${subset}`);
    })),
).then(async () => {
  await document.fonts.ready;
  for (const family of [`"${DISPLAY}"`, BODY]) {
    const declaration = document.createElement('span').style;
    declaration.fontFamily = family;
    const faces = await document.fonts.load(`600 32px ${family}`, 'Cambridge A Level · Mechanics');
    if (!declaration.fontFamily || faces.length === 0 || faces.some((face) => face.status !== 'loaded')) {
      throw new Error(`Brand font does not resolve from CSS: ${family}`);
    }
  }
  console.info('[Stem4Life fonts] Loaded Manrope 500–700 and Source Sans 3 400–700; all four local WOFF2 subsets ready.');
});

// The render gate belongs to the mounted bookend, so importing this module cannot
// stall unrelated compositions. A missing font fails the render rather than falling back.
export const useBrandFonts = () => {
  const [handle] = useState(() => delayRender('Loading Stem 4 Life local fonts'));
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    loadFonts().then(() => {setLoaded(true); continueRender(handle);}).catch(cancelRender);
  }, [handle]);
  return loaded;
};
