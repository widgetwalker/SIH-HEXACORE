"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizPlayPage from "@/components/learn/tiergame/QuizPlayPage";
import { getQuizLevel } from "@/components/learn/tiergame/quizRegistry";

export default function LearnQuizLevelPage() {
  const params = useParams<{ tierId: string; level: string }>();
  const router = useRouter();
  const tierId = Number(params.tierId);
  const levelNum = Number(params.level);
  const level = getQuizLevel(tierId, levelNum);

  useEffect(() => {
    if (!level) router.replace(`/learn/quiz/${tierId}`);
  }, [level, tierId, router]);

  if (!level) return null;

  return <QuizPlayPage tierId={tierId} level={level} />;
}
