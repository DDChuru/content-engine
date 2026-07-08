import React from 'react';
import katex from 'katex';

/**
 * Matches one inline math segment: \( ... \) or $ ... $.
 * Dollar segments must be single-line and non-empty to avoid
 * swallowing prose that merely mentions a dollar sign.
 */
const INLINE_MATH = /\\\(([\s\S]+?)\\\)|\$([^$\n]+?)\$/g;

function Tex({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    errorColor: 'var(--ink-muted)',
  });
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

interface MathTextProps {
  children: string;
  className?: string;
}

/** Display-mode KaTeX for standalone formulas (latex-formula blocks etc.). */
export function MathBlock({ tex, className }: { tex: string; className?: string }) {
  const html = katex.renderToString(tex, {
    throwOnError: false,
    displayMode: true,
    errorColor: 'var(--ink-muted)',
  });
  return (
    <div
      className={`overflow-x-auto ${className ?? ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Renders a string that may contain inline KaTeX delimited by \( \) or $ $.
 * Plain segments pass through untouched. EVERY math-bearing string in the app
 * (stems, options, feedback, steps) goes through this component.
 */
export function MathText({ children, className }: MathTextProps) {
  const text = children ?? '';
  const nodes: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  INLINE_MATH.lastIndex = 0;
  while ((match = INLINE_MATH.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(text.slice(last, match.index));
    }
    nodes.push(<Tex key={key++} tex={match[1] ?? match[2] ?? ''} />);
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return <span className={className}>{nodes}</span>;
}
