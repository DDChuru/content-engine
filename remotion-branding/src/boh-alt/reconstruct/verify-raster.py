"""Investigate source Android glyph rasterization against the supplied TTF."""
from PIL import Image, ImageDraw, ImageFont, ImageChops
from collections import Counter,defaultdict
from pathlib import Path
root=Path(__file__).resolve().parents[3]
src=Image.open(root/'public/boh-alt/reconstruct/cleaning-compose.png').convert('RGB').crop((82,64,447,120))
f=ImageFont.truetype(str(root/'public/ccv-tutorial/fonts/DMSans_400Regular.ttf'),21,layout_engine=ImageFont.Layout.BASIC)
mask=Image.new('L',src.size);d=ImageDraw.Draw(mask)
d.text((0,21),'536 of 536 checks done (100%)',font=f,fill=255,anchor='ls')
d.text((0,49),'· 0 cleaning checks missing · confor…',font=f,fill=255,anchor='ls')
a=Image.new('RGB',src.size,'white');a.paste('#939CA8',mask=mask)
a.resize((1460,224)).save('/tmp/boh-pil-text.png')
by_alpha=defaultdict(Counter)
for alpha,p in zip(mask.getdata(),src.getdata()):by_alpha[alpha][p]+=1
print('mask shape difference',sum((al>0)!=(p!=(255,255,255)) for al,p in zip(mask.getdata(),src.getdata())))
print('sample mappings',[(v,by_alpha[v].most_common(3)) for v in [0,10,50,100,150,200,250,255]])
lookup={alpha:c.most_common(1)[0][0] for alpha,c in by_alpha.items() if c}
pred=Image.new('RGB',src.size);pred.putdata([lookup[v] for v in mask.getdata()])
v=list(ImageChops.difference(pred,src).getdata());print('best alpha map',sum(max(p)>0 for p in v),sum(sum(p) for p in v))
for box in [(0,0,14,28),(0,0,50,28),(0,0,365,28)]:
 p=list(ImageChops.difference(a.crop(box),src.crop(box)).getdata());print(box,'diff',sum(max(v)>0 for v in p),'err',sum(sum(v) for v in p))
