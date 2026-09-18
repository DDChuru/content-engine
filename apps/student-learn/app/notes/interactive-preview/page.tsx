'use client';

import Link from 'next/link';
import { FrictionBench } from '@/components/interactive/friction-bench';
import { SlopeResolver } from '@/components/interactive/slope-resolver';
import { PulleyPredict } from '@/components/interactive/pulley-predict';

/**
 * Three exemplars, not a pipeline. Each one is built from a documented item in
 * content/misconceptions/mechanics.json, and each one makes the student commit
 * to a wrong answer before it will move.
 */
export default function InteractivePreviewPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-6 md:py-10">
      <Link href="/notes" className="text-sm text-ink-muted hover:text-accent">
        ← Notes
      </Link>
      <h1 className="mt-1 font-heading text-3xl md:text-4xl">Notes you can be wrong in</h1>
      <p className="mt-2 text-sm text-ink-muted">
        Three prototypes for the mechanics notes. Every one starts with a guess you have to commit
        to, and then shows the guess failing — that is the whole design. Built from the misconception
        catalogue: the codes above each panel are the entries they attack.
      </p>

      <div className="mt-6 space-y-6">
        <FrictionBench />
        <SlopeResolver />
        <PulleyPredict />
      </div>

      <p className="mt-8 text-xs text-ink-muted">
        g = 10 throughout, per the 9709 convention. Everything on this page is SVG and CSS — no
        images, no chart library.
      </p>
    </main>
  );
}
