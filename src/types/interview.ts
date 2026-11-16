export type InterviewPurpose =
  | 'Job interview'
  | 'HR interview'
  | 'Technical interview'
  | 'Behavioral interview'
  | 'Managerial interview'
  | 'Government job interview'
  | 'College or university admission'
  | 'Scholarship interview'
  | 'Internship interview'
  | 'Promotion interview'
  | 'Career-change interview'
  | 'Custom interview';

export type ExperienceLevel =
  | 'Student'
  | 'Fresher'
  | '0–2 years'
  | '3–5 years'
  | '6–10 years'
  | '10+ years'
  | 'Custom';

export type InterviewFormat =
  | 'HR screening'
  | 'Technical or subject knowledge'
  | 'Behavioral'
  | 'Situational'
  | 'Case study'
  | 'Communication assessment'
  | 'Panel interview simulation'
  | 'Stress interview simulation'
  | 'Mixed interview'
  | 'Custom format';

export type DifficultyLevel = 'Beginner' | 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type PracticeMode =
  | 'realistic' // Full round first, feedback only in final report
  | 'learning' // Real-time feedback & model answer after every question
  | 'rapid-fire' // Quick pace with countdown target timer per question
  | 'beginner' // Accessible gentle questions with foundational explanations
  | 'advanced' // Challenging edge cases & multi-part case problems
  | 'custom'; // User defined parameters

export interface InterviewConfig {
  id?: string;
  purpose: InterviewPurpose;
  targetRole: string; // Free-text role, profession, course, or position
  industryOrSubject: string; // Free-text industry or subject
  experience: ExperienceLevel | string;
  format: InterviewFormat;
  difficulty: DifficultyLevel;
  totalQuestions: number; // 5, 10, 15, 20, or custom
  language: string; // English, Hindi, Hinglish, Spanish, etc.
  practiceMode: PracticeMode;
  topics: string[];
  referenceInfo?: string; // JD, syllabus, admission criteria, exam notice
  candidateName?: string;
  customRules?: string;

  // Backward compatibility fields
  role?: string;
  customRoleTitle?: string;
  interviewType?: string;
  jobDescription?: string;
}

export interface RubricScoreItem {
  name: string;
  score: number; // 0 to 5
  maxScore: number;
  description: string;
}

export interface AnswerEvaluation {
  scores: Record<string, number>; // criteria name -> score 0 to 5
  rubricDetails: RubricScoreItem[];
  totalScore: number;
  maxTotalScore: number;
  percentage: number; // 0 to 100
  strengths: string[];
  weaknessesOrMissing: string[];
  improvementSuggestions: string[];
  modelAnswer: string;
  recommendedTopic: string;
  suggestedFollowUp?: string;
}

export interface InterviewQuestionItem {
  id: string;
  questionNumber: number;
  question: string;
  category: string;
  difficulty: DifficultyLevel;
  interviewerPersona?: string; // For panel or specialized role persona
  interviewerNote?: string;
  isFollowUp?: boolean;
  followUpReason?: string;
  scenarioContext?: string; // For case study or situational setup
  suggestedTimeSeconds?: number;
  candidateAnswer?: string;
  answeredAt?: string;
  evaluation?: AnswerEvaluation;
}

export interface SevenDayPlanDay {
  day: number;
  title: string;
  focus: string;
  activities: string[];
}

export interface ImprovedWeakAnswer {
  originalQuestion: string;
  candidateWeakAnswer: string;
  revisedExemplaryAnswer: string;
  explanation: string;
}

export interface FinalReport {
  overallScore: number; // 0 - 100
  performanceRating: 'Needs Improvement' | 'Developing' | 'Proficient' | 'Interview Ready' | 'Exceptional';
  executiveSummary: string;
  criteriaBreakdown: Record<string, number>; // Criteria name -> score 0-100
  strongestAnswers: Array<{
    question: string;
    reason: string;
    score: number;
  }>;
  weakestAnswers: Array<{
    question: string;
    reason: string;
    score: number;
  }>;
  areasToImprove: Array<{
    area: string;
    suggestion: string;
  }>;
  commonMistakes: string[];
  knowledgeGaps: string[];
  communicationFeedback: string;
  personalizedRecommendations: string[];
  suggestedPracticeQuestions: string[];
  sevenDayPrepPlan: SevenDayPlanDay[];
  improvedWeakAnswer: ImprovedWeakAnswer;
}

export interface SavedInterview {
  id: string;
  createdAt: string;
  config: InterviewConfig;
  questions: InterviewQuestionItem[];
  finalReport?: FinalReport;
  overallScore: number;
  status: 'in-progress' | 'completed' | 'abandoned';
  isPaused?: boolean;
  elapsedSeconds?: number;
}

export interface PromptComparisonRequest {
  technique: string;
  question: string;
  candidateInput: string;
  basicPrompt: string;
  improvedPrompt: string;
}

export interface PromptComparisonResult {
  technique: string;
  basicOutput: string;
  improvedOutput: string;
  analysis: {
    relevance: { basic: number; improved: number };
    completeness: { basic: number; improved: number };
    consistency: { basic: number; improved: number };
    instructionFollowing: { basic: number; improved: number };
  };
  keyDifferences: string[];
  educationalInsight: string;
}
