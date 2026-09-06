import type { TierModuleContent } from "../types";

/* SafeZone — Rangers Tier (Ages 8–10).
   Content transcribed verbatim from safezone-rangers-age-8-10.pdf
   (identical to the Rangers section of safezone-explorers-rangers-modules.pdf). */

export const RANGERS_MODULE_1: TierModuleContent = {
  id: "rangers-m1",
  number: 1,
  name: "Earthquake: Drop, Cover, Hold On",
  type: "interactive",
  estMinutes: 8,
  icon: "🌍",
  sections: [
    {
      id: "rangers-m1-s1",
      number: 1,
      title: "The Moment It Starts",
      estMinutes: 3,
      body: [
        "You're at your desk and the floor starts to shake. Your first move, every time: Drop, Cover, and Hold On.",
        "Drop to your hands and knees before the shaking can knock you down.",
        "Cover your head and neck under a sturdy desk. No desk nearby? Crouch against an interior wall, away from windows.",
        "Hold On to your cover so it doesn't shake away from you.",
        "Never run for the stairs while the building is still shaking — most injuries happen from falling or being hit by falling things, not from the shaking itself.",
      ],
    },
    {
      id: "rangers-m1-s2",
      number: 2,
      title: "After the Shaking Stops",
      estMinutes: 3,
      body: [
        "Before you move, check:",
        "1. Is anyone near you hurt?",
        "2. Do you smell gas or see damage to the walls or ceiling?",
        "3. Has a teacher or the alarm told you to evacuate?",
        "If it's time to evacuate, use the stairs — never the lift. A lift can stop working or open onto a damaged floor.",
      ],
    },
    {
      id: "rangers-m1-s3",
      number: 3,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "The shaking has stopped. Your classroom door won't open easily.",
        correct: {
          label: "Stay calm, try the door gently once more, and if it's stuck, tell your teacher and wait for help — don't force it or panic.",
          explanation: "Staying calm and getting a teacher involved keeps a stuck door from turning into a bigger problem.",
        },
        wrong: {
          label: "Climb out a window to get outside faster.",
          explanation: "Climbing out a window is far more dangerous than a stuck door — wait for help instead.",
          hazardIcon: "🪟",
        },
      },
    },
  ],
};

export const RANGERS_MODULE_2: TierModuleContent = {
  id: "rangers-m2",
  number: 2,
  name: "Fire Evacuation: Smart Exits",
  type: "simulation",
  estMinutes: 8,
  icon: "🔥",
  sections: [
    {
      id: "rangers-m2-s1",
      number: 1,
      title: "Alarm Just Sounded",
      estMinutes: 2,
      body: [
        "You hear the fire alarm. You don't need to know where the fire is — your job is to walk calmly toward your class's exit.",
      ],
    },
    {
      id: "rangers-m2-s2",
      number: 2,
      title: "Checking a Door",
      estMinutes: 2,
      body: [
        "Before opening any door on your way out:",
        "Touch it with the back of your hand. If it's hot, don't open it — find another way.",
        "If you open it and see smoke, get low — clean air is near the floor — and find a different route.",
        "Never walk into smoke, even holding your breath. It disorients people fast.",
      ],
    },
    {
      id: "rangers-m2-s3",
      number: 3,
      title: "What Grown-Ups Do",
      estMinutes: 2,
      body: [
        "You may have seen a fire extinguisher with the letters P-A-S-S on it. That stands for Pull, Aim, Squeeze, Sweep — but that's a tool for trained adults on small, contained fires. Your job is always the same: evacuate and let responders handle the fire.",
      ],
    },
    {
      id: "rangers-m2-s4",
      number: 4,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "The alarm sounds. Your classroom door is warm to the touch.",
        correct: {
          label: "Don't open it — use the alternate exit your teacher points you to.",
          explanation: "A warm door means the fire could be right behind it — take the alternate exit instead.",
        },
        wrong: {
          label: "Open it quickly to see how bad it is.",
          explanation: "Opening a warm door can let fire and smoke rush in fast.",
          hazardIcon: "🚪",
        },
      },
    },
  ],
};

export const RANGERS_MODULE_3: TierModuleContent = {
  id: "rangers-m3",
  number: 3,
  name: "Know Your Building: Exit Mapping",
  type: "interactive",
  estMinutes: 7,
  icon: "🗺️",
  sections: [
    {
      id: "rangers-m3-s1",
      number: 1,
      title: "Two Ways Out",
      estMinutes: 3,
      body: [
        "Every classroom has a primary exit and a backup exit. Before any emergency, you should be able to answer:",
        "Where are both exits from my classroom?",
        "Where does my class meet outside?",
      ],
    },
    {
      id: "rangers-m3-s2",
      number: 2,
      title: "Spotting a Blocked Route",
      estMinutes: 2,
      body: [
        "A route is blocked if you see: fire, smoke, water on the floor, or a crowd that has completely stopped moving. If you see any of these, that way is closed — use the other exit.",
      ],
    },
    {
      id: "rangers-m3-s3",
      number: 3,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "Your class's usual exit hallway has smoke coming from under a door.",
        correct: {
          label: "Use your backup exit and tell your teacher what you saw.",
          explanation: "Smoke under a door means that way is closed — take the backup exit and report it.",
        },
        wrong: {
          label: "Open the door to check how much smoke there is.",
          explanation: "Any smoke already tells you the route is blocked — no need to open the door and check.",
          hazardIcon: "💨",
        },
      },
    },
  ],
};

