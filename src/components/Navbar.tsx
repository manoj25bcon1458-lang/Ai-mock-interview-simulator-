import React from 'react';
import {
  Sun,
  Moon,
  Sparkles,
  Bot,
  GraduationCap,
  PlusCircle,
  ShieldCheck,
  Menu,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onStartNew: () => void;
  activeInterviewCount: number;
  onOpenDocs: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartNew,
  activeInterviewCount,
  onOpenDocs,
  onToggleSidebar,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.location.hash = '#dashboard'}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-50">
                AI Mock Interview
              </span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                Simulator
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
              Powered by Google Gemini
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Gemini 3.8 Flash • Ready</span>
        </div>

        <button
          onClick={onOpenDocs}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 transition-colors"
          title="College Project Report & Viva Demo Guide"
        >
          <GraduationCap className="w-4 h-4 text-indigo-500" />
          <span>College Viva Guide</span>
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
          aria-label="Toggle theme"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-600" />
          )}
        </button>

        <button
          onClick={onStartNew}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 shadow-sm shadow-indigo-600/30 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden xs:inline">New Interview</span>
        </button>
      </div>
    </header>
  );
};
