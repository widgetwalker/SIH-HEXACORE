"use client";

import { useEffect } from "react";
import { applyReducedMotion, loadCadetSettings } from "@/lib/cadetSettings";

/** Applies the saved Reduced Motion setting on every page load, before
 *  the user necessarily visits /profile again. Renders nothing. */
export default function SettingsInit() {
  useEffect(() => {
    applyReducedMotion(loadCadetSettings().reducedMotion);
  }, []);
  return null;
}
