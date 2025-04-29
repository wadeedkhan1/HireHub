import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import jobService from "@/services/jobService";

interface Applicant {
  id: number;
  application_id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  date_of_application: string;
  experience: string;
  status: "pending" | "reviewing" | "interviewing" | "accepted" | "rejected";
  resume_url?: string;
  skills: string[];
  education: {
    institution: string;
    degree: string;
    field: string;
    duration: string;
  }[];
  work_experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  job_details: {
    title: string;
    company: string;
    location: string;
  };
}

const ApplicantProfile = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplicantDetails = async () => {
      try {
        setLoading(true);
        const response = await jobService.getApplicationDetails(applicationId || "");
        setApplicant(response.data);
      } catch (error) {
        console.error("Error fetching applicant details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicantDetails();
  }, [applicationId]);

  const handleStatusChange = async (newStatus: string) => {
    if (!applicant) return;

    try {
      await jobService.updateApplicationStatus(applicant.application_id.toString(), newStatus);
      setApplicant(prev => prev ? { ...prev, status: newStatus as any } : null);
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "reviewing":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-purple-100 text-purple-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  if (!applicant) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Applicant not found</h1>
            <Link to="/dashboard" className="text-primary hover:text-primary/80">
              Back to Dashboard
            </Link>
          </div>
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
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{applicant.name}</h1>
                    <div className="flex items-center text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {applicant.email}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Application Status</p>
                    <Select
                      value={applicant.status}
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="reviewing">Reviewing</SelectItem>
                        <SelectItem value="interviewing">Interviewing</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {applicant.resume_url && (
                    <Button
                      onClick={() => window.open(applicant.resume_url, '_blank')}
                      className="flex items-center"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{applicant.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{applicant.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                        <span>Applied for {applicant.job_details.title} at {applicant.job_details.company}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                        <span>Applied on {new Date(applicant.date_of_application).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {applicant.skills.map((skill, index) => (
                        <Badge key={index} className="bg-primary/10 text-primary border-0">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Work Experience</h2>
                    <div className="space-y-4">
                      {applicant.work_experience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4">
                          <h3 className="font-medium">{exp.position}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                          <p className="mt-2 text-gray-700">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Education</h2>
                    <div className="space-y-4">
                      {applicant.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-primary pl-4">
                          <h3 className="font-medium">{edu.degree} in {edu.field}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.duration}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Job Title</p>
                        <p className="font-medium">{applicant.job_details.title}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Company</p>
                        <p className="font-medium">{applicant.job_details.company}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{applicant.job_details.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Application ID</p>
                        <p className="font-medium">{applicant.application_id}</p>
                      </div>
                    </div>
                  </div>
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

export default ApplicantProfile; 