"""008f: brand a lesson master, then GUARANTEE video >= audio on the delivered file (review finding: branded audio
outlasted picture by 32-69 ms). apply-branding-cloud.sh is run unchanged; if the branded file's audio ends after its
video, the picture is PADDED by cloning the last (outro) frame — audio is never cut — so that video ends at least
0.20 s after audio (margin for the HLS re-encode's +21 ms video start). Then: full decode 0 errors, stream-end check,
duration = master + ~11.03 s. Writes qa/branded-verification.json in the lesson dir.
Usage: python3 brand_final.py <lesson dir> <code>"""
import json, subprocess, sys, hashlib, os
from pathlib import Path
L = Path(sys.argv[1]).resolve(); code = sys.argv[2]
R = Path(__file__).resolve().parents[1]
B = R / 'cloud-inputs/008/branding'
master = next(L.glob('*.mp4')) if False else None
masters = [p for p in L.glob('*.mp4') if 'branded' not in p.name]
assert len(masters) == 1, masters
master = masters[0]
raw = L / f'{code}-branded-raw.mp4'; out = L / f'{code}-branded.mp4'
BK = R / 'work/4.1.1-2/bookends'
intro = BK / f'intro-{code}.mp4'; outro = BK / f'outro-{code}.mp4'
assert intro.exists() and outro.exists(), (intro, outro)
env = dict(os.environ, BAR_PNG=str(B / f'bar-{code}.png'), MUSIC_MP3=str(B / 'tutorial.mp3'), INTRO_MP4=str(intro), OUTRO_MP4=str(outro))
subprocess.run(['bash', str(B / 'apply-branding-cloud.sh'), str(master), str(raw)], check=True, env=env)
def ends(f):
    pr = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,start_time,duration,nb_frames', '-show_entries', 'format=duration', '-of', 'json', str(f)]))
    v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
    return {'videoStart': float(v['start_time']), 'videoDur': float(v['duration']), 'videoEnd': float(v['start_time']) + float(v['duration']),
            'audioStart': float(a['start_time']), 'audioDur': float(a['duration']), 'audioEnd': float(a['start_time']) + float(a['duration']),
            'videoFrames': int(v.get('nb_frames', 0)), 'formatDur': float(pr['format']['duration'])}
e0 = ends(raw)
pad = max(0.0, e0['audioEnd'] - e0['videoEnd']) + 0.20
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(raw), '-vf', f'tpad=stop_mode=clone:stop_duration={pad:.3f}', '-c:v', 'libx264', '-preset', 'fast', '-crf', '19', '-pix_fmt', 'yuv420p', '-c:a', 'copy', '-movflags', '+faststart', str(out)], check=True)
e1 = ends(out)
assert e1['videoEnd'] >= e1['audioEnd'] + 0.15, e1
dec = subprocess.run(['ffmpeg', '-v', 'error', '-xerror', '-i', str(out), '-f', 'null', '-'], capture_output=True)
assert dec.returncode == 0 and not dec.stderr, dec.stderr[:500]
m = ends(master)
res = {'master': master.name, 'masterVideoDur': m['videoDur'], 'raw': e0, 'padSeconds': round(pad, 3), 'final': e1,
       'videoMinusAudioEnd': round(e1['videoEnd'] - e1['audioEnd'], 3), 'brandedMinusMaster': round(e1['formatDur'] - m['formatDur'], 3),
       'fullDecodeErrors': 0, 'sha256': hashlib.sha256(out.read_bytes()).hexdigest(), 'audioPacketsFromRaw': 'copied (-c:a copy): the audio stream is the branded audio unchanged'}
(L / 'qa/branded-verification.json').write_text(json.dumps(res, indent=2) + '\n')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f"{e1['formatDur'] / 2:.2f}", '-i', str(out), '-frames:v', '1', '-vf', 'scale=960:-1', '-q:v', '4', str(L / 'qa/branded-mid.jpg')], check=True)
raw.unlink()
print(json.dumps(res, indent=2))
