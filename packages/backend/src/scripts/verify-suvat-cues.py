#!/usr/bin/env python3
"""Resolve all suvat labels to local words; check silence, source algebra and audio hashes."""
import array,hashlib,json,math,re,subprocess
from fractions import Fraction
from pathlib import Path
R=Path(__file__).resolve().parents[4];P=R/'packages/backend/src/remotion/public/transcripts/mechanics/deriving-suvat.json';A=R/'packages/backend/src/remotion/public/audio/mechanics'
def main():
 d=json.loads(P.read_text())
 for s in d['scenes']:
  assert hashlib.sha256((A/s['audio']).read_bytes()).hexdigest()==s['audioSha256']
  assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP' and s['voiceSpeed']==(.9 if s['tempo']=='slow' else 1.)
  for e in s['figureEvents']:
   if e['kind']!='spoken':continue
   assert e['start']==s['words'][e['wordIndex']]['start']
   w=re.sub('[^a-z0-9]','',e['word'].lower())
   if s['mode']!='choice':e['target']={'u':'initial','you':'initial','v':'final','t':'time','a':'acceleration','s':'area'}.get(w,e['target'])
  if s['mode']=='area':
   b=next(b for b in s['beats'] if b['id']=='meaning')
   w=next(w for w in s['words'] if b['start']<=w['start']<b['speechEnd'] and re.sub('[^a-z]','',w['word'].lower())=='if')
   s['cues']['negative-graph']=w['start']
  if s['mode']=='remove-t':
   for i,w in enumerate(s['words']):
    if re.sub('[^a-z]','',w['word'].lower())=='nonzero' and not any(e['id']==f'nonzero-{i}' for e in s['figureEvents']):s['figureEvents'].append(dict(id=f'nonzero-{i}',wordIndex=i,word=w['word'],start=w['start'],target='condition',kind='spoken'))
  for b in s['beats']:
   assert b['cue']>=b['start']-.001 and b['cue']<b['speechEnd']
   if b.get('ink'):assert b['cue']<b['penEnd']<=b['end']
  for h in s['holds']:
   raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(h['start']+.1),'-t',str(h['duration']-.2),'-i',str(A/s['audio']),'-f','s16le','-ac','1','-ar','8000','-'])
   values=array.array('h',raw);assert math.sqrt(sum(v*v for v in values)/len(values))<5
 # Independent exact substitution checks include signed motion and a = 0.
 for u in [-3,0,2]:
  for a in [-2,0,3]:
   for t in [Fraction(1,2),1,3]:
    v=u+a*t;s=u*t+Fraction(1,2)*a*t*t
    assert s==Fraction(1,2)*(u+v)*t==v*t-Fraction(1,2)*a*t*t
    assert v*v==u*u+2*a*s
    if a:assert t==(v-u)/a
    else:assert v==u
 P.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 print('PASS: five identities, zero-acceleration case, audio hashes, silence and',sum(len(s['cues']) for s in d['scenes']),'cues;',round(d['totalDuration'],3),'seconds.')
if __name__=='__main__':main()
