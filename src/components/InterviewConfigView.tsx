import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Shield,
  Zap,
  BookOpen,
  TrendingUp,
  Cpu,
  Building2,
  HeartPulse,
  Scale,
  Sparkles,
  Play,
  Plus,
  X,
  Check,
  Globe,
  Sliders,
  HelpCircle,
  FileText,
  User,
  Clock,
  Flame,
  Lightbulb,
} from 'lucide-react';
import {
  DifficultyLevel,
  ExperienceLevel,
  InterviewConfig,
  InterviewFormat,
  InterviewPurpose,
  PracticeMode,
} from '../types/interview';

interface InterviewConfigViewProps {
  onStartInterview: (config: InterviewConfig) => void;
  isLoading: boolean;
}

const PURPOSES: Array<{ id: InterviewPurpose; label: string; desc: string; icon: any }> = [
  { id: 'Job interview', label: 'Job Interview', desc: 'Standard hiring interview for any corporate or industry position', icon: Briefcase },
  { id: 'Technical interview', label: 'Technical Interview', desc: 'Coding, engineering, data, algorithms, or specialized systems', icon: Cpu },
  { id: 'HR interview', label: 'HR Screening', desc: 'Cultural fit, compensation expectations, interpersonal communication', icon: Users },
  { id: 'Behavioral interview', label: 'Behavioral (STAR)', desc: 'Situational teamwork, conflict resolution, accountability, ethics', icon: Zap },
  { id: 'Managerial interview', label: 'Managerial & Leadership', desc: 'Strategy, prioritization, resource allocation, team coaching', icon: TrendingUp },
  { id: 'Government job interview', label: 'Government / Civil Services', desc: 'Public sector selection, policy reasoning, constitutional ethics', icon: Shield },
  { id: 'College or university admission', label: 'University Admission', desc: 'Undergraduate, Master’s, or MBA entrance interview', icon: GraduationCap },
  { id: 'Scholarship interview', label: 'Scholarship Selection', desc: 'Academic passion, financial merit, vision, and cohort impact', icon: Award },
  { id: 'Internship interview', label: 'Internship Selection', desc: 'Foundations, learning agility, curiosity, project enthusiasm', icon: BookOpen },
  { id: 'Promotion interview', label: 'Internal Promotion', desc: 'Demonstrating readiness for the next tier of ownership', icon: TrendingUp },
  { id: 'Career-change interview', label: 'Career Transition', desc: 'Framing transferable skills into an unfamiliar industry', icon: Sliders },
  { id: 'Custom interview', label: 'Custom Purpose', desc: 'Define any specialized goal, audition, or review scenario', icon: Sliders },
];

const SUGGESTED_ROLES = [
  { role: 'Software Developer', industry: 'Information Technology' },
  { role: 'HR & Talent Partner', industry: 'Corporate Operations' },
  { role: 'Sales Account Executive', industry: 'B2B SaaS / Enterprise' },
  { role: 'Civil Services / IAS Officer', industry: 'Public Administration' },
  { role: 'MBA Candidate', industry: 'Higher Education' },
  { role: 'Clinical Nurse Supervisor', industry: 'Healthcare' },
  { role: 'Product Manager', industry: 'Consumer Tech' },
  { role: 'Mechanical Design Engineer', industry: 'Automotive & Aerospace' },
  { role: 'Financial Analyst', industry: 'Banking & Investments' },
  { role: 'Customer Success Manager', industry: 'Hospitality & Retail' },
  { role: 'High School / University Lecturer', industry: 'Education & Research' },
  { role: 'Cybersecurity Analyst', industry: 'IT Security' },
];

const SUGGESTED_INDUSTRIES = [
  'Information Technology & Software',
  'Healthcare & Medicine',
  'Banking, Finance & Fintech',
  'Public Administration & Government',
  'Higher Education & Academia',
  'Sales, Marketing & E-Commerce',
  'Mechanical, Civil & Electrical Engineering',
  'Consulting & Business Strategy',
  'Hospitality, Retail & Customer Care',
  'Legal, Compliance & Policy',
];

