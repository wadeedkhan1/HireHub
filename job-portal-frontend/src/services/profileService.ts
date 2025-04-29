import api from './api';
import authService from './authService';

// Simple profile interfaces
export interface BaseProfile {
  id: number;
  email: string;
  type: string;
}

export interface RecruiterProfile extends BaseProfile {
  recruiter_id?: number;
  name?: string;
  phone?: string;
  bio?: string;
  type: 'recruiter';
}

export interface JobSeekerProfile extends BaseProfile {
  applicant_id?: number;
  name?: string;
  skills?: string;
  resume?: string;
  profile?: string;
  type: 'jobseeker';
}

export type UserProfile = RecruiterProfile | JobSeekerProfile;

// Type guards
export function isRecruiterProfile(profile: UserProfile): profile is RecruiterProfile {
  return profile.type === 'recruiter';
}

export function isJobSeekerProfile(profile: UserProfile): profile is JobSeekerProfile {
  return profile.type === 'jobseeker';
}

const profileService = {
  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.get<UserProfile>(`/users/${currentUser.id}/profile`);
      return response.data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },
  
  // Update profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        throw new Error('User not authenticated');
      }
      
      const response = await api.put<{message: string, profile: UserProfile}>(
        `/users/${currentUser.id}/profile`,
        profileData
      );
      
      return response.data.profile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default profileService; 