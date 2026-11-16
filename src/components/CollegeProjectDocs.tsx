import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Cpu,
  Layers,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Play,
  Copy,
  Check,
  Sparkles,
  Award,
  ArrowRight,
  Database,
  ExternalLink,
  Briefcase,
  Users,
  Shield,
  HeartPulse,
} from 'lucide-react';
import { SAMPLE_DEMO_INTERVIEWS } from '../services/storage';
import { SavedInterview } from '../types/interview';

interface CollegeProjectDocsProps {
  onLoadPrebuiltDemo: (demo: SavedInterview) => void;
  onStartNewWithRole: (role: string, type: any) => void;
}

export const CollegeProjectDocs: React.FC<CollegeProjectDocsProps> = ({
  onLoadPrebuiltDemo,
}) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950 to-zinc-900 text-white border border-zinc-800 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Academic Project Report & Viva Presentation Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Universal Mock Interview Simulator Architecture & Viva Guide
        </h1>
        <p className="text-zinc-300 text-sm max-w-3xl leading-relaxed">
          Comprehensive project outline, role-specific rubric theory, academic system architecture, viva examiner presentation plan, and 6 pre-built universal test cases.
        </p>
      </div>

      {/* 1-Click Examiner Demo Scenarios (6 Universal Scenarios) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Viva Demonstrator • 6 Cross-Domain Scenarios</span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-1">
              Evaluated Test Cases Across Professions
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Load fully evaluated realistic rounds into the report viewer to test the adaptive questions and role-specific rubrics
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SAMPLE_DEMO_INTERVIEWS.map((sample) => (
            <div
              key={sample.id}
              className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    {sample.config.purpose || 'Interview'}
                  </span>
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">
                    {sample.overallScore}%
                  </span>
                </div>
                <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {sample.config.targetRole || sample.config.role}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {sample.config.industryOrSubject} • {sample.config.experience}
                </p>
              </div>

              <button
                onClick={() => onLoadPrebuiltDemo(sample)}
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Inspect Report & Rubrics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5-Minute Viva Presentation Script */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            5-Minute Viva Presentation Script & Demo Plan
          </h2>
        </div>

        <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold block">
              Step 1 (0:00 - 1:00): Universal Problem Statement & Motivation
            </strong>
            <p>
              "Good morning/afternoon, examiners. Job seekers, university applicants, and career changers worldwide suffer from generic interview advice that fails to calibrate to their distinct profession. An engineer cannot be graded on sales persuasion, nor can a civil servant be graded on coding syntax. Our project, <em>Universal AI Mock Interview Simulator</em>, provides end-to-end interview simulation across every industry, profession, and education level using Google Gemini 3.8 Flash, intelligent role-specific rubrics, and multi-persona panel simulations."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold block">
              Step 2 (1:00 - 2:30): Universal Setup & Practice Modes Demonstration
            </strong>
            <p>
              "Demonstrate navigating to <strong>New Interview</strong>. Highlight free-text input for any role (e.g. Sales Account Executive, MBA Candidate, ICU Nurse Supervisor, or SDE). Show the 6 practice modes: <em>Realistic Mode</em> (feedback hidden until the end), <em>Learning Mode</em> (instant coaching), and <em>Rapid-Fire Mode</em> (suggested countdown timer). Show how the interview language can be switched between English, Hindi, Hinglish, Spanish, etc."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold block">
              Step 3 (2:30 - 3:45): Role-Specific Evaluation & Weak Answer Refactoring
            </strong>
            <p>
              "Open an evaluated report. Demonstrate that the scoring rubric dynamically changes: technical interviews evaluate <em>Technical Correctness</em> and <em>Depth</em>, while sales evaluates <em>Objection Handling</em> and <em>Active Listening</em>, and government interviews evaluate <em>Constitutional Ethics</em>. Show the 'Weak Answer Refactoring' where the candidate's weakest answer is upgraded into an exemplary response with technical justification."
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700 space-y-1.5">
            <strong className="text-indigo-600 dark:text-indigo-400 font-bold block">
              Step 4 (3:45 - 5:00): Prompt Engineering Lab & Security
            </strong>
            <p>
              "Switch to the <strong>Prompt Engineering Lab</strong>. Show how untrusted input wrappers (`&lt;&lt;&lt;CANDIDATE_ANSWER&gt;&gt;&gt;`) and JSON schemas eliminate hallucinations and prevent prompt injection attacks, providing predictable, calibrated evaluations."
            </p>
          </div>
        </div>
      </div>

      {/* College Project Report Outline */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Formal Academic Project Report Outline
            </h2>
          </div>
          <button
            onClick={() =>
              handleCopy(
                `PROJECT REPORT OUTLINE: UNIVERSAL AI MOCK INTERVIEW SIMULATOR
1. TITLE: Universal AI Mock Interview Simulator using Google Gemini
2. ABSTRACT: An adaptive cross-industry simulation engine delivering role-specific rubric grading...
3. TECH STACK: React 19 SPA, TypeScript, Tailwind CSS, Node.js Express, Google Gemini 3.8 Flash SDK (@google/genai).
4. ARCHITECTURE: Multi-persona panel simulation, prompt injection isolation, and persistent JSON store.
5. DYNAMIC RUBRICS: Technical (Correctness, Problem Solving, Depth), HR (STAR, Self-Awareness), Sales (Objection Handling, TCO), Government (Constitutional Ethics), Admissions (Motivation, Cohort Value).`,
                'report'
              )
            }
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
          >
            {copiedSection === 'report' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Outline</span>
          </button>
        </div>

        <div className="space-y-4 text-xs text-zinc-700 dark:text-zinc-300">
          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <strong className="text-zinc-900 dark:text-zinc-100 font-bold block text-sm">
              1. Title & Abstract
            </strong>
            <p className="text-zinc-500 leading-relaxed">
              Design and implementation of an adaptive cross-industry interview simulation platform capable of supporting all occupations, admissions, and competitive selection rounds with dynamic rubric calibration and personalized seven-day remedial study roadmaps.
            </p>
          </div>

          <div className="border-l-2 border-indigo-500 pl-4 space-y-1">
            <strong className="text-zinc-900 dark:text-zinc-100 font-bold block text-sm">
              2. Architectural Design & Security
            </strong>
            <p className="text-zinc-500 leading-relaxed">
              • Frontend: React 19 SPA, TypeScript, Tailwind CSS, Web Speech API (TTS & Dictation).<br />
              • Backend: Node.js Express server on port 3000 hosting proxy endpoints with input sanitization.<br />
              • AI Engine: Google Gemini 3.8 Flash using the official `@google/genai` TypeScript SDK.<br />
              • Prompt Security: Candidate answers are isolated within strict delimiters (`&lt;&lt;&lt;CANDIDATE_ANSWER&gt;&gt;&gt;`) to neutralize prompt injection attacks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