export const RANGERS_MODULE_4: TierModuleContent = {
  id: "rangers-m4",
  number: 4,
  name: "Chemical Spill: Stay Back, Tell an Adult",
  type: "video-quiz",
  estMinutes: 6,
  icon: "🧪",
  sections: [
    {
      id: "rangers-m4-s1",
      number: 1,
      title: "Something Smells or Looks Wrong",
      estMinutes: 3,
      body: [
        "A strange smell, fumes, or a spilled liquid you don't recognize — in a science room or anywhere else — means one thing: tell an adult right away and step back. Never lean in to sniff or touch it to figure out what it is.",
      ],
    },
    {
      id: "rangers-m4-s2",
      number: 2,
      title: "Decision Checkpoint",
      estMinutes: 3,
      body: [],
      checkpoint: {
        scenario: "You notice a strange smell and a puddle near the sink in the science room.",
        correct: {
          label: "Step away and tell your teacher immediately.",
          explanation: "Stepping away and telling a teacher keeps you safe from something you can't identify.",
        },
        wrong: {
          label: "Get closer to see what spilled.",
          explanation: "Getting closer to an unknown spill risks exposing you to something harmful.",
          hazardIcon: "🧪",
        },
      },
    },
  ],
};

export const RANGERS_MODULE_5: TierModuleContent = {
  id: "rangers-m5",
  number: 5,
  name: "Cyclone & Flood: Stay In, Stay Up",
  type: "interactive",
  estMinutes: 8,
  icon: "🌊",
  sections: [
    {
      id: "rangers-m5-s1",
      number: 1,
      title: "Cyclone: Staying Put Is the Plan",
      estMinutes: 3,
      body: [
        "Unlike a fire, a cyclone means you stay inside, in an interior room away from windows. Never go outside \"to see the storm\" — flying debris is the biggest danger.",
      ],
    },
    {
      id: "rangers-m5-s2",
      number: 2,
      title: "Flood: Never Walk Through Water",
      estMinutes: 3,
      body: [
        "Never walk or wade through moving water, even if it looks shallow — it can hide strong currents or electrical hazards. If water is coming into the ground floor, move up to a higher floor rather than trying to walk out through it.",
      ],
    },
    {
      id: "rangers-m5-s3",
      number: 3,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "A cyclone warning is active, and water has started coming in under the door.",
        correct: {
          label: "Move to a higher floor, away from windows, and tell an adult.",
          explanation: "Higher ground away from windows keeps you clear of both the water and flying debris.",
        },
        wrong: {
          label: "Step outside to check how deep the water is.",
          explanation: "Stepping outside during an active cyclone warning exposes you to flying debris.",
          hazardIcon: "🌪️",
        },
        mapOrientation: "vertical",
      },
    },
  ],
};

export const RANGERS_MODULE_6: TierModuleContent = {
  id: "rangers-m6",
  number: 6,
  name: "Multi-Hazard Drill: When Plans Change",
  type: "simulation",
  estMinutes: 7,
  icon: "⚠️",
  sections: [
    {
      id: "rangers-m6-s1",
      number: 1,
      title: "Why This Matters",
      estMinutes: 2,
      body: [
        "Sometimes one emergency leads to another — an earthquake might be followed by a gas smell, or a fire drill might overlap with a storm. This module trains you to stay alert even after the \"first\" danger seems over.",
      ],
    },
    {
      id: "rangers-m6-s2",
      number: 2,
      title: "Earthquake + Strange Smell",
      estMinutes: 3,
      body: [
        "If you smell gas after shaking stops: don't touch any light switches, don't use anything with a flame, and move away from the smell using a different route. Tell an adult right away.",
      ],
    },
    {
      id: "rangers-m6-s3",
      number: 3,
      title: "Decision Checkpoint",
      estMinutes: 2,
      body: [],
      checkpoint: {
        scenario: "Shaking just stopped. You smell something like gas near the exit. The alarm hasn't sounded yet.",
        correct: {
          label: "Avoid light switches, move away from the smell a different way, and alert a teacher immediately — don't wait for the alarm.",
          explanation: "A gas smell is reason enough to act right away, alarm or not — and switches can spark it.",
        },
        wrong: {
          label: "Flip the hallway light on to see better.",
          explanation: "A light switch can spark right next to a gas leak.",
          hazardIcon: "💡",
        },
      },
    },
  ],
};
