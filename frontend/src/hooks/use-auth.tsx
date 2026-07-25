'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { auth } from '@/lib/auth';
import { User } from '@/types';

interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (data: any) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = auth.getToken();
      if (token) {
        try {
          const response = await auth.getMe();
          setUser(response.user);
        } catch {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await auth.login(email, password);
    setUser(response.user);
    return response;
  }, []);

  const register = useCallback(async (data: any) => {
    const response = await auth.register(data);
    setUser(response.user);
    return response;
  }, []);

  const logout = useCallback(async () => {
    await auth.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await auth.getMe();
      setUser(response.user);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
