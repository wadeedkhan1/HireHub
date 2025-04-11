
import React from "react";
import { Link } from "react-router-dom";
import { Search, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCategories from "@/components/jobs/JobCategories";
import JobCard, { JobData } from "@/components/jobs/JobCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  // Mock featured jobs data
  const featuredJobs: JobData[] = [
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
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Connect with top employers and discover opportunities tailored to your skills and career goals.
            </p>
            
            <div className="bg-white p-3 rounded-lg shadow-lg flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex items-center border rounded-md px-3 py-2">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <Link to="/jobs" className="btn-primary whitespace-nowrap">
                Search Jobs
              </Link>
            </div>
            
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <span className="text-sm text-gray-600">Popular searches:</span>
              <Link to="/jobs?q=developer" className="text-sm text-primary hover:text-primary/80">
                Developer
              </Link>
              <Link to="/jobs?q=designer" className="text-sm text-primary hover:text-primary/80">
                Designer
              </Link>
              <Link to="/jobs?q=marketing" className="text-sm text-primary hover:text-primary/80">
                Marketing
              </Link>
              <Link to="/jobs?q=remote" className="text-sm text-primary hover:text-primary/80">
                Remote
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Job Categories */}
      <div className="container-custom py-12">
        <JobCategories />
      </div>
      
      {/* Featured Jobs */}
      <div className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Jobs</h2>
            <Link to="/jobs" className="text-primary hover:text-primary/80 font-medium">
              View All Jobs
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container-custom py-16">
        <div className="bg-primary/10 rounded-xl p-8 md:p-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-2/3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                For Employers
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Find the perfect candidate for your open position. Post a job and reach thousands of qualified professionals.
              </p>
              <Link to="/post-job" className="btn-primary inline-block">
                Post a Job
              </Link>
            </div>
            <div className="hidden md:block md:w-1/3">
              <div className="flex justify-center">
                <div className="rounded-full bg-white p-6">
                  <Briefcase className="h-16 w-16 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
            How HireHub Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-5 h-20 w-20 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-bold mt-4 mb-2">Create an Account</h3>
              <p className="text-gray-600">
                Sign up as a job seeker or employer to get started with HireHub.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-5 h-20 w-20 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-bold mt-4 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">
                Add your skills, experience, and preferences to stand out.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-5 h-20 w-20 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-bold mt-4 mb-2">Apply or Post Jobs</h3>
              <p className="text-gray-600">
                Search and apply for jobs, or post openings to find great candidates.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
