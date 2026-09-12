#!/usr/bin/env python3
"""Verify exact topic audio, inserted PCM holds and Whisper-driven cue provenance."""
from array import array
import hashlib
import json
import math
from pathlib import Path
import subprocess
import sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[4]
AUDIO = ROOT / 'packages/backend/src/remotion/public/audio/mechanics'
TRANSCRIPT = ROOT / 'packages/backend/src/remotion/public/transcripts/mechanics/direct-collisions.json'


def main():
    timing = json.loads((HERE / 'narration-timing.json').read_text())
    plan = json.loads((HERE / 'narration.json').read_text())
    transcript = json.loads(TRANSCRIPT.read_text()) if TRANSCRIPT.exists() else None
    assert timing['generationComplete']
    assert len(timing['scenes']) == len(plan['scenes']) == 7
    assert timing['planSha256'] == hashlib.sha256((HERE / 'narration.json').read_bytes()).hexdigest()
    if transcript:
        assert transcript['planSha256'] == timing['planSha256']
        assert transcript['modelSize'] == 'small' and transcript['cpuThreads'] == 2
    details = []
    for scene in timing['scenes']:
        path = AUDIO / scene['audio']
        assert path.name == f"direct-collisions-{scene['id']}.mp3"
        assert hashlib.sha256(path.read_bytes()).hexdigest() == scene['audioSha256']
        meta = json.loads(subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_streams', '-of', 'json', str(path),
        ], text=True))['streams'][0]
        assert meta['codec_name'] == 'mp3' and int(meta['sample_rate']) == 44100 and meta['channels'] == 1
        # Decode native rate/channels: this is also a complete compressed-stream check.
        pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-xerror', '-i', str(path), '-f', 's16le', '-'])
        values = array('h', pcm)
        if sys.byteorder != 'little':
            values.byteswap()
        peak = max(abs(v) for v in values)
        clipping = sum(v in (-32768, 32767) for v in values)
        assert clipping == 0, f"Clipped decoded audio: {scene['id']}"
        verified_holds = []
        for hold in scene['holds']:
            assert hold['duration'] in (2, 3)
            assert abs(hold['end'] - hold['start'] - hold['duration']) < 1e-7
            # Exclude 80 ms at each edge to allow MP3 transform ringing.
            a, b = round((hold['start'] + .08) * 44100), round((hold['end'] - .08) * 44100)
            silent = values[a:b]
            rms = math.sqrt(sum(v*v for v in silent) / len(silent))
            hold_peak = max(abs(v) for v in silent)
            assert rms < 2 and hold_peak < 16, f"Hold contains sound: {scene['id']} at {hold['start']}"
            verified_holds.append({**hold, 'nativePcmRms': rms, 'nativePcmPeak': hold_peak, 'edgeExclusionSeconds': .08})
        cue_count = word_count = figure_count = 0
        if transcript:
            spoken = next(s for s in transcript['scenes'] if s['id'] == scene['id'])
            assert spoken['audioSha256'] == scene['audioSha256']
            words = spoken['words']
            assert words and all(0 <= w['start'] <= w['end'] <= scene['duration'] for w in words)
            assert all(a['start'] <= b['start'] for a, b in zip(words, words[1:]))
            assert all('probability' in w and 'beatId' in w for w in words)
            for cue in spoken['cueEvidence']:
                assert abs(words[cue['wordIndex']][cue['edge']] - cue['time']) < 1e-7
                assert spoken['cues'][cue['id']] == cue['time']
            for figure in spoken['figureEvents']:
                assert abs(words[figure['wordIndex']]['start'] - figure['start']) < 1e-7
                assert figure['kind'] == 'spoken'
            for beat in spoken['beats']:
                assert beat['start'] <= beat['cue'] < beat['speechEnd']
                if beat.get('ink'):
                    assert beat['cue'] < beat['penEnd'] < beat['speechEnd']
                if beat['hold']:
                    assert not any(beat['speechEnd'] < event['start'] < beat['end'] for event in spoken['figureEvents'])
            cue_count, word_count, figure_count = len(spoken['cues']), len(words), len(spoken['figureEvents'])
        details.append({'id': scene['id'], 'audio': scene['audio'], 'audioSha256': scene['audioSha256'],
                        'duration': scene['duration'], 'sampleDuration': len(values)/44100,
                        'peak': peak, 'clippedSamples': clipping, 'holds': verified_holds,
                        'wordCount': word_count, 'cueCount': cue_count, 'figureCount': figure_count})
    result = {'project': 'mechanics-direct-collisions', 'audioPassed': True,
              'transcriptPassed': transcript is not None, 'model': 'faster-whisper-small',
              'totalDuration': sum(s['duration'] for s in timing['scenes']),
              'totalHoldSeconds': sum(h['duration'] for s in details for h in s['holds']),
              'renderPerformed': False, 'scenes': details}
    (HERE / 'verify-narration.json').write_text(json.dumps(result, indent=2) + '\n')
    print(json.dumps({k:v for k,v in result.items() if k != 'scenes'}, indent=2))


if __name__ == '__main__':
    main()
