'use client';

import { useEffect } from 'react';

/**
 * The last boundary. `app/error.tsx` lives *inside* the root layout, so it cannot
 * catch the layout itself — ClerkProvider failing to initialise, a bad
 * `NEXT_PUBLIC_CONVEX_URL`, a font import blowing up. Those land here.
 *
 * It replaces the whole document, which is why it ships its own `<html>`/`<body>`
 * and why every style is inline: `globals.css` is imported by the layout that just
 * failed, and Tailwind classes would render as unstyled text.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#FBF7F0',
          color: '#1F1B18',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
          padding: '24px',
        }}
      >
        <main style={{ maxWidth: '28rem' }}>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#6B625B',
            }}
          >
            Stem 4 Life
          </p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.75rem', lineHeight: 1.2 }}>
            The app failed to start
          </h1>
          <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#6B625B' }}>
            This is our side, not yours. Reloading usually fixes it. Nothing you have
            saved has been lost.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '1.5rem',
              border: 0,
              borderRadius: '0.75rem',
              background: '#B64A30',
              color: '#FBF7F0',
              padding: '0.7rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
          {error.digest ? (
            <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: '#6B625B' }}>
              Reference {error.digest}
            </p>
          ) : null}
        </main>
      </body>
    </html>
  );
}
