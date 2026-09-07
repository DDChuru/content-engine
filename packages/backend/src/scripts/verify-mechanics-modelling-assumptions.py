#!/usr/bin/env python3
"""Audit cue/hold stills without rendering a video. Build the Remotion bundle first."""
import argparse
import concurrent.futures
import hashlib
import json
import math
import subprocess
from pathlib import Path
from PIL import Image, ImageChops

ROOT = Path(__file__).resolve().parents[2]
TRANSCRIPT = ROOT / 'src/remotion/public/transcripts/mechanics/modelling-assumptions.json'
ARTIFACTS = ROOT / 'out/MechanicsModellingAssumptions'


def audit_frames(scenes):
    frames = {}
    holds = []
    offset = 0
    for scene in scenes:
        for local in (*range(16), math.ceil(scene['duration'] * 30) - 1):
            frames.setdefault(offset + local, []).append(f"{scene['id']}:boundary-{local}")
        for event in scene.get('focus', []):
            for advance in (1, 12):
                frame = offset + math.ceil(event['start'] * 30) + advance
                frames.setdefault(frame, []).append(f"{scene['id']}:focus:{event['target']}")
        for local in range(60, math.ceil(scene['duration'] * 30), 60):
            frames.setdefault(offset + local, []).append(f"{scene['id']}:visual-presence")
        for cue_id, seconds in scene['cues'].items():
            frame = offset + math.ceil(seconds * 30)
            frames.setdefault(frame, []).append(f"{scene['id']}:{cue_id}")
        for index, hold in enumerate(scene['holds']):
            if hold['kind'] != 'hold':
                continue
            start = offset + math.ceil(hold['start'] * 30)
            end = start + round(hold['duration'] * 30) - 1
            for frame in (start, end):
                frames.setdefault(frame, []).append(f"{scene['id']}:hold-{index}")
            holds.append((start, end))
        # A cue still catches the first pen stroke. Also inspect the completed
        # domain and matching words before the next prompt clears the paper.
        if scene['id'] == 's03':
            frame = offset + math.ceil((scene['cues']['zero'] - 0.1) * 30)
            frames.setdefault(frame, []).append('s03:domain-complete')
        if scene['id'] == 's05':
            pairs = [('particle', 'q-light'), ('light', 'q-pulley'),
                     ('smooth-pulley', 'q-surface'), ('smooth-surface', 'q-string'),
                     ('inextensible', None)]
            for answer, following in pairs:
                end = min(scene['cues'][answer] + 3.5,
                          scene['cues'][following] - 0.3 if following else scene['duration'] - 0.4)
                frame = offset + math.ceil((end + 0.05) * 30)
                frames.setdefault(frame, []).append(f"s05:{answer}-complete")
        offset += math.ceil(scene['duration'] * 30)
    return frames, holds


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle', type=Path, default=ROOT / 'build')
    parser.add_argument('--output', type=Path, default=ROOT / 'out/verify-modelling-stills')
    parser.add_argument('--workers', type=int, default=3)
    parser.add_argument('--prepare-only', action='store_true')
    parser.add_argument('--reuse-stills', action='store_true')
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    scenes = json.loads(TRANSCRIPT.read_text())['scenes']
    frames, holds = audit_frames(scenes)
    (args.output / 'verify-frames.json').write_text(json.dumps(sorted(frames)) + '\n')
    if args.prepare_only:
        print(f'Prepared {len(frames)} still frames.')
        return

    def verify(item):
        frame, labels = item
        output = args.output / f'{frame:05d}.png'
        log = args.output / f'verify-{frame:05d}.log'
        for attempt in range(3):
            if args.reuse_stills:
                assert output.is_file(), output
                break
            with log.open('w') as stream:
                result = subprocess.run([
                    'npx', 'remotion', 'still', str(args.bundle),
                    'MechanicsModellingAssumptions', str(output),
                    f'--frame={frame}', '--scale=0.5',
                    '--props={"audioEnabled":false,"audit":true}', '--log=error',
                ], cwd=ROOT, stdout=stream, stderr=subprocess.STDOUT)
            if result.returncode == 0:
                break
        else:
            raise RuntimeError(f'Still failed after three attempts: {log}')
        measured = json.loads((ARTIFACTS / f'verify-modelling-{frame:05d}.json').read_text())
        assert measured['frame'] == frame, measured
        assert measured['regions'] <= 3, measured
        assert measured['maxWords'] <= 12, measured
        assert not measured['overflow'], measured
        assert measured['visualPresent'], measured
        assert measured['maxCaptionWords'] <= 8, measured
        assert not measured['collisions'], measured
        for label in labels:
            if ':focus:' in label:
                target = label.split(':focus:')[1]
                if target.startswith('q-'):
                    assert target in measured['underlines'], (frame, label, measured)
                else:
                    assert target in [ring['target'] for ring in measured['rings']], (frame, label, measured)
        # A declared SVG is insufficient: check actual painted pixels in it.
        im = Image.open(output).convert('RGB')
        root, box = measured['root'], measured['diagramBounds']
        scale = im.width / root['width']
        bounds = tuple(round(value * scale) for value in (
            box['left'] - root['left'], box['top'] - root['top'],
            box['right'] - root['left'], box['bottom'] - root['top']))
        crop = im.crop(bounds)
        channels = ImageChops.difference(crop, Image.new('RGB', crop.size, (23, 28, 32))).split()
        difference = ImageChops.lighter(ImageChops.lighter(channels[0], channels[1]), channels[2])
        painted = sum(difference.histogram()[29:])
        assert painted > 300, (frame, 'empty diagram pixels', painted)
        measured['paintedDiagramPixels'] = painted
        for label in labels:
            if ':focus:' not in label or ':focus:q-' in label:
                continue
            target = label.split(':focus:')[1]
            target_rings = [ring for ring in measured['rings'] if ring['target'] == target]
            for ring in target_rings:
                ring_crop = im.crop(tuple(round(value * scale) for value in (
                    ring['left'] - root['left'] - 4, ring['top'] - root['top'] - 4,
                    ring['right'] - root['left'] + 4, ring['bottom'] - root['top'] + 4)))
                red, green, blue = ring_crop.split()
                over_red = ImageChops.subtract(green, red).point(lambda value: 255 if value > 20 else 0)
                over_blue = ImageChops.subtract(green, blue).point(lambda value: 255 if value > 5 else 0)
                accent_pixels = ImageChops.multiply(over_red, over_blue).histogram()[255]
                assert accent_pixels > 2, (frame, target, 'ring has no painted accent', accent_pixels)
        return {'labels': labels, 'image': output.name, **measured}

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        measurements = list(pool.map(verify, sorted(frames.items())))
    hold_hashes = []
    for start, end in holds:
        first = hashlib.sha256((args.output / f'{start:05d}.png').read_bytes()).digest()
        last = hashlib.sha256((args.output / f'{end:05d}.png').read_bytes()).digest()
        assert first == last, f'Hold moved between frames {start} and {end}'
        hold_hashes.append({'start': start, 'end': end, 'frames': end - start + 1,
                            'sha256': first.hex()})
    report = {
        'stillCount': len(measurements),
        'maxRegions': max(row['regions'] for row in measurements),
        'maxWords': max(row['maxWords'] for row in measurements),
        'identicalHoldPairs': len(holds),
        'holdHashes': hold_hashes,
        'measurements': measurements,
    }
    (args.output / 'verify-measurements.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f"Passed {len(measurements)} stills; {len(holds)} frozen holds; "
          f"max {report['maxRegions']} regions / {report['maxWords']} words.")


if __name__ == '__main__':
    main()
