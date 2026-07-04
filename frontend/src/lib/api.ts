import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'|| "https://medcare-appointment-system-1.onrender.com/api",
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to dynamically inject x-secret-key if saved in local storage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const secretKey = localStorage.getItem('medcare_admin_secret_key');
      if (secretKey) {
        config.headers['x-secret-key'] = secretKey;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor to unwrap global ApiResponse wrapper
api.interceptors.response.use(
  (response) => {
    return response.data; // Returns { success, message, data } directly
  },
  (error) => {
    const errorResponse = error.response?.data;
    return Promise.reject(errorResponse || { success: false, message: error.message || 'Network Error' });
  }
);

export default api;
