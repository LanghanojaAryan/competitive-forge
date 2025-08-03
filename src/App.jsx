import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthPage from './components/AuthPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardPage from './components/DashboardPage';
import ProblemListPage from './components/ProblemListPage';
import ContestsPage from './components/ContestsPage';
import ContestDetailsPage from './components/ContestDetailsPage';
import ProblemSolvingPage from './components/ProblemSolvingPage';
import ProfilePage from './components/ProfilePage';
import ExamPage from './components/ExamPage';
import CoursesPage from './components/CoursesPage';
import LearningPathsPage from './components/LearningPathsPage';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [selectedContest, setSelectedContest] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CodeArena...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleViewChange = (view) => {
    setCurrentView(view);
    setSelectedProblem(null);
    setSelectedContest(null);
    setSelectedCourse(null);
    setSelectedPath(null);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    // Navigate to course content or continue with course selection logic
  };

  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
    // Navigate to learning path content or continue with path selection logic
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setCurrentView('problem-solving');
  };

  const handleContestSelect = (contest) => {
    setSelectedContest(contest);
    setCurrentView('contest-details');
  };

  const handleBackToProblemList = () => {
    setSelectedProblem(null);
    setCurrentView('problems');
  };

  const handleBackToContests = () => {
    setSelectedContest(null);
    setCurrentView('contests');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'problems':
        return (
          <ProblemListPage 
            onViewChange={handleViewChange}
            onProblemSelect={handleProblemSelect}
          />
        );
      case 'contests':
        return (
          <ContestsPage 
            onContestSelect={handleContestSelect}
          />
        );
      case 'contest-details':
        return (
          <ContestDetailsPage 
            contest={selectedContest}
            onBackToContests={handleBackToContests}
            onProblemSelect={handleProblemSelect}
          />
        );
      case 'problem-solving':
        return (
          <ProblemSolvingPage 
            problem={selectedProblem}
            onBackToProblemList={handleBackToProblemList}
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'exam':
        return <ExamPage onBackToDashboard={handleBackToDashboard} />;
      case 'courses':
        return (
          <CoursesPage 
            onCourseSelect={handleCourseSelect}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case 'learning-paths':
        return (
          <LearningPathsPage 
            onPathSelect={handlePathSelect}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      default:
        return <DashboardPage />;
    }
  };

  if (currentView === 'problem-solving') {
    // Problem solving page uses full screen layout
    return (
      <div className="h-screen overflow-hidden">
        {renderCurrentView()}
      </div>
    );
  }

  return (
    <DashboardLayout 
      currentView={currentView} 
      onViewChange={handleViewChange}
    >
      {renderCurrentView()}
    </DashboardLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;