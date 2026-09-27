"""Run 009f (review P3): verify the DELIVERED branded file, not only the master. Usage: verify_delivered.py <branded.mp4> <master.mp4>
Checks: 1920x1080 @ 30 · per-stream endpoints (start_time + duration AND last-packet end) with video end >= audio end ·
full decode 0 errors · duration = master + 11.03 s bookends (+ the <= 0.2 s end pad) · sha256. Writes qa/delivered-verification.json."""
from pathlib import Path
import json, subprocess, hashlib, sys
P = Path(__file__).resolve().parent
out, master = Path(sys.argv[1]), Path(sys.argv[2])
def probe(f): return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(f)]))
def last_end(f, sel):
    pk = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', sel, '-show_entries', 'packet=pts_time,duration_time', '-of', 'json', str(f)]))['packets']
    return max(float(p['pts_time']) + float(p.get('duration_time') or 0) for p in pk)
pr = probe(out); R = {'file': out.name}
v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
assert (v['width'], v['height'], v['r_frame_rate']) == (1920, 1080, '30/1'), (v['width'], v['height'], v['r_frame_rate'])
ve = float(v['start_time']) + float(v['duration']); ae = float(a['start_time']) + float(a['duration'])
vp, ap = last_end(out, 'v:0'), last_end(out, 'a:0')
R['endpoints'] = {'videoStart': float(v['start_time']), 'videoEnd': round(ve, 6), 'audioStart': float(a['start_time']), 'audioEnd': round(ae, 6),
                  'videoLastPacketEnd': round(vp, 6), 'audioLastPacketEnd': round(ap, 6), 'marginSeconds': round(min(ve, vp) - max(ae, ap), 4)}
assert ve >= ae and vp >= ap, ('delivered video ends before audio', R['endpoints'])
dec = subprocess.run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-xerror', '-threads', '3', '-i', str(out), '-f', 'null', '-'], capture_output=True)
assert dec.returncode == 0 and not dec.stderr, dec.stderr.decode()
R['fullDecodeErrors'] = 0
md = float(probe(master)['format']['duration']); od = float(pr['format']['duration'])
R['duration'] = {'master': md, 'branded': od, 'minusMaster': round(od - md, 3)}
assert 10.9 <= od - md <= 11.4, R['duration']
R['sha256'] = hashlib.sha256(out.read_bytes()).hexdigest()
(P / 'qa/delivered-verification.json').write_text(json.dumps(R, indent=2) + '\n')
print(json.dumps(R, indent=2))
