import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import JobFilters from "@/components/jobs/JobFilters";
import JobCard, { JobData } from "@/components/jobs/JobCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobService } from "../services";
import { toast } from "@/components/ui/use-toast";

// Map our API Job type to the JobData type used by components
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

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const locationParam = searchParams.get("location") || "";
  const jobTypeParam = searchParams.get("jobType") || "";
  const minSalaryParam = searchParams.get("salaryMin") || "0";
  const maxSalaryParam = searchParams.get("salaryMax") || "200000";
  const durationParam = searchParams.get("duration") || "";
  
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    searchTerm: searchParam,
    location: locationParam,
    jobType: jobTypeParam ? jobTypeParam.split(',').map(type => 
      type.charAt(0).toUpperCase() + type.slice(1)) : [],
    salaryRange: [
      parseInt(minSalaryParam) || 0,
      parseInt(maxSalaryParam) || 200000
    ] as [number, number],
    category: categoryParam || undefined,
    duration: durationParam ? parseInt(durationParam) : undefined
  });

  // Function to directly call the backend API with current URL params
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Log the current search params for debugging
      console.log("Current Search Params:", Object.fromEntries(searchParams.entries()));
      
      // Build the API URL with the current search params - direct approach
      let queryString = new URLSearchParams(searchParams).toString();
      // Ensure duration is being passed through correctly (debugging)
      if (durationParam) {
        console.log(`Duration param exists: ${durationParam}`);
      }
      
      const url = queryString ? `/jobs?${queryString}` : '/jobs';
      console.log("Fetching from URL:", url);
      
      const response = await jobService.getJobs(null, url);
      console.log("API Response:", response);
      
      // Response comes as array directly, not nested under 'jobs'
      const apiJobs = Array.isArray(response.data) ? response.data : [];
      
      if (apiJobs.length === 0) {
        console.log("No jobs returned from API");
      }
      
      // Map API jobs to our JobData format
      const mappedJobs: JobData[] = apiJobs.map((job: ApiJob) => ({
        id: job.id,
        title: job.title,
        recruiter_id: job.recruiter_id,
        category: job.category,
        location: job.location,
        salary: job.salary, // Keep as number for formatting in the JobCard
        job_type: job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1), // Capitalize job type
        duration: job.duration,
        max_positions: job.max_positions,
        max_applicants: job.max_applicants,
        date_of_posting: job.date_of_posting,
        skills: [job.category], // Using category as a skill for now
      }));
      
      setJobs(mappedJobs);
      setFilteredJobs(mappedJobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again later.",
        variant: "destructive"
      });
      
      // Fallback to empty array if error
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load jobs whenever URL params change
  useEffect(() => {
    fetchJobs();
    
    // Update filter state to match URL params
    setFilters({
      searchTerm: searchParam,
      location: locationParam,
      jobType: jobTypeParam ? jobTypeParam.split(',').map(type => 
        type.charAt(0).toUpperCase() + type.slice(1)) : [],
      salaryRange: [
        parseInt(minSalaryParam) || 0,
        parseInt(maxSalaryParam) || 200000
      ] as [number, number],
      category: categoryParam || undefined,
      duration: durationParam ? parseInt(durationParam) : undefined
    });
  }, [searchParams]);

  // Apply local filtering for category since that might be client-side only
  useEffect(() => {
    if (!categoryParam) {
      return;
    }
    
    // Filter by category (client-side)
    const filtered = jobs.filter(job => {
      // Add your category filtering logic based on skills or other attributes
      return job.category?.toLowerCase() === categoryParam.toLowerCase();
    });
    
    setFilteredJobs(filtered);
  }, [jobs, categoryParam]);

  // Handle filter changes - update URL and trigger API request
  const handleFilterChange = async (newFilters: any) => {
    // Create a new URLSearchParams object (fresh, not from existing)
    const newParams = new URLSearchParams();
    
    // Only add params with values
    if (newFilters.searchTerm) {
      newParams.set("search", newFilters.searchTerm);
    }
    
    if (newFilters.location) {
      newParams.set("location", newFilters.location);
    }
    
    if (newFilters.jobType && newFilters.jobType.length > 0) {
      const jobTypeString = newFilters.jobType.map((type: string) => type.toLowerCase()).join(',');
      newParams.set("jobType", jobTypeString);
    }
    
    if (newFilters.salaryRange && newFilters.salaryRange.length === 2) {
      if (newFilters.salaryRange[0] > 0) {
        newParams.set("salaryMin", newFilters.salaryRange[0].toString());
      }
      if (newFilters.salaryRange[1] < 200000) {
        newParams.set("salaryMax", newFilters.salaryRange[1].toString());
      }
    }
    
    if (newFilters.category) {
      newParams.set("category", newFilters.category);
    }
    
    if (newFilters.duration) {
      // Ensure duration is added correctly to URL params
      console.log(`Setting duration filter: ${newFilters.duration}`);
      newParams.set("duration", newFilters.duration.toString());
    }
    
    // Log the params we're about to set
    console.log("Setting URL params:", Object.fromEntries(newParams.entries()));
    
    // Set the new URL with filters - this will also trigger a re-fetch
    setSearchParams(newParams);
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
          
          <JobFilters onFilterChange={handleFilterChange} initialFilters={filters} />
          
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
