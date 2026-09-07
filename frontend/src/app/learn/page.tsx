import { Suspense } from "react";
import LearnPage from "@/components/learn/LearnPage";
import OnboardingGate from "@/components/onboarding/OnboardingGate";
export default function Learn() {
  return (
    <OnboardingGate>
      <Suspense fallback={null}>
        <LearnPage />
      </Suspense>
    </OnboardingGate>
  );
}
