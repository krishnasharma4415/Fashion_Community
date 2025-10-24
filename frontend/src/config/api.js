// API Configuration for different environments

const getApiUrl = () => {
  // Check if we have an environment variable set
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Default to production backend URL (update this after Render deployment)
  if (import.meta.env.PROD) {
    return 'https://your-backend-url.onrender.com'; // Update this URL after backend deployment
  }
  
  // Development URL
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();
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