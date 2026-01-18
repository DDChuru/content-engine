'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, LayoutDashboard, BookOpen, Play, Wand2 } from 'lucide-react';

export default function EducationLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/education') {
      return pathname === '/education';
    }
    return pathname?.startsWith(path);
  };

  const navItems = [
    { path: '/education', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/education/learn', icon: GraduationCap, label: 'Learn' },
    { path: '/education/lessons', icon: BookOpen, label: 'Lesson Builder' },
    { path: '/education/studio', icon: Wand2, label: 'Studio Editor' },
    { path: '/education/render', icon: Play, label: 'Render Manager' },
  ];

  return (
    <>
      {/* KaTeX CSS for math rendering */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        crossOrigin="anonymous"
      />
      <div className="flex min-h-screen bg-zinc-950 text-white">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-800 bg-zinc-900/50 flex flex-col">
          {/* Logo */}
          <div className="p-5 border-b border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Education Studio</h1>
              <p className="text-xs text-zinc-500">Cambridge IGCSE</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-indigo-500/20 text-white border border-indigo-500/30'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Status */}
          <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </div>
            <div>Manim • Remotion • ElevenLabs</div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </>
  );
}
