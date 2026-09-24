from pathlib import Path
import sys,json
from PIL import Image,ImageDraw,ImageFont
p=Path(__file__).resolve().parent;beat=int(sys.argv[1]);d=p/'qa'/f'beat-{beat:02d}';entries=json.loads((d/'index.json').read_text());font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
for f in d.glob('sheet-*.jpg'): f.unlink()
for n in range(0,len(entries),6):
    im=Image.new('RGB',(1800,760),'#dedbd4');draw=ImageDraw.Draw(im)
    for j,e in enumerate(entries[n:n+6]):
        x=j%3*600;y=j//3*380;pic=Image.open(d/(e['id']+'.png')).convert('RGB');pic.thumbnail((600,338));im.paste(pic,(x,y));draw.text((x+8,y+344),f"{e['id']} · {e['frame']/30:.2f}s",font=font,fill='black')
    im.save(d/f'sheet-{n//6+1:02d}.jpg',quality=92)
print('Beat',beat,'sheets:',(len(entries)+5)//6)
