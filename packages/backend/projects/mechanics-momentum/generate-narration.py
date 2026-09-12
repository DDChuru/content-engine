#!/usr/bin/env python3
"""Generate Momentum scene audio and word-bound visual cues from narration-plan.json.

Run with a Python environment containing the already-installed faster_whisper and
the cached small model. This script never installs dependencies or downloads a
Whisper model. ELEVENLABS_API_KEY is read from the environment or the repo .env.
Per-beat generation caches live beside this script in the ignored .audio-cache.
"""
from __future__ import annotations

import concurrent.futures
import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
import wave
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel

PROJECT = Path(__file__).resolve().parent
ROOT = PROJECT.parents[3]
CACHE = PROJECT / '.audio-cache'
AUDIO = ROOT / 'packages/backend/src/remotion/public/audio/mechanics'
TRANSCRIPTS = ROOT / 'packages/backend/src/remotion/public/transcripts/mechanics'
VOICE = 'gYWKdgLtqjPO3D5uDrDP'
MODEL = 'eleven_turbo_v2_5'
SAMPLE_RATE = 44100


def load_key() -> str:
    if os.environ.get('ELEVENLABS_API_KEY'):
        return os.environ['ELEVENLABS_API_KEY']
    dotenv = ROOT / '.env'
    if dotenv.exists():
        for line in dotenv.read_text().splitlines():
            match = re.match(r'\s*(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*(.*)', line)
            if match:
                value = match[1].strip()
                if value.startswith(('"', "'")):
                    value = value[1:value.rfind(value[0])]
                else:
                    value = value.split(' #', 1)[0].strip()
                if value:
                    return value
    raise RuntimeError('ElevenLabs unavailable: ELEVENLABS_API_KEY is absent from environment and root .env')


def cache_path(scene: dict, beat: dict) -> Path:
    identity = json.dumps([VOICE, MODEL, scene['voiceSpeed'], beat['text']], ensure_ascii=False)
    digest = hashlib.sha256(identity.encode()).hexdigest()[:16]
    return CACHE / f"{scene['id']}-{beat['id']}-{digest}"


def generate_beat(scene: dict, beat: dict, key: str) -> None:
    path = cache_path(scene, beat).with_suffix('.mp3')
    if path.exists():
        return
    request = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128',
        data=json.dumps({
            'text': beat['text'],
            'model_id': MODEL,
            'voice_settings': {'stability': 0.5, 'similarity_boost': 0.75, 'speed': scene['voiceSpeed']},
        }).encode(),
        headers={'xi-api-key': key, 'Content-Type': 'application/json', 'Accept': 'audio/mpeg'},
        method='POST',
    )
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            audio = response.read()
    except urllib.error.HTTPError as error:
        raise RuntimeError(f'ElevenLabs unavailable: HTTP {error.code} for {scene["id"]}/{beat["id"]}') from None
    except urllib.error.URLError as error:
        raise RuntimeError(f'ElevenLabs unavailable: {error.reason}') from None
    if len(audio) < 1000:
        raise RuntimeError(f'ElevenLabs returned incomplete audio for {scene["id"]}/{beat["id"]}')
    path.write_bytes(audio)
    print(f"TTS {scene['id']}/{beat['id']}", flush=True)


def prepare_beat(scene: dict, beat: dict, whisper: WhisperModel) -> tuple[np.ndarray, list[dict]]:
    base = cache_path(scene, beat)
    wav_path = base.with_suffix('.wav')
    transcript_path = base.with_suffix('.words.json')
    if not wav_path.exists():
        pcm = subprocess.check_output([
            'ffmpeg', '-v', 'error', '-i', str(base.with_suffix('.mp3')),
            '-f', 's16le', '-ac', '1', '-ar', str(SAMPLE_RATE), '-',
        ])
        values = np.frombuffer(pcm, dtype=np.int16).copy()
        step = SAMPLE_RATE // 100
        windows = np.array([np.sqrt(np.mean(values[i:i + step].astype(float) ** 2)) for i in range(0, len(values), step)])
        active = np.flatnonzero(windows > 70)
        if not len(active):
            raise RuntimeError(f'Silent TTS response: {scene["id"]}/{beat["id"]}')
        margin = round(0.06 * SAMPLE_RATE)
        begin = max(0, int(active[0]) * step - margin)
        end = min(len(values), (int(active[-1]) + 1) * step + margin)
        values = values[begin:end]
        with wave.open(str(wav_path), 'wb') as output:
            output.setnchannels(1)
            output.setsampwidth(2)
            output.setframerate(SAMPLE_RATE)
            output.writeframes(values.tobytes())
    with wave.open(str(wav_path), 'rb') as source:
        values = np.frombuffer(source.readframes(source.getnframes()), dtype=np.int16).copy()
    if transcript_path.exists():
        words = json.loads(transcript_path.read_text())
    else:
        segments, _ = whisper.transcribe(
            str(wav_path), language='en', beam_size=5, word_timestamps=True,
            vad_filter=False, condition_on_previous_text=False, initial_prompt=beat['text'],
        )
        words = [{'word': word.word.strip(), 'start': round(word.start, 4), 'end': round(word.end, 4)}
                 for segment in segments for word in segment.words]
        if not words:
            raise RuntimeError(f'Whisper returned no words: {scene["id"]}/{beat["id"]}')
        transcript_path.write_text(json.dumps(words, indent=2) + '\n')
        print(f"Whisper {scene['id']}/{beat['id']}: {len(words)} words", flush=True)
    return values, words


