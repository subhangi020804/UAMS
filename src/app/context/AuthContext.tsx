import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_TOKEN = 'token';
const STORAGE_USER = 'user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_USER);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN));
  const [isLoading, setIsLoading] = useState(true);

  const persistAuth = useCallback((newUser: User | null, newToken: string | null) => {
    setUser(newUser);
    setToken(newToken);
    if (newToken) localStorage.setItem(STORAGE_TOKEN, newToken);
    else localStorage.removeItem(STORAGE_TOKEN);
    if (newUser) localStorage.setItem(STORAGE_USER, JSON.stringify(newUser));
    else localStorage.removeItem(STORAGE_USER);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    setUser(JSON.parse(localStorage.getItem(STORAGE_USER) || 'null'));
    setIsLoading(false);
  }, [token]);

  useEffect(() => {
    const handleLogout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem(STORAGE_TOKEN);
      localStorage.removeItem(STORAGE_USER);
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await authApi.login({ email, password });
      if (data.success && data.data?.user && data.data?.token) {
        persistAuth(data.data.user, data.data.token);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    },
    [persistAuth]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const { data } = await authApi.register({ name, email, password });
      if (data.success && data.data?.user && data.data?.token) {
        persistAuth(data.data.user, data.data.token);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    persistAuth(null, null);
    window.dispatchEvent(new Event('auth-logout'));
  }, [persistAuth]);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
