"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizLevelSelectPage from "@/components/learn/tiergame/QuizLevelSelectPage";
import { getQuizModule } from "@/components/learn/tiergame/quizRegistry";

export default function LearnQuizModulePage() {
  const params = useParams<{ tierId: string; moduleId: string }>();
  const router = useRouter();
  const tierId = Number(params.tierId);
  const quizModule = getQuizModule(tierId, params.moduleId);

  useEffect(() => {
    if (!quizModule) router.replace(`/learn/quiz/${tierId}`);
  }, [quizModule, tierId, router]);

  if (!quizModule) return null;

  return <QuizLevelSelectPage tierId={tierId} module={quizModule} />;
}
