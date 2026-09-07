"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizPlayPage from "@/components/learn/tiergame/QuizPlayPage";
import { getQuizLevel, getQuizModule } from "@/components/learn/tiergame/quizRegistry";

export default function LearnQuizLevelPage() {
  const params = useParams<{ tierId: string; moduleId: string; level: string }>();
  const router = useRouter();
  const tierId = Number(params.tierId);
  const levelNum = Number(params.level);
  const quizModule = getQuizModule(tierId, params.moduleId);
  const level = getQuizLevel(tierId, params.moduleId, levelNum);

  useEffect(() => {
    if (!quizModule || !level) router.replace(`/learn/quiz/${tierId}`);
  }, [quizModule, level, tierId, router]);

  if (!quizModule || !level) return null;

  return <QuizPlayPage tierId={tierId} moduleId={quizModule.moduleId} moduleName={quizModule.name} level={level} />;
}
