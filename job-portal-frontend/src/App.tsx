import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import Applications from "./pages/Applications";
import JobApplicants from "./pages/JobApplicants";
import ApplicantProfile from "./pages/ApplicantProfile";
import NotFound from "./pages/NotFound";
import authService from "./services/authService";

const queryClient = new QueryClient();

// Initial app setup component
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    // Check if this is the first time loading the app in this session
    const hasInitialized = sessionStorage.getItem('app_initialized');
    
    if (!hasInitialized) {
      console.log('First app load - clearing any existing auth state');
      // Clear any existing auth data to ensure no user is logged in on first load
      authService.logout();
      // Mark as initialized for this session
      sessionStorage.setItem('app_initialized', 'true');
    }
  }, []);

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppInitializer>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/applications" element={<JobApplicants />} />
          <Route path="/job-applicants/:jobId" element={<JobApplicants />} />
          <Route path="/applicant-profile/:applicationId" element={<ApplicantProfile />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post-job" element={<PostJob />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AppInitializer>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
