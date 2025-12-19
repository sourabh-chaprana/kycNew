const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to set auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

// Helper function to remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

// Base fetch function with error handling
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Handle error response
      const errorMessage = data.message || data.errors?.[0]?.msg || 'An error occurred';
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Handle network errors or other errors
    if (error.message) {
      throw error;
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// API methods
export const api = {
  // Auth endpoints
  auth: {
    register: async (userData) => {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    },
    
    login: async (credentials) => {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    },
    
    getMe: async () => {
      return apiRequest('/auth/me', {
        method: 'GET',
      });
    },
  },
};

export default api;

