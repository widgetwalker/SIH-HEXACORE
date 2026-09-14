export interface MitraGameStateContext {
  status: "running" | "won" | "lost";
  time: number;
  oxygen: number;
  panic: number;
  crouching: boolean;
  breathing: boolean;
  score: number;
}

export interface MitraContext {
  phase: "briefing" | "running" | "ended";
  scenario?: { name: string; hazardLabel: string; brief: string };
  gameState?: MitraGameStateContext | null;
}

/**
 * Deterministic NDMA/NFPA/NDRF grounded crisis safety advisor.
 * Provides sub-5ms expert responses under emergency conditions without network dependencies.
 */
export function localMitraReply(message: string, context?: MitraContext): string {
  const q = message.toLowerCase().trim();

  /* 1. Critical telemetry triage */
  if (context?.gameState) {
    const gs = context.gameState;
    if (gs.oxygen < 25) {
      return "Oxygen is dangerously low! Hold SHIFT to crawl beneath the smoke and move toward the exit beacon now.";
    }
    if (gs.panic > 75) {
      return "Panic level critical! Stop immediately and hold B for Box-Breathing (4s inhale, 4s hold, 4s exhale) to regain control.";
    }
    if (gs.oxygen < 40) {
      return "Smoke layer is descending. Stay low to the ground with SHIFT to conserve oxygen.";
    }
    if (gs.panic > 50) {
      return "You are panicking. Step back from hazards and hold B for box-breathing before moving.";
    }
  }

  /* 2. Hazard specific protocols */
  if (q.includes("earthquake") || q.includes("quake") || q.includes("shake") || q.includes("tremor")) {
    if (q.includes("after") || q.includes("stop") || q.includes("over")) {
      return "When shaking stops: check for structural cracks, avoid elevators, and proceed via stairwells to open muster grounds.";
    }
    return "Drop, Cover, and Hold On! Take cover under a sturdy desk, protect your head and neck, and stay away from glass windows.";
  }

  if (q.includes("fire") || q.includes("smoke") || q.includes("burn") || q.includes("flame")) {
    if (q.includes("smoke") || q.includes("breathe") || q.includes("breath")) {
      return "Smoke rises to the ceiling. Crawl on hands and knees where air is cleaner, and cover your mouth with a damp cloth.";
    }
    if (q.includes("door")) {
      return "Feel the door surface with the back of your hand. If hot, DO NOT open it — seal gaps and locate an alternate exit route.";
    }
    return "Activate the nearest manual fire alarm, crawl low under smoke, and evacuate via emergency stairwells. Never use elevators.";
  }

  if (q.includes("flood") || q.includes("water") || q.includes("rain") || q.includes("drown")) {
    return "Move immediately to higher floors or high ground. Never attempt to walk or drive through flowing water.";
  }

  if (q.includes("cyclone") || q.includes("storm") || q.includes("wind") || q.includes("hurricane")) {
    return "Shelter in an interior room on the ground floor away from glass windows and exterior walls until official all-clear.";
  }

  if (q.includes("gas") || q.includes("leak") || q.includes("smell") || q.includes("lpg")) {
    return "Do NOT operate any electrical switches or open flames. Open windows if safe and evacuate to outdoor assembly grounds.";
  }

  if (q.includes("chemical") || q.includes("spill") || q.includes("toxic") || q.includes("acid")) {
    return "Move immediately upwind and uphill from the chemical source. Cover your nose and mouth and avoid skin contact.";
  }

  if (q.includes("exit") || q.includes("evacuate") || q.includes("escape") || q.includes("where") || q.includes("door")) {
    return "Follow the green exit directional signs to the nearest illuminated stairwell. Doors act as firebreaks until opened.";
  }

  if (q.includes("assembly") || q.includes("muster") || q.includes("safe")) {
    return "Proceed to the outdoor sports field or primary campus assembly point. Line up by class for the warden roll-call.";
  }

  if (q.includes("box") || q.includes("breath") || q.includes("calm") || q.includes("panic")) {
    return "Hold the B key to practice Box-Breathing: Inhale for 4s, Hold for 4s, Exhale for 4s, Hold for 4s. Your panic will drop.";
  }

  if (q.includes("crouch") || q.includes("crawl") || q.includes("shift") || q.includes("low")) {
    return "Hold the SHIFT key to drop into a low crawl. This preserves your oxygen meter when moving through smoke corridors.";
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("help") || q.includes("mitra")) {
    return "I am Mitra, your crisis safety companion. I am monitoring your telemetry — ask me for exit guidance, hazard protocols, or panic recovery.";
  }

  /* Default safe advice */
  return "Keep moving toward the green emergency exit beacons. Stay low beneath smoke and avoid active hazard zones.";
}
