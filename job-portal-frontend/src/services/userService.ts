import api from './api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'jobseeker' | 'employer';
  avatar?: string;
  resume?: string; // URL to resume file (for jobseekers)
  skills?: string[]; // For jobseekers
  experience?: {
    title: string;
    company: string;
    location?: string;
    from: string;
    to?: string;
    current: boolean;
    description?: string;
  }[];
  education?: {
    institution: string;
    degree: string;
    field: string;
    from: string;
    to?: string;
    current: boolean;
  }[];
  companyDetails?: { // For employers
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    description?: string;
    logo?: string;
  };
}

const userService = {
  // Get current user profile
  getProfile: async () => {
    return api.get<UserProfile>('/users/profile');
  },
  
  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>) => {
    return api.put<UserProfile>('/users/profile', profileData);
  },
  
  // Upload resume (for jobseekers)
  uploadResume: async (formData: FormData) => {
    return api.post<{ resumeUrl: string }>('/users/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Upload profile picture/avatar
  uploadAvatar: async (formData: FormData) => {
    return api.post<{ avatarUrl: string }>('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Upload company logo (for employers)
  uploadCompanyLogo: async (formData: FormData) => {
    return api.post<{ logoUrl: string }>('/users/upload-company-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  // Add work experience (for jobseekers)
  addExperience: async (experienceData: UserProfile['experience'][0]) => {
    return api.post<UserProfile>('/users/experience', experienceData);
  },
  
  // Delete work experience (for jobseekers)
  deleteExperience: async (experienceId: string) => {
    return api.delete(`/users/experience/${experienceId}`);
  },
  
  // Add education (for jobseekers)
  addEducation: async (educationData: UserProfile['education'][0]) => {
    return api.post<UserProfile>('/users/education', educationData);
  },
  
  // Delete education (for jobseekers)
  deleteEducation: async (educationId: string) => {
    return api.delete(`/users/education/${educationId}`);
  },
  
  // Update company details (for employers)
  updateCompanyDetails: async (companyData: UserProfile['companyDetails']) => {
    return api.put<UserProfile>('/users/company-details', companyData);
  },
  
  // Get public profile of a user
  getPublicProfile: async (userId: string) => {
    return api.get<Omit<UserProfile, 'email' | 'phone'>>(`/users/profile/${userId}`);
  },
  
  // For admin: Get all users
  getAllUsers: async (page = 1, limit = 10) => {
    return api.get('/admin/users', { params: { page, limit } });
  },
  
  // For admin: Update user role
  updateUserRole: async (userId: string, role: string) => {
    return api.put(`/admin/users/${userId}/role`, { role });
  }
};

export default userService; 