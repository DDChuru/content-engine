import type { Metadata } from 'next';
import './globals.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = {
  title: 'Learn IGCSE Mathematics',
  description: 'Interactive Cambridge IGCSE Mathematics lessons with videos, exercises, and quizzes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="font-bold text-white">IGCSE Mathematics</h1>
                  <p className="text-xs text-slate-400">Cambridge 0580</p>
                </div>
              </div>

              <nav className="flex items-center gap-6">
                <a href="/" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Home
                </a>
                <a href="/syllabus" className="text-sm text-slate-300 hover:text-white transition-colors">
                  Syllabus
                </a>
                <a href="/progress" className="text-sm text-slate-300 hover:text-white transition-colors">
                  My Progress
                </a>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-slate-700/50 py-6">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
              <p>Cambridge IGCSE Mathematics (0580) Learning Platform</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
