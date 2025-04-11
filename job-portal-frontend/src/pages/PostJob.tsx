
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "Full-Time",
    duration: "",
    salary_min: "",
    salary_max: "",
    max_applicants: "50",
    max_positions: "1",
    deadline: "",
    description: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkill.trim() !== "") {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill("");
    }
  };
  
  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!jobData.title || !jobData.company || !jobData.location || !jobData.deadline || !jobData.description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (skills.length === 0) {
      toast.error("Please add at least one required skill");
      return;
    }
    
    setLoading(true);
    
    // Simulate API call to post job
    setTimeout(() => {
      setLoading(false);
      toast.success("Job posted successfully!");
      navigate("/dashboard?tab=posted-jobs");
    }, 1500);
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
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={jobData.company}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. TechCorp Inc."
                      required
                    />
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
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      id="duration"
                      name="duration"
                      value={jobData.duration}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g. 6 months, 1 year, Permanent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="salary_min" className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Min
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input
                          type="number"
                          id="salary_min"
                          name="salary_min"
                          value={jobData.salary_min}
                          onChange={handleChange}
                          className="input-field pl-7"
                          placeholder="Min"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="salary_max" className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Max
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500">$</span>
                        <input
                          type="number"
                          id="salary_max"
                          name="salary_max"
                          value={jobData.salary_max}
                          onChange={handleChange}
                          className="input-field pl-7"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Capacity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="max_applicants" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Applicants
                    </label>
                    <input
                      type="number"
                      id="max_applicants"
                      name="max_applicants"
                      value={jobData.max_applicants}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="max_positions" className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Positions
                    </label>
                    <input
                      type="number"
                      id="max_positions"
                      name="max_positions"
                      value={jobData.max_positions}
                      onChange={handleChange}
                      className="input-field"
                      min="1"
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
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Required Skills</h3>
                <div>
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                    Add Skills <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="skills"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      className="input-field"
                      placeholder="Type a skill and press Enter (e.g. React, TypeScript)"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {skills.map((skill) => (
                      <div 
                        key={skill} 
                        className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center"
                      >
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1.5 text-primary hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    
                    {skills.length === 0 && (
                      <p className="text-sm text-gray-500">No skills added yet</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Job Description</h3>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={8}
                    value={jobData.description}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Provide a detailed job description, responsibilities, requirements, benefits, etc."
                    required
                  ></textarea>
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
      
      <Footer />
    </div>
  );
};

export default PostJob;
