"""Compare native TTF hinting/raster options with the first captured numeral."""
import ctypes as C
import runpy
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
defs = runpy.run_path(str(HERE / 'verify-outline.py'))
ft, lib, Face, Vector = [defs[k] for k in ['ft', 'lib', 'Face', 'Vector']]
face = C.POINTER(Face)()
root = HERE.parents[2]
ft.FT_New_Face(lib, str(root / 'public/ccv-tutorial/fonts/DMSans_400Regular.ttf').encode(), 0, C.byref(face))
ft.FT_Set_Pixel_Sizes(face, 0, 21)
target = np.array(Image.open(root / 'public/boh-alt/reconstruct/cleaning-compose.png').convert('RGB'))[65:87,82:95].astype(int)
ink = np.array([147,156,168])
results = []
for version in [35,38,40]:
 v=C.c_uint(version);ft.FT_Property_Set(lib,b'truetype',b'interpreter-version',C.byref(v))
 for flags in [0,2,32,65536,65568,131072,196608,262144]:
  for shift in [0,16,32,48]:
   delta=Vector(shift,0);ft.FT_Set_Transform(face,None,C.byref(delta))
   ft.FT_Load_Char(face,ord('5'),flags);ft.FT_Render_Glyph(face.contents.glyph,0)
   slot=face.contents.glyph.contents;b=slot.bitmap
   raw=np.ctypeslib.as_array(C.cast(b.buffer,C.POINTER(C.c_ubyte)),shape=(b.rows*b.pitch,)).reshape(b.rows,b.pitch)[:,:b.width]
   alpha=np.zeros((22,13),int);y=20-slot.bitmap_top;x=slot.bitmap_left
   if y<0 or x<0 or y+b.rows>22 or x+b.width>13:continue
   alpha[y:y+b.rows,x:x+b.width]=raw
   for blend in ['round','floor','skia']:
    a=alpha[:,:,None]
    pred=np.rint(255+(ink-255)*a/255).astype(int) if blend=='round' else (255+(ink-255)*a/255).astype(int) if blend=='floor' else 255-((255-ink)*(a+(a>>7))>>8)
    score={'version':version,'flags':flags,'shift':shift,'blend':blend,'count':int(np.any(pred!=target,2).sum()),'error':int(np.abs(pred-target).sum())}
    results.append(score)
print(sorted(results,key=lambda r:r['error'])[:12])

fits=[]
for size in range(1328,1361):
 ft.FT_Set_Char_Size(face,0,size,72,72)
 for dx in range(-3,4):
  for dy in range(-4,5):
   delta=Vector(dx,dy);ft.FT_Set_Transform(face,None,C.byref(delta))
   ft.FT_Load_Char(face,ord('5'),0);ft.FT_Render_Glyph(face.contents.glyph,0)
   slot=face.contents.glyph.contents;b=slot.bitmap
   raw=np.ctypeslib.as_array(C.cast(b.buffer,C.POINTER(C.c_ubyte)),shape=(b.rows*b.pitch,)).reshape(b.rows,b.pitch)[:,:b.width]
   alpha=np.zeros((22,13),int);y=20-slot.bitmap_top;x=slot.bitmap_left
   if y<0 or x<0 or y+b.rows>22 or x+b.width>13:continue
   alpha[y:y+b.rows,x:x+b.width]=raw
   pred=np.rint(255+(ink-255)*alpha[:,:,None]/255).astype(int)
   fits.append({'size':size/64,'dx':dx,'dy':dy,'error':int(np.abs(pred-target).sum()),'count':int(np.any(pred!=target,2).sum())})
print('Size/phase:', sorted(fits,key=lambda r:r['error'])[:10])
