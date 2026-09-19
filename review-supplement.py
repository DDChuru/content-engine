from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import subprocess,json
root=Path.cwd(); out=root/'review-frames'; main=Path('/home/dachu/Documents/projects/content-engine'); source=main/'apps/student-learn/public/videos'
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
items=[]
for f in sorted(source.glob('*-fable.mp4')):
 d=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(f)]));t=round(d*.6,2); dest=out/('review-'+f.stem+'-'+str(t)+'s.jpg')
 subprocess.run(['ffmpeg','-nostdin','-v','error','-ss',str(t),'-i',str(f),'-frames:v','1','-vf','scale=960:-1','-q:v','2','-n',str(dest)],check=True)
 items.append((f.stem,t,dest))
sheet=Image.new('RGB',(1920,4*580),'#e5e5e5');draw=ImageDraw.Draw(sheet)
for i,(slug,t,path) in enumerate(items):
 x=(i%2)*960;y=(i//2)*580;draw.text((x+10,y+4),slug,fill='black',font=font);draw.text((x+10,y+23),f'{t:.2f}s',fill='black',font=font);sheet.paste(Image.open(path),(x,y+40))
sheet.save(out/'review-fable-sheet.jpg',quality=92)
print([(a,b) for a,b,_ in items])
