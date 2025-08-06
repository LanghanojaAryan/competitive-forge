import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LMSProvider, useLMS } from './contexts/LMSContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LMSAuthPage from './components/LMSAuthPage';
import StudentDashboardLayout from './components/StudentDashboardLayout';
import InstructorDashboardLayout from './components/InstructorDashboardLayout';
import StudentDashboardPage from './components/StudentDashboardPage';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, loading } = useLMS();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading CodeArena LMS...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LMSAuthPage />;
  }

  // Role-based routing
  if (user.role === 'instructor') {
    return (
      <InstructorDashboardLayout>
        <Routes>
          <Route path="/instructor/dashboard" element={<div>Instructor Dashboard Coming Soon</div>} />
          <Route path="/instructor/courses" element={<div>Course Management Coming Soon</div>} />
          <Route path="/instructor/analytics" element={<div>Student Analytics Coming Soon</div>} />
          <Route path="/instructor/create" element={<div>Create Content Coming Soon</div>} />
          <Route path="/instructor/payouts" element={<div>Payouts Coming Soon</div>} />
          <Route path="/instructor/profile" element={<div>Instructor Profile Coming Soon</div>} />
          <Route path="*" element={<div>Instructor Dashboard Coming Soon</div>} />
        </Routes>
      </InstructorDashboardLayout>
    );
  }

  // Student routes
  return (
    <StudentDashboardLayout>
      <Routes>
        <Route path="/student/dashboard" element={<StudentDashboardPage />} />
        <Route path="/student/courses" element={<div>My Courses Coming Soon</div>} />
        <Route path="/student/catalog" element={<div>Course Catalog Coming Soon</div>} />
        <Route path="/student/learning-paths" element={<div>Learning Paths Coming Soon</div>} />
        <Route path="/student/grades" element={<div>Grades Coming Soon</div>} />
        <Route path="/student/profile" element={<div>Student Profile Coming Soon</div>} />
        <Route path="/student/course/:id" element={<div>Course Player Coming Soon</div>} />
        <Route path="*" element={<StudentDashboardPage />} />
      </Routes>
    </StudentDashboardLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LMSProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </LMSProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;