// API Configuration for different environments

const getBaseApiUrl = () => {
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to production backend URL
  if (import.meta.env.PROD) {
    return 'https://fashion-community-backend.onrender.com';
  }
  
  // Development URL
  return 'http://localhost:5000';
};

export const API_BASE_URL = getBaseApiUrl();

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

// Helper function to get media URL (for images)
export const getApiMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url; // Cloudinary URLs
  return `${API_BASE_URL}${url}`; // Legacy local URLs
};

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}/api/auth`,
  USERS: `${API_BASE_URL}/api/users`,
  POSTS: `${API_BASE_URL}/api/posts`,
  COMMENTS: `${API_BASE_URL}/api/comments`,
  LIKES: `${API_BASE_URL}/api/likes`,
  FOLLOWS: `${API_BASE_URL}/api/follows`,
  RECOMMENDATIONS: `${API_BASE_URL}/api/recommendations`,
  ADMIN: `${API_BASE_URL}/api/admin`
};

console.log('API Base URL:', API_BASE_URL);