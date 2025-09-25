"use client";

import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export default function TestAuth() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleLogout = async () => {
    console.log('Manual logout triggered');
    await logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-blue/10 via-mint-green/10 to-coral-pink/10 p-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <h1 className="text-3xl font-heading font-bold text-gray-800 mb-8">
            Authentication Test Page
          </h1>

          <div className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">Current Auth State:</h2>
              <p><strong>isLoading:</strong> {isLoading ? 'true' : 'false'}</p>
              <p><strong>isAuthenticated:</strong> {isAuthenticated ? 'true' : 'false'}</p>
              <p><strong>user:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600"
              >
                Test Logout
              </Button>
              
              <Button 
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Reload Page
              </Button>
            </div>

            <div className="bg-yellow-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Instructions:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Check the auth state above</li>
                <li>If authenticated, try the "Test Logout" button</li>
                <li>Check browser cookies (Application tab → Cookies)</li>
                <li>Look for cookies from sarathi-backend-x0vm.onrender.com</li>
                <li>Check console for any error messages</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
