#!/usr/bin/env python3
"""Local Whisper words and strict phrase cues for the additive displacement scenes."""
import json,re,hashlib,subprocess
from pathlib import Path
from faster_whisper import WhisperModel
R=Path(__file__).resolve().parents[4];W=Path('/tmp/verify-displacement-narration');P=R/'packages/backend/src/remotion/public/transcripts/mechanics/displacement-time-graphs.json';A=R/'packages/backend/src/remotion/public/audio/mechanics'
C={
's00':{'syllabus':'syllabus','position':'Read position','tangent':'use a tangent','distance':'separate distance'},
's07':{'setup':'Consider a walker','formula':'Gradient equals','symbol':'V equals','build':"Let's draw",'two-metres':('two metres',2),'ten-metres':('ten metres',2),'four-seconds':('four seconds',2),'two-metres-per-second':'two metres per second','rests':('Rest until',2),'six-seconds':('six seconds',2),'minus-six-metres':('minus six metres',2),'ten-seconds':('ten seconds',2),'minus-four-metres-per-second':'Minus four metres per second'},
's08':{'finish':'Finish minus start','formula':'Displacement','symbol':'delta s equals','minus-eight':'minus eight','distance-formula':'Distance','distance-symbol':'D equals','every-leg':'every leg','eight-metres-out':'Eight metres out','sixteen-metres-back':'sixteen metres back','twenty-four':'twenty four'},
's09':{'formula':'Average velocity','symbol':'v bar equals','ten-seconds':'Ten seconds','average-velocity':'Average velocity','minus-zero-point-eight':'minus zero point eight','average-speed':'Average speed','speed-symbol':'D over','two-point-four':'two point four','direction':'direction'},
's11':{'setup':'Consider a cyclist','build':"Let's draw",'formula':'Gradient equals','symbol':'delta s over','leg1':'Accelerating','leg2':'Cruising','leg3':'Resting','leg4':'Returning predict','answer1':'Two metres over two','answer2':'Six metres over three','answer3':'Zero over two','answer4':'Minus eight metres','tangent':'Tangent velocity','what-if':'What if'}}
def norm(x):
 x=x.lower().replace('meters','metres').replace('meter','metre').replace('twenty-four','twenty four')
 for a,b in [('0.8','zero point eight'),('2.4','two point four'),('24','twenty four'),('16','sixteen'),('10','ten'),('8','eight'),('6','six'),('4','four'),('3','three'),('2','two'),('1','one'),('0','zero')]:x=re.sub(r'(?<!\d)'+re.escape(a)+r'(?!\d)',b,x)
 return re.sub(r'[^a-z ]','',x).split()
def resolve(words,phrase,occ=1):
 tokens=[]
 for w in words:tokens.extend((t,w['start']) for t in norm(w['word']))
 target=norm(phrase);hits=[tokens[i][1] for i in range(len(tokens)-len(target)+1) if [t for t,_ in tokens[i:i+len(target)]]==target]
 if len(hits)<occ:raise ValueError(f'Missing {phrase} #{occ}')
 return hits[occ-1]
model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4)
result=[]
for s in json.loads((W/'timing.json').read_text()):
 cache=W/(s['id']+'-words.json');words=[]
 if cache.exists() and json.loads(cache.read_text())['sha']==s['audioSha256']:words=json.loads(cache.read_text())['words']
 else:
  for beat in s['beats']:
   segs,_=model.transcribe(str(A/s['audio']),language='en',word_timestamps=True,beam_size=5,vad_filter=False,clip_timestamps=[beat['start'],beat['end']],initial_prompt=beat['text'],condition_on_previous_text=False)
   words.extend({'word':w.word.strip(),'start':round(max(beat['start'],w.start),3),'end':round(min(beat['end'],w.end),3)} for seg in segs for w in (seg.words or []) if w.start<beat['end'] and w.end>beat['start'])
  cache.write_text(json.dumps({'sha':s['audioSha256'],'words':words},indent=2))
 cues={}
 for key,value in C[s['id']].items():
  phrase,occ=value if isinstance(value,tuple) else (value,1)
  try:cues[key]=resolve(words,phrase,occ)
  except ValueError as e:print(s['id'],e,flush=True)
 for i,w in enumerate(words):
  if any(t in ('zero','one','two','three','four','six','eight','ten','sixteen','twenty') for t in norm(w['word'])):cues[f'figure-{i}']=w['start']
 targets={
 's00':[],
 's07':['pos2','pos10','time4','time6','pos-6','time10','pos2','pos10','time4','speed2','time6','pos-6','time10','speed-4'],
 's08':['pos-8','pos8','pos16','pos24','pos24'],
 's09':['time10','speed-0.8','speed-0.8','speed2.4','speed2.4'],
 's11':['accel','time2','speed2','time3','rest2','speed-2','time4','pos2','time2','speed1','speed0','tangent2','pos6','time3','speed2','pos0','rest2','speed0','pos-8','time4','speed-2']}
 figures=[(i,w) for i,w in enumerate(words) if f'figure-{i}' in cues]
 if len(figures)!=len(targets[s['id']]):raise RuntimeError(f"Figure count {s['id']}: {len(figures)}")
 s['figureEvents']=[dict(id=f"figure-{i}",word=w['word'],start=w['start'],end=w['end'],target=target) for (i,w),target in zip(figures,targets[s['id']])]
 s.update(words=words,text=' '.join(w['word'] for w in words),wordCount=len(words),cues=cues,duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(A/s['audio'])])),engine='faster-whisper-small (local)')
 result.append(s);print(s['id'],s['duration'],s['text'],flush=True)
base=json.loads(subprocess.check_output(['git','show','b383a44:packages/backend/src/remotion/public/transcripts/mechanics/displacement-time-graphs.json'],cwd=R))
for s in base['scenes']:
 if s['id'] not in C:
  s.update(audioSha256=hashlib.sha256((A/s['audio']).read_bytes()).hexdigest(),reusedFrom='b383a44',holds=[],beats=[]);result.append(s)
order=['s00','s01','s02','s03','s04','s05','s06','s07','s08','s09','s11','s10'];result.sort(key=lambda s:order.index(s['id']))
missing=[s['id']+':'+key for s in result if s['id'] in C for key in C[s['id']] if key not in s['cues']]
if missing:raise RuntimeError(missing)
base.update(scenes=result,sceneCount=len(result),totalDuration=round(sum(s['duration'] for s in result),6));P.write_text(json.dumps(base,indent=2)+'\n');print('TOTAL',base['totalDuration'])
