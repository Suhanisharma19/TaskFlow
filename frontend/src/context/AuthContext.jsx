import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const bootstrapAuth = async () => {
      // Clear legacy token from earlier auth approach.
      localStorage.removeItem('token');

      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('user');
        }
      }

      const isPublicAuthPage = ['/login', '/signup'].includes(window.location.pathname);
      if (isPublicAuthPage && !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        const authenticatedUser = response.data?.user;
        if (authenticatedUser) {
          setUser(authenticatedUser);
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
        }
      } catch (error) {
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { user } = response.data;
      
      // Keep user profile client-side; auth token is stored in httpOnly cookie by backend
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await api.post('/auth/signup', userData);
      const { user } = response.data;
      
      // Keep user profile client-side; auth token is stored in httpOnly cookie by backend
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true };
    } catch (error) {
      const errors = error.response?.data?.errors || [];
      const message = error.response?.data?.message || errors?.[0]?.msg || 'Signup failed';
      return { success: false, message, errors };
    }
  };

  // Logout function
  const logout = () => {
    api.post('/auth/logout').catch(() => {});
    localStorage.removeItem('user');
    setUser(null);
  };

  // Check if user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
