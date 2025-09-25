"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuth } from "@/lib/auth-context";

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, refreshUser, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isRedirecting) {
      const next = searchParams.get("next") || "/";
      console.log("User already authenticated, redirecting to:", next);
      
      // Prevent redirect loop - if next is the same as current path, go to home
      const currentPath = window.location.pathname;
      const targetPath = decodeURIComponent(next);
      
      if (targetPath === currentPath || targetPath === "/signin") {
        console.log("Preventing redirect loop, going to home instead");
        setIsRedirecting(true);
        window.location.href = "/";
      } else {
        setIsRedirecting(true);
        window.location.href = next;
      }
    }
  }, [isAuthenticated, isLoading, searchParams, isRedirecting]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-blue"></div>
      </div>
    );
  }

  // Show loading while redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Normal Signin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await login(form.email, form.password);
      if (success) {
        setError("");
        // Get the next parameter from URL
        const next = searchParams.get("next") || "/";
        console.log("Login successful, redirecting to:", next); // Debug log
        
        // Add a small delay to ensure auth state is updated
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.location.href = next;
          } else {
            router.push(next);
          }
        }, 100);
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Sign in failed. Please try again.");
      setLoading(false);
    }
  };

  // Google Signin
  const handleGoogleAuth = async () => {
    try {
      // Check if Firebase is properly configured
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        setError("Firebase is not configured. Please set up Firebase environment variables.");
        return;
      }

      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const email = result?.user?.email;
      const fullName = result?.user?.displayName;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${baseUrl}/api/auth/google-auth`,
        { fullName, email },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setError("");
      await refreshUser(); // Refresh user data in context
      const next = searchParams.get("next") || "/";
      console.log("Google auth redirecting to:", next); // Debug log
      
      // Use window.location.href for more reliable redirect
      if (typeof window !== 'undefined') {
        window.location.href = next;
      } else {
        router.push(next);
      }
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("Google sign in failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue/10 via-mint-green/10 to-coral-pink/10 p-6">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white/90 backdrop-blur rounded-3xl border-2 border-sunny-yellow/30 shadow-xl p-8 animate-fade-in-up">
          <div className="text-center space-y-3 mb-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-mint-green to-sky-blue rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-mint-green to-sky-blue bg-clip-text text-transparent">
                SARATHI
              </h1>
            </div>
            <h2 className="font-heading text-2xl font-bold text-gray-800">Sign in to your account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-blue focus:outline-none transition-colors duration-300"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-sky-blue focus:outline-none transition-colors duration-300 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-sky-blue hover:text-sky-blue/80 transition-colors duration-300"
              >
                Forgot Password?
              </Link>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-blue to-mint-green text-white font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <ClipLoader color="#ffffff" size={20} />
                  <span>Signing In...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="mt-4 w-full bg-white border-2 border-gray-200 text-gray-700 font-medium py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-sky-blue hover:text-sky-blue/80 font-medium transition-colors duration-300"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}