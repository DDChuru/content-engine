import fs from 'node:fs';
import path from 'node:path';
import { SyllabusMap } from '@/components/syllabus-map';

/**
 * The whole 9709 map, open to anyone. This is what `/` used to be, and it is
 * still the public front door of the library: study is free and needs no account,
 * so the map has to be reachable without one. A signed-in student gets `/study`
 * instead, which knows what they are sitting.
 */
export default function SyllabusPage() {
  const hasIllustration = fs.existsSync(
    path.join(process.cwd(), 'public', 'illustrations', 'empty-progress.png')
  );
  return <SyllabusMap hasIllustration={hasIllustration} />;
}
