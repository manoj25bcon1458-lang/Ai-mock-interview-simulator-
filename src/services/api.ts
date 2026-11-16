import {
  AnswerEvaluation,
  FinalReport,
  InterviewConfig,
  InterviewQuestionItem,
  PromptComparisonRequest,
  PromptComparisonResult,
  SavedInterview,
} from '../types/interview';

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err: any) {
    return { status: 'error', hasApiKey: false, model: 'unknown' };
  }
}

export async function requestNextQuestion(params: {
  config: InterviewConfig;
  questionNumber: number;
  previousQuestions: InterviewQuestionItem[];
  isFollowUp?: boolean;
  lastAnswerFeedback?: { lastAnswer: string; probeFocus: string };
}): Promise<InterviewQuestionItem> {
  const cfg = params.config;
  const res = await fetch('/api/interview/generate-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      purpose: cfg.purpose || 'Job interview',
      targetRole: cfg.targetRole || cfg.customRoleTitle || cfg.role || 'Professional Role',
      industryOrSubject: cfg.industryOrSubject || 'General',
      experience: cfg.experience || 'Fresher',
      format: cfg.format || cfg.interviewType || 'Mixed interview',
      difficulty: cfg.difficulty || 'Medium',
      questionNumber: params.questionNumber,
      totalQuestions: cfg.totalQuestions || 5,
      language: cfg.language || 'English',
      practiceMode: cfg.practiceMode || 'realistic',
      topics: cfg.topics || [],
      referenceInfo: cfg.referenceInfo || cfg.jobDescription || '',
      previousQuestions: params.previousQuestions,
      isFollowUp: params.isFollowUp,
      lastAnswerFeedback: params.lastAnswerFeedback,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate question from Gemini');
  }

  return data.questionItem;
}

export async function submitAnswerForEvaluation(params: {
  question: string;
  answer: string;
  purpose?: string;
  targetRole?: string;
  role?: string;
  industryOrSubject?: string;
  experience?: string;
  format?: string;
  interviewType?: string;
  difficulty?: string;
  category?: string;
  language?: string;
}): Promise<AnswerEvaluation> {
  const res = await fetch('/api/interview/evaluate-answer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to evaluate answer with Gemini');
  }

  return data.evaluation;
}

export async function requestFinalReport(params: {
  purpose?: string;
  targetRole?: string;
  role?: string;
  industryOrSubject?: string;
  experience?: string;
  format?: string;
  interviewType?: string;
  difficulty?: string;
  language?: string;
  questions: InterviewQuestionItem[];
}): Promise<FinalReport> {
  const res = await fetch('/api/interview/final-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to generate final report');
  }

  return data.report;
}

export async function runPromptLabComparison(
  payload: PromptComparisonRequest
): Promise<PromptComparisonResult> {
  const res = await fetch('/api/prompt-lab/compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to compare prompts in lab');
  }

  return data.result;
}

export async function fetchServerInterviews(): Promise<SavedInterview[]> {
  try {
    const res = await fetch('/api/interviews');
    if (!res.ok) return [];
    const data = await res.json();
    return data.interviews || [];
  } catch (err) {
    console.warn('Could not fetch interviews from server:', err);
    return [];
  }
}

export async function saveInterviewToServer(interview: SavedInterview): Promise<void> {
  try {
    await fetch('/api/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interview),
    });
  } catch (err) {
    console.warn('Could not save interview to server API:', err);
  }
}

export async function deleteInterviewFromServer(id: string): Promise<void> {
  try {
    await fetch(`/api/interviews/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn('Could not delete interview from server API:', err);
  }
}
