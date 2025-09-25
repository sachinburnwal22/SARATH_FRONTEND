"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleBack = () => {
    if (step === 1) {
      router.push("/signin");
      return;
    }
    if (step > 1) setStep(step - 1);
  };

  // API call to send OTP
  const handleSendOtp = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const result = await axios.post(
        `${baseUrl}/api/auth/send-otp`,
        { email },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("OTP sent:", result.data);
      setError("");
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    }
  };

  // API call to verify OTP
  const handleVerifyOtp = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const result = await axios.post(
        `${baseUrl}/api/auth/verify-otp`,
        { email, otp },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("OTP verified:", result.data);
      setError("");
      setStep(3);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.response?.data?.message || "Failed to verify OTP. Please try again.");
    }
  };

  // API call to reset password
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const result = await axios.post(
        `${baseUrl}/api/auth/reset-password`,
        { email, newPassword },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Password reset successful:", result.data);
      setError("");
      alert("Password reset successful. Please sign in with your new password.");
      router.push("/signin");
    } catch (err) {
      console.error("Error resetting password:", err);
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex w-full items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-green-50 to-pink-50">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 border-2 border-yellow-200">
        <div className="flex items-center mb-6">
          <ArrowLeft
            className="text-2xl text-gray-600 hover:text-blue-500 cursor-pointer"
            onClick={handleBack}
          />
          <h1 className="text-3xl font-bold text-center flex-1 bg-gradient-to-r from-blue-500 via-green-500 to-pink-500 bg-clip-text text-transparent">
            Forgot Password
          </h1>
        </div>

        {/* Error UI */}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-lg">
            {error}
          </div>
        )}

        {/* Step content */}
        {step === 1 && (
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-lg hover:shadow-lg transition duration-300"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="mb-3 text-gray-600 text-sm">
              Enter the OTP sent to <span className="font-medium">{email}</span>
            </p>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setOtp(e.target.value)}
              value={otp}
            />
            <button
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-lg hover:shadow-lg transition duration-300"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
            <button
              className="mt-4 w-full bg-gradient-to-r from-blue-500 to-green-500 text-white p-3 rounded-lg hover:shadow-lg transition duration-300"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

