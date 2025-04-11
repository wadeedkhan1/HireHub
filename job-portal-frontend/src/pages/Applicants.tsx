import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Phone, Calendar, MapPin, Briefcase, Search, Filter } from "lucide-react";
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
}

const Applicants = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplicants([
        {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "+1 234 567 890",
          location: "San Francisco, CA",
          appliedDate: "2024-03-15",
          jobTitle: "Senior Frontend Developer",
          status: "interviewing",
          resumeUrl: "#"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "+1 234 567 891",
          location: "New York, NY",
          appliedDate: "2024-03-14",
          jobTitle: "Product Manager",
          status: "pending",
          resumeUrl: "#"
        },
        {
          id: 3,
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          phone: "+1 234 567 892",
          location: "Chicago, IL",
          appliedDate: "2024-03-13",
          jobTitle: "Backend Developer",
          status: "accepted",
          resumeUrl: "#"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         applicant.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="interviewing">Interviewing</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Applicant</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Job Applied</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Applied Date</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
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
                            <div className="text-sm text-gray-500">{applicant.location}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">{applicant.jobTitle}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(applicant.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(applicant.status)}>
                          {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-2">
                          <Link to={`/applicants/${applicant.id}`}>
                            <Button variant="outline" size="sm">View Profile</Button>
                          </Link>
                          <Button size="sm">Download Resume</Button>
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

export default Applicants; 