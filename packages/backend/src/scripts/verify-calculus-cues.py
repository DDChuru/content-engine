#!/usr/bin/env python3
"""Resolve semantic diagram targets against the unedited local Whisper word list."""
import hashlib,json,math,re,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[4];P=R/'packages/backend/src/remotion/public/transcripts/mechanics/using-calculus-in-1d.json';A=R/'packages/backend/src/remotion/public/audio/mechanics'
def main():
 d=json.loads(P.read_text());checks=0
 for s in d['scenes']:
  assert hashlib.sha256((A/s['audio']).read_bytes()).hexdigest()==s['audioSha256']
  assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP'
  assert s['voiceSpeed']==(.9 if s['tempo']=='slow' else 1.)
  assert len(s['cues'])==len(s['beats'])
  kept=[]
  for e in s['figureEvents']:
   b=next(b for b in s['beats'] if b['cue']-.001<=e['start']<=b['penEnd']+.001)
   w=re.sub('[^a-z0-9]','',e.get('word','').lower())
   if s['id']=='s03' and b['id']=='what-if':e['target']='hypothetical'
   if s['id']=='s05' and b['id']=='roots':e['target']='roots'
   if s['id']=='s05' and b['id']=='rest-formula':e['target']='rest-condition'
   if s['id']=='s06' and b['id']=='graph-out':e['target']='s-value-0' if w in ('zero','0') else 's-value-4'
   if s['id']=='s06' and b['id']=='graph-back':
    if w in ('two','2'):continue # count of instants, not a displayed figure
    e['target']='s-value-0'
   if s['id']=='s07' and b['id']=='velocity':e['target']={'nine':'v-value-9','9':'v-value-9','zero':'v-value-0','0':'v-value-0','one':'v-time-1','1':'v-time-1','three':'v-time-3','3':'v-time-3'}.get(w,'given-poly')
   if s['id']=='s07' and b['id'] in ('out-eval','back-eval') and w not in ('zero','0','one','1','three','3'):e['target']='s-model'
   if e['target']=='s-zero':e['target']='s-value-0'
   if e['kind']=='spoken':assert e['start']==s['words'][e['wordIndex']]['start'];checks+=1
   kept.append(e)
  s['figureEvents']=kept
  for b in s['beats']:
   assert b['cue']>=b['start']-.001 and b['cue']<b['speechEnd']
   if b.get('ink'):assert b['cue']<b['penEnd']<=b['end']
  # Verify the middle of every explicit hold is actual near-silent PCM.
  for h in s['holds']:
   raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(h['start']+.1),'-t',str(h['duration']-.2),'-i',str(A/s['audio']),'-f','s16le','-ac','1','-ar','8000','-'])
   import array
   samples=array.array('h',raw);rms=math.sqrt(sum(x*x for x in samples)/len(samples));assert rms<5,(s['id'],h,rms)
 P.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 print('PASS',len(d['scenes']),'scenes;',sum(len(s['cues']) for s in d['scenes']),'resolved cues;',checks,'word-timed figures;',round(d['totalDuration'],3),'seconds; PCM silence verified.')
if __name__=='__main__':main()
