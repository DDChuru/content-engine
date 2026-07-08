import fs from 'node:fs';
import path from 'node:path';
import { SyllabusMap } from '@/components/syllabus-map';

export default function HomePage() {
  const hasIllustration = fs.existsSync(
    path.join(process.cwd(), 'public', 'illustrations', 'empty-progress.png')
  );
  return <SyllabusMap hasIllustration={hasIllustration} />;
}
