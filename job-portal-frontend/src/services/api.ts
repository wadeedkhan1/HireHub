import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Base URL matches the endpoint
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Auth token available:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request details for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
    return config;
  },
  (error) => {
    console.error('API Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response [${response.status}]:`, response.data);
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc.)
    console.error('API Response error:', error);
    
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        // Handle unauthorized
        console.warn('Unauthorized request - clearing auth data');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login if needed
      }
    }
    return Promise.reject(error);
  }
);

export default api; 