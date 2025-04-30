import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Briefcase, 
  Bell, 
  Inbox, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  User,
  Users,
  ChevronRight,
  Building,
  CalendarDays,
  Bookmark,
  MapPin,
  DollarSign,
  Trash2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import DashboardStats from "@/components/dashboard/DashboardStats";
import JobCard, { JobData } from "@/components/jobs/JobCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import dashboardService, { 
  RecruiterDashboardData, 
  ApplicantDashboardData,
  isRecruiterDashboard,
  isApplicantDashboard
} from "@/services/dashboardService";
import authService from "@/services/authService";
import jobService from "@/services/jobService";
import { toast } from "sonner";

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface Application {
  id: number;
  application_id: number;
  jobTitle: string;
  job_title: string;
  company: string;
  company_name: string;
  appliedDate: string;
  date_of_application: string;
  status: string;
  deadline?: string;
}

interface Applicant {
  id: number;
  name: string;
  appliedDate: string;
  jobTitle: string;
  status: string;
}

interface RecentJob {
  id: number;
  title: string;
  category?: string;
  location: string;
  salary?: number;
  date_of_posting?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"applicant" | "recruiter" | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Dashboard data
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [postedJobs, setPostedJobs] = useState<JobData[]>([]);
  const [recruiterDashboard, setRecruiterDashboard] = useState<RecruiterDashboardData | null>(null);
  const [applicantDashboard, setApplicantDashboard] = useState<ApplicantDashboardData | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  
  // Application deletion
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<number | null>(null);
  
  // Check authentication and load dashboard data
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = authService.getCurrentUser();
    
        if (!user) {
      navigate("/auth?type=login");
      return;
    }
    
        console.log("Current user:", user);
        setUserType(user.type);
        setUserId(user.id);
        
