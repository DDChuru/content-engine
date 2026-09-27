"""Whole-lesson inspection from the ENCODED master: one frame every 8 s + every beat's first frame
+ the E01 marker boundary frames + the last frame; 9 per sheet."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, subprocess
p = Path(__file__).resolve().parent; t = json.loads((p / 'timeline.json').read_text())
d = p / 'qa/encoded-frames'; d.mkdir(exist_ok=True); s = p / 'qa/encoded-sheets'; s.mkdir(exist_ok=True)
for f in list(d.glob('*.png')) + list(s.glob('*.jpg')): f.unlink()
want = set(range(0, t['durationFrames'], 240)) | {sc['startFrame'] for sc in t['scenes']} | {t['durationFrames'] - 1}
iv = json.loads((p / 'qa/error-intervals.json').read_text())['intervals'] if (p / 'qa/error-intervals.json').exists() else []
for i in iv: want |= {i['startFrame'], i['endFrame'] - 1, i['endFrame']}
want = sorted(want)
sel = '+'.join(f'eq(n\\,{f})' for f in want)
subprocess.run(['nice', '-n', '10', 'ffmpeg', '-v', 'error', '-y', '-threads', '3', '-i', str(p / '2.1.1-food-tests.mp4'), '-vf', f"select='{sel}',scale=960:540", '-fps_mode', 'passthrough', str(d / 'f-%04d.png')], check=True)
files = sorted(d.glob('f-*.png')); assert len(files) == len(want), (len(files), len(want))
entries = [{'file': f.name, 'frame': fr, 'seconds': fr / 30} for f, fr in zip(files, want)]
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 19)
for n in range(0, len(entries), 9):
    sheet = Image.new('RGB', (1800, 1110), '#dedbd4'); draw = ImageDraw.Draw(sheet)
    for j, e in enumerate(entries[n:n + 9]):
        im = Image.open(d / e['file']).convert('RGB'); im.thumbnail((600, 338)); x = j % 3 * 600; y = j // 3 * 370; sheet.paste(im, (x, y))
        sc = next((sc for sc in t['scenes'] if sc['startFrame'] <= e['frame'] < sc['startFrame'] + sc['frames']), t['scenes'][-1])
        m, sec = divmod(e['seconds'], 60)
        draw.text((x + 10, y + 341), f"{int(m)}:{sec:05.2f} · frame {e['frame']} · Beat {sc['id']:02d}", font=font, fill='black')
    sheet.save(s / f'sheet-{n // 9 + 1:02d}.jpg', quality=93)
(d / 'index.json').write_text(json.dumps(entries, indent=2))
print(len(entries), 'encoded samples;', len(list(s.glob('sheet-*.jpg'))), 'sheets')
