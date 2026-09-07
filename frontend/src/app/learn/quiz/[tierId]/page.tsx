"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizModuleSelectPage from "@/components/learn/tiergame/QuizModuleSelectPage";
import { QUIZ_MODULES_BY_TIER } from "@/components/learn/tiergame/quizRegistry";

export default function LearnQuizTierPage() {
  const params = useParams<{ tierId: string }>();
  const router = useRouter();
  const tierId = Number(params.tierId);
  const modules = QUIZ_MODULES_BY_TIER[tierId];

  useEffect(() => {
    if (!modules) router.replace("/learn");
  }, [modules, router]);

  if (!modules) return null;

  return <QuizModuleSelectPage tierId={tierId} modules={modules} />;
}
