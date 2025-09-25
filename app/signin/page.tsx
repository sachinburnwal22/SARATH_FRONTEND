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
  const { login, refreshUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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
        console.log("Redirecting to:", next); // Debug log
        
        // Use window.location.href for more reliable redirect
        if (typeof window !== 'undefined') {
          window.location.href = next;
        } else {
          router.push(next);
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      setError("Sign in failed. Please try again.");
    } finally {
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
        { withCredentials: true }
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
      console.error("Google sign-in error:", err.message);
      setError(err.response?.data?.message || "Google sign-in failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-pink-50">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-500 via-green-500 to-pink-500 bg-clip-text text-transparent">
          SARATHI 🤝
        </h1>
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">
          Sign in to your account
        </h2>

        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
            <p>Next: {searchParams.get("next") || "none"}</p>
            <p>Current URL: {currentUrl || "Loading..."}</p>
          </div>
        )}

        {/* Error UI */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password + Show/Hide */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition duration-300 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Sign In"}
          </button>

          {/* Sign in with Google */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full flex items-center cursor-pointer justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 bg-white hover:bg-gray-200 transition duration-300 shadow-sm"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>Sign in with Google</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

