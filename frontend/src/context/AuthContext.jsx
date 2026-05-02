import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api, {
  clearStoredAuthToken,
  setStoredAuthToken,
  getStoredAuthToken
} from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const bootstrapGeneration = useRef(0);

  // Bootstrap auth (ignore stale /auth/me after login or StrictMode remount)
  useEffect(() => {
    const generation = ++bootstrapGeneration.current;

    const initAuth = async () => {
      const path = (location.pathname || '/').replace(/\/$/, '') || '/';
      const onPublicAuth = path === '/login' || path === '/signup';
      const atRoot = path === '/';
      const hasBearer = Boolean(getStoredAuthToken());
      // No client JWT: skip /auth/me on login/signup/root so DevTools does not show
      // a spurious 401 before redirect to login. httpOnly cookie sessions are still
      // validated when opening any other route (e.g. /dashboard).
      if ((onPublicAuth || atRoot) && !hasBearer) {
        if (generation !== bootstrapGeneration.current) return;
        setUser(null);
        setLoading(false);
        return;
      }

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
  }, [location.pathname]);

  // LOGIN
  const login = async (email, password) => {
    bootstrapGeneration.current += 1;
    try {
      const res = await api.post('/auth/login', { email, password });

      const userData = res.data?.user;
      const token = res.data?.token;
      if (token) setStoredAuthToken(token);

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
      if (token) setStoredAuthToken(token);
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