const EXPERIENCE_LEVELS: Array<{ id: ExperienceLevel; label: string; desc: string }> = [
  { id: 'Student', label: 'Student', desc: 'School or college student preparing for admissions or internships' },
  { id: 'Fresher', label: 'Fresher (0–1 yr)', desc: 'Recent graduate focusing on fundamentals and academic projects' },
  { id: '0–2 years', label: 'Early Career (0–2 yrs)', desc: 'Applied industry experience and fast learning trajectory' },
  { id: '3–5 years', label: 'Mid-Level (3–5 yrs)', desc: 'Independent contributor, architectural reasoning, trade-offs' },
  { id: '6–10 years', label: 'Senior / Lead (6–10 yrs)', desc: 'Leadership, strategic execution, high-impact decisions' },
  { id: '10+ years', label: 'Executive / Principal (10+ yrs)', desc: 'Organizational vision, governance, cross-functional mastery' },
  { id: 'Custom', label: 'Custom Experience', desc: 'Specify custom years or academic profile' },
];

const FORMATS: Array<{ id: InterviewFormat; label: string; desc: string }> = [
  { id: 'Mixed interview', label: 'Mixed Comprehensive', desc: 'Balanced blend of domain knowledge and behavioral scenarios' },
  { id: 'Technical or subject knowledge', label: 'Subject / Technical Knowledge', desc: 'Deep dive into theoretical and practical concepts' },
  { id: 'HR screening', label: 'HR Screening', desc: 'Background, expectations, availability, and workplace alignment' },
  { id: 'Behavioral', label: 'STAR Behavioral', desc: 'Situational storytelling focusing on past actions and outcomes' },
  { id: 'Situational', label: 'Situational Judgment', desc: 'Hypothetical "what would you do if..." crisis scenarios' },
  { id: 'Case study', label: 'Progressive Case Study', desc: 'Multi-part scenario testing diagnostic problem solving' },
  { id: 'Panel interview simulation', label: 'Panel Interview (Multi-Persona)', desc: 'Multiple simulated interviewers (HR, Tech Lead, Director)' },
  { id: 'Stress interview simulation', label: 'Stress Simulation (Respectful)', desc: 'Challenging high-pressure questions testing poise and composure' },
  { id: 'Communication assessment', label: 'Communication & Presence', desc: 'Clarity, conciseness, articulation, and persuasive ability' },
  { id: 'Custom format', label: 'Custom Format', desc: 'User-specified interview rules and structure' },
];

const PRACTICE_MODES: Array<{ id: PracticeMode; label: string; desc: string; icon: any; badge: string }> = [
  {
    id: 'realistic',
    label: 'Realistic Interview Mode',
    desc: 'True-to-life exam: zero feedback during the round. Full rubric and report revealed at completion.',
    icon: Shield,
    badge: 'Recommended',
  },
  {
    id: 'learning',
    label: 'Learning Mode',
    desc: 'Instant coaching: Receive rubric scores, missing points, and model answers after every question.',
    icon: Lightbulb,
    badge: 'Coaching',
  },
  {
    id: 'rapid-fire',
    label: 'Rapid-Fire Mode',
    desc: 'High-speed pace: Suggested 60-second response countdown target for sharp, concise answers.',
    icon: Flame,
    badge: 'Speed Drill',
  },
  {
    id: 'beginner',
    label: 'Beginner Practice Mode',
    desc: 'Gentle on-ramp: Accessible questions with progressive difficulty climb and foundational tips.',
    icon: BookOpen,
    badge: 'Foundations',
  },
  {
    id: 'advanced',
    label: 'Advanced Challenge Mode',
    desc: 'Intense scrutiny: Multi-layer follow-up questions and complex scenario analysis.',
    icon: Zap,
    badge: 'High Stakes',
  },
  {
    id: 'custom',
    label: 'Custom Practice Mode',
    desc: 'Full control: Customize timing, question types, and evaluation strictness.',
    icon: Sliders,
    badge: 'Configurable',
  },
];

