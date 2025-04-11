
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase,
  Share2,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { JobData } from "@/components/jobs/JobCard";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [sop, setSop] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
    
    // Simulate API call to fetch job details
    setTimeout(() => {
      const mockJob: JobData = {
        id: parseInt(id || "1"),
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        salary: "$120,000 - $150,000",
        job_type: "Full-Time",
        deadline: "2025-06-15",
        duration: "Long-term",
        skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Redux"],
        createdAt: "2025-04-01"
      };
      
      setJob(mockJob);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    
    // Validate Statement of Purpose
    if (sop.trim().length < 50) {
      toast.error("Please provide a more detailed statement of purpose (at least 50 characters).");
      setApplying(false);
      return;
    }
    
    // Simulate API call to submit application
    setTimeout(() => {
      setApplying(false);
      toast.success("Application submitted successfully!");
      setSop("");
      
      // In a real app, you would redirect to applications page or show a success message
    }, 1500);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate days left
  const calculateDaysLeft = (deadlineDate: string) => {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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
  
  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 container-custom py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <p className="text-gray-600 mb-8">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn-primary">Browse All Jobs</Link>
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
          <div className="mb-6">
            <Link to="/jobs" className="text-primary hover:text-primary/80 flex items-center">
              ← Back to Jobs
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    
                    {job.company && (
                      <div className="flex items-center mt-2 text-gray-700">
                        <Building className="h-4 w-4 mr-1.5" />
                        <span>{job.company}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                      title="Save Job"
                    >
                      <Bookmark className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-gray-500 hover:text-primary rounded-full hover:bg-gray-100"
                      title="Share Job"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {job.location && (
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-700">
                    <Briefcase className="h-5 w-5 mr-2" />
                    <span>{job.job_type}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-2" />
                    <span>{job.duration}</span>
                  </div>
                  
                  {job.salary && (
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-5 w-5 mr-2" />
                      <span>{job.salary}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>Apply by {formatDate(job.deadline)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-2" />
                    <span>20 applicants</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="mb-4">
                    We are looking for a skilled Senior Frontend Developer to join our engineering team. 
                    The ideal candidate will have strong experience with React and TypeScript, and a 
                    passion for creating clean, maintainable code.
                  </p>
                  
                  <h3 className="text-lg font-medium mb-2 mt-6">Responsibilities:</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Develop new user-facing features using React.js</li>
                    <li>Build reusable components and front-end libraries for future use</li>
                    <li>Translate designs and wireframes into high quality code</li>
                    <li>Optimize components for maximum performance across a vast array of web-capable devices and browsers</li>
                    <li>Collaborate with the design team to implement visual elements</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mb-2 mt-6">Requirements:</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>5+ years of experience in frontend development</li>
                    <li>3+ years of experience with React.js</li>
                    <li>Strong proficiency in TypeScript</li>
                    <li>Experience with responsive and adaptive design</li>
                    <li>Experience with testing frameworks like Jest, React Testing Library</li>
                    <li>Knowledge of modern frontend build pipelines and tools</li>
                    <li>Experience with version control systems (Git)</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mb-2 mt-6">Benefits:</h3>
                  <ul className="list-disc pl-5 space-y-1 mb-4">
                    <li>Competitive salary</li>
                    <li>Health, dental, and vision insurance</li>
                    <li>401(k) matching</li>
                    <li>Flexible work hours and remote work options</li>
                    <li>Generous paid time off</li>
                    <li>Professional development budget</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills?.map((skill, index) => (
                    <Badge 
                      key={index} 
                      className="bg-primary/10 text-primary border-0 py-1 px-3"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div>
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Job Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Posted On</p>
                    <p className="font-medium">{formatDate(job.createdAt || "2025-04-01")}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Deadline</p>
                    <p className="font-medium">
                      {formatDate(job.deadline)} <span className="text-amber-600">({calculateDaysLeft(job.deadline)} days left)</span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Job Type</p>
                    <p className="font-medium">{job.job_type}</p>
                  </div>
                  
                  {job.salary && (
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Salary Range</p>
                      <p className="font-medium">{job.salary}</p>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {!isLoggedIn ? (
                    <>
                      <Button disabled className="w-full btn-primary">
                        Apply Now
                      </Button>
                      <p className="text-sm text-center text-gray-500">
                        Please <Link to="/auth?type=login" className="text-primary hover:text-primary/80">sign in</Link> to apply for this job
                      </p>
                    </>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div>
                        <label htmlFor="sop" className="block text-sm font-medium text-gray-700 mb-1">
                          Statement of Purpose
                        </label>
                        <textarea
                          id="sop"
                          rows={4}
                          placeholder="Why are you a good fit for this role?"
                          className="input-field"
                          value={sop}
                          onChange={(e) => setSop(e.target.value)}
                          required
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-500">
                          Briefly describe why you're interested and qualified for this position.
                        </p>
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full btn-primary"
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
