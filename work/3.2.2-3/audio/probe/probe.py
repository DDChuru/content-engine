import json,urllib.request,sys
V='BcpjRWrYhDBHmOnetmBl';S=dict(stability=.5,similarity_boost=.75,style=0.,use_speaker_boost=True,speed=1.)
T={'raw':"That number is the Michaelis–Menten constant, Km. Km is eighteen millimoles per decimetre cubed. Vmax is nine, so half Vmax is four point five.",
   'spaced':"That number is the Michaelis–Menten constant, K M. K M is eighteen millimoles per decimetre cubed. V max is nine, so half V max is four point five."}
for k,t in T.items():
    r=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{V}?output_format=mp3_44100_128',data=json.dumps(dict(text=t,model_id='eleven_multilingual_v2',voice_settings=S)).encode(),headers={'Content-Type':'application/json','Accept':'audio/mpeg'},method='POST')
    open(f'audio/probe/{k}.mp3','wb').write(urllib.request.urlopen(r,timeout=120).read());print(k,len(t))
