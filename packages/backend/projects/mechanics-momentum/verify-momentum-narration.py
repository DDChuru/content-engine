#!/usr/bin/env python3
"""Check authored Momentum narration against actual audio and Whisper words."""
import array
import hashlib
import json
import math
import re
import subprocess
from pathlib import Path

PROJECT = Path(__file__).resolve().parent
ROOT = PROJECT.parents[3]
PUBLIC = ROOT / 'packages/backend/src/remotion/public'
RATE = 44100
NUMBERS = {'two': '2', 'three': '3', 'four': '4', 'six': '6', 'twelve': '12'}


def numeric(word):
    clean = re.sub(r'[^a-z0-9]', '', word.lower())
    return NUMBERS.get(clean, clean)


def main():
    plan = json.loads((PROJECT / 'narration-plan.json').read_text())
    transcript = json.loads((PUBLIC / 'transcripts/mechanics/momentum.json').read_text())
    mapping = json.loads((PUBLIC / 'transcripts/mechanics/momentum-cues.json').read_text())
    assert transcript['sceneCount'] == len(plan['scenes']) == len(transcript['scenes']) == 8
    total_words = total_figures = total_symbols = total_labels = total_holds = 0
    for expected, scene, cue_scene in zip(plan['scenes'], transcript['scenes'], mapping['scenes']):
        assert expected['id'] == scene['id'] == cue_scene['id']
        audio = PUBLIC / 'audio/mechanics' / scene['audio']
        digest = hashlib.sha256(audio.read_bytes()).hexdigest()
        assert digest == scene['audioSha256'] == cue_scene['audioSha256']
        measured = float(subprocess.check_output([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', str(audio),
        ]))
        assert abs(measured - scene['duration']) < 0.00001
        assert scene['provider'] == 'elevenlabs'
        assert scene['voiceId'] == 'gYWKdgLtqjPO3D5uDrDP'
        assert scene['voiceModel'] == 'eleven_turbo_v2_5'
        assert scene['voiceSpeed'] == (0.9 if expected['tempo'] == 'slow' else 1.0)
        assert len(scene['words']) == scene['wordCount']
        for index, word in enumerate(scene['words']):
            assert 0 <= word['start'] <= word['end'] <= measured
            if index:
                assert word['start'] >= scene['words'][index - 1]['start']
        assert len(scene['cues']) == len(cue_scene['bindings'])
        for binding in cue_scene['bindings']:
            word = scene['words'][binding['wordIndex']]
            assert binding['start'] == word['start'] == scene['cues'][binding['id']]
            assert binding['word'] == word['word']
        figures = {event['id']: event for event in scene['figureEvents'] if not event['target'].startswith('label-')}
        labels = [event for event in scene['figureEvents'] if event['target'].startswith('label-')]
        assert len(figures) == sum(len(beat.get('figures', [])) for beat in expected['beats'])
        assert len(labels) == sum(len(re.findall(r"\b([AB])(?:['’]s)?\b", beat['text'])) for beat in expected['beats'])
        for event in labels:
            word = scene['words'][event['wordIndex']]
            assert re.sub(r"['’]s\b", '', word['word'], flags=re.I).strip('.,:;').lower() == event['word'].lower()
            assert event['start'] == word['start']
            assert event['target'] == f"label-{event['word'].lower()}"
        for index, (authored, beat) in enumerate(zip(expected['beats'], scene['beats'])):
            assert authored['id'] == beat['id'] and authored['text'] == beat['text']
            assert beat['cue'] >= beat['start']
            assert beat['speechEnd'] <= beat['penEnd'] <= beat['end']
            if index + 1 < len(scene['beats']):
                following = scene['beats'][index + 1]
                assert following['start'] >= beat['end'] + beat['hold'] - 0.00002
            for number, figure in enumerate(authored.get('figures', []), 1):
                event = figures[f"{beat['id']}-figure-{number}"]
                word = scene['words'][event['wordIndex']]
                assert event['kind'] == 'spoken'
                assert event['start'] == word['start']
                assert event['target'] == figure['target'] and event['word'] == figure['value']
                assert beat['cue'] <= event['start'] <= beat['speechEnd']
                matches = [i for i, spoken in enumerate(scene['words'])
                           if beat['cue'] <= spoken['start'] <= beat['speechEnd']
                           and numeric(spoken['word']) == figure['value']]
                assert event['wordIndex'] == matches[figure.get('occurrence', 1) - 1]
            if beat['hold']:
                hold = next(hold for hold in scene['holds'] if hold['beat'] == beat['id'])
                assert hold['start'] >= beat['penEnd']
                assert abs(hold['end'] - hold['start'] - beat['hold']) < 0.00002
                assert not any(hold['start'] < other['cue'] < hold['end'] for other in scene['beats'])
                assert not any(hold['start'] < word['start'] < hold['end'] for word in scene['words'])
        pcm = array.array('h', subprocess.check_output([
            'ffmpeg', '-v', 'error', '-i', str(audio), '-f', 's16le', '-ac', '1', '-ar', str(RATE), '-',
        ]))
        for hold in scene['holds']:
            # Exclude MP3's short transform window at each silence boundary.
            samples = pcm[round((hold['start'] + 0.05) * RATE):round((hold['end'] - 0.05) * RATE)]
            assert samples, (scene['id'], hold)
            rms = math.sqrt(sum(value * value for value in samples) / len(samples))
            assert rms < 2, (scene['id'], hold['beat'], 'hold is not silent', rms)
        total_words += scene['wordCount']
        symbol_count = sum(event['target'].startswith('symbol-') for event in figures.values())
        total_figures += len(figures) - symbol_count
        total_symbols += symbol_count
        total_labels += len(labels)
        total_holds += len(scene['holds'])
        print(f"PASS {scene['id']}: {measured:.3f}s, {scene['wordCount']} words, {len(figures) - symbol_count} number cues, {symbol_count} symbol cues, {len(labels)} trolley-label cues")
    print(f"PASS total: {sum(scene['duration'] for scene in transcript['scenes']):.3f}s; "
          f'{total_words} Whisper words, {total_figures} number cues, {total_symbols} symbol cues, {total_labels} trolley-label cues, '
          f'{total_holds} measured silent holds')


if __name__ == '__main__':
    main()
