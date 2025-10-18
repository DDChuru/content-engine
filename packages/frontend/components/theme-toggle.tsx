'use client';

import { useTheme } from './theme-provider';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme, isReady } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={!isReady}
      className="group inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200/70 bg-white/80 text-slate-800 shadow-[0_15px_30px_-22px_rgba(15,23,42,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:border-teal-400/50 hover:bg-white hover:shadow-[0_20px_40px_-25px_rgba(13,148,136,0.5)] dark:border-white/20 dark:bg-white/5 dark:text-white dark:shadow-[0_20px_45px_-25px_rgba(0,0,0,0.75)] dark:hover:border-cyan-400/60 dark:hover:bg-white/10 dark:hover:shadow-[0_25px_55px_-30px_rgba(14,165,233,0.5)] disabled:cursor-not-allowed"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 dark:hidden" />
      <Moon className="hidden h-5 w-5 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 dark:block" />
    </button>
  );
}
