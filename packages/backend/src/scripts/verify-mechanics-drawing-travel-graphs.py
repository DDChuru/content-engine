#!/usr/bin/env python3
"""Audit cue/hold stills without rendering a video. Build the Remotion bundle first."""
import argparse
import concurrent.futures
import hashlib
import json
import math
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TRANSCRIPT = ROOT / 'src/remotion/public/transcripts/mechanics/drawing-travel-graphs.json'
ARTIFACTS = ROOT / 'out/MechanicsDrawingTravelGraphs'


def audit_frames(scenes):
    frames = {}
    holds = []
    offset = 0
    for scene in scenes:
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
        if scene['id'] == 's03':
            for cue_id in ('ten', 'twentytwo', 'twentyseven', 'thirtyone', 'finish'):
                frame = offset + math.ceil((scene['cues'][cue_id] + 0.7) * 30)
                frames.setdefault(frame, []).append(f"s03:{cue_id}-drawn")
        if scene['id'] in ('s03', 's04', 's07'):
            word = next(w for w in scene['words'] if w['end'] >= scene['cues']['draw'] and w['start'] >= scene['cues']['draw'] - 0.08)
            frame = offset + math.floor(word['end'] * 30)
            frames.setdefault(frame, []).append(f"{scene['id']}:setup-complete")
        offset += math.ceil(scene['duration'] * 30)
    return frames, holds


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--bundle', type=Path, default=ROOT / 'build')
    parser.add_argument('--output', type=Path, default=ROOT / 'out/verify-travel-stills')
    parser.add_argument('--workers', type=int, default=3)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    scenes = json.loads(TRANSCRIPT.read_text())['scenes']
    frames, holds = audit_frames(scenes)

    def verify(item):
        frame, labels = item
        output = args.output / f'{frame:05d}.png'
        log = args.output / f'verify-{frame:05d}.log'
        for attempt in range(3):
            with log.open('w') as stream:
                result = subprocess.run([
                    'npx', 'remotion', 'still', str(args.bundle),
                    'MechanicsDrawingTravelGraphs', str(output),
                    f'--frame={frame}', '--scale=0.5',
                    '--props={"audioEnabled":false,"audit":true}', '--log=error',
                ], cwd=ROOT, stdout=stream, stderr=subprocess.STDOUT)
            if result.returncode == 0:
                break
        else:
            raise RuntimeError(f'Still failed after three attempts: {log}')
        measured = json.loads((ARTIFACTS / f'verify-travel-{frame:05d}.json').read_text())
        assert measured['frame'] == frame, measured
        assert measured['regions'] <= 3, measured
        assert measured['maxWords'] <= 12, measured
        assert not measured['overflow'], measured
        assert not measured['axisCollisions'], measured
        if any(label.endswith('setup-complete') for label in labels):
            assert measured['regions'] <= 2 and not measured['cards'], measured
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
        'axisCollisionCount': sum(len(row['axisCollisions']) for row in measurements),
        'measurements': measurements,
    }
    (args.output / 'verify-measurements.json').write_text(json.dumps(report, indent=2) + '\n')
    print(f"Passed {len(measurements)} stills; {len(holds)} frozen holds; "
          f"max {report['maxRegions']} regions / {report['maxWords']} words.")


if __name__ == '__main__':
    main()
