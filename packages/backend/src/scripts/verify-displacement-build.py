#!/usr/bin/env python3
"""Verify additive narration, source physics, and the final still audit."""
import array,hashlib,json,math,subprocess,sys
from pathlib import Path
R=Path(__file__).resolve().parents[4];B=R/'packages/backend';A=B/'src/remotion/public/audio/mechanics'
t=json.loads((B/'src/remotion/public/transcripts/mechanics/displacement-time-graphs.json').read_text());scenes=t['scenes'];by={s['id']:s for s in scenes}
assert [s['id'] for s in scenes]==['s00','s01','s02','s03','s04','s05','s06','s07','s08','s09','s11','s10']
assert 270<=sum(s['duration'] for s in scenes)<=330
assert 75<=by['s11']['duration']<=90
unchanged=[];holds=[]
for s in scenes:
 p=A/s['audio'];assert hashlib.sha256(p.read_bytes()).hexdigest()==s['audioSha256']
 if s.get('reusedFrom'):
  assert p.read_bytes()==subprocess.check_output(['git','show','b383a44:'+str(p.relative_to(R))],cwd=R);unchanged.append(s['id'])
 else:
  assert s['voiceId']=='gYWKdgLtqjPO3D5uDrDP';assert s['voiceSpeed']==(1 if s['id']=='s00' else .9)
  for e in s['figureEvents']:
   assert any(w['start']==e['start'] and w['word']==e['word'] for w in s['words'])
  pcm=array.array('h',subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','s16le','-ac','1','-ar','44100','-']))
  for h in s['holds']:
   assert h['duration']==(3 if h['kind']=='pause' else 2)
   assert abs(h['end']-h['start']-h['duration'])<1e-6
   values=pcm[round((h['start']+.1)*44100):round((h['end']-.1)*44100)]
   rms=math.sqrt(sum(v*v for v in values)/len(values));assert rms<3,(s['id'],h,rms);holds.append({'scene':s['id'],'seconds':h['duration'],'rms':rms})
assert unchanged==['s01','s02','s03','s04','s05','s06','s10']
# Independent kinematics: u=0, a=1, t=2; cruise; rest; return.
u,a,dt=0,1,2
v=u+a*dt;s=u*dt+a*dt*dt/2
assert (s,v)==(2,2)
positions=[0,s,s+v*3,s+v*3,s+v*3-2*4]
assert positions==[0,2,8,8,0]
assert [(positions[i+1]-positions[i])/dt for i,dt in enumerate([2,3,2,4])]==[1,2,0,-2]
assert (10-2)/(4-0)==2 and (-6-10)/(10-6)==-4
assert -6-2==-8 and abs(10-2)+abs(-6-10)==24
assert (-6-2)/10==-.8 and 24/10==2.4
if '--audio-only' in sys.argv:
 print(json.dumps({'narrationSeconds':t['totalDuration'],'unchangedMP3s':unchanged,'silenceHolds':holds,'physics':'passed'},indent=2));sys.exit(0)
report=json.loads((B/'out/verify-displacement-stills/verify-measurements.json').read_text())
assert not report['violations'];assert not report['printedCollisions'];assert not report['pixelFailures']
assert all(h['geometryIdentical'] for h in report['holds'])
assert all(h['pixelsOver10']<20 and h['totalDifference']<5000 for h in report['holdPixelDifferences'])
assert len(report['spokenFigureEvents'])==47
assert len(report['holds'])==len(holds)==14
complete={x['text'] for row in report['measurements'] for x in row['inkLayouts'] if x['complete']}
for line in ['Δs = 2 m   Δt = 2 s   v = +1 m/s average','Δs = 6 m   Δt = 3 s   v = +2 m/s','Δs = 0 m   Δt = 2 s   v = 0','Δs = −8 m   Δt = 4 s   v = −2 m/s']:
 assert line in complete,line
print(json.dumps({'stills':report['stills'],'narrationSeconds':t['totalDuration'],'renderFrames':report['durationFrames'],'unchangedMP3s':unchanged,'spokenFigures':47,'silenceHolds':holds,'physics':'passed'},indent=2))
