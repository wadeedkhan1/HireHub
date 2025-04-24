import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Briefcase, PieChart, Users, ArrowRight } from "lucide-react";
import JobCategories from "@/components/jobs/JobCategories";
import JobCard, { JobData } from "@/components/jobs/JobCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobService } from "@/services";

const Index = () => {
  const [featuredJobs, setFeaturedJobs] = useState<JobData[]>([]);
  const [jobStats, setJobStats] = useState({
    totalJobs: 0,
    totalCategories: 0,
    activeJobs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        
        // Fetch jobs
        const response = await jobService.getJobs();
        const jobs = response.data;
        
        // Calculate stats
        const categories = new Set();
        
        // Count total active positions based on max_positions
        const totalPositions = jobs.reduce((total: number, job: any) => {
          return total + (job.max_positions || 1);
        }, 0);
        
        jobs.forEach((job: any) => {
          if (job.category) categories.add(job.category);
        });
        
        setJobStats({
          totalJobs: jobs.length,
          totalCategories: categories.size,
          activeJobs: totalPositions
        });
        
        // Get up to 4 jobs for featured section
        const featuredJobsData = jobs.slice(0, 4).map((job: any) => ({
          id: job.id,
          title: job.title,
          location: job.location,
          salary: job.salary,
          job_type: job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1),
          deadline: job.deadline,
          skills: [job.category]
        }));
        
        setFeaturedJobs(featuredJobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Blue Gradient */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
              <div className="lg:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Discover Your Perfect Career Opportunity
                </h1>
                <p className="text-xl text-blue-50 mb-8 max-w-xl">
                  Connect with top employers and find the job that matches your skills, experience, and aspirations.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/jobs"
                    className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition duration-300"
                  >
                    Browse All Jobs
                  </Link>
                  <Link
                    to="/jobs?category=IT"
                    className="px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg shadow-md hover:bg-blue-900 transition duration-300"
                  >
                    IT Jobs
                  </Link>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="lg:w-1/2 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-50 transform transition-transform hover:scale-105">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-blue-100 rounded-full mr-4">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{loading ? "..." : jobStats.totalJobs}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Total Jobs</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-50 transform transition-transform hover:scale-105">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-green-100 rounded-full mr-4">
                        <PieChart className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{loading ? "..." : jobStats.totalCategories}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Categories</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-50 transform transition-transform hover:scale-105">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-purple-100 rounded-full mr-4">
                        <Users className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">{loading ? "..." : jobStats.activeJobs}</h3>
                    </div>
                    <p className="text-sm text-gray-600">Total Positions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12">
              <div className="bg-white py-4 px-6 rounded-md border-l-[3px] border-blue-500 shadow-sm flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Featured Opportunities</h2>
                  <p className="text-gray-600 mt-2">Discover handpicked opportunities that match your skills</p>
                </div>
                <Link 
                  to="/jobs" 
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Jobs <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                  {featuredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Link
                to="/jobs"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Explore All Available Jobs <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Job Categories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="mb-12">
              <div className="bg-blue-50 py-4 px-6 rounded-md border-l-[3px] border-blue-500 shadow-sm">
                <h2 className="text-3xl font-bold text-gray-800">Explore Job Categories</h2>
                <p className="text-gray-600 mt-2">
                  Browse opportunities by industry and find your perfect match
                </p>
              </div>
            </div>
            <JobCategories />
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 py-20">
          <div className="container mx-auto px-4 max-w-7xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Take the Next Step in Your Career?</h2>
            <p className="text-xl text-blue-50 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who found their dream jobs through our platform
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/jobs"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:bg-blue-50 transition duration-300"
              >
                Find Jobs Now
              </Link>
              <Link
                to="/profile"
                className="px-8 py-4 bg-blue-700 text-white font-bold rounded-lg shadow-lg hover:bg-blue-800 transition duration-300"
              >
                Create Your Profile
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
