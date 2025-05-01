import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, Building, MapPin, Calendar, DollarSign, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { JobData } from "@/components/jobs/JobCard";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    job_type: "full-time",
    deadline: "",
    duration: "",
    description: "",
    requirements: "",
    skills: [] as string[],
    benefits: ""
  });

  useEffect(() => {
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
      setJobData({
        title: mockJob.title,
        company: mockJob.company || "",
        location: mockJob.location || "",
        salary: mockJob.salary || "",
        job_type: mockJob.job_type,
        deadline: mockJob.deadline,
        duration: mockJob.duration || "",
        description: "We are looking for a skilled Senior Frontend Developer to join our team...",
        requirements: "- 5+ years of experience in frontend development\n- Strong knowledge of React and TypeScript\n- Experience with modern frontend tools and frameworks",
        skills: mockJob.skills || [],
        benefits: "- Competitive salary\n- Health insurance\n- Flexible work hours\n- Remote work options"
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      setJobData(prev => ({
        ...prev,
        skills: [...prev.skills, e.currentTarget.value.trim()]
      }));
      e.currentTarget.value = '';
    }
  };

  const removeSkill = (index: number) => {
    setJobData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call to update job
    setTimeout(() => {
      setSaving(false);
      navigate('/dashboard');
    }, 1500);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Job Posting</h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={jobData.title}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={jobData.company}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={jobData.location}
                    onChange={handleChange}
                    className="input-field"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="job_type" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type
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
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    id="salary"
                    name="salary"
                    value={jobData.salary}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g. $50,000 - $70,000"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                    Application Deadline
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
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={jobData.description}
                    onChange={handleChange}
                    className="input-field h-32"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={jobData.requirements}
                    onChange={handleChange}
                    className="input-field h-32"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                    Required Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {jobData.skills.map((skill, index) => (
                      <Badge key={index} className="bg-primary/10 text-primary border-0 flex items-center">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="ml-1 hover:text-primary/80"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <input
                    type="text"
                    id="skills"
                    onKeyDown={handleSkillChange}
                    className="input-field"
                    placeholder="Type a skill and press Enter"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-1">
                    Benefits
                  </label>
                  <textarea
                    id="benefits"
                    name="benefits"
                    value={jobData.benefits}
                    onChange={handleChange}
                    className="input-field h-32"
                    required
                  />
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t flex justify-end">
                <Button
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditJob; 