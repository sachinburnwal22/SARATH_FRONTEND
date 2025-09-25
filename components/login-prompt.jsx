"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function LoginPrompt({ title, message, feature }) {
  const [nextPath, setNextPath] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setNextPath(window.location.pathname || "/");
    }
  }, []);

  const signinUrl = useMemo(() => {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5173';
    const url = new URL(`${authUrl}/signin`);
    url.searchParams.set("next", nextPath);
    return url.toString();
  }, [nextPath]);

  const signupUrl = useMemo(() => {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5173';
    const url = new URL(`${authUrl}/signup`);
    url.searchParams.set("next", nextPath);
    return url.toString();
  }, [nextPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-blue/10 via-mint-green/10 to-coral-pink/10 p-6">
      <div className="max-w-xl w-full bg-white/90 backdrop-blur rounded-3xl border-2 border-sunny-yellow/30 shadow-xl p-8 animate-fade-in-up">
        <div className="text-center space-y-3 mb-6">
          <h1 className="font-heading text-3xl font-bold text-gray-800">{title}</h1>
          <p className="font-body text-gray-600">{message}</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <a
            href={signinUrl}
            className="px-6 py-3 rounded-xl bg-sky-blue text-white font-medium shadow hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            Sign In
          </a>
          <a
            href={signupUrl}
            className="px-6 py-3 rounded-xl bg-mint-green text-white font-medium shadow hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
          >
            Sign Up
          </a>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          You need an account to access {feature}.
        </p>
      </div>
    </div>
  );
}


