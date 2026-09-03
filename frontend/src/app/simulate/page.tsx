import { Suspense } from "react";
import SimulatePage from "@/components/simulate/SimulatePage";
export default function Simulate() {
  return (
    <Suspense fallback={null}>
      <SimulatePage />
    </Suspense>
  );
}
