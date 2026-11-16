import React, { useState } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Calendar,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  LayoutDashboard,
  Printer,
  Sparkles,
  ArrowRight,
  Target,
  FileCheck2,
  Share2,
  MessageSquare,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';
import { SavedInterview } from '../types/interview';

interface FinalReportViewProps {
  interview: SavedInterview;
  onReturnToDashboard: () => void;
  onPracticeAgain: () => void;
}

export const FinalReportView: React.FC<FinalReportViewProps> = ({
  interview,
  onReturnToDashboard,
  onPracticeAgain,
}) => {
  const report = interview.finalReport;
  const [activePlanDay, setActivePlanDay] = useState<number | null>(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'plan' | 'deepdive' | 'transcript'>('overview');

  const resolvedRole = interview.config.targetRole || interview.config.role || 'Professional';

  if (!report) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Report Incomplete
        </h2>
        <p className="text-xs text-zinc-500">
          This session did not compile a final report. You can review the answered questions or start a new simulation.
        </p>
        <button
          onClick={onReturnToDashboard}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 65) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 print:p-0">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-xs text-zinc-500 font-medium">Universal Performance Audit</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
          <button
            onClick={onPracticeAgain}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Practice Another Scenario</span>
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-indigo-950 to-zinc-900 text-white p-6 sm:p-8 border border-zinc-800 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                {interview.config.purpose || 'Universal Simulation'}
              </span>
              <span className="text-xs text-zinc-400">
                {new Date(interview.createdAt).toLocaleDateString(undefined, {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {resolvedRole} Evaluation Report
            </h1>

            <p className="text-zinc-300 text-sm leading-relaxed">
              {report.executiveSummary}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-zinc-400">
              <span>Candidate: <strong className="text-white">{interview.config.candidateName || 'Candidate'}</strong></span>
              <span>•</span>
              <span>Domain: <strong className="text-white">{interview.config.industryOrSubject}</strong></span>
              <span>•</span>
              <span>Format: <strong className="text-white">{interview.config.format}</strong></span>
              <span>•</span>
              <span>Language: <strong className="text-white">{interview.config.language}</strong></span>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-800/80 border border-zinc-700/80 min-w-[160px] text-center shrink-0">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Overall Calibrated Score
            </span>
            <div className="text-5xl font-black text-indigo-400 my-1">
              {report.overallScore}
              <span className="text-lg font-normal text-zinc-400">/100</span>
            </div>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              {report.performanceRating}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-6 text-xs font-bold overflow-x-auto">
        {[
          { id: 'overview', label: '1. Diagnostic & Competency Breakdown' },
          { id: 'plan', label: '2. 7-Day Tailored Preparation Plan' },
          { id: 'deepdive', label: '3. Weak Answer Refactoring' },
          { id: 'transcript', label: '4. Complete Q&A Transcript' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Competency Scores */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Role-Specific Competency Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {Object.entries(report.criteriaBreakdown || {}).map(([criterion, score]) => (
                <div
                  key={criterion}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                      {criterion}
                    </span>
                    <span className={`text-base font-extrabold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                    <div
                      style={{ width: `${score}%` }}
                      className={`h-full rounded-full ${
                        score >= 80 ? 'bg-emerald-500' : score >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strongest & Weakest Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strongest */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Top Strongest Answers</span>
              </div>
              <div className="space-y-3">
                {report.strongestAnswers.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                      <span>"{item.question}"</span>
                      {item.score && (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          {item.score}%
                        </span>
                      )}
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                      {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weakest */}
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Answers Needing Reinforcement</span>
              </div>
              <div className="space-y-3">
                {(report.weakestAnswers || []).length > 0 ? (
                  report.weakestAnswers.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-zinc-900 dark:text-zinc-100">
                        <span>"{item.question}"</span>
                        {item.score && (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {item.score}%
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                        {item.reason}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-500">
                    All submitted answers met benchmark standards.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Communication Feedback & Common Mistakes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Communication & Delivery Feedback</span>
              </div>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {report.communicationFeedback || 'Demonstrated consistent professional composure throughout the interview.'}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Common Mistakes & Gaps Observed
              </h4>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 list-disc pl-4">
                {(report.commonMistakes || report.knowledgeGaps || []).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations & Suggested Practice Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Personalized Recommendations
              </h4>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 list-disc pl-4">
                {report.personalizedRecommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Suggested Questions to Practice Next
              </h4>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1.5 list-disc pl-4">
                {(report.suggestedPracticeQuestions || [
                  `Walk through your decision-making framework for ${resolvedRole}.`,
                  `Describe a time you had to deliver critical results with incomplete information.`,
                ]).map((q, i) => (
                  <li key={i}>"{q}"</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Legal / AI Disclaimer */}
          <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Assessment Accuracy Notice</span>
            </div>
            <p>
              AI-generated scores and feedback are diagnostic estimates designed for interview training and skill reinforcement. They do not constitute official hiring guarantees, legal accreditation, or university admission outcomes.
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: 7-Day Plan */}
      {activeTab === 'plan' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Calendar className="w-3.5 h-3.5" />
              <span>Tailored Remediation</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              7-Day Preparation Roadmap for {resolvedRole}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              A structured daily regimen targeting your observed diagnostic gaps
            </p>
          </div>

          <div className="space-y-3">
            {report.sevenDayPrepPlan.map((dayPlan) => {
              const isExpanded = activePlanDay === dayPlan.day;

              return (
                <div
                  key={dayPlan.day}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActivePlanDay(isExpanded ? null : dayPlan.day)}
                    className="w-full p-4 bg-zinc-50/70 dark:bg-zinc-800/40 text-left flex items-center justify-between hover:bg-zinc-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        D{dayPlan.day}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                          Day {dayPlan.day}: {dayPlan.title}
                        </div>
                        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          Focus: {dayPlan.focus}
                        </div>
                      </div>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 text-xs space-y-2">
                      <p className="font-semibold text-zinc-700 dark:text-zinc-300">
                        Scheduled Activities:
                      </p>
                      <ul className="space-y-2 pl-4 list-disc text-zinc-600 dark:text-zinc-400">
                        {dayPlan.activities.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Weak Answer Deep-Dive */}
      {activeTab === 'deepdive' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Comparative Learning</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              Weak Answer Refactoring
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Side-by-side comparison of an actual weak response from your round versus an exemplary high-scoring formulation
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            Interview Question: "{report.improvedWeakAnswer.originalQuestion}"
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 text-xs space-y-2">
              <span className="font-bold text-rose-700 dark:text-rose-400 uppercase text-[10px] tracking-wider">
                Original Response
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {report.improvedWeakAnswer.candidateWeakAnswer}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase text-[10px] tracking-wider">
                Exemplary Model Refactoring
              </span>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {report.improvedWeakAnswer.revisedExemplaryAnswer}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs space-y-1">
            <span className="font-bold text-indigo-700 dark:text-indigo-400">
              Why the Exemplary Answer Scores Higher:
            </span>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {report.improvedWeakAnswer.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Full Transcript */}
      {activeTab === 'transcript' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Complete Round Transcript ({interview.questions.length} Questions)
          </h3>

          <div className="space-y-4">
            {interview.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Question {q.questionNumber}: {q.category} {q.interviewerPersona ? `(Asked by ${q.interviewerPersona})` : ''}
                  </span>
                  {q.evaluation && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      {q.evaluation.percentage}% ({q.evaluation.totalScore}/{q.evaluation.maxTotalScore})
                    </span>
                  )}
                </div>

                <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                  {q.question}
                </p>

                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  <strong className="text-zinc-400 block text-[10px] mb-1">CANDIDATE RESPONSE:</strong>
                  {q.candidateAnswer || '[No answer recorded]'}
                </div>

                {q.evaluation && (
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 space-y-1 pt-1">
                    <div>
                      <strong className="text-emerald-600 dark:text-emerald-400">Strengths:</strong>{' '}
                      {(q.evaluation.strengths || []).join('; ')}
                    </div>
                    <div>
                      <strong className="text-amber-600 dark:text-amber-400">Suggestions:</strong>{' '}
                      {(q.evaluation.improvementSuggestions || []).join('; ')}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Return Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={onReturnToDashboard}
          className="px-5 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 transition-colors"
        >
          Back to Dashboard
        </button>

        <button
          onClick={onPracticeAgain}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
        >
          <span>Configure Next Simulation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
