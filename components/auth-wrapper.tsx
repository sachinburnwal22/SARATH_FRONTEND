"use client";

import { useAuth } from "@/lib/auth-context";
import LoginPrompt from "./login-prompt";

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  message: string;
  feature: string;
}

export default function AuthWrapper({ children, title, message, feature }: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-blue"></div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPrompt
        title={title}
        message={message}
        feature={feature}
      />
    );
  }

  // Show authenticated content
  return <>{children}</>;
}
