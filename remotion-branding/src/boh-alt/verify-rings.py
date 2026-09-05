"""Audit normalized ring geometry and render all nine phone beats as a 3x3 sheet.

Run from any directory: python3 src/boh-alt/verify-rings.py
Only the derived sheet is written; the real stills remain read-only.
"""
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
DATA = json.loads((ROOT / 'src/boh-alt/boxes.json').read_text())
BOXES = DATA['boxes']
W, H = DATA['sourceSize'].values()
COLORS = {'sky': '#3CB6E0', 'emerald': '#1F9C5A', 'amber': '#E89A30', 'coral': '#D6432F'}
FONTS = ROOT / 'public/ccv-tutorial/fonts'
TITLE = ImageFont.truetype(str(FONTS / 'BarlowCondensed_700Bold.ttf'), 30)
SMALL = ImageFont.truetype(str(FONTS / 'DMSans_500Medium.ttf'), 18)
CELL_W, CELL_H = 480, 1136
SHEET = Image.new('RGB', (CELL_W * 3, CELL_H * 3), '#0B1219')
DRAW = ImageDraw.Draw(SHEET)
BEATS = [1, 2, 3, 4, 5, 6, 7, 8, 11]
NOTES = {
    3: ['536/536, Cleared; VO numbers differ.', 'Row and status chip both provisional.'],
    5: ['Follow-up row; area below section.', 'Toilets pair / open counts pending.'],
    8: ['Remedial is not the narrated CLN gap.', 'Real Yesterday label; recapture pending.'],
    11: ['Only ONE amber row is visible.', 'No invented second ring.'],
}


def dashed(draw, rect, fill, width=6, dash=14):
    x0, y0, x1, y1 = rect
    for x in range(x0, x1, dash * 2):
        draw.line((x, y0, min(x + dash, x1), y0), fill=fill, width=width)
        draw.line((x, y1, min(x + dash, x1), y1), fill=fill, width=width)
    for y in range(y0, y1, dash * 2):
        draw.line((x0, y, x0, min(y + dash, y1)), fill=fill, width=width)
        draw.line((x1, y, x1, min(y + dash, y1)), fill=fill, width=width)


for index, beat in enumerate(BEATS):
    still = f'boh-{beat:02}'
    path = ROOT / f'public/boh/shots/{still}.png'
    with Image.open(path) as source:
        assert source.size == (W, H), (path, source.size)
        annotated = source.convert('RGB')
    pen = ImageDraw.Draw(annotated)
    entries = [(name, box) for name, box in BOXES.items() if box['still'] == still]
    assert entries, still
    for name, box in entries:
        x0, y0 = box['nx'] * W, box['ny'] * H
        x1, y1 = x0 + box['nw'] * W, y0 + box['nh'] * H
        expected = [box['targetPixels'][0] - 10, box['targetPixels'][1] - 10,
                    box['targetPixels'][2] + 10, box['targetPixels'][3] + 10]
        assert max(abs(a - b) for a, b in zip([x0, y0, x1, y1], expected)) < 0.001, name
        assert 0 <= x0 < x1 <= W and 0 <= y0 < y1 <= H, name
        assert box['provisional'] == (beat in NOTES), name
        rect = tuple(round(n) for n in (x0, y0, x1, y1))
        if box['provisional']:
            dashed(pen, rect, COLORS[box['color']])
        else:
            pen.rounded_rectangle(rect, radius=min(20, (rect[3] - rect[1]) // 4), outline=COLORS[box['color']], width=6)
    ox, oy = (index % 3) * CELL_W, (index // 3) * CELL_H
    DRAW.text((ox + 24, oy + 12), f'{beat:02}  {still}', font=TITLE, fill='#F4F7FA')
    DRAW.text((ox + 24, oy + 49), 'PROVISIONAL · MONDAY' if beat in NOTES else 'MEASURED · 10px MARGIN', font=SMALL, fill='#E89A30' if beat in NOTES else '#3CB6E0')
    SHEET.paste(annotated.resize((432, 960), Image.Resampling.LANCZOS), (ox + 24, oy + 80))
    for line, text in enumerate(NOTES.get(beat, [' + '.join(name for name, _ in entries), 'Full still · all ring stages shown together.'])):
        DRAW.text((ox + 24, oy + 1052 + line * 26), text, font=SMALL, fill='#B9C6D0')

output = ROOT / 'public/boh-alt/contact-rings.png'
SHEET.save(output)
print(f'PASS: {len(BOXES)} measured rings, 10px margins, 9 stills; {output}')
