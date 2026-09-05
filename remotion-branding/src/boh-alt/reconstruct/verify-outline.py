"""Extract hinted outlines from the supplied app TTFs for renderer comparison."""
import ctypes as C
import json
from pathlib import Path

L=C.c_long;P=C.c_void_p
class Vector(C.Structure):_fields_=[('x',L),('y',L)]
class Generic(C.Structure):_fields_=[('data',P),('finalizer',P)]
class BBox(C.Structure):_fields_=[('xMin',L),('yMin',L),('xMax',L),('yMax',L)]
class Metrics(C.Structure):_fields_=[(s,L) for s in ['width','height','horiBearingX','horiBearingY','horiAdvance','vertBearingX','vertBearingY','vertAdvance']]
class Bitmap(C.Structure):_fields_=[('rows',C.c_uint),('width',C.c_uint),('pitch',C.c_int),('buffer',P),('num_grays',C.c_ushort),('pixel_mode',C.c_ubyte),('palette_mode',C.c_ubyte),('palette',P)]
class Outline(C.Structure):_fields_=[('n_contours',C.c_short),('n_points',C.c_short),('points',C.POINTER(Vector)),('tags',P),('contours',P),('flags',C.c_int)]
class Slot(C.Structure):_fields_=[('library',P),('face',P),('next',P),('glyph_index',C.c_uint),('generic',Generic),('metrics',Metrics),('linearHoriAdvance',L),('linearVertAdvance',L),('advance',Vector),('format',C.c_uint),('bitmap',Bitmap),('bitmap_left',C.c_int),('bitmap_top',C.c_int),('outline',Outline)]
class Face(C.Structure):_fields_=[(s,L) for s in ['num_faces','face_index','face_flags','style_flags','num_glyphs']]+[('family_name',P),('style_name',P),('num_fixed_sizes',C.c_int),('available_sizes',P),('num_charmaps',C.c_int),('charmaps',P),('generic',Generic),('bbox',BBox),('units_per_EM',C.c_ushort)]+[(s,C.c_short) for s in ['ascender','descender','height','max_advance_width','max_advance_height','underline_position','underline_thickness']]+[('glyph',C.POINTER(Slot)),('size',P),('charmap',P)]
VP=C.POINTER(Vector)
Move=C.CFUNCTYPE(C.c_int,VP,P);Line=Move;Conic=C.CFUNCTYPE(C.c_int,VP,VP,P);Cubic=C.CFUNCTYPE(C.c_int,VP,VP,VP,P)
class Funcs(C.Structure):_fields_=[('move_to',Move),('line_to',Line),('conic_to',Conic),('cubic_to',Cubic),('shift',C.c_int),('delta',L)]
ft=C.CDLL('libfreetype.so.6');lib=P();ft.FT_Init_FreeType(C.byref(lib))
root=Path(__file__).resolve().parents[3]
result={}
for family,file in [('body','DMSans_400Regular.ttf'),('chip','BarlowCondensed_700Bold.ttf')]:
 face=C.POINTER(Face)();assert ft.FT_New_Face(lib,str(root/'public/ccv-tutorial/fonts'/file).encode(),0,C.byref(face))==0
 ft.FT_Set_Pixel_Sizes(face,0,21)
 for flags in [0,1,2,32,65536,65568]:
  glyphs={}
  for ch in ''.join(chr(i) for i in range(32,127))+'·…✓':
   assert ft.FT_Load_Char(face,ord(ch),flags)==0
   slot=face.contents.glyph.contents;commands=[]
   scale=21/face.contents.units_per_EM if flags==1 else 1/64
   def xy(p):return f'{p.contents.x*scale:g},{-p.contents.y*scale:g}'
   def move(p,_):
    if commands:commands.append('Z')
    commands.append('M'+xy(p));return 0
   def line(p,_):commands.append('L'+xy(p));return 0
   def quad(a,b,_):commands.append('Q'+xy(a)+' '+xy(b));return 0
   def cubic(a,b,c,_):commands.append('C'+xy(a)+' '+xy(b)+' '+xy(c));return 0
   funcs=Funcs(Move(move),Line(line),Conic(quad),Cubic(cubic),0,0)
   ft.FT_Outline_Decompose(C.byref(slot.outline),C.byref(funcs),None)
   if commands:commands.append('Z')
   glyphs[ch]={'path':''.join(commands),'advance':round(slot.advance.x*scale) if flags==1 else slot.advance.x/64}
  result[f'{family}-{flags}']=glyphs
(root/'src/boh-alt/reconstruct/verify-outlines.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
print('Extracted font outlines for',list(result))
