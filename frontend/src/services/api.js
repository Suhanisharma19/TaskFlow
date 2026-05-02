import axios from 'axios';

/** Session JWT for cross-origin API (Railway) when third-party cookies are blocked. */
export const AUTH_TOKEN_KEY = 'taskflow_jwt';

export const getStoredAuthToken = () => {
  try {
    return (
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      null
    );
  } catch {
    return null;
  }
};

export const setStoredAuthToken = (token) => {
  if (!token) return;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
};

export const clearStoredAuthToken = () => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

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
    try {
      const token = getStoredAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    } catch {
      delete config.headers.Authorization;
    }
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
      // Wrong password must not wipe an existing session token.
      if (reqUrl.includes('/auth/login') || reqUrl.includes('/auth/signup')) {
        return Promise.reject(error);
      }

      const isSessionCheck = reqUrl.includes('/auth/me');

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      clearStoredAuthToken();

      if (!isSessionCheck) {
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
