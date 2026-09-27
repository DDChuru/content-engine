"""Instance the Stem 4 Life brand WOFF2 variable fonts to static TTFs for librsvg, and write fonts/fonts.conf."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
P=Path(__file__).resolve().parent;F=P/'fonts';F.mkdir(exist_ok=True)
src=P.parent.parent/'packages/backend/src/remotion/public/stem4life/fonts'
for fam,file,name,weights in [('source-sans-3','source-sans-3-normal-400-700','Stem4Life Source Sans 3',[400,600,700]),('manrope','manrope-normal-500-700','Stem4Life Manrope',[500,700])]:
    for sub in ['latin','latin-ext']:
        for w in weights:
            f=TTFont(src/f'{file}-{sub}.woff2')
            if 'fvar' in f: f=instantiateVariableFont(f,{'wght':w})
            f.flavor=None
            for rec in f['name'].names:
                if rec.nameID in (1,16): rec.string=name
                if rec.nameID in (2,17): rec.string={400:'Regular',500:'Medium',600:'SemiBold',700:'Bold'}[w]
                if rec.nameID==4: rec.string=f'{name} {w}'
                if rec.nameID==6: rec.string=f'{name.replace(" ","")}-{w}'
            f['OS/2'].usWeightClass=w
            f.save(F/f'{fam}-{sub}-{w}.ttf')
(F/'fonts.conf').write_text(f'<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd">\n<fontconfig><dir>{F}</dir><dir>/usr/share/fonts</dir><cachedir>{P}/render-cache/fontcache</cachedir></fontconfig>\n')
print('fonts ready')
