import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Bot,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  History,
  ShieldAlert,
  Code2,
  Trash2,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Users,
  Flame,
  FileText,
  Briefcase,
} from 'lucide-react';
import {
  AnswerEvaluation,
  InterviewConfig,
  InterviewQuestionItem,
  SavedInterview,
} from '../types/interview';
import { submitAnswerForEvaluation, requestNextQuestion, requestFinalReport } from '../services/api';
import { persistInterview } from '../services/storage';

interface LiveInterviewRoomProps {
  interview: SavedInterview;
  onUpdateInterview: (updated: SavedInterview) => void;
  onFinishInterview: (completed: SavedInterview) => void;
  onExitEarly: () => void;
}

export const LiveInterviewRoom: React.FC<LiveInterviewRoomProps> = ({
  interview,
  onUpdateInterview,
  onFinishInterview,
  onExitEarly,
}) => {
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Monospace font toggle
  const [isCodeMode, setIsCodeMode] = useState(false);

  // Accordion drawer for previous questions / full transcript
  const [showTranscriptDrawer, setShowTranscriptDrawer] = useState(false);
  const [expandedModelAnswer, setExpandedModelAnswer] = useState(false);

  // Paused state
  const [isPaused, setIsPaused] = useState(Boolean(interview.isPaused));
  const [elapsedSeconds, setElapsedSeconds] = useState(interview.elapsedSeconds || 0);

  // Rapid fire countdown
  const timeLimit = interview.config.practiceMode === 'rapid-fire' ? 60 : null;
  const [rapidFireRemaining, setRapidFireRemaining] = useState<number | null>(timeLimit);

  useEffect(() => {
    // Check speech recognition support safely
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(Boolean(SpeechRecognition));
  }, []);

  // Timer interval
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        return next;
      });

      if (timeLimit !== null) {
        setRapidFireRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, timeLimit]);

  // Reset rapid fire timer when question changes
  const currentQuestionIndex = interview.questions.findIndex((q) => !q.candidateAnswer);
  const activeIndex = currentQuestionIndex >= 0 ? currentQuestionIndex : interview.questions.length - 1;
  const currentQuestion = interview.questions[activeIndex];
  const isCurrentAnswered = Boolean(currentQuestion?.candidateAnswer);

  useEffect(() => {
    if (timeLimit !== null) {
      setRapidFireRemaining(timeLimit);
    }
  }, [activeIndex, timeLimit]);

  // Sync draft answer
  useEffect(() => {
    if (currentQuestion && currentQuestion.candidateAnswer && !isCurrentAnswered) {
      setCurrentAnswer(currentQuestion.candidateAnswer);
    } else if (!isCurrentAnswered) {
      setCurrentAnswer('');
    }
  }, [activeIndex, isCurrentAnswered]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Speech Synthesis (TTS)
  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!currentQuestion) return;

    window.speechSynthesis.cancel();
    const textToSpeak = `${currentQuestion.interviewerPersona ? `From ${currentQuestion.interviewerPersona}. ` : ''}${
      currentQuestion.interviewerNote ? `${currentQuestion.interviewerNote}. ` : ''
    }Question: ${currentQuestion.question}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Set language tag if known
    if (interview.config.language === 'Hindi') utterance.lang = 'hi-IN';
    else if (interview.config.language === 'Spanish') utterance.lang = 'es-ES';
    else if (interview.config.language === 'French') utterance.lang = 'fr-FR';
    else if (interview.config.language === 'German') utterance.lang = 'de-DE';
    else utterance.lang = 'en-US';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Repeat question handler
  const handleRepeatQuestion = () => {
    handleToggleSpeak();
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeIndex]);

  // Speech Recognition (Dictation)
  const handleToggleListen = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        'Speech recognition is not available in your current browser. You can type your answer in the text box.'
      );
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      if (interview.config.language === 'Hindi') recognition.lang = 'hi-IN';
      else if (interview.config.language === 'Spanish') recognition.lang = 'es-ES';
      else if (interview.config.language === 'French') recognition.lang = 'fr-FR';
      else if (interview.config.language === 'German') recognition.lang = 'de-DE';
      else recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = (e: any) => {
        console.warn('Speech recognition notice:', e);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Could not initialize speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleTogglePause = async () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    const updated = {
      ...interview,
      isPaused: nextPaused,
      elapsedSeconds,
    };
    onUpdateInterview(updated);
    await persistInterview(updated);
  };

  // Submit Answer
  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      setErrorMessage('Please type or dictate an answer before submitting.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (isSpeaking && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const evaluation = await submitAnswerForEvaluation({
        question: currentQuestion.question,
        answer: currentAnswer.trim(),
        purpose: interview.config.purpose,
        targetRole: interview.config.targetRole,
        industryOrSubject: interview.config.industryOrSubject,
        experience: interview.config.experience,
        format: interview.config.format,
        difficulty: currentQuestion.difficulty || interview.config.difficulty,
        category: currentQuestion.category,
        language: interview.config.language,
      });

      const updatedQuestions = [...interview.questions];
      updatedQuestions[activeIndex] = {
        ...currentQuestion,
        candidateAnswer: currentAnswer.trim(),
        answeredAt: new Date().toISOString(),
        evaluation,
      };

      const answeredList = updatedQuestions.filter((q) => q.evaluation);
      const avgScore = Math.round(
        answeredList.reduce((acc, q) => acc + (q.evaluation?.percentage || 0), 0) / answeredList.length
      );

      const updatedInterview: SavedInterview = {
        ...interview,
        questions: updatedQuestions,
        overallScore: avgScore,
        elapsedSeconds,
      };

      onUpdateInterview(updatedInterview);
      await persistInterview(updatedInterview);

      // In REALISTIC INTERVIEW MODE, auto-advance directly to the next question or report!
      if (interview.config.practiceMode === 'realistic') {
        if (currentQuestion.questionNumber >= interview.config.totalQuestions) {
          await handleFinalizeReport(updatedInterview);
        } else {
          await handleAdvanceNextQuestion(updatedInterview);
        }
      }
    } catch (err: any) {
      console.error('Failed to evaluate answer:', err);
      setErrorMessage(err.message || 'Evaluation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Advance Next Question helper
  const handleAdvanceNextQuestion = async (baseInterview: SavedInterview = interview) => {
    setIsNextLoading(true);
    setErrorMessage(null);

    try {
      const lastEval = currentQuestion?.evaluation;
      const shouldProbe = Boolean(lastEval?.suggestedFollowUp && lastEval.percentage < 75);

      const nextQ = await requestNextQuestion({
        config: baseInterview.config,
        questionNumber: (currentQuestion?.questionNumber || 1) + 1,
        previousQuestions: baseInterview.questions,
        isFollowUp: shouldProbe,
        lastAnswerFeedback: shouldProbe
          ? {
              lastAnswer: currentQuestion?.candidateAnswer || '',
              probeFocus: lastEval?.suggestedFollowUp || 'practical operational trade-offs',
            }
          : undefined,
      });

      const updatedQuestions = [...baseInterview.questions, nextQ];
      const updatedInterview: SavedInterview = {
        ...baseInterview,
        questions: updatedQuestions,
        elapsedSeconds,
      };

      onUpdateInterview(updatedInterview);
      await persistInterview(updatedInterview);
      setCurrentAnswer('');
      setExpandedModelAnswer(false);
    } catch (err: any) {
      console.error('Failed to get next question:', err);
      setErrorMessage(err.message || 'Could not generate next question. Please try again.');
    } finally {
      setIsNextLoading(false);
    }
  };

  // Finalize Report helper
  const handleFinalizeReport = async (baseInterview: SavedInterview = interview) => {
    setIsNextLoading(true);
    setErrorMessage(null);

    try {
      const finalReport = await requestFinalReport({
        purpose: baseInterview.config.purpose,
        targetRole: baseInterview.config.targetRole,
        industryOrSubject: baseInterview.config.industryOrSubject,
        experience: baseInterview.config.experience,
        format: baseInterview.config.format,
        difficulty: baseInterview.config.difficulty,
        language: baseInterview.config.language,
        questions: baseInterview.questions,
      });

      const completedInterview: SavedInterview = {
        ...baseInterview,
        status: 'completed',
        overallScore: finalReport.overallScore,
        finalReport,
        elapsedSeconds,
      };

      await persistInterview(completedInterview);
      onFinishInterview(completedInterview);
    } catch (err: any) {
      console.error('Failed to generate final report:', err);
      setErrorMessage('Failed to compile report. Please try again.');
    } finally {
      setIsNextLoading(false);
    }
  };

  const progressPercentage = Math.round(
    ((currentQuestion?.questionNumber || 1) / (interview.config.totalQuestions || 5)) * 100
  );

  const isPanel = interview.config.format.toLowerCase().includes('panel');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Status Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
            {isPanel ? <Users className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                {interview.config.targetRole || interview.config.role}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {interview.config.purpose}
              </span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                {interview.config.practiceMode.toUpperCase()} MODE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5">
              Candidate: {interview.config.candidateName || 'Candidate'} • {interview.config.language} • {interview.config.experience}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Rapid-fire timer */}
          {timeLimit !== null && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              (rapidFireRemaining || 0) <= 15 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-amber-100 text-amber-800'
            }`}>
              <Flame className="w-3.5 h-3.5" />
              <span>Target: {rapidFireRemaining}s</span>
            </div>
          )}

          {/* Elapsed Timer & Pause Button */}
          <button
            onClick={handleTogglePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              isPaused
                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 border-amber-300'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100'
            }`}
          >
            {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
            <span>{isPaused ? 'Resume' : formatTimer(elapsedSeconds)}</span>
          </button>

          {/* Question Progress */}
          <div className="w-24 sm:w-32 hidden xs:block">
            <div className="flex justify-between text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
              <span>Q{currentQuestion?.questionNumber}</span>
              <span>of {interview.config.totalQuestions}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowTranscriptDrawer(!showTranscriptDrawer)}
            className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            title="View Full Transcript"
          >
            <History className="w-4 h-4" />
          </button>

          <button
            onClick={onExitEarly}
            className="text-xs text-zinc-400 hover:text-rose-500 transition-colors"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-center space-y-3">
          <Pause className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-base font-bold text-amber-900 dark:text-amber-200">
            Interview Session Paused
          </h2>
          <p className="text-xs text-amber-700 dark:text-amber-300 max-w-sm mx-auto">
            Take a breather. Your answers and session timer are preserved.
          </p>
          <button
            onClick={handleTogglePause}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
          >
            Resume Interview
          </button>
        </div>
      )}

      {/* Transcript Drawer */}
      {showTranscriptDrawer && (
        <div className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Live Session Transcript ({interview.questions.length} questions)
            </h3>
            <button
              onClick={() => setShowTranscriptDrawer(false)}
              className="text-xs text-zinc-400 hover:text-zinc-600"
            >
              Close
            </button>
          </div>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {interview.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-3.5 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Q{q.questionNumber}: {q.category} {q.interviewerPersona ? `• ${q.interviewerPersona}` : ''}
                  </span>
                  {q.evaluation ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      {q.evaluation.percentage}% ({q.evaluation.totalScore}/{q.evaluation.maxTotalScore})
                    </span>
                  ) : (
                    <span className="text-zinc-400 text-[10px]">Active Question</span>
                  )}
                </div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">{q.question}</p>
                {q.candidateAnswer && (
                  <p className="text-zinc-600 dark:text-zinc-400 italic">
                    Answer: "{q.candidateAnswer}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      {!isPaused && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {currentQuestion?.category || 'Assessment Question'}
              </span>
              {currentQuestion?.interviewerPersona && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                  {currentQuestion.interviewerPersona}
                </span>
              )}
              {currentQuestion?.isFollowUp && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300">
                  Adaptive Follow-up
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRepeatQuestion}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50"
                title="Repeat question audio"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Repeat Question</span>
              </button>

              <button
                onClick={handleToggleSpeak}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                  isSpeaking
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Stop Audio' : 'Audio Read'}</span>
              </button>
            </div>
          </div>

          {/* Scenario Context (for Case Study / Situational) */}
          {currentQuestion?.scenarioContext && (
            <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 space-y-1">
              <strong className="block font-semibold">Scenario Context:</strong>
              <p>{currentQuestion.scenarioContext}</p>
            </div>
          )}

          {/* Interviewer Spoken Persona Lead-in */}
          {currentQuestion?.interviewerNote && (
            <div className="text-xs text-indigo-700 dark:text-indigo-400 italic bg-indigo-50/50 dark:bg-indigo-950/30 px-3.5 py-2 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
              {currentQuestion.interviewerPersona || 'Interviewer'}: "{currentQuestion.interviewerNote}"
            </div>
          )}

          {/* Question Statement */}
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-relaxed">
            {currentQuestion?.question}
          </h2>

          {/* Answer Input Area */}
          {!isCurrentAnswered ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-semibold">Your Candidate Answer:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCodeMode(!isCodeMode)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${
                      isCodeMode
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : 'border-zinc-200 dark:border-zinc-700'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Monospace</span>
                  </button>
                  <span>{currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words</span>
                </div>
              </div>

              <textarea
                rows={7}
                disabled={isSubmitting}
                placeholder="Type your structured answer here. Include concrete context, actions taken, and quantified results..."
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                className={`w-full p-4 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${
                  isCodeMode ? 'font-mono text-xs' : ''
                }`}
              />

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-700 text-xs border border-rose-200">
                  {errorMessage}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleToggleListen}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      isListening
                        ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                        : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Listening (Click to Stop)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Voice Input</span>
                      </>
                    )}
                  </button>

                  {currentAnswer && (
                    <button
                      type="button"
                      onClick={() => setCurrentAnswer('')}
                      className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
                      title="Clear"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isSubmitting || !currentAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>
                        {interview.config.practiceMode === 'realistic'
                          ? 'Recording & Advancing...'
                          : 'Evaluating with Universal Rubric...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {interview.config.practiceMode === 'realistic'
                          ? 'Submit & Next Question'
                          : 'Submit Answer'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-xs space-y-1">
              <span className="font-bold text-zinc-500">Submitted Answer:</span>
              <p className="text-zinc-900 dark:text-zinc-100 whitespace-pre-wrap">
                {currentQuestion.candidateAnswer}
              </p>
            </div>
          )}
        </div>
      )}

      {/* LEARNING MODE: Real-time Evaluation Card (Hidden in Realistic mode until final report) */}
      {interview.config.practiceMode !== 'realistic' && isCurrentAnswered && currentQuestion.evaluation && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                <span>Learning Mode Feedback</span>
              </div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 mt-1">
                Question Competency Assessment
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {currentQuestion.evaluation.percentage}%
                </div>
                <div className="text-[10px] text-zinc-400 font-medium">
                  {currentQuestion.evaluation.totalScore}/{currentQuestion.evaluation.maxTotalScore} pts
                </div>
              </div>
            </div>
          </div>

          {/* Criteria breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {currentQuestion.evaluation.rubricDetails.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 capitalize truncate">
                    {item.name}
                  </span>
                  <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                    {item.score}/5
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                  <div
                    style={{ width: `${(item.score / 5) * 100}%` }}
                    className={`h-full rounded-full ${
                      item.score >= 4 ? 'bg-emerald-500' : item.score === 3 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                </div>
                {item.description && (
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strengths</span>
              </div>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc pl-4">
                {currentQuestion.evaluation.strengths.map((str, i) => (
                  <li key={i}>{str}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <span>Missing Points & Gaps</span>
              </div>
              <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc pl-4">
                {currentQuestion.evaluation.weaknessesOrMissing.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actionable Suggestions */}
          <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700 dark:text-sky-400">
              <Lightbulb className="w-4 h-4" />
              <span>Actionable Coaching Suggestions</span>
            </div>
            <ul className="text-xs text-zinc-700 dark:text-zinc-300 space-y-1 list-disc pl-4">
              {currentQuestion.evaluation.improvementSuggestions.map((sug, i) => (
                <li key={i}>{sug}</li>
              ))}
            </ul>
          </div>

          {/* Collapsible Model Answer */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedModelAnswer(!expandedModelAnswer)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-800/40 text-left flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Exemplary Model Response</span>
              </div>
              {expandedModelAnswer ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {expandedModelAnswer && (
              <div className="p-4 text-xs text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
                <p className="whitespace-pre-wrap">{currentQuestion.evaluation.modelAnswer}</p>
                <div className="text-[11px] text-zinc-400">
                  Recommended Skill to Practice:{' '}
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {currentQuestion.evaluation.recommendedTopic}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Advance button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                if (currentQuestion.questionNumber >= interview.config.totalQuestions) {
                  handleFinalizeReport();
                } else {
                  handleAdvanceNextQuestion();
                }
              }}
              disabled={isNextLoading}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              {isNextLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>
                    {currentQuestion.questionNumber >= interview.config.totalQuestions
                      ? 'Finish & View Comprehensive Final Report'
                      : 'Proceed to Next Question'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
