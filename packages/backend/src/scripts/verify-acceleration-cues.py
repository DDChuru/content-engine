#!/usr/bin/env python3
"""Resolve gravity figure references from local words; prove values and silent holds."""
import argparse,array,hashlib,json,math,re,subprocess
from pathlib import Path
R=Path(__file__).resolve().parents[2]
P=R/'src/remotion/public/transcripts/mechanics/acceleration-due-to-gravity.json'
A=R/'src/remotion/public/audio/mechanics'
# Each target is a visible diagram label or a handwritten paper line. Numerals
# are resolved from actual local Whisper words, including split decimal tokens.
TARGETS={
 's02':{'weight':{'weight':'weight','g':'gravity'},'gravity':{'ten':'gravity','10':'gravity','g':'gravity'},'sign':{'minus':'acceleration','ten':'acceleration','10':'acceleration'},'top':{'zero':'top'}},
 's03':{'height':{'fifteen':'displacement','15':'displacement','minus':'displacement'},'initial':{'zero':'initial','0':'initial','ten':'acceleration','10':'acceleration','minus':'acceleration'},'formula':{'final':'result','initial':'initial','acceleration':'acceleration','displacement':'displacement'},'substitute':{'0':'initial','zero':'initial','2':'ink-substitute','two':'ink-substitute','10':'acceleration','ten':'acceleration','15':'displacement','fifteen':'displacement'},'square':{'300':'ink-square','three':'ink-square','hundred':'ink-square'},'result':{'*':'result'},'change':{'initial':'changed-initial'}},
 's04':{
  'story':{'12':'initial','twelve':'initial','height':'displacement','no':'conditions'},
  'givens':{'minus':'acceleration','ten':'acceleration','10':'acceleration'},
  'formula':{'final':'return','initial':'initial','acceleration':'acceleration','displacement':'displacement'},
  'substitute':{'twelve':'initial','12':'initial','two':'ink-substitute','2':'ink-substitute','ten':'acceleration','10':'acceleration','zero':'displacement','0':'displacement','s':'displacement'},
  'square':{'*':'ink-square','forty':'ink-square','144':'ink-square'},
  'roots':{'*':'ink-roots','plus':'ink-roots'},
  'result':{'minus':'return','twelve':'return','12':'return'},
  'graph':{'zero':'displacement','0':'displacement'},
  'caveat':{'height':'displacement','no':'conditions'}},
 's05':{'initial':{'eight':'initial','8':'initial'},'height':{'twenty':'displacement','20':'displacement','minus':'displacement'},'acceleration':{'minus':'acceleration','ten':'acceleration','10':'acceleration'}},
 's06':{'setup':{'time':'time-result'},'formula':{'displacement':'displacement','initial':'initial','acceleration':'acceleration','time':'time-result'},'substitute':{'twenty':'displacement','20':'displacement','eight':'initial','8':'initial','ten':'acceleration','10':'acceleration','half':'ink-substitute'},'rearrange':{'*':'ink-rearrange'},'roots':{'*':'ink-roots'},'positive':{'positive':'ink-positive'},'result':{'2':'time-result','two':'time-result','.95':'time-result','2.95':'time-result'}},
 's07':{'top':{'zero':'top','0':'top','eight':'initial','8':'initial','ten':'acceleration','10':'acceleration'},'formula':{'final':'top','initial':'initial','acceleration':'acceleration','displacement':'rise'},'substitute':{'zero':'top','0':'top','eight':'initial','8':'initial','two':'ink-substitute','2':'ink-substitute','ten':'acceleration','10':'acceleration','s':'rise'},'simplify':{'*':'ink-simplify'},'rise':{'*':'rise'},'height-formula':{'cliff':'cliff-height','rise':'rise'},'result':{'20':'cliff-height','twenty':'cliff-height','3':'rise','three':'rise','3.2':'rise','23':'height-result','23.2':'height-result'}},
 's08':{'answer':{'zero':'top','0':'top','minus':'acceleration','ten':'acceleration','10':'acceleration'}}}
