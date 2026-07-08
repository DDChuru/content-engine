import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import 'katex/dist/katex.min.css';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: '600',
  variable: '--font-fraunces',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cambridge Maths — learn topic by topic',
  description:
    'Cambridge IGCSE Mathematics 0580, taught topic by topic with worked examples and a quiz for each.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
