import React from 'react';
import {
  LayoutDashboard,
  PlayCircle,
  Radio,
  History,
  FlaskConical,
  GraduationCap,
  Sparkles,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export type NavView = 'dashboard' | 'setup' | 'room' | 'history' | 'prompt-lab' | 'docs';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  hasActiveRoom: boolean;
  activeQuestionNumber?: number;
  totalQuestions?: number;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  hasActiveRoom,
  activeQuestionNumber = 1,
  totalQuestions = 5,
  isOpen,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Statistics & Overview',
    },
    {
      id: 'setup' as NavView,
      label: 'New Interview',
      icon: PlayCircle,
      badge: null,
      desc: 'Role & Domain Setup',
    },
    {
      id: 'room' as NavView,
      label: 'Live Interview Room',
      icon: Radio,
      badge: hasActiveRoom ? `Q${activeQuestionNumber}/${totalQuestions}` : null,
      badgeColor: 'bg-emerald-500 text-white',
      disabled: !hasActiveRoom,
      desc: hasActiveRoom ? 'Session in progress' : 'No active session',
    },
    {
      id: 'history' as NavView,
      label: 'Interview Records',
      icon: History,
      badge: null,
      desc: 'Past Reports & Rubrics',
    },
    {
      id: 'prompt-lab' as NavView,
      label: 'Prompt Engineering Lab',
      icon: FlaskConical,
      badge: 'Academic',
      badgeColor: 'bg-amber-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/30',
      desc: 'Compare Prompts Live',
    },
    {
      id: 'docs' as NavView,
      label: 'College Viva & Report',
      icon: GraduationCap,
      badge: 'Docs',
      badgeColor: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30',
      desc: 'Architecture & Demo Plan',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-xs"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-20 h-screen md:h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 transition-transform duration-200 flex flex-col justify-between p-3 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          <div className="px-2 pt-2 md:pt-1">
            <p className="text-[11px] font-semibold tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
              Platform Navigation
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isDisabled = item.disabled;

              return (
                <button
                  key={item.id}
                  disabled={isDisabled}
                  onClick={() => {
                    if (!isDisabled) {
                      onNavigate(item.id);
                      onCloseMobile();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left group ${
                    isDisabled
                      ? 'opacity-40 cursor-not-allowed text-zinc-400 dark:text-zinc-600'
                      : isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold shadow-xs border border-indigo-200/60 dark:border-indigo-800/50'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800 dark:group-hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate">{item.label}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase shrink-0 ${
                        item.badgeColor || 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom card: Student / Candidate helper */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 dark:from-zinc-800/80 dark:via-zinc-800/40 dark:to-indigo-950/40 border border-indigo-100 dark:border-zinc-700/60 text-xs">
          <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-400 font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Campus Ready</span>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed mb-2.5">
            Evaluations follow standard industry scoring rubrics: Technical Accuracy, Clarity, Depth, and STAR methodology.
          </p>
          <button
            onClick={() => {
              onNavigate('docs');
              onCloseMobile();
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-zinc-700 font-medium text-[11px] hover:bg-indigo-50 dark:hover:bg-zinc-700 transition-colors flex items-center justify-between"
          >
            <span>View Architecture</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
