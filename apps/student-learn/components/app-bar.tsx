'use client';

import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

/**
 * The one strip that tells a student where they are and how to get back.
 *
 * It is a rule on paper, not a chrome bar: a hairline under the wordmark, a
 * breadcrumb in the margin voice the syllabus map already uses, and nothing else.
 * At 360px the breadcrumb wraps under the wordmark rather than truncating — a
 * truncated breadcrumb is the one part of navigation that has to stay readable.
 */
export function AppBar({
  crumbs = [],
  action,
}: {
  crumbs?: { label: string; href?: string }[];
  action?: { label: string; href: string };
}) {
  return (
    <header className="border-b border-grid-line bg-paper-raised/70 backdrop-blur-[2px]">
      <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-1 px-5 py-3">
        <Link href="/" aria-label="Stem 4 Life home" className="inline-flex shrink-0">
          <BrandLogo variant="wordmark" theme="light" className="!w-[104px]" />
        </Link>
        {crumbs.length > 0 ? (
          <nav
            aria-label="Breadcrumb"
            className="flex min-w-0 basis-full items-center gap-1.5 text-xs text-ink-muted sm:basis-auto"
          >
            {crumbs.map((c, i) => (
              <span key={`${c.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                {i > 0 || true ? (
                  <span aria-hidden="true" className="text-grid-line">
                    /
                  </span>
                ) : null}
                {c.href ? (
                  <Link
                    href={c.href}
                    className="truncate underline-offset-4 hover:text-accent hover:underline"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="truncate text-ink">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : null}
        {action ? (
          <Link
            href={action.href}
            className="ml-auto shrink-0 text-xs font-semibold text-ink-muted underline-offset-4 hover:text-accent hover:underline"
          >
            {action.label}
          </Link>
        ) : null}
      </div>
    </header>
  );
}
