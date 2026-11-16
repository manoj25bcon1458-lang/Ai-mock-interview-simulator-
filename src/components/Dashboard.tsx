import React from 'react';
import {
  Trophy,
  Target,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  BookOpen,
  Calendar,
  Layers,
  ChevronRight,
  Database,
  Radio,
  Globe,
  Briefcase,
  GraduationCap,
  Shield,
} from 'lucide-react';
import { SavedInterview } from '../types/interview';

interface DashboardProps {
  interviews: SavedInterview[];
  activeInterview?: SavedInterview | null;
  onStartNew: () => void;
  onContinueInterview?: () => void;
  onViewInterview: (interview: SavedInterview) => void;
  onLoadDemoData: () => void;
  onNavigateToLab: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  interviews,
  activeInterview,
  onStartNew,
  onContinueInterview,
  onViewInterview,
  onLoadDemoData,
  onNavigateToLab,
}) => {
  const completedInterviews = interviews.filter((i) => i.status === 'completed');
  const totalCompleted = completedInterviews.length;

  const averageScore =
    totalCompleted > 0
      ? Math.round(
          completedInterviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) /
            totalCompleted
        )
      : 0;

  const bestScore =
    totalCompleted > 0
      ? Math.max(...completedInterviews.map((i) => i.overallScore || 0))
      : 0;

  const totalQuestionsAnswered = completedInterviews.reduce(
    (acc, curr) => acc + (curr.questions?.filter((q) => q.candidateAnswer)?.length || 0),
    0
  );

  // Extract real aggregated skills from completed interviews
  const strengthsMap = new Map<string, number>();
  const weaknessesMap = new Map<string, number>();

  completedInterviews.forEach((interview) => {
    interview.questions.forEach((q) => {
      if (q.evaluation) {
        (q.evaluation.strengths || []).forEach((s) => {
          const trimmed = s.slice(0, 45);
          strengthsMap.set(trimmed, (strengthsMap.get(trimmed) || 0) + 1);
        });
        (q.evaluation.weaknessesOrMissing || []).forEach((w) => {
          const trimmed = w.slice(0, 45);
          weaknessesMap.set(trimmed, (weaknessesMap.get(trimmed) || 0) + 1);
        });
      }
    });
  });

  const topStrengths = Array.from(strengthsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skill]) => skill);

  const topWeaknesses = Array.from(weaknessesMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([skill]) => skill);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Active Unfinished Session Banner (If exists) */}
      {activeInterview && activeInterview.status === 'in-progress' && onContinueInterview && (
        <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-md shadow-indigo-600/30">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-wider text-indigo-700 dark:text-indigo-300">
                  Active Session In Progress
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live
                </span>
              </div>
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
                {activeInterview.config.targetRole || activeInterview.config.role} ({activeInterview.config.purpose})
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Question {activeInterview.questions.length} of {activeInterview.config.totalQuestions} • {activeInterview.config.practiceMode.toUpperCase()} mode
              </p>
            </div>
          </div>

          <button
            onClick={onContinueInterview}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Continue Active Interview</span>
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 -mb-12 w-64 h-64 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Mock Interview Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Practice Interviews for Any Profession
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Technical, HR, Managerial, Sales, University Admissions, Government Civil Services, or custom career transitions with adaptive questions and role-specific rubrics.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={onStartNew}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start New Interview</span>
            </button>
            <button
              onClick={onNavigateToLab}
              className="w-full sm:w-auto px-4 py-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 font-medium text-sm border border-zinc-700 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Prompt Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-medium">
            <span>Completed Interviews</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {totalCompleted}
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {totalCompleted === 0 ? 'No completed rounds yet' : 'Stored in persistent storage'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-medium">
            <span>Average Score</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
              {totalCompleted > 0 ? `${averageScore}%` : '—'}
            </span>
            {totalCompleted > 0 && (
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  averageScore >= 80
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : averageScore >= 65
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                }`}
              >
                {averageScore >= 80 ? 'Proficient' : averageScore >= 65 ? 'Developing' : 'Review Needed'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Across role-specific rubrics
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-medium">
            <span>Highest Score</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {totalCompleted > 0 ? `${bestScore}%` : '—'}
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Top session performance
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs font-medium">
            <span>Questions Practiced</span>
            <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {totalQuestionsAnswered}
          </div>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            Evaluated by Gemini AI models
          </p>
        </div>
      </div>

      {/* Main Content Grid: Performance Chart + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trajectory */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Performance Trajectory
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Score progression across your verified sessions
              </p>
            </div>
            {totalCompleted > 0 && (
              <span className="text-xs px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium">
                {totalCompleted} Data Points
              </span>
            )}
          </div>

          {totalCompleted === 0 ? (
            <div className="py-12 px-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 text-center space-y-3 my-auto">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto">
                <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                  No interview records yet
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Complete your first interview simulation to render your custom performance chart and skill breakdown.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={onStartNew}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
                >
                  Start Simulation
                </button>
                <button
                  onClick={onLoadDemoData}
                  className="px-3.5 py-2 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center gap-1.5"
                  title="Load 6 universal demo records across professions"
                >
                  <Database className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Preload 6 Universal Demo Records</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 my-auto">
              <div className="h-48 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                {completedInterviews.slice(-6).map((item, idx) => {
                  const score = item.overallScore || 0;
                  const heightPercent = Math.max(12, score);
                  const isLatest = idx === completedInterviews.slice(-6).length - 1;
                  const label = (item.config.targetRole || item.config.role || 'Role').split(' ')[0];

                  return (
                    <div
                      key={item.id}
                      onClick={() => onViewInterview(item)}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
                    >
                      <div className="text-[11px] font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-indigo-500 transition-colors">
                        {score}%
                      </div>
                      <div className="w-full max-w-[48px] bg-zinc-100 dark:bg-zinc-800 rounded-t-xl h-36 flex items-end p-1 relative overflow-hidden">
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className={`w-full rounded-t-lg transition-all duration-500 ${
                            isLatest
                              ? 'bg-gradient-to-t from-indigo-600 to-sky-400 shadow-md shadow-indigo-500/20'
                              : 'bg-indigo-400 dark:bg-indigo-600/80 group-hover:bg-indigo-500'
                          }`}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate max-w-[60px]">
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 pt-1">
                <span>Earliest Session</span>
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  Click any bar to inspect report
                </span>
                <span>Latest Session</span>
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Rubric Skill Diagnosis
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Aggregated from Gemini model evaluations
            </p>
          </div>

          {totalCompleted === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-400 dark:text-zinc-500 space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>Skills analysis unlocks after your first evaluated answer.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Strongest */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Demonstrated Strengths</span>
                </div>
                <div className="space-y-1.5">
                  {topStrengths.length > 0 ? (
                    topStrengths.map((str, i) => (
                      <div
                        key={i}
                        className="text-xs p-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 text-zinc-800 dark:text-zinc-200 border border-emerald-100 dark:border-emerald-900/40"
                      >
                        {str}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">Building profile...</p>
                  )}
                </div>
              </div>

              {/* To Improve */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4" />
                  <span>Priority Focus Areas</span>
                </div>
                <div className="space-y-1.5">
                  {topWeaknesses.length > 0 ? (
                    topWeaknesses.map((w, i) => (
                      <div
                        key={i}
                        className="text-xs p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 text-zinc-800 dark:text-zinc-200 border border-amber-100 dark:border-amber-900/40"
                      >
                        {w}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-zinc-400">No major gaps identified.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={onNavigateToLab}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center justify-between w-full hover:underline"
            >
              <span>Explore Prompt Engineering Lab</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Recent Universal Interview History
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Review transcripts, questions, and comprehensive AI reports across professions
            </p>
          </div>
          <button
            onClick={onStartNew}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1"
          >
            <span>Start Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {interviews.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400 flex items-center justify-center mx-auto">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
              No interview sessions recorded yet
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
              Simulate an interview for any profession, college admission, or government role to build your history.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={onStartNew}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
              >
                Launch Interview
              </button>
              <button
                onClick={onLoadDemoData}
                className="px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium hover:bg-zinc-200 transition-colors"
              >
                Preload 6 Universal Scenarios
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 overflow-x-auto">
            {interviews.slice(0, 6).map((interview) => {
              const dateStr = new Date(interview.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              const roleTitle = interview.config.targetRole || interview.config.role || 'Professional';

              return (
                <div
                  key={interview.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {interview.overallScore ? `${interview.overallScore}%` : '—'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                          {roleTitle}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {interview.config.purpose || 'Interview'}
                        </span>
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {interview.config.difficulty}
                        </span>
                        {interview.config.language && interview.config.language !== 'English' && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            {interview.config.language}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 dark:text-zinc-500 mt-1">
                        <span>{dateStr}</span>
                        <span>•</span>
                        <span>{interview.config.industryOrSubject}</span>
                        <span>•</span>
                        <span>{interview.config.experience}</span>
                        <span>•</span>
                        <span>
                          {interview.questions.filter((q) => q.candidateAnswer).length} of{' '}
                          {interview.config.totalQuestions} Questions Answered
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => onViewInterview(interview)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>View Report</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
