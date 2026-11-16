/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar, NavView } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { InterviewConfigView } from './components/InterviewConfigView';
import { LiveInterviewRoom } from './components/LiveInterviewRoom';
import { FinalReportView } from './components/FinalReportView';
import { PromptLab } from './components/PromptLab';
import { InterviewHistoryView } from './components/InterviewHistoryView';
import { CollegeProjectDocs } from './components/CollegeProjectDocs';
import { InterviewConfig, SavedInterview } from './types/interview';
import { loadAllInterviews, persistInterview, SAMPLE_DEMO_INTERVIEWS } from './services/storage';
import { requestNextQuestion } from './services/api';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Stored interviews
  const [interviews, setInterviews] = useState<SavedInterview[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);

  // Current active live interview room session
  const [activeInterview, setActiveInterview] = useState<SavedInterview | null>(null);

  // Interview currently being inspected in Report View
  const [inspectingInterview, setInspectingInterview] = useState<SavedInterview | null>(null);

  // Configuration loading state
  const [isStartingInterview, setIsStartingInterview] = useState(false);

  // Load interviews from storage on mount
  useEffect(() => {
    async function loadData() {
      try {
        const loaded = await loadAllInterviews();
        setInterviews(loaded);
        // If there is an unfinished session in progress, restore it
        const inProgress = loaded.find((i) => i.status === 'in-progress');
        if (inProgress) {
          setActiveInterview(inProgress);
        }
      } catch (err) {
        console.error('Failed to load interviews:', err);
      } finally {
        setIsLoadingInterviews(false);
      }
    }
    loadData();
  }, []);

  const refreshInterviews = async () => {
    const list = await loadAllInterviews();
    setInterviews(list);
  };

  // Start a new simulated interview
  const handleStartNewInterview = async (config: InterviewConfig) => {
    setIsStartingInterview(true);
    try {
      // 1. Generate the opening question from Gemini 3.8 Flash
      const firstQuestion = await requestNextQuestion({
        config,
        questionNumber: 1,
        previousQuestions: [],
      });

      // 2. Formulate interview record
      const newInterview: SavedInterview = {
        id: `interview_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        config,
        questions: [firstQuestion],
        status: 'in-progress',
        overallScore: 0,
      };

      // 3. Persist and switch to live room
      const updatedList = await persistInterview(newInterview);
      setInterviews(updatedList);
      setActiveInterview(newInterview);
      setCurrentView('room');
    } catch (err: any) {
      console.error('Error starting interview:', err);
      alert(err.message || 'Failed to start interview with Gemini. Please try again.');
    } finally {
      setIsStartingInterview(false);
    }
  };

  // Complete interview session and show final report
  const handleFinishInterview = (completed: SavedInterview) => {
    setActiveInterview(null);
    setInspectingInterview(completed);
    refreshInterviews();
    setCurrentView('docs' as any); // temporary switch or report
    // Switch to report display
  };

  // Pre-seed demo interviews for viva examiners
  const handleLoadDemoData = async () => {
    let current = [...interviews];
    for (const demo of SAMPLE_DEMO_INTERVIEWS) {
      if (!current.some((i) => i.id === demo.id)) {
        await persistInterview(demo);
      }
    }
    await refreshInterviews();
  };

  const handleViewInterview = (interview: SavedInterview) => {
    setInspectingInterview(interview);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors antialiased selection:bg-indigo-500/20 selection:text-indigo-600">
      {/* Top Navigation */}
      <Navbar
        onStartNew={() => {
          setInspectingInterview(null);
          setCurrentView('setup');
        }}
        activeInterviewCount={interviews.length}
        onOpenDocs={() => {
          setInspectingInterview(null);
          setCurrentView('docs');
        }}
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
      />

      <div className="flex-1 flex max-w-full">
        {/* Left Sidebar */}
        <Sidebar
          currentView={inspectingInterview ? ('history' as NavView) : currentView}
          onNavigate={(view) => {
            setInspectingInterview(null);
            setCurrentView(view);
          }}
          hasActiveRoom={Boolean(activeInterview && activeInterview.status === 'in-progress')}
          activeQuestionNumber={activeInterview?.questions?.length || 1}
          totalQuestions={activeInterview?.config?.totalQuestions || 5}
          isOpen={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* If inspecting an individual saved report */}
          {inspectingInterview ? (
            <FinalReportView
              interview={inspectingInterview}
              onReturnToDashboard={() => {
                setInspectingInterview(null);
                setCurrentView('dashboard');
              }}
              onPracticeAgain={() => {
                setInspectingInterview(null);
                setCurrentView('setup');
              }}
            />
          ) : currentView === 'dashboard' ? (
            <Dashboard
              interviews={interviews}
              activeInterview={activeInterview}
              onStartNew={() => {
                setInspectingInterview(null);
                setCurrentView('setup');
              }}
              onContinueInterview={() => setCurrentView('room')}
              onViewInterview={handleViewInterview}
              onLoadDemoData={handleLoadDemoData}
              onNavigateToLab={() => setCurrentView('prompt-lab')}
            />
          ) : currentView === 'setup' ? (
            <InterviewConfigView
              onStartInterview={handleStartNewInterview}
              isLoading={isStartingInterview}
            />
          ) : currentView === 'room' && activeInterview ? (
            <LiveInterviewRoom
              interview={activeInterview}
              onUpdateInterview={(updated) => {
                setActiveInterview(updated);
                refreshInterviews();
              }}
              onFinishInterview={(completed) => {
                setActiveInterview(null);
                setInspectingInterview(completed);
              }}
              onExitEarly={() => {
                if (window.confirm('Do you want to exit the current interview session? Your progress is saved in history.')) {
                  setActiveInterview(null);
                  setCurrentView('dashboard');
                  refreshInterviews();
                }
              }}
            />
          ) : currentView === 'history' ? (
            <InterviewHistoryView
              interviews={interviews}
              onViewInterview={handleViewInterview}
              onRefreshList={refreshInterviews}
              onStartNew={() => setCurrentView('setup')}
            />
          ) : currentView === 'prompt-lab' ? (
            <PromptLab />
          ) : currentView === 'docs' ? (
            <CollegeProjectDocs
              onLoadPrebuiltDemo={(sample) => {
                setInspectingInterview(sample);
              }}
              onStartNewWithRole={(role, type) => {
                setCurrentView('setup');
              }}
            />
          ) : (
            <Dashboard
              interviews={interviews}
              onStartNew={() => setCurrentView('setup')}
              onViewInterview={handleViewInterview}
              onLoadDemoData={handleLoadDemoData}
              onNavigateToLab={() => setCurrentView('prompt-lab')}
            />
          )}
        </main>
      </div>
    </div>
  );
}
