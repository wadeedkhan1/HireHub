import api from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  user_type: 'applicant' | 'recruiter';
}

interface AuthResponse {
  token: {
    id: number;
    type: string;
    message: string;
  };
}

const authService = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', JSON.stringify(response.data.token));
      localStorage.setItem('user', JSON.stringify({
        id: response.data.token.id,
        type: response.data.token.type
      }));
    }
    return response.data;
  },

  // Demo login as applicant
  demoApplicantLogin: async () => {
    const demoCredentials = {
      email: "demo.applicant@example.com",
      password: "demo123"
    };
    return authService.login(demoCredentials);
  },

  // Demo login as recruiter
  demoRecruiterLogin: async () => {
    const demoCredentials = {
      email: "demo.recruiter@example.com",
      password: "demo123"
    };
    return authService.login(demoCredentials);
  },

  // Register user
  register: async (userData: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', JSON.stringify(response.data.token));
      localStorage.setItem('user', JSON.stringify({
        id: response.data.token.id,
        type: response.data.token.type
      }));
    }
    return response.data;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user profile
  getUserProfile: async () => {
    return api.get('/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    return api.put('/users/profile', profileData);
  }
};

export default authService; 