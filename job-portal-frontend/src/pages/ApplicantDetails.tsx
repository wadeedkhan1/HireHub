import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Download, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface Applicant {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedDate: string;
  jobTitle: string;
  status: "pending" | "interviewing" | "accepted" | "rejected";
  resumeUrl: string;
  skills: string[];
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    field: string;
    duration: string;
  }[];
}

const ApplicantDetails = () => {
  const { id } = useParams();
  const [applicant, setApplicant] = useState<Applicant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplicant({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 234 567 890",
        location: "San Francisco, CA",
        appliedDate: "2024-03-15",
        jobTitle: "Senior Frontend Developer",
        status: "interviewing",
        resumeUrl: "#",
        skills: ["React", "TypeScript", "JavaScript", "HTML", "CSS", "Redux", "Node.js"],
        experience: [
          {
            company: "TechCorp Inc.",
            position: "Senior Frontend Developer",
            duration: "2020 - Present",
            description: "Led frontend development team, implemented new features, and optimized performance."
          },
          {
            company: "WebSolutions Ltd.",
            position: "Frontend Developer",
            duration: "2018 - 2020",
            description: "Developed responsive web applications and collaborated with design team."
          }
        ],
        education: [
          {
            institution: "Stanford University",
            degree: "Master's",
            field: "Computer Science",
            duration: "2016 - 2018"
          },
          {
            institution: "University of California",
            degree: "Bachelor's",
            field: "Software Engineering",
            duration: "2012 - 2016"
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "interviewing":
        return "bg-blue-100 text-blue-800";
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
            <Link to="/applicants" className="text-primary hover:text-primary/80">
              Back to Applicants
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
            <Link to="/applicants" className="flex items-center text-primary hover:text-primary/80 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Applicants
            </Link>
            
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{applicant.name}</h1>
                  <div className="flex items-center text-gray-500 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{applicant.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Button>Schedule Interview</Button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">About</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{applicant.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <span>{applicant.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Applied for {applicant.jobTitle}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <span>Applied on {new Date(applicant.appliedDate).toLocaleDateString()}</span>
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">Experience</h2>
                <div className="space-y-6">
                  {applicant.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-primary pl-4">
                      <h3 className="font-medium">{exp.position}</h3>
                      <p className="text-gray-600">{exp.company}</p>
                      <p className="text-sm text-gray-500">{exp.duration}</p>
                      <p className="mt-2 text-gray-600">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Education</h2>
                <div className="space-y-6">
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
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Status</h2>
                <Badge className={`${getStatusColor(applicant.status)} text-lg px-4 py-2`}>
                  {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                </Badge>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <Button className="w-full">Accept Application</Button>
                  <Button variant="outline" className="w-full">Reject Application</Button>
                  <Button variant="outline" className="w-full">Request More Information</Button>
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

export default ApplicantDetails; 