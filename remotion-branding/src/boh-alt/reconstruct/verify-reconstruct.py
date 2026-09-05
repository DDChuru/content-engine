"""Generate lossless crops, or diff the rendered native phone against real PNGs.

python3 src/boh-alt/reconstruct/verify-reconstruct.py slices
python3 src/boh-alt/reconstruct/verify-reconstruct.py diff
"""
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
DATA = json.loads((HERE / 'slices.json').read_text())
OUTPUT = ROOT / 'public/boh-alt/reconstruct'


def verify_inputs():
    original = json.loads((HERE / 'verify-input-hashes.json').read_text())
    external_changes = []
    dependencies = {'src/boh/narration.json', 'src/boh/timing.json', 'src/Root.tsx',
                    'public/boh/shots/boh-02.png', 'public/boh/shots/boh-07.png',
                    'public/boh/audio/02-02-ledger.mp3'}
    for name, digest in original.items():
        current = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
        if current != digest:
            assert name not in dependencies and not name.startswith('src/boh-alt/'), f'Build input or earlier alternate changed: {name}'
            external_changes.append({'path': name, 'initialSha256': digest, 'currentSha256': current})
    # Other workers can edit unrelated Fable files in this shared workspace.
    # Preserve the original baseline and report those changes without claiming
    # they were ours or blocking proof of unchanged inputs actually used here.
    (OUTPUT / 'verify-external-changes.json').write_text(json.dumps(external_changes, indent=2) + '\n')
    if external_changes:
        print('Concurrent changes outside this prototype: ' + ', '.join(item['path'] for item in external_changes))


def slices():
    coverage = {state: Image.new('L', (720, 1600), 0) for state in ['daily', 'carry']}
    for s in DATA['slices']:
        r = s['rect']
        box = (r['x'], r['y'], r['x'] + r['width'], r['y'] + r['height'])
        assert 0 <= box[0] < box[2] <= 720 and 0 <= box[1] < box[3] <= 1600, s['id']
        assert s['finalPosition'] == {'x': r['x'], 'y': r['y']}, s['id']
        with Image.open(ROOT / 'public' / s['still']) as source:
            assert source.size == (720, 1600)
            crop = source.convert('RGB').crop(box)
            target = ROOT / 'public' / s['asset']
            crop.save(target)
            with Image.open(target) as saved:
                assert ImageChops.difference(crop, saved).getbbox() is None, s['id']
        assert coverage[s['state']].crop(box).getbbox() is None, f'Overlapping slice: {s["id"]}'
        coverage[s['state']].paste(255, box)
    for state, mask in coverage.items():
        assert mask.getextrema() == (255, 255), f'Uncovered endpoint pixels: {state}'
    print(f'PASS: {len(DATA["slices"])} lossless cropped PNGs; both endpoints cover every source pixel exactly once.')


def diff():
    result = {'metric': 'Any nonzero RGB channel difference counts as a differing pixel; no tolerance, masking, alignment or resampling.', 'states': {}}
    for state, number in [('daily', 2), ('carry', 7)]:
        rendered_path = OUTPUT / f'verify-{state}-phone.png'
        source_path = ROOT / f'public/boh/shots/boh-{number:02}.png'
        with Image.open(rendered_path) as rendered, Image.open(source_path) as source:
            assert rendered.size == source.size == (720, 1600)
            difference = ImageChops.difference(rendered.convert('RGB'), source.convert('RGB'))
            pixels = list(difference.getdata())
            differing = sum(any(pixel) for pixel in pixels)
            percentage = differing / len(pixels) * 100
            result['states'][state] = {'rendered': str(rendered_path), 'source': str(source_path), 'differingPixels': differing, 'totalPixels': len(pixels), 'differingPercent': percentage, 'maxChannelDifference': max(max(p) for p in pixels), 'meanAbsoluteChannelDifference': sum(sum(p) for p in pixels) / (len(pixels) * 3)}
            difference.save(OUTPUT / f'verify-{state}-diff.png')
            print(f'{state}: {differing}/{len(pixels)} pixels differ ({percentage:.6f}%), max channel difference {result["states"][state]["maxChannelDifference"]}')
    (OUTPUT / 'verify-pixel-diff.json').write_text(json.dumps(result, indent=2) + '\n')
    assert all(s['differingPercent'] <= 0.5 for s in result['states'].values()), 'Pixel identity gate failed'
    print('PASS: both rendered phone states meet the <=0.5% gate; build inputs and earlier alternate files are unchanged.')


verify_inputs()
if sys.argv[1:] == ['slices']:
    slices()
elif sys.argv[1:] == ['diff']:
    diff()
else:
    raise SystemExit('Use slices or diff')