NUMBER_WORDS = {
    'zero': '0', 'one': '1', 'two': '2', 'three': '3', 'four': '4',
    'five': '5', 'six': '6', 'seven': '7', 'eight': '8', 'nine': '9',
    'ten': '10', 'eleven': '11', 'twelve': '12', 'thirteen': '13',
    'fourteen': '14', 'fifteen': '15', 'sixteen': '16', 'seventeen': '17',
    'eighteen': '18', 'nineteen': '19', 'twenty': '20', 'thirty': '30',
    'forty': '40', 'fifty': '50', 'sixty': '60', 'hundred': '100',
}


def tokens(text: str) -> list[str]:
    signed = re.sub(r'\+(?=\d)', 'plus ', text.lower())
    signed = re.sub(r'[−-](?=\d)', 'minus ', signed)
    return [NUMBER_WORDS.get(word, word) for word in re.findall(r'[a-z]+|\d+(?:\.\d+)?', signed)]


def cue_bindings(beat: dict) -> list[dict]:
    bindings = list(beat.get('cueBindings', []))
    bindings.extend({'id': marker['id'], 'match': marker['phrase'], **({'occurrence': marker['occurrence']} if 'occurrence' in marker else {})}
                    for marker in beat.get('markers', []))
    bindings.extend({'id': f"{beat['id']}-figure-{i + 1}", 'match': figure['phrase'],
                     'occurrence': figure.get('occurrence', 1), 'target': figure['target'], 'word': figure['value']}
                    for i, figure in enumerate(beat.get('figures', [])))
    return bindings


def match_word(words: list[dict], binding: dict) -> int:
    flattened: list[tuple[str, int]] = []
    for index, word in enumerate(words):
        flattened.extend((token, index) for token in tokens(word['word']))
    sequence = [token for token, _ in flattened]
    alternatives = binding['match'] if isinstance(binding['match'], list) else [binding['match']]
    candidates = set()
    for alternative in alternatives:
        wanted = tokens(alternative)
        if not wanted:
            raise RuntimeError(f'Empty cue selector: {binding}')
        for i in range(len(sequence) - len(wanted) + 1):
            if sequence[i:i + len(wanted)] == wanted:
                candidates.add(flattened[i][1])
    ordered = sorted(candidates)
    occurrence = binding.get('occurrence', 1)
    if not ordered or occurrence > len(ordered):
        raise RuntimeError(f'Whisper cue selector did not match {binding}: {" ".join(w["word"] for w in words)}')
    if len(ordered) > 1 and 'occurrence' not in binding:
        raise RuntimeError(f'Ambiguous Whisper cue selector {binding}; specify occurrence')
    return ordered[occurrence - 1]


