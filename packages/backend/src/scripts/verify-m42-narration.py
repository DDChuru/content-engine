#!/usr/bin/env python3
"""Reproducible M4.2 narration, inserted holds and local word-cue verification."""
import argparse, concurrent.futures, hashlib, json, os, re, subprocess
from pathlib import Path
import numpy as np
import requests
R=Path(__file__).resolve().parents[4]
A=R/'packages/backend/src/remotion/public/audio/mechanics'
P=R/'packages/backend/src/remotion/public/transcripts/mechanics'
SR=44100

def main():
 parser=argparse.ArgumentParser();parser.add_argument('project');parser.add_argument('--transcribe',action='store_true');args=parser.parse_args()
 source=(R/'packages/backend/projects'/args.project/'STORYBOARD.md').read_text()
 plan=json.loads(re.search(r'```json\n(.*?)\n```',source,re.S)[1]);prefix=plan['prefix']
 work=Path('/tmp')/('verify-'+prefix+'-narration');work.mkdir(exist_ok=True)
 if not args.transcribe:
  for line in Path('/home/durai/Documents/projects/content-engine/.env').read_text().splitlines():
   if line.startswith('ELEVENLABS_API_KEY='):os.environ['ELEVENLABS_API_KEY']=line.split('=',1)[1].strip().strip('"').strip("'")
  def generate(scene):
   chunks=[];position=0;beats=[];holds=[]
   def silence(seconds,kind):
    nonlocal position
    n=round(seconds*SR)
    if kind=='hold':holds.append(dict(kind=kind,start=position/SR,end=(position+n)/SR,duration=seconds))
    chunks.append(np.zeros(n,dtype=np.int16));position+=n
   silence(.4,'lead')
   for b in scene['beats']:
    key=hashlib.sha256(f"{scene['voiceSpeed']}|{b['text']}".encode()).hexdigest()[:16];cache=work/(key+'.mp3')
    if not cache.exists():
     response=requests.post('https://api.elevenlabs.io/v1/text-to-speech/gYWKdgLtqjPO3D5uDrDP',headers={'xi-api-key':os.environ['ELEVENLABS_API_KEY'],'Content-Type':'application/json'},json={'text':b['text'],'model_id':'eleven_turbo_v2_5','voice_settings':{'speed':scene['voiceSpeed']}},timeout=120)
     if response.status_code!=200:raise RuntimeError(f'ElevenLabs status {response.status_code}')
     cache.write_bytes(response.content)
    pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(cache),'-f','s16le','-ac','1','-ar',str(SR),'-'])
    values=np.frombuffer(pcm,dtype=np.int16).copy();step=441
    rms=[np.sqrt(np.mean(values[i:i+step].astype(float)**2)) for i in range(0,len(values),step)];active=np.flatnonzero(np.array(rms)>70)
    assert len(active),'Silent response'
    values=values[max(0,int(active[0])*step-2646):min(len(values),(int(active[-1])+1)*step+2646)]
    start=position/SR;chunks.append(values);position+=len(values);speech_end=position/SR
    # Pen travel is allowed to finish before the explicit hold begins.
    silence(max(.2,len(b.get('ink',''))*.10-(speech_end-start)),'pen-finish')
    beats.append({**b,'start':start,'speechEnd':speech_end,'end':position/SR})
    if b['hold']:silence(b['hold'],'hold')
   silence(.35,'tail')
   audio=A/f"{prefix}-{scene['id']}.mp3"
   subprocess.run(['ffmpeg','-v','error','-y','-f','s16le','-ac','1','-ar',str(SR),'-i','-','-codec:a','libmp3lame','-b:a','128k',str(audio)],input=np.concatenate(chunks).tobytes(),check=True)
   result={**scene,'beats':beats,'holds':holds,'audio':audio.name,'audioSha256':hashlib.sha256(audio.read_bytes()).hexdigest(),'voiceId':'gYWKdgLtqjPO3D5uDrDP','provider':'elevenlabs','sampleDuration':position/SR}
   (work/(scene['id']+'.json')).write_text(json.dumps(result,indent=2)+'\n');print(scene['id'],round(position/SR,2),flush=True);return result
  with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:scenes=list(pool.map(generate,plan['scenes']))
  (work/'timing.json').write_text(json.dumps(scenes,indent=2)+'\n');print('TOTAL',sum(s['sampleDuration'] for s in scenes),flush=True)
 else:
  from faster_whisper import WhisperModel
  model=WhisperModel('small',device='cpu',compute_type='int8',cpu_threads=4)
  scenes=json.loads((work/'timing.json').read_text())
  for s in scenes:
   words=[];cues={};events=[]
   full_cache=work/(s['id']+'-full-words.json')
   missing=any(not (work/(s['id']+'-'+b['id']+'-words.json')).exists() for b in s['beats'])
   full=[]
   if missing:
    if full_cache.exists() and json.loads(full_cache.read_text())['sha']==s['audioSha256']:full=json.loads(full_cache.read_text())['words']
    else:
     segs,_=model.transcribe(str(A/s['audio']),language='en',word_timestamps=True,beam_size=1,best_of=1,vad_filter=True,initial_prompt=' '.join(b['text'] for b in s['beats']),condition_on_previous_text=False)
     full=[dict(word=w.word.strip(),start=round(w.start,3),end=round(w.end,3)) for seg in segs for w in (seg.words or [])]
     full_cache.write_text(json.dumps(dict(sha=s['audioSha256'],words=full),indent=2)+'\n')
   for b in s['beats']:
    cache=work/(s['id']+'-'+b['id']+'-words.json')
    if cache.exists():local=json.loads(cache.read_text())
    else:
     local=[{**w,'start':max(b['start'],w['start']),'end':min(b['speechEnd'],w['end'])} for w in full if (w['start']+w['end'])/2>=b['start'] and (w['start']+w['end'])/2<b['speechEnd']]
     cache.write_text(json.dumps(local,indent=2)+'\n')
    assert local,(s['id'],b['id'],'No locally transcribed words')
    cues[b['id']]=local[0]['start'];b['cue']=local[0]['start'];b['penEnd']=max(b['cue']+.1,b['end']-.08)
    for w in local:
     i=len(words);words.append(w)
     if b.get('target') and (re.search(r'\d',w['word']) or re.sub(r'[^a-z]','',w['word'].lower()) in {'zero','one','two','three','four','six','eight','nine','twelve','minus','positive','s','v','u','you','a','t','c','d','half'}):events.append(dict(id=f'word-{i}',wordIndex=i,word=w['word'],start=w['start'],target=b['target'],kind='spoken'))
    if b.get('ink') and b.get('target'):events.append(dict(id=b['id']+'-substitution',start=b['cue'],end=b['penEnd'],target=b['target'],kind='substitution'))
   s.update(words=words,cues=cues,figureEvents=events,wordCount=len(words),text=' '.join(w['word'] for w in words),duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(A/s['audio'])])))
   assert len(cues)==len(s['beats']);print(s['id'],len(words),'words;',len(cues),'cues;',round(s['duration'],2),'seconds',flush=True)
  result=dict(project=args.project,sceneCount=len(scenes),scenes=scenes,totalDuration=sum(s['duration'] for s in scenes),engine='faster-whisper-small (local CPU)',unresolvedCues=[])
  (P/(prefix+'.json')).write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n');print('TOTAL',result['totalDuration'])
if __name__=='__main__':main()
