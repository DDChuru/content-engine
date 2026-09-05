"""Measure integer glyph origins and the Android alpha transfer from real text."""
from pathlib import Path
from PIL import Image,ImageFont,ImageDraw,ImageChops
from collections import Counter,defaultdict
import json
root=Path(__file__).resolve().parents[3]
src=Image.open(root/'public/boh-alt/reconstruct/cleaning-compose.png').convert('RGB')
font=ImageFont.truetype(str(root/'public/ccv-tutorial/fonts/DMSans_400Regular.ttf'),21,layout_engine=ImageFont.Layout.BASIC)
output=[];transfers=defaultdict(Counter)
for text,baseline in [('536 of 536 checks done (100%)',85),('· 0 cleaning checks missing · confor…',113)]:
 cursor=82;positions=[]
 for ch in text:
  bbox=font.getbbox(ch,anchor='ls'); x0,y0,x1,y1=bbox
  if x1<=x0 or y1<=y0:
   cursor+=font.getlength(ch);continue
  m=Image.new('L',(x1-x0,y1-y0));ImageDraw.Draw(m).text((-x0,-y0),ch,font=font,anchor='ls',fill=255)
  glyph=Image.new('RGB',m.size,'white');glyph.paste('#939CA8',mask=m)
  fits=[]
  for dx in range(-4,5):
   x=round(cursor)+dx
   patch=src.crop((x+x0,baseline+y0,x+x1,baseline+y1))
   err=sum(sum(p) for p in ImageChops.difference(patch,glyph).getdata())
   fits.append((err,x,patch))
  err,x,patch=min(fits,key=lambda a:a[0]);positions.append((ch,round(cursor,3),x,err))
  for a,b in zip(m.getdata(),patch.getdata()):transfers[a][b]+=1
  cursor+=font.getlength(ch)
 output.append(positions)
print(json.dumps(output))
lut={a:c.most_common(1)[0][0] for a,c in transfers.items()}
print('transfer samples',[(a,transfers[a].most_common(3)) for a in [0,10,50,150,200,250,255]])
re=Image.new('RGB',src.size,'white')
for positions,baseline in zip(output,[85,113]):
 for ch,_,x,_ in positions:
  x0,y0,x1,y1=font.getbbox(ch,anchor='ls');m=Image.new('L',(x1-x0,y1-y0));ImageDraw.Draw(m).text((-x0,-y0),ch,font=font,anchor='ls',fill=255)
  rgb=Image.new('RGB',m.size);rgb.putdata([lut[a] for a in m.getdata()]);re.paste(rgb,(x+x0,baseline+y0))
d=ImageChops.difference(re.crop((82,64,447,120)),src.crop((82,64,447,120)));v=list(d.getdata());print('placed + transfer',sum(max(p)>0 for p in v),sum(sum(p) for p in v))
re.save('/tmp/boh-measured-glyphs.png')
(root/'src/boh-alt/reconstruct/verify-glyphs.json').write_text(json.dumps({'positions':output,'transfer':lut},indent=2)+'\n')
