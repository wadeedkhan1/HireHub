
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
  MapPin
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardStats from "@/components/dashboard/DashboardStats";
import JobCard, { JobData } from "@/components/jobs/JobCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: "pending" | "interviewing" | "accepted" | "rejected";
  deadline: string;
}

interface Applicant {
  id: number;
  name: string;
  appliedDate: string;
  jobTitle: string;
  status: "pending" | "interviewing" | "accepted" | "rejected";
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"jobseeker" | "recruiter" | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mock data
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobData[]>([]);
  const [postedJobs, setPostedJobs] = useState<JobData[]>([]);
  
  // Check authentication
  useEffect(() => {
    // Get user from localStorage (will be replaced with proper auth)
    const userJson = localStorage.getItem("user");
    
    if (!userJson) {
      // Redirect to login if not logged in
      navigate("/auth?type=login");
      return;
    }
    
    try {
      const user = JSON.parse(userJson);
      setUserType(user.userType || "jobseeker");
      
      // Load mock data
      setTimeout(() => {
        // Mock notifications
        setNotifications([
          {
            id: 1,
            message: "Your application for Frontend Developer at TechCorp has been viewed",
            time: "2 hours ago",
            read: false
          },
          {
            id: 2,
            message: "New job matching your profile: UX Designer at DesignHub",
            time: "1 day ago",
            read: false
          },
          {
            id: 3,
            message: "You've been invited to interview for Senior Frontend Developer at TechCorp",
            time: "2 days ago",
            read: true
          }
        ]);
        
        // Mock applications
        setApplications([
          {
            id: 1,
            jobTitle: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            appliedDate: "2025-04-05",
            status: "interviewing",
            deadline: "2025-06-15"
          },
          {
            id: 2,
            jobTitle: "UX/UI Designer",
            company: "DesignHub",
            appliedDate: "2025-04-02",
            status: "pending",
            deadline: "2025-06-25"
          },
          {
            id: 3,
            jobTitle: "Full Stack Developer",
            company: "WebWizards",
            appliedDate: "2025-03-28",
            status: "rejected",
            deadline: "2025-05-30"
          },
          {
            id: 4,
            jobTitle: "React Developer",
            company: "AppMatrix",
            appliedDate: "2025-03-25",
            status: "accepted",
            deadline: "2025-05-20"
          }
        ]);
        
        // Mock applicants for recruiters
        setApplicants([
          {
            id: 1,
            name: "Jane Smith",
            appliedDate: "2025-04-05",
            jobTitle: "Senior Frontend Developer",
            status: "pending"
          },
          {
            id: 2,
            name: "Mike Johnson",
            appliedDate: "2025-04-02",
            jobTitle: "Senior Frontend Developer",
            status: "interviewing"
          },
          {
            id: 3,
            name: "Sarah Williams",
            appliedDate: "2025-03-30",
            jobTitle: "UX Designer",
            status: "rejected"
          },
          {
            id: 4,
            name: "David Lee",
            appliedDate: "2025-03-28",
            jobTitle: "Backend Developer",
            status: "accepted"
          },
          {
            id: 5,
            name: "Emily Chen",
            appliedDate: "2025-04-06",
            jobTitle: "UX Designer",
            status: "pending"
          }
        ]);
        
        // Mock saved jobs
        setSavedJobs([
          {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            salary: "$120,000 - $150,000",
            job_type: "Full-Time",
            deadline: "2025-06-15"
          },
          {
            id: 3,
            title: "UX/UI Designer",
            company: "DesignHub",
            location: "Remote",
            salary: "$90,000 - $120,000",
            job_type: "Full-Time",
            deadline: "2025-06-25"
          }
        ]);
        
        // Mock posted jobs for recruiters
        setPostedJobs([
          {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            job_type: "Full-Time",
            deadline: "2025-06-15",
          },
          {
            id: 2,
            title: "UX Designer",
            company: "TechCorp Inc.",
            location: "San Francisco, CA",
            job_type: "Full-Time",
            deadline: "2025-07-01",
          },
          {
            id: 3,
            title: "Backend Developer",
            company: "TechCorp Inc.",
            location: "Remote",
            job_type: "Full-Time",
            deadline: "2025-06-20",
          }
        ]);
        
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      navigate("/auth?type=login");
    }
  }, [navigate]);
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-0";
      case "interviewing":
        return "bg-blue-100 text-blue-800 border-0";
      case "accepted":
        return "bg-green-100 text-green-800 border-0";
      case "rejected":
        return "bg-red-100 text-red-800 border-0";
      default:
        return "bg-gray-100 text-gray-800 border-0";
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "interviewing":
        return <CalendarDays className="h-4 w-4" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
          
          <DashboardStats userType={userType || "jobseeker"} />
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="notifications">
                Notifications
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-xs text-white">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </TabsTrigger>
              {userType === "jobseeker" ? (
                <>
                  <TabsTrigger value="applications">Applications</TabsTrigger>
                  <TabsTrigger value="saved-jobs">Saved Jobs</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="applicants">Applicants</TabsTrigger>
                  <TabsTrigger value="posted-jobs">Posted Jobs</TabsTrigger>
                </>
              )}
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {userType === "jobseeker" ? (
                    <>
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold text-gray-900">Recent Applications</h2>
                          <Link to="/applications" className="text-primary text-sm font-medium hover:text-primary/80">
                            View All
                          </Link>
                        </div>
                        
                        <div className="space-y-4">
                          {applications.slice(0, 3).map((application) => (
                            <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center">
                                <Building className="h-10 w-10 text-gray-400 mr-3" />
                                <div>
                                  <h3 className="font-medium">{application.jobTitle}</h3>
                                  <p className="text-sm text-gray-500">{application.company}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge className={getStatusColor(application.status)}>
                                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  Applied on {formatDate(application.appliedDate)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold text-gray-900">Recommended Jobs</h2>
                          <Link to="/jobs" className="text-primary text-sm font-medium hover:text-primary/80">
                            View More
                          </Link>
                        </div>
                        
                        <div className="space-y-4">
                          <JobCard
                            job={{
                              id: 5,
                              title: "React Developer",
                              company: "AppMatrix",
                              location: "Remote",
                              salary: "$100,000 - $130,000",
                              job_type: "Full-Time",
                              deadline: "2025-07-15"
                            }}
                            compact
                          />
                          <JobCard
                            job={{
                              id: 6,
                              title: "Frontend Lead",
                              company: "WebSolutions",
                              location: "New York, NY",
                              salary: "$140,000 - $160,000",
                              job_type: "Full-Time",
                              deadline: "2025-06-30"
                            }}
                            compact
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold text-gray-900">Recent Applicants</h2>
                          <Link to="/applicants" className="text-primary text-sm font-medium hover:text-primary/80">
                            View All
                          </Link>
                        </div>
                        
                        <div className="space-y-4">
                          {applicants.slice(0, 3).map((applicant) => (
                            <div key={applicant.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                              <div className="flex items-center">
                                <div className="bg-gray-200 rounded-full p-2.5 mr-3">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                  <h3 className="font-medium">{applicant.name}</h3>
                                  <p className="text-sm text-gray-500">Applied for {applicant.jobTitle}</p>
                                </div>
                              </div>
                              <div className="flex flex-col items-end">
                                <Badge className={getStatusColor(applicant.status)}>
                                  {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                                </Badge>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(applicant.appliedDate)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold text-gray-900">Your Active Job Postings</h2>
                          <Link to="/post-job" className="text-primary text-sm font-medium hover:text-primary/80">
                            Post New Job
                          </Link>
                        </div>
                        
                        <div className="space-y-4">
                          {postedJobs.slice(0, 2).map((job) => (
                            <JobCard key={job.id} job={job} compact />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <div>
                  <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-bold text-gray-900">Recent Notifications</h2>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Mark all as read
                      </button>
                    </div>
                    
                    {notifications.length > 0 ? (
                      <div className="space-y-4">
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-md ${notification.read ? 'bg-white' : 'bg-primary/5 border border-primary/20'}`}
                          >
                            <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                          </div>
                        ))}
                        
                        <div className="pt-2">
                          <Link 
                            to="#" 
                            className="text-sm text-primary hover:text-primary/80 flex items-center justify-center"
                          >
                            View all notifications
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No new notifications</p>
                    )}
                    
                    {userType === "jobseeker" && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                          <Link 
                            to="/jobs" 
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">Browse Jobs</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                          <Link 
                            to="/profile" 
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">Update Profile</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    )}
                    
                    {userType === "recruiter" && (
                      <div className="mt-6 pt-6 border-t">
                        <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                        <div className="space-y-2">
                          <Link 
                            to="/post-job" 
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">Post New Job</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                          <Link 
                            to="/profile" 
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                          >
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-sm">Update Profile</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">All Notifications</h2>
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-primary hover:text-primary/80"
                  >
                    Mark all as read
                  </button>
                </div>
                
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-md ${notification.read ? 'bg-white border' : 'bg-primary/5 border border-primary/20'}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="bg-primary/10 rounded-full p-2 mr-3">
                              <Bell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className={`${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 bg-primary rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
                    <p className="text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {/* Applications Tab (Job Seeker) */}
            {userType === "jobseeker" && (
              <TabsContent value="applications">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Your Job Applications</h2>
                    <Link to="/jobs" className="text-primary hover:text-primary/80 text-sm">
                      Browse More Jobs
                    </Link>
                  </div>
                  
                  {applications.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Job Title</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Company</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Applied Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applications.map((application) => (
                            <tr key={application.id} className="border-b last:border-0">
                              <td className="py-4 px-4">
                                <div className="font-medium">{application.jobTitle}</div>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{application.company}</td>
                              <td className="py-4 px-4 text-gray-600">{formatDate(application.appliedDate)}</td>
                              <td className="py-4 px-4">
                                <Badge className={`flex items-center gap-1 ${getStatusColor(application.status)}`}>
                                  {getStatusIcon(application.status)}
                                  <span>{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <Link 
                                  to={`/applications/${application.id}`} 
                                  className="text-primary hover:text-primary/80 text-sm"
                                >
                                  View Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Inbox className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No applications yet</h3>
                      <p className="text-gray-500 mb-6">You haven't applied to any jobs yet.</p>
                      <Link to="/jobs" className="btn-primary">
                        Browse Jobs
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
            
            {/* Saved Jobs Tab (Job Seeker) */}
            {userType === "jobseeker" && (
              <TabsContent value="saved-jobs">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Your Saved Jobs</h2>
                  </div>
                  
                  {savedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bookmark className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No saved jobs</h3>
                      <p className="text-gray-500 mb-6">You haven't saved any jobs yet.</p>
                      <Link to="/jobs" className="btn-primary">
                        Browse Jobs
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
            
            {/* Applicants Tab (Recruiter) */}
            {userType === "recruiter" && (
              <TabsContent value="applicants">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Job Applicants</h2>
                  </div>
                  
                  {applicants.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Applicant</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Job Position</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Applied Date</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicants.map((applicant) => (
                            <tr key={applicant.id} className="border-b last:border-0">
                              <td className="py-4 px-4">
                                <div className="font-medium">{applicant.name}</div>
                              </td>
                              <td className="py-4 px-4 text-gray-600">{applicant.jobTitle}</td>
                              <td className="py-4 px-4 text-gray-600">{formatDate(applicant.appliedDate)}</td>
                              <td className="py-4 px-4">
                                <Badge className={`flex items-center gap-1 ${getStatusColor(applicant.status)}`}>
                                  {getStatusIcon(applicant.status)}
                                  <span>{applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}</span>
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <Link 
                                  to={`/applicants/${applicant.id}`} 
                                  className="text-primary hover:text-primary/80 text-sm"
                                >
                                  View Profile
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No applicants yet</h3>
                      <p className="text-gray-500 mb-6">You don't have any applicants for your job postings.</p>
                      <Link to="/post-job" className="btn-primary">
                        Post a New Job
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
            
            {/* Posted Jobs Tab (Recruiter) */}
            {userType === "recruiter" && (
              <TabsContent value="posted-jobs">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Your Posted Jobs</h2>
                    <Link to="/post-job" className="btn-primary">
                      Post New Job
                    </Link>
                  </div>
                  
                  {postedJobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                      {postedJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{job.title}</h3>
                              <p className="text-gray-600">{job.company}</p>
                              <div className="flex items-center mt-2">
                                <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                <span className="text-sm text-gray-600">{job.location}</span>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-0">
                              {job.job_type}
                            </Badge>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              <Badge className="bg-primary/10 text-primary border-0 mr-2">
                                24 applications
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Deadline: {formatDate(job.deadline)}
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Link to={`/jobs/${job.id}/applicants`} className="btn-primary text-sm px-3 py-2">
                                View Applicants
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs posted</h3>
                      <p className="text-gray-500 mb-6">You haven't posted any jobs yet.</p>
                      <Link to="/post-job" className="btn-primary">
                        Post a New Job
                      </Link>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
            
            {/* Settings Tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            defaultChecked
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                            Email Notifications
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive email notifications for application updates and new job matches.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="job-alerts"
                            type="checkbox"
                            defaultChecked
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="job-alerts" className="text-sm font-medium text-gray-700">
                            Job Alerts
                          </label>
                          <p className="text-xs text-gray-500">
                            Get notified when new jobs matching your profile are posted.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="application-updates"
                            type="checkbox"
                            defaultChecked
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="application-updates" className="text-sm font-medium text-gray-700">
                            Application Status Updates
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive updates when the status of your application changes.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="marketing"
                            type="checkbox"
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="marketing" className="text-sm font-medium text-gray-700">
                            Marketing Communications
                          </label>
                          <p className="text-xs text-gray-500">
                            Receive tips, trends, and updates from HireHub.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t">
                    <h3 className="text-md font-medium text-gray-900 mb-4">Privacy Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="profile-visibility"
                            type="checkbox"
                            defaultChecked
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="profile-visibility" className="text-sm font-medium text-gray-700">
                            Profile Visibility
                          </label>
                          <p className="text-xs text-gray-500">
                            Allow recruiters to find and view your profile.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="contact-info"
                            type="checkbox"
                            defaultChecked
                            className="rounded text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor="contact-info" className="text-sm font-medium text-gray-700">
                            Contact Information
                          </label>
                          <p className="text-xs text-gray-500">
                            Show your contact information to recruiters from companies you apply to.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t flex justify-end">
                    <Button className="btn-primary">
                      Save Settings
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
