import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import profileService, { isJobSeekerProfile, isRecruiterProfile } from "@/services/profileService";
import authService from "@/services/authService";

const Profile = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"jobseeker" | "recruiter" | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form fields for job seeker
  const [jobSeekerData, setJobSeekerData] = useState({
    name: "",
    email: "",
    skills: "",
    resume: "",
    profile: ""
  });
  
  // Form fields for recruiter
  const [recruiterData, setRecruiterData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    bio: ""
  });
  
  useEffect(() => {
    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      toast.error("Please sign in to access your profile");
      navigate("/auth?type=login");
      return;
    }
    
    // Load profile data from the backend
    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await profileService.getProfile();
        
        if (isJobSeekerProfile(profile)) {
          setUserType("jobseeker");
          setJobSeekerData({
            name: profile.name || "",
            email: profile.email || "",
            skills: profile.skills || "",
            resume: profile.resume || "",
            profile: profile.profile || ""
          });
        } else if (isRecruiterProfile(profile)) {
          setUserType("recruiter");
          setRecruiterData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            company: "", // Map to company if needed in the frontend
            position: "", // Map to position if needed in the frontend
            bio: profile.bio || ""
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile data");
        
        // Fallback to mock data if API fails
        const user = authService.getCurrentUser();
        if (user) {
          setUserType(user.type || "jobseeker");
          
          if (user.type === "recruiter") {
            setRecruiterData({
              name: "John Recruiter",
              email: user.email || "john@example.com",
              phone: "+1 123-456-7890",
              company: "TechCorp Inc.",
              position: "Senior Recruiter",
              bio: "Experienced recruiter specializing in tech talent acquisition."
            });
          } else {
            setJobSeekerData({
              name: "Jane Applicant",
              email: user.email || "jane@example.com",
              skills: "React, TypeScript, JavaScript, HTML, CSS, Node.js",
              resume: "",
              profile: ""
            });
          }
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [navigate]);
  
  const handleJobSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setJobSeekerData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRecruiterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecruiterData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Prepare update data based on user type
      if (userType === "jobseeker") {
        await profileService.updateProfile({
          name: jobSeekerData.name,
          skills: jobSeekerData.skills,
          resume: jobSeekerData.resume,
          profile: jobSeekerData.profile
          // Only send fields that can be updated in the backend
        });
      } else if (userType === "recruiter") {
        await profileService.updateProfile({
          name: recruiterData.name,
          phone: recruiterData.phone,
          bio: recruiterData.bio
          // Only send fields that can be updated in the backend
        });
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-2 md:max-w-md mb-6">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>
            
            {/* Profile Information Tab */}
            <TabsContent value="profile" className="bg-white rounded-lg shadow-sm border p-6">
              {userType === "jobseeker" ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={jobSeekerData.name}
                        onChange={handleJobSeekerChange}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={jobSeekerData.email}
                        onChange={handleJobSeekerChange}
                        className="input-field"
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                      Skills (comma separated)
                    </label>
                    <textarea
                      id="skills"
                      name="skills"
                      rows={2}
                      value={jobSeekerData.skills}
                      onChange={handleJobSeekerChange}
                      className="input-field"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resume Link
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="url"
                        id="resume"
                        name="resume"
                        placeholder="https://example.com/your-resume"
                        value={jobSeekerData.resume}
                        onChange={handleJobSeekerChange}
                        className="w-full input-field"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Provide a link to your online resume (Google Drive, Dropbox, etc)
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Link
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="url"
                        id="profile"
                        name="profile"
                        placeholder="https://example.com/your-profile"
                        value={jobSeekerData.profile}
                        onChange={handleJobSeekerChange}
                        className="w-full input-field"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Provide a link to your LinkedIn or other professional profile
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={recruiterData.name}
                        onChange={handleRecruiterChange}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={recruiterData.email}
                        onChange={handleRecruiterChange}
                        className="input-field"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={recruiterData.phone}
                        onChange={handleRecruiterChange}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={recruiterData.company}
                        onChange={handleRecruiterChange}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={recruiterData.position}
                        onChange={handleRecruiterChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={recruiterData.bio}
                      onChange={handleRecruiterChange}
                      className="input-field"
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="relative"
                      >
                        Upload Logo
                        <input
                          type="file"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          accept=".jpg,.jpeg,.png"
                        />
                      </Button>
                      <span className="text-sm text-gray-500">No file selected</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Accepted formats: JPG, JPEG, PNG. Max size: 2MB
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t flex justify-end">
                <Button
                  type="button"
                  className="btn-primary"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </TabsContent>
            
            {/* Account Settings Tab */}
            <TabsContent value="account" className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Change Password</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        className="input-field"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      type="button"
                      className="btn-primary"
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="job-alerts"
                          type="checkbox"
                          defaultChecked
                          className="rounded text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="job-alerts" className="text-sm font-medium text-gray-700">
                          Job Alerts
                        </label>
                        <p className="text-xs text-gray-500">
                          Get notified when new jobs matching your profile are posted.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="application-updates"
                          type="checkbox"
                          defaultChecked
                          className="rounded text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="application-updates" className="text-sm font-medium text-gray-700">
                          Application Updates
                        </label>
                        <p className="text-xs text-gray-500">
                          Receive updates when the status of your application changes.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing"
                          type="checkbox"
                          className="rounded text-primary focus:ring-primary"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="marketing" className="text-sm font-medium text-gray-700">
                          Marketing Communications
                        </label>
                        <p className="text-xs text-gray-500">
                          Receive tips, trends, and updates from HireHub.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Button
                      type="button"
                      className="btn-primary"
                    >
                      Save Preferences
                    </Button>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-red-600 mb-3">Danger Zone</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <Button
                    type="button"
                    variant="destructive"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;
