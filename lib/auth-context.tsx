"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

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

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const refreshUser = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/user/current`, {
        withCredentials: true,
      });
      console.log('Refresh user successful:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Refresh user failed:', error);
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
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
      await axios.get(`${baseUrl}/api/auth/signout`, { 
        withCredentials: true 
      });
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
    const checkAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    checkAuth();
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
