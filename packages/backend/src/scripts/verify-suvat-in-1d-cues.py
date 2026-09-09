#!/usr/bin/env python3
"""Resolve spoken figure references against local Whisper words; verify narration assets."""
import hashlib,json,re,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[2]
P=R/'src/remotion/public/transcripts/mechanics/suvat-in-1d.json'
D=json.loads(P.read_text())
# Alternatives accommodate Whisper's spelled, numeric and split-number readings.
TERMS={10:['10','ten'],4:['4','four'],48:['48','forty eight'],22:['22','twenty two'],484:['484','four hundred and eighty four'],3:['3','three'],6:['6','six'],7:['7','seven'],0:['0','zero'],5:['5','five'],165:['165','one hundred and sixty five'],112:['112','one hundred and twelve'],8:['8','eight'],33:['33','thirty three'],14:['14','fourteen'],2.5:['2.5','2 5','two point five'],1.17:['1.17','1 17','one point one seven']}
REFS={
's03':{'setup-a':[(4,'a')],'setup-u':[(10,'u')],'setup-s':[(48,'s')],'substitute':[(10,'u'),(4,'a'),(48,'s')],'square':[(484,'squared')],'result':[(22,'v')]},
's04':{'substitute':[(22,'v'),(10,'u'),(4,'a')],'result':[(3,'t')]},
's05':{'setup-t':[(6,'t')],'setup-u':[(7,'u')],'setup-v':[(0,'v')],'substitute':[(0,'v'),(7,'u'),(6,'t')],'result':[(7,'a')],'meaning':[(1.17,'deceleration')],'distance-substitute':[(7,'u'),(0,'v'),(6,'t')],'distance-result':[(21,'s')]},
's06':{'setup-u':[(10,'u')],'setup-a':[(4,'a')],'setup-t':[(5,'t')],'substitute':[(10,'u'),(4,'a'),(5,'t')],'result':[(10,'v')],'position-substitute':[(10,'u'),(5,'t'),(4,'a')],'position-result':[(0,'s')]},
's07':{'setup-c':[(165,'Cs'),(10,'Ct')],'setup-b':[(8,'Bt'),(112,'Bs')],'substitute':[(165,'Cs'),(10,'Ct')],'simplify':[(33,'eq1')],'second-substitute':[(112,'Bs'),(8,'Bt')],'second-simplify':[(14,'eq2')],'result-a':[(2.5,'a')],'result-u':[(4,'u')]}}
TERMS[21]=['21','twenty one']
REFS['s07']['story']=[('a','A'),('b','B'),('c','C')]
TERMS.update({-4:['minus four','minus 4'], -10:['minus ten','minus 10'], -7:['minus seven','minus 7']})
REFS['s06']['setup-a']=[(-4,'a')]
REFS['s06']['result']=[(-10,'v')]
REFS['s05']['result']=[(-7,'a')]

def token(x):return re.sub(r'[^a-z0-9.]','',x.lower()).strip('.')
def matches(words,terms):
 # Split alphanumeric readings such as '6a' and '2as' without changing timestamps.
 tokens=[];indices=[]
 for i,w in enumerate(words):
  for part in re.findall(r'\d+(?:\.\d+)?|[a-z]+',token(w['word'])):tokens.append(part);indices.append(i)
 found=[]
 for term in terms:
  expected=term.split()
  for j in range(len(tokens)-len(expected)+1):
   if tokens[j:j+len(expected)]==expected:found.append(indices[j])
 return sorted(set(found))

