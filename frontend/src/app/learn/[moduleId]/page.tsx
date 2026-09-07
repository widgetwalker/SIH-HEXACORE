"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ModuleReaderPage from "@/components/learn/tiergame/ModuleReaderPage";
import { findModuleTier } from "@/components/learn/tiergame/moduleRegistry";

export default function LearnModulePage() {
  const params = useParams<{ moduleId: string }>();
  const router = useRouter();
  const owner = findModuleTier(params.moduleId);

  useEffect(() => {
    if (!owner) router.replace("/learn");
  }, [owner, router]);

  if (!owner) return null;

  return <ModuleReaderPage module={owner.module} tierId={owner.tierId} moduleShortId={owner.shortId} />;
}
