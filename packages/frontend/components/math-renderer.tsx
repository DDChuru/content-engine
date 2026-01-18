'use client';

import React, { useEffect, useState } from 'react';

interface MathProps {
  math: string;
  block?: boolean;
}

/**
 * Math renderer using KaTeX
 * Loads KaTeX dynamically to avoid Next.js CSS import issues
 *
 * Note: Uses dangerouslySetInnerHTML which is safe here because KaTeX's
 * renderToString only generates math HTML from LaTeX syntax - it doesn't
 * pass through arbitrary HTML content.
 */
export function MathRenderer({ math, block = false }: MathProps) {
  const [html, setHtml] = useState<string>('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import katex
    import('katex').then((katex) => {
      try {
        const rendered = katex.default.renderToString(math, {
          throwOnError: false,
          displayMode: block,
        });
        setHtml(rendered);
        setLoaded(true);
      } catch (e) {
        console.error('KaTeX render error:', e);
        setHtml(math);
        setLoaded(true);
      }
    });
  }, [math, block]);

  if (!loaded) {
    return (
      <span className={`animate-pulse bg-zinc-700 ${block ? 'block h-8 w-full' : 'inline-block h-4 w-16'} rounded`} />
    );
  }

  if (block) {
    return (
      <div
        className="katex-display my-4 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className="katex-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlockMath({ math }: { math: string }) {
  return <MathRenderer math={math} block />;
}

export function InlineMath({ math }: { math: string }) {
  return <MathRenderer math={math} />;
}
