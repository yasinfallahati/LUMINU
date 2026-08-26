import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authApi, ApiError } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lumio_token');
    if (token) {
      authApi.getMe()
        .then(({ user }) => setUser(user))
        .catch(() => localStorage.removeItem('lumio_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token, user } = await authApi.login(email, password);
      localStorage.setItem('lumio_token', token);
      setUser(user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      const { token, user } = await authApi.register(userData);
      localStorage.setItem('lumio_token', token);
      setUser(user);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lumio_token');
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      const { user: updatedUser } = await authApi.updateMe(userData);
      setUser(updatedUser);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
