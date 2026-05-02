import axios from 'axios';

const getApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL;

  if (!rawUrl) {
    return '/api';
  }

  const trimmedUrl = rawUrl.trim();

  // Handle malformed host-less URLs like ":5000/api"
  if (trimmedUrl.startsWith(':')) {
    return `http://localhost${trimmedUrl}`;
  }

  try {
    // Validate absolute URL format
    // eslint-disable-next-line no-new
    new URL(trimmedUrl);
    return trimmedUrl.replace(/\/$/, '');
  } catch {
    // Fallback to relative API path so Vite proxy can route requests
    return '/api';
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Auth now relies on httpOnly cookie (withCredentials: true).
    // Avoid sending legacy localStorage token headers that may be stale.
    delete config.headers.Authorization;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response && error.response.status === 401) {
      const reqUrl = error.config?.url || '';
      // Session check and login failures must not force a full-page redirect;
      // a stale /auth/me after login was sending users back to "/" or /login.
      const isAuthBootstrap =
        reqUrl.includes('/auth/me') ||
        reqUrl.includes('/auth/login') ||
        reqUrl.includes('/auth/signup');

      localStorage.removeItem('token');
      localStorage.removeItem('user');

      if (!isAuthBootstrap) {
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      const serverMessage = error.response?.data?.message;
      if (serverMessage) {
        console.error(`Access forbidden: ${serverMessage}`);
      } else {
        console.error('Access forbidden');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
