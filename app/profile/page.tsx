"use client";

import LearnerProfile from "@/components/learner-profile";
import AuthWrapper from "@/components/auth-wrapper";

export default function ProfilePage() {
  return (
    <AuthWrapper
      title="Access Your Profile"
      message="Sign in to view your learning progress, achievements, and personalized dashboard."
      feature="profile"
    >
      <LearnerProfile />
    </AuthWrapper>
  );
}
