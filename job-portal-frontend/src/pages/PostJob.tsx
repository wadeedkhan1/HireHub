import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import api from "@/services/api";
import authService from "@/services/authService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface JobPostResponse {
  message: string;
  job: {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    info: string;
    serverStatus: number;
    warningStatus: number;
    changedRows: number;
  };
}

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [responseData, setResponseData] = useState<JobPostResponse | null>(null);
  
  const [jobData, setJobData] = useState({
    title: "",
    category: "IT",
    location: "Remote",
    max_applicants: 10,
    max_positions: 2,
    job_type: "full-time",
    duration: 12,
    salary: 80000,
    deadline: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!jobData.title || !jobData.location || !jobData.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setLoading(true);
    
    try {
      // Get the current user ID
      const user = authService.getCurrentUser();
      
      if (!user) {
        toast.error("You must be logged in to post a job");
        navigate("/auth?type=login");
        return;
      }
      
      // Prepare the job data including user_id
      const postData = {
        user_id: user.id,
        ...jobData
      };
      
      // Make the API call
      const response = await api.post<JobPostResponse>('/jobs', postData);
      
      setResponseData(response.data);
      setShowDialog(true);
      toast.success("Job posted successfully!");
    } catch (error: any) {
      console.error("Error posting job:", error);
      toast.error(error.response?.data?.message || "Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a New Job</h1>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={jobData.title}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. Senior Frontend Developer"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={jobData.category}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="IT">IT</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Finance">Finance</option>
                      <option value="HR">HR</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={jobData.location}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. San Francisco, CA or Remote"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Job Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="job_type"
                      name="job_type"
                      value={jobData.job_type}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="full-time">Full-Time</option>
                      <option value="part-time">Part-Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                      <option value="temporary">Temporary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (months) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={jobData.duration}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. 12"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                      Salary (annual) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                      <input
                        type="number"
                        id="salary"
                        name="salary"
                        value={jobData.salary}
                        onChange={handleChange}
                        className="input-field pl-7"
                        placeholder="e.g. 80000"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Capacity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="max_applicants" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Applicants <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="max_applicants"
                      name="max_applicants"
                      value={jobData.max_applicants}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="max_positions" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Positions <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="max_positions"
                      name="max_positions"
                      value={jobData.max_positions}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                      Application Deadline <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="deadline"
                      name="deadline"
                      value={jobData.deadline}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t flex justify-end">
                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Posting...
                      </span>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Job Posted Successfully
            </DialogTitle>
            <DialogDescription>
              Your job has been posted and is now available for applicants.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium mb-2">Job Details:</h4>
            {responseData && (
              <div className="text-sm">
                <p className="mb-1"><span className="font-medium">Job ID:</span> {responseData.job.insertId}</p>
                <p className="mb-1"><span className="font-medium">Status:</span> {responseData.message}</p>
                <p className="mb-1"><span className="font-medium">Title:</span> {jobData.title}</p>
                <p className="mb-1"><span className="font-medium">Location:</span> {jobData.location}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="sm:justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDialog(false);
                navigate(-1);
              }}
            >
              Return to Dashboard
            </Button>
            <Button 
              onClick={() => {
                setShowDialog(false);
                setJobData({
                  title: "",
                  category: "IT",
                  location: "Remote",
                  max_applicants: 10,
                  max_positions: 2,
                  job_type: "full-time",
                  duration: 12,
                  salary: 80000,
                  deadline: ""
                });
              }}
            >
              Post Another Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default PostJob;
