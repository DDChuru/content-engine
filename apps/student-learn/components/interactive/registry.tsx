'use client';

import { FrictionBench } from './friction-bench';
import { SlopeResolver } from './slope-resolver';
import { PulleyPredict } from './pulley-predict';
import type { ArtifactRef } from '@/lib/topics';

/**
 * Artifact id → component. The one place a topic page turns `lib/topics.ts`'s
 * string into a rendered thing, so the map stays free of JSX and importable from
 * a server component.
 */
export function InteractiveArtifact({ id }: { id: ArtifactRef['id'] }) {
  switch (id) {
    case 'friction-bench':
      return <FrictionBench />;
    case 'slope-resolver':
      return <SlopeResolver />;
    case 'pulley-predict':
      return <PulleyPredict />;
  }
}
