"""Regenerate src/beats/index.ts from the BeatNN.tsx files present."""
from pathlib import Path
P=Path(__file__).resolve().parent/'src/beats'
ids=sorted(int(f.stem[4:]) for f in P.glob('Beat[0-9][0-9].tsx'))
(P/'index.ts').write_text(''.join(f"import Beat{i:02d} from './Beat{i:02d}';\n" for i in ids)+'export const BEATS: Record<number, any> = {'+', '.join(f'{i}: Beat{i:02d}' for i in ids)+'};\n')
print('beats:',ids)
