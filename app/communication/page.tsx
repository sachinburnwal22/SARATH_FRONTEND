"use client";

import CommunicationInterface from "@/components/communication-interface";
import AuthWrapper from "@/components/auth-wrapper";

export default function CommunicationPage() {
  return (
    <AuthWrapper
      title="Access Communication Tools"
      message="Sign in to access our powerful communication features designed for inclusive interaction."
      feature="communication tools"
    >
      <CommunicationInterface />
    </AuthWrapper>
  );
}
