import { Suspense } from "react";
import SimulatePage from "@/components/simulate/SimulatePage";
import OnboardingGate from "@/components/onboarding/OnboardingGate";
export default function Simulate() {
  return (
    <OnboardingGate>
      <Suspense fallback={null}>
        <SimulatePage />
      </Suspense>
    </OnboardingGate>
  );
}