const DIFFICULTIES: Array<{ id: DifficultyLevel; label: string; color: string }> = [
  { id: 'Beginner', label: 'Beginner', color: 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300' },
  { id: 'Easy', label: 'Easy', color: 'border-sky-500/50 bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-300' },
  { id: 'Medium', label: 'Medium', color: 'border-amber-500/50 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300' },
  { id: 'Hard', label: 'Hard', color: 'border-orange-500/50 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300' },
  { id: 'Expert', label: 'Expert', color: 'border-rose-500/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300' },
];

const LANGUAGES = ['English', 'Hindi', 'Hinglish', 'Spanish', 'French', 'German', 'Custom'];

export const InterviewConfigView: React.FC<InterviewConfigViewProps> = ({
  onStartInterview,
  isLoading,
}) => {
  const [purpose, setPurpose] = useState<InterviewPurpose>('Job interview');
  const [targetRole, setTargetRole] = useState('Software Developer');
  const [industryOrSubject, setIndustryOrSubject] = useState('Information Technology');
  const [experience, setExperience] = useState<ExperienceLevel>('Fresher');
  const [customExperience, setCustomExperience] = useState('');
  const [format, setFormat] = useState<InterviewFormat>('Mixed interview');
  const [practiceMode, setPracticeMode] = useState<PracticeMode>('realistic');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [totalQuestions, setTotalQuestions] = useState<number>(5);
  const [customQuestionCount, setCustomQuestionCount] = useState<number>(7);
  const [isCustomLength, setIsCustomLength] = useState(false);
  const [language, setLanguage] = useState<string>('English');
  const [customLanguage, setCustomLanguage] = useState<string>('');
  const [candidateName, setCandidateName] = useState('');
  const [referenceInfo, setReferenceInfo] = useState('');
  const [topics, setTopics] = useState<string[]>(['Core Competencies', 'Problem Solving', 'Communication']);
  const [newTopicInput, setNewTopicInput] = useState('');

  const handleSelectRolePreset = (r: { role: string; industry: string }) => {
    setTargetRole(r.role);
    setIndustryOrSubject(r.industry);
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    if (!topics.includes(newTopicInput.trim())) {
      setTopics([...topics, newTopicInput.trim()]);
    }
    setNewTopicInput('');
  };

  const handleRemoveTopic = (t: string) => {
    setTopics(topics.filter((item) => item !== t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetRole.trim()) {
      alert('Please enter a target role, position, or course title.');
      return;
    }

    const resolvedExperience = experience === 'Custom' && customExperience.trim() ? customExperience.trim() : experience;
    const resolvedLanguage = language === 'Custom' && customLanguage.trim() ? customLanguage.trim() : language;
    const resolvedCount = isCustomLength ? Math.max(1, Math.min(30, customQuestionCount)) : totalQuestions;

    onStartInterview({
      purpose,
      targetRole: targetRole.trim(),
      industryOrSubject: industryOrSubject.trim() || 'General Industry',
      experience: resolvedExperience,
      format,
      practiceMode,
      difficulty,
      totalQuestions: resolvedCount,
      language: resolvedLanguage,
      topics,
      referenceInfo: referenceInfo.trim() || undefined,
      candidateName: candidateName.trim() || undefined,
      // Backward compatibility mapping
      role: targetRole.trim() as any,
      interviewType: format as any,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Universal Setup • Any Profession, Industry, or Goal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
          Configure Your Mock Interview Simulation
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Simulate realistic hiring, admission, promotional, or government interviews across any industry. Questions, rubrics, and interviewer personas adapt automatically.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Interview Purpose */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                1. Select Interview Purpose
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Establishes the core selection mandate and criteria
              </p>
            </div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              Required
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {PURPOSES.map((item) => {
              const Icon = item.icon;
              const isSelected = purpose === item.id;

              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPurpose(item.id)}
                  className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between group cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/40 dark:bg-zinc-800/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-800'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {item.label}
                    </h3>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Target Role & Industry (Free text with suggestions) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              2. Target Role & Industry (Free-Text Input)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter any job title, profession, specialized post, university course, or select a quick preset
            </p>
          </div>

          {/* Quick preset chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Quick Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SUGGESTED_ROLES.map((r, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => handleSelectRolePreset(r)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                    targetRole === r.role
                      ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {r.role}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Target Role, Profession, Course, or Position *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mechanical Engineer, Nurse Supervisor, Civil Services Officer, Sales Rep, MBA Applicant"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Industry, Domain, or Subject *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Healthcare, B2B SaaS, Automotive, Public Administration, Higher Education"
                value={industryOrSubject}
                onChange={(e) => setIndustryOrSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Practice Mode Selection */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              3. Select Practice Mode
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Choose how feedback and questioning pace are delivered
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRACTICE_MODES.map((mode) => {
              const Icon = mode.icon;
              const isSelected = practiceMode === mode.id;

              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setPracticeMode(mode.id)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/30 dark:bg-zinc-800/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {mode.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {mode.label}
                    </h3>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                      {mode.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Experience Level & Format */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Experience Level */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                4. Candidate Experience or Education
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Calibrates question depth and expected seniority
              </p>
            </div>

            <div className="space-y-1.5">
              {EXPERIENCE_LEVELS.map((exp) => (
                <button
                  type="button"
                  key={exp.id}
                  onClick={() => setExperience(exp.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    experience === exp.id
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                      {exp.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      {exp.desc}
                    </span>
                  </div>
                  {experience === exp.id && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}

              {experience === 'Custom' && (
                <input
                  type="text"
                  placeholder="Specify custom seniority (e.g. 15 yrs VP, Medical Resident, Ph.D. Candidate)"
                  value={customExperience}
                  onChange={(e) => setCustomExperience(e.target.value)}
                  className="w-full mt-2 px-3 py-2 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
            </div>
          </div>

          {/* Format */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                5. Interview Format & Style
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Sets the interaction type, persona, and questioning structure
              </p>
            </div>

            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {FORMATS.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    format === f.id
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 font-semibold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                      {f.label}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      {f.desc}
                    </span>
                  </div>
                  {format === f.id && (
                    <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Difficulty, Length, & Language */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Difficulty */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              6. Difficulty
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTIES.map((diff) => (
                <button
                  type="button"
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    difficulty === diff.id
                      ? `${diff.color} font-bold ring-2 ring-indigo-500/20`
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{diff.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Number of Questions */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              7. Question Count
            </h2>
            <div className="grid grid-cols-4 gap-2">
              {([5, 10, 15, 20] as const).map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => {
                    setIsCustomLength(false);
                    setTotalQuestions(count);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    !isCustomLength && totalQuestions === count
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-xs font-bold block">{count} Qs</span>
                </button>
              ))}
            </div>
            <div className="pt-1">
              <label className="text-[11px] text-zinc-500 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isCustomLength}
                  onChange={(e) => setIsCustomLength(e.target.checked)}
                  className="rounded border-zinc-300"
                />
                <span>Set custom number of questions:</span>
              </label>
              {isCustomLength && (
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={customQuestionCount}
                  onChange={(e) => setCustomQuestionCount(Number(e.target.value))}
                  className="mt-1 w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100"
                />
              )}
            </div>
          </div>

          {/* Interview Language */}
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
            <div className="flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-indigo-500" />
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                8. Language
              </h2>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            {language === 'Custom' && (
              <input
                type="text"
                placeholder="e.g. Japanese, Arabic, Bengali, Marathi"
                value={customLanguage}
                onChange={(e) => setCustomLanguage(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs"
              />
            )}
            <p className="text-[10px] text-zinc-400">
              Questions, feedback, and speech synthesis will respect your selected language.
            </p>
          </div>
        </div>

        {/* 6. Focus Topics & Reference Material */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              9. Specific Competencies & Reference Material (Optional)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Provide a job description, exam notification, admission syllabus, or custom focus topics
            </p>
          </div>

          {/* Topics Chips */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Core Topics & Competencies:
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {topics.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(t)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Add skill/topic"
                  value={newTopicInput}
                  onChange={(e) => setNewTopicInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTopic();
                    }
                  }}
                  className="px-3 py-1 rounded-full text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 w-36"
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="p-1 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Reference Info & Candidate Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Candidate Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Paste Job Description / Exam Notice / Syllabus (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Paste key requirements, course syllabus, or official post guidelines..."
                value={referenceInfo}
                onChange={(e) => setReferenceInfo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Interview questions and scoring rubrics are calibrated to <strong>{targetRole}</strong> in <strong>{language}</strong>.
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Launching Universal Interview Room...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Start Simulation ({practiceMode.toUpperCase()} MODE)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
