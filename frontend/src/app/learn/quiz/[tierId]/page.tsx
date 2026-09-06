"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import QuizLevelSelectPage from "@/components/learn/tiergame/QuizLevelSelectPage";
import { QUIZ_LEVELS_BY_TIER } from "@/components/learn/tiergame/quizRegistry";

export default function LearnQuizTierPage() {
  const params = useParams<{ tierId: string }>();
  const router = useRouter();
  const tierId = Number(params.tierId);
  const levels = QUIZ_LEVELS_BY_TIER[tierId];

  useEffect(() => {
    if (!levels) router.replace("/learn");
  }, [levels, router]);

  if (!levels) return null;

  return <QuizLevelSelectPage tierId={tierId} levels={levels} />;
}
