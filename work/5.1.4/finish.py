"""Join the 11 beat chunks (-c copy) with the once-encoded narration AAC (-c copy)."""
from pathlib import Path
import subprocess,json,sys
P=Path(__file__).resolve().parent
T=json.loads((P/'timeline.json').read_text())
assert len(T['scenes'])==8
fp=lambda i: subprocess.check_output(['node','-e',f"console.log(require('./beat-fingerprint.cjs')({i}))"],cwd=P,text=True).strip()
parts=[];stale=[]
for sc in T['scenes']:
    d=P/'render-cache'/f"beat-{sc['id']:02d}"
    assert (d/'complete.json').exists(),f"Beat {sc['id']} incomplete"
    assert not (d/'render.lock').exists(),f"Beat {sc['id']} still locked"
    done=json.loads((d/'complete.json').read_text())
    want=sc['frames']+(30 if sc['id']==8 else 0)
    assert done['frames']==want,(sc['id'],done['frames'],want)
    n=int(json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-count_packets','-show_entries','stream=nb_read_packets','-of','json',str(d/'video.mp4')]))['streams'][0]['nb_read_packets'])
    assert n==want,(sc['id'],n,want)
    if done.get('sourceHash')!=fp(sc['id']): stale.append(sc['id'])
    parts.append(d/'video.mp4')
if stale and '--allow-stale' not in sys.argv: raise SystemExit(f'Stale beats (source changed after render): {stale}')
aac=P/'audio/narration-encoded.m4a';wavsrc=P/'public/narration.wav';key=P/'audio/narration-encoded.source.json'
import hashlib
AAC_SETTINGS=['-c:a','aac','-b:a','192k','-ar','48000','-ac','1']
want={'narrationWavSha256':hashlib.sha256(wavsrc.read_bytes()).hexdigest(),'settings':AAC_SETTINGS}
# The AAC cache is keyed to the exact narration.wav bytes and encoder settings, so a timeline/hold/retake change that
# rewrites narration.wav can never be muxed as stale audio under new visuals.
if not (aac.exists() and key.exists() and json.loads(key.read_text())==want):
    # Atomic publish: drop the old sidecar FIRST (a half-updated cache can never match), encode to a temp file, rename
    # it into place only after ffmpeg succeeds, and write the sidecar LAST (itself via temp + rename).
    if key.exists(): key.unlink()
    part=aac.with_name(aac.stem+'.partial.m4a')
    if part.exists(): part.unlink()
    subprocess.run(['nice','-n','10','ffmpeg','-v','error','-y','-i',str(wavsrc),*AAC_SETTINGS,str(part)],check=True)
    part.replace(aac)
    kp=key.with_name(key.name+'.partial'); kp.write_text(json.dumps(want,indent=2)+'\n'); kp.replace(key)
manifest=P/'render-cache/beats.ffconcat'
manifest.write_text('ffconcat version 1.0\n'+''.join(f"file '{x}'\n" for x in parts))
out=P/'5.1.4-telomeres.mp4';tmp=P/'5.1.4-telomeres.partial.mp4'
subprocess.run(['nice','-n','10','ffmpeg','-v','error','-y','-safe','0','-f','concat','-i',str(manifest),'-i',str(aac),'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','+faststart',str(tmp)],check=True)
tmp.rename(out)
receipt={'renderer':'React/SVG component tree → react-dom/server → Sharp/librsvg → FFmpeg H.264 1080p30, beat-chunked, joined with -c copy','frames':T['durationFrames'],'staleBeats':stale,'beats':[json.loads((x.parent/'complete.json').read_text()) for x in parts]}
(P/'qa/render-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
print('Mux complete:',out,'stale:',stale)
