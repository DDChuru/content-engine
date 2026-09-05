import React from 'react';
import { MathText } from '@/components/math-text';

/**
 * Renders the small markdown subset our topic notes use: headings, paragraphs,
 * bullet lists, bold, and inline maths via \( \) (handled by MathText).
 * Deliberately tiny: notes are authored in-house, so we don't need a full parser.
 */

type Block =
  | { type: 'h'; level: number; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

function parse(md: string): Block[] {
  const lines = md.replace(/\r/g, '').split('\n');
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (para.length) {
      blocks.push({ type: 'p', text: para.join(' ') });
      para = [];
    }
    if (list.length) {
      blocks.push({ type: 'ul', items: list });
      list = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flush();
      blocks.push({ type: 'h', level: h[1].length, text: h[2] });
      continue;
    }
    const li = line.match(/^\s*[-*]\s+(.*)$/);
    if (li) {
      if (para.length) flush();
      list.push(li[1]);
      continue;
    }
    if (!line.trim()) {
      flush();
      continue;
    }
    if (list.length) {
      // continuation of a wrapped bullet
      list[list.length - 1] += ' ' + line.trim();
      continue;
    }
    para.push(line.trim());
  }
  flush();
  return blocks;
}

/** Bold (**text**) inside a line, everything else through MathText. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-semibold text-ink">
            <MathText>{part.slice(2, -2)}</MathText>
          </strong>
        ) : (
          <MathText key={i}>{part}</MathText>
        ),
      )}
    </>
  );
}

export function NotesMarkdown({ markdown }: { markdown: string }) {
  const blocks = parse(markdown);
  return (
    <div className="space-y-4 text-[15px] leading-relaxed text-ink">
      {blocks.map((b, i) => {
        if (b.type === 'h') {
          if (b.level === 1) return <h1 key={i} className="font-heading text-3xl mt-2">{<Inline text={b.text} />}</h1>;
          if (b.level === 2) return <h2 key={i} className="font-heading text-xl mt-8 border-b border-grid-line pb-1">{<Inline text={b.text} />}</h2>;
          return <h3 key={i} className="font-semibold text-base mt-5">{<Inline text={b.text} />}</h3>;
        }
        if (b.type === 'ul') {
          return (
            <ul key={i} className="list-disc pl-6 space-y-1.5">
              {b.items.map((it, j) => (
                <li key={j}>
                  <Inline text={it} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            <Inline text={b.text} />
          </p>
        );
      })}
    </div>
  );
}
