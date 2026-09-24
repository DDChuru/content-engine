"""Second-opinion transcription (faster-whisper medium, no prompt) of flagged beats, for adjudicating
suspected mispronunciations. Output qa/second-opinion-<beat>.json. Does not touch the cue pipeline."""
from pathlib import Path
import json,sys
from faster_whisper import WhisperModel
P=Path(__file__).resolve().parent
m=WhisperModel(sys.argv[1],device='cpu',compute_type='int8',cpu_threads=4)
for b in sys.argv[2:]:
    wav=P/'audio'/f'beat-{int(b):02d}.wav'
    segs,_=m.transcribe(str(wav),language='en',beam_size=5,word_timestamps=True,condition_on_previous_text=False,temperature=0.0)
    ws=[dict(word=w.word.strip(),start=round(w.start,2),end=round(w.end,2),p=round(w.probability,2)) for s in segs for w in s.words]
    (P/'qa'/f'second-opinion-{sys.argv[1]}-{int(b):02d}.json').write_text(json.dumps(ws,indent=1))
    print(b,' '.join(w['word'] for w in ws),flush=True)
