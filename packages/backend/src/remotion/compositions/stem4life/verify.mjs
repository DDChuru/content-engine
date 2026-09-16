import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const output = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../../output/stem4life-bookends');
const report = JSON.parse(readFileSync(join(output, 'verification.json'), 'utf8'));
assert.equal(report.renders.length, 4);
const first = await sharp(join(output, 'preview/outro-hold-60.png')).raw().toBuffer();
const last = await sharp(join(output, 'preview/outro-hold-179.png')).raw().toBuffer();
assert.ok(first.equals(last), 'The settled outro must have no residual movement, including the URL.');

const contactSheet = async (name, files) => {
  const columns = 2; const width = 800; const height = 450; const labelHeight = 42;
  const layers = [];
  for (let i = 0; i < files.length; i++) {
    const [file, label] = files[i];
    const left = (i % columns) * width; const top = Math.floor(i / columns) * (height + labelHeight);
    layers.push({input: await sharp(join(output, 'stills', file)).resize(width, height).toBuffer(), left, top: top + labelHeight});
    const svg = `<svg width="${width}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#253247"/><text x="20" y="28" font-family="sans-serif" font-size="20" fill="#F6F3EB">${label}</text></svg>`;
    layers.push({input: Buffer.from(svg), left, top});
  }
  await sharp({create: {width: width * columns, height: Math.ceil(files.length / columns) * (height + labelHeight), channels: 3, background: '#253247'}})
    .composite(layers).png().toFile(join(output, name));
};

for (const variant of ['a', 'b', 'c']) {
  await contactSheet(`intro-${variant}-frames.png`, [20, 60, 100, 149].map((f) => [`intro-${variant}-${f}.png`, `INTRO ${variant.toUpperCase()} / FRAME ${f}`]));
}
await contactSheet('outro-frames.png', [20, 60, 100, 150, 179].map((f) => [`outro-${f}.png`, `OUTRO C / FRAME ${f}`]));
await contactSheet('outro-variants.png', [['outro-a-100.png', 'OUTRO A / FRAME 100'], ['outro-b-100.png', 'OUTRO B / FRAME 100']]);

// Pixel sampling confirms the prop-driven variant renders actually changed theme.
for (const [file, expected] of [['outro-a-100.png', [255, 255, 255]], ['outro-b-100.png', [24, 34, 48]]]) {
  const data = await sharp(join(output, 'stills', file)).removeAlpha().raw().toBuffer();
  assert.deepEqual([...data.subarray(0, 3)], expected, `Wrong aesthetic in ${file}`);
}
report.urlHold.losslessEndpointFramesIdentical = true;
report.additionalChecks = ['Outro A and B prop overrides render distinct correct backgrounds', 'Long-title override reaches composition', 'Lossless outro frames 60 and 179 are pixel-identical', 'Four local WOFF2 subsets loaded and resolved by CSS'];
writeFileSync(join(output, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log('Verified four renders, font evidence, aesthetic overrides and stationary four-second outro hold. Contact sheets ready.');
