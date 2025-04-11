import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Download, MessageSquare, Filter } from "lucide-react";
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
  status: "pending" | "interviewing" | "accepted" | "rejected";
  resumeUrl: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  deadline: string;
}

const JobApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setJob({
        id: 1,
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        job_type: "Full-Time",
        deadline: "2024-04-30"
      });
      
      setApplicants([
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 234 567 890",
          location: "New York, NY",
          appliedDate: "2024-03-15",
          status: "interviewing",
          resumeUrl: "#"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 234 567 891",
          location: "San Francisco, CA",
          appliedDate: "2024-03-14",
          status: "pending",
          resumeUrl: "#"
        }
      ]);
      
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

  const filteredApplicants = statusFilter === "all" 
    ? applicants 
    : applicants.filter(applicant => applicant.status === statusFilter);

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

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Job not found</h1>
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <Link to="/dashboard" className="text-primary hover:text-primary/80 mb-2 inline-block">
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-600">{job.company} • {job.location}</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <Button 
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                >
                  All ({applicants.length})
                </Button>
                <Button 
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending ({applicants.filter(a => a.status === "pending").length})
                </Button>
                <Button 
                  variant={statusFilter === "interviewing" ? "default" : "outline"}
                  onClick={() => setStatusFilter("interviewing")}
                >
                  Interviewing ({applicants.filter(a => a.status === "interviewing").length})
                </Button>
                <Button 
                  variant={statusFilter === "accepted" ? "default" : "outline"}
                  onClick={() => setStatusFilter("accepted")}
                >
                  Accepted ({applicants.filter(a => a.status === "accepted").length})
                </Button>
                <Button 
                  variant={statusFilter === "rejected" ? "default" : "outline"}
                  onClick={() => setStatusFilter("rejected")}
                >
                  Rejected ({applicants.filter(a => a.status === "rejected").length})
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Applicant</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Contact</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Applied Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="py-3 px-4 text-right text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplicants.map((applicant) => (
                    <tr key={applicant.id} className="border-b last:border-0">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">{applicant.name}</div>
                            <div className="text-sm text-gray-500">{applicant.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600">{applicant.phone}</div>
                        <div className="text-sm text-gray-500">{applicant.location}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(applicant.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(applicant.status)}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Link 
                            to={`/applicants/${applicant.id}`}
                            className="btn-primary text-sm px-3 py-1.5"
                          >
                            View Profile
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default JobApplicants; 