import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase,
  Share2,
  Bookmark,
  AlertCircle,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobService } from "@/services";

// Define the exact API response structure
interface ApiJob {
  id: number;
  recruiter_id: number;
  title: string;
  category: string;
  location: string;
  max_applicants: number;
  max_positions: number;
  active_applications: number;
  accepted_candidates: number;
  date_of_posting: string;
  deadline: string | null;
  job_type: string;
  duration: number;
  salary: number;
}

// Define the available job types for better context
const JOB_TYPES = {
  "full-time": "Full-time position with regular hours",
  "part-time": "Part-time position with flexible hours",
  "contract": "Contract position for a specific period",
  "internship": "Internship opportunity to gain experience",
  "freelance": "Freelance work with project-based compensation",
  "temporary": "Temporary position to fill immediate needs"
};

// Define the available categories for better context
const CATEGORIES = {
  "IT": "Information Technology - Software development, system administration, IT support, etc.",
  "Finance": "Finance - Accounting, financial analysis, banking, etc.",
  "Management": "Management - Project management, team leadership, etc.",
  "Marketing": "Marketing - Digital marketing, market research, brand management, etc.",
  "HR": "Human Resources - Recruiting, HR management, training, etc.",
  "Sales": "Sales - Account management, business development, etc.",
  "Engineering": "Engineering - Various engineering disciplines, etc.",
  "Other": "Other professional categories"
};

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<ApiJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [sop, setSop] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
    
    // Fetch job details from API
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await jobService.getJobById(id as string);
        
        // Use the data directly without transformation
        const apiJob = response.data as ApiJob;
        setJob(apiJob);
        
      } catch (err: any) {
        console.error("Error fetching job details:", err);
        setError(`Failed to load job details. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setError(null); // Clear any previous errors
    
    // Use direct database call as a last resort fallback
    // This is a temporary solution until the regular API is fixed
    try {
      // Get user data from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        toast.error("You must be logged in to apply. Please sign in and try again.");
        setTimeout(() => navigate("/auth?type=login"), 2000);
        return;
      }
      
      let user;
      try {
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("Invalid user data:", e);
        toast.error("Your login session is corrupted. Please sign in again.");
        setTimeout(() => navigate("/auth?type=login"), 2000);
        return;
      }
      
      if (!user || !user.id) {
        toast.error("User information is missing. Please sign in again.");
        setTimeout(() => navigate("/auth?type=login"), 2000);
        return;
      }
      
      console.log("Applying for job with user:", user.id);
      
      // Make API call with detailed error reporting
      try {
        await jobService.applyToJob({
          jobId: id as string,
          resumeUrl: "placeholder",
          coverLetter: sop
        });
        
        toast.success("Application submitted successfully!");
        setSop("");
        
        // Redirect to dashboard page with applications tab selected
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } catch (apiError: any) {
        console.error("API error:", apiError);
        
        // Handle different error scenarios with helpful messages
        if (apiError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response error data:", apiError.response.data);
          console.error("Response error status:", apiError.response.status);
          
          if (apiError.response.status === 401) {
            toast.error("Authentication failed. Please sign in again.");
            setTimeout(() => navigate("/auth?type=login"), 2000);
          } else if (apiError.response.status === 409) {
            toast.error("You have already applied to this job.");
          } else if (apiError.response.status === 404) {
            toast.error("This job is no longer available.");
          } else if (apiError.response.data && apiError.response.data.message) {
            // Check specifically for max applicants error message
            if (apiError.response.data.message.includes("Maximum number of applicants reached")) {
              toast.error("This job has reached its maximum number of applicants.");
              
              // Update job state to reflect the filled status
              setJob(prev => prev ? {...prev, active_applications: prev.max_applicants} : prev);
            } else {
              toast.error(apiError.response.data.message);
            }
          } else {
            toast.error("Failed to submit application. Please try again later.");
          }
        } else if (apiError.request) {
          // The request was made but no response was received
          console.error("No response received:", apiError.request);
          toast.error("No response from server. Please check your connection and try again.");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Request setup error:", apiError.message);
          toast.error("Failed to submit application: " + apiError.message);
        }
      }
    } catch (err: any) {
      console.error("Application process error:", err);
      toast.error("Application process failed: " + (err.message || "Unknown error"));
    } finally {
      setApplying(false);
    }
  };
  
  // Helper function to capitalize first letter
  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Not specified";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days left
  const calculateDaysLeft = (deadlineDate?: string | null) => {
    if (!deadlineDate) return null;
    
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  // Format salary
  const formatSalary = (salary?: number | string) => {
    if (salary === undefined) return "Not specified";
    
    const numericValue = typeof salary === 'string' 
      ? parseInt(salary.replace(/[^0-9]/g, '')) 
      : salary;
      
    return `PKR ${numericValue.toLocaleString()}`;
  };
  
  // Get job type description
  const getJobTypeDescription = (jobType: string): string => {
    const normalizedType = jobType.toLowerCase();
    return JOB_TYPES[normalizedType as keyof typeof JOB_TYPES] || 
           `${capitalizeFirstLetter(jobType)} position`;
  };
  
  // Get category description
  const getCategoryDescription = (category: string): string => {
    return CATEGORIES[category as keyof typeof CATEGORIES] || 
           `${category} - Professional work in the ${category} field`;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-8">{error || "The job you're looking for doesn't exist or has been removed."}</p>
          <Link to="/jobs" className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md">Browse All Jobs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link to="/jobs" className="text-blue-500 hover:text-blue-600 flex items-center">
              ← Back to Jobs
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    
                    {job.category && (
                      <div className="flex items-center mt-2 text-gray-700">
                        <Building className="h-4 w-4 mr-1.5 text-blue-500" />
                        <span>{job.category}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
                      title="Save Job"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100"
                      title="Share Job"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {job.location && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                    <span>{capitalizeFirstLetter(job.job_type)}</span>
                  </div>
                  
                  {job.duration && (
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{job.duration} {job.duration === 1 ? 'month' : 'months'}</span>
                    </div>
                  )}
                  
                  {job.salary && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{formatSalary(job.salary)}</span>
                    </div>
                  )}
                  
                  {job.deadline ? (
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Apply by {formatDate(job.deadline)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-700">
                      <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                      <span>No deadline specified (Open until filled)</span>
                    </div>
                  )}
                  
                  {job.max_positions && (
                    <div className="flex items-center text-gray-700">
                      <Users className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{job.max_positions} {job.max_positions === 1 ? 'position' : 'positions'}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Information</h2>
                <div className="prose max-w-none">
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-700">
                      <strong className="text-blue-700">{job.title}</strong> at <strong className="text-blue-700">Company</strong> in <strong className="text-blue-700">{job.location}</strong>
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {getJobTypeDescription(job.job_type)} • {formatSalary(job.salary)} • {job.duration} {job.duration === 1 ? 'month' : 'months'} duration
                    </p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">About This Role</h3>
                    <p>
                      This {job.job_type} position is based in {job.location} and is part of our {job.category} department. 
                    </p>
                    {job.max_positions > 1 && (
                      <p className="mt-2">
                        We're currently looking to fill {job.max_positions} positions for this role.
                      </p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Category Information</h3>
                    <p>{getCategoryDescription(job.category)}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Compensation & Duration</h3>
                    <p>
                      This position offers a salary of {formatSalary(job.salary)} for a duration of {job.duration} {job.duration === 1 ? 'month' : 'months'}.
                    </p>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2 mt-6">Application Process</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Maximum of {job.max_applicants} applications will be accepted</li>
                    <li>Currently {job.active_applications} active applications</li>
                    <li>{job.accepted_candidates} candidates have been accepted so far</li>
                    {job.deadline ? (
                      <li>Applications must be submitted by {formatDate(job.deadline)}</li>
                    ) : (
                      <li>No deadline specified - position open until filled</li>
                    )}
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Skills & Qualifications</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-blue-100 text-blue-800 border-0 py-1 px-3">
                    {job.category}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-0 py-1 px-3">
                    {capitalizeFirstLetter(job.job_type)}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800 border-0 py-1 px-3">
                    {job.location}
                  </Badge>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700">
                    Candidates with experience in {job.category} and a background in 
                    {job.job_type === 'full-time' ? ' professional work environments' : 
                     job.job_type === 'part-time' ? ' flexible work arrangements' :
                     job.job_type === 'contract' ? ' contract-based projects' :
                     job.job_type === 'internship' ? ' educational or training settings' : 
                     ' relevant work settings'} are encouraged to apply.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center border-b pb-3">
                    <User className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-500">Recruiter</p>
                      <p className="font-medium">Hiring Manager</p>
                    </div>
                  </div>
                
                  {job.date_of_posting && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Posted On</p>
                      <p className="font-medium">{formatDate(job.date_of_posting)}</p>
                    </div>
                  )}
                  
                  {job.deadline ? (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Deadline</p>
                      <div className="font-medium flex items-center">
                        {formatDate(job.deadline)}
                        {calculateDaysLeft(job.deadline) !== null && calculateDaysLeft(job.deadline) > 0 ? (
                          <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full text-xs">
                            {calculateDaysLeft(job.deadline)} days left
                          </span>
                        ) : (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Deadline</p>
                      <div className="font-medium flex items-center">
                        <span>Open until filled</span>
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                          Ongoing
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Job Type</p>
                    <p className="font-medium">{capitalizeFirstLetter(job.job_type)}</p>
                  </div>
                  
                  {job.salary !== undefined && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Salary</p>
                      <p className="font-medium">{formatSalary(job.salary)}</p>
                    </div>
                  )}
                  
                  {job.max_applicants && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Applications</p>
                      <p className="font-medium flex items-center">
                        {job.active_applications || 0}/{job.max_applicants} applicants
                        {job.active_applications >= job.max_applicants && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                            Maximum reached
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <Button disabled className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        Apply Now
                      </Button>
                      <p className="text-sm text-center text-gray-500">
                        Please <Link to="/auth?type=login" className="text-blue-500 hover:text-blue-600">sign in</Link> to apply for this job
                      </p>
                    </>
                  ) : job.active_applications >= job.max_applicants ? (
                    <>
                      <Button disabled className="w-full bg-gray-300 text-gray-600 cursor-not-allowed">
                        Applications Closed
                      </Button>
                      <p className="text-sm text-center text-gray-500">
                        This job has reached its maximum number of applicants.
                      </p>
                    </>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label htmlFor="sop" className="block text-sm font-medium text-gray-700 mb-1">
                          Statement of Purpose (optional)
                        </label>
                        <textarea
                          id="sop"
                          rows={4}
                          placeholder="Why are you a good fit for this role?"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                          value={sop}
                          onChange={(e) => setSop(e.target.value)}
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-500">
                          You can optionally describe why you're interested in this position.
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                        disabled={applying}
                      >
                        {applying ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Applying...
                          </span>
                        ) : (
                          "Apply Now"
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobDetails;
