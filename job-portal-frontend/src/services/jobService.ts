import api from './api';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  type: string; // full-time, part-time, contract, etc.
  postedDate: string;
  deadline?: string;
  employerId: string;
  status: 'active' | 'closed';
}

interface JobFilter {
  search?: string;
  location?: string;
  type?: string;
  salary?: {
    min?: number;
    max?: number;
  };
  page?: number;
  limit?: number;
}

interface JobApplication {
  jobId: string;
  resumeUrl: string;
  coverLetter?: string;
}

const jobService = {
  // Get all jobs with optional filtering
  getJobs: async (filters: JobFilter | null = null, directUrl: string | null = null) => {
    if (directUrl) {
      // Use the direct URL approach (helps when using the exact URL format expected by backend)
      return api.get(directUrl);
    } else {
      // Use the params approach
      return api.get<any>('/jobs', { params: filters });
    }
  },

  // Get job categories with counts - this will group jobs by category
  getJobCategoryCounts: async () => {
    try {
      // This will fetch all jobs and then we'll process them to get category counts
      const response = await api.get('/jobs');
      const jobs = response.data;
      
      // Group jobs by category
      const categoryCounts: Record<string, number> = {};
      jobs.forEach((job: any) => {
        if (job.category) {
          if (categoryCounts[job.category]) {
            categoryCounts[job.category]++;
          } else {
            categoryCounts[job.category] = 1;
          }
        }
      });
      
      // Transform to array format
      const categories = Object.keys(categoryCounts).map(name => ({
        name,
        count: categoryCounts[name]
      }));
      
      return categories;
    } catch (error) {
      console.error('Error fetching job categories:', error);
      throw error;
    }
  },

  // Get job by ID
  getJobById: async (id: string) => {
    console.log(`jobService.getJobById called with id: ${id}`);
    try {
      const response = await api.get(`/jobs/${id}`);
      console.log('API Response headers:', response.headers);
      console.log('API Response status:', response.status);
      return response;
    } catch (error: any) {
      console.error(`Error in jobService.getJobById(${id}):`, error.message);
      if (error.response) {
        console.error('Error response:', error.response.status, error.response.data);
      }
      throw error;
    }
  },

  // For employers: Create a new job posting
  createJob: async (jobData: Omit<Job, 'id' | 'postedDate' | 'employerId' | 'status'>) => {
    return api.post<Job>('/jobs', jobData);
  },

  // For employers: Update a job posting
  updateJob: async (id: string, jobData: Partial<Job>) => {
    return api.put<Job>(`/jobs/${id}`, jobData);
  },

  // For employers: Delete a job posting
  deleteJob: async (id: string) => {
    return api.delete(`/jobs/${id}`);
  },

  // For employers: Get all applications for a specific job
  getJobApplications: async (jobId: string) => {
    return api.get(`/applications/jobs/${jobId}`);
  },

  // For jobseekers: Apply to a job
  applyToJob: async (applicationData: JobApplication) => {
    try {
      // Get user from localStorage as a proper object
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        throw new Error('User not authenticated. Please sign in.');
      }

      let currentUser;
      try {
        currentUser = JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        throw new Error('Invalid user data. Please sign in again.');
      }

      if (!currentUser.id) {
        console.error('Missing user ID in stored data:', currentUser);
        throw new Error('User ID not found. Please sign in again.');
      }

      console.log('Applying with user ID:', currentUser.id);
      
      // Create a properly formatted request body
      const requestData = {
        user_id: currentUser.id,
        jobId: applicationData.jobId,
        resumeUrl: applicationData.resumeUrl || "placeholder",
        coverLetter: applicationData.coverLetter || ""
      };
      
      // Make the API call with detailed error handling
      try {
        // The correct endpoint is /applications/jobs/:jobId/apply based on the backend route
        const response = await api.post(`/applications/jobs/${applicationData.jobId}/apply`, requestData);
        return response;
      } catch (error: any) {
        console.error('Application API error:', error);
        if (error.response?.status === 401) {
          throw new Error('Authorization failed. Please sign in again.');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Application process error:', error);
      throw error;
    }
  },

  // For jobseekers: Get all jobs applied to
  getMyApplications: async () => {
    return api.get('/applications/me');
  },

  // For employers: Get all jobs posted
  getMyJobs: async () => {
    return api.get('/jobs/posted');
  },
  
  // For employers: Change application status
  updateApplicationStatus: async (applicationId: string, status: string) => {
    return api.put(`/applications/${applicationId}/status`, { status });
  },

  // Get detailed information about a specific application
  getApplicationDetails: async (applicationId: string) => {
    return api.get(`/applications/${applicationId}`);
  },

  // For applicants: Delete/cancel an application
  deleteApplication: async (applicationId: string) => {
    return api.delete(`/applications/${applicationId}`);
  }
};

export default jobService; 