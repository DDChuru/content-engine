import Link from 'next/link';
import type { ReactNode } from 'react';
import { BrandLogo } from '@/components/brand-logo';

/**
 * The frame every identity screen sits in: sign-in, sign-up, onboarding, the
 * guardian link, the account page. One shell so these screens read as the same
 * product as the study pages — graph paper, terracotta, Manrope — rather than as
 * a bolted-on auth vendor.
 */
export function AuthShell({
  eyebrow,
  title,
  lede,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center px-5 py-12">
      <Link href="/" className="mb-8 inline-flex w-fit" aria-label="Stem 4 Life home">
        <BrandLogo variant="horizontal" theme="light" />
      </Link>

      <div className="rounded-2xl border border-grid-line bg-paper-raised p-6 shadow-[0_1px_0_0_var(--grid-line)] sm:p-8">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-heading text-2xl font-semibold leading-tight text-ink sm:text-3xl">
          {title}
        </h1>
        {lede ? <div className="mt-3 text-[0.95rem] leading-relaxed text-ink-muted">{lede}</div> : null}
        <div className="mt-6">{children}</div>
      </div>

      {footer ? <div className="mt-6 text-sm text-ink-muted">{footer}</div> : null}
    </main>
  );
}

/** A short paragraph explaining why a field is asked for. Never decorative. */
export function WhyNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1.5 text-[0.8rem] leading-relaxed text-ink-muted">{children}</p>
  );
}

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-ink"
    >
      {children}
    </label>
  );
}

export const inputClass =
  'mt-2 w-full rounded-lg border border-grid-line bg-paper px-3 py-2.5 text-ink ' +
  'placeholder:text-ink-muted/70 focus:border-accent focus:outline-none ' +
  'focus-visible:outline-2 focus-visible:outline-accent';

export const buttonClass =
  'inline-flex items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-sm ' +
  'font-semibold text-white transition-colors duration-150 ease-out-quart ' +
  'hover:bg-accent-pressed active:bg-accent-pressed disabled:cursor-not-allowed ' +
  'disabled:opacity-50';

export const secondaryButtonClass =
  'inline-flex items-center justify-center rounded-lg border border-grid-line bg-paper ' +
  'px-4 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 ' +
  'ease-out-quart hover:border-accent hover:text-accent disabled:opacity-50';
