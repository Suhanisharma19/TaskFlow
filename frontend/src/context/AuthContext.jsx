import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api, { AUTH_TOKEN_KEY, clearStoredAuthToken } from '../services/api';

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
  const bootstrapGeneration = useRef(0);

  // Bootstrap auth (ignore stale /auth/me after login or StrictMode remount)
  useEffect(() => {
    const generation = ++bootstrapGeneration.current;

    const initAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        if (generation !== bootstrapGeneration.current) return;
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch {
        if (generation !== bootstrapGeneration.current) return;
        setUser(null);
      } finally {
        if (generation === bootstrapGeneration.current) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => {
      bootstrapGeneration.current += 1;
    };
  }, []);

  // LOGIN
  const login = async (email, password) => {
    bootstrapGeneration.current += 1;
    try {
      const res = await api.post('/auth/login', { email, password });

      const userData = res.data?.user;
      const token = res.data?.token;
      if (token) {
        try {
          sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch {
          /* ignore */
        }
      }

      if (!userData) {
        return { success: false, message: 'Invalid response from server' };
      }

      setUser(userData);

      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const signup = async (data) => {
    bootstrapGeneration.current += 1;
    try {
      const res = await api.post('/auth/signup', data);

      const userData = res.data?.user;
      const token = res.data?.token;
      if (token) {
        try {
          sessionStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch {
          /* ignore */
        }
      }
      if (userData) {
        setUser(userData);
      }

      return { success: true, user: userData };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Signup failed'
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      clearStoredAuthToken();
      setUser(null);
    }
  };

  const isAdmin = () => user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        isAdmin,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};