#!/usr/bin/env python3
"""Check additive cue provenance, preserved audio, scope and duration."""
import hashlib
import json
import math
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
REL = 'packages/backend/src/remotion/public/transcripts/mechanics/modelling-assumptions.json'
current = json.loads((ROOT / REL).read_text())
baseline = json.loads(subprocess.check_output(['git', 'show', f'adcb394:{REL}'], cwd=ROOT))
assert len(current['scenes']) == 6
frames = sum(math.ceil(s['duration'] * 30) for s in current['scenes'])
assert frames <= 5 * 60 * 30
focus_count = 0
for scene, original in zip(current['scenes'], baseline['scenes']):
    for key in ('id', 'audio', 'duration', 'audioSha256', 'paragraphs', 'holds'):
        assert scene[key] == original[key], (scene['id'], key)
    audio = ROOT / 'packages/backend/src/remotion/public/audio/mechanics' / scene['audio']
    assert hashlib.sha256(audio.read_bytes()).hexdigest() == scene['audioSha256']
    assert scene['cues'] == original['cues'], (scene['id'], 'teaching cues moved')
    for event in scene['focus']:
        assert any(word['start'] == event['wordStart'] for word in scene['words']), event
        assert event['start'] == event['wordStart'] or any(
            h['start'] < event['wordStart'] < h['end'] == event['start'] for h in scene['holds']), event
        assert any(word['end'] == event['end'] for word in scene['words']), event
        assert not any(h['start'] < event['start'] < h['end'] for h in scene['holds']), event
        focus_count += 1
    if scene['id'] == 's05':
        assert scene['cues']['sphere'] < scene['cues']['q-particle']
        assert {f'q-{part}' for part in ('particle', 'light', 'pulley', 'surface', 'string')} <= {
            event['target'] for event in scene['focus']}
print(f'PASS: six unchanged audio files, paragraphs, teaching cues and holds; '
      f'{focus_count} word-derived focus events; {frames} frames / {frames / 30:.3f}s.')
