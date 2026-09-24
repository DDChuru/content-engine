"""Ordered PIPELINE-STANDARD §4 verification of the 3.1.1-2 master, then the every-frame error-marker
audit (presence AND badge text) and the beat-boundary hold check. Writes qa/verification.json."""
from pathlib import Path
import json, subprocess, hashlib, wave, re, math, sys
import numpy as np
from PIL import Image
P = Path(__file__).resolve().parent
T = json.loads((P / 'timeline.json').read_text())
S = json.loads((P / 'script.json').read_text())
final = P / '3.1.1-2-enzymes.mp4'; audio = P / 'audio/narration-encoded.m4a'
R = {}
def probe(f): return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(f)]))
def packets(f): return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_packets', '-show_data_hash', 'sha256', '-show_entries', 'packet=pts,dts,duration,size,data_hash', '-of', 'json', str(f)]))['packets']
def maxvol(start, dur):
    r = subprocess.run(['ffmpeg', '-hide_banner', '-ss', f'{start:.3f}', '-t', f'{dur:.3f}', '-i', str(final), '-vn', '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True, check=True)
    return float(re.search(r'max_volume: ([-\d.inf]+) dB', r.stderr)[1])

# 1. ffprobe returns a duration
pr = probe(final); duration = float(pr['format']['duration']); assert duration > 0
R['1_ffprobeDuration'] = duration; print('1. ffprobe duration', duration, flush=True)
# 2. video >= encoded audio
v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
vd, ad = float(v['duration']), float(a['duration'])
assert (v['width'], v['height'], v['r_frame_rate']) == (1920, 1080, '30/1'); assert int(v['nb_frames']) == T['durationFrames']
assert vd >= ad, (vd, ad)
R['2_videoCoversAudio'] = {'video': vd, 'encodedAudio': ad, 'marginSeconds': round(vd - ad, 3), 'videoFrames': int(v['nb_frames'])}
print('2. video', vd, '>= encoded audio', ad, flush=True)
# 3. full decode, zero errors
dec = subprocess.run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-xerror', '-threads', '3', '-i', str(final), '-f', 'null', '-'], capture_output=True)
assert dec.returncode == 0 and not dec.stderr, dec.stderr.decode()
R['3_fullDecodeErrors'] = 0; print('3. full decode clean', flush=True)
# 4. cues matched = cue total; unique within beat and in narration order
norm = lambda s: re.findall(r"[a-z0-9]+", s.lower().replace('’', "'").replace("'", ''))
total = len(T['cues']); matched = 0
for sc, b in zip(T['scenes'], S):
    src = norm(b['text']); last = -1
    for c in sc['cues']:
        ts = norm(c['phrase']); occ = [i for i in range(len(src) - len(ts) + 1) if src[i:i + len(ts)] == ts]
        assert len(occ) == 1 and occ[0] > last and c['match'] == 'exact-spoken-token', (sc['id'], c['phrase'])
        last = occ[0]; matched += 1
R['4_cues'] = {'matched': matched, 'total': total}; print('4. cues', matched, '/', total, flush=True)
# 5. audio packets unchanged
p0, p1 = packets(audio), packets(final); assert p0 == p1, 'AAC packets or timestamps changed'
R['5_audioPacketsUnchanged'] = {'packets': len(p1), 'identical': True}; print('5. AAC packets identical', len(p1), flush=True)
# 6. final word not clipped
last = T['scenes'][-1]; words = json.loads((P / 'audio/beat-18.timed.words.json').read_text())['words']
lw = re.sub(r'[^a-z]', '', words[-1]['word'].lower()); assert lw == 'substrate', lw
lastEnd = last['start'] + words[-1]['end']; assert lastEnd < ad
tail = maxvol(lastEnd + 0.25, 1.0)
R['6_finalWord'] = {'word': words[-1]['word'], 'endsAt': round(lastEnd, 3), 'audioEnds': ad, 'headroom': round(ad - lastEnd, 3), 'afterWordMaxDb': tail}
print('6. final word', words[-1]['word'], 'ends', lastEnd, 'headroom', ad - lastEnd, flush=True)
# 7. silent reads measure silent (PCM zeros in source, encoded interior <= -70 dB); speech PCM unchanged
with wave.open(str(P / 'public/narration.wav')) as f: pcm = f.readframes(f.getnframes())
silent = []
for sc in T['scenes']:
    with wave.open(str(P / 'audio' / sc['audio'])) as f: timed = f.readframes(f.getnframes())
    with wave.open(str(P / f"audio/beat-{sc['id']:02d}.wav")) as f: raw = f.readframes(f.getnframes())
    off = sc['startFrame'] * 3200; assert pcm[off:off + len(timed)] == timed
    cursor = 0; shift = 0; restored = b''
    for h in sc['holds']:
        pos = (h['atSample'] + shift) * 2; ln = h['samples'] * 2
        restored += timed[cursor:pos]; assert not any(timed[pos:pos + ln]); cursor = pos + ln
        start = sc['start'] + (h['atSample'] + shift) / 48000; shift += h['samples']
        vol = maxvol(start + 0.1, h['seconds'] - 0.2); assert vol <= -70, (sc['id'], vol)
        silent.append({'beat': sc['id'], 'before': h['before'], 'start': round(start, 3), 'seconds': h['seconds'], 'pcmAllZero': True, 'encodedInteriorMaxDb': vol})
    restored += timed[cursor:]; assert restored == raw, sc['id']
R['7_silentReads'] = silent; R['7_speechPCMUnchanged'] = True
print('7. silent reads', [(x['beat'], x['before'], x['encodedInteriorMaxDb']) for x in silent], flush=True)
# frozen narration: storyboard text == script text; request == text with only the recorded substitutions
md = (P / 'STORYBOARD.md').read_text()
NORM = json.loads((P / 'request_normalise.json').read_text())
for b in S:
    req = json.loads((P / f"audio/beat-{b['id']:02d}.request.json").read_text())['text']
    want = b['text']
    for bid, old, new in NORM:
        if bid in (0, b['id']): want = want.replace(old, new)
    assert req == want, b['id']
    for para in b['paragraphs']: assert para in md, b['id']
R['frozenNarration'] = 'storyboard paragraphs present verbatim; requests differ only by the recorded request-only normalisations: ' + '; '.join(f'B{b}: {o}→{n}' for b, o, n in NORM)
# 8. no one-frame holds at beat boundaries
bf = subprocess.run([sys.executable, str(P / 'qa/detect_boundary_flash.py'), str(final), str(P / 'timeline.json'), '--output', str(P / 'qa/boundary-audit.json')], capture_output=True, text=True)
assert bf.returncode == 0, bf.stderr
ba = json.loads((P / 'qa/boundary-audit.json').read_text())
R['8_boundaries'] = {k: ba[k] for k in ba if k != 'boundaries'} if isinstance(ba, dict) else ba
print('8. boundary audit', R['8_boundaries'], flush=True)
# every-frame marker audit: presence AND badge text
subprocess.run(['node', str(P / 'error-intervals.cjs')], check=True, capture_output=True)
subprocess.run(['node', str(P / 'badge-refs.cjs')], check=True, capture_output=True)
iv = json.loads((P / 'qa/error-intervals.json').read_text())['intervals']
BX, BY, BW, BH = 1410, 22, 440, 56
refE = np.asarray(Image.open(P / 'qa/badge-EXAM.png').convert('RGB'))[BY:BY + BH, BX:BX + BW].astype(np.float32)
refC = np.asarray(Image.open(P / 'qa/badge-COMMON.png').convert('RGB'))[BY:BY + BH, BX:BX + BW].astype(np.float32)
proc = subprocess.Popen(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-threads', '3', '-i', str(final), '-vf', f'crop={BW}:{BH}:{BX}:{BY},format=rgb24', '-an', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
size = BW * BH * 3; mism = []; f = 0; stats = {'marked': 0, 'unmarked': 0}
worst = {'commonMaeMax': 0.0, 'examMaeMin': 1e9}
while True:
    buf = proc.stdout.read(size)
    if not buf: break
    img = np.frombuffer(buf, dtype=np.uint8).reshape(BH, BW, 3).astype(np.float32)
    exp = next((i for i in iv if i['startFrame'] <= f < i['endFrame']), None)
    px = img[6, 4]; seen = 145 < px[0] < 215 and px[1] < 115 and px[2] < 95
    maeE = float(np.abs(img - refE).mean()); maeC = float(np.abs(img - refC).mean())
    if exp:
        stats['marked'] += 1; worst['commonMaeMax'] = max(worst['commonMaeMax'], maeC); worst['examMaeMin'] = min(worst['examMaeMin'], maeE)
        ok = seen and maeC < 6 and maeE > maeC * 3 and exp['label'] == 'COMMON MISTAKE'
    else:
        stats['unmarked'] += 1; ok = not seen and maeE > 20 and maeC > 20
    if not ok: mism.append({'frame': f, 'expected': bool(exp), 'seen': bool(seen), 'maeExam': round(maeE, 2), 'maeCommon': round(maeC, 2)})
    f += 1
proc.wait(); assert f == T['durationFrames'], (f, T['durationFrames'])
(P / 'qa/marker-audit.json').write_text(json.dumps({'framesChecked': f, 'intervals': iv, 'stats': stats, 'badgeText': worst, 'mismatches': mism[:200], 'mismatchCount': len(mism)}, indent=2))
assert not mism, mism[:5]
R['markerAudit'] = {'framesChecked': f, **stats, 'intervals': iv, 'badgeTextMae': worst, 'mismatches': 0}
print('Marker audit: every frame; presence and COMMON MISTAKE text confirmed', stats, worst, flush=True)
# longest unchanged rendered visual (render ledgers)
gaps = []
for sc in T['scenes']:
    for e in json.loads((P / f"render-cache/beat-{sc['id']:02d}/ledger.json").read_text()): gaps.append({'beat': sc['id'], 'startFrame': e['from'], 'seconds': e['count'] / 30})
longest = max(gaps, key=lambda g: g['seconds'])
holds = [g for g in gaps if g['seconds'] > 15]
R['longestUnchangedVisual'] = longest; R['unchangedOver15s'] = holds
va = json.loads((P / 'render-cache/beat-09/valence-audit.json').read_text())
assert va['allOk'] and va['framesAudited'] > 0
R['valenceAudit'] = {'framesAudited': va['framesAudited'], 'allOk': va['allOk'], 'states': va['states'], 'molecules': sorted({' + '.join(f['molecules']) + ' (' + f['state'] + ')' for f in va['frames']})}
print('Valence audit', R['valenceAudit'], flush=True)
R['sha256'] = hashlib.sha256(final.read_bytes()).hexdigest()
(P / 'qa/verification.json').write_text(json.dumps(R, indent=2) + '\n')
print(json.dumps({k: R[k] for k in ['longestUnchangedVisual', 'unchangedOver15s', 'sha256']}, indent=2))
