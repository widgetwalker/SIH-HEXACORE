import type { TierModuleContent } from "../types";

/* SafeZone — Explorers Tier (Ages 5–7).
   Content transcribed verbatim from safezone-explorers-rangers-modules.pdf.
   The PDF's "Try it: Thumbs Up or Thumbs Down" block at the end of each
   module isn't counted in the PDF's own per-module section total (it's a
   bonus quiz, not a numbered section there) - it's added here as one more
   numbered section so it can use the same DecisionCheckpoint mechanic every
   other tier already uses, collapsing the PDF's two example statements (one
   thumbs-up, one thumbs-down) into a single right/wrong choice between them,
   with the PDF's own verdict text kept as the explanation. No wording is
   invented; every phrase below is the PDF's own. */

export const EXPLORERS_MODULE_1: TierModuleContent = {
  id: "explorers-m1",
  number: 1,
  name: "Earthquake: Drop, Cover, Hold Tight!",
  type: "interactive",
  estMinutes: 5,
  icon: "🌍",
  sections: [
    {
      id: "explorers-m1-s1",
      number: 1,
      title: "When the Ground Shakes",
      estMinutes: 2,
      body: [
        "The floor is shaking! Toys and books might fall. This is scary, but you know exactly what to do.",
        "Drop — Get down low, like a turtle going into its shell.",
        "Cover — Crawl under your desk or table. Cover your head with your arms.",
        "Hold Tight — Hold on to the table leg so it stays with you.",
        "Stay there until the shaking stops. Don't run — running is how people get hurt.",
      ],
    },
    {
      id: "explorers-m1-s2",
      number: 2,
      title: "Waiting It Out",
      estMinutes: 2,
      body: [
        "Shaking can feel like a long time even when it's short. Keep holding on. Listen for your teacher or grown-up's voice — they will tell you what to do next.",
      ],
    },
    {
      id: "explorers-m1-s3",
      number: 3,
      title: "All Clear",
      estMinutes: 1,
      body: [
        "The shaking stopped! Stay calm and hold hands with your line/buddy. Walk — don't run — to where your teacher says to go.",
      ],
    },
    {
      id: "explorers-m1-s4",
      number: 4,
      title: "Try It: Thumbs Up or Thumbs Down",
      estMinutes: 1,
      body: [],
      checkpoint: {
        scenario: "The ground starts shaking. What do you do?",
        correct: {
          label: "When the ground shakes, I get under my desk and hold on.",
          explanation: "Right!",
        },
        wrong: {
          label: "When the ground shakes, I run to find my backpack.",
          explanation: "Wrong — drop, cover, and hold tight instead!",
          hazardIcon: "🎒",
        },
      },
    },
  ],
};

export const EXPLORERS_MODULE_2: TierModuleContent = {
  id: "explorers-m2",
  number: 2,
  name: "Fire Safety: Get Out and Stay Out!",
  type: "simulation",
  estMinutes: 5,
  icon: "🔥",
  sections: [
    {
      id: "explorers-m2-s1",
      number: 1,
      title: "The Alarm Sounds",
      estMinutes: 2,
      body: [
        "That loud beeping sound means one thing: line up and walk outside, calmly, with your class.",
      ],
    },
    {
      id: "explorers-m2-s2",
      number: 2,
      title: "Rules for Getting Out Safely",
      estMinutes: 2,
      body: [
        "Walk, don't run.",
        "Stay with your group.",
        "Leave your backpack and toys behind — they can be replaced, you can't.",
        "If you see smoke, get low and crawl.",
        "Never hide from a fire — always go toward the grown-ups and outside.",
      ],
    },
    {
      id: "explorers-m2-s3",
      number: 3,
      title: "Once You're Outside",
      estMinutes: 1,
      body: [
        "Go straight to your class's meeting spot. Stay there. Never go back inside for anything, even a favorite toy.",
      ],
    },
    {
      id: "explorers-m2-s4",
      number: 4,
      title: "Try It: Thumbs Up or Thumbs Down",
      estMinutes: 1,
      body: [],
      checkpoint: {
        scenario: "The alarm sounded and you're walking outside with your class.",
        correct: {
          label: "I walk outside calmly and stay with my class.",
          explanation: "Right!",
        },
        wrong: {
          label: "I go back inside to get my lunchbox.",
          explanation: "Wrong — never go back in!",
          hazardIcon: "🔥",
        },
      },
    },
  ],
};

export const EXPLORERS_MODULE_3: TierModuleContent = {
  id: "explorers-m3",
  number: 3,
  name: "Storm Safety: Find Your Safe Spot",
  type: "interactive",
  estMinutes: 5,
  icon: "🌊",
  sections: [
    {
      id: "explorers-m3-s1",
      number: 1,
      title: "Big Wind, Big Rain",
      estMinutes: 2,
      body: [
        "Some storms are strong enough to break windows or knock down branches. When a grown-up says \"storm safety,\" it's time to move away from windows.",
      ],
    },
    {
      id: "explorers-m3-s2",
      number: 2,
      title: "Your Safe Spot",
      estMinutes: 2,
      body: [
        "A safe spot is an inside room with no windows — like a hallway or bathroom. Sit low, cover your head with your arms, and stay away from glass.",
      ],
    },
    {
      id: "explorers-m3-s3",
      number: 3,
      title: "Staying Put",
      estMinutes: 1,
      body: [
        "Stay in your safe spot until a grown-up says it's okay to come out. Storms can seem finished and then come back.",
      ],
    },
    {
      id: "explorers-m3-s4",
      number: 4,
      title: "Try It: Thumbs Up or Thumbs Down",
      estMinutes: 1,
      body: [],
      checkpoint: {
        scenario: "A storm is happening outside your window.",
        correct: {
          label: "I sit in my safe spot with my arms over my head.",
          explanation: "Right!",
        },
        wrong: {
          label: "I look out the window to watch the storm.",
          explanation: "Wrong — stay away from windows!",
          hazardIcon: "🌪️",
        },
      },
    },
  ],
};

export const EXPLORERS_MODULE_4: TierModuleContent = {
  id: "explorers-m4",
  number: 4,
  name: "After It's Over: Find Your Grown-Up",
  type: "interactive",
  estMinutes: 4,
  icon: "🧑‍🤝‍🧑",
  sections: [
    {
      id: "explorers-m4-s1",
      number: 1,
      title: "Everyone Has a Job",
      estMinutes: 2,
      body: [
        "After an earthquake, fire, or storm, everyone meets at one spot. Your job is simple: stay with your class and your teacher.",
      ],
    },
    {
      id: "explorers-m4-s2",
      number: 2,
      title: "Finding Family",
      estMinutes: 2,
      body: [
        "Your grown-up knows where to find you — at your class's meeting spot. Don't go looking for them on your own. Stay put, stay calm, and wait.",
      ],
    },
    {
      id: "explorers-m4-s3",
      number: 3,
      title: "Try It: Thumbs Up or Thumbs Down",
      estMinutes: 1,
      body: [],
      checkpoint: {
        scenario: "The emergency is over and everyone is at the meeting spot.",
        correct: {
          label: "I wait at my class spot for my grown-up to find me.",
          explanation: "Right!",
        },
        wrong: {
          label: "I walk around the parking lot looking for my mom.",
          explanation: "Wrong — always stay with your teacher!",
          hazardIcon: "❓",
        },
      },
    },
  ],
};
