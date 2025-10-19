import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Content Engine Cloud',
  description: 'AI-powered content generation with Claude and Firebase',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-slate-800 transition-colors dark:bg-slate-950 dark:text-slate-100`}>
        <ThemeProvider>
          <div className="stage-layered relative min-h-screen bg-gradient-to-br from-slate-100/70 via-white/80 to-slate-200/70 text-slate-900 transition-colors dark:from-slate-950/90 dark:via-slate-900/80 dark:to-slate-950/90 dark:text-slate-100">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(13,148,136,0.08),transparent_55%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.08),transparent_60%)]" />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
