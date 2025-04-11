import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, Building, MapPin, Calendar, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Application {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: "pending" | "reviewing" | "interviewing" | "accepted" | "rejected";
  jobDescription: string;
  requirements: string[];
  skills: string[];
  benefits: string[];
  interviewDate?: string;
  interviewType?: string;
  interviewLocation?: string;
  notes?: string;
}

const ApplicationDetails = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplication({
        id: 1,
        jobTitle: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        appliedDate: "2024-03-15",
        status: "interviewing",
        jobDescription: "We are looking for a skilled Senior Frontend Developer to join our team. The ideal candidate will have extensive experience with React, TypeScript, and modern frontend development practices.",
        requirements: [
          "5+ years of experience in frontend development",
          "Strong knowledge of React and TypeScript",
          "Experience with modern frontend tools and frameworks",
          "Excellent problem-solving skills",
          "Strong communication and collaboration abilities"
        ],
        skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Redux"],
        benefits: [
          "Competitive salary and benefits package",
          "Health insurance and wellness programs",
          "Flexible work hours and remote work options",
          "Professional development opportunities",
          "Team building activities and events"
        ],
        interviewDate: "2024-03-25",
        interviewType: "Technical Interview",
        interviewLocation: "Virtual (Zoom)",
        notes: "Please prepare a short presentation about your previous projects and be ready for a coding challenge."
      });
      setLoading(false);
    }, 1000);
  }, [id]);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "reviewing":
        return <Clock className="h-4 w-4 mr-1" />;
      case "interviewing":
        return <Calendar className="h-4 w-4 mr-1" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
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

  if (!application) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Application not found</h1>
            <Link to="/applications" className="text-primary hover:text-primary/80">
              Back to Applications
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
            <Link to="/applications" className="flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applications
            </Link>
            
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{application.jobTitle}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{application.company}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{application.location}</span>
                </div>
              </div>
              <Badge className={`${getStatusColor(application.status)} flex items-center`}>
                {getStatusIcon(application.status)}
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-600">{application.jobDescription}</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {application.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, index) => (
                    <Badge key={index} className="bg-primary/10 text-primary border-0">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Benefits</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {application.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Applied Date</div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {application.interviewDate && (
                    <div>
                      <div className="text-sm text-gray-500">Interview Date</div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(application.interviewDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )}
                  
                  {application.interviewType && (
                    <div>
                      <div className="text-sm text-gray-500">Interview Type</div>
                      <div className="text-gray-600">{application.interviewType}</div>
                    </div>
                  )}
                  
                  {application.interviewLocation && (
                    <div>
                      <div className="text-sm text-gray-500">Interview Location</div>
                      <div className="text-gray-600">{application.interviewLocation}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {application.notes && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Notes</h2>
                  <p className="text-gray-600">{application.notes}</p>
                </div>
              )}
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full">Download Application</Button>
                  <Button variant="outline" className="w-full">Contact Recruiter</Button>
                  <Button variant="outline" className="w-full">Withdraw Application</Button>
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

export default ApplicationDetails; 