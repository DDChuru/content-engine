from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw, ImageFont
import json, subprocess, hashlib
ROOT=Path.cwd(); SOURCE=Path('/home/dachu/Documents/projects/content-engine/apps/student-learn/public/videos'); OUT=ROOT/'review-frames'; OUT.mkdir(exist_ok=True)
lessons=json.loads((ROOT/'output/stem4life-lessons/verification.json').read_text())['lessons']
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)

def process(item):
 slug=item['slug']; path=SOURCE/(slug+'.mp4')
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration:stream=codec_type,width,height,r_frame_rate','-of','json',str(path)]))
 duration=float(info['format']['duration']); times=[round(duration*x,2) for x in [.15,.35,.6,.85]]; files=[]
 for t in times:
  dest=OUT/f'review-{slug}-{t:.2f}s.jpg'
  subprocess.run(['ffmpeg','-nostdin','-v','error','-ss',str(t),'-i',str(path),'-frames:v','1','-vf','scale=960:-1','-q:v','2','-threads','1','-n',str(dest)],check=True)
  files.append(str(dest.relative_to(ROOT)))
 digest=hashlib.sha256(path.read_bytes()).hexdigest()
 return {'slug':slug,'title':item['title'],'source':str(path),'duration':duration,'times':times,'files':files,'sha256':digest,'matches_bookend_manifest':digest==item.get('sourceMasterSha256'),'streams':info['streams']}
with ThreadPoolExecutor(max_workers=4) as pool: result=list(pool.map(process,lessons))
for g in range(0,len(result),4):
 batch=result[g:g+4]; sheet=Image.new('RGB',(1920,len(batch)*308),'#e5e5e5'); draw=ImageDraw.Draw(sheet)
 for r,item in enumerate(batch):
  for c,(t,f) in enumerate(zip(item['times'],item['files'])):
   draw.text((c*480+7,r*308+4),item['slug'].replace('mechanics-',''),fill='black',font=font)
   draw.text((c*480+7,r*308+21),f'{t:.2f}s (original, no intro)',fill='black',font=font)
   im=Image.open(ROOT/f); im.thumbnail((480,270)); sheet.paste(im,(c*480,r*308+38))
 sheet.save(OUT/f'review-sheet-{g//4+1:02}.jpg',quality=92)
(ROOT/'review-audit-manifest.json').write_text(json.dumps(result,indent=2)+'\n')
print('Extracted',sum(len(x['files']) for x in result),'stills across',len(result),'lessons')
print('Original hashes matching bookend manifest:',sum(x['matches_bookend_manifest'] for x in result))
for x in result: print(x['slug'],x['duration'],x['times'])
