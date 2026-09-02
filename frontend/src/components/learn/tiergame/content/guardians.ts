import type { TierModuleContent } from "../types";

/* SafeZone — Guardians Tier (Ages 11–13), Module 1.
   Content transcribed verbatim from guardians-age-11-13.pdf. */
export const GUARDIANS_MODULE_1: TierModuleContent = {
  id: "guardians-m1",
  number: 1,
  name: "Earthquake: Drop, Cover, Hold On",
  type: "interactive",
  estMinutes: 11,
  icon: "🌍",
  sections: [
    {
      id: "guardians-m1-s1",
      number: 1,
      title: "The Moment It Starts",
      estMinutes: 3,
      body: [
        "Picture this: you're at your desk. The floor shakes. Books slide off shelves. This is not a drill anymore — it's happening right now.",
        "Your very first move, no matter what floor you're on: Drop, Cover, and Hold On.",
        "Drop to your hands and knees before the shaking knocks you down.",
        "Cover your head and neck under a sturdy desk or table. If there's no cover, crouch next to an interior wall, away from windows.",
        "Hold On to the furniture you're under so it doesn't shift away from you.",
        "Do not run for the stairs while the building is still shaking. Most injuries happen from people falling or being hit by falling objects while trying to move.",
      ],
    },
    {
      id: "guardians-m1-s2",
      number: 2,
      title: "After the Shaking Stops",
      estMinutes: 3,
      body: [
        "The shaking has stopped. Before you move, check three things:",
        "1. Is anyone near you hurt?",
        "2. Is there smoke, a gas smell, or visible damage to the walls/ceiling?",
        "3. Has an adult, alarm, or official instruction told you to evacuate?",
        "If evacuation is called for, use the staircase your floor plan marks as safe — never the lift. Lifts can stop working or open onto a damaged floor.",
      ],
    },
    {
      id: "guardians-m1-s3",
      number: 3,
      title: "Floor-by-Floor Reality Check",
      estMinutes: 3,
      body: [
        "Your evacuation looks different depending on where you are:",
        "Ground floor: your exit is closest, but it might still be blocked by debris — don't assume it's automatically clear.",
        "Middle floors (1st–3rd): check the staircase for cracks or debris before stepping onto it. If it looks damaged, don't test it — use the other one.",
        "Top floors (4th–5th): expect more time and possible aftershocks. Move steadily, don't sprint, and stay together with your group.",
      ],
    },
    {
      id: "guardians-m1-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario:
          "You're on the 3rd floor. Shaking has stopped. The main staircase has a visible crack running through one step. The second staircase looks undamaged.",
        correct: {
          label: "Use the second, undamaged staircase — never \"test\" a stair that shows visible damage.",
          explanation:
            "A damaged structure doesn't announce when it will fail completely. If it looks wrong, treat it as unsafe.",
        },
        wrong: {
          label: "Step carefully over the crack because it's the closer stair.",
          explanation:
            "Visible damage means the stair's true condition is unknown — stepping on it is a gamble, not a shortcut.",
        },
        keyRule: "A damaged structure doesn't announce when it will fail completely. If it looks wrong, treat it as unsafe.",
      },
    },
  ],
};

export const GUARDIANS_MODULE_2: TierModuleContent = {
  id: "guardians-m2",
  number: 2,
  name: "Fire Evacuation: The PASS Method & Smart Exits",
  type: "simulation",
  estMinutes: 12,
  icon: "🔥",
  sections: [
    {
      id: "guardians-m2-s1",
      number: 1,
      title: "Alarm Just Sounded",
      estMinutes: 2,
      body: [
        "You hear the fire alarm. You don't know yet where the fire is. Your job right now isn't to find out — it's to move toward a safe exit calmly and quickly.",
      ],
    },
    {
      id: "guardians-m2-s2",
      number: 2,
      title: "Checking Your Exit",
      estMinutes: 3,
      body: [
        "Before you commit to a staircase:",
        "Touch the door with the back of your hand near the top. If it's hot, do not open it — the fire may be right on the other side.",
        "If you open it and see smoke, stay low (smoke rises, cleaner air is near the floor) and look for a second route.",
        "Never walk into smoke thinking you can \"hold your breath through it.\" Smoke disorients people fast.",
      ],
    },
    {
      id: "guardians-m2-s3",
      number: 3,
      title: "Floor-Specific Scenarios",
      estMinutes: 4,
      body: [
        "You're on the ground floor, fire started on your floor: leave immediately by the nearest clear exit. Don't go back for bags or phones.",
        "You're on the 1st or 2nd floor, fire is below you: check your designated staircase for smoke before committing. If it's smoke-filled, use the alternate staircase.",
        "You're on the 4th or 5th floor: you have the longest evacuation, so move the moment the alarm is confirmed real. If your first-choice staircase has smoke, switch immediately — don't wait to \"see if it clears.\"",
      ],
    },
    {
      id: "guardians-m2-s4",
      number: 4,
      title: "The PASS Method (only for small, contained fires, and only if trained)",
      estMinutes: 2,
      body: [
        "Pull the pin. Aim low at the base of the fire. Squeeze the handle. Sweep side to side.",
        "This is only for a small fire you're trained to handle. If the fire is spreading, or you're not trained, skip this — evacuate and let responders handle it.",
      ],
    },
    {
      id: "guardians-m2-s5",
      number: 5,
      title: "Decision Checkpoint",
      estMinutes: 1,
      body: [],
      checkpoint: {
        scenario: "Fire alarm sounds. Your floor's staircase door is warm to the touch.",
        correct: {
          label: "Do not open it. Use the alternate exit, or if none exists, shelter in a room away from the heat source and call for help.",
          explanation: "A warm door means fire may be on the other side — opening it can feed the fire and expose you directly.",
        },
        wrong: {
          label: "Open it quickly and see how bad it is.",
          explanation: "Opening a heat-warmed door can cause a rapid flashover the moment fresh air reaches the fire.",
        },
      },
    },
  ],
};

export const GUARDIANS_MODULE_3: TierModuleContent = {
  id: "guardians-m3",
  number: 3,
  name: "Floor-by-Floor Hazard Mapping",
  type: "interactive",
  estMinutes: 10,
  icon: "🗺️",
  sections: [
    {
      id: "guardians-m3-s1",
      number: 1,
      title: "Know Your Building Before You Need To",
      estMinutes: 4,
      body: [
        "Every floor has: a primary exit, a secondary exit, and an assembly point outside. Before any emergency, you should be able to answer:",
        "Where are both staircases on my floor?",
        "Where do I go once outside?",
        "Is there a spot on my floor I could shelter in if both exits were blocked?",
      ],
    },
    {
      id: "guardians-m3-s2",
      number: 2,
      title: "Reading a Blocked Route",
      estMinutes: 3,
      body: [
        "A route counts as \"blocked\" if it has: visible fire, smoke, standing water, structural damage (cracks, collapsed sections), or a crowd that has stopped moving entirely.",
        "If you see any of these, that route is closed to you — full stop, find the other one.",
      ],
    },
    {
      id: "guardians-m3-s3",
      number: 3,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "You're on the 2nd floor. Staircase A is clear. Staircase B has smoke drifting from underneath the door.",
        correct: {
          label: "Use Staircase A. Tell others near you that B is unsafe as you move.",
          explanation: "Smoke under a door means the route is already compromised — no need to confirm further before ruling it out.",
        },
        wrong: {
          label: "Check Staircase B \"just to see how bad it is\" before deciding.",
          explanation: "Any visible smoke already meets the definition of a blocked route — there's nothing useful to learn by getting closer.",
        },
      },
    },
  ],
};
