"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from './api-client';

interface User {
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(false);
  const [lastAuthCheck, setLastAuthCheck] = useState<number>(0);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const refreshUser = async () => {
    const now = Date.now();
    // Prevent calls more frequent than every 5 seconds
    if (isCheckingAuth || (now - lastAuthCheck < 5000)) return;
    
    setIsCheckingAuth(true);
    setLastAuthCheck(now);
    try {
      const response = await apiClient.get('/api/user/current');
      console.log('Refresh user successful:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Refresh user failed:', error);
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post('/api/auth/signin', { email, password });
      console.log('Login successful:', response.data);
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call backend logout
      await apiClient.get('/api/auth/signout');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state
      setUser(null);
      
      // Force redirect to home page
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const checkAuth = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        await refreshUser();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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