def compose_scene(scene: dict, whisper: WhisperModel) -> tuple[dict, list[dict]]:
    chunks: list[np.ndarray] = []
    position = 0
    words: list[dict] = []
    beats: list[dict] = []
    cues = {}
    events = []
    holds = []
    mapping = []

    def silence(seconds: float) -> None:
        nonlocal position
        count = max(0, round(seconds * SAMPLE_RATE))
        chunks.append(np.zeros(count, dtype=np.int16))
        position += count

    silence(0.4)
    for beat in scene['beats']:
        pcm, local_words = prepare_beat(scene, beat, whisper)
        start = position / SAMPLE_RATE
        first_index = len(words)
        words.extend({'word': word['word'], 'start': round(start + word['start'], 5), 'end': round(start + word['end'], 5)} for word in local_words)
        cue = words[first_index]['start']
        cues[beat['id']] = cue
        mapping.append({'id': beat['id'], 'beat': beat['id'], 'wordIndex': first_index, 'word': words[first_index]['word'], 'start': cue})
        chunks.append(pcm)
        position += len(pcm)
        speech_end = words[-1]['end']
        min_ink_seconds = beat.get('minInkSeconds', max(2.0, len(beat['ink']) * 0.105) if beat.get('ink') else 0)
        pen_end = max(speech_end + 0.12, cue + min_ink_seconds)
        end = max(position / SAMPLE_RATE + 0.2, pen_end + 0.08)
        silence(end - position / SAMPLE_RATE)
        end = position / SAMPLE_RATE
        hold = beat.get('hold', 0)
        beats.append({**beat, 'hold': hold, 'start': round(start, 5), 'speechEnd': speech_end,
                      'end': round(end, 5), 'cue': cue, 'penEnd': round(pen_end, 5)})
        for binding in cue_bindings(beat):
            local_index = match_word(local_words, binding)
            index = first_index + local_index
            word = words[index]
            cues[binding['id']] = word['start']
            mapping.append({'id': binding['id'], 'beat': beat['id'], 'selector': binding['match'],
                            'wordIndex': index, 'word': word['word'], 'start': word['start']})
            if binding.get('target'):
                events.append({'id': binding['id'], 'wordIndex': index,
                               'word': binding.get('word', word['word']), 'start': word['start'],
                               'target': binding['target'], 'kind': 'spoken'})
        if hold:
            hold_start = position / SAMPLE_RATE
            silence(hold)
            holds.append({'kind': 'hold', 'beat': beat['id'], 'start': round(hold_start, 5),
                          'end': round(position / SAMPLE_RATE, 5), 'duration': hold})
    silence(0.35)
    audio_path = AUDIO / f"momentum-{scene['id']}.mp3"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ac', '1', '-ar', str(SAMPLE_RATE),
                    '-i', '-', '-codec:a', 'libmp3lame', '-b:a', '128k', str(audio_path)],
                   input=np.concatenate(chunks).tobytes(), check=True)
    duration = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration',
                                             '-of', 'default=noprint_wrappers=1:nokey=1', str(audio_path)]))
    result = {**scene, 'beats': beats, 'holds': holds, 'audio': audio_path.name,
              'audioSha256': hashlib.sha256(audio_path.read_bytes()).hexdigest(),
              'voiceId': VOICE, 'provider': 'elevenlabs', 'voiceModel': MODEL,
              'sampleDuration': round(position / SAMPLE_RATE, 5), 'duration': duration,
              'words': words, 'cues': cues, 'figureEvents': events, 'wordCount': len(words),
              'text': ' '.join(word['word'] for word in words)}
    print(f"Scene {scene['id']}: {duration:.3f}s, {len(words)} Whisper words, {len(cues)} cues", flush=True)
    return result, mapping


def main() -> None:
    plan = json.loads((PROJECT / 'narration-plan.json').read_text())
    scenes = plan['scenes']
    for scene in scenes:
        scene.setdefault('voiceSpeed', 0.9 if scene['tempo'] == 'slow' else 1.0)
    if len({scene['id'] for scene in scenes}) != len(scenes):
        raise RuntimeError('Duplicate scene ids')
    for directory in (CACHE, AUDIO, TRANSCRIPTS):
        directory.mkdir(parents=True, exist_ok=True)
    whisper = WhisperModel('small', device='cpu', compute_type='int8', cpu_threads=2, local_files_only=True)
    key = load_key()
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        jobs = [executor.submit(generate_beat, scene, beat, key) for scene in scenes for beat in scene['beats']]
        for job in jobs:
            job.result()
    output = []
    mapping = []
    for scene in scenes:
        data, cue_data = compose_scene(scene, whisper)
        output.append(data)
        mapping.append({'id': scene['id'], 'audio': data['audio'], 'audioSha256': data['audioSha256'], 'bindings': cue_data})
    (TRANSCRIPTS / 'momentum.json').write_text(json.dumps({
        'project': 'mechanics-momentum', 'sceneCount': len(output),
        'transcriber': {'engine': 'faster-whisper', 'model': 'small', 'wordTimestamps': True,
                        'alignment': 'per-beat Whisper timestamps offset by composed PCM sample positions'},
        'scenes': output,
    }, indent=2, ensure_ascii=False) + '\n')
    (TRANSCRIPTS / 'momentum-cues.json').write_text(json.dumps({
        'project': 'mechanics-momentum', 'timingSource': 'momentum.json word-level Whisper transcript', 'scenes': mapping,
    }, indent=2, ensure_ascii=False) + '\n')
    print(f'TOTAL {sum(scene["duration"] for scene in output):.3f}s', flush=True)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(f'ERROR: {error}', file=sys.stderr)
        raise SystemExit(1) from None
