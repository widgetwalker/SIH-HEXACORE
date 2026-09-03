import { Suspense } from "react";
import LearnPage from "@/components/learn/LearnPage";
export default function Learn() {
  return (
    <Suspense fallback={null}>
      <LearnPage />
    </Suspense>
  );
}
