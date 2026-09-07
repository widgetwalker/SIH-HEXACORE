import { Suspense } from "react";
import ProfilePage from "@/components/profile/ProfilePage";
import OnboardingGate from "@/components/onboarding/OnboardingGate";
export default function Profile() {
  return (
    <OnboardingGate>
      <Suspense fallback={null}>
        <ProfilePage />
      </Suspense>
    </OnboardingGate>
  );
}
