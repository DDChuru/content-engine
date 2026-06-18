import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Life Stories - Fact or Fiction',
  description: 'Create compelling biographical documentaries with AI-powered visuals',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