count=0;proof=[]
for s in D['scenes']:
 assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP' and s['voiceSpeed']==(0.9 if s['tempo']=='slow' else 1.0)
 audio=R/'src/remotion/public/audio/mechanics'/s['audio']
 assert hashlib.sha256(audio.read_bytes()).hexdigest()==s['audioSha256']
 assert all(b['id'] in s['cues'] for b in s['beats'])
 events=[]
 for b in s['beats']:
  if s['id']=='s07' and b.get('list'):b['required']=[1,3]
  local=[(i,w) for i,w in enumerate(s['words']) if b['start']-.001<=w['start']<b['speechEnd']+.001]
  ws=[w for _,w in local]
  assert ws,(s['id'],b['id'])
  for value,target in REFS.get(s['id'],{}).get(b['id'],[]):
   hits=matches(ws,[value] if isinstance(value,str) else TERMS[value]);assert hits,(s['id'],b['id'],value,ws)
   for j in hits:
    if s['id']=='s07' and b['id']=='story' and value=='a' and token(ws[j]['word'])!='a':continue
    if s['id']=='s07' and b['id']=='story' and value=='a' and (j==0 or token(ws[j-1]['word'])!='through'):continue
    index,word=local[j];events.append(dict(id=f'word-{index}-{target}',wordIndex=index,word=word['word'],start=word['start'],target=target,kind='spoken',beat=b['id']))
  # Explicit named variables are pointed out during list selection and formula speech.
  if b.get('list') or 'formula' in b['id'] or b['id']=='method' or b['id'].startswith('setup') or (s['id']=='s08' and b['id'] in ['question','answer']):
   for j,w in enumerate(ws):
    name=token(w['word']);name={'you':'u','acceleration':'a','displacement':'s','time':'t'}.get(name,name)
    if name in ['s','u','v','a','t']:
     if s['id']=='s07' and name=='a' and j>0 and token(ws[j-1]['word']) in ['for','from','to']:continue
     if s['id']=='s07' and name in ['s','t']:name=('B' if b.get('page',0)==1 else 'C')+('s' if name=='s' else 't')
     index=local[j][0];events.append(dict(id=f'word-{index}-{name}',wordIndex=index,word=w['word'],start=w['start'],target=name,kind='spoken',beat=b['id']))
  # A substitution ring follows the pen after the spoken onset, without moving the cue.
  for e in [e for e in events if e['beat']==b['id'] and b.get('ink') and not b.get('list')]:
   events.append(dict(id=e['id']+'-pen',start=e['start'],end=max(e['start']+.4,min(b['penEnd'],e['start']+1.5)),target=e['target'],kind='substitution',beat=b['id']))
  assert b['cue']<b['penEnd']<=b['end']
  assert b['penEnd']<=b['end']+.001
  count+=1
 s['figureEvents']=events
 if s['id']=='s01':
  for id,term in [('quote2','with'),('outcome1','choose'),('outcome2','keep'),('outcome3','solve')]:
   hit=matches(s['words'],[term]);assert hit;s['cues'][id]=s['words'][hit[0]]['start']
 if s['id']=='s08':
  for id,term in [('outcome1','choose'),('outcome2','keep'),('outcome3','solve')]:
   candidates=[i for i in matches(s['words'],[term]) if s['words'][i]['start']>=s['cues']['recap']];assert candidates;s['cues'][id]=s['words'][candidates[0]]['start']
 # Verify the inserted holds are actually silent in the encoded delivery audio.
 pcm=subprocess.check_output(['ffmpeg','-v','error','-i',str(audio),'-f','s16le','-ac','1','-ar','44100','-'])
 import numpy as np
 values=np.frombuffer(pcm,dtype=np.int16)
 for h in s['holds']:
  samples=values[round((h['start']+.08)*44100):round((h['end']-.08)*44100)]
  peak=int(np.abs(samples.astype(np.int32)).max());assert peak<100,(s['id'],h,peak)
  proof.append(dict(scene=s['id'],start=h['start'],end=h['end'],peak=peak))
from fractions import Fraction
assert 22**2==10**2+2*4*48 and (22-10)/4==3
assert Fraction(-7,6)*6+7==0 and Fraction(1,2)*(7+0)*6==21
assert 10-4*5==-10 and 10*5+Fraction(1,2)*(-4)*5**2==0
assert 4*10+Fraction(1,2)*Fraction(5,2)*10**2==165
assert 4*8+Fraction(1,2)*Fraction(5,2)*8**2==112
assert 300<=D['totalDuration']<=360,D['totalDuration']
D['unresolvedCues']=[]
D['figureCueCount']=sum(len(s['figureEvents']) for s in D['scenes'])
P.write_text(json.dumps(D,indent=2,ensure_ascii=False)+'\n')
report=dict(duration=D['totalDuration'],beats=count,wordCues=sum(len(s['cues']) for s in D['scenes']),spokenFigures=sum(e['kind']=='spoken' for s in D['scenes'] for e in s['figureEvents']),silentHolds=proof,unresolved=[])
(R/'projects/mechanics-suvat-in-1d/verify-narration.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='silentHolds'},indent=2))
