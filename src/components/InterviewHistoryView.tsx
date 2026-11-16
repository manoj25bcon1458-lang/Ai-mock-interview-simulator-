import React, { useState } from 'react';
import {
  History,
  Trash2,
  Eye,
  Download,
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Globe,
  Briefcase,
} from 'lucide-react';
import { SavedInterview } from '../types/interview';
import { removeInterview } from '../services/storage';

interface InterviewHistoryViewProps {
  interviews: SavedInterview[];
  onViewInterview: (interview: SavedInterview) => void;
  onRefreshList: () => void;
  onStartNew: () => void;
}

export const InterviewHistoryView: React.FC<InterviewHistoryViewProps> = ({
  interviews,
  onViewInterview,
  onRefreshList,
  onStartNew,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPurposeFilter, setSelectedPurposeFilter] = useState<string>('All');

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this interview record?')) {
      await removeInterview(id);
      onRefreshList();
    }
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(interviews, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `universal_mock_interviews_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredInterviews = interviews.filter((item) => {
    const roleTitle = (item.config.targetRole || item.config.role || '').toLowerCase();
    const candidate = (item.config.candidateName || '').toLowerCase();
    const industry = (item.config.industryOrSubject || '').toLowerCase();
    const purpose = (item.config.purpose || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      roleTitle.includes(term) ||
      candidate.includes(term) ||
      industry.includes(term) ||
      purpose.includes(term) ||
      item.config.topics.some((t) => t.toLowerCase().includes(term));

    const matchesPurpose =
      selectedPurposeFilter === 'All' || item.config.purpose === selectedPurposeFilter;

    return matchesSearch && matchesPurpose;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <History className="w-3.5 h-3.5" />
            <span>Universal Records Archive</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Interview Transcripts & History
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Stored locally and on the server. Survives page reloads and browser restarts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {interviews.length > 0 && (
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 transition-colors"
              title="Download all interview records as a JSON backup"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
          )}

          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>New Simulation</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by role, candidate, industry, or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPurposeFilter}
            onChange={(e) => setSelectedPurposeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:outline-none"
          >
            <option value="All">All Purposes</option>
            <option value="Job interview">Job Interview</option>
            <option value="Technical interview">Technical Interview</option>
            <option value="HR interview">HR Interview</option>
            <option value="Behavioral interview">Behavioral Interview</option>
            <option value="Managerial interview">Managerial Interview</option>
            <option value="Government job interview">Government Job Interview</option>
            <option value="College or university admission">University Admission</option>
            <option value="Scholarship interview">Scholarship Interview</option>
            <option value="Internship interview">Internship Interview</option>
            <option value="Promotion interview">Promotion Interview</option>
            <option value="Career-change interview">Career-Change Interview</option>
            <option value="Custom interview">Custom Interview</option>
          </select>
        </div>
      </div>

      {/* List of Interviews */}
      {filteredInterviews.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
          <History className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mx-auto" />
          <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">
            No matching interview records found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search criteria or launch a new simulation.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInterviews.map((interview) => {
            const dateStr = new Date(interview.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const answeredCount = interview.questions.filter((q) => q.candidateAnswer).length;
            const roleTitle = interview.config.targetRole || interview.config.role || 'Professional';

            return (
              <div
                key={interview.id}
                onClick={() => onViewInterview(interview)}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Score Pill */}
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs text-zinc-400 font-medium">Score</span>
                    <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400">
                      {interview.overallScore ? `${interview.overallScore}%` : '—'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 transition-colors">
                        {roleTitle}
                      </h3>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200">
                        {interview.config.purpose || 'Interview'}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {interview.config.difficulty}
                      </span>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                        {interview.config.experience}
                      </span>
                      {interview.config.language && interview.config.language !== 'English' && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          {interview.config.language}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <span>Candidate: {interview.config.candidateName || 'Candidate'}</span>
                      <span>•</span>
                      <span>Industry: {interview.config.industryOrSubject}</span>
                      <span>•</span>
                      <span>Recorded on {dateStr}</span>
                      <span>•</span>
                      <span>{answeredCount} Questions Answered</span>
                    </div>

                    {interview.config.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {interview.config.topics.slice(0, 4).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewInterview(interview);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Open Report</span>
                  </button>

                  <button
                    onClick={(e) => handleDelete(interview.id, e)}
                    className="p-2 rounded-xl text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