NUMBERS={'zero','one','two','three','four','five','six','seven','eight','nine','ten','twelve','fifteen','seventeen','twenty','hundred','sixty','point','minus'}
def clean(w):return w.lower().strip('.,?!:;') if not w.startswith('.') else w.rstrip(',?!:;')
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--scene');args=parser.parse_args()
 d=json.loads(P.read_text());events=0
 for s in d['scenes']:
  if args.scene and s['id']!=args.scene:continue
  assert hashlib.sha256((A/s['audio']).read_bytes()).hexdigest()==s['audioSha256']
  assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP'
  assert s['voiceSpeed']==(.9 if s['tempo']=='slow' else 1.)
  s['figureEvents']=[]
  for b in s['beats']:
   assert b['start']-.001<=b['cue']<b['speechEnd']
   assert b['cue']<b['penEnd']<=b['end']
   rules=TARGETS.get(s['id'],{}).get(b['id'],{})
   last=None; result_phase='cliff-height'; after_seconds=False
   for i,w in enumerate(s['words']):
    if not (b['start']-.001<=w['start']<b['speechEnd']):continue
    token=clean(w['word']);numeric=bool(re.search(r'\d',token)) or token in NUMBERS
    target=rules.get(token) or (rules.get('*') if numeric else None)
    if (token.startswith('.') or token=='point') and last:target=last
    if s['id']=='s07' and b['id']=='result':
     if token=='plus':result_phase='rise'
     if token=='gives':result_phase='height-result'
     if numeric:target=result_phase
    if s['id']=='s06' and b['id']=='result':
     if token=='seconds':after_seconds=True
     if numeric:target=None if after_seconds else 'time-result'
    if token=='minus' and target is None:
     following=clean(s['words'][i+1]['word']) if i+1<len(s['words']) else ''
     target=rules.get(following)
    if s['id']=='s02' and b['id']=='top' and token=='zero' and any(e['target']=='top' for e in s['figureEvents']):target='acceleration'
    # The first height reference points at the physical height bracket, the
    # second at the signed displacement from launch to sea.
    if s['id']=='s05' and b['id']=='height' and token in {'twenty','20'} and not any(e['target']=='cliff-height' for e in s['figureEvents']):target='cliff-height'
    if target:
     s['figureEvents'].append(dict(id=f'word-{i}',wordIndex=i,word=w['word'],start=w['start'],target=target,kind='spoken'));last=target
   # Keep each source circled from its spoken substitution through its pen
   # window. Derived coefficients have paper targets, not invented givens.
   if b.get('ink'):
    for e in list(s['figureEvents']):
     if b['cue']<=e['start']<b['penEnd'] and not e['target'].startswith('ink-') and e['kind']=='spoken':
      s['figureEvents'].append(dict(id=b['id']+'-'+e['id'],start=e['start'],end=b['penEnd'],target=e['target'],kind='substitution'))
  events+=len([e for e in s['figureEvents'] if e['kind']=='spoken'])
  for h in s['holds']:
   raw=subprocess.check_output(['ffmpeg','-v','error','-ss',str(h['start']+.1),'-t',str(h['duration']-.2),'-i',str(A/s['audio']),'-f','s16le','-ac','1','-ar','8000','-'])
   values=array.array('h',raw);rms=math.sqrt(sum(v*v for v in values)/len(values));assert rms<5,(s['id'],h,rms)
  assert len(s['cues'])==len(s['beats'])
 # Durai's requested S04 derivation extends the original runtime; other scenes stay fixed.
 assert abs(d['totalDuration']-sum(s['duration'] for s in d['scenes']))<1e-6
 assert abs(sum(s['duration'] for s in d['scenes'] if s['id']!='s04')-272.509389)<1e-6
 assert 12**2+2*(-10)*0==144 and (-12)**2==144
 assert abs((-math.sqrt(300))**2-2*(-10)*(-15))<1e-10
 t=(8+math.sqrt(464))/10
 assert abs(8*t-5*t*t+20)<1e-10 and round(t,2)==2.95
 assert 8**2+2*(-10)*3.2==0 and 20+3.2==23.2
 d['unresolvedCues']=[];d['figureCueMethod']='Semantic targets indexed into isolated-beat local Whisper word timestamps'
 P.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 print(f"PASS: {sum(len(s['cues']) for s in d['scenes'])} resolved beat cues, {events} spoken-figure cues, audio hashes, inserted silent holds, and independent g=10 arithmetic; {d['totalDuration']:.3f} seconds")
if __name__=='__main__':main()
