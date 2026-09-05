"""Reproducibly crop the source captures; never draw any ledger UI."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
DEST = ROOT / 'public/boh-alt/reconstruct'
DEST.mkdir(parents=True, exist_ok=True)
images = {n: Image.open(ROOT / f'public/boh/shots/boh-{n}.png').convert('RGB') for n in ['02', '07']}
manifest = {'width': 720, 'height': 1600, 'canvas': '#F1F4F8', 'viewportTop': 332, 'footerTop': 1400, 'scrollPx': 443,
 'notes': [
  'All UI assets are rectangular, unmodified crops of the real captures. Bounds are half-open source pixels.',
  'The Android scroll changes glyph/edge rasterization: paired row crops preserve each captured endpoint while their document positions translate continuously by 443px.',
  'The translucent navigation was already flattened over content in the captures. Fixed footer crops retain that backing; their endpoint dissolve is restricted to y=1400..1600.',
  'Cleaning subtitle includes a second captured, ellipsized line. Its continuation is retained when resetting the original primary subtitle; illustrative values replace the complete subtitle.'
 ], 'slices': {}}

def crop(key, source, box, top, **extra):
    path = f'boh-alt/reconstruct/{key}.png'
    images[source].crop(box).save(ROOT / 'public' / path)
    manifest['slices'][key] = dict(src=path, source=f'boh/shots/boh-{source}.png', box=list(box), x=box[0], y=top,
                                   width=box[2]-box[0], height=box[3]-box[1], **extra)

crop('header', '02', (0,0,720,332), 0)
crop('header-scrolled', '07', (0,0,720,332), 0)
crop('footer', '02', (0,1400,720,1600), 1400)
crop('footer-scrolled', '07', (0,1400,720,1600), 1400)
bounds = [332,464,628,763,926,1061,1196,1328]
names = ['Shift Handover','Cleaning Verification','CCV','Remedial','Daily Hygiene Checklist','Equipment Recon','PPE Recon']
phrases = ['handover','cleaning verification','chemical verification','remedials','hygiene','equipment','PPE']
for i,(start,end,name,phrase) in enumerate(zip(bounds,bounds[1:],names,phrases),1):
    crop(f'row-{i:02}', '02', (0,start,720,end), start, title=name, cue=phrase, group='daily')
    if i >= 4:
        a=max(332,start-443)
        crop(f'row-{i:02}-scrolled', '07', (0,a,720,end-443), a+443)
crop('divider', '02', (0,1328,720,1410), 1328)
crop('divider-scrolled', '07', (0,885,720,967), 1328)
for i,a,b,name,phrase in [(8,967,1130,'Inspection Remedials','inspection remedials'),(9,1130,1265,'NCR','non-conformances'),(10,1265,1400,'IINM','incidents')]:
    crop(f'row-{i:02}', '07', (0,a,720,b), a+443, title=name, cue=phrase, group='carry')
# A tight row crop for the text-editing API and its independent fidelity proof.
crop('cleaning-compose', '02', (30,464,690,612), 464)
manifest['compose'] = {
 'slice': 'cleaning-compose', 'background': '#FFFFFF',
 'originalSubtitle': '536 of 536 checks done (100%)',
 'originalContinuation': '· 0 cleaning checks missing · confor…',
 'originalChip': '✓ Cleared',
 'subtitle': {'x':82,'y':65,'width':360,'height':53,'fontFamily':'DM Sans','fontSize':21,'fontWeight':400,'letterSpacing':0,'baseline':85,'lineHeight':28,'color':'#939CA8'},
 'chip': {'x':465,'y':52,'width':117,'height':44,'fontFamily':'Barlow Condensed','fontSize':21,'fontWeight':700,'letterSpacing':0.3,'baseline':82},
 'tones': {'sky':{'accent':'#3CB6E0','tint':'#E0F3FA','ink':'#1582AB'},'emerald':{'accent':'#1F9C5A','tint':'#DCEFE3','ink':'#1F9C5A'},'amber':{'accent':'#E89A30','tint':'#FBEEDB','ink':'#A96800'},'coral':{'accent':'#D6432F','tint':'#F8DCD8','ink':'#D6432F'}}
}
(ROOT / 'src/boh-alt/reconstruct/slices.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(f'Cropped {len(manifest["slices"])} real image slices.')
