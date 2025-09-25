"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import ClipLoader from "react-spinners/ClipLoader";

export default function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    mobileNumber: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Signup handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const result = await axios.post(
        `${baseUrl}/api/auth/signup`,
        {
          fullName: form.fullName,
          email: form.email,
          password: form.password,
          mobileNumber: form.mobileNumber,
          role: form.role,
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setError("");
      setLoading(false);
      const next = searchParams.get("next") || "/";
      router.push(next);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed");
      setLoading(false);
    }
  };

  // Google Auth
  const handleGoogleAuth = async () => {
    try {
      if (!form.mobileNumber) {
        return setError(
          "Please enter your mobile number before signing up with Google."
        );
      }
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const email = result?.user?.email;
      const fullName = result?.user?.displayName;

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${baseUrl}/api/auth/google-auth`,
        {
          fullName,
          mobileNumber: form.mobileNumber,
          email,
          role: form.role,
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const next = searchParams.get("next") || "/";
      router.push(next);
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
          Create your account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

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

          {/* Mobile Number */}
          <input
            type="text"
            name="mobileNumber"
            placeholder="Mobile Number"
            value={form.mobileNumber}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Role Dropdown */}
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="deliveryBoy">Delivery Partner</option>
            <option value="owner">Owner</option>
          </select>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-lg font-semibold hover:shadow-lg transition duration-300 flex items-center justify-center"
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Sign Up"}
          </button>

          {/* Sign up with Google */}
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
            <span>Sign up with Google</span>
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

