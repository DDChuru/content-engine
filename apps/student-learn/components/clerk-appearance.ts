import type { Appearance } from '@clerk/types';

/**
 * Clerk's prebuilt forms, dressed as Stem 4 Life. The card chrome is removed
 * entirely (`card: shadow-none, border-none, bg-transparent, w-full`) because
 * AuthShell already draws the card — two nested cards is the tell that an auth
 * vendor was dropped in without looking.
 */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: '#B64A30',
    colorText: 'var(--ink)',
    colorTextSecondary: 'var(--ink-muted)',
    colorBackground: 'transparent',
    colorInputBackground: 'var(--paper)',
    colorInputText: 'var(--ink)',
    borderRadius: '0.5rem',
    fontFamily: 'var(--s4l-font-body)',
    fontFamilyButtons: 'var(--s4l-font-body)',
  },
  elements: {
    rootBox: 'w-full',
    cardBox: 'w-full shadow-none border-none',
    card: 'w-full bg-transparent shadow-none border-none p-0 gap-5',
    header: 'hidden',
    footer: 'bg-transparent shadow-none',
    footerAction: 'justify-start',
    socialButtonsBlockButton:
      'border border-grid-line bg-paper text-ink hover:border-accent',
    dividerLine: 'bg-grid-line',
    formFieldLabel: 'text-ink font-semibold',
    formFieldInput: 'border-grid-line bg-paper text-ink',
    formButtonPrimary:
      'bg-accent hover:bg-accent-pressed text-white normal-case text-sm font-semibold shadow-none',
    footerActionLink: 'text-accent hover:text-accent-pressed font-semibold',
    identityPreviewEditButton: 'text-accent',
  },
};
