import api from './api';

export interface RecruiterDashboardData {
  jobsWithApplicantCount: {
    job_id: number;
    title: string;
    total_applicants: number;
  }[];
  recentApplications: {
    application_id: number;
    applicant_name: string;
    job_title?: string;
    status: string;
    date_of_application: string;
  }[];
  notifications?: {
    notification_id: number;
    message: string;
    time_ago?: string;
    created_at?: string;
    read?: boolean;
    is_read?: number;
  }[];
}

export interface ApplicantDashboardData {
  myApplications?: {
    application_id: number;
    job_title: string;
    status: string;
    date_of_application: string;
    company_name?: string;
    deadline?: string;
  }[];
  recentApplications?: {
    application_id: number;
    job_title: string;
    status: string;
    date_of_application: string;
    company_name?: string;
    deadline?: string;
  }[];
  recentJobs?: {
    job_id: number;
    title: string;
    category?: string;
    location: string;
    salary?: number;
    date_of_posting?: string;
  }[];
  savedJobs?: {
    job_id: number;
    title: string;
    company?: string;
    company_name?: string;
    location: string;
    job_type?: string;
    deadline?: string;
  }[];
  notifications?: {
    message: string;
    is_read: number;
    created_at: string;
  }[];
}

// Define a union type for any dashboard response
export type DashboardData = RecruiterDashboardData | ApplicantDashboardData;

// Type guard to check if the data is for a recruiter
export function isRecruiterDashboard(data: DashboardData): data is RecruiterDashboardData {
  return 'jobsWithApplicantCount' in data;
}

// Type guard to check if the data is for an applicant
export function isApplicantDashboard(data: DashboardData): data is ApplicantDashboardData {
  return 'myApplications' in data || 'recentJobs' in data || 'savedJobs' in data;
}

const dashboardService = {
  // Get recruiter dashboard data
  getRecruiterDashboard: async (userId: number): Promise<RecruiterDashboardData> => {
    try {
      // Use the users/:id/dashboard endpoint from the backend
      const response = await api.get<RecruiterDashboardData>(`/users/${userId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recruiter dashboard:', error);
      throw error;
    }
  },

  // Get applicant dashboard data
  getApplicantDashboard: async (userId: number): Promise<ApplicantDashboardData> => {
    try {
      // Use the users/:id/dashboard endpoint from the backend
      const response = await api.get<ApplicantDashboardData>(`/users/${userId}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching applicant dashboard:', error);
      throw error;
    }
  },

  // Get dashboard data based on user type
  getDashboard: async (userId: number, userType: string): Promise<DashboardData> => {
    if (userType === 'recruiter') {
      return dashboardService.getRecruiterDashboard(userId);
    } else {
      return dashboardService.getApplicantDashboard(userId);
    }
  }
};

export default dashboardService; 