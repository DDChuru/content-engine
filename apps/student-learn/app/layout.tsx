import type { Metadata, Viewport } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ConvexClientProvider } from '@/components/convex-client-provider';
import 'katex/dist/katex.min.css';
import './brand-tokens.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cambridge Maths — learn topic by topic',
  description:
    'Cambridge International A Level Mathematics 9709, taught topic by topic: a short explainer, tight notes, and the working done by hand.',
  applicationName: 'Stem 4 Life',
  appleWebApp: { title: 'Stem4Life' },
  manifest: '/icons/site.webmanifest',
  icons: {
    icon: [
      { url: '/icons/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
      { url: '/icons/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icons/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
};

// Next 14 emits theme-color from viewport; metadata.themeColor is deprecated.
export const viewport: Viewport = { themeColor: '#B64A30' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/brand/fonts/fonts.css" />
      </head>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
