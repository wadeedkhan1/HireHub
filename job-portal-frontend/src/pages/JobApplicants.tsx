import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { User, Mail, Calendar, ChevronLeft, Building, Briefcase, Clock, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
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
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface JobDetails {
  id: number;
  title: string;
  company: string;
  location: string;
  job_type: string;
  deadline?: string;
  date_of_posting?: string;
}

interface Applicant {
  application_id: number;
  user_id: number;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  date_of_application: string;
  experience: string;
  status: "applied" | "shortlisted" | "accepted" | "rejected";
  resume_url?: string;
  profile?: string;
  profile_url?: string;
}

interface DetailedApplicant extends Applicant {
  skills?: string[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    duration: string;
    start_year?: string;
    end_year?: string;
    study_field?: string;
    major?: string;
    school?: string;
    university?: string;
  }[];
  profile?: string;
  resume?: string;
}

const JobApplicants = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<DetailedApplicant | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchJobAndApplicants = async () => {
      try {
        setLoading(true);
        // Fetch job details
        const jobResponse = await jobService.getJobById(jobId || "");
        setJob(jobResponse.data);

        // Fetch applicants for this job
        const applicantsResponse = await jobService.getJobApplications(jobId || "");
        setApplicants(applicantsResponse.data);
      } catch (error) {
        console.error("Error fetching job and applicants:", error);
        toast.error("Failed to load job applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndApplicants();
  }, [jobId]);

  const fetchApplicantDetails = async (applicationId: number) => {
    try {
      setDetailsLoading(true);
      setDialogOpen(true); // Open the dialog immediately to show loading state
      
      const response = await jobService.getApplicationDetails(applicationId.toString());
      console.log("FULL API RESPONSE:", response.data);
      
      // Debug education field data specifically
      if (response.data && response.data.education) {
        console.log("EDUCATION DATA STRUCTURE:", response.data.education);
        if (Array.isArray(response.data.education)) {
          response.data.education.forEach((edu, index) => {
            console.log(`Education entry ${index} field value:`, edu.field);
          });
        }
      }

      // Create a complete applicant object by combining data from the original applicant list
      // with the details from the API
      const basicApplicant = applicants.find(a => a.application_id === applicationId) || {
        application_id: applicationId,
        status: "applied" as const,
        date_of_application: new Date().toISOString(),
        name: "Unnamed Applicant",
        user_id: 0,
        email: "",
        experience: ""
      };
      
      // Ensure education data is properly formatted if it exists
      let applicantData = { ...response.data };
      console.log("Education data received:", applicantData.education);
      
      // Make sure education exists and is properly formatted
      if (!applicantData.education) {
        // Try to find education in the root of the response
        if (response.data && response.data.education) {
          console.log("Found education in response root:", response.data.education);
          applicantData.education = response.data.education;
        } else {
          console.log("No education data found, creating empty array");
          applicantData.education = [];
        }
      } else if (typeof applicantData.education === 'string') {
        try {
          applicantData.education = JSON.parse(applicantData.education);
          console.log("Parsed education data:", applicantData.education);
        } catch (e) {
          console.error("Failed to parse education data:", e);
          applicantData.education = [];
        }
      } else if (!Array.isArray(applicantData.education)) {
        console.log("Education is not an array, converting to array:", applicantData.education);
        // If it's an object but not an array, try to convert it to an array
        applicantData.education = [applicantData.education];
      }
      
      // Ensure education is always an array
      if (!Array.isArray(applicantData.education)) {
        applicantData.education = [];
      }
      
      // Only use mock education data if no real data exists AND we're in development mode
      if (applicantData.education.length === 0 && process.env.NODE_ENV === 'development') {
        console.log("Adding mock education data for testing");
        // Update with your database values
        applicantData.education = [
          {
            institution: "LUMS",
            degree: "Bachelor's",
            field: "Computer Science", 
            duration: "2019-2023",
            start_year: "2019",
            end_year: "2023"
          }
        ];
      }

      // Check the structure of each education object to debug field issues
      if (Array.isArray(applicantData.education)) {
        console.log("Education array before normalization:", JSON.stringify(applicantData.education));
        applicantData.education = applicantData.education.map(edu => {
          console.log("Education entry keys:", Object.keys(edu));
          
          // Normalize field names - the API might be returning different field names
          const normalizedEdu = { ...edu };
          
                    
          // Make sure we're properly getting field value from the database
          if (normalizedEdu.field && typeof normalizedEdu.field === 'object') {
            console.log("Field is an object, trying to extract value:", normalizedEdu.field);
            // Handle if the field is returned as an object with a value property
            if (normalizedEdu.field.value) {
              normalizedEdu.field = normalizedEdu.field.value;
            } else if (normalizedEdu.field.name) {
              normalizedEdu.field = normalizedEdu.field.name;
            } else {
              // Try to stringify the object if it doesn't have value or name properties
              normalizedEdu.field = JSON.stringify(normalizedEdu.field);
            }
          }
          
          return normalizedEdu;
        });
        console.log("Education array after normalization:", JSON.stringify(applicantData.education));
      }

      // Combine basic data with response data
      const combinedData = {
        ...basicApplicant,
        ...applicantData
      };
      
      console.log("Final applicant data with education:", combinedData);
      setSelectedApplicant(combinedData);
    } catch (error: any) {
      console.error("Error fetching applicant details:", error);
      
      // Handle different error types
      let errorMessage = "Failed to load applicant details";
      if (error.response) {
        // Server responded with error (4xx or 5xx)
        if (error.response.status === 500 && 
            error.response.data?.error?.includes("Unknown column")) {
          errorMessage = "Database schema error. Contact administrator.";
        } else {
          errorMessage = `Server error (${error.response.status}): ${error.response.data?.error || 'Unknown error'}`;
        }
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "No response from server. Check your connection.";
      }
      
      toast.error(errorMessage);
      
      // Set selected applicant to null to show error state
      setSelectedApplicant(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      await jobService.updateApplicationStatus(applicationId.toString(), newStatus);
      
      // Update local state
      setApplicants(prevApplicants => 
        prevApplicants.map(applicant => 
          applicant.application_id === applicationId 
            ? { ...applicant, status: newStatus as any } 
            : applicant
        )
      );
      
      if (selectedApplicant && selectedApplicant.application_id === applicationId) {
        setSelectedApplicant({...selectedApplicant, status: newStatus as any});
      }
      
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating application status:", error);
      toast.error("Failed to update application status");
    }
  };

  const filteredApplicants = applicants;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-amber-100 text-amber-800";
      case "shortlisted":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSkillColor = (skill: string) => {
    // Generate a consistent color based on the skill string
    const colors = [
      "bg-blue-100 text-blue-700 border-blue-200",
      "bg-green-100 text-green-700 border-green-200",
      "bg-purple-100 text-purple-700 border-purple-200",
      "bg-amber-100 text-amber-700 border-amber-200",
      "bg-pink-100 text-pink-700 border-pink-200",
      "bg-teal-100 text-teal-700 border-teal-200",
      "bg-indigo-100 text-indigo-700 border-indigo-200",
      "bg-rose-100 text-rose-700 border-rose-200",
    ];
    
    // Use simple hash function to pick a color consistently
    const sum = skill.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
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
          <div className="mb-6">
            <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Link>
            
            {job && (
              <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Building className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Briefcase className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{job.job_type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>Posted: {formatDate(job.date_of_posting || "")}</span>
                  </div>
                  {job.deadline && (
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                      <span>Deadline: {formatDate(job.deadline)}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">{applicants.length} total applicants</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">All Applicants</h2>
          </div>
          
          {/* Card Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredApplicants.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-lg border">
                <p className="text-gray-500 mb-4">No applicants found matching your search criteria.</p>
              </div>
                  ) : (
                    filteredApplicants.map((applicant) => (
                <div key={applicant.application_id} className="bg-white rounded-lg border overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
                        {applicant.profile ? (
                          <img 
                            src={applicant.profile} 
                            alt={applicant.name} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5 text-primary-700" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{applicant.name}</div>
                        {applicant.experience && (
                          <div className="text-sm text-gray-500">{applicant.experience}</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center mt-2 text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      Applied on {formatDate(applicant.date_of_application)}
                    </div>
                    
                    <div className="mt-3">
                          <Badge className={getStatusColor(applicant.status)}>
                            {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                          </Badge>
                    </div>
                  </div>
                  
                  <div className="border-t p-3 bg-gray-50">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => fetchApplicantDetails(applicant.application_id)}
                    >
                      View Profile Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Applicant Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {detailsLoading ? (
            <>
              <DialogHeader>
                <DialogTitle>Loading Profile</DialogTitle>
                <DialogDescription>Fetching applicant information...</DialogDescription>
              </DialogHeader>
              <div className="py-10 flex justify-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            </>
          ) : selectedApplicant ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center">
                  <span>Applicant Profile</span>
                </DialogTitle>
                <DialogDescription>
                  Application submitted on {formatDate(selectedApplicant.date_of_application)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-center my-2">
                <Badge className={`${getStatusColor(selectedApplicant.status)} px-4 py-1 text-sm font-medium shadow-sm`}>
                  {selectedApplicant.status.charAt(0).toUpperCase() + selectedApplicant.status.slice(1)}
                </Badge>
              </div>
              
              <Tabs defaultValue="profile" className="mt-4">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="actions">Status Management</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">{selectedApplicant.name}</h3>
                    {selectedApplicant.experience && (
                      <p className="text-gray-600">{selectedApplicant.experience}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedApplicant.email && (
                      <div className="flex items-center text-gray-700">
                        <Mail className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{selectedApplicant.email}</span>
                      </div>
                    )}
                    
                    {selectedApplicant.phone && (
                      <div className="flex items-center text-gray-700">
                        <Phone className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{selectedApplicant.phone}</span>
                      </div>
                    )}
                    
                    {selectedApplicant.location && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                        <span>{selectedApplicant.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                      <span>Applied on {formatDate(selectedApplicant.date_of_application)}</span>
                    </div>
                  </div>
                  
                  {/* Only show sections if the data exists */}
                  {selectedApplicant.skills && selectedApplicant.skills.length > 0 && (
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-lg mb-3 flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Skills
                      </h4>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {selectedApplicant.skills.map((skill, index) => (
                            <Badge key={index} className={`px-3 py-1 font-medium ${getSkillColor(skill)}`}>{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {selectedApplicant.education && selectedApplicant.education.length > 0 && (
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <h4 className="font-medium text-lg mb-3 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-primary" />
                        Education History
                      </h4>
                      <div className="space-y-4">
                        {selectedApplicant.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-primary-500 pl-4 py-2">
                            <div className="flex justify-between">
                              <h5 className="font-semibold text-gray-800">
                                {edu.institution || edu.school || edu.university || "Institution"}
                                <div className="text-sm font-medium text-primary-600 mt-0.5">
                                  {edu.field || edu.study_field || edu.major || "Field not specified"}
                                </div>
                              </h5>
                              <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                {edu.duration || `${edu.start_year || ""}-${edu.end_year || ""}`}
                              </span>
                            </div>
                            
                            {edu.degree && (
                              <div className="flex items-center text-sm text-gray-700 mt-1">
                                <span>{edu.degree}</span>
                              </div>
                            )}
                            
                            {edu.start_year && (
                              <p className="text-xs text-gray-500 mt-1">
                                Started: {edu.start_year} 
                                {edu.end_year ? ` • Completed: ${edu.end_year}` : ' • Currently Studying'}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Show resume content if available */}
                  {selectedApplicant.resume && (
                    <div>
                      <h4 className="font-medium mb-2">Resume</h4>
                      <div className="p-4 bg-gray-50 border rounded-md text-sm whitespace-pre-wrap">
                        {selectedApplicant.resume}
                      </div>
                    </div>
                  )}
                  
                  {/* Show profile content if available */}
                  {selectedApplicant.profile && (
                    <div>
                      <h4 className="font-medium mb-2">Profile</h4>
                      <div className="p-4 bg-gray-50 border rounded-md text-sm whitespace-pre-wrap">
                        {selectedApplicant.profile}
                      </div>
                    </div>
                  )}
                  
                  {/* Links section for resume URL */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedApplicant.resume_url && (
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(selectedApplicant.resume_url, '_blank')}
                        className="flex items-center"
                      >
                        <i className="mr-2">📄</i>
                        View Resume
                      </Button>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="actions">
                  <div className="bg-gray-50 p-5 rounded-lg border">
                    <h4 className="font-medium mb-3">Application Status</h4>
                    <Label htmlFor="status-select" className="block text-sm mb-2">Update application status:</Label>
                                  <Select 
                      value={selectedApplicant.status}
                      onValueChange={(value) => handleStatusChange(selectedApplicant.application_id, value)}
                                  >
                      <SelectTrigger id="status-select" className="w-full">
                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="applied">Applied</SelectItem>
                        <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                      <SelectItem value="accepted">Accepted</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                    
                    <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg border border-blue-200">
                      <h5 className="font-medium mb-2">Status Descriptions</h5>
                      <ul className="list-disc pl-5 space-y-1 text-sm">
                        <li><span className="font-semibold">Applied</span>: Application received, awaiting review</li>
                        <li><span className="font-semibold">Shortlisted</span>: Application has been reviewed and candidate shortlisted</li>
                        <li><span className="font-semibold">Accepted</span>: Candidate has been offered the position</li>
                        <li><span className="font-semibold">Rejected</span>: Candidate not selected for the position</li>
                      </ul>
                    </div>
                                </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <DialogClose asChild>
                  <Button variant="destructive" className="ml-auto">
                    Close
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Error</DialogTitle>
                <DialogDescription>
                  Unable to load applicant details
                </DialogDescription>
              </DialogHeader>
              <p className="py-8 text-center text-gray-500">No applicant details available</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobApplicants; 