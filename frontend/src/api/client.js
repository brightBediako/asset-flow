import axios from 'axios';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL,
  withCredentials: true, // Required for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        // Prevent redirect loops on login page
        if (!window.location.pathname.includes('/login')) {
          const redirectUrl = window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl)}`;
        }
      }

      // Friendly backend errors
      const message = response.data?.message || response.data?.error || 'An unexpected error occurred';
      
      // We don't want to show toasts for some errors (e.g. 401s handled by redirect)
      if (response.status !== 401) {
        toast.error(message);
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
