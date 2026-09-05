import type { TierModuleContent } from "../types";

/* SafeZone — Explorers Tier (Ages 5–7).
   Content transcribed from safezone-explorers-rangers-modules.pdf. Per that
   PDF's own format note for this age band, checkpoints stay a single
   "Thumbs Up or Thumbs Down" choice per hazard — no multi-branch floor logic
   — so each module's "Try it" moment is attached as the checkpoint on its
   final section rather than a separate numbered section. */
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
        "Shaking can feel like a long time even when it's short. Keep holding on.",
        "Listen for your teacher or grown-up's voice — they will tell you what to do next.",
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
      checkpoint: {
        scenario: "When the ground shakes, what should you do?",
        correct: {
          label: "I get under my desk and hold on.",
          explanation: "Getting under sturdy cover and holding on keeps you safe from falling things until the shaking stops.",
        },
        wrong: {
          label: "I run to find my backpack.",
          explanation: "Running while the ground is shaking is how people get hurt — drop, cover, and hold tight instead.",
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
      checkpoint: {
        scenario: "What do you do once you're outside?",
        correct: {
          label: "I walk outside calmly and stay with my class.",
          explanation: "Your meeting spot is where your teacher and grown-up know to find you — staying put keeps everyone accounted for.",
        },
        wrong: {
          label: "I go back inside to get my lunchbox.",
          explanation: "Never go back inside during a fire, even for something you love — it can always be replaced, you can't.",
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
  icon: "🌪️",
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
      checkpoint: {
        scenario: "What do you do during a storm?",
        correct: {
          label: "I sit in my safe spot with my arms over my head.",
          explanation: "Sitting low, away from windows, with your head covered protects you from flying glass and debris.",
        },
        wrong: {
          label: "I look out the window to watch the storm.",
          explanation: "Windows can break in a strong storm — staying away from them is the whole point of a safe spot.",
          hazardIcon: "🪟",
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
  icon: "👪",
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
      checkpoint: {
        scenario: "How do you find your grown-up after an emergency?",
        correct: {
          label: "I wait at my class spot for my grown-up to find me.",
          explanation: "Your grown-up already knows to look for you at the class meeting spot — staying put is what makes that plan work.",
        },
        wrong: {
          label: "I walk around the parking lot looking for my mom.",
          explanation: "Wandering off to search makes you harder to find, not easier — always stay with your teacher.",
        },
      },
    },
  ],
};
