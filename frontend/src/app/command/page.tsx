import CommandPage from "@/components/command/CommandPage";
import OnboardingGate from "@/components/onboarding/OnboardingGate";
export default function Command() {
  return (
    <OnboardingGate>
      <CommandPage />
    </OnboardingGate>
  );
}