        // Load dashboard data based on user type
        try {
          setLoading(true);
          const dashboardData = await dashboardService.getDashboard(user.id, user.type);
          console.log("Dashboard data:", dashboardData);
          
          if (user.type === "recruiter" && isRecruiterDashboard(dashboardData)) {
            setRecruiterDashboard(dashboardData);
            
            // Convert the backend data to our format
            const formattedJobs: JobData[] = dashboardData.jobsWithApplicantCount.map(job => ({
              id: job.job_id,
              title: job.title,
              total_applicants: job.total_applicants,
              job_type: "Full-Time", // Default values
              deadline: "N/A",
              location: "N/A"
            }));
            setPostedJobs(formattedJobs);
            
            if (dashboardData.recentApplications) {
              const formattedApplicants: Applicant[] = dashboardData.recentApplications.map(app => ({
                id: app.application_id,
                name: app.applicant_name,
                appliedDate: app.date_of_application,
                jobTitle: app.job_title || "Applied Job",
                status: app.status
              }));
              setApplicants(formattedApplicants);
            }
            
            // Set dashboard stats for the recruiter
            setDashboardStats({
              totalJobs: dashboardData.jobsWithApplicantCount.length || 0,
              totalApplicants: dashboardData.jobsWithApplicantCount.reduce((acc, job) => acc + job.total_applicants, 0) || 0,
              newApplicants: dashboardData.recentApplications?.length || 0,
              rating: 4.5 // Default rating
            });
            
            // Set notifications if available
            if (dashboardData.notifications && dashboardData.notifications.length > 0) {
              const formattedNotifications: Notification[] = dashboardData.notifications.map((notif, index) => ({
                id: notif.notification_id || index,
                message: notif.message,
                time: notif.time_ago || notif.created_at || new Date().toISOString(),
                read: notif.read || notif.is_read === 1 || false
              }));
              setNotifications(formattedNotifications);
            }
          } else if (user.type === "applicant" && isApplicantDashboard(dashboardData)) {
            // Applicant dashboard - Use the real API data
            setApplicantDashboard(dashboardData);
            
            // Helper function to map API data to our Application interface
            const mapApiToApplications = (data: any[]): Application[] => {
              return data.map(app => ({
                id: app.application_id,
                application_id: app.application_id,
                jobTitle: app.job_title,
                job_title: app.job_title,
                company: app.company_name || "Company",
                company_name: app.company_name || "Company",
                appliedDate: app.date_of_application,
                date_of_application: app.date_of_application,
                status: app.status,
                deadline: app.deadline
              }));
            };
            
            // Convert the backend data to our format - prefer myApplications over recentApplications
            const applicationsData = dashboardData.myApplications || dashboardData.recentApplications || [];
            setApplications(mapApiToApplications(applicationsData));
            
            // Handle recent jobs (new format)
            if (dashboardData.recentJobs && dashboardData.recentJobs.length > 0) {
              const formattedRecentJobs: RecentJob[] = dashboardData.recentJobs.map(job => ({
                id: job.job_id,
                title: job.title,
                category: job.category || "",
                location: job.location || "Remote",
                salary: job.salary,
                date_of_posting: job.date_of_posting
              }));
              setRecentJobs(formattedRecentJobs);
            } else if (dashboardData.savedJobs && dashboardData.savedJobs.length > 0) {
              // Fallback to saved jobs if recentJobs not available
              const formattedSavedJobs: RecentJob[] = dashboardData.savedJobs.map(job => ({
              id: job.job_id,
              title: job.title,
              location: job.location || "Remote",
                date_of_posting: job.deadline
            }));
              setRecentJobs(formattedSavedJobs);
            } else {
              setRecentJobs([]);
            }
            
            // Set dashboard stats for the applicant based on available data
            setDashboardStats({
              totalApplications: applicationsData.length || 0,
              pendingApplications: applicationsData.filter(app => app.status === "applied" || app.status === "pending").length || 0,
              interviewApplications: applicationsData.filter(app => app.status === "interviewing" || app.status === "shortlisted").length || 0,
              rejectedApplications: applicationsData.filter(app => app.status === "rejected").length || 0
            });
            
            // Set notifications from the dashboard data if available
            if (dashboardData.notifications && dashboardData.notifications.length > 0) {
              const formattedNotifications: Notification[] = dashboardData.notifications.map((notif, index) => ({
                id: (notif as any).notification_id || index,
                message: notif.message,
                time: (notif as any).time_ago || notif.created_at || new Date().toISOString(),
                read: (notif as any).read || notif.is_read === 1 || false
              }));
              setNotifications(formattedNotifications);
            } else {
              setNotifications([]);
            }
          }
        } catch (error) {
          console.error("Error loading dashboard data:", error);
          toast.error("Failed to load dashboard data. Please try again.");
          
          // Set empty data
          if (user.type === "recruiter") {
            setPostedJobs([]);
            setApplicants([]);
          } else {
            setApplications([]);
            setRecentJobs([]);
          }
          setNotifications([]);
        } finally {
        setLoading(false);
        }
    } catch (error) {
        console.error("Authentication error:", error);
      navigate("/auth?type=login");
    }
    };

    getCurrentUser();
  }, [navigate]);
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Handle application deletion
  const handleDeleteClick = (applicationId: number) => {
    setApplicationToDelete(applicationId);
    setDeleteDialogOpen(true);
  };
  
  // Handle deletion confirmation
  const confirmDelete = async () => {
    if (!applicationToDelete) {
      setDeleteDialogOpen(false);
      return;
    }
    
    try {
      await jobService.deleteApplication(applicationToDelete.toString());
      
      // Remove the application from state
      setApplications(applications.filter(app => 
        app.id !== applicationToDelete && app.application_id !== applicationToDelete
      ));
      
      // Update dashboard stats
      if (dashboardStats) {
        setDashboardStats({
          ...dashboardStats,
          totalApplications: dashboardStats.totalApplications - 1,
          pendingApplications: applications.find(a => 
            (a.id === applicationToDelete || a.application_id === applicationToDelete) && 
            (a.status === "applied" || a.status === "pending")
          ) ? dashboardStats.pendingApplications - 1 : dashboardStats.pendingApplications,
        });
      }
      
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
    }
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
      case "shortlisted":
        return "bg-amber-100 text-amber-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
      case "applied":
        return <Clock className="h-4 w-4" />;
      case "interviewing":
      case "shortlisted":
        return <User className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-500">Loading dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
            <p className="mt-2 text-lg text-gray-600">
              {userType === "applicant" 
                ? "View your applications and recent job opportunities" 
                : "Manage your job postings and applicants"}
            </p>
          </header>
          
          <DashboardStats userType={userType || "applicant"} stats={dashboardStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {userType === "applicant" ? (
                // Applicant View
                <Tabs defaultValue="applications" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="applications">My Applications</TabsTrigger>
                    <TabsTrigger value="recentJobs">Recent Jobs</TabsTrigger>
            </TabsList>
            
                  <TabsContent value="applications" className="space-y-4">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <div className="px-6 py-4 border-b">
                        <h3 className="font-semibold text-lg">Recent Applications</h3>
                      </div>
                      
                      <div className="divide-y">
                        {applications.length === 0 ? (
                          <div className="px-6 py-8 text-center">
                            <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                            <Link to="/jobs">
                              <Button variant="outline">Browse Jobs</Button>
                          </Link>
                          </div>
                        ) : (
                          applications.map((application) => (
                            <div key={application.id} className="p-6 hover:bg-gray-50">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-4 md:mb-0">
                                  <Link 
                                    to={`/jobs/${application.id}`}
                                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    {application.jobTitle}
                                  </Link>
                                  <div className="flex items-center mt-1 text-gray-600">
                                    <Building className="h-4 w-4 mr-1" />
                                    <span className="text-sm">{application.company}</span>
                                  </div>
                                  <div className="mt-2 flex items-center space-x-4">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <CalendarDays className="h-4 w-4 mr-1" />
                                      Applied {formatDate(application.appliedDate)}
                                    </div>
                                    {application.deadline && (
                                    <div className="flex items-center text-sm text-gray-500">
                                      <Clock className="h-4 w-4 mr-1" />
                                      Closes {formatDate(application.deadline)}
                                    </div>
                                    )}
                                  </div>
                        </div>
                        
                              <div className="flex items-center space-x-2">
                                  <Badge className={`flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                                    {getStatusIcon(application.status)}
                                    <span className="capitalize">
                                      {application.status === "interviewing" ? "Interview" : application.status}
                                    </span>
                                  </Badge>
                                  <div className="flex space-x-2">
                                    <Link to={`/applications/${application.id}`} className="text-gray-500 hover:text-gray-700">
                                      <Button variant="ghost" size="sm">
                                        <ChevronRight className="h-5 w-5" />
                                      </Button>
                                    </Link>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => handleDeleteClick(application.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                        </div>
                  </TabsContent>
                  
                  <TabsContent value="recentJobs" className="space-y-4">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <div className="px-6 py-4 border-b">
                        <h3 className="font-semibold text-lg">Recent Job Opportunities</h3>
                      </div>
                      
                      {recentJobs.length === 0 ? (
                        <div className="px-6 py-8 text-center">
                          <p className="text-gray-500 mb-4">No recent job listings available.</p>
                          <Link to="/jobs">
                            <Button variant="outline">Browse All Jobs</Button>
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-4">
                          {recentJobs.map((job) => (
                            <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <h4 className="font-medium text-blue-600 hover:text-blue-800">
                                <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                              </h4>
                              
                              <div className="mt-2 space-y-1 text-sm text-gray-600">
                                {job.category && (
                                <div className="flex items-center">
                                    <Briefcase className="h-3.5 w-3.5 mr-1" />
                                    <span>{job.category}</span>
                        </div>
                                )}
                              <div className="flex items-center">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{job.location}</span>
                                </div>
                                {job.salary && (
                                <div className="flex items-center">
                                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                                    <span>${job.salary.toLocaleString()}/year</span>
                                </div>
                                )}
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs text-gray-500">
                                  Posted {formatDate(job.date_of_posting || "")}
                                </span>
                                <Link to={`/jobs/${job.id}`}>
                                <Button size="sm" className="px-3">Apply Now</Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              ) : (
                // Recruiter View
                <Tabs defaultValue="jobs" className="w-full">
                  <TabsList className="mb-6">
                    <TabsTrigger value="jobs">My Job Postings</TabsTrigger>
                    <TabsTrigger value="applicants">Recent Applicants</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="jobs" className="space-y-4">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <div className="px-6 py-4 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Active Job Postings</h3>
                        <Link to="/post-job">
                          <Button size="sm">Post New Job</Button>
                        </Link>
                      </div>
                      
                      <div className="divide-y">
                        {postedJobs.length === 0 ? (
                          <div className="px-6 py-8 text-center">
                            <p className="text-gray-500 mb-4">You haven't posted any jobs yet.</p>
                            <Link to="/post-job">
                              <Button variant="outline">Post Your First Job</Button>
                          </Link>
                          </div>
                        ) : (
                          postedJobs.map((job) => (
                            <div key={job.id} className="p-6 hover:bg-gray-50">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-4 md:mb-0">
                                  <Link 
                                    to={`/jobs/${job.id}`}
                                    className="text-lg font-medium text-blue-600 hover:text-blue-800"
                                  >
                                    {job.title}
                                  </Link>
                                  <div className="flex flex-wrap items-center mt-1 space-x-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="h-4 w-4 mr-1" />
                                      <span>{job.location || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Briefcase className="h-4 w-4 mr-1" />
                                      <span>{job.job_type}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                      <Users className="h-4 w-4 mr-1" />
                                      <span>{job.total_applicants || 0} Applicants</span>
                                    </div>
                                  </div>
                        </div>
                        
                                <div className="flex items-center space-x-2">
                                  <Link to={`/job-applicants/${job.id}`}>
                                    <Button variant="outline" size="sm">
                                      View Applicants
                                    </Button>
                                  </Link>
                                </div>
                        </div>
                      </div>
                          ))
                  )}
                </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="applicants" className="space-y-4">
                    <div className="bg-white rounded-lg border shadow-sm">
                      <div className="px-6 py-4 border-b">
                        <h3 className="font-semibold text-lg">Recent Applicants</h3>
                      </div>
                      
                      <div className="divide-y">
                        {!recruiterDashboard || !recruiterDashboard.recentApplications || recruiterDashboard.recentApplications.length === 0 ? (
                          <div className="px-6 py-8 text-center">
                            <p className="text-gray-500">No recent applications.</p>
                      </div>
                    ) : (
                          applicants.map((applicant) => (
                            <div key={applicant.id} className="p-6 hover:bg-gray-50">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="mb-4 md:mb-0">
                          <Link 
                                    to={`/applicant-profile/${applicant.id}`}
                                    className="text-lg font-medium text-gray-900 hover:text-gray-700"
                                  >
                                    {applicant.name}
                                  </Link>
                                  <div className="flex flex-wrap items-center mt-1 space-x-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                      <CalendarDays className="h-4 w-4 mr-1" />
                                      Applied {formatDate(applicant.appliedDate)}
                                    </div>
                                    {applicant.jobTitle && (
                                      <div className="flex items-center text-sm text-gray-600">
                                        <Briefcase className="h-4 w-4 mr-1" />
                                        {applicant.jobTitle}
                                      </div>
                                    )}
                                  </div>
                            </div>
                                
                            <div className="flex items-center">
                                  <Badge className={`flex items-center space-x-1 ${getStatusColor(applicant.status)}`}>
                                    {getStatusIcon(applicant.status)}
                                    <span className="capitalize">{applicant.status}</span>
                                  </Badge>
                                  <Link to={`/applicant-profile/${applicant.id}`} className="ml-4">
                                    <Button variant="ghost" size="sm">
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                    )}
                  </div>
            
            {/* Sidebar - 1/3 width on large screens */}
            <div className="space-y-6">
              {/* Notifications */}
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                  )}
                </div>
                
                <div className="divide-y">
                  {notifications.length === 0 ? (
                    <div className="px-6 py-8 text-center">
                      <Bell className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No new notifications.</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(notification.time)}</p>
                      </div>
                    ))
                  )}
                </div>
                  </div>
                  
              {/* Quick Links */}
              <div className="bg-white rounded-lg border shadow-sm">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-semibold text-lg">Quick Links</h3>
                </div>
                
                <div className="p-4">
                  <nav className="space-y-2">
                    {userType === "applicant" ? (
                      <>
                        <Link to="/jobs" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Briefcase className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Browse Jobs</span>
                        </Link>
                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Inbox className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Messages</span>
                        </Link>
                        <Link to="/profile" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <User className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Edit Profile</span>
                        </Link>
                        <Link to="/profile" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Settings className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Account Settings</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/post-job" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Briefcase className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Post a Job</span>
                        </Link>
                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Bookmark className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Manage Jobs</span>
                        </Link>
                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Inbox className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Messages</span>
                        </Link>
                        <Link to="#" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Building className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Company Profile</span>
                        </Link>
                        <Link to="/profile" className="flex items-center p-2 rounded-md hover:bg-gray-100">
                          <Settings className="h-5 w-5 mr-3 text-gray-500" />
                          <span>Account Settings</span>
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
                        </div>
                      </div>
                    </div>
                  </div>
      </main>
      
      <Footer />

      {/* Delete Application Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
