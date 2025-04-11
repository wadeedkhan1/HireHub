
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard, { JobData } from "@/components/jobs/JobCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("q") || "";
  
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: searchParam,
    location: "",
    jobType: [],
    salaryRange: [0, 200000]
  });

  // Mock jobs data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockJobs: JobData[] = [
        {
          id: 1,
          title: "Senior Frontend Developer",
          company: "TechCorp Inc.",
          location: "San Francisco, CA",
          salary: "$120,000 - $150,000",
          job_type: "Full-Time",
          deadline: "2025-06-15",
          skills: ["React", "TypeScript", "Tailwind CSS"]
        },
        {
          id: 2,
          title: "Data Scientist",
          company: "AnalyticsMax",
          location: "New York, NY",
          salary: "$110,000 - $140,000",
          job_type: "Full-Time",
          deadline: "2025-06-20",
          skills: ["Python", "Machine Learning", "SQL", "PyTorch"]
        },
        {
          id: 3,
          title: "UX/UI Designer",
          company: "DesignHub",
          location: "Remote",
          salary: "$90,000 - $120,000",
          job_type: "Full-Time",
          deadline: "2025-06-25",
          skills: ["Figma", "Adobe XD", "User Research", "Prototyping"]
        },
        {
          id: 4,
          title: "Backend Engineer",
          company: "ServerStack",
          location: "Austin, TX",
          salary: "$130,000 - $160,000",
          job_type: "Full-Time",
          deadline: "2025-06-18",
          skills: ["Node.js", "Express", "MongoDB", "AWS"]
        },
        {
          id: 5,
          title: "Product Manager",
          company: "ProductWave",
          location: "Seattle, WA",
          salary: "$125,000 - $155,000",
          job_type: "Full-Time",
          deadline: "2025-07-05",
          skills: ["Product Strategy", "Roadmapping", "User Stories", "Agile"]
        },
        {
          id: 6,
          title: "Marketing Specialist",
          company: "GrowthLabs",
          location: "Chicago, IL",
          salary: "$70,000 - $90,000",
          job_type: "Full-Time",
          deadline: "2025-06-30",
          skills: ["Digital Marketing", "SEO", "Social Media", "Content Creation"]
        },
        {
          id: 7,
          title: "Financial Analyst",
          company: "MoneyMetrics",
          location: "Boston, MA",
          salary: "$85,000 - $110,000",
          job_type: "Full-Time",
          deadline: "2025-07-10",
          skills: ["Financial Modeling", "Excel", "Forecasting", "Budgeting"]
        },
        {
          id: 8,
          title: "DevOps Engineer",
          company: "CloudNine",
          location: "Remote",
          salary: "$115,000 - $145,000",
          job_type: "Full-Time",
          deadline: "2025-07-15",
          skills: ["Docker", "Kubernetes", "CI/CD", "AWS", "Terraform"]
        },
        {
          id: 9,
          title: "Research Scientist",
          company: "ScienceMax",
          location: "Cambridge, MA",
          salary: "$100,000 - $140,000",
          job_type: "Full-Time",
          deadline: "2025-07-20",
          skills: ["Research", "Data Analysis", "Lab Experience", "Publishing"]
        },
        {
          id: 10,
          title: "Customer Support Representative",
          company: "HelpDesk Inc.",
          location: "Denver, CO",
          salary: "$45,000 - $60,000",
          job_type: "Part-Time",
          deadline: "2025-06-22",
          skills: ["Communication", "Problem Solving", "Patience", "Technical Knowledge"]
        }
      ];
      
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...jobs];
    
    // Filter by search term
    if (filters.searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) || 
        (job.company && job.company.toLowerCase().includes(filters.searchTerm.toLowerCase()))
      );
    }
    
    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(job => 
        job.location && job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Filter by job type
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => 
        filters.jobType.includes(job.job_type)
      );
    }
    
    // Filter by category
    if (categoryParam) {
      // This is a simplified approach - in real app you'd have proper category mapping
      filtered = filtered.filter(job => {
        if (categoryParam === "IT & Software") {
          return job.skills?.some(skill => ["React", "TypeScript", "AWS", "Docker", "Node.js"].includes(skill));
        } else if (categoryParam === "Finance") {
          return job.skills?.some(skill => ["Financial Modeling", "Excel", "Forecasting", "Budgeting"].includes(skill));
        } else if (categoryParam === "Science") {
          return job.skills?.some(skill => ["Research", "Data Analysis", "Lab Experience", "Publishing"].includes(skill));
        }
        return true;
      });
    }
    
    // Filter by salary range
    filtered = filtered.filter(job => {
      if (!job.salary) return true;
      
      // Extract min salary from format like "$45,000 - $60,000"
      const salaryMatch = job.salary.match(/\$([0-9,]+)/g);
      if (!salaryMatch || salaryMatch.length < 1) return true;
      
      const minSalary = parseInt(salaryMatch[0].replace(/[$,]/g, ''));
      return minSalary >= filters.salaryRange[0] && minSalary <= filters.salaryRange[1];
    });
    
    setFilteredJobs(filtered);
  }, [jobs, filters, categoryParam]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {categoryParam ? `${categoryParam} Jobs` : "Browse All Jobs"}
            </h1>
            <span className="text-gray-500">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </span>
          </div>
          
          <JobFilters onFilterChange={handleFilterChange} />
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria to find more jobs.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Jobs;
