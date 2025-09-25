"use client";

import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";

export default function DebugRedirect() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Debug Redirect Information</h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded">
            <h2 className="font-bold text-blue-800">URL Parameters:</h2>
            <p><strong>Next:</strong> {searchParams.get("next") || "none"}</p>
            <p><strong>All params:</strong> {searchParams.toString() || "none"}</p>
          </div>

          <div className="bg-green-50 p-4 rounded">
            <h2 className="font-bold text-green-800">Authentication Status:</h2>
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
            <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "null"}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded">
            <h2 className="font-bold text-yellow-800">Current URL:</h2>
            <p>{currentUrl || "Loading..."}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded">
            <h2 className="font-bold text-purple-800">Test Links:</h2>
            <div className="space-y-2">
              <a href="/communication" className="block bg-blue-500 text-white p-2 rounded text-center hover:bg-blue-600">
                Test Communication (should redirect to login if not authenticated)
              </a>
              <a href="/education" className="block bg-green-500 text-white p-2 rounded text-center hover:bg-green-600">
                Test Education (should redirect to login if not authenticated)
              </a>
              <a href="/signin?next=/communication" className="block bg-orange-500 text-white p-2 rounded text-center hover:bg-orange-600">
                Test Sign In with next=/communication
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
