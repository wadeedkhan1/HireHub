import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Briefcase, Building, MapPin, Calendar, Clock, CheckCircle, XCircle, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import jobService from "@/services/jobService";
import { toast } from "sonner";

interface Application {
  application_id: number;
  job_title: string;
  company_name: string;
  job_location?: string;
  date_of_application: string;
  status: string;
  resumeUrl?: string;
  profile?: string;
  skills?: string[];
  education?: any[];
  email?: string;
}

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const response = await jobService.getApplicationDetails(id);
        setApplication(response.data);
      } catch (error) {
        console.error("Error fetching application details:", error);
        toast.error("Failed to load application details");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      if (!id) return;
      
      await jobService.deleteApplication(id);
      toast.success("Application deleted successfully");
      // Navigate back to the applications list
      navigate("/applications");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-amber-100 text-amber-800";
      case "shortlisted":
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
      case "applied":
        return <Clock className="h-4 w-4 mr-1" />;
      case "shortlisted":
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

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
                <h1 className="text-2xl font-bold text-gray-900">{application.job_title}</h1>
                <div className="flex items-center text-gray-500 mt-1">
                  <Building className="h-4 w-4 mr-2" />
                  <span>{application.company_name}</span>
                  {application.job_location && (
                    <>
                      <span className="mx-2">•</span>
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{application.job_location}</span>
                    </>
                  )}
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
              {application.skills && application.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {application.skills.map((skill, index) => (
                      <Badge key={index} className="bg-primary/10 text-primary border-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {application.education && application.education.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Education</h2>
                  <div className="space-y-4">
                    {application.education.map((edu, index) => (
                      <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                        <h3 className="font-medium">{edu.institution}</h3>
                        <p className="text-gray-600">{edu.field}</p>
                        <p className="text-sm text-gray-500">{edu.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Application Details</h2>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500">Applied Date</div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(application.date_of_application)}</span>
                    </div>
                  </div>
                  
                  {application.status && (
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="text-gray-600 capitalize">{application.status}</div>
                    </div>
                  )}
                  
                  {application.email && (
                    <div>
                      <div className="text-sm text-gray-500">Contact Email</div>
                      <div className="text-gray-600">{application.email}</div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  {application.resumeUrl && (
                    <Button className="w-full">
                      Download Resume
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    Contact Recruiter
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Application
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </div>
  );
};

export default ApplicationDetails; 