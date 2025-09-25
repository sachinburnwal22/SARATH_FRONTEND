"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestLogin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      const hasToken = document.cookie
        .split(";")
        .some((c) => c.trim().startsWith("token="));
      setIsAuthenticated(hasToken);
    };

    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 via-green-500 to-pink-500 bg-clip-text text-transparent">
          Login Test Page
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Authentication Status */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Authentication Status</h2>
            <div className={`p-4 rounded-lg ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isAuthenticated ? '✅ Authenticated' : '❌ Not Authenticated'}
            </div>
            <p className="mt-4 text-gray-600">
              {isAuthenticated 
                ? 'You are logged in and can access protected routes.' 
                : 'You need to log in to access protected features.'
              }
            </p>
          </div>

          {/* Login Links */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Login Options</h2>
            <div className="space-y-4">
              <Link 
                href="/signin" 
                className="block w-full bg-blue-500 text-white p-3 rounded-lg text-center hover:bg-blue-600 transition duration-300"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="block w-full bg-green-500 text-white p-3 rounded-lg text-center hover:bg-green-600 transition duration-300"
              >
                Sign Up
              </Link>
              <Link 
                href="/forgot-password" 
                className="block w-full bg-orange-500 text-white p-3 rounded-lg text-center hover:bg-orange-600 transition duration-300"
              >
                Forgot Password
              </Link>
            </div>
          </div>

          {/* Protected Routes Test */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Protected Routes Test</h2>
            <div className="space-y-4">
              <Link 
                href="/communication" 
                className="block w-full bg-purple-500 text-white p-3 rounded-lg text-center hover:bg-purple-600 transition duration-300"
              >
                Communication
              </Link>
              <Link 
                href="/education" 
                className="block w-full bg-indigo-500 text-white p-3 rounded-lg text-center hover:bg-indigo-600 transition duration-300"
              >
                Education
              </Link>
              <Link 
                href="/profile" 
                className="block w-full bg-pink-500 text-white p-3 rounded-lg text-center hover:bg-pink-600 transition duration-300"
              >
                Profile
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              These routes require authentication. If not logged in, you'll be redirected to sign in.
            </p>
          </div>

          {/* Environment Variables Check */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>API URL:</span>
                <span className={process.env.NEXT_PUBLIC_API_URL ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_API_URL ? '✅ Set' : '❌ Not Set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Firebase API Key:</span>
                <span className={process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Not Set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auth URL:</span>
                <span className={process.env.NEXT_PUBLIC_AUTH_URL ? 'text-green-600' : 'text-red-600'}>
                  {process.env.NEXT_PUBLIC_AUTH_URL ? '✅ Set' : '❌ Not Set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-block bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
